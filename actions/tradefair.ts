'use server';
import type { Customer } from '@/types/customer';
import type { CreateCompanyResponse } from '@/types/response';

const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;

const companyCreateMutation = `
mutation companyCreate($input: CompanyCreateInput!) {
  companyCreate(input: $input) {
    company {
      id
      name
      customerSince
    }
 
    userErrors {
      field
      message
    }
  }
}
`;

export const createCustomer = async (customer: Customer) => {
  // const input = {
  //   company: {
  //     name: customer.companyName,
  //     note: '',
  //   },
  //   companyContact: {
  //     email: customer.email,
  //     firstName: customer.custName.split(' ')[0],
  //     lastName: customer.custName.split(' ')[1],
  //     phone: customer.phone,
  //     title: 'Location Admin',
  //   },
  //   companyLocation: {
  //     billingSameAsShipping: true,
  //     buyerExperienceConfiguration: {
  //       checkoutToDraft: true,
  //       editableShippingAddress: false,
  //       paymentTermsTemplateId: 'gid://shopify/PaymentTermsTemplate/4',
  //     },
  //     externalId: '',
  //     name: customer.companyName,
  //     note: '',
  //     phone: customer.phone,
  //     shippingAddress: {
  //       address1: customer.address.lineOne,
  //       address2: '',
  //       city: customer.address.city,
  //       countryCode: customer.address.countryCode,
  //       phone: customer.phone,
  //       recipient: customer.custName,
  //       zip: customer.address.zip,
  //       zoneCode: customer.address.province ?? '',
  //     },
  //   },

  const input = {
    company: {
      name: 'Postal Cards Inc UK',
    },
    companyLocation: {
      name: 'Ottawa Postal Cards UK',
      shippingAddress: {
        recipient: 'Avery Brown',
        address1: '150 Elgin Street',
        address2: '8th Floor',
        city: 'Ottawa',
        zoneCode: 'EG-DK',
        zip: '82581',
        countryCode: 'EG',
      },
      billingAddress: {
        recipient: 'Avery Brown',
        address1: '150 Elgin Street',
        address2: '8th Floor',
        city: 'Ottawa',
        zoneCode: 'GB-ENG',
        zip: '82581',
        countryCode: 'EG',
      },
      // billingSameAsShipping: true,
    },
    companyContact: {
      email: 'avery.brown2@example.com',
      firstName: 'Avery',
      lastName: 'Brown',
    },
  };

  const res = await fetch(storeDomain!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken!,
    },
    body: JSON.stringify({
      query: companyCreateMutation,
      variables: { input: input },
    }),
  });

  const data = (await res.json()) as CreateCompanyResponse;
  console.log(data);

  console.log(data.data);
  if (data.data.companyCreate.userErrors.length > 0) {
    return { error: data.data.companyCreate.userErrors[0].message };
  }
};
