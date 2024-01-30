'use server';

import { cookies } from 'next/headers';
import { getServer } from '@/lib/supabase';
import { FilmReview } from '@/lib/types';

export async function createMovieReview(
  filmId: number,
  rating: number,
  review?: string,
  isRewatch = false
) {
  const supabase = getServer(cookies());

  const { error } = await supabase.from('movie_reviews').insert({
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
    .from('movie_reviews')
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
    .from('movie_reviews')
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
