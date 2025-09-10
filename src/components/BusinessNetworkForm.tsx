import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Users, FileText, Building, Target, Shield, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Session 1: PDPA Consent
  pdpaAccepted: boolean;
  
  // Session 2: YEC Verification
  membershipType: string;
  yecProvince: string;
  tccCardImage: File | null;
  
  // Session 3: Personal Information
  profileImage: File | null;
  thaiFirstName: string;
  thaiLastName: string;
  englishFirstName: string;
  englishLastName: string;
  nickname: string;
  phone: string;
  lineId: string;
  email: string;
  addressProvince: string;
  addressDistrict: string;
  addressSubDistrict: string;
  postalCode: string;
  
  // Session 4: Interest & Experience
  businessNetwork: string;
  previousExperience: string;
  motivation: string;
  skills: string[];
  
  // Session 5: Availability
  timeCommitment: string;
  meetingPreference: string;
  availability: string[];
  
  // Session 6: Business Information
  businessIdea: string;
  targetMarket: string;
  businessStage: string;
  fundingNeeds: string;
  partnershipInterest: string;
}

const BUSINESS_NETWORKS = [
  "Technology & Innovation",
  "Retail & E-commerce",
  "Food & Beverage",
  "Healthcare & Wellness",
  "Financial Services",
  "Creative & Media",
  "Sustainability & Environment",
  "Education & Training"
];

const SKILLS_OPTIONS = [
  "Marketing & Branding",
  "Financial Management",
  "Technology Development",
  "Sales & Business Development",
  "Operations Management",
  "Human Resources",
  "Product Development",
  "Strategic Planning"
];

const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา",
  "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก",
  "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน",
  "บึงกาฬ", "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา",
  "พังงา", "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต", "มหาสารคาม",
  "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี",
  "ลำปาง", "ลำพูน", "เลย", "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสาคร",
  "สมุทรสงคราม", "สระแก้ว", "สระบุรี", "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์",
  "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี"
];

// Sample address data (in real app, this would come from an API)
const THAI_ADDRESS_DATA = {
  "กรุงเทพมหานคร": {
    "เขตบางรัก": {
      "แขวงมหาพฤฒาราม": "10500",
      "แขวงบางรัก": "10500",
      "แขวงสีลม": "10500"
    },
    "เขตคลองเตย": {
      "แขวงคลองเตย": "10110",
      "แขวงคลองตัน": "10110"
    }
  },
  "ชลบุรี": {
    "อำเภอเมืองชลบุรี": {
      "ตำบลนาป่า": "20000",
      "ตำบลบ้านสวน": "20000"
    },
    "อำเภอบางละมุง": {
      "ตำบลนาเกลือ": "20150",
      "ตำบลหนองปรือ": "20150"
    }
  },
  "เชียงใหม่": {
    "อำเภอเมืองเชียงใหม่": {
      "ตำบลศรีภูมิ": "50200",
      "ตำบลช้างคลาน": "50100"
    },
    "อำเภอดอยสะเก็ด": {
      "ตำบลดอนแก้ว": "50220",
      "ตำบลลวงเหนือ": "50220"
    }
  }
};

