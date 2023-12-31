import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CritiquePeak',
  description: 'A social media platform for film, tv, and music lovers.',
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
