'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRegister } from '@/lib/api/queries/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import type { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as UserRole,
    secretCode: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      return;
    }
    if (formData.password.length < 6) {
      alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (formData.role === 'admin' && formData.adminCode !== 'M&M') {
      alert('รหัสสมัคร Admin ไม่ถูกต้อง');
      return;
    }

    register(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        secretCode: formData.secretCode,
      },
      {
        onSuccess: () => {
          router.push('/');
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-200px)] py-8 sm:py-12">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            สมัครสมาชิก
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">สร้างบัญชีใหม่เพื่อใช้งาน</p>
        </div>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อ</Label>
            <Input
              id="name"
              type="text"
              placeholder="ชื่อของคุณ"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">อีเมล</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">รหัสผ่าน</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-3">
            <Label>ประเภทบัญชี</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="role-user" />
                <Label htmlFor="role-user" className="font-normal cursor-pointer flex-1">
                  <div>
                    <div className="font-semibold">บัญชีผู้ใช้ทั่วไป</div>
                    <div className="text-xs text-muted-foreground">
                      สำหรับสั่งอาหาร ดูสัตว์เลี้ยง และรีวิว
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="role-admin" />
                <Label htmlFor="role-admin" className="font-normal cursor-pointer flex-1">
                  <div>
                    <div className="font-semibold">บัญชีผู้ดูแลระบบ</div>
                    <div className="text-xs text-muted-foreground">
                      สำหรับจัดการเมนู ออเดอร์ และระบบทั้งหมด
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
              {formData.role === 'admin' && (
                <Card className="border-primary/30 bg-primary/5 backdrop-blur-sm">
                  <CardContent className="pt-4">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      ⚠️ <strong>คำเตือน:</strong> บัญชีผู้ดูแลระบบมีสิทธิ์เข้าถึงและจัดการข้อมูลทั้งหมดของระบบ กรุณาใช้อย่างระมัดระวัง
                    </p>
                    <div className="mt-3 space-y-2">
                      <Label htmlFor="secretCode">รหัสลับร้าน (สำหรับสมัครเป็น Admin)</Label>
                      <Input
                        id="secretCode"
                        type="text"
                        placeholder="กรอกรหัสลับของทางร้าน"
                        value={formData.secretCode}
                        onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
                        required={formData.role === 'admin'}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
            </Button>
          </form>
        </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" className="text-primary hover:underline transition-all duration-300 hover:text-accent">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
