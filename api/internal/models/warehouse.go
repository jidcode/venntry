package models

import (
	"time"

	"github.com/google/uuid"
)

type Warehouse struct {
	ID          uuid.UUID `db:"id" json:"id"`
	Name        string    `db:"name" json:"name"`
	Location    *string   `db:"location" json:"location"`
	Capacity    *int      `db:"capacity" json:"capacity"`
	InventoryID uuid.UUID `db:"inventory_id" json:"inventoryId"`
	CreatedAt   time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt   time.Time `db:"updated_at" json:"updatedAt"`
	Products    []Product `json:"products"`
}

type WarehouseRequest struct {
	Name     string  `json:"name" validate:"required,min=1,max=50"`
	Location *string `json:"location" validate:"max=200"`
	Capacity *int    `json:"capacity" validate:"min=0"`
}

type WarehouseResponse struct {
	ID        uuid.UUID         `json:"id"`
	Name      string            `json:"name"`
	Location  *string           `json:"location"`
	Capacity  *int              `json:"capacity"`
	CreatedAt time.Time         `json:"createdAt"`
	UpdatedAt time.Time         `json:"updatedAt"`
	Products  []ProductResponse `json:"products"`
}

type WarehouseProduct struct {
	ProductID   uuid.UUID `db:"product_id" json:"productId"`
	WarehouseID uuid.UUID `db:"warehouse_id" json:"warehouseId"`
	Quantity    int       `db:"quantity" json:"quantity"`
	CreatedAt   time.Time `db:"created_at" json:"createdAt"`
}
