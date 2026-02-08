// Database helper functions
// Use MySQL database if DB_HOST is set, otherwise use mock data
import * as mysqlDb from './mysql-db';
import { mockUsers, mockMenuItems, mockOrders, mockPets, mockPetSchedules, mockReviews, mockPromotions, mockBanners, mockPasswords } from './mock-data';
import type { User, MenuItem, Order, Pet, PetSchedule, Review, Promotion, Banner, OrderStatus } from '@/types';

// Check if MySQL should be used and if connection is available
let useMySQL = false;
let connectionChecked = false;

// Check MySQL connection with fallback to Mock Data
async function shouldUseMySQL(): Promise<boolean> {
  if (!process.env.DB_HOST) {
    console.log('ℹ️  DB_HOST not set, using Mock Data');
    return false;
  }
  
  if (connectionChecked) {
    return useMySQL;
  }
  
  try {
    const { getPool } = await import('./mysql');
    const pool = getPool();
    const [rows] = await pool.query('SELECT 1 as test');
    useMySQL = true;
    connectionChecked = true;
    console.log('✅ MySQL connected successfully!');
    console.log('📊 Using MySQL Database:', process.env.DB_NAME || 'pet_cafe');
    return true;
  } catch (error: any) {
    const errorMsg = error?.message || error?.code || String(error);
    console.warn('⚠️  MySQL connection failed, using Mock Data');
    console.warn('   Error:', errorMsg);
    console.warn('   Check your .env.local configuration');
    useMySQL = false;
    connectionChecked = true;
    return false;
  }
}

// Helper to execute with fallback
async function withFallback<T>(
  mysqlFn: () => Promise<T>,
  mockFn: () => T | Promise<T>
): Promise<T> {
  const useDB = await shouldUseMySQL();
  
  if (useDB) {
    try {
      return await mysqlFn();
    } catch (error: any) {
      console.error('MySQL error, falling back to Mock Data:', error?.message || error);
      useMySQL = false;
      return await mockFn();
    }
  }
  
  return await mockFn();
}

// Users
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

// Menu Items
export async function getAllMenuItems(category?: 'food' | 'drink'): Promise<MenuItem[]> {
  if (await shouldUseMySQL()) {
    return mysqlDb.getAllMenuItems(category);
  }
  if (category) {
    return mockMenuItems.filter(item => item.category === category);
  }
  return mockMenuItems;
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  if (await shouldUseMySQL()) {
    return mysqlDb.getMenuItemById(id);
  }
  return mockMenuItems.find(item => item.id === id) || null;
}

