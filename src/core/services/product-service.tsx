"use client";

import { useRouter } from "next/navigation";
import { ProductRequest } from "../schema/validator";
import {
  CreateProductAction,
  DeleteProductAction,
  UpdateProductAction,
} from "@/server/actions/product-actions";
import { CategoryType, ProductType } from "../schema/types";
import useQuery from "@/core/hooks/use-query";
import useInventoryStore from "@/core/stores/inventory-store";
import { errorMessage } from "../lib/errors";

const inventory = useInventoryStore.getState().currentInventory;

export function getAllProducts() {
  return useQuery<ProductType[]>(`/inventories/${inventory?.id}/products`);
}

export function getAllCategories() {
  return useQuery<CategoryType[]>(`/inventories/${inventory?.id}/categories`);
}

export function getProduct(productId: string) {
  return useQuery<ProductType>(`/products/${productId}`);
}

export function ProductService() {
  const router = useRouter();
  const { data, error, mutate } = getAllProducts();

  const createProduct = async (newProduct: ProductRequest) => {
    try {
      const response = await CreateProductAction(newProduct, inventory?.id);

      if (response.success) {
        await mutate(data && [...data, response.data], false);
        router.push("/products");
        return { success: true, data: response.data };
      } else if (response.error) {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Create product error:", error);
      return {
        success: false,
        error: errorMessage(error),
      };
    }
  };

  const updateProduct = async (id: string, updatedProduct: ProductRequest) => {
    try {
      const response = await UpdateProductAction(id, updatedProduct);

      if (response.success) {
        await mutate(
          data?.map((product) => (product.id === id ? response.data : product)),
          false
        );
        router.push(`/products/${id}`);
        return { success: true, data: response.data };
      } else if (response.error) {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Update product error:", error);
      return {
        success: false,
        error: errorMessage(error),
      };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await DeleteProductAction(id);

      if (response.success) {
        await mutate(
          data?.filter((product) => product.id !== id),
          false
        );
        router.push("/products");
        return { success: true, data: response.data };
      } else if (response.error) {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Delete product error:", error);
      return {
        success: false,
        error: errorMessage(error),
      };
    }
  };

  return {
    data,
    isLoading: !error && !data,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
