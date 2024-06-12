import { getProcessedOrders } from '@/prisma/queries';
import { DataTable } from './DataTable';
import { columns } from './columns';

const ProcessedOrdersPage = async () => {
  const processedOrders = await getProcessedOrders();

  return <DataTable columns={columns} data={processedOrders} />;
};

export default ProcessedOrdersPage;
