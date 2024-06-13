'use server';

import type {
  CancelConsignmentResponse,
  ReprintLabelResponse,
} from '@/types/response';

import { db } from '@/prisma/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { ProcessedOrder } from '@/types/order';

const DF_apiBaseUrl = 'https://webservices.directfreight.com.au/Dispatch/api/';
const DF_auth = process.env.DF_AUTHORISATION;
const DF_accNum = process.env.DF_ACCOUNT_NUMBER;
const DF_senderSiteId = process.env.DF_SENDER_SITE_ID;

/**
 * Cancels a consignment
 * @param order - Order to cancel consignment
 * @returns API response message
 */
export const deleteConsignment = async (order: ProcessedOrder) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorised');
  }

  if (order.consignment_number !== 'UNKNOWN') {
    const endpoint = 'CancelConsignment';
    const response = await fetch(`${DF_apiBaseUrl}${endpoint}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorisation: DF_auth!,
        AccountNumber: DF_accNum!,
        SiteId: DF_senderSiteId!,
      },
      body: `{
              "ConnoteList":[
                  {
                      "Connote": ${order.consignment_number}
                  }
              ]
          }`,
    });

    const data = (await response.json()) as CancelConsignmentResponse;
    if (
      !(
        data.ResponseCode === '300' &&
        (data.ConnoteList[0].ResponseCode === '200' ||
          data.ConnoteList[0].ResponseCode === '421')
      )
    ) {
      throw new Error('Failed to cancel consignment');
    }

    if (data.ConnoteList[0].ResponseCode === '421')
      return {
        error:
          'Cannot cancel connote. We are unable to process your request, the consignment has been either pickup confirmed /collected, despatched or finalised.',
      };
  }

  await db.consignment.delete({
    where: {
      order_number: order.order_number,
      consignment_number: order.consignment_number,
    },
  });
  revalidatePath('/processed');
};

/**
 * Reprints a label
 * @param consignmentNumber - Consignment number to reprint label
 * @returns URL of the new label
 */
export const reprintLabel = async (consignmentNumber: string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error('Unauthorised');
  }

  const endpoint = 'GetConsignmentLabel';
  const response = await fetch(`${DF_apiBaseUrl}${endpoint}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorisation: DF_auth!,
      AccountNumber: DF_accNum!,
      SiteId: DF_senderSiteId!,
    },
    body: `{
      "LabelPrintStatus":"REPRINT",
            "ConnoteList":[
                {
                    "Connote": ${consignmentNumber}
                }
            ]
        }`,
  });

  const data = (await response.json()) as ReprintLabelResponse;

  if (data.ResponseCode !== '300' || !data.LabelURL) {
    if (data.ResponseCode === '411') {
      if (data.ConnoteList[0].ResponseCode === '410')
        return { error: 'Cannot reprint label. Connote out of date.' };
      return { error: 'Cannot reprint label. Connote not found.' };
    }
    return { error: 'Failed to reprint label' };
  }

  const labelUrl = data.LabelURL;

  return { success: labelUrl };
};
