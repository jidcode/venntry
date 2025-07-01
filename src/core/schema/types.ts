export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  inventories: InventoryProps[];
}

export interface InventoryProps {
  id: string;
  name: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductType {
  id: string;
  name: string;
  sku: string;
  code: string | null;
  brand: string | null;
  model: string | null;
  description: string | null;
  quantity: number;
  restockLevel: number;
  optimalLevel: number;
  cost: number;
  price: number;
  inventoryId: string;
  createdAt: string;
  updatedAt: string;
  images: ImageType[];
  categories: CategoryType[];
  warehouses: WarehouseType[];
}

export interface WarehouseType {
  id: string;
  name: string;
  location: string | null;
  capacity: number | null;
  inventoryId: string;
  createdAt: string;
  updatedAt: string;
  products: ProductType[];
}

export interface ImageType {
  id: string;
  url: string;
  fileKey: string;
  productId: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryType {
  id: string;
  name: string;
  inventoryId: string;
  createdAt: string;
  updatedAt: string;
}
