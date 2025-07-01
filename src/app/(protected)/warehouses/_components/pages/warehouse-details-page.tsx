"use client";

import Image from "next/image";
import Link from "next/link";
import ErrorPage from "@/app/error";
import CustomLoader from "@/core/components/elements/loader";
import { Button } from "@/core/components/ui/button";
import { ProductType, WarehouseType } from "@/core/schema/types";
import { LocateIcon, Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/badge";
import { getWarehouse } from "@/core/services/warehouse-service";
import DeleteWarehouseDialog from "../forms/delete-warehouse";
import EditWarehouseSheet from "../forms/edit-warehouse";

interface ParamProps {
  warehouseId: string;
}

export default function WarehouseDetailsPage({ warehouseId }: ParamProps) {
  const { data: warehouse, isLoading, error } = getWarehouse(warehouseId);
  const products = warehouse?.products;

  if (error) return <ErrorPage />;
  if (isLoading) return <CustomLoader />;
  if (!warehouse) return null;

  return (
    <div className="space-y-4">
      <PageHeader warehouse={warehouse} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <WarehouseInfoCard warehouse={warehouse} />

        <div className="lg:col-span-3">
          <ProductsSection products={products} />
        </div>
      </div>
    </div>
  );
}

function PageHeader({ warehouse }: { warehouse: WarehouseType }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-primary p-4 rounded-md shadow-sm">
      <div>
        <h1 className="text-2xl lg:text-3xl text-center md:text-left font-bold tracking-tight">
          {warehouse.name}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <LocateIcon className="h-4 w-4" />
            {warehouse.location || "No location specified"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <EditWarehouseSheet warehouse={warehouse} />
        <DeleteWarehouseDialog warehouse={warehouse} />
      </div>
    </div>
  );
}

function WarehouseInfoCard({ warehouse }: { warehouse: WarehouseType }) {
  return (
    <Card className="bg-primary border-none shadow-sm">
      <CardHeader>
        <CardTitle>Warehouse Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-5 w-5" />
            <span>Capacity</span>
          </div>
          <span className="font-medium">{warehouse.capacity} units</span>
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Utilization Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Stock</span>
              <span className="font-medium">
                {warehouse.products?.length || 0} products
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Space Used</span>
              <span className="font-medium">
                {warehouse.products?.reduce(
                  (sum, p) => sum + (p.quantity || 0),
                  0
                ) || 0}{" "}
                / {warehouse.capacity} units
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductsSection({ products }: { products?: ProductType[] }) {
  if (!products || products.length === 0) {
    return (
      <Card className="bg-primary shadow-sm border-0">
        <CardContent className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No Products in Warehouse</h3>
          <p className="mt-2 text-gray-500">
            This warehouse doesn't contain any products yet.
          </p>
          <Button className="mt-6">Add Products</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: ProductType }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`}>
        <CardContent className="flex gap-4">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={product.images?.[0]?.url || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover rounded-md"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{product.name}</h3>
            <div className="flex justify-between mt-2">
              <div>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="font-medium">{product.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium text-sky-600">${product.price}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
