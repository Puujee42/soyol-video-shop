'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
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

  // Simulate secondary image (use same image with different filter for demo)
  const secondaryImage = product.image;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success('Сагсанд нэмэгдлээ!', {
      duration: 2000,
      position: 'top-right',
      style: {
        background: '#FF7900',
        color: 'white',
        fontWeight: 'bold',
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
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
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-shadow duration-300"
        style={{
          boxShadow: isHovered
            ? '0 20px 40px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 121, 0, 0.1)'
            : '0 1px 3px rgba(0, 0, 0, 0.02)',
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {/* Primary Image */}
          <AnimatePresence mode="wait">
            {!showSecondaryImage ? (
              <motion.div
                key="primary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gray-100"
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
                className="absolute inset-0 bg-gray-100"
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

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.featured && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2.5 py-1 bg-soyol/10 backdrop-blur-md rounded-lg border border-soyol/20"
              >
                <span className="text-xs font-bold text-soyol">New Arrival</span>
              </motion.div>
            )}
            {product.wholesale && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="px-2.5 py-1 bg-gray-900/80 backdrop-blur-md rounded-lg"
              >
                <span className="text-xs font-bold text-white">Limited</span>
              </motion.div>
            )}
          </div>

          {/* Stock Status Badge (top-right) */}
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
            {/* Premium Stock Badge */}
            {product.stockStatus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                className={`relative overflow-hidden rounded-xl shadow-lg ${
                  product.stockStatus === 'in-stock'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-[#FF8C00] to-amber-600'
                }`}
              >
                <div className="px-3 py-1.5 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">
                      {product.stockStatus === 'in-stock' ? '🟢' : '⏳'}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {product.stockStatus === 'in-stock' ? 'Агуулахад бэлэн' : 'Захиалгаар'}
                    </span>
                  </div>
                </div>
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>
            )}
            
            {/* Inventory Count (In Stock Only) */}
            {product.stockStatus === 'in-stock' && product.inventory && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-gray-200"
              >
                <span className="text-xs font-bold text-gray-700">
                  {product.inventory} ширхэг
                </span>
              </motion.div>
            )}
            
            {/* Wishlist Button */}
            <motion.button
              onClick={handleWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                isWishlisted
                  ? 'bg-soyol text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-soyol'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`}
              />
            </motion.button>
          </div>

          {/* Quick Actions (slide up on hover) */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{
              y: isHovered ? '0%' : '100%',
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-sm"
          >
            <div className="flex gap-2">
              <motion.button
                onClick={handleQuickAdd}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 bg-soyol text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-soyol/50 hover:bg-soyol-dark transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Сагслах
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-2.5 bg-white/90 text-gray-900 rounded-xl shadow-lg hover:bg-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-2">
          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-soyol transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-soyol text-soyol'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              ({product.rating})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between pt-1">
            <p className="text-xl font-black text-soyol">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Delivery Info - Prominent */}
          {product.stockStatus && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border-2 ${
                product.stockStatus === 'in-stock'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-orange-50 border-orange-200 text-orange-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base">
                  {product.stockStatus === 'in-stock' ? '🚚' : '✈️'}
                </span>
                <span className="text-xs font-bold">
                  {product.stockStatus === 'in-stock' ? 'Өнөөдөр хүргэнэ' : '7-14 хоногт'}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Hover Border Accent */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            borderColor: isHovered
              ? 'rgba(255, 121, 0, 0.2)'
              : 'rgba(0, 0, 0, 0)',
          }}
          style={{
            borderWidth: '1px',
            borderStyle: 'solid',
          }}
        />
      </motion.div>
    </motion.a>
  );
}
