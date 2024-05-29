import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreVerticalIcon, RotateCwIcon } from 'lucide-react';

export default function Loading() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Order Number</TableHead>
            <TableHead className='w-[250px]'>Consignment Number</TableHead>
            <TableHead className='w-[200px]'>Processed Date</TableHead>
            <TableHead>
              <Button size='icon' variant='ghost' className='group' disabled>
                <RotateCwIcon className={' size-4 animate-spin'} />
              </Button>
            </TableHead>
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
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href=''
              className='pointer-events-none opacity-50'
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='' className='pointer-events-none opacity-50'>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='' className='pointer-events-none opacity-50'>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href='' className='pointer-events-none opacity-50'>
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href=''
              className='pointer-events-none opacity-50'
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

const SkeletonRow = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className='h-4 w-[75px]' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-[125px]' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-[125px]' />
      </TableCell>
      <TableCell>
        <Button variant='ghost' size='icon' disabled>
          <MoreVerticalIcon className='size-4' />
        </Button>
      </TableCell>
    </TableRow>
  );
};
