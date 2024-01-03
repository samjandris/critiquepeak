'use server';

import { cookies } from 'next/headers';
import { getServer } from '@/lib/supabase';
import { User } from '@/lib/types';

export async function createUser(user: User) {
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

  return data ? data[0] : null;
}

export async function updateUser(
  id: string,
  user: {
    username?: string;
    avatar?: string;
    first_name?: string;
    last_name?: string;
  }
) {
  const supabase = getServer(cookies());

  const { data, error } = await supabase
    .from('users')
    .update(user)
    .eq('id', id);

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
