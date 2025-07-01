"use client";

import ErrorPage from "@/app/error";
import CustomLoader from "@/core/components/elements/loader";
import NoProductsPage from "./_components/pages/no-products";
import { getAllProducts } from "@/core/services/product-service";
import { ProductsTable } from "./_components/data-table/products-table";
import { productColumns } from "./_components/data-table/product-columns";
import { Button } from "@/core/components/ui/button";
import Link from "next/link";
import { BiSolidPlusCircle } from "react-icons/bi";

export default function ProductsPage() {
  const { data: products, isLoading, error } = getAllProducts();
  const totalCount = products?.length;

  if (error) return <ErrorPage />;
  if (isLoading) return <CustomLoader />;
  if (totalCount == 0) return <NoProductsPage />;

  return (
    <>
      <PageHeader totalCount={totalCount} />

      <div className="container mx-auto py-4">
        {products && <ProductsTable columns={productColumns} data={products} />}
      </div>
    </>
  );
}

function PageHeader({ totalCount }: { totalCount: number | undefined }) {
  return (
    <div className="flex items-center justify-between h-full bg-primary p-4 rounded-sm">
      <div className="flex items-center gap-2">
        <h1 className="text-xl lg:text-2xl text-secondary font-medium">
          Products
        </h1>
        <span className="bg-muted text-foreground min-w-8 p-1 rounded-lg grid place-content-center">
          {totalCount}
        </span>
      </div>

      <Button asChild>
        <Link href="/products/new">
          <BiSolidPlusCircle className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </Button>
    </div>
  );
}
