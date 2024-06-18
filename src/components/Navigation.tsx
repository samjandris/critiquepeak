'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import useSWR from 'swr';
import {
  useDisclosure,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Skeleton,
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
  DropdownSection,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tabs,
  Tab,
} from '@nextui-org/react';
import Search from '@/components/Search';
import ReviewFilmModal from '@/components/film/ReviewFilmModal';

import { useAuth } from '@/components/AuthProvider';
import {
  CritiquePeakLogo,
  GearFillIcon,
  ComputerDesktopIcon,
  SunFillIcon,
  MoonStarsFillIcon,
  PlusIcon,
  FilmIcon,
  TVIcon,
  MusicNoteIcon,
  SearchIcon,
} from '@/components/Icons';

import { getUser } from '@/lib/users';

const links = [
  {
    name: 'Film',
    href: '/film',
    isDisabled: false,
  },
  {
    name: 'TV',
    href: '/tv',
    isDisabled: true,
  },
  {
    name: 'Music',
    href: '/music',
    isDisabled: true,
  },
];

export default function Navigation() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { authLoaded, user, signOut } = useAuth();
  const pathname = usePathname();
  const { isOpen: isUserDropdownOpen, onOpenChange: handleUserDropdownChange } =
    useDisclosure();
  const { isOpen: isFilmModalOpen, onOpenChange: handleFilmModalChange } =
    useDisclosure();
  const {
    isOpen: isSearchPopoverOpen,
    onOpenChange: handleSearchPopoverChange,
  } = useDisclosure();

  const { data: userData, isLoading: userDataIsLoading } = useSWR(
    ['user', user?.id],
    () => user && getUser(user.id)
  );

  return (
    <>
      <Navbar isBordered>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          <Link color="foreground" href="/">
            <CritiquePeakLogo />
            <p className="font-bold text-inherit ml-2">CritiquePeak</p>
          </Link>
        </NavbarBrand>
        <NavbarContent justify="center" className="hidden sm:flex gap-4">
          {links.map((link) => (
            <NavbarItem
              key={link.name}
              isActive={pathname.startsWith(link.href)}
            >
              <Link
                color="foreground"
                href={link.href}
                isDisabled={link.isDisabled}
              >
                {link.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        {authLoaded && (
          <NavbarContent justify="end">
            {user && (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button
                    variant="ghost"
                    radius="full"
                    startContent={<PlusIcon />}
                  >
                    Post
                  </Button>
                </DropdownTrigger>
                <DropdownMenu variant="flat" disabledKeys={['tv', 'music']}>
                  <DropdownSection title="Write Review">
                    <DropdownItem
                      key="film"
                      startContent={<FilmIcon />}
                      description="Review a film"
                      onPress={handleFilmModalChange}
                    >
                      Film
                    </DropdownItem>
                    <DropdownItem
                      key="tv"
                      startContent={<TVIcon />}
                      description="Review a TV series"
                    >
                      Series
                    </DropdownItem>
                    <DropdownItem
                      key="music"
                      startContent={<MusicNoteIcon />}
                      description="Review an album or song"
                    >
                      Music
                    </DropdownItem>
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
            )}

            <Popover
              placement="bottom"
              isOpen={isSearchPopoverOpen}
              onOpenChange={handleSearchPopoverChange}
              // ********** REFACTOR THIS FUNCTION **********
              // TODO - REFACTOR - THIS SHOULD NOT BE NECESSARY, CHANGED IN NEXTUI 2.4.1 FROM 2.2.9
              // USED TO MAKE SURE THAT SEARCH IS INTERACTABLE OUTSIDE OF THE POPUP
              // ********** REFACTOR THIS FUNCTION **********
              shouldCloseOnInteractOutside={() => {
                return true;
              }}
            >
              <PopoverTrigger>
                <Button variant="ghost" radius="full" isIconOnly>
                  <SearchIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Tabs variant="underlined" className="mt-2">
                  <Tab
                    title={
                      <div className="flex items-center space-x-2">
                        <FilmIcon />
                        <span>Films</span>
                      </div>
                    }
                  >
                    <Search
                      type="film"
                      onSelectionChange={(film) => {
                        if (!film) return;
                        handleSearchPopoverChange();
                        router.push('/film/' + film.id);
                      }}
                    />
                  </Tab>
                  <Tab
                    title={
                      <div className="flex items-center space-x-2">
                        <TVIcon />
                        <span>Shows</span>
                      </div>
                    }
                    isDisabled
                  >
                    <Search
                      type="series"
                      onSelectionChange={() => console.log('new series')}
                    />
                  </Tab>
                  <Tab
                    title={
                      <div className="flex items-center space-x-2">
                        <MusicNoteIcon />
                        <span>Albums</span>
                      </div>
                    }
                    isDisabled
                  >
                    <Search
                      type="album"
                      onSelectionChange={() => console.log('new album')}
                    />
                  </Tab>
                </Tabs>
              </PopoverContent>
            </Popover>

            <Dropdown
              placement="bottom-end"
              onOpenChange={handleUserDropdownChange}
            >
              <DropdownTrigger>
                {user ? (
                  <Avatar
                    as="button"
                    isBordered
                    size="sm"
                    src={userData?.avatar}
                    name={userData?.initials}
                    showFallback
                    className="ml-1 transition-transform"
                  />
                ) : (
                  <Button variant="ghost" radius="full" isIconOnly>
                    <GearFillIcon
                      data-open={isUserDropdownOpen}
                      className="transition-all rotate-0 data-[open=true]:rotate-45"
                    />
                  </Button>
                )}
              </DropdownTrigger>
              {user ? (
                <DropdownMenu
                  variant="flat"
                  disabledKeys={userDataIsLoading ? ['profile'] : ['']}
                >
                  <DropdownItem isReadOnly className="pointer-events-none">
                    <Skeleton isLoaded={!userDataIsLoading}>
                      <p className="font-semibold leading-tight">{`${userData?.first_name} ${userData?.last_name}`}</p>
                      <p className="font-semibold leading-tight">
                        {`@${userData?.username}`}
                      </p>
                    </Skeleton>
                  </DropdownItem>
                  <DropdownItem
                    key="profile"
                    href={'/profile/' + userData?.username}
                  >
                    Profile
                  </DropdownItem>
                  <DropdownItem
                    isReadOnly
                    closeOnSelect={false}
                    className="min-w-[250px] hover:!bg-transparent pointer-events-none"
                    endContent={
                      <Tabs
                        size="sm"
                        radius="full"
                        defaultSelectedKey={theme}
                        onSelectionChange={(mode) => setTheme(mode.toString())}
                        className="pointer-events-auto"
                      >
                        <Tab key="system" title={<ComputerDesktopIcon />} />
                        <Tab key="light" title={<SunFillIcon />} />
                        <Tab key="dark" title={<MoonStarsFillIcon />} />
                      </Tabs>
                    }
                  >
                    Theme
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
              ) : (
                <DropdownMenu variant="flat">
                  <DropdownItem
                    isReadOnly
                    closeOnSelect={false}
                    className="min-w-[250px] hover:!bg-transparent pointer-events-none"
                    endContent={
                      <Tabs
                        size="sm"
                        radius="full"
                        defaultSelectedKey={theme}
                        onSelectionChange={(mode) => setTheme(mode.toString())}
                        className="pointer-events-auto"
                      >
                        <Tab key="system" title={<ComputerDesktopIcon />} />
                        <Tab key="light" title={<SunFillIcon />} />
                        <Tab key="dark" title={<MoonStarsFillIcon />} />
                      </Tabs>
                    }
                  >
                    Theme
                  </DropdownItem>
                  <DropdownItem href="/login">Login</DropdownItem>
                  <DropdownItem href="/signup">Sign Up</DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          </NavbarContent>
        )}

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
                isDisabled={link.isDisabled}
              >
                {link.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      <ReviewFilmModal
        isOpen={isFilmModalOpen}
        onOpenChange={handleFilmModalChange}
      />
    </>
  );
}
