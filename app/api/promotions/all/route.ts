import { NextRequest, NextResponse } from 'next/server';
import { getAllPromotions } from '@/lib/db/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const promotions = await getAllPromotions();
    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Get all promotions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
