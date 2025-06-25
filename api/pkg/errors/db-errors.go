package errors

import (
	"strings"
)

// DatabaseErrorType provides specific database error types
type DatabaseErrorType ErrorType

const (
	DBDuplicateEntry   ErrorType = "DUPLICATE_ENTRY"
	DBForeignKeyError  ErrorType = "FOREIGN_KEY_ERROR"
	DBValidationError  ErrorType = "DB_VALIDATION_ERROR"
	DBConcurrentError  ErrorType = "CONCURRENT_UPDATE"
	DBOperationalError ErrorType = "OPERATIONAL_ERROR"
)

// DatabaseError creates a new database-specific AppError
func DatabaseError(err error, operation string) *AppError {
	if pgErr := MapPostgresError(err, operation); pgErr != nil {
		return pgErr
	}
	appErr := &AppError{
		Type:      DatabaseErr,
		Message:   "Database operation failed",
		Details:   err.Error(),
		Operation: operation,
		Code:      500,
		Stack:     getStackTrace(),
	}
	return appErr
}

// MapPostgresError maps specific PostgreSQL errors to AppError
func MapPostgresError(err error, operation string) *AppError {
	if err == nil {
		return nil
	}

	details := err.Error()

	switch {
	case strings.Contains(details, "duplicate key value violates unique constraint"):
		return handleDuplicateKeyError(details, operation)
	case strings.Contains(details, "violates foreign key constraint"):
		return &AppError{
			Type:      DBForeignKeyError,
			Message:   "Referenced item not found",
			Details:   details,
			Operation: operation,
			Code:      400,
			Stack:     getStackTrace(),
		}
	case strings.Contains(details, "value too long for type"):
		return &AppError{
			Type:      DBValidationError,
			Message:   "Input value is too long",
			Details:   details,
			Operation: operation,
			Code:      400,
			Stack:     getStackTrace(),
		}
	case strings.Contains(details, "invalid input syntax"):
		return &AppError{
			Type:      DBValidationError,
			Message:   "Invalid input format",
			Details:   details,
			Operation: operation,
			Code:      400,
			Stack:     getStackTrace(),
		}
	case strings.Contains(details, "null value in column"):
		return &AppError{
			Type:      DBValidationError,
			Message:   "Required field missing",
			Details:   details,
			Operation: operation,
			Code:      400,
			Stack:     getStackTrace(),
		}
	case strings.Contains(details, "division by zero"):
		return &AppError{
			Type:      DBValidationError,
			Message:   "Invalid calculation: division by zero",
			Details:   details,
			Operation: operation,
			Code:      400,
			Stack:     getStackTrace(),
		}
	case strings.Contains(details, "out of range"):
		return &AppError{
			Type:      DBValidationError,
			Message:   "Value out of allowed range",
			Details:   details,
			Operation: operation,
			Code:      400,
			Stack:     getStackTrace(),
		}
	case strings.Contains(details, "could not serialize access due to concurrent update"):
		return &AppError{
			Type:      DBConcurrentError,
			Message:   "Update conflict: item was modified by another user",
			Details:   details,
			Operation: operation,
			Code:      409,
			Stack:     getStackTrace(),
		}
	case strings.Contains(details, "no rows in result set"):
		return &AppError{
			Type:      DBValidationError,
			Message:   "Resource not found",
			Details:   details,
			Operation: operation,
			Code:      404,
			Stack:     getStackTrace(),
		}
	default:
		return &AppError{
			Type:      DBOperationalError,
			Message:   "An unexpected error occurred",
			Details:   details,
			Operation: operation,
			Code:      500,
			Stack:     getStackTrace(),
		}
	}
}

func handleDuplicateKeyError(details, operation string) *AppError {
	return &AppError{
		Type:      DBDuplicateEntry,
		Message:   "A record with this information already exists",
		Details:   details,
		Operation: operation,
		Code:      400,
		Stack:     getStackTrace(),
	}
}
