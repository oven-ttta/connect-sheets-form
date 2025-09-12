import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config.js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Building, Upload, FileText, Users, Target, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitToGoogleSheets, FormSubmissionData } from "@/utils/googleSheets";
import { getProvinces } from "@/utils/thaiAddress";

interface RegistrationData {
  // Business Information
  businessName: string;
  businessType: string;
  businessSize: string;
  businessDescription: string;
  businessWebsite: string;
  businessPhone: string;
  businessEmail: string;
  
  // Agriculture Specific - What does your business do?
  agricultureBusinessTypes: string[];
  
  // Pain Points and Challenges
  painPoints: string;
  
  // What you want from joining the group
  groupBenefits: string[];
  otherGroupBenefits: string;
  
  // Activities interested in
  interestedActivities: string[];
  
  // Working Team participation
  workingTeamInterest: string;
  
  // Expectations and Goals
  expectations: string[];
  otherExpectations: string;
  
  // International Markets
  internationalMarkets: string[];
  otherInternationalMarkets: string;
  
  // Terms and Conditions
  termsAccepted: boolean;
  dataProcessingConsent: boolean;
}

const BUSINESS_TYPES = [
  "เกษตรกรรม การป่าไม้ และการประมง",
  "การทำเหมืองแร่และเหมืองหิน", 
  "การผลิต",
  "ไฟฟ้า ก๊าซ ไอน้ำ และระบบการปรับอากาศ",
  "การจัดหาน้ำ การจัดการน้ำเสียและของเสียรวมถึงกิจกรรมที่เกี่ยวข้อง",
  "การก่อสร้าง",
  "การขายส่งและการขายปลีก การซ่อมยานยนต์และจักรยานยนต์",
  "การขนส่งและสถานที่เก็บสินค้า",
  "ที่พักแรมและบริการด้านอาหาร",
  "ข้อมูลข่าวสารและการสื่อสาร",
  "กิจกรรมทางการเงินและการประกันภัย",
  "กิจกรรมเกี่ยวกับอสังหาริมทรัพย์",
  "กิจกรรมวิชาชีพ วิทยาศาสตร์และกิจกรรมทางวิชาการ",
  "กิจกรรมการบริหารและบริการสนับสนุน",
  "การบริหารราชการ การป้องกันประเทศและการประกันสังคมภาคบังคับ",
  "การศึกษา",
  "กิจกรรมด้านสุขภาพและงานสังคมสงเคราะห์",
  "ศิลปะ ความบันเทิง และนันทนาการ",
  "กิจกรรมการบริการด้านอื่นๆ",
  "กิจกรรมการจ้างงานในครัวเรือน กิจกรรมการผลิตสินค้าและบริการที่ทำขึ้นเองเพื่อใช้ในครัวเรือน",
  "กิจกรรมขององค์การระหว่างประเทศและภาคีสมาชิก"
];

const BUSINESS_SIZES = [
  "Corporate",
  "SMEs", 
  "StartUp",
  "Freelancer"
];

const AGRICULTURE_BUSINESS_TYPES = [
  "การผลิตพืชผลทางการเกษตร",
  "ปศุสัตว์ / ประมง",
  "เครื่องจักรกลและอุปกรณ์เกษตร",
  "การแปรรูปสินค้าเกษตร",
  "โลจิสติกส์ / การกระจายสินค้า",
  "เทคโนโลยีเกษตร (AgriTech)"
];

const GROUP_BENEFITS = [
  "ขยายเครือข่าย (Networking)",
  "หาคู่ค้า / partner",
  "เข้าถึงความรู้และอบรม",
  "การเข้าถึงทุนหรือแหล่งเงินทุน",
  "การตลาด / ช่องทางการขาย",
  "เทคโนโลยี / นวัตกรรม"
];

const INTERESTED_ACTIVITIES = [
  "เวิร์กช็อป / อบรม",
  "งาน Networking / Business Matching",
  "โครงการ CSR ร่วมกัน",
  "Study Tour ดูงาน"
];

