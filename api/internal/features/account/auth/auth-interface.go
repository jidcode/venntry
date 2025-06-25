package auth

import (
	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/models"
)

type IAuthRepository interface {
	CreateUser(input *models.UserRequest) (*models.User, error)
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id uuid.UUID) (*models.User, error)
	GetUserInventories(userId uuid.UUID) ([]models.Inventory, error)

	UsernameExists(username string) (bool, error)
	EmailExists(email string) (bool, error)
}

type IAuthController interface {
	Register(ctx echo.Context) error
	Login(ctx echo.Context) error
	GetProfile(ctx echo.Context) error
	CheckTokenExpiration(ctx echo.Context) error
}

type IAuthService interface {
	RegisterUser(username, email, password string) (*models.User, error)
	LoginUser(email, password string) (*models.UserResponse, error)
	ValidateToken(tokenString string) (*jwt.Token, error)
	IsTokenExpired(tokenString string) bool
	GetUserFromToken(tokenString string) (*models.User, error)
}
