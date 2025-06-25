package auth

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/models"
	"github.com/venntry/pkg/logger"
)

type Controller struct {
	service IAuthService
}

func NewController(service IAuthService) *Controller {
	return &Controller{service: service}
}

func (ctrl *Controller) Register(ctx echo.Context) error {
	var input struct {
		Username string `json:"username" validate:"required"`
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=6"`
	}

	if err := ctx.Bind(&input); err != nil {
		return logger.Error(ctx, "Invalid input", err)
	}

	if err := ctx.Validate(&input); err != nil {
		return logger.Error(ctx, "Validation failed", err)
	}

	user, err := ctrl.service.RegisterUser(input.Username, input.Email, input.Password)
	if err != nil {
		return logger.Error(ctx, "Registration failed!", err,
			logger.Field("email", input.Email),
			logger.Field("username", input.Username),
		)
	}

	logger.Info("User registration successful!")
	return ctx.JSON(http.StatusCreated, user)
}

func (ctrl *Controller) Login(ctx echo.Context) error {
	var input struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required"`
	}

	if err := ctx.Bind(&input); err != nil {
		return logger.Error(ctx, "Invalid input", err)
	}

	if err := ctx.Validate(&input); err != nil {
		return logger.Error(ctx, "Validation failed", err)
	}

	response, err := ctrl.service.LoginUser(input.Email, input.Password)
	if err != nil {
		return logger.Error(ctx, "Invalid email or password!", err,
			logger.Field("email", input.Email),
		)
	}

	logger.Info("User login successful!")
	return ctx.JSON(http.StatusOK, response)
}

func (ctrl *Controller) GetProfile(ctx echo.Context) error {
	user := ctx.Get("user").(*models.User)

	return ctx.JSON(http.StatusOK, user)
}

func (ctrl *Controller) CheckTokenExpiration(ctx echo.Context) error {
	tokenString := ctx.Request().Header.Get("Authorization")
	if tokenString == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"error": "No token provided"})
	}

	// Remove "Bearer " prefix if present
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	isExpired := ctrl.service.IsTokenExpired(tokenString)
	return ctx.JSON(http.StatusOK, map[string]bool{"expired": isExpired})
}
