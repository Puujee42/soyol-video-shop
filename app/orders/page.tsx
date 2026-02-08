'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Loader2, CheckCircle2, Store } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user: supabaseUser, loading: supabaseLoading } = useSupabaseAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = supabaseUser?.id ?? (session?.user as { id?: string })?.id;
  const isLoggedIn = !!userId;

  useEffect(() => {
    if (status === 'loading' || supabaseLoading) return;
    if (!isLoggedIn) {
      router.replace('/login?callbackUrl=/orders');
      return;
    }
    const fetchOrders = async () => {
      if (!supabaseUser?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('orders')
        .select('id, user_id, status, total, created_at, order_items(id, product_id, product_name, product_image, quantity, price)')
        .eq('user_id', supabaseUser.id)
        .eq('status', 'paid')
        .order('created_at', { ascending: false });
      if (!error && data) setOrders(data as Order[]);
      else setOrders([]);
      setLoading(false);
    };
    fetchOrders();
  }, [status, supabaseLoading, isLoggedIn, supabaseUser?.id, router]);

  if (status === 'loading' || supabaseLoading || (!isLoggedIn && !orders.length)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('mn-MN', { style: 'decimal', maximumFractionDigits: 0 }).format(n) + ' ₮';
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('mn-MN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Миний захиалга</h1>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">Танд одоогоор захиалга байхгүй байна</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
            >
              <Store className="w-5 h-5" />
              Дэлгүүр рүү буцах
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">Захиалга #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    Баталгаажсан
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {order.order_items?.map((item: OrderItem) => (
                    <div key={item.id} className="flex gap-4 p-4 sm:p-5">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-2">{item.product_name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Тоо ширхэг: {item.quantity} × {formatPrice(item.price)}
                        </p>
                        <p className="text-base font-bold text-orange-600 mt-1">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 sm:px-5 py-4 bg-gray-50 flex justify-between items-center">
                  <span className="text-gray-600">Нийт дүн:</span>
                  <span className="text-xl font-bold text-gray-900">{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
