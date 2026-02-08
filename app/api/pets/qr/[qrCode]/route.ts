import { NextRequest, NextResponse } from 'next/server';
import { getPetByQRCode } from '@/lib/db/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ qrCode: string }> }
) {
  try {
    const { qrCode } = await params;
    const pet = await getPetByQRCode(qrCode);
    
    if (!pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(pet);
  } catch (error) {
    console.error('Get pet by QR error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
