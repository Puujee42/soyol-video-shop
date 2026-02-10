'use client';

import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, 
  Package, Globe, Flame, Truck, MessageCircle, Send, LogIn, LogOut
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const productsDropdown = [
  { name: 'Бэлэн бараа', href: '/ready-to-ship', icon: Package },
  { name: 'Захиалгаар', href: '/pre-order', icon: Globe },
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

function FloatingNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Get cart and wishlist counts
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const wishlistItemsCount = useWishlistStore((state) => state.getTotalItems());

  // Fix hydration mismatch by only showing counts after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Clean Navigation Bar */}
      <nav className={`sticky top-0 z-[50] transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md' 
          : 'bg-white shadow-sm'
      } border-b border-slate-100`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${
            scrolled 
              ? 'min-h-[56px] sm:min-h-[64px] lg:min-h-[68px]' 
              : 'min-h-[64px] sm:min-h-[72px] lg:min-h-[80px]'
          }`}>
            
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center cursor-pointer"
              >
                <Image
                  src="/soyol-logo.png"
                  alt="Soyol Video Shop"
                  width={scrolled ? 100 : 120}
                  height={scrolled ? 32 : 40}
                  priority
                  className="w-auto h-8 sm:h-10 lg:h-auto object-contain transition-all duration-300"
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation - Simple Links */}
            <div className="hidden lg:flex items-center space-x-1">
              
              {/* Бэлэн байгаа */}
              <Link href="/ready-to-ship">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Бэлэн байгаа
                </motion.div>
              </Link>

              {/* Захиалгаар */}
              <Link href="/pre-order">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Захиалгаар
                </motion.div>
              </Link>

              {/* Онцлох */}
              <Link href="/deals">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                >
                  Онцлох
                </motion.div>
              </Link>

              {/* Хүргэлт */}
              <motion.button
                onClick={() => setIsShippingModalOpen(true)}
                whileHover={{ scale: 1.02 }}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Хүргэлт
              </motion.button>

              {/* Тусламж */}
              <div 
                className="relative"
                onMouseEnter={() => setIsSupportDropdownOpen(true)}
                onMouseLeave={() => setIsSupportDropdownOpen(false)}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
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
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
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
                              <Icon className={`w-4 h-4 ${item.color}`} strokeWidth={2} />
                              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
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
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
              
              {/* Search */}
              <motion.button
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 sm:p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-all"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
              </motion.button>

              {/* User / Login */}
              {session ? (
                <div 
                  className="relative"
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ''}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border-2 border-orange-500 shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </motion.button>

                  {/* User Dropdown */}
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                          <p className="text-xs text-slate-600 mb-0.5">Нэвтэрсэн</p>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {session.user.name || session.user.email || session.user.phoneNumber}
                          </p>
                        </div>
                        
                        <Link href="/dashboard">
                          <motion.div
                            whileHover={{ backgroundColor: 'rgb(248 250 252)' }}
                            className="flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer"
                          >
                            <User className="w-4 h-4 text-slate-600" strokeWidth={2} />
                            <span className="text-sm font-medium text-slate-700">Хянах самбар</span>
                          </motion.div>
                        </Link>

                        <Link href="/dashboard">
                          <motion.div
                            whileHover={{ backgroundColor: 'rgb(248 250 252)' }}
                            className="flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer"
                          >
                            <Package className="w-4 h-4 text-slate-600" strokeWidth={2} />
                            <span className="text-sm font-medium text-slate-700">Миний захиалга</span>
                          </motion.div>
                        </Link>

                        <button
                          onClick={() => signOut({ callbackUrl: '/' })}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-slate-100"
                        >
                          <LogOut className="w-4 h-4 text-red-600" strokeWidth={2} />
                          <span className="text-sm font-medium text-red-600">Гарах</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <LogIn className="w-4 h-4" strokeWidth={2} />
                    <span className="text-sm">Нэвтрэх</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="sm:hidden p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <User className="w-5 h-5" strokeWidth={2} />
                  </motion.button>
                </Link>
              )}

              {/* Wishlist */}
              <Link href="/wishlist">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 sm:p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                  {mounted && wishlistItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                      {wishlistItemsCount}
                    </span>
                  )}
                </motion.button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 sm:p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                  {mounted && cartItemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
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
                className="lg:hidden p-2 sm:p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
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
                className="overflow-hidden pb-3 sm:pb-4"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Бараа хайх..."
                    className="w-full px-4 sm:px-5 py-3 sm:py-3.5 pl-10 sm:pl-12 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all text-sm shadow-sm"
                    autoFocus
                  />
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" strokeWidth={2} />
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
                  <Truck className="w-8 h-8 text-blue-600" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Хүргэлтийн мэдээлэл</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <Package className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Бэлэн бараа</p>
                    <p className="text-sm text-slate-600">24 цагийн дотор хүргэнэ</p>
                    <p className="text-xs text-orange-600 font-semibold mt-1">Хүргэлт: 5,000₮</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <Globe className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Захиалгаар</p>
                    <p className="text-sm text-slate-600">7-14 хоногийн дотор хүргэнэ</p>
                    <p className="text-xs text-orange-600 font-semibold mt-1">Хүргэлт: 5,000₮</p>
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
                className="w-full mt-6 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all"
              >
                Ойлголоо
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Slide-Out Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-Out Drawer from Right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                mass: 0.8
              }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between shadow-lg z-10">
                <div className="flex items-center gap-3">
                  <Image
                    src="/soyol-logo.png"
                    alt="Soyol Video Shop"
                    width={100}
                    height={32}
                    className="brightness-0 invert"
                  />
                </div>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* User Info / Login */}
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-200">
                {session ? (
                  <div className="flex items-center gap-3">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || ''}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border-2 border-orange-500"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-lg">
                        {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {session.user.name || session.user.email || session.user.phoneNumber}
                      </p>
                      <p className="text-xs text-slate-500">Хэрэглэгч</p>
                    </div>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-md"
                    >
                      <LogIn className="w-5 h-5" strokeWidth={2} />
                      <span className="font-semibold">Нэвтрэх / Бүртгүүлэх</span>
                    </motion.div>
                  </Link>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="px-6 py-4 space-y-1">
                {/* Main Category Links */}
                {productsDropdown.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        onClick={() => setIsMobileMenuOpen(false)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-orange-50 text-orange-600 font-semibold' 
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                        <span className="text-[15px]">{item.name}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Deals Link */}
                <Link href="/deals">
                  <motion.div
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-orange-600 hover:bg-orange-50 font-semibold transition-all"
                  >
                    <Flame className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-[15px]">Онцлох</span>
                  </motion.div>
                </Link>

                {/* Divider */}
                <div className="h-px bg-slate-200 my-4" />

                {/* Utility Links */}
                {session && (
                  <>
                    <Link href="/dashboard">
                      <motion.div
                        onClick={() => setIsMobileMenuOpen(false)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-all"
                      >
                        <User className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                        <span className="text-[15px]">Хянах самбар</span>
                      </motion.div>
                    </Link>
                    <Link href="/dashboard">
                      <motion.div
                        onClick={() => setIsMobileMenuOpen(false)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-all"
                      >
                        <Package className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                        <span className="text-[15px]">Миний захиалга</span>
                      </motion.div>
                    </Link>
                  </>
                )}

                <motion.button
                  onClick={() => {
                    setIsShippingModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-all"
                >
                  <Truck className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                  <span className="text-[15px]">Хүргэлтийн мэдээлэл</span>
                </motion.button>

                {/* Divider */}
                <div className="h-px bg-slate-200 my-4" />

                {/* Support Links */}
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Холбогдох
                </p>
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
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-slate-50 transition-all"
                      >
                        <Icon className={`w-5 h-5 flex-shrink-0 ${item.color}`} strokeWidth={2} />
                        <span className="text-[15px] font-medium text-slate-700">{item.name}</span>
                      </motion.div>
                    </a>
                  );
                })}

                {/* Sign Out Button */}
                {session && (
                  <>
                    <div className="h-px bg-slate-200 my-4" />
                    <motion.button
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setIsMobileMenuOpen(false);
                      }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all"
                    >
                      <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                      <span className="text-[15px]">Гарах</span>
                    </motion.button>
                  </>
                )}
              </nav>

              {/* Drawer Footer */}
              <div className="px-6 py-5 mt-auto border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-center text-slate-500">
                  📍 Ундрам плаза, Unic office 5 давхар 501
                </p>
                <p className="text-xs text-center text-slate-500 mt-1">
                  📞 77181818
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(FloatingNavbar);
