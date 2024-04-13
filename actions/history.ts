'use server';
import { db } from '@/prisma/db';
import type { cancelConsignmentResponse } from '@/types';

const DF_apiUrl =
    'https://webservices.directfreight.com.au/Dispatch/api/CancelConsignment/';
const DF_auth = process.env.DF_AUTHORISATION;
const DF_accNum = process.env.DF_ACCOUNT_NUMBER;
const DF_senderSiteId = process.env.DF_SENDER_SITE_ID;

export const deleteConsignment = async (consignmentNumber: string) => {
    console.log('Deleting Consignment', consignmentNumber);
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
            data.ConnoteList[0].ResponseCode === '200'
        )
    ) {
        throw new Error(data.ConnoteList[0].ResponseMessage);
    }

    // await db.consignment.deleteMany({
    //     where: {
    //         consignment_number: consignmentNumber,
    //     },
    // });
};
