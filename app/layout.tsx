import './globals.css';
import type { Metadata } from 'next';
import FloatingNavbar from '@components/FloatingNavbar';
import Footer from '@components/Footer';
import ClientLayout from './ClientLayout';
import { SITE_CONFIG } from '@lib/constants';

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - ${SITE_CONFIG.description}`,
  description: 'Modern high-performance e-commerce platform with floating navigation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className="min-h-screen bg-gray-50">
        <ClientLayout>
          <FloatingNavbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
