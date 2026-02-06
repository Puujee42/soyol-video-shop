'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
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

type ProductFilter = 'ready' | 'pre-order';

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<ProductFilter>('ready');

  const inStockProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'in-stock'),
    []
  );
  
  const preOrderProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'pre-order'),
    []
  );

  const featuredProduct = inStockProducts[0];

  // Filtered products based on active selection
  const displayedProducts = useMemo(() => {
    return activeFilter === 'ready' ? inStockProducts.slice(0, 12) : preOrderProducts.slice(0, 12);
  }, [activeFilter, inStockProducts, preOrderProducts]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative">
      
      {/* Subtle Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(212,115,74,0.3)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,115,74,0.2)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* PREMIUM HERO SECTION */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Small badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-8 border border-slate-100"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                <span className="text-xs font-medium text-slate-500 tracking-wide">Premium Collection</span>
              </motion.div>

              {/* Main title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-semibold text-slate-900 mb-6 leading-[1.1] tracking-[-0.02em]"
              >
                Шинэ үеийн<br />
                сонголт
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-slate-500 mb-10 leading-relaxed max-w-md"
              >
                Чанартай брэнд, найдвартай хүргэлт, мэргэжлийн үйлчилгээ
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/ready-to-ship">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all shadow-sm"
                  >
                    Бэлэн бараа үзэх
                  </motion.button>
                </Link>

                <Link href="/pre-order">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white text-slate-900 text-sm font-medium rounded-full hover:bg-slate-50 transition-all border border-slate-200"
                  >
                    Захиалгаар үзэх
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Featured Product with Floating Animation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Subtle glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100/40 to-transparent rounded-[4rem] blur-3xl" />
                
                {/* Product Card */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-[4rem] p-10 shadow-lg border border-slate-100/50">
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50">
                    {featuredProduct && (
                      <Image
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GHOST-STYLE SEGMENTED CONTROL */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            {/* Ghost Tabs Container */}
            <div className="inline-flex gap-8 p-2">
              
              {/* Ready Button */}
              <button
                onClick={() => setActiveFilter('ready')}
                className="relative px-6 py-3 text-sm font-medium transition-all"
              >
                <span className={`transition-all ${
                  activeFilter === 'ready' 
                    ? 'text-slate-900 font-semibold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}>
                  Агуулахад бэлэн
                </span>
                {activeFilter === 'ready' && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4734A] rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>

              {/* Pre-order Button */}
              <button
                onClick={() => setActiveFilter('pre-order')}
                className="relative px-6 py-3 text-sm font-medium transition-all"
              >
                <span className={`transition-all ${
                  activeFilter === 'pre-order' 
                    ? 'text-slate-900 font-semibold' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}>
                  Захиалгаар ирэх
                </span>
                {activeFilter === 'pre-order' && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4734A] rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </motion.div>

          {/* Info Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs text-slate-400 mt-6 tracking-wide"
          >
            {activeFilter === 'ready' 
              ? 'Өнөөдөр захиалбал маргааш хүргэнэ' 
              : '7-14 хоногт олон улсын тээвэрлэлтээр хүргэнэ'
            }
          </motion.p>
        </div>
      </section>

      {/* PRODUCT GRID - Premium Spacing */}
      <section className="relative py-12 pb-32">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20">
            <AnimatePresence mode="wait">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={`${activeFilter}-${product.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    delay: index * 0.04, 
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <DiscoveryProductCard 
                    product={product} 
                    index={index}
                    showTrendingBadge={index < 3}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Centered View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <Link href={activeFilter === 'ready' ? '/ready-to-ship' : '/pre-order'}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-10 py-4 bg-white text-slate-900 text-sm font-medium rounded-full hover:bg-slate-50 transition-all flex items-center gap-3 border border-slate-200 shadow-sm"
              >
                <span>Бүх бараа үзэх</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* NEWSLETTER CTA - Minimal */}
      <section className="relative py-24 border-t border-slate-100">
        <div className="max-w-2xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold text-slate-900 mb-4 tracking-tight">
              Шинэ бараа, хөнгөлөлт
            </h2>
            <p className="text-base text-slate-500 mb-8">
              И-мэйл хаягаа үлдээгээд, онцгой санал авах боломжтой
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="И-мэйл хаяг"
                className="flex-1 px-6 py-3.5 rounded-full bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-300 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-all shadow-sm whitespace-nowrap"
              >
                Бүртгүүлэх
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
