import Link from 'next/link';

export default async function NotFound() {
  return (
    <main className="flex h-[100dvh] w-full flex-col items-center justify-center gap-6">
      <h1 className="text-9xl font-bold tracking-tighter">404</h1>
      <p className="max-w-md text-center text-gray-500 dark:text-gray-400">
        Oops, the page you are looking for could not be found.
      </p>
      <Link
        className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
        href="/"
      >
        Go to Homepage
      </Link>
    </main>
  );
}
