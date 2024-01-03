import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/AuthProvider';
import { UIProvider } from '@/components/UIProvider';

import '@/styles/globals.css';
import '@/styles/typography.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'Oops! The page you are looking for does not exist.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <AuthProvider>
          <UIProvider>
            <div className="flex justify-center">
              <div className="w-full max-w-screen-2xl">{children}</div>
            </div>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
