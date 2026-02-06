'use client';
import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Heart, Share2, Star, Zap, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@lib/store/cartStore';
import { formatPrice } from '@lib/utils';
import toast from 'react-hot-toast';
import type { Product } from '@models/Product';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/api/products?limit=100');
        const data = await res.json();
        
        // API returns { products, nextCursor, hasMore }
        const products = data.products || [];
        const foundProduct = products.find((p: Product) => p.id === id);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-soyol mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Бараа олдсонгүй</h1>
          <a href="/" className="text-soyol font-bold hover:underline">
            Нүүр хуудас руу буцах
          </a>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    toast.success(`${product.name} (${quantity} ширхэг) сагсанд нэмэгдлээ!`, {
      duration: 3000,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-soyol">Нүүр</a>
          <span>/</span>
          <span className="text-gray-900 font-bold">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-2xl"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {/* Stock Status Badge */}
            {product.stockStatus && (
              <div className={`absolute top-6 right-6 px-5 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-md ${
                product.stockStatus === 'in-stock'
                  ? 'bg-green-50/90 text-green-700 border border-green-200'
                  : 'bg-orange-50/90 text-orange-700 border border-orange-200'
              }`}>
                <span>{product.stockStatus === 'in-stock' ? '✓ Бэлэн байгаа' : '✈️ Захиалгаар'}</span>
              </div>
            )}
            {product.wholesale && (
              <div className="absolute top-6 left-6 px-6 py-2 bg-soyol rounded-full text-sm font-bold text-white shadow-lg flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Бөөний үнэ</span>
              </div>
            )}
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating)
                          ? 'fill-soyol text-soyol'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.rating} үнэлгээ)
                </span>
              </div>
            </div>

            {/* Price & Delivery Info */}
            <div className="bg-gradient-to-r from-soyol/10 to-transparent rounded-2xl p-6 border border-soyol/20">
              <p className="text-5xl font-black text-soyol">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Татварын дүн орсон үнэ</p>
              
              {/* Delivery Info */}
              {product.stockStatus && (
                <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl ${
                  product.stockStatus === 'in-stock'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  <span className="text-lg">
                    {product.stockStatus === 'in-stock' ? '🏠' : '✈️'}
                  </span>
                  <span className="text-sm font-bold">
                    {product.stockStatus === 'in-stock' ? 'Бэлэн бараа - Шууд хүргэнэ' : 'Олон улсын захиалга - 7-14 хоног'}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Тоо ширхэг
              </label>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-soyol hover:text-white transition"
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                <span className="text-3xl font-bold w-16 text-center">{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-soyol hover:text-white transition"
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className={`flex-1 py-4 text-white font-bold rounded-2xl shadow-lg glow-orange flex items-center justify-center gap-3 ${
                  product.stockStatus === 'in-stock'
                    ? 'bg-soyol'
                    : 'bg-orange-600'
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                <span>
                  {product.stockStatus === 'in-stock' ? 'Шууд худалдан авах' : 'Захиалах'}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center transition ${
                  isWishlisted
                    ? 'bg-soyol text-white'
                    : 'bg-white text-gray-700 hover:bg-soyol hover:text-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-white rounded-2xl shadow-lg text-gray-700 hover:bg-soyol hover:text-white transition flex items-center justify-center"
              >
                <Share2 className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Барааны тайлбар</h3>
              <p className="text-gray-600 leading-relaxed">
                Энэхүү бараа нь өндөр чанартай материалаар хийгдсэн бөгөөд таны амьдралыг
                илүү тав тухтай болгоно. Гэр бүлийн аж төрхөнд эсвэл бизнест тохиромжтой.
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Ангилал: {product.category}</p>
                <p className="text-sm text-gray-500">Барааны код: {product.id}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
