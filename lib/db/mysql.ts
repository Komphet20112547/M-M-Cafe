import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import crypto from 'crypto';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    try {
      const config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'pet_cafe',
        waitForConnections: true,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        // เพิ่ม options สำหรับการเชื่อมต่อที่ดีขึ้น
        connectTimeout: 10000,
        acquireTimeout: 10000,
        timeout: 10000,
      };
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔌 Attempting to connect to MySQL:', {
          host: config.host,
          port: config.port,
          user: config.user,
          database: config.database,
        });
      }
      
      pool = mysql.createPool(config);
    } catch (error) {
      console.error('❌ Failed to create MySQL pool:', error);
      throw error;
    }
  }
  return pool;
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

// Helper function to generate UUID
export function generateId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    // Fallback (should rarely happen on Node 20+)
    return `${Date.now()}-${Math.random().toString(36).slice(2, 15)}`;
  }
}
