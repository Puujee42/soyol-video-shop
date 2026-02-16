'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  Heart, Share2, Star, Zap, ShoppingBag, CreditCard, User,
  ChevronRight, ShieldCheck, RotateCcw, Truck, MapPin,
  Info, CheckCircle2, Package, Eye, Clock, Award, Check,
  Minus, Plus, ArrowRight
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import RelatedProducts from './RelatedProducts';
import type { Product } from '@/models/Product';

export type ProductDetailData = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice?: number;
  image: string | null;
  category: string;
  stockStatus: string;
  inventory?: number;
  brand?: string;
  model?: string;
  warranty?: string;
  delivery?: string;
  paymentMethods?: string;
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  wholesale?: boolean;
  relatedProducts?: Product[];
};

export default function ProductDetailClient({ product }: { product: ProductDetailData }) {
  const { isAuthenticated } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const rating = product.rating ?? 4.5;
  const router = useRouter();
  const { addItem } = useCartStore();
  const { t } = useTranslation();

  // Mock multiple images for the gallery
  const images = [
    product.image || '/soyol-logo.png',
    product.image || '/soyol-logo.png',
    product.image || '/soyol-logo.png'
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ ...product, image: product.image || '', rating: product.rating ?? 0, stockStatus: product.stockStatus as any });
    }
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Сагсанд нэмэгдлээ!</p>
              <p className="mt-1 text-sm text-gray-500">{product.name}</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const handleBuyNow = () => {
    addItem({ ...product, image: product.image || '', rating: product.rating ?? 0, stockStatus: product.stockStatus as any });
    router.push('/checkout');
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Нэвтрэх шаардлагатай', {
        duration: 2000,
        position: 'top-right',
        style: { borderRadius: '16px' },
      });
      return;
    }
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Хүслээс хассан' : 'Хүсэлд нэмсэн');
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Sticky Header for Quick Actions */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: isScrolled ? 0 : -100 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-4 py-3 hidden md:block"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative rounded-lg overflow-hidden border border-slate-100">
              <Image src={product.image || '/soyol-logo.png'} alt={product.name} fill className="object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</h3>
              <p className="text-orange-600 font-bold text-sm">{formatPrice(product.price)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleAddToCart} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full font-bold text-sm transition-colors">
              Сагсанд
            </button>
            <button onClick={handleBuyNow} className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-sm transition-colors shadow-lg shadow-orange-500/20">
              Худалдаж авах
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-slate-900 transition-colors">Нүүр</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-slate-900 transition-colors capitalize">{product.category}</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left: Interactive Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <motion.div
              layoutId="main-image"
              className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm group"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[activeImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.wholesale && (
                  <span className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md">
                    Бөөний үнэ
                  </span>
                )}
                {product.stockStatus === 'in-stock' ? (
                  <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md">
                    {product.inventory !== undefined && product.inventory < 10
                      ? `${product.inventory} ширхэг`
                      : '10+ ширхэг'}
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md">
                    Захиалгаар
                  </span>
                )}
              </div>

              {/* Wishlist Fab */}
              <button
                onClick={handleWishlist}
                className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 text-slate-400 hover:text-red-500 hover:bg-white transition-all"
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
              </button>
            </motion.div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-white border-2 transition-all ${i === activeImageIndex ? 'border-orange-500 ring-2 ring-orange-100' : 'border-slate-100 hover:border-slate-300'
                    }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info & Buy Box (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Link href={`/store/${product.category.toLowerCase()}`} className="text-orange-600 font-bold text-sm tracking-wide uppercase hover:underline">
                  Soyol Official
                </Link>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-slate-700 font-bold text-sm">{rating}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-4xl font-black text-slate-900">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-slate-400 line-through decoration-2">{formatPrice(product.originalPrice)}</span>
                    <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">-{discount}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Key Features / Short Desc */}
            <div className="prose prose-sm text-slate-600">
              <p>{product.description || 'Энэхүү бүтээгдэхүүн нь хамгийн сүүлийн үеийн технологиор бүтээгдсэн бөгөөд мэргэжлийн түвшний гүйцэтгэлийг танд санал болгож байна.'}</p>
            </div>

            {/* Options Selection */}
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Тоо ширхэг</span>
                <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-full px-4 py-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.inventory ?? 10, quantity + 1))} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-bold hover:border-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Сагсанд нэмэх
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
                >
                  Шууд авах
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Шуурхай хүргэлт</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{product.delivery || '24-48 цагийн дотор'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Албан ёсны эрх</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{product.warranty || '1 жилийн баталгаа'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs & Info */}
        <div className="mt-20">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Техник үзүүлэлт</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { label: 'Брэнд', value: product.brand || product.category },
                { label: 'Загвар', value: product.model || product.name },
                { label: 'Төлөв', value: product.stockStatus === 'in-stock' ? 'Бэлэн' : 'Захиалгаар' },
                { label: 'Баталгаа', value: product.warranty || '12 сар' },
                { label: 'Хүргэлт', value: product.delivery || 'Үнэгүй' },
                { label: 'Төлбөрийн нөхцөл', value: product.paymentMethods || 'QPay, SocialPay, Card' }
              ].map((spec, i) => (
                <div key={i} className="flex justify-between py-4 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500 font-medium">{spec.label}</span>
                  <span className="text-slate-900 font-bold text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <RelatedProducts products={product.relatedProducts || []} />
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 md:hidden z-50 safe-area-pb">
        <div className="flex gap-3">
          <button onClick={handleAddToCart} className="flex-1 py-3 bg-slate-100 text-slate-900 rounded-xl font-bold text-sm">
            Сагсанд
          </button>
          <button onClick={handleBuyNow} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg">
            Шууд авах
          </button>
        </div>
      </div>
    </div >
  );
}
