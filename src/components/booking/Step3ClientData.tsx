import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingState } from "@/lib/bookingData";

interface Step3Props {
  state: BookingState;
  onChange: (partial: Partial<BookingState>) => void;
}

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

      {/* Passport */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Серия паспорта *</label>
          <input type="text" placeholder="1234" maxLength={4} value={state.passportSeries} onChange={(e) => onChange({ passportSeries: e.target.value.replace(/\D/g, "").slice(0, 4) })} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Номер паспорта *</label>
          <input type="text" placeholder="567890" maxLength={6} value={state.passportNumber} onChange={(e) => onChange({ passportNumber: e.target.value.replace(/\D/g, "").slice(0, 6) })} className={inputClass} />
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
          <input type="tel" placeholder="+7 (___) ___-__-__" value={state.phone} onChange={(e) => onChange({ phone: e.target.value })} className={inputClass} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email *</label>
          <input type="email" placeholder="email@example.com" value={state.email} onChange={(e) => onChange({ email: e.target.value })} className={inputClass} />
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
