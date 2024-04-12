import { Footer } from './footer';
import { Header } from './header';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex min-h-screen flex-col'>
            <Header />
            <div className='flex flex-1 flex-col items-center justify-center'>
                <main className='h-full'>
                    <div className='mx-auto h-full max-w-[1056px] pt-6'>
                        {children}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default MainLayout;
