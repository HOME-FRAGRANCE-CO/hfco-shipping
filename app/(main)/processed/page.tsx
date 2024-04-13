import { getProcessedOrders } from '@/prisma/queries';
import { ProcessedOrder } from './ProcessedOrder';

const ProcessedOrdersPage = async () => {
    const processedOrdersData = getProcessedOrders();
    const [processedOrders] = await Promise.all([processedOrdersData]);

    return (
        <div>
            {processedOrders.map((order) => (
                <ProcessedOrder key={order.id} processedOrder={order} />
            ))}
        </div>
    );
};

export default ProcessedOrdersPage;
