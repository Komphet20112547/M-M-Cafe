# คู่มือเริ่มต้นใช้งาน Pet Cafe

## ขั้นตอนการเริ่มต้นใช้งาน

### 1. ตรวจสอบ Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` (ถ้ายังไม่มี):

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# JWT Secret
JWT_SECRET=pet-cafe-secret-key-change-in-production-2024

# MySQL Database Configuration (Optional)
# ถ้าไม่ตั้งค่า DB_HOST ระบบจะใช้ Mock Data อัตโนมัติ
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=pet_cafe
```

**หมายเหตุ:** สำหรับการทดสอบครั้งแรก แนะนำให้**ไม่ตั้งค่า DB_HOST** เพื่อใช้ Mock Data (ไม่ต้องติดตั้ง MySQL)

### 3. รัน Development Server

```bash
npm run dev
```

### 4. เปิด Browser

ไปที่ `http://localhost:3000`

### 5. ทดสอบ Login

ใช้บัญชีทดสอบ:
- **Admin:** `admin@petcafe.com` / `admin123`
- **User:** `user@example.com` / `user123`

## การใช้งานกับ MySQL (Optional)

ถ้าต้องการใช้ MySQL Database:

1. ติดตั้ง MySQL และ MySQL Workbench
2. สร้าง database โดยรัน `database/schema.sql`
3. Import ข้อมูลโดยรัน `database/seed.sql`
4. ตั้งค่า `.env.local`:
   ```env
   DB_HOST=localhost
   DB_PASSWORD=your_mysql_password
   ```

ดูรายละเอียดเพิ่มเติมที่ [DATABASE_SETUP.md](./DATABASE_SETUP.md)

## Troubleshooting

### ปัญหา: หน้าเว็บไม่โหลด

**แก้ไข:**
1. ตรวจสอบว่า `npm run dev` กำลังทำงานอยู่
2. ตรวจสอบ console ใน browser สำหรับ error messages
3. ตรวจสอบ terminal สำหรับ error messages

### ปัญหา: Login ไม่ได้

**แก้ไข:**
1. ตรวจสอบว่า API routes ทำงาน (ดูที่ terminal)
2. ตรวจสอบ network tab ใน browser
3. ลองใช้ Mock Data (ลบ DB_HOST ออกจาก .env.local)

### ปัญหา: Database Connection Error

**แก้ไข:**
1. ตรวจสอบว่า MySQL กำลังทำงานอยู่
2. ตรวจสอบ username และ password ใน `.env.local`
3. ใช้ Mock Data แทน (ลบ DB_HOST ออกจาก .env.local)

## Features ที่พร้อมใช้งาน

✅ Authentication (Login/Register)  
✅ Menu Management  
✅ Order System  
✅ Pet Management  
✅ QR Code Scanner  
✅ Reviews & Ratings  
✅ Promotions  
✅ Admin Dashboard  

## หมายเหตุ

- ระบบจะใช้ **Mock Data** อัตโนมัติถ้าไม่ตั้งค่า `DB_HOST`
- Mock Data จะ reset ทุกครั้งที่ restart server
- สำหรับ production ควรใช้ MySQL Database
