'use client';

import type { Customer } from '@/types/customer';

import { Input } from '@/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { createCustomer } from '@/actions/tradefair';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';

type Props = {
  customers: Customer[];
};

export const CustomerList = ({ customers }: Props) => {
  return (
    <div className='grid gap-4'>
      {customers.map((customer, index) => (
        <Customer key={index} index={index} customer={customer} />
      ))}
    </div>
  );
};

const formSchema = z.object({
  companyName: z.string(),
  custName: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.object({
    lineOne: z.string(),
    province: z.string().optional(),
    city: z.string(),
    zip: z.string(),
    countryCode: z.string(),
  }),
});

const Customer = ({
  customer,
  index,
}: {
  customer: Customer;
  index: number;
}) => {
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: customer.companyName,
      custName: customer.custName,
      phone: customer.phone,
      email: customer.email,
      address: {
        lineOne: customer.address.lineOne,
        province: customer.address.province,
        city: customer.address.city,
        zip: customer.address.zip,
        countryCode: customer.address.countryCode,
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (pending) return;
    startTransition(() => {
      createCustomer(values)
        .then((data) => {
          if (data?.error) {
            toast.error(
              `Failed to create company ${customer.companyName} in Shopify`,
              {
                description: data.error,
              },
            );
            return;
          }
          toast.success(
            `Successfully created company ${customer.companyName}`,
            {
              description: 'The company has been created in Shopify',
            },
          );
        })
        .catch(() => {
          toast.error(
            `Failed to create company ${customer.companyName} in Shopify`,
            {
              description: 'An unknown error occurred',
            },
          );
        });
    });
  }
  return (
    <>
      <h2 className='font-bold'>Customer {index + 1}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid grid-cols-2 gap-2 rounded-md border-2 border-neutral-200 p-4 shadow-md'>
            <>
              <FormField
                control={form.control}
                name='companyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='custName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
            <>
              <FormField
                control={form.control}
                name='address.lineOne'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line One</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='address.province'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-2'>
                <FormField
                  control={form.control}
                  name='address.city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='address.zip'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='address.countryCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          </div>
          <div className='flex justify-end py-2'>
            <Button type='submit' disabled={pending}>
              {pending ? <Loader className='text-white' /> : 'Create Company'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
