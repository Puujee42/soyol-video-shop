'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ChevronUp, Package, Star, TrendingUp, Truck, Shield, Clock } from 'lucide-react';
import { formatPrice } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

const categories = [
  { id: 'all', name: 'Бүгд', icon: '🎯' },
  { id: 'tech', name: 'Электрон бараа', icon: '📱' },
  { id: 'fashion', name: 'Хувцас', icon: '👔' },
  { id: 'home', name: 'Гэр ахуй', icon: '🏠' },
  { id: 'beauty', name: 'Гоо сайхан', icon: '💄' },
];

const trustFeatures = [
  { icon: Truck, text: 'Шууд хүргэлт', subtext: '24 цагт' },
  { icon: Shield, text: 'Баталгаатай', subtext: '100% жинхэнэ' },
  { icon: Clock, text: 'Хурдан', subtext: 'Хэзээ ч' },
  { icon: Package, text: 'Найдвартай', subtext: 'Аюулгүй' },
];

export default function ReadyToShipPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const [isCategorySticky, setIsCategorySticky] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=100');
        const data = await res.json();
        const allProducts = data.products || [];
        const inStockProducts = allProducts.filter((p: Product) => p.stockStatus === 'in-stock');
        setProducts(inStockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
      if (categoryRef.current) {
        const rect = categoryRef.current.getBoundingClientRect();
        setIsCategorySticky(rect.top <= 80);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} сагсанд нэмэгдлээ!`, {
      duration: 2000,
      position: 'top-right',
      icon: '✓',
      style: { background: '#FF8C00', color: 'white', fontWeight: 'bold', borderRadius: '12px' },
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-4 border-[#FF8C00] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative pt-32 pb-16 bg-gradient-to-br from-gray-50 to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg mb-6 border border-orange-200"
          >
            <Package className="w-5 h-5 text-[#FF8C00]" />
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Шууд хүргэлт</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-black text-gray-900 mb-4"
          >
            Бэлэн байгаа бараа
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Шууд худалдан авч, 24 цагийн дотор хүлээн авна
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#FF8C00]" />
              <span className="font-medium">24 цагт хүргэнэ</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF8C00]" />
              <span className="font-medium">100% жинхэнэ</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#FF8C00]" />
              <span className="font-medium">{products.length} бараа бэлэн</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Navigation */}
      <div
        ref={categoryRef}
        className={`${
          isCategorySticky ? 'fixed top-20 left-0 right-0 z-30 backdrop-blur-xl bg-white/95 shadow-lg' : 'relative bg-white'
        } transition-all duration-300 border-b border-gray-200`}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 min-w-[90px]"
              >
                <div
                  className={`w-16 h-16 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-[#FF8C00] ring-4 ring-orange-200'
                      : 'bg-gray-100 hover:bg-orange-50'
                  } flex items-center justify-center text-2xl shadow-md transition-all`}
                >
                  {category.icon}
                </div>
                <span className={`text-xs font-bold ${selectedCategory === category.id ? 'text-[#FF8C00]' : 'text-gray-600'}`}>
                  {category.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Features */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all"
            >
              <div className="p-2 bg-[#FF8C00] rounded-lg">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{feature.text}</p>
                <p className="text-xs text-gray-500">{feature.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">
            {selectedCategory === 'all' ? 'Бүх бараа' : categories.find((c) => c.id === selectedCategory)?.name}
            <span className="ml-2 text-[#FF8C00]">({filteredProducts.length})</span>
          </h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} onAddToCart={handleAddToCart} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32"
          >
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Бараа олдсонгүй</h3>
            <p className="text-gray-500">Энэ ангилалд бараа байхгүй байна</p>
          </motion.div>
        )}
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-[#FF8C00] text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductCard({ product, index, onAddToCart }: { product: Product; index: number; onAddToCart: (p: Product) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);
  const soldToday = Math.floor(Math.random() * 30) + 5;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 12) * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100">
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            
            {/* Hot Badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
              <TrendingUp className="w-3 h-3" />
              {soldToday} зарагдсан
            </div>

            {/* In Stock Badge */}
            <div className="absolute top-3 right-3 px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              ✓ Бэлэн
            </div>

            {/* Quick Delivery Icon */}
            <div className="absolute bottom-3 left-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
              <Truck className="w-4 h-4 text-[#FF8C00]" />
            </div>
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 hover:text-[#FF8C00] transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-500 ml-1">(4.8)</span>
          </div>

          {/* Price */}
          <div className="mb-3">
            <p className="text-2xl font-black text-[#FF8C00]">{formatPrice(product.price)}</p>
            <p className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
              <Truck className="w-3 h-3" />
              24 цагт хүргэнэ
            </p>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={() => onAddToCart(product)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-[#FF8C00] text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Сагсанд хийх
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
