package models

import (
	"time"

	"github.com/google/uuid"
)

// Image Models
type Image struct {
	ID        uuid.UUID `db:"id" json:"id"`
	URL       string    `db:"url" json:"url"`
	FileKey   string    `db:"file_key" json:"fileKey"`
	ProductId uuid.UUID `db:"product_id" json:"productId"`
	IsPrimary bool      `db:"is_primary" json:"isPrimary"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type ImageRequest struct {
	URL       string `json:"url" validate:"required"`
	FileKey   string `json:"fileKey" validate:"required"`
	IsPrimary bool   `json:"isPrimary"`
}

type ImageResponse struct {
	ID        uuid.UUID `json:"id"`
	URL       string    `json:"url"`
	FileKey   string    `json:"fileKey"`
	IsPrimary bool      `json:"isPrimary"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
