import { getProcessedOrders } from '@/prisma/queries';

import { DataTable } from '@/components/features/processed/data-table';
import { columns } from '@/components/features/processed/columns';

const ProcessedOrdersPage = async () => {
  const processedOrders = await getProcessedOrders();

  return <DataTable columns={columns} data={processedOrders} />;
};

export default ProcessedOrdersPage;
