'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Phone, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export default function PhoneLoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 8) {
      toast.error('8 оронтой утасны дугаар оруулна уу');
      return;
    }

    // Validate Mongolian phone number
    const validPrefixes = ['80', '85', '86', '88', '89', '90', '91', '94', '95', '96', '98', '99'];
    const prefix = phoneNumber.substring(0, 2);
    
    if (!validPrefixes.includes(prefix)) {
      toast.error('Монголын утасны дугаар оруулна уу\n(80, 85, 88, 89, 90, 95, 96, 99...)', {
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`📱 Баталгаажуулах код илгээгдлээ!\n+976 ${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`, {
          duration: 5000,
          icon: '✅',
        });
        setStep('otp');
      } else {
        toast.error(data.error || 'Код илгээхэд алдаа гарлаа');
      }
    } catch (error) {
      toast.error('Алдаа гарлаа. Дахин оролдоно уу');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('6 оронтой код оруулна уу');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn('phone-login', {
        phoneNumber,
        otp,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Код буруу байна');
      } else if (result?.ok) {
        toast.success('Амжилттай нэвтэрлээ!');
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error('Алдаа гарлаа. Дахин оролдоно уу');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('phone');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24 pb-16">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <Link href="/">
            <img
              src="/soyol-logo.png"
              alt="Soyol Video Shop"
              className="h-12 w-auto mx-auto mb-6"
            />
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Утасны дугаараар нэвтрэх
          </h1>
          <p className="text-slate-600">
            Утасны дугаараараа нэвтэрнэ үү
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
        >
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Утасны дугаар
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="99887766"
                    maxLength={8}
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg outline-none"
                    required
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-slate-500">
                    Монголын 8 оронтой утасны дугаараа оруулна уу
                  </p>
                  <p className="text-xs text-slate-400">
                    Жишээ: 99887766, 88112233, 95001122
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length !== 8}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Илгээж байна...</span>
                  </>
                ) : (
                  <>
                    <span>Код илгээх</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-2">
                  Баталгаажуулах код
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength={6}
                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg tracking-wider outline-none"
                    required
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  <span className="font-medium text-slate-700">+976 {phoneNumber.slice(0, 4)} {phoneNumber.slice(4)}</span> дугаарт илгээсэн 6 оронтой кодыг оруулна уу
                </p>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 <span className="font-semibold">Анхаар:</span> SMS хүлээн авахад 1-2 минут шаардагдаж болно. Хэрэв код ирээгүй бол дахин илгээх товчийг дарна уу.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Шалгаж байна...</span>
                    </>
                  ) : (
                    <>
                      <span>Баталгаажуулах</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-full font-medium hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all"
                  >
                    Өөр дугаар
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendOTP({ preventDefault: () => {} } as any)}
                    disabled={loading}
                    className="flex-1 bg-white border-2 border-orange-500 text-orange-600 py-3 rounded-full font-medium hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                  >
                    Дахин илгээх
                  </button>
                </div>
              </div>
            </form>
          )}
        </motion.div>

        {/* Back to Email Login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-center"
        >
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            И-мэйлээр нэвтрэх
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
