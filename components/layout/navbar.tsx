'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useLogout } from '@/lib/api/queries/auth';
import { useCartStore } from '@/lib/stores/cart-store';
import { ShoppingCart, User, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: logout } = useLogout();
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/menu', label: 'เมนู' },
    { href: '/pets', label: 'สัตว์เลี้ยง' },
    { href: '/promotions', label: 'โปรโมชั่น' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-border/50 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-md">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 md:h-18 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-base sm:text-lg md:text-xl font-bold flex-shrink-0 transition-all duration-300 hover:scale-110 hover:text-primary active:scale-95">
            <span className="gradient-text">🐾 Pet Cafe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm xl:text-base font-medium transition-all duration-300 hover:text-primary px-3 xl:px-4 py-2 rounded-xl xl:rounded-2xl ${
                  pathname === link.href 
                    ? 'text-primary bg-accent/50 shadow-md scale-105' 
                    : 'text-muted-foreground hover:bg-accent/30 hover:scale-105'
                } active:scale-95`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {isAuthenticated ? (
              <>
                {/* Cart - Only for regular users */}
                {user?.role !== 'admin' && (
                  <Link
                    href="/cart"
                    className="relative flex items-center justify-center rounded-xl p-2 hover:bg-accent/50 transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="ตะกร้าสินค้า"
                  >
                    <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground shadow-lg animate-pulse ring-2 ring-background">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}
                {/* Orders - Only for regular users */}
                {user?.role !== 'admin' && (
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 rounded-xl px-3 lg:px-4 py-2 hover:bg-accent/50 transition-all duration-300 text-xs lg:text-sm hover:scale-105 active:scale-95"
                  >
                    <MenuIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden xl:inline">ออเดอร์</span>
                  </Link>
                )}
                {/* Admin Dashboard - Only for admin */}
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-xl px-3 lg:px-4 py-2 hover:bg-accent/50 transition-all duration-300 text-xs lg:text-sm hover:scale-105 active:scale-95"
                  >
                    <User className="h-4 w-4 lg:h-5 lg:w-5" />
                    <span className="hidden xl:inline">จัดการระบบ</span>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="flex items-center gap-2 rounded-xl hover:bg-accent/50 transition-all duration-300 hover:scale-105 active:scale-95 text-xs lg:text-sm"
                >
                  <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="hidden xl:inline">ออกจากระบบ</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hidden lg:flex">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">สมัครสมาชิก</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && user?.role !== 'admin' && (
              <Link
                href="/cart"
                className="relative flex items-center justify-center rounded-xl p-2 hover:bg-accent/50 transition-all duration-300 active:scale-95"
                aria-label="ตะกร้าสินค้า"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground shadow-lg ring-2 ring-background">
                    {itemCount}
                  </span>
                )}
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="เมนู"
              className="rounded-xl hover:bg-accent/50 transition-all duration-300 active:scale-95"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-border/50 py-4 space-y-2 bg-background/95 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 active:scale-95 ${
                  pathname === link.href
                    ? 'text-primary bg-accent/50 shadow-md scale-105'
                    : 'text-muted-foreground hover:bg-accent/30 hover:scale-105'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="px-4 pt-4 space-y-2 border-t mt-2">
                {/* Orders - Only for regular users */}
                {user?.role !== 'admin' && (
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-accent"
                  >
                    <MenuIcon className="h-4 w-4" />
                    ออเดอร์ของฉัน
                  </Link>
                )}
                {/* Admin Dashboard - Only for admin */}
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm hover:bg-accent"
                  >
                    <User className="h-4 w-4" />
                    จัดการระบบ
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-sm hover:bg-accent text-left"
                >
                  <LogOut className="h-4 w-4" />
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              <div className="px-4 pt-4 space-y-2 border-t mt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-md text-sm font-medium hover:bg-accent"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
