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
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
        >
            <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw"
                            className="object-cover transition-transform duration-500 group-active:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                            <span className="text-[10px]">No Image</span>
                        </div>
                    )}

                    {/* Stock Badge */}
                    {product.stockStatus === 'in-stock' && product.inventory !== undefined && product.inventory < 10 && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-red-500 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                            {product.inventory} үлдсэн
                        </div>
                    )}
                    
                    {product.stockStatus === 'pre-order' && (
                        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-gray-800 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                            Захиалгаар
                        </div>
                    )}
                </div>

                <div className="p-3">
                    <h3 className="text-xs font-bold text-gray-800 line-clamp-2 min-h-[32px] leading-tight mb-1.5">
                        {product.name}
                    </h3>

                    <div className="flex items-center justify-between items-end gap-1">
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-[#FF5000]">
                                {formattedPrice}
                            </span>
                            <div className="flex items-center gap-0.5 mt-0.5">
                                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                <span className="text-[10px] font-bold text-gray-500">4.8</span>
                            </div>
                        </div>

                        <button
                            className="p-2 bg-orange-50 text-orange-600 rounded-lg active:bg-orange-500 active:text-white transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                // Add to cart logic
                            }}
                        >
                            <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
