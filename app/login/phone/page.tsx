'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

const MN_PREFIX = '+976';
const VALID_PREFIXES = ['80', '85', '86', '88', '89', '90', '91', '94', '95', '96', '98', '99'];

function formatPhoneInput(value: string) {
  return value.replace(/\D/g, '').slice(0, 8);
}

function toE164(phone: string) {
  return `${MN_PREFIX}${phone}`;
}

export default function SmartPhoneAuthPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [sentPhone, setSentPhone] = useState('');

  // Handle OAuth callback (Google redirect with hash)
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(() => {
        window.history.replaceState(null, '', window.location.pathname);
        toast.success('Амжилттай нэвтэрлээ');
        router.push('/');
        router.refresh();
      });
    }
  }, [router]);

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = formatPhoneInput(phone);
    if (digits.length !== 8) {
      toast.error('8 оронтой утасны дугаар оруулна уу');
      return;
    }
    const prefix = digits.slice(0, 2);
    if (!VALID_PREFIXES.includes(prefix)) {
      toast.error('Монголын утасны дугаар оруулна уу (80, 85, 88, 89, 90...)');
      return;
    }

    setLoading(true);
    const phoneE164 = toE164(digits);
    const { error } = await supabase.auth.signInWithOtp({ phone: phoneE164 });

    if (error) {
      toast.error(error.message || 'Код илгээхэд алдаа гарлаа');
      setLoading(false);
      return;
    }

    setSentPhone(phoneE164);
    setStep('otp');
    setOtp('');
    toast.success(`Код илгээгдлээ: +976 ${digits.slice(0, 4)} ${digits.slice(4)}`);
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.replace(/\D/g, '').slice(0, 6);
    if (code.length !== 6) {
      toast.error('6 оронтой кодыг оруулна уу');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: sentPhone,
      token: code,
      type: 'sms',
    });

    if (error) {
      toast.error(error.message || 'Код буруу эсвэл хугацаа дууссан');
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      await supabase.from('profiles').upsert(
        {
          id: userId,
          phone: sentPhone,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    }

    toast.success('Амжилттай нэвтэрлээ');
    router.push('/');
    router.refresh();
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/login/phone` },
    });
    if (error) {
      toast.error(error.message || 'Google нэвтрэлтэд алдаа гарлаа');
      setGoogleLoading(false);
    }
  };

  const backToPhone = () => {
    setStep('phone');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col safe-area-pb">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition">
          <ChevronLeft className="w-5 h-5 text-gray-600" strokeWidth={2} />
        </Link>
        <Link href="/" className="relative h-8 w-24">
          <Image src="/soyol-logo.png" alt="Soyol" fill className="object-contain" sizes="96px" />
        </Link>
        <div className="w-9" />
      </header>

      <div className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full py-8">
        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Утасны дугаараа оруулна уу
                </h1>
                <p className="text-gray-500 text-sm">
                  Баталгаажуулах код илгээгдэнэ
                </p>
              </div>

              <form onSubmit={handleContinue} className="space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    +976
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                    placeholder="80112233"
                    maxLength={8}
                    className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition"
                    autoFocus
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || phone.replace(/\D/g, '').length !== 8}
                  className="w-full py-4 bg-orange-500 text-white font-semibold rounded-2xl hover:bg-orange-600 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Илгээж байна...
                    </>
                  ) : (
                    <>
                      Үргэлжлүүлэх
                      <ArrowRight className="w-5 h-5" strokeWidth={2} />
                    </>
                  )}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-gray-400 text-sm">эсвэл</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full py-3.5 border-2 border-gray-200 rounded-2xl font-medium text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google-ээр нэвтрэх
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div>
                <button
                  type="button"
                  onClick={backToPhone}
                  className="text-gray-500 text-sm font-medium mb-4 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Өөр дугаар
                </button>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Код оруулна уу</h1>
                <p className="text-gray-500 text-sm">
                  <span className="font-medium text-gray-700">{sentPhone}</span> дугаарт илгээсэн 6 оронтой код
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <input
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 text-2xl text-center tracking-[0.5em] border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition"
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={loading || otp.replace(/\D/g, '').length !== 6}
                  className="w-full py-4 bg-orange-500 text-white font-semibold rounded-2xl hover:bg-orange-600 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Шалгаж байна...
                    </>
                  ) : (
                    <>
                      Баталгаажуулах
                      <ArrowRight className="w-5 h-5" strokeWidth={2} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Код ирээгүй юу? 60 сек дараа дахин илгээх боломжтой
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
