# คู่มือการติดตั้งและตั้งค่า MySQL Database

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง MySQL

#### Windows
1. ดาวน์โหลด MySQL Installer จาก [mysql.com](https://dev.mysql.com/downloads/installer/)
2. ติดตั้ง MySQL Server และ MySQL Workbench
3. ตั้งค่า root password ระหว่างการติดตั้ง

#### macOS
```bash
brew install mysql
brew services start mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### 2. เปิด MySQL Workbench

1. เปิด MySQL Workbench
2. สร้าง Connection ใหม่ (ถ้ายังไม่มี):
   - Host: `localhost` (หรือ IP ของ MySQL server)
   - Port: `3306` (default)
   - Username: `root` (หรือ username ของคุณ)
   - Password: password ที่ตั้งไว้
3. คลิก "Test Connection" เพื่อทดสอบการเชื่อมต่อ
4. คลิก "OK" เพื่อบันทึก connection

### 3. สร้าง Database

#### วิธีที่ 1: ใช้ SQL Script (แนะนำ)

1. ใน MySQL Workbench:
   - เปิดไฟล์ `database/schema.sql`
   - คัดลอกเนื้อหาทั้งหมด
   - วางใน Query tab
   - กด `Ctrl+Enter` (Windows) หรือ `Cmd+Enter` (Mac) เพื่อรัน script

2. หรือใช้ Command Line:
```bash
mysql -u root -p < database/schema.sql
```

#### วิธีที่ 2: สร้างด้วยมือ

1. ใน MySQL Workbench:
   - คลิกขวาที่ "Schemas" → "Create Schema"
   - ตั้งชื่อ: `pet_cafe`
   - Character Set: `utf8mb4`
   - Collation: `utf8mb4_unicode_ci`
   - คลิก "Apply"

2. รัน SQL script จาก `database/schema.sql` เพื่อสร้าง tables

### 4. Import Seed Data (ข้อมูลตัวอย่าง)

1. ใน MySQL Workbench:
   - เปิดไฟล์ `database/seed.sql`
   - คัดลอกเนื้อหาทั้งหมด
   - วางใน Query tab
   - กด `Ctrl+Enter` เพื่อรัน script

2. หรือใช้ Command Line:
```bash
mysql -u root -p pet_cafe < database/seed.sql
```

### 5. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ใน root directory ของโปรเจค:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pet_cafe

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# API URL (optional)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**หมายเหตุ:** 
- แทนที่ `your_mysql_password` ด้วย password ของ MySQL ที่ตั้งไว้
- แทนที่ `your-secret-key-change-in-production` ด้วย secret key ที่ปลอดภัย

### 6. ทดสอบการเชื่อมต่อ

1. รัน development server:
```bash
npm run dev
```

2. เปิด browser ไปที่ `http://localhost:3000`

3. ลอง login ด้วย:
   - Email: `admin@petcafe.com`
   - Password: `admin123`

## โครงสร้าง Database

### Tables

1. **users** - ข้อมูลผู้ใช้
2. **menu_items** - เมนูอาหารและเครื่องดื่ม
3. **menu_item_ingredients** - ส่วนผสมของเมนู
4. **menu_item_warnings** - คำเตือนของเมนู
5. **orders** - ออเดอร์
6. **order_items** - รายการในออเดอร์
7. **pets** - ข้อมูลสัตว์เลี้ยง
8. **pet_schedules** - ตารางเวลาสัตว์เลี้ยง
9. **pet_schedule_time_slots** - ช่วงเวลาในตาราง
10. **reviews** - รีวิว
11. **promotions** - โปรโมชั่น
12. **banners** - Banner

## การใช้งาน

### ตรวจสอบว่าใช้ MySQL หรือ Mock Data

ระบบจะตรวจสอบ environment variable `DB_HOST`:
- **มี `DB_HOST`** → ใช้ MySQL Database
- **ไม่มี `DB_HOST`** → ใช้ Mock Data (สำหรับ development)

### Reset Database

หากต้องการ reset database:

```sql
DROP DATABASE IF EXISTS pet_cafe;
CREATE DATABASE pet_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pet_cafe;
-- แล้วรัน schema.sql และ seed.sql อีกครั้ง
```

## Troubleshooting

### ปัญหา: ไม่สามารถเชื่อมต่อ MySQL ได้

**แก้ไข:**
1. ตรวจสอบว่า MySQL service กำลังทำงานอยู่
2. ตรวจสอบ username และ password ใน `.env.local`
3. ตรวจสอบว่า port 3306 ไม่ถูกบล็อกโดย firewall

### ปัญหา: Error "Access denied"

**แก้ไข:**
1. ตรวจสอบ username และ password
2. ตรวจสอบว่า user มีสิทธิ์เข้าถึง database `pet_cafe`

### ปัญหา: Character encoding ผิดเพี้ยน

**แก้ไข:**
1. ตรวจสอบว่า database ใช้ `utf8mb4`
2. ตรวจสอบว่า connection charset เป็น `utf8mb4`

## Production Setup

สำหรับ production:

1. **เปลี่ยน password** ทั้งหมดให้ปลอดภัย
2. **สร้าง user เฉพาะ** สำหรับ application (ไม่ใช้ root)
3. **ตั้งค่า connection pool** ให้เหมาะสม
4. **Backup database** เป็นประจำ
5. **ใช้ SSL** สำหรับการเชื่อมต่อ

### สร้าง User เฉพาะสำหรับ Application

```sql
CREATE USER 'petcafe_app'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON pet_cafe.* TO 'petcafe_app'@'localhost';
FLUSH PRIVILEGES;
```

แล้วใช้ `petcafe_app` แทน `root` ใน `.env.local`

## ข้อมูลเพิ่มเติม

- MySQL Documentation: https://dev.mysql.com/doc/
- MySQL Workbench: https://dev.mysql.com/doc/workbench/en/
- Next.js Environment Variables: https://nextjs.org/docs/basic-features/environment-variables
