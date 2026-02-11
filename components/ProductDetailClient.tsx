'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Heart, Share2, Star, Zap, ShoppingBag, CreditCard, User } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useUser } from '@clerk/nextjs';

export type ProductDetailData = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  stockStatus: string;
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  wholesale?: boolean;
};

export default function ProductDetailClient({ product }: { product: ProductDetailData }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const rating = product.rating ?? 4.5;
  const router = useRouter();
  const pathname = usePathname();
  const { addItem } = useCartStore();
  const { t } = useTranslation();
  const { isSignedIn } = useUser();

  const handleAddToCart = () => {
    addItem({ ...product, image: product.image || '', rating: product.rating ?? 0, stockStatus: product.stockStatus as any });
    toast.success(t('product', 'addedToCart'), {
      style: {
        background: '#1e293b',
        color: '#fff',
        borderRadius: '10px',
      },
      iconTheme: {
        primary: '#FF5000',
        secondary: '#fff',
      },
    });
  };

  const handleBuyNow = () => {
    addItem({ ...product, image: product.image || '', rating: product.rating ?? 0, stockStatus: product.stockStatus as any });
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-soyol">Нүүр</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-2xl"
          >
            <Image
              src={product.image || '/soyol-logo.png'}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {product.stockStatus && (
              <div className={`absolute top-6 right-6 px-5 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md ${product.stockStatus === 'in-stock'
                ? 'bg-green-50/90 text-green-700 border border-green-200'
                : 'bg-orange-50/90 text-orange-700 border border-orange-200'
                }`}>
                <span>{product.stockStatus === 'in-stock' ? '✓ Бэлэн байгаа' : '✈️ Захиалгаар'}</span>
              </div>
            )}
            {product.wholesale && (
              <div className="absolute top-6 left-6 px-6 py-2 bg-soyol rounded-full text-sm font-bold text-white shadow-lg flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Бөөний үнэ</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(rating) ? 'fill-soyol text-soyol' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({rating} үнэлгээ)</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-soyol/10 to-transparent rounded-2xl p-6 border border-soyol/20">
              <p className="text-5xl font-black text-soyol">{formatPrice(product.price)}</p>
              <p className="text-sm text-gray-600 mt-2">Татварын дүн орсон үнэ</p>
              {product.stockStatus && (
                <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl ${product.stockStatus === 'in-stock'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
                  }`}>
                  <span className="text-lg">
                    {product.stockStatus === 'in-stock' ? '🏠' : '✈️'}
                  </span>
                  <span className="text-sm font-bold">
                    {product.stockStatus === 'in-stock'
                      ? 'Бэлэн бараа - Шууд хүргэнэ'
                      : 'Олон улсын захиалга - 7-14 хоног'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {!isSignedIn ? (
                  <Link href={`/sign-in?redirect_url=${encodeURIComponent(pathname)}`} className="col-span-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
                    >
                      <User className="w-5 h-5" strokeWidth={2.5} />
                      {t('product', 'signInToOrder')}
                    </motion.button>
                  </Link>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="flex items-center justify-center gap-2 py-4 bg-white border-2 border-orange-500 text-orange-600 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-colors shadow-sm"
                    >
                      <ShoppingBag className="w-5 h-5" strokeWidth={2.5} />
                      {t('product', 'addToCart')}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
                    >
                      <CreditCard className="w-5 h-5" strokeWidth={2.5} />
                      {t('product', 'buyNow')}
                    </motion.button>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center transition ${isWishlisted ? 'bg-soyol text-white' : 'bg-white text-gray-700 hover:bg-soyol hover:text-white'
                    }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 bg-white rounded-2xl shadow-lg text-gray-700 hover:bg-soyol hover:text-white transition flex items-center justify-center"
                >
                  <Share2 className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Барааны тайлбар</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  'Энэхүү бараа нь өндөр чанартай материалаар хийгдсэн бөгөөд таны амьдралыг илүү тав тухтай болгоно.'}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Ангилал: {product.category}</p>
                <p className="text-sm text-gray-500">Барааны код: {product.id}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div >
    </div >
  );
}
