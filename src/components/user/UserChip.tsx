'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Avatar, Button, Skeleton } from '@nextui-org/react';
import { useAuth } from '@/components/AuthProvider';
import { getUser } from '@/lib/users';
import { User } from '@/lib/types';

export default function UserChip({ userId }: { userId: string }) {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [followLoaded, setFollowLoaded] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    getUser(userId).then((user) => setUser(user));

    if (authUser) {
      getUser(authUser.id).then((user: any) => {
        if (user.following.includes(userId)) {
          setIsFollowed(true);
        }

        setFollowLoaded(true);
      });
    } else {
      setFollowLoaded(true);
    }
  }, [userId, authUser]);

  return (
    <div className="flex justify-between items-center">
      <Link href={'/profile/' + user?.username} className="flex gap-2.5 w-full">
        <Avatar isBordered radius="full" size="md" src={user?.avatar} />
        {user && followLoaded ? (
          <div className="flex flex-col gap-0 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {user.first_name} {user.last_name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @{user.username}
            </h5>
          </div>
        ) : (
          <div className="flex flex-col gap-1 items-start justify-center">
            <Skeleton className="rounded-lg w-[100px] h-[15px]" />
            <Skeleton className="rounded-lg w-[100px] h-[15px]" />
          </div>
        )}
      </Link>
      <Button
        isLoading={!followLoaded}
        isDisabled={(user && authUser && user.id === authUser!.id) || false}
        className={
          isFollowed ? 'bg-transparent text-foreground border-default-200' : ''
        }
        color="primary"
        radius="full"
        size="sm"
        variant={
          followLoaded
            ? user && authUser && user.id === authUser!.id
              ? 'flat'
              : isFollowed
              ? 'bordered'
              : 'solid'
            : 'flat'
        }
        onPress={() => setIsFollowed(!isFollowed)}
      >
        {followLoaded
          ? user && authUser && user.id === authUser!.id
            ? 'You'
            : isFollowed
            ? 'Unfollow'
            : 'Follow'
          : ''}
      </Button>
    </div>
  );
}
