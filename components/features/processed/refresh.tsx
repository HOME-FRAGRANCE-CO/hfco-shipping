'use client';

import { cn } from '@/lib/utils';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { RotateCwIcon } from 'lucide-react';

export const Refresh = () => {
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  return (
    <Button
      size='icon'
      variant='ghost'
      className='group'
      disabled={disabled}
      onClick={() => {
        router.refresh();
        setDisabled(true);
        setTimeout(() => {
          setDisabled(false);
        }, 1500);
      }}
    >
      <RotateCwIcon
        className={cn('group size-4', disabled && 'animate-spin duration-500')}
      />
    </Button>
  );
};
