package products

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/venntry/internal/models"
	"github.com/venntry/pkg/errors"
)

// Helper methods
func (pr *ProductRepository) getProductImages(productID uuid.UUID) ([]models.Image, error) {
	var images []models.Image
	query := `SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, created_at ASC`

	err := pr.db.Select(&images, query, productID)
	if err != nil {
		return images, errors.DatabaseError(err, "Error fetching product images")
	}

	return images, nil
}

func (pr *ProductRepository) getProductCategories(productID uuid.UUID) ([]models.Category, error) {
	var categories []models.Category
	query := `
	SELECT c.* FROM product_categories c
	JOIN product_category_map pcm ON c.id = pcm.category_id
	WHERE pcm.product_id = $1
	ORDER BY c.name ASC
`
	err := pr.db.Select(&categories, query, productID)
	if err != nil {
		return categories, errors.DatabaseError(err, "Error fetching product categories")
	}

	return categories, nil
}

func (pr *ProductRepository) getProductWarehouses(productId uuid.UUID) ([]models.Warehouse, error) {
	query := `
		SELECT w.* FROM warehouses w
		INNER JOIN warehouse_product_map wp ON w.id = wp.warehouse_id
		WHERE wp.product_id = $1
		ORDER BY w.name ASC
	`
	var warehouses []models.Warehouse
	if err := pr.db.Select(&warehouses, query, productId); err != nil {
		return nil, errors.DatabaseError(err, "Error fetching product warehouses")
	}
	return warehouses, nil
}

func (pr *ProductRepository) createProductImages(tx *sqlx.Tx, productID uuid.UUID, images []models.ImageRequest) error {
	for i, img := range images {
		query := `
			INSERT INTO product_images (
				id, url, file_key, product_id, is_primary, created_at, updated_at
			) VALUES ($1, $2, $3, $4, $5, $6, $7)
		`
		_, err := tx.Exec(query,
			uuid.New(),
			img.URL,
			img.FileKey,
			productID,
			i == 0, // First image is primary
			time.Now(),
			time.Now(),
		)

		if err != nil {
			return errors.DatabaseError(err, "Error creating product image")
		}
	}
	return nil
}

func (pr *ProductRepository) linkProductCategories(tx *sqlx.Tx, productID, inventoryID uuid.UUID, categoryNames []string) error {
	for _, name := range categoryNames {
		// Find or create category
		var categoryID uuid.UUID

		err := tx.Get(&categoryID, "SELECT id FROM product_categories WHERE name = $1 AND inventory_id = $2", name, inventoryID)
		if err == sql.ErrNoRows {
			categoryID = uuid.New()
			_, err = tx.Exec(`
				INSERT INTO product_categories (id, name, inventory_id, created_at, updated_at)
				VALUES ($1, $2, $3, $4, $5)
			`, categoryID, name, inventoryID, time.Now(), time.Now())
			if err != nil {
				return errors.DatabaseError(err, "Error creating category")
			}
		} else if err != nil {
			return errors.DatabaseError(err, "Error finding category")
		}

		// Link to product
		_, err = tx.Exec(`
			INSERT INTO product_category_map (product_id, category_id, created_at)
			VALUES ($1, $2, $3)
		`, productID, categoryID, time.Now())
		if err != nil {
			return errors.DatabaseError(err, "Error linking product to category")
		}
	}
	return nil
}

func (pr *ProductRepository) linkProductWarehouses(tx *sqlx.Tx, productID uuid.UUID, warehouseIDs []uuid.UUID) error {
	for _, warehouseID := range warehouseIDs {
		_, err := tx.Exec(`
            INSERT INTO warehouse_product_map (product_id, warehouse_id, quantity, created_at)
            VALUES ($1, $2, $3, $4)
        `, productID, warehouseID, 0, time.Now())
		if err != nil {
			return errors.DatabaseError(err, "Error linking product to warehouse")
		}
	}

	return nil
}

func (pr *ProductRepository) clearProductRelations(tx *sqlx.Tx, productID uuid.UUID) error {
	_, err := tx.Exec("DELETE FROM product_images WHERE product_id = $1", productID)
	if err != nil {
		return errors.DatabaseError(err, "Error clearing product images")
	}

	_, err = tx.Exec("DELETE FROM product_category_map WHERE product_id = $1", productID)
	if err != nil {
		return errors.DatabaseError(err, "Error clearing product categories")
	}

	_, err = tx.Exec("DELETE FROM warehouse_product_map WHERE product_id = $1", productID)
	if err != nil {
		return errors.DatabaseError(err, "Error clearing product warehouses")
	}

	return nil
}

func (pr *ProductRepository) UpdateProductWarehouseQuantity(productID, warehouseID uuid.UUID, quantity int) error {
	_, err := pr.db.Exec(`
        UPDATE warehouse_product_map 
        SET quantity = $1 
        WHERE product_id = $2 AND warehouse_id = $3
    `, quantity, productID, warehouseID)

	if err != nil {
		return errors.DatabaseError(err, "Error updating product quantity in warehouse")
	}

	// Invalidate relevant caches
	pr.cache.Delete(productCacheKey(productID))
	return nil
}

func (pr *ProductRepository) invalidateProductCaches(productID, inventoryID uuid.UUID) {
	pr.cache.Delete(productCacheKey(productID))
	pr.cache.Delete(productListCacheKey(inventoryID))
	pr.cache.Delete(categoryListCacheKey(inventoryID))
}
