# การตั้งค่า Google Sheets API

## ปัญหาที่พบ
- Google Sheets API 404 Not Found
- Service Account ไม่สามารถเข้าถึง Spreadsheet ได้

## วิธีแก้ไข

### 1. ตรวจสอบ Spreadsheet ID
1. เปิด Google Sheets ที่ต้องการใช้
2. คัดลอก ID จาก URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
3. อัพเดทใน `server.js`:
```javascript
const spreadsheetId = "YOUR_SPREADSHEET_ID_HERE";
```

### 2. ตั้งค่า Service Account
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจคใหม่หรือเลือกโปรเจคที่มีอยู่
3. เปิดใช้งาน Google Sheets API
4. สร้าง Service Account:
   - ไปที่ IAM & Admin > Service Accounts
   - คลิก "Create Service Account"
   - ตั้งชื่อและคำอธิบาย
   - คลิก "Create and Continue"
   - ข้ามการกำหนด role (ไม่จำเป็น)
   - คลิก "Done"

### 3. สร้าง Key สำหรับ Service Account
1. คลิกที่ Service Account ที่สร้าง
2. ไปที่แท็บ "Keys"
3. คลิก "Add Key" > "Create new key"
4. เลือก "JSON" และคลิก "Create"
5. ไฟล์ JSON จะถูกดาวน์โหลด
6. เปลี่ยนชื่อเป็น `form-yec-06c6f53298da.json`
7. วางไฟล์ในโฟลเดอร์ `public/`

### 4. ให้สิทธิ์ Service Account เข้าถึง Spreadsheet
1. เปิด Google Sheets
2. คลิก "Share" (ปุ่ม Share ที่มุมขวาบน)
3. เพิ่ม email ของ Service Account (จากไฟล์ JSON: `client_email`)
4. ตั้งสิทธิ์เป็น "Editor"
5. คลิก "Send"

### 5. ตรวจสอบการตั้งค่า
1. รัน server: `npm run server`
2. ทดสอบส่งข้อมูล
3. ตรวจสอบใน Google Sheets ว่าข้อมูลถูกบันทึก

## ตัวอย่าง Service Account JSON
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"
}
```

## หมายเหตุ
- ไฟล์ JSON ต้องอยู่ใน `public/` folder
- Service Account email ต้องมีสิทธิ์เข้าถึง Spreadsheet
- ตรวจสอบว่า Google Sheets API เปิดใช้งานแล้ว
