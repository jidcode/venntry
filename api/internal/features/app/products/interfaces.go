package products

import (
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/models"
)

type IProductRepository interface {
	ListProducts(inventoryId uuid.UUID) ([]models.Product, error)
	ListProductCategories(inventoryId uuid.UUID) ([]models.Category, error)
	GetProduct(productId uuid.UUID) (models.Product, error)
	GetProductWithRelations(productId uuid.UUID) (models.Product, error)
	CreateProduct(product *models.Product, categoryNames []string, images []models.ImageRequest, warehouseIds []uuid.UUID) error
	UpdateProduct(product *models.Product, categoryNames []string, images []models.ImageRequest, warehouseIds []uuid.UUID) error
	DeleteProduct(productId uuid.UUID) error
}

type IProductsController interface {
	ListProducts(ctx echo.Context) error
	ListProductCategories(ctx echo.Context) error
	GetProductByID(ctx echo.Context) error
	CreateProduct(ctx echo.Context) error
	UpdateProduct(ctx echo.Context) error
	DeleteProduct(ctx echo.Context) error
}
