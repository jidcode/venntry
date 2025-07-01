"use server";

import { handleApiError } from "@/core/lib/errors";
import { InventoryRequest } from "@/core/schema/validator";
import { ActionResult } from "./auth-actions";
import api from "../api/axios";

export const CreateInventoryAction = async (
  data: InventoryRequest
): Promise<ActionResult> => {
  try {
    const response = await api.post("/inventories", data);

    console.log(response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};
