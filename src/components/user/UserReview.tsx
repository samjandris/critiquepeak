'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Skeleton,
  ScrollShadow,
  cn,
} from '@nextui-org/react';
import UserChip from '@/components/user/UserChip';
import FilmPoster from '@/components/film/FilmPoster';
import { StarRating } from '@/components/StarRating';
import { HeartOutlineIcon, HeartFillIcon } from '@/components/Icons';

import { useAuth } from '@/components/AuthProvider';
import { getUser } from '@/lib/users';
import { getMovie } from '@/lib/film';
import { FilmReview, SeriesReview, SeasonReview } from '@/lib/types';
import { truncateNumber } from '@/lib/misc';

export default function UserReview({
  review,
  hideType,
  hidePoster,
  className,
}: {
  review: FilmReview | SeriesReview | SeasonReview;
  hideType?: boolean;
  hidePoster?: boolean;
  className?: string;
}) {
  const { user: authUser } = useAuth();

  const { data: authUserData, isLoading: authUserDataIsLoading } = useSWR(
    ['user', authUser?.id],
    () => authUser && getUser(authUser.id)
  );

  const { data: user, error: userError } = useSWR(
    ['user', review.user_id],
    () => {
      return getUser(review.user_id);
    }
  );

  const [userDidLike, setUserDidLike] = useState(false); // TODO: get from user's likes [review.id]
  const [isHoveringLike, setIsHoveringLike] = useState(false);

  const {
    data: film,
    error: filmError,
    isLoading: filmIsLoading,
  } = useSWR(['film', (review as FilmReview).movie_id], () => {
    return getMovie((review as FilmReview).movie_id);
  });

  if (userError || filmError) {
    return <p>Error</p>;
  }

  return (
    <Card className={cn('min-w-[300px] max-w-[375px]', className)}>
      <CardHeader>
        <UserChip userId={review.user_id} />
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <div className="flex gap-2 mb-3">
          {!hideType && <Chip size="sm">{'Film'}</Chip>}
          <StarRating rating={review.rating} />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {review.rating.toFixed(1)}
          </p>
        </div>
        <div className="flex gap-3 pb-1">
          {!hidePoster && (
            <div className="min-w-[50px] w-[50px] hover:scale-110 transition-all">
              <Skeleton
                isLoaded={!filmIsLoading}
                className="w-full aspect-[2/3] rounded-xl"
              >
                {film && <FilmPoster film={film} isHoverable={false} />}
              </Skeleton>
            </div>
          )}
          <ScrollShadow className="max-h-[175px]">
            <p className="leading-normal text-default-700">{review.review}</p>
          </ScrollShadow>
        </div>
      </CardBody>
      <CardFooter className="gap-2 justify-between">
        {/* <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {user ? truncateNumber(user.following_count) : '--'}
          </p>
          <p className="text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {user ? truncateNumber(user.follower_count) : '--'}
          </p>
          <p className="text-default-400 text-small">Followers</p>
        </div> */}

        <div
          onMouseEnter={() => setIsHoveringLike(true)}
          onMouseLeave={() => setIsHoveringLike(false)}
          onClick={() => setUserDidLike(!userDidLike)}
          className={cn(
            'flex gap-2 items-center hover:cursor-pointer hover:scale-110 active:scale-95 transition-all',
            !authUserDataIsLoading && !authUserData && 'pointer-events-none'
          )}
        >
          <div className="relative w-5 h-5">
            <HeartOutlineIcon
              color={isHoveringLike ? 'red' : 'inherit'}
              className={cn(
                'absolute inset-0 w-full h-full transition-all',
                userDidLike
                  ? isHoveringLike
                    ? 'opacity-100'
                    : 'opacity-0'
                  : 'opacity-100'
              )}
            />

            <HeartFillIcon
              color="red"
              className={cn(
                'absolute inset-0 w-full h-full transition-all',
                userDidLike
                  ? isHoveringLike
                    ? 'opacity-30'
                    : 'opacity-100'
                  : 'opacity-0'
              )}
            />
          </div>

          <p className="font-semibold text-default-400 text-small">
            {truncateNumber(143)}
          </p>
        </div>

        {/* <Button size="sm" variant="light" className="flex gap-2 items-center">
          <CommentIcon className="w-full h-4" />
          <p className="font-semibold text-default-400 text-small">12</p>
          <p className="text-default-400 text-small">Comments</p>
        </Button> */}

        <div>
          <Link
            href={`/review/${review.id}`}
            className="flex h-6 items-center justify-center rounded-full px-3 text-sm font-medium bg-gray-900 dark:bg-gray-50 text-gray-50 dark:text-gray-900 hover:bg-gray-900/90 dark:hover:bg-gray-50/90 hover:ring-1 hover:ring-gray-950 dark:hover:ring-gray-300 transition-colors"
          >
            Read
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
