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
    extensions: Extensions;
}

export interface OrderDetailsResponse {
    data: {
        order: {
            name: string;
            email: string;
            shippingAddress: {
                company: string;
                address1: string;
                address2: string | null;
                city: string;
                zip: string;
                province: string;
                provinceCode: string;
                phone: string;
            };
            billingAddress: {
                firstName: string | null;
                lastName: string;
            };
        };
    };
    extensions: Extensions;
}

interface Extensions {
    cost: {
        requestedQueryCost: number;
        actualQueryCost: number;
        throttleStatus: {
            maximumAvailable: number;
            currentlyAvailable: number;
            restoreRate: number;
        };
    };
}

// {
//     ResponseCode: '300',
//     ResponseMessage: 'OK',
//     LabelURL:
//       'https://www.directfreight.com.au/dispatch/ViewConnoteLabelsAPI.aspx?id=B5A66B55-73FB-4CD1-B6BB-9BDFCAD618F7',
//     ConsignmentList: [
//       {
//         ResponseCode: '200',
//         ResponseMessage: 'Record created successfully.',
//         ConsignmentId: 1701549180,
//         Connote: '2424382038481',
//         ConnoteDate: '2024-04-12T00:00:00',
//         SortCode: '4B242 B101'
//       }
//     ]
//   }

export interface DirectFreightResponse {
    ResponseCode: string;
    ResponseMessage: string;
    LabelURL: string;
    ConsignmentList: Consignment[];
}

export interface Consignment {
    ResponseCode: string;
    ResponseMessage: string;
    ConsignmentId: number;
    Connote: string;
    ConnoteDate: string;
    SortCode: string;
}
