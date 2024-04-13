import { cache } from 'react';
import { db } from './db';

export const getProcessedOrders = cache(async () => {
    const processedOrders = await db.consignment.findMany({
        take: 20,
        orderBy: {
            id: 'desc',
        },
    });
    return processedOrders;
});
