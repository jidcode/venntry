package warehouses

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/mappers"
	"github.com/venntry/internal/models"
	"github.com/venntry/internal/shared/utils"
	"github.com/venntry/pkg/errors"
	"github.com/venntry/pkg/logger"
)

type WarehouseController struct {
	repo      IWarehouseRepository
	validator *WarehouseValidator
}

func NewWarehouseController(repo IWarehouseRepository, validator *WarehouseValidator) IWarehouseController {
	return &WarehouseController{
		repo:      repo,
		validator: validator,
	}
}

func (wc *WarehouseController) ListWarehouses(ctx echo.Context) error {
	inventoryID, err := uuid.Parse(ctx.Param("inventoryId"))
	if err != nil {
		return errors.ValidationError("Invalid inventory ID")
	}

	warehouses, err := wc.repo.ListWarehouses(inventoryID)
	if err != nil {
		return logger.Error(ctx, "Failed to fetch warehouses", err,
			logger.Field("inventory_id", inventoryID),
		)
	}

	response := make([]models.WarehouseResponse, len(warehouses))
	for i, warehouse := range warehouses {
		response[i] = *mappers.ToWarehouseResponse(&warehouse)
	}

	return ctx.JSON(http.StatusOK, response)
}

func (wc *WarehouseController) GetWarehouse(ctx echo.Context) error {
	warehouseID, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return errors.ValidationError("Invalid warehouse ID")
	}

	warehouse, err := wc.repo.GetWarehouseWithProducts(warehouseID)
	if err != nil {
		return logger.Error(ctx, "Failed to retrieve warehouse", err,
			logger.Field("warehouse_id", warehouseID),
		)
	}

	response := mappers.ToWarehouseResponse(&warehouse)
	return ctx.JSON(http.StatusOK, response)
}

func (wc *WarehouseController) CreateWarehouse(ctx echo.Context) error {
	inventoryID, err := uuid.Parse(ctx.Param("inventoryId"))
	if err != nil {
		return errors.ValidationError("Invalid inventory ID")
	}

	var req models.WarehouseRequest
	if err := utils.BindAndValidateRequest(ctx, &req); err != nil {
		return err
	}

	mappers.SanitizeWarehouseRequest(&req)

	newWarehouse := mappers.ToCreateWarehouse(&req, inventoryID)
	if err := wc.validator.ValidateWarehouse(newWarehouse); err != nil {
		return err
	}

	if err := wc.repo.CreateWarehouse(newWarehouse); err != nil {
		return logger.Error(ctx, "Failed to create warehouse", err,
			logger.Field("warehouse_name", newWarehouse.Name),
		)
	}

	response := mappers.ToWarehouseResponse(newWarehouse)
	return ctx.JSON(http.StatusCreated, response)
}

func (wc *WarehouseController) UpdateWarehouse(ctx echo.Context) error {
	warehouseID, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return errors.ValidationError("Invalid warehouse ID")
	}

	var req models.WarehouseRequest
	if err := utils.BindAndValidateRequest(ctx, &req); err != nil {
		return err
	}

	mappers.SanitizeWarehouseRequest(&req)

	existingWarehouse, err := wc.repo.GetWarehouse(warehouseID)
	if err != nil {
		return logger.Error(ctx, "Warehouse not found", err,
			logger.Field("warehouse_id", warehouseID),
		)
	}

	updatedWarehouse := mappers.ToUpdateWarehouse(&req, &existingWarehouse)
	if err := wc.validator.ValidateWarehouse(updatedWarehouse); err != nil {
		return err
	}

	if err := wc.repo.UpdateWarehouse(updatedWarehouse); err != nil {
		return logger.Error(ctx, "Failed to update warehouse", err,
			logger.Field("warehouse_id", warehouseID),
		)
	}

	response := mappers.ToWarehouseResponse(updatedWarehouse)
	return ctx.JSON(http.StatusOK, response)
}

func (wc *WarehouseController) DeleteWarehouse(ctx echo.Context) error {
	warehouseID, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return errors.ValidationError("Invalid warehouse ID")
	}

	if err := wc.repo.DeleteWarehouse(warehouseID); err != nil {
		return logger.Error(ctx, "Failed to delete warehouse", err,
			logger.Field("warehouse_id", warehouseID),
		)
	}

	return ctx.NoContent(http.StatusNoContent)
}
