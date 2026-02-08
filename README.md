# Pet Cafe - เว็บไซต์ร้านคาเฟ่สัตว์เลี้ยง

เว็บไซต์สำหรับร้านคาเฟ่ที่มีสัตว์เลี้ยง พร้อมระบบสั่งอาหารและเครื่องดื่ม

## เทคโนโลยีที่ใช้

- **Next.js 16** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **Zustand** - State Management
- **React Query** - Data Fetching & Caching
- **Axios** - HTTP Client
- **QR Scanner** - QR Code Scanning
- **Chart.js** - Data Visualization
- **JWT** - Authentication
- **MySQL** - Database (พร้อม Mock Data fallback)

## โครงสร้างโปรเจค

```
project_davit/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin pages
│   ├── api/               # API routes (Backend)
│   ├── login/             # Authentication
│   ├── register/
│   ├── menu/              # Menu pages
│   ├── cart/              # Shopping cart
│   ├── orders/            # Order management
│   ├── pets/              # Pet pages
│   ├── reviews/           # Reviews
│   ├── promotions/        # Promotions
│   └── layout.tsx         # Root layout
├── components/            # React Components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── admin/            # Admin components
│   └── qr/               # QR Code components
├── lib/                  # Utilities & Config
│   ├── api/              # API queries & axios config
│   ├── auth/             # JWT authentication
│   ├── db/               # Database functions
│   ├── stores/           # Zustand stores
│   ├── providers/        # React providers
│   └── utils/            # Utility functions
├── database/             # Database scripts
│   ├── schema.sql        # Database schema
│   └── seed.sql          # Seed data
├── types/                # TypeScript types
└── public/               # Static assets
```

## ฟีเจอร์หลัก

### 👥 ผู้ใช้ทั่วไป (User)
- ✅ สมัครสมาชิก / เข้าสู่ระบบ
- ✅ ดูเมนูอาหารและเครื่องดื่ม
- ✅ สั่งอาหารเครื่องดื่มผ่านเว็บไซต์
- ✅ ระบบสร้างบิลอัตโนมัติ
- ✅ ดูสถานะบิล (รอชำระ / ชำระแล้ว / สำเร็จ)
- ✅ สแกน QR Code
- ✅ ดูประวัติสัตว์เลี้ยง + ตารางเวลาเล่น
- ✅ ดูส่วนผสม / คำเตือนเครื่องดื่ม
- ✅ ดูตารางเวลาเล่นสัตว์เลี้ยงรายวัน
- ✅ ให้คะแนนและรีวิวร้าน
- ✅ ดูโปรโมชั่น

### 🛠️ ผู้ดูแลระบบ (Admin)
- ✅ จัดการเมนูอาหารและเครื่องดื่ม
- ✅ จัดการประวัติสัตว์เลี้ยง
- ✅ จัดการตารางเวลาเล่นสัตว์เลี้ยงรายวัน
- ✅ ตรวจสอบและอนุมัติบิล
- ✅ แก้ไขเนื้อหาหน้าเว็บไซต์ (Banner / โปรโมชั่น)
- ✅ ดูข้อมูลสรุปพื้นฐาน (บิล / ออเดอร์ / คะแนน)

## การติดตั้ง

### 1. Clone และติดตั้ง Dependencies

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev
```

### 2. ตั้งค่า Database (MySQL)

**ดูคู่มือการติดตั้ง MySQL ที่ [DATABASE_SETUP.md](./DATABASE_SETUP.md)**

สรุปขั้นตอน:
1. ติดตั้ง MySQL และ MySQL Workbench
2. สร้าง database โดยรัน `database/schema.sql`
3. Import seed data โดยรัน `database/seed.sql`
4. ตั้งค่า `.env.local`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pet_cafe
JWT_SECRET=your-secret-key
```

**หมายเหตุ:** หากไม่ตั้งค่า `DB_HOST` ระบบจะใช้ Mock Data อัตโนมัติ

### 3. รันโปรเจค

```bash
# Development
npm run dev

# Build สำหรับ production
npm run build

# รัน production server
npm start
```

## Environment Variables

สร้างไฟล์ `.env.local`:

```env
# Database Configuration (optional - ถ้าไม่ตั้งจะใช้ Mock Data)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=pet_cafe

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## API Routes

โปรเจคนี้มี Backend API พร้อมใช้งานแล้ว:

- ✅ `/api/auth/*` - Authentication (login, register, me, logout)
- ✅ `/api/menu/*` - Menu management (CRUD)
- ✅ `/api/orders/*` - Order management (CRUD + status update)
- ✅ `/api/pets/*` - Pet management (CRUD + schedules + QR)
- ✅ `/api/reviews/*` - Reviews (CRUD + average rating)
- ✅ `/api/promotions/*` - Promotions (CRUD)
- ✅ `/api/banners/*` - Banners (CRUD)
- ✅ `/api/dashboard/*` - Dashboard stats

ดูเอกสาร API ฉบับเต็มที่ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## การใช้งาน

1. **เริ่มต้นใช้งาน**: รัน `npm run dev` และเปิด `http://localhost:3000`
2. **สมัครสมาชิก**: ไปที่ `/register` เพื่อสร้างบัญชีใหม่
3. **ดูเมนู**: ไปที่ `/menu` เพื่อดูเมนูอาหารและเครื่องดื่ม
4. **สั่งอาหาร**: เพิ่มเมนูลงตะกร้าและสั่งอาหาร
5. **ดูสัตว์เลี้ยง**: ไปที่ `/pets` เพื่อดูสัตว์เลี้ยงและตารางเวลา
6. **สแกน QR**: ไปที่ `/pets/scan` เพื่อสแกน QR Code

## Test Accounts

### Admin
- Email: `admin@petcafe.com`
- Password: `admin123`

### User
- Email: `user@example.com`
- Password: `user123`

## Database

### โครงสร้าง Database

- **12 Tables** ครอบคลุมทุก features
- **Relationships** ที่ถูกต้อง (Foreign Keys)
- **Indexes** สำหรับ performance
- **UTF8MB4** สำหรับรองรับภาษาไทย

ดูรายละเอียดที่ [DATABASE_SETUP.md](./DATABASE_SETUP.md)

## หมายเหตุ

- ✅ **Backend API พร้อมใช้งานแล้ว** - ใช้ Mock Data หรือ MySQL
- ✅ **Database Schema พร้อมใช้งาน** - รองรับ MySQL
- ⚠️ ใน production ควร:
  - ใช้ database จริง (PostgreSQL, MySQL, MongoDB, etc.)
  - Hash passwords ด้วย bcrypt (ทำแล้วใน MySQL mode)
  - ตั้งค่า `JWT_SECRET` ที่ปลอดภัย
  - ใช้ SSL สำหรับการเชื่อมต่อ database

## License

MIT
