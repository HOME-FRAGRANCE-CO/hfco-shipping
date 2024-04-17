'use client';
import { InputFile } from '@/components/input-file';
import type { Order } from '@/types';
import { useState } from 'react';
import { OrderList } from './OrderList';

export const Excel = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);

  if (orders) {
    const totalCartons = orders.reduce((acc, order) => {
      return (
        acc +
        order.orderRows.reduce((acc, row) => {
          return acc + row.Quantity;
        }, 0)
      );
    }, 0);

    const totalPallets = Math.ceil(totalCartons / 30 + 1);
    return (
      <div className='flex h-full flex-col justify-between'>
        <h1 className='mb-10 flex items-center justify-between justify-self-center text-xl font-bold'>
          Order List
          <div className='flex gap-2 text-lg'>
            <span>Total Cartons: {totalCartons}</span>
            <span>Total Pallets: {totalPallets}</span>
          </div>
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
