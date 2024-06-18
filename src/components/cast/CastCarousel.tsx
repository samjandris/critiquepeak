'use client';

import { useState, useEffect } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';

import { Avatar } from '@nextui-org/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';

import { getInitials } from '@/lib/misc';
import { CastPerson, CrewPerson } from '@/lib/types';

export default function PersonCarousel({
  type,
  items,
}: {
  type: 'cast' | 'crew';
  items: CastPerson[] | CrewPerson[];
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
      className="ml-8 mr-8 w-full"
    >
      <CarouselContent>
        {items.map((person) => (
          <CarouselItem
            key={person.id}
            className="flex flex-col items-center my-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <Avatar
              isBordered
              src={person.avatar}
              name={getInitials(person.name)}
              showFallback
              className="w-32 h-32 text-3xl mt-4 mb-1"
            />

            <p className="text-center text-default-800 mt-2 mb-1 leading-4">
              {person.name}
            </p>
            <p className="text-center text-default-400 leading-4">
              {type === 'cast' &&
                `as ${'character' in person && person.character}`}

              {type === 'crew' && 'job' in person && person.job}
            </p>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="py-2 text-center text-sm text-default-400">
        Page {current} of {count}
      </div>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
