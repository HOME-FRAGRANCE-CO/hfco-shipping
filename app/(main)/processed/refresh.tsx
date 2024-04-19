'use client';

import { Button } from '@/components/ui/button';
import { RotateCwIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Refresh = () => {
  const router = useRouter();

  return (
    <Button
      size='icon'
      variant='ghost'
      onClick={() => {
        router.refresh();
      }}
    >
      <RotateCwIcon className='size-4' />
    </Button>
  );
};
