'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck, Plane, TrendingUp, Flame, Zap } from 'lucide-react';
import DiscoveryProductCard from '@/components/DiscoveryProductCard';
import type { Product } from '@models/Product';

const mockProducts: Product[] = [
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
    name: 'iPhone 15 Pro Max 512GB',
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&h=800&fit=crop',
    price: 1799000,
    rating: 5.0,
    category: 'tech',
    featured: true,
    stockStatus: 'pre-order',
  },
  {
    id: '6',
    name: 'Adidas Yeezy Boost 350 V2',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&h=800&fit=crop',
    price: 299000,
    rating: 4.8,
    category: 'fashion',
    stockStatus: 'pre-order',
  },
  {
    id: '7',
    name: 'PlayStation 5 Pro',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop',
    price: 699000,
    rating: 4.9,
    category: 'gaming',
    stockStatus: 'pre-order',
  },
  {
    id: '8',
    name: 'Premium Coffee Maker',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&h=800&fit=crop',
    price: 349000,
    rating: 4.7,
    category: 'home',
    stockStatus: 'pre-order',
  },
];

type FilterType = 'all' | 'ready' | 'pre-order';

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const inStockProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'in-stock'),
    []
  );
  
  const preOrderProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'pre-order'),
    []
  );

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'ready') return inStockProducts;
    if (activeFilter === 'pre-order') return preOrderProducts;
    return mockProducts;
  }, [activeFilter, inStockProducts, preOrderProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* TOP BANNER ROW - 3 Colorful Cards */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Шинэ ирсэн - Orange */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold mb-1">Шинэ ирсэн</h3>
                  <p className="text-white/90 text-sm">Хамгийн сүүлийн үеийн</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </motion.div>

            {/* Хамгийн их борлуулалттай - Dark Navy */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold mb-1">Их борлуулалттай</h3>
                  <p className="text-white/90 text-sm">Эрэлттэй бараанууд</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Flame className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </motion.div>

            {/* Flash Sale - Red */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600 p-6 cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-xl font-bold mb-1">Flash Sale</h3>
                  <p className="text-white/90 text-sm">Хязгаарлагдмал хугацаа</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* MAIN SELECTION CARDS - 2 Large Feature Cards */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* БЭЛЭН БАЙГАА БАРАА - Green Badge + Truck */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl border-2 border-gray-100 cursor-pointer"
            >
              <div className="absolute top-6 right-6">
                <div className="px-4 py-2 bg-emerald-100 rounded-full">
                  <span className="text-emerald-700 text-sm font-bold uppercase tracking-wide">
                    АГУУЛАХАД БЭЛЭН
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-emerald-500 rounded-2xl">
                  <Truck className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    БЭЛЭН БАЙГАА БАРАА
                  </h2>
                  <p className="text-gray-600 font-medium">
                    {inStockProducts.length} бараа
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                🚚 Өнөөдөр захиалбал маргааш хүргэнэ
              </p>

              <Link href="/ready-to-ship">
                <button className="w-full py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors text-lg shadow-lg">
                  Үзэх →
                </button>
              </Link>
            </motion.div>

            {/* ЗАХИАЛГААР ИРЭХ БАРАА - Orange Badge + Plane */}
            <motion.div
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl border-2 border-gray-100 cursor-pointer"
            >
              <div className="absolute top-6 right-6">
                <div className="px-4 py-2 bg-orange-100 rounded-full">
                  <span className="text-orange-700 text-sm font-bold uppercase tracking-wide">
                    ОНЦГОЙ ҮНЭ
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-orange-500 rounded-2xl">
                  <Plane className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-1">
                    ЗАХИАЛГААР ИРЭХ БАРАА
                  </h2>
                  <p className="text-gray-600 font-medium">
                    {preOrderProducts.length} бараа
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                ✈️ 7-14 хоногт олон улсаас хүргэнэ
              </p>

              <Link href="/pre-order">
                <button className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-lg shadow-lg">
                  Үзэх →
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FILTER TABS - Sticky */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-xl border-y border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            
            {/* Бүгд */}
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                activeFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Бүгд ({mockProducts.length})
            </button>

            {/* Бэлэн байгаа */}
            <button
              onClick={() => setActiveFilter('ready')}
              className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                activeFilter === 'ready'
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
              }`}
            >
              🚚 Бэлэн байгаа ({inStockProducts.length})
            </button>

            {/* Захиалгаар */}
            <button
              onClick={() => setActiveFilter('pre-order')}
              className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                activeFilter === 'pre-order'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              }`}
            >
              ✈️ Захиалгаар ({preOrderProducts.length})
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <DiscoveryProductCard 
                  product={product} 
                  index={index}
                  showTrendingBadge={index < 3}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
