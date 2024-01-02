'use client';

import { useState, useEffect } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import UserReview from '@/components/user/UserReview';

import { FilmReview, SeriesReview, SeasonReview } from '@/lib/types';

export default function UserReviewCarousel({
  reviews,
}: {
  reviews: FilmReview[] | SeriesReview[] | SeasonReview[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const size = useWindowSize();

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
  }, [api, size]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ slidesToScroll: 'auto' }}
      className="ml-8 mr-8"
    >
      <CarouselContent>
        {reviews.map((review) => (
          <CarouselItem
            key={review.id}
            className="flex justify-center items-center min-[825px]:basis-1/2 min-[1225px]:basis-1/3 2xl:basis-1/4"
          >
            <UserReview review={review} className="m-6" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="py-2 text-center text-sm text-gray-400">
        Page {current} of {count}
      </div>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
