# คู่มือโปรเจกต์ HeyNow Booking System (ภาษาไทย)

---

## 1. ภาพรวมโปรเจกต์

**HeyNow Booking System** เป็นระบบจองห้องพักโรงแรมแบบครบวงจร ประกอบด้วย 2 ส่วนหลัก:

| ส่วน | ผู้ใช้งาน | เส้นทาง |
|---|---|---|
| **เว็บไซต์หน้าแรก (Public Website)** | ลูกค้าทั่วไป | `/` `/booking` `/rooms/:id` |
| **ระบบหลังบ้าน (Admin Back-Office)** | พนักงาน/ผู้ดูแล | `/admin/*` |

### ความสามารถหลัก
- จองห้องพักออนไลน์ (เลือกรับห้อง → เลือกวันที่ → กรอกข้อมูล → อัปโหลดสลิป)
- จัดการข้อมูลห้องพัก รองรับ 3 ภาษา (ไทย/อังกฤษ/จีน)
- จัดการราคาห้องพักตามเดือน (ราคาวันทำงาน / ราคาวันหยุด)
- จัดการวันหยุดพิเศษ (เพิ่มราคาช่วงเทศกาล)
- จัดการพนักงานและแผนก
- ยืนยันการจอง + อัปโหลดสลิปยืนยัน
- เช็คการจองซ้ำซ้อน (overlap detection)

---

## 2. เทคโนโลยีที่ใช้

| ชั้น | เทคโนโลยี | หน้าที่ |
|---|---|---|
| Frontend | React 19 + Vite 8 | สร้างหน้าเว็บ |
| Routing | React Router DOM 7 | จัดการเส้นทาง |
| Styling | Tailwind CSS 3 | จัดรูปแบบ UI |
| Icons | Lucide React | ไอคอน |
| Backend | Node.js + Express 5 | API Server |
| Database | Supabase (PostgreSQL) | ฐานข้อมูล |
| Auth | JWT + bcryptjs | ล็อกอิน / ความปลอดภัย |
| File Upload | Multer | อัปโหลดรูปสลิป |

---

## 3. โครงสร้างโปรเจกต์

