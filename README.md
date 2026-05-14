# Movie Management Frontend

เว็บสำหรับจัดการข้อมูลภาพยนตร์ตามโจทย์ Technical Exam พัฒนาด้วย React + TypeScript + Vite โดยเชื่อมต่อกับ REST API สำหรับ Authentication และ Movie CRUD

## ภาพรวมระบบ

ระบบนี้ให้ผู้ใช้เข้าสู่ระบบแล้วจัดการ Movie records ได้ โดยข้อมูลภาพยนตร์ประกอบด้วย

- Movie Title
- Year Released
- Rating: `G`, `PG`, `M`, `MA`, `R`
- Movie image/poster (เพิ่มจากโจทย์เพื่อให้หน้าเว็บใช้งานจริงและดูข้อมูลได้ง่ายขึ้น)

Role ของผู้ใช้มี 3 แบบ

- `MANAGER`
- `TEAMLEADER`
- `FLOORSTAFF`

เฉพาะ `MANAGER` เท่านั้นที่ backend อนุญาตให้ลบ Movie record ได้ ส่วน frontend จะแสดง role ปัจจุบันและส่ง request ไปยัง API พร้อม cookie session

## Features ที่ทำแล้ว

- Login / Register
- Protected route สำหรับหน้า Dashboard
- Cookie-based authentication กับ backend
- Movie CRUD ผ่าน REST API
- Create / Edit movie พร้อม validation ฝั่ง form
- Upload หรือเปลี่ยน movie poster
- List view และ Grid view
- Dashboard summary: จำนวนหนัง, ปีล่าสุด, rating ที่พบบ่อยที่สุด
- Role-based delete protection โดย backend
- Axios instance กลาง พร้อม `withCredentials` และ redirect เมื่อ session หมดอายุ
- Responsive UI สำหรับ desktop และ mobile

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React Icons

## Project Structure

```text
src/
  components/
    auth/          # reusable auth UI + protected route
    movies/        # movie form, table, grid, delete dialog
  lib/             # axios config, auth storage, api error helper
  pages/           # login, register, dashboard
  routes/          # react-router setup
  services/        # REST API service layer
  types/           # shared TypeScript types
```

## การติดตั้งและรันโปรเจกต์

ต้องมี Node.js ติดตั้งไว้ก่อน จากนั้นรันคำสั่ง:

```bash
npm install
npm run dev
```

เปิดเว็บตาม URL ที่ Vite แสดงใน terminal เช่น:

```text
http://localhost:5173
```

## Environment Variables

ไฟล์ `.env` ใช้กำหนด API base URL:

```env
VITE_API_BASE_URL=https://movie-backend-management.onrender.com/api
```

ถ้าต้องการรันกับ backend local ให้เปลี่ยนเป็น:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

หลังแก้ `.env` ให้ restart dev server ใหม่

## Test Users

หน้า Login แสดง default users สำหรับทดสอบไว้แล้ว:

```text
manager / Password123!
teamleader / Password123!
floorstaff / Password123!
```

ใช้ `manager` เมื่อต้องการทดสอบการลบ Movie record

## วิธีใช้งาน

1. เข้า `/login`
2. Login ด้วย user ที่ต้องการทดสอบ
3. หน้า Dashboard จะโหลดรายการ movies จาก API
4. กด `Add Movie` เพื่อเพิ่มข้อมูลหนัง
5. กดปุ่ม edit เพื่อแก้ไขข้อมูลหรือเปลี่ยน poster
6. กดปุ่ม delete เพื่อทดสอบการลบ
7. ถ้า user ไม่ใช่ `MANAGER` backend จะปฏิเสธ request ลบตามสิทธิ์

## REST API ที่ Frontend ใช้งาน

Authentication:

```text
POST /auth/login
POST /auth/register
GET  /auth/me
POST /auth/logout
```

Movies:

```text
GET    /movies
GET    /movies/:id
POST   /movies
PUT    /movies/:id
DELETE /movies/:id
POST   /movies/:id/image/upload
```

## Security Approach

- ใช้ cookie-based auth ผ่าน `withCredentials`
- หน้า Dashboard ถูกครอบด้วย `ProtectedRoute` และตรวจ session กับ `/auth/me`
- ถ้า API ตอบ `401` จะ clear local user cache และ redirect ไปหน้า login
- Frontend เก็บเฉพาะข้อมูล user สำหรับแสดงผล ไม่เก็บ password
- การกำหนดสิทธิ์สำคัญ เช่น delete เฉพาะ `MANAGER` บังคับใช้ที่ backend เพื่อป้องกันการ bypass จาก browser

## Performance / Maintainability

- แยก API calls ไว้ใน service layer (`auth.service.ts`, `movie.service.ts`)
- แยก reusable components สำหรับ auth form และ movie views
- ใช้ TypeScript types กลางเพื่อลด field mismatch ระหว่าง UI กับ API
- ใช้ `useMemo` สำหรับ dashboard summary ที่คำนวณจากรายการ movies
- ใช้ Vite เพื่อ dev/build ที่เร็วและ bundle สำหรับ production

## Scripts

```bash
npm run dev      # start development server
npm run build    # type-check และ build production bundle
npm run preview  # preview production build
npm run lint     # run ESLint
```

## Deployment Note

โปรเจกต์มี `vercel.json` สำหรับรองรับ client-side routing บน Vercel โดย rewrite ทุก path กลับไปที่ `index.html`

## Implementation Duration

ใช้เวลาพัฒนาโดยประมาณ: 1 วัน
