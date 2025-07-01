"use server";

import api from "../api/axios";
import { ProductRequest } from "@/core/schema/validator";
import { handleApiError } from "@/core/lib/errors";
import { ActionResult } from "./auth-actions";

export const CreateProductAction = async (
  formData: ProductRequest,
  inventoryId: string | undefined
): Promise<ActionResult> => {
  try {
    const response = await api.post(
      `/inventories/${inventoryId}/products`,
      formData
    );
    const product = response.data;

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return apiError;
  }
};

export const UpdateProductAction = async (
  id: string,
  formData: ProductRequest
): Promise<ActionResult> => {
  try {
    const response = await api.put(`/products/${id}`, formData);
    const product = response.data;

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return apiError;
  }
};

export const DeleteProductAction = async (
  id: string
): Promise<ActionResult> => {
  try {
    const response = await api.delete(`/products/${id}`);
    const result = response.data;

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return apiError;
  }
};