```
heynowbackend/
│
├── Client/                    ★ ส่วนหน้าเว็บ (React)
│   ├── src/
│   │   ├── App.jsx            ★ รวม Route ทั้งหมด
│   │   ├── main.jsx           ★ จุดเริ่มต้น React
│   │   ├── variable.jsx       ★ ตัวแปร API_URL
│   │   ├── index.css          ★ สไตล์ทั่วโลก + ฟอนต์
│   │   │
│   │   ├── Components/
│   │   │   ├── Layouts/       ★ โครงสร้าง Admin
│   │   │   │   ├── Layout.jsx      # เปลือกหุ้ม: Navbar + Sidebar + content
│   │   │   │   ├── Navbar.jsx      # แถบด้านบน
│   │   │   │   └── Sidebar.jsx     # เมนูด้านข้าง (ยุบได้)
│   │   │   │
│   │   │   └── DataTable/     ★ ระบบตาราง共用 (ใช้ทุก list page)
│   │   │       ├── DetailListPage.jsx  # ตัวจัดการหลัก (state + fetch)
│   │   │       └── Section/
│   │   │           ├── Toolbar.jsx       # ค้นหา + ฟิลเตอร์ + ปุ่มเพิ่ม
│   │   │           ├── DataTable.jsx     # ตาราง (ปรับขนาดคอลัมน์ได้)
│   │   │           ├── ExpandedPanel.jsx # แผงด้านข้าง (กดดูรายละเอียด)
│   │   │           └── Pagination.jsx    # เปลี่ยนหน้า
│   │   │
│   │   ├── Routes/            ★ หน้า Admin
│   │   │   ├── Login.jsx              # หน้าเข้าระบบ
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.jsx       # หน้าแรกหลังล็อกอิน
│   │   │   ├── Employee/
│   │   │   │   ├── EmployeeList.jsx    # รายการพนักงาน
│   │   │   │   ├── CreateEmployee.jsx  # เพิ่มพนักงาน (modal)
│   │   │   │   └── EditEmployee.jsx    # แก้ไขพนักงาน (modal)
│   │   │   ├── Department/
│   │   │   │   ├── DepartmentList.jsx  # รายการแผนก
│   │   │   │   ├── CreateDepartment.jsx
│   │   │   │   └── EditDepartment.jsx
│   │   │   ├── Room/
│   │   │   │   ├── RoomList.jsx        # ★ รายการห้อง (3 ภาษา + ราคาปัจจุบัน)
│   │   │   │   ├── CreateRoom.jsx      # เพิ่มห้อง (3 ภาษา)
│   │   │   │   └── EditRoom.jsx        # แก้ไขห้อง
│   │   │   ├── Booking/
│   │   │   │   ├── BookingList.jsx     # ★ รายการจอง (ยืนยันการจอง)
│   │   │   │   ├── CreateBooking.jsx
│   │   │   │   └── EditBooking.jsx
│   │   │   └── PriceSetting/
│   │   │       └── PriceSetting.jsx    # ★ จัดการราคาห้อง + วันหยุด
│   │   │
│   │   └── booking/           ★ ส่วนเว็บไซต์ลูกค้า
│   │       ├── components/
│   │       │   ├── BookingPage.jsx     # หน้ากรอกจอง
│   │       │   ├── ShowCalendar.jsx    # ปฏิทินเลือกวัน
│   │       │   ├── Hero.jsx            # ส่วนหัว
│   │       │   ├── Rooms.jsx           # แสดงรายการห้อง
│   │       │   ├── RoomDetail.jsx      # หน้ารายละเอียดห้อง
│   │       │   ├── Navbar.jsx / Footer.jsx
│   │       │   └── ...
│   │       ├── contexts/
│   │       │   └── LanguageContext.jsx # สลับภาษา
│   │       └── data/
│   │           └── content.js          # ข้อความเนื้อหา
│   │
│   ├── vite.config.js         ★ Proxy API → localhost:5000
│   └── tailwind.config.js     ★ ธีมสี (warm, forest, mist)
│
├── Server/                    ★ ส่วนหลังบ้าน (Express)
│   ├── index.js               ★ จุดเริ่มต้น Server
│   ├── db.js                  ★ เชื่อมต่อ Supabase
│   ├── Middlewares/
│   │   ├── auth.js            ★ ตรวจ JWT Token
│   │   └── errorHandler.js    # จัดการ error ทั่วไป
│   ├── Upload/
│   │   ├── uploadSlip.js      # อัปโหลดสลิปจอง
│   │   ├── uploadConfirm.js   # อัปโหลดสลิปยืนยัน
│   │   └── uploadEmployee.js  # อัปโหลดรูปพนักงาน
│   ├── public/uploads/        # ไฟล์ที่อัปโหลด
│   │
│   └── Routes/                ★ API Endpoints
│       ├── Auth/route.js           # POST /auth/login
│       ├── Employee/route.js       # CRUD พนักงาน
│       ├── Department/route.js     # CRUD แผนก
│       ├── Room/route.js           # CRUD ห้อง (3 ภาษา)
│       ├── Booking/route.js        # CRUD จอง + ยืนยัน
│       ├── PriceRoom/route.js      # จัดการราคารายเดือน
│       ├── PriceHoliday/route.js   # จัดการวันหยุด
│       └── Upload/route.js         # อัปโหลดไฟล์
│
└── Document.md                # เอกสารส่งมอบ (ภาษาอังกฤษ)
└── Guideline.md               # ← คุณอยู่ตรงนี้
```

---

## 4. แต่ละส่วนทำงานยังไง

### 4.1 Frontend — DataTable System (ระบบตาราง共用)

Admin ทุกหน้ารายการ (Employee, Department, Room, Booking) ใช้ **DataListPage** เป็นตัวจัดการหลัก:

