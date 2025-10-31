import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, FileText } from "lucide-react";

const LANGUAGE_OPTIONS = [
  { value: "english", label: "ภาษาอังกฤษ" },
  { value: "chinese", label: "ภาษาจีน" },
  { value: "japanese", label: "ภาษาญี่ปุ่น" },
  { value: "korean", label: "ภาษาเกาหลี" },
  { value: "other", label: "อื่นๆ" },
];

const BUSINESS_STATUS_OPTIONS = [
  { value: "has_business", label: "มีธุรกิจอยู่ในประเทศที่เลือกแล้ว" },
  { value: "has_partnership", label: "เคยทำธุรกิจร่วมกับพาร์ทเนอร์จากประเทศนั้น" },
  { value: "interested_expansion", label: "กำลังสนใจขยายธุรกิจไปยังประเทศนั้น" },
  { value: "want_to_learn", label: "ยังไม่มี แต่ต้องการเรียนรู้เพิ่มเติม" },
];

const COUNTRY_OPTIONS = [
  "China", "Japan", "Taiwan", "Myanmar", "Laos", "Cambodia",
  "Vietnam", "Korea", "Malaysia", "Singapore", "India", "Other"
];

const profileSchema = z.object({
  full_name_th: z.string().min(1, "กรุณากรอกชื่อ-นามสกุลภาษาไทย"),
  full_name_en: z.string().min(1, "กรุณากรอกชื่อ-นามสกุลภาษาอังกฤษ"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  tel_no: z.string().min(10, "เบอร์โทรศัพท์ต้องมีอย่างน้อย 10 หลัก"),
  line_id: z.string().optional(),
  company_name: z.string().optional(),
  tax_id: z.string().length(13, "Tax ID ต้องมี 13 หลัก").optional().or(z.literal("")),
  yec_province: z.string().optional(),
  business_status: z.string().optional(),
  language_skills: z.array(z.string()).default([]),
  business_countries: z.array(z.string()).default([]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  defaultValues?: Partial<ProfileFormData>;
  tccStatus?: "pending" | "attached";
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onTccUpload?: () => void;
  loading?: boolean;
  provinces?: string[];
}

export const ProfileForm = ({
  defaultValues,
  tccStatus = "pending",
  onSubmit,
  onTccUpload,
  loading = false,
  provinces = [],
}: ProfileFormProps) => {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      language_skills: [],
      business_countries: [],
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ชื่อ-นามสกุล (ไทย) */}
          <FormField
            control={form.control}
            name="full_name_th"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อ-นามสกุล (ภาษาไทย)</FormLabel>
                <FormControl>
                  <Input placeholder="ชื่อ นามสกุล" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name Surname (English) */}
          <FormField
            control={form.control}
            name="full_name_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name Surname (English)</FormLabel>
                <FormControl>
                  <Input placeholder="First Last" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>อีเมล</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* เบอร์โทรศัพท์ */}
          <FormField
            control={form.control}
            name="tel_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>เบอร์โทรศัพท์</FormLabel>
                <FormControl>
                  <Input placeholder="0812345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Line ID */}
          <FormField
            control={form.control}
            name="line_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Line ID</FormLabel>
                <FormControl>
                  <Input placeholder="line_id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* YEC จังหวัด */}
          <FormField
            control={form.control}
            name="yec_province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YEC จังหวัด</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกจังหวัด" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ชื่อบริษัท */}
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อบริษัท</FormLabel>
                <FormControl>
                  <Input placeholder="บริษัท ABC จำกัด" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tax ID */}
          <FormField
            control={form.control}
            name="tax_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax ID (13 หลัก)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1234567890123"
                    maxLength={13}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* TCC Connect Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="font-medium">สถานะหลักฐาน TCC Connect</span>
            <Badge variant={tccStatus === "attached" ? "default" : "secondary"}>
              {tccStatus === "attached" ? "แนบแล้ว" : "ยังไม่ได้แนบ"}
            </Badge>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onTccUpload}>
            แนบหลักฐาน
          </Button>
        </div>

        {/* ความสามารถด้านภาษา */}
        <FormField
          control={form.control}
          name="language_skills"
          render={() => (
            <FormItem>
              <FormLabel>ความสามารถด้านภาษา</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {LANGUAGE_OPTIONS.map((option) => (
                  <FormField
                    key={option.value}
                    control={form.control}
                    name="language_skills"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, option.value])
                                : field.onChange(
                                    field.value?.filter((value) => value !== option.value)
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* สถานะความเกี่ยวข้องทางธุรกิจ */}
        <FormField
          control={form.control}
          name="business_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>สถานะความเกี่ยวข้องทางธุรกิจ</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BUSINESS_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ประเทศที่ทำธุรกิจด้วย */}
        <FormField
          control={form.control}
          name="business_countries"
          render={() => (
            <FormItem>
              <FormLabel>ประเทศที่คุณทำธุรกิจด้วย</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {COUNTRY_OPTIONS.map((country) => (
                  <FormField
                    key={country}
                    control={form.control}
                    name="business_countries"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(country)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, country])
                                : field.onChange(
                                    field.value?.filter((value) => value !== country)
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          {country}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              "บันทึกข้อมูล"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
