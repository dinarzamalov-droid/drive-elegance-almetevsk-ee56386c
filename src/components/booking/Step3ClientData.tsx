import { Check, Send, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingState } from "@/lib/bookingData";

interface Step3Props {
  state: BookingState;
  onChange: (partial: Partial<BookingState>) => void;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  let result = "+7";
  if (digits.length > 1) result += " (" + digits.slice(1, 4);
  if (digits.length >= 4) result += ")";
  if (digits.length > 4) result += " " + digits.slice(4, 7);
  if (digits.length > 7) result += "-" + digits.slice(7, 9);
  if (digits.length > 9) result += "-" + digits.slice(9, 11);
  return result;
}

function formatPassportSeries(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + " " + digits.slice(2);
}

function formatPassportNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

const messengerOptions = [
  { value: "telegram" as const, label: "Telegram", icon: Send, color: "bg-[#26A5E4]", borderColor: "border-[#26A5E4]" },
  { value: "whatsapp" as const, label: "WhatsApp", icon: Phone, color: "bg-[#25D366]", borderColor: "border-[#25D366]" },
  { value: "max" as const, label: "МАХ", icon: MessageCircle, color: "bg-gradient-to-r from-[#1a1a1a] to-[#333]", borderColor: "border-primary", badge: "Быстрый ответ" },
];

const Step3ClientData = ({ state, onChange }: Step3Props) => {
  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ваши данные</h2>
        <p className="text-muted-foreground text-sm">Заполните для формирования договора</p>
      </div>

      {/* ФИО */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Фамилия *</label>
          <input type="text" required placeholder="Иванов" value={state.lastName} onChange={(e) => onChange({ lastName: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Имя *</label>
          <input type="text" required placeholder="Иван" value={state.firstName} onChange={(e) => onChange({ firstName: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Отчество *</label>
          <input type="text" required placeholder="Иванович" value={state.middleName} onChange={(e) => onChange({ middleName: e.target.value })} className={inputClass} />
        </div>
      </div>

      {/* Birth date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Дата рождения *</label>
          <input type="date" required value={state.birthDate} onChange={(e) => onChange({ birthDate: e.target.value })} className={inputClass} />
        </div>
      </div>

      {/* Passport */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Серия паспорта *</label>
          <input type="text" placeholder="12 34" maxLength={5} value={formatPassportSeries(state.passportSeries)} onChange={(e) => onChange({ passportSeries: e.target.value.replace(/\D/g, "").slice(0, 4) })} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Номер паспорта *</label>
          <input type="text" placeholder="567890" maxLength={6} value={formatPassportNumber(state.passportNumber)} onChange={(e) => onChange({ passportNumber: e.target.value.replace(/\D/g, "").slice(0, 6) })} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Дата выдачи паспорта</label>
          <input type="date" value={state.passportDate} onChange={(e) => onChange({ passportDate: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Код подразделения</label>
          <input type="text" placeholder="123-456" value={state.passportCode} onChange={(e) => onChange({ passportCode: e.target.value })} className={inputClass} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Кем выдан паспорт *</label>
        <input type="text" required placeholder="МВД по Республике Татарстан" value={state.passportIssuedBy} onChange={(e) => onChange({ passportIssuedBy: e.target.value })} className={inputClass} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Адрес регистрации *</label>
        <input type="text" required placeholder="г. Альметьевск, ул. Примерная, д.1" value={state.registrationAddress} onChange={(e) => onChange({ registrationAddress: e.target.value })} className={inputClass} />
      </div>

      {/* License */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Водительское удостоверение *</label>
          <input type="text" placeholder="Серия и номер ВУ" value={state.licenseNumber} onChange={(e) => onChange({ licenseNumber: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Дата выдачи ВУ</label>
          <input type="date" value={state.licenseDate} onChange={(e) => onChange({ licenseDate: e.target.value })} className={inputClass} />
        </div>
      </div>

      {/* Contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Телефон *</label>
          <input type="tel" placeholder="+7 (___) ___-__-__" value={formatPhone(state.phone)} onChange={(e) => onChange({ phone: e.target.value.replace(/\D/g, "").slice(0, 11) })} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email *</label>
          <input type="email" placeholder="email@example.com" value={state.email} onChange={(e) => onChange({ email: e.target.value })} className={inputClass} />
        </div>
      </div>

      {/* Messenger selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Мессенджер для уведомлений</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {messengerOptions.map((m) => {
            const Icon = m.icon;
            const selected = state.preferredMessenger === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => onChange({ preferredMessenger: m.value })}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                  selected
                    ? `${m.borderColor} ${m.color} text-white shadow-lg scale-[1.02]`
                    : "border-border bg-secondary text-foreground hover:border-muted-foreground/60"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="font-semibold text-sm">{m.label}</span>
                {m.badge && (
                  <span className={cn(
                    "absolute -top-2 -right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    selected ? "bg-[#25D366] text-white" : "bg-primary text-primary-foreground"
                  )}>
                    {m.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Agreement */}
      <button
        type="button"
        onClick={() => onChange({ agreed: !state.agreed })}
        className="flex items-start gap-3 text-left w-full"
      >
        <div className={cn("w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5", state.agreed ? "bg-primary border-primary" : "border-muted-foreground/40")}>
          {state.agreed && <Check className="w-3 h-3 text-primary-foreground" />}
        </div>
        <span className="text-xs text-muted-foreground leading-relaxed">
          Я даю согласие на обработку персональных данных и соглашаюсь с условиями договора аренды.
        </span>
      </button>
    </div>
  );
};

export default Step3ClientData;
