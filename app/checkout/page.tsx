'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, User, Phone, MapPin, CreditCard, Package } from 'lucide-react';
import { useCartStore } from '@lib/store/cartStore';
import { formatPrice } from '@lib/utils';
import type { OrderFormData } from '@models/Order';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    phone: '',
    address: '',
    city: 'Улаанбаатар',
    district: '',
    notes: '',
  });

  const DELIVERY_FEE = deliveryMethod === 'delivery' ? 5000 : 0;
  const grandTotal = getTotalPrice() + DELIVERY_FEE;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) { toast.error('Нэрээ оруулна уу'); return false; }
    if (!formData.phone.trim() || formData.phone.length < 8) { toast.error('Утасны дугаараа зөв оруулна уу'); return false; }

    if (deliveryMethod === 'delivery') {
      if (!formData.address.trim()) { toast.error('Хаягаа оруулна уу'); return false; }
      if (!formData.district.trim()) { toast.error('Дүүргээ сонгоно уу'); return false; }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Таны сагс хоосон байна'); return; }
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const orderData = {
        userId: user?.id,
        items: items.map(item => ({
          productId: item.id,
          productName: item.name,
          productImage: item.image || null,
          quantity: item.quantity,
          price: item.price,
        })),
        total: grandTotal,
        status: 'paid',
        deliveryMethod, // Add delivery method to order data
        shipping: deliveryMethod === 'delivery' ? formData : {
          ...formData,
          address: 'Store Pickup',
          city: 'Ulaanbaatar',
          district: 'Sukhbaatar'
        },
        shippingCost: DELIVERY_FEE,
      };

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      toast.success('Захиалга амжилттай бүртгэгдлээ!', {
        duration: 3000,
        position: 'top-center',
        style: { background: '#FF7900', color: 'white', fontWeight: 'bold', borderRadius: '12px', padding: '16px' },
      });
      clearCart();
      router.push('/success');
    } catch {
      toast.error('Алдаа гарлаа');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300" />
            <h1 className="text-3xl font-black text-gray-900">Таны сагс хоосон байна</h1>
            <p className="text-gray-600">Эхлээд бараа сонгоно уу</p>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="/" className="inline-block px-8 py-4 bg-soyol text-white font-bold rounded-2xl shadow-lg glow-orange">
              Нүүр хуудас руу буцах
            </motion.a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <div className="p-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </div>
            <span className="text-sm font-medium">Буцах</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Захиалга баталгаажуулах</h1>
          <p className="text-sm sm:text-base text-gray-600">Хүргэлтийн мэдээллээ оруулна уу</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 sm:gap-8 pb-24 lg:pb-0">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Method Toggle */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-orange-50 rounded-xl"><Package className="w-5 h-5 text-orange-600" /></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Хүргэлтийн төрөл</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${deliveryMethod === 'delivery' ? 'border-orange-500 bg-orange-50/50 text-orange-700' : 'border-gray-100 hover:border-orange-200 text-gray-600'}`}
                >
                  <Package className={`w-8 h-8 ${deliveryMethod === 'delivery' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span className="font-bold">Хүргэлтээр авах</span>
                  <span className="text-xs font-medium px-2 py-1 bg-white rounded-full border border-gray-200">5,000₮</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${deliveryMethod === 'pickup' ? 'border-orange-500 bg-orange-50/50 text-orange-700' : 'border-gray-100 hover:border-orange-200 text-gray-600'}`}
                >
                  <MapPin className={`w-8 h-8 ${deliveryMethod === 'pickup' ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span className="font-bold">Өөрөө ирж авах</span>
                  <span className="text-xs font-medium px-2 py-1 bg-white rounded-full border border-gray-200">Үнэгүй</span>
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-orange-50 rounded-xl"><User className="w-5 h-5 text-orange-600" /></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Хэрэглэгчийн мэдээлэл</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5 ml-1">Овог нэр <span className="text-red-500">*</span></label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Жишээ: Бат Болд" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none font-medium" required />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5 ml-1">Утасны дугаар <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="99119911" className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none font-medium" required />
                  </div>
                </div>
              </div>
            </motion.div>

            {deliveryMethod === 'delivery' ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="p-2.5 bg-orange-50 rounded-xl"><MapPin className="w-5 h-5 text-orange-600" /></div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Хүргэлтийн хаяг</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5 ml-1">Хот <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none font-medium appearance-none" required>
                          <option value="Улаанбаатар">Улаанбаатар</option>
                          <option value="Дархан">Дархан</option>
                          <option value="Эрдэнэт">Эрдэнэт</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5 ml-1">Дүүрэг <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select name="district" value={formData.district} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none font-medium appearance-none" required>
                          <option value="">Сонгох</option>
                          <option value="Баянгол">Баянгол</option>
                          <option value="Баянзүрх">Баянзүрх</option>
                          <option value="Сүхбаатар">Сүхбаатар</option>
                          <option value="Хан-Уул">Хан-Уул</option>
                          <option value="Чингэлтэй">Чингэлтэй</option>
                          <option value="Сонгинохайрхан">Сонгинохайрхан</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5 ml-1">Дэлгэрэнгүй хаяг <span className="text-red-500">*</span></label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Хороо, гудамж, байр, тоот" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none font-medium" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-gray-500 mb-1.5 ml-1">Нэмэлт тэмдэглэл</label>
                    <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Орцны код, хүргэх цаг гэх мэт..." rows={2} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none font-medium resize-none" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="p-2.5 bg-orange-50 rounded-xl"><MapPin className="w-5 h-5 text-orange-600" /></div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Бэлэн бараа авах цэг</h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Төв салбар</h4>
                      <p className="text-sm text-gray-600 mb-2">Сүхбаатар дүүрэг, 1-р хороо, Blue Sky Tower, 3 давхар, 305 тоот</p>
                      <p className="text-sm text-gray-600"><span className="font-semibold">Цагийн хуваарь:</span> 10:00 - 20:00 (Өдөр бүр)</p>
                      <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">Утас:</span> 7711-8899</p>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-orange-600 font-medium bg-orange-50 px-3 py-2 rounded-lg inline-block">
                          💡 Та захиалгаа баталгаажуулсны дараа очиж авах боломжтой.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}


          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2.5 bg-orange-50 rounded-xl"><Package className="w-5 h-5 text-orange-600" /></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Захиалгын хураангуй</h2>
              </div>
              <div className="space-y-4 mb-6 max-h-60 sm:max-h-96 overflow-y-auto pr-1 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                    <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                      <Image src={item.image || '/placeholder.png'} alt={item.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">Тоо: {item.quantity}</p>
                        <p className="text-sm font-bold text-orange-600">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
                <div className="flex justify-between text-sm text-gray-600"><span>Барааны үнэ:</span><span className="font-bold">{formatPrice(getTotalPrice())}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Хүргэлт:</span><span className="font-bold text-gray-900">{DELIVERY_FEE === 0 ? '0₮' : formatPrice(DELIVERY_FEE)}</span></div>
                <div className="flex justify-between text-lg font-black pt-3 border-t border-gray-100"><span>Нийт:</span><span className="text-orange-600">{formatPrice(grandTotal)}</span></div>
              </div>

              <div className="hidden lg:block">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-orange-500/40 transition-all">
                  {isSubmitting ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Боловсруулж байна...</span></>) : (<><CreditCard className="w-5 h-5" /><span>Захиалга өгөх</span></>)}
                </motion.button>
                <p className="text-[10px] text-gray-400 text-center mt-4">Захиалга өгснөөр та манай <a href="#" className="text-orange-600 hover:underline">үйлчилгээний нөхцөл</a>-тэй танилцаж зөвшөөрсөн гэж үзнэ</p>
              </div>
            </motion.div>
          </div>

          {/* Mobile Fixed Bottom Button */}
          <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+56px)] left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto mb-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Нийт төлөх</span>
                <span className="text-lg font-black text-gray-900">{formatPrice(grandTotal)}</span>
              </div>
              <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />) : (<><span>Захиалга өгөх</span><CreditCard className="w-4 h-4 ml-1" /></>)}
              </motion.button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
