import { NextRequest, NextResponse } from 'next/server';
import { getActivePromotions, getAllPromotions, createPromotion } from '@/lib/db/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const promotions = await getActivePromotions();
    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Get promotions error:', error);
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
    const { title, description, discount, startDate, endDate, image } = body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!discount || typeof discount !== 'number' || discount <= 0 || discount > 100) {
      return NextResponse.json(
        { error: 'Discount must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const promotion = await createPromotion({
      title: title.trim(),
      description: description || '',
      discount,
      startDate: startDate,
      endDate: endDate,
      image: image || '',
      isActive: body.isActive !== false,
    });
    
    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error('Create promotion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
