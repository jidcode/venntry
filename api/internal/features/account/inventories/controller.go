package inventories

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

type Controller struct {
	repo IInventoryRepository
}

func NewController(inventoriesRepo IInventoryRepository) *Controller {
	return &Controller{repo: inventoriesRepo}
}

func (ctrl Controller) ListInventories(ctx echo.Context) error {
	user, ok := ctx.Get("user").(*models.User)
	if !ok {
		return errors.New(errors.Unauthorized, "User not authenticated", http.StatusUnauthorized)
	}

	inventories, err := ctrl.repo.ListInventories(user.Id)
	if err != nil {
		return logger.Error(ctx, "Failed to fetch inventories", err,
			logger.Field("user_id", user.Id),
		)
	}

	response := make([]models.InventoryResponse, len(inventories))
	for i, inv := range inventories {
		response[i] = *mappers.ToInventoryResponse(&inv)
	}

	return ctx.JSON(http.StatusOK, response)
}

func (ctrl Controller) GetInventory(ctx echo.Context) error {
	inventoryId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return errors.ValidationError("Invalid inventory ID")
	}

	inventory, err := ctrl.repo.GetInventory(inventoryId)
	if err != nil {
		return logger.Error(ctx, "Failed to retrieve inventory", err,
			logger.Field("inventory_id", inventoryId),
		)
	}

	response := mappers.ToInventoryResponse(&inventory)

	return ctx.JSON(http.StatusOK, response)
}

func (ctrl Controller) CreateInventory(ctx echo.Context) error {
	user, ok := ctx.Get("user").(*models.User)
	if !ok {
		return errors.New(errors.Unauthorized, "User not authenticated", http.StatusUnauthorized)
	}

	var req models.InventoryRequest
	if err := utils.BindAndValidateRequest(ctx, &req); err != nil {
		return err
	}

	mappers.SanitizeInventoryRequest(&req)
	newInventory := mappers.ToCreateInventory(&req, user.Id)

	if err := ctrl.repo.CreateInventory(newInventory); err != nil {
		return logger.Error(ctx, "Failed to create inventory", err,
			logger.Field("inventory_name", newInventory.Name),
		)
	}

	response := mappers.ToInventoryResponse(newInventory)

	return ctx.JSON(http.StatusCreated, response)
}

func (ctrl Controller) UpdateInventory(ctx echo.Context) error {
	inventoryId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return errors.ValidationError("Invalid inventory ID")
	}

	var req models.InventoryRequest
	if err := utils.BindAndValidateRequest(ctx, &req); err != nil {
		return err
	}

	mappers.SanitizeInventoryRequest(&req)

	existingInventory, err := ctrl.repo.GetInventory(inventoryId)
	if err != nil {
		return logger.Error(ctx, "Inventory not found", err,
			logger.Field("inventory_id", inventoryId),
		)
	}

	updatedInventory := mappers.ToEditInventory(&req, &existingInventory)
	if err := ctrl.repo.UpdateInventory(updatedInventory); err != nil {
		return logger.Error(ctx, "Failed to update inventory", err,
			logger.Field("inventory_id", inventoryId),
		)
	}

	response := mappers.ToInventoryResponse(updatedInventory)

	return ctx.JSON(http.StatusOK, response)
}

func (ctrl Controller) DeleteInventory(ctx echo.Context) error {
	inventoryId, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		return errors.ValidationError("Invalid inventory ID")
	}

	err = ctrl.repo.DeleteInventory(inventoryId)
	if err != nil {
		return logger.Error(ctx, "Failed to delete inventory", err,
			logger.Field("inventory_id", inventoryId),
		)
	}

	return ctx.NoContent(http.StatusNoContent)
}
