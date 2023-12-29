'use client';

// import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@nextui-org/react';
import { CritiquePeakLogo } from '@/components/Icons';

const links = [
  {
    name: 'Film',
    href: '/film',
  },
  {
    name: 'TV',
    href: '/tv',
  },
  {
    name: 'Music',
    href: '/music',
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <Navbar isBordered>
      <NavbarMenuToggle className="sm:hidden" />
      <NavbarBrand>
        <Link color="foreground" href="/">
          <CritiquePeakLogo />
          <p className="font-bold text-inherit ml-2 [&:not(:first-child)]:mt-0">
            CritiquePeak
          </p>
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {links.map((link) => (
          <NavbarItem key={link.name} isActive={pathname.startsWith(link.href)}>
            <Link color="foreground" href={link.href}>
              {link.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="">
          <Link href="/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/signup" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {links.map((link) => (
          <NavbarMenuItem
            key={link.name}
            isActive={pathname.startsWith(link.href)}
          >
            <Link
              color="foreground"
              className="w-full"
              href={link.href}
              size="lg"
            >
              {link.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
