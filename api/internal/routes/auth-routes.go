package routes

import (
	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/features/account/auth"
)

func AuthRoutes(e *echo.Echo, ac auth.IAuthController, authService auth.IAuthService) {
	api := e.Group("/api/auth")
	api.POST("/register", ac.Register)
	api.POST("/login", ac.Login)

	protected := e.Group("/api/auth")
	protected.Use(auth.AuthMiddleware(authService))
	protected.GET("/user-profile", ac.GetProfile)
	protected.GET("/check-token", ac.CheckTokenExpiration)
}
