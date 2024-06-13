'use client';

import type { ProcessedOrder } from '@/types/order';

import { useTransition } from 'react';
import { useOrders } from '@/store/use-orders';
import { deleteConsignment, reprintLabel } from '@/actions/history';

import { BanIcon, DownloadIcon, MoreHorizontalIcon } from 'lucide-react';

import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  order: ProcessedOrder;
};
export const Actions = ({ order }: Props) => {
  const [pending, startTransition] = useTransition();
  const { setConsignmentLink } = useOrders();

  const handleDeleteClick = async () => {
    if (pending) return;
    startTransition(async () => {
      deleteConsignment(order)
        .then((data) => {
          if (data?.error) {
            toast.error(`Failed to cancel Order ${order.order_number}`, {
              description: data.error,
            });
            return;
          }
          setConsignmentLink(order.order_number, null);
          toast.success(`Order ${order.order_number} cancelled successfully`);
        })
        .catch(() => {
          toast.error(`Failed to cancel Order ${order.order_number}`, {
            description:
              'An unknown error has occurred. Please try again later',
          });
        });
    });
  };

  const handleDownloadClick = () => {
    if (pending) return;
    startTransition(async () => {
      reprintLabel(order.consignment_number)
        .then((data) => {
          if (data?.error) {
            toast.error(
              `Failed to download label for Order ${order.order_number}`,
              {
                description: data.error,
              },
            );
            return;
          }
          window.location.assign(data.success!);
        })
        .catch(() => {
          toast.error(`Failed to cancel Order ${order.order_number}`, {
            description:
              'An unknown error has occurred. Please try again later',
          });
        });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' disabled={pending}>
          <span className='sr-only'>Open menu</span>
          {pending ? (
            <Loader className='size-4' />
          ) : (
            <MoreHorizontalIcon className='size-4' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDownloadClick}
          disabled={
            order.consignment_number === 'UNKNOWN' ||
            order.consignment_number === ''
          }
        >
          <DownloadIcon className='mr-2 size-4' />
          Reprint
        </DropdownMenuItem>

        <DropdownMenuItem
          className='text-destructive focus:bg-destructive/10 focus:text-destructive'
          onClick={handleDeleteClick}
        >
          <BanIcon className='mr-2 size-4' />
          <span>Cancel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
