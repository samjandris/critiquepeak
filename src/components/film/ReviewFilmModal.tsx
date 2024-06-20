'use client';

import { useState } from 'react';
import { useDebounce, useMeasure } from '@uidotdev/usehooks';
import useSWR from 'swr';
import {
  Button,
  Checkbox,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Skeleton,
  Textarea,
  cn,
} from '@nextui-org/react';
import Search from '@/components/Search';
import { StarRating } from '@/components/StarRating';
import { searchMovies } from '@/lib/film';
import { createMovieReview } from '@/lib/reviews';
import { Film } from '@/lib/types';

export default function ReviewFilmModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [reviewStep, setReviewStep] = useState(1);
  const [posterRef, { height: posterHeight }] = useMeasure<HTMLImageElement>();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Film | null>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filmRating, setFilmRating] = useState(0);
  const [isReviewWritten, setIsReviewWritten] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [isRewatch, setIsRewatch] = useState(false);
  const { data: searchResults, isLoading: searchResultsIsLoading } = useSWR(
    ['search', 'film', debouncedSearchTerm],
    () => {
      if (!debouncedSearchTerm) return;
      if (debouncedSearchTerm.toLowerCase() === selectedMovie?.title) return;
      return searchMovies(debouncedSearchTerm, { posterSize: 'w185' });
    }
  );

  function handleOpenClose() {
    setReviewStep(1);
    setSelectedMovie(null);
    setSearchTerm('');
    setFilmRating(0);
    setIsReviewWritten(false);
    setReviewText('');
    setIsRewatch(false);
    onOpenChange();
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenClose}
      hideCloseButton
      isDismissable={false}
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>Review a film</ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr,2fr] gap-4">
              <div ref={posterRef} className="aspect-[1/1.5]">
                {selectedMovie ? (
                  <Image
                    src={selectedMovie?.poster}
                    alt={selectedMovie?.title}
                    isBlurred
                    shadow="md"
                  />
                ) : (
                  <Skeleton className="w-full h-full rounded-xl" />
                )}
              </div>
              <div
                style={{
                  height: (posterHeight && Math.round(posterHeight)) || 0, // Math.round needed to fix chrome resizing modal indefinitely
                }}
                className={cn(
                  'flex flex-col',
                  selectedMovie ? 'gap-1' : 'gap-4'
                )}
              >
                {selectedMovie ? (
                  <p className="text-medium font-bold leading-5">
                    {selectedMovie?.title}
                  </p>
                ) : (
                  <Skeleton className="h-1/3 rounded-xl" />
                )}
                {selectedMovie ? (
                  <ScrollShadow>
                    <p className="text-xs overflow-hidden">
                      {selectedMovie?.overview}
                    </p>
                  </ScrollShadow>
                ) : (
                  <Skeleton className="h-full rounded-xl" />
                )}
              </div>
            </div>

            {/*
            Step 1: Search for a film
            */}
            {reviewStep === 1 && (
              <Search
                type="film"
                onSelectionChange={(film) => setSelectedMovie(film)}
              />
              // <Autocomplete
              //   size="lg"
              //   label="Search for a film"
              //   menuTrigger="input"
              //   onInputChange={(filmTitle) => {
              //     if (
              //       filmTitle.toLowerCase() !== searchTerm.toLowerCase() &&
              //       filmTitle.toLowerCase() !==
              //         selectedMovie?.title.toLowerCase()
              //     ) {
              //       setSearchTerm(filmTitle);
              //     }
              //   }}
              //   onSelectionChange={(filmId) => {
              //     if (!filmId) return;
              //     setSelectedMovie(
              //       searchResults?.find((film: Film) => film.id == filmId) ||
              //         null
              //     );
              //   }}
              // >
              //   {searchResults &&
              //     searchResults.map((film: Film) => (
              //       <AutocompleteItem
              //         key={film.id}
              //         startContent={
              //           <Image
              //             src={film.poster}
              //             alt={film.title}
              //             isBlurred
              //             shadow="md"
              //             className="h-12 aspect-[1/1.5] rounded-md object-contain"
              //           />
              //         }
              //       >
              //         {film.title}
              //       </AutocompleteItem>
              //     ))}
              // </Autocomplete>
            )}

            {/*
            Step 2: Review the film
            */}
            {reviewStep == 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <Checkbox
                      isSelected={isReviewWritten}
                      onValueChange={setIsReviewWritten}
                    >
                      Written review?
                    </Checkbox>
                    <Checkbox
                      isSelected={isRewatch}
                      onValueChange={setIsRewatch}
                    >
                      Rewatch?
                    </Checkbox>
                  </div>
                  <StarRating
                    rating={filmRating}
                    setRating={setFilmRating}
                    isChangeable
                    className="w-[150px]"
                  />
                </div>
                {isReviewWritten && (
                  <Textarea
                    size="lg"
                    label="Your review"
                    placeholder="Write your review here"
                    value={reviewText}
                    onValueChange={setReviewText}
                  />
                )}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="shadow" onPress={handleOpenClose}>
            Cancel
          </Button>
          <Button
            isDisabled={reviewStep <= 1}
            color="secondary"
            variant="shadow"
            onPress={() => {
              setReviewStep(reviewStep - 1);
            }}
          >
            Back
          </Button>
          <Button
            color="primary"
            variant="shadow"
            isDisabled={!selectedMovie || (reviewStep >= 2 && filmRating === 0)}
            onPress={() => {
              if (reviewStep >= 2) {
                if (!selectedMovie || filmRating === 0) return;
                createMovieReview(
                  selectedMovie.id,
                  filmRating,
                  isReviewWritten ? reviewText : undefined,
                  isRewatch
                );
                handleOpenClose();
              } else {
                setReviewStep(reviewStep + 1);
              }
            }}
          >
            {reviewStep >= 2 ? 'Post' : 'Next'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
