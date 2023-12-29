import Link from 'next/link';
import { Button } from '@nextui-org/react';

export default function NotFound() {
  return (
    <main className="flex justify-center items-center h-screen">
      <div className="bg-content2 p-6 rounded-3xl shadow-lg justify-center">
        <h1 className="text-center">404 - Page Not Found</h1>
        <div className="mt-5 mb-5">
          <h4 className="text-center">
            Oops! The page you are looking for does not exist.
          </h4>
          <h4 className="text-center">It might have been moved or deleted.</h4>
        </div>
        <div className="flex justify-center">
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
