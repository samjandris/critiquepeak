import Link from 'next/link';

import { Button } from '@nextui-org/react';

export default async function NotFound() {
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center gap-8">
      <h1 className="text-9xl font-bold tracking-tighter text-text">404</h1>

      <h5 className="max-w-sm text-center text-text-700">
        Oops, the page you are looking for could not be found.
      </h5>

      <Button as={Link} href="/" size="lg" color="primary" variant="shadow">
        Back to Home
      </Button>
    </main>
  );
}
