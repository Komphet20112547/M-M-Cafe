'use client';

import { useState } from 'react';
import { usePets, useTodaySchedules } from '@/lib/api/queries/pets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { QrCode, Clock } from 'lucide-react';

export default function PetsPage() {
  const { data: pets, isLoading: petsLoading, error: petsError } = usePets();
  const { data: schedules, isLoading: schedulesLoading, error: schedulesError } = useTodaySchedules();

  if (petsLoading || schedulesLoading) {
    return (
      <div className="container py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (petsError || schedulesError) {
    return (
      <div className="container py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">ไม่สามารถโหลดข้อมูลสัตว์เลี้ยงได้ กรุณาลองใหม่อีกครั้ง</p>
        </div>
      </div>
    );
  }

  const getPetSchedule = (petId: string) => {
    if (!Array.isArray(schedules) || !petId) return null;
    return schedules.find((schedule) => schedule?.petId === petId) || null;
  };

  const getCurrentTimeSlot = (schedule: any) => {
    if (!schedule || !Array.isArray(schedule.timeSlots) || schedule.timeSlots.length === 0) return null;
    try {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      return schedule.timeSlots.find((slot: any) => {
        if (!slot?.startTime || !slot?.endTime) return false;
        return currentTime >= slot.startTime && currentTime <= slot.endTime;
      }) || null;
    } catch (error) {
      console.error('Error in getCurrentTimeSlot:', error);
      return null;
    }
  };

  const getNextTimeSlot = (schedule: any) => {
    if (!schedule || !Array.isArray(schedule.timeSlots) || schedule.timeSlots.length === 0) return null;
    try {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      return schedule.timeSlots.find((slot: any) => {
        if (!slot?.startTime) return false;
        return slot.startTime > currentTime && 
               slot.isAvailable !== false && 
               slot.isRestTime !== true;
      }) || null;
    } catch (error) {
      console.error('Error in getNextTimeSlot:', error);
      return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            สัตว์เลี้ยง
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">พบกับเพื่อนขนนุ่มของเรา</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
            <Link href="/pets/weekly">
              <Clock className="h-4 w-4 mr-2" />
              ตารางรายสัปดาห์
            </Link>
          </Button>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/pets/scan">
              <QrCode className="h-4 w-4 mr-2" />
              สแกน QR Code
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {pets?.map((pet) => {
          const schedule = getPetSchedule(pet.id);
          const currentSlot = getCurrentTimeSlot(schedule);
          const nextSlot = getNextTimeSlot(schedule);

          return (
            <Card key={pet.id} className="flex flex-col h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <CardHeader className="flex-1">
                {pet.image && (
                  <div className="overflow-hidden rounded-xl mb-3 sm:mb-4">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <CardTitle className="text-base sm:text-lg flex-1 text-primary">{pet.name}</CardTitle>
                  <Badge variant={pet.isActive ? 'default' : 'secondary'} className="text-xs">
                    {pet.isActive ? 'พร้อมเล่น' : 'ไม่พร้อม'}
                  </Badge>
                </div>
                <CardDescription className="text-sm line-clamp-2">{pet.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 flex-1">
                {pet.breed && (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong>พันธุ์:</strong> {pet.breed}
                  </p>
                )}
                {pet.age && (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <strong>อายุ:</strong> {pet.age} ปี
                  </p>
                )}

                {schedule && schedule.timeSlots && schedule.timeSlots.length > 0 ? (
                  <div className="border-t pt-3 sm:pt-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      ตารางเวลาวันนี้
                    </h4>
                    {currentSlot ? (
                      <div className="bg-accent/20 border border-accent/30 p-2 sm:p-3 rounded-xl animate-pulse">
                        <p className="text-xs sm:text-sm font-semibold text-accent-foreground">
                          เล่นได้ตอนนี้!
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentSlot.startTime} - {currentSlot.endTime}
                        </p>
                      </div>
                    ) : nextSlot ? (
                      <div className="bg-primary/10 border border-primary/20 p-2 sm:p-3 rounded-xl">
                        <p className="text-xs sm:text-sm font-semibold text-primary">
                          รอบถัดไป: {nextSlot.startTime} - {nextSlot.endTime}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-muted/30 border border-border/50 p-2 sm:p-3 rounded-xl">
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          ไม่มีรอบเล่นแล้ววันนี้
                        </p>
                      </div>
                    )}
                    {schedule.timeSlots.length > 1 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        ทั้งหมด {schedule.timeSlots.filter((s: any) => s.isAvailable && !s.isRestTime).length} รอบ
                      </p>
                    )}
                  </div>
                ) : schedule && (!schedule.timeSlots || schedule.timeSlots.length === 0) ? (
                  <div className="border-t pt-3 sm:pt-4">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      ยังไม่มีตารางเวลาวันนี้
                    </p>
                  </div>
                ) : null}

                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                    <Link href={`/pets/${pet.id}`}>รายละเอียด</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1 text-xs sm:text-sm">
                    <Link href={`/pets/${pet.id}/qr`}>QR Code</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
