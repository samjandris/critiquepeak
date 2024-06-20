'use client';

import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '@uidotdev/usehooks';

import { useDisclosure, Tabs, Tab, Image, Button } from '@nextui-org/react';
import { StarRatingPrecise } from '@/components/StarRating';
import CreditsModal from '@/components/credits/CreditsModal';
import UserReviewCarousel from '@/components/user/UserReviewCarousel';
import FilmCarousel from '@/components/film/FilmCarousel';

import { Film, FilmReview, CastPerson, CrewPerson } from '@/lib/types';

const visible = [false, false, false, false, false];
const visibleIndexes = ['overview', 'cast', 'reviews', 'similar', 'details'];

export default function FilmIdPageContent({
  film,
  cast,
  crew,
  reviews,
  similarFilms,
}: {
  film: Film;
  cast: CastPerson[];
  crew: CrewPerson[];
  reviews: FilmReview[];
  similarFilms: Film[];
}) {
  const [currentTab, setCurrentTab] = useState('overview');

  const {
    isOpen: isCastModalOpen,
    onOpen: onCastModalOpen,
    onOpenChange: onCastModalOpenChange,
  } = useDisclosure();

  const [overviewRef, overviewEntry] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '-10%',
  });

  const [castRef, castEntry] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '-10%',
  });

  const [reviewsRef, reviewsEntry] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '-10%',
  });

  const [similarRef, similarEntry] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '-10%',
  });

  const [detailsRef, detailsEntry] = useIntersectionObserver({
    threshold: 0,
    rootMargin: '-10%',
  });

  useEffect(() => {
    if (
      !overviewEntry ||
      !castEntry ||
      !reviewsEntry ||
      !similarEntry ||
      !detailsEntry
    )
      return;

    visible[0] = overviewEntry.isIntersecting;
    visible[1] = castEntry.isIntersecting;
    visible[2] = reviewsEntry.isIntersecting;
    visible[3] = similarEntry.isIntersecting;
    visible[4] = detailsEntry.isIntersecting;

    const firstTrueIndex = visible.findIndex((item) => item === true);
    if (firstTrueIndex !== -1) {
      setCurrentTab(visibleIndexes[firstTrueIndex]);
    }
  }, [overviewEntry, castEntry, reviewsEntry, similarEntry, detailsEntry]);

  return (
    <div className="flex">
      <div className="flex-1 p-8">
        <div className="relative">
          <div className="absolute inset-0 top-96">
            <div
              className="w-full h-screen bg-contain bg-no-repeat blur-[400px] dark:blur-[500px] animate-filmBackdrop"
              style={{
                backgroundImage: `url("${film.backdrop}")`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-16 p-4">
          <section
            id="overview"
            ref={overviewRef}
            className="grid grid-cols-3 gap-5"
          >
            <div className="flex flex-col items-center gap-4">
              <Image
                src={film.poster}
                alt={'Poster for the film ' + film.title}
                shadow="md"
                isBlurred
                className="w-full"
              />

              <StarRatingPrecise
                rating={film.averageRating}
                className="w-[65%] h-auto"
              />
            </div>

            <div className="col-span-2 flex flex-col gap-2 justify-center">
              <div className="flex items-end">
                <h2 className="text-text">{film.title}</h2>
                <p className="p-4 text-text-500 font-bold">
                  {film.releaseDate.getFullYear()}
                </p>
              </div>
              <h5 className="text-text-700">{film.overview}</h5>
            </div>
          </section>

          <section id="cast" ref={castRef}>
            <div className="flex gap-8 items-center">
              <h4>Cast & Crew</h4>
              <Button
                size="sm"
                color="secondary"
                variant="shadow"
                onPress={onCastModalOpen}
              >
                View all &gt;
              </Button>

              <CreditsModal
                cast={cast}
                crew={crew}
                isOpen={isCastModalOpen}
                onOpenChange={onCastModalOpenChange}
              />
            </div>

            <div className="h-[300px]">test</div>
          </section>

          <section id="reviews" ref={reviewsRef}>
            <div className="flex gap-8 items-center">
              <h4>Reviews</h4>
              <Button size="sm" color="secondary" variant="shadow">
                View all &gt;
              </Button>
            </div>

            {/* <UserReviewCarousel reviews={reviews} /> */}
          </section>

          <section id="similar" ref={similarRef}>
            <div className="flex flex-col gap-4">
              <h4>More like this</h4>
              <div className="flex justify-center">
                {similarFilms && <FilmCarousel films={similarFilms} />}
              </div>
            </div>
          </section>

          <section id="details" ref={detailsRef}>
            <h4>Details</h4>
            <div className="h-screen">test reviews</div>
          </section>
        </div>
      </div>

      <div className="flex justify-center items-center sticky top-16 right-0 w-36 h-[calc(100vh-theme('spacing.16'))]">
        <div className="relative">
          <div className="absolute inset-0 bg-fuchsia-100 blur-3xl opacity-50" />
          <Tabs
            size="lg"
            isVertical
            variant="underlined"
            selectedKey={currentTab}
            onSelectionChange={(key) => {
              const offset =
                6 *
                parseFloat(getComputedStyle(document.documentElement).fontSize);
              const element = document.getElementById(key.toString());
              if (!element) return;

              window.scrollTo({
                top:
                  element.getBoundingClientRect().top + window.scrollY - offset,
                behavior: 'smooth',
              });
            }}
            className="text-text-900"
          >
            <Tab key="overview" title="Overview" />
            <Tab key="cast" title="Cast & Crew" />
            <Tab key="reviews" title="Reviews" />
            <Tab key="similar" title="More like this" />
            <Tab key="details" title="Details" />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
