'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ChevronUp, Zap, Shield, Headphones, CreditCard, TrendingUp, Star } from 'lucide-react';
import { formatPrice } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

const flashSaleSlides = [
  { title: '⚡ FLASH SALE', subtitle: '24 hours only - Up to 50% OFF', gradient: 'from-orange-500 to-red-600' },
  { title: '🎁 FREE SHIPPING', subtitle: 'On all orders today - Limited time', gradient: 'from-blue-500 to-purple-600' },
  { title: '🔥 HOT DEALS', subtitle: 'Best sellers flying off shelves', gradient: 'from-pink-500 to-rose-600' },
];

const categories = [
  { id: 'all', name: 'All', icon: '🎯', color: 'from-blue-500 to-cyan-500' },
  { id: 'tech', name: 'Tech', icon: '📱', color: 'from-purple-500 to-pink-500' },
  { id: 'fashion', name: 'Fashion', icon: '👔', color: 'from-orange-500 to-red-500' },
  { id: 'home', name: 'Home', icon: '🏠', color: 'from-green-500 to-emerald-500' },
  { id: 'beauty', name: 'Beauty', icon: '💄', color: 'from-pink-500 to-rose-500' },
];

const trustFeatures = [
  { icon: Zap, text: 'Fast Delivery', subtext: '24h Express' },
  { icon: Shield, text: 'Authentic', subtext: '100% Genuine' },
  { icon: Headphones, text: '24/7 Support', subtext: 'Always Here' },
  { icon: CreditCard, text: 'Secure Payment', subtext: 'Protected' },
];

export default function ReadyToShipPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % flashSaleSlides.length);
    }, 4000);
    return () => clearInterval(slideTimer);
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
    toast.success(`${product.name} added!`, {
      duration: 2000,
      position: 'top-right',
      icon: '🛒',
      style: { background: '#10B981', color: 'white', fontWeight: 'bold' },
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-purple-50">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Flash Sale Banner */}
      <div className="fixed top-20 left-0 right-0 z-40 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-r ${flashSaleSlides[currentSlide].gradient} py-3`}
          >
            <div className="max-w-7xl mx-auto px-4 text-center">
              <motion.h2
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white font-black text-xl md:text-2xl drop-shadow-lg"
              >
                {flashSaleSlides[currentSlide].title}
              </motion.h2>
              <p className="text-white/90 text-sm md:text-base font-medium">
                {flashSaleSlides[currentSlide].subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="pt-40">
        {/* Circle Category Menu */}
        <div
          ref={categoryRef}
          className={`${
            isCategorySticky ? 'fixed top-32 left-0 right-0 z-30 backdrop-blur-xl bg-white/80 shadow-lg' : 'relative'
          } transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 min-w-[80px]"
                >
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${category.color} ${
                      selectedCategory === category.id ? 'ring-4 ring-offset-2 ring-purple-500' : ''
                    } flex items-center justify-center text-3xl shadow-lg transition-all`}
                  >
                    {category.icon}
                  </div>
                  <span className={`text-sm font-bold ${selectedCategory === category.id ? 'text-purple-600' : 'text-gray-600'}`}>
                    {category.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 py-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all"
              >
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{feature.text}</p>
                  <p className="text-xs text-gray-500">{feature.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900">
              {selectedCategory === 'all' ? 'All Products' : categories.find((c) => c.id === selectedCategory)?.name}
              <span className="ml-2 text-purple-600">({filteredProducts.length})</span>
            </h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onAddToCart={handleAddToCart} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
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
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);
  const soldToday = Math.floor(Math.random() * 50) + 10;
  const rating = (4 + Math.random()).toFixed(1);
  const reviews = Math.floor(Math.random() * 200) + 50;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: (index % 12) * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            
            {/* Social Proof Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {soldToday} sold today
            </div>

            {/* Stock Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
              ✓ In Stock
            </div>
          </div>
        </Link>

        <div className="p-3">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-purple-600 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-900">{rating}</span>
            <span className="text-xs text-gray-500">({reviews}+)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <p className="text-xl font-black text-purple-600">{formatPrice(product.price)}</p>
          </div>

          {/* Add to Cart Button with Shimmer */}
          <motion.button
            onClick={() => onAddToCart(product)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-xl overflow-hidden group"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
            <span className="relative flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
