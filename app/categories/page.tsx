'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Filter, ShoppingCart, Eye, ChevronDown } from 'lucide-react';
import { formatPrice, getStarRating } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';
import type { Category } from '@models/Category';

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?limit=100'),
          fetch('/api/categories'),
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        // API returns { products, nextCursor, hasMore }
        setProducts(productsData.products || []);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'all') return true;
    if (selectedSubcategory !== 'all') {
      return product.category === selectedCategory;
    }
    return product.category === selectedCategory;
  });

  const handleAddToCart = (product: any) => {
    addItem(product);
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
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-soyol mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-gray-900 mb-2">Бүх ангилал</h1>
          <p className="text-gray-600">
            {filteredProducts.length} бараа олдлоо
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-5 h-5 text-soyol" />
                <h2 className="text-xl font-bold text-gray-900">Шүүлтүүр</h2>
              </div>

              {/* All Products */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubcategory('all');
                }}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition mb-2 ${
                  selectedCategory === 'all'
                    ? 'bg-soyol text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-soyol/10'
                }`}
              >
                Бүх бараа
              </button>

              {/* Categories */}
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => {
                        if (selectedCategory === category.id) {
                          setExpandedCategory(
                            expandedCategory === category.id ? null : category.id
                          );
                        } else {
                          setSelectedCategory(category.id);
                          setSelectedSubcategory('all');
                          setExpandedCategory(category.id);
                        }
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center justify-between ${
                        selectedCategory === category.id
                          ? 'bg-soyol text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-soyol/10'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedCategory === category.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Subcategories */}
                    {expandedCategory === category.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-4 mt-2 space-y-1"
                      >
                        {category.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSubcategory(sub.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                              selectedSubcategory === sub.id
                                ? 'bg-soyol/20 text-soyol font-bold'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Price Range Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2 font-bold">Үнийн хязгаар</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-bold text-soyol">
                    {formatPrice(Math.min(...filteredProducts.map((p) => p.price)))}
                  </span>
                  <span>-</span>
                  <span className="font-bold text-soyol">
                    {formatPrice(Math.max(...filteredProducts.map((p) => p.price)))}
                  </span>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Right - Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">Энэ ангилалд бараа олдсонгүй</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition group"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {product.wholesale && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-soyol rounded-full text-xs font-bold text-white">
                          Бөөний үнэ
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <a href={`/product/${product.id}`}>
                        <h3 className="text-base font-bold text-gray-900 line-clamp-2 hover:text-soyol transition">
                          {product.name}
                        </h3>
                      </a>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {getStarRating(product.rating).map((filled, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              filled ? 'fill-current text-soyol' : 'fill-current text-gray-300'
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                      </div>

                      {/* Price */}
                      <p className="text-2xl font-black text-soyol">
                        {formatPrice(product.price)}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 py-2 bg-soyol text-white font-bold rounded-xl shadow-lg glow-orange flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-sm">Сагсанд</span>
                        </motion.button>

                        <motion.a
                          href={`/product/${product.id}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-white border-2 border-soyol text-soyol font-bold rounded-xl hover:bg-soyol hover:text-white transition flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
