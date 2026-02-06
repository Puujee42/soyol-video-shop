'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DiscoveryProductCard from './DiscoveryProductCard';
import { Loader2 } from 'lucide-react';
import type { Product, StockStatus } from '@models/Product';

interface InfiniteProductGridProps {
  initialProducts: Product[];
  stockFilter?: 'all' | 'in-stock' | 'pre-order';
}

export default function InfiniteProductGrid({ initialProducts, stockFilter = 'all' }: InfiniteProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Filter products based on stock status
  const filteredProducts = useMemo(() => {
    if (stockFilter === 'all') {
      return products;
    }
    return products.filter(p => p.stockStatus === stockFilter);
  }, [products, stockFilter]);

  const loadMore = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In production, fetch from API:
      // const response = await fetch(`/api/products?page=${page + 1}&limit=16`);
      // const newProducts = await response.json();
      
      // For demo, cycle through existing products
      const newProducts = initialProducts.map((p, idx) => ({
        ...p,
        id: `${p.id}-${page}-${idx}`,
      }));
      
      setProducts([...products, ...newProducts]);
      setPage(page + 1);
      
      // Stop after 3 loads for demo
      if (page >= 3) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Grid - 4 columns desktop, 2 columns mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                  layout: { type: 'spring', stiffness: 300, damping: 30 }
                }}
              >
                <DiscoveryProductCard
                  product={product}
                  index={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-gray-50 rounded-2xl">
              <div className="text-6xl">📦</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Бараа олдсонгүй
                </h3>
                <p className="text-sm text-gray-600">
                  Энэ шүүлтэд таарах бараа одоогоор байхгүй байна
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <motion.button
              onClick={loadMore}
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.05, y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.95 }}
              className={`inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-soyol to-soyol-dark text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Ачааллаж байна...
                </>
              ) : (
                <>
                  Цааш үзэх
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </>
              )}
            </motion.button>

            {/* Progress Indicator */}
            <p className="mt-4 text-sm text-gray-500 font-medium">
              {filteredProducts.length} бүтээгдэхүүн харуулж байна
            </p>
          </motion.div>
        )}

        {/* End Message */}
        {!hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-full">
              <span className="text-soyol">✓</span>
              Бүх бүтээгдэхүүн харуулсан
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
