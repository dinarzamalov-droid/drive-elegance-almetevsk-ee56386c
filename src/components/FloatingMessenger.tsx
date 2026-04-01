import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const FloatingMessenger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <a
            href="https://wa.me/79868262332"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full font-semibold text-sm shadow-lg hover:brightness-110 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </a>
          <a
            href="https://t.me/3ddrive"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#26A5E4] text-white px-5 py-3 rounded-full font-semibold text-sm shadow-lg hover:brightness-110 transition-all"
          >
            <Send className="w-5 h-5" />
            Telegram
          </a>
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
