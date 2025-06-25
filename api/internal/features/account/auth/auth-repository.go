package auth

import (
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/venntry/internal/models"
	"github.com/venntry/pkg/errors"
)

type Repository struct {
	db *sqlx.DB
}

func NewRepository(data *sqlx.DB) IAuthRepository {
	return &Repository{db: data}
}

func (repo *Repository) CreateUser(input *models.UserRequest) (*models.User, error) {
	input.Sanitize()

	// Check if username already exists
	usernameExists, err := repo.UsernameExists(input.Username)
	if err != nil {
		return nil, errors.InternalError(err, "Error checking username availability")
	}
	if usernameExists {
		return nil, errors.ConflictError("Username already taken")
	}

	// Check if email already exists
	emailExists, err := repo.EmailExists(input.Email)
	if err != nil {
		return nil, errors.InternalError(err, "Error checking email availability")
	}
	if emailExists {
		return nil, errors.ConflictError("Email already exists")
	}

	user := &models.User{
		Id:        uuid.New(),
		Username:  input.Username,
		Email:     input.Email,
		Password:  input.Password,
		Role:      input.Role,
		Avatar:    input.Avatar,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	query := `INSERT 
			  INTO users (id, username, email, password, role, avatar, created_at, updated_at)
              VALUES (:id, :username, :email, :password, :role, :avatar, :created_at, :updated_at)`

	_, err = repo.db.NamedExec(query, user)
	if err != nil {
		return nil, errors.DatabaseError(err, "Error creating user")
	}

	return user, nil
}

func (repo *Repository) GetUserByEmail(email string) (*models.User, error) {
	var user models.User
	query := `SELECT id, username, email, password, role, avatar, created_at, updated_at 
			  FROM users WHERE email = $1`

	err := repo.db.Get(&user, query, email)
	if err != nil {
		return nil, errors.DatabaseError(err, "Error retrieving user by email")
	}

	return &user, nil
}

func (repo *Repository) GetUserByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	query := `SELECT id, username, email, password, role, avatar, created_at, updated_at 
			  FROM users WHERE id = $1`

	err := repo.db.Get(&user, query, id)
	if err != nil {
		return nil, errors.DatabaseError(err, "Error retrieving user by ID")
	}

	return &user, nil
}

func (repo *Repository) GetUserInventories(userId uuid.UUID) ([]models.Inventory, error) {
	var inventories []models.Inventory
	query := `SELECT id, name, user_id, created_at, updated_at 
			  FROM inventories WHERE user_id = $1`

	err := repo.db.Select(&inventories, query, userId)
	if err != nil {
		return nil, errors.DatabaseError(err, "Error retrieving user inventories")
	}

	return inventories, nil
}

func (repo *Repository) UsernameExists(username string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`

	err := repo.db.Get(&exists, query, username)
	if err != nil {
		return false, errors.DatabaseError(err, "Error checking username")
	}

	return exists, nil
}

func (repo *Repository) EmailExists(email string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`

	err := repo.db.Get(&exists, query, email)
	if err != nil {
		return false, errors.DatabaseError(err, "Error checking email")
	}

	return exists, nil
}
