'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { useAuth } from '@/components/AuthProvider';
import {
  getUser,
  isUserFollowing,
  followUser,
  unfollowUser,
} from '@/lib/users';
import { UserDB } from '@/lib/types';

export default function UserChip({ userId }: { userId: string }) {
  const { user: authUser } = useAuth();

  const { data: userData, isLoading: userDataIsLoading } = useSWR(
    ['user', userId],
    () => getUser(userId)
  );

  const { data: authUserData, isLoading: authUserDataIsLoading } = useSWR(
    ['user', authUser?.id],
    () => authUser && getUser(authUser.id)
  );

  const {
    data: isAuthFollowingUser,
    isLoading: authFollowingUserIsLoading,
    mutate: mutateAuthFollowingUser,
  } = useSWR(['isFollowing', authUser?.id, userId], () => {
    if (!authUser) return;
    return isUserFollowing(authUser.id, userId);
  });

  return (
    <div className="w-full flex justify-between items-center gap-5">
      <Link
        href={'/profile/' + userData?.username}
        data-loading={userDataIsLoading}
        className="flex gap-3 w-full data-[loading=true]:pointer-events-none"
      >
        <Avatar
          isBordered
          radius="full"
          size="md"
          src={userData?.avatar}
          name={userData?.initials}
          showFallback
        />
        <div className="flex flex-col gap-0.5 items-start justify-center">
          <Skeleton
            isLoaded={!userDataIsLoading}
            className="rounded-lg data-[loaded]:rounded-none"
          >
            <p className="text-small font-semibold leading-tight text-text">
              {userData
                ? `${userData.first_name} ${userData.last_name}`
                : '--------------------'}
            </p>
          </Skeleton>
          <Skeleton
            isLoaded={!userDataIsLoading}
            className="rounded-lg data-[loaded]:rounded-none"
          >
            <p className="text-small tracking-tight leading-tight text-text-500">
              @{userData ? userData.username : '------------'}
            </p>
          </Skeleton>
        </div>
      </Link>
      {authUser && (
        <Button
          isLoading={
            userDataIsLoading ||
            authUserDataIsLoading ||
            authFollowingUserIsLoading
          }
          isDisabled={
            (!authFollowingUserIsLoading &&
              userData &&
              authUser &&
              userData.id === authUser!.id) ||
            false
          }
          color={isAuthFollowingUser ? 'default' : 'primary'}
          radius="full"
          size="sm"
          variant={
            !userDataIsLoading &&
            !authUserDataIsLoading &&
            !authFollowingUserIsLoading
              ? userData && authUser && userData.id === authUser!.id
                ? 'shadow'
                : isAuthFollowingUser
                ? 'solid'
                : 'shadow'
              : 'flat'
          }
          onPress={() => {
            if (!userData || !authUserData) return;
            if (isAuthFollowingUser) {
              unfollowUser(authUserData.id, userData.id);

              mutateAuthFollowingUser(false);
            } else {
              followUser(authUserData.id, userData.id);

              mutateAuthFollowingUser(true);
            }
          }}
        >
          {!userDataIsLoading &&
          !authUserDataIsLoading &&
          !authFollowingUserIsLoading
            ? userData && authUser && userData.id === authUser!.id
              ? 'You'
              : isAuthFollowingUser
              ? 'Unfollow'
              : 'Follow'
            : ''}
        </Button>
      )}
    </div>
  );
}

export function UserChipDumb({
  user,
  isUser,
  isFollowing,
  onFollowChange,
}: {
  user: UserDB;
  isUser: boolean;
  isFollowing: boolean;
  onFollowChange: () => void;
}) {
  return (
    <div className="flex justify-between items-center">
      <Link href={'/profile/' + user.username} className="flex gap-2.5 w-full">
        <Avatar
          isBordered
          radius="full"
          size="md"
          // src={user.avatar}
        />
        <div className="flex flex-col gap-0 items-start justify-center">
          <h4 className="text-small font-semibold leading-none text-default-800">
            {user.first_name} {user.last_name}
          </h4>
          <h5 className="text-small tracking-tight text-default-400">
            @{user.username}
          </h5>
        </div>
      </Link>
      <Button
        className={
          isFollowing ? 'bg-transparent text-foreground border-default-200' : ''
        }
        color="primary"
        radius="full"
        size="sm"
        variant={isFollowing ? 'bordered' : 'solid'}
        onPress={onFollowChange}
      >
        {isUser ? 'You' : isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </div>
  );
}
