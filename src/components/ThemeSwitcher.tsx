import { useState, useEffect } from "react";
import { Palette } from "lucide-react";

export type ColorTheme = "silver" | "orange";

const useColorTheme = () => {
  const [theme, setTheme] = useState<ColorTheme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("color-theme") as ColorTheme) || "silver";
    }
    return "silver";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-color-theme", theme);
    localStorage.setItem("color-theme", theme);
  }, [theme]);

  return { theme, setTheme };
};

const ThemeSwitcher = () => {
  const { theme, setTheme } = useColorTheme();

  return (
    <button
      onClick={() => setTheme(theme === "silver" ? "orange" : "silver")}
      className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      title={theme === "silver" ? "Оранжевая тема" : "Серебряная тема"}
    >
      <Palette className="w-5 h-5 text-primary" />
    </button>
  );
};

export default ThemeSwitcher;
