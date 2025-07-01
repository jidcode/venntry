import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Plus, X } from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { ProductRequest } from "@/core/schema/validator";
import { useState } from "react";
import { Label } from "@/core/components/ui/label";
import { getAllCategories } from "@/core/services/product-service";
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

export default function AddProductCategories({ form }: ParamProps) {
  const { data: categories, isLoading, error } = getAllCategories();
  const [newCategory, setNewCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { watch, setValue } = form;
  const selectedCategories = watch("categories") || [];

  const toggleCategory = (categoryName: string) => {
    const updatedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((cat) => cat !== categoryName)
      : [...selectedCategories, categoryName];
    setValue("categories", updatedCategories, { shouldValidate: true });
  };

  const addNewCategory = () => {
    const categoryName = newCategory.trim();
    if (categoryName && !selectedCategories.includes(categoryName)) {
      const updatedCategories = [...selectedCategories, categoryName];
      setValue("categories", updatedCategories, { shouldValidate: true });
      setNewCategory("");
    }
  };

  return (
    <section className="bg-primary border border-neutral/30 shadow-xs rounded-md p-6">
      <div>
        <div className="mb-4">
          <Label>Categories</Label>
          {selectedCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories.map((categoryName, index) => (
                <Badge
                  key={`${categoryName}-${index}`}
                  variant="outline"
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                  onClick={() => toggleCategory(categoryName)}
                >
                  {categoryName}
                  <X className="h-5 w-5" />
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral/60 mt-1">
              No categories added or selected
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className={cn(
              categories?.length === 0
                ? "hidden"
                : "bg-muted text-neutral rounded-sm border border-neutral/40 hover:border-none hover:bg-neutral/10"
            )}
          >
            <span className="inline-flex items-center gap-1 tracking-wider">
              <p>Select </p>
              <RiExpandUpDownLine className="size-4.5" />
            </span>
          </Button>

          <div className="flex gap-1 flex-1">
            <Input
              className="border-neutral/80"
              placeholder="Add new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addNewCategory())
              }
            />

            <Button
              className="rounded-sm"
              type="button"
              onClick={addNewCategory}
              disabled={!newCategory.trim()}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-primary">
            <DialogHeader>
              <DialogTitle>Select Categories</DialogTitle>
            </DialogHeader>
            <div
              className={cn(
                "grid gap-4 py-4",
                (categories?.length ?? 0) > 10 ? "grid-cols-3" : "grid-cols-2"
              )}
            >
              {(categories ?? []).map((category) => (
                <div
                  key={category.id}
                  className="flex items-center space-x-2"
                  onClick={() => toggleCategory(category.name)}
                >
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => toggleCategory(category.name)}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category.name}
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
