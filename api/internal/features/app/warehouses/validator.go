package warehouses

import (
	"database/sql"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/venntry/internal/models"
	"github.com/venntry/pkg/errors"
)

type WarehouseValidator struct {
	db *sqlx.DB
}

func NewWarehouseValidator(db *sqlx.DB) *WarehouseValidator {
	return &WarehouseValidator{db: db}
}

func (wv *WarehouseValidator) ValidateWarehouse(warehouse *models.Warehouse) error {
	var errorMessages []string

	// Name uniqueness check
	exists, err := wv.warehouseExists(warehouse.Name, warehouse.InventoryID, warehouse.ID)
	if err != nil {
		return errors.DatabaseError(err, "Error validating warehouse")
	}

	if exists {
		errorMessages = append(errorMessages, "Warehouse name already exists")
	}

	if len(errorMessages) > 0 {
		return errors.ValidationError(strings.Join(errorMessages, "; "))
	}

	return nil
}

func (wv *WarehouseValidator) warehouseExists(warehouseName string, inventoryID, warehouseID uuid.UUID) (bool, error) {
	const query = `
		SELECT EXISTS(
			SELECT 1 FROM warehouses 
			WHERE name = $1 AND inventory_id = $2 AND id != $3
		)`

	var exists bool
	err := wv.db.Get(&exists, query, warehouseName, inventoryID, warehouseID)
	if err != nil && err != sql.ErrNoRows {
		return false, err
	}
	return exists, nil
}
