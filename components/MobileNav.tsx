'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Нүүр', icon: Home },
  { href: '/categories', label: 'Хайлт', icon: Search },
  { href: '/cart', label: 'Сагс', icon: ShoppingCart },
  { href: '/dashboard', label: 'Профайл', icon: User },
] as const;

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg safe-area-pb"
      aria-label="Гар утасны цэс"
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2 text-gray-500 transition-colors active:bg-gray-100 rounded-lg"
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-6 h-6 shrink-0 ${
                  isActive ? 'text-[#FF7900]' : 'text-gray-500'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
                aria-hidden
              />
              <span
                className={`text-[10px] font-medium truncate max-w-full ${
                  isActive ? 'text-[#FF7900]' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
