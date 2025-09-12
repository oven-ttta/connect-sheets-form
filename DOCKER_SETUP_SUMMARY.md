# Docker Setup Summary

## 🐳 สรุปการตั้งค่า Docker สำหรับ YEC Business Network Form

### ไฟล์ที่สร้างใหม่

1. **Dockerfile** - Container configuration
2. **docker-compose.yml** - Main compose file
3. **docker-compose.override.yml** - Development overrides
4. **docker-compose.prod.yml** - Production configuration
5. **nginx.conf** - Nginx reverse proxy configuration
6. **.dockerignore** - Docker ignore file
7. **docker.env** - Environment variables
8. **env.example** - Environment variables example
9. **DOCKER_README.md** - Docker documentation
10. **src/utils/thaiAddress.ts** - Thai address utilities

### การเปลี่ยนแปลงหลัก

#### 1. แทนที่ thai-data library ด้วยไฟล์ JSON
- ลบ dependency `thai-data` ออกจาก package.json
- สร้าง `src/utils/thaiAddress.ts` เพื่อจัดการข้อมูลที่อยู่
- ใช้ไฟล์ JSON จาก `public/json/` แทน:
  - `thai_provinces.json`
  - `thai_amphures.json` 
  - `thai_tambons.json`

#### 2. อัพเดท BusinessNetworkForm.tsx
- เปลี่ยนจาก `getAllData()` เป็น `getProvinces()`, `getAmphuresByProvince()`, etc.
- ใช้ async/await สำหรับการโหลดข้อมูลที่อยู่
- ลบ dependency บน thai-data library

#### 3. อัพเดท config.js
- รองรับ Docker environment
- ใช้ `https://api-yec.over24h.shop` สำหรับ production

#### 4. เพิ่ม Docker Scripts ใน package.json
```json
{
  "docker:build": "docker-compose build",
  "docker:up": "docker-compose up", 
  "docker:down": "docker-compose down",
  "docker:logs": "docker-compose logs -f",
  "docker:production": "docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build",
  "docker:dev": "docker-compose up --build",
  "docker:clean": "docker-compose down -v && docker system prune -f"
}
```

### การใช้งาน

#### Development Mode
```bash
npm run docker:dev
# หรือ
docker-compose up --build
```

#### Production Mode
```bash
npm run docker:production
# หรือ
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

### Ports
- **Frontend**: 8080
- **API**: 3001
- **Nginx (Production)**: 80, 443

### Volumes
- `./uploads:/app/uploads` - File uploads
- `./public:/app/public` - Static files และ Google Sheets credentials

### Health Check
- URL: `http://localhost:3001/api/health`
- Interval: 30 seconds

### Features
- ✅ Multi-stage Docker build
- ✅ Health checks
- ✅ Volume mounting สำหรับ uploads และ credentials
- ✅ Nginx reverse proxy สำหรับ production
- ✅ Development และ production configurations
- ✅ Environment variables support
- ✅ Thai address data จากไฟล์ JSON
- ✅ File upload support
- ✅ Google Sheets integration

### Security Notes
- ใช้ HTTPS ใน production
- ตั้งค่า CORS อย่างเหมาะสม
- เก็บ Google Sheets credentials อย่างปลอดภัย
- ใช้ SSL certificates สำหรับ production
