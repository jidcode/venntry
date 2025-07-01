package routes

import (
	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/features/account/auth"
	"github.com/venntry/internal/features/app/products"
)

func ProductRoutes(e *echo.Echo, pc products.IProductsController, authService auth.IAuthService) {
	// Routes for listing and creating products
	api := e.Group("/api/inventories/:inventoryId")
	api.Use(auth.AuthMiddleware(authService), auth.RoleMiddleware("user"))

	api.GET("/products", pc.ListProducts)
	api.GET("/categories", pc.ListProductCategories)
	api.POST("/products", pc.CreateProduct)

	// Routes for individual product operations
	productApi := e.Group("/api/products/:productId")
	productApi.Use(auth.AuthMiddleware(authService), auth.RoleMiddleware("user"))

	productApi.GET("", pc.GetProductByID)
	productApi.PUT("", pc.UpdateProduct)
	productApi.DELETE("", pc.DeleteProduct)
	// productApi.PATCH("/quantity", pc.UpdateProductQuantity)
}
