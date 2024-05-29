'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Refresh } from './refresh';
import { ProcessedOrderMenu } from './ProcessedOrderMenu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type ProcessedOrderTableProps = {
  processedOrders: {
    id: number;
    order_number: string;
    consignment_number: string;
    consignment_id: number;
    processed_date: Date | null;
    label_url: string | null;
  }[];
};

export const ProcessedOrdersTable = ({
  processedOrders,
}: ProcessedOrderTableProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(processedOrders.length / rowsPerPage);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);
  const paginatedOrders = processedOrders.slice(startIndex, endIndex);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Order Number</TableHead>
            <TableHead className='w-[250px]'>Consignment Number</TableHead>
            <TableHead className='w-[200px]'>Processed Date</TableHead>
            <TableHead>
              <Refresh />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map((order) => (
            <ProcessedOrderRow order={order} key={order.id} />
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(
                startIndex === 0 ? 'pointer-events-none opacity-50' : '',
              )}
              href='#'
              onClick={() => {
                setStartIndex(startIndex - rowsPerPage);
                setEndIndex(endIndex - rowsPerPage);
              }}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }).map((_, index) => {
            return (
              <PaginationItem key={index}>
                <PaginationLink
                  href='#'
                  onClick={() => {
                    setStartIndex(index * rowsPerPage);
                    setEndIndex((index + 1) * rowsPerPage);
                  }}
                  className={cn(
                    index * rowsPerPage === startIndex ? 'bg-gray-200' : '',
                  )}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              className={cn(
                endIndex === processedOrders.length
                  ? 'pointer-events-none opacity-50'
                  : '',
              )}
              href='#'
              onClick={() => {
                setStartIndex(startIndex + rowsPerPage);
                setEndIndex(endIndex + rowsPerPage);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

type ProcessedOrderRowProps = {
  order: {
    id: number;
    order_number: string;
    consignment_number: string;
    consignment_id: number;
    processed_date: Date | null;
    label_url: string | null;
  };
  key: number;
};
const ProcessedOrderRow = ({ order, key }: ProcessedOrderRowProps) => {
  return (
    <TableRow key={key}>
      <TableCell>{order.order_number}</TableCell>
      <TableCell>{order.consignment_number}</TableCell>
      <TableCell>{order.processed_date?.toDateString()}</TableCell>
      <TableCell>
        <ProcessedOrderMenu
          orderNumber={order.order_number}
          consignmentNumber={order.consignment_number}
        />
      </TableCell>
    </TableRow>
  );
};
