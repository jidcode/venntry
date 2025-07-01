package routes

import (
	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/features/account/auth"
	"github.com/venntry/internal/features/account/inventories"
)

func InventoryRoutes(e *echo.Echo, ic inventories.IInventoriesController, authService auth.IAuthService) {
	api := e.Group("/api/inventories")
	api.Use(auth.AuthMiddleware(authService), auth.RoleMiddleware("user"))

	api.GET("", ic.ListInventories)
	api.GET("/:id", ic.GetInventory)
	api.POST("", ic.CreateInventory)
	api.PUT("/:id", ic.UpdateInventory)
	api.DELETE("/:id", ic.DeleteInventory)
}
