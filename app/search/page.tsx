'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Search, ShoppingCart, Eye } from 'lucide-react';
import { formatPrice, getStarRating } from '@lib/utils';
import { useCartStore } from '@lib/store/cartStore';
import toast from 'react-hot-toast';

type ProductItem = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
  category: string;
  rating?: number;
  wholesale?: boolean;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(`/api/products?q=${encodeURIComponent(q)}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, [q]);

  const handleAddToCart = (product: ProductItem) => {
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

  const rating = (p: ProductItem) => p.rating ?? 0;

  if (!q.trim()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" strokeWidth={1} />
          <h1 className="text-xl font-bold text-gray-800 mb-2">Хайлт</h1>
          <p className="text-gray-500">Дээд талын хайлтын самбарт үг бичнэ үү.</p>
          <Link
            href="/"
            className="inline-block mt-6 px-6 py-3 bg-[#FF7900] text-white font-bold rounded-xl hover:bg-[#e66d00] transition"
          >
            Нүүр хуудас
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF7900] mx-auto mb-4" />
          <p className="text-gray-600 font-bold">Хайж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            &quot;{q}&quot; хайлтын үр дүн
          </h1>
          <p className="text-gray-600">
            {products.length === 0
              ? 'Олдсон бараа байхгүй'
              : `${products.length} бараа олдлоо`}
          </p>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Энэ нэрээр бараа олдсонгүй</p>
            <p className="text-gray-400 text-sm">Өөр үгээр дахин хайна уу</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition group"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.image || '/soyol-logo.png'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {product.wholesale && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-[#FF7900] rounded-full text-xs font-bold text-white">
                      Бөөний үнэ
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-base font-bold text-gray-900 line-clamp-2 hover:text-[#FF7900] transition">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1">
                    {getStarRating(rating(product)).map((filled, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          filled ? 'fill-current text-[#FF7900]' : 'fill-current text-gray-300'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    {rating(product) > 0 && (
                      <span className="text-xs text-gray-500 ml-1">({rating(product)})</span>
                    )}
                  </div>
                  <p className="text-xl font-black text-[#FF7900]">{formatPrice(product.price)}</p>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 py-2 bg-[#FF7900] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#e66d00] transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm">Сагсанд</span>
                    </button>
                    <Link
                      href={`/product/${product.id}`}
                      className="px-4 py-2 border-2 border-[#FF7900] text-[#FF7900] font-bold rounded-xl hover:bg-[#FF7900] hover:text-white transition flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7900]" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
