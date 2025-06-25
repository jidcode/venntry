package auth

import (
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/models"
	"github.com/venntry/pkg/errors"
	"github.com/venntry/pkg/logger"
)

func AuthMiddleware(service IAuthService) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ctx echo.Context) error {
			authHeader := ctx.Request().Header.Get("Authorization")
			if authHeader == "" {
				return echo.NewHTTPError(401, "missing auth token")
			}

			tokenParts := strings.Split(authHeader, " ")
			if len(tokenParts) != 2 || strings.ToLower(tokenParts[0]) != "bearer" {
				return echo.NewHTTPError(401, "invalid auth token format")
			}

			token := tokenParts[1]
			user, err := service.GetUserFromToken(token)
			if err != nil {
				return echo.NewHTTPError(401, "invalid auth token")
			}

			ctx.Set("user", user)
			return next(ctx)
		}
	}
}

func RoleMiddleware(roles ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(ctx echo.Context) error {
			user, ok := ctx.Get("user").(*models.User)
			if !ok {
				return logger.Error(ctx, "User not found in context",
					errors.UnauthorizedError("Unauthorized user"))
			}

			for _, role := range roles {
				if user.Role == role {
					return next(ctx)
				}
			}

			return logger.Error(ctx, "Access forbidden: insufficient permissions",
				errors.ForbiddenError("Unauthorized user"))
		}
	}
}
