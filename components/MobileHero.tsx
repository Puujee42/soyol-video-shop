'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const banners = [
  'https://res.cloudinary.com/dc127wztz/image/upload/w_1000,c_scale,q_auto,f_auto/v1770896452/banner1_nw6nok.png',
  'https://res.cloudinary.com/dc127wztz/image/upload/w_1000,c_scale,q_auto,f_auto/v1770896152/banner_qhjffv.png',
];

export default function MobileHero() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <section className="relative w-full overflow-hidden bg-white lg:hidden">
            <div className="relative aspect-[4/5] w-full">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={banners[currentIndex]}
                            alt={`Banner ${currentIndex + 1}`}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                    </motion.div>
                </AnimatePresence>

                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1 rounded-full transition-all duration-300 ${
                                index === currentIndex ? 'w-6 bg-[#FF5000]' : 'w-2 bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Actions / Categories for Mobile */}
            <div className="flex justify-between items-center px-4 py-6 bg-white overflow-x-auto gap-4 scrollbar-hide">
                {[
                    { name: 'Шинэ', icon: '🔥', href: '/new-arrivals' },
                    { name: 'Бэлэн', icon: '📦', href: '/ready-to-ship' },
                    { name: 'Захиалга', icon: '🌍', href: '/pre-order' },
                    { name: 'Хямдрал', icon: '🏷️', href: '/sale' },
                ].map((item) => (
                    <motion.a
                        key={item.name}
                        href={item.href}
                        whileTap={{ scale: 0.9 }}
                        className="flex flex-col items-center gap-2 min-w-[70px]"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl shadow-sm border border-orange-100">
                            {item.icon}
                        </div>
                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tighter">
                            {item.name}
                        </span>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
