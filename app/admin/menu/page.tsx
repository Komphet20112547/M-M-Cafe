'use client';

import { useState } from 'react';
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem } from '@/lib/api/queries/menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import type { MenuItem } from '@/types';

export default function AdminMenuPage() {
  const { data: menuItems, isLoading } = useMenuItems();
  const { mutate: createMenuItem } = useCreateMenuItem();
  const { mutate: updateMenuItem } = useUpdateMenuItem();
  const { mutate: deleteMenuItem } = useDeleteMenuItem();
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as 'food' | 'drink',
      image: formData.get('image') as string,
      ingredients: formData.get('ingredients')?.toString().split(',').map(s => s.trim()).filter(Boolean),
      warnings: formData.get('warnings')?.toString().split(',').map(s => s.trim()).filter(Boolean),
      isAvailable: formData.get('isAvailable') === 'on',
    };

    if (editingItem) {
      updateMenuItem({ id: editingItem.id, ...data });
    } else {
      createMenuItem(data);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">จัดการเมนู</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)} size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มเมนู
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'แก้ไขข้อมูลเมนู' : 'เพิ่มเมนูอาหารหรือเครื่องดื่มใหม่'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อเมนู</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingItem?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">ราคา (บาท)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={editingItem?.price}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">ประเภท</Label>
                  <select
                    id="category"
                    name="category"
                    defaultValue={editingItem?.category}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    required
                  >
                    <option value="food">อาหาร</option>
                    <option value="drink">เครื่องดื่ม</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL รูปภาพ</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  defaultValue={editingItem?.image}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ingredients">ส่วนผสม (คั่นด้วย comma)</Label>
                <Input
                  id="ingredients"
                  name="ingredients"
                  defaultValue={editingItem?.ingredients?.join(', ')}
                  placeholder="น้ำ, น้ำตาล, ..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warnings">คำเตือน (คั่นด้วย comma)</Label>
                <Input
                  id="warnings"
                  name="warnings"
                  defaultValue={editingItem?.warnings?.join(', ')}
                  placeholder="มีคาเฟอีน, มีนม, ..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  defaultChecked={editingItem?.isAvailable ?? true}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isAvailable">พร้อมจำหน่าย</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {menuItems?.map((item) => (
          <Card key={item.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
              />
            )}
            <CardHeader className="flex-1">
              <CardTitle className="text-base sm:text-lg">{item.name}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-2xl font-bold text-primary mb-3 sm:mb-4">{item.price} บาท</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditingItem(item);
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
                    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้?')) {
                      deleteMenuItem(item.id);
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
