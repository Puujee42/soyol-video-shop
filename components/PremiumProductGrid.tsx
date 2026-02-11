'use client';

import { memo } from 'react';
import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Clock, Zap, ArrowRight, Eye } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  category: string;
  stockStatus?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  discount?: number;
  inventory?: number;
  rating?: number;
}

interface PremiumProductGridProps {
  products: Product[];
}



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

function PremiumProductGrid({ products }: PremiumProductGridProps) {
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { formatPrice: formatPriceWithCurrency, currency } = useLanguage();
  const { t } = useTranslation();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {products.map((product, index) => {
        const rating = product.rating || 4.5;
        const isWishlisted = isInWishlist(product.id);

        return (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="group h-full"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {product.id ? (
              <Link href={`/product/${product.id}`} className="block h-full">
                <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 group-hover:border-orange-100 h-full flex flex-col relative">

                  {/* Image Section */}
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
                          addToWishlist({ ...product, rating: product.rating || 4.5, image: product.image || '' } as any);
                          toast.success(t('product', 'addedToWishlist'), {
                            icon: '❤️',
                            style: { borderRadius: '10px', background: '#333', color: '#fff' }
                          });
                        }
                      }}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-2 sm:p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all group/heart"
                    >
                      <motion.div
                        animate={isWishlisted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/heart:text-slate-600'
                            }`}
                          strokeWidth={isWishlisted ? 0 : 1.5}
                        />
                      </motion.div>
                    </motion.button>

                    <Image
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                      priority={index < 6}
                    />

                    {/* Minimalist Status Badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-2">
                      {product.stockStatus === 'pre-order' && (
                        <div className="px-2 py-1 bg-white/90 backdrop-blur-md border border-slate-300/50 rounded-md shadow-sm flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">Захиалгаар</span>
                        </div>
                      )}
                      {product.stockStatus === 'in-stock' && (
                        <div className="px-2 py-1 bg-white/90 backdrop-blur-md border border-orange-500/30 rounded-md shadow-sm flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
                          <span className="text-[10px] font-bold tracking-wider text-orange-600 uppercase">Бэлэн</span>
                        </div>
                      )}
                      {product.discount && product.discount > 0 && (
                        <div className="px-2 py-1 bg-red-600 rounded-md shadow-lg text-white flex items-center gap-1 self-start">
                          <span className="text-[10px] font-bold">-{product.discount}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-3 sm:p-5 flex flex-col flex-1 gap-2">
                    {/* Category & Rating */}
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">{product.category}</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-orange-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                        <span className="text-xs font-bold text-gray-600">{rating}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors min-h-[2.5em]">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="mt-1 mb-2">
                      {currency === 'USD' ? (
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xs font-bold text-orange-500">$</span>
                          <span className="text-lg sm:text-xl font-bold text-gray-900">
                            {formatPriceWithCurrency(product.price).replace('$', '')}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg sm:text-xl font-bold text-gray-900">
                            {Math.floor(product.price).toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-orange-500">₮</span>
                        </div>
                      )}
                    </div>

                    {/* NEW: "View Product" Action Button */}
                    <div className="mt-auto pt-3 border-t border-dashed border-gray-200">
                      <div className="w-full group/btn relative overflow-hidden rounded-lg bg-gray-50 p-2.5 text-center transition-all duration-300 group-hover:bg-slate-900">
                        <div className="flex items-center justify-center gap-2 transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0">
                          <span className="text-xs font-bold text-gray-600">Дэлгэрэнгүй</span>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center gap-2 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <span className="text-xs font-bold text-white">Үзэх</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            ) : (
              // Unavailable Skeleton
              <div className="bg-white rounded-xl overflow-hidden border border-gray-100 h-full opacity-60 pointer-events-none">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Дууссан</span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default memo(PremiumProductGrid);