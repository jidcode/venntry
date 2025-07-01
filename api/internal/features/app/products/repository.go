package products

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/venntry/internal/models"
	"github.com/venntry/pkg/cache"
	"github.com/venntry/pkg/errors"
)

const (
	TTL = 7 * 24 * time.Hour
)

type ProductRepository struct {
	db    *sqlx.DB
	cache cache.IRedisService
}

func NewProductRepository(db *sqlx.DB, cache cache.IRedisService) IProductRepository {
	return &ProductRepository{db: db, cache: cache}
}

func productCacheKey(id uuid.UUID) string {
	return "product:" + id.String()
}

func productListCacheKey(inventoryID uuid.UUID) string {
	return "products:" + inventoryID.String()
}

func categoryListCacheKey(inventoryID uuid.UUID) string {
	return "categories:" + inventoryID.String()
}

func (pr *ProductRepository) ListProducts(inventoryID uuid.UUID) ([]models.Product, error) {
	key := productListCacheKey(inventoryID)

	var cachedProducts []models.Product
	if err := pr.cache.Get(key, &cachedProducts); err == nil {
		return cachedProducts, nil
	}

	query := `SELECT * FROM products WHERE inventory_id = $1 ORDER BY created_at DESC`
	products := []models.Product{}

	err := pr.db.Select(&products, query, inventoryID)
	if err != nil {
		return nil, errors.DatabaseError(err, "Error fetching products")
	}

	if err := pr.cache.Set(key, products, TTL); err != nil {
		return products, errors.CacheError(err, "Error caching products")
	}

	return products, nil
}

func (pr *ProductRepository) ListProductCategories(inventoryID uuid.UUID) ([]models.Category, error) {
	key := categoryListCacheKey(inventoryID)

	var cachedCategories []models.Category
	if err := pr.cache.Get(key, &cachedCategories); err == nil {
		return cachedCategories, nil
	}

	query := `SELECT * FROM product_categories WHERE inventory_id = $1 ORDER BY name ASC`
	categories := []models.Category{}

	err := pr.db.Select(&categories, query, inventoryID)
	if err != nil {
		return nil, errors.DatabaseError(err, "Error fetching categories")
	}

	if err := pr.cache.Set(key, categories, TTL); err != nil {
		return categories, errors.CacheError(err, "Error caching categories")
	}

	return categories, nil
}

func (pr *ProductRepository) GetProduct(productID uuid.UUID) (models.Product, error) {
	key := productCacheKey(productID)

	var cachedProduct models.Product
	if err := pr.cache.Get(key, &cachedProduct); err == nil {
		return cachedProduct, nil
	}

	var product models.Product
	query := `SELECT * FROM products WHERE id = $1`

	err := pr.db.Get(&product, query, productID)
	if err != nil {
		if err == sql.ErrNoRows {
			return product, errors.NotFoundError("Product not found")
		}
		return product, errors.DatabaseError(err, "Error getting product")
	}

	if err := pr.cache.Set(key, product, TTL); err != nil {
		return product, errors.CacheError(err, "Error caching product")
	}

	return product, nil
}

func (pr *ProductRepository) GetProductWithRelations(productID uuid.UUID) (models.Product, error) {
	product, err := pr.GetProduct(productID)
	if err != nil {
		return product, err
	}

	// Get product images
	images, err := pr.getProductImages(productID)
	if err != nil {
		return product, err
	}
	product.Images = images

	// Get product categories
	categories, err := pr.getProductCategories(productID)
	if err != nil {
		return product, err
	}
	product.Categories = categories

	// Get product warehouses
	warehouses, err := pr.getProductWarehouses(productID)
	if err != nil {
		return product, err
	}
	product.Warehouses = warehouses

	return product, nil
}

func (pr *ProductRepository) CreateProduct(product *models.Product, categoryNames []string, images []models.ImageRequest, warehouseIDs []uuid.UUID) error {
	tx, err := pr.db.Beginx()
	if err != nil {
		return errors.DatabaseError(err, "Error starting transaction")
	}
	defer tx.Rollback()

	query := `
		INSERT INTO products (
			id, name, sku, code, brand, model, description, quantity,
			restock_level, optimal_level, cost, price, inventory_id,
			created_at, updated_at
		) VALUES (
			:id, :name, :sku, :code, :brand, :model, :description, :quantity,
			:restock_level, :optimal_level, :cost, :price, :inventory_id,
			:created_at, :updated_at
		)
	`
	_, err = tx.NamedExec(query, product)
	if err != nil {
		return errors.DatabaseError(err, "Error creating product")
	}

	// Handle product images
	if err := pr.createProductImages(tx, product.ID, images); err != nil {
		return err
	}

	// Handle product categories
	if err := pr.linkProductCategories(tx, product.ID, product.InventoryID, categoryNames); err != nil {
		return err
	}

	// Handle product warehouses
	if err := pr.linkProductWarehouses(tx, product.ID, warehouseIDs); err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return errors.DatabaseError(err, "Error committing transaction")
	}

	pr.invalidateProductCaches(product.ID, product.InventoryID)

	return nil
}

func (pr *ProductRepository) UpdateProduct(product *models.Product, categoryNames []string, images []models.ImageRequest, warehouseIDs []uuid.UUID) error {
	tx, err := pr.db.Beginx()
	if err != nil {
		return errors.DatabaseError(err, "Error starting transaction")
	}
	defer tx.Rollback()

	query := `
		UPDATE products SET
			name = :name, sku = :sku, code = :code, brand = :brand,
			model = :model, description = :description, quantity = :quantity,
			restock_level = :restock_level, optimal_level = :optimal_level,
			cost = :cost, price = :price, updated_at = :updated_at
		WHERE id = :id
	`
	_, err = tx.NamedExec(query, product)
	if err != nil {
		return errors.DatabaseError(err, "Error updating product")
	}

	// Clear existing relations
	if err := pr.clearProductRelations(tx, product.ID); err != nil {
		return err
	}

	// Recreate relations
	if err := pr.createProductImages(tx, product.ID, images); err != nil {
		return err
	}

	if err := pr.linkProductCategories(tx, product.ID, product.InventoryID, categoryNames); err != nil {
		return err
	}

	if err := pr.linkProductWarehouses(tx, product.ID, warehouseIDs); err != nil {
		return err
	}

	if err = tx.Commit(); err != nil {
		return errors.DatabaseError(err, "Error committing transaction")
	}

	pr.invalidateProductCaches(product.ID, product.InventoryID)

	return nil
}

func (pr *ProductRepository) DeleteProduct(productID uuid.UUID) error {
	product, err := pr.GetProduct(productID)
	if err != nil {
		return err
	}

	query := `DELETE FROM products WHERE id = $1`
	_, err = pr.db.Exec(query, productID)
	if err != nil {
		return errors.DatabaseError(err, "Error deleting product")
	}

	pr.invalidateProductCaches(productID, product.InventoryID)

	return nil
}
