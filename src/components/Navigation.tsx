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
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const pathname = usePathname();
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
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {links.map((link) => (
            <NavbarItem
              key={link.name}
              isActive={pathname.startsWith(link.href)}
            >
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
                  <Button variant="ghost" startContent={<PlusIcon />}>
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

              <Popover
                placement="bottom"
                isOpen={isSearchPopoverOpen}
                onOpenChange={handleSearchPopoverChange}
              >
                <PopoverTrigger>
                  <Button variant="ghost" isIconOnly>
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
                    isReadOnly
                    closeOnSelect={false}
                    className="min-w-[225px] hover:!bg-transparent pointer-events-none"
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

      <ReviewFilmModal
        isOpen={isFilmModalOpen}
        onOpenChange={handleFilmModalChange}
      />
    </>
  );
}
