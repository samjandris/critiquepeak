export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  following: number;
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
