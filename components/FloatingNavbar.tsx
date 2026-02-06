'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, 
  Package, Globe, Flame, Truck, MessageCircle, Send 
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const supportDropdown = [
  { 
    name: 'Messenger-ээр холбогдох', 
    href: 'https://m.me/SoyolVideoShop', 
    icon: MessageCircle,
    color: 'text-blue-600'
  },
  { 
    name: 'WhatsApp', 
    href: 'https://wa.me/97677181818', 
    icon: Send,
    color: 'text-green-600' 
  },
];

export default function FloatingNavbar() {
  const pathname = usePathname();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartItemsCount = useCartStore((state) => state.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Minimalist Navigation Bar */}
      <nav className="sticky top-0 z-[50] bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'min-h-[72px]' : 'min-h-[88px]'}`}>
            
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center cursor-pointer py-2"
              >
                <img
                  src="/soyol-logo.png"
                  alt="Soyol Video Shop"
                  className={`w-auto object-contain transition-all duration-300 ${
                    scrolled 
                      ? 'h-10 sm:h-11' 
                      : 'h-10 sm:h-14'
                  }`}
                  style={{ maxHeight: 'none' }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation - Clean Links */}
            <div className="hidden lg:flex items-center space-x-2">
              
              {/* Ready to Ship */}
              <Link href="/ready-to-ship">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    pathname === '/ready-to-ship'
                      ? 'bg-[#FF8C00] text-white shadow-lg shadow-[#FF8C00]/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Package className="w-4 h-4" strokeWidth={2} />
                  <span>Бэлэн байгаа</span>
                </motion.div>
              </Link>

              {/* Pre-order */}
              <Link href="/pre-order">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    pathname === '/pre-order'
                      ? 'bg-[#FF8C00] text-white shadow-lg shadow-[#FF8C00]/20'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-4 h-4" strokeWidth={2} />
                  <span>Захиалгаар</span>
                </motion.div>
              </Link>

              {/* Hot Deals */}
              <Link href="/deals">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-[#FF8C00] hover:bg-orange-50 transition-all cursor-pointer"
                >
                  <Flame className="w-4 h-4" strokeWidth={2} />
                  <span>Онцлох</span>
                </motion.div>
              </Link>

              {/* Shipping Info */}
              <motion.button
                onClick={() => setIsShippingModalOpen(true)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                <Truck className="w-4 h-4" strokeWidth={2} />
                <span>Хүргэлт</span>
              </motion.button>

              {/* Track Order */}
              <Link href="/track">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Package className="w-4 h-4" strokeWidth={2} />
                  <span>Захиалга хянах</span>
                </motion.div>
              </Link>

              {/* Support Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsSupportDropdownOpen(true)}
                onMouseLeave={() => setIsSupportDropdownOpen(false)}
              >
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={2} />
                  <span>Тусламж</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isSupportDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Support Dropdown Menu */}
                <AnimatePresence>
                  {isSupportDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                    >
                      {supportDropdown.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group cursor-pointer"
                            >
                              <div className={`p-2 rounded-lg ${item.color} bg-opacity-10`}>
                                <Icon className={`w-4 h-4 ${item.color}`} strokeWidth={2} />
                              </div>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                {item.name}
                              </span>
                            </motion.div>
                          </a>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              
              {/* Search */}
              <motion.button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-full text-slate-700 hover:bg-slate-50 transition-all"
              >
                <Search className="w-5 h-5" strokeWidth={2} />
              </motion.button>

              {/* User */}
              <Link href="/account">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <User className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <Heart className="w-5 h-5" strokeWidth={2} />
                </motion.button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-50 transition-all"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#FF8C00] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </motion.button>
              </Link>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2.5 rounded-full text-slate-700 hover:bg-slate-50 transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <Menu className="w-5 h-5" strokeWidth={2} />
                )}
              </motion.button>
            </div>
          </div>

          {/* Expanded Search Bar */}
          <AnimatePresence>
            {isSearchExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden pb-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Бараа хайх..."
                    className="w-full px-5 py-3 pl-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#FF8C00] focus:bg-white transition-all text-sm"
                    autoFocus
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Shipping Modal */}
      <AnimatePresence>
        {isShippingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsShippingModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-white rounded-3xl p-8 shadow-2xl"
            >
              <button
                onClick={() => setIsShippingModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" strokeWidth={2} />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl mb-4">
                  <Truck className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Хүргэлтийн мэдээлэл</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Package className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Бэлэн бараа</p>
                    <p className="text-sm text-slate-600">24 цагийн дотор хүргэнэ</p>
                    <p className="text-xs text-[#FF8C00] font-semibold mt-1">Хүргэлт: 5,000₮</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Globe className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Захиалгаар</p>
                    <p className="text-sm text-slate-600">7-14 хоногийн дотор хүргэнэ</p>
                    <p className="text-xs text-[#FF8C00] font-semibold mt-1">Хүргэлт: 5,000₮</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 text-center">
                    📍 Ундрам плаза, Unic office 5 давхар 501 тоот
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsShippingModalOpen(false)}
                className="w-full mt-6 px-6 py-3 bg-[#FF8C00] text-white font-semibold rounded-2xl hover:bg-[#FF8C00]/90 transition-colors"
              >
                Ойлголоо
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Full Screen */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(24px)' }}
              exit={{ backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 bg-white/95"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative h-full flex flex-col items-center justify-center space-y-8 px-8"
            >
              
              {/* Main Links */}
              <Link href="/ready-to-ship">
                <motion.div
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 text-3xl font-bold transition-all ${
                    pathname === '/ready-to-ship' ? 'text-[#FF8C00]' : 'text-slate-900 hover:text-[#FF8C00]'
                  }`}
                >
                  <Package className="w-8 h-8" strokeWidth={2} />
                  <span>Бэлэн байгаа</span>
                </motion.div>
              </Link>

              <Link href="/pre-order">
                <motion.div
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 text-3xl font-bold transition-all ${
                    pathname === '/pre-order' ? 'text-[#FF8C00]' : 'text-slate-900 hover:text-[#FF8C00]'
                  }`}
                >
                  <Globe className="w-8 h-8" strokeWidth={2} />
                  <span>Захиалгаар</span>
                </motion.div>
              </Link>

              <Link href="/deals">
                <motion.div
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 text-3xl font-bold text-[#FF8C00]"
                >
                  <Flame className="w-8 h-8" strokeWidth={2} />
                  <span>Онцлох</span>
                </motion.div>
              </Link>

              {/* Divider */}
              <div className="w-32 h-px bg-slate-200" />

              {/* Utility Links */}
              <div className="flex flex-col items-center gap-4">
                <motion.button
                  onClick={() => {
                    setIsShippingModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-lg font-semibold text-slate-700"
                >
                  <Truck className="w-5 h-5" strokeWidth={2} />
                  Хүргэлт
                </motion.button>

                <Link href="/track">
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 text-lg font-semibold text-slate-700"
                  >
                    <Package className="w-5 h-5" strokeWidth={2} />
                    Захиалга хянах
                  </motion.button>
                </Link>

                {supportDropdown.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`flex items-center gap-2 text-lg font-semibold ${item.color}`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2} />
                        {item.name}
                      </motion.button>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
