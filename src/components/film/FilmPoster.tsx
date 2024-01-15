import Link from 'next/link';
import NextImage from 'next/image';
import { Card, CardFooter, Button, Image } from '@nextui-org/react';
import { DropdownMenuIcon } from '@/components/Icons';

import { Film } from '@/lib/types';
import { twMerge } from 'tailwind-merge';

// TODO: Move movie info to the bottom of the poster
export default function FilmPoster({
  film,
  className,
}: {
  film: Film;
  className?: string;
}) {
  return (
    <div className={twMerge('aspect-[2/3]', className)}>
      <Card
        isFooterBlurred
        radius="lg"
        as={Link}
        href={'/film/' + film.id}
        className="border-none hover:scale-105"
      >
        <Image
          as={NextImage}
          src={film.poster}
          alt={'Film poster for ' + film.title + '.'}
          width={0}
          height={0}
          sizes="33vw"
          isBlurred
          className="w-full"
        />
        {/* <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
          <p className="text-tiny text-center text-white/80">{film.title}</p>
          <Button
            className="text-tiny text-white bg-black/20"
            variant="flat"
            color="default"
            radius="lg"
            size="sm"
            isIconOnly
          >
            <DropdownMenuIcon />
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
}
