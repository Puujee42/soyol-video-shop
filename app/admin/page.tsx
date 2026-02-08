'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  ShoppingBag,
  PlusCircle,
  Pencil,
  Trash2,
  Loader2,
  LayoutDashboard,
  CheckCircle2,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  stock_status: string;
  stock_count: number;
  created_at: string;
};

type Order = {
  id: string;
  user_id: string;
  status: string;
  total: number;
  payment_method: string | null;
  payment_confirmed_at: string | null;
  created_at: string;
  order_items?: { product_name: string; quantity: number; price: number }[];
};

const CATEGORIES = [
  { value: 'tech', label: 'Tech & Electronics' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'home', label: 'Home & Living' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'beauty', label: 'Beauty & Personal Care' },
  { value: 'sports', label: 'Sports & Outdoors' },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<'inventory' | 'orders'>('inventory');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'tech',
    stock_status: 'in-stock',
    stock_count: '0',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('id, user_id, status, total, payment_method, payment_confirmed_at, created_at')
      .order('created_at', { ascending: false });
    const list = (data as Order[]) || [];
    const withItems = await Promise.all(
      list.map(async (o) => {
        const { data: items } = await supabase
          .from('order_items')
          .select('product_name, quantity, price')
          .eq('order_id', o.id);
        return { ...o, order_items: items || [] };
      })
    );
    setOrders(withItems);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchProducts();
      await fetchOrders();
      setLoading(false);
    })();
  }, []);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price) || 0,
      image: formData.image || null,
      category: formData.category,
      stock_status: formData.stock_status,
      stock_count: parseInt(formData.stock_count, 10) || 0,
      updated_at: new Date().toISOString(),
    };
    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      if (error) toast.error(error.message);
      else {
        toast.success('Бараа шинэчлэгдлээ');
        setEditingId(null);
        setFormData({ name: '', description: '', price: '', image: '', category: 'tech', stock_status: 'in-stock', stock_count: '0' });
        fetchProducts();
      }
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) toast.error(error.message);
      else {
        toast.success('Бараа нэмэгдлээ');
        setFormData({ name: '', description: '', price: '', image: '', category: 'tech', stock_status: 'in-stock', stock_count: '0' });
        fetchProducts();
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Устгах уу?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Устгагдлаа');
      fetchProducts();
    }
  };

  const handleConfirmQPay = async (orderId: string) => {
    setConfirmingOrderId(orderId);
    const { error } = await supabase
      .from('orders')
      .update({
        payment_method: 'qpay',
        payment_confirmed_at: new Date().toISOString(),
        status: 'paid',
      })
      .eq('id', orderId);
    setConfirmingOrderId(null);
    if (error) toast.error(error.message);
    else {
      toast.success('QPay-ээр төлбөр баталгаажлаа');
      fetchOrders();
    }
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('mn-MN', { maximumFractionDigits: 0 }).format(n) + ' ₮';
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('mn-MN', { dateStyle: 'medium' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Админ панел</h1>
                <p className="text-sm text-slate-400 mt-0.5">Бараа болон захиалга удирдах</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-1 border-t border-white/5">
          <button
            type="button"
            onClick={() => setTab('inventory')}
            className={`px-5 py-3 text-sm font-medium rounded-t-xl transition-colors ${
              tab === 'inventory'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30 border-b-transparent'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Барааны сан
          </button>
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`px-5 py-3 text-sm font-medium rounded-t-xl transition-colors ${
              tab === 'orders'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/30 border-b-transparent'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Захиалга
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
          </div>
        ) : tab === 'inventory' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden sticky top-32">
                <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-semibold text-white">
                    {editingId ? 'Бараа засах' : 'Бараа нэмэх'}
                  </h2>
                </div>
                <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Нэр *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 outline-none"
                      placeholder="Барааны нэр"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Тайлбар</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:border-amber-500/50 outline-none resize-none"
                      placeholder="Тайлбар"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Үнэ (₮) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min={0}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-amber-500/50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Зургийн URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:border-amber-500/50 outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Төрөл</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-amber-500/50 outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Төлөв</label>
                    <select
                      value={formData.stock_status}
                      onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-amber-500/50 outline-none"
                    >
                      <option value="in-stock">Бэлэн</option>
                      <option value="pre-order">Захиалгаар</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Үлдэгдэл тоо</label>
                    <input
                      type="number"
                      value={formData.stock_count}
                      onChange={(e) => setFormData({ ...formData, stock_count: e.target.value })}
                      min={0}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-white focus:border-amber-500/50 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {editingId ? 'Хадгалах' : 'Нэмэх'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ name: '', description: '', price: '', image: '', category: 'tech', stock_status: 'in-stock', stock_count: '0' });
                        }}
                        className="px-4 py-2.5 rounded-xl border border-white/20 text-slate-300 hover:bg-white/5"
                      >
                        Цуцлах
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Барааны жагсаалт</h2>
                  <span className="text-sm text-slate-400">{products.length} бараа</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-white/10">
                        <th className="px-6 py-4">Зураг</th>
                        <th className="px-6 py-4">Нэр</th>
                        <th className="px-6 py-4">Үнэ</th>
                        <th className="px-6 py-4">Төлөв</th>
                        <th className="px-6 py-4">Үлдэгдэл</th>
                        <th className="px-6 py-4 w-24"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="px-6 py-4">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
                              {p.image ? (
                                <Image src={p.image} alt="" fill className="object-cover" sizes="48px" />
                              ) : (
                                <Package className="w-6 h-6 text-slate-500 absolute inset-0 m-auto" />
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-white font-medium">{p.name}</td>
                          <td className="px-6 py-4 text-amber-400">{formatPrice(p.price)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              p.stock_status === 'in-stock' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {p.stock_status === 'in-stock' ? 'Бэлэн' : 'Захиалгаар'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-300">{p.stock_count}</td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(p.id);
                                setFormData({
                                  name: p.name,
                                  description: p.description || '',
                                  price: String(p.price),
                                  image: p.image || '',
                                  category: p.category,
                                  stock_status: p.stock_status,
                                  stock_count: String(p.stock_count),
                                });
                              }}
                              className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-amber-400 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id)}
                              className="p-2 rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {products.length === 0 && (
                  <div className="py-16 text-center text-slate-500">Бараа байхгүй. Дээрх формөөс нэмнэ үү.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Захиалгын жагсаалт</h2>
              <span className="text-sm text-slate-400">{orders.length} захиалга</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-white/10">
                    <th className="px-6 py-4">Дугаар</th>
                    <th className="px-6 py-4">Огноо</th>
                    <th className="px-6 py-4">Нийт</th>
                    <th className="px-6 py-4">Төлбөр</th>
                    <th className="px-6 py-4 w-40"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4 text-white font-mono text-sm">#{o.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-slate-300">{formatDate(o.created_at)}</td>
                      <td className="px-6 py-4 text-amber-400 font-medium">{formatPrice(Number(o.total))}</td>
                      <td className="px-6 py-4">
                        {o.payment_confirmed_at ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            QPay баталгаажсан
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-600/50 text-slate-400 text-xs">
                            <CreditCard className="w-3.5 h-3.5" />
                            Баталгаажаагүй
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!o.payment_confirmed_at && (
                          <button
                            type="button"
                            disabled={!!confirmingOrderId}
                            onClick={() => handleConfirmQPay(o.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium hover:bg-amber-500/30 transition-colors disabled:opacity-50"
                          >
                            {confirmingOrderId === o.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            QPay-ээр төлсөн
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {orders.length === 0 && (
              <div className="py-16 text-center text-slate-500">Захиалга байхгүй.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
