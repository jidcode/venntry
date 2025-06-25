package logger

import (
	"context"
	"sync"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Logger struct {
	zapLogger *zap.Logger
	mutex     sync.RWMutex
}

// Initialize sets up the logger instance with the specified environment
func initialize(env string) error {
	config := getLoggerConfig(env)

	zapLogger, err := config.Build()
	if err != nil {
		return err
	}

	globalLogger = &Logger{
		zapLogger: zapLogger,
	}
	return nil
}

// getLoggerConfig returns environment-specific logger configuration
func getLoggerConfig(env string) zap.Config {
	if env == "production" {
		return getProductionConfig()
	}
	return getDevelopmentConfig()
}

func getProductionConfig() zap.Config {
	config := zap.NewProductionConfig()
	config.EncoderConfig = zapcore.EncoderConfig{
		TimeKey:        "timestamp",
		LevelKey:       "level",
		NameKey:        "logger",
		CallerKey:      "caller",
		FunctionKey:    zapcore.OmitKey,
		MessageKey:     "message",
		StacktraceKey:  "stacktrace",
		LineEnding:     zapcore.DefaultLineEnding,
		EncodeLevel:    zapcore.CapitalLevelEncoder,
		EncodeTime:     zapcore.ISO8601TimeEncoder,
		EncodeDuration: zapcore.StringDurationEncoder,
		EncodeCaller:   zapcore.ShortCallerEncoder,
	}
	return config
}

func getDevelopmentConfig() zap.Config {
	return zap.Config{
		Level:            zap.NewAtomicLevelAt(zap.DebugLevel),
		Development:      true,
		Encoding:         "console",
		OutputPaths:      []string{"stdout"},
		ErrorOutputPaths: []string{"stderr"},
		EncoderConfig: zapcore.EncoderConfig{
			TimeKey:        "time",
			LevelKey:       "level",
			NameKey:        "logger",
			CallerKey:      "caller",
			FunctionKey:    zapcore.OmitKey,
			MessageKey:     "message",
			StacktraceKey:  "stacktrace",
			LineEnding:     zapcore.DefaultLineEnding,
			EncodeLevel:    zapcore.CapitalColorLevelEncoder,
			EncodeTime:     zapcore.ISO8601TimeEncoder,
			EncodeDuration: zapcore.StringDurationEncoder,
			EncodeCaller:   zapcore.ShortCallerEncoder,
		},
	}
}

// Field creates a new zap.Field
func Field(key string, value interface{}) zap.Field {
	return zap.Any(key, value)
}

// WithContext adds context fields to the logger
func WithContext(ctx context.Context, fields ...zap.Field) *zap.Logger {
	if globalLogger == nil {
		return nil
	}
	return globalLogger.zapLogger.With(fields...)
}
