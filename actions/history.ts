'use server';
import { db } from '@/prisma/db';
import type { cancelConsignmentResponse } from '@/types';
import { revalidatePath } from 'next/cache';

const DF_apiUrl =
  'https://webservices.directfreight.com.au/Dispatch/api/CancelConsignment/';
const DF_auth = process.env.DF_AUTHORISATION;
const DF_accNum = process.env.DF_ACCOUNT_NUMBER;
const DF_senderSiteId = process.env.DF_SENDER_SITE_ID;

export const deleteConsignment = async (consignmentNumber: string) => {
  const response = await fetch(DF_apiUrl, {
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
                    "Connote": ${consignmentNumber}
                }
            ]
        }`,
  });

  const data = (await response.json()) as cancelConsignmentResponse;
  console.log(data);
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

  await db.consignment.deleteMany({
    where: {
      consignment_number: consignmentNumber,
    },
  });
  revalidatePath('/processed');
};
