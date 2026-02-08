'use client';

import { useState } from 'react';
import { useAllPromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from '@/lib/api/queries/promotions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import type { Promotion } from '@/types';

export default function AdminPromotionsPage() {
  const { data: promotions, isLoading } = useAllPromotions();
  const { mutate: createPromotion } = useCreatePromotion();
  const { mutate: updatePromotion } = useUpdatePromotion();
  const { mutate: deletePromotion } = useDeletePromotion();
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      discount: formData.get('discount') ? Number(formData.get('discount')) : undefined,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      isActive: formData.get('isActive') === 'on',
    };

    if (editingPromotion) {
      updatePromotion({ id: editingPromotion.id, ...data });
    } else {
      createPromotion(data);
    }
    setIsDialogOpen(false);
    setEditingPromotion(null);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">จัดการโปรโมชั่น</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPromotion(null)} size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มโปรโมชั่น
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>{editingPromotion ? 'แก้ไขโปรโมชั่น' : 'เพิ่มโปรโมชั่นใหม่'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">หัวข้อ</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingPromotion?.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingPromotion?.description}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">วันที่เริ่มต้น</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    defaultValue={editingPromotion?.startDate.split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">วันที่สิ้นสุด</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    defaultValue={editingPromotion?.endDate.split('T')[0]}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">ส่วนลด (%)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  defaultValue={editingPromotion?.discount}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL รูปภาพ</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  defaultValue={editingPromotion?.image}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  defaultChecked={editingPromotion?.isActive ?? true}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">ใช้งาน</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingPromotion ? 'บันทึกการแก้ไข' : 'เพิ่มโปรโมชั่น'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {promotions?.map((promotion) => (
          <Card key={promotion.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            {promotion.image && (
              <img
                src={promotion.image}
                alt={promotion.title}
                className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
              />
            )}
            <CardHeader className="flex-1">
              <CardTitle className="text-base sm:text-lg">{promotion.title}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">{promotion.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditingPromotion(promotion);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  แก้ไข
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโปรโมชั่นนี้?')) {
                      deletePromotion(promotion.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  ลบ
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
