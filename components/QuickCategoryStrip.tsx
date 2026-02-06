'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Laptop,
  Shirt,
  Gamepad2,
  Sparkles,
  Book,
  Heart,
  DumbbellIcon as Dumbbell,
  Baby,
  Watch,
  Package,
  Plane,
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'Бүгд', icon: Home, color: 'text-soyol' },
  { id: 'tech', name: 'Техник', icon: Laptop, color: 'text-blue-600' },
  { id: 'fashion', name: 'Хувцас', icon: Shirt, color: 'text-pink-600' },
  { id: 'gaming', name: 'Тоглоом', icon: Gamepad2, color: 'text-purple-600' },
  { id: 'beauty', name: 'Гоо сайхан', icon: Sparkles, color: 'text-rose-600' },
  { id: 'books', name: 'Ном', icon: Book, color: 'text-amber-600' },
  { id: 'pets', name: 'Гэрийн тэжээвэр', icon: Heart, color: 'text-red-600' },
  { id: 'sports', name: 'Спорт', icon: Dumbbell, color: 'text-green-600' },
  { id: 'baby', name: 'Хүүхдийн', icon: Baby, color: 'text-cyan-600' },
  { id: 'watches', name: 'Цаг', icon: Watch, color: 'text-gray-700' },
];

const stockFilters = [
  { id: 'in-stock', name: 'Бэлэн бараа', icon: Package, color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-200' },
  { id: 'pre-order', name: 'Захиалгаар', icon: Plane, color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-200' },
];

interface QuickCategoryStripProps {
  onStockFilterChange?: (filter: 'all' | 'in-stock' | 'pre-order') => void;
}

export default function QuickCategoryStrip({ onStockFilterChange }: QuickCategoryStripProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'in-stock' | 'pre-order'>('all');

  const handleFilterChange = (filterId: 'all' | 'in-stock' | 'pre-order') => {
    setActiveFilter(filterId);
    onStockFilterChange?.(filterId);
  };

  return (
    <section 
      data-category-strip
      className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Horizontal Scroll Container */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Category Buttons */}
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all ${
                    category.id === 'all' && activeFilter === 'all' ? 'bg-soyol/5 ring-1 ring-soyol/20' : ''
                  }`}
                  onClick={() => handleFilterChange('all')}
                >
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br ${
                      category.id === 'all' && activeFilter === 'all'
                        ? 'from-soyol/10 to-soyol/5'
                        : 'from-gray-100 to-gray-50'
                    } group-hover:scale-110 transition-transform`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        category.id === 'all' && activeFilter === 'all' ? 'text-soyol' : category.color
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-bold whitespace-nowrap ${
                      category.id === 'all' && activeFilter === 'all' ? 'text-soyol' : 'text-gray-700'
                    }`}
                  >
                    {category.name}
                  </span>
                </motion.button>
              );
            })}

            {/* Divider */}
            <div className="flex-shrink-0 w-px h-16 bg-gray-200 mx-2" />

            {/* Stock Filter Buttons */}
            {stockFilters.map((filter, index) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <motion.button
                  key={filter.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: (categories.length + index) * 0.05,
                  }}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange(filter.id as 'in-stock' | 'pre-order')}
                  className={`group flex-shrink-0 flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? `${filter.bg} ring-1 ${filter.ring}`
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl bg-gradient-to-br transition-transform ${
                      isActive
                        ? `${filter.bg}`
                        : 'from-gray-100 to-gray-50'
                    } group-hover:scale-110`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? filter.color : 'text-gray-600'}`}
                    />
                  </div>
                  <span
                    className={`text-xs font-bold whitespace-nowrap ${
                      isActive ? filter.color : 'text-gray-700'
                    }`}
                  >
                    {filter.name}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Fade Gradients (left/right) */}
          <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
