'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, ShoppingCart, Eye, TrendingUp } from 'lucide-react';
import { formatPrice, getStarRating } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=20');
        const data = await res.json();
        
        // API returns { products, nextCursor, hasMore }
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get newest products (sort by createdAt or just take first 8)
  const newProducts = products.slice(0, 8);

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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-soyol/10 to-yellow-400/10 rounded-full mb-6">
            <TrendingUp className="w-6 h-6 text-soyol" />
            <span className="text-soyol font-bold">Шинэ Бараанууд</span>
            <Sparkles className="w-6 h-6 text-soyol" />
          </div>
          
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Сүүлд нэмэгдсэн бараанууд
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Хамгийн сүүлийн үеийн технологи, тоног төхөөрөмжүүд таны хүлээж байна
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="text-3xl font-black text-soyol mb-2">{newProducts.length}</div>
            <div className="text-sm text-gray-600 font-bold">Шинэ бараа</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="text-3xl font-black text-soyol mb-2">7</div>
            <div className="text-sm text-gray-600 font-bold">Хоногийн дотор</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="text-3xl font-black text-soyol mb-2">100%</div>
            <div className="text-sm text-gray-600 font-bold">Шинэ бараа</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="text-3xl font-black text-soyol mb-2">4.8</div>
            <div className="text-sm text-gray-600 font-bold">Дундаж үнэлгээ</div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {newProducts.length === 0 ? (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Одоогоор шинэ бараа байхгүй байна</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition group"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  
                  {/* NEW Badge */}
                  <div className="absolute top-4 left-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                      className="relative"
                    >
                      <div className="px-4 py-2 bg-gradient-to-r from-soyol to-yellow-400 rounded-full shadow-xl">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-white animate-pulse" />
                          <span className="text-sm font-black text-white">ШИНЭ</span>
                        </div>
                      </div>
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-soyol to-yellow-400 rounded-full blur-xl opacity-50 -z-10" />
                    </motion.div>
                  </div>

                  {product.wholesale && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-bold text-white">
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
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black text-soyol">
                      {formatPrice(product.price)}
                    </p>
                  </div>

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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center bg-gradient-to-r from-soyol/5 to-yellow-400/5 rounded-3xl p-12 border border-soyol/20"
        >
          <Sparkles className="w-12 h-12 mx-auto text-soyol mb-4" />
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Шинэ бараанууд долоо хоног бүр нэмэгддэг!
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Хамгийн сүүлийн үеийн тоног төхөөрөмжүүдийг хамгийн түрүүнд мэдэхийн тулд
            манай цахим хуудсыг тогтмол шалгаарай
          </p>
          <motion.a
            href="/categories"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-soyol text-white font-bold rounded-2xl shadow-lg glow-orange"
          >
            Бүх бараа үзэх
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
