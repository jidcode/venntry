"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/core/stores/auth-store";
import CustomLoader from "@/core/components/elements/loader";
import useInventoryStore from "@/core/stores/inventory-store";
import NewInventoryModal from "./_components/new-inventory-modal";
import DashboardContent from "./_components/dashboard-content";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setInventory = useInventoryStore((state) => state.setCurrentInventory);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has inventories when component mounts
    if (user) {
      setIsLoading(false);
      if (!user.inventories || user.inventories.length === 0) {
        setShowCreateModal(true);
      }
    }
  }, [user]);

  const handleNewInventory = (newInventory: any) => {
    // Update user and inventory in store with the new inventory
    if (user) {
      const updatedUser = {
        ...user,
        inventories: [...(user.inventories || []), newInventory],
      };
      setUser(updatedUser);
      setInventory(newInventory);
    }

    setShowCreateModal(false);
  };

  if (isLoading) return <CustomLoader />;

  return (
    <>
      <DashboardContent />

      <NewInventoryModal
        isOpen={showCreateModal}
        onSuccess={handleNewInventory}
      />
    </>
  );
}
