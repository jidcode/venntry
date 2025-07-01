package warehouses

import (
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/models"
)

type IWarehouseRepository interface {
	ListWarehouses(inventoryID uuid.UUID) ([]models.Warehouse, error)
	GetWarehouse(warehouseID uuid.UUID) (models.Warehouse, error)
	GetWarehouseWithProducts(warehouseID uuid.UUID) (models.Warehouse, error)
	CreateWarehouse(warehouse *models.Warehouse) error
	UpdateWarehouse(warehouse *models.Warehouse) error
	DeleteWarehouse(warehouseID uuid.UUID) error
}

type IWarehouseController interface {
	ListWarehouses(ctx echo.Context) error
	GetWarehouse(ctx echo.Context) error
	CreateWarehouse(ctx echo.Context) error
	UpdateWarehouse(ctx echo.Context) error
	DeleteWarehouse(ctx echo.Context) error
}
