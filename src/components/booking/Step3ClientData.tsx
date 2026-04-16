import { useState } from "react";
import { Check, Send, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingState } from "@/lib/bookingData";

interface Step3Props {
  state: BookingState;
  onChange: (partial: Partial<BookingState>) => void;
  showErrors?: boolean;
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

function formatPassportCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 3) return digits;
  return digits.slice(0, 3) + "-" + digits.slice(3);
}

function formatLicenseNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + " " + digits.slice(2);
  return digits.slice(0, 2) + " " + digits.slice(2, 4) + " " + digits.slice(4);
}

const requiredFields: { key: keyof BookingState; label: string }[] = [
  { key: "lastName", label: "Фамилия" },
  { key: "firstName", label: "Имя" },
  { key: "middleName", label: "Отчество" },
  { key: "birthDate", label: "Дата рождения" },
  { key: "passportSeries", label: "Серия паспорта" },
  { key: "passportNumber", label: "Номер паспорта" },
  { key: "passportIssuedBy", label: "Кем выдан паспорт" },
  { key: "registrationAddress", label: "Адрес регистрации" },
  { key: "licenseNumber", label: "Водительское удостоверение" },
  { key: "phone", label: "Телефон" },
  { key: "email", label: "Email" },
];

export function validateStep3(state: BookingState): string[] {
  const errors: string[] = [];
  for (const f of requiredFields) {
    const val = state[f.key];
    if (!val || (typeof val === "string" && !val.trim())) {
      errors.push(f.label);
    }
  }
  if (state.phone && state.phone.replace(/\D/g, "").length < 11) {
    errors.push("Телефон (неполный)");
  }
  if (state.passportSeries && state.passportSeries.length < 4) {
    errors.push("Серия паспорта (неполная)");
  }
  if (!state.agreed) errors.push("Согласие на обработку данных");
  return errors;
}

const messengerOptions = [
  { value: "telegram" as const, label: "Telegram", icon: Send, color: "bg-[#26A5E4]", borderColor: "border-[#26A5E4]" },
  { value: "whatsapp" as const, label: "WhatsApp", icon: Phone, color: "bg-[#25D366]", borderColor: "border-[#25D366]" },
  { value: "max" as const, label: "МАХ", icon: MessageCircle, color: "bg-gradient-to-r from-[#1a1a1a] to-[#333]", borderColor: "border-primary", badge: "Быстрый ответ" },
];

