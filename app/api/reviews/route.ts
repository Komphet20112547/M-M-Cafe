import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews, createReview } from '@/lib/db/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth/jwt';
import { findUserById } from '@/lib/db/db';

export async function GET() {
  try {
    const reviews = await getAllReviews();
    // Populate user data
    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const user = await findUserById(review.userId);
        return {
          ...review,
          user: user ? {
            id: user.id,
            name: user.name,
            email: user.email,
          } : null,
        };
      })
    );
    return NextResponse.json(reviewsWithUsers);
  } catch (error) {
    console.error('Get reviews error:', error);
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
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review = await createReview({
      userId: payload.userId,
      rating,
      comment,
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
