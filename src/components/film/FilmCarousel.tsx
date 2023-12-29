import FilmPoster from '@/components/film/FilmPoster';
import { ScrollShadow } from '@nextui-org/react';

import { Film } from '@/lib/types';

export default function FilmCarousel({ films }: { films: Film[] }) {
  return (
    // TODO: Move movie infor to the bottom of the poster
    // TODO: Use shadcn/ui carousel component instead of ScrollShadow
    <ScrollShadow orientation="horizontal">
      <div className="flex flex-row gap-4">
        {films.map((film) => (
          <FilmPoster key={film.title} film={film} className="h-[20rem]" />
        ))}
      </div>
    </ScrollShadow>
  );
}