export async function createMenuItem(itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
  if (await shouldUseMySQL()) {
    return mysqlDb.createMenuItem(itemData);
  }
  const newItem: MenuItem = {
    ...itemData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockMenuItems.push(newItem);
  return newItem;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
  if (await shouldUseMySQL()) {
    return mysqlDb.updateMenuItem(id, updates);
  }
  const index = mockMenuItems.findIndex(item => item.id === id);
  if (index === -1) return null;
  mockMenuItems[index] = {
    ...mockMenuItems[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockMenuItems[index];
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  if (await shouldUseMySQL()) {
    return mysqlDb.deleteMenuItem(id);
  }
  const index = mockMenuItems.findIndex(item => item.id === id);
  if (index === -1) return false;
  mockMenuItems.splice(index, 1);
  return true;
}

// Orders
export async function getAllOrders(userId?: string, status?: OrderStatus): Promise<Order[]> {
  if (await shouldUseMySQL()) {
    return mysqlDb.getAllOrders(userId, status);
  }
  let orders = mockOrders;
  if (userId) {
    orders = orders.filter(order => order.userId === userId);
  }
  if (status) {
    orders = orders.filter(order => order.status === status);
  }
  return orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (await shouldUseMySQL()) {
    return mysqlDb.getOrderById(id);
  }
  return mockOrders.find(order => order.id === id) || null;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  if (await shouldUseMySQL()) {
    return mysqlDb.createOrder(orderData);
  }
  const newOrder: Order = {
    ...orderData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockOrders.push(newOrder);
  return newOrder;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  if (await shouldUseMySQL()) {
    return mysqlDb.updateOrderStatus(id, status);
  }
  const order = mockOrders.find(o => o.id === id);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (status === 'paid') {
    order.paidAt = new Date().toISOString();
  } else if (status === 'completed') {
    order.completedAt = new Date().toISOString();
  }
  return order;
}

// Pets
export async function getAllPets(): Promise<Pet[]> {
  if (await shouldUseMySQL()) {
    return mysqlDb.getAllPets();
  }
  return mockPets;
}

export async function getPetById(id: string): Promise<Pet | null> {
  if (await shouldUseMySQL()) {
    return mysqlDb.getPetById(id);
  }
  return mockPets.find(pet => pet.id === id) || null;
}

export async function getPetByQRCode(qrCode: string): Promise<Pet | null> {
  if (await shouldUseMySQL()) {
    return mysqlDb.getPetByQRCode(qrCode);
  }
  return mockPets.find(pet => pet.qrCode === qrCode) || null;
}

export async function createPet(petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'qrCode'>): Promise<Pet> {
  if (useMySQL) {
    return mysqlDb.createPet(petData);
  }
  const newPet: Pet = {
    ...petData,
    id: Date.now().toString(),
    qrCode: `pet-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockPets.push(newPet);
  return newPet;
}

export async function updatePet(id: string, updates: Partial<Pet>): Promise<Pet | null> {
  if (useMySQL) {
    return mysqlDb.updatePet(id, updates);
  }
  const index = mockPets.findIndex(pet => pet.id === id);
  if (index === -1) return null;
  mockPets[index] = {
    ...mockPets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockPets[index];
}

export async function deletePet(id: string): Promise<boolean> {
  if (useMySQL) {
    return mysqlDb.deletePet(id);
  }
  const index = mockPets.findIndex(pet => pet.id === id);
  if (index === -1) return false;
  mockPets.splice(index, 1);
  return true;
}

// Pet Schedules
export async function getPetSchedule(petId: string, date: string): Promise<PetSchedule | null> {
  if (useMySQL) {
    return mysqlDb.getPetSchedule(petId, date);
  }
  return mockPetSchedules.find(
    schedule => schedule.petId === petId && schedule.date === date
  ) || null;
}

export async function getTodaySchedules(date: string): Promise<PetSchedule[]> {
  if (await shouldUseMySQL()) {
    return mysqlDb.getTodaySchedules(date);
  }
  return mockPetSchedules.filter(schedule => schedule.date === date);
}

export async function createOrUpdatePetSchedule(scheduleData: PetSchedule): Promise<PetSchedule> {
  if (useMySQL) {
    return mysqlDb.createOrUpdatePetSchedule(scheduleData);
  }
  const index = mockPetSchedules.findIndex(
    s => s.petId === scheduleData.petId && s.date === scheduleData.date
  );
  if (index === -1) {
    mockPetSchedules.push(scheduleData);
    return scheduleData;
  } else {
    mockPetSchedules[index] = {
      ...scheduleData,
      updatedAt: new Date().toISOString(),
    };
    return mockPetSchedules[index];
  }
}

export async function deletePetSchedule(petId: string, date: string): Promise<boolean> {
  if (useMySQL) {
    return mysqlDb.deletePetSchedule(petId, date);
  }
  const index = mockPetSchedules.findIndex(
    s => s.petId === petId && s.date === date
  );
  if (index === -1) return false;
  mockPetSchedules.splice(index, 1);
  return true;
}

export async function deletePetScheduleTimeSlot(slotId: string): Promise<boolean> {
  if (useMySQL) {
    return mysqlDb.deletePetScheduleTimeSlot(slotId);
  }

  // Mock fallback: find and remove the timeslot from mockPetSchedules
  for (let i = 0; i < mockPetSchedules.length; i++) {
    const schedule = mockPetSchedules[i];
    const idx = schedule.timeSlots.findIndex(t => t.id === slotId);
    if (idx !== -1) {
      schedule.timeSlots.splice(idx, 1);
      mockPetSchedules[i] = { ...schedule, updatedAt: new Date().toISOString() };
      return true;
    }
  }
  return false;
}

// Reviews
export async function getAllReviews(): Promise<Review[]> {
  if (useMySQL) {
    return mysqlDb.getAllReviews();
  }
  return mockReviews;
}

export async function createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
  if (useMySQL) {
    return mysqlDb.createReview(reviewData);
  }
  const newReview: Review = {
    ...reviewData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockReviews.push(newReview);
  return newReview;
}

export async function updateReview(id: string, updates: Partial<Review>): Promise<Review | null> {
  if (useMySQL) {
    return mysqlDb.updateReview(id, updates);
  }
  const index = mockReviews.findIndex(review => review.id === id);
  if (index === -1) return null;
  mockReviews[index] = {
    ...mockReviews[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockReviews[index];
}

export async function deleteReview(id: string): Promise<boolean> {
  if (useMySQL) {
    return mysqlDb.deleteReview(id);
  }
  const index = mockReviews.findIndex(review => review.id === id);
  if (index === -1) return false;
  mockReviews.splice(index, 1);
  return true;
}

export async function getAverageRating(): Promise<{ average: number; count: number }> {
  if (useMySQL) {
    return mysqlDb.getAverageRating();
  }
  if (mockReviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = mockReviews.reduce((acc, review) => acc + review.rating, 0);
  return {
    average: sum / mockReviews.length,
    count: mockReviews.length,
  };
}

// Promotions
export async function getActivePromotions(): Promise<Promotion[]> {
  if (useMySQL) {
    return mysqlDb.getActivePromotions();
  }
  const now = new Date();
  return mockPromotions.filter(
    promo => promo.isActive && 
    new Date(promo.startDate) <= now && 
    new Date(promo.endDate) >= now
  );
}

export async function getAllPromotions(): Promise<Promotion[]> {
  if (useMySQL) {
    return mysqlDb.getAllPromotions();
  }
  return mockPromotions;
}

export async function createPromotion(promoData: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Promotion> {
  if (useMySQL) {
    return mysqlDb.createPromotion(promoData);
  }
  const newPromo: Promotion = {
    ...promoData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockPromotions.push(newPromo);
  return newPromo;
}

export async function updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion | null> {
  if (useMySQL) {
    return mysqlDb.updatePromotion(id, updates);
  }
  const index = mockPromotions.findIndex(promo => promo.id === id);
  if (index === -1) return null;
  mockPromotions[index] = {
    ...mockPromotions[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockPromotions[index];
}

export async function deletePromotion(id: string): Promise<boolean> {
  if (useMySQL) {
    return mysqlDb.deletePromotion(id);
  }
  const index = mockPromotions.findIndex(promo => promo.id === id);
  if (index === -1) return false;
  mockPromotions.splice(index, 1);
  return true;
}

// Banners
export async function getAllBanners(): Promise<Banner[]> {
  if (await shouldUseMySQL()) {
    return mysqlDb.getAllBanners();
  }
  return mockBanners.filter(banner => banner.isActive).sort((a, b) => a.order - b.order);
}

export async function createBanner(bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner> {
  if (useMySQL) {
    return mysqlDb.createBanner(bannerData);
  }
  const newBanner: Banner = {
    ...bannerData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockBanners.push(newBanner);
  return newBanner;
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  if (useMySQL) {
    return mysqlDb.updateBanner(id, updates);
  }
  const index = mockBanners.findIndex(banner => banner.id === id);
  if (index === -1) return null;
  mockBanners[index] = {
    ...mockBanners[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockBanners[index];
}

export async function deleteBanner(id: string): Promise<boolean> {
  if (useMySQL) {
    return mysqlDb.deleteBanner(id);
  }
  const index = mockBanners.findIndex(banner => banner.id === id);
  if (index === -1) return false;
  mockBanners.splice(index, 1);
  return true;
}

// Dashboard Stats
export async function getDashboardStats() {
  if (await shouldUseMySQL()) {
    return mysqlDb.getDashboardStats();
  }
  const totalOrders = mockOrders.length;
  const totalRevenue = mockOrders
    .filter(order => order.status === 'completed' || order.status === 'paid')
    .reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = mockOrders.filter(order => order.status === 'pending').length;
  const ratingData = await getAverageRating();
  // Always return monthlyRevenue (empty array if mock)
  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    averageRating: ratingData.average,
    totalReviews: ratingData.count,
    monthlyRevenue: [],
  };
}
