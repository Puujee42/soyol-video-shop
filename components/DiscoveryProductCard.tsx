'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Package, Clock, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@/models/Product';

interface DiscoveryProductCardProps {
  product: Product;
  index?: number;
  showTrendingBadge?: boolean;
}

export default function DiscoveryProductCard({ product, index = 0, showTrendingBadge = false }: DiscoveryProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSecondaryImage, setShowSecondaryImage] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image || '/soyol-logo.png');
  const addItem = useCartStore((state) => state.addItem);

  // Update imgSrc if product image changes
  useEffect(() => {
    setImgSrc(product.image || '/soyol-logo.png');
  }, [product.image]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success('Сагсанд нэмэгдлээ', {
      duration: 2000,
      position: 'top-right',
      style: {
        background: '#1e293b',
        color: 'white',
        fontWeight: '500',
        borderRadius: '16px',
      },
      icon: '✓',
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(
      isWishlisted ? 'Хүслээс хассан' : 'Хүсэлд нэмсэн',
      {
        duration: 1500,
        position: 'top-right',
        icon: isWishlisted ? '💔' : '❤️',
        style: {
          borderRadius: '16px',
        },
      }
    );
  };

  const InnerCard = () => (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/60 border border-slate-100"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {/* Images with Zoom Effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showSecondaryImage ? 'secondary' : 'primary'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgSrc('/soyol-logo.png')}
            />
          </motion.div>
        </AnimatePresence>

        {/* Trending Badge - Minimal */}
        {showTrendingBadge && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-slate-900/90 backdrop-blur-sm text-white rounded-lg flex items-center gap-1.5"
          >
            <TrendingUp className="w-3 h-3" strokeWidth={1.5} />
            <span className="text-[10px] font-medium tracking-wide">Эрэлттэй</span>
          </motion.div>
        )}

        {/* Minimal Stock Badge - Top Right */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
          {product.stockStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-100 shadow-sm"
            >
              <div className="flex items-center gap-1.5">
                {product.stockStatus === 'in-stock' ? (
                  <Package className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
                ) : (
                  <Clock className="w-3 h-3 text-slate-600" strokeWidth={1.5} />
                )}
                <span className="text-[10px] font-bold text-slate-600 tracking-wide uppercase">
                  {product.stockStatus === 'in-stock' ? 'Бэлэн' : '7-14 хоног'}
                </span>
              </div>
            </motion.div>
          )}

          {/* Wishlist Button - Minimal */}
          <motion.button
            onClick={handleWishlist}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/95 text-slate-400 hover:text-red-500 border border-slate-100'
              }`}
          >
            <Heart
              className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
              strokeWidth={2}
            />
          </motion.button>
        </div>

        {/* Quick Actions - Minimal Slide up on hover */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{
            y: isHovered ? '0%' : '100%',
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/98 via-white/90 to-transparent backdrop-blur-md"
        >
          <div className="flex gap-2">
            <motion.button
              onClick={handleQuickAdd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg shadow-slate-900/20"
            >
              <ShoppingCart className="w-4 h-4" strokeWidth={2} />
              САГСЛАХ
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-slate-900 transition-colors shadow-sm"
            >
              <Eye className="w-4 h-4" strokeWidth={2} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Card Content - Premium Typography */}
      <div className="p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight tracking-tight group-hover:text-orange-600 transition-colors h-10">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-black text-slate-900 tracking-tight">
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-bold text-slate-400">{product.rating || 0}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onHoverStart={() => {
        setIsHovered(true);
        setShowSecondaryImage(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowSecondaryImage(false);
      }}
      className="group block"
    >
      {product.id ? (
        <Link href={`/product/${product.id}`} className="block">
          <InnerCard />
        </Link>
      ) : (
        <div className="block cursor-not-allowed opacity-70">
          <InnerCard />
        </div>
      )}
    </motion.div>
  );
}

// Minimal Star Icon
const Star = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);
