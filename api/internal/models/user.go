package models

import (
	"strings"
	"time"

	"github.com/google/uuid"
)

type User struct {
	Id        uuid.UUID `db:"id" json:"id"`
	Username  string    `db:"username" json:"username"`
	Email     string    `db:"email" json:"email"`
	Password  string    `db:"password" json:"-"`
	Role      string    `db:"role" json:"role"`
	Avatar    *string   `db:"avatar" json:"avatar"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	UpdatedAt time.Time `db:"updated_at" json:"updatedAt"`
}

type UserRequest struct {
	Username string  `json:"username" validate:"required,min=3,max=50"`
	Email    string  `json:"email" validate:"required,email,max=255"`
	Password string  `json:"password" validate:"required,min=8,max=255"`
	Role     string  `json:"role"`
	Avatar   *string `json:"avatar"`
}

type UserResponse struct {
	UserId      string      `json:"userId"`
	UserName    string      `json:"userName"`
	Email       string      `json:"email"`
	Avatar      *string     `json:"avatar"`
	Token       string      `json:"token"`
	Inventories []Inventory `json:"inventories"`
}

func (req *UserRequest) Sanitize() {
	req.Username = strings.ToLower(strings.TrimSpace(req.Username))
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	if req.Avatar != nil {
		trimmedAvatar := strings.TrimSpace(*req.Avatar)
		req.Avatar = &trimmedAvatar
	}
}
