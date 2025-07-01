import {
  DisplayErrors,
  parseServerErrors,
} from "@/core/components/ui/error-display";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { Textarea } from "@/core/components/ui/textarea";
import { ProductRequest } from "@/core/schema/validator";
import { AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

export interface ProductFormProps {
  form: UseFormReturn<ProductRequest>;
  errorResponse: string | null;
}

export default function AddProductDetails({
  form,
  errorResponse,
}: ProductFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const serverErrors = parseServerErrors(errorResponse);

  return (
    <section className="bg-primary border border-neutral/30 shadow-xs rounded-md p-6">
      <DisplayErrors serverErrors={serverErrors} />

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" {...register("brand")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" {...register("model")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">Stock Keeping Unit *</Label>
            <Input
              id="sku"
              {...register("sku")}
              className={errors.sku ? "border-destructive" : ""}
            />
            {errors.sku && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.sku.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Product Code</Label>
            <Input id="code" {...register("code")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />
        </div>

        {/* Inventory Levels */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity In Stock *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                {...register("quantity", { valueAsNumber: true })}
                className={errors.quantity ? "border-destructive" : ""}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="restockLevel">Restock Level *</Label>
              <Input
                id="restockLevel"
                type="number"
                min="0"
                {...register("restockLevel", { valueAsNumber: true })}
                className={errors.restockLevel ? "border-destructive" : ""}
              />
              {errors.restockLevel && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.restockLevel.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="optimalLevel">Optimal Level *</Label>
              <Input
                id="optimalLevel"
                type="number"
                min="0"
                {...register("optimalLevel", { valueAsNumber: true })}
                className={errors.optimalLevel ? "border-destructive" : ""}
              />
              {errors.optimalLevel && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.optimalLevel.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost Price *</Label>
              <Input
                id="cost"
                type="number"
                min="0"
                step="0.01"
                {...register("cost", { valueAsNumber: true })}
                className={errors.cost ? "border-destructive" : ""}
              />
              {errors.cost && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.cost.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Selling Price *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
