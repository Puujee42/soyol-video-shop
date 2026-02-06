'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye, Package, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

interface DiscoveryProductCardProps {
  product: Product;
  index?: number;
}

export default function DiscoveryProductCard({ product, index = 0 }: DiscoveryProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSecondaryImage, setShowSecondaryImage] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const secondaryImage = product.image;

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

  return (
    <motion.a
      href={`/product/${product.id}`}
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
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-[#FF8C00]/10 hover:border-[#FF8C00]/20"
      >
        {/* Subtle glow effect on hover */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(255, 140, 0, 0.05) 0%, transparent 60%)'
            }}
          />
        )}
        {/* Image Container */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden">
          {/* Images */}
          <AnimatePresence mode="wait">
            {!showSecondaryImage ? (
              <motion.div
                key="primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                />
              </motion.div>
            ) : (
              <motion.div
                key="secondary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={secondaryImage}
                  alt={`${product.name} lifestyle`}
                  fill
                  className="object-cover scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimal Stock Badge - Top Right */}
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
            {product.stockStatus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  {product.stockStatus === 'in-stock' ? (
                    <Package className="w-3.5 h-3.5 text-slate-700" strokeWidth={2} />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-700" strokeWidth={2} />
                  )}
                  <span className="text-xs font-medium text-slate-700">
                    {product.stockStatus === 'in-stock' ? 'Бэлэн' : '7-14 хоног'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Inventory Count */}
            {product.stockStatus === 'in-stock' && product.inventory && product.inventory < 20 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 shadow-sm"
              >
                <span className="text-xs font-medium text-slate-600">
                  {product.inventory}
                </span>
              </motion.div>
            )}

            {/* Wishlist Button */}
            <motion.button
              onClick={handleWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-sm ${
                isWishlisted
                  ? 'bg-[#FF8C00] text-white border-[#FF8C00]'
                  : 'bg-white/90 text-slate-600 border-slate-200 hover:border-slate-300'
              } border`}
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
                strokeWidth={2}
              />
            </motion.button>
          </div>

          {/* Quick Actions - Slide up on hover */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{
              y: isHovered ? '0%' : '100%',
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-white/95 via-white/90 to-transparent backdrop-blur-sm"
          >
            <div className="flex gap-2">
              <motion.button
                onClick={handleQuickAdd}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-[#FF8C00] text-white font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 hover:bg-[#FF8C00]/90 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                Сагслах
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 bg-white border border-slate-200 text-slate-700 rounded-2xl hover:border-slate-300 transition-colors"
              >
                <Eye className="w-4 h-4" strokeWidth={2} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Card Content - Minimal & Clean */}
        <div className="p-5 space-y-3">
          {/* Product Name */}
          <h3 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#FF8C00] transition-colors">
            {product.name}
          </h3>

          {/* Rating - Minimal */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-slate-900 text-slate-900'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {product.rating}
            </span>
          </div>

          {/* Price - Bold & Clean */}
          <div className="flex items-baseline justify-between pt-2">
            <p className="text-2xl font-bold text-slate-900 tracking-tight">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Delivery Badge - Subtle */}
          {product.stockStatus && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              {product.stockStatus === 'in-stock' ? (
                <>
                  <Package className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="font-medium">Шууд хүргэлт</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="font-medium">7-14 хоног</span>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.a>
  );
}
