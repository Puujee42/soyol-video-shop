'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Package, Plane, ArrowRight } from 'lucide-react';
import PromoGrid from '@/components/PromoGrid';
import DiscoveryProductCard from '@/components/DiscoveryProductCard';
import type { Product } from '@models/Product';

// High-quality products with professional Unsplash images
const mockProducts: Product[] = [
  // ============================================
  // IN STOCK PRODUCTS (Бэлэн бараа)
  // ============================================
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

  // ============================================
  // PRE-ORDER PRODUCTS (Захиалгаар)
  // ============================================
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

  // Filter products based on active filter
  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return mockProducts;
    return mockProducts.filter(p => p.stockStatus === activeFilter);
  }, [activeFilter]);

  const inStockCount = mockProducts.filter(p => p.stockStatus === 'in-stock').length;
  const preOrderCount = mockProducts.filter(p => p.stockStatus === 'pre-order').length;

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Top 3 Bento Grid Blocks */}
      <div className="relative z-10 pt-4">
        <PromoGrid />
      </div>

      {/* ============================================ */}
      {/* PREMIUM BANNER SECTION */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Бэлэн байгаа бараа */}
          <Link href="/ready-to-ship">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="p-8 md:p-10">
                {/* Icon Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 rounded-full mb-4 shadow-md">
                  <Package className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Агуулахад бэлэн</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                  БЭЛЭН БАЙГАА БАРАА
                </h2>

                {/* Subtitle */}
                <p className="text-lg text-gray-700 font-medium mb-4">
                  🚚 Шууд хүргэлттэй • Өнөөдөр захиалаад маргааш аваарай
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-[#FF8C00] font-bold group-hover:gap-4 transition-all">
                  <span>Үзэх</span>
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Count Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-white rounded-full shadow-md">
                  <span className="text-2xl font-black text-green-600">{inStockCount}</span>
                  <span className="text-sm text-gray-600 ml-1">бараа</span>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-200/20 to-transparent pointer-events-none" />
            </motion.div>
          </Link>

          {/* Banner 2: Захиалгаар */}
          <Link href="/pre-order">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-100 border-2 border-[#FF8C00]/30 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="p-8 md:p-10">
                {/* Icon Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF8C00] rounded-full mb-4 shadow-md">
                  <Plane className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">Онцгой үнэ</span>
                </div>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                  ЗАХИАЛГААР ИРЭХ БАРАА
                </h2>

                {/* Subtitle */}
                <p className="text-lg text-gray-700 font-medium mb-4">
                  ✈️ Хамгийн хямд үнээр • 7-14 хоногт хүргэнэ
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-[#FF8C00] font-bold group-hover:gap-4 transition-all">
                  <span>Үзэх</span>
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Count Badge */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-white rounded-full shadow-md">
                  <span className="text-2xl font-black text-[#FF8C00]">{preOrderCount}</span>
                  <span className="text-sm text-gray-600 ml-1">бараа</span>
                </div>
              </div>

              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-200/20 to-transparent pointer-events-none" />
            </motion.div>
          </Link>
        </div>
      </section>

      {/* ============================================ */}
      {/* FILTER TABS */}
      {/* ============================================ */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {/* All Products */}
            <motion.button
              onClick={() => setActiveFilter('all')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>Бүгд</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{mockProducts.length}</span>
            </motion.button>

            {/* In Stock */}
            <motion.button
              onClick={() => setActiveFilter('in-stock')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeFilter === 'in-stock'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Бэлэн байгаа</span>
              <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs">{inStockCount}</span>
            </motion.button>

            {/* Pre-order */}
            <motion.button
              onClick={() => setActiveFilter('pre-order')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                activeFilter === 'pre-order'
                  ? 'bg-[#FF8C00] text-white shadow-lg'
                  : 'bg-orange-50 text-[#FF8C00] hover:bg-orange-100'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Захиалгаар</span>
              <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs">{preOrderCount}</span>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRODUCT GRID WITH ANIMATION */}
      {/* ============================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900">
                {activeFilter === 'all' && 'Бүх бараа'}
                {activeFilter === 'in-stock' && '🟢 Бэлэн байгаа бараа'}
                {activeFilter === 'pre-order' && '⏳ Захиалгаар ирэх бараа'}
              </h2>
              <p className="text-gray-600 mt-2">
                {filteredProducts.length} бүтээгдэхүүн олдлоо
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <DiscoveryProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Бараа олдсонгүй</h3>
                <p className="text-gray-500">Энэ ангилалд одоогоор бараа байхгүй байна</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ============================================ */}
      {/* SECONDARY CONTENT: Brand & Newsletter */}
      {/* ============================================ */}

      {/* About Section */}
      <section className="relative z-10 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              Soyol Video Shop - Таны итгэлтэй дэлгүүр
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Бид танд хамгийн чанартай бүтээгдэхүүнийг шууд хүргэх зорилготой ажилладаг. 
              Олон улсын брэндүүд, найдвартай хүргэлт, мэргэжлийн үйлчилгээ - бүгд нэг дороос. 
              Таны амьдралыг илүү тав тухтай болгох бүтээгдэхүүнүүдийг бид санал болгож байна.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10 py-20 bg-gradient-to-br from-soyol to-soyol-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white mb-3">
            Шинэ бараа, хөнгөлөлтийн мэдээ авах уу?
          </h2>
          <p className="text-lg text-white/90 mb-6 font-light">
            И-мэйл хаягаа үлдээгээд, шинэ бараа болон онцгой санал авах боломжтой
          </p>
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="И-мэйл хаяг"
              className="flex-1 px-6 py-3.5 rounded-xl outline-none focus:ring-4 focus:ring-white/30 transition-all text-gray-900"
              aria-label="Email address"
            />
            <button className="px-8 py-3.5 bg-white text-soyol font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:scale-105">
              Бүртгүүлэх
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
