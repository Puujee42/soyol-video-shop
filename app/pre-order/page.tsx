'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Plane, Sparkles, Filter, Calendar, Star } from 'lucide-react';
import { formatPrice } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

const categories = [
  { id: 'all', name: 'Бүгд', icon: '✨' },
  { id: 'tech', name: 'Технологи', icon: '📱' },
  { id: 'fashion', name: 'Хувцас', icon: '👔' },
  { id: 'home', name: 'Гэр ахуй', icon: '🏠' },
  { id: 'beauty', name: 'Гоо сайхан', icon: '💄' },
];

export default function PreOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=100');
        const data = await res.json();
        const allProducts = data.products || [];
        
        // Filter only pre-order products
        const preOrderProducts = allProducts.filter(
          (p: Product) => p.stockStatus === 'pre-order'
        );
        setProducts(preOrderProducts);
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

  const handlePreOrder = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} захиалга баталгаажлаа!`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '12px',
      },
      icon: '✈️',
    });
  };

  const getEstimatedArrival = () => {
    const today = new Date();
    const minDays = 7;
    const maxDays = 14;
    
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);
    
    return `${minDate.getMonth() + 1}/${minDate.getDate()} - ${maxDate.getMonth() + 1}/${maxDate.getDate()}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-bold">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-full mb-6 shadow-2xl"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
            Захиалгаар
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Онцгой, шинэ бүтээгдэхүүнүүд - Олон улсын захиалга
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-amber-500/30"
            >
              <Plane className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-white">7-14 хоногт</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-amber-500/30"
            >
              <Star className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-white">{filteredProducts.length} бараа</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Ангилал</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50'
                    : 'bg-white/10 backdrop-blur-sm text-gray-300 border-2 border-white/20 hover:border-amber-400/50'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300"
                >
                  {/* Image */}
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-square bg-gray-800 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      
                      {/* Pre-order Badge */}
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Захиалгаар
                      </div>

                      {/* Premium Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-amber-400 text-xs font-bold rounded-full border border-amber-500/50">
                        Premium
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <p className="text-2xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {/* Estimated Arrival */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-amber-400 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/30">
                      <Calendar className="w-4 h-4" />
                      <span className="font-bold">Ирэх огноо: {getEstimatedArrival()}</span>
                    </div>

                    {/* Pre-order Button */}
                    <motion.button
                      onClick={() => handlePreOrder(product)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold rounded-2xl hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/50 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Захиалах
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <Sparkles className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Бараа олдсонгүй
              </h3>
              <p className="text-gray-400">
                Энэ ангилалд захиалгат бараа байхгүй байна
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
