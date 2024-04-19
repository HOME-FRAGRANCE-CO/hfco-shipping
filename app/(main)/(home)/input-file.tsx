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
} from '../../../components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../../../components/ui/button';
import { readExcelFile } from '@/actions/excel';
import { toast } from 'sonner';
import { useOrders } from '@/store/use-orders';

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
        (value instanceof File &&
          value.type ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
        (value instanceof FileList &&
          Array.from(value).every(
            (file) =>
              file.type ===
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          )),
      {
        message: 'File must be an Excel file',
      },
    ),
});

export function InputFile() {
  const { setOrders } = useOrders();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const fileRef = form.register('file', { required: true });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let data;

    if (values.file instanceof File) {
      data = await readExcelFile(values.file);
    } else if (values.file instanceof FileList) {
      data = await readExcelFile(values.file[0]);
    }
    if (!data) {
      toast.error('Invalid file format');
      return;
    }
    setOrders(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <div className='flex gap-2'>
                <FormControl>
                  <Input
                    placeholder='File'
                    type='file'
                    accept='.xlsx'
                    {...fileRef}
                    onChange={(event) => {
                      field.onChange(event.target?.files?.[0] ?? undefined);
                    }}
                    onDrop={(event) => {
                      field.onChange(event.dataTransfer.files?.[0]);
                    }}
                  />
                </FormControl>
                <Button type='submit'>Upload</Button>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
