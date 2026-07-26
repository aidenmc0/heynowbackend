# HeyNow Booking System — Project Handover Document

## 1. Project Overview

**HeyNow Booking System** is a full-stack web application for managing hotel room bookings. It includes a **public-facing booking website** (for customers) and an **admin back-office** (for staff). The system supports multi-language content (Thai, English, Chinese), dynamic pricing by season/holiday, employee management, booking confirmations, and payment slip uploads.

---

## 2. Tech Stack

### Frontend (Client/)
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.5 | UI framework |
| Vite | ^8.0.9 | Build tool & dev server |
| React Router DOM | ^7.14.2 | Client-side routing |
| Tailwind CSS | ^3.4.19 | Utility-first styling |
| Lucide React | ^1.11.0 | Icon library |
| Framer Motion | ^12.23.26 | Animations |
| Three.js / @react-three/fiber | ^9.4.2 | 3D effects (background) |

### Backend (Server/)
| Technology | Version | Purpose |
|---|---|---|
| Node.js / Express | ^5.2.1 | HTTP server & API |
| Supabase JS | ^2.105.4 | Database client (PostgreSQL) |
| JSON Web Token (jsonwebtoken) | — | Auth tokens |
| bcryptjs | ^3.0.3 | Password hashing |
| Multer | ^2.1.1 | File uploads |
| dotenv | ^17.4.2 | Environment variables |

