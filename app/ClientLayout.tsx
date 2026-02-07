'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/context/LanguageContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ErrorBoundary>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </ErrorBoundary>
      </LanguageProvider>
    </SessionProvider>
  );
}
