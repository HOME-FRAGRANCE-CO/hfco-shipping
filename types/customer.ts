// Customer Object Types
export type Customer = {
  companyName: string;
  custName: string;
  email: string;
  phone: string;
  address: CustomerAddress;
};

export type CustomerAddress = {
  lineOne: string;
  zip: string;
  city: string;
  province?: string;
  countryCode: string;
};
