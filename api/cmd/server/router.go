package server

import (
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/venntry/config"
	"github.com/venntry/internal/features/account/auth"
	"github.com/venntry/internal/features/account/inventories"
	"github.com/venntry/internal/features/app/products"
	"github.com/venntry/internal/features/app/warehouses"
	"github.com/venntry/internal/routes"
	"github.com/venntry/pkg/cache"
)

func ConfigureRoutes(e *echo.Echo, db *sqlx.DB, cache cache.IRedisService, cfg *config.Variables) {
	// Health check endpoint
	e.GET("/health", func(ctx echo.Context) error {
		return ctx.JSON(200, map[string]string{"status": "OK!"})
	})

	// Initialize auth routing components
	authService := auth.NewService(auth.NewRepository(db), cfg)
	authController := auth.NewController(authService)
	routes.AuthRoutes(e, authController, authService)

	// Inventory routes
	inventoriesRepo := inventories.NewRepository(db)
	inventoriesController := inventories.NewController(inventoriesRepo)
	routes.InventoryRoutes(e, inventoriesController, authService)

	// Warehouse routes
	warehouseValidator := warehouses.NewWarehouseValidator(db)
	warehouseRepo := warehouses.NewWarehouseRepository(db, cache)
	warehouseController := warehouses.NewWarehouseController(warehouseRepo, warehouseValidator)
	routes.WarehouseRoutes(e, warehouseController, authService)

	// Product routes
	productValidator := products.NewProductValidator(db)
	productRepo := products.NewProductRepository(db, cache)
	productController := products.NewProductController(productRepo, productValidator)
	routes.ProductRoutes(e, productController, authService)
}
