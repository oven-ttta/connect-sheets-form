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
import { ChevronRight, ChevronLeft, Users, FileText, Building, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  // Session 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lineId: string;
  university: string;
  faculty: string;
  year: string;
  
  // Session 2: Interest & Experience
  businessNetwork: string;
  previousExperience: string;
  motivation: string;
  skills: string[];
  
  // Session 3: Availability
  timeCommitment: string;
  meetingPreference: string;
  availability: string[];
  
  // Session 4: Business Information
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

export default function BusinessNetworkForm() {
  const [currentSession, setCurrentSession] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    lineId: "",
    university: "",
    faculty: "",
    year: "",
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
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = () => {
    toast({
      title: "แบบฟอร์มส่งสำเร็จ!",
      description: `ข้อมูลของคุณได้ถูกบันทึกใน Business Network: ${formData.businessNetwork}`,
    });
    console.log("Form submitted:", formData);
  };

  const SessionIcon = ({ session }: { session: number }) => {
    const icons = [Users, FileText, Building, Target];
    const Icon = icons[session - 1];
    return <Icon className="w-5 h-5" />;
  };

  const SessionProgress = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {[1, 2, 3, 4].map((session) => (
          <div
            key={session}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
              session <= currentSession
                ? "bg-gradient-primary text-white shadow-elegant"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <SessionIcon session={session} />
          </div>
        ))}
      </div>
      <Progress value={(currentSession / 4) * 100} className="h-2" />
      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
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
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Session 1: ข้อมูลส่วนตัว
        </h2>
        <p className="text-muted-foreground mt-2">กรุณากรอกข้อมูลส่วนตัวของคุณ</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">ชื่อ</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            placeholder="กรอกชื่อ"
          />
        </div>
        <div>
          <Label htmlFor="lastName">นามสกุล</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            placeholder="กรอกนามสกุล"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">อีเมล</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          placeholder="กรอกอีเมล"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            placeholder="กรอกเบอร์โทรศัพท์"
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

      <div>
        <Label htmlFor="university">มหาวิทยาลัย</Label>
        <Input
          id="university"
          value={formData.university}
          onChange={(e) => updateFormData("university", e.target.value)}
          placeholder="กรอกชื่อมหาวิทยาลัย"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="faculty">คณะ</Label>
          <Input
            id="faculty"
            value={formData.faculty}
            onChange={(e) => updateFormData("faculty", e.target.value)}
            placeholder="กรอกชื่อคณะ"
          />
        </div>
        <div>
          <Label>ชั้นปี</Label>
          <Select value={formData.year} onValueChange={(value) => updateFormData("year", value)}>
            <SelectTrigger>
              <SelectValue placeholder="เลือกชั้นปี" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">ปี 1</SelectItem>
              <SelectItem value="2">ปี 2</SelectItem>
              <SelectItem value="3">ปี 3</SelectItem>
              <SelectItem value="4">ปี 4</SelectItem>
              <SelectItem value="graduate">บัณฑิตศึกษา</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderSession2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Session 2: ความสนใจและประสบการณ์
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

  const renderSession3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Session 3: เวลาที่สะดวก
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

  const renderSession4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Session 4: ข้อมูลธุรกิจ
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
                <Button onClick={handleNext} className="bg-gradient-primary transition-smooth">
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