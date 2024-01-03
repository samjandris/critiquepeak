export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar: string;
  created_at: string;
  following: [];
  followers?: number;
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
