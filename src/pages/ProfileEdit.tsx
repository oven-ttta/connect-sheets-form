import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploadCrop } from "@/components/profile/ImageUploadCrop";
import { ProfileForm, ProfileFormData } from "@/components/profile/ProfileForm";
import { NetworkMemberships } from "@/components/profile/NetworkMemberships";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const THAI_PROVINCES = [
  "กรุงเทพมหานคร", "เชียงใหม่", "เชียงราย", "ภูเก็ต", "สุราษฎร์ธานี", 
  "ขอนแก่น", "นครราชสีมา", "อุบลราชธานี", "สงขลา", "อื่นๆ"
];

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    await loadProfile(session.user.id);
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (profile?.avatar_url) {
        const oldPath = profile.avatar_url.split("/").pop();
        await supabase.storage
          .from("avatars")
          .remove([`${user.id}/${oldPath}`]);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleProfileSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name_th: data.full_name_th,
          full_name_en: data.full_name_en,
          email: data.email,
          tel_no: data.tel_no,
          line_id: data.line_id,
          company_name: data.company_name,
          tax_id: data.tax_id,
          yec_province: data.yec_province,
          business_status: data.business_status,
          language_skills: data.language_skills,
          business_countries: data.business_countries,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("บันทึกข้อมูลสำเร็จ!");
      await loadProfile(user.id);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  const handleTccUpload = () => {
    toast.info("ฟีเจอร์อัปโหลดเอกสาร TCC กำลังพัฒนา");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">โปรไฟล์สมาชิก YEC</h1>
            <p className="text-muted-foreground">จัดการข้อมูลส่วนตัวของคุณ</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            ออกจากระบบ
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลส่วนตัว</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploadCrop
              currentImageUrl={profile?.avatar_url}
              onImageUpload={handleImageUpload}
              fallbackText={profile?.full_name_en?.[0] || "?"}
            />

            <ProfileForm
              defaultValues={{
                full_name_th: profile?.full_name_th || "",
                full_name_en: profile?.full_name_en || "",
                email: profile?.email || user?.email || "",
                tel_no: profile?.tel_no || "",
                line_id: profile?.line_id || "",
                company_name: profile?.company_name || "",
                tax_id: profile?.tax_id || "",
                yec_province: profile?.yec_province || "",
                business_status: profile?.business_status || "",
                language_skills: profile?.language_skills || [],
                business_countries: profile?.business_countries || [],
              }}
              tccStatus={profile?.tcc_connect_status || "pending"}
              onSubmit={handleProfileSubmit}
              onTccUpload={handleTccUpload}
              loading={saving}
              provinces={THAI_PROVINCES}
            />
          </CardContent>
        </Card>

        {user && (
          <NetworkMemberships userId={user.id} />
        )}
      </div>
    </div>
  );
};

export default Profile;
