import type { Customer } from '@/types/customer';
import { toast } from 'sonner';
import ExcelJS from 'exceljs';
import { Readable } from 'stream';
import { containsAllElements } from '@/utils';
import { csvHeaders } from '@/constants';

export const readCSVFile = async (file: File): Promise<Customer[]> => {
  const workbook = new ExcelJS.Workbook();
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const buffer = reader.result as ArrayBuffer;
      const readable = new Readable();
      readable.push(new Uint8Array(buffer));
      readable.push(null);
      await workbook.csv.read(readable).then((workbook) => {
        if (!workbook) {
          toast.error('Invalid file format', {
            description: 'Check the headers in the file and try again.',
          });
          reject('Invalid file format');
          return;
        }
        const header = workbook.getRow(1).values as string[];

        if (!containsAllElements(header, csvHeaders)) {
          toast.error('Invalid file format');
          reject('Invalid file format');
          return;
        }
        toast.success('File uploaded successfully');

        const customers: Customer[] = [];

        workbook.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;
          const values = row.values as string[];
          const customer: Customer = {
            companyName: values[1],
            custName: values[2],
            phone: values[3].toString(),
            address: {
              lineOne: values[4],
              zip: values[5].toString(),
              city: values[6],
              province: values[7],
              countryCode: values[8],
            },
            email: values[9],
          };
          customers.push(customer);
        });
        resolve(customers);
      });
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsArrayBuffer(file);
  });
};
