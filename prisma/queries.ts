import { db } from './db';

export const getProcessedOrders = async () => {
  const processedOrders = await db.consignment.findMany({
    take: 20,
    orderBy: {
      id: 'desc',
    },
  });
  return processedOrders;
};
