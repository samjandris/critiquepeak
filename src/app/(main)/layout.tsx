import type { Metadata } from 'next';

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
    </>
  );
}
