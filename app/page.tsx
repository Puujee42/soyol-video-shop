'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Package, Plane, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import PromoGrid from '@/components/PromoGrid';
import DiscoveryProductCard from '@/components/DiscoveryProductCard';
import type { Product } from '@models/Product';

// High-quality products with professional Unsplash images
const mockProducts: Product[] = [
  // IN STOCK PRODUCTS
  {
    id: '1',
    name: 'Apple Watch Series 9 - Titanium',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
    price: 1299000,
    rating: 4.9,
    category: 'tech',
    featured: true,
    stockStatus: 'in-stock',
    inventory: 8,
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    price: 449000,
    rating: 4.8,
    category: 'tech',
    stockStatus: 'in-stock',
    inventory: 15,
  },
  {
    id: '3',
    name: 'Nike Air Max 270 - White/Black',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    price: 189000,
    rating: 4.7,
    category: 'fashion',
    featured: true,
    stockStatus: 'in-stock',
    inventory: 23,
  },
  {
    id: '4',
    name: 'Premium Leather Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    price: 129000,
    rating: 4.6,
    category: 'fashion',
    stockStatus: 'in-stock',
    inventory: 12,
  },
  {
    id: '5',
    name: 'Minimalist Office Desk Lamp',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop',
    price: 69000,
    rating: 4.5,
    category: 'home',
    stockStatus: 'in-stock',
    inventory: 30,
  },
  {
    id: '6',
    name: 'Wireless Gaming Mouse - RGB',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop',
    price: 89000,
    rating: 4.7,
    category: 'gaming',
    stockStatus: 'in-stock',
    inventory: 18,
  },
  {
    id: '7',
    name: 'Canon EOS R6 Mark II Camera',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=800&fit=crop',
    price: 2899000,
    rating: 4.9,
    category: 'tech',
    featured: true,
    stockStatus: 'in-stock',
    inventory: 5,
  },
  {
    id: '8',
    name: 'Modern Wall Clock - Minimalist',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&h=800&fit=crop',
    price: 39000,
    rating: 4.5,
    category: 'home',
    stockStatus: 'in-stock',
    inventory: 45,
  },

  // PRE-ORDER PRODUCTS
  {
    id: '9',
    name: 'iPhone 15 Pro Max 512GB - Natural Titanium',
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&h=800&fit=crop',
    price: 1799000,
    rating: 5.0,
    category: 'tech',
    featured: true,
    wholesale: true,
    stockStatus: 'pre-order',
  },
  {
    id: '10',
    name: 'Adidas Yeezy Boost 350 V2',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop',
    price: 299000,
    rating: 4.8,
    category: 'fashion',
    stockStatus: 'pre-order',
  },
  {
    id: '11',
    name: 'Aesthetic Room Decor Set',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=800&fit=crop',
    price: 159000,
    rating: 4.6,
    category: 'home',
    stockStatus: 'pre-order',
  },
  {
    id: '12',
    name: 'PlayStation 5 Pro Digital Edition',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop',
    price: 699000,
    rating: 4.9,
    category: 'gaming',
    wholesale: true,
    stockStatus: 'pre-order',
  },
  {
    id: '13',
    name: 'Premium Coffee Maker - Espresso Machine',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=800&fit=crop',
    price: 349000,
    rating: 4.7,
    category: 'home',
    stockStatus: 'pre-order',
  },
  {
    id: '14',
    name: 'Luxury Designer Sunglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
    price: 89000,
    rating: 4.6,
    category: 'fashion',
    stockStatus: 'pre-order',
  },
  {
    id: '15',
    name: 'Mechanical Gaming Keyboard - RGB',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop',
    price: 149000,
    rating: 4.8,
    category: 'gaming',
    stockStatus: 'pre-order',
  },
  {
    id: '16',
    name: 'Smart Home Speaker System',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
    price: 199000,
    rating: 4.5,
    category: 'tech',
    stockStatus: 'pre-order',
  },
];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'in-stock' | 'pre-order'>('all');

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return mockProducts;
    return mockProducts.filter(p => p.stockStatus === activeFilter);
  }, [activeFilter]);

  const inStockCount = mockProducts.filter(p => p.stockStatus === 'in-stock').length;
  const preOrderCount = mockProducts.filter(p => p.stockStatus === 'pre-order').length;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Top Promo Grid */}
      <div className="relative z-10 pt-4 bg-white">
        <PromoGrid />
      </div>

      {/* PREMIUM HERO BANNERS - Minimalist */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Banner 1: Ready to Ship - Clean & Elegant */}
          <Link href="/ready-to-ship">
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-10 transition-all hover:shadow-2xl hover:shadow-black/5 cursor-pointer"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent pointer-events-none" />
              
              <div className="relative">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 mb-6 group-hover:bg-slate-100 transition-colors">
                  <Package className="w-7 h-7 text-slate-900" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                  Бэлэн байгаа бараа
                </h2>

                {/* Subtitle */}
                <p className="text-slate-600 text-base mb-6 leading-relaxed">
                  Шууд хүргэлттэй бүтээгдэхүүнүүд
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-[#FF8C00] font-semibold group-hover:gap-3 transition-all">
                  <span>Үзэх</span>
                  <ArrowRight className="w-5 h-5" strokeWidth={2} />
                </div>

                {/* Count Badge */}
                <div className="absolute top-0 right-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF8C00] text-white rounded-full text-sm font-semibold shadow-sm">
                  <span>{inStockCount}</span>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Banner 2: Pre-order - Clean & Elegant */}
          <Link href="/pre-order">
            <motion.div
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-10 transition-all hover:shadow-2xl hover:shadow-black/5 cursor-pointer"
            >
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent pointer-events-none" />
              
              <div className="relative">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 mb-6 group-hover:bg-slate-100 transition-colors">
                  <Plane className="w-7 h-7 text-slate-900" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                  Захиалгаар ирэх бараа
                </h2>

                {/* Subtitle */}
                <p className="text-slate-600 text-base mb-6 leading-relaxed">
                  Онцгой үнээр 7-14 хоногт
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-[#FF8C00] font-semibold group-hover:gap-3 transition-all">
                  <span>Үзэх</span>
                  <ArrowRight className="w-5 h-5" strokeWidth={2} />
                </div>

                {/* Count Badge */}
                <div className="absolute top-0 right-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF8C00] text-white rounded-full text-sm font-semibold shadow-sm">
                  <span>{preOrderCount}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* MINIMALIST FILTER TABS */}
      <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            
            {/* All */}
            <motion.button
              onClick={() => setActiveFilter('all')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <span>Бүгд</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeFilter === 'all' ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {mockProducts.length}
              </span>
            </motion.button>

            {/* In Stock */}
            <motion.button
              onClick={() => setActiveFilter('in-stock')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                activeFilter === 'in-stock'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Package className="w-4 h-4" strokeWidth={2} />
              <span>Бэлэн байгаа</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeFilter === 'in-stock' ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {inStockCount}
              </span>
            </motion.button>

            {/* Pre-order */}
            <motion.button
              onClick={() => setActiveFilter('pre-order')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                activeFilter === 'pre-order'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Plane className="w-4 h-4" strokeWidth={2} />
              <span>Захиалгаар</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeFilter === 'pre-order' ? 'bg-white/20' : 'bg-slate-100'
              }`}>
                {preOrderCount}
              </span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Section Title - Minimal */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                {activeFilter === 'all' && 'Бүх бүтээгдэхүүн'}
                {activeFilter === 'in-stock' && 'Бэлэн байгаа бараа'}
                {activeFilter === 'pre-order' && 'Захиалгаар ирэх бараа'}
              </h2>
              <p className="text-slate-500 mt-2 text-lg">
                {filteredProducts.length} бүтээгдэхүүн
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.05, 
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <DiscoveryProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-6">
                  <Package className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">Бараа олдсонгүй</h3>
                <p className="text-slate-500">Энэ ангилалд одоогоор бараа байхгүй байна</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* TRUST FEATURES - Minimal & Professional */}
      <section className="border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Feature 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-6">
                <Zap className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Хурдан хүргэлт</h3>
              <p className="text-slate-600 leading-relaxed">
                24 цагийн дотор шууд хүргэж байна
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-6">
                <Shield className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Баталгаатай</h3>
              <p className="text-slate-600 leading-relaxed">
                100% жинхэнэ, чанартай бараа
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-6">
                <TrendingUp className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Найдвартай</h3>
              <p className="text-slate-600 leading-relaxed">
                Олон жилийн туршлагатай
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Ultra Minimal */}
      <section className="relative py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Soyol Video Shop
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Бид танд хамгийн чанартай бүтээгдэхүүнийг шууд хүргэх зорилготой ажилладаг. 
            Олон улсын брэндүүд, найдвартай хүргэлт, мэргэжлийн үйлчилгээ - бүгд нэг дороос.
          </p>
        </div>
      </section>

      {/* Newsletter - Minimal CTA */}
      <section className="relative py-24 bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            Шинэ бараа, хөнгөлөлтийн мэдээ
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            И-мэйл хаягаа үлдээгээд, онцгой санал авах боломжтой
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="И-мэйл хаяг"
              className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 outline-none focus:border-white/40 transition-colors backdrop-blur-xl"
            />
            <button className="px-8 py-4 bg-[#FF8C00] text-white font-semibold rounded-2xl hover:bg-[#FF8C00]/90 transition-all">
              Бүртгүүлэх
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
