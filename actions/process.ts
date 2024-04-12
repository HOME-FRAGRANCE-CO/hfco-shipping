'use server';
import { db } from '@/prisma/db';
import type { Order, OrderIDResponse } from '@/types';
import { error } from 'console';

const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;

const DF_apiUrl = process.env.DF_API_URL;
const DF_auth = process.env.DF_AUTHORISATION;
const DF_accNum = process.env.DF_ACCOUNT_NUMBER;
const DF_senderSiteId = process.env.DF_SENDER_SITE_ID;

export const processOrder = async (order: Order) => {
    const orderID = await getOrderId(order.orderNumber);
    if (!orderID) {
        throw new Error('Order not found');
    }
    const alreadyProcessed = await db.consignment.findFirst({
        where: {
            order_number: order.orderNumber,
            consignment_number: {
                not: null,
            },
        },
    });
    if (alreadyProcessed) {
        throw new Error('Order already processed');
    }
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

    const response = await fetch(storeDomain!, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken ?? '',
        },
        body: JSON.stringify(queryBody),
    });

    const data = (await response.json()) as OrderIDResponse;
    if (!data.data.orders.edges[0]) {
        return;
    }
    const orderID = data.data.orders.edges[0].node.id;

    return orderID;
};
