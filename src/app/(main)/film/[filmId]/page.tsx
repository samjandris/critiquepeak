import { Image, Chip, cn } from '@nextui-org/react';
import { StarRatingPrecise } from '@/components/StarRating';
import UserReview from '@/components/user/UserReview';
import CastCrew from '@/components/cast/CastCrew';

import {
  CalendarFillIcon,
  ClockFillIcon,
  DollarCircleIcon,
} from '@/components/Icons';

import {
  getMovie,
  getMovieCast,
  getMovieCrew,
  getRecommendedMovies,
} from '@/lib/film';
import { getRecentReviews } from '@/lib/reviews';
import { truncateNumber, getOrdinalDate } from '@/lib/misc';
import FilmCarousel from '@/components/film/FilmCarousel';

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

  const cast = await getMovieCast(params.filmId);
  const crew = await getMovieCrew(params.filmId);

  const recommendedMovies = await getRecommendedMovies(params.filmId);

  const bgSwap = recentReviews.length > 0;

  return (
    <div className="flex flex-col gap-8 pt-8">
      <section className="grid grid-cols-4 gap-5 px-8">
        <Image
          src={filmDetails.poster}
          alt={'Poster for the film ' + filmDetails.title}
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

          <p className="text-default-600">{filmDetails.overview}</p>
        </div>

        <div className="flex flex-col justify-center text-center gap-6">
          <div>
            <div className="flex gap-2 justify-center items-center text-default-800">
              <CalendarFillIcon />
              <h4>Release date</h4>
            </div>
            <p className="text-default-500">
              {getOrdinalDate(filmDetails.releaseDate)}
            </p>
          </div>

          <div>
            <div className="flex gap-2 justify-center items-center text-default-800">
              <ClockFillIcon />
              <h4>Runtime</h4>
            </div>
            <p className="text-default-500">{filmDetails.runtime} minutes</p>
          </div>

          {(filmDetails.budget && filmDetails.budget > 0) === true && (
            <div>
              <div className="flex gap-1.5 justify-center items-center text-default-800">
                <DollarCircleIcon width="1.15em" height="1.15em" />
                <h4>Budget</h4>
              </div>
              <p className="text-default-500">
                {truncateNumber(filmDetails.budget!)}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <StarRatingPrecise
            rating={filmDetails.averageRating}
            className="w-[65%] h-auto"
          />
        </div>
      </section>

      <section
        className={cn(
          'flex flex-col items-center gap-4 p-4',
          bgSwap && 'bg-gray-100 dark:bg-gray-900'
        )}
      >
        {recentReviews.length === 0 ? (
          <p className="text-default-500 text-xl">No reviews yet</p>
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
      </section>

      <section
        className={cn(
          'flex flex-col items-center py-4 px-8',
          !bgSwap && 'bg-gray-100 dark:bg-gray-900'
        )}
      >
        <div className="w-[82%] md:w-[90%]">
          <CastCrew cast={cast} crew={crew} />
        </div>
      </section>

      {recommendedMovies.length > 0 && (
        <section
          className={cn(
            'flex flex-col items-center gap-4 py-4 px-8',
            bgSwap && 'bg-gray-100 dark:bg-gray-900'
          )}
        >
          <h4>People also watched</h4>
          <div className="w-[95%]">
            <FilmCarousel films={recommendedMovies} />
          </div>
        </section>
      )}
    </div>
  );
}
