import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/db/db';
import { signToken } from '@/lib/auth/jwt';
import { mockPasswords } from '@/lib/db/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, adminCode } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate role + admin code
    let userRole: 'user' | 'admin' = 'user';
    if (role === 'admin') {
      if (adminCode !== 'M&M') {
        return NextResponse.json(
          { error: 'รหัสสำหรับสมัคร Admin ไม่ถูกต้อง' },
          { status: 403 }
        );
      }
      userRole = 'admin';
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    const user = await createUser({
      email,
      name,
      role: userRole,
      password,
    });

    // Store password (in production, hash it with bcrypt)
    // const hashedPassword = await bcrypt.hash(password, 10);
    mockPasswords[email] = password;

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
