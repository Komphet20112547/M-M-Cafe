-- Quick Setup Script for Pet Cafe Database
-- รัน script นี้ใน MySQL Workbench หลังจากเชื่อมต่อแล้ว

-- สร้าง database
CREATE DATABASE IF NOT EXISTS pet_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pet_cafe;

-- ตรวจสอบว่า database ถูกสร้างแล้ว
SELECT 'Database created successfully!' AS status;

-- หมายเหตุ: หลังจากรัน script นี้แล้ว ให้รัน schema.sql และ seed.sql ตามลำดับ
