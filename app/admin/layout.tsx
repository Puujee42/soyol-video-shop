'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'd.monkh2007@gmail.com';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, loading } = useSupabaseAuth();
  const isAdmin = profile?.role === 'admin' || user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login?callbackUrl=/admin');
      return;
    }
    if (!isAdmin) {
      router.replace('/');
    }
  }, [loading, user, isAdmin, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
