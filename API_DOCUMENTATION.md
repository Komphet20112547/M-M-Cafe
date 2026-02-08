# API Documentation

เอกสาร API สำหรับ Pet Cafe Backend

## Base URL

```
/api
```

## Authentication

API ส่วนใหญ่ต้องการ JWT token ใน header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST `/api/auth/login`
เข้าสู่ระบบ

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "user123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "User",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

#### POST `/api/auth/register`
สมัครสมาชิก

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

**Response:**
```json
{
  "user": {
    "id": "2",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

#### GET `/api/auth/me`
ดูข้อมูลผู้ใช้ปัจจุบัน (ต้องมี token)

**Response:**
```json
{
  "id": "1",
  "email": "user@example.com",
  "name": "User",
  "role": "user"
}
```

#### POST `/api/auth/logout`
ออกจากระบบ

---

### Menu

#### GET `/api/menu`
ดูเมนูทั้งหมด

**Query Parameters:**
- `category` (optional): `food` | `drink`

**Response:**
```json
[
  {
    "id": "1",
    "name": "กาแฟอเมริกาโน",
    "description": "กาแฟดำเข้มข้น",
    "price": 80,
    "category": "drink",
    "ingredients": ["กาแฟ", "น้ำ"],
    "warnings": ["มีคาเฟอีน"]
  }
]
```

#### GET `/api/menu/[id]`
ดูเมนูรายการเดียว

#### POST `/api/menu` (Admin only)
เพิ่มเมนูใหม่

**Request Body:**
```json
{
  "name": "เมนูใหม่",
  "description": "คำอธิบาย",
  "price": 100,
  "category": "food",
  "ingredients": ["ส่วนผสม1", "ส่วนผสม2"],
  "warnings": ["คำเตือน"],
  "image": "https://example.com/image.jpg",
  "isAvailable": true
}
```

#### PUT `/api/menu/[id]` (Admin only)
แก้ไขเมนู

#### DELETE `/api/menu/[id]` (Admin only)
ลบเมนู

---

### Orders

#### GET `/api/orders`
ดูออเดอร์ของตัวเอง (User) หรือทั้งหมด (Admin)

**Response:**
```json
[
  {
    "id": "1",
    "userId": "1",
    "items": [
      {
        "id": "1",
        "menuItemId": "1",
        "menuItem": { ... },
        "quantity": 2,
        "price": 80,
        "subtotal": 160
      }
    ],
    "total": 160,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### POST `/api/orders`
สร้างออเดอร์ใหม่

**Request Body:**
```json
{
  "items": [
    {
      "menuItemId": "1",
      "quantity": 2
    }
  ]
}
```

#### GET `/api/orders/[id]`
ดูออเดอร์รายการเดียว

#### GET `/api/orders/all` (Admin only)
ดูออเดอร์ทั้งหมด

**Query Parameters:**
- `status` (optional): `pending` | `paid` | `completed` | `cancelled`

#### PATCH `/api/orders/[id]/status` (Admin only)
อัพเดทสถานะออเดอร์

**Request Body:**
```json
{
  "status": "paid"
}
```

**Status Values:**
- `pending` - รอชำระเงิน
- `paid` - ชำระแล้ว
- `completed` - สำเร็จ
- `cancelled` - ยกเลิก

---

### Pets

#### GET `/api/pets`
ดูสัตว์เลี้ยงทั้งหมด

#### GET `/api/pets/[id]`
ดูสัตว์เลี้ยงรายการเดียว

#### GET `/api/pets/qr/[qrCode]`
ดูสัตว์เลี้ยงจาก QR Code

#### GET `/api/pets/[id]/schedule`
ดูตารางเวลาสัตว์เลี้ยง

**Query Parameters:**
- `date` (optional): YYYY-MM-DD (default: วันนี้)

#### POST `/api/pets/[id]/schedule` (Admin only)
สร้าง/อัพเดทตารางเวลา

**Request Body:**
```json
{
  "date": "2024-01-01",
  "timeSlots": [
    {
      "startTime": "09:00",
      "endTime": "10:00",
      "isAvailable": true,
      "isRestTime": false,
      "maxRounds": 5,
      "currentRound": 0
    }
  ]
}
```

#### GET `/api/pets/schedules`
ดูตารางเวลาทั้งหมดของวัน

**Query Parameters:**
- `date` (optional): YYYY-MM-DD

#### POST `/api/pets` (Admin only)
เพิ่มสัตว์เลี้ยงใหม่

#### PUT `/api/pets/[id]` (Admin only)
แก้ไขสัตว์เลี้ยง

#### DELETE `/api/pets/[id]` (Admin only)
ลบสัตว์เลี้ยง

---

### Reviews

#### GET `/api/reviews`
ดูรีวิวทั้งหมด

#### POST `/api/reviews`
เขียนรีวิวใหม่

**Request Body:**
```json
{
  "rating": 5,
  "comment": "ร้านดีมาก!"
}
```

#### GET `/api/reviews/average`
ดูคะแนนเฉลี่ย

**Response:**
```json
{
  "average": 4.5,
  "count": 10
}
```

#### PUT `/api/reviews/[id]`
แก้ไขรีวิว (เฉพาะของตัวเอง)

#### DELETE `/api/reviews/[id]`
ลบรีวิว (เฉพาะของตัวเอง)

---

### Promotions

#### GET `/api/promotions`
ดูโปรโมชั่นที่ใช้งานอยู่

#### GET `/api/promotions/all` (Admin only)
ดูโปรโมชั่นทั้งหมด

#### POST `/api/promotions` (Admin only)
เพิ่มโปรโมชั่นใหม่

**Request Body:**
```json
{
  "title": "โปรโมชั่นพิเศษ",
  "description": "ลด 20%",
  "discount": 20,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T00:00:00Z",
  "isActive": true,
  "image": "https://example.com/image.jpg"
}
```

#### PUT `/api/promotions/[id]` (Admin only)
แก้ไขโปรโมชั่น

#### DELETE `/api/promotions/[id]` (Admin only)
ลบโปรโมชั่น

---

### Banners

#### GET `/api/banners`
ดู Banner ทั้งหมด

#### POST `/api/banners` (Admin only)
เพิ่ม Banner ใหม่

**Request Body:**
```json
{
  "title": "Banner Title",
  "description": "Description",
  "image": "https://example.com/image.jpg",
  "link": "https://example.com",
  "isActive": true,
  "order": 1
}
```

#### PUT `/api/banners/[id]` (Admin only)
แก้ไข Banner

#### DELETE `/api/banners/[id]` (Admin only)
ลบ Banner

---

### Dashboard (Admin only)

#### GET `/api/dashboard/stats`
ดูสถิติสรุป

**Response:**
```json
{
  "totalOrders": 100,
  "totalRevenue": 50000,
  "pendingOrders": 5,
  "averageRating": 4.5,
  "totalReviews": 50
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Test Accounts

### Admin
- Email: `admin@petcafe.com`
- Password: `admin123`

### User
- Email: `user@example.com`
- Password: `user123`

---

## Notes

- API นี้ใช้ Mock Data สำหรับ demo
- ใน production ควรเชื่อมต่อกับ database จริง
- JWT token มีอายุ 7 วัน
- Password ใน mock data ยังไม่ได้ hash (ควร hash ใน production)
