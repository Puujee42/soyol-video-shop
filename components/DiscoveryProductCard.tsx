'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

interface DiscoveryProductCardProps {
  product: Product;
  index?: number;
  showTrendingBadge?: boolean;
}

export default function DiscoveryProductCard({ product, index = 0, showTrendingBadge = false }: DiscoveryProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

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
        borderRadius: '999px',
        padding: '12px 20px',
      },
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
          borderRadius: '999px',
          padding: '12px 20px',
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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group block"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className={`relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-300 ${
          isHovered ? 'shadow-lg shadow-slate-200/50' : 'shadow-sm shadow-slate-100/50'
        }`}
      >
        {/* Image Container */}
        <div className="relative aspect-square bg-slate-50 overflow-hidden">
          
          {/* Main Image with Zoom Effect */}
          <motion.div
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </motion.div>

          {/* Trending Badge - Top Left */}
          {showTrendingBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-[#D4734A]/90 backdrop-blur-sm text-white rounded-full shadow-sm flex items-center gap-1.5"
            >
              <span className="text-xs font-medium">Trending</span>
            </motion.div>
          )}

          {/* Stock Status Badge - Top Right */}
          {product.stockStatus && (
            <div className="absolute top-4 right-4 z-10">
              <div className={`px-3 py-1 rounded-full text-[10px] font-medium backdrop-blur-sm border ${
                product.stockStatus === 'in-stock'
                  ? 'bg-emerald-50/90 text-emerald-700 border-emerald-200/50'
                  : 'bg-orange-50/90 text-orange-700 border-orange-200/50'
              }`}>
                {product.stockStatus === 'in-stock' ? 'In Stock' : 'Pre-order'}
              </div>
            </div>
          )}

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`absolute bottom-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-all border ${
              isWishlisted 
                ? 'text-red-500 border-red-200' 
                : 'text-slate-400 hover:text-slate-600 border-transparent'
            }`}
          >
            <Heart 
              className="w-4 h-4" 
              strokeWidth={1.5}
              fill={isWishlisted ? 'currentColor' : 'none'}
            />
          </motion.button>
        </div>

        {/* Product Info */}
        <div className="p-5">
          
          {/* Product Name */}
          <h3 className="text-sm font-medium text-slate-900 mb-2 line-clamp-2 leading-relaxed tracking-tight">
            {product.name}
          </h3>

          {/* Price & Rating */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-slate-900">
                {formatPrice(product.price)}
              </span>
              {product.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-slate-900 fill-current'
                            : 'text-slate-300 fill-current'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 ml-1">
                    {product.rating}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleQuickAdd}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-slate-900 text-white text-xs font-medium rounded-full hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Сагсанд нэмэх</span>
          </motion.button>

          {/* Delivery Info - Minimal */}
          {product.stockStatus && (
            <div className="mt-3 text-center">
              <p className="text-[10px] text-slate-400 tracking-wide">
                {product.stockStatus === 'in-stock' 
                  ? 'Маргааш хүргэнэ' 
                  : '7-14 хоног'
                }
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.a>
  );
}
