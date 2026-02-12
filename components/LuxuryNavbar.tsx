'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, User, Heart, ShoppingBag, Menu, X,
  Globe, ArrowRight, Sparkles, Tag, TrendingUp, Truck, Zap,
  Package, LogOut, LayoutDashboard, Video, MessageCircle
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useDebounce } from '@/lib/hooks/useDebounce';
import LanguageCurrencySelector from './LanguageCurrencySelector';
import SearchDropdown from './SearchDropdown';
import CartDrawer from './CartDrawer';
import NotificationBell from './NotificationBell';
import { Suspense } from 'react';

function SearchParamsHandler({ setSearchQuery, pathname }: { setSearchQuery: (q: string) => void, pathname: string }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === '/search') {
      const q = searchParams.get('q');
      setSearchQuery(q ?? '');
    }
  }, [pathname, searchParams, setSearchQuery]);

  return null;
}

export default function LuxuryNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated: isLoggedIn, isAdmin, logout } = useAuth();

  const userEmail = user?.email || user?.phone || '';
  const { language, currency, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<{ id: string; name: string; price: number; image?: string | null; category?: string }[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [wishlistBump, setWishlistBump] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  useEffect(() => {
    const q = debouncedSearchQuery.trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    setIsLoadingSearch(true);
    fetch(`/api/products?q=${encodeURIComponent(q)}&limit=8`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setSearchResults(data.products || []);
      })
      .catch(() => {
        if (!cancelled) setSearchResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSearch(false);
      });
    return () => { cancelled = true; };
  }, [debouncedSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      setMobileMenuOpen(false);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
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

  // Mobile navigation bottom bar items
  const mobileNavItems = [
    { name: t('nav', 'home'), href: '/', icon: Sparkles },
    { name: t('nav', 'search'), href: '/search', icon: Search },
    { name: t('nav', 'cart'), href: '/cart', icon: ShoppingBag, count: cartItemsCount },
    { name: t('nav', 'profile'), href: isLoggedIn ? '/orders' : '/sign-in', icon: User },
  ];

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler setSearchQuery={setSearchQuery} pathname={pathname} />
      </Suspense>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-orange-100/50 shadow-lg shadow-orange-50/50'
          : 'bg-white/70 backdrop-blur-md border-b border-gray-100/30'
          }`}
        style={{
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'blur(16px) saturate(150%)',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className={`relative flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16 lg:h-18' : 'h-20 lg:h-24'
              }`}>

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

              <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] lg:max-w-[600px] z-20">
                <form onSubmit={handleSearch} className="relative w-full">
                  <motion.div
                    className={`relative w-full group rounded-full transition-all duration-300 ${searchFocused
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
                        <Search className={`w-5 h-5 transition-colors duration-300 ${searchFocused ? 'text-[#FF5000]' : 'text-gray-400 group-hover:text-[#FF5000]'
                          }`} strokeWidth={1.5} />
                      </motion.div>

                      <input
                        type="text"
                        placeholder={t('nav', 'search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                        className="flex-1 px-4 py-3 bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
                        autoComplete="off"
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
                        aria-label={t('nav', 'search')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          const trimmed = searchQuery.trim();
                          if (trimmed) {
                            e.preventDefault();
                            setMobileMenuOpen(false);
                            router.push(`/search?q=${encodeURIComponent(trimmed)}`);
                          }
                        }}
                        className={`mr-1.5 p-2 rounded-full transition-all duration-300 ${searchFocused || searchQuery
                          ? 'bg-[#FF5000] text-white shadow-lg shadow-orange-500/30'
                          : 'bg-gray-100 text-gray-400 group-hover:bg-[#FF5000] group-hover:text-white group-hover:shadow-md'
                          }`}
                      >
                        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                      </motion.button>
                    </div>
                  </motion.div>
                </form>
                <SearchDropdown
                  results={searchResults}
                  isVisible={searchFocused && searchQuery.trim().length > 0}
                  onClose={() => setSearchFocused(false)}
                  onMouseDown={() => { }}
                  isLoading={isLoadingSearch}
                />
              </div>

              <motion.div
                animate={{ scale: scrolled ? 0.9 : 1 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center gap-2 lg:gap-4"
              >
                <div className="hidden lg:block">
                  <LanguageCurrencySelector />
                </div>

                {/* Video Call Link */}
                {isLoggedIn && (
                  <>
                    <Link href="/messages" className="hidden sm:flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                      <MessageCircle className="w-5 h-5 text-gray-600 group-hover:text-orange-500" strokeWidth={1.2} />
                    </Link>
                    <Link href="/video-call" className="hidden sm:flex items-center gap-1 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                      <Video className="w-5 h-5 text-gray-600 group-hover:text-orange-500" strokeWidth={1.2} />
                    </Link>
                  </>
                )}

                <div className="relative" ref={userMenuRef}>
                  {isLoggedIn ? (
                    <>
                      <motion.button
                        type="button"
                        onClick={() => setUserMenuOpen((o) => !o)}
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-gray-200"
                      >
                        {user?.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="text-orange-500 font-bold text-xs">{
                              (user?.name?.[0] || user?.phone?.[0] || 'U').toUpperCase()
                            }</span>
                          </div>
                        )}
                        <span className="hidden sm:inline text-sm font-medium text-gray-700 group-hover:text-orange-500 max-w-[120px] truncate">
                          {user?.name || user?.phone || t('nav', 'profile')}
                        </span>
                      </motion.button>
                      <AnimatePresence>
                        {userMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden z-50"
                          >
                            <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{t('nav', 'email')}</p>
                              <p className="text-sm text-gray-900 truncate mt-0.5">
                                {userEmail || '—'}
                              </p>
                              {isAdmin && (
                                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-medium">{t('nav', 'admin')}</span>
                              )}
                            </div>
                            <div className="py-1">
                              <Link
                                href="/orders"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                              >
                                <Package className="w-4 h-4 text-gray-500" strokeWidth={1.2} />
                                {t('nav', 'myOrders')}
                              </Link>
                              <Link
                                href="/video-call"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                              >
                                <Video className="w-4 h-4 text-gray-500" strokeWidth={1.2} />
                                {t('nav', 'videoCall')}
                              </Link>
                              <Link
                                href="/messages"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                              >
                                <MessageCircle className="w-4 h-4 text-gray-500" strokeWidth={1.2} />
                                {t('nav', 'messages')}
                              </Link>
                              {isAdmin && (
                                <Link
                                  href="/admin"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                                >
                                  <LayoutDashboard className="w-4 h-4 text-gray-500" strokeWidth={1.2} />
                                  {t('nav', 'adminPanel')}
                                </Link>
                              )}
                              <button
                                type="button"
                                onClick={handleSignOut}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                              >
                                <LogOut className="w-4 h-4 text-gray-500" strokeWidth={1.2} />
                                {t('nav', 'signOut')}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link href="/sign-in" className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                      <User className="w-5 h-5 text-gray-600 group-hover:text-orange-500" strokeWidth={1.2} />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-orange-500">{t('nav', 'signIn')}</span>
                    </Link>
                  )}
                </div>

                <NotificationBell />

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

                <motion.button
                  type="button"
                  onClick={() => setCartDrawerOpen(true)}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                  aria-label="Сагс нээх"
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
                        className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full pointer-events-none"
                      />
                    </>
                  )}
                </motion.button>
                <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
              </motion.div>
            </div>
          </div>

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
                        <div className={`flex items-center gap-2 transition-all duration-300 ${isActive
                          ? 'text-orange-600 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]'
                          : 'text-gray-600 hover:text-orange-500 hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.2)]'
                          }`}>
                          <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-orange-600' : 'group-hover:text-orange-500'
                            }`} strokeWidth={1.2} />
                          <span className="text-sm font-semibold tracking-tight">
                            {category.name}
                          </span>
                        </div>

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

      <div className={scrolled ? 'h-[80px] lg:h-[96px]' : 'h-[96px] lg:h-[112px]'} />

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
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-white to-orange-50/20">
                <h2 className="text-lg font-bold text-gray-900">{t('nav', 'menu')}</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" strokeWidth={1.2} />
                </button>
              </div>

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

              <div className="px-6 py-4 border-b border-gray-100 space-y-1">
                {isLoggedIn ? (
                  <>
                    <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700">
                      <Package className="w-5 h-5 text-gray-500" strokeWidth={1.2} />
                      <span className="font-semibold">{t('nav', 'myOrders')}</span>
                    </Link>
                    <Link href="/video-call" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700">
                      <Video className="w-5 h-5 text-gray-500" strokeWidth={1.2} />
                      <span className="font-semibold">{t('nav', 'videoCall')}</span>
                    </Link>
                    <Link href="/messages" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700">
                      <MessageCircle className="w-5 h-5 text-gray-500" strokeWidth={1.2} />
                      <span className="font-semibold">{t('nav', 'messages')}</span>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 text-gray-700">
                        <LayoutDashboard className="w-5 h-5 text-gray-500" strokeWidth={1.2} />
                        <span className="font-semibold">{t('nav', 'adminPanel')}</span>
                      </Link>
                    )}
                    <button type="button" onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600">
                      <LogOut className="w-5 h-5" strokeWidth={1.2} />
                      <span className="font-semibold">{t('nav', 'signOut')}</span>
                    </button>
                  </>
                ) : (
                  <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500 text-white font-semibold">
                    <User className="w-5 h-5" strokeWidth={1.2} />
                    {t('nav', 'signIn')}
                  </Link>
                )}
              </div>

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
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${isActive
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

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe">
        <div className="flex justify-around items-center px-2 py-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center w-full py-1"
                onClick={(e) => {
                  if (item.name === t('nav', 'cart')) {
                    e.preventDefault();
                    setCartDrawerOpen(true);
                  }
                }}
              >
                <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-400'
                  }`}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 1.5 : 1.2} />
                  {mounted && item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-orange-600' : 'text-gray-400'
                  }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="relative flex flex-col items-center justify-center w-full py-1"
          >
            <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${mobileMenuOpen ? 'bg-orange-50 text-orange-600' : 'text-gray-400'
              }`}>
              <Menu className="w-6 h-6" strokeWidth={mobileMenuOpen ? 1.5 : 1.2} />
            </div>
            <span className={`text-[10px] font-medium mt-0.5 ${mobileMenuOpen ? 'text-orange-600' : 'text-gray-400'
              }`}>
              Menu
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
