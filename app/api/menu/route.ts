import { NextRequest, NextResponse } from 'next/server';
import { getAllMenuItems, createMenuItem } from '@/lib/db/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as 'food' | 'drink' | null;

    const items = await getAllMenuItems(category || undefined);
    return NextResponse.json(items);
  } catch (error) {
    console.error('Get menu error:', error);
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
    const { name, price, category, description, image } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!price || typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      );
    }

    if (!category || !['food', 'drink'].includes(category)) {
      return NextResponse.json(
        { error: 'Category must be "food" or "drink"' },
        { status: 400 }
      );
    }

    const item = await createMenuItem({
      name: name.trim(),
      price,
      category,
      description: description || '',
      image: image || '',
      isAvailable: body.isAvailable !== false,
    });
    
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Create menu item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
