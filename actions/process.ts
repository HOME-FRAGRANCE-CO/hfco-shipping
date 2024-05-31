'use server';

import type { CustomerDetails, Order } from '@/types/order';
import type {
  DirectFreightResponse,
  OrderDetailsResponse,
  OrderIDResponse,
  OrderNotesResponse,
} from '@/types/response';

import { db } from '@/prisma/db';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

import * as dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import 'dayjs/locale/en-au';
import { extractOrderNumber } from '@/utils';

//* Australian Timezone for database
dayjs.locale('en-au');
dayjs.extend(utc);
dayjs.extend(tz);

const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
//* Shopify API Documentation: https://shopify.dev/docs/api/admin-graphql

const DF_apiUrl = process.env.DF_API_URL;
const DF_auth = process.env.DF_AUTHORISATION;
const DF_accNum = process.env.DF_ACCOUNT_NUMBER;
const DF_senderSiteId = process.env.DF_SENDER_SITE_ID;

//* Direct Freight Consignment API Documentation: https://www.directfreight.com.au/Dispatch/DeveloperHome.aspx

/**
 * Processes an order by fetching order data from Shopify and
 * creating a consignment then storing it in the database
 * @param order - The order to be processed
 * @returns consignment link if successful, error message if failed
 */

export const processOrder = async (
  order: Order & {
    deliveryNotes: string;
    authorityToLeave: boolean;
  },
) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorised');
  }

  const orderID = await getOrderId(extractOrderNumber(order.orderNumber));
  if (!orderID) {
    return { error: 'Order not found' };
  }
  // Search database if order number has already been processed
  const alreadyProcessed = await db.consignment.findFirst({
    where: {
      order_number: order.orderNumber,
    },
  });
  if (alreadyProcessed) {
    return { error: 'Order already processed' };
  }

  const customerDetails = await getCustomerDetails(orderID);

  if (!customerDetails) {
    return { error: 'Failed to get order details' };
  }
  const consignmentID = await getConsignmentIDNumber();
  if (!consignmentID) {
    return { error: 'Failed to get consignment ID' };
  }

  const consignmentData = createConsignmentData(
    order,
    customerDetails,
    consignmentID,
  );
  if (!consignmentData) {
    return { error: 'Failed to create consignment data' };
  }

  const consignmentAPIResponse = await sendConsignmentData(
    JSON.stringify(consignmentData),
  );
  const consignment = consignmentAPIResponse.ConsignmentList[0];
  if (
    !(
      consignmentAPIResponse.ResponseCode === '300' &&
      consignment.ResponseCode === '200'
    )
  ) {
    return { error: 'Failed to create consignment' };
  }

  // Store consignment data in database
  await db.consignment.create({
    data: {
      order_number: order.orderNumber,
      consignment_id: consignmentID,
      consignment_number: consignment.Connote,
      label_url: consignmentAPIResponse.LabelURL,
      processed_date: dayjs
        .utc()
        .tz('Australia/Sydney')
        .format()
        .substring(0, 19)
        .concat('Z'),
    },
  });
  revalidatePath('/processed');
  return { success: consignmentAPIResponse.LabelURL };
};

/**
 * Fetches the order ID from Shopify using the order number
 * @param orderNumber - The order number to be searched for in Shopify
 * @example
 * ```ts
 * getOrderId('#W1234')
 * ```
 * Returns 'gid://shopify/Order/1234567890'
 *
 * @returns The order ID
 */

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

  if (!data.data.orders.edges[0]) {
    return;
  }
  const orderID = data.data.orders.edges[0].node.id;

  return orderID;
};

/**
 * Fetches the order details from Shopify using the order ID
 * @param orderID - The order ID to be used to fetch order details from Shopify
 * @returns The customer details
 */

