'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Zap, Package, Filter, CheckCircle, Truck } from 'lucide-react';
import { formatPrice } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

const categories = [
  { id: 'all', name: 'Бүгд', icon: '🎯' },
  { id: 'tech', name: 'Технологи', icon: '📱' },
  { id: 'fashion', name: 'Хувцас', icon: '👔' },
  { id: 'home', name: 'Гэр ахуй', icon: '🏠' },
  { id: 'beauty', name: 'Гоо сайхан', icon: '💄' },
];

export default function ReadyToShipPage() {
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
        
        // Filter only in-stock products
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
    toast.success(`${product.name} сагсанд нэмэгдлээ!`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '12px',
      },
      icon: '✅',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-bold">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-28 pb-20">
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-2xl"
          >
            <Package className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Бэлэн бараа
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Шууд хүргэлттэй бүтээгдэхүүнүүд - 24 цагийн дотор таны гарт
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg border border-green-200"
            >
              <Truck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-gray-900">24 цагт хүргэнэ</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg border border-green-200"
            >
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-gray-900">{filteredProducts.length} бараа</span>
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
            <Filter className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-bold text-gray-900">Ангилал</h2>
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
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300'
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
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Image */}
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      
                      {/* In Stock Badge */}
                      <div className="absolute top-3 right-3 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Бэлэн
                      </div>

                      {/* Fast Delivery Icon */}
                      <div className="absolute bottom-3 left-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                        <Zap className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-5">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-3">
                      <p className="text-2xl font-black text-green-600">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-center gap-2 mb-4 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-xl">
                      <Truck className="w-4 h-4" />
                      <span className="font-bold">24 цагт хүргэнэ</span>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      onClick={() => handleAddToCart(product)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Сагслах
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
              <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Бараа олдсонгүй
              </h3>
              <p className="text-gray-600">
                Энэ ангилалд бэлэн бараа байхгүй байна
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
