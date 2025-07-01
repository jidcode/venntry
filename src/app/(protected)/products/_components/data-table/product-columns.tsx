"use client";

import { ProductType, ImageType } from "@/core/schema/types";
import { ColumnDef } from "@tanstack/react-table";
import { RiArrowRightUpLine } from "react-icons/ri";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";

export const productColumns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "images",
    header: () => (
      <div className="text-secondary text-xs px-4 uppercase font-semibold">
        Image
      </div>
    ),
    enableSorting: false,
    cell: ({ row }) => {
      const images = row.getValue("images") as ImageType[];
      const primaryImage = images?.find((img) => img.isPrimary) || images?.[0];

      return primaryImage ? (
        <Image
          src={primaryImage.url}
          alt={row.getValue("name") as string}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-sm"
        />
      ) : (
        <Image
          src="/placeholder.jpg"
          alt={row.getValue("name") as string}
          width={64}
          height={64}
          className="w-16 h-16 object-cover rounded-sm"
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="max-w-60 min-w-30 h-full overflow-hidden">
          <p className="font-medium line-clamp-2 text-sm text-ellipsis break-words">
            {name}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "brand",
    header: "Brand",
    enableSorting: true,
    cell: ({ row }) => {
      const brand = row.getValue("brand") as string | null;
      return brand ? (
        <div className="max-w-40 h-full overflow-hidden">
          <p className="line-clamp-2 text-ellipsis break-words">{brand}</p>
        </div>
      ) : (
        <span>—</span>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    enableSorting: true,
  },
  {
    accessorKey: "quantity",
    header: "In Stock",
    enableSorting: true,
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      const restockLevel = row.original.restockLevel || 0;
      const textColor =
        quantity < restockLevel ? "text-destructive" : "text-accent";

      return (
        <span className={`font-medium ${textColor}`}>
          {quantity.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return (
        <span className="text-emerald-700 dark:text-emerald-300 font-medium">
          ${(price / 100).toFixed(2)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <span className="text-sm">
          {formatDistanceToNow(date, {
            addSuffix: true,
            includeSeconds: false,
          }).replace(/^about /, "")}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    enableSorting: true,
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"));
      return (
        <span className="text-sm">
          {formatDistanceToNow(date, {
            addSuffix: true,
            includeSeconds: false,
          }).replace(/^about /, "")}
        </span>
      );
    },
  },
  {
    id: "view",
    header: "",
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <Link
          href={`/products/${row.original.id}`}
          className="hover:bg-gray-100 p-2 rounded-md transition-colors"
        >
          <RiArrowRightUpLine className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </Link>
      );
    },
  },
];
