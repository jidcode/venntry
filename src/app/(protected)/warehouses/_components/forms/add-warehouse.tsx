import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/core/components/ui/sheet";
import { WarehouseRequest, warehouseSchema } from "@/core/schema/validator";
import { WarehouseService } from "@/core/services/warehouse-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiSolidPlusCircle } from "react-icons/bi";
import WarehouseFormFields from "./form-fields";

export default function AddWarehouseSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button>
            <BiSolidPlusCircle className="w-5 h-5" />
            <span>Add Warehouse</span>
          </Button>
        </SheetTrigger>

        <SheetTitle className="sr-only">Add Warehouse</SheetTitle>

        <SheetContent className="flex flex-col bg-primary border-none h-full min-w-full md:min-w-1/3">
          <AddWarehouseForm closeSheet={handleClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}

function AddWarehouseForm({ closeSheet }: { closeSheet: () => void }) {
  const [serverError, setServerError] = useState<string | null>();
  const { createWarehouse } = WarehouseService();

  const form = useForm<WarehouseRequest>({
    resolver: zodResolver(warehouseSchema),
  });

  const isSubmitting = form.formState.isSubmitting;

  const action: SubmitHandler<WarehouseRequest> = async (data) => {
    setServerError(null);
    const response = await createWarehouse(data);
    console.log("Server Response", response);

    if (response?.error) {
      setServerError(response.error.message || "Request failed!");
    } else if (response?.success) {
      form.reset();
      closeSheet();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(action)}>
      <Card className="border-none shadow-none text-foreground p-0">
        <CardHeader className="sticky top-0 bg-accent/5">
          <div className="flex items-center justify-between py-6">
            <CardTitle className="text-lg">New Warehouse</CardTitle>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                type="submit"
                disabled={isSubmitting}
                className="min-w-20 font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <span>Save</span>
                )}
              </Button>

              <Button
                size="sm"
                type="button"
                onClick={closeSheet}
                disabled={isSubmitting}
                className="min-w-20 font-semibold bg-red-500 hover:bg-red-600 dark:text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 overflow-y-auto border border-neutral/20 mx-4 py-6 rounded-md">
          {serverError && (
            <div className="text-red-600 bg-red-50 py-2 px-4 rounded text-center">
              {serverError}
            </div>
          )}

          <WarehouseFormFields form={form} />
        </CardContent>
      </Card>
    </form>
  );
}
