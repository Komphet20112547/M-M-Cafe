// User Types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Menu Types
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'drink';
  image?: string;
  ingredients?: string[];
  warnings?: string[];
  qrCode?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  completedAt?: string;
}

// Pet Types
export interface Pet {
  id: string;
  name: string;
  breed?: string;
  age?: number;
  description: string;
  image?: string;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PetSchedule {
  id: string;
  petId: string;
  pet: Pet;
  date: string; // YYYY-MM-DD
  timeSlots: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
  isRestTime: boolean;
  maxRounds?: number;
  currentRound?: number;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  user?: User;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// Promotion Types
export interface Promotion {
  id: string;
  title: string;
  description: string;
  image?: string;
  discount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  averageRating: number;
  totalReviews: number;
  monthlyRevenue: { month: string; revenue: number }[];
}
