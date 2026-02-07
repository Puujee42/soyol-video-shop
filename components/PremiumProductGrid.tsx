'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Sparkles, Zap, Heart, Clock } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import MagneticButton from './MagneticButton';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  stockStatus: string;
  createdAt: Date;
  updatedAt: Date;
  discount?: number; // Optional discount percentage (0-100)
}

interface PremiumProductGridProps {
  products: Product[];
}

const getStarRating = (rating: number = 4.5) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  
  for (let i = 0; i < 5; i++) {
    stars.push(i < fullStars);
  }
  return stars;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15,
      duration: 0.4
    } 
  },
};

export default function PremiumProductGrid({ products }: PremiumProductGridProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { formatPrice: formatPriceWithCurrency, currency } = useLanguage();
  const { t } = useTranslation();

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(t('product', 'addedToCart'), {
      duration: 2000,
      position: 'top-right',
      style: {
        background: '#FF7900',
        color: 'white',
        fontWeight: '600',
      },
    });
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product, index) => {
        const rating = 4.5;
        const isWishlisted = isInWishlist(product.id);
        
        return (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="group h-full"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link href={`/product/${product.id}`} className="block h-full">
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 shadow-lg group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] group-hover:border-orange-200 h-full flex flex-col">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {/* Wishlist Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (isWishlisted) {
                      removeFromWishlist(product.id);
                      toast.success(t('product', 'removedFromWishlist'), {
                        icon: '💔',
                        style: { borderRadius: '10px', background: '#333', color: '#fff' }
                      });
                    } else {
                      addToWishlist({ ...product, rating: 4.5, image: product.image || '' } as any);
                      toast.success(t('product', 'addedToWishlist'), {
                        icon: '❤️',
                        style: { borderRadius: '10px', background: '#333', color: '#fff' }
                      });
                    }
                  }}
                  className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all group/heart"
                >
                  <motion.div
                    animate={isWishlisted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/heart:text-slate-600'
                      }`}
                      strokeWidth={isWishlisted ? 0 : 1.5}
                    />
                  </motion.div>
                </motion.button>

                <Image
                  src={product.image || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              
              {/* Minimalist Status Badge with Glassmorphism */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {product.stockStatus === 'pre-order' && (
                  <motion.div
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="relative overflow-hidden px-3 py-1.5 bg-white/90 backdrop-blur-md border border-slate-300/50 rounded-full shadow-sm flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
                      <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                        ЗАХИАЛГААР
                      </span>
                      
                      {/* Shine Effect */}
                      <motion.div
                        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12"
                        initial={{ left: '-100%' }}
                        animate={{ left: '200%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </motion.div>
                )}
                
                {product.stockStatus === 'in-stock' && (
                  <motion.div
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="relative overflow-hidden px-3 py-1.5 bg-white/90 backdrop-blur-md border border-orange-500/30 rounded-full shadow-sm flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" strokeWidth={0} />
                      <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase">
                        БЭЛЭН
                      </span>
                      
                      {/* Shine Effect */}
                      <motion.div
                        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-12"
                        initial={{ left: '-100%' }}
                        animate={{ left: '200%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                      />
                    </motion.div>
                  </motion.div>
                )}

                  {/* Discount Badge */}
                  {product.discount && product.discount > 0 && (
                    <motion.div
                      initial={{ scale: 0, x: -20 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: 0.3, type: 'spring' }}
                      className="px-3 py-1.5 bg-red-600 rounded-full shadow-lg border border-white/20 self-start flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-white fill-current" />
                      <span className="text-xs font-bold text-white">-{product.discount}%</span>
                    </motion.div>
                  )}
                </div>
            </div>

              {/* Content */}
              <div className="p-5 space-y-4 flex flex-col flex-1">
                <div className="flex-1 space-y-2">
                  <div className="block group-hover:text-orange-600 transition-colors duration-300">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 tracking-tight leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {getStarRating(rating).map((filled, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          filled ? 'fill-current text-orange-500' : 'fill-current text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-400 font-medium ml-1">({rating})</span>
                  </div>

                  {/* Fast Delivery Info */}
                  {product.stockStatus === 'in-stock' && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <Zap className="w-3 h-3 text-orange-500 fill-current" />
                      <span className="text-[10px] font-medium text-orange-600">
                        {t('product', 'fastDelivery')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 pt-1">
                  {currency === 'USD' ? (
                    <>
                      <span className="text-xs font-bold text-orange-500">$</span>
                      <span className="text-xl font-bold text-gray-900 tracking-tight">
                        {formatPriceWithCurrency(product.price).replace('$', '')}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-gray-900 tracking-tight">
                        {Math.floor(product.price).toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-orange-500">₮</span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <MagneticButton className="flex-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="relative w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn overflow-hidden"
                    >
                      <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                      <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110 relative z-10" strokeWidth={1.2} />
                      <span className="text-xs uppercase tracking-wider relative z-10">{t('product', 'addToCart')}</span>
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
