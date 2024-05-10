'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className='flex items-center justify-center gap-4'>
      <Link
        href='/'
        className={cn(
          'group relative text-lg text-neutral-700 hover:text-slate-400',
          {
            'font-bold text-orange-500 hover:text-orange-500': pathname === '/',
          },
        )}
      >
        Labels
        <span
          className={cn(
            'absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transform bg-slate-400 transition-transform duration-150 ease-in-out group-hover:scale-x-100 group-hover:bg-slate-400',
            {
              'scale-x-100 bg-orange-500 group-hover:bg-orange-500':
                pathname === '/',
            },
          )}
        />
      </Link>
      <Link
        href='/processed'
        className={cn(
          'group relative text-lg text-neutral-700 hover:text-slate-400',
          {
            'font-bold text-orange-500 hover:text-orange-500':
              pathname === '/processed',
          },
        )}
      >
        Processed
        <span
          className={cn(
            'absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transform bg-slate-400 transition-transform duration-150 ease-in-out group-hover:scale-x-100 group-hover:bg-slate-400',
            {
              'scale-x-100 bg-orange-500 group-hover:bg-orange-500':
                pathname === '/processed',
            },
          )}
        />
      </Link>
      {/* <Link
                href='/tradefair'
                className={cn(
                    'group relative text-lg text-neutral-700 hover:text-slate-400',
                    {
                        'font-bold text-orange-500 hover:text-orange-500':
                            pathname === '/tradefair',
                    },
                )}
            >
                Trade Fair
                <span
                    className={cn(
                        'absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 transform bg-slate-400 transition-transform duration-150 ease-in-out group-hover:scale-x-100 group-hover:bg-slate-400',
                        {
                            'scale-x-100 bg-orange-500 group-hover:bg-orange-500':
                                pathname === '/tradefair',
                        },
                    )}
                />
            </Link> */}
    </nav>
  );
};
