import { useState } from "react";
import { Phone, Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessengerType, messengerMeta } from "@/lib/messengerUtils";

const icons: Record<MessengerType, React.ElementType> = {
  whatsapp: Phone,
  telegram: Send,
  max: MessageCircle,
};

interface MessengerSelectProps {
  value: MessengerType;
  onChange: (v: MessengerType) => void;
  className?: string;
}

const MessengerSelect = ({ value, onChange, className }: MessengerSelectProps) => {
  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {(Object.keys(messengerMeta) as MessengerType[]).map((key) => {
        const Icon = icons[key];
        const meta = messengerMeta[key];
        const selected = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border-2 text-xs font-semibold transition-all",
              selected
                ? `${meta.borderColor} ${meta.color} text-white shadow-md`
                : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground/50"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
};

export default MessengerSelect;