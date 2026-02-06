'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ChevronUp, Crown, Shield, Headphones, CreditCard, Calendar, Star, Sparkles } from 'lucide-react';
import { formatPrice } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

const exclusiveSlides = [
  { title: '👑 EXCLUSIVE DROPS', subtitle: 'Pre-order the latest collections', gradient: 'from-amber-500 to-orange-600' },
  { title: '✨ VIP ACCESS', subtitle: 'Be the first to own premium items', gradient: 'from-purple-500 to-pink-600' },
  { title: '🎁 SPECIAL PRICING', subtitle: 'Early bird discounts available', gradient: 'from-blue-500 to-cyan-600' },
];

const categories = [
  { id: 'all', name: 'All', icon: '✨', color: 'from-amber-500 to-orange-500' },
  { id: 'tech', name: 'Tech', icon: '📱', color: 'from-blue-500 to-purple-500' },
  { id: 'fashion', name: 'Fashion', icon: '👔', color: 'from-pink-500 to-rose-500' },
  { id: 'home', name: 'Home', icon: '🏠', color: 'from-green-500 to-emerald-500' },
  { id: 'beauty', name: 'Beauty', icon: '💄', color: 'from-purple-500 to-pink-500' },
];

const vipFeatures = [
  { icon: Crown, text: 'Exclusive', subtext: 'VIP Access' },
  { icon: Shield, text: 'Authentic', subtext: 'Verified' },
  { icon: Headphones, text: 'Concierge', subtext: 'Dedicated' },
  { icon: CreditCard, text: 'Secure', subtext: 'Protected' },
];

export default function PreOrderPage() {
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
        const preOrderProducts = allProducts.filter((p: Product) => p.stockStatus === 'pre-order');
        setProducts(preOrderProducts);
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
      setCurrentSlide((prev) => (prev + 1) % exclusiveSlides.length);
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

  const handlePreOrder = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} reserved!`, {
      duration: 2000,
      position: 'top-right',
      icon: '👑',
      style: { background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: 'white', fontWeight: 'bold' },
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getEstimatedArrival = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 14);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 21);
    return `${minDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${maxDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Exclusive Banner */}
      <div className="fixed top-20 left-0 right-0 z-40 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-r ${exclusiveSlides[currentSlide].gradient} py-3`}
          >
            <div className="max-w-7xl mx-auto px-4 text-center">
              <motion.h2
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white font-black text-xl md:text-2xl drop-shadow-lg"
              >
                {exclusiveSlides[currentSlide].title}
              </motion.h2>
              <p className="text-white/90 text-sm md:text-base font-medium">
                {exclusiveSlides[currentSlide].subtitle}
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
            isCategorySticky ? 'fixed top-32 left-0 right-0 z-30 backdrop-blur-xl bg-slate-900/80 shadow-lg' : 'relative'
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
                      selectedCategory === category.id ? 'ring-4 ring-offset-2 ring-amber-500' : ''
                    } flex items-center justify-center text-3xl shadow-lg transition-all`}
                  >
                    {category.icon}
                  </div>
                  <span className={`text-sm font-bold ${selectedCategory === category.id ? 'text-amber-400' : 'text-gray-400'}`}>
                    {category.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* VIP Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4 py-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vipFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all"
              >
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{feature.text}</p>
                  <p className="text-xs text-gray-400">{feature.subtext}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">
              {selectedCategory === 'all' ? 'All Exclusives' : categories.find((c) => c.id === selectedCategory)?.name}
              <span className="ml-2 text-amber-400">({filteredProducts.length})</span>
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
                <PreOrderCard key={product.id} product={product} index={index} onPreOrder={handlePreOrder} estimatedArrival={getEstimatedArrival()} />
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
            className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform"
          >
            <ChevronUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function PreOrderCard({ product, index, onPreOrder, estimatedArrival }: { product: Product; index: number; onPreOrder: (p: Product) => void; estimatedArrival: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);
  const preOrders = Math.floor(Math.random() * 30) + 5;
  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  const reviews = Math.floor(Math.random() * 100) + 20;

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
      <div className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 shadow-md hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300">
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-square overflow-hidden bg-black/20">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110 brightness-110' : 'scale-100 brightness-90'}`}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            
            {/* Exclusive Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              {preOrders} reserved
            </div>

            {/* Pre-order Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
              ✨ Pre-order
            </div>

            {/* Glow Effect */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent"
              />
            )}
          </div>
        </Link>

        <div className="p-3">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 hover:text-amber-400 transition-colors min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-white">{rating}</span>
            <span className="text-xs text-gray-400">({reviews}+)</span>
          </div>

          {/* Price & Arrival */}
          <div className="mb-2">
            <p className="text-xl font-black text-amber-400">{formatPrice(product.price)}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
              <Calendar className="w-3 h-3" />
              <span>{estimatedArrival}</span>
            </div>
          </div>

          {/* Reserve Button with Shimmer */}
          <motion.button
            onClick={() => onPreOrder(product)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-bold rounded-xl overflow-hidden group"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
            <span className="relative flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Reserve Now
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
