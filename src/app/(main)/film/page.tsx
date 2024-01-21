import FilmCarousel from '@/components/film/FilmCarousel';
import UserReviewCarousel from '@/components/user/UserReviewCarousel';

import { getTrendingMovies } from '@/lib/film';
import { getRecentMovieReviews } from '@/lib/reviews';

export default async function FilmPage() {
  const films = await getTrendingMovies('week', {
    // posterSize: 'w342',
  });
  const recentReviews = await getRecentMovieReviews();

  return (
    <main>
      <section className="p-8">
        <h4 className="ml-1 mb-2">Popular films this week</h4>
        <FilmCarousel films={films} />
      </section>

      <section className="p-8">
        <h4 className="ml-1 mb-2">New reviews</h4>
        <UserReviewCarousel reviews={recentReviews} />
      </section>
    </main>
  );
}
