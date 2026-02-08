'use client';

import { useState } from 'react';
import { usePets, useCreatePet, useUpdatePet, useDeletePet } from '@/lib/api/queries/pets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import type { Pet } from '@/types';

export default function AdminPetsPage() {
  const { data: pets, isLoading } = usePets();
  const { mutate: createPet } = useCreatePet();
  const { mutate: updatePet } = useUpdatePet();
  const { mutate: deletePet } = useDeletePet();
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      breed: formData.get('breed') as string,
      age: formData.get('age') ? Number(formData.get('age')) : undefined,
      image: formData.get('image') as string,
      isActive: formData.get('isActive') === 'on',
    };

    if (editingPet) {
      updatePet(
        { id: editingPet.id, ...data },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingPet(null);
          },
          onError: (error: any) => {
            console.error('Update pet error:', error);
            alert(error?.response?.data?.error || 'ไม่สามารถแก้ไขสัตว์เลี้ยงได้');
          },
        }
      );
    } else {
      createPet(data, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingPet(null);
        },
        onError: (error: any) => {
          console.error('Create pet error:', error);
          alert(error?.response?.data?.error || 'ไม่สามารถเพิ่มสัตว์เลี้ยงได้');
        },
      });
    }
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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">จัดการสัตว์เลี้ยง</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPet(null)} size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มสัตว์เลี้ยง
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
            <DialogHeader>
              <DialogTitle>{editingPet ? 'แก้ไขสัตว์เลี้ยง' : 'เพิ่มสัตว์เลี้ยงใหม่'}</DialogTitle>
              <DialogDescription>
                {editingPet ? 'แก้ไขข้อมูลสัตว์เลี้ยง' : 'เพิ่มสัตว์เลี้ยงใหม่'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingPet?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">คำอธิบาย</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingPet?.description}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="breed">พันธุ์</Label>
                  <Input
                    id="breed"
                    name="breed"
                    defaultValue={editingPet?.breed}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">อายุ (ปี)</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    defaultValue={editingPet?.age}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL รูปภาพ</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  defaultValue={editingPet?.image}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  defaultChecked={editingPet?.isActive ?? true}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">พร้อมเล่น</Label>
              </div>
              <Button type="submit" className="w-full">
                {editingPet ? 'บันทึกการแก้ไข' : 'เพิ่มสัตว์เลี้ยง'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {pets?.map((pet) => (
          <Card key={pet.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
            {pet.image && (
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-40 sm:h-48 object-cover rounded-t-lg"
              />
            )}
            <CardHeader className="flex-1">
              <CardTitle className="text-base sm:text-lg">{pet.name}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">{pet.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setEditingPet(pet);
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
                    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสัตว์เลี้ยงนี้?')) {
                      deletePet(pet.id, {
                        onSuccess: () => {
                          // Pet deleted successfully, queries will be invalidated automatically
                        },
                        onError: (error: any) => {
                          console.error('Delete pet error:', error);
                          alert(error?.response?.data?.error || 'ไม่สามารถลบสัตว์เลี้ยงได้');
                        },
                      });
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
