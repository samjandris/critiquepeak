'use server';

const movieDbApiKey = process.env.TMDB_API_KEY;
const movieDbHeaders = {
  accept: 'application/json',
  Authorization: 'Bearer ' + process.env.TMDB_ACCESS_TOKEN,
};

const defaults = {
  posterSize: 'w780',
  backdropSize: 'w1280',
};

let config = {
  images: {
    base_url: 'http://image.tmdb.org/t/p/',
    secure_base_url: 'https://image.tmdb.org/t/p/',
    backdrop_sizes: ['w300', 'w780', 'w1280', 'original'],
    logo_sizes: ['w45', 'w92', 'w154', 'w185', 'w300', 'w500', 'original'],
    poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
    profile_sizes: ['w45', 'w185', 'h632', 'original'],
    still_sizes: ['w92', 'w185', 'w300', 'original'],
  },
  change_keys: [
    'adult',
    'air_date',
    'also_known_as',
    'alternative_titles',
    'biography',
    'birthday',
    'budget',
    'cast',
    'certifications',
    'character_names',
    'created_by',
    'crew',
    'deathday',
    'episode',
    'episode_number',
    'episode_run_time',
    'freebase_id',
    'freebase_mid',
    'general',
    'genres',
    'guest_stars',
    'homepage',
    'images',
    'imdb_id',
    'languages',
    'name',
    'network',
    'origin_country',
    'original_name',
    'original_title',
    'overview',
    'parts',
    'place_of_birth',
    'plot_keywords',
    'production_code',
    'production_companies',
    'production_countries',
    'releases',
    'revenue',
    'runtime',
    'season',
    'season_number',
    'season_regular',
    'spoken_languages',
    'status',
    'tagline',
    'title',
    'translations',
    'tvdb_id',
    'tvrage_id',
    'type',
    'video',
    'videos',
  ],
};

async function getConfig() {
  if (config) return config;

  const response = await fetch(
    `https://api.themoviedb.org/3/configuration?api_key=${movieDbApiKey}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  config = await response.json();
  return config;
}

export async function getTrendingMovies(
  timeWindow: string,
  {
    posterSize = defaults.posterSize,
    backdropSize = defaults.backdropSize,
  } = {}
) {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${movieDbApiKey}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  const tmdbJson = await response.json();
  const tmdbData = tmdbJson.results;

  return tmdbData.map((movie: any) => {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: `${config.images.secure_base_url}${posterSize}${movie.poster_path}`,
      backdrop: `${config.images.secure_base_url}${backdropSize}${movie.backdrop_path}`,
      releaseDate: new Date(movie.release_date),
      averageRating: movie.vote_average / 2,
    };
  });
}

export async function getMovie(
  movieId: string,
  {
    posterSize = defaults.posterSize,
    backdropSize = defaults.backdropSize,
  } = {}
) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${movieDbApiKey}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  const tmdbData = await response.json();

  return {
    id: tmdbData.id,
    title: tmdbData.title,
    overview: tmdbData.overview,
    poster: `${config.images.secure_base_url}${posterSize}${tmdbData.poster_path}`,
    backdrop: `${config.images.secure_base_url}${backdropSize}${tmdbData.backdrop_path}`,
    releaseDate: new Date(tmdbData.release_date),
    averageRating: tmdbData.vote_average / 2,
    tagline: tmdbData.tagline,
    runtime: tmdbData.runtime,
    budget: tmdbData.budget,
  };
}

export async function searchMovies(
  searchTerm: string,
  {
    posterSize = defaults.posterSize,
    backdropSize = defaults.backdropSize,
  } = {}
) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${movieDbApiKey}&query=${searchTerm}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  const tmdbJson = await response.json();
  const tmdbData = tmdbJson.results;

  return tmdbData.map((movie: any) => {
    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster: `${config.images.secure_base_url}${posterSize}${movie.poster_path}`,
      backdrop: `${config.images.secure_base_url}${backdropSize}${movie.backdrop_path}`,
      releaseDate: new Date(movie.release_date),
      averageRating: movie.vote_average / 2,
    };
  });
}
