import Link from 'next/link';

import { Card, CardHeader, Image, cn } from '@nextui-org/react';

import { Film } from '@/lib/types';

export default function FilmBackdrop({
  film,
  hideLabel,
  labelPosition = 'top',
  className,
}: {
  film: Film;
  hideLabel?: boolean;
  labelPosition?: 'top' | 'bottom';
  className?: string;
}) {
  return (
    <div className={cn('aspect-[16/9]', className)}>
      <Link href={`/film/${film.id}`}>
        <Card isPressable isBlurred className="border-none hover:scale-105">
          {!hideLabel && (
            <CardHeader
              className={cn(
                'z-50 absolute',
                labelPosition === 'bottom' && 'bottom-0'
              )}
            >
              <div
                className={cn(
                  'flex flex-col px-2 py-2 pb-1 items-start bg-gray-900 opacity-85 shadow-xl',
                  labelPosition === 'top' && 'rounded-tl-xl rounded-br-xl',
                  labelPosition === 'bottom' && 'rounded-bl-xl rounded-tr-xl'
                )}
              >
                <p className="text-white/60 text-tiny font-bold uppercase">
                  Featured
                </p>
                <h4 className="text-white text-large font-medium">
                  {film.title}
                </h4>
              </div>
            </CardHeader>
          )}
          <Image
            src={film.backdrop}
            alt={'Film poster for ' + film.title + '.'}
            isBlurred
            className="w-full"
          />
        </Card>
      </Link>
    </div>
  );
}
