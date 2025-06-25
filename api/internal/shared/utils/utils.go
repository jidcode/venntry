package utils

import (
	"fmt"

	"github.com/labstack/echo/v4"
	"github.com/venntry/pkg/errors"
	"github.com/venntry/pkg/logger"
)

func BindAndValidateRequest(ctx echo.Context, input interface{}) error {
	if err := ctx.Bind(input); err != nil {
		logger.Error(ctx, "Failed to bind request input", err,
			logger.Field("path", ctx.Path()),
			logger.Field("method", ctx.Request().Method),
		)
		return errors.Wrap(err, errors.BadRequest, "Failed to parse request body", 400)
	}

	if err := ctx.Validate(input); err != nil {
		logger.Error(ctx, "Input validation failed", err,
			logger.Field("path", ctx.Path()),
			logger.Field("method", ctx.Request().Method),
			logger.Field("input_type", fmt.Sprintf("%T", input)),
		)
		return errors.Wrap(err, errors.ValidationErr, "Input validation failed", 400)
	}

	return nil
}
