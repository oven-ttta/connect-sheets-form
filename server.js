import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://api-yec.over24h.shop',
    'https://yec.over24h.shop',
    'https://*.over24h.shop'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

// Mapping Business Networks to Sheet names
const BUSINESS_NETWORK_SHEETS = {
  "Food Network": "Food Network",
  "Ai & Inno Network": "Ai&Innovation", 
  "Health Care": "Health Care",
  "Retail&WholeSale": "Retail&WholeSale",
  "Inno BCG & Agriculture Innovation": "Inno BCG & Agriculture Innovation",
  "Logistic": "Logistic",
  "Real Estate": "Real Estate",
  "Education": "Education",
  "Hotel, Tourism & Hospitality": "Hotel, Tourism & Hospitality"
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'YEC API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Google Sheets API endpoint
app.post('/api/submit', async (req, res) => {
  console.log('📥 Received POST request to /api/submit');
  console.log('📋 Request headers:', req.headers);
  console.log('📊 Request body keys:', Object.keys(req.body || {}));
  
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, 'public', 'form-yec-06c6f53298da.json'),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: auth });

    const spreadsheetId = "1Ayv-JtojDVC71QLtwsX8Xqp6ImNCm8_yP1TSzEXQCxw"; // ตรวจสอบ ID นี้ใน Google Sheets URL

    // รับค่าจาก frontend
    const { 
      // ข้อมูลพื้นฐาน
      pdpaAccepted,
      membershipType,
      yecProvince,
      tccCardImage,
      profileImage,
      businessNetwork,
      thaiFirstName, 
      thaiLastName, 
      englishFirstName,
      englishLastName,
      nickname,
      phone, 
      email,
      lineId,
      addressProvince,
      addressDistrict,
      addressSubDistrict,
      postalCode,
      // Business information (from NetworkRegistration)
      businessName,
      businessType,
      businessSize,
      businessDescription,
      businessWebsite,
      businessPhone,
      businessEmail,
      agricultureBusinessTypes,
      painPoints,
      groupBenefits,
      otherGroupBenefits,
      interestedActivities,
      workingTeamInterest,
      expectations,
      otherExpectations,
      internationalMarkets,
      otherInternationalMarkets,
      termsAccepted,
      dataProcessingConsent
    } = req.body;

    // ตรวจสอบว่า businessNetwork ถูกต้องหรือไม่
    if (!businessNetwork || !BUSINESS_NETWORK_SHEETS[businessNetwork]) {
      return res.status(400).json({ error: "Invalid business network selected" });
    }

    // กำหนด Sheet name ตาม Business Network ที่เลือก
    const sheetName = BUSINESS_NETWORK_SHEETS[businessNetwork];
    const range = `${sheetName}!A1`;

    // เตรียมข้อมูลสำหรับบันทึกลง Google Sheet
    const timestamp = new Date().toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // จัดเรียงข้อมูลให้ตรงกับ header
    const allData = [
      timestamp,
      businessNetwork,
      pdpaAccepted ? 'ยอมรับ' : 'ไม่ยอมรับ',
      membershipType || '',
      yecProvince || '',
      tccCardImage || '',
      profileImage || '',
      thaiFirstName || '',
      thaiLastName || '',
      englishFirstName || '',
      englishLastName || '',
      nickname || '',
      phone || '',
      email || '',
      lineId || '',
      addressProvince || '',
      addressDistrict || '',
      addressSubDistrict || '',
      postalCode || '',
      businessName || '',
      businessType || '',
      businessSize || '',
      businessDescription || '',
      businessWebsite || '',
      businessPhone || '',
      businessEmail || '',
      Array.isArray(agricultureBusinessTypes) ? agricultureBusinessTypes.join(', ') : (agricultureBusinessTypes || ''),
      painPoints || '',
      Array.isArray(groupBenefits) ? groupBenefits.join(', ') : (groupBenefits || ''),
      otherGroupBenefits || '',
      Array.isArray(interestedActivities) ? interestedActivities.join(', ') : (interestedActivities || ''),
      workingTeamInterest || '',
      Array.isArray(expectations) ? expectations.join(', ') : (expectations || ''),
      otherExpectations || '',
      Array.isArray(internationalMarkets) ? internationalMarkets.join(', ') : (internationalMarkets || ''),
      otherInternationalMarkets || '',
      termsAccepted ? 'ยอมรับ' : 'ไม่ยอมรับ',
      dataProcessingConsent ? 'ยอมรับ' : 'ไม่ยอมรับ'
    ];

    // ตรวจสอบว่า Spreadsheet มีอยู่หรือไม่
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId
      });
      // console.log('Spreadsheet found:', spreadsheet.data.properties.title);
    } catch (error) {
      console.error('Spreadsheet not found or no access:', error.message);
      return res.status(400).json({ 
        error: "ไม่สามารถเข้าถึง Google Spreadsheet ได้ กรุณาตรวจสอบ Spreadsheet ID และ Service Account permissions" 
      });
    }

    // ตรวจสอบว่า Sheet มีอยู่หรือไม่ ถ้าไม่มีจะสร้างใหม่
    try {
      await sheets.spreadsheets.get({
        spreadsheetId,
        ranges: [sheetName]
      });
      // console.log(`Sheet "${sheetName}" already exists`);
    } catch (error) {
      // console.log(`Creating new sheet: "${sheetName}"`);
      try {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }]
          }
        });
        // console.log(`Sheet "${sheetName}" created successfully`);
      } catch (createError) {
        console.error('Error creating sheet:', createError.message);
        return res.status(500).json({ 
          error: `ไม่สามารถสร้าง Sheet "${sheetName}" ได้: ${createError.message}` 
        });
      }

      // เพิ่ม header row
      const headers = [
        'วันที่/เวลา',
        'Business Network',
        'ยินยอม PDPA',
        'ประเภทสมาชิก',
        'YEC จังหวัด',
        'TCC Card Image',
        'Profile Image',
        'ชื่อ (ไทย)',
        'นามสกุล (ไทย)',
        'ชื่อ (อังกฤษ)',
        'นามสกุล (อังกฤษ)',
        'ชื่อเล่น',
        'เบอร์โทรศัพท์',
        'อีเมล',
        'Line ID',
        'จังหวัด',
        'อำเภอ/เขต',
        'ตำบล/แขวง',
        'รหัสไปรษณีย์',
        'ชื่อธุรกิจ',
        'ประเภทธุรกิจ',
        'ขนาดธุรกิจ',
        'คำอธิบายธุรกิจ',
        'เว็บไซต์ธุรกิจ',
        'เบอร์โทรธุรกิจ',
        'อีเมลธุรกิจ',
        'ประเภทธุรกิจเกษตร',
        'ปัญหาที่พบ',
        'ประโยชน์ที่ต้องการ',
        'ประโยชน์อื่นๆ',
        'กิจกรรมที่สนใจ',
        'ความสนใจทีมงาน',
        'ความคาดหวัง',
        'ความคาดหวังอื่นๆ',
        'ตลาดต่างประเทศ',
        'ตลาดต่างประเทศอื่นๆ',
        'ยอมรับเงื่อนไข',
        'ยินยอมประมวลผลข้อมูล'
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [headers]
        }
      });
    }

    // บันทึกข้อมูล
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [allData]
      }
    });

    res.status(200).json({ 
      success: true, 
      data: response.data,
      message: `ข้อมูลถูกบันทึกลงใน Sheet: ${sheetName}`
    });
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  // console.log(`Server running on http://192.168.1.237:${PORT}`);
});
