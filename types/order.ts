//Order Object Types

export type Order = {
  orderNumber: string;
  'Carton/Pallet': 'Carton' | 'Pallet';
  EPAC: string;
  orderRows: OrderRow[];
  totalWeight: number;
};

export type OrderRow = {
  Length: number;
  Width: number;
  Height: number;
  Quantity: number;
};

export type ProcessedOrder = {
  id: number;
  order_number: string;
  consignment_number: string;
  consignment_id: number;
  processed_date: Date | null;
  label_url: string | null;
};

export type OrderNotes = {
  orderUrl: string;
  orderNotes: string | null;
  customerNotes: string | null;
  companyNotes: string | null;
  locationNotes: string | null;
};
