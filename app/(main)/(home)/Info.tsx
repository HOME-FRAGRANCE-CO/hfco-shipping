'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NotepadTextIcon } from 'lucide-react';

const Info = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' className='flex gap-2 uppercase'>
          <NotepadTextIcon /> View Instructions
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[629.5px] rounded-lg border-2 border-slate-200 p-4 shadow-sm'>
        <h2 className='text-md mb-4 text-center font-semibold'>INSTRUCTIONS</h2>
        <div className='flex flex-col space-y-1 px-2 text-sm'>
          <p>1. Download the Excel template from EWE</p>
          <p>2. Upload the Excel to this page</p>
          <p>
            3. Book a pickup at{' '}
            <a
              href='https://www.directfreight.com.au/dispatch/AddPickupSelectAddress.aspx'
              target='_blank'
              className='text-l font-bold text-blue-500 underline hover:text-blue-700'
            >
              Direct Freight
            </a>{' '}
            <span className='font-bold text-red-500'>
              - ONLY BOOK PALLETS. (120cm L x 120cm W x 180cm H)
            </span>
          </p>
          <p>4. Enter the Pallet Count generated below</p>
          <p>5. Enter Ready Time as 3:00pm and Closing Time as 4:00pm</p>
          <p>5. Click &quot;Process Order&quot; for each order</p>
          <p>6. Download the labels</p>
          <p>7. Email EWE back with all labels attached</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Info;
