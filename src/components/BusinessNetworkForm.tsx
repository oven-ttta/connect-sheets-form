import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { getAllData } from 'thai-data';

interface FormData {
  // Session PDPA Consent
  pdpaAccepted: boolean;

  // Session YEC Verification
  membershipType: string;
  yecProvince: string;
  tccCardImage: File | null;

  // Session Personal Information
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

  // Session Business Network Selection
  businessNetwork: string;
}

const BUSINESS_NETWORKS = [
  "Food Network",
  "Ai & Inno Network",
  "Health Care",
  "Retail&WholeSale",
  "Inno BCG & Agriculture Innovation",
  "Logistic",
  "Real Estate",
  "Education",
  "Hotel, Tourism & Hospitality"
];

export default function BusinessNetworkForm() {
  const navigate = useNavigate();
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
    businessNetwork: ""
  });

  // Address state
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [subDistricts, setSubDistricts] = useState<string[]>([]);
  const [postalCode, setPostalCode] = useState<string>("");

  // Raw address data
  const [addressData, setAddressData] = useState<any[]>([]);

  const { toast } = useToast();

  // Load address data on mount
  useEffect(() => {
    try {
      const data = getAllData();
      setAddressData(data);

      // Extract all unique provinces
      const provinceSet = new Set<string>();
      data.forEach(item => {
        if (item.provinceList && Array.isArray(item.provinceList)) {
          item.provinceList.forEach((province: any) => {
            if (province && province.provinceName) {
              provinceSet.add(province.provinceName);
            }
          });
        }
      });
      setProvinces(Array.from(provinceSet).sort());
    } catch (error) {
      console.error('Error loading address data:', error);
      // Fallback to mock data if thai-data fails
      const mockProvinces = [
        "กรุงเทพมหานคร", "เชียงใหม่", "เชียงราย", "ลำปาง", "ลำพูน", "แม่ฮ่องสอน",
        "นครสวรรค์", "อุทัยธานี", "กำแพงเพชร", "ตาก", "สุโขทัย", "พิษณุโลก",
        "พิจิตร", "เพชรบูรณ์", "ราชบุรี", "กาญจนบุรี", "สุพรรณบุรี", "นครปฐม",
        "สมุทรสาคร", "สมุทรสงคราม", "สมุทรปราการ", "นนทบุรี", "ปทุมธานี", "พระนครศรีอยุธยา",
        "อ่างทอง", "ลพบุรี", "สิงห์บุรี", "ชัยนาท", "สระบุรี", "นครราชสีมา",
        "บุรีรัมย์", "สุรินทร์", "ศรีสะเกษ", "อุบลราชธานี", "ยโสธร", "ชัยภูมิ",
        "อำนาจเจริญ", "บึงกาฬ", "หนองบัวลำภู", "ขอนแก่น", "อุดรธานี", "เลย",
        "หนองคาย", "มหาสารคาม", "ร้อยเอ็ด", "กาฬสินธุ์", "สกลนคร", "นครพนม",
        "มุกดาหาร", "ชุมพร", "สุราษฎร์ธานี", "นครศรีธรรมราช", "กระบี่", "พังงา",
        "ภูเก็ต", "ระนอง", "ตรัง", "สตูล", "สงขลา", "พัทลุง", "ปัตตานี",
        "ยะลา", "นราธิวาส", "นครนายก", "ปราจีนบุรี", "สระแก้ว", "จันทบุรี",
        "ตราด", "ฉะเชิงเทรา", "ระยอง", "ชลบุรี"
      ];
      setProvinces(mockProvinces);
      setAddressData([]);
    }
  }, []);

  const handleSubmit = async (data: FormData) => {
    try {
      // เตรียมข้อมูลสำหรับส่งไปยัง API (ครบถ้วนเหมือน test-complete-data.js)
      const submissionData = {
        // ข้อมูลพื้นฐานจาก BusinessNetworkForm
        pdpaAccepted: data.pdpaAccepted,
        membershipType: data.membershipType,
        yecProvince: data.yecProvince,
        tccCardImage: data.tccCardImage ? data.tccCardImage.name : null,
        profileImage: data.profileImage ? data.profileImage.name : null,
        businessNetwork: data.businessNetwork,
        thaiFirstName: data.thaiFirstName,
        thaiLastName: data.thaiLastName,
        englishFirstName: data.englishFirstName,
        englishLastName: data.englishLastName,
        nickname: data.nickname,
        phone: data.phone,
        email: data.email,
        lineId: data.lineId,
        addressProvince: data.addressProvince,
        addressDistrict: data.addressDistrict,
        addressSubDistrict: data.addressSubDistrict,
        postalCode: data.postalCode,
        
        // ข้อมูลธุรกิจ (จะถูกเติมใน NetworkRegistration)
        businessName: '',
        businessType: '',
        businessSize: '',
        businessDescription: '',
        businessWebsite: '',
        businessPhone: '',
        businessEmail: '',
        agricultureBusinessTypes: [],
        painPoints: '',
        groupBenefits: [],
        otherGroupBenefits: '',
        interestedActivities: [],
        workingTeamInterest: '',
        expectations: [],
        otherExpectations: '',
        internationalMarkets: [],
        otherInternationalMarkets: '',
        termsAccepted: false,
        dataProcessingConsent: false
      };

      const res = await fetch("http://localhost:3001/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });
  
      const result = await res.json();
      if (result.success) {
        alert(`✅ ส่งข้อมูลสำเร็จแล้ว!\n${result.message || ''}`);
      } else {
        alert("❌ มีปัญหา: " + result.error);
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  // When province changes, update districts
  useEffect(() => {
    if (!formData.addressProvince) {
      setDistricts([]);
      setSubDistricts([]);
      setPostalCode("");
      return;
    }

    const districtSet = new Set<string>();
    addressData.forEach(item => {
      // Check if this item contains the selected province
      if (item.provinceList && Array.isArray(item.provinceList)) {
        const hasProvince = item.provinceList.some((province: any) =>
          province && province.provinceName === formData.addressProvince
        );

        if (hasProvince && item.districtList && Array.isArray(item.districtList)) {
          item.districtList.forEach((district: any) => {
            if (district && district.districtName) {
              districtSet.add(district.districtName);
            }
          });
        }
      }
    });

    setDistricts(Array.from(districtSet).sort());
    setSubDistricts([]);
    setPostalCode("");
  }, [formData.addressProvince, addressData]);

  // When district changes, update sub-districts
  useEffect(() => {
    if (!formData.addressProvince || !formData.addressDistrict) {
      setSubDistricts([]);
      setPostalCode("");
      return;
    }

    const subDistrictSet = new Set<string>();
    addressData.forEach(item => {
      // Check if this item contains the selected province and district
      if (item.provinceList && Array.isArray(item.provinceList) &&
        item.districtList && Array.isArray(item.districtList)) {
        const hasProvince = item.provinceList.some((province: any) =>
          province && province.provinceName === formData.addressProvince
        );
        const hasDistrict = item.districtList.some((district: any) =>
          district && district.districtName === formData.addressDistrict
        );

        if (hasProvince && hasDistrict && item.subDistrictList && Array.isArray(item.subDistrictList)) {
          item.subDistrictList.forEach((subDistrict: any) => {
            if (subDistrict && subDistrict.subDistrictName) {
              subDistrictSet.add(subDistrict.subDistrictName);
            }
          });
        }
      }
    });

    setSubDistricts(Array.from(subDistrictSet).sort());
    setPostalCode("");
  }, [formData.addressProvince, formData.addressDistrict, addressData]);

  // When sub-district changes, update postal code
  useEffect(() => {
    if (!formData.addressProvince || !formData.addressDistrict || !formData.addressSubDistrict) {
      setPostalCode("");
      return;
    }

    const found = addressData.find(item => {
      if (!item.provinceList || !Array.isArray(item.provinceList) ||
        !item.districtList || !Array.isArray(item.districtList) ||
        !item.subDistrictList || !Array.isArray(item.subDistrictList)) {
        return false;
      }

      const hasProvince = item.provinceList.some((province: any) =>
        province && province.provinceName === formData.addressProvince
      );
      const hasDistrict = item.districtList.some((district: any) =>
        district && district.districtName === formData.addressDistrict
      );
      const hasSubDistrict = item.subDistrictList.some((subDistrict: any) =>
        subDistrict && subDistrict.subDistrictName === formData.addressSubDistrict
      );

      return hasProvince && hasDistrict && hasSubDistrict;
    });

    const zipCode = found?.zipCode || "";
    setPostalCode(zipCode);
    setFormData(prev => ({ ...prev, postalCode: zipCode }));
  }, [formData.addressProvince, formData.addressDistrict, formData.addressSubDistrict, addressData]);

  // General update function
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      let newData = { ...prev, [field]: value };
      // Reset address fields if parent changes
      if (field === "addressProvince") {
        newData.addressDistrict = "";
        newData.addressSubDistrict = "";
        newData.postalCode = "";
      } else if (field === "addressDistrict") {
        newData.addressSubDistrict = "";
        newData.postalCode = "";
      } else if (field === "addressSubDistrict") {
        // postalCode will be set by useEffect
      }
      return newData;
    });
  };

  const handleNext = () => {
    if (currentSession < 4) {
      setCurrentSession(currentSession + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSession > 1) {
      setCurrentSession(currentSession - 1);
    }
  };

  const handleNetworkSelection = (network: string) => {
    updateFormData("businessNetwork", network);
    toast({
      title: "เลือก Business Network สำเร็จ!",
      description: `คุณได้เลือก ${network} - กำลังเปลี่ยนไปยังฟอร์มลงทะเบียน`,
    });
    
    // บันทึกข้อมูลทั้งหมดลง localStorage เพื่อส่งไปยัง NetworkRegistration
    const completeFormData = {
      ...formData,
      businessNetwork: network
    };
    localStorage.setItem('businessNetworkFormData', JSON.stringify(completeFormData));
    
    // Navigate to registration form after a short delay
    setTimeout(() => {
      const encodedNetworkName = encodeURIComponent(network);
      navigate(`/register/${encodedNetworkName}`);
    }, 1500);
  };

  const SessionIcon = ({ session }: { session: number }) => {
    // Match icons to the labels below:
    // 1: ยินยอม PDPA -> Shield
    // 2: ยืนยันสมาชิก -> Users
    // 3: ข้อมูลส่วนตัว -> FileText
    // 4: เลือกเครือข่ายธุรกิจ -> Building
    const icons = [Shield, Users, FileText, Building];
    const Icon = icons[session - 1];
    return <Icon className="w-5 h-5" />;
  };

  // Centered SessionProgress bar
  const SessionProgress = () => (
    <div className="mb-8 flex flex-col items-center w-full">
      <div className="flex justify-center items-center w-full max-w-3xl mx-auto mb-4">
        {[1, 2, 3, 4].map((session, idx) => (
          <div
            key={session}
            className={`flex flex-col items-center w-1/4`}
          >
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 mb-2
                ${session <= currentSession
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }`}
            >
              <SessionIcon session={session} />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full max-w-3xl mx-auto">
        <Progress value={(currentSession / 4) * 100} className="h-2" />
      </div>
      <div className="flex justify-center w-full max-w-3xl mx-auto mt-2 text-xs text-muted-foreground">
        <div className="flex w-1/4 justify-center">
          <span>ยินยอม PDPA</span>
        </div>
        <div className="flex w-1/4 justify-center">
          <span>ยืนยันสมาชิก</span>
        </div>
        <div className="flex w-1/4 justify-center">
          <span>ข้อมูลส่วนตัว</span>
        </div>
        <div className="flex w-1/4 justify-center">
          <span>เลือกเครือข่ายธุรกิจ</span>
        </div>
      </div>
    </div>
  );

  const renderSession1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold text-primary">
          Session PDPA Consent
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
        <h2 className="text-2xl font-bold text-primary">
          Session ยืนยันสถานะภาพ YEC
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
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.yecProvince && (
            <div>
              <Label htmlFor="tccCard">Upload TCC Connect Virtual Card (ไม่จำเป็น)</Label>
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
    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary">
            Session ข้อมูลส่วนตัว
          </h2>
          <p className="text-muted-foreground mt-2">กรุณากรอกข้อมูลส่วนตัวของคุณ</p>
        </div>

        {/* Profile Picture */}
        <div>
          <Label htmlFor="profileImage">รูป Profile (ไม่จำเป็น)</Label>
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
                  {provinces.map((province) => (
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
                  {districts.map((district) => (
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
                onValueChange={(value) => updateFormData("addressSubDistrict", value)}
                disabled={!formData.addressDistrict}
              >
                <SelectTrigger>
                  <SelectValue placeholder={!formData.addressDistrict ? "เลือกอำเภอก่อน" : "เลือกตำบล/แขวง"} />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {subDistricts.map((subDistrict) => (
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
                value={postalCode}
                onChange={() => { }}
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
        <Building className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold text-primary">
          Session Business Network
        </h2>
        <p className="text-muted-foreground mt-2">เลือกคณะ Business Network ที่สนใจสมัคร</p>
      </div>

      <div>
        <Label>คณะ Business Network ที่สนใจสมัคร *</Label>
        <Select value={formData.businessNetwork} onValueChange={(value) => updateFormData("businessNetwork", value)}>
          <SelectTrigger>
            <SelectValue placeholder="เลือกคณะ Business Network" />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            {BUSINESS_NETWORKS.map((network) => (
              <SelectItem key={network} value={network}>
                {network}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.businessNetwork && (
        <>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              คุณได้เลือ<span className="font-medium text-foreground">{formData.businessNetwork}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Evidence of qualification จะต้องแนบในขั้นตอนถัดไป (ยังไม่มีข้อมูล)
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={() => handleNetworkSelection(formData.businessNetwork)}
              className="bg-primary text-primary-foreground px-8 py-3"
            >
              เข้าสู่ฟอร์มลงทะเบียนคณะ {formData.businessNetwork}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img
              src="/lovable-uploads/1d15f8dc-d264-41f2-b32e-c70a57c35d87.png"
              alt="YEC Business Network Logo"
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
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

              {currentSession < 4 ? (
                <Button
                  onClick={handleNext}
                  className="bg-primary text-primary-foreground"
                  disabled={
                    (currentSession === 1 && !formData.pdpaAccepted) ||
                    (currentSession === 2 && formData.membershipType === "chamber") ||
                    (currentSession === 2 && formData.membershipType === "yec" && !formData.yecProvince) ||
                    (currentSession === 3 && (!formData.thaiFirstName || !formData.thaiLastName || !formData.englishFirstName || !formData.englishLastName || !formData.phone || !formData.email || !formData.addressProvince || !formData.addressDistrict || !formData.addressSubDistrict))
                  }
                >
                  ถัดไป
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">
                  เลือก Business Network เพื่อไปยังฟอร์มลงทะเบียน
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}