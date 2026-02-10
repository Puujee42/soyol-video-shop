'use client';

import Link from 'next/link';
import { Sparkles, Package, Clock, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';
import FeatureSection from '@/components/FeatureSection';
import PremiumProductGrid from '@/components/PremiumProductGrid';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useProducts, type ApiProduct } from '@/lib/hooks/useProducts';

type Product = ApiProduct;

type FilterType = 'all' | 'ready' | 'preorder';
type SortType = 'newest' | 'price-low' | 'price-high' | 'name-az';

export default function HomePage() {
  const { currency, convertPrice } = useLanguage();
  const { t } = useTranslation();
  const { products: allProducts, isLoading: loading, isError: productsError, connectionError } = useProducts();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('name-az');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  // Separate by stock status: "in-stock" = READY (Бэлэн), "pre-order" = Захиалгаар
  const readyProducts = allProducts.filter((p: Product) => (p.stockStatus || 'in-stock') === 'in-stock');
  const preOrderProducts = allProducts.filter((p: Product) => (p.stockStatus || '') === 'pre-order');

  // Apply active tab filter (Бүгд = all, Бэлэн = ready, Захиалгаар = pre-order)
  let filteredProducts = activeFilter === 'all'
    ? [...allProducts]
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

  // Sort by selected option (newest, price, name). Same list for all/ready/preorder tabs.
  let sortedProducts: Product[];
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
        return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
    }
  };

  if (activeFilter === 'all') {
    sortedProducts = [...filteredProducts].sort(sortFunction);
  } else {
    sortedProducts = [...filteredProducts].sort(sortFunction);
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

            <div className="flex items-center gap-3">
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
          {productsError || connectionError ? (
            <div className="text-center py-20 px-4">
              <div className="max-w-md mx-auto rounded-2xl bg-amber-50 border border-amber-200 p-8">
                <p className="text-amber-800 font-semibold mb-2">
                  {connectionError ? 'Database connection unavailable' : 'Failed to load products'}
                </p>
                <p className="text-gray-600 text-sm mb-6">
                  {connectionError
                    ? 'Check that your Supabase project is active and your internet connection is stable. You can verify the connection at /api/health/db'
                    : 'Something went wrong while loading products. Please try again.'}
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Loading products...</p>
              <p className="text-gray-400 text-sm mt-1">Please wait</p>
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
        </div>
      </motion.section>

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
    </div>
  );
}
