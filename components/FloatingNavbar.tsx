'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, 
  Package, Plane, Flame, Truck, MessageCircle, Send 
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import Link from 'next/link';

const productsDropdown = [
  { name: 'Бэлэн бараа', href: '#ready-stock', icon: Package, description: 'Шууд хүргэлт' },
  { name: 'Захиалгаар', href: '#pre-order', icon: Plane, description: '7-14 хоног' },
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
  const [activeLink, setActiveLink] = useState('Бараа');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
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

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const navbar = document.querySelector('nav');
        const navbarHeight = navbar?.clientHeight || 80;
        const categoryStrip = document.querySelector('[data-category-strip]');
        const categoryStripHeight = categoryStrip?.clientHeight || 0;
        const offset = navbarHeight + categoryStripHeight + 20;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      setIsProductsDropdownOpen(false);
    }
  };

  return (
    <>
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-[50] bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'min-h-[72px]' : 'min-h-[88px]'}`}>
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
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

            {/* Desktop Main Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Products Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsProductsDropdownOpen(true)}
                onMouseLeave={() => setIsProductsDropdownOpen(false)}
              >
                <motion.button
                  onClick={() => setActiveLink('Бараа')}
                  className={`relative px-4 py-2 text-sm font-bold transition-colors flex items-center gap-1 rounded-lg ${
                    activeLink === 'Бараа' 
                      ? 'bg-soyol text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Бараа</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Products Dropdown Menu */}
                <AnimatePresence>
                  {isProductsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                    >
                      {productsDropdown.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.a
                            key={item.name}
                            href={item.href}
                            onClick={(e) => handleSmoothScroll(e, item.href)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-soyol/5 transition-colors group"
                          >
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-soyol/10 transition-colors">
                              <Icon className="w-5 h-5 text-gray-600 group-hover:text-soyol transition-colors" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-soyol transition-colors">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.description}
                              </p>
                            </div>
                          </motion.a>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hot Deals (Онцлох) */}
              <Link href="/deals">
                <motion.button
                  onClick={() => setActiveLink('Онцлох')}
                  className={`relative px-4 py-2 text-sm font-bold transition-colors flex items-center gap-1.5 rounded-lg ${
                    activeLink === 'Онцлох' 
                      ? 'bg-soyol text-white' 
                      : 'text-soyol hover:bg-soyol/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Flame className="w-4 h-4" />
                  <span>Онцлох</span>
                </motion.button>
              </Link>
            </div>

            {/* Right Side - Utility Links & Actions */}
            <div className="flex items-center space-x-2">
              {/* Shipping Info (Desktop) */}
              <motion.button
                onClick={() => setIsShippingModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Truck className="w-4 h-4" />
                <span>Хүргэлт</span>
              </motion.button>

              {/* Track Order (Desktop) */}
              <Link href="/track">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Захиалга хянах</span>
                </motion.button>
              </Link>

              {/* Support Dropdown (Desktop) */}
              <div 
                className="hidden lg:block relative"
                onMouseEnter={() => setIsSupportDropdownOpen(true)}
                onMouseLeave={() => setIsSupportDropdownOpen(false)}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Тусламж</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isSupportDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Support Dropdown Menu */}
                <AnimatePresence>
                  {isSupportDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
                    >
                      {supportDropdown.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.a
                            key={item.name}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                              <Icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                              {item.name}
                            </p>
                          </motion.a>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-6 bg-gray-200" />

              {/* Search Bar */}
              <motion.div
                animate={{ width: isSearchExpanded ? 240 : 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden md:flex items-center bg-gray-100/70 rounded-full overflow-hidden"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="w-10 h-10 flex items-center justify-center text-gray-700"
                  onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                >
                  <Search className="w-5 h-5" />
                </motion.button>
                <AnimatePresence>
                  {isSearchExpanded && (
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      type="text"
                      placeholder="Хайх..."
                      className="flex-1 bg-transparent outline-none text-sm font-medium text-gray-900 placeholder-gray-500 pr-4"
                      autoFocus
                      onBlur={() => setIsSearchExpanded(false)}
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Wishlist Icon */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-soyol/10 transition-colors group"
              >
                <Heart className="w-5 h-5 text-gray-700 group-hover:text-soyol transition-colors" />
              </motion.button>

              {/* User Icon */}
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-soyol/10 transition-colors group"
              >
                <User className="w-5 h-5 text-gray-700 group-hover:text-soyol transition-colors" />
              </motion.button>

              {/* Cart Icon with Badge */}
              <Link href="/cart">
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-soyol/10 transition-colors group"
                >
                  <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-soyol transition-colors" />
                  {cartItemsCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-soyol rounded-full flex items-center justify-center shadow-lg shadow-soyol/50"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-xs font-bold text-white"
                      >
                        {cartItemsCount}
                      </motion.span>
                      <motion.div
                        className="absolute inset-0 bg-soyol rounded-full"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </motion.button>
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100/70 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Menu className="w-5 h-5 text-gray-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Shipping Info Modal */}
      <AnimatePresence>
        {isShippingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsShippingModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-soyol/10 rounded-full mb-4">
                  <Truck className="w-8 h-8 text-soyol" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Хүргэлтийн мэдээлэл</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-2xl">
                  <Package className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Бэлэн бараа</p>
                    <p className="text-sm text-gray-600">24 цагийн дотор хүргэнэ</p>
                    <p className="text-xs text-green-700 font-bold mt-1">Хүргэлт: 5,000₮</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl">
                  <Plane className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Захиалгаар</p>
                    <p className="text-sm text-gray-600">7-14 хоногийн дотор хүргэнэ</p>
                    <p className="text-xs text-orange-700 font-bold mt-1">Хүргэлт: 5,000₮</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    📍 Ундрам плаза, Unic office 5 давхар 501 тоот
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsShippingModalOpen(false)}
                className="w-full mt-6 px-6 py-3 bg-soyol text-white font-bold rounded-xl hover:bg-soyol-dark transition-colors"
              >
                Ойлголоо
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Full-Screen Menu */}
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
              className="absolute inset-0 bg-white/90"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative h-full flex flex-col items-center justify-center space-y-6 px-8"
            >
              {/* Products Links */}
              {productsDropdown.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      handleSmoothScroll(e, item.href);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, x: 10 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-3xl font-black text-gray-900 hover:text-soyol transition-all"
                    >
                      {item.name}
                    </motion.button>
                  </a>
                </motion.div>
              ))}

              {/* Hot Deals */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: 0.2 }}
              >
                <Link href="/deals">
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-3xl font-black text-soyol flex items-center gap-2"
                  >
                    <Flame className="w-8 h-8" />
                    Онцлох
                  </motion.button>
                </Link>
              </motion.div>

              {/* Divider */}
              <div className="w-32 h-px bg-gray-300" />

              {/* Utility Links */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.button
                  onClick={() => {
                    setIsShippingModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 text-lg font-bold text-gray-700"
                >
                  <Truck className="w-5 h-5" />
                  Хүргэлт
                </motion.button>

                <Link href="/track">
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2 text-lg font-bold text-gray-700"
                  >
                    <Package className="w-5 h-5" />
                    Захиалга хянах
                  </motion.button>
                </Link>

                {supportDropdown.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 text-lg font-bold text-gray-700"
                    >
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      {item.name}
                    </motion.a>
                  );
                })}
              </motion.div>

              {/* Icons */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-6 pt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-4 bg-gray-100 rounded-2xl text-gray-900 hover:bg-soyol hover:text-white transition-colors"
                >
                  <Search className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-4 bg-gray-100 rounded-2xl text-gray-900 hover:bg-soyol hover:text-white transition-colors"
                >
                  <Heart className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-4 bg-gray-100 rounded-2xl text-gray-900 hover:bg-soyol hover:text-white transition-colors"
                >
                  <User className="w-6 h-6" />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
