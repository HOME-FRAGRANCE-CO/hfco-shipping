'use client';

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

import { deleteConsignment, reprintLabel } from '@/actions/history';
import { useTransition } from 'react';

import { DownloadIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react';

type Props = {
  orderNumber: string;
  consignmentNumber: string;
};
export const ProcessedOrderMenu = ({
  orderNumber,
  consignmentNumber,
}: Props) => {
  const [pending, startTransition] = useTransition();

  const handleDeleteClick = async () => {
    if (pending) return;
    startTransition(async () => {
      deleteConsignment(consignmentNumber)
        .then((data) => {
          if (data?.error) {
            toast.error(`Failed to cancel Order ${orderNumber}`, {
              description: data.error,
            });
            return;
          }
          window.localStorage.removeItem(`consignmentLink-${orderNumber}`);
          toast.success(`Order ${orderNumber} deleted successfully`);
        })
        .catch(() => {
          toast.error(`Failed to cancel Order ${orderNumber}`, {
            description:
              'An unknown error has occurred. Please try again later',
          });
        });
    });
  };

  const handleDownloadClick = () => {
    if (pending) return;
    startTransition(async () => {
      reprintLabel(consignmentNumber)
        .then((data) => {
          if (data?.error) {
            toast.error(`Failed to download label for Order ${orderNumber}`, {
              description: data.error,
            });
            return;
          }
          window.location.assign(data.success!);
        })
        .catch(() => {
          toast.error(`Failed to cancel Order ${orderNumber}`, {
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
            <MoreVerticalIcon className='size-4' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleDownloadClick}>
          <DownloadIcon className='mr-2 size-4' />
          Reprint
        </DropdownMenuItem>

        <DropdownMenuItem
          className='text-destructive focus:bg-destructive/10 focus:text-destructive'
          onClick={handleDeleteClick}
        >
          <TrashIcon className='mr-2 size-4' />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
