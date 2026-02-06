'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, 
  Package, Globe, Truck, MessageCircle, Send, 
  MapPin
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const categories = [
  'Бүгд',
  'Электрон бараа',
  'Хувцас',
  'Гэр ахуй',
  'Гоо сайхан',
  'Спорт',
];

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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Бүгд');
  const [scrolled, setScrolled] = useState(false);
  const cartItemsCount = useCartStore((state) => state.items.length);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Premium Minimalist Navigation */}
      <nav className={`sticky top-0 z-[50] transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-sm' 
          : 'bg-white/70 backdrop-blur-xl'
      } border-b border-slate-100`}>
        
        {/* Single Row - Ultra Clean */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between gap-8 py-5">
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.div
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src="/soyol-logo.png"
                  alt="Soyol"
                  className="h-8 w-auto object-contain opacity-90"
                />
              </motion.div>
            </Link>

            {/* Premium Search Bar - Center (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-5 py-2.5 pl-11 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-slate-200 rounded-full outline-none transition-all duration-300 text-sm text-slate-900 placeholder:text-slate-400"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" strokeWidth={1.5} />
              </div>
            </div>

            {/* Action Icons - Minimalist */}
            <div className="hidden lg:flex items-center gap-6">
              
              {/* Profile */}
              <Link href="/account">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <User className="w-[18px] h-[18px] text-slate-600 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors font-medium tracking-wide">Профайл</span>
                </motion.div>
              </Link>

              {/* Wishlist */}
              <Link href="/wishlist">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <Heart className="w-[18px] h-[18px] text-slate-600 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors font-medium tracking-wide">Дуртай</span>
                </motion.div>
              </Link>

              {/* Orders */}
              <Link href="/track">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <Package className="w-[18px] h-[18px] text-slate-600 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors font-medium tracking-wide">Захиалга</span>
                </motion.div>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="relative">
                    <ShoppingBag className="w-[18px] h-[18px] text-slate-600 group-hover:text-slate-900 transition-colors" strokeWidth={1.5} />
                    {cartItemsCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-900 text-white text-[10px] font-semibold rounded-full flex items-center justify-center"
                      >
                        {cartItemsCount}
                      </motion.span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-600 transition-colors font-medium tracking-wide">Сагс</span>
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Ghost Navigation Links - Minimalist Bottom Bar */}
        <div className="hidden lg:block border-t border-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-center gap-1 py-3">
              
              {/* Ready to Ship - Ghost Style */}
              <Link href="/ready-to-ship">
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                  className="relative px-5 py-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Truck className={`w-[15px] h-[15px] transition-colors ${
                      pathname === '/ready-to-ship' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
                    }`} strokeWidth={1.5} />
                    <span className={`text-sm font-medium tracking-tight transition-colors ${
                      pathname === '/ready-to-ship' ? 'text-slate-900 font-semibold' : 'text-slate-500 group-hover:text-slate-700'
                    }`}>
                      Бэлэн байгаа
                    </span>
                  </div>
                  {/* Active Indicator Dot */}
                  {pathname === '/ready-to-ship' && (
                    <motion.div
                      layoutId="activeNavDot"
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>

              {/* Divider */}
              <div className="w-px h-4 bg-slate-200" />

              {/* Pre-order - Ghost Style */}
              <Link href="/pre-order">
                <motion.div
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                  className="relative px-5 py-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Globe className={`w-[15px] h-[15px] transition-colors ${
                      pathname === '/pre-order' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'
                    }`} strokeWidth={1.5} />
                    <span className={`text-sm font-medium tracking-tight transition-colors ${
                      pathname === '/pre-order' ? 'text-slate-900 font-semibold' : 'text-slate-500 group-hover:text-slate-700'
                    }`}>
                      Захиалгаар
                    </span>
                  </div>
                  {/* Active Indicator Dot */}
                  {pathname === '/pre-order' && (
                    <motion.div
                      layoutId="activeNavDot"
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-400 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>

              {/* Divider */}
              <div className="w-px h-4 bg-slate-200" />

              {/* Shipping Info */}
              <motion.button
                onClick={() => setIsShippingModalOpen(true)}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
                className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors tracking-tight"
              >
                Хүргэлт
              </motion.button>

              {/* Support */}
              {supportDropdown.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <motion.div
                      whileHover={{ y: -1 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors tracking-tight"
                    >
                      {item.name}
                    </motion.div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="md:hidden sticky top-[73px] z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2.5 pl-10 bg-slate-50 rounded-full outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 transition-all text-sm"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
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
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
              </button>

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-50 rounded-2xl mb-4">
                  <Truck className="w-6 h-6 text-slate-700" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">Хүргэлтийн мэдээлэл</h3>
                <p className="text-sm text-slate-500">Таны бүх асуултад хариулах</p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors">
                  <Package className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm mb-0.5">Бэлэн бараа</p>
                    <p className="text-xs text-slate-500">24 цагийн дотор хүргэнэ</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">5,000₮</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors">
                  <Globe className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium text-slate-900 text-sm mb-0.5">Захиалгаар</p>
                    <p className="text-xs text-slate-500">7-14 хоногийн дотор хүргэнэ</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">5,000₮</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Ундрам плаза, 5 давхар 501</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Minimalist Slide */}
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
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-5 right-5 p-2 rounded-lg hover:bg-slate-50"
                >
                  <X className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                </button>

                <h3 className="text-lg font-semibold text-slate-900 mb-6 tracking-tight">Цэс</h3>

                <div className="space-y-1 mb-8">
                  <Link href="/ready-to-ship">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        pathname === '/ready-to-ship'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Truck className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-sm font-medium">Бэлэн байгаа</span>
                    </div>
                  </Link>

                  <Link href="/pre-order">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        pathname === '/pre-order'
                          ? 'bg-slate-900 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Globe className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-sm font-medium">Захиалгаар</span>
                    </div>
                  </Link>
                </div>

                <div className="h-px bg-slate-100 my-6" />

                <div className="space-y-1 mb-8">
                  <Link href="/account">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
                      <User className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-sm font-medium">Профайл</span>
                    </div>
                  </Link>

                  <Link href="/cart">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
                      <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-sm font-medium">Сагс</span>
                      {cartItemsCount > 0 && (
                        <span className="ml-auto px-2 py-0.5 bg-slate-900 text-white text-xs font-semibold rounded-full">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  <Link href="/wishlist">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl">
                      <Heart className="w-4 h-4" strokeWidth={1.5} />
                      <span className="text-sm font-medium">Дуртай</span>
                    </div>
                  </Link>
                </div>

                <div className="h-px bg-slate-100 my-6" />

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsShippingModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    <Truck className="w-4 h-4" strokeWidth={1.5} />
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
                          <Icon className="w-4 h-4" strokeWidth={1.5} />
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
