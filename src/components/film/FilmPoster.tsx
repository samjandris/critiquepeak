import Link from 'next/link';
import NextImage from 'next/image';

import { Card, Image, cn } from '@nextui-org/react';

import { Film } from '@/lib/types';

export default function FilmPoster({
  film,
  className,
}: {
  film: Film;
  className?: string;
}) {
  return (
    <div className={cn('aspect-[2/3]', className)}>
      <Link href={`/film/${film.id}`}>
        <Card isPressable className="border-none hover:scale-105">
          <Image
            // as={NextImage}
            src={film.poster}
            alt={'Film poster for ' + film.title + '.'}
            // width={0}
            // height={0}
            // sizes="33vw"
            isBlurred
            className="w-full"
          />
        </Card>
      </Link>
    </div>
  );
}
