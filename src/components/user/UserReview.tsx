'use client';

import useSWR from 'swr';
import Link from 'next/link';
import NextImage from 'next/image';
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
import { StarRating } from '@/components/StarRating';

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
  const { data: user, error: userError } = useSWR(
    ['user', review.user_id],
    () => {
      return getUser(review.user_id);
    }
  );

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
        <div className="flex gap-3">
          {!hidePoster && (
            <div className="min-w-[50px] w-[50px]">
              <Skeleton
                isLoaded={!filmIsLoading}
                className="w-full aspect-[2/3] rounded-xl"
              >
                <Link href={`/film/${film && film.id}`}>
                  {film && (
                    <Image
                      // as={NextImage}
                      src={film.poster}
                      alt="Poster for film"
                      // width={0}
                      // height={0}
                      // sizes="10vw"
                      className="w-full"
                    />
                  )}
                </Link>
              </Skeleton>
            </div>
          )}
          <ScrollShadow className="max-h-[175px]">
            <p className="leading-normal text-default-700">{review.review}</p>
          </ScrollShadow>
        </div>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
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
        </div>
      </CardFooter>
    </Card>
  );
}
