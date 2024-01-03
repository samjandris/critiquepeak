'use server';

import { cookies } from 'next/headers';
import { getServer } from '@/lib/supabase';
import { UserDB, User } from '@/lib/types';

export async function createUser(user: UserDB) {
  const supabase = getServer(cookies());

  const { error } = await supabase.from('users').insert(user);

  if (error) {
    console.error(error);
    throw error;
  }
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

  try {
    const { data: avatarData } = await supabase.storage
      .from('avatars')
      .getPublicUrl(`${id}/profile.png`);

    user.avatar = avatarData.publicUrl;
    user.followers = await getFollowerCount(id);
  } catch (error) {}

  return user;
}

export async function getUserByUsername(username: string): Promise<User> {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .limit(1);

  if (error) {
    console.error(error);
    throw error;
  }

  const user = data ? data[0] : null;

  try {
    const { data: avatarData } = await supabase.storage
      .from('avatars')
      .getPublicUrl(`${user.id}/profile.png`);

    user.avatar = avatarData.publicUrl;
    user.followers = await getFollowerCount(user.id);
  } catch (error) {}

  return user;
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

export async function isUserFollowing(userId: string, toCheck: string) {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('users')
    .select('following')
    .eq('id', userId)
    .limit(1);

  if (error) {
    console.error(error);
    throw error;
  }

  return data[0].following.includes(toCheck);
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

export async function getFollowerCount(id: string) {
  const supabase = getServer(cookies());

  const { count, error } = await supabase
    .from('users')
    .select('id', { count: 'exact' })
    .filter('following', 'cs', `{${id}}`);

  if (error) {
    console.error(error);
    throw error;
  }

  return count;
}

export async function followUser(userId: string, toFollow: string) {
  const supabase = getServer(cookies());

  let user = await getUser(userId);
  let following: string[] = user.following;

  if (following.includes(toFollow)) return;
  following.push(toFollow);

  const { error } = await supabase
    .from('users')
    .update({ following })
    .eq('id', userId);

  if (error) {
    console.error(error);
    throw error;
  }

  return;
}

export async function unfollowUser(userId: string, toUnfollow: string) {
  const supabase = getServer(cookies());

  let user = await getUser(userId);
  let following: string[] = user.following;

  if (!following.includes(toUnfollow)) return;
  following = following.filter((id) => id !== toUnfollow);

  const { error } = await supabase
    .from('users')
    .update({ following })
    .eq('id', userId);

  if (error) {
    console.error(error);
    throw error;
  }

  return;
}
