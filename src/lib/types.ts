export interface UserDB {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  created_at: string;
  following: [];
}

export interface User extends UserDB {
  avatar: string;
  followers: number;
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
  reviewedBy: User;
  review: string;
  rating: number;
  createdAt?: string;
}

export interface FilmReview extends Review {
  film: Film;
}

export interface SeriesReview extends Review {
  series: string;
}

export interface SeasonReview extends SeriesReview {
  series: string;
  season: number;
}
