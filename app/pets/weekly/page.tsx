'use client';

import { useWeeklySchedules } from '@/lib/api/queries/pets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import Image from 'next/image';

const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

// Helper: ใช้เวลาไทยในการคิดวันและแปลงเป็น string
const toThailandDateString = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
};

export default function WeeklySchedulePage() {
  const { data: weeklyData, isLoading } = useWeeklySchedules();

  // Get dates for the week
  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);

    const dates: { date: string; dayName: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      dates.push({
        date: toThailandDateString(date),
        dayName: dayNames[i],
      });
    }
    return dates;
  };

  const weekDates = getWeekDates();

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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/pets" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              กลับ
            </Link>
          </Button>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            ตารางสัตว์เลี้ยงรายสัปดาห์
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            ดูสัตว์เลี้ยงที่พร้อมเล่นในแต่ละวันของสัปดาห์
          </p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
        {weekDates.map(({ date, dayName }, index) => {
          const schedules = Array.isArray(weeklyData?.[date]) ? weeklyData[date] : [];
          // Filter pets that have schedules with timeSlots (added by admin)
          const petsWithSchedules = schedules
            .filter(schedule => 
              schedule?.pet?.isActive && 
              Array.isArray(schedule?.timeSlots) && 
              schedule.timeSlots.length > 0
            )
            .map(schedule => ({
              pet: schedule.pet,
              schedule: schedule
            }))
            .filter((item, idx, self) => 
              item.pet?.id && idx === self.findIndex(i => i.pet?.id === item.pet?.id)
            ) as Array<{ pet: any; schedule: any }>;

          const isToday =
            toThailandDateString(new Date()) === date;

          return (
            <Card 
              key={date} 
              className={`border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
                isToday ? 'ring-2 ring-primary/50 shadow-md' : ''
              }`}
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'}`}></div>
                    <div>
                      <CardTitle className="text-lg sm:text-xl text-primary mb-1">
                        วัน{dayName}
                        {isToday && (
                          <Badge variant="default" className="ml-2 text-xs">
                            วันนี้
                          </Badge>
                        )}
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(date + 'T00:00:00+07:00').toLocaleDateString(
                          'th-TH',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    {petsWithSchedules.length} ตัว
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {petsWithSchedules.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {petsWithSchedules.map(({ pet, schedule }) => {
                      if (!pet || !schedule) return null;
                      const hasTimeSlots = Array.isArray(schedule?.timeSlots) && schedule.timeSlots.length > 0;
                      const availableSlots = Array.isArray(schedule?.timeSlots) 
                        ? schedule.timeSlots.filter((slot: any) => slot?.isAvailable !== false && slot?.isRestTime !== true) 
                        : [];
                      
                      return (
                        <Link
                          key={pet.id}
                          href={`/pets/${pet.id}`}
                          className="group"
                        >
                          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-accent/30 hover:border-accent/50 transition-all duration-300 hover:shadow-md">
                            {pet.image ? (
                              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-border/50 group-hover:border-primary/50 transition-colors">
                                <img
                                  src={pet.image}
                                  alt={pet.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            ) : (
                              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl bg-muted flex items-center justify-center text-4xl sm:text-5xl border-2 border-border/50 group-hover:border-primary/50 transition-colors">
                                🐾
                              </div>
                            )}
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                              <h3 className="font-semibold text-sm sm:text-base text-primary group-hover:text-accent transition-colors">
                                {pet.name}
                              </h3>
                              {pet.breed && (
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                  {pet.breed}
                                </p>
                              )}
                              {hasTimeSlots && availableSlots.length > 0 && (
                                <div className="flex items-center justify-center sm:justify-start gap-1 mt-2">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {availableSlots.length} รอบ
                                  </span>
                                </div>
                              )}
                              {hasTimeSlots && availableSlots.length === 0 && (
                                <div className="mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    ไม่มีรอบพร้อมเล่น
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    }).filter(Boolean)}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground text-sm sm:text-base">
                      ไม่มีสัตว์เลี้ยงพร้อมเล่นในวันนี้
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
