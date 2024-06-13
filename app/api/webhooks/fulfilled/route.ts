import { db } from '@/prisma/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { toZonedTime } from 'date-fns-tz';

import { createHmac } from 'crypto';

const timezone = 'Australia/Sydney';

type WebhookData = {
  order_number: string;
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

  const genHmac = createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(textBody)
    .digest('base64');

  if (genHmac !== hmac) {
    return NextResponse.json(
      { message: 'HMAC verification failed' },
      { status: 401 },
    );
  }

  const order_number =
    '#W' + (JSON.parse(textBody) as WebhookData).order_number;

  const alreadyProcessed = await db.consignment.findFirst({
    where: {
      order_number,
      label_url: {
        not: null,
      },
      consignment_number: {
        not: '',
      },
      fulfillment_date: {
        not: null,
      },
    },
  });

  if (alreadyProcessed) {
    return NextResponse.json(
      { message: 'Order already processed' },
      { status: 202 },
    );
  }

  await db.consignment.upsert({
    where: {
      order_number,
    },
    update: {
      consignment_number: 'UNKNOWN',
      label_url: 'UNKNOWN',
      fulfillment_date: toZonedTime(new Date(), timezone),
    },
    create: {
      order_number,
      consignment_number: 'UNKNOWN',
      label_url: 'UNKNOWN',
      processed_date: toZonedTime(new Date(), timezone),
      fulfillment_date: toZonedTime(new Date(), timezone),
    },
  });

  return NextResponse.json({ message: 'Webhook processed successfully' });
}
