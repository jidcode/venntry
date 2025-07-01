import { Button } from "@/core/components/ui/button";
import Link from "next/link";
import { BiSolidPlusCircle } from "react-icons/bi";
import { RiBox2Fill } from "react-icons/ri";

export default function NoProductsPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-primary text-secondary min-h-[90vh] text-center p-6 rounded-md">
      <RiBox2Fill size={90} className="mb-6 text-neutral" />

      <h2 className="text-2xl lg:text-3xl font-bold mb-4">No Products Found</h2>

      <p className="mb-6 max-w-md">
        You currently have no products. Add your first product to start managing
        your inventory.
      </p>

      <Button asChild>
        <Link href="/products/new">
          <BiSolidPlusCircle className="w-5 h-5" />
          <span>Add Product</span>
        </Link>
      </Button>
    </div>
  );
}
