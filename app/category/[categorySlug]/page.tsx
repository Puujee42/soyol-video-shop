'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronDown,
  Star,
  ShoppingCart,
  Grid,
  List,
  Package
} from 'lucide-react';
import type { Category, Product } from '@/types/marketplace';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cartStore';
import toast from 'react-hot-toast';

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch category details
        const categoryRes = await fetch(`/api/categories/${categorySlug}`);
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        // Fetch category products
        const productsRes = await fetch(
          `/api/products?categorySlug=${categorySlug}&sortBy=${sortBy}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
        );
        const productsData = await productsRes.json();
        setProducts(productsData.products || []);
      } catch (error) {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug, sortBy, priceRange]);

  const handleAddToCart = (product: Product) => {
    addItem(product as any);
    toast.success(`${product.name} сагсанд нэмэгдлээ!`, {
      duration: 2000,
      position: 'top-right',
      style: {
        background: '#FF7900',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '12px',
      },
      icon: '🛒',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-[#FF8C00] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ангилал олдсонгүй</h2>
          <Link href="/" className="text-[#FF8C00] hover:underline">
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            {category.icon && (
              <div className="text-6xl mb-4">{category.icon}</div>
            )}
            <h1 className="text-5xl font-black mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
            <p className="text-lg mt-4 opacity-80">
              {products.length} бараа олдлоо
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Sort Dropdown */}
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-bold">Эрэмбэлэх:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="newest">Шинэ бараа</option>
                <option value="popular">Алдартай</option>
                <option value="price-asc">Үнэ: Бага → Их</option>
                <option value="price-desc">Үнэ: Их → Бага</option>
                <option value="rating">Үнэлгээ</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subcategories (if any) */}
        {category.children && category.children.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Дэд ангилал</h3>
            <div className="flex flex-wrap gap-3">
              {category.children.map((subcat) => (
                <Link
                  key={subcat.id}
                  href={`/category/${subcat.slug}`}
                  className="px-6 py-3 bg-white rounded-xl border border-gray-200 hover:border-orange-600 hover:text-orange-600 font-medium transition"
                >
                  {subcat.icon && <span className="mr-2">{subcat.icon}</span>}
                  {subcat.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Бараа олдсонгүй</h3>
            <p className="text-gray-500">Энэ ангилалд бараа байхгүй байна</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.images[0] || '/placeholder.png'}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {product.featured && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">
                        ⭐ Онцлох
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 hover:text-orange-600 transition">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({product.totalReviews})</span>
                  </div>

                  <p className="text-2xl font-black text-orange-600 mb-3">
                    {formatPrice(product.price)}
                  </p>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-2 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Сагсанд
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
