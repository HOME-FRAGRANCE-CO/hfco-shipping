import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Select, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';

export default function Loading() {
  return (
    <div>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Filter order numbers...'
          className='max-w-sm'
          disabled
        />
      </div>
      <div className='rounded-md border'>
        <Table className='w-[825px]'>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant='ghost'
                  className='disabled:opacity-100'
                  disabled
                >
                  Order Number
                  <ArrowUpDownIcon className='ml-2 h-4 w-4' />
                </Button>
              </TableHead>
              <TableHead>Consignment Number</TableHead>
              <TableHead>
                <Button
                  variant='ghost'
                  className='disabled:opacity-100'
                  disabled
                >
                  Processed Date
                  <ArrowUpDownIcon className='ml-2 h-4 w-4' />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant='ghost'
                  className='disabled:opacity-100'
                  disabled
                >
                  Fulfillment Date
                  <ArrowUpDownIcon className='ml-2 h-4 w-4' />
                </Button>
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between px-2 py-2'>
        <div className='flex-1 text-sm'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Rows per page</p>
            <Select disabled>
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder='10' />
              </SelectTrigger>
            </Select>
          </div>
        </div>
        <div className='flex items-center space-x-6 lg:space-x-8'>
          <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
            <Skeleton className='h-4 w-[75px]' />
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              disabled
            >
              <span className='sr-only'>Go to first page</span>
              <ChevronsLeftIcon className='h-4 w-4' />
            </Button>
            <Button variant='outline' className='h-8 w-8 p-0' disabled>
              <span className='sr-only'>Go to previous page</span>
              <ChevronLeftIcon className='h-4 w-4' />
            </Button>
            <Button variant='outline' className='h-8 w-8 p-0' disabled>
              <span className='sr-only'>Go to next page</span>
              <ChevronRightIcon className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              disabled
            >
              <span className='sr-only'>Go to last page</span>
              <ChevronsRightIcon className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SkeletonRow = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className='h-4 w-[60px]' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-[120px]' />
      </TableCell>
      <TableCell>
        <Skeleton className='mx-auto h-4 w-[100px] ' />
      </TableCell>
      <TableCell>
        <Skeleton className='mx-auto h-4 w-[100px]' />
      </TableCell>
      <TableCell>
        <Button variant='ghost' size='icon' disabled>
          <MoreHorizontalIcon className='size-4' />
        </Button>
      </TableCell>
    </TableRow>
  );
};
