import { Header } from '@/components/layout/header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <div className='flex flex-1 flex-col items-center'>
        <main className='h-full'>
          <div className='mx-auto h-full max-w-[1400px]'>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
