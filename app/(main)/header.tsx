import Image from 'next/image';
import { Navbar } from './navbar';

export const Header = () => {
    return (
        <header className='h-20 w-full border-b-2 border-slate-200 px-4'>
            <div className='mx-auto flex h-full items-center justify-between lg:max-w-screen-lg'>
                <div className='flex items-center gap-x-3 pb-7 pl-4 pt-8'>
                    <Image src='/logo.svg' height={64} width={64} alt='HFCo.' />
                    <h1 className='text-2xl font-extrabold tracking-wide'>
                        Home Fragrance Co.
                    </h1>
                </div>
                <Navbar />
            </div>
        </header>
    );
};
