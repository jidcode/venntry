"use client";

import { ProductRequest, productSchema } from "@/core/schema/validator";
import { ProductService } from "@/core/services/product-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateProductForm from "../_components/forms/create-product";
import { ImageItem } from "../_components/forms/add-images";
import { uploadSelectedImages } from "@/core/lib/files";

export default function NewProductPage() {
  const [errorResponse, setErrorResponse] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);

  const { createProduct } = ProductService();

  const form = useForm<ProductRequest>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      quantity: 0,
      restockLevel: 0,
      optimalLevel: 0,
      images: [],
      categories: [],
      warehouses: [],
    },
  });

  const action: SubmitHandler<ProductRequest> = async (data) => {
    setErrorResponse(null);

    const imageRequest = await uploadSelectedImages(
      selectedImages.filter((item) => item instanceof File) as File[]
    );

    const response = await createProduct({
      ...data,
      images: imageRequest,
    });

    console.log(response);

    if (response?.error) {
      setErrorResponse(response.error.message || "Request failed!");
    } else if (response?.success) {
      form.reset();
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(action)}
      className="flex flex-col min-h-screen w-full mx-auto"
    >
      <CreateProductForm
        form={form}
        errorResponse={errorResponse}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
      />
    </form>
  );
}
