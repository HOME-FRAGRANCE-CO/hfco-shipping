'use client';
import type { OrderNotes, Order } from '@/types/order';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';

import { ArrowUpRightIcon, DownloadIcon } from 'lucide-react';

import { useState, useTransition } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

import { getOrderNotes, processOrder } from '@/actions/process';

type Props = {
  orders: Order[];
};

export const OrderList = ({ orders }: Props) => {
  return (
    <>
      <ul className='grid grid-cols-3 gap-x-4 gap-y-8'>
        {orders.map((order) => (
          <Order key={order.orderNumber} order={order} />
        ))}
      </ul>
    </>
  );
};

type OrderProps = {
  key: string;
  order: Order;
};

const Order = ({ key, order }: OrderProps) => {
  const [pending, startTransition] = useTransition();
  const [deliveryNotes, setDeliveryNotes] = useLocalStorage(
    `deliveryNotes-${order.orderNumber}`,
    '',
  );
  const [consignmentLink, setConsignmentLink] = useLocalStorage<
    string | undefined
  >(`consignmentLink-${order.orderNumber}`, undefined);
  const [authorityToLeave, setAuthorityToLeave] = useLocalStorage(
    `authorityToLeave-${order.orderNumber}`,
    false,
  );
  const [orderNotes, setOrderNotes] = useState<OrderNotes | null>(null);

  const handleProcessClick = (
    order: Order & {
      deliveryNotes: string;
      authorityToLeave: boolean;
    },
  ) => {
    if (pending) return;
    startTransition(() => {
      processOrder(order)
        .then((data) => {
          if (data.error) {
            toast.error(`Failed to process Order ${order.orderNumber}`, {
              description: data.error,
              action: {
                label: 'Retry',
                onClick: () => {
                  handleProcessClick(order);
                },
              },
              actionButtonStyle: {
                backgroundColor: 'red',
                color: 'white',
                fontWeight: 'bold',
              },
            });
            return;
          }
          toast.success(`Order ${order.orderNumber} processed successfully`);
          setConsignmentLink(data.success ?? undefined);
        })
        .catch(() => {
          toast.error(`Failed to process Order ${order.orderNumber}`, {
            description:
              'An error occurred while processing the order. Please try again later.',
            action: {
              label: 'Retry',
              onClick: () => {
                handleProcessClick(order);
              },
            },
            actionButtonStyle: {
              backgroundColor: 'red',
              color: 'white',
              fontWeight: 'bold',
            },
          });
        });
    });
  };

  const handleViewNotesClick = (orderNumber: string) => {
    if (orderNotes) return;
    getOrderNotes(orderNumber)
      .then((notes) => {
        setOrderNotes(notes);
      })
      .catch(() => {
        toast.error('Failed to get order notes', {
          description: 'Please try again later.',
        });
      });
  };

  return (
    <div
      key={key}
      className='flex flex-col justify-between rounded-lg border-2 border-slate-200 bg-white shadow-lg'
    >
      <div className='relative max-h-[180px] overflow-auto rounded-lg '>
        <Table>
          <TableHeader className='sticky top-0 bg-white'>
            <TableRow>
              <TableHead className='w-[150px]'>{order.orderNumber}</TableHead>
              <TableHead>Length</TableHead>
              <TableHead>Width</TableHead>
              <TableHead>Height</TableHead>
              <TableHead className='text-right'>Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='max-h-[100px]'>
            {order.orderRows.map((orderRow, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>
                  {orderRow.packageType}
                </TableCell>
                <TableCell className='text-right'>{orderRow.Length}</TableCell>
                <TableCell className='text-right'>{orderRow.Width}</TableCell>
                <TableCell className='text-right'>{orderRow.Height}</TableCell>
                <TableCell className='text-right'>
                  {orderRow.Quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className='font-bold'>
                Total Weight
              </TableCell>
              <TableCell className='text-right font-bold'>
                {order.totalWeight}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className='p-2'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 py-4'>
            <Checkbox
              onCheckedChange={() => {
                setAuthorityToLeave((prevIsChecked) => !prevIsChecked);
              }}
              checked={authorityToLeave}
              disabled={pending || !!consignmentLink}
            />
            <Label className='text-sm text-slate-400'>
              Authority to Leave?
            </Label>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleViewNotesClick(order.orderNumber)}
              >
                View Order Notes
              </Button>
            </PopoverTrigger>
            <PopoverContent align='start' side='top'>
              {!orderNotes ? (
                <div className='flex items-center justify-center'>
                  <Loader />
                </div>
              ) : (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between '>
                    <h3 className='text-xs font-bold'>
                      {orderNotes.companyName}
                    </h3>
                    <Link href={orderNotes.orderUrl} target='_blank'>
                      <Button
                        variant='secondary'
                        className='group text-xs'
                        size='sm'
                      >
                        Open in Shopify
                        <ArrowUpRightIcon className='ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1' />
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <h4 className=' text-sm font-bold'>Order Notes</h4>
                    <p className='text-xs'>
                      {!orderNotes.orderNotes ? (
                        <span className='italic text-slate-400'>
                          No order notes
                        </span>
                      ) : (
                        orderNotes.orderNotes
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className='text-sm font-bold'>Customer Notes</h4>
                    <p className='text-xs'>
                      {!orderNotes.customerNotes ? (
                        <span className='italic text-slate-400'>
                          No customer notes
                        </span>
                      ) : (
                        orderNotes.customerNotes
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className='text-sm font-bold'>Company Notes</h4>
                    <p className='text-xs'>
                      {!orderNotes.companyNotes ? (
                        <span className='italic text-slate-400'>
                          No company notes
                        </span>
                      ) : (
                        orderNotes.companyNotes
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className='text-sm font-bold'>Location Notes</h4>
                    <p className='text-xs'>
                      {!orderNotes.locationNotes ? (
                        <span className='italic text-slate-400'>
                          No location notes
                        </span>
                      ) : (
                        orderNotes.locationNotes
                      )}
                    </p>
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        <Textarea
          className='resize-none'
          placeholder='Delivery Notes'
          maxLength={255}
          value={deliveryNotes}
          onChange={(e) => setDeliveryNotes(e.target.value)}
          disabled={pending || !!consignmentLink}
        />
      </div>

      <div className='flex justify-end gap-2 border-t p-2'>
        {consignmentLink && (
          <Link
            href={consignmentLink}
            rel='noopener noreferrer'
            target='_blank'
          >
            <Button variant='link' className='flex gap-1'>
              <DownloadIcon className='size-4' />
              Download Label
            </Button>
          </Link>
        )}
        <Button
          disabled={pending || !!consignmentLink}
          onClick={() => {
            handleProcessClick({
              ...order,
              deliveryNotes,
              authorityToLeave,
            });
          }}
        >
          {pending ? (
            <Loader className='size-4 text-white' />
          ) : consignmentLink ? (
            'Processed'
          ) : (
            'Process Order'
          )}
        </Button>
      </div>
    </div>
  );
};
