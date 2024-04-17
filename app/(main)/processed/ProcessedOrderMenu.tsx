'use client';

import { deleteConsignment } from '@/actions/history';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';

import { DownloadIcon, MoreVerticalIcon, TrashIcon } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

type Props = {
  consignmentNumber: string;
  labelUrl: string | null;
};
export const ProcessedOrderMenu = ({ consignmentNumber, labelUrl }: Props) => {
  const [pending, startTransition] = useTransition();

  const handleDeleteClick = async () => {
    if (pending) return;
    startTransition(async () => {
      deleteConsignment(consignmentNumber)
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
        {labelUrl && (
          <DropdownMenuItem asChild>
            <Link href={labelUrl}>
              <DownloadIcon className='mr-2 size-4' />
              Download
            </Link>
          </DropdownMenuItem>
        )}
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
