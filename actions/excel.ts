import { toast } from 'sonner';
import { csvHeaders, excelHeaders } from '@/constants';
import { containsAllElements } from '@/utils';
import ExcelJS from 'exceljs';
import type { Customer, Order } from '@/types';
import { read } from 'fs';
import { Readable } from 'stream';

export const readExcelFile = async (file: File): Promise<Order[]> => {
  const workbook = new ExcelJS.Workbook();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const buffer = reader.result as ArrayBuffer;
      await workbook.xlsx
        .load(buffer)
        .then((workbook) => {
          const sheet = workbook.getWorksheet(1);
          if (!sheet) {
            toast.error('Invalid file format', {
              description: 'Check the headers in the file and try again.',
            });
            reject('Invalid file format');
            return;
          }
          const header = sheet.getRow(1).values as string[];

          if (!containsAllElements(header, excelHeaders)) {
            toast.error('Invalid file format');
            reject('Invalid file format');
            return;
          }
          toast.success('File uploaded successfully');

          let currentOrderNumber: string | null = null;
          const orders: Order[] = [];

          sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header row
            const orderNumber = row.getCell('A').value as string;

            if (orderNumber !== null) {
              // Extracting order number without the first 2 characters
              const extractedOrderNumber = orderNumber.trim().substring(2);

              // If a new order number is encountered, create a new order object
              if (extractedOrderNumber !== currentOrderNumber) {
                currentOrderNumber = extractedOrderNumber;
                orders.push({
                  orderNumber: extractedOrderNumber,
                  EPAC: row.getCell('B').value as string,
                  'Carton/Pallet': row.getCell('C').value as
                    | 'Carton'
                    | 'Pallet',
                  orderRows: [],
                  totalWeight: row.getCell('H').value as number,
                });
                orders[orders.length - 1].orderRows.push({
                  Length: row.getCell('D').value as number,
                  Width: row.getCell('E').value as number,
                  Height: row.getCell('F').value as number,
                  Quantity: row.getCell('G').value as number,
                });
              }
            } else {
              // If order number is null, insert row data into the last order object
              if (currentOrderNumber !== null) {
                const lastOrder = orders[orders.length - 1];
                lastOrder.orderRows.push({
                  Length: row.getCell('D').value as number,
                  Width: row.getCell('E').value as number,
                  Height: row.getCell('F').value as number,
                  Quantity: row.getCell('G').value as number,
                });
              }
            }
          });
          resolve(orders);
        })
        .catch((error: Error) => {
          toast.error(error.message);
        });
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsArrayBuffer(file);
  });
};

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
