'use client';

import { Search, ShoppingBag, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MobileHeader() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
        >
            <div className="flex flex-col px-4 py-3 gap-3">
                {/* Top Row: Logo (Left) - Icons (Right) */}
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        {/* You can add a logo image here if available, using text for now as per prompt "Brand logo" */}
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                            S
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">SOYOL</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link href="/cart" className="relative p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                            <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border border-white shadow-sm" />
                        </Link>
                        <button className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                            <Menu className="w-6 h-6" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Second Row: Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Хайх..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 text-gray-900 rounded-xl border-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all text-sm font-medium"
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
            </div>
        </motion.header>
    );
}
