'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Store,
  Package,
  ShoppingBag,
  DollarSign,
  Star,
  TrendingUp,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Settings,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react';
import type { VendorStats } from '@/types/marketplace';
import { formatPrice } from '@/lib/utils';

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<VendorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      // Check if user is a vendor
      if (session?.user?.role !== 'VENDOR') {
        router.push('/');
        return;
      }

      fetchVendorStats();
    }
  }, [status, session, router]);

  const fetchVendorStats = async () => {
    try {
      const res = await fetch('/api/vendor/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-[#FF8C00] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                Худалдагчийн хяналтын самбар
              </h1>
              <p className="text-gray-600">
                Сайн байна уу, {session?.user?.name || 'Худалдагч'}! 👋
              </p>
            </div>

            <Link
              href="/vendor/products/add"
              className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Шинэ бараа нэмэх
            </Link>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Нийт орлого</p>
            <p className="text-3xl font-black text-gray-900">
              {formatPrice(stats?.totalRevenue || 0)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Нийт захиалга</p>
            <p className="text-3xl font-black text-gray-900">
              {stats?.totalOrders || 0}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Нийт бараа</p>
            <p className="text-3xl font-black text-gray-900">
              {stats?.totalProducts || 0}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Дундаж үнэлгээ</p>
            <p className="text-3xl font-black text-gray-900">
              {stats?.avgRating?.toFixed(1) || '0.0'}
            </p>
          </motion.div>
        </div>

        {/* Alerts */}
        {(stats?.pendingOrders || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-orange-50 border-l-4 border-orange-600 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Анхаарна уу!
                </h3>
                <p className="text-gray-700">
                  Та {stats?.pendingOrders} хүлээгдэж байгаа захиалгатай байна. 
                  <Link href="/vendor/orders" className="text-orange-600 hover:underline ml-1">
                    Захиалгууд харах →
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {(stats?.lowStockProducts || 0) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-red-50 border-l-4 border-red-600 rounded-xl p-6 mb-8"
          >
            <div className="flex items-start gap-4">
              <Package className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Нөөц дууссан
                </h3>
                <p className="text-gray-700">
                  {stats?.lowStockProducts} бараа нөөц бага эсвэл дууссан байна.
                  <Link href="/vendor/products?filter=low-stock" className="text-red-600 hover:underline ml-1">
                    Бараанууд харах →
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href="/vendor/products"
              className="block bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Бараанууд</h3>
              </div>
              <p className="text-gray-600">Барааны жагсаалт харах, засах</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/vendor/orders"
              className="block bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Захиалгууд</h3>
              </div>
              <p className="text-gray-600">Захиалгууд удирдах, статус шинэчлэх</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link
              href="/vendor/analytics"
              className="block bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Аналитик</h3>
              </div>
              <p className="text-gray-600">Борлуулалт, үнэлгээний тайлан</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Link
              href="/vendor/store"
              className="block bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition">
                  <Store className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Дэлгүүр</h3>
              </div>
              <p className="text-gray-600">Дэлгүүрийн мэдээлэл засах</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Link
              href="/vendor/reviews"
              className="block bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Үнэлгээ</h3>
              </div>
              <p className="text-gray-600">Үнэлгээ, сэтгэгдэл харах</p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Link
              href="/vendor/settings"
              className="block bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Тохиргоо</h3>
              </div>
              <p className="text-gray-600">Аккаунт, төлбөрийн тохиргоо</p>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
