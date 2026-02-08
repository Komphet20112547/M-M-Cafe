'use client';

import { useParams } from 'next/navigation';
import { usePet } from '@/lib/api/queries/pets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateQRCode } from '@/lib/utils/qr';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PetQRPage() {
  const params = useParams();
  const petId = params.id as string;
  const { data: pet, isLoading } = usePet(petId);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pet?.qrCode) {
      generateQRCode(pet.qrCode).then(setQrCodeDataUrl).catch(console.error);
    }
  }, [pet]);

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
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href={`/pets/${pet.id}`}>← กลับ</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl text-center sm:text-left">
              QR Code - {pet.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 sm:space-y-6">
            {qrCodeDataUrl && (
              <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code" 
                  className="w-48 h-48 sm:w-64 sm:h-64"
                />
              </div>
            )}
            <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md">
              สแกน QR Code นี้เพื่อดูข้อมูลสัตว์เลี้ยง
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
