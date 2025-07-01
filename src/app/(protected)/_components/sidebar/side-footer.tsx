"use client";

import { Button } from "@/core/components/ui/button";
import { useAuthStore } from "@/core/stores/auth-store";
import useInventoryStore from "@/core/stores/inventory-store";
import { LogoutUserAction } from "@/server/actions/auth-actions";
import { useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import { LoadingDots } from "@/core/components/elements/loader";
import React from "react";
import { Loader2 } from "lucide-react";

export function SideFooter({ isOpen }: { isOpen: boolean }) {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const deleteInventory = useInventoryStore((state) => state.deleteInventory);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await LogoutUserAction();
      router.push("/login");

      clearAuth();
      deleteInventory();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="p-2 my-4">
      {isOpen ? (
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              <span>Signing out...</span>
            </div>
          ) : (
            <>
              <BiLogOut />
              <span>Sign out</span>
            </>
          )}
        </Button>
      ) : (
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? <LoadingDots /> : <BiLogOut />}
        </Button>
      )}
    </footer>
  );
}
