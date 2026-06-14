import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export type ColorTheme = "silver" | "orange" | "emerald" | "royal" | "crimson" | "gold";

const THEMES: { id: ColorTheme; name: string; swatch: string }[] = [
  { id: "silver", name: "Серебро", swatch: "linear-gradient(135deg,#b8c0cc,#6b7280)" },
  { id: "orange", name: "Оранжевый", swatch: "linear-gradient(135deg,#f97316,#ea580c)" },
  { id: "emerald", name: "Изумруд", swatch: "linear-gradient(135deg,#10b981,#047857)" },
  { id: "royal", name: "Королевский синий", swatch: "linear-gradient(135deg,#3b82f6,#1e40af)" },
  { id: "crimson", name: "Багровый", swatch: "linear-gradient(135deg,#ef4444,#991b1b)" },
  { id: "gold", name: "Золото", swatch: "linear-gradient(135deg,#fbbf24,#b45309)" },
];

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Выбрать цветовую тему"
          aria-label="Выбрать цветовую тему"
        >
          <Palette className="w-5 h-5 text-primary" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="left" className="w-56">
        <DropdownMenuLabel>Цветовая тема</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span
              className="w-6 h-6 rounded-full border border-border shrink-0"
              style={{ background: t.swatch }}
            />
            <span className="flex-1">{t.name}</span>
            {theme === t.id && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
