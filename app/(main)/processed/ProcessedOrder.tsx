'use client';

import { deleteConsignment } from '@/actions/history';
import { Button } from '@/components/ui/button';
import type { ProcessedOrder as ProcessedOrderType } from '@/types';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { TrashIcon } from 'lucide-react';
import { Loader } from '@/components/ui/loader';

type Props = {
    processedOrder: ProcessedOrderType;
};
export const ProcessedOrder = ({ processedOrder }: Props) => {
    const [pending, startTransition] = useTransition();

    const handleDeleteClick = async () => {
        if (pending) return;
        startTransition(async () => {
            deleteConsignment(processedOrder.consignment_number)
                .then(() => {
                    toast.success('Consignment deleted');
                })
                .catch((error: Error) => {
                    toast.error('Failed to delete consignment', {
                        description: error.message,
                    });
                });
        });
    };

    return (
        <div className='flex gap-2'>
            <h1>{processedOrder.order_number}</h1>
            <Button
                variant='destructive'
                size='icon'
                onClick={handleDeleteClick}
            >
                {pending ? <Loader className='text-white' /> : <TrashIcon />}
            </Button>
        </div>
    );
};
