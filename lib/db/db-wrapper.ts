// Database wrapper with automatic fallback to Mock Data
import * as mysqlDb from './mysql-db';
import { mockUsers, mockMenuItems, mockOrders, mockPets, mockPetSchedules, mockReviews, mockPromotions, mockBanners, mockPasswords } from './mock-data';
import type { User, MenuItem, Order, Pet, PetSchedule, Review, Promotion, Banner, OrderStatus } from '@/types';

let useMySQL = false;
let connectionChecked = false;

async function checkConnection(): Promise<boolean> {
  if (!process.env.DB_HOST) {
    return false;
  }
  
  if (connectionChecked) {
    return useMySQL;
  }
  
  try {
    const { getPool } = await import('./mysql');
    const pool = getPool();
    await pool.query('SELECT 1');
    useMySQL = true;
    connectionChecked = true;
    console.log('✅ MySQL connected successfully');
    return true;
  } catch (error) {
    console.warn('⚠️  MySQL connection failed, using Mock Data');
    useMySQL = false;
    connectionChecked = true;
    return false;
  }
}

// Wrapper function with fallback
async function withFallback<T>(
  mysqlFn: () => Promise<T>,
  mockFn: () => T | Promise<T>
): Promise<T> {
  const shouldUseMySQL = await checkConnection();
  
  if (shouldUseMySQL) {
    try {
      return await mysqlFn();
    } catch (error) {
      console.error('MySQL error, falling back to Mock Data:', error);
      useMySQL = false;
      return await mockFn();
    }
  }
  
  return await mockFn();
}

// Re-export all functions with fallback
export async function findUserByEmail(email: string): Promise<User | null> {
  return withFallback(
    () => mysqlDb.findUserByEmail(email),
    () => mockUsers.find(u => u.email === email) || null
  );
}

export async function findUserById(id: string): Promise<User | null> {
  return withFallback(
    () => mysqlDb.findUserById(id),
    () => mockUsers.find(u => u.id === id) || null
  );
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> {
  return withFallback(
    () => mysqlDb.createUser(userData),
    () => {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      mockPasswords[userData.email] = userData.password;
      return newUser;
    }
  );
}

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  return withFallback(
    () => mysqlDb.verifyPassword(email, password),
    () => {
      const storedPassword = mockPasswords[email];
      if (!storedPassword) return false;
      return storedPassword === password;
    }
  );
}

// Export other functions similarly...
// For now, let's use the original db.ts but with better error handling
