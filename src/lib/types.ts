export interface UserDB {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface User extends UserDB {
  avatar: string;
  following_count: number;
  follower_count: number;
}

export interface Film {
  id: number;
  title: string;
  overview: string;
  poster: string;
  backdrop: string;
  releaseDate: Date;
  averageRating: number;
  tagline?: string;
  runtime?: number;
  budget?: number;
}

export interface Review {
  id: string;
  user_id: string;
  review: string;
  rating: number;
  created_at: string;
}

export interface FilmReview extends Review {
  movie_id: string;
}

export interface SeriesReview extends Review {
  series: string;
}

export interface SeasonReview extends SeriesReview {
  series: string;
  season: number;
}
