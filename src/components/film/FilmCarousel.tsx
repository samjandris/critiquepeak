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
import FilmPoster from '@/components/film/FilmPoster';

import { Film } from '@/lib/types';

export default function FilmCarousel({ films }: { films: Film[] }) {
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
        {films.map((film) => (
          <CarouselItem
            key={film.title}
            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <FilmPoster film={film} className="m-4" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="py-2 text-center text-sm text-inherit">
        Page {current} of {count}
      </div>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
