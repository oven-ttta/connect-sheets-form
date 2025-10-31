import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BusinessNetworkForm from "@/components/BusinessNetworkForm";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [useTestComponent, setUseTestComponent] = useState(true);
  
  useEffect(() => {
    const handleSwitchToForm = () => {
      setUseTestComponent(false);
    };
    
    window.addEventListener('switchToForm', handleSwitchToForm);
    
    return () => {
      window.removeEventListener('switchToForm', handleSwitchToForm);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          onClick={() => navigate("/auth")}
          className="gap-2"
        >
          <User className="h-4 w-4" />
          เข้าสู่ระบบ / สมัครสมาชิก
        </Button>
      </div>
      <BusinessNetworkForm />
    </div>
  );
};

export default Index;
