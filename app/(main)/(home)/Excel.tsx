'use client';
import { Button } from '@/components/ui/button';
import { OrderList } from './OrderList';
import { InputFile } from '@/app/(main)/(home)/input-file';

import { useOrders } from '@/store/use-orders';

import { TrashIcon } from 'lucide-react';

export const Excel = () => {
  const { orders, resetOrders } = useOrders();

  if (orders.length > 0) {
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
