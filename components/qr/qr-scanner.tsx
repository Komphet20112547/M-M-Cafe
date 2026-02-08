'use client';

import { useEffect, useRef } from 'react';
import QrScannerLib from 'qr-scanner';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: Error) => void;
}

export function QrScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScannerLib | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const qrScanner = new QrScannerLib(
      videoRef.current,
      (result) => {
        onScan(result.data);
      },
      {
        onDecodeError: (error) => {
          // Ignore decode errors
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    qrScannerRef.current = qrScanner;

    qrScanner.start().catch((err) => {
      if (onError) {
        onError(err);
      }
      console.error('Failed to start QR scanner:', err);
    });

    return () => {
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, [onScan, onError]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
}
