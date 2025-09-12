import { useState, useEffect } from "react";
import BusinessNetworkForm from "@/components/BusinessNetworkForm";
import TestComponent from "@/components/TestComponent";

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
  
  if (useTestComponent) {
    return <TestComponent />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-background">
      <BusinessNetworkForm />
    </div>
  );
};

export default Index;
