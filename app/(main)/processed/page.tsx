import { getProcessedOrders } from '@/prisma/queries';
import { ProcessedOrdersTable } from './ProcessedOrderTable';

const ProcessedOrdersPage = async () => {
  const processedOrders = await getProcessedOrders();

  return <ProcessedOrdersTable processedOrders={processedOrders} />;
};

export default ProcessedOrdersPage;
