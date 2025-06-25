package server

import (
	"github.com/venntry/config"
	"github.com/venntry/internal/shared/utils"
	"github.com/venntry/pkg/cache"
	"github.com/venntry/pkg/logger"

	"github.com/go-playground/validator/v10"
	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func New(db *sqlx.DB, cache cache.IRedisService, cfg *config.Variables) *echo.Echo {
	e := echo.New()

	e.Validator = &utils.CustomValidator{Validator: validator.New()}

	// Security middleware
	e.Use(middleware.Secure())
	e.Use(middleware.Recover())
	e.Use(middleware.RequestID())
	e.Use(logger.HTTPErrorsMiddleware())

	// CORS configuration
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000", cfg.Domain},
		AllowMethods:     []string{echo.GET, echo.POST, echo.PATCH, echo.PUT, echo.DELETE, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderAuthorization},
		AllowCredentials: true,
		MaxAge:           86400,
	}))

	// Rate Limiting using Redis
	// e.Use(middleware.RateLimiterWithConfig(middleware.RateLimiterConfig{
	// 	Store: cache.NewRateLimiterStore(cfg.RedisUrl),
	// 	IdentifierExtractor: func(ctx echo.Context) (string, error) {
	// 		id := ctx.RealIP()
	// 		return id, nil
	// 	},
	// 	DenyHandler: func(context echo.Context, identifier string, err error) error {
	// 		return echo.NewHTTPError(http.StatusTooManyRequests, "rate limit exceeded")
	// 	},
	// }))

	ConfigureRoutes(e, db, cache, cfg)

	return e
}
