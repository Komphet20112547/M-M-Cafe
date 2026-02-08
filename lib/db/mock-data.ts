// Mock Database - ใน production ควรใช้ database จริง
import type { User, MenuItem, Order, Pet, PetSchedule, Review, Promotion, Banner } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@petcafe.com',
    name: 'Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@example.com',
    name: 'User',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Passwords (plain text for demo - ใน production ต้อง hash)
export const mockPasswords: Record<string, string> = {
  'admin@petcafe.com': 'admin123',
  'user@example.com': 'user123',
};

// Mock Menu Items
export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'กาแฟอเมริกาโน',
    description: 'กาแฟดำเข้มข้น',
    price: 80,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
    ingredients: ['กาแฟ', 'น้ำ'],
    warnings: ['มีคาเฟอีน'],
    qrCode: 'drink-1',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'คาปูชิโน',
    description: 'กาแฟกับนม',
    price: 90,
    category: 'drink',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    ingredients: ['กาแฟ', 'นม', 'โฟม'],
    warnings: ['มีคาเฟอีน', 'มีนม'],
    qrCode: 'drink-2',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'แซนด์วิช',
    description: 'แซนด์วิชไก่ย่าง',
    price: 120,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Orders
export const mockOrders: Order[] = [];

// Mock Pets
export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'น้องหมา',
    breed: 'โกลเด้นรีทรีฟเวอร์',
    age: 2,
    description: 'น้องหมาที่น่ารักและเป็นมิตร',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400',
    qrCode: 'pet-1',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'น้องแมว',
    breed: 'เปอร์เซีย',
    age: 1,
    description: 'น้องแมวที่ขี้อ้อน',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400',
    qrCode: 'pet-2',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Pet Schedules
export const mockPetSchedules: PetSchedule[] = [];

// Mock Reviews
export const mockReviews: Review[] = [];

// Mock Promotions
export const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'โปรโมชั่นเปิดร้าน',
    description: 'ลด 20% ทุกเมนู',
    discount: 20,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock Banners
export const mockBanners: Banner[] = [
  {
    id: '1',
    title: 'ยินดีต้อนรับสู่ Pet Cafe',
    description: 'ร้านคาเฟ่ที่มีสัตว์เลี้ยงน่ารัก',
    image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=1200',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
