import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import AddProductForm from './AddProductForm';
import DeleteProductButton from './DeleteProductButton';
import { Package, ShoppingBag, TrendingUp, Boxes } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  return categories;
}

async function getStats() {
  const totalProducts = await prisma.product.count();
  const totalCategories = await prisma.category.count();
  const featuredProducts = await prisma.product.count({
    where: { featured: true },
  });
  
  return {
    totalProducts,
    totalCategories,
    featuredProducts,
  };
}

export default async function AdminPage() {
  const [products, categories, stats] = await Promise.all([
    getProducts(),
    getCategories(),
    getStats(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            🛠️ Admin Dashboard
          </h1>
          <p className="text-gray-600">Бараануудыг удирдах хэсэг</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-bold mb-1">Нийт бараа</p>
                <p className="text-3xl font-black text-soyol">{stats.totalProducts}</p>
              </div>
              <div className="w-14 h-14 bg-soyol/10 rounded-2xl flex items-center justify-center">
                <Package className="w-7 h-7 text-soyol" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-bold mb-1">Ангилал</p>
                <p className="text-3xl font-black text-soyol">{stats.totalCategories}</p>
              </div>
              <div className="w-14 h-14 bg-soyol/10 rounded-2xl flex items-center justify-center">
                <Boxes className="w-7 h-7 text-soyol" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-bold mb-1">Онцлох бараа</p>
                <p className="text-3xl font-black text-soyol">{stats.featuredProducts}</p>
              </div>
              <div className="w-14 h-14 bg-soyol/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-soyol" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-soyol" />
            Бараа нэмэх
          </h2>
          <AddProductForm categories={categories} />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">
              Бүх бараанууд ({products.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                    Зураг
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                    Нэр
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                    Үнэ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                    Ангилал
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                    Үнэлгээ
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                    Онцлох
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-black text-gray-600 uppercase tracking-wider">
                    Үйлдэл
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-900 max-w-xs">
                        {product.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {product.id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-soyol">
                        {formatPrice(product.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-soyol/10 text-soyol">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          {product.rating}
                        </span>
                        <svg className="w-4 h-4 fill-current text-soyol" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.featured ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          ✓ Тийм
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                          - Үгүй
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
