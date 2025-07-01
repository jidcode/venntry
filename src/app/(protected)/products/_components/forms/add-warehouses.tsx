import { Button } from "@/core/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { ProductRequest } from "@/core/schema/validator";
import { useState } from "react";
import { Label } from "@/core/components/ui/label";
import { getAllWarehouses } from "@/core/services/warehouse-service";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { RiExpandUpDownLine } from "react-icons/ri";
import { cn } from "@/core/lib/utils";

interface ParamProps {
  form: UseFormReturn<ProductRequest>;
}

export default function AddProductWarehouses({ form }: ParamProps) {
  const { data: warehouses, isLoading, error } = getAllWarehouses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { watch, setValue } = form;
  const selectedWarehouses = watch("warehouses") || [];

  const toggleWarehouse = (warehouseId: string) => {
    const updatedWarehouses = selectedWarehouses.includes(warehouseId)
      ? selectedWarehouses.filter((id) => id !== warehouseId)
      : [...selectedWarehouses, warehouseId];
    setValue("warehouses", updatedWarehouses, { shouldValidate: true });
  };

  return (
    <section className="bg-primary border border-neutral/30 shadow-xs rounded-md p-6">
      <div>
        <div className="mb-4">
          <Label>Warehouses</Label>
          {selectedWarehouses.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedWarehouses.map((warehouseId) => {
                const warehouse = warehouses?.find(
                  (wh) => wh.id === warehouseId
                );
                return (
                  <Badge
                    key={warehouseId}
                    variant="outline"
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                    onClick={() => toggleWarehouse(warehouseId)}
                  >
                    {warehouse?.name || warehouseId}
                    <X className="h-5 w-5" />
                  </Badge>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-neutral/60 mt-1">
              No warehouses selected
            </p>
          )}
        </div>

        <Button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-muted text-neutral rounded-sm border border-neutral/40 hover:border-none hover:bg-neutral/10"
        >
          <span className="inline-flex items-center gap-1 tracking-wider">
            <p>Select </p>
            <RiExpandUpDownLine className="size-4.5" />
          </span>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-primary">
            <DialogHeader>
              <DialogTitle>Select Warehouses</DialogTitle>
            </DialogHeader>
            <div
              className={cn(
                "grid gap-4 py-4",
                (warehouses?.length ?? 0) > 10 ? "grid-cols-3" : "grid-cols-2"
              )}
            >
              {(warehouses ?? []).map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="flex items-center space-x-2"
                  onClick={() => toggleWarehouse(warehouse.id)}
                >
                  <Checkbox
                    id={`warehouse-${warehouse.id}`}
                    checked={selectedWarehouses.includes(warehouse.id)}
                    onCheckedChange={() => toggleWarehouse(warehouse.id)}
                  />
                  <label
                    htmlFor={`warehouse-${warehouse.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {warehouse.name}
                  </label>
                </div>
              ))}
            </div>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="mt-4"
            >
              Continue
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
