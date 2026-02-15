'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { type ApiProduct } from '@/lib/hooks/useProducts';
import { useLanguage } from '@/context/LanguageContext';

interface MobileProductCardProps {
    product: ApiProduct;
}

export default function MobileProductCard({ product }: MobileProductCardProps) {
    const { convertPrice, currency } = useLanguage();
    const price = convertPrice(product.price);

    // Format price
    const formattedPrice = currency === 'USD'
        ? `$${price.toLocaleString()}`
        : `${price.toLocaleString()}₮`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(249,115,22,0.1)] transition-all duration-300"
        >
            <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                            <span className="text-xs">No Image</span>
                        </div>
                    )}

                    {/* Quick Add Button */}
                    <button
                        className="absolute bottom-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-md text-orange-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                        onClick={(e) => {
                            e.preventDefault();
                            // Add to cart logic would go here
                        }}
                    >
                        <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                </div>

                <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] leading-snug">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mt-1 mb-2">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium text-gray-500">4.8</span>
                        <span className="text-[10px] text-gray-400">(120)</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-gray-900">
                            {formattedPrice}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
