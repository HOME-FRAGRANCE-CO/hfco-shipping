'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useOrders } from '@/store/use-orders';
import type { OrderRow } from '@/types/order';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircleIcon, PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export const AddOrder = () => {
  const [orderRows, setOrderRows] = useState<OrderRow[]>([]);
  const [open, setOpen] = useState(false);
  const { orders, setOrders } = useOrders();

  const formSchema = z.object({
    orderNumber: z.string().regex(/^#W.{4}$/, {
      message: 'Must be in format "#WXXXX"',
    }),
    EPAC: z.string(),
    orderRows: z.array(
      z.object({
        packageType: z.enum(['Carton', 'Pallet']),
        Length: z.number({ coerce: true }),
        Width: z.number({ coerce: true }),
        Height: z.number({ coerce: true }),
        Quantity: z.number({ coerce: true }),
      }),
    ),
    totalWeight: z.number({ coerce: true }).positive(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: '',
      EPAC: '',
    },
  });

  const handleAddOrderRow = () => {
    setOrderRows((prev) => [
      ...prev,
      { packageType: 'Carton', Length: 0, Width: 0, Height: 0, Quantity: 0 },
    ]);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (orders.find((order) => order.orderNumber === values.orderNumber)) {
      form.setError('orderNumber', {
        type: 'manual',
        message: 'Order number already exists',
      });
      return;
    }
    setOrders([...orders, values]);
    toast.success('Order added successfully');
    setOpen(false);
    form.reset();
    orderRows.length = 0;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='flex gap-1'>
          <PlusIcon className='size-5' />
          Add Order
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Add order</DialogTitle>
          <DialogDescription>
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Table>
              <TableHeader className=''>
                <TableRow>
                  <TableHead className='w-[150px]'>
                    <FormField
                      control={form.control}
                      name='orderNumber'
                      render={({ field }) => (
                        <FormItem>
                          <Input {...field} placeholder='Order No.' />
                          <FormMessage className='col-span-4' />
                        </FormItem>
                      )}
                    />
                  </TableHead>
                  <TableHead>Length</TableHead>
                  <TableHead>Width</TableHead>
                  <TableHead>Height</TableHead>
                  <TableHead className='text-right'>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='max-h-[100px]'>
                {orderRows.map((orderRow, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium'>
                      <FormField
                        control={form.control}
                        name={`orderRows.${index}.packageType`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select Type' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value='Carton'>Carton</SelectItem>
                                <SelectItem value='Pallet'>Pallet</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <FormField
                        control={form.control}
                        name={`orderRows.${index}.Length`}
                        render={({ field }) => (
                          <FormItem>
                            <Input {...field} type='number' />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <FormField
                        control={form.control}
                        name={`orderRows.${index}.Width`}
                        render={({ field }) => (
                          <FormItem>
                            <Input {...field} type='number' />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className='text-right'>
                      <FormField
                        control={form.control}
                        name={`orderRows.${index}.Height`}
                        render={({ field }) => (
                          <FormItem>
                            <Input {...field} type='number' />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className='absolute text-right'>
                      <FormField
                        control={form.control}
                        name={`orderRows.${index}.Quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <Input {...field} type='number' />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className='absolute right-1 top-0 size-6 rounded-full bg-transparent p-1 text-rose-600 hover:bg-rose-200'
                        onClick={() => {
                          setOrderRows((prev) => {
                            const newRows = [...prev];
                            newRows.splice(index, 1);
                            return newRows;
                          });
                          form.setValue(
                            'orderRows',
                            orderRows.filter((_, i) => i !== index),
                          );
                        }}
                      >
                        <XIcon className='size-5' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} className=''>
                    <Button
                      type='button'
                      variant={'outline'}
                      size={'icon'}
                      className='w-full'
                      onClick={handleAddOrderRow}
                    >
                      <PlusCircleIcon className='size-5' />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} className='font-bold'>
                    Total Weight
                  </TableCell>
                  <TableCell className='font-bold'>
                    <FormField
                      control={form.control}
                      name='totalWeight'
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            {...field}
                            type='number'
                            className='w-[75px]'
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <DialogFooter>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
