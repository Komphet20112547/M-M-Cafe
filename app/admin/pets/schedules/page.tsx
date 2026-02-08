'use client';

import { useState, useEffect } from 'react';
import { usePets, usePetSchedule, useUpdatePetSchedule, useDeletePetSchedule, useDeletePetScheduleTimeSlot } from '@/lib/api/queries/pets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Clock, Calendar } from 'lucide-react';
import type { TimeSlot } from '@/types';

export default function AdminSchedulesPage() {
  const { data: pets, isLoading: petsLoading } = usePets();
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const { data: schedule, isLoading: scheduleLoading, refetch: refetchSchedule } = usePetSchedule(
    selectedPetId,
    selectedDate
  );
  const { mutate: updateSchedule, isPending: isUpdating } = useUpdatePetSchedule();
  const { mutate: deleteSchedule, isPending: isDeleting } = useDeletePetSchedule();
  const { mutate: deleteSlotMutate, isPending: isDeletingSlot } = useDeletePetScheduleTimeSlot();

  // Update timeSlots when schedule data changes
  useEffect(() => {
    if (schedule?.timeSlots && schedule.timeSlots.length > 0) {
      setTimeSlots(schedule.timeSlots);
    } else if (schedule && (!schedule.timeSlots || schedule.timeSlots.length === 0)) {
      setTimeSlots([]);
    } else if (!schedule && selectedPetId) {
      // If no schedule found, reset to empty
      setTimeSlots([]);
    }
  }, [schedule, selectedPetId]);

  const handleAddSlot = () => {
    setEditingSlotIndex(null);
    setIsDialogOpen(true);
  };

  const handleEditSlot = (index: number) => {
    setEditingSlotIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteSlot = (index: number) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบช่วงเวลานี้?')) {
      const slot = timeSlots[index];
      // If slot has been saved on server (schedule exists and slot has id), call API to delete single slot
      if (slot?.id && schedule && schedule.id) {
        deleteSlotMutate(
          { petId: selectedPetId, slotId: slot.id },
          {
            onSuccess: () => {
              // remove locally as well
              const newSlots = timeSlots.filter((_, i) => i !== index);
              setTimeSlots(newSlots);
              refetchSchedule();
              alert('ลบช่วงเวลาเรียบร้อยแล้ว');
            },
            onError: (error: any) => {
              console.error('Delete slot error:', error);
              alert(error?.response?.data?.error || 'ไม่สามารถลบช่วงเวลาได้');
            },
          }
        );
      } else {
        const newSlots = timeSlots.filter((_, i) => i !== index);
        setTimeSlots(newSlots);
      }
    }
  };

  const handleSaveSlot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Ensure time format is always HH:MM
    const startTimeRaw = formData.get('startTime') as string;
    const endTimeRaw = formData.get('endTime') as string;
    const startTime = startTimeRaw ? startTimeRaw.slice(0, 5) : '';
    const endTime = endTimeRaw ? endTimeRaw.slice(0, 5) : '';
    const slot: TimeSlot = {
      id: editingSlotIndex !== null ? timeSlots[editingSlotIndex].id : `${Date.now()}-${Math.random()}`,
      startTime,
      endTime,
      isAvailable: formData.get('isAvailable') === 'on',
      isRestTime: formData.get('isRestTime') === 'on',
      maxRounds: Number(formData.get('maxRounds')),
      currentRound: editingSlotIndex !== null ? timeSlots[editingSlotIndex].currentRound : 0,
    };

    if (editingSlotIndex !== null) {
      const newSlots = [...timeSlots];
      newSlots[editingSlotIndex] = slot;
      setTimeSlots(newSlots);
    } else {
      setTimeSlots([...timeSlots, slot]);
    }
    setIsDialogOpen(false);
    setEditingSlotIndex(null);
  };

  const handleSaveSchedule = () => {
    if (!selectedPetId) {
      alert('กรุณาเลือกสัตว์เลี้ยง');
      return;
    }

    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      alert('กรุณาเพิ่มช่วงเวลาอย่างน้อย 1 ช่วงเวลา');
      return;
    }

    // Validate and normalize time slots
    const normalizedSlots = timeSlots.map(slot => ({
      ...slot,
      startTime: slot.startTime ? slot.startTime.slice(0, 5) : '',
      endTime: slot.endTime ? slot.endTime.slice(0, 5) : '',
    }));
    for (const slot of normalizedSlots) {
      if (!slot.startTime || !slot.endTime) {
        alert('กรุณากรอกเวลาเริ่มต้นและเวลาสิ้นสุดให้ครบถ้วน');
        return;
      }
      // Check valid HH:MM format
      if (!/^\d{2}:\d{2}$/.test(slot.startTime) || !/^\d{2}:\d{2}$/.test(slot.endTime)) {
        alert('รูปแบบเวลาต้องเป็น HH:MM');
        return;
      }
      if (slot.startTime >= slot.endTime) {
        alert('เวลาเริ่มต้นต้องน้อยกว่าเวลาสิ้นสุด');
        return;
      }
      if (typeof slot.maxRounds !== 'number' || slot.maxRounds <= 0) {
        alert('จำนวนรอบต้องเป็นตัวเลขที่มากกว่า 0');
        return;
      }
    }
    // ...existing code...
    updateSchedule(
      {
        petId: selectedPetId,
        date: selectedDate,
        timeSlots: normalizedSlots,
      },
      {
        onSuccess: () => {
          refetchSchedule();
          alert('บันทึกตารางเวลาเรียบร้อยแล้ว');
        },
        onError: (error: any) => {
          console.error('Update schedule error:', error);
          const errorMessage = error?.response?.data?.error || error?.message || 'ไม่สามารถบันทึกตารางเวลาได้';
          alert(errorMessage);
        },
      }
    );

    updateSchedule(
      {
        petId: selectedPetId,
        date: selectedDate,
        timeSlots,
      },
      {
        onSuccess: () => {
          // Refetch the current schedule to show updated data
          refetchSchedule();
          alert('บันทึกตารางเวลาเรียบร้อยแล้ว');
        },
        onError: (error: any) => {
          console.error('Update schedule error:', error);
          const errorMessage = error?.response?.data?.error || error?.message || 'ไม่สามารถบันทึกตารางเวลาได้';
          alert(errorMessage);
        },
      }
    );
  };

  const selectedPet = pets?.find((p) => p.id === selectedPetId);
  const editingSlot = editingSlotIndex !== null ? timeSlots[editingSlotIndex] : null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">จัดการตารางเวลา</h1>
        <p className="text-muted-foreground text-sm sm:text-base">จัดการตารางเวลาเล่นสัตว์เลี้ยง</p>
      </div>

      {/* Selection Controls */}
      <Card className="mb-6 sm:mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">เลือกสัตว์เลี้ยงและวันที่</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="pet">สัตว์เลี้ยง</Label>
              <select
                id="pet"
                value={selectedPetId}
                onChange={(e) => {
                  setSelectedPetId(e.target.value);
                  setTimeSlots([]);
                }}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">-- เลือกสัตว์เลี้ยง --</option>
                {pets?.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">วันที่</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setTimeSlots([]);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {petsLoading || scheduleLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      ) : selectedPetId ? (
        <>
          {/* Pet Info */}
          {selectedPet && (
            <Card className="mb-6 sm:mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  {selectedPet.image && (
                    <img
                      src={selectedPet.image}
                      alt={selectedPet.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold">{selectedPet.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedPet.breed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Time Slots Management */}
          <Card className="mb-6 sm:mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl">ช่วงเวลา</CardTitle>
                  <CardDescription className="text-sm">
                    จัดการช่วงเวลาเล่นสำหรับวันที่ {new Date(selectedDate).toLocaleDateString('th-TH')}
                  </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddSlot} size="sm" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      เพิ่มช่วงเวลา
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md w-[95vw] sm:w-full">
                    <DialogHeader>
                      <DialogTitle>
                        {editingSlotIndex !== null ? 'แก้ไขช่วงเวลา' : 'เพิ่มช่วงเวลาใหม่'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingSlotIndex !== null
                          ? 'แก้ไขข้อมูลช่วงเวลา'
                          : 'เพิ่มช่วงเวลาใหม่สำหรับสัตว์เลี้ยง'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveSlot} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startTime">เวลาเริ่มต้น</Label>
                          <Input
                            id="startTime"
                            name="startTime"
                            type="time"
                            defaultValue={editingSlot?.startTime || '09:00'}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endTime">เวลาสิ้นสุด</Label>
                          <Input
                            id="endTime"
                            name="endTime"
                            type="time"
                            defaultValue={editingSlot?.endTime || '10:00'}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxRounds">จำนวนรอบสูงสุด</Label>
                        <Input
                          id="maxRounds"
                          name="maxRounds"
                          type="number"
                          min="1"
                          defaultValue={editingSlot?.maxRounds || 5}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isAvailable"
                          name="isAvailable"
                          defaultChecked={editingSlot?.isAvailable !== false}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="isAvailable">พร้อมเล่น</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isRestTime"
                          name="isRestTime"
                          defaultChecked={editingSlot?.isRestTime || false}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="isRestTime">เวลาพัก</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" className="flex-1">
                          {editingSlotIndex !== null ? 'บันทึกการแก้ไข' : 'เพิ่ม'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setEditingSlotIndex(null);
                          }}
                        >
                          ยกเลิก
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
                {timeSlots.length > 0 ? (
                  <div className="space-y-3">
                    {timeSlots.map((slot, index) => (
                      <div
                        key={slot.id || index}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 border border-border/50 rounded-lg bg-background/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            {slot.isRestTime && (
                              <span className="text-xs px-2 py-1 bg-muted rounded-full">เวลาพัก</span>
                            )}
                            {!slot.isAvailable && (
                              <span className="text-xs px-2 py-1 bg-destructive/10 text-destructive rounded-full">
                                ไม่พร้อม
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            สูงสุด {slot.maxRounds} รอบ (ปัจจุบัน: {slot.currentRound || 0} รอบ)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditSlot(index)}
                          >
                            แก้ไข
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSlot(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>ยังไม่มีช่วงเวลา</p>
                    <p className="text-sm">คลิก "เพิ่มช่วงเวลา" เพื่อเพิ่มช่วงเวลาใหม่</p>
                  </div>
                )}
              </CardContent>
            </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6 sm:mb-8">
            {schedule && schedule.id && (
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบตารางเวลาทั้งหมดสำหรับวันนี้?')) {
                    deleteSchedule(
                      {
                        petId: selectedPetId,
                        date: selectedDate,
                      },
                      {
                        onSuccess: () => {
                          setTimeSlots([]);
                          refetchSchedule();
                          alert('ลบตารางเวลาเรียบร้อยแล้ว');
                        },
                        onError: (error: any) => {
                          console.error('Delete schedule error:', error);
                          alert(error?.response?.data?.error || 'ไม่สามารถลบตารางเวลาได้');
                        },
                      }
                    );
                  }
                }}
                disabled={isDeleting}
                size="lg"
              >
                {isDeleting ? 'กำลังลบ...' : 'ลบตารางเวลาทั้งหมด'}
              </Button>
            )}
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleSaveSchedule}
                disabled={isUpdating || timeSlots.length === 0}
                size="lg"
              >
                {isUpdating ? 'กำลังบันทึก...' : 'บันทึกตารางเวลา'}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="py-12 sm:py-16 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-base sm:text-lg mb-2">
              กรุณาเลือกสัตว์เลี้ยงและวันที่
            </p>
            <p className="text-sm text-muted-foreground">
              เลือกสัตว์เลี้ยงและวันที่เพื่อเริ่มจัดการตารางเวลา
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
