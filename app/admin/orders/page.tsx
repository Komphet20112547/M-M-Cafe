'use client';

import { useEffect, useState } from 'react';
import { useAllOrders, useUpdateOrderStatus } from '@/lib/api/queries/orders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { OrderStatus } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { connectSocket } from '@/lib/realtime/client';
import { useAuthStore } from '@/lib/stores/auth-store';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'รอชำระเงิน',
  paid: 'ชำระแล้ว',
  completed: 'สำเร็จ',
  cancelled: 'ยกเลิก',
};

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500',
  paid: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(undefined);
  const { data: orders, isLoading } = useAllOrders(selectedStatus);
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const socket = connectSocket(token);
    if (!socket) return;

    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    socket.on('order:created', refresh);
    socket.on('order:updated', refresh);
    return () => {
      socket.off('order:created', refresh);
      socket.off('order:updated', refresh);
    };
  }, [queryClient]);

  const handleApprove = (orderId: string) => {
    updateStatus({ id: orderId, status: 'paid' });
  };

  const handleComplete = (orderId: string) => {
    updateStatus({ id: orderId, status: 'completed' });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8">จัดการออเดอร์</h1>

      <Tabs
        value={selectedStatus || 'all'}
        onValueChange={(v) => setSelectedStatus(v === 'all' ? undefined : (v as OrderStatus))}
        className="mb-6 sm:mb-8"
      >
        <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
          <TabsTrigger value="all" className="text-xs sm:text-sm">ทั้งหมด</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm">รอชำระ</TabsTrigger>
          <TabsTrigger value="paid" className="text-xs sm:text-sm">ชำระแล้ว</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">สำเร็จ</TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs sm:text-sm">ยกเลิก</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4 sm:space-y-6">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg mb-1">
                      ออเดอร์ #{order.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {order.user?.name} - {new Date(order.createdAt).toLocaleString('th-TH')}
                    </CardDescription>
                  </div>
                  <Badge className={statusColors[order.status]} variant="default">
                    {statusLabels[order.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm sm:text-base">
                      <span className="flex-1 truncate mr-2">
                        {item.menuItem.name} x {item.quantity}
                      </span>
                      <span className="font-semibold whitespace-nowrap">{item.subtotal} บาท</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3 flex justify-between items-center font-bold text-base sm:text-lg">
                    <span>ยอดรวม</span>
                    <span className="text-primary">{order.total} บาท</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => handleApprove(order.id)}
                      className="w-full sm:w-auto"
                      size="sm"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      อนุมัติการชำระเงิน
                    </Button>
                  )}
                  {order.status === 'paid' && (
                    <Button
                      onClick={() => handleComplete(order.id)}
                      variant="default"
                      className="w-full sm:w-auto"
                      size="sm"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      ทำรายการสำเร็จ
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 sm:py-16 text-center">
              <p className="text-muted-foreground text-sm sm:text-base">ไม่มีออเดอร์</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
