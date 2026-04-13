import { useState } from "react";
import { MessageCircle, X, Phone, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFooterVisible } from "@/hooks/use-footer-visible";

const messengers = [
  { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/79868262332", icon: Phone, bg: "bg-[#25D366]" },
  { key: "telegram", label: "Telegram", href: "https://t.me/3ddrive", icon: Send, bg: "bg-[#26A5E4]" },
  { key: "max", label: "МАХ", href: "https://max.ru/user/79868262332", icon: MessageCircle, bg: "bg-gradient-to-r from-[#1a1a1a] to-[#333]", badge: "Быстрый ответ" },
];

const FloatingMessenger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isFooterVisible = useFooterVisible();

  return (
    <div className={cn(
      "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-2 transition-opacity duration-300",
      isFooterVisible ? "opacity-0 pointer-events-none" : "opacity-100"
    )}>
      {isOpen && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {messengers.map((m) => (
            <a
              key={m.key}
              href={m.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative flex items-center gap-3 text-white px-5 py-3 rounded-full font-semibold text-sm shadow-lg hover:brightness-110 transition-all",
                m.bg
              )}
            >
              <m.icon className="w-5 h-5" />
              {m.label}
              {m.badge && (
                <span className="absolute -top-2 -right-2 bg-[#25D366] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {m.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
          isOpen
            ? "bg-secondary text-foreground rotate-0"
            : "bg-gradient-gold text-primary-foreground animate-pulse"
        )}
        aria-label="Связаться"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default FloatingMessenger;
