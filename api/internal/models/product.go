package models

import (
	"time"

	"github.com/google/uuid"
)

type Product struct {
	ID           uuid.UUID   `db:"id" json:"id"`
	Name         string      `db:"name" json:"name"`
	SKU          string      `db:"sku" json:"sku"`
	Code         *string     `db:"code" json:"code"`
	Brand        *string     `db:"brand" json:"brand"`
	Model        *string     `db:"model" json:"model"`
	Description  *string     `db:"description" json:"description"`
	Quantity     int         `db:"quantity" json:"quantity"`
	RestockLevel int         `db:"restock_level" json:"restockLevel"`
	OptimalLevel int         `db:"optimal_level" json:"optimalLevel"`
	Cost         int         `db:"cost" json:"cost"`
	Price        int         `db:"price" json:"price"`
	InventoryID  uuid.UUID   `db:"inventory_id" json:"inventoryId"`
	CreatedAt    time.Time   `db:"created_at" json:"createdAt"`
	UpdatedAt    time.Time   `db:"updated_at" json:"updatedAt"`
	Images       []Image     `json:"images"`
	Categories   []Category  `json:"categories"`
	Warehouses   []Warehouse `json:"warehouses"`
}

type ProductRequest struct {
	Name          string         `json:"name" validate:"required,min=1,max=100"`
	SKU           string         `json:"sku" validate:"required,min=1,max=50"`
	Code          *string        `json:"code" validate:"max=50"`
	Brand         *string        `json:"brand" validate:"max=50"`
	Model         *string        `json:"model" validate:"max=50"`
	Description   *string        `json:"description" validate:"max=200"`
	Quantity      int            `json:"quantity" validate:"min=0"`
	RestockLevel  int            `json:"restockLevel" validate:"min=0"`
	OptimalLevel  int            `json:"optimalLevel" validate:"min=0"`
	Cost          float64        `json:"cost" validate:"min=0"`
	Price         float64        `json:"price" validate:"min=0"`
	ImageData     []ImageRequest `json:"images" validate:"dive"`
	CategoryNames []string       `json:"categories" validate:"dive,min=1,max=50"`
	WarehouseIDs  []string       `json:"warehouses" validate:"dive,uuid"`
}

type ProductResponse struct {
	ID           uuid.UUID           `json:"id"`
	Name         string              `json:"name"`
	SKU          string              `json:"sku"`
	Code         *string             `json:"code"`
	Brand        *string             `json:"brand"`
	Model        *string             `json:"model"`
	Description  *string             `json:"description"`
	Quantity     int                 `json:"quantity"`
	RestockLevel int                 `json:"restockLevel"`
	OptimalLevel int                 `json:"optimalLevel"`
	Cost         float64             `json:"cost"`
	Price        float64             `json:"price"`
	CreatedAt    time.Time           `json:"createdAt"`
	UpdatedAt    time.Time           `json:"updatedAt"`
	Images       []ImageResponse     `json:"images"`
	Categories   []CategoryResponse  `json:"categories"`
	Warehouses   []WarehouseResponse `json:"warehouses"`
}
