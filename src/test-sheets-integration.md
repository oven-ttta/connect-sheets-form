# การทดสอบระบบบันทึกข้อมูลตาม Business Network

## วิธีการทำงาน

ระบบจะบันทึกข้อมูลลงใน Google Sheet ที่แตกต่างกันตาม Business Network ที่เลือก:

### Business Network Mapping
- **Food Network** → Sheet: "Food Network"
- **Ai & Inno Network** → Sheet: "Ai&Innovation"
- **Health Care** → Sheet: "Health Care"
- **Retail&WholeSale** → Sheet: "Retail&WholeSale"
- **Inno BCG & Agriculture Innovation** → Sheet: "Inno BCG & Agriculture Innovation"
- **Logistic** → Sheet: "Logistic"
- **Real Estate** → Sheet: "Real Estate"
- **Education** → Sheet: "Education"
- **Hotel, Tourism & Hospitality** → Sheet: "Hotel, Tourism & Hospitality"

## ข้อมูลที่จะบันทึก

### ข้อมูลพื้นฐาน (จาก BusinessNetworkForm)
1. วันที่/เวลา
2. Business Network ที่เลือก
3. ชื่อ (ไทย)
4. นามสกุล (ไทย)
5. ชื่อ (อังกฤษ)
6. นามสกุล (อังกฤษ)
7. ชื่อเล่น
8. เบอร์โทรศัพท์
9. อีเมล
10. Line ID
11. จังหวัด
12. อำเภอ/เขต
13. ตำบล/แขวง
14. รหัสไปรษณีย์
15. ประเภทสมาชิก
16. YEC จังหวัด

### ข้อมูลธุรกิจ (จาก NetworkRegistration)
17. ชื่อธุรกิจ
18. ประเภทธุรกิจ
19. ขนาดธุรกิจ
20. คำอธิบายธุรกิจ
21. เว็บไซต์ธุรกิจ
22. เบอร์โทรธุรกิจ
23. อีเมลธุรกิจ
24. ประเภทธุรกิจเกษตร
25. ปัญหาที่พบ
26. ประโยชน์ที่ต้องการ
27. ประโยชน์อื่นๆ
28. กิจกรรมที่สนใจ
29. ความสนใจทีมงาน
30. ความคาดหวัง
31. ความคาดหวังอื่นๆ
32. ตลาดต่างประเทศ
33. ตลาดต่างประเทศอื่นๆ
34. ยอมรับเงื่อนไข
35. ยินยอมประมวลผลข้อมูล

## การทดสอบ

1. เปิดหน้าเว็บไซต์
2. กรอกข้อมูลใน BusinessNetworkForm
3. เลือก Business Network ที่ต้องการ
4. กรอกข้อมูลใน NetworkRegistration
5. ส่งข้อมูล
6. ตรวจสอบใน Google Sheet ว่าข้อมูลถูกบันทึกใน Sheet ที่ถูกต้อง

## หมายเหตุ

- ระบบจะสร้าง Sheet ใหม่อัตโนมัติถ้าไม่มีอยู่
- ระบบจะเพิ่ม header row อัตโนมัติเมื่อสร้าง Sheet ใหม่
- ข้อมูลจะถูกบันทึกในรูปแบบ timestamp ไทย (Asia/Bangkok)
