package mappers

import (
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/venntry/internal/models"
)

func ToCreateWarehouse(req *models.WarehouseRequest, inventoryID uuid.UUID) *models.Warehouse {
	return &models.Warehouse{
		ID:          uuid.New(),
		Name:        req.Name,
		Location:    req.Location,
		Capacity:    req.Capacity,
		InventoryID: inventoryID,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
}

func ToUpdateWarehouse(req *models.WarehouseRequest, existing *models.Warehouse) *models.Warehouse {
	return &models.Warehouse{
		ID:          existing.ID,
		Name:        req.Name,
		Location:    req.Location,
		Capacity:    req.Capacity,
		InventoryID: existing.InventoryID,
		CreatedAt:   existing.CreatedAt,
		UpdatedAt:   time.Now(),
	}
}

func ToWarehouseResponse(warehouse *models.Warehouse) *models.WarehouseResponse {
	response := &models.WarehouseResponse{
		ID:        warehouse.ID,
		Name:      warehouse.Name,
		Location:  warehouse.Location,
		Capacity:  warehouse.Capacity,
		CreatedAt: warehouse.CreatedAt,
		UpdatedAt: warehouse.UpdatedAt,
	}

	// Map products if they exist
	if len(warehouse.Products) > 0 {
		response.Products = make([]models.ProductResponse, len(warehouse.Products))
		for i, product := range warehouse.Products {
			// Re-use existing product mapper to convert Product to ProductResponse
			response.Products[i] = *ToProductResponse(&product)
		}
	}

	return response
}

func SanitizeWarehouseRequest(req *models.WarehouseRequest) {
	req.Name = strings.TrimSpace(req.Name)

	if req.Location != nil {
		trimmed := strings.TrimSpace(*req.Location)
		if trimmed == "" {
			req.Location = nil
		} else {
			req.Location = &trimmed
		}
	}
}
