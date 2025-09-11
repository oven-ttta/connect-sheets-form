# แก้ไขปัญหา Google Sheets Access

## 🔍 สถานะปัจจุบัน
- ✅ Service Account JSON ถูกต้อง
- ✅ Google Sheets API client ทำงานได้
- ❌ **Spreadsheet ID ไม่ถูกต้องหรือไม่มีสิทธิ์เข้าถึง**

## 🛠️ วิธีแก้ไข

### 1. ตรวจสอบ Spreadsheet ID
1. เปิด Google Sheets ที่ต้องการใช้
2. คัดลอก ID จาก URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
3. อัพเดทใน `server.js` บรรทัด 41:
   ```javascript
   const spreadsheetId = "YOUR_CORRECT_SPREADSHEET_ID";
   ```

### 2. ให้สิทธิ์ Service Account
1. เปิด Google Sheets
2. คลิกปุ่ม **"Share"** (มุมขวาบน)
3. เพิ่ม email: `form-yec@form-yec.iam.gserviceaccount.com`
4. ตั้งสิทธิ์เป็น **"Editor"**
5. คลิก **"Send"**

### 3. ตรวจสอบ Google Sheets API
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. เลือกโปรเจค `form-yec`
3. ไปที่ **APIs & Services > Library**
4. ค้นหา **"Google Sheets API"**
5. ตรวจสอบว่าเปิดใช้งานแล้ว

### 4. ทดสอบการแก้ไข
```bash
node debug-google-sheets.js
```

## 📋 Checklist
- [ ] Spreadsheet ID ถูกต้อง
- [ ] Service Account มีสิทธิ์ Editor
- [ ] Google Sheets API เปิดใช้งาน
- [ ] ไฟล์ JSON อยู่ใน `public/` folder

## 🔗 ลิงก์ที่เป็นประโยชน์
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Service Account Guide](https://cloud.google.com/iam/docs/service-accounts)
