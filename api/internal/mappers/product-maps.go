package mappers

import (
	"math"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/venntry/internal/models"
)

// Convert float64 to cents (int)
func convertToCents(value float64) int {
	return int(math.Round(value * 100))
}

func ToCreateProduct(req *models.ProductRequest, inventoryID uuid.UUID) *models.Product {
	now := time.Now()
	return &models.Product{
		ID:           uuid.New(),
		Name:         req.Name,
		SKU:          req.SKU,
		Code:         req.Code,
		Brand:        req.Brand,
		Model:        req.Model,
		Description:  req.Description,
		Quantity:     req.Quantity,
		RestockLevel: req.RestockLevel,
		OptimalLevel: req.OptimalLevel,
		Cost:         convertToCents(req.Cost),
		Price:        convertToCents(req.Price),
		InventoryID:  inventoryID,
		CreatedAt:    now,
		UpdatedAt:    now,
	}
}

func ToUpdateProduct(req *models.ProductRequest, existing *models.Product) *models.Product {
	return &models.Product{
		ID:           existing.ID,
		Name:         req.Name,
		SKU:          req.SKU,
		Code:         req.Code,
		Brand:        req.Brand,
		Model:        req.Model,
		Description:  req.Description,
		Quantity:     req.Quantity,
		RestockLevel: req.RestockLevel,
		OptimalLevel: req.OptimalLevel,
		Cost:         convertToCents(req.Cost),
		Price:        convertToCents(req.Price),
		InventoryID:  existing.InventoryID,
		CreatedAt:    existing.CreatedAt,
		UpdatedAt:    time.Now(),
		Images:       existing.Images,
		Categories:   existing.Categories,
		Warehouses:   existing.Warehouses,
	}
}

func ToProductResponse(product *models.Product) *models.ProductResponse {
	response := &models.ProductResponse{
		ID:           product.ID,
		Name:         product.Name,
		SKU:          product.SKU,
		Code:         product.Code,
		Brand:        product.Brand,
		Model:        product.Model,
		Description:  product.Description,
		Quantity:     product.Quantity,
		RestockLevel: product.RestockLevel,
		OptimalLevel: product.OptimalLevel,
		Cost:         float64(product.Cost),
		Price:        float64(product.Price),
		CreatedAt:    product.CreatedAt,
		UpdatedAt:    product.UpdatedAt,
	}

	// Map images
	if len(product.Images) > 0 {
		response.Images = make([]models.ImageResponse, len(product.Images))
		for i, img := range product.Images {
			response.Images[i] = models.ImageResponse{
				ID:        img.ID,
				URL:       img.URL,
				FileKey:   img.FileKey,
				IsPrimary: img.IsPrimary,
				CreatedAt: img.CreatedAt,
				UpdatedAt: img.UpdatedAt,
			}
		}
	}

	// Map categories
	if len(product.Categories) > 0 {
		response.Categories = make([]models.CategoryResponse, len(product.Categories))
		for i, cat := range product.Categories {
			response.Categories[i] = models.CategoryResponse{
				Id:        cat.ID,
				Name:      cat.Name,
				CreatedAt: cat.CreatedAt,
				UpdatedAt: cat.UpdatedAt,
			}
		}
	}

	// Map warehouses
	if len(product.Warehouses) > 0 {
		response.Warehouses = make([]models.WarehouseResponse, len(product.Warehouses))
		for i, warehouse := range product.Warehouses {
			response.Warehouses[i] = models.WarehouseResponse{
				ID:        warehouse.ID,
				Name:      warehouse.Name,
				Location:  warehouse.Location,
				Capacity:  warehouse.Capacity,
				CreatedAt: warehouse.CreatedAt,
				UpdatedAt: warehouse.UpdatedAt,
			}
		}
	}

	return response
}

func ToCategoryResponse(category *models.Category) *models.CategoryResponse {
	return &models.CategoryResponse{
		Id:        category.ID,
		Name:      category.Name,
		CreatedAt: category.CreatedAt,
		UpdatedAt: category.UpdatedAt,
	}
}

func SanitizeProductRequest(req *models.ProductRequest) {
	req.Name = strings.TrimSpace(req.Name)
	req.SKU = strings.TrimSpace(req.SKU)

	if req.Code != nil {
		trimmed := strings.TrimSpace(*req.Code)
		if trimmed == "" {
			req.Code = nil
		} else {
			req.Code = &trimmed
		}
	}

	if req.Brand != nil {
		trimmed := strings.TrimSpace(*req.Brand)
		if trimmed == "" {
			req.Brand = nil
		} else {
			req.Brand = &trimmed
		}
	}

	if req.Model != nil {
		trimmed := strings.TrimSpace(*req.Model)
		if trimmed == "" {
			req.Model = nil
		} else {
			req.Model = &trimmed
		}
	}

	if req.Description != nil {
		trimmed := strings.TrimSpace(*req.Description)
		if trimmed == "" {
			req.Description = nil
		} else {
			req.Description = &trimmed
		}
	}

	// Sanitize category names
	var cleanCategories []string
	for _, cat := range req.CategoryNames {
		trimmed := strings.TrimSpace(cat)
		if trimmed != "" {
			cleanCategories = append(cleanCategories, trimmed)
		}
	}
	req.CategoryNames = cleanCategories
}
