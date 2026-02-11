'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'd.monkh2007@gmail.com';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = user?.publicMetadata?.role === 'admin' || userEmail === ADMIN_EMAIL;

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }
    if (!isAdmin) {
      router.replace('/');
    }
  }, [isLoaded, isSignedIn, isAdmin, router]);

  if (!isLoaded || !isSignedIn || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
