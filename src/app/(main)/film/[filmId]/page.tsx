import NextImage from 'next/image';

import { Image, Chip } from '@nextui-org/react';
import { StarRatingPrecise } from '@/components/StarRating';
import UserReview from '@/components/user/UserReview';

import { getMovie } from '@/lib/film';
import { getRecentReviews } from '@/lib/reviews';
import { truncateNumber, getOrdinalDate } from '@/lib/misc';

export default async function FilmDetails({
  params,
}: {
  params: { filmId: string };
}) {
  const filmDetails = await getMovie(params.filmId, {
    // posterSize: 'w500',
    // backdropSize: 'w1280',
  });
  const recentReviews = await getRecentReviews(Number(params.filmId));

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="grid grid-cols-4 gap-5">
        <Image
          as={NextImage}
          src={filmDetails.poster}
          alt={'Poster for the film ' + filmDetails.title}
          width={0}
          height={0}
          sizes="25vw"
          shadow="md"
          isBlurred
          className="w-full"
        />

        <div className="col-span-2 flex flex-col gap-2 justify-center">
          <h1 className="text-3xl font-bold">{filmDetails.title}</h1>

          {filmDetails.tagline && (
            <Chip color="warning" variant="flat" size="sm">
              {filmDetails.tagline}
            </Chip>
          )}

          <p className="text-gray-500">{filmDetails.overview}</p>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div>
            <h3 className="text-gray-500">Release date</h3>
            <p>{getOrdinalDate(filmDetails.releaseDate)}</p>
          </div>

          <div>
            <h3 className="text-gray-500">Runtime</h3>
            <p>{filmDetails.runtime} minutes</p>
          </div>

          {filmDetails.budget > 0 && (
            <div>
              <h3 className="text-gray-500">Budget</h3>
              <p>{truncateNumber(filmDetails.budget)}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <StarRatingPrecise
            rating={filmDetails.averageRating}
            className="w-[65%] h-auto"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {recentReviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <>
            <h4>Recent reviews</h4>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              {recentReviews.map((review) => (
                <UserReview
                  key={review.id}
                  review={review}
                  hideType
                  hidePoster
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