### Database
- **Supabase** (PostgreSQL) — all active data
- Legacy MSSQL (not in use) — old `Access` / `Token` tables

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Browser                            │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Vite Dev Server (port 5173)                    │ │
│  │  (proxies /api/* → localhost:5000)              │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP
┌──────────────────────▼──────────────────────────────┐
│  Express Server (port 5000)                          │
│  ├── Middleware: CORS, JSON, Auth (JWT)              │
│  ├── Routes: /auth, /employee, /department,          │
│  │   /room, /booking, /upload, /price-room,         │
│  │   /price-holiday                                  │
│  └── Static: /public/uploads/                        │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│  Supabase (PostgreSQL)                               │
│  Tables:                                             │
│  ├── emp_tbls (employees)                            │
│  ├── dep_tbls (departments)                          │
│  ├── room_tbls (rooms)                               │
│  ├── room_detail_th_tbls (TH details)                │
│  ├── room_detail_en_tbls (EN details)                │
│  ├── room_detail_cn_tbls (CN details)                │
│  ├── booking_tbls (bookings)                         │
│  ├── confirm_tbls (confirmations)                    │
│  ├── price_room_tbls (monthly prices)                │
│  ├── price_holiday_tbls (holiday overrides)          │
│  ├── token_tbls (JWT tokens)                         │
│  └── detail_his_tbls / emp_his_tbls (history)        │
└─────────────────────────────────────────────────────┘
```

---

## 4. Directory Structure

```
heynowbackend/
├── Client/                          # Frontend (Vite + React)
│   ├── .env                         # VITE_HTTP_NODEJS_API=''
│   ├── index.html                   # Entry HTML
│   ├── vite.config.js               # Vite config + proxy
│   ├── tailwind.config.js           # Tailwind theme (warm, forest, mist)
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── package.json
│   ├── public/                      # Static assets (images, favicon)
│   └── src/
│       ├── main.jsx                 # App entry point
│       ├── App.jsx                  # Routes definition
│       ├── index.css                # Global styles + fonts
│       ├── variable.jsx             # API_URL export
│       ├── CSS/                     # Legacy CSS files
│       ├── Utils/
│       │   └── useLocalStorage.js   # Persistent state hook
│       ├── Components/
│       │   ├── Layouts/
│       │   │   ├── Layout.jsx       # Admin shell (Navbar + Sidebar + main)
│       │   │   ├── Navbar.jsx       # Top navigation bar
│       │   │   └── Sidebar.jsx      # Side menu (collapsible)
│       │   └── DataTable/
│       │       ├── DetailListPage.jsx    # ★ Orchestrator for all list pages
│       │       ├── DateRangeFilter.jsx   # Date range filter component
│       │       ├── DateRangeUtils.js     # Date utility functions
│       │       └── Section/
│       │           ├── Toolbar.jsx       # Search, filters, add button
│       │           ├── DataTable.jsx     # Resizable-column table
│       │           ├── ExpandedPanel.jsx # Slide-over detail panel
│       │           └── Pagination.jsx    # Page controls
│       ├── Routes/
│       │   ├── Login.jsx                # Admin login
│       │   ├── Dashboard/
│       │   │   └── Dashboard.jsx        # Dashboard home
│       │   ├── Employee/
│       │   │   ├── EmployeeList.jsx     # Employee list
│       │   │   ├── CreateEmployee.jsx   # Create employee modal
│       │   │   └── EditEmployee.jsx     # Edit employee modal
│       │   ├── Department/
│       │   │   ├── DepartmentList.jsx   # Department list
│       │   │   ├── CreateDepartment.jsx # Create department modal
│       │   │   └── EditDepartment.jsx   # Edit department modal
│       │   ├── Room/
│       │   │   ├── RoomList.jsx         # ★ Room list (multi-lang, price map)
│       │   │   ├── CreateRoom.jsx       # Create room modal
│       │   │   └── EditRoom.jsx         # Edit room modal
│       │   ├── Booking/
│       │   │   ├── BookingList.jsx      # ★ Booking list (confirm flow)
│       │   │   ├── CreateBooking.jsx    # Create booking modal
│       │   │   └── EditBooking.jsx      # Edit booking modal
│       │   ├── PriceSetting/
│       │   │   └── PriceSetting.jsx     # Full price management page
│       │   └── Access/
│       │       └── AccessList.jsx       # Legacy access list
│       └── booking/                     # ★ PUBLIC WEBSITE components
│           ├── contexts/LanguageContext.jsx
│           ├── data/content.js
│           └── components/
│               ├── BookingPage.jsx      # Booking flow (calendar → form → slip)
│               ├── Navbar.jsx
│               ├── Hero.jsx
│               ├── Story.jsx
│               ├── Highlights.jsx
│               ├── Rooms.jsx
│               ├── RoomDetail.jsx
│               ├── Restaurant.jsx
│               ├── Gallery.jsx
│               ├── Layout.jsx
│               ├── Location.jsx
│               ├── Footer.jsx
│               ├── ShowCalendar.jsx
│               └── Mobile/             # Mobile-specific components
│                   ├── DesktopArrows.jsx
│                   ├── ProgressBar.jsx
│                   └── StoryCard.jsx
│
├── Server/                          # Backend (Express)
│   ├── .env                         # DB creds, JWT secret
│   ├── index.js                     # Express app entry
│   ├── db.js                        # Supabase client (single instance)
│   ├── package.json
│   ├── Middlewares/
│   │   ├── auth.js                  # JWT auth middleware
│   │   └── errorHandler.js          # Global error handler
│   ├── Upload/                      # Multer configs
│   │   ├── uploadSlip.js
│   │   ├── uploadConfirm.js
│   │   └── uploadEmployee.js
│   ├── public/uploads/              # Uploaded files
│   └── Routes/
│       ├── Auth/
│       │   └── route.js             # POST /auth/login
│       ├── Employee/
│       │   └── route.js             # CRUD employees (Supabase)
│       ├── Department/
│       │   └── route.js             # CRUD departments (Supabase)
│       ├── Room/
│       │   └── route.js             # Room CRUD (multi-language)
│       ├── Booking/
│       │   └── route.js             # Booking CRUD + confirm
│       ├── PriceRoom/
│       │   └── route.js             # Monthly prices batch upsert
│       ├── PriceHoliday/
│       │   └── route.js             # Holiday overrides CRUD
│       └── Upload/
│           └── route.js             # File upload endpoints
│
└── Document.md                      # ← You are here
```

---

## 5. Setup & Installation

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### 5.1 Backend Setup

```bash
cd Server
npm install
cp .env.example .env    # Edit with your Supabase credentials
npm run dev             # Starts on port 5000 with nodemon
```

**Required `.env` variables:**
```
PORT=5000
JWT_SECRET=your_jwt_secret

SUPABASE_URL=https://wstrszkunqeblbqaeuxf.supabase.co
SUPABASE_KEY=<supabase_publishable_key>
```

### 5.2 Frontend Setup

```bash
cd Client
npm install
cp .env.example .env
npm run dev             # Starts on port 5173
```

**Required `.env` variables:**
```
VITE_HTTP_NODEJS_API=''      # Leave empty to use Vite proxy
VITE_HTTPS_NODEJS_API=''
```

If `VITE_HTTP_NODEJS_API` is empty, the frontend uses Vite's proxy (configured in `vite.config.js`) to forward API calls to `http://localhost:5000`.

### 5.3 Accessing the App
- **Public website**: `http://localhost:5173`
- **Admin login**: `http://localhost:5173/admin/login`
- **Admin dashboard**: `http://localhost:5173/admin/dashboard`

---

## 6. Frontend Architecture

### 6.1 Routing (App.jsx)

All routes are defined in `Client/src/App.jsx` using `react-router-dom` `BrowserRouter`.

| Path | Component | Access | Description |
|---|---|---|---|
| `/` | BookingHome | Public | Landing page with all sections |
| `/booking` | BookingPage | Public | Booking calendar + form |
| `/rooms/:id` | BookingRoomDetail | Public | Single room detail |
| `/admin/login` | Login | Public | Admin login form |
| `/admin/dashboard` | Dashboard | Auth | Dashboard home |
| `/admin/employee/list` | EmployeeList | Auth | Employee management |
| `/admin/employee/create` | CreateEmployee | Auth | Create employee |
| `/admin/room/list` | RoomList | Auth | Room management (multi-lang) |
| `/admin/room/create` | CreateRoom | Auth | Create room |
| `/admin/department/list` | DepartmentList | Auth | Department management |
| `/admin/booking/list` | BookingList | Auth | Booking management |
| `/admin/booking/create` | CreateBooking | Auth | Create booking |
| `/admin/pricesetting` | PriceSetting | Auth | Price management |

**Auth guard**: `PrivateRoute` component checks `localStorage.getItem("token")`. Unauthenticated users are redirected to `/admin/login`.

### 6.2 Data Layer (API calls)

- Base URL from `Client/src/variable.jsx` → `API_URL = import.meta.env.VITE_HTTP_NODEJS_API`
- Auth token stored in `localStorage` under key `"token"`
- All API calls use `Authorization: Bearer ${token}` header
- No TypeScript — plain JavaScript with JSDoc-style comments

### 6.3 Component Library: DataTable System

All admin list pages use the **DataTable orchestrator pattern**:

```
DetailListPage.jsx (orchestrator — state + fetch + compose)
├── Toolbar.jsx      (search + filters + add button)
├── ExpandedPanel.jsx (slide-over detail panel, opens on row click)
├── DataTable.jsx    (resizable columns + row actions)
└── Pagination.jsx   (page controls)
```

**How to create a new list page:**

```jsx
// 1. Define columns
const COLUMNS = [
  { header: "Name", cell: (row) => <span>{row.name}</span> },
  { header: "Status", cell: (row) => <span>{row.status}</span> },
];

// 2. Create the config
const CONFIG = {
  apiPath: "/your-endpoint",
  entityKey: "id_field",
  columns: COLUMNS,
  searchFields: ["name", "email"],
  expandedContent: (row) => <YourDetailComponent row={row} />,
  title: (row) => row.name,
  subtitle: (row) => row.status,
  addButtonLabel: "+ Add New",
  onAdd: () => setIsModalOpen(true),
  onEdit: (row) => setEditingRow(row),
  onDelete: (row) => handleDelete(row),
};

// 3. Render
<DataListPage config={CONFIG} />
```

### 6.4 Reusable Patterns

**InfoRow** — Label-value pair for detail panels:
```jsx
<InfoRow icon={<Users size={14} />} label="Capacity" value="2 คน" />
```

**SectionCard** — Card wrapper with header:
```jsx
<SectionCard title="Guest Info">
  <InfoRow ... />
  <InfoRow ... />
</SectionCard>
```

**Layout** — Admin shell wrapping all pages:
```jsx
import { Layout } from "../../Components/Layouts/Layout";
export default function MyPage() {
  return <Layout>{/* page content */}</Layout>;
}
```

---

## 7. Backend Architecture

### 7.1 Express Server (Server/index.js)

```js
app.use('/auth',           require('./Routes/Auth/route'));
app.use('/employee',       require('./Routes/Employee/route'));
app.use('/department',     require('./Routes/Department/route'));
app.use('/room',           require('./Routes/Room/route'));
app.use('/booking',        require('./Routes/Booking/route'));
app.use('/upload',         require('./Routes/Upload/route'));
app.use('/price-room',     require('./Routes/PriceRoom/route'));
app.use('/price-holiday',  require('./Routes/PriceHoliday/route'));
```

All routes use Supabase as the database (via `Server/db.js`). Legacy MSSQL routes exist in the codebase but are **not mounted** and should be removed.

### 7.2 Auth Middleware (Server/Middlewares/auth.js)

- Checks `Authorization: Bearer <token>` header
- Verifies JWT signature with `JWT_SECRET`
- Looks up token in `token_tbls` to ensure it's valid & not expired
- Sets `req.user = decoded` for downstream handlers

**Note**: The auth middleware is NOT applied globally in `index.js`. It must be applied per-route. Currently, most routes do NOT use it — only legacy route copies have it.

### 7.3 Supabase Schema (Key Tables)

| Table | Primary Key | Notes |
|---|---|---|
| `emp_tbls` | `emp_code` | Employees, with `dep_code` FK → `dep_tbls` |
| `dep_tbls` | `dep_code` | Departments |
| `room_tbls` | `room_id` | Rooms, has FKs to detail tables |
| `room_detail_th_tbls` | `room_detail_th_id` | Thai room content |
| `room_detail_en_tbls` | `room_detail_en_id` | English room content |
| `room_detail_cn_tbls` | `room_detail_cn_id` | Chinese room content |
| `booking_tbls` | `booking_id` | Bookings, FK `confirm_id` → `confirm_tbls` |
| `confirm_tbls` | `confirm_id` | Confirmations |
| `price_room_tbls` | `price_room_id` | Monthly prices per room (composite: room_id + year + month) |
| `price_holiday_tbls` | `holiday_id` | Specific-date holiday price overrides |
| `token_tbls` | `token_id` | JWT token storage |

### 7.4 Key Backend Endpoints

#### Authentication
```
POST /auth/login  body: { emp_code, password }
                  → { token, employee: { emp_code, emp_name, ... } }