const Step3ClientData = ({ state, onChange, showErrors = false }: Step3Props) => {
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const markTouched = (field: string) => {
    setTouched((prev) => new Set(prev).add(field));
  };

  const isError = (field: keyof BookingState) => {
    if (!showErrors && !touched.has(field)) return false;
    const val = state[field];
    return !val || (typeof val === "string" && !val.trim());
  };

  const inputBase =
    "w-full bg-secondary border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors";

  const inputClass = (field: keyof BookingState) =>
    cn(inputBase, isError(field) ? "border-destructive focus:border-destructive" : "border-border focus:border-primary");

  const labelClass = (field: keyof BookingState) =>
    cn("text-sm font-medium", isError(field) && "text-destructive");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Ваши данные</h2>
        <p className="text-muted-foreground text-sm">Заполните для формирования договора</p>
      </div>

      {showErrors && validateStep3(state).length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
          Заполните обязательные поля, отмеченные красным
        </div>
      )}

      {/* ФИО */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className={labelClass("lastName")}>Фамилия *</label>
          <input type="text" placeholder="Иванов" value={state.lastName} onBlur={() => markTouched("lastName")} onChange={(e) => onChange({ lastName: e.target.value })} className={inputClass("lastName")} />
        </div>
        <div className="space-y-2">
          <label className={labelClass("firstName")}>Имя *</label>
          <input type="text" placeholder="Иван" value={state.firstName} onBlur={() => markTouched("firstName")} onChange={(e) => onChange({ firstName: e.target.value })} className={inputClass("firstName")} />
        </div>
        <div className="space-y-2">
          <label className={labelClass("middleName")}>Отчество *</label>
          <input type="text" placeholder="Иванович" value={state.middleName} onBlur={() => markTouched("middleName")} onChange={(e) => onChange({ middleName: e.target.value })} className={inputClass("middleName")} />
        </div>
      </div>

      {/* Birth date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelClass("birthDate")}>Дата рождения *</label>
          <input type="date" value={state.birthDate} onBlur={() => markTouched("birthDate")} onChange={(e) => onChange({ birthDate: e.target.value })} className={inputClass("birthDate")} />
        </div>
      </div>

      {/* Passport */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelClass("passportSeries")}>Серия паспорта *</label>
          <input type="text" placeholder="12 34" maxLength={5} value={formatPassportSeries(state.passportSeries)} onBlur={() => markTouched("passportSeries")} onChange={(e) => onChange({ passportSeries: e.target.value.replace(/\D/g, "").slice(0, 4) })} className={inputClass("passportSeries")} />
        </div>
        <div className="space-y-2">
          <label className={labelClass("passportNumber")}>Номер паспорта *</label>
          <input type="text" placeholder="567890" maxLength={6} value={formatPassportNumber(state.passportNumber)} onBlur={() => markTouched("passportNumber")} onChange={(e) => onChange({ passportNumber: e.target.value.replace(/\D/g, "").slice(0, 6) })} className={inputClass("passportNumber")} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Дата выдачи паспорта</label>
          <input type="date" value={state.passportDate} onChange={(e) => onChange({ passportDate: e.target.value })} className={cn(inputBase, "border-border focus:border-primary")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Код подразделения</label>
          <input type="text" placeholder="123-456" maxLength={7} value={formatPassportCode(state.passportCode)} onChange={(e) => onChange({ passportCode: e.target.value.replace(/\D/g, "").slice(0, 6) })} className={cn(inputBase, "border-border focus:border-primary")} />
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass("passportIssuedBy")}>Кем выдан паспорт *</label>
        <input type="text" placeholder="МВД по Республике Татарстан" value={state.passportIssuedBy} onBlur={() => markTouched("passportIssuedBy")} onChange={(e) => onChange({ passportIssuedBy: e.target.value })} className={inputClass("passportIssuedBy")} />
      </div>

      <div className="space-y-2">
        <label className={labelClass("registrationAddress")}>Адрес регистрации *</label>
        <input type="text" placeholder="г. Альметьевск, ул. Примерная, д.1" value={state.registrationAddress} onBlur={() => markTouched("registrationAddress")} onChange={(e) => onChange({ registrationAddress: e.target.value })} className={inputClass("registrationAddress")} />
      </div>

      {/* License */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelClass("licenseNumber")}>Водительское удостоверение *</label>
          <input type="text" placeholder="99 01 792618" maxLength={14} value={formatLicenseNumber(state.licenseNumber)} onBlur={() => markTouched("licenseNumber")} onChange={(e) => onChange({ licenseNumber: e.target.value.replace(/\D/g, "").slice(0, 10) })} className={inputClass("licenseNumber")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Дата выдачи ВУ</label>
          <input type="date" value={state.licenseDate} onChange={(e) => onChange({ licenseDate: e.target.value })} className={cn(inputBase, "border-border focus:border-primary")} />
        </div>
      </div>

      {/* Contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={labelClass("phone")}>Телефон *</label>
          <input type="tel" placeholder="+7 (___) ___-__-__" value={formatPhone(state.phone)} onBlur={() => markTouched("phone")} onChange={(e) => onChange({ phone: e.target.value.replace(/\D/g, "").slice(0, 11) })} className={inputClass("phone")} />
        </div>
        <div className="space-y-2">
          <label className={labelClass("email")}>Email *</label>
          <input type="email" placeholder="email@example.com" value={state.email} onBlur={() => markTouched("email")} onChange={(e) => onChange({ email: e.target.value })} className={inputClass("email")} />
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
        <div className={cn(
          "w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5",
          state.agreed ? "bg-primary border-primary" : showErrors && !state.agreed ? "border-destructive" : "border-muted-foreground/40"
        )}>
          {state.agreed && <Check className="w-3 h-3 text-primary-foreground" />}
        </div>
        <span className={cn("text-xs leading-relaxed", showErrors && !state.agreed ? "text-destructive" : "text-muted-foreground")}>
          Я даю согласие на обработку персональных данных и соглашаюсь с условиями договора аренды.
        </span>
      </button>
    </div>
  );
};

export default Step3ClientData;