export default function BusinessNetworkForm() {
  const [currentSession, setCurrentSession] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    pdpaAccepted: false,
    membershipType: "",
    yecProvince: "",
    tccCardImage: null,
    profileImage: null,
    thaiFirstName: "",
    thaiLastName: "",
    englishFirstName: "",
    englishLastName: "",
    nickname: "",
    phone: "",
    lineId: "",
    email: "",
    addressProvince: "",
    addressDistrict: "",
    addressSubDistrict: "",
    postalCode: "",
    businessNetwork: "",
    previousExperience: "",
    motivation: "",
    skills: [],
    timeCommitment: "",
    meetingPreference: "",
    availability: [],
    businessIdea: "",
    targetMarket: "",
    businessStage: "",
    fundingNeeds: "",
    partnershipInterest: ""
  });

  const { toast } = useToast();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Clear dependent address fields when province changes
      if (field === "addressProvince") {
        newData.addressDistrict = "";
        newData.addressSubDistrict = "";
        newData.postalCode = "";
      } else if (field === "addressDistrict") {
        newData.addressSubDistrict = "";
        newData.postalCode = "";
      }
      
      return newData;
    });
  };

  const handleNext = () => {
    if (currentSession < 6) {
      setCurrentSession(currentSession + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSession > 1) {
      setCurrentSession(currentSession - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "แบบฟอร์มส่งสำเร็จ!",
      description: `ข้อมูลของคุณได้ถูกบันทึกใน Business Network: ${formData.businessNetwork}`,
    });
    console.log("Form submitted:", formData);
  };

  const SessionIcon = ({ session }: { session: number }) => {
    const icons = [FileText, Users, Users, FileText, Building, Target];
    const Icon = icons[session - 1];
    return <Icon className="w-5 h-5" />;
  };

  const SessionProgress = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3, 4, 5, 6].map((session) => (
          <div
            key={session}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              session <= currentSession
                ? "bg-gradient-primary text-white shadow-elegant"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <SessionIcon session={session} />
          </div>
        ))}
      </div>
      <Progress value={(currentSession / 6) * 100} className="h-2" />
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>PDPA</span>
        <span>ยืนยัน YEC</span>
        <span>ข้อมูลส่วนตัว</span>
        <span>ความสนใจ</span>
        <span>เวลาที่สะดวก</span>
        <span>ข้อมูลธุรกิจ</span>
      </div>
    </div>
  );

  const renderSession1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Session 1: PDPA Consent
        </h2>
        <p className="text-muted-foreground mt-2">กรุณายินยอมเงื่อนไขการใช้ข้อมูลส่วนบุคคล</p>
      </div>
      
      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">นโยบายความเป็นส่วนตัว (PDPA)</h3>
        <div className="space-y-3 text-sm text-muted-foreground max-h-48 overflow-y-auto">
          <p>เราจะเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่านตามวัตถุประสงค์ที่ได้แจ้งไว้ในนโยบายนี้</p>
          <p>ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม ได้แก่ ชื่อ-นามสกุล อีเมล เบอร์โทรศัพท์ ข้อมูลการศึกษา และข้อมูลอื่นๆ ที่เกี่ยวข้อง</p>
          <p>เราจะใช้ข้อมูลเพื่อวัตถุประสงค์ในการประมวลผลใบสมัคร การติดต่อสื่อสาร และการจัดกิจกรรม Business Network</p>
          <p>ท่านมีสิทธิในการเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของท่านได้ตามกฎหมาย</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-4 border rounded-lg">
        <Checkbox
          id="pdpa"
          checked={formData.pdpaAccepted}
          onCheckedChange={(checked) => updateFormData("pdpaAccepted", checked)}
        />
        <Label htmlFor="pdpa" className="text-sm leading-relaxed">
          ข้าพเจ้ายินยอมให้เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัวข้างต้น
        </Label>
      </div>
    </div>
  );

  const renderSession2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Session 2: ยืนยันสถานะภาพ YEC
        </h2>
        <p className="text-muted-foreground mt-2">กรุณาระบุสถานะสมาชิกของท่าน</p>
      </div>

      <div>
        <Label>ท่านเป็นสมาชิก YEC หรือหอการค้าไทย?</Label>
        <RadioGroup 
          value={formData.membershipType} 
          onValueChange={(value) => updateFormData("membershipType", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yec" id="yec" />
            <Label htmlFor="yec">สมาชิก YEC (Young Entrepreneur Community)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="chamber" id="chamber" />
            <Label htmlFor="chamber">สมาชิกหอการค้าไทย</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.membershipType === "chamber" && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
          <p className="text-destructive font-medium">ขออภัย</p>
          <p className="text-sm text-muted-foreground mt-1">
            ระบบยังไม่เปิดให้ลงทะเบียนสำหรับสมาชิกหอการค้า โปรดรอการอัพเดทระบบ
          </p>
        </div>
      )}

      {formData.membershipType === "yec" && (
        <>
          <div>
            <Label>ท่านมาจาก YEC จังหวัดอะไร?</Label>
            <Select value={formData.yecProvince} onValueChange={(value) => updateFormData("yecProvince", value)}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกจังหวัด" />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {THAI_PROVINCES.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.yecProvince && (
            <div>
              <Label htmlFor="tccCard">Upload ภาพ: Virtual Card TCC Connect</Label>
              <div className="mt-2 flex items-center justify-center w-full">
                <label
                  htmlFor="tccCard"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {formData.tccCardImage ? formData.tccCardImage.name : "คลิกเพื่ออัพโหลดภาพ"}
                    </p>
                  </div>
                  <input
                    id="tccCard"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      updateFormData("tccCardImage", file);
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderSession3 = () => {
    const availableDistricts = formData.addressProvince ? Object.keys(THAI_ADDRESS_DATA[formData.addressProvince] || {}) : [];
    const availableSubDistricts = formData.addressDistrict && formData.addressProvince 
      ? Object.keys(THAI_ADDRESS_DATA[formData.addressProvince]?.[formData.addressDistrict] || {}) 
      : [];

    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Session 3: ข้อมูลส่วนตัว
          </h2>
          <p className="text-muted-foreground mt-2">กรุณากรอกข้อมูลส่วนตัวของคุณ</p>
        </div>
        
        {/* Profile Picture */}
        <div>
          <Label htmlFor="profileImage">รูป Profile</Label>
          <div className="mt-2 flex items-center justify-center w-full">
            <label
              htmlFor="profileImage"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {formData.profileImage ? formData.profileImage.name : "คลิกเพื่ออัพโหลดรูปภาพ"}
                </p>
              </div>
              <input
                id="profileImage"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  updateFormData("profileImage", file);
                }}
              />
            </label>
          </div>
        </div>

        {/* Thai Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="thaiFirstName">ชื่อ (ภาษาไทย)</Label>
            <Input
              id="thaiFirstName"
              value={formData.thaiFirstName}
              onChange={(e) => updateFormData("thaiFirstName", e.target.value)}
              placeholder="กรอกชื่อภาษาไทย"
            />
          </div>
          <div>
            <Label htmlFor="thaiLastName">นามสกุล (ภาษาไทย)</Label>
            <Input
              id="thaiLastName"
              value={formData.thaiLastName}
              onChange={(e) => updateFormData("thaiLastName", e.target.value)}
              placeholder="กรอกนามสกุลภาษาไทย"
            />
          </div>
        </div>

        {/* English Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="englishFirstName">Name (English)</Label>
            <Input
              id="englishFirstName"
              value={formData.englishFirstName}
              onChange={(e) => updateFormData("englishFirstName", e.target.value)}
              placeholder="Enter English first name"
            />
          </div>
          <div>
            <Label htmlFor="englishLastName">Surname (English)</Label>
            <Input
              id="englishLastName"
              value={formData.englishLastName}
              onChange={(e) => updateFormData("englishLastName", e.target.value)}
              placeholder="Enter English surname"
            />
          </div>
        </div>

        {/* Nickname */}
        <div>
          <Label htmlFor="nickname">ชื่อเล่น</Label>
          <Input
            id="nickname"
            value={formData.nickname}
            onChange={(e) => updateFormData("nickname", e.target.value)}
            placeholder="กรอกชื่อเล่น"
          />
        </div>

        {/* Phone and Line ID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
                updateFormData("phone", value);
              }}
              placeholder="กรอกเบอร์โทรศัพท์"
              maxLength={10}
            />
          </div>
          <div>
            <Label htmlFor="lineId">Line ID</Label>
            <Input
              id="lineId"
              value={formData.lineId}
              onChange={(e) => updateFormData("lineId", e.target.value)}
              placeholder="กรอก Line ID"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">E-mail (ที่ใช้งานปัจจุบัน)</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            placeholder="กรอกอีเมล (ต้องลงท้ายด้วย .com)"
            className={formData.email && !validateEmail(formData.email) ? "border-destructive" : ""}
          />
          {formData.email && !validateEmail(formData.email) && (
            <p className="text-sm text-destructive mt-1">รูปแบบอีเมลไม่ถูกต้อง</p>
          )}
        </div>

        {/* Address Section */}
        <div>
          <Label className="text-base font-semibold">ที่อยู่ติดต่อ *</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            {/* Province */}
            <div>
              <Label htmlFor="addressProvince">จังหวัด</Label>
              <Select 
                value={formData.addressProvince} 
                onValueChange={(value) => updateFormData("addressProvince", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {THAI_PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div>
              <Label htmlFor="addressDistrict">อำเภอ/เขต</Label>
              <Select 
                value={formData.addressDistrict} 
                onValueChange={(value) => updateFormData("addressDistrict", value)}
                disabled={!formData.addressProvince}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.addressProvince ? "เลือกจังหวัดก่อน" : "เลือกอำเภอ/เขต"} />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub-district */}
            <div>
              <Label htmlFor="addressSubDistrict">ตำบล/แขวง</Label>
              <Select 
                value={formData.addressSubDistrict} 
                onValueChange={(value) => {
                  updateFormData("addressSubDistrict", value);
                  // Auto-fill postal code
                  const postalCode = THAI_ADDRESS_DATA[formData.addressProvince]?.[formData.addressDistrict]?.[value];
                  if (postalCode) {
                    updateFormData("postalCode", postalCode);
                  }
                }}
                disabled={!formData.addressDistrict}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.addressDistrict ? "เลือกอำเภอก่อน" : "เลือกตำบล/แขวง"} />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {availableSubDistricts.map((subDistrict) => (
                    <SelectItem key={subDistrict} value={subDistrict}>
                      {subDistrict}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Postal Code */}
            <div>
              <Label htmlFor="postalCode">รหัสไปรษณีย์</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => updateFormData("postalCode", e.target.value)}
                placeholder="รหัสไปรษณีย์"
                readOnly
                className="bg-muted/50"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSession4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Session 4: ความสนใจและประสบการณ์
        </h2>
        <p className="text-muted-foreground mt-2">บอกเราเกี่ยวกับความสนใจและประสบการณ์ของคุณ</p>
      </div>

      <div>
        <Label>Business Network ที่สนใจ</Label>
        <Select value={formData.businessNetwork} onValueChange={(value) => updateFormData("businessNetwork", value)}>
          <SelectTrigger>
            <SelectValue placeholder="เลือก Business Network" />
          </SelectTrigger>
          <SelectContent>
            {BUSINESS_NETWORKS.map((network) => (
              <SelectItem key={network} value={network}>
                {network}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="previousExperience">ประสบการณ์ที่เกี่ยวข้อง</Label>
        <Textarea
          id="previousExperience"
          value={formData.previousExperience}
          onChange={(e) => updateFormData("previousExperience", e.target.value)}
          placeholder="บอกเราเกี่ยวกับประสบการณ์ที่เกี่ยวข้องกับธุรกิจ"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="motivation">แรงจูงใจในการเข้าร่วม</Label>
        <Textarea
          id="motivation"
          value={formData.motivation}
          onChange={(e) => updateFormData("motivation", e.target.value)}
          placeholder="เหตุผลที่ต้องการเข้าร่วม Business Network นี้"
          rows={4}
        />
      </div>

      <div>
        <Label>ทักษะที่มี (เลือกได้หลาย)</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {SKILLS_OPTIONS.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={formData.skills.includes(skill)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData("skills", [...formData.skills, skill]);
                  } else {
                    updateFormData("skills", formData.skills.filter(s => s !== skill));
                  }
                }}
              />
              <Label htmlFor={skill} className="text-sm">
                {skill}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSession5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Session 5: เวลาที่สะดวก
        </h2>
        <p className="text-muted-foreground mt-2">บอกเราเกี่ยวกับเวลาที่คุณมีสำหรับกิจกรรม</p>
      </div>

      <div>
        <Label>ระยะเวลาที่สามารถให้ได้ต่อสัปดาห์</Label>
        <RadioGroup 
          value={formData.timeCommitment} 
          onValueChange={(value) => updateFormData("timeCommitment", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1-3" id="time1" />
            <Label htmlFor="time1">1-3 ชั่วโมง/สัปดาห์</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4-6" id="time2" />
            <Label htmlFor="time2">4-6 ชั่วโมง/สัปดาห์</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="7-10" id="time3" />
            <Label htmlFor="time3">7-10 ชั่วโมง/สัปดาห์</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="10+" id="time4" />
            <Label htmlFor="time4">มากกว่า 10 ชั่วโมง/สัปดาห์</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>รูปแบบการประชุมที่ต้องการ</Label>
        <RadioGroup 
          value={formData.meetingPreference} 
          onValueChange={(value) => updateFormData("meetingPreference", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="online" />
            <Label htmlFor="online">ออนไลน์</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="offline" id="offline" />
            <Label htmlFor="offline">หน้าจอ</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hybrid" id="hybrid" />
            <Label htmlFor="hybrid">ทั้งสองแบบ</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label>วันที่สะดวก (เลือกได้หลายวัน)</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"].map((day) => (
            <div key={day} className="flex items-center space-x-2">
              <Checkbox
                id={day}
                checked={formData.availability.includes(day)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFormData("availability", [...formData.availability, day]);
                  } else {
                    updateFormData("availability", formData.availability.filter(d => d !== day));
                  }
                }}
              />
              <Label htmlFor={day}>{day}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSession6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Session 6: ข้อมูลธุรกิจ
        </h2>
        <p className="text-muted-foreground mt-2">บอกเราเกี่ยวกับไอเดียและแผนธุรกิจของคุณ</p>
      </div>

      <div>
        <Label htmlFor="businessIdea">ไอเดียธุรกิจ</Label>
        <Textarea
          id="businessIdea"
          value={formData.businessIdea}
          onChange={(e) => updateFormData("businessIdea", e.target.value)}
          placeholder="อธิบายไอเดียธุรกิจของคุณ"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="targetMarket">กลุ่มเป้าหมาย</Label>
        <Textarea
          id="targetMarket"
          value={formData.targetMarket}
          onChange={(e) => updateFormData("targetMarket", e.target.value)}
          placeholder="บอกเราเกี่ยวกับกลุ่มลูกค้าเป้าหมาย"
          rows={3}
        />
      </div>

      <div>
        <Label>ระยะของธุรกิจ</Label>
        <RadioGroup 
          value={formData.businessStage} 
          onValueChange={(value) => updateFormData("businessStage", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="idea" id="idea" />
            <Label htmlFor="idea">ระยะไอเดีย</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="planning" id="planning" />
            <Label htmlFor="planning">ระยะวางแผน</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="prototype" id="prototype" />
            <Label htmlFor="prototype">ระยะทำต้นแบบ</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="launched" id="launched" />
            <Label htmlFor="launched">เปิดให้บริการแล้ว</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="fundingNeeds">ความต้องการเงินทุน</Label>
        <Textarea
          id="fundingNeeds"
          value={formData.fundingNeeds}
          onChange={(e) => updateFormData("fundingNeeds", e.target.value)}
          placeholder="บอกเราเกี่ยวกับความต้องการเงินทุนและแผนการใช้งาน"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="partnershipInterest">ความสนใจในการหาพาร์ทเนอร์</Label>
        <Textarea
          id="partnershipInterest"
          value={formData.partnershipInterest}
          onChange={(e) => updateFormData("partnershipInterest", e.target.value)}
          placeholder="ประเภทของพาร์ทเนอร์ที่ต้องการ และสิ่งที่คาดหวัง"
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Business Network Application
          </h1>
          <p className="text-lg text-muted-foreground">
            สมัครเข้าร่วม Business Network และสร้างเครือข่ายทางธุรกิจ
          </p>
        </div>

        <Card className="shadow-card border-0">
          <CardContent className="p-8">
            <SessionProgress />
            
            {currentSession === 1 && renderSession1()}
            {currentSession === 2 && renderSession2()}
            {currentSession === 3 && renderSession3()}
            {currentSession === 4 && renderSession4()}
            {currentSession === 5 && renderSession5()}
            {currentSession === 6 && renderSession6()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSession === 1}
                className="transition-smooth"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                ย้อนกลับ
              </Button>
              
              {currentSession < 6 ? (
                <Button 
                  onClick={handleNext} 
                  className="bg-gradient-primary transition-smooth"
                  disabled={
                    (currentSession === 1 && !formData.pdpaAccepted) ||
                    (currentSession === 2 && formData.membershipType === "chamber") ||
                    (currentSession === 2 && formData.membershipType === "yec" && (!formData.yecProvince || !formData.tccCardImage))
                  }
                >
                  ถัดไป
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-gradient-secondary transition-smooth">
                  ส่งแบบฟอร์ม
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}