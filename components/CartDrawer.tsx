'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore, type CartItem } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useTranslation } from '@/hooks/useTranslation';

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const { t } = useTranslation();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleQuantity = (item: CartItem, delta: number) => {
    const next = item.quantity + delta;
    if (next < 1) removeItem(item.id);
    else updateQuantity(item.id, next);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            aria-hidden
          />
          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-label={t('cart', 'title')}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
                {t('cart', 'title')}
                {totalItems > 0 && (
                  <span className="text-sm font-medium text-gray-500">({totalItems})</span>
                )}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Хаах"
              >
                <X className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <p className="font-semibold text-gray-700 mb-1">{t('cart', 'empty')}</p>
                  <p className="text-sm text-gray-500 mb-6">{t('cart', 'startShopping')}</p>
                  <Link href="/" onClick={onClose}>
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition">
                      {t('cart', 'backToShop')}
                    </span>
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={item.id} className="p-4 sm:px-6 flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={item.image || '/soyol-logo.png'}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.id}`}
                          onClick={onClose}
                          className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-orange-600 transition"
                        >
                          {item.name}
                        </Link>
                        <p className="text-orange-600 font-bold text-sm mt-0.5">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => handleQuantity(item, -1)}
                              className="p-1.5 rounded-md hover:bg-gray-200 transition"
                              aria-label="Багасгах"
                            >
                              <Minus className="w-3.5 h-3.5 text-gray-600" strokeWidth={2} />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantity(item, 1)}
                              className="p-1.5 rounded-md hover:bg-gray-200 transition"
                              aria-label="Нэмэх"
                            >
                              <Plus className="w-3.5 h-3.5 text-gray-600" strokeWidth={2} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            aria-label="Устгах"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer – only when cart has items */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-4 sm:px-6 bg-gray-50/80">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600 font-medium">{t('cart', 'total')}</span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Link href="/cart" onClick={onClose} className="flex-1">
                    <span className="block w-full py-3 text-center font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
                      {t('cart', 'title')}
                    </span>
                  </Link>
                  <Link href="/checkout" onClick={onClose} className="flex-1">
                    <span className="block w-full py-3 text-center font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition">
                      {t('cart', 'checkout')}
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
