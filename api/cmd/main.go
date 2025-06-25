package main

import (
	"github.com/venntry/cmd/server"
	"github.com/venntry/config"
	"github.com/venntry/database"
	"github.com/venntry/pkg/cache"
	"github.com/venntry/pkg/logger"
)

func main() {
	// Load configuration
	cfg := config.LoadEnv()

	// Initialize the global logger
	if err := logger.Initialize(cfg.Environment); err != nil {
		panic("Failed to initialize logger: " + err.Error())
	}

	logger.Info("Starting application...",
		logger.Field("environment", cfg.Environment))

	// Initialize database connection
	db := database.Connect(*cfg)
	defer db.Close()

	// Initialize Redis connection
	redisCache := cache.NewRedisCache(cfg.RedisUrl)
	defer redisCache.Close()

	// Start server
	e := server.New(db, redisCache, cfg)
	logger.Info("Server running on port :5000")

	if err := e.Start(":5000"); err != nil {
		logger.Fatal("Server failed to start", logger.Field("error", err.Error()))
	}
}
