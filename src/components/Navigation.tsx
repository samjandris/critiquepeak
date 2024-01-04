'use client';

import { usePathname } from 'next/navigation';
import useSWR from 'swr';
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
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';

import { useAuth } from '@/components/AuthProvider';
import { CritiquePeakLogo } from '@/components/Icons';

import { getUser } from '@/lib/users';

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
  const { user, authLoaded, signOut } = useAuth();
  const pathname = usePathname();

  const { data: userData, isLoading: userDataIsLoading } = useSWR(
    ['user', user?.id],
    () => user && getUser(user.id)
  );

  return (
    <Navbar isBordered>
      <NavbarMenuToggle className="sm:hidden" />
      <NavbarBrand>
        <Link color="foreground" href="/">
          <CritiquePeakLogo />
          <p className="font-bold text-inherit ml-2">CritiquePeak</p>
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
      <NavbarContent
        justify="end"
        data-authloaded={!userDataIsLoading}
        className="pointer-events-none opacity-0 data-[authloaded=true]:pointer-events-auto data-[authloaded=true]:opacity-100 transition-all"
      >
        {userData ? (
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  size="sm"
                  src={userData.avatar}
                  className="transition-transform"
                />
              </DropdownTrigger>
              <DropdownMenu variant="flat">
                <DropdownItem isReadOnly className="pointer-events-none">
                  <p className="font-semibold leading-tight">{`${userData.first_name} ${userData.last_name}`}</p>
                  <p className="font-semibold leading-tight">
                    {`@${userData.username}`}
                  </p>
                </DropdownItem>
                <DropdownItem href={'/profile/' + userData.username}>
                  Profile
                </DropdownItem>
                <DropdownItem
                  color="danger"
                  onPress={() => {
                    signOut();
                  }}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        ) : (
          <>
            <NavbarItem className="">
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
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
