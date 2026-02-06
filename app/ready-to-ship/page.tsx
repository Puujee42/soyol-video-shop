'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { formatPrice } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

const categories = [
  { id: 'all', name: 'All Collections' },
  { id: 'tech', name: 'Technology' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Living' },
  { id: 'beauty', name: 'Beauty' },
];

export default function ReadyToShipPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=100');
        const data = await res.json();
        const allProducts = data.products || [];
        
        const inStockProducts = allProducts.filter(
          (p: Product) => p.stockStatus === 'in-stock'
        );
        setProducts(inStockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#1F2937',
        color: 'white',
        fontWeight: '500',
        borderRadius: '8px',
        border: '1px solid #10B981',
      },
      icon: '✓',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-2 border-slate-900 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative pt-40 pb-24 overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-black"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Premium Delivery Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="inline-flex items-center gap-3 px-6 py-3 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full"
            >
              <Award className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-light tracking-wider text-white/90 uppercase">Premium Delivery Service</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-light tracking-tight text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              READY TO SHIP
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/70 max-w-2xl mx-auto tracking-wide">
              Curated collection. Immediate availability. Delivered within 24 hours.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-8 text-sm text-white/60"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Authenticated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>24h Delivery</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-light tracking-widest text-gray-500 uppercase">Filter by Collection</h2>
            <p className="text-sm text-gray-500">{filteredProducts.length} items available</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 text-sm font-light tracking-wide transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                } rounded-sm`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group"
                >
                  <div className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                    {/* Image */}
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className={`object-cover transition-transform duration-700 ${
                            hoveredId === product.id ? 'scale-110' : 'scale-100'
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        
                        {/* In Stock Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-50 backdrop-blur-sm border border-emerald-200 rounded-sm">
                          <span className="text-xs font-medium text-emerald-700 tracking-wide">IN STOCK</span>
                        </div>

                        {/* Quick View Button */}
                        <AnimatePresence>
                          {hoveredId === product.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              className="absolute inset-x-4 bottom-4"
                            >
                              <Link href={`/product/${product.id}`}>
                                <button className="w-full py-3 bg-white text-slate-900 text-sm font-medium tracking-wide hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 rounded-sm">
                                  <Eye className="w-4 h-4" />
                                  Quick View
                                </button>
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-light text-lg text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-light text-slate-900 tracking-tight">
                          {formatPrice(product.price)}
                        </p>
                        <span className="text-xs text-emerald-600 font-medium tracking-wide">24h DELIVERY</span>
                      </div>

                      {/* Add to Cart Button */}
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-3.5 bg-slate-900 text-white text-sm font-medium tracking-wider hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 rounded-sm group"
                      >
                        <ShoppingCart className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        ADD TO CART
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-32"
            >
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-light text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                No items found
              </h3>
              <p className="text-gray-500 font-light">
                Please try a different category
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-24 bg-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-light text-white mb-2">Quality Assured</h3>
              <p className="text-sm text-white/60 font-light">Every product authenticated</p>
            </div>
            <div>
              <Award className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-light text-white mb-2">Premium Service</h3>
              <p className="text-sm text-white/60 font-light">White-glove delivery experience</p>
            </div>
            <div>
              <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-light text-white mb-2">Exclusive Access</h3>
              <p className="text-sm text-white/60 font-light">Priority customer support</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
