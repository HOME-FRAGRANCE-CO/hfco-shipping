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
} from './ui/form';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { readExcelFile } from '@/actions/excel';
import type { Order } from '@/types';
import { toast } from 'sonner';

const formSchema = z.object({
    file: z
        .union([z.instanceof(File), z.instanceof(FileList)])
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

type Props = {
    setOrders: (orders: Order[]) => void;
};

export function InputFile({ setOrders }: Props) {
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
        <div className='grid w-full max-w-sm items-center gap-1.5'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                        accept='.xlsx'
                                        {...fileRef}
                                        onChange={(event) => {
                                            field.onChange(
                                                event.target?.files?.[0] ??
                                                    undefined,
                                            );
                                        }}
                                        onDrop={(event) => {
                                            field.onChange(
                                                event.dataTransfer.files?.[0],
                                            );
                                            console.log(field.value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit'>Submit</Button>
                </form>
            </Form>
        </div>
    );
}
