// ทดสอบการส่งข้อมูลครบถ้วน
import fetch from 'node-fetch';

async function testCompleteData() {
  console.log('🧪 ทดสอบการส่งข้อมูลครบถ้วน...\n');
  
  // ข้อมูลทดสอบที่ครบถ้วน
  const testData = {
    // ข้อมูลพื้นฐานจาก BusinessNetworkForm
    pdpaAccepted: true,
    membershipType: 'yec',
    yecProvince: 'กรุงเทพมหานคร',
    tccCardImage: 'test-tcc-card.jpg',
    profileImage: 'test-profile.jpg',
    businessNetwork: 'Food Network',
    thaiFirstName: 'สมชาย',
    thaiLastName: 'ใจดี',
    englishFirstName: 'Somchai',
    englishLastName: 'Jaidee',
    nickname: 'ชาย',
    phone: '0812345678',
    email: 'test@example.com',
    lineId: 'testline123',
    addressProvince: 'กรุงเทพมหานคร',
    addressDistrict: 'เขตบางรัก',
    addressSubDistrict: 'แขวงบางรัก',
    postalCode: '10500',
    
    // ข้อมูลธุรกิจจาก NetworkRegistration
    businessName: 'บริษัททดสอบ จำกัด',
    businessType: 'Technology',
    businessSize: 'Small (1-10 employees)',
    businessDescription: 'บริษัทพัฒนาซอฟต์แวร์',
    businessWebsite: 'https://test.com',
    businessPhone: '021234567',
    businessEmail: 'info@test.com',
    agricultureBusinessTypes: ['Smart Farming', 'Organic Products'],
    painPoints: 'ขาดเทคโนโลยีในการจัดการฟาร์ม',
    groupBenefits: ['Networking', 'Knowledge Sharing'],
    otherGroupBenefits: 'การแลกเปลี่ยนประสบการณ์',
    interestedActivities: ['Workshops', 'Seminars'],
    workingTeamInterest: 'Yes',
    expectations: ['Business Growth', 'New Opportunities'],
    otherExpectations: 'การขยายตลาด',
    internationalMarkets: ['ASEAN', 'Europe'],
    otherInternationalMarkets: 'อเมริกา',
    termsAccepted: true,
    dataProcessingConsent: true
  };

  try {
    console.log('📤 ส่งข้อมูลไปยัง API...');
    const response = await fetch('http://localhost:3001/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ สำเร็จ!');
      console.log('📊 ข้อมูลที่ส่ง:');
      console.log(`   - Business Network: ${testData.businessNetwork}`);
      console.log(`   - ชื่อ: ${testData.thaiFirstName} ${testData.thaiLastName}`);
      console.log(`   - อีเมล: ${testData.email}`);
      console.log(`   - ชื่อธุรกิจ: ${testData.businessName}`);
      console.log(`   - ประเภทธุรกิจ: ${testData.businessType}`);
      console.log(`   - จำนวนฟิลด์: ${Object.keys(testData).length} ฟิลด์`);
      console.log(`\n📝 ข้อความตอบกลับ: ${result.message}`);
    } else {
      console.log('❌ ล้มเหลว:', result.error);
    }
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
  }
}

testCompleteData();
