// MySQL Database functions
import { getPool, generateId } from './mysql';
import type { User, MenuItem, Order, Pet, PetSchedule, Review, Promotion, Banner, OrderStatus, OrderItem, TimeSlot } from '@/types';
import bcrypt from 'bcryptjs';

// Users
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, email, name, role, created_at as createdAt, updated_at as updatedAt FROM users WHERE email = ?',
      [email]
    );
    const users = rows as any[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Database error in findUserByEmail:', error);
    throw error;
  }
}

export async function findUserById(id: string): Promise<User | null> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, email, name, role, created_at as createdAt, updated_at as updatedAt FROM users WHERE id = ?',
    [id]
  );
  const users = rows as any[];
  return users.length > 0 ? users[0] : null;
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> {
  const pool = getPool();
  const id = generateId();
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  await pool.execute(
    'INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
    [id, userData.email, hashedPassword, userData.name, userData.role]
  );
  
  return {
    id,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function verifyPassword(email: string, password: string): Promise<boolean> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT password FROM users WHERE email = ?',
      [email]
    );
    const users = rows as any[];
    
    if (users.length === 0) {
      return false;
    }
    
    const hashedPassword = users[0].password;
    if (!hashedPassword) {
      return false;
    }
    
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
}

// Menu Items
export async function getAllMenuItems(category?: 'food' | 'drink'): Promise<MenuItem[]> {
  const pool = getPool();
  let query = `
    SELECT 
      id, name, description, price, category, image, qr_code as qrCode, 
      is_available as isAvailable, created_at as createdAt, updated_at as updatedAt
    FROM menu_items
  `;
  const params: any[] = [];
  
  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }
  
  const [rows] = await pool.execute(query, params);
  const items = rows as any[];
  
  // Get ingredients and warnings for each item
  const itemsWithDetails = await Promise.all(
    items.map(async (item) => {
      const [ingredients] = await pool.execute(
        'SELECT ingredient FROM menu_item_ingredients WHERE menu_item_id = ?',
        [item.id]
      );
      const [warnings] = await pool.execute(
        'SELECT warning FROM menu_item_warnings WHERE menu_item_id = ?',
        [item.id]
      );
      
      return {
        ...item,
        ingredients: (ingredients as any[]).map(i => i.ingredient),
        warnings: (warnings as any[]).map(w => w.warning),
      };
    })
  );
  
  return itemsWithDetails;
}

