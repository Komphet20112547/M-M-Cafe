'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { QrScanner } from '@/components/qr/qr-scanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePetByQR } from '@/lib/api/queries/pets';
import Link from 'next/link';

export default function QRScanPage() {
  const router = useRouter();
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const { data: pet, isLoading } = usePetByQR(scannedCode || '');

  const handleScan = (data: string) => {
    if (data) {
      setScannedCode(data);
    }
  };

  const handleError = (err: any) => {
    console.error('QR Scan Error:', err);
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/pets">← กลับ</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">สแกน QR Code</CardTitle>
            <CardDescription className="text-sm">
              สแกน QR Code ของสัตว์เลี้ยงหรือเครื่องดื่มเพื่อดูข้อมูล
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <QrScanner onScan={handleScan} onError={handleError} />
            </div>

            {scannedCode && (
              <div className="mt-4">
                <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                  สแกนพบ: <span className="font-mono break-all">{scannedCode}</span>
                </p>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
                  </div>
                ) : pet ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base sm:text-lg">{pet.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {pet.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full sm:w-auto">
                        <Link href={`/pets/${pet.id}`}>ดูรายละเอียด</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-6 text-center">
                      <p className="text-sm text-red-500">ไม่พบข้อมูล</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setScannedCode(null);
              }}
              className="w-full"
            >
              สแกนใหม่
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
