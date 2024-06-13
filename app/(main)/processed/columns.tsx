'use client';

import type { ProcessedOrder } from '@/types/order';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDownIcon } from 'lucide-react';
import { Actions } from './Actions';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export const columns: ColumnDef<ProcessedOrder>[] = [
  {
    accessorKey: 'order_number',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Order Number
          <ArrowUpDownIcon className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'consignment_number',
    header: 'Consignment Number',
  },
  {
    accessorKey: 'processed_date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Processed Date
          <ArrowUpDownIcon className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.processed_date;

      if (!date) {
        return (
          <div className='font-medium italic text-muted-foreground'>
            Unknown
          </div>
        );
      }

      const formatted = format(date, 'eee MMMM dd');

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    accessorKey: 'fulfillment_date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fulfillment Date
          <ArrowUpDownIcon className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.original.fulfillment_date;

      if (!date) {
        return (
          <div className='font-medium italic text-muted-foreground'>
            Not fulfilled
          </div>
        );
      }

      const formatted = format(date, 'eee MMMM dd');

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <Actions order={row.original} />;
    },
  },
];
