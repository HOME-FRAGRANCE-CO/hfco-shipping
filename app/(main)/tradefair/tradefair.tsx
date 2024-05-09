'use client';
import type { Customer } from '@/types/customer';
import { TradefairInput } from './tradefair-input';
import { useState } from 'react';
import { CustomerList } from './CustomerList';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';

const initialCustomers = [
  {
    companyName: 'Lukes Test',
    custName: 'Luke Hovey',
    phone: '61420365322',
    address: {
      lineOne: '112 Dev St',
      lineTwo: 'Unit 1',
      zip: '2200',
      city: 'Bankstown',
      province: 'NSW',
      countryCode: 'AU',
    },
    email: 'test@test.com.au',
  },
  {
    companyName: 'Chris Test',
    custName: 'Chris Le',
    phone: '61420365366',
    address: {
      lineOne: '114 Test St',
      zip: 'LE17 5HS',
      city: 'Lutterworth',
      province: undefined,
      countryCode: 'GB',
    },
    email: 'test2@test.com.au',
  },
  {
    companyName: 'Test Company',
    custName: 'Test Name',
    phone: '61420365367',
    address: {
      lineOne: '116 Test St',
      zip: 'LE17 5HS',
      city: 'Lutterworth',
      province: undefined,
      countryCode: 'GB',
    },
    email: 'test3@test.com',
  },
];

export const Tradefair = () => {
  const [customers, setCustomers] = useState<Customer[] | null>(
    initialCustomers,
  );
  if (customers) {
    return (
      <div className='flex h-full flex-col justify-between'>
        <h1 className='mb-10 flex items-center justify-between text-xl font-bold'>
          <div className='flex items-center justify-center gap-4'>
            Customer List
            <Button
              size='icon'
              variant='destructive'
              onClick={() => {
                setCustomers(null);
              }}
            >
              <TrashIcon />
            </Button>
          </div>
          <div />
        </h1>

        <CustomerList customers={customers} />
      </div>
    );
  }

  return (
    <div>
      <TradefairInput setCustomers={setCustomers} />
    </div>
  );
};
