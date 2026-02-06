'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, Crown, Calendar, Shield, Sparkles } from 'lucide-react';
import { formatPrice } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

const categories = [
  { id: 'all', name: 'All Exclusives' },
  { id: 'tech', name: 'Technology' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Living' },
  { id: 'beauty', name: 'Beauty' },
];

const preOrderProcess = [
  { step: '1', title: 'Reserve', desc: 'Secure your item with a pre-order' },
  { step: '2', title: 'Import', desc: 'We source from trusted global suppliers' },
  { step: '3', title: 'Quality Check', desc: 'Rigorous inspection before dispatch' },
  { step: '4', title: 'Delivery', desc: 'White-glove delivery to your door' },
];

export default function PreOrderPage() {
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
    toast.success(`${product.name} reserved successfully`, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
        color: '#D4AF37',
        fontWeight: '500',
        borderRadius: '4px',
        border: '1px solid #D4AF37',
      },
      icon: '👑',
    });
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-2 border-[#D4AF37] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative pt-40 pb-32 overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            {/* VIP Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-3 px-8 py-3 mb-10 bg-gradient-to-r from-[#D4AF37]/10 to-transparent backdrop-blur-xl border border-[#D4AF37]/20 rounded-none"
            >
              <Crown className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm font-light tracking-[0.3em] text-[#D4AF37] uppercase">Exclusive Collection</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-white mb-8 leading-tight" style={{ fontFamily: 'Didot, Georgia, serif' }}>
              PRE-ORDER
              <br />
              <span className="text-[#D4AF37]">COLLECTION</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl font-light text-white/60 max-w-3xl mx-auto tracking-wide leading-relaxed"
            >
              Secure the latest arrivals. Exclusivity worth the wait.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex items-center justify-center gap-12 text-sm text-white/40"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                <span className="tracking-wide">Authenticated</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span className="tracking-wide">2-3 Weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span className="tracking-wide">VIP Service</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Pre-order Process */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-light tracking-[0.3em] text-[#D4AF37] uppercase text-center mb-16">The Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {preOrderProcess.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#D4AF37]/10 transition-colors">
                  <span className="text-[#D4AF37] font-light">{item.step}</span>
                </div>
                <h3 className="text-white font-light text-lg mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-light tracking-[0.3em] text-white/50 uppercase">Collections</h2>
            <p className="text-sm text-white/40">{filteredProducts.length} exclusive items</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-8 py-3 text-sm font-light tracking-widest transition-all duration-500 ${
                  selectedCategory === category.id
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                } rounded-none`}
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
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-slate-800/30 to-gray-900/30 backdrop-blur-sm rounded-none overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-700 hover:shadow-2xl hover:shadow-[#D4AF37]/5">
                    {/* Image */}
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-[4/5] bg-black/20 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className={`object-cover transition-all duration-1000 ${
                            hoveredId === product.id ? 'scale-105 brightness-110' : 'scale-100 brightness-90'
                          }`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        
                        {/* Gold Ribbon */}
                        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                          <div className="absolute top-4 right-[-30px] w-32 bg-gradient-to-r from-[#D4AF37] to-[#F0E68C] text-black text-[10px] font-medium tracking-wider text-center py-1 transform rotate-45 shadow-lg">
                            EXCLUSIVE
                          </div>
                        </div>

                        {/* Premium Badge */}
                        <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 rounded-none">
                          <span className="text-[10px] font-light text-[#D4AF37] tracking-[0.2em] uppercase">Pre-order</span>
                        </div>

                        {/* Hover Glow Effect */}
                        {hoveredId === product.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/20 to-transparent"
                          />
                        )}

                        {/* Quick View */}
                        <AnimatePresence>
                          {hoveredId === product.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-x-6 bottom-6"
                            >
                              <Link href={`/product/${product.id}`}>
                                <button className="w-full py-3 bg-white/95 text-black text-xs font-medium tracking-[0.2em] hover:bg-white transition-colors flex items-center justify-center gap-2 rounded-none backdrop-blur-sm">
                                  <Eye className="w-4 h-4" />
                                  VIEW DETAILS
                                </button>
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-8 space-y-5">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-light text-lg text-white hover:text-[#D4AF37] transition-colors line-clamp-2 min-h-[3.5rem] tracking-wide">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price & Arrival */}
                      <div className="space-y-3">
                        <p className="text-3xl font-light text-[#D4AF37] tracking-tight">
                          {formatPrice(product.price)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/40 font-light">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="tracking-wide">Expected: {getEstimatedArrival()}</span>
                        </div>
                      </div>

                      {/* Reserve Button */}
                      <motion.button
                        onClick={() => handlePreOrder(product)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] text-xs font-light tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 flex items-center justify-center gap-3 rounded-none group/btn"
                      >
                        <Crown className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                        RESERVE NOW
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
              <Crown className="w-20 h-20 text-[#D4AF37]/30 mx-auto mb-6" />
              <h3 className="text-3xl font-light text-white mb-3" style={{ fontFamily: 'Didot, Georgia, serif' }}>
                No exclusives available
              </h3>
              <p className="text-white/40 font-light tracking-wide">
                Please check back soon for new arrivals
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* VIP Benefits Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-32 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-light tracking-[0.3em] text-[#D4AF37] uppercase text-center mb-20">Why Pre-order</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Crown className="w-10 h-10 text-[#D4AF37] mx-auto mb-6" />
              <h3 className="text-xl font-light text-white mb-3">Exclusive Access</h3>
              <p className="text-sm text-white/40 font-light leading-relaxed">Be the first to own the latest collections before general release</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <Shield className="w-10 h-10 text-[#D4AF37] mx-auto mb-6" />
              <h3 className="text-xl font-light text-white mb-3">Guaranteed Authenticity</h3>
              <p className="text-sm text-white/40 font-light leading-relaxed">Every item verified and inspected by our experts before delivery</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto mb-6" />
              <h3 className="text-xl font-light text-white mb-3">White-Glove Service</h3>
              <p className="text-sm text-white/40 font-light leading-relaxed">Dedicated concierge support throughout your pre-order journey</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
