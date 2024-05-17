//Order Object Types

export type Order = {
  orderNumber: string;
  EPAC: string;
  orderRows: OrderRow[];
  totalWeight: number;
  authorityToLeave: boolean;
  deliveryNotes: string;
  consignmentLink: string | null;
};

export type OrderRow = {
  packageType: 'Carton' | 'Pallet';
  Length: number;
  Width: number;
  Height: number;
  Quantity: number;
};
export type CustomerDetails = {
  custRef: string;
  companyName: string;
  custName: string;
  addressOne: string;
  addressTwo: string;
  suburb: string;
  postcode: string;
  province: string;
  phone: string;
  email: string;
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
  companyName: string;
  orderNotes: string | null;
  customerNotes: string | null;
  companyNotes: string | null;
  locationNotes: string | null;
};
