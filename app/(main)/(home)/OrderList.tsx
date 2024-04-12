import type { Order } from '@/types';
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
import { useTransition } from 'react';
import { toast } from 'sonner';
import { processOrder } from '@/actions/process';

type Props = {
    orders: Order[];
};

export const OrderList = ({ orders }: Props) => {
    return (
        <>
            <ul className='grid grid-cols-2 gap-x-4 gap-y-8'>
                {orders.map((order) => (
                    <Order key={order.orderNumber} order={order} />
                ))}
            </ul>
        </>
    );
};

const Order = ({ key, order }: { key: string; order: Order }) => {
    const [pending, startTransition] = useTransition();

    const handleProcessClick = (order: Order) => {
        if (pending) return;
        startTransition(() => {
            processOrder(order)
                .then(() => {
                    toast.success(
                        `Order ${order.orderNumber} processed successfully`,
                    );
                })
                .catch((error: Error) => {
                    toast.error(`Failed to process ${order.orderNumber}`, {
                        description: error.message,
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

    return (
        <div
            key={key}
            className='rounded-lg border-2 border-slate-200 shadow-lg'
        >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[150px]'>
                            {order.orderNumber}
                        </TableHead>
                        <TableHead>Length</TableHead>
                        <TableHead>Width</TableHead>
                        <TableHead>Height</TableHead>
                        <TableHead className='text-right'>Quantity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {order.orderRows.map((orderRow, index) => (
                        <TableRow key={index}>
                            <TableCell className='font-medium'>
                                {order['Carton/Pallet']}
                            </TableCell>
                            <TableCell className='text-right'>
                                {orderRow.Length}
                            </TableCell>
                            <TableCell className='text-right'>
                                {orderRow.Width}
                            </TableCell>
                            <TableCell className='text-right'>
                                {orderRow.Height}
                            </TableCell>
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
            <div className='flex justify-end p-2'>
                <Button
                    onClick={() => {
                        handleProcessClick(order);
                    }}
                >
                    Process
                </Button>
            </div>
        </div>
    );
};