```
DataListPage.jsx (ตัวจัดการ — fetch ข้อมูล + จัดการ state + compose)
│
├── Toolbar.jsx       → แถบค้นหา + ฟิลเตอร์ + ปุ่ม "เพิ่ม"
├── ExpandedPanel.jsx → แผงเลื่อนด้านข้าง (กดที่แถวเพื่อดูรายละเอียด)
├── DataTable.jsx     → ตารางหลัก (ปรับขนาดคอลัมน์ได้)
└── Pagination.jsx    → สลับหน้า (10/25/50/100/ทั้งหมด)
```

**วิธีการทำงาน:**
1. `DataListPage` รับ `config` ที่มี `apiPath`, `columns`, `searchFields`, `expandedContent` ฯลฯ
2. ตอน mount จะเรียก `fetch()` ไปที่ `${API_URL}${apiPath}` พร้อม Token
3. เก็บผลลัพธ์ใน `rows` state
4. ค้นหา / กรอง / ทำ pagination จาก frontend (ไม่ต้องเรียก API ซ้ำ)
5. เมื่อคลิกแถว → เปิด `ExpandedPanel` ด้านข้าง
6. เมื่อคลิกปุ่มแก้ไข → เปิด Modal (`CreateModal` / `EditModal`)

**การสร้าง List Page ใหม่:**
```jsx
// แค่เขียน config แล้วส่งให้ DataListPage
const CONFIG = {
  apiPath: "/your-endpoint",
  entityKey: "id_field",
  columns: [ /* ... */ ],
  expandedContent: (row) => <DetailComponent row={row} />,
};
<DataListPage config={CONFIG} />
```

### 4.2 Frontend — การเรียก API

- ตัวแปร `API_URL` อยู่ที่ `Client/src/variable.jsx`
- ค่ามาจาก `import.meta.env.VITE_HTTP_NODEJS_API`
- ถ้าเป็นค่าว่าง → ใช้ Vite Proxy (ส่งต่อไปที่ `localhost:5000`)
- ทุกครั้งที่เรียก API ต้องส่ง Token:
  ```js
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const res = await fetch(`${API_URL}/room/th`, { headers });
  ```

### 4.3 Backend — Express Server

`Server/index.js` เป็นจุดเริ่มต้น:
1. เปิด CORS (รับ request จากทุก origin)
2. รับ JSON body
3. mount Routes:
   - `/auth` → ระบบล็อกอิน
   - `/employee` → จัดการพนักงาน
   - `/department` → จัดการแผนก
   - `/room` → จัดการห้อง
   - `/booking` → จัดการจอง
   - `/upload` → อัปโหลดไฟล์
   - `/price-room` → จัดการราคา
   - `/price-holiday` → จัดการวันหยุด
4. เสิร์ฟไฟล์ static (รูปที่อัปโหลด) ที่ `public/`
5. รับ error handler สุดท้าย

### 4.4 Backend — Auth Flow

```
POST /auth/login { emp_code, password }
  → ตรวจสอบ emp_tbls ใน Supabase
  → เปรียบเทียบรหัสผ่านด้วย bcrypt
  → สร้าง JWT token (หมดอายุ 8 ชม.)
  → เก็บ token ไว้ใน token_tbls
  → ส่ง { token, employee: {...} } กลับ
```

**auth.js middleware:**
- ดึง Token จาก Header `Authorization: Bearer <token>`
- ตรวจสอบ JWT signature
- ค้นหา Token ใน `token_tbls` (ต้องมีอยู่จริงและไม่หมดอายุ)
- ถ้าผ่าน → ตั้ง `req.user` → เรียก `next()`

⚠️ ปัจจุบัน middleware auth.js **ยังไม่ได้ถูกใช้**กับ Routes ส่วนใหญ่ ต้องเพิ่มเอง

### 4.5 Backend — Supabase Queries

เชื่อมต่อผ่าน `Server/db.js`:
```js
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
```

