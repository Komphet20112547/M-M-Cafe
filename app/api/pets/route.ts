import { NextRequest, NextResponse } from 'next/server';
import { getAllPets, createPet } from '@/lib/db/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth/jwt';

export async function GET() {
  try {
    const pets = await getAllPets();
    return NextResponse.json(pets);
  } catch (error) {
    console.error('Get pets error:', error);
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
    const { name, breed, description, image, isActive } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!breed || typeof breed !== 'string' || breed.trim().length === 0) {
      return NextResponse.json(
        { error: 'Breed is required' },
        { status: 400 }
      );
    }

    const pet = await createPet({
      name: name.trim(),
      breed: breed.trim(),
      description: description || '',
      image: image || '',
      isActive: isActive !== false,
    });
    
    return NextResponse.json(pet, { status: 201 });
  } catch (error) {
    console.error('Create pet error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
