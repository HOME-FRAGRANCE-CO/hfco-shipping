import type { Order } from '@/types/order';

import { toast } from 'sonner';

import ExcelJS from 'exceljs';

import { excelHeaders } from '@/constants';
import { containsAllElements } from '@/utils';

/**
 * Reads an Excel file provided by EWE and extracts orders from it
 * @param file - Excel file to read
 * @returns Orders extracted from the Excel file as an array of Order objects
 */
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
          toast.info('Remember to book a pick up.', {
            duration: 10000,
            action: {
              label: 'Book pick up',
              onClick: () => {
                window.open(
                  'https://www.directfreight.com.au/dispatch/AddPickupSelectAddress.aspx',
                  '_blank',
                );
              },
            },
            actionButtonStyle: {
              backgroundColor: '#0973DC',
              color: 'white',
              fontWeight: 'semibold',
            },
          });

          let currentOrderNumber: string | null = null;
          const orders: Order[] = [];

          sheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
            if (rowNumber === 1) return; // Skip header row
            const orderNumber = row.getCell('A').value as string;

            if (
              orderNumber === null &&
              (row.getCell('D').value === null ||
                row.getCell('E').value === null ||
                row.getCell('F').value === null)
            )
              return resolve(orders);

            if (orderNumber !== null) {
              const extractedOrderNumber = orderNumber
                .trim()
                .replace(/hf/gi, '');

              // If a new order number is encountered, create a new order object
              if (extractedOrderNumber !== currentOrderNumber) {
                currentOrderNumber = extractedOrderNumber;

                let packageType: 'Carton' | 'Pallet';
                if (
                  (row.getCell('D').value as number) < 85 &&
                  (row.getCell('E').value as number) < 85 &&
                  (row.getCell('F').value as number) < 85
                ) {
                  packageType = 'Carton';
                } else {
                  packageType = 'Pallet';
                }

                orders.push({
                  orderNumber: extractedOrderNumber,
                  EPAC: row.getCell('B').value as string,
                  orderRows: [],
                  totalWeight: row.getCell('H').value as number,
                });
                orders[orders.length - 1].orderRows.push({
                  packageType: packageType,
                  Length: row.getCell('D').value as number,
                  Width: row.getCell('E').value as number,
                  Height: row.getCell('F').value as number,
                  Quantity: row.getCell('G').value as number,
                });
              }
            } else {
              // If order number is null, insert row data into the previous order object
              if (currentOrderNumber !== null) {
                const previousOrder = orders[orders.length - 1];
                let packageType: 'Carton' | 'Pallet';
                if (
                  (row.getCell('D').value as number) < 85 &&
                  (row.getCell('E').value as number) < 85 &&
                  (row.getCell('F').value as number) < 85
                ) {
                  packageType = 'Carton';
                } else {
                  packageType = 'Pallet';
                }
                //Add weight if row is not merged
                (!row.getCell('H').isMerged ||
                  //or row is merged but previous package type is different
                  (row.getCell('H').isMerged &&
                    previousOrder.orderRows[previousOrder.orderRows.length - 1]
                      .packageType != packageType)) &&
                  (previousOrder.totalWeight += row.getCell('H')
                    .value as number);

                previousOrder.orderRows.push({
                  packageType: packageType,
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
