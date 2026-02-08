import { NextRequest, NextResponse } from 'next/server';
import { getAllBanners, createBanner } from '@/lib/db/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const banners = await getAllBanners();
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Get banners error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const banner = await createBanner(body);
    
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error('Create banner error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
