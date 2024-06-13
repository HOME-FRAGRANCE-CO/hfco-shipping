//Shopify API Response Types

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
        firstName: string | null;
        lastName: string;
        address1: string;
        address2: string | null;
        city: string;
        zip: string;
        province: string;
        provinceCode: string;
        phone: string;
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

export interface FulfillmentOrderResponse {
  data: {
    fulfillmentOrder: {
      orderName: string;
    };
  };
  extensions: Extensions;
}

export interface CreateCompanyResponse {
  data: {
    companyCreate: {
      company: {
        id: string;
        name: string;
        customerSince: string;
        note: string;
      } | null;
      userErrors: UserError[];
    };
  };
  extensions: Extensions;
}

interface UserError {
  field: string[];
  message: string;
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

//Direct Freight API Response Types

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
