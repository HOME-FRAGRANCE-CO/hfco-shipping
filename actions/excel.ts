import { toast } from 'sonner';
import { predefinedHeaders } from '@/constants';
import { containsAllElements } from '@/utils';
import ExcelJS from 'exceljs';
import type { Order } from '@/types';

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

          if (!containsAllElements(header, predefinedHeaders)) {
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
              const extractedOrderNumber = orderNumber.substring(2);

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
