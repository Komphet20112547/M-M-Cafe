import { NextResponse } from 'next/server';
import { getAverageRating } from '@/lib/db/db';

export async function GET() {
  try {
    const ratingData = await getAverageRating();
    return NextResponse.json(ratingData);
  } catch (error) {
    console.error('Get average rating error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
