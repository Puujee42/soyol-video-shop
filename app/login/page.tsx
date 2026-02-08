'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Supabase OAuth callback: hash contains access_token & refresh_token
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success('Амжилттай нэвтэрлээ!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error('Алдаа гарлаа. Дахин оролдоно уу');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/login`,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) {
        toast.error(error.message || 'Google нэвтрэлтэд алдаа гарлаа');
        setGoogleLoading(false);
      }
      // Redirect happens via OAuth; no need to setGoogleLoading(false) here
    } catch (error) {
      toast.error('Google нэвтрэлтэд алдаа гарлаа');
      setGoogleLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Тавтай морил
          </h1>
          <p className="text-slate-600">
            Өөрийн бүртгэлдээ нэвтрэнэ үү
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
        >
          
          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border-2 border-slate-200 rounded-full font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google-ээр нэвтрэх</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Эсвэл</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                И-мэйл хаяг
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" strokeWidth={2} />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="block w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Нууц үг
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" strokeWidth={2} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={2} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={2} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-slate-600">Намайг сана</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">
                Нууц үг мартсан?
              </Link>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Нэвтэрч байна...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" strokeWidth={2} />
                  <span>Нэвтрэх</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Бүртгэлгүй юу?{' '}
              <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                Бүртгүүлэх
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Phone Login Alternative */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-center"
        >
          <Link href="/login/phone" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            Утасны дугаараар нэвтрэх →
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
