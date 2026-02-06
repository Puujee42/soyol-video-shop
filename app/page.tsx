'use client';

import { useMemo } from 'react';
import PromoGrid from '@/components/PromoGrid';
import QuickCategoryStrip from '@/components/QuickCategoryStrip';
import ProductSection from '@/components/ProductSection';
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
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    price: 449000,
    rating: 4.8,
    category: 'tech',
    stockStatus: 'in-stock',
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
  },
  {
    id: '4',
    name: 'Premium Leather Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
    price: 129000,
    rating: 4.6,
    category: 'fashion',
    stockStatus: 'in-stock',
  },
  {
    id: '5',
    name: 'Minimalist Office Desk Lamp',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop',
    price: 69000,
    rating: 4.5,
    category: 'home',
    stockStatus: 'in-stock',
  },
  {
    id: '6',
    name: 'Wireless Gaming Mouse - RGB',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop',
    price: 89000,
    rating: 4.7,
    category: 'gaming',
    stockStatus: 'in-stock',
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
  },
  {
    id: '8',
    name: 'Modern Wall Clock - Minimalist',
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&h=800&fit=crop',
    price: 39000,
    rating: 4.5,
    category: 'home',
    stockStatus: 'in-stock',
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
  // Separate products by stock status
  const inStockProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'in-stock'),
    []
  );
  
  const preOrderProducts = useMemo(
    () => mockProducts.filter(p => p.stockStatus === 'pre-order'),
    []
  );

  return (
    <div className="relative min-h-screen">
      {/* ============================================ */}
      {/* PRIMARY CONTENT: Direct Shopping Experience */}
      {/* ============================================ */}

      {/* 1. Top 3 Bento Grid Blocks (DO NOT CHANGE) */}
      <div className="relative z-10 bg-gray-50 pt-4">
        <PromoGrid />
      </div>

      {/* 2. Quick Category Filter Strip */}
      <QuickCategoryStrip />

      {/* ============================================ */}
      {/* PRODUCT SECTIONS: Two-Tier System */}
      {/* ============================================ */}

      {/* Section 1: Бэлэн бараа (Ready to Ship) */}
      <ProductSection
        id="ready-stock"
        title="Бэлэн бараа"
        subtitle="Шууд хүргэлттэй бүтээгдэхүүнүүд"
        icon="🏠"
        products={inStockProducts}
        viewAllLink="/categories?filter=in-stock"
      />

      {/* Divider */}
      <div className="relative z-10 bg-gradient-to-r from-transparent via-gray-200 to-transparent h-px" />

      {/* Section 2: Захиалгаар (International Pre-order) */}
      <ProductSection
        id="pre-order"
        title="Захиалгаар"
        subtitle="Олон улсын захиалгат бүтээгдэхүүн - 7-14 хоногт хүргэнэ"
        icon="✈️"
        products={preOrderProducts}
        viewAllLink="/categories?filter=pre-order"
      />

      {/* ============================================ */}
      {/* SECONDARY CONTENT: Brand & Newsletter */}
      {/* ============================================ */}

      {/* About Section (Minimalist) */}
      <section className="relative z-10 py-20 bg-gray-50">
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
