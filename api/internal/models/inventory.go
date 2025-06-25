package models

import (
	"time"

	"github.com/google/uuid"
)

type Inventory struct {
	Id        uuid.UUID `db:"id" json:"id"`
	Name      string    `db:"name" json:"name"`
	UserId    uuid.UUID `db:"user_id" json:"userId"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type InventoryRequest struct {
	Name string `json:"name" validate:"required,min=1,max=100"`
}

type InventoryResponse struct {
	Id        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	UserId    uuid.UUID `json:"userId"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
