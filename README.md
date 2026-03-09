# 🐱 Pet Cafe - เว็บไซต์ร้านคาเฟ่สัตว์เลี้ยง

เว็บไซต์ระบบสั่งอาหารและจัดการร้านคาเฟ่ที่มีสัตว์เลี้ยง พร้อมด้วยระบบ Admin ครบถ้วน

## 🛠️ เทคโนโลยีที่ใช้

| ​ | ​ |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| **UI Components** | shadcn/ui, Radix UI |
| **State Management** | Zustand |
| **HTTP Client** | Axios |
| **Data Fetching** | TanStack React Query |
| **Authentication** | JWT |
| **QR Code** | QR Scanner & QRCode libraries |
| **Charts** | Chart.js + React Chart.js 2 |
| **Database** | MySQL (หรือ Mock Data fallback) |
| **Styling** | Tailwind CSS, Lucide Icons |

## 📁 โครงสร้างโปรเจค

```
project_davit/
├── app/                       # Next.js App Router (Frontend + API)
│   ├── admin/                # Admin dashboard pages
│   ├── api/                  # Backend API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── menu, orders, pets, reviews, etc.
│   ├── cart/, login/, register/, menu/, orders/, pets/, reviews/, promotions/
│   └── layout.tsx, page.tsx
├── components/               # Reusable React components
│   ├── ui/                  # shadcn/ui components (button, card, dialog, etc.)
│   ├── layout/              # Header, footer, navbar
│   ├── admin/               # Admin-specific components
│   ├── qr/                  # QR scanner component
│   └── animated/             # Animated components
├── lib/                      # Utility functions & business logic
│   ├── api/                 # API queries & axios config
│   ├── auth/                # JWT authentication
│   ├── db/                  # Database wrapper & SQL functions
│   ├── stores/              # Zustand state management
│   ├── providers/           # React providers (QueryProvider, etc.)
│   └── utils/               # Helper functions
├── database/                # Database files
│   ├── schema.sql           # Database schema (12 tables)
│   ├── seed.sql             # Sample data
│   └── quick-setup.sql
├── types/                   # TypeScript type definitions
├── public/                  # Static assets
└── config files             # package.json, tsconfig.json, tailwind.config.ts, etc.
```

## 🎯 ฟีเจอร์หลัก

### 👥 ผู้ใช้ทั่วไป (User)
- สมัครสมาชิก / เข้าสู่ระบบด้วย JWT
- ดูเมนูอาหารและเครื่องดื่มทั้งหมด
- สั่งอาหาร / เครื่องดื่มและบันทึกลงตะกร้า
- ระบบสร้างและชำระเงินบิลอัตโนมัติ
- ดูสถานะบิล (รอชำระ / ชำระแล้ว / สำเร็จ)
- สแกน QR Code เพื่อเรียกดูข้อมูลสัตว์เลี้ยง
- ดูประวัติสัตว์เลี้ยงและตารางเวลาเล่นประจำวัน
- บันทึกคะแนนและรีวิวร้าน
- ดูโปรโมชั่นและ Banner ล่าสุด
- ดูส่วนประกอบ / คำเตือนเครื่องดื่ม

### 🛠️ ผู้ดูแลระบบ (Admin)
- จัดการ (CRUD) เมนูอาหารและเครื่องดื่ม
- จัดการประวัติและข้อมูลสัตว์เลี้ยง
- กำหนดตารางเวลาเล่นสัตว์เลี้ยงรายวัน
- ตรวจสอบ / อนุมัติ / ปรับปรุงสถานะบิลและออเดอร์
- จัดการเนื้อหาหน้าเว็บ (Banner / โปรโมชั่น)
- ดูสรุปข้อมูล (Dashboard) - บิล / ออเดอร์ / คะแนน

## 🚀 การเริ่มต้นใช้งาน (Quick Start)

### 1️⃣ Clone & Install Dependencies

```bash
npm install
```

### 2️⃣ สร้างไฟล์ `.env.local`

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# JWT Secret (เปลี่ยนใน production)
JWT_SECRET=your-secret-key-change-in-production

