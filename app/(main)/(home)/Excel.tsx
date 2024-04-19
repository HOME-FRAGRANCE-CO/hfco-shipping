'use client';
import { InputFile } from '@/app/(main)/(home)/input-file';
import { OrderList } from './OrderList';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { useOrders } from '@/store/use-orders';

export const Excel = () => {
  const { orders, resetOrders } = useOrders();

  if (orders.length > 0) {
    const counters = {
      Carton: 0,
      Pallet: 0,
    };

    orders.forEach((order) => {
      const type = order['Carton/Pallet'];
      const quantity = order.orderRows.reduce(
        (acc, row) => acc + row.Quantity,
        0,
      );

      if (type === 'Carton') {
        counters.Carton += quantity;
      } else if (type === 'Pallet') {
        counters.Pallet += quantity;
      }
    });

    const requiredPallets =
      Math.ceil(counters.Carton / 30) + counters.Pallet + 1;

    return (
      <div className='flex h-full flex-col justify-between'>
        <h1 className='mb-10 flex items-center justify-between justify-self-center text-xl font-bold'>
          <div className='flex items-center justify-center gap-4'>
            Order List
            <Button
              size='icon'
              variant='destructive'
              onClick={() => {
                resetOrders();
              }}
            >
              <TrashIcon />
            </Button>
          </div>
          <div className='flex gap-2 text-lg'>
            <span>Total Cartons: {counters.Carton}</span>
            <span>Total Pallets Required: {requiredPallets}</span>
          </div>
        </h1>

        <OrderList orders={orders} />
      </div>
    );
  }
  return (
    <>
      <InputFile />
    </>
  );
};
