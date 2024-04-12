export type Order = {
    orderNumber: string;
    'Carton/Pallet': 'Carton' | 'Pallet';
    EPAC: string;
    orderRows: OrderRow[];
    totalWeight: number;
};

export type OrderRow = {
    Length: number;
    Width: number;
    Height: number;
    Quantity: number;
};

export interface OrderIDResponse {
    data: {
        orders: {
            edges: {
                node: {
                    id?: string;
                };
            }[];
        };
    };
    extensions: {
        cost: {
            requestedQueryCost: number;
            actualQueryCost: number;
            throttleStatus: {
                maximumAvailable: number;
                currentlyAvailable: number;
                restoreRate: number;
            };
        };
    };
}