**รูปแบบการเรียก:**
```js
// JOIN ตาราง (relation ผ่าน foreign key)
const { data } = await supabase
  .from('room_tbls')
  .select('*, room_detail_th_tbls(*)')    // → ได้ nested object
  .in('room_id', ['R001', 'R002']);

// Flat: เอาเฉพาะฟิลด์ที่ต้องการ
const { data } = await supabase
  .from('emp_tbls')
  .select('emp_code, emp_name, dep_tbls(dep_full)');
  // → { emp_code, emp_name, dep_tbls: { dep_full } }
```

---

## 5. ระบบห้องพัก (Room) — รองรับ 3 ภาษา

### 5.1 โครงสร้างข้อมูล

```
room_tbls (ตารางหลักห้อง)
├── room_id           PK
├── room_capacity     จำนวนคน
├── room_price        ราคาพื้นฐาน
├── room_rooms        จำนวนห้องที่มี
├── room_detail_th_id → room_detail_th_tbls.room_detail_th_id
├── room_detail_en_id → room_detail_en_tbls.room_detail_en_id
└── room_detail_cn_id → room_detail_cn_tbls.room_detail_cn_id

room_detail_th_tbls (รายละเอียดภาษาไทย)
├── room_detail_th_id   PK
├── room_detail_th_name       ชื่อห้อง
├── room_detail_th_detail     รายละเอียด
├── room_detail_th_storyMain1-5  เรื่องราวหลัก
└── room_detail_th_storySub1-5   เรื่องราวย่อย
```

### 5.2 การเรียกข้อมูลตามภาษา

```js
// GET /room/th → ได้ข้อมูลภาษาไทย
const selectQuery = '*, room_detail_th_tbls(*)';
// → { room_id, ..., details: { room_detail_th_name, ... } }

// GET /room/en → ได้ข้อมูลภาษาอังกฤษ  
const selectQuery = '*, room_detail_en_tbls(*)';
// → { room_id, ..., details: { room_detail_en_name, ... } }
```

ที่ Frontend มี Switch ภาษา (TH/EN/CN) ที่เปลี่ยน `apiPath` เช่น `/room/th` → `/room/en`

### 5.3 ราคาห้องใน Room List

คอลัมน์ "Base Price" ใน RoomList **ไม่ได้ใช้ `room_price` จาก room_tbls** แต่จะไปดึงข้อมูลจาก `price_room_tbls` มาแสดงราคาของ **เดือนปัจจุบัน** (Workingday / Holiday) แทน

---

## 6. ระบบราคา (Pricing)

### 6.1 ส่วนประกอบ

| ตาราง | เก็บอะไร | ตัวอย่างข้อมูล |
|---|---|---|
| `price_room_tbls` | ราคาต่อเดือนต่อห้อง | มกราคม: WD 3500, HL 4500 |
| `price_holiday_tbls` | วันหยุดพิเศษ | 2026-04-13: สงกรานต์ |

### 6.2 หน้า Price Setting (`/admin/pricesetting`)

- เลือกห้อง + ปี
- แสดง 12 เดือน กรอกราคา WD/HL ได้
- ปุ่ม Copy from Previous Year (ก็อปปี้ราคาจากปีที่แล้ว)
- แถบแพ Ab (X/12 เดือน)
- Tab Holiday: เพิ่ม/ลบวันหยุดพิเศษ

### 6.3 การบันทึกราคา

```js
// PUT /price-room/batch
body: {
  room_id: "R001",
  price_year: 2026,
  prices: [
    { price_month: 1, workingday_price: 3500, holiday_price: 4500 },
    // ... 12 เดือน
  ]
}
```

ระบบใช้ `upsert` (insert or update) โดยใช้ `room_id + price_year + price_month` เป็น key

---

## 7. ระบบจอง (Booking)

### 7.1 Flow การทำงาน

```
1. ลูกค้าเลือกวันที่ → ระบบเช็คห้องว่าง
2. เลือกห้อง → ดูราคาตามวันที่
3. กรอกข้อมูลส่วนตัว + จำนวนคน/สัตว์เลี้ยง
4. อัปโหลดสลิปโอนเงิน (ไม่บังคับ)
5. กดจอง → สร้าง Booking ID: BK-YYMMDD-XXX
   → ตรวจสอบ overlap: ถ้าห้องซ้อน → แจ้ง error
6. Admin ดูรายการที่ `/admin/booking/list`
7. Admin กด Confirm → สร้าง Confirm ID: CF-YYMMDD-XXX
   → อัปโหลดสลิปยืนยัน (optional)
```

