'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import DiscoveryProductCard from './DiscoveryProductCard';
import type { Product } from '@models/Product';

interface ProductSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  products: Product[];
  icon?: string;
  viewAllLink?: string;
}

export default function ProductSection({
  id,
  title,
  subtitle,
  products,
  icon,
  viewAllLink = '/categories',
}: ProductSectionProps) {
  return (
    <section id={id} className="relative py-16 bg-white scroll-mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-3 mb-3"
            >
              {icon && <span className="text-3xl">{icon}</span>}
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
                {title}
              </h2>
            </motion.div>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg text-gray-600 font-light"
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* View All Link */}
          <motion.a
            href={viewAllLink}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ x: 5 }}
            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-soyol hover:text-white text-gray-900 font-bold rounded-xl transition-all group"
          >
            <span>Бүгдийг үзэх</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product, index) => (
            <DiscoveryProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:hidden text-center"
        >
          <motion.a
            href={viewAllLink}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg"
          >
            <span>Бүгдийг үзэх</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
