import './globals.css';
<<<<<<< HEAD
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import LuxuryNavbar from '@components/LuxuryNavbar';
=======
import type { Metadata } from 'next';
import VibrantNavbar from '@components/VibrantNavbar';
>>>>>>> 724af3226febe215cd51dc5b8721cf47145076eb
import Footer from '@components/Footer';
import ClientLayout from './ClientLayout';
import { SITE_CONFIG } from '@lib/constants';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FF7900',
};

export const metadata: Metadata = {
<<<<<<< HEAD
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://soyol.mn'),
  title: {
    default: `${SITE_CONFIG.name} - ${SITE_CONFIG.description}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: 'Олон улсын чанартай бүтээгдэхүүнүүдийг бөөний үнээр. Хурдан хүргэлт, баталгаат чанар, найдвартай үйлчилгээ.',
  keywords: ['video shop', 'Mongolia', 'бөөний үнэ', 'онлайн худалдаа', 'хурдан хүргэлт', 'электрон бараа', 'гар утас', 'компьютер'],
  authors: [{ name: 'Soyol Video Shop' }],
  creator: 'Soyol Video Shop',
  publisher: 'Soyol Video Shop',
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'mn_MN',
    url: 'https://soyol.mn',
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.description}`,
    description: 'Олон улсын чанартай бүтээгдэхүүнүүдийг бөөний үнээр',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Online Shopping`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} - ${SITE_CONFIG.description}`,
    description: 'Олон улсын чанартай бүтээгдэхүүнүүдийг бөөний үнээр',
    images: ['/og-image.png'],
  },
=======
  title: `${SITE_CONFIG.name} - ${SITE_CONFIG.description}`,
  description: 'High-energy e-commerce platform with bold design',
>>>>>>> 724af3226febe215cd51dc5b8721cf47145076eb
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn" className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-white antialiased`}>
        <ClientLayout>
<<<<<<< HEAD
          <LuxuryNavbar />
=======
          <VibrantNavbar />
>>>>>>> 724af3226febe215cd51dc5b8721cf47145076eb
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
