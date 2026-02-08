'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';

const publicRoutes = ['/login', '/register', '/'];
const adminRoutes = ['/admin'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!pathname) {
      setIsChecking(false);
      return;
    }

    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

    // Allow public routes without authentication
    if (isPublicRoute) {
      setIsChecking(false);
      return;
    }

    // Check authentication for protected routes
    if (!token) {
      router.push('/login');
      setIsChecking(false);
      return;
    }

    // If we have a token but no user data yet, wait for it to load from persisted store
    if (token && !user) {
      // Get user from store directly (might be loading from localStorage)
      const currentUser = useAuthStore.getState().user;
      
      if (!currentUser) {
        // If still no user after token exists, might need to fetch from API
        // But for now, allow access and let API handle auth
        setIsChecking(false);
        return;
      }
      
      // Check admin access after user is loaded
      if (isAdminRoute && currentUser.role !== 'admin') {
        router.push('/');
        setIsChecking(false);
        return;
      }
      
      setIsChecking(false);
      return;
    }

    // Check admin access when user is available
    if (isAdminRoute && user && user.role !== 'admin') {
      router.push('/');
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [isAuthenticated, user, pathname, router, token]);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
