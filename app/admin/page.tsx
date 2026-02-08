'use client';

import { useDashboardStats } from '@/lib/api/queries/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardChart } from '@/components/admin/dashboard-chart';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, DollarSign, Clock, Star } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
            <p className="text-muted-foreground">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-destructive">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลได้'}
          </p>
          <p className="text-sm text-muted-foreground">
            กรุณาตรวจสอบว่าคุณมีสิทธิ์เข้าถึงหน้านี้
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          แดชบอร์ดผู้ดูแลระบบ
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">ภาพรวมระบบและการจัดการ</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ออเดอร์ทั้งหมด</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.totalOrders || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.totalRevenue || 0} บาท</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ออเดอร์รอชำระ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.pendingOrders || 0}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คะแนนเฉลี่ย</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats?.averageRating !== undefined && stats.averageRating !== null 
                ? stats.averageRating.toFixed(1) 
                : '0.0'}
            </div>
            <p className="text-xs text-muted-foreground">
              จาก {stats?.totalReviews || 0} รีวิว
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">กราฟรายได้</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px] lg:h-[350px]">
              <DashboardChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 text-sm sm:text-base hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <Link href="/admin/menu">จัดการเมนู</Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 text-sm sm:text-base hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <Link href="/admin/orders">จัดการออเดอร์</Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 text-sm sm:text-base hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <Link href="/admin/pets">จัดการสัตว์เลี้ยง</Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 text-sm sm:text-base hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <Link href="/admin/promotions">จัดการโปรโมชั่น</Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 text-sm sm:text-base hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <Link href="/admin/banners">จัดการ Banner</Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 sm:py-6 text-sm sm:text-base hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
          <Link href="/admin/pets/schedules">จัดการตารางเวลา</Link>
        </Button>
      </div>
    </div>
  );
}
