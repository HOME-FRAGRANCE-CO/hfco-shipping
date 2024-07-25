'use client';
import { useOrders } from '@/store/use-orders';

import Info from '@/components/features/labels/info';
import { Button } from '@/components/ui/button';
import { OrderList } from '@/components/features/labels/order-list';
import { InputFile } from '@/components/features/labels/input-file';

import { TrashIcon } from 'lucide-react';

export default function Home() {
  const { orders, resetOrders } = useOrders();

  return (
    <main className='flex flex-col items-center justify-center pt-6'>
      <div className='flex w-full justify-between'>
        <div />
        <Info />
        <div />
      </div>

      <div className='self-start'>
        {orders.length > 0 ? (
          <div className='flex h-full flex-col justify-between'>
            <h1 className='mb-10 flex items-center justify-between justify-self-center text-xl font-bold'>
              <div className='flex items-center justify-center gap-4'>
                Order List
                <Button size='icon' variant='destructive' onClick={resetOrders}>
                  <TrashIcon />
                </Button>
              </div>
            </h1>

            <OrderList orders={orders} />
          </div>
        ) : (
          <InputFile />
        )}
      </div>
    </main>
  );
}
