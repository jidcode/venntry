package server

import (
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/venntry/config"
	"github.com/venntry/internal/features/account/auth"
	"github.com/venntry/internal/features/account/inventories"
	"github.com/venntry/internal/routes"
	"github.com/venntry/pkg/cache"
)

func ConfigureRoutes(e *echo.Echo, db *sqlx.DB, cache cache.IRedisService, cfg *config.Variables) {
	// Health check endpoint
	e.GET("/health", func(ctx echo.Context) error {
		return ctx.JSON(200, map[string]string{"status": "A-OK!"})
	})

	// Initialize auth routing components
	authService := auth.NewService(auth.NewRepository(db), cfg)
	authController := auth.NewController(authService)
	routes.AuthRoutes(e, authController, authService)

	// Inventory routes
	inventoriesRepo := inventories.NewRepository(db)
	inventoriesController := inventories.NewController(inventoriesRepo)
	routes.InventoryRoutes(e, inventoriesController, authService)

	// // Product routes
	// productsRepo := products.NewRepository(db, cache)
	// productsController := products.NewController(productsRepo)
	// products.ProductRoutes(e, productsController, authService)

	// // Warehouse routes
	// warehousesRepo := warehouses.NewRepository(db, cache)
	// warehousesController := warehouses.NewController(warehousesRepo)
	// warehouses.WarehouseRoutes(e, warehousesController, authService)

	// // Customer routes
	// customersRepo := customers.NewRepository(db, cache)
	// customersController := customers.NewController(customersRepo)
	// customers.CustomerRoutes(e, customersController, authService)

	// // Sale routes
	// salesRepo := sales.NewRepository(db, cache)
	// salesController := sales.NewController(salesRepo)
	// sales.SaleRoutes(e, salesController, authService)

	// // Vendor routes
	// vendorsRepo := vendors.NewRepository(db, cache)
	// vendorsController := vendors.NewController(vendorsRepo)
	// vendors.VendorRoutes(e, vendorsController, authService)

	// // Purchase routes
	// purchasesRepo := purchases.NewRepository(db, cache)
	// purchasesController := purchases.NewController(purchasesRepo)
	// purchases.PurchaseRoutes(e, purchasesController, authService)
}
