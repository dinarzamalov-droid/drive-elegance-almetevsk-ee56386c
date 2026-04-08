import { toast } from "sonner";

export type MessengerType = "whatsapp" | "telegram" | "max";

export const messengerMeta: Record<MessengerType, { label: string; color: string; borderColor: string }> = {
  whatsapp: { label: "WhatsApp", color: "bg-[#25D366]", borderColor: "border-[#25D366]" },
  telegram: { label: "Telegram", color: "bg-[#26A5E4]", borderColor: "border-[#26A5E4]" },
  max: { label: "МАХ", color: "bg-gradient-to-r from-[#1a1a1a] to-[#333]", borderColor: "border-primary" },
};

const PHONE = "79868262332";
const TG_USER = "3ddrive";

export function openMessenger(messenger: MessengerType, messageText: string) {
  const text = encodeURIComponent(messageText);
  switch (messenger) {
    case "whatsapp":
      window.open(`https://wa.me/${PHONE}?text=${text}`, "_blank");
      break;
    case "telegram":
      window.open(`https://t.me/${TG_USER}?text=${text}`, "_blank");
      break;
    case "max":
      window.open(`https://max.ru/user/${PHONE}?text=${text}`, "_blank");
      break;
  }
  toast.success(`Заявка отправлена в ${messengerMeta[messenger].label}!`);
}