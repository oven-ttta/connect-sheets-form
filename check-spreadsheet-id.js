// ตรวจสอบ Spreadsheet ID จาก URL (ใช้งานได้จริง)
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkSpreadsheetId() {
  console.log('🔍 กำลังตรวจสอบ Spreadsheet ID ...\n');

  // Spreadsheet ID ที่ต้องการตรวจสอบ (แก้ไขตรงนี้ถ้าต้องการ)
  const spreadsheetId = "1Ayv-JtojDVC71QLtwsX8Xqp6ImNCm8_yP1TSzEXQCxw";

  // กำหนด path ไปยังไฟล์ Service Account
  const keyFilePath = path.join(__dirname, 'public', 'form-yec-06c6f53298da.json');

  // ตรวจสอบว่าไฟล์ Service Account มีอยู่หรือไม่
  import('fs').then(fsModule => {
    const fs = fsModule.default || fsModule;
    if (!fs.existsSync(keyFilePath)) {
      console.error(`❌ ไม่พบไฟล์ Service Account: ${keyFilePath}`);
      console.error('โปรดตรวจสอบว่าได้วางไฟล์ JSON ในโฟลเดอร์ public/');
      process.exit(1);
    }
  }).then(async () => {
    try {
      const auth = new google.auth.GoogleAuth({
        keyFile: keyFilePath,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth: auth });

      console.log(`ทดสอบ Spreadsheet ID: ${spreadsheetId}`);
      console.log(`URL: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);

      const result = await sheets.spreadsheets.get({ spreadsheetId });
      console.log('✅ พบ Spreadsheet!');
      console.log(`   ชื่อ: ${result.data.properties.title}`);
      console.log(`   URL: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
      if (result.data.sheets && result.data.sheets.length > 0) {
        console.log(`   Sheets: ${result.data.sheets.map(s => s.properties.title).join(', ')}`);
      } else {
        console.log('   ไม่พบ Sheet ใดๆ ใน Spreadsheet นี้');
      }
      process.exit(0);
    } catch (error) {
      console.error(`❌ ไม่สามารถเข้าถึง Spreadsheet ได้: ${error.message}`);
      if (error.code === 404) {
        console.log('\n🔧 วิธีแก้ไข:');
        console.log('1. ตรวจสอบว่า Spreadsheet ID ถูกต้อง (ดูใน URL)');
        console.log('2. ให้สิทธิ์ Service Account (email ในไฟล์ JSON) เป็น Editor ใน Google Sheets');
        console.log('3. ตรวจสอบว่าเปิดใช้งาน Google Sheets API แล้วใน Google Cloud Console');
      } else if (error.code === 403) {
        console.log('\n🔧 วิธีแก้ไข:');
        console.log('1. ให้สิทธิ์ Service Account (email ในไฟล์ JSON) เป็น Editor ใน Google Sheets');
      }
      process.exit(1);
    }
  });
}

checkSpreadsheetId();
