import { Input } from "@/core/components/ui/input";
import { Textarea } from "@/core/components/ui/textarea";
import { Label } from "@/core/components/ui/label";
import { AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { WarehouseRequest } from "@/core/schema/validator";

interface FormFieldsProps {
  form: UseFormReturn<WarehouseRequest>;
}

export default function WarehouseFormFields({ form }: FormFieldsProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Warehouse Name *</Label>
        <Input
          id="name"
          {...register("name")}
          className={errors.name ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-2">
        <Label htmlFor="location">Location</Label>
        <Textarea
          id="location"
          {...register("location")}
          className={errors.location ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.location && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.location.message}
          </p>
        )}
      </div>

      <div className="mt-6 space-y-2">
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          type="number"
          {...register("capacity")}
          className={errors.capacity ? "border-red-500" : ""}
          disabled={isSubmitting}
        />
        {errors.capacity && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {errors.capacity.message}
          </p>
        )}
      </div>
    </>
  );
}
