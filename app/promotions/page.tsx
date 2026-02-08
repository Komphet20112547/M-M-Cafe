'use client';

import { useAllPromotions } from '@/lib/api/queries/promotions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PromotionsPage() {
  const { data: promotions, isLoading } = useAllPromotions();

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-6 md:py-8 lg:py-12">
      <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 fade-in">
        <h1 className="text-responsive-lg font-bold mb-2 sm:mb-3 gradient-text px-4">โปรโมชั่น</h1>
        <p className="text-responsive text-muted-foreground px-4">โปรโมชั่นพิเศษสำหรับคุณ</p>
      </div>
      {promotions && promotions.length > 0 ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-2 sm:px-4">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="flex flex-col h-full border-2 border-border/50 rounded-2xl sm:rounded-3xl glass card-hover group overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {promotion.image && (
                <div className="overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                  <img
                    src={promotion.image}
                    alt={promotion.title}
                    className="w-full h-36 xs:h-40 sm:h-44 md:h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
              )}
              <CardHeader className="flex-1 p-4 sm:p-5 md:p-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-sm sm:text-base md:text-lg flex-1 text-primary font-bold">{promotion.title}</CardTitle>
                  {promotion.discount && (
                    <Badge variant="default" className="text-xs sm:text-sm whitespace-nowrap bg-primary shadow-lg animate-pulse shrink-0">
                      ลด {promotion.discount}%
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs sm:text-sm line-clamp-2">
                  {promotion.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-5 md:p-6 pt-0">
                <p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                  วันที่: {new Date(promotion.startDate).toLocaleDateString('th-TH')} -{' '}
                  {new Date(promotion.endDate).toLocaleDateString('th-TH')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 sm:py-16 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">ไม่มีโปรโมชั่นในขณะนี้</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
