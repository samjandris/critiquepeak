import type { Metadata } from 'next';
import Link from 'next/link';

import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'CritiquePeak',
  description: 'A social media platform for film, tv, and music lovers.',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />

      {children}

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 CritiquePeak. All rights reserved.
        </p>
        <div className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="mailto:critiquepeak@gmail.com"
            className="text-xs hover:underline underline-offset-4"
          >
            Contact
          </Link>
          {/* <Link
            href="/tos"
            className="text-xs hover:underline underline-offset-4"
          >
            Terms of Service
          </Link>
          <Link
            href="/privacy"
            className="text-xs hover:underline underline-offset-4"
          >
            Privacy
          </Link> */}
        </div>
      </footer>
    </>
  );
}
