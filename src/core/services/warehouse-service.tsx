"use client";

import { useRouter } from "next/navigation";
import { WarehouseRequest } from "../schema/validator";
import {
  CreateWarehouseAction,
  DeleteWarehouseAction,
  UpdateWarehouseAction,
} from "@/server/actions/warehouse-actions";
import { WarehouseType } from "../schema/types";
import useQuery from "@/core/hooks/use-query";
import useInventoryStore from "@/core/stores/inventory-store";
import { errorMessage } from "../lib/errors";

const inventory = useInventoryStore.getState().currentInventory;

export function getAllWarehouses() {
  return useQuery<WarehouseType[]>(`/inventories/${inventory?.id}/warehouses`);
}

export function getWarehouse(warehouseId: string) {
  return useQuery<WarehouseType>(`/warehouses/${warehouseId}`);
}

export function WarehouseService() {
  const router = useRouter();
  const { data, error, mutate } = getAllWarehouses();

  const createWarehouse = async (newWarehouse: WarehouseRequest) => {
    try {
      const response = await CreateWarehouseAction(newWarehouse, inventory?.id);

      if (response.success) {
        await mutate(data && [...data, response.data], false);
        router.refresh();
        return { success: true, data: response.data };
      } else if (response.error) {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Create warehouse error:", error);
      return {
        success: false,
        error: errorMessage(error),
      };
    }
  };

  const updateWarehouse = async (
    id: string,
    updatedWarehouse: WarehouseRequest
  ) => {
    try {
      const response = await UpdateWarehouseAction(id, updatedWarehouse);

      if (response.success) {
        window.location.reload();
        await mutate(
          data?.map((warehouse) =>
            warehouse.id === id ? response.data : warehouse
          ),
          false
        );
        router.refresh();
        return { success: true, data: response.data };
      } else if (response.error) {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Update warehouse error:", error);
      return {
        success: false,
        error: errorMessage(error),
      };
    }
  };

  const deleteWarehouse = async (id: string) => {
    try {
      const response = await DeleteWarehouseAction(id);

      if (response.success) {
        await mutate(
          data?.filter((warehouse) => warehouse.id !== id),
          false
        );
        router.push("/warehouses");
        return { success: true, data: response.data };
      } else if (response.error) {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Delete warehouse error:", error);
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
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  };
}