### 7.2 API Booking

```
GET    /booking                        → รายการจองทั้งหมด (พร้อมชื่อห้อง)
GET    /booking/:booking_id            → รายการจองเดี่ยว
POST   /booking                        → สร้างการจองใหม่ (auto ID + check overlap)
PUT    /booking/:booking_id            → แก้ไขการจอง
POST   /booking/:booking_id/confirm    → ยืนยันการจอง
```

### 7.3 ข้อมูลที่ Response จาก GET /booking

```json
{
  "booking_id": "BK-260721-001",
  "room_id": "R001",
  "room_detail_th_name": "ห้องดีลักซ์",     // ← ดึงจาก room_detail_th_tbls
  "room_detail_en_name": "Deluxe Room",    // ← ดึงจาก room_detail_en_tbls
  "room_price": 3500,                       // ← ดึงจาก room_tbls
  "booking_name": "สมชาย",
  "booking_checkin": "2026-07-21",
  "booking_checkout": "2026-07-23",
  "confirm_id": "CF-260721-001",
  "confirm_status": "confirmed",
  "confirm_emp_code": "EMP01",
  ...
}
```

### 7.4 หน้ารายการจอง (BookingList)

- คอลัมน์: Booking (ชื่อ + ID), Room Name (TH/EN), Price, Contact, Guests, Pets, Check IN-OUT, Note, Confirm
- คลิกแถว → Expanded Panel แสดง: Guest Info, Booking Details, Guests & Pets, Payment & Confirmation
- ปุ่ม Confirm → เปิด Dialog ให้ยืนยัน (พร้อมอัปโหลดสลิป)

---

## 8. ระบบล็อกอิน

### 8.1 หน้า Login (`/admin/login`)

- กรอก `emp_code` + `password`
- เรียก `POST /auth/login`
- ถ้าถูกต้อง → เก็บ `token` และ `employee` ไว้ใน localStorage
- Redirect ไป `/admin/dashboard`

### 8.2 Auth Guard

```jsx
const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token") ? children : <Navigate to="/admin/login" />;
};
```

ใช้ `<PrivateRoute>` หุ้มทุกหน้า Admin ใน `App.jsx`

### 8.3 Logout

- ลบ `token` และ `employee` ออกจาก localStorage
- Redirect ไป `/admin/login`

---

## 9. Sidebar & Navigation

เมนูด้านข้างของ Admin (อยู่ใน `Sidebar.jsx`):

| เมนู | ไอคอน | เส้นทาง |
|---|---|---|
| Dashboard | LayoutDashboard | `/admin/dashboard` |
| Access | ShieldCheck | `/admin/access/list` |
| Employee | Users | `/admin/employee/list` |
| Department | Building2 | `/admin/department/list` |
| Room | BedDouble | `/admin/room/list` |
| Booking | Calendar | `/admin/booking/list` |
| Price Setting | DollarSign | `/admin/pricesetting` |

Sidebar สามารถยุบ/ขยายได้ (จำสถานะไว้ใน localStorage: `sidebarCollapsed`)

---

## 10. วิธีการเริ่มต้นโปรเจกต์

### Backend
```bash
cd Server
npm install
# แก้ไขไฟล์ .env ให้มีข้อมูลถูกต้อง
npm run dev        # → เริ่มที่ port 5000
```

### Frontend
```bash
cd Client
npm install
# แก้ไขไฟล์ .env ถ้าจำเป็น (ปกติปล่อยว่าง)
npm run dev        # → เริ่มที่ port 5173
```

### Build Production
```bash
cd Client
npm run build      # → สร้างไฟล์ที่ dist/
```

---

## 11. การเพิ่มหน้า Admin ใหม่

