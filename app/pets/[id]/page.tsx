'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { usePet, usePetSchedule } from '@/lib/api/queries/pets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { QrCode, Clock, Calendar } from 'lucide-react';

export default function PetDetailPage() {
  const params = useParams();
  const petId = params.id as string;
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { data: pet, isLoading } = usePet(petId);
  const { data: schedule, isLoading: scheduleLoading } = usePetSchedule(petId, selectedDate);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <Card>
          <CardContent className="py-12 sm:py-16 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">ไม่พบข้อมูลสัตว์เลี้ยง</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/pets">← กลับ</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div>
            {pet.image && (
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
              />
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">{pet.name}</h1>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Badge variant={pet.isActive ? 'default' : 'secondary'} className="text-xs sm:text-sm">
                {pet.isActive ? 'พร้อมเล่น' : 'ไม่พร้อม'}
              </Badge>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              {pet.description}
            </p>

            <div className="space-y-2 mb-4 sm:mb-6">
              {pet.breed && (
                <p className="text-sm sm:text-base">
                  <strong>พันธุ์:</strong> {pet.breed}
                </p>
              )}
              {pet.age && (
                <p className="text-sm sm:text-base">
                  <strong>อายุ:</strong> {pet.age} ปี
                </p>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3">
              <Button asChild size="sm" className="flex-1 sm:flex-none">
                <Link href={`/pets/${pet.id}/qr`}>
                  <QrCode className="h-4 w-4 mr-2" />
                  ดู QR Code
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Card className="mt-6 sm:mt-8 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                ตารางเวลาเล่น
              </CardTitle>
              <div className="flex items-center gap-3">
                <Label htmlFor="schedule-date" className="text-sm whitespace-nowrap">เลือกวันที่:</Label>
                <Input
                  id="schedule-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {scheduleLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
              </div>
            ) : schedule && schedule.timeSlots && schedule.timeSlots.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {new Date(schedule.date).toLocaleDateString('th-TH', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {schedule.timeSlots.map((slot) => {
                    if (!slot?.startTime || !slot?.endTime) return null;
                    try {
                      const now = new Date();
                      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                      const isCurrentSlot = schedule.date === new Date().toISOString().split('T')[0] &&
                        currentTime >= slot.startTime && currentTime <= slot.endTime;
                    
                      return (
                        <div
                          key={slot.id || `slot-${Math.random()}`}
                          className={`p-3 sm:p-4 rounded-lg border transition-all duration-300 ${
                            isCurrentSlot
                              ? 'ring-2 ring-primary shadow-lg scale-105'
                              : slot.isRestTime
                              ? 'bg-muted/50 border-border/50'
                              : slot.isAvailable !== false
                              ? 'bg-accent/20 border-accent/50 hover:shadow-md'
                              : 'bg-destructive/10 border-destructive/30 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className={`h-3 w-3 sm:h-4 sm:w-4 ${isCurrentSlot ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className={`font-semibold text-xs sm:text-sm ${isCurrentSlot ? 'text-primary' : ''}`}>
                              {slot.startTime} - {slot.endTime}
                            </p>
                            {isCurrentSlot && (
                              <Badge variant="default" className="text-xs px-1.5 py-0">
                                ตอนนี้
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {slot.isRestTime
                              ? 'เวลาพัก'
                              : slot.isAvailable !== false
                              ? 'พร้อมเล่น'
                              : 'ไม่พร้อม'}
                          </p>
                        </div>
                      );
                    } catch (error) {
                      console.error('Error rendering slot:', error);
                      return null;
                    }
                  }).filter(Boolean)}
                </div>
              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm sm:text-base text-muted-foreground mb-2">
                  ยังไม่มีตารางเวลาสำหรับวันที่เลือก
                </p>
                <p className="text-xs text-muted-foreground">
                  กรุณาเลือกวันที่อื่นหรือติดต่อผู้ดูแลระบบ
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
