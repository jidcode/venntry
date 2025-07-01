import { RiStore2Fill } from "react-icons/ri";
import AddWarehouseSheet from "../forms/add-warehouse";

export default function NoWarehousesPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-primary text-secondary min-h-[90vh] text-center p-6 rounded-md">
      <RiStore2Fill size={90} className="mb-6 text-neutral" />

      <h2 className="text-2xl lg:text-3xl font-bold mb-4">
        No Warehouses Found
      </h2>

      <p className="mb-6 max-w-md">
        You currently have no warehouses. Add your first warehouse to start
        managing your storage facilities and inventory.
      </p>

      <div>
        <AddWarehouseSheet />
      </div>
    </div>
  );
}