1. สร้างไฟล์ใน `Client/src/Routes/<ชื่อ>/`
2. ใช้ `DataListPage` pattern (หรือเขียนตรงถ้าซับซ้อน)
3. เพิ่ม Route ใน `App.jsx` ด้วย `<PrivateRoute>`
4. เพิ่มเมนูใน `Sidebar.jsx`
5. สร้าง Backend Route ใน `Server/Routes/<ชื่อ>/route.js`
6. mount Route ใน `Server/index.js`

**ตัวอย่างการเขียน List Page:**
```jsx
import { useState } from "react";
import DataListPage from "../../Components/DataTable/DetailListPage";

const COLUMNS = [
  { header: "Name", cell: (row) => <span>{row.name}</span> },
];

export default function MyList() {
  const CONFIG = {
    apiPath: "/my-endpoint",
    entityKey: "id",
    columns: COLUMNS,
    searchFields: ["name"],
    expandedContent: (row) => <div>{/* detail */}</div>,
    onAdd: () => setIsModalOpen(true),
  };
  return <DataListPage config={CONFIG} />;
}
```

---

## 12. สิ่งที่ควรทำต่อ (Code Cleanup)

- ❌ เอา `route copy.js` ออก (legacy MSSQL ที่ไม่ใช้แล้ว)
- ❌ เอา `Access/` `Token/` routes ออก (ไม่ได้ mount ใน index.js)
- ❌ เอา `ExpandedPanel copy.jsx` `EmployeeList copy.jsx` ออก
- ⚠️ เพิ่ม `auth.js` middleware ให้ Routes ที่まだไม่มี
- ⚠️ เปลี่ยน `alert()` เป็น UI error handling ที่ดีกว่า
- ⚠️ เพิ่ม Loading state ใน Create/Edit modals
- ✅ System รองรับ multi-language (Room, Public Website)

---

## 13. Vite Proxy Config

ใน `vite.config.js` มี proxy สำหรับพัฒนา:

```js
server: {
  proxy: {
    "/auth":     { target: "http://localhost:5000" },
    "/employee": { target: "http://localhost:5000" },
    "/room":     { target: "http://localhost:5000" },
    "/booking":  { target: "http://localhost:5000" },
    "/upload":   { target: "http://localhost:5000" },
    "/price-room":    { target: "http://localhost:5000" },
    "/price-holiday": { target: "http://localhost:5000" },
  }
}
```

เมื่อ `API_URL` เป็นค่าว่าง → `fetch("/room/th")` → Vite ส่งต่อไป `localhost:5000/room/th`

---

## 14. การเรียกดูรูปที่อัปโหลด

- สลิปจอง: `/uploads/slips/YYYY/MM/DD/filename.jpg`
- สลิปยืนยัน: `/uploads/confirm/YYYY/MM/DD/filename.jpg`
- รูปพนักงาน: `/uploads/employees/empcode.jpg`

Express เสิร์ฟไฟล์ static จากโฟลเดอร์ `public/`:
```js
app.use(express.static('public'));
// → /uploads/slips/... = public/uploads/slips/...
```

---

## 15. ข้อควรระวัง

| ปัญหา | สาเหตุ | วิธีแก้ |
|---|---|---|
| 404 ไม่เจอ API | Route ไม่ได้ mount ใน index.js | ตรวจสอบ `index.js` |
| ล็อกอินไม่ได้ | JWT_SECRET ไม่ตรง | ตรวจสอบ `.env` |
| Token หมดอายุ | เกิน 8 ชม. | ล็อกอินใหม่ |
| ราคาไม่แสดง | ไม่มีข้อมูลใน price_room_tbls | ไปหน้า Price Setting ตั้งราคา |
| ชื่อห้องเป็น ID | การ join ข้อมูลผิด | ตรวจสอบ `Booking/route.js` |
| จองซ้อน | overlap detection ป้องกันไว้แล้ว | ถ้าซ้อน → 409 Conflict |
| อัปโหลดไม่ได้ | Multer config / folder | ตรวจสอบ `Upload/` directory |
