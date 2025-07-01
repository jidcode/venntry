package routes

import (
	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/features/account/auth"
	"github.com/venntry/internal/features/app/warehouses"
)

func WarehouseRoutes(e *echo.Echo, wc warehouses.IWarehouseController, authService auth.IAuthService) {
	// Routes for listing and creating warehouses
	api := e.Group("/api/inventories/:inventoryId/warehouses")
	api.Use(auth.AuthMiddleware(authService), auth.RoleMiddleware("user"))

	api.GET("", wc.ListWarehouses)
	api.POST("", wc.CreateWarehouse)

	// Routes for individual warehouse operations
	warehouseApi := e.Group("/api/warehouses/:id")
	warehouseApi.Use(auth.AuthMiddleware(authService), auth.RoleMiddleware("user"))

	warehouseApi.GET("", wc.GetWarehouse)
	warehouseApi.PUT("", wc.UpdateWarehouse)
	warehouseApi.DELETE("", wc.DeleteWarehouse)

}
