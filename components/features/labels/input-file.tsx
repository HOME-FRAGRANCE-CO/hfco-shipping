'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useOrders } from '@/store/use-orders';
import { readExcelFile } from '@/actions/excel';
import { useState } from 'react';

import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

import { UploadIcon } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    let data;

    try {
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
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    form.setValue('file', file);
    await form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='file'
          render={({ field }) => (
            <FormItem>
              <div className='mt-4 flex flex-col items-center'>
                <FormControl>
                  <div
                    className={`w-full max-w-md  rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                      isDragging
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    } ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <UploadIcon
                      className={`mx-auto h-12 w-12 ${isDragging ? 'text-orange-600' : 'text-gray-400'}`}
                    />
                    <div className='mt-4 flex text-sm leading-6 text-gray-600'>
                      <label
                        htmlFor='file-upload'
                        className='relative cursor-pointer rounded-md bg-white font-semibold text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-600 focus-within:ring-offset-2 hover:text-orange-500'
                      >
                        <span>Upload a file</span>
                        <input
                          id='file-upload'
                          type='file'
                          className='sr-only'
                          accept='.xlsx'
                          disabled={isUploading}
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              handleFileUpload(file).catch(() => {
                                form.setValue('file', null);
                              });
                            }
                          }}
                        />
                      </label>
                      <p className='pl-1'>or drag and drop</p>
                    </div>
                    <p className='mt-2 text-xs leading-5 text-gray-600'>
                      {isUploading
                        ? 'Uploading...'
                        : field.value instanceof File
                          ? field.value.name
                          : 'Excel files only'}
                    </p>
                  </div>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
