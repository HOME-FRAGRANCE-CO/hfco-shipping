'use client';
import { InputFile } from '@/components/input-file';
import type { Order } from '@/types';
import { useState } from 'react';
import { OrderList } from './OrderList';

const initialOrders: Order[] = [
    {
        orderNumber: '#W1101',
        'Carton/Pallet': 'Carton',
        EPAC: 'EPAC21232321321',
        orderRows: [
            {
                Length: 1,
                Width: 2,
                Height: 3,
                Quantity: 4,
            },
        ],
        totalWeight: 10,
    },
    {
        orderNumber: '#W33333',
        'Carton/Pallet': 'Pallet',
        EPAC: 'EPAC3213213214',
        orderRows: [
            {
                Length: 4,
                Width: 3,
                Height: 2,
                Quantity: 1,
            },
        ],
        totalWeight: 20,
    },
    {
        orderNumber: '#W2612',
        'Carton/Pallet': 'Carton',
        EPAC: 'EPAC23123123',
        orderRows: [
            {
                Length: 5,
                Width: 6,
                Height: 7,
                Quantity: 8,
            },
            {
                Length: 9,
                Width: 10,
                Height: 11,
                Quantity: 12,
            },
            {
                Length: 13,
                Width: 14,
                Height: 15,
                Quantity: 16,
            },
        ],
        totalWeight: 30,
    },
];

export const Excel = () => {
    const [orders, setOrders] = useState<Order[] | null>(initialOrders);

    if (orders) {
        return (
            <div className='flex h-full flex-col justify-between'>
                <h1 className='mb-10 justify-self-center text-xl font-bold'>
                    Order List
                </h1>
                <OrderList orders={orders} />
            </div>
        );
    }
    return (
        <>
            <InputFile setOrders={setOrders} />
        </>
    );
};
