package database

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/venntry/config"
	"github.com/venntry/pkg/logger"
)

var DB *sqlx.DB

func Connect(config config.Variables) *sqlx.DB {
	connectionString := config.DatabaseUrl

	db, err := sqlx.Connect("postgres", connectionString)
	if err != nil {
		logger.Fatal("Database connection failed",
			logger.Field("error", err.Error()),
			logger.Field("connection_string", connectionString))
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		logger.Fatal("Database ping failed",
			logger.Field("error", err.Error()))
	}

	logger.Info("Database connected!",
		logger.Field("database_url", connectionString))

	DB = db
	return db
}
