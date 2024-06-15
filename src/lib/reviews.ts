'use server';

import { cookies } from 'next/headers';
import { getServer } from '@/lib/supabase';
import { FilmReview } from '@/lib/types';

import { getAuthedUser } from '@/lib/users';

export async function createMovieReview(
  filmId: number,
  rating: number,
  review?: string,
  isRewatch = false
) {
  const supabase = getServer(cookies());

  const { error } = await supabase.from('reviews_movies').insert({
    movie_id: filmId,
    rating,
    review,
    is_rewatch: isRewatch,
  });

  if (error) {
    console.error('Error posting review', error);
    throw error;
  }

  return;
}

export async function getRecentMovieReviews(): Promise<FilmReview[]> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('reviews_movies')
    .select('*')
    .not('review', 'is', null)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error getting recent reviews', error);
    throw error;
  }

  return data;
}

export async function getRecentReviews(filmId: number): Promise<FilmReview[]> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('reviews_movies')
    .select('*')
    .eq('movie_id', filmId)
    .not('review', 'is', null)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error getting recent reviews', error);
    throw error;
  }

  return data;
}

export async function getMovieReviewLikes(reviewId: string): Promise<number> {
  const supabase = getServer(cookies());

  const { count, error } = await supabase
    .from('reviews_movies_likes')
    .select('*', { count: 'exact' })
    .eq('review_id', reviewId);

  if (error) {
    console.error('Error getting review likes', error);
    throw error;
  }

  return count || 0;
}

export async function likeMovieReview(reviewId: string) {
  const supabase = getServer(cookies());

  const { error } = await supabase.from('reviews_movies_likes').insert({
    review_id: reviewId,
  });

  if (error) {
    console.error('Error liking review', error);
    throw error;
  }

  return;
}

export async function unlikeMovieReview(reviewId: string) {
  const supabase = getServer(cookies());

  const authUser = await getAuthedUser();

  const { error } = await supabase
    .from('reviews_movies_likes')
    .delete()
    .eq('user_id', authUser?.id)
    .eq('review_id', reviewId);

  if (error) {
    console.error('Error unliking review', error);
    throw error;
  }

  return;
}
