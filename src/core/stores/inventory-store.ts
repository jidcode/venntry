import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InventoryProps } from "../schema/types";

export interface InventoryStore {
  currentInventory: InventoryProps | null;
  setCurrentInventory: (inventory: InventoryProps) => void;
  deleteInventory: () => void;
}

const useInventoryStore = create<InventoryStore>()(
  persist(
    (set) => ({
      currentInventory: null,

      setCurrentInventory: (inventory: InventoryProps) =>
        set({ currentInventory: inventory }),

      deleteInventory: () => {
        set({ currentInventory: null });
        localStorage.removeItem("inventory");
      },
    }),
    {
      name: "inventory",
    }
  )
);

export default useInventoryStore;
