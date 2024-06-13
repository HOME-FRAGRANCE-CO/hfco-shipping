import { db } from './db';

export const getProcessedOrders = async () => {
  const processedOrders = await db.consignment.findMany({
    where: {
      fulfillment_date: {
        not: null,
      },
    },
    orderBy: {
      id: 'desc',
    },
  });
  return processedOrders;
};
