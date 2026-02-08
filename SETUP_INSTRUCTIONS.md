# คู่มือการตั้งค่า MySQL Database สำหรับ Pet Cafe

## ข้อมูลจาก MySQL Workbench ของคุณ

จากภาพที่คุณแสดง:
- **Hostname**: `127.0.0.1`
- **Port**: `3306`
- **Username**: `root`
- **Password**: (ตั้งค่าใน MySQL Workbench)
- **Default Schema**: (ว่างเปล่า - จะสร้าง `pet_cafe`)

## ขั้นตอนการตั้งค่า

### ขั้นตอนที่ 1: ตรวจสอบ Password ใน MySQL Workbench

1. เปิด MySQL Workbench
2. ดูที่ connection "Davit" ที่คุณสร้างไว้
3. ตรวจสอบว่า password ถูกตั้งค่าไว้หรือไม่
   - ถ้ามีปุ่ม "Store in Vault" แสดงว่ายังไม่ได้ตั้ง password
   - คลิก "Store in Vault" และใส่ password

### ขั้นตอนที่ 2: อัพเดท .env.local

เปิดไฟล์ `.env.local` และแก้ไข `DB_PASSWORD` ให้ตรงกับ password ที่ตั้งไว้ใน MySQL Workbench:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password_here  # แก้ไขตรงนี้
DB_NAME=pet_cafe
```

### ขั้นตอนที่ 3: สร้าง Database ใน MySQL Workbench

1. เปิด MySQL Workbench
2. เชื่อมต่อกับ connection "Davit"
3. เปิดไฟล์ `database/schema.sql`
4. คัดลอกเนื้อหาทั้งหมด (Ctrl+A, Ctrl+C)
5. วางใน Query tab ของ MySQL Workbench (Ctrl+V)
6. กด `Ctrl+Enter` หรือคลิกปุ่ม Execute (⚡) เพื่อรัน script
7. ตรวจสอบว่าไม่มี error

### ขั้นตอนที่ 4: Import ข้อมูลตัวอย่าง

1. เปิดไฟล์ `database/seed.sql`
2. คัดลอกเนื้อหาทั้งหมด
3. วางใน Query tab ของ MySQL Workbench
4. กด `Ctrl+Enter` เพื่อรัน script
5. ตรวจสอบว่าไม่มี error

### ขั้นตอนที่ 5: ทดสอบการเชื่อมต่อ

รัน script นี้ใน MySQL Workbench เพื่อทดสอบ:

```sql
USE pet_cafe;
SHOW TABLES;
SELECT COUNT(*) as user_count FROM users;
SELECT COUNT(*) as menu_count FROM menu_items;
SELECT COUNT(*) as pet_count FROM pets;
```

ควรเห็น:
- `user_count` = 2 (admin และ user)
- `menu_count` = 6 (เมนูต่างๆ)
- `pet_count` = 3 (สัตว์เลี้ยง)

### ขั้นตอนที่ 6: รันเว็บไซต์

1. เปิด Terminal/PowerShell
2. ไปที่ directory ของโปรเจค:
   ```bash
   cd C:\project_davit
   ```

3. รัน development server:
   ```bash
   npm run dev
   ```

4. เปิด browser ไปที่: `http://localhost:3000`

5. ตรวจสอบ console log:
   - ถ้าเห็น `✅ MySQL connected successfully` = เชื่อมต่อ MySQL สำเร็จ
   - ถ้าเห็น `⚠️ MySQL connection failed, using Mock Data` = ใช้ Mock Data (มีปัญหา)

### ขั้นตอนที่ 7: ทดสอบ Login

1. ไปที่ `http://localhost:3000/login`
2. Login ด้วย:
   - **Email**: `admin@petcafe.com`
   - **Password**: `admin123`

## Troubleshooting

### ปัญหา: "Access denied for user 'root'@'localhost'"

**แก้ไข:**
1. ตรวจสอบ password ใน `.env.local` ให้ตรงกับ MySQL Workbench
2. ลอง reset password ใน MySQL Workbench

### ปัญหา: "Unknown database 'pet_cafe'"

**แก้ไข:**
1. รัน `database/schema.sql` อีกครั้ง
2. ตรวจสอบว่า database ถูกสร้างแล้ว:
   ```sql
   SHOW DATABASES;
   ```

### ปัญหา: "Table 'users' doesn't exist"

**แก้ไข:**
1. รัน `database/schema.sql` อีกครั้ง
2. ตรวจสอบว่า tables ถูกสร้างแล้ว:
   ```sql
   USE pet_cafe;
   SHOW TABLES;
   ```

### ปัญหา: เว็บไซต์ยังใช้ Mock Data

**แก้ไข:**
1. ตรวจสอบว่า `.env.local` มี `DB_HOST=127.0.0.1`
2. ตรวจสอบว่า MySQL service กำลังทำงานอยู่
3. Restart development server (`Ctrl+C` แล้วรัน `npm run dev` อีกครั้ง)
4. ตรวจสอบ console log สำหรับ error messages

### ปัญหา: Connection timeout

**แก้ไข:**
1. ตรวจสอบว่า MySQL service กำลังทำงานอยู่
2. ตรวจสอบว่า port 3306 ไม่ถูกบล็อกโดย firewall
3. ลองเปลี่ยน `DB_HOST` จาก `127.0.0.1` เป็น `localhost`

## ตรวจสอบสถานะ

หลังจากรัน `npm run dev` ดูที่ terminal:

- ✅ `✅ MySQL connected successfully` = ใช้งาน MySQL Database
- ⚠️ `⚠️ MySQL connection failed, using Mock Data` = ใช้ Mock Data (มีปัญหา)

## หมายเหตุ

- ถ้า MySQL connection ล้มเหลว ระบบจะใช้ Mock Data อัตโนมัติ
- Mock Data จะ reset ทุกครั้งที่ restart server
- สำหรับ production ควรใช้ MySQL Database
