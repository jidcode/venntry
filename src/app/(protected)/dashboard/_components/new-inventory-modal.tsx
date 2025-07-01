"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X, Package, Sparkles } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { InventoryRequest, inventorySchema } from "@/core/schema/validator";
import { CreateInventoryAction } from "@/server/actions/inventory-actions";

interface InventoryModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (inventory: any) => void;
}

export default function NewInventoryModal({
  isOpen,
  onClose,
  onSuccess,
}: InventoryModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryRequest>({
    resolver: zodResolver(inventorySchema),
  });

  const action: SubmitHandler<InventoryRequest> = async (data) => {
    setServerError(null);
    console.log(data);
    try {
      const response = await CreateInventoryAction(data);
      if (response.success) {
        onSuccess(response.data);
        reset();
      } else if (response.error) {
        setServerError(response.error.message || "Failed to create inventory");
      }
    } catch (error) {
      console.error("Create inventory error:", error);
      setServerError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-gray-100">
        {/* Header */}
        <div className="relative p-8 pb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-2xl border-b border-gray-100">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/80 transition-colors duration-200 text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-20"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Create New Inventory
          </h2>
          <p className="text-gray-600 text-center text-sm leading-relaxed">
            Start organizing your items with a new inventory space
          </p>
        </div>

        {/* Form */}
        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit(action)} className="space-y-6">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
                <div className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0"></div>
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-blue-500" />
                Inventory Name
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="name"
                  placeholder="My Awesome Inventory"
                  {...register("name")}
                  disabled={isSubmitting}
                  className="h-12 px-4 text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                />
                {errors.name && (
                  <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1 animate-in slide-in-from-top-1 duration-150">
                    <div className="h-1.5 w-1.5 bg-red-500 rounded-full"></div>
                    {errors.name.message}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Creating your inventory...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5" />
                    <span>Create Inventory</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
