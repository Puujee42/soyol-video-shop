'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, 
  Package, Globe, Flame, Truck, MessageCircle, Send, 
  MapPin, Clock, LayoutGrid
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Бүгд');
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
      {/* Professional Two-Tier Navigation */}
      <nav className="sticky top-0 z-[50] bg-white border-b border-slate-200 shadow-sm">
        
        {/* TOP ROW - Logo, Search, Actions */}
        <div className="border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-6 py-4">
              
              {/* Logo - Left */}
              <Link href="/" className="flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src="/soyol-logo.png"
                    alt="Soyol Video Shop"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </motion.div>
              </Link>

              {/* Search Bar - Center (Desktop) */}
              <div className="hidden md:flex flex-1 max-w-2xl">
                <div className="relative w-full flex">
                  {/* Category Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="h-full px-4 bg-slate-50 border border-slate-200 rounded-l-xl hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm font-medium text-slate-700 whitespace-nowrap"
                    >
                      <span className="hidden lg:inline">{selectedCategory}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Category Dropdown Menu */}
                    <AnimatePresence>
                      {isCategoryDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                        >
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => {
                                setSelectedCategory(cat);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                selectedCategory === cat
                                  ? 'bg-[#FF8C00]/10 text-[#FF8C00] font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Та юу хайж байна вэ?"
                    className="flex-1 px-4 py-3 border-y border-slate-200 outline-none focus:border-[#FF8C00] transition-colors text-sm"
                  />

                  {/* Search Button */}
                  <button className="px-6 bg-[#FF8C00] text-white rounded-r-xl hover:bg-[#FF8C00]/90 transition-colors flex items-center justify-center">
                    <Search className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Action Icons - Right */}
              <div className="hidden lg:flex items-center gap-6">
                
                {/* Profile */}
                <Link href="/account">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <User className="w-6 h-6 text-slate-600 group-hover:text-[#FF8C00] transition-colors" strokeWidth={1.5} />
                    <span className="text-xs text-slate-600 group-hover:text-[#FF8C00] transition-colors">Профайл</span>
                  </motion.div>
                </Link>

                {/* Messages */}
                <Link href="/messages">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <MessageCircle className="w-6 h-6 text-slate-600 group-hover:text-[#FF8C00] transition-colors" strokeWidth={1.5} />
                    <span className="text-xs text-slate-600 group-hover:text-[#FF8C00] transition-colors">Зурвас</span>
                  </motion.div>
                </Link>

                {/* Orders */}
                <Link href="/track">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <Package className="w-6 h-6 text-slate-600 group-hover:text-[#FF8C00] transition-colors" strokeWidth={1.5} />
                    <span className="text-xs text-slate-600 group-hover:text-[#FF8C00] transition-colors">Захиалга</span>
                  </motion.div>
                </Link>

                {/* Cart */}
                <Link href="/cart">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="relative flex flex-col items-center gap-1 cursor-pointer group"
                  >
                    <div className="relative">
                      <ShoppingBag className="w-6 h-6 text-slate-600 group-hover:text-[#FF8C00] transition-colors" strokeWidth={1.5} />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF8C00] text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-600 group-hover:text-[#FF8C00] transition-colors">Сагс</span>
                  </motion.div>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-700" strokeWidth={2} />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW - Categories, Nav Links, Info */}
        <div className="hidden lg:block bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              
              {/* All Categories Button - Left */}
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm">
                <LayoutGrid className="w-4 h-4" strokeWidth={2} />
                <span>Бүх ангилал</span>
                <ChevronDown className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* Primary Navigation Links - Center */}
              <div className="flex items-center gap-2">
                
                {/* Ready to Ship - HIGHLIGHTED */}
                <Link href="/ready-to-ship">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      pathname === '/ready-to-ship'
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {/* Green Indicator Dot */}
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Truck className="w-4 h-4" strokeWidth={2} />
                    <span>Бэлэн байгаа</span>
                  </motion.div>
                </Link>

                {/* Pre-order - HIGHLIGHTED */}
                <Link href="/pre-order">
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      pathname === '/pre-order'
                        ? 'bg-[#FF8C00] text-white shadow-lg shadow-[#FF8C00]/30'
                        : 'bg-orange-50 text-[#FF8C00] hover:bg-orange-100 border border-orange-200'
                    }`}
                  >
                    {/* Orange Indicator Dot */}
                    <div className="w-2 h-2 rounded-full bg-[#FF8C00] animate-pulse" />
                    <Clock className="w-4 h-4" strokeWidth={2} />
                    <span>Захиалгаар ирэх</span>
                  </motion.div>
                </Link>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200 mx-2" />

                {/* Other Links */}
                <Link href="/deals">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-[#FF8C00] transition-colors"
                  >
                    <Flame className="w-4 h-4" strokeWidth={2} />
                    <span>Онцлох</span>
                  </motion.div>
                </Link>

                <button
                  onClick={() => setIsShippingModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-[#FF8C00] transition-colors"
                >
                  <Truck className="w-4 h-4" strokeWidth={2} />
                  <span>Хүргэлт</span>
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
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-[#FF8C00] transition-colors"
                      >
                        <Icon className="w-4 h-4" strokeWidth={2} />
                        <span className="hidden xl:inline">{item.name}</span>
                      </motion.div>
                    </a>
                  );
                })}
              </div>

              {/* Ship To & Language - Right */}
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" strokeWidth={2} />
                  <span>🇲🇳 Улаанбаатар</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="md:hidden sticky top-[73px] z-40 bg-white border-b border-slate-200 p-4">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Хайх..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-l-lg outline-none focus:border-[#FF8C00] transition-colors text-sm"
          />
          <button className="px-4 bg-[#FF8C00] text-white rounded-r-lg">
            <Search className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Shipping Modal */}
      <AnimatePresence>
        {isShippingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
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
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Package className="w-5 h-5 text-slate-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Бэлэн бараа</p>
                    <p className="text-sm text-slate-600">24 цагийн дотор хүргэнэ</p>
                    <p className="text-xs text-[#FF8C00] font-semibold mt-1">Хүргэлт: 5,000₮</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
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
                  <p className="text-xs text-slate-500 text-center mt-1">
                    📞 77181818
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
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
                
                {/* Close Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-6 h-6" strokeWidth={2} />
                </button>

                <h3 className="text-xl font-bold text-slate-900 mb-6">Цэс</h3>

                {/* Main Links */}
                <div className="space-y-2 mb-6">
                  <Link href="/ready-to-ship">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        pathname === '/ready-to-ship'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <Truck className="w-5 h-5" strokeWidth={2} />
                      <span>Бэлэн байгаа</span>
                    </div>
                  </Link>

                  <Link href="/pre-order">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        pathname === '/pre-order'
                          ? 'bg-[#FF8C00] text-white'
                          : 'bg-orange-50 text-[#FF8C00]'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-[#FF8C00]" />
                      <Clock className="w-5 h-5" strokeWidth={2} />
                      <span>Захиалгаар ирэх</span>
                    </div>
                  </Link>

                  <Link href="/deals">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      <Flame className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">Онцлох</span>
                    </div>
                  </Link>

                  <Link href="/track">
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      <Package className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">Захиалга хянах</span>
                    </div>
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-200 my-6" />

                {/* User Actions */}
                <div className="space-y-2 mb-6">
                  <Link href="/account">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl">
                      <User className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">Профайл</span>
                    </div>
                  </Link>

                  <Link href="/cart">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl">
                      <ShoppingBag className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">Сагс</span>
                      {cartItemsCount > 0 && (
                        <span className="ml-auto px-2 py-1 bg-[#FF8C00] text-white text-xs font-bold rounded-full">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  <Link href="/wishlist">
                    <div className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl">
                      <Heart className="w-5 h-5" strokeWidth={2} />
                      <span className="font-medium">Хүслийн жагсаалт</span>
                    </div>
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-200 my-6" />

                {/* Support */}
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setIsShippingModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl"
                  >
                    <Truck className="w-5 h-5" strokeWidth={2} />
                    <span className="font-medium">Хүргэлтийн мэдээлэл</span>
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
                        <div className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl">
                          <Icon className={`w-5 h-5 ${item.color}`} strokeWidth={2} />
                          <span className="font-medium">{item.name}</span>
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
