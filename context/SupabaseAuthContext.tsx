'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type Profile = { id: string; role: string; full_name?: string | null; avatar_url?: string | null };

interface SupabaseAuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function useSupabaseAuth() {
  const ctx = useContext(SupabaseAuthContext);
  if (ctx === undefined) throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  return ctx;
}

interface SupabaseAuthProviderProps {
  children: ReactNode;
}

export function SupabaseAuthProvider({ children }: SupabaseAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      return;
    }
    supabase
      .from('profiles')
      .select('id, role, full_name, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const p = data as (Omit<Profile, 'role'> & { role?: string | null }) | null;
        if (p) setProfile({ ...p, role: p.role ?? 'user' });
        else setProfile(null);
      })
      .catch(() => setProfile(null));
  }, [user?.id]);

  return (
    <SupabaseAuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}
