'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Award, Shield, Headphones, Sparkles, TrendingUp } from 'lucide-react';
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
  const inStockProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'in-stock').slice(0, 8),
    []
  );
  
  const preOrderProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'pre-order').slice(0, 8),
    []
  );

  const featuredProduct = inStockProducts[0];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Mesh Gradient Background - Subtle luxury */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#FF8C00_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,#FFA500_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#FFB84D_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,140,0,0.02)_50%,transparent_100%)]" />
      </div>

      {/* LUXURY HERO SECTION - Split Screen */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Small badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-[#FF8C00]" strokeWidth={2} />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Premium Collection</span>
              </motion.div>

              {/* Main title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight"
              >
                ШИНЭ ҮЕИЙН<br />
                СОНГОЛТ
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-slate-600 mb-8 leading-relaxed"
              >
                Чанартай брэнд, найдвартай хүргэлт,<br />
                мэргэжлийн үйлчилгээ
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(255, 140, 0, 0)',
                        '0 0 0 8px rgba(255, 140, 0, 0.1)',
                        '0 0 0 0 rgba(255, 140, 0, 0)',
                      ]
                    }}
                    transition={{ 
                      boxShadow: { duration: 2, repeat: Infinity, repeatDelay: 1 }
                    }}
                    className="px-8 py-4 bg-[#FF8C00] text-white font-semibold rounded-2xl hover:bg-[#FF8C00]/90 transition-colors shadow-lg"
                  >
                    Бэлэн бараа үзэх
                  </motion.button>
                </Link>

                <Link href="/pre-order">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 font-semibold rounded-2xl hover:border-slate-300 transition-colors"
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
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Glow effect behind product */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00]/20 to-[#FFA500]/20 rounded-[3rem] blur-3xl scale-90" />
                
                {/* Product Card */}
                <div className="relative bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50">
                    {featuredProduct && (
                      <Image
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                    
                    {/* Trending badge */}
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#FF8C00] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <TrendingUp className="w-3 h-3" />
                      <span>Эрэлттэй</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Ready to Ship Products */}
      <section className="relative py-20">
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Orange Accent Line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#FF8C00] to-[#FFA500] rounded-full" />
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Бэлэн байгаа бараа
                </h2>
                <p className="text-slate-500 text-sm mt-1">Шууд хүргэлттэй бүтээгдэхүүнүүд</p>
              </div>
            </div>
          </motion.div>

          {/* Product Grid with Viewport Animations */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {inStockProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ 
                  delay: index * 0.08, 
                  duration: 0.6,
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
          </div>

          {/* Centered View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link href="/ready-to-ship">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 border-2 border-[#FF8C00] text-[#FF8C00] font-semibold rounded-2xl hover:bg-[#FF8C00] hover:text-white transition-all flex items-center gap-3"
              >
                <span>Бүх бараа үзэх</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION - Clean & Minimal */}
      <section className="relative py-20 bg-gradient-to-b from-slate-50/50 to-white border-y border-slate-100">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-5 shadow-sm">
                <Truck className="w-8 h-8 text-[#FF8C00]" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Шууд хүргэлт</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Бэлэн байгаа бараанд</p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-5 shadow-sm">
                <Award className="w-8 h-8 text-[#FF8C00]" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Чанартай загварууд</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Сонгогдсон цуглуулга</p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-5 shadow-sm">
                <Shield className="w-8 h-8 text-[#FF8C00]" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Найдвартай төлбөр</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Дансаар болон Картаар</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-slate-200 mb-5 shadow-sm">
                <Headphones className="w-8 h-8 text-[#FF8C00]" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Тусламж</h3>
              <p className="text-sm text-slate-500 leading-relaxed">24/7 зөвлөгөө</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Pre-order Products */}
      <section className="relative py-20">
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header with Orange Accent Line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-1.5 h-12 bg-gradient-to-b from-[#FF8C00] to-[#FFA500] rounded-full" />
              <div>
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                  Захиалгаар
                </h2>
                <p className="text-slate-500 text-sm mt-1">Онцгой үнээр 7-14 хоногт</p>
              </div>
            </div>
          </motion.div>

          {/* Product Grid with Viewport Animations */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {preOrderProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ 
                  delay: index * 0.08, 
                  duration: 0.6,
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
          </div>

          {/* Centered View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link href="/pre-order">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 border-2 border-[#FF8C00] text-[#FF8C00] font-semibold rounded-2xl hover:bg-[#FF8C00] hover:text-white transition-all flex items-center gap-3"
              >
                <span>Бүх бараа үзэх</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Minimal & Elegant */}
      <section className="relative py-24 bg-slate-900 overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF8C00_0%,transparent_70%)]" />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#FF8C00] text-white font-semibold rounded-2xl hover:bg-[#FF8C00]/90 transition-all shadow-lg"
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
