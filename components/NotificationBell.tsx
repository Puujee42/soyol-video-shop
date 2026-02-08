'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationBell() {
  const { user } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const displayList = notifications.slice(0, 5);

  const fetchNotifications = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('id, user_id, title, message, is_read, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (!error && data) setNotifications(data as Notification[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications(user.id);
  }, [user?.id]);

  // Real-time: шинэ мэдэгдэл ирэх бүрт улаан цэг + shake + toast
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as Notification;
          setNotifications((prev) => [row, ...prev]);
          setShake(true);
          setTimeout(() => setShake(false), 600);
          toast(`${row.title}: ${row.message}`, { icon: '🔔' });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setOpen(false);
  };

  // Нэвтрээгүй үед: хонх үргэлж харагдана, дарвал нэвтрэх уриалга
  if (!user) {
    return (
      <div className="relative" ref={panelRef}>
        <motion.button
          type="button"
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.15, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors group"
          aria-label="Мэдэгдэл"
        >
          <Bell className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" strokeWidth={1.2} />
        </motion.button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-[280px] bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4"
            >
              <p className="text-sm text-gray-600 mb-3">Мэдэгдлийг харахын тулд нэвтрэнэ үү.</p>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center py-2.5 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
              >
                Нэвтрэх
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative" ref={panelRef}>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        animate={shake ? { x: [0, -6, 6, -6, 6, 0] } : {}}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors group"
        aria-label="Мэдэгдэл"
      >
        <Bell className="w-5 h-5 text-gray-600 group-hover:text-orange-500 transition-colors" strokeWidth={1.2} />
        {/* Шинэ/уншаагүй үед хонхны дээр улаан цэг */}
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"
            aria-hidden
          />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[320px] max-h-[320px] overflow-hidden bg-white rounded-xl shadow-lg border border-gray-200 z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100 font-semibold text-gray-900">
              Мэдэгдэл (сүүлийн 5)
            </div>
            <div className="max-h-[260px] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-500 text-sm">Уншиж байна...</div>
              ) : displayList.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">Мэдэгдэл байхгүй</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {displayList.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => markAsRead(n.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${!n.is_read ? 'bg-orange-50/50' : ''}`}
                      >
                        <p className={`text-sm font-medium ${!n.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.created_at).toLocaleDateString('mn-MN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
