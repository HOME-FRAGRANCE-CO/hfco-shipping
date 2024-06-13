import { db } from './db';

export const getProcessedOrders = async () => {
  const processedOrders = await db.consignment.findMany({
    orderBy: {
      id: 'desc',
    },
  });
  return processedOrders;
};
