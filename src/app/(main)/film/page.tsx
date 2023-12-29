import FilmCarousel from '@/components/film/FilmCarousel';

const films = [
  {
    title: 'Saltburn',
    poster:
      'https://a.ltrbxd.com/resized/film-poster/8/3/5/7/7/4/835774-saltburn-0-230-0-345-crop.jpg?v=b58cbd3b08',
  },
  {
    title: 'Wonka',
    poster:
      'https://a.ltrbxd.com/resized/film-poster/7/0/6/0/8/3/706083-wonka-0-230-0-345-crop.jpg?v=d4bd6afd7f',
  },
  {
    title: 'Home Alone',
    poster:
      'https://a.ltrbxd.com/resized/sm/upload/e6/mn/oi/ky/8IWPBT1rkAaI8Kpk5V3WfQRklJ7-0-230-0-345-crop.jpg?v=cb22d36a0e',
  },
  {
    title: 'Rebel Moon',
    poster:
      'https://a.ltrbxd.com/resized/film-poster/7/6/2/8/1/2/762812-rebel-moon-part-one-a-child-of-fire-0-230-0-345-crop.jpg?v=6a83b584be',
  },
  {
    title: 'Leave the World Behind',
    poster:
      'https://a.ltrbxd.com/resized/film-poster/6/4/8/8/6/9/648869-leave-the-world-behind-0-230-0-345-crop.jpg?v=927d0da068',
  },
  {
    title: 'Maestro',
    poster:
      'https://a.ltrbxd.com/resized/film-poster/4/5/3/0/6/9/453069-maestro-0-230-0-345-crop.jpg?v=1dde1fa55f',
  },
  {
    title: 'Poor Things',
    poster:
      'https://a.ltrbxd.com/resized/film-poster/7/1/0/3/5/2/710352-poor-things-0-230-0-345-crop.jpg?v=a0f2ee9a0e',
  },
  {
    title: 'The Iron Claw',
    poster:
      'https://a.ltrbxd.com/resized/film-poster/7/6/4/8/9/0/764890-the-iron-claw-0-230-0-345-crop.jpg?v=321a07c4f2',
  },
  {
    title: "It's a Wonderful Life",
    poster:
      'https://a.ltrbxd.com/resized/film-poster/5/0/9/4/9/50949-it-s-a-wonderful-life-0-230-0-345-crop.jpg?v=64b72dd083',
  },
  {
    title: 'The Hunger Games: The Ballad of Songbirds and Snakes',
    poster:
      'https://a.ltrbxd.com/resized/film-poster/6/1/9/5/1/0/619510-the-hunger-games-the-ballad-of-songbirds-snakes-0-230-0-345-crop.jpg?v=180f24b89f',
  },
];

export default function Film() {
  return (
    <main>
      <section className="p-8">
        <h4 className="ml-1 mb-2">Popular films this week</h4>
        <FilmCarousel films={films} />
      </section>

      <section className="p-8">
        <h4 className="ml-1 mb-2">New reviews</h4>
      </section>
    </main>
  );
}
