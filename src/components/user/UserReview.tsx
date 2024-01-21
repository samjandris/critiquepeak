'use client';

import useSWR from 'swr';
import NextImage from 'next/image';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Chip,
  Image,
  Skeleton,
} from '@nextui-org/react';
import UserChip from '@/components/user/UserChip';
import { StarRating } from '@/components/StarRating';

import { getUser } from '@/lib/users';
import { getMovie } from '@/lib/film';
import { FilmReview, SeriesReview, SeasonReview } from '@/lib/types';
import { truncateNumber } from '@/lib/misc';
import { twMerge } from 'tailwind-merge';

export default function UserReview({
  review,
  className,
}: {
  review: FilmReview | SeriesReview | SeasonReview;
  className?: string;
}) {
  const {
    data: user,
    error: userError,
    isLoading: userIsLoading,
  } = useSWR(['user', review.user_id], () => {
    return getUser(review.user_id);
  });

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
    <Card className={twMerge('min-w-[275px] max-w-[340px]', className)}>
      <CardHeader>
        <Skeleton isLoaded={!userIsLoading} className="w-full rounded-xl">
          {user ? (
            <UserChip userId={user.id} />
          ) : (
            <div className="w-full h-[45px]" />
          )}
        </Skeleton>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <div className="flex gap-2 mb-3">
          <Chip size="sm">{'Film'}</Chip>
          <Chip
            color={
              review.rating >= 3.5
                ? 'success'
                : review.rating >= 2
                ? 'warning'
                : 'danger'
            }
            size="sm"
          >
            <StarRating rating={review.rating} />
          </Chip>
          <Chip
            color={
              review.rating >= 3.5
                ? 'success'
                : review.rating >= 2
                ? 'warning'
                : 'danger'
            }
            size="sm"
          >
            {review.rating.toFixed(1)}
          </Chip>
        </div>
        <div className="flex max-w-[350px] gap-3">
          <div className="w-[50px] aspect-[2/3]">
            <Skeleton
              isLoaded={!filmIsLoading}
              className="w-full h-full rounded-xl"
            >
              <Image
                as={NextImage}
                src={film && film.poster}
                alt="Poster for film"
                width={0}
                height={0}
                sizes="5vw"
                className="w-full"
              />
            </Skeleton>
          </div>
          <p className="leading-normal">{review.review}</p>
        </div>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {user ? truncateNumber(user.following_count) : '--'}
          </p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {user ? truncateNumber(user.follower_count) : '--'}
          </p>
          <p className="text-default-400 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
}
