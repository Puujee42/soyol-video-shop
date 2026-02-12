'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SignInPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordLogin, setIsPasswordLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 8) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      if (data.code) {
        toast.success(`Code sent! Dev: ${data.code}`, { duration: 5000, icon: '🔓' });
        router.push(`/verify?phone=${encodeURIComponent(phone)}&code=${data.code}`);
      } else {
        toast.success('Code sent!');
        router.push(`/verify?phone=${encodeURIComponent(phone)}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 8 || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      toast.success('Successfully logged in!');

      // Update Auth Context immediately
      if (data.user) {
        login(data.user);
      }

      router.push('/');
      router.refresh();

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 mb-2">Нэвтрэх</h1>
          <p className="text-slate-500 text-sm">
            {isPasswordLogin ? 'Нууц үгээр нэвтрэх' : 'Утасны дугаараа оруулна уу'}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setIsPasswordLogin(false)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isPasswordLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            SMS Код
          </button>
          <button
            onClick={() => setIsPasswordLogin(true)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isPasswordLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Нууц үг
          </button>
        </div>

        <form onSubmit={isPasswordLogin ? handlePasswordLogin : handleSendOtp} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-xs font-bold text-slate-900 uppercase tracking-wider ml-1">
                Утасны дугаар
              </label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#F57E20] transition-colors" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="99112233"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#F57E20]/20 focus:border-[#F57E20] outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  autoFocus
                />
              </div>
            </div>

            {isPasswordLogin && (
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-bold text-slate-900 uppercase tracking-wider ml-1">
                  Нууц үг
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#F57E20] transition-colors" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#F57E20]/20 focus:border-[#F57E20] outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#F57E20] hover:bg-[#e66d00] text-white rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {isPasswordLogin ? 'Нэвтрэх' : 'Үргэлжлүүлэх'}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Бүртгэлгүй юу? <Link href="/sign-up" className="text-[#F57E20] font-bold hover:underline">Бүртгүүлэх</Link>
        </p>
      </div>
    </div>
  );
}
