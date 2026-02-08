# ✅ Checklist การตั้งค่า Pet Cafe

## ขั้นตอนการตรวจสอบ

### 1. ✅ ตรวจสอบ MySQL Workbench Connection

- [ ] MySQL Workbench เปิดอยู่
- [ ] Connection "Davit" ถูกสร้างแล้ว
- [ ] Hostname: `127.0.0.1`
- [ ] Port: `3306`
- [ ] Username: `root`
- [ ] Password ถูกตั้งค่าแล้ว (คลิก "Store in Vault")

### 2. ✅ ตรวจสอบ .env.local

เปิดไฟล์ `.env.local` และตรวจสอบ:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here  # ต้องตรงกับ MySQL Workbench
DB_NAME=pet_cafe
```

- [ ] `DB_HOST` = `127.0.0.1`
- [ ] `DB_PORT` = `3306`
- [ ] `DB_USER` = `root`
- [ ] `DB_PASSWORD` = password ที่ตั้งไว้ใน MySQL Workbench
- [ ] `DB_NAME` = `pet_cafe`

### 3. ✅ สร้าง Database

ใน MySQL Workbench:

1. [ ] เชื่อมต่อกับ connection "Davit"
2. [ ] เปิดไฟล์ `database/schema.sql`
3. [ ] คัดลอกและรัน script (Ctrl+Enter)
4. [ ] ตรวจสอบว่าไม่มี error
5. [ ] ตรวจสอบว่า database `pet_cafe` ถูกสร้างแล้ว:
   ```sql
   SHOW DATABASES;
   ```

### 4. ✅ Import ข้อมูลตัวอย่าง

ใน MySQL Workbench:

1. [ ] เปิดไฟล์ `database/seed.sql`
2. [ ] คัดลอกและรัน script (Ctrl+Enter)
3. [ ] ตรวจสอบว่าไม่มี error
4. [ ] ตรวจสอบข้อมูล:
   ```sql
   USE pet_cafe;
   SELECT COUNT(*) FROM users;      -- ควรได้ 2
   SELECT COUNT(*) FROM menu_items; -- ควรได้ 6
   SELECT COUNT(*) FROM pets;       -- ควรได้ 3
   ```

### 5. ✅ รันเว็บไซต์

1. [ ] เปิด Terminal/PowerShell
2. [ ] ไปที่ directory: `cd C:\project_davit`
3. [ ] รัน: `npm run dev`
4. [ ] ตรวจสอบ console log:
   - ✅ `✅ MySQL connected successfully!` = สำเร็จ
   - ⚠️ `⚠️ MySQL connection failed` = มีปัญหา

### 6. ✅ ทดสอบใน Browser

1. [ ] เปิด `http://localhost:3000`
2. [ ] ไปที่ `/login`
3. [ ] Login ด้วย:
   - Email: `admin@petcafe.com`
   - Password: `admin123`
4. [ ] ตรวจสอบว่า login สำเร็จ

## ถ้ายังมีปัญหา

### ปัญหา: Connection failed

**ตรวจสอบ:**
1. MySQL service กำลังทำงานอยู่หรือไม่
2. Password ใน `.env.local` ตรงกับ MySQL Workbench หรือไม่
3. Database `pet_cafe` ถูกสร้างแล้วหรือยัง

**แก้ไข:**
1. ตรวจสอบ MySQL service:
   ```bash
   # Windows
   services.msc
   # หา MySQL และตรวจสอบว่า Running
   ```

2. ทดสอบ connection ใน MySQL Workbench:
   - คลิก "Test Connection"
   - ตรวจสอบว่าเชื่อมต่อได้

3. ตรวจสอบ database:
   ```sql
   SHOW DATABASES LIKE 'pet_cafe';
   ```

### ปัญหา: Table doesn't exist

**แก้ไข:**
1. รัน `database/schema.sql` อีกครั้ง
2. ตรวจสอบ:
   ```sql
   USE pet_cafe;
   SHOW TABLES;
   ```

### ปัญหา: Access denied

**แก้ไข:**
1. ตรวจสอบ password ใน `.env.local`
2. ลอง reset password ใน MySQL Workbench
3. อัพเดท `.env.local` ด้วย password ใหม่

## สรุป

หลังจากทำตาม checklist นี้แล้ว:

1. ✅ Database ถูกสร้างแล้ว
2. ✅ ข้อมูลตัวอย่างถูก import แล้ว
3. ✅ `.env.local` ตั้งค่าถูกต้อง
4. ✅ เว็บไซต์รันได้และเชื่อมต่อ MySQL สำเร็จ

**พร้อมใช้งาน!** 🎉
