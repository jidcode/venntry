import Link from "next/link";
import { Button } from "@/core/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProductRequest } from "@/core/schema/validator";
import { UseFormReturn } from "react-hook-form";
import AddProductDetails from "./add-details";
import AddProductImages, { ImageItem } from "./add-images";
import AddProductCategories from "./add-categories";
import AddProductWarehouses from "./add-warehouses";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";

interface ParamProps {
  form: UseFormReturn<ProductRequest>;
  errorResponse: any;
  selectedImages: ImageItem[];
  setSelectedImages: (images: ImageItem[]) => void;
}

export default function CreateProductForm({
  form,
  errorResponse,
  selectedImages,
  setSelectedImages,
}: ParamProps) {
  const {
    formState: { isSubmitting },
  } = form;

  return (
    <Card className="border-none shadow-none p-0 m-0">
      <CardHeader className="bg-primary flex items-center justify-between p-6 rounded-sm border border-neutral/30 shadow-xs">
        <CardTitle className="text-xl lg:text-2xl font-semibold text-neutral">
          New Product
        </CardTitle>

        <div className="space-x-2 hidden lg:block">
          <Button
            className="rounded-md flex-1 bg-accent text-primary hover:bg-neutral min-w-40 py-2.5"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <p>Adding product...</p>
              </span>
            ) : (
              <span>Add Product</span>
            )}
          </Button>
          <Button
            className="rounded-md flex-1 bg-primary text-accent border border-accent hover:bg-primary hover:border-destructive hover:text-destructive min-w-40 py-2.5"
            type="button"
            disabled={isSubmitting}
            asChild
          >
            <Link href="/products">Cancel</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          <div className="h-full">
            <AddProductDetails form={form} errorResponse={errorResponse} />
          </div>
          <div className="space-y-4 h-full max-h-[700px] flex flex-col justify-between">
            <AddProductImages
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
            />
            <AddProductCategories form={form} />
            <AddProductWarehouses form={form} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="lg:hidden bg-primary p-4 rounded-md flex items-center justify-between gap-2 mt-4">
        <div className="flex items-end justify-end gap-2 w-full">
          <Button
            className="rounded-md bg-accent text-primary hover:bg-neutral min-w-30 py-2.5"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <p>Adding product...</p>
              </span>
            ) : (
              <span>Add Product</span>
            )}
          </Button>
          <Button
            className="rounded-md bg-primary text-accent border border-accent hover:bg-primary hover:border-destructive hover:text-destructive min-w-30 py-2.5"
            type="button"
            disabled={isSubmitting}
            asChild
          >
            <Link href="/products">Cancel</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
