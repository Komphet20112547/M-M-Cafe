# คู่มือการตั้งค่า MySQL Database

## ขั้นตอนการตั้งค่า

### 1. เชื่อมต่อ MySQL Workbench

จากภาพที่คุณแสดง:
- **Hostname**: `127.0.0.1`
- **Port**: `3306`
- **Username**: `root`
- **Password**: (ตั้งค่าใน MySQL Workbench)

### 2. สร้าง Database

1. เปิด MySQL Workbench
2. เชื่อมต่อกับ connection "Davit"
3. เปิดไฟล์ `database/schema.sql`
4. คัดลอกเนื้อหาทั้งหมด
5. วางใน Query tab
6. กด `Ctrl+Enter` เพื่อรัน script

### 3. Import ข้อมูลตัวอย่าง

1. เปิดไฟล์ `database/seed.sql`
2. คัดลอกเนื้อหาทั้งหมด
3. วางใน Query tab
4. กด `Ctrl+Enter` เพื่อรัน script

### 4. ตรวจสอบการตั้งค่า .env.local

ตรวจสอบว่าไฟล์ `.env.local` มีการตั้งค่าดังนี้:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=pet_cafe
```

**สำคัญ:** แทนที่ `your_password_here` ด้วย password ที่ตั้งไว้ใน MySQL Workbench

### 5. ทดสอบการเชื่อมต่อ

รัน script `database/test-connection.sql` ใน MySQL Workbench เพื่อทดสอบ

### 6. รันเว็บไซต์

```bash
npm run dev
```

เปิด browser ไปที่ `http://localhost:3000`

## Troubleshooting

### ปัญหา: Connection refused

**แก้ไข:**
1. ตรวจสอบว่า MySQL service กำลังทำงานอยู่
2. ตรวจสอบว่า port 3306 ไม่ถูกบล็อก
3. ตรวจสอบ username และ password

### ปัญหา: Unknown database 'pet_cafe'

**แก้ไข:**
1. รัน `database/schema.sql` เพื่อสร้าง database
2. ตรวจสอบว่า database ถูกสร้างแล้วใน MySQL Workbench

### ปัญหา: Table doesn't exist

**แก้ไข:**
1. รัน `database/schema.sql` อีกครั้ง
2. ตรวจสอบว่า tables ถูกสร้างแล้ว

### ปัญหา: Access denied

**แก้ไข:**
1. ตรวจสอบ username และ password ใน `.env.local`
2. ตรวจสอบว่า user มีสิทธิ์เข้าถึง database `pet_cafe`
