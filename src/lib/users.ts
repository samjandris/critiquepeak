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
      user.avatar =
        'https://ui-avatars.com/api/?size=512&format=png&name=' +
        encodeURIComponent(`${user.first_name} ${user.last_name}`); // UI Avatars
      // user.avatar = 'https://source.boringavatars.com/beam/' + encodeURIComponent(user.id); // Boring Avatars
    }

    user.following_count = await getFollowingCount(id);
    user.follower_count = await getFollowerCount(id);
  } catch (error) {}

  return user;
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

export async function isUserFollowing(userId: string, toCheck: string) {
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

export async function getFollowingIds(userId: string) {
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

export async function getFollowingCount(userId: string) {
  const supabase = getServer(cookies());

  const { count, error } = await supabase
    .from('follows')
    .select('following_id', { count: 'exact' })
    .eq('follower_id', userId);

  if (error) {
    console.error('Error getting follower count', error);
  }

  return count;
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

export async function getFollowerIds(userId: string) {
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

export async function getFollowerCount(userId: string) {
  const supabase = getServer(cookies());

  const { count, error } = await supabase
    .from('follows')
    .select('follower_id', { count: 'exact' })
    .eq('following_id', userId);

  if (error) {
    console.error('Error getting follower count', error);
  }

  return count;
}

// TODO - Check performance of this, consider getting user data in one query
export async function getRandomUsers(count: number) {
  const supabase = getServer(cookies());

  const { data: dataIds, error } = await supabase
    .from('users')
    .select('id')
    // TODO - Fix random ordering
    // .order('random()')
    .limit(count);

  if (error) {
    console.error('Error getting random users', error);
    throw error;
  }

  const data = [];
  for (const userId of dataIds) {
    const user = await getUser(userId.id);
    data.push(user);
  }

  return data;
}
