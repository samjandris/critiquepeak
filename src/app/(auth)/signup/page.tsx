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

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const { signUp } = useAuth();

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

      <form action={signUp}>
        <main className="flex flex-col justify-center items-center h-screen gap-4">
          <Card>
            <CardHeader className="flex justify-center">
              <h1 className="mt-1 text-4xl">Sign up</h1>
            </CardHeader>

            <CardBody className="grid grid-cols-2 gap-3 w-[350px]">
              <Input
                name="firstName"
                type="name"
                placeholder="First Name"
                size="lg"
              />
              <Input
                name="lastName"
                type="name"
                placeholder="Last Name"
                size="lg"
              />
              <Input
                name="username"
                type="text"
                placeholder="Username"
                className="col-span-2"
                size="lg"
              />

              <Input
                name="email"
                type="email"
                placeholder="Email"
                startContent={<EmailIcon />}
                className="col-span-2"
                size="lg"
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                startContent={<PasswordIcon />}
                className="col-span-2"
                size="lg"
              />

              {searchParams?.message && (
                <p className="col-span-2 text-center mt-2 text-red-500">
                  {searchParams.message}
                </p>
              )}
            </CardBody>

            <CardFooter>
              <Button color="secondary" type="submit" className="w-full">
                Sign up
              </Button>
            </CardFooter>
          </Card>
        </main>
      </form>
    </>
  );
}
