import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Users } from "lucide-react";

interface NetworkMembership {
  id: string;
  status: "pending" | "approved" | "rejected";
  business_networks: {
    id: string;
    name: string;
    name_en: string;
    icon_url: string | null;
    description: string | null;
  };
}

export const NetworkMemberships = ({ userId }: { userId: string }) => {
  const [memberships, setMemberships] = useState<NetworkMembership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemberships();
  }, [userId]);

  const loadMemberships = async () => {
    try {
      const { data, error } = await supabase
        .from("network_memberships")
        .select(`
          id,
          status,
          business_networks (
            id,
            name,
            name_en,
            icon_url,
            description
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;
      setMemberships(data as NetworkMembership[]);
    } catch (error) {
      console.error("Error loading memberships:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-600">รับรองแล้ว</Badge>;
      case "rejected":
        return <Badge variant="destructive">ถูกปฏิเสธ</Badge>;
      default:
        return <Badge variant="secondary">รอการรับรอง</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (memberships.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            คณะ Business Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            ยังไม่มีการเข้าร่วมคณะ Business Network
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          คณะ Business Network
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {memberships.map((membership) => (
          <div
            key={membership.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={membership.business_networks.icon_url || undefined} />
                <AvatarFallback>
                  <Users className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{membership.business_networks.name}</h3>
                {membership.business_networks.name_en && (
                  <p className="text-sm text-muted-foreground">
                    {membership.business_networks.name_en}
                  </p>
                )}
              </div>
            </div>
            {getStatusBadge(membership.status)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
