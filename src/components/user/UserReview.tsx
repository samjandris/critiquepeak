'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Chip,
} from '@nextui-org/react';
import { StarRating } from '@/components/StarRating';

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
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <Card className={twMerge('max-w-[340px]', className)}>
      <CardHeader className="justify-between">
        <div className="flex gap-3.5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={review.reviewedBy.avatar}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {review.reviewedBy.first_name} {review.reviewedBy.last_name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @{review.reviewedBy.username}
            </h5>
          </div>
        </div>
        <Button
          className={
            isFollowed
              ? 'bg-transparent text-foreground border-default-200'
              : ''
          }
          color="primary"
          radius="full"
          size="sm"
          variant={isFollowed ? 'bordered' : 'solid'}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? 'Unfollow' : 'Follow'}
        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <div className="flex gap-2 mb-3">
          <Chip size="sm">
            {(review as FilmReview).film
              ? 'Film'
              : (review as SeasonReview).season
              ? 'TV Season'
              : 'TV Series'}
          </Chip>
          <Chip size="sm">
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
        <p className="leading-normal">{review.review}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {truncateNumber(review.reviewedBy.following.length)}
          </p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {truncateNumber(review.reviewedBy.followers!)}
          </p>
          <p className="text-default-400 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
}
