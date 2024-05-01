import Link from 'next/link';
import NextImage from 'next/image';

import { Image } from '@nextui-org/react';
import FilmCarousel from '@/components/film/FilmCarousel';
import UserReviewCarousel from '@/components/user/UserReviewCarousel';

import { getMoviesInTheaters, getTrendingMovies } from '@/lib/film';
import { getRecentMovieReviews } from '@/lib/reviews';

export default async function FilmPage() {
  const trendingMovies = await getTrendingMovies('week');
  const recentReviews = await getRecentMovieReviews();
  const inTheaters = await getMoviesInTheaters();
  const randomMovie =
    trendingMovies[Math.floor(Math.random() * trendingMovies.length)];

  return (
    <main>
      <section className="w-full bg-gray-900 py-20 md:py-32 lg:py-40">
        <div className="px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col items-center space-y-4 p-5">
              <Image
                as={NextImage}
                src={randomMovie.backdrop}
                alt="Movie Backdrop"
                width="1200"
                height="600"
                isBlurred
                className="mx-auto aspect-[2/1] overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
              <p className="text-gray-400 md:text-xl">{randomMovie.title}</p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-gray-50 sm:text-5xl xl:text-6xl/none">
                  Discover Your Next Cinematic Adventure
                </h1>
                <p className="max-w-[600px] text-gray-400 md:text-xl">
                  Explore the world of cinema with our comprehensive review
                  database, personalized recommendations, and vibrant community.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-50 px-8 text-sm font-medium text-gray-900 shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-300"
                  href="/film/list"
                >
                  Explore Movies
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-transparent px-8 text-sm font-medium text-gray-50 shadow-sm transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-700"
                  href="/tv/reviews"
                >
                  Explore Reviews
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="px-4 md:px-6">
          <div className="space-y-4 flex flex-col items-center text-center">
            <div className="inline-block rounded-lg bg-gray-900 px-3 py-1 text-sm text-gray-50">
              Trending Movies
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-5xl dark:text-gray-50">
              What&apos;s Hot Right Now
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Discover the latest and greatest movies that have captured the
              attention of film enthusiasts worldwide.
            </p>
            <div className="w-full px-8">
              <FilmCarousel films={trendingMovies} />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-gray-100 py-12 md:py-24 dark:bg-gray-800">
        <div className="px-4 md:px-6">
          <div className="space-y-4 flex flex-col items-center text-center">
            <div className="inline-block rounded-lg bg-gray-900 px-3 py-1 text-sm text-gray-50">
              Popular Reviews
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-5xl dark:text-gray-50">
              What People Are Saying
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Check out what movie fans are loving right now with the top user
              reviews everyone’s talking about.
            </p>
            <div className="w-full px-8">
              <UserReviewCarousel reviews={recentReviews} />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="px-4 md:px-6">
          <div className="space-y-4 flex flex-col items-center text-center">
            <div className="inline-block rounded-lg bg-gray-900 px-3 py-1 text-sm text-gray-50">
              New Releases
            </div>
            <h2 className="text-3xl font-bold tracking-tighter text-gray-900 sm:text-5xl dark:text-gray-50">
              In Theaters Now
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Explore the newest must-see films currently lighting up the big
              screen and captivating audiences in theaters everywhere.
            </p>
            <div className="w-full px-8">
              <FilmCarousel films={inTheaters} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
