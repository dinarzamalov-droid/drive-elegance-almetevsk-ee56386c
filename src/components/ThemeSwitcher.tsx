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
    <div className="fixed bottom-[100px] right-4 md:bottom-28 md:right-6 z-50 flex flex-col gap-2">
      <button
        onClick={() => setTheme(theme === "silver" ? "orange" : "silver")}
        className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        title="Сменить тему"
      >
        <Palette className="w-5 h-5 text-primary" />
      </button>
      <div className="flex flex-col gap-1 items-center">
        <button
          onClick={() => setTheme("silver")}
          className={`w-6 h-6 rounded-full border-2 transition-all ${
            theme === "silver" ? "border-foreground scale-110" : "border-muted-foreground/30"
          }`}
          style={{ background: "linear-gradient(135deg, hsl(210,15%,65%), hsl(215,12%,50%))" }}
          title="Серебро"
        />
        <button
          onClick={() => setTheme("orange")}
          className={`w-6 h-6 rounded-full border-2 transition-all ${
            theme === "orange" ? "border-foreground scale-110" : "border-muted-foreground/30"
          }`}
          style={{ background: "linear-gradient(135deg, hsl(18,91%,55%), hsl(14,85%,48%))" }}
          title="Оранжевый"
        />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
