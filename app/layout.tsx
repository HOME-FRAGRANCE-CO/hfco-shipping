import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';

import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HFCO LABELS',
  description:
    'An app to process Excel files from EWE to create labels for Direct Freight.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          footer: 'hidden',
          formButtonPrimary: 'bg-orange-500 hover:bg-orange-600',
          footerActionLink: 'bg-orange-500 hover:bg-orange-600',
        },
      }}
    >
      <html lang='en'>
        <body className={inter.className}>
          {children}
          <Toaster richColors theme='light' closeButton />
        </body>
      </html>
    </ClerkProvider>
  );
}
