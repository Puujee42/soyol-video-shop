'use client';

<<<<<<< HEAD
import Link from 'next/link';
import { Sparkles, Package, Clock, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';
import FeatureSection from '@/components/FeatureSection';
import PremiumProductGrid from '@/components/PremiumProductGrid';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  stockStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

type FilterType = 'all' | 'ready' | 'preorder';
type SortType = 'newest' | 'price-low' | 'price-high' | 'name-az';

export default function HomePage() {
  const { currency, convertPrice } = useLanguage();
  const { t } = useTranslation();
=======
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
>>>>>>> 724af3226febe215cd51dc5b8721cf47145076eb
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('name-az');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showPriceFilter, setShowPriceFilter] = useState(false);

<<<<<<< HEAD
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setAllProducts(data.products || []);
      } catch (error) {
        // Error handling - could log to error tracking service in production
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Separate products by stock status
  const readyProducts = allProducts.filter(p => p.stockStatus === 'in-stock');
  const preOrderProducts = allProducts.filter(p => p.stockStatus === 'pre-order');

  // Filter products based on active filter
  // For "all", show ready products first, then pre-order
  let filteredProducts = activeFilter === 'all' 
    ? [...readyProducts, ...preOrderProducts]
    : activeFilter === 'ready'
    ? readyProducts
    : preOrderProducts;

  // Apply price filter
  const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
  const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
  
  if (minPrice || maxPrice) {
    filteredProducts = filteredProducts.filter(p => 
      p.price >= minPriceNum && p.price <= maxPriceNum
    );
  }

  // Sort products while maintaining ready items first for "all" tab
  let sortedProducts: Product[];
  
  if (activeFilter === 'all') {
    // For "all" tab: sort ready and preorder separately, then combine
    const sortFunction = (a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    };
    
    const sortedReady = filteredProducts
      .filter(p => p.stockStatus === 'in-stock')
      .sort(sortFunction);
    
    const sortedPreOrder = filteredProducts
      .filter(p => p.stockStatus === 'pre-order')
      .sort(sortFunction);
    
    sortedProducts = [...sortedReady, ...sortedPreOrder];
  } else {
    // For specific tabs: normal sorting
    sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }

  // Get min and max prices for the current filter (converted to current currency)
  const prices = filteredProducts.map(p => convertPrice(p.price));
  const suggestedMin = prices.length > 0 ? Math.floor(Math.min(...prices) / (currency === 'USD' ? 10 : 1000)) * (currency === 'USD' ? 10 : 1000) : 0;
  const suggestedMax = prices.length > 0 ? Math.ceil(Math.max(...prices) / (currency === 'USD' ? 10 : 1000)) * (currency === 'USD' ? 10 : 1000) : (currency === 'USD' ? 1000 : 1000000);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Filter Tabs */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="pt-8 pb-6 sm:pt-12 sm:pb-8"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Filter & Sort Bar */}
          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            {/* Filter Tabs - Left */}
            <div className="flex items-center gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter('all')}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  activeFilter === 'all'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('filters', 'all')}</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter('ready')}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  activeFilter === 'ready'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" />
                  <span>{t('filters', 'ready')}</span>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter('preorder')}
                className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                  activeFilter === 'preorder'
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md shadow-gray-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{t('filters', 'preorder')}</span>
                </div>
              </motion.button>

              {/* Delivery Note for Pre-order */}
              {activeFilter === 'preorder' && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs text-orange-600 font-medium px-3 py-1 bg-orange-50 rounded-full"
                >
                  {t('filters', 'deliveryTime')}
                </motion.span>
              )}
            </div>

            {/* Sort & Price Filter - Right */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all duration-300 cursor-pointer"
                >
                  <option value="name-az">{t('filters', 'nameAZ')}</option>
                  <option value="price-low">{t('filters', 'priceLowHigh')}</option>
                  <option value="price-high">{t('filters', 'priceHighLow')}</option>
                </select>
              </div>

              {/* Price Filter Button */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPriceFilter(!showPriceFilter)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                    showPriceFilter || minPrice || maxPrice
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
                  <span>{t('filters', 'price')}</span>
                  {(minPrice || maxPrice) && (
                    <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">1</span>
                  )}
                </motion.button>

                {/* Price Filter Dropdown */}
                <AnimatePresence>
                  {showPriceFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl shadow-orange-100/20 border border-orange-100/50 p-5 z-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-orange-500" strokeWidth={1.5} />
                          {t('filters', 'priceFilter')}
                        </h3>
                        <button
                          onClick={() => setShowPriceFilter(false)}
                          className="p-1 hover:bg-gray-100 rounded-full transition"
                        >
                          <X className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="space-y-5">
                        {/* Luxury Dual-Thumb Range Display */}
                        <div className="flex items-center justify-between px-1">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{t('filters', 'minPrice')}</span>
                            <span className="text-lg font-bold text-gray-900">
                              {currency === 'USD' ? '$' : ''}{minPrice || suggestedMin.toLocaleString()}{currency === 'MNT' ? '₮' : ''}
                            </span>
                          </div>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 mx-2" />
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{t('filters', 'maxPrice')}</span>
                            <span className="text-lg font-bold text-gray-900">
                              {currency === 'USD' ? '$' : ''}{maxPrice || suggestedMax.toLocaleString()}{currency === 'MNT' ? '₮' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Price Input Fields with Gradient Border */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">{t('filters', 'minPrice')}</label>
                            <div className="relative group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur transition duration-300" />
                              <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder={suggestedMin.toLocaleString()}
                                className="relative w-full px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition bg-white"
                              />
                            </div>
                          </div>
                          <div className="relative">
                            <label className="block text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">{t('filters', 'maxPrice')}</label>
                            <div className="relative group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur transition duration-300" />
                              <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder={suggestedMax.toLocaleString()}
                                className="relative w-full px-4 py-2.5 text-sm font-semibold border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Quick Price Ranges */}
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-2">{t('filters', 'quickSelect')}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {(currency === 'USD' 
                              ? [
                                  { label: '< $30', min: '', max: '100000' },
                                  { label: '$30 - $145', min: '100000', max: '500000' },
                                  { label: '$145 - $290', min: '500000', max: '1000000' },
                                  { label: '> $290', min: '1000000', max: '' },
                                ]
                              : [
                                  { label: '< 100,000₮', min: '', max: '100000' },
                                  { label: '100k - 500k₮', min: '100000', max: '500000' },
                                  { label: '500k - 1M₮', min: '500000', max: '1000000' },
                                  { label: '> 1,000,000₮', min: '1000000', max: '' },
                                ]
                            ).map((range) => (
                              <button
                                key={range.label}
                                onClick={() => {
                                  setMinPrice(range.min);
                                  setMaxPrice(range.max);
                                }}
                                className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-300"
                              >
                                {range.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setMinPrice('');
                              setMaxPrice('');
                            }}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                          >
                            {t('filters', 'clear')}
                          </button>
                          <button
                            onClick={() => setShowPriceFilter(false)}
                            className="flex-1 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/40 rounded-lg transition-all duration-300"
                          >
                            {t('filters', 'apply')}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">{t('product', 'loading')}</p>
              </div>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                {activeFilter === 'ready' ? (
                  <Package className="w-20 h-20 mx-auto mb-6 text-orange-200" strokeWidth={1.5} />
                ) : activeFilter === 'preorder' ? (
                  <Clock className="w-20 h-20 mx-auto mb-6 text-orange-200" strokeWidth={1.5} />
                ) : (
                  <Sparkles className="w-20 h-20 mx-auto mb-6 text-orange-200" strokeWidth={1.5} />
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('product', 'noProducts')}</h3>
                <p className="text-gray-600 mb-8">
                  {activeFilter === 'ready' 
                    ? t('product', 'noProductsReady')
                    : activeFilter === 'preorder'
                    ? t('product', 'noProductsPreorder')
                    : t('product', 'noProductsAll')}
                </p>
                <Link
                  href="/"
                  onClick={() => setActiveFilter('all')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('product', 'backToShop')}</span>
                </Link>
              </div>
            </div>
          ) : (
            <motion.div
              key={`${activeFilter}-${sortBy}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PremiumProductGrid products={sortedProducts} />
            </motion.div>
          )}
=======
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
>>>>>>> 724af3226febe215cd51dc5b8721cf47145076eb
        </div>
      </motion.section>

<<<<<<< HEAD
      {/* FEATURES SECTION */}
      <FeatureSection />

      {/* Footer CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="py-10 sm:py-12 bg-gray-50 border-t border-gray-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {t('footer', 'title')}
          </h3>
          <p className="text-sm text-gray-600 mb-5 sm:mb-6">
            {t('footer', 'description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm text-gray-600">
            <Link href="/about" className="hover:text-orange-600 transition-colors">
              {t('footer', 'about')}
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link href="/track" className="hover:text-orange-600 transition-colors">
              {t('footer', 'trackOrder')}
            </Link>
            <span className="hidden sm:inline">•</span>
            <a href="tel:77181818" className="hover:text-orange-600 transition-colors font-semibold">
              77181818
            </a>
          </div>
        </div>
      </motion.section>
=======
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
>>>>>>> 724af3226febe215cd51dc5b8721cf47145076eb
    </div>
  );
}
