-- Test MySQL Connection
-- รัน script นี้ใน MySQL Workbench เพื่อทดสอบการเชื่อมต่อ

-- ตรวจสอบว่า database มีอยู่หรือไม่
SHOW DATABASES LIKE 'pet_cafe';

-- ถ้าไม่มี ให้สร้าง database
CREATE DATABASE IF NOT EXISTS pet_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ใช้ database
USE pet_cafe;

-- ตรวจสอบว่า tables มีอยู่หรือไม่
SHOW TABLES;

-- ทดสอบ query
SELECT 'Connection successful!' AS status;