export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT 
      id, name, description, price, category, image, qr_code as qrCode, 
      is_available as isAvailable, created_at as createdAt, updated_at as updatedAt
    FROM menu_items WHERE id = ?`,
    [id]
  );
  const items = rows as any[];
  
  if (items.length === 0) return null;
  
  const item = items[0];
  
  const [ingredients] = await pool.execute(
    'SELECT ingredient FROM menu_item_ingredients WHERE menu_item_id = ?',
    [id]
  );
  const [warnings] = await pool.execute(
    'SELECT warning FROM menu_item_warnings WHERE menu_item_id = ?',
    [id]
  );
  
  return {
    ...item,
    ingredients: (ingredients as any[]).map(i => i.ingredient),
    warnings: (warnings as any[]).map(w => w.warning),
  };
}

export async function createMenuItem(itemData: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
  const pool = getPool();
  const id = generateId();
  
  await pool.execute(
    'INSERT INTO menu_items (id, name, description, price, category, image, qr_code, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, itemData.name, itemData.description, itemData.price, itemData.category, itemData.image || null, itemData.qrCode || null, itemData.isAvailable]
  );
  
  // Insert ingredients
  if (itemData.ingredients && itemData.ingredients.length > 0) {
    const ingredientValues = itemData.ingredients.map(ing => [generateId(), id, ing]);
    await pool.query(
      'INSERT INTO menu_item_ingredients (id, menu_item_id, ingredient) VALUES ?',
      [ingredientValues]
    );
  }
  
  // Insert warnings
  if (itemData.warnings && itemData.warnings.length > 0) {
    const warningValues = itemData.warnings.map(warn => [generateId(), id, warn]);
    await pool.query(
      'INSERT INTO menu_item_warnings (id, menu_item_id, warning) VALUES ?',
      [warningValues]
    );
  }
  
  return getMenuItemById(id) as Promise<MenuItem>;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
  const pool = getPool();
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.name) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.price !== undefined) { fields.push('price = ?'); values.push(updates.price); }
  if (updates.category) { fields.push('category = ?'); values.push(updates.category); }
  if (updates.image !== undefined) { fields.push('image = ?'); values.push(updates.image); }
  if (updates.isAvailable !== undefined) { fields.push('is_available = ?'); values.push(updates.isAvailable); }
  
  if (fields.length > 0) {
    values.push(id);
    await pool.execute(
      `UPDATE menu_items SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
  
  // Update ingredients if provided
  if (updates.ingredients) {
    await pool.execute('DELETE FROM menu_item_ingredients WHERE menu_item_id = ?', [id]);
    if (updates.ingredients.length > 0) {
      const ingredientValues = updates.ingredients.map(ing => [generateId(), id, ing]);
      await pool.query(
        'INSERT INTO menu_item_ingredients (id, menu_item_id, ingredient) VALUES ?',
        [ingredientValues]
      );
    }
  }
  
  // Update warnings if provided
  if (updates.warnings) {
    await pool.execute('DELETE FROM menu_item_warnings WHERE menu_item_id = ?', [id]);
    if (updates.warnings.length > 0) {
      const warningValues = updates.warnings.map(warn => [generateId(), id, warn]);
      await pool.query(
        'INSERT INTO menu_item_warnings (id, menu_item_id, warning) VALUES ?',
        [warningValues]
      );
    }
  }
  
  return getMenuItemById(id);
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.execute('DELETE FROM menu_items WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

// Orders
export async function getAllOrders(userId?: string, status?: OrderStatus): Promise<Order[]> {
  const pool = getPool();
  let query = `
    SELECT 
      o.id, o.user_id as userId, o.total, o.status, 
      o.paid_at as paidAt, o.completed_at as completedAt,
      o.created_at as createdAt, o.updated_at as updatedAt,
      u.id as user_id, u.email as user_email, u.name as user_name, u.role as user_role
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];
  
  if (userId) {
    query += ' AND o.user_id = ?';
    params.push(userId);
  }
  
  if (status) {
    query += ' AND o.status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY o.created_at DESC';
  
  const [rows] = await pool.execute(query, params);
  const orders = rows as any[];
  
  // Get order items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const [items] = await pool.execute(
        `SELECT 
          oi.id, oi.menu_item_id as menuItemId, oi.quantity, oi.price, oi.subtotal,
          mi.id as mi_id, mi.name as mi_name, mi.description as mi_description, 
          mi.price as mi_price, mi.category as mi_category, mi.image as mi_image
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?`,
        [order.id]
      );
      
      const orderItems: OrderItem[] = (items as any[]).map(item => ({
        id: item.id,
        menuItemId: item.menuItemId,
        menuItem: {
          id: item.mi_id,
          name: item.mi_name,
          description: item.mi_description,
          price: item.mi_price,
          category: item.mi_category,
          image: item.mi_image,
          isAvailable: true,
          createdAt: '',
          updatedAt: '',
        },
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      }));
      
      return {
        id: order.id,
        userId: order.userId,
        user: order.user_id ? {
          id: order.user_id,
          email: order.user_email,
          name: order.user_name,
          role: order.user_role,
          createdAt: '',
          updatedAt: '',
        } : undefined,
        items: orderItems,
        total: parseFloat(order.total),
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        paidAt: order.paidAt,
        completedAt: order.completedAt,
      };
    })
  );
  
  return ordersWithItems;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getAllOrders(undefined, undefined);
  return orders.find(o => o.id === id) || null;
}

export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const pool = getPool();
  const id = generateId();
  
  await pool.execute(
    'INSERT INTO orders (id, user_id, total, status) VALUES (?, ?, ?, ?)',
    [id, orderData.userId, orderData.total, orderData.status]
  );
  
  // Insert order items
  if (orderData.items && orderData.items.length > 0) {
    const itemValues = orderData.items.map(item => [
      generateId(),
      id,
      item.menuItemId,
      item.quantity,
      item.price,
      item.subtotal,
    ]);
    await pool.query(
      'INSERT INTO order_items (id, order_id, menu_item_id, quantity, price, subtotal) VALUES ?',
      [itemValues]
    );
  }
  
  return getOrderById(id) as Promise<Order>;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
  const pool = getPool();
  const updates: any = { status };
  
  if (status === 'paid') {
    updates.paid_at = new Date();
  } else if (status === 'completed') {
    updates.completed_at = new Date();
  }
  
  await pool.execute(
    `UPDATE orders SET status = ?, ${status === 'paid' ? 'paid_at = NOW(),' : ''} ${status === 'completed' ? 'completed_at = NOW(),' : ''} updated_at = NOW() WHERE id = ?`,
    [status, id]
  );
  
  return getOrderById(id);
}

// Pets
export async function getAllPets(): Promise<Pet[]> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, breed, age, description, image, qr_code as qrCode, is_active as isActive, created_at as createdAt, updated_at as updatedAt FROM pets'
  );
  return rows as Pet[];
}

export async function getPetById(id: string): Promise<Pet | null> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, breed, age, description, image, qr_code as qrCode, is_active as isActive, created_at as createdAt, updated_at as updatedAt FROM pets WHERE id = ?',
    [id]
  );
  const pets = rows as any[];
  return pets.length > 0 ? pets[0] : null;
}

export async function getPetByQRCode(qrCode: string): Promise<Pet | null> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, name, breed, age, description, image, qr_code as qrCode, is_active as isActive, created_at as createdAt, updated_at as updatedAt FROM pets WHERE qr_code = ?',
    [qrCode]
  );
  const pets = rows as any[];
  return pets.length > 0 ? pets[0] : null;
}

export async function createPet(petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt' | 'qrCode'>): Promise<Pet> {
  const pool = getPool();
  const id = generateId();
  const qrCode = `pet-${Date.now()}`;
  
  await pool.execute(
    'INSERT INTO pets (id, name, breed, age, description, image, qr_code, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, petData.name, petData.breed || null, petData.age || null, petData.description, petData.image || null, qrCode, petData.isActive]
  );
  
  return getPetById(id) as Promise<Pet>;
}

export async function updatePet(id: string, updates: Partial<Pet>): Promise<Pet | null> {
  const pool = getPool();
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.name) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.breed !== undefined) { fields.push('breed = ?'); values.push(updates.breed); }
  if (updates.age !== undefined) { fields.push('age = ?'); values.push(updates.age); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.image !== undefined) { fields.push('image = ?'); values.push(updates.image); }
  if (updates.isActive !== undefined) { fields.push('is_active = ?'); values.push(updates.isActive); }
  
  if (fields.length > 0) {
    values.push(id);
    await pool.execute(
      `UPDATE pets SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
  
  return getPetById(id);
}

export async function deletePet(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.execute('DELETE FROM pets WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

// Pet Schedules
export async function getPetSchedule(petId: string, date: string): Promise<PetSchedule | null> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, pet_id as petId, date, created_at as createdAt, updated_at as updatedAt FROM pet_schedules WHERE pet_id = ? AND date = ?',
    [petId, date]
  );
  const schedules = rows as any[];
  
  if (schedules.length === 0) {
    const pet = await getPetById(petId);
    if (!pet) return null;
    
    return {
      id: '',
      petId,
      pet,
      date,
      timeSlots: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
  
  const schedule = schedules[0];
  const [timeSlots] = await pool.execute(
    'SELECT id, start_time as startTime, end_time as endTime, is_available as isAvailable, is_rest_time as isRestTime, max_rounds as maxRounds, current_round as currentRound FROM pet_schedule_time_slots WHERE pet_schedule_id = ? ORDER BY start_time',
    [schedule.id]
  );
  
  const pet = await getPetById(petId);
  if (!pet) return null;
  
  return {
    ...schedule,
    pet,
    timeSlots: (timeSlots as any[]).map(ts => ({
      id: ts.id,
      startTime: ts.startTime,
      endTime: ts.endTime,
      isAvailable: ts.isAvailable,
      isRestTime: ts.isRestTime,
      maxRounds: ts.maxRounds,
      currentRound: ts.currentRound,
    })),
  };
}

export async function getTodaySchedules(date: string): Promise<PetSchedule[]> {
  try {
    const pool = getPool();
    const [rows] = await pool.execute(
      'SELECT id, pet_id as petId, date, created_at as createdAt, updated_at as updatedAt FROM pet_schedules WHERE date = ?',
      [date]
    );
    const schedules = rows as any[];
    
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return [];
    }
    
    const results = await Promise.all(
      schedules.map(async (schedule) => {
        try {
          if (!schedule?.petId) return null;
          
          const pet = await getPetById(schedule.petId);
          if (!pet) return null;
          
          const [timeSlots] = await pool.execute(
            'SELECT id, start_time as startTime, end_time as endTime, is_available as isAvailable, is_rest_time as isRestTime, max_rounds as maxRounds, current_round as currentRound FROM pet_schedule_time_slots WHERE pet_schedule_id = ? ORDER BY start_time',
            [schedule.id]
          );
          
          return {
            ...schedule,
            pet,
            timeSlots: Array.isArray(timeSlots) ? (timeSlots as any[]).map(ts => ({
              id: ts.id || '',
              startTime: ts.startTime || '',
              endTime: ts.endTime || '',
              isAvailable: Boolean(ts.isAvailable),
              isRestTime: Boolean(ts.isRestTime),
              maxRounds: Number(ts.maxRounds) || 0,
              currentRound: Number(ts.currentRound) || 0,
            })) : [],
          };
        } catch (error) {
          console.error(`Error processing schedule ${schedule.id}:`, error);
          return null;
        }
      })
    );
    
    return results.filter((r): r is PetSchedule => r !== null);
  } catch (error) {
    console.error('Error in getTodaySchedules:', error);
    return [];
  }
}

export async function createOrUpdatePetSchedule(scheduleData: PetSchedule): Promise<PetSchedule> {
  const pool = getPool();
  
  // Check if schedule exists
  const [existing] = await pool.execute(
    'SELECT id FROM pet_schedules WHERE pet_id = ? AND date = ?',
    [scheduleData.petId, scheduleData.date]
  );
  
  let scheduleId: string;
  
  if ((existing as any[]).length > 0) {
    scheduleId = (existing as any[])[0].id;
    await pool.execute(
      'UPDATE pet_schedules SET updated_at = NOW() WHERE id = ?',
      [scheduleId]
    );
    // Delete existing time slots
    await pool.execute('DELETE FROM pet_schedule_time_slots WHERE pet_schedule_id = ?', [scheduleId]);
  } else {
    scheduleId = generateId();
    await pool.execute(
      'INSERT INTO pet_schedules (id, pet_id, date) VALUES (?, ?, ?)',
      [scheduleId, scheduleData.petId, scheduleData.date]
    );
  }
  
  // Insert time slots
  if (scheduleData.timeSlots && scheduleData.timeSlots.length > 0) {
    const timeSlotValues = scheduleData.timeSlots.map(ts => [
      ts.id || generateId(),
      scheduleId,
      ts.startTime,
      ts.endTime,
      ts.isAvailable,
      ts.isRestTime || false,
      ts.maxRounds || null,
      ts.currentRound || 0,
    ]);
    await pool.query(
      'INSERT INTO pet_schedule_time_slots (id, pet_schedule_id, start_time, end_time, is_available, is_rest_time, max_rounds, current_round) VALUES ?',
      [timeSlotValues]
    );
  }
  
  return getPetSchedule(scheduleData.petId, scheduleData.date) as Promise<PetSchedule>;
}

export async function deletePetSchedule(petId: string, date: string): Promise<boolean> {
  const pool = getPool();
  
  // Get schedule ID
  const [schedules] = await pool.execute(
    'SELECT id FROM pet_schedules WHERE pet_id = ? AND date = ?',
    [petId, date]
  );
  
  if ((schedules as any[]).length === 0) {
    return false;
  }
  
  const scheduleId = (schedules as any[])[0].id;
  
  // Delete time slots first
  await pool.execute('DELETE FROM pet_schedule_time_slots WHERE pet_schedule_id = ?', [scheduleId]);
  
  // Delete schedule
  const [result] = await pool.execute('DELETE FROM pet_schedules WHERE id = ?', [scheduleId]);
  
  return (result as any).affectedRows > 0;
}

export async function deletePetScheduleTimeSlot(slotId: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.execute('DELETE FROM pet_schedule_time_slots WHERE id = ?', [slotId]);
  return (result as any).affectedRows > 0;
}

// Reviews
export async function getAllReviews(): Promise<Review[]> {
  const pool = getPool();
  const [rows] = await pool.execute(
    `SELECT 
      r.id, r.user_id as userId, r.rating, r.comment, 
      r.created_at as createdAt, r.updated_at as updatedAt,
      u.id as user_id, u.email as user_email, u.name as user_name
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC`
  );
  
  return (rows as any[]).map(row => ({
    id: row.id,
    userId: row.userId,
    user: row.user_id ? {
      id: row.user_id,
      email: row.user_email,
      name: row.user_name,
      role: 'user' as const,
      createdAt: '',
      updatedAt: '',
    } : undefined,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
}

export async function createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
  const pool = getPool();
  const id = generateId();
  
  await pool.execute(
    'INSERT INTO reviews (id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
    [id, reviewData.userId, reviewData.rating, reviewData.comment || null]
  );
  
  const [rows] = await pool.execute(
    `SELECT 
      r.id, r.user_id as userId, r.rating, r.comment, 
      r.created_at as createdAt, r.updated_at as updatedAt,
      u.id as user_id, u.email as user_email, u.name as user_name
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = ?`,
    [id]
  );
  
  const review = (rows as any[])[0];
  return {
    id: review.id,
    userId: review.userId,
    user: review.user_id ? {
      id: review.user_id,
      email: review.user_email,
      name: review.user_name,
      role: 'user' as const,
      createdAt: '',
      updatedAt: '',
    } : undefined,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

export async function updateReview(id: string, updates: Partial<Review>): Promise<Review | null> {
  const pool = getPool();
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.rating !== undefined) { fields.push('rating = ?'); values.push(updates.rating); }
  if (updates.comment !== undefined) { fields.push('comment = ?'); values.push(updates.comment); }
  
  if (fields.length > 0) {
    values.push(id);
    await pool.execute(
      `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
  
  const [rows] = await pool.execute(
    `SELECT 
      r.id, r.user_id as userId, r.rating, r.comment, 
      r.created_at as createdAt, r.updated_at as updatedAt,
      u.id as user_id, u.email as user_email, u.name as user_name
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.id = ?`,
    [id]
  );
  
  const reviews = rows as any[];
  if (reviews.length === 0) return null;
  
  const review = reviews[0];
  return {
    id: review.id,
    userId: review.userId,
    user: review.user_id ? {
      id: review.user_id,
      email: review.user_email,
      name: review.user_name,
      role: 'user' as const,
      createdAt: '',
      updatedAt: '',
    } : undefined,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
  };
}

export async function deleteReview(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

export async function getAverageRating(): Promise<{ average: number; count: number }> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT AVG(rating) as average, COUNT(*) as count FROM reviews'
  );
  const result = (rows as any[])[0];
  return {
    average: result.average ? parseFloat(result.average) : 0,
    count: result.count || 0,
  };
}

// Promotions
export async function getActivePromotions(): Promise<Promotion[]> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, title, description, image, discount, start_date as startDate, end_date as endDate, is_active as isActive, created_at as createdAt, updated_at as updatedAt FROM promotions WHERE is_active = TRUE AND start_date <= NOW() AND end_date >= NOW() ORDER BY created_at DESC'
  );
  return rows as Promotion[];
}

export async function getAllPromotions(): Promise<Promotion[]> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, title, description, image, discount, start_date as startDate, end_date as endDate, is_active as isActive, created_at as createdAt, updated_at as updatedAt FROM promotions ORDER BY created_at DESC'
  );
  return rows as Promotion[];
}

export async function createPromotion(promoData: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Promotion> {
  const pool = getPool();
  const id = generateId();
  
  await pool.execute(
    'INSERT INTO promotions (id, title, description, image, discount, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, promoData.title, promoData.description || null, promoData.image || null, promoData.discount || null, promoData.startDate, promoData.endDate, promoData.isActive]
  );
  
  const [rows] = await pool.execute(
    'SELECT id, title, description, image, discount, start_date as startDate, end_date as endDate, is_active as isActive, created_at as createdAt, updated_at as updatedAt FROM promotions WHERE id = ?',
    [id]
  );
  return (rows as any[])[0];
}

export async function updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion | null> {
  const pool = getPool();
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.title) { fields.push('title = ?'); values.push(updates.title); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.image !== undefined) { fields.push('image = ?'); values.push(updates.image); }
  if (updates.discount !== undefined) { fields.push('discount = ?'); values.push(updates.discount); }
  if (updates.startDate) { fields.push('start_date = ?'); values.push(updates.startDate); }
  if (updates.endDate) { fields.push('end_date = ?'); values.push(updates.endDate); }
  if (updates.isActive !== undefined) { fields.push('is_active = ?'); values.push(updates.isActive); }
  
  if (fields.length > 0) {
    values.push(id);
    await pool.execute(
      `UPDATE promotions SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
  
  const [rows] = await pool.execute(
    'SELECT id, title, description, image, discount, start_date as startDate, end_date as endDate, is_active as isActive, created_at as createdAt, updated_at as updatedAt FROM promotions WHERE id = ?',
    [id]
  );
  const promotions = rows as any[];
  return promotions.length > 0 ? promotions[0] : null;
}

export async function deletePromotion(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.execute('DELETE FROM promotions WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

// Banners
export async function getAllBanners(): Promise<Banner[]> {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, title, description, image, link, is_active as isActive, `order`, created_at as createdAt, updated_at as updatedAt FROM banners WHERE is_active = TRUE ORDER BY `order` ASC'
  );
  return rows as Banner[];
}

export async function createBanner(bannerData: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner> {
  const pool = getPool();
  const id = generateId();
  
  await pool.execute(
    'INSERT INTO banners (id, title, description, image, link, is_active, `order`) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, bannerData.title, bannerData.description || null, bannerData.image, bannerData.link || null, bannerData.isActive, bannerData.order]
  );
  
  const [rows] = await pool.execute(
    'SELECT id, title, description, image, link, is_active as isActive, `order`, created_at as createdAt, updated_at as updatedAt FROM banners WHERE id = ?',
    [id]
  );
  return (rows as any[])[0];
}

export async function updateBanner(id: string, updates: Partial<Banner>): Promise<Banner | null> {
  const pool = getPool();
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.title) { fields.push('title = ?'); values.push(updates.title); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.image) { fields.push('image = ?'); values.push(updates.image); }
  if (updates.link !== undefined) { fields.push('link = ?'); values.push(updates.link); }
  if (updates.isActive !== undefined) { fields.push('is_active = ?'); values.push(updates.isActive); }
  if (updates.order !== undefined) { fields.push('`order` = ?'); values.push(updates.order); }
  
  if (fields.length > 0) {
    values.push(id);
    await pool.execute(
      `UPDATE banners SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }
  
  const [rows] = await pool.execute(
    'SELECT id, title, description, image, link, is_active as isActive, `order`, created_at as createdAt, updated_at as updatedAt FROM banners WHERE id = ?',
    [id]
  );
  const banners = rows as any[];
  return banners.length > 0 ? banners[0] : null;
}

export async function deleteBanner(id: string): Promise<boolean> {
  const pool = getPool();
  const [result] = await pool.execute('DELETE FROM banners WHERE id = ?', [id]);
  return (result as any).affectedRows > 0;
}

// Dashboard Stats
export async function getDashboardStats() {
  const pool = getPool();

  // Monthly revenue for last 12 months
  const [monthlyRows] = await pool.execute(
    `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, SUM(CASE WHEN status IN ('paid', 'completed') THEN total ELSE 0 END) as revenue
     FROM orders
     WHERE created_at >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 11 MONTH), '%Y-%m-01')
     GROUP BY month
     ORDER BY month ASC`
  );

  // Fill missing months with 0 revenue
  const now = new Date();
  const months: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const monthlyRevenue: { month: string; revenue: number }[] = months.map(m => {
    const found = (monthlyRows as any[]).find((row: any) => row.month === m);
    return { month: m, revenue: found ? parseFloat(found.revenue) : 0 };
  });

  // Other stats
  const [orderStats] = await pool.execute(
    'SELECT COUNT(*) as totalOrders, SUM(CASE WHEN status IN ("paid", "completed") THEN total ELSE 0 END) as totalRevenue, SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pendingOrders FROM orders'
  );
  const [ratingStats] = await pool.execute(
    'SELECT AVG(rating) as averageRating, COUNT(*) as totalReviews FROM reviews'
  );
  const orderResult = (orderStats as any[])[0];
  const ratingResult = (ratingStats as any[])[0];

  return {
    totalOrders: orderResult.totalOrders || 0,
    totalRevenue: parseFloat(orderResult.totalRevenue || 0),
    pendingOrders: orderResult.pendingOrders || 0,
    averageRating: ratingResult.averageRating ? parseFloat(ratingResult.averageRating) : 0,
    totalReviews: ratingResult.totalReviews || 0,
    monthlyRevenue,
  };
}
