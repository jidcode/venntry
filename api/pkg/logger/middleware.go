package logger

import (
	"time"

	"github.com/labstack/echo/v4"
	"github.com/venntry/pkg/errors"
)

func HTTPErrorsMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			start := time.Now()

			err := next(c)
			if err != nil {
				req := c.Request()
				resp := c.Response()

				// Convert to APIError for response
				if appErr, ok := err.(*errors.AppError); ok {
					apiErr := appErr.ToAPIError()

					// Log the full error internally
					Error(c, "HTTP Request Error", appErr,
						Field("time", time.Now().UTC().Format(time.RFC3339)),
						Field("request_id", resp.Header().Get("X-Request-ID")),
						Field("method", req.Method),
						Field("path", req.RequestURI),
						Field("duration_ms", time.Since(start).Milliseconds()),
						Field("status", resp.Status),
						Field("stack_trace", appErr.Stack),
					)

					// Return only the API error to the client
					return c.JSON(appErr.Code, apiErr)
				}

				return err
			}
			return nil
		}
	}
}
