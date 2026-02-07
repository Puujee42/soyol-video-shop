'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Search, User, Heart, ShoppingBag, Menu, X, 
  Globe, ArrowRight, Sparkles, Tag, TrendingUp, Truck, Zap
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import LanguageCurrencySelector from './LanguageCurrencySelector';

export default function LuxuryNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { language, currency, setLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [wishlistBump, setWishlistBump] = useState(false);
  
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  const wishlistItemsCount = useWishlistStore((state) => state.getTotalItems());

  useEffect(() => {
    if (wishlistItemsCount > 0) {
      setWishlistBump(true);
      const timer = setTimeout(() => setWishlistBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [wishlistItemsCount]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    { name: t('nav', 'home'), href: '/', icon: Sparkles },
    { name: t('nav', 'newArrivals'), href: '/new-arrivals', icon: TrendingUp },
    { name: t('nav', 'readyToShip'), href: '/ready-to-ship', icon: Truck },
    { name: t('nav', 'preOrder'), href: '/pre-order', icon: Globe },
    { name: t('nav', 'deals'), href: '/deals', icon: Tag },
    { name: t('nav', 'sale'), href: '/sale', icon: Zap },
  ];

  return (
    <>
      {/* Luxury Navbar with Glassmorphism */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-orange-100/50 shadow-lg shadow-orange-50/50'
            : 'bg-white/70 backdrop-blur-md border-b border-gray-100/30'
        }`}
        style={{
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(16px) saturate(150%)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Row: Logo, Search, Icons */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className={`relative flex items-center justify-between transition-all duration-300 ${
              scrolled ? 'h-16 lg:h-18' : 'h-20 lg:h-24'
            }`}>
              
              {/* Logo with Premium Animation */}
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative flex flex-col items-start"
                >
                  <motion.h1
                    className="text-3xl font-black tracking-tighter leading-none text-[#FF5000]"
                    whileHover={{ 
                      scale: 1.05,
                      textShadow: "0 0 8px rgba(255,80,0,0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Soyol
                  </motion.h1>
                  <motion.span 
                    className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase leading-none ml-0.5 mt-0.5"
                    whileHover={{ color: "#475569" }}
                  >
                    Video Shop
                  </motion.span>
                </motion.div>
              </Link>

              {/* Premium Search Bar */}
              <form 
                onSubmit={handleSearch}
                className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] lg:max-w-[600px] z-20"
              >
                <motion.div 
                  className={`relative w-full group rounded-full transition-all duration-300 ${
                    searchFocused 
                      ? 'bg-white border-2 border-[#FF5000] shadow-lg' 
                      : 'bg-white border border-gray-200 hover:border-[#FF5000] hover:shadow-[0_0_25px_rgba(255,80,0,0.2)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]'
                  }`}
                  animate={{ 
                    scale: searchFocused ? 1.02 : 1,
                    y: searchFocused ? -2 : 0
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative flex items-center rounded-full h-full w-full overflow-hidden">
                    <motion.div
                      animate={{ 
                        scale: searchFocused ? 1.2 : 1,
                        rotate: searchFocused ? 15 : 0,
                        y: searchFocused ? [0, -3, 0] : 0
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 10,
                        y: { duration: 0.4, repeat: searchFocused ? 0 : 0 }
                      }}
                      className="pl-4"
                    >
                      <Search className={`w-5 h-5 transition-colors duration-300 ${
                        searchFocused ? 'text-[#FF5000]' : 'text-gray-400 group-hover:text-[#FF5000]'
                      }`} strokeWidth={1.5} />
                    </motion.div>
                    
                    <input
                      type="text"
                      placeholder={t('nav', 'search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="flex-1 px-4 py-3 bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
                    />
                    
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.button
                          type="button"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          onClick={() => setSearchQuery('')}
                          className="p-1.5 mr-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" strokeWidth={1.5} />
                        </motion.button>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`mr-1.5 p-2 rounded-full transition-all duration-300 ${
                        searchFocused || searchQuery
                          ? 'bg-[#FF5000] text-white shadow-lg shadow-orange-500/30'
                          : 'bg-gray-100 text-gray-400 group-hover:bg-[#FF5000] group-hover:text-white group-hover:shadow-md'
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </motion.div>
              </form>

              {/* Right Icons */}
              <motion.div 
                animate={{ scale: scrolled ? 0.9 : 1 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-2 lg:gap-4"
              >
                {/* Language/Currency Switcher */}
                <div className="hidden lg:block">
                  <LanguageCurrencySelector />
                </div>

                {/* User */}
                <Link href={session ? '/dashboard' : '/login'}>
                  <motion.div
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
                  >
                    <User className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" strokeWidth={1.2} />
                  </motion.div>
                </Link>

                {/* Wishlist */}
                <Link href="/wishlist">
                  <motion.div
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    animate={wishlistBump ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
                  >
                    <Heart className={`w-5 h-5 transition-colors ${wishlistItemsCount > 0 ? 'text-orange-500 fill-orange-50' : 'text-gray-600 group-hover:text-orange-500'}`} strokeWidth={1.2} />
                    {mounted && wishlistItemsCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                      >
                        {wishlistItemsCount}
                      </motion.span>
                    )}
                  </motion.div>
                </Link>

                {/* Cart with Pulsating Dot */}
                <Link href="/cart">
                  <motion.div
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors group cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" strokeWidth={1.2} />
                    {mounted && cartItemsCount > 0 && (
                      <>
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                        >
                          {cartItemsCount}
                        </motion.span>
                        <motion.span
                          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full"
                        />
                      </>
                    )}
                  </motion.div>
                </Link>

                {/* Mobile Menu */}
                <motion.button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  whileTap={{ scale: 0.95 }}
                  className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-600" strokeWidth={1.2} />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-600" strokeWidth={1.2} />
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Bottom Row: Navigation Links (Desktop) */}
          <div className="hidden lg:block border-t border-gray-100/50">
            <div className="px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center justify-center gap-1">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = pathname === category.href;
                  
                  return (
                    <Link key={category.href} href={category.href}>
                      <motion.div
                        className="relative px-4 py-4 group cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <div className={`flex items-center gap-2 transition-all duration-300 ${
                          isActive 
                            ? 'text-orange-600 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]' 
                            : 'text-gray-600 hover:text-orange-500 hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.2)]'
                        }`}>
                          <Icon className={`w-4 h-4 transition-colors duration-300 ${
                            isActive ? 'text-orange-600' : 'group-hover:text-orange-500'
                          }`} strokeWidth={1.2} />
                          <span className="text-sm font-semibold tracking-tight">
                            {category.name}
                          </span>
                        </div>
                        
                        {/* Animated Underline - Glide from Center */}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-4"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer */}
      <div className={scrolled ? 'h-[80px] lg:h-[96px]' : 'h-[96px] lg:h-[112px]'} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-white to-orange-50/20">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" strokeWidth={1.2} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="px-6 py-4 border-b border-gray-50">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder={t('nav', 'search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
                </form>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = pathname === category.href;
                    
                    return (
                      <Link key={category.href} href={category.href}>
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600'
                              : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" strokeWidth={1.2} />
                          <span className="font-semibold">{category.name}</span>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* Language Switcher Mobile */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => setLanguage(language === 'MN' ? 'EN' : 'MN')}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-orange-500" strokeWidth={1.2} />
                      <span className="font-semibold text-gray-900">
                        {t('nav', 'language')}
                      </span>
                    </div>
                    <span className="font-bold text-orange-500">
                      {language === 'MN' ? 'MN | ₮' : 'EN | $'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
