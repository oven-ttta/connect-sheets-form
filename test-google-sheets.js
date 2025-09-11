// Test Google Sheets connection
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testGoogleSheets() {
  try {
    console.log('Testing Google Sheets connection...');
    
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, 'public', 'form-yec-06c6f53298da.json'),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: auth });

    const spreadsheetId = "1Ayv-JtojDVC71QLtwsX8Xqp6lmNCm8_yP1TSzEXQCxw";
    
    console.log('Getting spreadsheet info...');
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId
    });
    
    console.log('✅ Success! Spreadsheet found:');
    console.log('Title:', spreadsheet.data.properties.title);
    console.log('Sheets:', spreadsheet.data.sheets.map(sheet => sheet.properties.title));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 404) {
      console.log('\n🔧 Possible solutions:');
      console.log('1. Check if Spreadsheet ID is correct');
      console.log('2. Check if Service Account has access to the spreadsheet');
      console.log('3. Check if Google Sheets API is enabled');
    }
  }
}

testGoogleSheets();
