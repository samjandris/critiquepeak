import FilmIdPage from './FilmIdPage';

import {
  getMovie,
  getMovieCast,
  getMovieCrew,
  getRecommendedMovies,
} from '@/lib/film';
import { getRecentReviews } from '@/lib/reviews';

export default async function FilmIdPageFetch({
  params,
}: {
  params: { filmId: string };
}) {
  const film = await getMovie(params.filmId);
  const cast = await getMovieCast(params.filmId);
  const crew = await getMovieCrew(params.filmId);
  const reviews = await getRecentReviews(params.filmId);
  const similarFilms = await getRecommendedMovies(params.filmId);

  return (
    <FilmIdPage
      film={film}
      cast={cast}
      crew={crew}
      reviews={reviews}
      similarFilms={similarFilms}
    />
  );
}
