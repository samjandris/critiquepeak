'use client';

import { useState } from 'react';
import { useDebounce, useMeasure } from '@uidotdev/usehooks';
import useSWR from 'swr';
import {
  Autocomplete,
  AutocompleteItem,
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
} from '@nextui-org/react';
import { StarRating } from '@/components/StarRating';
import { searchMovies } from '@/lib/film';
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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
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
            <div className="flex gap-4">
              <div ref={posterRef} className="h-[180px] aspect-[1/1.5]">
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
                  height: posterHeight || 0,
                }}
                className="flex flex-col w-full gap-1"
              >
                {selectedMovie ? (
                  <p className="text-md font-bold">{selectedMovie?.title}</p>
                ) : (
                  <Skeleton className="w-[200px] h-1/6 rounded-xl" />
                )}
                {selectedMovie ? (
                  <ScrollShadow>
                    <p className="text-xs overflow-hidden">
                      {selectedMovie?.overview}
                    </p>
                  </ScrollShadow>
                ) : (
                  <Skeleton className="w-[200px] h-1/2 rounded-xl" />
                )}
              </div>
            </div>

            {/*
            Step 1: Search for a film
            */}
            {reviewStep === 1 && (
              <Autocomplete
                size="lg"
                label="Search for a film"
                menuTrigger="input"
                onInputChange={(filmTitle) => {
                  if (
                    filmTitle.toLowerCase() !== searchTerm.toLowerCase() &&
                    filmTitle.toLowerCase() !==
                      selectedMovie?.title.toLowerCase()
                  ) {
                    setSearchTerm(filmTitle);
                  }
                }}
                onSelectionChange={(filmId) => {
                  if (!filmId) return;
                  setSelectedMovie(
                    searchResults?.find((film: Film) => film.id == filmId) ||
                      null
                  );
                }}
              >
                {searchResults &&
                  searchResults.map((film: Film) => (
                    <AutocompleteItem
                      key={film.id}
                      startContent={
                        <Image
                          src={film.poster}
                          alt={film.title}
                          isBlurred
                          shadow="md"
                          className="h-12 aspect-[1/1.5] rounded-md object-contain"
                        />
                      }
                    >
                      {film.title}
                    </AutocompleteItem>
                  ))}
              </Autocomplete>
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
                  <StarRating rating={filmRating} className="w-[150px]" />
                </div>
                {isReviewWritten && (
                  <Textarea
                    label="Your review"
                    placeholder="Write your review here"
                    onValueChange={setReviewText}
                  />
                )}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={handleOpenClose}>
            Cancel
          </Button>
          <Button
            isDisabled={reviewStep <= 1}
            onClick={() => {
              setReviewStep(reviewStep - 1);
            }}
          >
            Back
          </Button>
          <Button
            color="primary"
            isDisabled={!selectedMovie}
            onClick={() => {
              if (reviewStep >= 2) {
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
