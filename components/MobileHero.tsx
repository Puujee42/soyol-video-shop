'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MobileHero() {
    return (
        <section className="relative w-full overflow-hidden bg-gray-50 lg:hidden mb-8">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50/50 z-0" />

            <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-to-bl from-orange-100/40 to-transparent rounded-bl-[100px] pointer-events-none z-0" />

            {/* Main Container - Flex Column Layout as requested */}
            <div className="relative z-10 flex flex-col px-4 pt-8 pb-10">

                {/* Text Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-start w-full mb-6"
                >
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-orange-600 uppercase bg-orange-100/80 backdrop-blur-sm rounded-full">
                            ШИНЭ ЦУГЛУУЛГА
                        </span>
                        <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-orange-600 uppercase bg-orange-100/80 backdrop-blur-sm rounded-full">
                            Хүргэлт
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 leading-[1.2] mb-3">
                        Хүссэн бараагаа <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                            хүргүүлээд аваарай
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[280px]">
                        Таны арьсыг төрөлхийн мэт гэрэлтүүлэх дээд зэрэглэлийн арьс арчилгааны багцыг сонирхоорой.
                    </p>
                </motion.div>

                {/* Product Image Area - Stacked, not absolute over content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/40"
                >
                    <Image
                        src="https://res.cloudinary.com/dc127wztz/image/upload/w_1000,c_scale,q_auto,f_auto/v1770896452/banner1_nw6nok.png"
                        alt="Radiant Beauty Collection"
                        fill
                        className="object-cover object-center"
                        priority
                    />

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg border border-white/50 z-20">
                        <span className="text-xs font-bold text-gray-900">-20% хямдрал</span>
                    </div>
                </motion.div>

                {/* CTA Button - Full width with margin top */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 group relative px-8 py-4 bg-gray-900 text-white text-base font-bold rounded-full overflow-hidden shadow-xl shadow-orange-500/20"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Худалдан авах
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                </motion.button>
            </div>
        </section>
    );
}
