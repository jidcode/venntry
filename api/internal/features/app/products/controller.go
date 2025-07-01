package products

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/venntry/internal/mappers"
	"github.com/venntry/internal/models"
	"github.com/venntry/internal/shared/utils"
	"github.com/venntry/pkg/errors"
	"github.com/venntry/pkg/logger"
)

type ProductController struct {
	repo      IProductRepository
	validator *ProductValidator
}

func NewProductController(repo IProductRepository, validator *ProductValidator) *ProductController {
	return &ProductController{
		repo:      repo,
		validator: validator,
	}
}

func (pc *ProductController) ListProducts(ctx echo.Context) error {
	inventoryID, err := uuid.Parse(ctx.Param("inventoryId"))
	if err != nil {
		return errors.ValidationError("Invalid inventory ID")
	}

	products, err := pc.repo.ListProducts(inventoryID)
	if err != nil {
		return logger.Error(ctx, "Failed to fetch products", err,
			logger.Field("inventory_id", inventoryID),
		)
	}

	response := make([]*models.ProductResponse, len(products))
	for i, product := range products {
		response[i] = mappers.ToProductResponse(&product)
	}

	return ctx.JSON(http.StatusOK, response)
}

func (pc *ProductController) ListProductCategories(ctx echo.Context) error {
	inventoryID, err := uuid.Parse(ctx.Param("inventoryId"))
	if err != nil {
		return errors.ValidationError("Invalid inventory ID")
	}

	categories, err := pc.repo.ListProductCategories(inventoryID)
	if err != nil {
		return logger.Error(ctx, "Failed to fetch product categories", err,
			logger.Field("inventory_id", inventoryID),
		)
	}

	response := make([]*models.CategoryResponse, len(categories))
	for i, category := range categories {
		response[i] = mappers.ToCategoryResponse(&category)
	}

	return ctx.JSON(http.StatusOK, response)
}

func (pc *ProductController) GetProductByID(ctx echo.Context) error {
	productID, err := uuid.Parse(ctx.Param("productId"))
	if err != nil {
		return errors.ValidationError("Invalid product ID")
	}

	product, err := pc.repo.GetProductWithRelations(productID)
	if err != nil {
		return logger.Error(ctx, "Failed to fetch product by ID", err,
			logger.Field("product_id", productID),
		)
	}

	response := mappers.ToProductResponse(&product)
	return ctx.JSON(http.StatusOK, response)
}

func (pc *ProductController) CreateProduct(ctx echo.Context) error {
	inventoryID, err := uuid.Parse(ctx.Param("inventoryId"))
	if err != nil {
		return errors.ValidationError("Invalid inventory ID")
	}

	var req models.ProductRequest
	if err := utils.BindAndValidateRequest(ctx, &req); err != nil {
		return err
	}

	mappers.SanitizeProductRequest(&req)
	product := mappers.ToCreateProduct(&req, inventoryID)

	if err := pc.validator.ValidateProduct(product); err != nil {
		return err
	}

	warehouseIDs := make([]uuid.UUID, len(req.WarehouseIDs))
	for i, id := range req.WarehouseIDs {
		warehouseID, err := uuid.Parse(id)
		if err != nil {
			return errors.ValidationError("Invalid warehouse ID")
		}
		warehouseIDs[i] = warehouseID
	}

	if err := pc.repo.CreateProduct(product, req.CategoryNames, req.ImageData, warehouseIDs); err != nil {
		return logger.Error(ctx, "Failed to create product", err,
			logger.Field("product_name", product.Name),
		)
	}

	response := mappers.ToProductResponse(product)
	return ctx.JSON(http.StatusCreated, response)
}

func (pc *ProductController) UpdateProduct(ctx echo.Context) error {
	productID, err := uuid.Parse(ctx.Param("productId"))
	if err != nil {
		return errors.ValidationError("Invalid product ID")
	}

	var req models.ProductRequest
	if err := utils.BindAndValidateRequest(ctx, &req); err != nil {
		return err
	}

	existing, err := pc.repo.GetProduct(productID)
	if err != nil {
		return logger.Error(ctx, "Product not found", err,
			logger.Field("product_id", productID),
		)
	}

	mappers.SanitizeProductRequest(&req)
	product := mappers.ToUpdateProduct(&req, &existing)

	if err := pc.validator.ValidateProduct(product); err != nil {
		return err
	}

	warehouseIDs := make([]uuid.UUID, len(req.WarehouseIDs))
	for i, id := range req.WarehouseIDs {
		warehouseID, err := uuid.Parse(id)
		if err != nil {
			return errors.ValidationError("Invalid warehouse ID")
		}
		warehouseIDs[i] = warehouseID
	}

	if err := pc.repo.UpdateProduct(product, req.CategoryNames, req.ImageData, warehouseIDs); err != nil {
		return logger.Error(ctx, "Failed to update product", err,
			logger.Field("product_id", productID),
		)
	}

	updatedProduct, err := pc.repo.GetProductWithRelations(productID)
	if err != nil {
		return logger.Error(ctx, "Failed to fetch updated product", err,
			logger.Field("product_id", productID),
		)
	}

	response := mappers.ToProductResponse(&updatedProduct)
	return ctx.JSON(http.StatusOK, response)
}

func (pc *ProductController) DeleteProduct(ctx echo.Context) error {
	productID, err := uuid.Parse(ctx.Param("productId"))
	if err != nil {
		return errors.ValidationError("Invalid product ID")
	}

	if err := pc.repo.DeleteProduct(productID); err != nil {
		return logger.Error(ctx, "Failed to delete product", err,
			logger.Field("product_id", productID),
		)
	}

	return ctx.NoContent(http.StatusNoContent)
}
