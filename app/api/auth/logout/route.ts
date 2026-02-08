import { NextResponse } from 'next/server';

export async function POST() {
  // In a stateless JWT system, logout is handled client-side
  // You could implement token blacklisting here if needed
  return NextResponse.json({ message: 'Logged out successfully' });
}
