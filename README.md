# ระบบจัดการภาพยนตร์ (Movie Management Frontend)

React + TypeScript สำหรับงานสอบ โดยมีหน้า GUI แบบมีการยืนยันตัวตน รองรับการจัดการข้อมูลภาพยนตร์ผ่าน REST API

## URL ที่ใช้งาน

- Frontend: `https://movie-frontend-management.vercel.app`
- Backend API: `https://movie-backend-management.onrender.com/api`

## ฟีเจอร์

- ระบบล็อกอิน และลงทะเบียน
- หน้า Dashboard แบบมีการป้องกัน พร้อมตรวจสอบ Session
- จัดการภาพยนตร์แบบ CRUD (ชื่อ, ปีที่ออก, เรตติ้ง)
- ตัวเลือกเรตติ้ง: `G`, `PG`, `M`, `MA`, `R`
- รองรับการอัปโหลดโปสเตอร์ภาพยนตร์
- แสดงผลแบบ List และ Grid
- ค้นหาตามชื่อภาพยนตร์
- เรียงลำดับตามปี, ชื่อ และเรตติ้ง
- การ์ดสรุปข้อมูลบน Dashboard
- แสดงปุ่มลบเฉพาะผู้ใช้ที่มีสิทธิ์ `MANAGER`
- ฝั่ง Backend ตรวจสอบสิทธิ์การลบอีกชั้น
- ยืนยันตัวตนด้วย Cookie พร้อม `withCredentials`
- UI รองรับทั้ง Desktop และ Mobile

## บทบาทผู้ใช้ (User Roles)

ระบบรองรับ 3 บทบาท:

- `MANAGER`
- `TEAMLEADER`
- `FLOORSTAFF`

เฉพาะผู้ใช้ที่มีบทบาท `MANAGER` เท่านั้นที่สามารถลบข้อมูลภาพยนตร์ได้ ผู้ใช้ที่ลงทะเบียนใหม่จะได้รับบทบาท `FLOORSTAFF` โดยอัตโนมัติ ทำให้ไม่สามารถเลือกบทบาทที่มีสิทธิ์สูงกว่าได้จากหน้าสมัครสมาชิก

## ผู้ใช้สำหรับทดสอบ

```text
manager / Password123!
teamleader / Password123!
floorstaff / Password123!
```

ใช้บัญชี `manager` เมื่อต้องการทดสอบการลบข้อมูล

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React Icons

## โครงสร้างโปรเจกต์

```text
src/
  components/
    auth/          คอมโพเนนต์ UI สำหรับการยืนยันตัวตน และ Protected Route
    movies/        ฟอร์มภาพยนตร์, ตาราง, กริด, ไดอะล็อกยืนยันการลบ
  lib/             ตั้งค่า Axios, จัดการข้อมูล Auth, ตัวช่วยจัดการ Error จาก API
  pages/           หน้าล็อกอิน, ลงทะเบียน, Dashboard
  routes/          ตั้งค่า React Router
  services/        ชั้น Service สำหรับเรียก REST API
  types/           TypeScript Types ที่ใช้ร่วมกัน
```

## วิธีรันในเครื่อง

ติดตั้ง Dependencies:

```bash
npm install
```

เริ่มต้น Development Server:

```bash
npm run dev
```

เปิด URL ที่ Vite แสดงในเทอร์มินัล โดยปกติจะเป็น:

```text
http://localhost:5173
```

## Environment Variables

สำหรับการ Deploy บน Vercel และการใช้งานในเครื่อง ใช้ Path เดียวกัน:

```env
VITE_API_BASE_URL=/api
```

Vite Dev Server จะ Proxy `/api` ไปยัง Backend บน Render ส่วน Vercel จะ Rewrite `/api/:path*` ไปยัง Backend เช่นกัน วิธีนี้ทำให้ Request ทำงานบน Same-Origin เพื่อให้ HttpOnly Cookie ใช้งานได้กับ `/auth/me`

หากรัน Backend แยกในเครื่องโดยไม่ผ่าน Vite Proxy ให้ตั้งค่าดังนี้:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

หลังเปลี่ยน Environment Variables ให้รีสตาร์ท Dev Server ใหม่

## REST API ที่ใช้

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

## แนวทางความปลอดภัย

- ใช้ HttpOnly Cookie จาก Backend สำหรับการยืนยันตัวตน
- เรียก API พร้อม `withCredentials` ทุกครั้ง
- ป้องกันหน้า Dashboard ด้วย `ProtectedRoute`
- ตรวจสอบ Session ที่ยังใช้งานอยู่ผ่าน `/auth/me`
- ล้าง Cache ข้อมูลผู้ใช้และ Redirect ไปหน้าล็อกอินเมื่อได้รับ `401`
- เก็บเฉพาะข้อมูลที่ไม่ละเอียดอ่อนไว้ใน `localStorage`
- ซ่อนปุ่มลบสำหรับผู้ใช้ที่ไม่มีบทบาท Manager ใน UI
- ฝั่ง Backend ตรวจสอบสิทธิ์การลบอีกชั้นเสมอ
- การลงทะเบียนสาธารณะจะกำหนดบทบาทเป็น `FLOORSTAFF` เท่านั้น

## ประสิทธิภาพและการบำรุงรักษา

- แยก API Call ไว้ใน Service Classes
- ใช้ TypeScript Types ร่วมกัน เพื่อลดความผิดพลาดระหว่าง Frontend กับ API
- การค้นหาและเรียงลำดับทำงานฝั่ง Client เพราะรายการภาพยนตร์มีขนาดเล็กและโหลดมาแล้ว
- ใช้ `useMemo` สำหรับสรุปข้อมูล Dashboard, การค้นหา และการเรียงลำดับ
- แบ่ง UI เป็น Component ย่อยที่ใช้ซ้ำได้
- Vite ช่วยให้ Development และ Production Build ทำงานได้รวดเร็ว

## คำสั่ง Scripts

```bash
npm run dev      # เริ่ม Development Server
npm run build    # ตรวจสอบ Type และ Build Production
npm run preview  # ดูตัวอย่าง Production Build
npm run lint     # รัน ESLint
```

## หมายเหตุการ Deploy

โปรเจกต์นี้ตั้งค่าสำหรับ Vercel:

- `/api/:path*` จะ Rewrite ไปยัง Backend API บน Render
- Path อื่นทั้งหมด Rewrite ไปยัง `index.html` สำหรับ Client-side Routing
- Environment Variable บน Vercel ควรตั้งเป็น `VITE_API_BASE_URL=/api`

## ระยะเวลาพัฒนา

ใช้เวลาพัฒนาเว็บโดยประมาณ: 1 วัน