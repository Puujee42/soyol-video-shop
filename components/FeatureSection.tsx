'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Truck, Award, Shield, Headphones } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Шууд хүргэлт',
    description: 'Бэлэн байгаа бараанд',
    delay: 0,
  },
  {
    icon: Award,
    title: 'Чанартай загварууд',
    description: 'Сонгогдсон цуглуулга',
    delay: 0.1,
  },
  {
    icon: Shield,
    title: 'Найдвартай төлбөр',
    description: 'Дансаар болон Картаар',
    delay: 0.2,
  },
  {
    icon: Headphones,
    title: 'Тусламж',
    description: '24/7 зөвлөгөө',
    delay: 0.3,
  },
];

const FeatureSection = memo(function FeatureSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="relative py-10 sm:py-16 md:py-20 bg-slate-50 border-y border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white border border-slate-100 mb-3 sm:mb-4">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF8C00]" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-0.5 sm:mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
});

export default FeatureSection;