const EXPECTATIONS = [
  "ต้องการขยาย Connection ในกลุ่มธุรกิจเดียวกัน",
  "ต้องการสร้างเครือข่ายกับกลุ่มธุรกิจอื่น ๆ",
  "ต้องการหาพันธมิตรเชิงกลยุทธ์ (Strategic Partner)",
  "ต้องการหาลูกค้าใหม่ (Lead Generation)",
  "ต้องการเพิ่มช่องทางการขาย (Offline / Online)",
  "ต้องการทำ Marketing Collaboration หรือ Cross Promotion",
  "ต้องการแลกเปลี่ยนความรู้/ประสบการณ์ (Knowledge Sharing)",
  "ต้องการอบรม/สัมมนา/Workshop เฉพาะทาง",
  "ต้องการ Mentor/ที่ปรึกษาทางธุรกิจ",
  "ต้องการหานักลงทุน (Investor)",
  "ต้องการเข้าถึงแหล่งทุนหรือโครงการสนับสนุน (VC, กองทุน, ภาครัฐ)",
  "ต้องการทำ JV หรือลงทุนร่วม",
  "ต้องการขยายตลาดไปต่างภูมิภาค/ต่างประเทศ",
  "ต้องการ Partner ในการส่งออก/นำเข้า (Export/Import)",
  "ต้องการ Technology Partner (AI, Digital, Automation)"
];

const INTERNATIONAL_MARKETS = [
  "Cambodia",
  "Laos",
  "Malaysia",
  "Myanmar",
  "Vietnam",
  "Singapore",
  "Indonesia",
  "Brunei",
  "Philippines",
  "Hong Kong",
  "Taiwan",
  "Japan",
  "China",
  "Australia",
  "Sri Lanka",
  "South Korea",
  "Mongolia",
  "India",
  "Pakistan",
  "USA"
];

