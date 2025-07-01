"use server";

import api from "../api/axios";
import { WarehouseRequest } from "@/core/schema/validator";
import { handleApiError } from "@/core/lib/errors";
import { ActionResult } from "./auth-actions";

export const CreateWarehouseAction = async (
  formData: WarehouseRequest,
  inventoryId: string | undefined
): Promise<ActionResult> => {
  try {
    const response = await api.post(`/inventories/${inventoryId}/warehouses`, {
      ...formData,
    });

    const warehouse = response.data;

    return {
      success: true,
      data: warehouse,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return apiError;
  }
};

export const UpdateWarehouseAction = async (
  id: string,
  formData: WarehouseRequest
): Promise<ActionResult> => {
  try {
    const response = await api.put(`/warehouses/${id}`, formData);
    const warehouse = response.data;

    return {
      success: true,
      data: warehouse,
    };
  } catch (error) {
    const apiError = handleApiError(error);
    return apiError;
  }
};

export const DeleteWarehouseAction = async (
  id: string
): Promise<ActionResult> => {
  try {
    const response = await api.delete(`/warehouses/${id}`);
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
