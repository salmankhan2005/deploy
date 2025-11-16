import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="text-center space-y-6 p-8 animate-fade-in">
        <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 animate-scale-in">
          <Leaf className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-foreground animate-fade-in">
          Morning Dew Meal Planner
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-sans animate-fade-in">
          A modern, intelligent control hub for the Meal Planner ecosystem — sleek, vibrant, and powerful.
        </p>
        <div className="flex gap-4 justify-center mt-8 animate-slide-up">
          <Button size="lg" onClick={() => navigate("/login")} className="gap-2">
            Admin Portal
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

