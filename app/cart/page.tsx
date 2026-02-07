'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const totalItems = useCartStore((state) => state.getTotalItems());

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} хасагдлаа`, {
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-slate-400" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Таны сагс хоосон байна</h2>
            <p className="text-slate-600 mb-8">Бараа нэмж эхлээрэй</p>
            <Link href="/">
              <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                <ArrowLeft className="w-5 h-5" strokeWidth={2} />
                Худалдан авалт үргэлжлүүлэх
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link href="/">
            <motion.button
              whileHover={{ x: -4 }}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              <span className="text-sm font-medium">Буцах</span>
            </motion.button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Сагс</h1>
          <p className="text-slate-600">{totalItems} бараа</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex gap-6">
                    
                    {/* Product Image */}
                    <Link href={`/product/${item.id}`} className="flex-shrink-0">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-xl overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 96px, 128px"
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="text-base font-semibold text-slate-900 mb-2 hover:text-orange-600 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      
                      {/* Stock Status */}
                      {item.stockStatus && (
                        <div className="mb-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.stockStatus === 'in-stock'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-orange-50 text-orange-700'
                          }`}>
                            {item.stockStatus === 'in-stock' ? '✓ Бэлэн байгаа' : '⏱ Захиалгаар'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-end justify-between mt-auto">
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                          >
                            <Minus className="w-4 h-4 text-slate-700" strokeWidth={2} />
                          </button>
                          
                          <span className="text-base font-semibold text-slate-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                          >
                            <Plus className="w-4 h-4 text-slate-700" strokeWidth={2} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-lg font-bold text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-slate-500">
                              {formatPrice(item.price)} x {item.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="flex-shrink-0 w-9 h-9 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                    >
                      <Trash2 className="w-5 h-5" strokeWidth={2} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary - Sticky */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="sticky top-24 bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">Захиалгын дүн</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Дэд дүн ({totalItems} бараа)</span>
                  <span className="font-semibold text-slate-900">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Хүргэлт</span>
                  <span className="font-semibold text-slate-900">5,000₮</span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Нийт дүн</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {formatPrice(totalPrice + 5000)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mb-4">
                Захиалга өгөх
              </button>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600">✓</span>
                  <span>Бэлэн байгаа бараанд 24 цагийн хүргэлт</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-600">⏱</span>
                  <span>Захиалгаар 7-14 хоногийн хүргэлт</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">🛡</span>
                  <span>Найдвартай төлбөр</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
