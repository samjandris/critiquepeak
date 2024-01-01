import Image from 'next/image';

import { Chip } from '@nextui-org/react';
import { StarRatingPrecise } from '@/components/StarRating';

import { getMovie } from '@/lib/film';
import { truncateNumber, getOrdinalDate } from '@/lib/misc';

export default async function FilmDetails({
  params,
}: {
  params: { filmId: string };
}) {
  const filmDetails = await getMovie(params.filmId, {
    posterSize: 'w780',
    backdropSize: 'w1280',
  });

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex gap-6">
        <Image
          src={filmDetails.poster}
          alt={'Poster for the film ' + filmDetails.title}
          width={342}
          height={513}
          className="rounded-xl shadow-gray-400 shadow-xl"
        />

        <div className="flex flex-col h-[513px] justify-center">
          <h1 className="text-3xl font-bold">{filmDetails.title}</h1>
          <p className="text-gray-500">{filmDetails.overview}</p>

          <div className="flex flex-row mt-8">
            <div className="flex flex-col mr-8">
              <h2 className="text-gray-500">Release date</h2>
              <p>{getOrdinalDate(filmDetails.releaseDate)}</p>
            </div>

            <div className="flex flex-col mr-8">
              <h2 className="text-gray-500">Rating</h2>

              <StarRatingPrecise rating={filmDetails.averageRating} />
            </div>

            <div className="flex flex-col mr-8">
              <h2 className="text-gray-500">Runtime</h2>
              <p>{filmDetails.runtime} minutes</p>
            </div>

            <div className="flex flex-col mr-8">
              <h2 className="text-gray-500">Budget</h2>
              <p>{truncateNumber(filmDetails.budget)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-[342px] justify-center">
        <Chip color="warning" variant="flat" size="sm">
          {filmDetails.tagline}
        </Chip>
      </div>
    </div>
  );
}
