package auth

import (
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
	"github.com/venntry/config"
	"github.com/venntry/internal/models"
	"github.com/venntry/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

type Service struct {
	repo   IAuthRepository
	config *config.Variables
}

func NewService(repo IAuthRepository, cfg *config.Variables) IAuthService {
	return &Service{repo: repo, config: cfg}
}

func (service *Service) RegisterUser(username, email, password string) (*models.User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	userRequest := &models.UserRequest{
		Username: username,
		Email:    email,
		Password: string(hashedPassword),
		Role:     "user",
	}

	var user *models.User
	user, err = service.repo.CreateUser(userRequest)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (service *Service) LoginUser(email, password string) (*models.UserResponse, error) {
	user, err := service.repo.GetUserByEmail(email)
	if err != nil {
		return nil, errors.NotFoundError("Invalid login credentials")
	}

	// Check password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, errors.UnauthorizedError("Invalid login credentials")
	}

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.Id.String(),
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(service.config.JWTSecret))
	if err != nil {
		return nil, err
	}

	// Get user's inventories
	inventories, err := service.repo.GetUserInventories(user.Id)
	if err != nil {
		return nil, err
	}

	return &models.UserResponse{
		UserId:      user.Id.String(),
		UserName:    user.Username,
		Email:       user.Email,
		Avatar:      user.Avatar,
		Inventories: inventories,
		Token:       tokenString,
	}, nil
}

func (service *Service) ValidateToken(tokenString string) (*jwt.Token, error) {
	if service.config == nil || service.config.JWTSecret == "" {
		return nil, errors.InternalError(nil, "JWT configuration missing")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.InternalError(nil, "Unexpected signing method")
		}
		return []byte(service.config.JWTSecret), nil
	})

	if err != nil {
		return nil, errors.InternalError(err, "Error validating token")
	}

	return token, nil
}

func (service *Service) IsTokenExpired(tokenString string) bool {
	token, err := service.ValidateToken(tokenString)
	if err != nil {
		return true
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return true
	}

	exp, ok := claims["exp"].(float64)
	if !ok {
		return true
	}

	return time.Now().Unix() > int64(exp)
}

func (service *Service) GetUserFromToken(tokenString string) (*models.User, error) {
	token, err := service.ValidateToken(tokenString)
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, errors.New(errors.Unauthorized, "invalid token", 401)
	}

	userID, err := uuid.Parse(claims["user_id"].(string))
	if err != nil {
		return nil, err
	}

	return service.repo.GetUserByID(userID)
}
