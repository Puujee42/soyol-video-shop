'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@lib/utils';
import type { Product } from '@models/Product';

export default function SearchDropdown() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products?limit=50');
        const data = await res.json();
        
        // API now returns { products, nextCursor, hasMore }
        const productsList = data.products || [];
        setAllProducts(productsList);
        setResults(productsList.slice(0, 5));
      } catch (error) {
        // Silently handle error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setResults(allProducts.slice(0, 5));
      setIsOpen(false);
    }
  }, [searchTerm, allProducts]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Бараа хайх..."
          className="w-full px-6 py-3 pr-12 rounded-full bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-soyol transition"
        />
        {searchTerm ? (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        ) : (
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {results.map((product) => (
              <motion.a
                key={product.id}
                href={`/product/${product.id}`}
                whileHover={{ backgroundColor: '#FFF9F5' }}
                className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0 cursor-pointer"
              >
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-lg font-bold text-soyol">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </motion.a>
            ))}
            {searchTerm && results.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                Үр дүн олдсонгүй
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
