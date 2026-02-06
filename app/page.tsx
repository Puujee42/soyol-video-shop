'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
  // Separate products by stock status
  const inStockProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'in-stock').slice(0, 8),
    []
  );
  
  const preOrderProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'pre-order').slice(0, 8),
    []
  );

  return (
    <div className="min-h-screen bg-white">
      
      {/* SECTION 1: Ready to Ship Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Бэлэн байгаа бараа
            </h2>
            <Link href="/ready-to-ship">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#FF8C00] transition-colors cursor-pointer"
              >
                <span>Бүгдийг үзэх</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </motion.div>
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {inStockProducts.map((product, index) => (
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
                <DiscoveryProductCard product={product} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-100" />
      </div>

      {/* SECTION 2: Pre-order Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Захиалгаар
            </h2>
            <Link href="/pre-order">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#FF8C00] transition-colors cursor-pointer"
              >
                <span>Бүгдийг үзэх</span>
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </motion.div>
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {preOrderProducts.map((product, index) => (
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
                <DiscoveryProductCard product={product} index={index} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer CTA */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
            Soyol Video Shop
          </h3>
          <p className="text-slate-600 leading-relaxed mb-8">
            Чанартай бүтээгдэхүүн, найдвартай хүргэлт, мэргэжлийн үйлчилгээ
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <Link href="/about" className="hover:text-[#FF8C00] transition-colors">
              Бидний тухай
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <Link href="/track" className="hover:text-[#FF8C00] transition-colors">
              Захиалга хянах
            </Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <a href="tel:77181818" className="hover:text-[#FF8C00] transition-colors">
              77181818
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
