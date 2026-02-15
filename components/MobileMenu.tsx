'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Search, User, ShoppingBag, X, Globe,
    Sparkles, Tag, TrendingUp, Truck, Zap,
    Package, LogOut, LayoutDashboard, Video, MessageCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthenticated: isLoggedIn, isAdmin, logout } = useAuth();
    const { language, setLanguage } = useLanguage();
    const { t } = useTranslation();

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            onClose();
            router.push(`/search?q=${encodeURIComponent(trimmed)}`);
        }
    };

    const handleSignOut = async () => {
        onClose();
        await logout();
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
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
                    />
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-sm bg-white shadow-2xl lg:hidden flex flex-col"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-white to-orange-50/20">
                            <h2 className="text-lg font-bold text-gray-900">{t('nav', 'menu')}</h2>
                            <button
                                onClick={onClose}
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
                                    <Link href="/orders" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700">
                                        <Package className="w-5 h-5 text-gray-500" strokeWidth={1.2} />
                                        <span className="font-semibold">{t('nav', 'myOrders')}</span>
                                    </Link>
                                    <Link href="/video-call" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700">
                                        <Video className="w-5 h-5 text-gray-500" strokeWidth={1.2} />
                                        <span className="font-semibold">{t('nav', 'videoCall')}</span>
                                    </Link>
                                    <Link href="/messages" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700">
                                        <MessageCircle className="w-5 h-5 text-gray-500" strokeWidth={1.2} />
                                        <span className="font-semibold">{t('nav', 'messages')}</span>
                                    </Link>
                                    {isAdmin && (
                                        <Link href="/admin" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-amber-50 text-gray-700">
                                            <LayoutDashboard className="w-5 h-5 text-gray-500" strokeWidth={1.2} />
                                            <span className="font-semibold">{t('nav', 'adminPanel')}</span>
                                        </Link>
                                    )}
                                    <button type="button" onClick={handleSignOut} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600">
                                        <LogOut className="w-5 h-5" strokeWidth={1.2} />
                                        <span className="font-semibold">{t('nav', 'signOut')}</span>
                                    </button>
                                </>
                            ) : (
                                <Link href="/sign-in" onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500 text-white font-semibold">
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
                                                onClick={onClose}
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
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