# MySQL Configuration (Optional)
# ถ้าไม่ตั้งค่า = ใช้ Mock Data
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pet_cafe
```

**หมายเหตุ:** หากไม่มี MySQL ข้ามไปขั้นตอน 3 ได้เลย - ระบบจะใช้ Mock Data อัตโนมัติ

### 3️⃣ ตั้งค่า MySQL Database (Optional)

**ดูคู่มือเต็ม:** [DATABASE_SETUP.md](./DATABASE_SETUP.md)

```bash
# สั้น ๆ:
1. รัน database/schema.sql เพื่อสร้าง database
2. รัน database/seed.sql เพื่อ import ข้อมูลตัวอย่าง
3. ตั้งค่า .env.local ให้ตรงกับ MySQL credentials
```

### 4️⃣ รัน Development Server

```bash
npm run dev
```

จากนั้นเปิด **[http://localhost:3000](http://localhost:3000)**

### 5️⃣ ทดสอบ Login

ใช้ credentials นี้:

**Admin Account:**
- Email: `admin@petcafe.com`
- Password: `admin123`

**User Account:**
- Email: `user@example.com`
- Password: `user123`

## 📦 Production Build

```bash
npm run build
npm start
```

## 🔌 API Routes

| Route | Method | บัญชรายการ |
|-------|--------|----------|
| `/api/auth/*` | POST | Login, Register, Logout, Get Current User |
| `/api/menu/*` | GET, POST, PUT, DELETE | ดูและจัดการเมนู |
| `/api/orders/*` | GET, POST, PUT, DELETE | ดูและจัดการออเดอร์ |
| `/api/pets/*` | GET, POST, PUT, DELETE | ดูและจัดการสัตว์เลี้ยง |
| `/api/reviews/*` | GET, POST, PUT, DELETE | ดูและจัดการรีวิว |
| `/api/promotions/*` | GET, POST, PUT, DELETE | ดูและจัดการโปรโมชั่น |
| `/api/banners/*` | GET, POST, PUT, DELETE | ดูและจัดการแบนเนอร์ |
| `/api/dashboard/*` | GET | ดูสรุปข้อมูล (Admin) |

**ดูเอกสาร API ฉบับเต็ม:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 💾 Database

### โครงสร้าง
- **12 Tables** ครอบคลุมทุก features
- **Foreign Keys** สำหรับ data integrity
- **Indexes** เพื่อ optimize performance
- **UTF8MB4** Charset รองรับภาษาไทย

ดูรายละเอียดเต็ม: [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### Connection Options
1. **MySQL** - สำหรับ Production
2. **Mock Data** - สำหรับ Development ทดสอบเร็ว (ไม่ต้องติดตั้ง MySQL)

## ⚙️ Production Deployment

ก่อน deploy ให้อ่านและติดตามจุดสำคัญเหล่านี้:

1. **ตั้งค่า Environment Variables ที่ปลอดภัย**
   - ใช้ Strong `JWT_SECRET` 
   - ตั้งค่า `NEXT_PUBLIC_API_URL` ให้ถูกต้อง

2. **Database Security**
   - ใช้ Strong password สำหรับ MySQL
   - ไม่ใช้ default credentials
   - ปิด MySQL port จากการเข้าถึง public

3. **SSL/HTTPS**
   - บังคับเป็น HTTPS
   - ใช้ SSL certificate ที่ valid

4. **Password Security**  
   - Hash passwords ด้วย bcrypt (implemented)
   - ไม่เก็บ plaintext passwords

5. **API Rate Limiting**
   - พิจารณาทำ rate limiting สำหรับ production

## 📚 เอกสารเพิ่มเติม

- [QUICK_START.md](./QUICK_START.md) - คู่มือเริ่มต้นเร็ว ๆ
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - วิธีติดตั้ง MySQL
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - เอกสาร API เต็ม
- [CHECK_SETUP.md](./CHECK_SETUP.md) - Checklist การตั้งค่า

## 🎯 Available Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server
npm run clean      # Clear .next cache
npm run lint       # Run ESLint
```

## 📝 License

MIT
