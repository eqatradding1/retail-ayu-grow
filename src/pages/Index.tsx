
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page immediately
    navigate("/auth/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Index;
