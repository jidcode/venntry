import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import { WarehouseService } from "@/core/services/warehouse-service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbTrashXFilled } from "react-icons/tb";
import { WarehouseParamProps } from "./edit-warehouse";

export default function DeleteWarehouseDialog({
  warehouse,
}: WarehouseParamProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { deleteWarehouse } = WarehouseService();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteWarehouse(warehouse.id);

      if (response?.success) {
        setOpen(false);
        router.push("/warehouses");
      } else if (response?.error) {
        alert(response?.error.message || "Failed to delete warehouse");
      }
    } catch (error) {
      console.error("Failed to delete warehouse:", error);
      alert("Failed to delete warehouse. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-500 hover:bg-red-600 dark:text-white">
          <TbTrashXFilled className="h-4 w-4 mb-0.5" />
          <span>Delete</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Warehouse</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{warehouse.name}"? This action
            cannot be undone and will permanently remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
