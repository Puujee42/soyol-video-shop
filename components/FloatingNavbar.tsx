'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, 
  Package, Globe, Flame, Truck, MessageCircle, Send, 
  MapPin, Clock
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const supportDropdown = [
  { 
    name: 'Messenger', 
    href: 'https://m.me/SoyolVideoShop', 
    icon: MessageCircle,
  },
  { 
    name: 'WhatsApp', 
    href: 'https://wa.me/97677181818', 
    icon: Send,
  },
];

export default function FloatingNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      {/* Premium Minimalist Navigation */}
      <nav className={`sticky top-0 z-[50] transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl' 
          : 'bg-white/60 backdrop-blur-lg'
      } border-b border-slate-100/50`}>
        
        {/* Single Row - Ultra Clean */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 py-5">
            
            {/* Logo - Left */}
            <Link href="/" className="flex-shrink-0">
              <motion.div
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/soyol-logo.png"
                  alt="Soyol"
                  className="h-8 w-auto object-contain"
                />
              </motion.div>
            </Link>

            {/* Center Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              
              {/* Home */}
              <Link href="/">
                <motion.div
                  whileHover={{ y: -1 }}
                  className={`px-4 py-2 text-sm font-medium transition-all ${
                    pathname === '/'
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Home
                </motion.div>
              </Link>

              {/* Ready - Ghost Style */}
              <Link href="/ready-to-ship">
                <motion.div
                  whileHover={{ y: -1 }}
                  className={`relative px-4 py-2 text-sm font-medium transition-all ${
                    pathname === '/ready-to-ship'
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Бэлэн байгаа
                  {pathname === '/ready-to-ship' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4734A] rounded-full"
                    />
                  )}
                </motion.div>
              </Link>

              {/* Pre-order - Ghost Style */}
              <Link href="/pre-order">
                <motion.div
                  whileHover={{ y: -1 }}
                  className={`relative px-4 py-2 text-sm font-medium transition-all ${
                    pathname === '/pre-order'
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Захиалгаар
                  {pathname === '/pre-order' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4734A] rounded-full"
                    />
                  )}
                </motion.div>
              </Link>

              {/* Deals */}
              <Link href="/deals">
                <motion.div
                  whileHover={{ y: -1 }}
                  className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-all"
                >
                  Онцлох
                </motion.div>
              </Link>

              {/* Shipping */}
              <button
                onClick={() => setIsShippingModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-all"
              >
                Хүргэлт
              </button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              
              {/* Pill Search - Desktop */}
              <div className="hidden md:flex relative">
                <input
                  type="text"
                  placeholder="Хайх..."
                  className="w-64 px-5 py-2 bg-slate-50 rounded-full text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-slate-100 transition-all border border-transparent focus:border-slate-200"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-full transition-colors">
                  <Search className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                </button>
              </div>

              {/* Action Icons - Ultra Minimal */}
              <div className="hidden lg:flex items-center gap-5">
                
                {/* Profile */}
                <Link href="/account">
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="flex flex-col items-center gap-0.5 cursor-pointer group"
                  >
                    <User className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">Профайл</span>
                  </motion.div>
                </Link>

                {/* Wishlist */}
                <Link href="/wishlist">
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="flex flex-col items-center gap-0.5 cursor-pointer group"
                  >
                    <Heart className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">Хүсэл</span>
                  </motion.div>
                </Link>

                {/* Cart */}
                <Link href="/cart">
                  <motion.div
                    whileHover={{ y: -1 }}
                    className="relative flex flex-col items-center gap-0.5 cursor-pointer group"
                  >
                    <div className="relative">
                      <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4734A] text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors">Сагс</span>
                  </motion.div>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="md:hidden sticky top-[73px] z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Хайх..."
            className="w-full px-5 py-2.5 bg-slate-50 rounded-full text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:bg-slate-100 transition-all"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* Shipping Modal - Premium Style */}
      <AnimatePresence>
        {isShippingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md"
            onClick={() => setIsShippingModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl"
            >
              <button
                onClick={() => setIsShippingModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
              </button>

              <h3 className="text-2xl font-semibold text-slate-900 mb-8 tracking-tight">Хүргэлт</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <Package className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">Бэлэн бараа</p>
                    <p className="text-sm text-slate-500 leading-relaxed">24 цагийн дотор хүргэнэ</p>
                    <p className="text-xs text-[#D4734A] font-medium mt-2">5,000₮</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <Globe className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 mb-1">Захиалгаар</p>
                    <p className="text-sm text-slate-500 leading-relaxed">7-14 хоногийн дотор хүргэнэ</p>
                    <p className="text-xs text-[#D4734A] font-medium mt-2">5,000₮</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-400 text-center leading-relaxed">
                    Ундрам плаза, Unic office 5 давхар 501
                    <br />
                    📞 77181818
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsShippingModalOpen(false)}
                className="w-full mt-8 px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-800 transition-colors"
              >
                Ойлголоо
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Premium Slide */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full"
                >
                  <X className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                </button>

                <h3 className="text-lg font-semibold text-slate-900 mb-8 tracking-tight">Цэс</h3>

                {/* Main Links */}
                <div className="space-y-1 mb-8">
                  <Link href="/">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        pathname === '/'
                          ? 'bg-slate-50 text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Home
                    </div>
                  </Link>

                  <Link href="/ready-to-ship">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        pathname === '/ready-to-ship'
                          ? 'bg-slate-50 text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Бэлэн байгаа
                    </div>
                  </Link>

                  <Link href="/pre-order">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        pathname === '/pre-order'
                          ? 'bg-slate-50 text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Захиалгаар
                    </div>
                  </Link>

                  <Link href="/deals">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium"
                    >
                      Онцлох
                    </div>
                  </Link>

                  <Link href="/track">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium"
                    >
                      Захиалга хянах
                    </div>
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 my-8" />

                {/* User Actions */}
                <div className="space-y-1 mb-8">
                  <Link href="/account">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
                      <User className="w-5 h-5" strokeWidth={1.5} />
                      <span className="text-sm font-medium">Профайл</span>
                    </div>
                  </Link>

                  <Link href="/cart">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
                      <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                      <span className="text-sm font-medium">Сагс</span>
                      {cartItemsCount > 0 && (
                        <span className="ml-auto px-2 py-1 bg-[#D4734A] text-white text-xs font-semibold rounded-full">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  <Link href="/wishlist">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
                      <Heart className="w-5 h-5" strokeWidth={1.5} />
                      <span className="text-sm font-medium">Хүслийн жагсаалт</span>
                    </div>
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 my-8" />

                {/* Support */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsShippingModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    <Truck className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-sm font-medium">Хүргэлт</span>
                  </button>

                  {supportDropdown.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
                          <Icon className="w-5 h-5" strokeWidth={1.5} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
