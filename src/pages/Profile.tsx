import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NetworkMemberships } from "@/components/profile/NetworkMemberships";
import { toast } from "sonner";
import { 
  LogOut, 
  Loader2, 
  Mail, 
  Phone, 
  Building2, 
  MapPin, 
  Edit,
  MessageCircle,
  Globe,
  Briefcase,
  Languages
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">โปรไฟล์ของฉัน</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/profile/edit")}>
              <Edit className="mr-2 h-4 w-4" />
              แก้ไขข้อมูล
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              ออกจากระบบ
            </Button>
          </div>
        </div>

        {/* Virtual Business Card */}
        <Card className="overflow-hidden">
          {/* Card Header with Gradient */}
          <div className="h-32 bg-gradient-to-r from-primary to-primary/60 relative">
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-4xl">
                  {profile?.full_name_en?.[0] || profile?.full_name_th?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Card Content */}
          <div className="pt-20 pb-6 px-8 space-y-6">
            {/* Name and Company */}
            <div>
              <h2 className="text-3xl font-bold">{profile?.full_name_th || "ไม่ระบุชื่อ"}</h2>
              {profile?.full_name_en && (
                <p className="text-xl text-muted-foreground mt-1">{profile.full_name_en}</p>
              )}
              {profile?.company_name && (
                <div className="flex items-center gap-2 mt-3">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-semibold">{profile.company_name}</span>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              {profile?.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">อีเมล</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
              )}
              
              {profile?.tel_no && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">โทรศัพท์</p>
                    <p className="font-medium">{profile.tel_no}</p>
                  </div>
                </div>
              )}
              
              {profile?.line_id && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Line ID</p>
                    <p className="font-medium">{profile.line_id}</p>
                  </div>
                </div>
              )}
              
              {profile?.yec_province && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">จังหวัด YEC</p>
                    <p className="font-medium">{profile.yec_province}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Business Information */}
            {(profile?.tax_id || profile?.business_status) && (
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  ข้อมูลธุรกิจ
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile?.tax_id && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">เลขประจำตัวผู้เสียภาษี</p>
                      <p className="font-medium">{profile.tax_id}</p>
                    </div>
                  )}
                  {profile?.business_status && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">สถานะธุรกิจ</p>
                      <p className="font-medium">{profile.business_status}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Language Skills */}
            {profile?.language_skills && profile.language_skills.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  ภาษาที่ใช้ได้
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.language_skills.map((lang: string) => (
                    <Badge key={lang} variant="secondary">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Business Countries */}
            {profile?.business_countries && profile.business_countries.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  ประเทศที่ทำธุรกิจ
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.business_countries.map((country: string) => (
                    <Badge key={country} variant="outline">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Network Memberships */}
        {user && <NetworkMemberships userId={user.id} />}
      </div>
    </div>
  );
};

export default Profile;
