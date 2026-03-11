'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMenuItems } from '@/lib/api/queries/menu';
import { useCartStore } from '@/lib/stores/cart-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

export default function MenuPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<'food' | 'drink' | 'all'>('all');
  const { user, isAuthenticated } = useAuthStore();
  const { data: menuItems, isLoading, error } = useMenuItems(
    selectedCategory === 'all' ? undefined : selectedCategory
  );
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const isAdmin = user?.role === 'admin';

  const requireAuthForCart = () => {
    if (isAuthenticated) return true;
    router.push('/login');
    return false;
  };

  const getItemQuantity = (menuItemId: string) => {
    const item = items.find((item) => item.menuItemId === menuItemId);
    return item?.quantity || 0;
  };

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">ไม่สามารถโหลดเมนูได้ กรุณาลองใหม่อีกครั้ง</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-6 md:py-8 lg:py-12">
      <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 fade-in">
        <h1 className="text-responsive-lg font-bold mb-2 sm:mb-3 gradient-text px-4">
          เมนูอาหารและเครื่องดื่ม
        </h1>
        <p className="text-responsive text-muted-foreground px-4">เลือกเมนูที่คุณชื่นชอบ</p>
      </div>

      <Tabs 
        value={selectedCategory} 
        onValueChange={(v) => setSelectedCategory(v as any)} 
        className="mb-5 sm:mb-6 md:mb-8 px-2 sm:px-4"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-xs sm:max-w-md mx-auto bg-muted/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1">
          <TabsTrigger value="all" className="text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">ทั้งหมด</TabsTrigger>
          <TabsTrigger value="food" className="text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">อาหาร</TabsTrigger>
          <TabsTrigger value="drink" className="text-xs sm:text-sm md:text-base rounded-lg sm:rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">เครื่องดื่ม</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-2 sm:px-4">
        {menuItems?.map((item) => {
          const quantity = getItemQuantity(item.id);
          return (
            <Card key={item.id} className="flex flex-col h-full border-2 border-border/50 rounded-2xl sm:rounded-3xl glass card-hover group">
              <CardHeader className="flex-1 p-4 sm:p-5 md:p-6">
                {item.image && (
                  <div className="overflow-hidden rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-36 xs:h-40 sm:h-44 md:h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  </div>
                )}
                <CardTitle className="text-sm sm:text-base md:text-lg mb-2 text-primary font-bold">{item.name}</CardTitle>
                <CardDescription className="text-xs sm:text-sm line-clamp-2">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-4 sm:p-5 md:p-6 pt-0">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary mb-3 gradient-text">{item.price} บาท</p>
                {item.category === 'drink' && item.ingredients && (
                  <div className="mt-3 sm:mt-4">
                    <p className="text-xs sm:text-sm font-semibold mb-1">ส่วนผสม:</p>
                    <ul className="text-xs sm:text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {item.ingredients.map((ing, idx) => (
                        <li key={idx}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.warnings && item.warnings.length > 0 && (
                  <div className="mt-2 sm:mt-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-xs sm:text-sm font-semibold text-primary mb-1">คำเตือน:</p>
                    <ul className="text-xs sm:text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {item.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              {/* Cart controls - Only show for regular users */}
              {!isAdmin && (
                <CardFooter className="flex items-center justify-between gap-2 pt-4">
                  {quantity > 0 ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => {
                          if (!requireAuthForCart()) return;
                          updateQuantity(item.id, quantity - 1);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => {
                          if (!requireAuthForCart()) return;
                          updateQuantity(item.id, quantity + 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        if (!requireAuthForCart()) return;
                        addItem(item);
                      }}
                      className="w-full sm:flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">เพิ่มลงตะกร้า</span>
                      <span className="sm:hidden">เพิ่ม</span>
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