```

#### Room (multi-language)
```
GET    /room/:lang           → [{ room_id, room_capacity, room_price, room_rooms, details: {...} }]
GET    /room/:lang/:room_id  → Single room with details
POST   /room                 → Create room (main record)
PUT    /room/:room_id        → Update room
POST   /room/details/:lang   → Create room detail for language
PUT    /room/details/:lang/:id → Update room detail
```

#### Booking
```
GET    /booking              → [{ booking_id, room_id, booking_name, room_detail_th_name, room_detail_en_name, ... }]
GET    /booking/:booking_id  → Single booking
POST   /booking              → Create booking (auto ID + overlap check)
PUT    /booking/:booking_id  → Update booking
POST   /booking/:id/confirm  → Confirm (creates confirm_tbls record)
```

#### Price Management
```
GET    /price-room?room_id=X&year=Y    → [{ price_month, workingday_price, holiday_price }]
PUT    /price-room/batch                → Batch upsert monthly prices
GET    /price-holiday                   → [{ holiday_id, specific_date, note }]
POST   /price-holiday                   → Add holiday override
DELETE /price-holiday/:id               → Delete holiday override
```

#### File Upload
```
POST   /upload/slip          → Upload booking payment slip → { path }
POST   /upload/confirm-slip  → Upload confirm slip → { path }
```

---

## 8. Key Features & Flows

### 8.1 Room Management (Multi-language)

Each room has ONE record in `room_tbls` and up to THREE detail records (one per language). The API joins via foreign keys:
- `room_tbls.room_detail_th_id` → `room_detail_th_tbls.room_detail_th_id`
- `room_tbls.room_detail_en_id` → `room_detail_en_tbls.room_detail_en_id`
- `room_tbls.room_detail_cn_id` → `room_detail_cn_tbls.room_detail_cn_id`

The frontend room list has a language switcher (TH/EN/CN) that changes the API path: `/room/th`, `/room/en`, `/room/cn`.

### 8.2 Pricing System

- **Base price**: `room_tbls.room_price` — default per-night rate
- **Price map**: `price_room_tbls` — 12 monthly entries per room/year with separate workingday/holiday prices
- **Holiday overrides**: `price_holiday_tbls` — specific dates with notes (e.g., Songkran, New Year)
- The **Room List** page shows the current month's workingday/holiday prices from price settings in the "Base Price" column
- The **Price Setting** page (`/admin/pricesetting`) manages all pricing with copy-from-previous-year functionality

### 8.3 Booking Flow

1. Public user visits `/booking`
2. Selects check-in/check-out dates (calendar shows availability)
3. Selects room
4. Fills guest info (name, email, phone, adults, children, pets)
5. Optional: uploads payment slip
6. System creates booking with auto-generated ID: `BK-YYMMDD-XXX`
7. Admin reviews booking on `/admin/booking/list`
8. Admin can "Confirm" booking → creates `CF-YYMMDD-XXX` confirm record
9. Confirmation can include an optional confirm slip upload

### 8.4 Booking Overlap Prevention

The booking creation endpoint checks for overlapping bookings for the same room:
```sql
room_id = X AND booking_checkin < new_checkout AND booking_checkout > new_checkin
```

---

## 9. Component Reference (Frontend)

### 9.1 Admin Pages

#### EmployeeList
- Columns: Employee Code, Name, Department, Status, Email, Phone
- Expanded panel: Full employee details (department, contact, admin info)
- Search: emp_code, emp_name, emp_email, dep_code, emp_phone

#### DepartmentList
- Columns: Code, Name, Status
- Search: dep_code, dep_name

#### RoomList
- Columns: Room Info (name + ID), Capacity, Base Price (current month WD/HL), Stock
- Expanded panel: Hero card, Operating Info, **Price Map** (12-month grid), Room Description, Stories
- Language switcher: TH/EN/CN
- Price Map section shows monthly WD/HL prices + holidays in each month + link to full Price Setting

#### BookingList
- Columns: Booking (name + ID), Room Name (TH/EN), Price, Contact, Guests, Pets, Check IN-OUT, Note, Confirm button
- Expanded panel: Guest Info, Booking Details, Guests & Pets, Payment & Confirmation (with slip viewer)
- Confirm dialog: shows booking summary, optional confirm slip upload

#### PriceSetting
- Two tabs: **Prices** (12-month grid per room/year with inline editing) and **Holidays** (add/delete holiday dates)
- Room selector + year selector + copy-from-previous-year button
- Shows progress bar (X/12 months set)

### 9.2 Public Website Components

Located in `Client/src/booking/components/`:
- **Navbar** — Sticky top nav with language switcher
- **Hero** — Full-screen hero with 3D background (Three.js GodRay)
- **Story** — Brand story section
- **Highlights** — Key features
- **Rooms** — Room cards grid, each linking to `/rooms/:id`
- **RoomDetail** — Full room detail page with gallery
- **Restaurant** — Food & dining section
- **Gallery** — Photo gallery
- **Layout** — Room layouts / floor plans
- **Location** — Map / directions
- **Footer** — Contact info & links
- **BookingPage** — Full booking flow (calendar → room selection → form → slip upload)
- **ShowCalendar** — Date picker with availability + price display

---

## 10. Environment Variables

### Server/.env
```
PORT=5000
JWT_SECRET=<jwt_secret_key>
SUPABASE_URL=<supabase_project_url>
SUPABASE_KEY=<supabase_publishable_key>
```

### Client/.env
```
VITE_HTTP_NODEJS_API=''
VITE_HTTPS_NODEJS_API=''
```

---

## 11. Development Guidelines

### Conventions

- **File naming**: PascalCase for React components, camelCase for utilities
- **Imports**: Absolute paths not configured; use relative imports
- **CSS**: Tailwind utility classes (no separate CSS files for new components)
- **State management**: React state + localStorage (no Redux/Zustand)
- **API calls**: Direct `fetch()` with `Authorization: Bearer` header
- **Error handling**: try/catch with user-facing alerts (can be improved)

### Adding a New Admin Page

1. Create route file in `Client/src/Routes/<Entity>/`
2. Use `DataListPage` pattern (or inline fetch if complex)
3. Optional: Create/Edit modals
4. Add route in `App.jsx` with `<PrivateRoute>` wrapper
5. Add sidebar menu entry in `Sidebar.jsx`
6. Create backend route in `Server/Routes/<Entity>/route.js`
7. Mount route in `Server/index.js`

### Code Cleanup Needed

- Remove `route copy.js` files (legacy MSSQL routes)
- Remove `Access/` and `Token/` route directories (not mounted)
- Apply `auth.js` middleware to all active routes (currently missing on most)
- Remove unused `ExpandedPanel copy.jsx` and `EmployeeList copy.jsx`
- Add proper error handling UI (replace `alert()` calls)
- Add loading states to create/edit modals

---

## 12. Troubleshooting

| Problem | Likely Cause | Solution |
|---|---|---|
| API returns 404 | Route not mounted in `index.js` | Check route mounting in `Server/index.js` |
| Login returns 401 | Wrong credentials / JWT secret mismatch | Check `JWT_SECRET` in Server `.env` |
| "No token provided" | Missing local token | Login again at `/admin/login` |
| Images not loading | `API_URL` empty + wrong proxy config | Check Vite proxy in `vite.config.js` |
| Build fails — set-state-in-effect | New React Compiler lint rule | Can suppress or restructure effect |
| Room names show as IDs in booking list | Backend query missing room detail join | Check `Server/Routes/Booking/route.js` room name mapping |
| Price data not appearing | Wrong year or room_id | Verify price-room data in Supabase table `price_room_tbls` |
| CORS errors | Backend CORS config mismatch | Check `Server/index.js` CORS settings |
| File upload fails | Multer config / directory permissions | Check `Server/Upload/` directory exists and is writable |
