package warehouses

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

type WarehouseRepository struct {
	db    *sqlx.DB
	cache cache.IRedisService
}

func NewWarehouseRepository(db *sqlx.DB, cache cache.IRedisService) IWarehouseRepository {
	return &WarehouseRepository{db: db, cache: cache}
}

func warehouseCacheKey(ID uuid.UUID) string {
	return "warehouse:" + ID.String()
}

func warehouseListCacheKey(inventoryID uuid.UUID) string {
	return "warehouse_list:" + inventoryID.String()
}

func (wr *WarehouseRepository) ListWarehouses(inventoryID uuid.UUID) ([]models.Warehouse, error) {
	key := warehouseListCacheKey(inventoryID)

	var cachedWarehouses []models.Warehouse
	if err := wr.cache.Get(key, &cachedWarehouses); err == nil {
		return cachedWarehouses, nil
	}

	query := `SELECT * FROM warehouses WHERE inventory_id = $1 ORDER BY created_at DESC`
	warehouses := []models.Warehouse{}

	err := wr.db.Select(&warehouses, query, inventoryID)
	if err != nil {
		return nil, errors.DatabaseError(err, "Error fetching warehouses")
	}

	if err := wr.cache.Set(key, warehouses, TTL); err != nil {
		return warehouses, errors.CacheError(err, "Error caching warehouses")
	}

	return warehouses, nil
}

func (wr *WarehouseRepository) GetWarehouse(warehouseID uuid.UUID) (models.Warehouse, error) {
	key := warehouseCacheKey(warehouseID)

	var cachedWarehouse models.Warehouse
	if err := wr.cache.Get(key, &cachedWarehouse); err == nil {
		return cachedWarehouse, nil
	}

	var warehouse models.Warehouse
	query := `SELECT * FROM warehouses WHERE id = $1`

	err := wr.db.Get(&warehouse, query, warehouseID)
	if err != nil {
		if err == sql.ErrNoRows {
			return warehouse, errors.NotFoundError("Warehouse not found")
		}
		return warehouse, errors.DatabaseError(err, "Error getting warehouse by ID")
	}

	if err := wr.cache.Set(key, warehouse, TTL); err != nil {
		return warehouse, errors.CacheError(err, "Error caching warehouse")
	}

	return warehouse, nil
}

func (wr *WarehouseRepository) GetWarehouseWithProducts(warehouseID uuid.UUID) (models.Warehouse, error) {
	warehouse, err := wr.GetWarehouse(warehouseID)
	if err != nil {
		return warehouse, err
	}

	var products []models.Product
	query := `
		SELECT p.* FROM products p
		INNER JOIN warehouse_product_map wp ON p.id = wp.product_id
		WHERE wp.warehouse_id = $1
		ORDER BY p.name ASC
	`
	err = wr.db.Select(&products, query, warehouseID)
	if err != nil {
		return warehouse, errors.DatabaseError(err, "Error fetching products for warehouse")
	}
	warehouse.Products = products

	return warehouse, nil
}

func (wr *WarehouseRepository) CreateWarehouse(warehouse *models.Warehouse) error {
	query := `
		INSERT INTO warehouses (
			id, name, location, capacity, inventory_id, created_at, updated_at
		) VALUES (
			:id, :name, :location, :capacity, :inventory_id, :created_at, :updated_at
		)
	`
	_, err := wr.db.NamedExec(query, warehouse)
	if err != nil {
		return errors.DatabaseError(err, "Error creating warehouse")
	}

	wr.invalidateWarehouseCaches(warehouse.ID, warehouse.InventoryID)

	return nil
}

func (wr *WarehouseRepository) UpdateWarehouse(warehouse *models.Warehouse) error {
	query := `
		UPDATE warehouses SET 
			name = :name,
			location = :location,
			capacity = :capacity,
			updated_at = :updated_at
		WHERE id = :id
	`
	_, err := wr.db.NamedExec(query, warehouse)
	if err != nil {
		return errors.DatabaseError(err, "Error updating warehouse")
	}

	wr.invalidateWarehouseCaches(warehouse.ID, warehouse.InventoryID)

	return nil
}

func (wr *WarehouseRepository) DeleteWarehouse(warehouseID uuid.UUID) error {
	warehouse, err := wr.GetWarehouse(warehouseID)
	if err != nil {
		return err
	}

	query := `DELETE FROM warehouses WHERE id = $1`
	_, err = wr.db.Exec(query, warehouseID)
	if err != nil {
		return errors.DatabaseError(err, "Error deleting warehouse")
	}

	wr.invalidateWarehouseCaches(warehouseID, warehouse.InventoryID)

	return nil
}

func (wr *WarehouseRepository) invalidateWarehouseCaches(warehouseID, inventoryID uuid.UUID) {
	wr.cache.Delete(warehouseCacheKey(warehouseID))
	wr.cache.Delete(warehouseListCacheKey(inventoryID))
}
