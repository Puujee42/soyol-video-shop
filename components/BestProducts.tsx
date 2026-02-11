'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Star,
    Tag,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const AUTOPLAY_DURATION = 6000;

interface Product {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    category: string;
    stockStatus?: string;
    description?: string | null;
}

interface BestProductsProps {
    products: Product[];
}

export default function BestProducts({ products }: BestProductsProps) {
    const { formatPrice } = useLanguage();
    const [slideIndex, setSlideIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    if (!products || products.length === 0) return null;

    const featuredProducts = products.slice(0, 5);
    const activeProduct = featuredProducts[slideIndex];

    // --- AUTOPLAY LOGIC ---
    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setDirection(1);
            setSlideIndex((prev) => (prev + 1) % featuredProducts.length);
        }, AUTOPLAY_DURATION);

        return () => resetTimeout();
    }, [slideIndex, featuredProducts.length]);

    // --- NAVIGATION HANDLERS ---
    const paginate = (newDirection: number) => {
        resetTimeout();
        setDirection(newDirection);
        setSlideIndex((prev) => {
            let nextIndex = prev + newDirection;
            if (nextIndex < 0) nextIndex = featuredProducts.length - 1;
            if (nextIndex >= featuredProducts.length) nextIndex = 0;
            return nextIndex;
        });
    };

    // Calculate mock discount
    const fakeOldPrice = activeProduct.price * 1.2;
    const discount = Math.round(((fakeOldPrice - activeProduct.price) / fakeOldPrice) * 100);

    return (
        <section className="relative w-full max-w-[1500px] mx-auto mb-12 mt-4">
            {/* Main Slider Container */}
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full bg-gray-100 overflow-hidden shadow-lg sm:rounded-md group">

                <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                    <motion.div
                        key={slideIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        className="absolute inset-0 w-full h-full flex"
                    >
                        {/* BACKGROUND IMAGE LAYER */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={activeProduct.image || '/placeholder.png'}
                                alt={activeProduct.name}
                                fill
                                className="object-cover object-center lg:object-right" // Position image to right
                                priority
                                sizes="100vw"
                            />
                        </div>

                        {/* AMAZON-STYLE GRADIENT MASK 
                            This fades from solid white (left) to transparent (right)
                            allowing text to be readable over any image.
                        */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-100/90 to-transparent sm:via-gray-100/60 z-10 w-[90%] sm:w-[70%] lg:w-[50%]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-transparent to-transparent z-10 lg:hidden" />

                        {/* CONTENT LAYER */}
                        <div className="relative z-20 container mx-auto px-6 sm:px-12 h-full flex flex-col justify-center max-w-[1400px]">
                            <div className="max-w-xl text-neutral-800 pt-12 sm:pt-0">

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-2 mb-4"
                                >
                                    {/* Category Tag */}
                                    <span className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                                        {activeProduct.category}
                                    </span>
                                </motion.div>

                                {/* Product Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4 text-neutral-900 tracking-tight"
                                >
                                    {activeProduct.name}
                                </motion.h2>

                                {/* Price Block */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-baseline gap-3 mb-6"
                                >
                                    <div className="flex items-start text-red-600 font-medium">
                                        <span className="text-lg mt-1">-</span>
                                        <span className="text-3xl font-bold">{discount}%</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs text-neutral-500 align-top relative -top-3">
                                            ₮
                                        </span>
                                        <span className="text-5xl font-medium text-neutral-900">
                                            {activeProduct.price.toLocaleString()}
                                        </span>
                                    </div>
                                    <span className="text-neutral-400 text-lg line-through decoration-1 ml-2">
                                        {formatPrice(fakeOldPrice)}
                                    </span>
                                </motion.div>

                                {/* Rating */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-center gap-2 mb-8"
                                >
                                    <div className="flex text-yellow-500">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className="w-4 h-4 fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-blue-600 text-sm hover:underline cursor-pointer">
                                        24,591 ratings
                                    </span>
                                </motion.div>

                                {/* CTA Button - Yellow/Orange style typical of Amazon/Retail */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Link href={`/product/${activeProduct.id}`}>
                                        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full shadow-sm transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                                            Shop now
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* --- NAVIGATION ARROWS (The "Amazon" Look) --- */}
                {/* Left Arrow */}
                <button
                    onClick={() => paginate(-1)}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-5 rounded-md border-2 border-transparent focus:border-white focus:outline-none hover:bg-white/30 backdrop-blur-sm transition-all"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-600 sm:text-neutral-800 drop-shadow-sm" />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={() => paginate(1)}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-5 rounded-md border-2 border-transparent focus:border-white focus:outline-none hover:bg-white/30 backdrop-blur-sm transition-all"
                    aria-label="Next Slide"
                >
                    <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-600 sm:text-neutral-800 drop-shadow-sm" />
                </button>

                {/* Simple Dots Indicator (Bottom Center) */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {featuredProducts.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > slideIndex ? 1 : -1);
                                setSlideIndex(index);
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-colors border border-neutral-400 ${index === slideIndex ? 'bg-neutral-800' : 'bg-transparent'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ────────────────────── Slide Animation Variants ────────────────────── */
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        zIndex: 0
    }),
    center: {
        x: 0,
        opacity: 1,
        zIndex: 1
    },
    exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        zIndex: 0
    })
};