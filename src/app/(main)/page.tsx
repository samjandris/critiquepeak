import Link from 'next/link';

import { Button, Avatar } from '@nextui-org/react';

import FilmBackdrop from '@/components/film/FilmBackdrop';

import { getTrendingMovies } from '@/lib/film';
import { getRandomUsers } from '@/lib/users';

export default async function HomePage() {
  const trendingMovies = await getTrendingMovies('week');
  const randomMovie =
    trendingMovies[Math.floor(Math.random() * trendingMovies.length)];

  const randomUsers = await getRandomUsers(6);

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center blur-[250px] opacity-35 animate-mainBackdrop"
            style={{
              backgroundImage: `url("${randomMovie.backdrop}")`,
            }}
          />
        </div>

        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="relative px-4 md:px-6">
            <div className="absolute inset-0 bg-foreground blur-[100px] opacity-50 top-[-50%] h-[200%]" />

            <div className="flex flex-col items-center space-y-12 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-text dark:text-text-800 tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover the Best in Movies and TV
                </h1>
                <p className="mx-auto max-w-[700px] md:text-xl text-text-900 dark:text-text-800">
                  CritiquePeak is your go-to destination for insightful reviews,
                  ratings, and recommendations across film and television.
                  Explore our growing community of passionate movie and TV
                  enthusiasts.
                </p>
              </div>
              <div className="space-x-4">
                <Button
                  as={Link}
                  href="/signup"
                  size="lg"
                  color="primary"
                  variant="shadow"
                >
                  Sign up
                </Button>
                <Button
                  as={Link}
                  href="/trending"
                  size="lg"
                  color="secondary"
                  variant="ghost"
                >
                  Explore
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-text tracking-tighter sm:text-5xl">
                  Comprehensive Reviews and Ratings
                </h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-text-800">
                  CritiquePeak offers in-depth reviews and ratings for the
                  latest movies and TV shows, helping you make informed
                  decisions about what to watch. Discover hidden gems and stay
                  up-to-date on the latest releases.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <FilmBackdrop film={randomMovie} labelPosition="bottom" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full py-12 md:py-24 lg:py-32">
          {/* <div className="absolute inset-0 bg-foreground blur-[100px] opacity-50 top-[-50%] h-[200%]" /> */}

          <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-text tracking-tighter sm:text-4xl md:text-5xl">
                Join Our Growing Community
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-text-800">
                Connect with fellow movie and TV enthusiasts, share your
                thoughts, and discover new content to enjoy. CritiquePeak is the
                perfect platform to explore your passions and find your next
                favorite show or film.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 lg:grid-cols-6 items-center justify-center gap-8 lg:gap-12 [&>img]:mx-auto">
              {randomUsers.map((user) => (
                <Link
                  key={user.id}
                  href={'/profile/' + user.username}
                  className="flex flex-col items-center gap-2 hover:scale-105 active:scale-90 transition-all"
                >
                  <Avatar
                    isBordered
                    src={user.avatar}
                    name={user.initials}
                    showFallback
                    className="w-24 h-24 text-xl"
                  />
                  <p className="text-sm font-medium">{user.username}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="grid items-center justify-center gap-12 px-4 md:px-6 text-center">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Start Exploring Today
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Whether you&apos;re a movie buff or a TV fanatic, CritiquePeak
                has something for everyone. Sign up now to access our
                comprehensive reviews, ratings, and recommendations.
              </p>
            </div>
            <div className="relative flex flex-col gap-2 min-[400px]:flex-row justify-center">
              {/* <div className="absolute inset-0 bg-foreground blur-[50px] opacity-50 top-[-50%] h-[200%]" /> */}

              <Button
                as={Link}
                href="/signup"
                size="lg"
                color="primary"
                variant="shadow"
              >
                Sign up
              </Button>
              <Button
                as={Link}
                href="/film"
                size="lg"
                color="secondary"
                variant="solid"
              >
                Explore Film
              </Button>
              <Button
                as={Link}
                href="/tv"
                size="lg"
                color="secondary"
                variant="solid"
              >
                Explore TV
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
