'use client';

import { redirect } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Suspense,
} from 'react';

import { getClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

import { createUser } from '@/lib/users';

type AuthContextType = {
  auth: typeof supabase.auth;
  user: User | null;
  authLoaded: boolean;
  signIn: (formData: FormData) => void;
  signOut: () => void;
  signUp: (formData: FormData) => void;
};

const AuthContext = createContext<AuthContextType>(null!);

const supabase = getClient();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authLoaded, setAuthLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active sessions and set the user
    // supabase.auth
    //   .getSession()
    //   .then((session) => setUser(session?.data.session?.user || null));

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setAuthLoaded(true);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function signUp(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return redirect('/signup?message=Could not authenticate user');
    } else if (user) {
      await createUser({
        id: user.id,
        username,
        first_name: firstName,
        last_name: lastName,
        created_at: user.created_at,
      });
    } else {
      console.error('User was NOT created properly');

      return redirect('/signup?message=Could not create user in database');
    }

    return redirect('/signup?message=Check email to continue sign in process');
  }

  async function signIn(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect('/login?message=Could not authenticate user');
    }

    return redirect('/');
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        authLoaded,
        auth: supabase.auth,
        user,
        signUp,
        signIn,
        signOut,
      }}
    >
      <Suspense>{children}</Suspense>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
