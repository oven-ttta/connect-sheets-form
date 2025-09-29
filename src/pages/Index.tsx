import { useState, useEffect } from "react";
import BusinessNetworkForm from "@/components/BusinessNetworkForm";

const Index = () => {
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
      <BusinessNetworkForm />
    </div>
  );
};

export default Index;
