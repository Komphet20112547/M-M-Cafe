import { NextRequest, NextResponse } from 'next/server';
import { getPetSchedule, createOrUpdatePetSchedule } from '@/lib/db/db';
import { verifyToken, getTokenFromRequest } from '@/lib/auth/jwt';
import { getPetById } from '@/lib/db/db';
import type { PetSchedule, TimeSlot } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const schedule = await getPetSchedule(id, date);
    
    if (!schedule) {
      // Return empty schedule if not found
      const pet = await getPetById(id);
      if (!pet) {
        return NextResponse.json(
          { error: 'Pet not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        id: '',
        petId: id,
        pet,
        date,
        timeSlots: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    
    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Get pet schedule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { date, timeSlots } = body;

    // Validation
    if (!date || typeof date !== 'string') {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (!timeSlots || !Array.isArray(timeSlots)) {
      return NextResponse.json(
        { error: 'Time slots must be an array' },
        { status: 400 }
      );
    }

    // Validate each time slot
    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      if (!slot || typeof slot !== 'object') {
        return NextResponse.json(
          { error: `Time slot at index ${i} is invalid` },
          { status: 400 }
        );
      }
      if (!slot.startTime || typeof slot.startTime !== 'string' || !slot.endTime || typeof slot.endTime !== 'string') {
        return NextResponse.json(
          { error: `Time slot at index ${i} must have valid startTime and endTime` },
          { status: 400 }
        );
      }
      // Validate time format (HH:MM)
      const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        return NextResponse.json(
          { error: `Time slot at index ${i} has invalid time format. Use HH:MM` },
          { status: 400 }
        );
      }
      // Validate startTime < endTime
      if (slot.startTime >= slot.endTime) {
        return NextResponse.json(
          { error: `Time slot at index ${i}: startTime must be less than endTime` },
          { status: 400 }
        );
      }
      if (typeof slot.maxRounds !== 'number' || slot.maxRounds <= 0 || !Number.isInteger(slot.maxRounds)) {
        return NextResponse.json(
          { error: `Time slot at index ${i}: maxRounds must be a positive integer` },
          { status: 400 }
        );
      }
    }

    const pet = await getPetById(id);
    if (!pet) {
      return NextResponse.json(
        { error: 'Pet not found' },
        { status: 404 }
      );
    }

    const schedule: PetSchedule = {
      id: Date.now().toString(),
      petId: id,
      pet,
      date,
      timeSlots: timeSlots.map((slot: any, index: number) => ({
        id: slot.id || `${Date.now()}-${index}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable ?? true,
        isRestTime: slot.isRestTime ?? false,
        maxRounds: slot.maxRounds,
        currentRound: slot.currentRound || 0,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedSchedule = await createOrUpdatePetSchedule(schedule);
    
    return NextResponse.json(savedSchedule, { status: 201 });
  } catch (error) {
    console.error('Create/Update pet schedule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const slotId = searchParams.get('slotId');

    if (slotId) {
      // Delete a single time slot
      const { deletePetScheduleTimeSlot } = await import('@/lib/db/db');
      const ok = await deletePetScheduleTimeSlot(slotId);
      if (!ok) {
        return NextResponse.json({ error: 'Time slot not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Time slot deleted successfully' });
    }

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      );
    }

    const { deletePetSchedule } = await import('@/lib/db/db');
    const success = await deletePetSchedule(id, date);

    if (!success) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete pet schedule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
