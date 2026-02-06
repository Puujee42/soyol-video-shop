'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { name: 'Нүүр хуудас', href: '/' },
  { name: 'Онцлох', href: '/deals' },
  { name: 'Бэлэн бараа', href: '/ready-to-ship' },
  { name: 'Захиалгаар', href: '/pre-order' },
];

const supportLinks = [
  { name: 'Хүргэлтийн нөхцөл', href: '/shipping' },
  { name: 'Тусламж', href: '/support' },
  { name: 'Захиалга хянах', href: '/track-order' },
  { name: 'Түгээмэл асуулт хариулт', href: '/faq' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/SoyolVideoShop', label: 'Facebook', color: 'hover:text-blue-500' },
  { icon: Instagram, href: 'https://www.instagram.com/soyol_video_shop_77181818', label: 'Instagram', color: 'hover:text-pink-500' },
  { icon: MessageCircle, href: 'https://wa.me/97677181818', label: 'WhatsApp', color: 'hover:text-green-500' },
];

const paymentMethods = [
  { name: 'QPay', logo: '💳' },
  { name: 'Khan Bank', logo: '🏦' },
  { name: 'Most Money', logo: '💰' },
  { name: 'Visa', logo: '💳' },
];

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <Link href="/" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <img
                  src="/soyol-logo.png"
                  alt="Soyol Video Shop"
                  className="h-12 w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </motion.div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Soyol Video Shop - Таны хүссэн барааг хамгийн хурднаар.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2.5 bg-gray-800 rounded-lg text-gray-400 transition-colors ${social.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-black text-white mb-4">Шуурхай холбоос</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-soyol transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-black text-white mb-4">Тусламж</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-soyol transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-black text-white mb-4">Холбоо барих</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-soyol flex-shrink-0 mt-0.5" />
                <span>Ундрам плаза<br />Unic office 5 давхар 501 тоот<br />Улаанбаатар, Монгол Улс</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-soyol flex-shrink-0" />
                <a href="tel:77181818" className="hover:text-soyol transition-colors">
                  77 18 18 18
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <span className="text-soyol font-bold">🚚 Хүргэлт:</span>
                <span className="text-gray-400">5,000₮</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-3">Төлбөрийн хэрэгсэл:</p>
              <div className="flex items-center gap-4 flex-wrap">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.name}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700"
                  >
                    <span className="text-lg">{method.logo}</span>
                    <span className="text-xs font-bold text-gray-400">{method.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Trust Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-xs font-bold text-gray-400">Найдвартай дэлгүүр</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 text-center sm:text-left">
              © 2026 Soyol Video Shop. Бүх эрх хуулиар хамгаалагдсан.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <Link href="/terms" className="hover:text-soyol transition-colors">
                Үйлчилгээний нөхцөл
              </Link>
              <Link href="/privacy" className="hover:text-soyol transition-colors">
                Нууцлалын бодлого
              </Link>
              <Link href="/cookies" className="hover:text-soyol transition-colors">
                Cookie
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Accent Line */}
      <div className="h-1 bg-gradient-to-r from-soyol via-soyol-dark to-soyol" />
    </footer>
  );
}
