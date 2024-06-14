import Link from 'next/link';

import { Card, Image, cn } from '@nextui-org/react';

import { Film } from '@/lib/types';

export default function FilmPoster({
  film,
  isHoverable = true,
  isPressable = true,
  className,
}: {
  film: Film;
  isHoverable?: boolean;
  isPressable?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('aspect-[2/3]', className)}>
      <Link href={`/film/${film.id}`}>
        <Card
          isPressable={isPressable}
          className={cn('border-none', isHoverable && 'hover:scale-105')}
        >
          <Image
            src={film.poster}
            alt={'Film poster for ' + film.title + '.'}
            isBlurred
            className="w-full"
          />
        </Card>
      </Link>
    </div>
  );
}
