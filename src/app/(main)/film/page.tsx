import FilmCarousel from '@/components/film/FilmCarousel';
import UserReviewCarousel from '@/components/user/UserReviewCarousel';

import { getTrendingMovies } from '@/lib/film';

import { faker } from '@faker-js/faker';

export default async function FilmPage() {
  const films = await getTrendingMovies('week', {
    posterSize: 'w342',
  });

  return (
    <main>
      <section className="p-8">
        <h4 className="ml-1 mb-2">Popular films this week</h4>
        <FilmCarousel films={films} />
      </section>

      <section className="p-8">
        <h4 className="ml-1 mb-2">New reviews</h4>
        <UserReviewCarousel
          reviews={Array.from({ length: 10 }).map(() => ({
            id: faker.string.uuid(),
            reviewedBy: {
              id: faker.string.uuid(),
              name: faker.person.fullName(),
              username: faker.internet.userName(),
              avatar: faker.internet.avatar(),
              following: faker.number.int({ max: 1500 }),
              followers: faker.number.int({ max: 1250000 }),
            },
            review: faker.lorem.words(20),
            rating: faker.number.float({ min: 0, max: 5 }),
            film: {
              id: faker.number.int(),
              title: faker.lorem.words(3),
              overview: faker.lorem.words(20),
              poster: faker.image.url(),
              backdrop: faker.image.url(),
              releaseDate: faker.date.past(),
              averageRating: faker.number.float({ min: 0, max: 5 }),
            },
          }))}
        />
      </section>
    </main>
  );
}
