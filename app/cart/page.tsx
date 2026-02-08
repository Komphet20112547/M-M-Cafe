'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/stores/cart-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useCreateOrder } from '@/lib/api/queries/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useEffect } from 'react';
import { getApiErrorMessage } from '@/lib/api/error';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const { mutate: createOrder, isPending, error: orderError } = useCreateOrder();

  // Redirect admin users away from cart page
  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin');
    }
  }, [user, router]);

  if (user?.role === 'admin') {
    return null;
  }

  const handleCheckout = () => {
    const orderItems = items.map((item) => ({
      menuItemId: item.menuItemId,
      quantity: item.quantity,
    }));

    createOrder(orderItems, {
      onSuccess: () => {
        clearCart();
        router.push('/orders');
      },
      onError: (error: any) => {
        console.error('Order creation error:', error);
        alert(error?.response?.data?.error || 'ไม่สามารถสร้างออเดอร์ได้ กรุณาลองใหม่อีกครั้ง');
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ตะกร้าสินค้า
          </h1>
        </div>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 sm:py-16 text-center">
            <p className="text-muted-foreground mb-4 text-base sm:text-lg">ตะกร้าของคุณว่างเปล่า</p>
            <Button asChild size="lg" className="mt-4">
              <a href="/menu">ไปเลือกเมนู</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="text-center mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          ตะกร้าสินค้า
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {items.map((item) => (
            <Card key={item.id} className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg mb-1">{item.menuItem.name}</h3>
                    <p className="text-sm sm:text-base text-muted-foreground line-clamp-2 mb-2">
                      {item.menuItem.description}
                    </p>
                    <p className="text-primary font-semibold text-sm sm:text-base">
                      {item.price} บาท x {item.quantity} = {item.subtotal} บาท
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => removeItem(item.menuItemId)}
                      aria-label="ลบรายการ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:sticky lg:top-20">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-primary">สรุปคำสั่งซื้อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">จำนวนรายการ:</span>
                <span className="font-semibold">{items.length} รายการ</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/50">
                <span className="text-base sm:text-lg font-semibold">ยอดรวม:</span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                  {getTotal()} บาท
                </span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isPending}
              >
                {isPending ? 'กำลังสร้างออเดอร์...' : 'สั่งอาหาร'}
              </Button>
              {orderError && (
                <p className="text-xs sm:text-sm text-destructive text-center">
                  {getApiErrorMessage(orderError, 'เกิดข้อผิดพลาดในการสร้างออเดอร์')}
                </p>
              )}
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                * กรุณาชำระเงินที่เคาน์เตอร์หลังจากสั่งอาหาร
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
