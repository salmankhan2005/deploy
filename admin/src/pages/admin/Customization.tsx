import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Palette, Save, Check } from "lucide-react";
import { toast } from "sonner";

type ThemeName = "Primary Green" | "Ocean Blue" | "Sunset Orange" | "Royal Purple";

const themes: Record<ThemeName, { primary: string; secondary: string; accent: string; gradient: string }> = {
  "Primary Green": {
    primary: "146 48% 49%",
    secondary: "20 100% 63%",
    accent: "146 48% 95%",
    gradient: "from-primary/20 to-secondary/20",
  },
  "Ocean Blue": {
    primary: "210 100% 50%",
    secondary: "195 100% 60%",
    accent: "210 100% 95%",
    gradient: "from-blue-500/20 to-cyan-400/20",
  },
  "Sunset Orange": {
    primary: "25 95% 53%",
    secondary: "340 90% 65%",
    accent: "25 95% 95%",
    gradient: "from-orange-500/20 to-pink-400/20",
  },
  "Royal Purple": {
    primary: "270 75% 60%",
    secondary: "290 80% 65%",
    accent: "270 75% 95%",
    gradient: "from-purple-500/20 to-violet-400/20",
  },
};

const Customization = () => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>("Primary Green");
  const [features, setFeatures] = useState([
    { id: "recipes", label: "Recipe Library", description: "Allow users to browse recipes", enabled: true },
    { id: "social", label: "Social Sharing", description: "Enable social media integration", enabled: true },
    { id: "ai", label: "AI Meal Suggestions", description: "AI-powered meal recommendations", enabled: false },
    { id: "shopping", label: "Shopping Lists", description: "Generate grocery lists from meals", enabled: true },
    { id: "nutrition", label: "Nutrition Tracking", description: "Track calories and macros", enabled: true },
    { id: "community", label: "Community Features", description: "User forums and discussions", enabled: false },
  ]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") as ThemeName;
    if (savedTheme && themes[savedTheme]) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeName: ThemeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--accent", theme.accent);
  };

  const handleThemeSelect = (themeName: ThemeName) => {
    setSelectedTheme(themeName);
    applyTheme(themeName);
  };

  const handleSaveTheme = () => {
    localStorage.setItem("selectedTheme", selectedTheme);
    toast.success(`${selectedTheme} theme saved successfully!`);
  };

  const handleFeatureToggle = (featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleSaveFeatures = () => {
    localStorage.setItem("features", JSON.stringify(features));
    toast.success("Feature settings saved successfully!");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold">Customization</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage themes and feature toggles</p>
      </div>

      {/* Theme Management */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-heading text-lg md:text-xl">
            <Palette className="h-5 w-5" />
            Theme Settings
          </CardTitle>
          <CardDescription className="text-sm">Customize the app's appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {(Object.keys(themes) as ThemeName[]).map((themeName) => (
              <div
                key={themeName}
                onClick={() => handleThemeSelect(themeName)}
                className={`
                  relative aspect-square rounded-xl border-2 cursor-pointer transition-all
                  flex flex-col items-center justify-center p-3 md:p-4
                  bg-gradient-to-br ${themes[themeName].gradient}
                  ${
                    selectedTheme === themeName
                      ? "border-primary ring-2 ring-primary/50 shadow-lg scale-105"
                      : "border-border hover:border-primary hover:shadow-md"
                  }
                `}
              >
                {selectedTheme === themeName && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-3 w-3 md:h-4 md:w-4" />
                  </div>
                )}
                <span className="text-xs md:text-sm font-medium text-center">{themeName}</span>
              </div>
            ))}
          </div>
          <Button onClick={handleSaveTheme} className="gap-2 w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Save Theme
          </Button>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-heading text-lg md:text-xl">Feature Toggles</CardTitle>
          <CardDescription className="text-sm">Enable or disable app features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 md:p-4 rounded-lg border"
              >
                <div className="space-y-1 flex-1">
                  <Label
                    htmlFor={feature.id}
                    className="text-sm md:text-base font-medium cursor-pointer"
                  >
                    {feature.label}
                  </Label>
                  <p className="text-xs md:text-sm text-muted-foreground">{feature.description}</p>
                </div>
                <Switch
                  id={feature.id}
                  checked={feature.enabled}
                  onCheckedChange={() => handleFeatureToggle(feature.id)}
                />
              </div>
            ))}
          </div>
          <Button onClick={handleSaveFeatures} className="mt-4 md:mt-6 gap-2 w-full sm:w-auto">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customization;
