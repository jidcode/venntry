import WarehouseDetailsPage from "../_components/pages/warehouse-details-page";

interface ParamProps {
  params: { warehouseId: string };
}

export default async function WarehouseDetails({ params }: ParamProps) {
  const { warehouseId } = params;

  return (
    <div>
      <WarehouseDetailsPage warehouseId={warehouseId} />
    </div>
  );
}
