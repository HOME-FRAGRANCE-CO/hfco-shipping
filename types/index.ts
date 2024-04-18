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
  orderNotes: string | null;
  customerNotes: string | null;
  companyNotes: string | null;
  locationNotes: string | null;
};

//API

export interface OrderIDResponse {
  data: {
    orders: {
      edges: {
        node: {
          id?: string;
        };
      }[];
    };
  };
  extensions: Extensions;
}

export interface OrderDetailsResponse {
  data: {
    order: {
      name: string;
      email: string;
      shippingAddress: {
        company: string;
        address1: string;
        address2: string | null;
        city: string;
        zip: string;
        province: string;
        provinceCode: string;
        phone: string;
      };
      billingAddress: {
        firstName: string | null;
        lastName: string;
      };
    };
  };
  extensions: Extensions;
}

export interface OrderNotesResponse {
  data: {
    order: {
      name: string;
      note: string | null;
      customer: {
        note: string | null;
        companyContactProfiles: {
          company: {
            name: string;
            note: string | null;
          };
        }[];
      };
      purchasingEntity: {
        __typename: string;
        location: {
          name: string;
          note: string | null;
        };
      };
    };
  };
  extensions: Extensions;
}

interface Extensions {
  cost: {
    requestedQueryCost: number;
    actualQueryCost: number;
    throttleStatus: {
      maximumAvailable: number;
      currentlyAvailable: number;
      restoreRate: number;
    };
  };
}

export interface DirectFreightResponse {
  ResponseCode: string;
  ResponseMessage: string;
  LabelURL: string;
  ConsignmentList: Consignment[];
}

export interface Consignment {
  ResponseCode: string;
  ResponseMessage: string;
  ConsignmentId: number;
  Connote: string;
  ConnoteDate: string;
  SortCode: string;
}

export interface CancelConsignmentResponse {
  ResponseCode: string;
  ResponseMessage: string;
  ConnoteList: Connote[];
}

// {
//   ResponseCode: '300',
//   ResponseMessage: 'OK',
//   LabelURL:
//     'https://www.directfreight.com.au/dispatch/ViewConnoteLabelsAPI.aspx?id=F8D6F7D2-85B1-4475-89C3-9577A5C4F44F',
//   LabelPDF: null,
//   ConnoteList: [
//     {
//       Connote: '2424382059951',
//       ResponseCode: '200',
//       ResponseMessage: 'OK'
//     }
//   ]
// }

export interface ReprintLabelResponse {
  ResponseCode: string;
  ResponseMessage: string;
  LabelURL: string | null;
  LabelPDF: string | null;
  ConnoteList: Connote[];
}

export interface Connote {
  Connote: string;
  ResponseCode: string;
  ResponseMessage: string;
}
