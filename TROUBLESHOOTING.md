# การแก้ไขปัญหา - YEC Business Network Form

## 🚨 ปัญหาหน้าจอขาว (White Screen)

### สาเหตุที่เป็นไปได้:
1. JavaScript Error ที่ทำให้ React ไม่สามารถ render ได้
2. ไฟล์ JSON ไม่สามารถโหลดได้
3. Import/Export ผิดพลาด
4. CSS ไม่โหลด

### วิธีแก้ไข:

#### 1. ตรวจสอบ Console
- กด F12 เปิด Developer Tools
- ดูที่ Console tab
- หา error messages (สีแดง)

#### 2. ใช้ Debug Page
- เปิดไฟล์ `debug.html` ใน browser
- ทดสอบการโหลดไฟล์ JSON
- ทดสอบ API connection

#### 3. ทดสอบด้วย TestComponent
- ระบบจะแสดง TestComponent ก่อน
- หาก TestComponent แสดงได้ แสดงว่า React ทำงานปกติ
- กดปุ่ม "ทดสอบฟอร์ม" เพื่อเปลี่ยนไป BusinessNetworkForm

#### 4. ตรวจสอบไฟล์ที่จำเป็น
```
public/json/
├── thai_provinces.json
├── thai_amphures.json
├── thai_tambons.json
└── thai_geographies.json
```

#### 5. ตรวจสอบ Development Server
```bash
# ตรวจสอบว่า server รันอยู่
npm run dev

# ควรเห็น:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.x.x:5173/
```

### การแก้ไขเฉพาะ:

#### หาก JSON files ไม่โหลด:
1. ตรวจสอบว่าไฟล์อยู่ใน `public/json/`
2. ตรวจสอบ network tab ใน Developer Tools
3. ใช้ fallback data ใน `thaiAddress.ts`

#### หาก API ไม่ทำงาน:
1. ตรวจสอบว่า server.js รันอยู่
2. ทดสอบ `http://localhost:3001/api/health`
3. ตรวจสอบ CORS settings

#### หาก React Error:
1. ดู Console สำหรับ error messages
2. ตรวจสอบ import/export statements
3. ใช้ ErrorBoundary เพื่อจับ error

### Commands ที่มีประโยชน์:

```bash
# เริ่ม development server
npm run dev

# เริ่ม API server
npm run server

# เริ่มทั้งคู่
npm run dev & npm run server

# ตรวจสอบ ports
netstat -an | findstr :5173
netstat -an | findstr :3001

# Docker
npm run docker:dev
```

### ไฟล์ที่เกี่ยวข้อง:
- `src/App.tsx` - Main app component
- `src/pages/Index.tsx` - Home page
- `src/components/BusinessNetworkForm.tsx` - Main form
- `src/components/TestComponent.tsx` - Test component
- `src/components/ErrorBoundary.tsx` - Error handling
- `src/utils/thaiAddress.ts` - Address utilities
- `debug.html` - Debug page

### การทดสอบ:
1. เปิด `http://localhost:5173` - ควรเห็น TestComponent
2. กดปุ่ม "ทดสอบฟอร์ม" - ควรเปลี่ยนไป BusinessNetworkForm
3. หากยังขาว ให้ดู Console และใช้ debug.html
