-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50),
    code VARCHAR(50),
    brand VARCHAR(100), 
    model VARCHAR(100), 
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    restock_level INTEGER NOT NULL DEFAULT 0,
    optimal_level INTEGER NOT NULL DEFAULT 0,
    cost INTEGER NOT NULL DEFAULT 0,
    price INTEGER NOT NULL DEFAULT 0,
    inventory_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, inventory_id),
    UNIQUE (sku, inventory_id),
    UNIQUE (code, inventory_id),
    CONSTRAINT fk_products_inventory FOREIGN KEY (inventory_id) REFERENCES inventories (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY,
    url TEXT NOT NULL,
    file_key TEXT NOT NULL,
    product_id UUID NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_images_products FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    inventory_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, inventory_id),
    CONSTRAINT fk_product_categories_inventory FOREIGN KEY (inventory_id) REFERENCES inventories (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_category_map (
    product_id UUID NOT NULL,
    category_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_product_category_map_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT fk_product_category_map_category FOREIGN KEY (category_id) REFERENCES product_categories (id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_inventory_id ON products (inventory_id);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_inventory_id ON product_categories (inventory_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS product_category_map;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS products;

DROP INDEX IF EXISTS idx_product_categories_inventory_id;
DROP INDEX IF EXISTS idx_product_images_product_id;
DROP INDEX IF EXISTS idx_products_inventory_id;
-- +goose StatementEnd