'use client';

import { SWRConfig } from 'swr';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/context/LanguageContext';
import { SupabaseAuthProvider } from '@/context/SupabaseAuthContext';

const swrDefaults = {
  revalidateOnFocus: false,
  dedupingInterval: 120000,
  errorRetryCount: 2,
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={swrDefaults}>
      <SessionProvider>
        <SupabaseAuthProvider>
        <LanguageProvider>
          <ErrorBoundary>
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </ErrorBoundary>
        </LanguageProvider>
        </SupabaseAuthProvider>
      </SessionProvider>
    </SWRConfig>
  );
}
