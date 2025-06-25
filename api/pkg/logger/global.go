package logger

import (
	"sync"

	"github.com/labstack/echo/v4"
	"github.com/venntry/pkg/errors"
	"go.uber.org/zap"
)

var (
	globalLogger *Logger
	once         sync.Once
)

// Initialize sets up the global logger instance with the specified environment
func Initialize(env string) error {
	var err error
	once.Do(func() {
		err = initialize(env)
	})
	return err
}

// Info logs an informational message
func Info(msg string, fields ...zap.Field) {
	if globalLogger != nil {
		globalLogger.mutex.RLock()
		defer globalLogger.mutex.RUnlock()
		globalLogger.zapLogger.Info(msg, fields...)
	}
}

// Error logs an error message and sends an HTTP response
// In global.go
func Error(c echo.Context, msg string, err error, fields ...zap.Field) error {
	if globalLogger == nil {
		return err
	}

	globalLogger.mutex.RLock()
	defer globalLogger.mutex.RUnlock()

	var appErr *errors.AppError
	if e, ok := err.(*errors.AppError); ok {
		appErr = e
		fields = append(fields,
			Field("error_type", appErr.Type),
			Field("error_message", appErr.Message),
			Field("error_details", appErr.Details),
			Field("error_code", appErr.Code),
		)
	} else {
		appErr = errors.InternalError(err, msg)
		fields = append(fields, Field("error", err.Error()))
	}

	fields = append(fields,
		Field("request_id", c.Response().Header().Get("X-Request-ID")),
		Field("method", c.Request().Method),
		Field("path", c.Request().URL.Path),
	)

	globalLogger.zapLogger.Error(msg, fields...)
	return appErr
}

// Fatal logs a fatal message and exits the application
func Fatal(msg string, fields ...zap.Field) {
	if globalLogger != nil {
		globalLogger.mutex.RLock()
		defer globalLogger.mutex.RUnlock()
		globalLogger.zapLogger.Fatal(msg, fields...)
	}
}

// Sync flushes any buffered log entries
func Sync() error {
	if globalLogger != nil {
		globalLogger.mutex.Lock()
		defer globalLogger.mutex.Unlock()
		return globalLogger.zapLogger.Sync()
	}
	return nil
}
