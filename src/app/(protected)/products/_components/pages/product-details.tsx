"use client";

import Image from "next/image";
import Link from "next/link";
import ErrorPage from "@/app/error";
import CustomLoader from "@/core/components/elements/loader";
import { Button } from "@/core/components/ui/button";
import { ProductType, WarehouseType } from "@/core/schema/types";
import { Package, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { getProduct } from "@/core/services/product-service";

interface ParamProps {
  productId: string;
}

export default function ProductDetailsPage({ productId }: ParamProps) {
  const { data: product, isLoading, error } = getProduct(productId);
  const warehouses = product?.warehouses;

  console.log(product);

  if (error) return <ErrorPage />;
  if (isLoading) return <CustomLoader />;
  if (!product) return null;

  return (
    <div className="space-y-4">
      <PageHeader product={product} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ProductInfoCard product={product} />

        <div className="lg:col-span-3">
          <WarehousesSection warehouses={warehouses} />
        </div>
      </div>
    </div>
  );
}

function PageHeader({ product }: { product: ProductType }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-primary p-4 rounded-md shadow-sm">
      <div>
        <h1 className="text-2xl lg:text-3xl text-center md:text-left font-bold tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            {product.sku}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* <EditProductSheet product={product} />
        <DeleteProductDialog product={product} /> */}
      </div>
    </div>
  );
}

function ProductInfoCard({ product }: { product: ProductType }) {
  return (
    <Card className="bg-primary border-none shadow-sm">
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-5 w-5" />
            <span>Inventory</span>
          </div>
          <span className="font-medium">{product.quantity} units</span>
        </div>

        <div>
          <Image
            src={product.images[0].url}
            alt="product img"
            width={100}
            height={100}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Pricing & Stock
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Price</span>
              <span className="font-medium">${product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cost</span>
              <span className="font-medium">${product.cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Restock Level</span>
              <span className="font-medium">{product.restockLevel}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WarehousesSection({ warehouses }: { warehouses?: WarehouseType[] }) {
  if (!warehouses || warehouses.length === 0) {
    return (
      <Card className="bg-primary shadow-sm border-0">
        <CardContent className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">
            Product Not in Warehouses
          </h3>
          <p className="mt-2 text-gray-500">
            This product isn't stored in any warehouses yet.
          </p>
          <Button className="mt-6">Assign to Warehouse</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {warehouses.map((warehouse) => (
        <WarehouseCard key={warehouse.id} warehouse={warehouse} />
      ))}
    </div>
  );
}

function WarehouseCard({ warehouse }: { warehouse: WarehouseType }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link href={`/warehouses/${warehouse.id}`}>
        <CardContent className="flex gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
            <Package className="h-8 w-8 text-gray-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{warehouse.name}</h3>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{warehouse.location || "N/A"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium text-sky-600">
                  {warehouse.capacity || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
