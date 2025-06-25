package errors

import (
	"fmt"
	"runtime"
	"strings"
)

type ErrorType string

const (
	NotFound      ErrorType = "NOT_FOUND"
	ValidationErr ErrorType = "VALIDATION_ERROR"
	InternalErr   ErrorType = "INTERNAL_ERROR"
	Unauthorized  ErrorType = "UNAUTHORIZED"
	BadRequest    ErrorType = "BAD_REQUEST"
	Forbidden     ErrorType = "FORBIDDEN"
	DatabaseErr   ErrorType = "DATABASE_ERROR"
	ConflictErr   ErrorType = "CONFLICT"
)

// Internal representation of the error
type AppError struct {
	Type      ErrorType `json:"type"`
	Message   string    `json:"message"`
	Details   string    `json:"details,omitempty"`
	Operation string    `json:"operation,omitempty"`
	Code      int       `json:"code"`
	Stack     string    `json:"-"`
}

// External representation for API responses
type APIError struct {
	Type    ErrorType `json:"type"`
	Message string    `json:"message"`
	Code    int       `json:"code"`
}

// ToAPIError converts AppError to APIError for external use
func (e *AppError) ToAPIError() APIError {
	return APIError{
		Type:    e.Type,
		Message: e.Message,
		Code:    e.Code,
	}
}

func (e *AppError) Error() string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("[%s] %s", e.Type, e.Message))
	if e.Details != "" {
		sb.WriteString(fmt.Sprintf(": %s", e.Details))
	}
	if e.Operation != "" {
		sb.WriteString(fmt.Sprintf(" (Operation: %s)", e.Operation))
	}
	return sb.String()
}

func (e *AppError) Is(target error) bool {
	t, ok := target.(*AppError)
	if !ok {
		return false
	}
	return e.Type == t.Type
}

// getStackTrace returns a more concise stack trace
func getStackTrace() string {
	const depth = 32
	var pcs [depth]uintptr
	n := runtime.Callers(3, pcs[:])
	frames := runtime.CallersFrames(pcs[:n])

	var sb strings.Builder
	for {
		frame, more := frames.Next()
		// Skip runtime and standard library frames
		if !strings.Contains(frame.File, "runtime/") {
			sb.WriteString(fmt.Sprintf("%s:%d %s\n", frame.File, frame.Line, frame.Function))
		}
		if !more {
			break
		}
	}
	return sb.String()
}

// Wrap wraps an existing error with additional context
func Wrap(err error, errType ErrorType, message string, code int) *AppError {
	if err == nil {
		return nil
	}

	// If it's already an AppError, preserve its details
	if appErr, ok := err.(*AppError); ok {
		return &AppError{
			Type:      errType,
			Message:   message,
			Details:   appErr.Details,
			Operation: appErr.Operation,
			Code:      code,
			Stack:     appErr.Stack,
		}
	}

	return &AppError{
		Type:    errType,
		Message: message,
		Details: err.Error(),
		Code:    code,
		Stack:   getStackTrace(),
	}
}

// Error creation functions remain the same, but now include stack trace internally
func New(errType ErrorType, message string, code int) *AppError {
	return &AppError{
		Type:    errType,
		Message: message,
		Code:    code,
		Stack:   getStackTrace(),
	}
}

// Additional helper functions for common errors
func NotFoundError(message string) *AppError {
	return New(NotFound, message, 404)
}

func ValidationError(message string) *AppError {
	return New(ValidationErr, message, 400)
}

func InternalError(err error, message string) *AppError {
	return Wrap(err, InternalErr, message, 500)
}

func UnauthorizedError(message string) *AppError {
	return New(Unauthorized, message, 401)
}

func ForbiddenError(message string) *AppError {
	return New(Forbidden, message, 403)
}

func ConflictError(message string) *AppError {
	return New(ConflictErr, message, 409)
}

func CacheError(err error, message string) *AppError {
	return Wrap(err, InternalErr, message, 500)
}
