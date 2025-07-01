package models

import (
	"time"

	"github.com/google/uuid"
)

type Category struct {
	ID          uuid.UUID `db:"id" json:"id"`
	Name        string    `db:"name" json:"name"`
	InventoryId uuid.UUID `db:"inventory_id" json:"inventoryId"`
	CreatedAt   time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt   time.Time `db:"updated_at" json:"updatedAt"`
}

type CategoryRequest struct {
	Name string `json:"name" validate:"required,min=1,max=100"`
}

type CategoryResponse struct {
	Id        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ProductCategoryMap struct {
	ProductID  uuid.UUID `db:"product_id" json:"productId"`
	CategoryID uuid.UUID `db:"category_id" json:"categoryId"`
	CreatedAt  time.Time `db:"created_at" json:"createdAt"`
}
