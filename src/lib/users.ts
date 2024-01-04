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

  try {
    const { data: avatarData } = await supabase.storage
      .from('avatars')
      .getPublicUrl(`${id}/profile.png`);

    user.avatar = avatarData.publicUrl;

    const response = await fetch(user.avatar, {
      method: 'HEAD',
    });

    if (!response.ok) {
      user.avatar = 'https://source.boringavatars.com/beam/' + user.id;
    }

    user.followers = await getFollowerCount(id);
  } catch (error) {}

  return user;
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

export async function getFollowerIds(id: string) {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .filter('following', 'cs', `{${id}}`);

  if (error) {
    console.error(error);
    throw error;
  }

  const ids = data.map((user) => user.id);
  return ids;
}
