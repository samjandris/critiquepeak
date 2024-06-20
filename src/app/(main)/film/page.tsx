import Link from 'next/link';

import { Button, Chip } from '@nextui-org/react';

import FilmBackdrop from '@/components/film/FilmBackdrop';
import FilmCarousel from '@/components/film/FilmCarousel';
import UserReviewCarousel from '@/components/user/UserReviewCarousel';

import { getTrendingMovies, getMoviesInTheaters } from '@/lib/film';
import { getRecentMovieReviews } from '@/lib/reviews';

export default async function FilmPage() {
  const trendingMovies = await getTrendingMovies('week');
  const recentReviews = await getRecentMovieReviews();
  const inTheaters = await getMoviesInTheaters();
  const randomMovie =
    trendingMovies[Math.floor(Math.random() * trendingMovies.length)];

  return (
    <main>
      <section className="w-full bg-accent-300 py-20 md:py-32 lg:py-40">
        <div className="relative px-4 md:px-6">
          <div className="absolute inset-0 bg-foreground blur-3xl opacity-50 top-[-25%] h-[150%]" />

          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] px-5">
            <FilmBackdrop film={randomMovie} />
            <div className="relative flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-text-100 sm:text-5xl xl:text-6xl/none">
                  Discover Your Next Cinematic Adventure
                </h1>
                <p className="max-w-[600px] text-text-300 md:text-xl">
                  Explore the world of cinema with our comprehensive review
                  database, personalized recommendations, and vibrant community.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  as={Link}
                  href="/film/list"
                  size="lg"
                  color="primary"
                  variant="shadow"
                >
                  Explore Movies
                </Button>
                <Button
                  as={Link}
                  href="/film/reviews"
                  size="lg"
                  color="secondary"
                  variant="ghost"
                >
                  Explore Reviews
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="px-4 md:px-6">
          <div className="space-y-4 flex flex-col items-center text-center">
            <Chip color="primary" variant="shadow" size="lg">
              Trending Movies
            </Chip>
            <h2 className="text-3xl font-bold tracking-tighter text-text-900 sm:text-5xl">
              What&apos;s Hot Right Now
            </h2>
            <p className="max-w-[700px] text-text-700 md:text-xl">
              Discover the latest and greatest movies that have captured the
              attention of film enthusiasts worldwide.
            </p>
            <div className="w-full px-8">
              <FilmCarousel films={trendingMovies} />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-accent-300 py-12 md:py-24">
        <div className="relative px-4 md:px-6">
          <div className="absolute inset-0 bg-foreground blur-3xl opacity-50 top-[-25%] h-[150%]" />

          <div className="relative space-y-4 flex flex-col items-center text-center">
            <Chip color="primary" variant="shadow" size="lg">
              Popular Reviews
            </Chip>
            <h2 className="text-3xl font-bold tracking-tighter text-text-100 sm:text-5xl">
              What People Are Saying
            </h2>
            <p className="max-w-[700px] text-text-300 md:text-xl">
              Check out what movie fans are loving right now with the top user
              reviews everyone’s talking about.
            </p>
            <div className="w-full px-8 text-text-200">
              <UserReviewCarousel reviews={recentReviews} />
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="px-4 md:px-6">
          <div className="space-y-4 flex flex-col items-center text-center">
            <Chip color="primary" variant="shadow" size="lg">
              New Releases
            </Chip>
            <h2 className="text-3xl font-bold text-text-900 tracking-tighter sm:text-5xl">
              In Theaters Now
            </h2>
            <p className="max-w-[700px] text-text-700 md:text-xl">
              Explore the newest must-see films currently lighting up the big
              screen and captivating audiences in theaters everywhere.
            </p>
            <div className="w-full px-8 text-text">
              <FilmCarousel films={inTheaters} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
