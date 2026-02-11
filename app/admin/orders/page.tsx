'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    ArrowLeft, LayoutDashboard, Loader2, Package, Search,
    MapPin, Phone, Calendar, Clock, CheckCircle2, Truck, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    _id: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    notes?: string;
    items: OrderItem[];
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'delivered';
    createdAt: string;
    deliveryEstimate?: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    // Edit form state
    const [editStatus, setEditStatus] = useState<Order['status']>('pending');
    const [editEstimate, setEditEstimate] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders/route'); // Path issue? API route is at /api/admin/orders
            // Wait, endpoint is /api/admin/orders based on folder structure. 
            // But file was created at app/api/admin/orders/route.ts
            // So fetch URL should be /api/admin/orders
            const response = await fetch('/api/admin/orders');
            const data = await response.json();
            if (data.orders) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const openOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setEditStatus(order.status);
        setEditEstimate(order.deliveryEstimate || '');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleUpdateOrder = async () => {
        if (!selectedOrder) return;
        setUpdating(true);

        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: selectedOrder._id,
                    status: editStatus,
                    deliveryEstimate: editEstimate
                })
            });

            if (res.ok) {
                toast.success('Order updated');
                // Update local state
                setOrders(orders.map(o =>
                    o._id === selectedOrder._id
                        ? { ...o, status: editStatus, deliveryEstimate: editEstimate }
                        : o
                ));
                closeModal();
            } else {
                toast.error('Update failed');
            }
        } catch (error) {
            toast.error('Error updating order');
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('mn-MN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (n: number) =>
        new Intl.NumberFormat('mn-MN', { maximumFractionDigits: 0 }).format(n) + ' ₮';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/20 text-emerald-400';
            case 'delivered': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-amber-500/20 text-amber-400';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30"><Package className="w-6 h-6 text-white" /></div>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">Захиалга</h1>
                            <p className="text-sm text-slate-400 mt-0.5">Order Management</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-amber-500 animate-spin" /></div>
                ) : (
                    <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">All Orders ({orders.length})</h2>
                        </div>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-white/10">
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Customer (Who)</th>
                                        <th className="px-6 py-4">Date (When)</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Delivery</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr
                                            key={order._id}
                                            onClick={() => openOrderDetails(order)}
                                            className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 text-slate-300 font-mono text-xs">
                                                #{order._id.slice(-6)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">{order.fullName}</div>
                                                <div className="text-xs text-slate-400">{order.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 text-sm">
                                                {formatDate(order.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-amber-400 font-bold">
                                                {formatPrice(order.totalPrice || 0)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-300">
                                                {order.deliveryEstimate || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-4 p-4">
                            {orders.map((order) => (
                                <div
                                    key={order._id}
                                    onClick={() => openOrderDetails(order)}
                                    className="bg-slate-800/50 rounded-xl p-4 border border-white/5 space-y-3 cursor-pointer active:scale-[0.98] transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-mono text-slate-500">#{order._id.slice(-6)}</span>
                                            <h3 className="text-white font-bold text-sm mt-0.5">{order.fullName}</h3>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-medium uppercase ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{formatDate(order.createdAt)}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-slate-500 uppercase">Total</span>
                                            <span className="text-amber-400 font-bold">{formatPrice(order.totalPrice || 0)}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-slate-400 gap-1">
                                            <span>Detail</span>
                                            <div className="p-1 rounded-full bg-white/5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {orders.length === 0 && (
                            <div className="py-12 text-center text-slate-500">No orders found.</div>
                        )}
                    </div>
                )}
            </main>

            {/* Detail Modal */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-900 z-10 shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-white">Order Details</h2>
                                <p className="text-sm text-slate-400 font-mono">#{selectedOrder._id}</p>
                            </div>
                            <button onClick={closeModal} className="p-2 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Customer Info */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-3">Customer (Who)</h3>
                                    <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-700/50 rounded-lg"><Search className="w-4 h-4 text-slate-400" /></div>
                                            <div>
                                                <p className="text-sm text-slate-400">Full Name</p>
                                                <p className="text-white font-medium">{selectedOrder.fullName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-700/50 rounded-lg"><Phone className="w-4 h-4 text-slate-400" /></div>
                                            <div>
                                                <p className="text-sm text-slate-400">Phone</p>
                                                <p className="text-white font-medium">{selectedOrder.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-slate-700/50 rounded-lg"><MapPin className="w-4 h-4 text-slate-400" /></div>
                                            <div>
                                                <p className="text-sm text-slate-400">Address</p>
                                                <p className="text-white">
                                                    {selectedOrder.city}, {selectedOrder.district}<br />
                                                    {selectedOrder.address}
                                                </p>
                                                {selectedOrder.notes && (
                                                    <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200 text-sm">
                                                        Note: {selectedOrder.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Management Controls */}
                                <div>
                                    <h3 className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-3">Update Order</h3>
                                    <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
                                        <div>
                                            <label className="block text-sm text-slate-300 mb-1">Status</label>
                                            <select
                                                value={editStatus}
                                                onChange={(e) => setEditStatus(e.target.value as any)}
                                                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:border-amber-500 outline-none"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-slate-300 mb-1">Delivery Estimate (How long?)</label>
                                            <div className="flex gap-2 mb-2">
                                                <button
                                                    onClick={() => setEditEstimate('2 weeks (Pre-order)')}
                                                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white"
                                                >
                                                    2 Weeks
                                                </button>
                                                <button
                                                    onClick={() => setEditEstimate('2-5 days (In stock)')}
                                                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white"
                                                >
                                                    2-5 Days
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={editEstimate}
                                                onChange={(e) => setEditEstimate(e.target.value)}
                                                placeholder="e.g. Arrives in 3 days"
                                                className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-lg text-white focus:border-amber-500 outline-none placeholder-slate-600"
                                            />
                                        </div>
                                        <button
                                            onClick={handleUpdateOrder}
                                            disabled={updating}
                                            className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50"
                                        >
                                            {updating ? 'Updating...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-3">Items (What)</h3>
                                <div className="bg-slate-800/50 rounded-xl border border-white/5 overflow-hidden">
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="p-4 flex gap-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <div className="relative w-16 h-16 bg-slate-700 rounded-lg overflow-hidden shrink-0">
                                                    {item.image ? (
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-slate-500" /></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium line-clamp-2">{item.name}</p>
                                                    <p className="text-sm text-slate-400 mt-1">
                                                        {item.quantity} x <span className="text-amber-400">{formatPrice(item.price)}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-slate-900/50 border-t border-white/10 flex justify-between items-center">
                                        <span className="text-slate-400">Total Price</span>
                                        <span className="text-xl font-bold text-amber-400">{formatPrice(selectedOrder.totalPrice || 0)}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-amber-500 uppercase tracking-wider mb-2">Timestamp (When)</h3>
                                    <div className="flex gap-4 text-sm">
                                        <div className="bg-slate-800/50 px-3 py-2 rounded-lg flex items-center gap-2 text-slate-300">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="bg-slate-800/50 px-3 py-2 rounded-lg flex items-center gap-2 text-slate-300">
                                            <Clock className="w-4 h-4 text-slate-500" />
                                            {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
