# คำแนะนำการติดตั้งและรันระบบ

## ปัญหาที่พบ
- โปรเจคใช้ Vite (ไม่ใช่ Next.js) ดังนั้น API routes ใน `src/pages/api/` ไม่ทำงาน
- ต้องสร้าง Express server แยกเพื่อจัดการ Google Sheets API

## วิธีแก้ไข

### 1. ติดตั้ง Dependencies
```bash
# ติดตั้ง dependencies ทั้งหมด (รวม express, cors, nodemon)
npm install
```

### 2. รัน Server
```bash
# รัน Express server (ใน terminal แรก)
npm run server
# หรือใช้ nodemon สำหรับ development
npm run server:dev
```

### 3. รัน Frontend
```bash
# รัน Vite development server (ใน terminal ที่สอง)
npm run dev
```

## โครงสร้างไฟล์
```
project/
├── server.js                 # Express server
├── server-package.json       # Dependencies สำหรับ server
├── src/
│   ├── pages/api/submit.ts   # ไม่ใช้แล้ว (สำหรับ Next.js)
│   └── ...
└── public/
    └── form-yec-06c6f53298da.json  # Google Service Account key
```

## การทำงาน
1. Frontend (Vite) รันที่ port 8080
2. Backend (Express) รันที่ port 3001
3. Frontend ส่งข้อมูลไปยัง Backend
4. Backend ใช้ Google Sheets API บันทึกข้อมูลลงใน Sheet ที่ถูกต้อง

## ตรวจสอบการทำงาน
1. เปิด http://localhost:8080
2. กรอกข้อมูลและเลือก Business Network
3. ส่งข้อมูล
4. ตรวจสอบใน Google Sheet ว่าข้อมูลถูกบันทึกใน Sheet ที่ถูกต้อง

## หมายเหตุ
- ต้องมีไฟล์ `public/form-yec-06c6f53298da.json` สำหรับ Google Service Account
- ต้องมี Google Spreadsheet ID ที่ถูกต้องใน server.js
- ต้องให้ Service Account มีสิทธิ์เข้าถึง Google Sheet
