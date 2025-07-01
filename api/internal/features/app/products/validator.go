package products

import (
	"database/sql"
	"fmt"
	"math/rand"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/venntry/internal/models"
	"github.com/venntry/pkg/errors"
)

type ProductValidator struct {
	db *sqlx.DB
}

func NewProductValidator(db *sqlx.DB) *ProductValidator {
	return &ProductValidator{db: db}
}

func (pv *ProductValidator) ValidateProduct(product *models.Product) error {
	var errorMessages []string

	//  Default product code generation
	if product.Code == nil || *product.Code == "" {
		generatedCode, err := pv.generateProductCode(product.Name)
		if err != nil {
			return errors.DatabaseError(err, "Error generating product code")
		}
		product.Code = &generatedCode
	}

	// Default restock and optimal levels
	if product.RestockLevel == 0 {
		product.RestockLevel = 10
	}
	if product.OptimalLevel == 0 {
		product.OptimalLevel = 100
	}

	// Validate unique fields
	nameExists, err := pv.fieldExists("name", product.Name, product.InventoryID, product.ID)
	if err != nil {
		return errors.DatabaseError(err, "Error validating product name")
	}
	if nameExists {
		errorMessages = append(errorMessages, "Product name already exists")
	}

	if product.SKU != "" {
		skuExists, err := pv.fieldExists("sku", product.SKU, product.InventoryID, product.ID)
		if err != nil {
			return errors.DatabaseError(err, "Error validating product SKU")
		}
		if skuExists {
			errorMessages = append(errorMessages, "Product SKU already exists")
		}
	}

	if product.Code != nil && *product.Code != "" {
		codeExists, err := pv.fieldExists("code", *product.Code, product.InventoryID, product.ID)
		if err != nil {
			return errors.DatabaseError(err, "Error validating product code")
		}
		if codeExists {
			errorMessages = append(errorMessages, "Product code already exists")
		}
	}

	if len(errorMessages) > 0 {
		return errors.ValidationError(strings.Join(errorMessages, "; "))
	}

	return nil
}

// Helper methods
func (pv *ProductValidator) fieldExists(fieldName, fieldValue string, inventoryID, productID uuid.UUID) (bool, error) {
	query := `
		SELECT EXISTS(
			SELECT 1 FROM products 
			WHERE ` + fieldName + ` = $1 
			AND inventory_id = $2 
			AND id != $3
		)`

	var exists bool
	err := pv.db.Get(&exists, query, fieldValue, inventoryID, productID)
	if err != nil && err != sql.ErrNoRows {
		return false, err
	}
	return exists, nil
}

func (pv *ProductValidator) generateProductCode(productName string) (string, error) {
	words := strings.Fields(strings.ToUpper(productName))
	var prefix string

	if len(words) == 1 {
		word := words[0]
		if len(word) == 1 {
			prefix = word + "XO"
		} else if len(word) == 2 {
			prefix = word + "X"
		} else {
			prefix = word[:3]
		}
	} else {
		// Multiple words - use initials of first 3 words max
		maxWords := len(words)
		if maxWords > 3 {
			maxWords = 3
		}
		for i := 0; i < maxWords; i++ {
			prefix += string(words[i][0])
		}
	}

	// Generate random alphanumeric suffix (7 characters for 10 char total)
	const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	suffix := make([]byte, 7)
	for i := range suffix {
		suffix[i] = charset[rand.Intn(len(charset))]
	}

	return fmt.Sprintf("%s-%s", prefix, string(suffix)), nil
}
