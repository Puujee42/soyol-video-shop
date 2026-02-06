'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingBag, User, Phone, MapPin, FileText, CreditCard, Package } from 'lucide-react';
import { useCartStore } from '@lib/store/cartStore';
import { formatPrice } from '@lib/utils';
import type { OrderFormData } from '@models/Order';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    phone: '',
    address: '',
    city: 'Улаанбаатар',
    district: '',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error('Нэрээ оруулна уу');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      toast.error('Утасны дугаараа зөв оруулна уу');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Хаягаа оруулна уу');
      return false;
    }
    if (!formData.district.trim()) {
      toast.error('Дүүргээ сонгоно уу');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error('Таны сагс хоосон байна');
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Захиалга амжилттай бүртгэгдлээ!', {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#FF7900',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '12px',
        padding: '16px',
      },
      icon: '✅',
    });

    clearCart();
    router.push('/success');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300" />
            <h1 className="text-3xl font-black text-gray-900">Таны сагс хоосон байна</h1>
            <p className="text-gray-600">Эхлээд бараа сонгоно уу</p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/"
              className="inline-block px-8 py-4 bg-soyol text-white font-bold rounded-2xl shadow-lg glow-orange"
            >
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-gray-900 mb-2">Захиалга баталгаажуулах</h1>
          <p className="text-gray-600">Хүргэлтийн мэдээллээ оруулна уу</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left: Delivery Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-soyol/10 rounded-xl">
                  <User className="w-6 h-6 text-soyol" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Хэрэглэгчийн мэдээлэл</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Овог нэр <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Жишээ: Бат Болд"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-soyol focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Утасны дугаар <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="99119911"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-soyol focus:outline-none transition"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-soyol/10 rounded-xl">
                  <MapPin className="w-6 h-6 text-soyol" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Хүргэлтийн хаяг</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Хот <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-soyol focus:outline-none transition"
                    required
                  >
                    <option value="Улаанбаатар">Улаанбаатар</option>
                    <option value="Дархан">Дархан</option>
                    <option value="Эрдэнэт">Эрдэнэт</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Дүүрэг <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-soyol focus:outline-none transition"
                    required
                  >
                    <option value="">Дүүрэг сонгох</option>
                    <option value="Баянгол">Баянгол</option>
                    <option value="Баянзүрх">Баянзүрх</option>
                    <option value="Сүхбаатар">Сүхбаатар</option>
                    <option value="Хан-Уул">Хан-Уул</option>
                    <option value="Чингэлтэй">Чингэлтэй</option>
                    <option value="Сонгинохайрхан">Сонгинохайрхан</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Дэлгэрэнгүй хаяг <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Хороо, гудамж, байр, тоот"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-soyol focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Нэмэлт тэмдэглэл
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Хүргэлттэй холбоотой тэмдэглэл..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-soyol focus:outline-none transition resize-none"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-soyol/10 rounded-xl">
                  <Package className="w-6 h-6 text-soyol" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Захиалгын хураангуй</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-600">Тоо: {item.quantity}</p>
                      <p className="text-sm font-bold text-soyol">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="space-y-3 pt-6 border-t-2 border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Барааны үнэ:</span>
                  <span className="font-bold">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Хүргэлт:</span>
                  <span className="font-bold text-green-600">Үнэгүй</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-3 border-t-2 border-gray-200">
                  <span>Нийт:</span>
                  <span className="text-soyol">{formatPrice(getTotalPrice())}</span>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-soyol text-white font-bold rounded-2xl shadow-lg glow-orange flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Боловсруулж байна...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Захиалга өгөх</span>
                  </>
                )}
              </motion.button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Захиалга өгснөөр та манай <a href="#" className="text-soyol font-bold">үйлчилгээний нөхцөл</a>-тэй 
                танилцаж зөвшөөрсөн гэж үзнэ
              </p>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
