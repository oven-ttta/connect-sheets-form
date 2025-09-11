// Debug Google Sheets connection
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function debugGoogleSheets() {
  try {
    console.log('🔍 Debugging Google Sheets connection...\n');
    
    // 1. ตรวจสอบไฟล์ Service Account
    console.log('1. ตรวจสอบไฟล์ Service Account...');
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, 'public', 'form-yec-06c6f53298da.json'),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    console.log('✅ Service Account loaded successfully');
    console.log('   Email:', client.email);
    console.log('   Project ID:', client.projectId);
    
    const sheets = google.sheets({ version: "v4", auth: auth });
    console.log('✅ Google Sheets API client created\n');

    // 2. ทดสอบ Spreadsheet ID ต่างๆ
    const testIds = [
      "1Ayv-JtojDVC71QLtwsX8Xqp6lmNCm8_yP1TSzEXQCxw", // ID ปัจจุบัน
      "1Ayv-JtojDVC71QLtwsX8Xqp6lmNCm8_yP1TSzEXQCxw", // ID จากรูปภาพ
    ];

    for (let i = 0; i < testIds.length; i++) {
      const spreadsheetId = testIds[i];
      console.log(`2.${i + 1} ทดสอบ Spreadsheet ID: ${spreadsheetId}`);
      
      try {
        const spreadsheet = await sheets.spreadsheets.get({
          spreadsheetId
        });
        
        console.log('✅ Success! Spreadsheet found:');
        console.log('   Title:', spreadsheet.data.properties.title);
        console.log('   URL:', `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
        console.log('   Sheets:', spreadsheet.data.sheets.map(sheet => sheet.properties.title));
        console.log('');
        
        // 3. ทดสอบการสร้าง Sheet ใหม่
        console.log('3. ทดสอบการสร้าง Sheet ใหม่...');
        const testSheetName = 'Test Sheet ' + Date.now();
        
        try {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [{
                addSheet: {
                  properties: {
                    title: testSheetName
                  }
                }
              }]
            }
          });
          console.log(`✅ Sheet "${testSheetName}" created successfully`);
          
          // ลบ Sheet ทดสอบ
          const sheetId = spreadsheet.data.sheets.find(s => s.properties.title === testSheetName)?.properties.sheetId;
          if (sheetId) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId,
              requestBody: {
                requests: [{
                  deleteSheet: {
                    sheetId: sheetId
                  }
                }]
              }
            });
            console.log(`✅ Test sheet deleted`);
          }
          
        } catch (createError) {
          console.log(`❌ Cannot create sheet: ${createError.message}`);
        }
        
        break; // หา ID ที่ใช้งานได้แล้ว
        
      } catch (error) {
        console.log(`❌ Error with ID ${spreadsheetId}: ${error.message}`);
        if (error.code === 404) {
          console.log('   → Spreadsheet not found or no access');
        } else if (error.code === 403) {
          console.log('   → Permission denied');
        }
        console.log('');
      }
    }
    
  } catch (error) {
    console.error('❌ Critical Error:', error.message);
    
    if (error.message.includes('ENOENT')) {
      console.log('\n🔧 File not found:');
      console.log('   Check if public/form-yec-06c6f53298da.json exists');
    } else if (error.message.includes('invalid_grant')) {
      console.log('\n🔧 Authentication error:');
      console.log('   Check if Service Account key is valid');
    }
  }
}

debugGoogleSheets();
