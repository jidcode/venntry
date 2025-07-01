import * as z from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must not exceed 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must not exceed 100 characters"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export const inventorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
});

export const warehouseSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  location: z
    .string()
    .max(200, "Location must not exceed 200 characters")
    .optional(),
  capacity: z.coerce.number().min(0, "Capacity must be at least 0").optional(),
});

export const imageSchema = z.object({
  url: z.string().min(1, "URL is required"),
  fileKey: z.string().min(1, "File key is required"),
  isPrimary: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must not exceed 50 characters"),
});

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .max(20, "SKU must not exceed 20 characters"),
  code: z.string().max(20, "Code must not exceed 20 characters").optional(),
  brand: z.string().max(50, "Brand must not exceed 50 characters").optional(),
  model: z.string().max(50, "Model must not exceed 50 characters").optional(),
  description: z
    .string()
    .max(200, "Description must not exceed 200 characters")
    .optional(),
  quantity: z.coerce
    .number({
      invalid_type_error: "Quantity must be at least 0",
      required_error: "Quantity is required",
    })
    .min(0, "Quantity must be at least 0")
    .finite("Enter a valid number"),
  restockLevel: z.coerce
    .number({
      invalid_type_error: "Restock level  must be at least 0",
    })
    .min(0, "Restock level must be at least 0")
    .finite("Enter a valid number")
    .optional(),
  optimalLevel: z.coerce
    .number({
      invalid_type_error: "Optimal level must be at least 0",
    })
    .min(0, "Optimal level must be at least 0")
    .finite("Enter a valid number")
    .optional(),
  cost: z.coerce
    .number({
      invalid_type_error: "Enter product's cost price",
      required_error: "Enter product's cost price",
    })
    .min(0, "Cost price must be at least 0")
    .finite("Enter a valid number"),
  price: z.coerce
    .number({
      invalid_type_error: "Enter product's selling price",
      required_error: "Enter product's selling price",
    })
    .min(0, "Selling price must be at least 0")
    .finite("Enter a valid number"),

  images: z.array(imageSchema),
  categories: z.array(
    z
      .string()
      .min(1, "Category name is required")
      .max(50, "Category name must not exceed 50 characters")
  ),
  warehouses: z.array(z.string().uuid("Add a valid warehouse")),
});

// Type exports
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type InventoryRequest = z.infer<typeof inventorySchema>;
export type ImageRequest = z.infer<typeof imageSchema>;
export type WarehouseRequest = z.infer<typeof warehouseSchema>;
export type CategoryRequest = z.infer<typeof categorySchema>;
export type ProductRequest = z.infer<typeof productSchema>;
