'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { useAuth } from '@/components/AuthProvider';
import { getUser, followUser, unfollowUser } from '@/lib/users';

export default function UserChip({ userId }: { userId: string }) {
  const { user: authUser } = useAuth();

  const { data: userData, isLoading: userDataIsLoading } = useSWR(
    ['user', userId],
    () => getUser(userId)
  );

  const {
    data: authUserData,
    isLoading: authUserDataIsLoading,
    mutate: mutateAuthUser,
  } = useSWR(['user', authUser?.id], () => authUser && getUser(authUser.id));

  return (
    <div className="flex justify-between items-center">
      <Link
        href={'/profile/' + userData?.username}
        className="flex gap-2.5 w-full"
      >
        <Avatar isBordered radius="full" size="md" src={userData?.avatar} />
        {userData ? (
          <div className="flex flex-col gap-0 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {userData.first_name} {userData.last_name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @{userData.username}
            </h5>
          </div>
        ) : (
          <div className="flex flex-col gap-1 items-start justify-center">
            <Skeleton className="rounded-lg w-[100px] h-[15px]" />
            <Skeleton className="rounded-lg w-[100px] h-[15px]" />
          </div>
        )}
      </Link>
      {authUser && (
        <Button
          isLoading={userDataIsLoading || authUserDataIsLoading}
          isDisabled={
            (userData && authUser && userData.id === authUser!.id) || false
          }
          className={
            authUserData?.following.includes(userData?.id || '')
              ? 'bg-transparent text-foreground border-default-200'
              : ''
          }
          color="primary"
          radius="full"
          size="sm"
          variant={
            !userDataIsLoading && !authUserDataIsLoading
              ? userData && authUser && userData.id === authUser!.id
                ? 'flat'
                : authUserData?.following.includes(userData?.id || '')
                ? 'bordered'
                : 'solid'
              : 'flat'
          }
          onPress={() => {
            if (!userData || !authUserData) return;
            if (authUserData.following.includes(userData?.id || '')) {
              unfollowUser(authUserData.id, userData.id);
              mutateAuthUser({
                ...authUserData,
                following: authUserData.following.filter(
                  (id) => id !== userData.id
                ),
              });
            } else {
              followUser(authUserData.id, userData.id);
              mutateAuthUser({
                ...authUserData,
                following: [...authUserData.following, userData.id],
              });
            }
          }}
        >
          {!userDataIsLoading && !authUserDataIsLoading
            ? userData && authUser && userData.id === authUser!.id
              ? 'You'
              : authUserData?.following.includes(userData?.id || '')
              ? 'Unfollow'
              : 'Follow'
            : ''}
        </Button>
      )}
    </div>
  );
}