export default function NetworkRegistration() {
  const { networkName } = useParams<{ networkName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const [businessNetworkFormData, setBusinessNetworkFormData] = useState<any>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    businessName: "",
    businessType: "",
    businessSize: "",
    businessDescription: "",
    businessWebsite: "",
    businessPhone: "",
    businessEmail: "",
    agricultureBusinessTypes: [],
    painPoints: "",
    groupBenefits: [],
    otherGroupBenefits: "",
    interestedActivities: [],
    workingTeamInterest: "",
    expectations: [],
    otherExpectations: "",
    internationalMarkets: [],
    otherInternationalMarkets: "",
    termsAccepted: false,
    dataProcessingConsent: false
  });

  // โหลดข้อมูลจาก BusinessNetworkForm เมื่อ component mount
  useEffect(() => {
    const savedData = localStorage.getItem('businessNetworkFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setBusinessNetworkFormData(parsedData);
        console.log('Loaded BusinessNetworkForm data:', parsedData);
      } catch (error) {
        console.error('Error parsing BusinessNetworkForm data:', error);
      }
    }
  }, []);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof RegistrationData] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter((item: string) => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleFileUpload = (field: string, file: File | null) => {
    updateFormData(field, file);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // เตรียมข้อมูลทั้งหมดสำหรับส่งไปยัง API (รวมข้อมูลจาก BusinessNetworkForm)
      const submissionData = {
        // ข้อมูลพื้นฐานจาก BusinessNetworkForm (ถ้ามี)
        pdpaAccepted: businessNetworkFormData?.pdpaAccepted || true,
        membershipType: businessNetworkFormData?.membershipType || 'yec',
        yecProvince: businessNetworkFormData?.yecProvince || '',
        tccCardImage: businessNetworkFormData?.tccCardImage || null,
        profileImage: businessNetworkFormData?.profileImage || null,
        businessNetwork: businessNetworkFormData?.businessNetwork || networkName || '',
        thaiFirstName: businessNetworkFormData?.thaiFirstName || '',
        thaiLastName: businessNetworkFormData?.thaiLastName || '',
        englishFirstName: businessNetworkFormData?.englishFirstName || '',
        englishLastName: businessNetworkFormData?.englishLastName || '',
        nickname: businessNetworkFormData?.nickname || '',
        phone: businessNetworkFormData?.phone || '',
        email: businessNetworkFormData?.email || '',
        lineId: businessNetworkFormData?.lineId || '',
        addressProvince: businessNetworkFormData?.addressProvince || '',
        addressDistrict: businessNetworkFormData?.addressDistrict || '',
        addressSubDistrict: businessNetworkFormData?.addressSubDistrict || '',
        postalCode: businessNetworkFormData?.postalCode || '',
        
        // ข้อมูลธุรกิจจาก NetworkRegistration
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessSize: formData.businessSize,
        businessDescription: formData.businessDescription,
        businessWebsite: formData.businessWebsite,
        businessPhone: formData.businessPhone,
        businessEmail: formData.businessEmail,
        agricultureBusinessTypes: formData.agricultureBusinessTypes,
        painPoints: formData.painPoints,
        groupBenefits: formData.groupBenefits,
        otherGroupBenefits: formData.otherGroupBenefits,
        interestedActivities: formData.interestedActivities,
        workingTeamInterest: formData.workingTeamInterest,
        expectations: formData.expectations,
        otherExpectations: formData.otherExpectations,
        internationalMarkets: formData.internationalMarkets,
        otherInternationalMarkets: formData.otherInternationalMarkets,
        termsAccepted: formData.termsAccepted,
        dataProcessingConsent: formData.dataProcessingConsent
      };

      // Debug: แสดงข้อมูลที่ส่งไปยัง API
      console.log('📤 Sending data to API:', submissionData);
      console.log('📷 Image paths:', {
        tccCardImage: submissionData.tccCardImage,
        profileImage: submissionData.profileImage
      });

      // ส่งข้อมูลไปยัง API
      const res = await fetch(`${API_BASE_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const result = await res.json();
      
      if (result.success) {
        toast({
          title: "ส่งใบสมัครสำเร็จ!",
          description: `ใบสมัครเข้าร่วม ${networkName} ได้รับการส่งเรียบร้อยแล้ว\n${result.message || ''}`,
        });
        
        // ลบข้อมูลที่เก็บไว้ใน localStorage หลังจากส่งสำเร็จ
        localStorage.removeItem('businessNetworkFormData');
        
        // Navigate back to main form or success page
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to submit to Google Sheets");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งใบสมัครได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    }
  };

  const StepIcon = ({ step }: { step: number }) => {
    const icons = [Building, Target, Users, FileText, Award, Award];
    const Icon = icons[step - 1];
    return <Icon className="w-4 h-4" />;
  };

  const StepProgress = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div
            key={step}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
              step <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <StepIcon step={step} />
          </div>
        ))}
      </div>
      <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>ข้อมูลธุรกิจ</span>
        <span>ปัญหาที่เผชิญ</span>
        <span>ความต้องการ</span>
        <span>กิจกรรม</span>
        <span>ความคาดหวัง</span>
        <span>ข้อตกลง</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Building className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold text-primary">
          ข้อมูลธุรกิจ
        </h2>
        <p className="text-muted-foreground mt-2">กรุณากรอกข้อมูลธุรกิจของคุณ</p>
      </div>

      <div>
        <Label htmlFor="businessName">ชื่อธุรกิจ *</Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => updateFormData("businessName", e.target.value)}
          placeholder="กรอกชื่อธุรกิจ"
        />
      </div>

      <div>
        <Label>ประเภทธุรกิจ *</Label>
        <Select value={formData.businessType} onValueChange={(value) => updateFormData("businessType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="เลือกประเภทธุรกิจ" />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            {BUSINESS_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>ขนาดธุรกิจ *</Label>
        <RadioGroup 
          value={formData.businessSize} 
          onValueChange={(value) => updateFormData("businessSize", value)}
          className="mt-2"
        >
          {BUSINESS_SIZES.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <RadioGroupItem value={size} id={size} />
              <Label htmlFor={size}>{size}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="businessDescription">คำอธิบายธุรกิจ *</Label>
        <Textarea
          id="businessDescription"
          value={formData.businessDescription}
          onChange={(e) => updateFormData("businessDescription", e.target.value)}
          placeholder="อธิบายเกี่ยวกับธุรกิจของคุณ"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessWebsite">เว็บไซต์ธุรกิจ</Label>
          <Input
            id="businessWebsite"
            value={formData.businessWebsite}
            onChange={(e) => updateFormData("businessWebsite", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
        <div>
          <Label htmlFor="businessPhone">เบอร์โทรศัพท์ธุรกิจ</Label>
          <Input
            id="businessPhone"
            type="tel"
            value={formData.businessPhone}
            onChange={(e) => updateFormData("businessPhone", e.target.value)}
            placeholder="กรอกเบอร์โทรศัพท์"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="businessEmail">อีเมลธุรกิจ</Label>
        <Input
          id="businessEmail"
          type="email"
          value={formData.businessEmail}
          onChange={(e) => updateFormData("businessEmail", e.target.value)}
          placeholder="กรอกอีเมลธุรกิจ"
        />
      </div>

      {/* Agriculture Specific - What does your business do? */}
      <div>
        <Label>ธุรกิจของคุณทำอะไรอยู่ *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {AGRICULTURE_BUSINESS_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={formData.agricultureBusinessTypes.includes(type)}
                onCheckedChange={() => handleArrayToggle("agricultureBusinessTypes", type)}
              />
              <Label htmlFor={type} className="text-sm">{type}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Target className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold text-primary">
          ปัญหาหรือความท้าทาย
        </h2>
        <p className="text-muted-foreground mt-2">กรุณาระบุปัญหาที่ธุรกิจคุณกำลังเผชิญและอยากให้กลุ่มช่วย</p>
      </div>

      <div>
        <Label htmlFor="painPoints">ปัญหาหรือความท้าทาย (Pain point) ที่ธุรกิจคุณกำลังเผชิญ และอยากให้กลุ่มช่วย *</Label>
        <Textarea
          id="painPoints"
          value={formData.painPoints}
          onChange={(e) => updateFormData("painPoints", e.target.value)}
          placeholder="อธิบายปัญหาหรือความท้าทายที่ธุรกิจของคุณกำลังเผชิญ และต้องการความช่วยเหลือจากกลุ่ม"
          rows={6}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Users className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold text-primary">
          ความต้องการจากกลุ่ม
        </h2>
        <p className="text-muted-foreground mt-2">กรุณาระบุสิ่งที่คุณต้องการจากการเข้าร่วมกลุ่ม</p>
      </div>

      <div>
        <Label>สิ่งที่คุณต้องการจากการเข้าร่วมกลุ่ม *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {GROUP_BENEFITS.map((benefit) => (
            <div key={benefit} className="flex items-center space-x-2">
              <Checkbox
                id={benefit}
                checked={formData.groupBenefits.includes(benefit)}
                onCheckedChange={() => handleArrayToggle("groupBenefits", benefit)}
              />
              <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="otherGroupBenefits">อื่นๆ (กรุณาระบุ)</Label>
        <Textarea
          id="otherGroupBenefits"
          value={formData.otherGroupBenefits}
          onChange={(e) => updateFormData("otherGroupBenefits", e.target.value)}
          placeholder="ระบุความต้องการอื่นๆ ที่ไม่ปรากฏในรายการข้างต้น"
          rows={3}
        />
      </div>

      <div>
        <Label>คุณสนใจเข้าร่วมกิจกรรมใดบ้าง *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {INTERESTED_ACTIVITIES.map((activity) => (
            <div key={activity} className="flex items-center space-x-2">
              <Checkbox
                id={activity}
                checked={formData.interestedActivities.includes(activity)}
                onCheckedChange={() => handleArrayToggle("interestedActivities", activity)}
              />
              <Label htmlFor={activity} className="text-sm">{activity}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold text-primary">
          กิจกรรมที่สนใจ
        </h2>
        <p className="text-muted-foreground mt-2">เลือกกิจกรรมที่คุณสนใจเข้าร่วม</p>
      </div>

      <div>
        <Label>สนใจเข้ามาร่วมเป็น Working Team ของกลุ่ม *</Label>
        <RadioGroup 
          value={formData.workingTeamInterest} 
          onValueChange={(value) => updateFormData("workingTeamInterest", value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Award className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold text-primary">
          สิ่งที่ต้องการหรือคาดหวัง
        </h2>
        <p className="text-muted-foreground mt-2">ระบุสิ่งที่คุณต้องการหรือคาดหวังจากการเข้าร่วมกลุ่ม</p>
      </div>

      <div>
        <Label>สิ่งที่ต้องการหรือคาดหวัง *</Label>
        <div className="grid grid-cols-1 gap-3 mt-2">
          {EXPECTATIONS.map((expectation) => (
            <div key={expectation} className="flex items-center space-x-2">
              <Checkbox
                id={expectation}
                checked={formData.expectations.includes(expectation)}
                onCheckedChange={() => handleArrayToggle("expectations", expectation)}
              />
              <Label htmlFor={expectation} className="text-sm">{expectation}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="otherExpectations">อื่น ๆ (โปรดระบุ)</Label>
        <Textarea
          id="otherExpectations"
          value={formData.otherExpectations}
          onChange={(e) => updateFormData("otherExpectations", e.target.value)}
          placeholder="ระบุความต้องการอื่นๆ ที่ไม่ปรากฏในรายการข้างต้น"
          rows={3}
        />
      </div>

      <div>
        <Label>สนใจขยายตลาดต่างประเทศ</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
          {INTERNATIONAL_MARKETS.map((market) => (
            <div key={market} className="flex items-center space-x-2">
              <Checkbox
                id={market}
                checked={formData.internationalMarkets.includes(market)}
                onCheckedChange={() => handleArrayToggle("internationalMarkets", market)}
              />
              <Label htmlFor={market} className="text-sm">{market}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="otherInternationalMarkets">Others (โปรดระบุ)</Label>
        <Input
          id="otherInternationalMarkets"
          value={formData.otherInternationalMarkets}
          onChange={(e) => updateFormData("otherInternationalMarkets", e.target.value)}
          placeholder="ระบุประเทศอื่นๆ ที่สนใจ"
        />
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Award className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-bold text-primary">
          ข้อตกลงและเงื่อนไข
        </h2>
        <p className="text-muted-foreground mt-2">ยอมรับข้อตกลงและเงื่อนไขการเข้าร่วม</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => updateFormData("termsAccepted", checked)}
          />
          <Label htmlFor="terms" className="text-sm leading-relaxed">
            ข้าพเจ้ายอมรับข้อตกลงและเงื่อนไขการเข้าร่วมเครือข่าย {networkName}
          </Label>
        </div>

        <div className="flex items-center space-x-3 p-4 border rounded-lg">
          <Checkbox
            id="dataConsent"
            checked={formData.dataProcessingConsent}
            onCheckedChange={(checked) => updateFormData("dataProcessingConsent", checked)}
          />
          <Label htmlFor="dataConsent" className="text-sm leading-relaxed">
            ข้าพเจ้ายินยอมให้ประมวลผลข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัว
          </Label>
        </div>
      </div>
    </div>
  );

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.businessType && formData.businessSize && formData.businessDescription && formData.agricultureBusinessTypes.length > 0;
      case 2:
        return formData.painPoints;
      case 3:
        return formData.groupBenefits.length > 0;
      case 4:
        return formData.interestedActivities.length > 0 && formData.workingTeamInterest;
      case 5:
        return formData.expectations.length > 0;
      case 6:
        return formData.termsAccepted && formData.dataProcessingConsent;
      default:
        return false;
    }
  };

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
            ฟอร์มลงทะเบียน {networkName}
          </h1>
          <p className="text-lg text-muted-foreground">
            กรอกข้อมูลเพื่อสมัครเข้าร่วมเครือข่ายธุรกิจ
          </p>
          
          {/* แสดงข้อมูลที่โหลดมาจาก BusinessNetworkForm */}
          {businessNetworkFormData && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-sm mb-2">ข้อมูลที่กรอกแล้ว:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>ชื่อ: {businessNetworkFormData.thaiFirstName} {businessNetworkFormData.thaiLastName}</div>
                <div>อีเมล: {businessNetworkFormData.email}</div>
                <div>โทรศัพท์: {businessNetworkFormData.phone}</div>
                <div>จังหวัด: {businessNetworkFormData.yecProvince}</div>
                {businessNetworkFormData.tccCardImage && (
                  <div className="col-span-2">
                    TCC Card: <a href={businessNetworkFormData.tccCardImage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{businessNetworkFormData.tccCardImage}</a>
                  </div>
                )}
                {businessNetworkFormData.profileImage && (
                  <div className="col-span-2">
                    Profile: <a href={businessNetworkFormData.profileImage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{businessNetworkFormData.profileImage}</a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Card className="shadow-card border-0">
          <CardContent className="p-8">
            <StepProgress />
            
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
            {currentStep === 6 && renderStep6()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="transition-smooth"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                ย้อนกลับ
              </Button>
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  className="bg-primary text-primary-foreground"
                  disabled={!isStepValid()}
                >
                  ถัดไป
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  className="bg-primary text-primary-foreground"
                  disabled={!isStepValid()}
                >
                  ส่งใบสมัคร
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
