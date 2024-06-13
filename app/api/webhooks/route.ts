import { db } from '@/prisma/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { toZonedTime } from 'date-fns-tz';
import { shopifyQueryAPI } from '@/actions/process';
import type { FulfillmentOrderResponse } from '@/types/response';

const timezone = 'Australia/Sydney';

type WebhookData = {
  fulfillment_order: {
    id: string;
    status: string;
    request_id: string;
  };
};

export async function POST(req: NextRequest) {
  if (!req.body) {
    return NextResponse.json(
      { message: 'Request body is required' },
      { status: 400 },
    );
  }

  const hmac = req.headers.get('X-Shopify-hmac-sha256');
  const textBody = await req.text();

  const genHmac = await createHmac(
    process.env.SHOPIFY_WEBHOOK_SECRET!,
    textBody,
  );

  const hmacMatches = genHmac === hmac;

  if (!hmacMatches) {
    return NextResponse.json(
      { message: 'HMAC verification failed' },
      { status: 401 },
    );
  }

  const { id } = (JSON.parse(textBody) as WebhookData).fulfillment_order;

  const fulfillmentOrderIdQuery = {
    query: ` {
    fulfillmentOrder(id: "${id}") {
      orderName
    }
  }`,
  };

  const response = await shopifyQueryAPI(fulfillmentOrderIdQuery);

  const data = (await response.json()) as FulfillmentOrderResponse;

  const order_number = data.data.fulfillmentOrder.orderName;

  await db.consignment.upsert({
    where: {
      order_number: order_number,
    },
    update: {
      processed_date: toZonedTime(new Date(), timezone),
    },
    create: {
      order_number: order_number,
      consignment_number: '',
      processed_date: toZonedTime(new Date(), timezone),
    },
  });

  return NextResponse.json({ message: 'Webhook processed successfully' });
}

async function createHmac(secret: string, message: string) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const data = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, data);

  const hashArray = Array.from(new Uint8Array(signature));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  return hashBase64;
}
