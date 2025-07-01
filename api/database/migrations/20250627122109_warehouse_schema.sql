-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS warehouses (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    capacity INTEGER,
    inventory_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, inventory_id),
    CONSTRAINT fk_warehouses_inventory FOREIGN KEY (inventory_id) REFERENCES inventories (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS warehouse_product_map (
    product_id UUID NOT NULL,
    warehouse_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, warehouse_id),
    CONSTRAINT fk_warehouse_products_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
    CONSTRAINT fk_warehouse_products_warehouse FOREIGN KEY (warehouse_id) REFERENCES warehouses (id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_warehouses_inventory ON warehouses (inventory_id);
CREATE INDEX idx_warehouse_products_warehouse ON warehouse_product_map (warehouse_id);
CREATE INDEX idx_warehouse_products_product ON warehouse_product_map (product_id);
-- +goose StatementEnd


-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_warehouse_products_product;
DROP INDEX IF EXISTS idx_warehouse_products_warehouse;
DROP INDEX IF EXISTS idx_warehouses_inventory;

DROP TABLE IF EXISTS warehouse_product_map CASCADE;
DROP TABLE IF EXISTS warehouses CASCADE;
-- +goose StatementEnd

