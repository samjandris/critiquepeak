'use server';

import { cookies } from 'next/headers';
import { getServer } from '@/lib/supabase';
import { getInitialsFirstLast } from '@/lib/misc';
import { UserDB, User } from '@/lib/types';

export async function getAuthedUser(): Promise<User | null> {
  const supabase = getServer(cookies());

  const { data: authUserData, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    throw error;
  }

  if (!authUserData) {
    return null;
  }

  const user = await getUser(authUserData.user.id);

  return user;
}

export async function createUser(user: UserDB) {
  const supabase = getServer(cookies());

  const { error } = await supabase.from('users').insert(user);

  if (error) {
    console.error(error);
    throw error;
  }
}

export async function getUserIdByUsername(username: string): Promise<string> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .limit(1);

  if (error) {
    console.error(error);
    throw error;
  }

  return data[0].id;
}

export async function getUser(id: string): Promise<User> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .limit(1);

  if (error) {
    console.error(error);
    throw error;
  }

  const user = data ? data[0] : null;

  user.avatar = await getUserAvatar(id);
  user.initials = getInitialsFirstLast(user.first_name, user.last_name);
  user.following_count = await getFollowingCount(id);
  user.follower_count = await getFollowerCount(id);

  return user;
}

export async function getUserAvatar(id: string): Promise<string> {
  const supabase = getServer(cookies());

  const { data: avatarData } = await supabase.storage
    .from('avatars')
    .getPublicUrl(`${id}/profile.png`);

  return avatarData.publicUrl;
}

export async function updateUser(
  id: string,
  user: {
    username?: string;
    first_name?: string;
    last_name?: string;
  }
) {
  const supabase = getServer(cookies());

  const { error } = await supabase.from('users').update(user).eq('id', id);

  if (error) {
    console.error(error);
    throw error;
  }

  return;
}

export async function followUser(userId: string, toFollow: string) {
  const supabase = getServer(cookies());

  let { data: checkFollowsData } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', userId)
    .eq('following_id', toFollow);

  if (checkFollowsData?.length === 0) {
    const { error: insertFollowError } = await supabase.from('follows').insert({
      follower_id: userId,
      following_id: toFollow,
      timestamp: new Date().toISOString(),
    });

    if (insertFollowError) {
      console.error('Failed to follow user:', insertFollowError);
      throw insertFollowError;
    }
  }

  return;
}

export async function unfollowUser(userId: string, toUnfollow: string) {
  const supabase = getServer(cookies());

  const { error: deleteFollowError } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', userId)
    .eq('following_id', toUnfollow);

  if (deleteFollowError) {
    console.error('Failed to unfollow user:', deleteFollowError);
    throw deleteFollowError;
  }

  return;
}

export async function isUserFollowing(
  userId: string,
  toCheck: string
): Promise<boolean> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', userId)
    .eq('following_id', toCheck)
    .maybeSingle();

  if (error) {
    console.error('Error checking following status', error);
    throw error;
  }

  return data !== null;
}

export async function getFollowing(userId: string) {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('follows')
    .select('following_id:follows_following_id_fkey(*)')
    .eq('follower_id', userId);

  if (error) {
    console.error('Error getting list of following', error);
    throw error;
  }

  return data.map((follow) => follow.following_id);
}

export async function getFollowingIds(userId: string): Promise<string[]> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);

  if (error) {
    console.error('Error getting following IDs', error);
    throw error;
  }

  return data.map((follow) => follow.following_id);
}

export async function getFollowingCount(userId: string): Promise<number> {
  const supabase = getServer(cookies());

  const { count, error } = await supabase
    .from('follows')
    .select('following_id', { count: 'exact' })
    .eq('follower_id', userId);

  if (error) {
    console.error('Error getting follower count', error);
  }

  return count || 0;
}

export async function getFollowers(userId: string) {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('follows')
    .select('follower_id:follows_follower_id_fkey(*)')
    .eq('following_id', userId);

  if (error) {
    console.error('Error getting list of followers', error);
    throw error;
  }

  return data.map((follow) => follow.follower_id);
}

export async function getFollowerIds(userId: string): Promise<string[]> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('following_id', userId);

  if (error) {
    console.error('Error getting follower IDs', error);
    throw error;
  }

  return data.map((follow) => follow.follower_id);
}

export async function getFollowerCount(userId: string): Promise<number> {
  const supabase = getServer(cookies());

  const { count, error } = await supabase
    .from('follows')
    .select('follower_id', { count: 'exact' })
    .eq('following_id', userId);

  if (error) {
    console.error('Error getting follower count', error);
  }

  return count || 0;
}

export async function didUserLikeMovieReview(
  userId: string,
  reviewId: string
): Promise<boolean> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('reviews_movies_likes')
    .select('id')
    .eq('user_id', userId)
    .eq('review_id', reviewId)
    .maybeSingle();

  if (error) {
    console.error('Error checking if user liked review', error);
    throw error;
  }

  return data !== null;
}

export async function getRandomUsers(count: number): Promise<User[]> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('users')
    .select('*')
    // TODO - Fix random ordering
    // .order('random()')
    .limit(count);

  if (error) {
    console.error('Error getting random users', error);
    throw error;
  }

  for (const user of data) {
    user.avatar = await getUserAvatar(user.id);
    user.initials = getInitialsFirstLast(user.first_name, user.last_name);
  }

  return data;
}