async function getCustomerDetails(orderID: string) {
  const orderIDQuery = {
    query: `
      {
        order(id: "${orderID}") {
          name
          email
          shippingAddress {
            company
            firstName
            lastName
            address1
            address2
            city
            zip
            province
            provinceCode
            phone
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
    custName:
      data.data.order.shippingAddress.firstName +
        ' ' +
        data.data.order.shippingAddress.lastName ||
      data.data.order.shippingAddress.company,
    addressOne: data.data.order.shippingAddress.address1,
    addressTwo: data.data.order.shippingAddress.address2 ?? '',
    suburb: data.data.order.shippingAddress.city,
    postcode: data.data.order.shippingAddress.zip,
    province: data.data.order.shippingAddress.provinceCode,
    phone: data.data.order.shippingAddress.phone || '',
    email: data.data.order.email,
  } as CustomerDetails;
}

/**
 * Sends a query to the Shopify GraphQL API
 * @param queryBody - The GraphQL query to be sent to the Shopify API
 * @returns The response from the Shopify API
 */
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

/**
 * Helper function to get a unique consignment ID number
 * @returns A unique consignment ID number
 */

const getConsignmentIDNumber = async () => {
  while (true) {
    const consignmentIdCandidate =
      Math.floor(Math.random() * (2147483647 - 130 + 1)) + 130;

    // Check if the generated ConsignmentId is unique
    const isUnique = await isConsignmentIDUnique(consignmentIdCandidate);

    if (isUnique) {
      // If unique, return the ConsignmentId
      return consignmentIdCandidate;
    }
    // If not unique, try again
  }
};
/**
 * Checks if a consignment ID is unique in the database
 * @param consignmentId - The consignment ID to be checked for uniqueness
 * @returns if the consignment ID is unique
 *
 * @remarks Direct Freight API requires consignment IDs to be unique
 */
const isConsignmentIDUnique = async (consignmentId: number) => {
  const existingConsignment = await db.consignment.findFirst({
    where: {
      consignment_id: consignmentId,
    },
  });

  return !existingConsignment;
};

/**
 * Creates the consignment data to be sent to the Direct Freight API
 * @param order - Order details
 * @param customerDetails  - Customer details
 * @param consignmentID - Unique consignment ID
 * @returns Consignment data to be sent to Direct Freight API
 */
const createConsignmentData = (
  order: Order & {
    deliveryNotes: string;
    authorityToLeave: boolean;
  },
  customerDetails: CustomerDetails,
  consignmentID: number,
) => {
  const consignmentData = {
    ConsignmentList: [
      {
        ConsignmentId: consignmentID,
        ConnoteDate: '',
        CustomerReference: customerDetails.custRef,
        IsConsolidate: false,
        ReceiverDetails: {
          ReceiverName: customerDetails.companyName,
          AddressLine1: customerDetails.addressOne,
          AddressLine2: customerDetails.addressTwo,
          Suburb: customerDetails.suburb,
          Postcode: customerDetails.postcode,
          State: customerDetails.province,
          DeliveryInstructions: order.deliveryNotes,
          isAuthorityToLeave: order.authorityToLeave,
          ReceiverContactName:
            customerDetails.custName || customerDetails.companyName,
          ReceiverContactMobile: customerDetails.phone,
          ReceiverContactEmail: customerDetails.email,
        },

        ConsignmentLineItems: order.orderRows.map((row) => ({
          PackageDescription: row.packageType.toUpperCase(),
          Items: row.Quantity,
          Kgs: calculateLineKgs(
            order.orderRows.reduce((acc, row) => acc + row.Quantity, 0),
            order.totalWeight,
            row.Quantity,
          ),
          Length: row.Length,
          Width: row.Width,
          Height: row.Height,
          Cubic: Number(
            ((row.Length * row.Width * row.Height) / 1000000).toFixed(3),
          ),
        })),
      },
    ],
  };
  console.log(consignmentData);
  return consignmentData;
};

/**
 * Helper function to calculate the weight of a line
 * @param totalQuantity - Total quantity of all items in the order
 * @param totalWeight - Total weight of all items in the order
 * @param rowQuantity - Quantity of the line
 * @returns
 */
const calculateLineKgs = (
  totalQuantity: number,
  totalWeight: number,
  rowQuantity: number,
) => {
  const weight = Math.ceil((rowQuantity / totalQuantity) * totalWeight);

  return weight;
};

/**
 * Sends the consignment data to the Direct Freight API
 * @param consignmentBody - The consignment data to be sent to the Direct Freight API
 * @returns The response from the Direct Freight API
 */
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

/**
 * Fetches the order notes from Shopify using the order number
 * @param orderNumber - The order number to be searched for in Shopify
 * @returns The Order URL, Customer Notes, Company Notes, Location Notes and Order Notes
 */
export const getOrderNotes = async (orderNumber: string) => {
  const orderID = await getOrderId(extractOrderNumber(orderNumber));
  if (!orderID) {
    throw new Error('Order not found');
  }
  const orderNotesQuery = {
    query: `{
    order(id: "${orderID}") {
      name
      note
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

  const orderUrl =
    'https://admin.shopify.com/store/home-fragrance-co-au/orders/' +
    orderID.split('gid://shopify/Order/')[1];

  const response = await shopifyQueryAPI(orderNotesQuery);

  const data = (await response.json()) as OrderNotesResponse;

  return {
    orderUrl,
    companyName:
      data.data.order.customer.companyContactProfiles[0].company.name,
    orderNotes: data.data.order.note,
    customerNotes: data.data.order.customer.note,
    companyNotes:
      data.data.order.customer.companyContactProfiles[0].company.note,
    locationNotes: data.data.order.purchasingEntity.location.note,
  };
};
