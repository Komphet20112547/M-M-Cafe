'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { QrCode, Clock, Calendar, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useBanners, usePromotions } from '@/lib/api/queries/promotions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const { data: banners, isLoading: bannersLoading } = useBanners();
  const { data: promotions, isLoading: promotionsLoading } = usePromotions();
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
      {/* Banners Section */}
      {banners && Array.isArray(banners) && banners.length > 0 && (
        <section className="mb-6 sm:mb-8 md:mb-12 lg:mb-16 fade-in">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
            {banners
              .filter((banner: any) => banner?.isActive !== false)
              .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
              .slice(0, 3)
              .map((banner: any) => {
                const BannerContent = (
                  <Card
                    className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm group h-full rounded-xl sm:rounded-2xl hover:shadow-lg transition-all duration-300 w-full sm:w-auto sm:max-w-md lg:max-w-lg"
                  >
                    {banner.image ? (
                      <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-t-xl sm:rounded-t-2xl">
                        <img
                          src={banner.image}
                          alt={banner.title || 'Banner'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {(banner.title || banner.description) && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                            <div className="p-4 sm:p-5 md:p-6 w-full">
                              {banner.title && (
                                <h3 className="text-white font-semibold text-lg sm:text-xl md:text-2xl mb-1.5">
                                  {banner.title}
                                </h3>
                              )}
                              {banner.description && (
                                <p className="text-white/90 text-sm sm:text-base line-clamp-2">
                                  {banner.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <CardContent className="p-5 sm:p-6 md:p-8">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-primary">
                              {banner.title || 'Banner'}
                            </h3>
                          </div>
                          {banner.description && (
                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                              {banner.description}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );

                return banner.link ? (
                  <Link 
                    key={banner.id} 
                    href={banner.link} 
                    className="block h-full"
                  >
                    {BannerContent}
                  </Link>
                ) : (
                  <div key={banner.id}>{BannerContent}</div>
                );
              })}
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="mb-8 sm:mb-12 md:mb-16 lg:mb-20 text-center fade-in">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          <h1 className="text-responsive-xl font-bold leading-[1.1] tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent px-2 sm:px-4">
            ยินดีต้อนรับสู่ 🐾 Pet Cafe
          </h1>
          <p className="text-responsive text-muted-foreground max-w-3xl mx-auto px-4 sm:px-6 leading-relaxed">
            ร้านคาเฟ่ที่มีสัตว์เลี้ยงน่ารัก พร้อมอาหารและเครื่องดื่มอร่อย
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 mt-6 sm:mt-8 md:mt-10">
          {/* QR Scan Button - Center */}
          <Button 
            asChild 
            size="lg" 
            className="w-full xs:w-auto min-w-[180px] sm:min-w-[220px] md:min-w-[260px] h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-2xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Link href="/pets/scan" className="flex items-center justify-center gap-2 sm:gap-3">
              <QrCode className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              <span>สแกน QR Code</span>
            </Link>
          </Button>
          {/* Other Buttons */}
          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-stretch xs:items-center w-full xs:w-auto">
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="w-full xs:w-auto min-w-[140px] sm:min-w-[160px] h-11 sm:h-12 md:h-14 rounded-xl sm:rounded-2xl border-2 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/menu" className="text-sm sm:text-base md:text-lg">ดูเมนู</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="w-full xs:w-auto min-w-[140px] sm:min-w-[160px] h-11 sm:h-12 md:h-14 rounded-xl sm:rounded-2xl border-2 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/pets" className="text-sm sm:text-base md:text-lg">ดูสัตว์เลี้ยง</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-8 sm:mb-12 md:mb-16 lg:mb-20 fade-in">
        <h2 className="text-responsive-lg font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 gradient-text px-4">
          ทำไมต้อง Pet Cafe?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto px-2 sm:px-4">
          <div className="p-5 sm:p-6 md:p-8 border-2 border-border/50 rounded-2xl sm:rounded-3xl glass card-hover group">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-500 ease-out"></div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-primary">สัตว์เลี้ยงน่ารัก</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              เล่นกับสัตว์เลี้ยงน่ารัก พร้อมดูตารางเวลาเล่น
            </p>
          </div>
          <div className="p-5 sm:p-6 md:p-8 border-2 border-border/50 rounded-2xl sm:rounded-3xl glass card-hover group">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-500 ease-out"></div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-primary">อาหารและเครื่องดื่ม</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              เมนูอาหารและเครื่องดื่มอร่อย สั่งผ่านเว็บไซต์ได้เลย
            </p>
          </div>
          <div className="p-5 sm:p-6 md:p-8 border-2 border-border/50 rounded-2xl sm:rounded-3xl glass card-hover group sm:col-span-2 lg:col-span-1">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-500 ease-out"></div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 text-primary">รีวิวและคะแนน</h3>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              ให้คะแนนและรีวิวร้านของคุณ
            </p>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      {promotions && Array.isArray(promotions) && promotions.length > 0 && (
        <section className="mb-8 sm:mb-12 md:mb-16 lg:mb-20 fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8 px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary flex items-center gap-2 sm:gap-3">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 animate-pulse" />
              <span className="gradient-text">โปรโมชั่นพิเศษ</span>
            </h2>
            <Button asChild variant="outline" size="sm" className="hidden sm:flex rounded-xl sm:rounded-2xl border-2 hover:border-primary/50">
              <Link href="/promotions" className="text-xs sm:text-sm md:text-base">
                ดูทั้งหมด
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4">
            {promotions
              .filter((promo: any) => {
                if (promo?.isActive === false) return false;
                // Check if promotion is currently active based on dates
                if (promo?.startDate && promo?.endDate) {
                  const now = new Date();
                  const start = new Date(promo.startDate);
                  const end = new Date(promo.endDate);
                  return now >= start && now <= end;
                }
                return true;
              })
              .slice(0, 3)
              .map((promo: any) => (
                <Card
                  key={promo.id}
                  className="overflow-hidden border-2 border-border/50 rounded-2xl sm:rounded-3xl glass card-hover group"
                >
                  {promo.image ? (
                    <div className="relative w-full h-40 xs:h-48 sm:h-56 md:h-60 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                      <img
                        src={promo.image}
                        alt={promo.title || 'Promotion'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <Badge variant="default" className="text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 shadow-lg animate-pulse">
                          -{promo.discount}%
                        </Badge>
                      </div>
                    </div>
                  ) : null}
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-primary flex-1">
                        {promo.title || 'โปรโมชั่น'}
                      </h3>
                      {!promo.image && (
                        <Badge variant="default" className="text-sm font-bold px-3 py-1 flex-shrink-0">
                          -{promo.discount}%
                        </Badge>
                      )}
                    </div>
                    {promo.description && (
                      <p className="text-sm sm:text-base text-muted-foreground mb-3 line-clamp-2">
                        {promo.description}
                      </p>
                    )}
                    {promo.startDate && promo.endDate && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(promo.startDate).toLocaleDateString('th-TH')} - {new Date(promo.endDate).toLocaleDateString('th-TH')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
          {promotions.filter((promo: any) => {
            if (promo?.isActive === false) return false;
            if (promo?.startDate && promo?.endDate) {
              const now = new Date();
              const start = new Date(promo.startDate);
              const end = new Date(promo.endDate);
              return now >= start && now <= end;
            }
            return true;
          }).length > 3 && (
            <div className="text-center mt-6">
              <Button asChild variant="outline" size="lg">
                <Link href="/promotions">ดูโปรโมชั่นทั้งหมด</Link>
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Quick Links */}
      <section className="mb-8 sm:mb-12 md:mb-16 fade-in">
        <h2 className="text-responsive-lg font-bold text-center mb-5 sm:mb-6 md:mb-8 lg:mb-10 gradient-text px-4">
          เริ่มต้นใช้งาน
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 max-w-4xl mx-auto px-3 sm:px-4">
          <Button asChild variant="outline" className="h-auto py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg group rounded-xl sm:rounded-2xl border-2 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Link href="/menu" className="flex items-center justify-center gap-2 sm:gap-3 w-full">
              <span className="text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">📋</span>
              <span className="text-left flex-1 text-xs sm:text-sm md:text-base">ดูเมนูอาหารและเครื่องดื่ม</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg group rounded-xl sm:rounded-2xl border-2 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Link href="/pets" className="flex items-center justify-center gap-2 sm:gap-3 w-full">
              <span className="text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">🐾</span>
              <span className="text-left flex-1 text-xs sm:text-sm md:text-base">ดูสัตว์เลี้ยงและตารางเวลา</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg group rounded-xl sm:rounded-2xl border-2 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Link href="/promotions" className="flex items-center justify-center gap-2 sm:gap-3 w-full">
              <span className="text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">🎉</span>
              <span className="text-left flex-1 text-xs sm:text-sm md:text-base">ดูโปรโมชั่น</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg group rounded-xl sm:rounded-2xl border-2 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            <Link href="/reviews" className="flex items-center justify-center gap-2 sm:gap-3 w-full">
              <span className="text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">⭐</span>
              <span className="text-left flex-1 text-xs sm:text-sm md:text-base">ดูรีวิว</span>
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
