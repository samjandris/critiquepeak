'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
} from '@nextui-org/react';

import { useAuth } from '@/components/AuthProvider';
import { ChevronBackIcon, EmailIcon, PasswordIcon } from '@/components/Icons';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const { signIn } = useAuth();

  return (
    <>
      <Button
        startContent={<ChevronBackIcon />}
        variant="ghost"
        as={Link}
        href="/"
        className="absolute top-4 left-4"
      >
        Go back
      </Button>

      <form action={signIn}>
        <div className="flex flex-col justify-center items-center h-screen gap-4">
          <Card>
            <CardHeader className="flex justify-center">
              <h1 className="mt-1 text-4xl">Login</h1>
            </CardHeader>

            <CardBody className="gap-3 w-[350px]">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                startContent={<EmailIcon />}
                size="lg"
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                startContent={<PasswordIcon />}
                size="lg"
              />

              {searchParams?.message && (
                <p className="text-center mt-2 text-red-500">
                  {searchParams.message}
                </p>
              )}
            </CardBody>

            <CardFooter>
              <Button color="primary" type="submit" className="w-full">
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </>
  );
}
