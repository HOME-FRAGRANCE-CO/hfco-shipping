'use client';

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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { readCSVFile } from '@/actions/csv';
import type { Customer } from '@/types';
import { toast } from 'sonner';

const formSchema = z.object({
  file: z
    .union([z.instanceof(File), z.unknown()])
    .refine(
      (value) =>
        (value instanceof File && value.size > 0) ||
        (value instanceof FileList && value.length > 0),
      {
        message: 'File is required',
      },
    )
    .refine(
      (value) =>
        (value instanceof File && value.type === 'text/csv') ||
        (value instanceof FileList &&
          Array.from(value).every((file) => file.type === 'text/csv')),
      {
        message: 'File must be a CSV file',
      },
    ),
});

type Props = {
  setCustomers: (customers: Customer[]) => void;
};

export function TradefairInput({ setCustomers }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const fileRef = form.register('file', { required: true });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let data;
    if (values.file instanceof File) {
      data = await readCSVFile(values.file);
    } else if (values.file instanceof FileList) {
      data = await readCSVFile(values.file[0]);
    }
    if (!data) {
      toast.error('Invalid file format');
      return;
    }
    setCustomers(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex items-end gap-2'
      >
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  placeholder='File'
                  type='file'
                  accept='.csv'
                  {...fileRef}
                  onChange={(event) => {
                    field.onChange(event.target?.files?.[0] ?? undefined);
                  }}
                  onDrop={(event) => {
                    field.onChange(event.dataTransfer.files?.[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Upload</Button>
      </form>
    </Form>
  );
}
