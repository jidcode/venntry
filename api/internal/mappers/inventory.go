package mappers

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/venntry/internal/models"
)

func ToCreateInventory(req *models.InventoryRequest, userId uuid.UUID) *models.Inventory {
	return &models.Inventory{
		Id:        uuid.New(),
		Name:      req.Name,
		UserId:    userId,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

func ToEditInventory(req *models.InventoryRequest, existing *models.Inventory) *models.Inventory {
	existing.Name = req.Name
	existing.UpdatedAt = time.Now()

	return existing
}

func ToInventoryResponse(inv *models.Inventory) *models.InventoryResponse {
	return &models.InventoryResponse{
		Id:        inv.Id,
		Name:      inv.Name,
		UserId:    inv.UserId,
		CreatedAt: inv.CreatedAt,
		UpdatedAt: inv.UpdatedAt,
	}
}

func SanitizeInventoryRequest(req *models.InventoryRequest) {
	req.Name = strings.TrimSpace(req.Name)
}
