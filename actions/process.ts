'use server';
import { db } from '@/prisma/db';
import type {
  DirectFreightResponse,
  Order,
  OrderDetailsResponse,
  OrderIDResponse,
  OrderNotesResponse,
  OrderRow,
} from '@/types';

const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;

const DF_apiUrl = process.env.DF_API_URL;
const DF_auth = process.env.DF_AUTHORISATION;
const DF_accNum = process.env.DF_ACCOUNT_NUMBER;
const DF_senderSiteId = process.env.DF_SENDER_SITE_ID;

export const processOrder = async (
  order: Order & {
    deliveryNotes: string;
    authorityToLeave: boolean;
  },
) => {
  const orderID = await getOrderId(order.orderNumber);
  if (!orderID) {
    return { error: 'Order not found' };
  }
  const alreadyProcessed = await db.consignment.findFirst({
    where: {
      order_number: order.orderNumber,
    },
  });
  if (alreadyProcessed) {
    return { error: 'Order already processed' };
  }

  const orderDetails = await getOrderDetails(orderID);
  if (!orderDetails) {
    return { error: 'Failed to get order details' };
  }
  const consignmentID = await getConsignmentIDNumber();
  if (!consignmentID) {
    return { error: 'Failed to get consignment ID' };
  }

  const consignmentData = createConsignmentData(
    order,
    orderDetails,
    consignmentID,
  );
  if (!consignmentData) {
    return { error: 'Failed to create consignment data' };
  }
  const consignmentAPIResponse = await sendConsignmentData(
    JSON.stringify(consignmentData),
  );
  const consignment = consignmentAPIResponse.ConsignmentList[0];
  console.log(consignmentAPIResponse);
  if (
    !(
      consignmentAPIResponse.ResponseCode === '300' &&
      consignment.ResponseCode === '200'
    )
  ) {
    return { error: 'Failed to create consignment' };
  }

  const consignmentRecord = await db.consignment.create({
    data: {
      order_number: order.orderNumber,
      consignment_id: consignmentID,
      consignment_number: consignment.Connote,
      label_url: consignmentAPIResponse.LabelURL,
    },
  });
  console.log(consignmentRecord);
  return { success: consignmentAPIResponse.LabelURL };
};

const getOrderId = async (orderNumber: string) => {
  const queryBody = {
    query: `
      {
        orders(first: 1, query: "name:${orderNumber}") {
          edges {
            node {
              id
            }
          }
        }
      }
    `,
  };

  const response = await shopifyQueryAPI(queryBody);

  const data = (await response.json()) as OrderIDResponse;

  console.log(data);
  if (!data.data.orders.edges[0]) {
    return;
  }
  const orderID = data.data.orders.edges[0].node.id;

  return orderID;
};

async function getOrderDetails(orderID: string) {
  const orderIDQuery = {
    query: `
      {
        order(id: "${orderID}") {
          name
          email
          shippingAddress {
            company
            address1
            address2
            city
            zip
            province
            provinceCode
            phone
          }
          billingAddress {
            firstName
            lastName
          }
        }
      }
    `,
  };

  const response = await shopifyQueryAPI(orderIDQuery);

  const data = (await response.json()) as OrderDetailsResponse;

  return {
    custRef: data.data.order.name,
    companyName: data.data.order.shippingAddress.company,
    custName: data.data.order.billingAddress.lastName,
    addressOne: data.data.order.shippingAddress.address1,
    addressTwo: data.data.order.shippingAddress.address2 ?? '',
    suburb: data.data.order.shippingAddress.city,
    postcode: data.data.order.shippingAddress.zip,
    province: data.data.order.shippingAddress.provinceCode,
    phone: data.data.order.shippingAddress.phone || '',
    email: data.data.order.email,
  };
}

const shopifyQueryAPI = async (queryBody: { query: string }) => {
  const response = await fetch(storeDomain!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken ?? '',
    },
    body: JSON.stringify(queryBody),
  });

  return response;
};

const getConsignmentIDNumber = async () => {
  try {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const consignmentIdCandidate =
        Math.floor(Math.random() * (2147483647 - 130 + 1)) + 130;

      // Check if the generated ConsignmentId is unique
      const isUnique = await isConsignmentIDUnique(consignmentIdCandidate);

      if (isUnique) {
        // If unique, return the ConsignmentId
        return consignmentIdCandidate;
      }
      // If not unique, try again
      attempts++;
    }
    return;
  } catch (error) {
    return;
  } finally {
    await db.$disconnect();
  }
};

const isConsignmentIDUnique = async (consignmentId: number) => {
  const existingConsignment = await db.consignment.findFirst({
    where: {
      consignment_id: consignmentId,
    },
  });

  return !existingConsignment;
};

const createConsignmentData = (
  order: Order & {
    deliveryNotes: string;
    authorityToLeave: boolean;
  },
  orderDetails: {
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
  },
  consignmentID: number,
) => {
  const consignmentData = {
    ConsignmentList: [
      {
        ConsignmentId: consignmentID,
        ConnoteDate: '',
        CustomerReference: orderDetails.custRef,
        IsConsolidate: true,
        ReceiverDetails: {
          ReceiverName: orderDetails.companyName,
          AddressLine1: orderDetails.addressOne,
          AddressLine2: orderDetails.addressTwo,
          Suburb: orderDetails.suburb,
          Postcode: orderDetails.postcode,
          State: orderDetails.province,
          DeliveryInstructions: order.deliveryNotes,
          isAuthorityToLeave: order.authorityToLeave,
          ReceiverContactName:
            orderDetails.custName || orderDetails.companyName,
          ReceiverContactMobile: orderDetails.phone,
          ReceiverContactEmail: orderDetails.email,
        },

        ConsignmentLineItems: order.orderRows.map((row) => ({
          PackageDescription: order['Carton/Pallet'].toUpperCase(),
          Items: row.Quantity,
          Kgs: calculateLineKgs(order, row),
          Length: row.Length,
          Width: row.Width,
          Height: row.Height,
          Cubic: ((row.Length * row.Width * row.Height) / 1000000).toFixed(3),
        })),
      },
    ],
  };

  return consignmentData;
};

const calculateLineKgs = (order: Order, row: OrderRow) => {
  const totalQuantity = order.orderRows.reduce(
    (acc, row) => acc + row.Quantity,
    0,
  );

  return (row.Quantity / totalQuantity) * order.totalWeight;
};

const sendConsignmentData = async (consignmentBody: string) => {
  const response = await fetch(DF_apiUrl!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorisation: DF_auth!,
      AccountNumber: DF_accNum!,
      SiteId: DF_senderSiteId!,
    },
    body: consignmentBody,
  });

  const data = (await response.json()) as DirectFreightResponse;
  console.log(data);

  return data;
};

//Order Notes
export const getOrderNotes = async (orderNumber: string) => {
  const orderID = await getOrderId(orderNumber);
  if (!orderID) {
    throw new Error('Order not found');
  }
  const orderNotesQuery = {
    query: `{
    order(id: "${orderID}") {
      name
      customer {
        note
        companyContactProfiles {
          company {
            name
            note
          }
        }
      }
      purchasingEntity {
        ... on PurchasingCompany {
          __typename
          location {
            name
            note
          }
        }
      }
    }
  }`,
  };

  const response = await shopifyQueryAPI(orderNotesQuery);

  const data = (await response.json()) as OrderNotesResponse;
  return {
    customerNotes: data.data.order.customer.note,
    companyNotes:
      data.data.order.customer.companyContactProfiles[0].company.note,
    locationNotes: data.data.order.purchasingEntity.location.note,
  };
};
