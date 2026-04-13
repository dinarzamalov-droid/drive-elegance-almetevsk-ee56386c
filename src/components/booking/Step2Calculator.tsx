import { useState } from "react";
import { format, addDays, nextSaturday, nextSunday, isSaturday } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, User, Clock, Gauge, Shield, UserCheck, Check, Gift, Heart, Tag, Percent, Car, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cars, ageOptions, experienceOptions, extrasConfig, savingsConfig, promoCodes, PREPAY_PERCENT } from "@/lib/bookingData";
import { getBookingCalculations } from "@/lib/bookingCalculations";
import type { BookingState } from "@/lib/bookingData";

interface Step2Props {
  state: BookingState;
  onChange: (partial: Partial<BookingState>) => void;
}

const Step2Calculator = ({ state, onChange }: Step2Props) => {
  const [promoError, setPromoError] = useState("");
  const calc = getBookingCalculations(state);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedCar = cars.find((c) => c.value === state.car);

  const toggleExtra = (id: string) => {
    const next = state.selectedExtras.includes(id)
      ? state.selectedExtras.filter((e) => e !== id)
      : [...state.selectedExtras, id];
    onChange({ selectedExtras: next });
  };

  const toggleSaving = (id: string) => {
    let next = state.selectedSavings.includes(id)
      ? state.selectedSavings.filter((s) => s !== id)
      : [...state.selectedSavings, id];

    // Economy package is mutually exclusive with individual options it includes
    if (id === "economy-pack" && next.includes("economy-pack")) {
      next = next.filter((s) => !["no-wash", "empty-tank", "off-peak"].includes(s));
      next.push("economy-pack");
    } else if (["no-wash", "empty-tank", "off-peak"].includes(id) && next.includes("economy-pack")) {
      next = next.filter((s) => s !== "economy-pack");
    }

    onChange({ selectedSavings: next });
  };

  const applyPromo = () => {
    const code = state.promoCode.trim().toUpperCase();
    if (promoCodes[code]) {
      onChange({ appliedPromo: code });
      setPromoError("");
    } else {
      onChange({ appliedPromo: null });
      setPromoError("Промокод не найден");
    }
  };

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Рассчитайте стоимость</h2>
        <p className="text-muted-foreground text-sm">
          Выбран: <span className="text-foreground font-medium">{selectedCar?.label}</span>
        </p>
      </div>

      {/* Age & Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Ваш возраст
          </label>
          <Select value={state.age} onValueChange={(v) => onChange({ age: v })}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {ageOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Стаж вождения
          </label>
          <Select value={state.experience} onValueChange={(v) => onChange({ experience: v })}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {experienceOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Быстрый выбор дат</label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Завтра", getRange: () => ({ from: addDays(today, 1), to: addDays(today, 2) }) },
            { label: "На выходные", getRange: () => {
              const sat = isSaturday(today) ? today : nextSaturday(today);
              const sun = isSaturday(sat) ? addDays(sat, 1) : nextSunday(today);
              return { from: sat, to: sun };
            }},
            { label: "На неделю", getRange: () => ({ from: addDays(today, 1), to: addDays(today, 8) }) },
            { label: "На 2 недели", getRange: () => ({ from: addDays(today, 1), to: addDays(today, 15) }) },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => { const r = preset.getRange(); onChange({ dateFrom: r.from, dateTo: r.to }); }}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-secondary/50 hover:border-primary hover:text-primary transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Дата заезда</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start bg-secondary border-border", !state.dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {state.dateFrom ? format(state.dateFrom, "dd.MM.yyyy") : "Выберите дату"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={state.dateFrom} onSelect={(d) => { onChange({ dateFrom: d }); if (state.dateTo && d && state.dateTo <= d) onChange({ dateTo: undefined }); }} disabled={(date) => date < today} locale={ru} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Дата выезда</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start bg-secondary border-border", !state.dateTo && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {state.dateTo ? format(state.dateTo, "dd.MM.yyyy") : "Выберите дату"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={state.dateTo} onSelect={(d) => onChange({ dateTo: d })} disabled={(date) => date < (state.dateFrom ?? today)} locale={ru} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* City & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Город подачи</label>
          <Select value={state.city} onValueChange={(v) => onChange({ city: v })}>
            <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Альметьевск">Альметьевск</SelectItem>
              <SelectItem value="Казань">Казань</SelectItem>
              <SelectItem value="Набережные Челны">Набережные Челны</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Время подачи</label>
          <input type="time" value={state.deliveryTime} onChange={(e) => onChange({ deliveryTime: e.target.value })} className={inputClass} />
        </div>
      </div>

      {/* Duration discount */}
      {calc.days >= 3 && calc.durationDiscountPercent > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
          <span className="text-primary font-medium">
            📅 Скидка за срок {Math.round(calc.durationDiscountPercent * 100)}% — {calc.discountedRate.toLocaleString("ru-RU")} ₽/сут вместо {calc.baseRate.toLocaleString("ru-RU")} ₽
          </span>
        </div>
      )}

      {/* Discounts */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Скидки 🔥</label>
        {[
          { id: "birthday", label: "День рождения — скидка 10% на первые сутки", icon: Gift, checked: state.isBirthday, toggle: () => { onChange({ isBirthday: !state.isBirthday, isWedding: false }); } },
          { id: "wedding", label: "День свадьбы — скидка 10% на первые сутки", icon: Heart, checked: state.isWedding, toggle: () => { onChange({ isWedding: !state.isWedding, isBirthday: false }); } },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button" onClick={item.toggle} className={cn("w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all", item.checked ? "border-primary bg-primary/10" : "border-border bg-secondary/50 hover:border-muted-foreground/40")}>
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center shrink-0", item.checked ? "bg-primary border-primary" : "border-muted-foreground/40")}>
                {item.checked && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <Icon className={cn("w-4 h-4 shrink-0", item.checked ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-sm flex-1", item.checked ? "text-foreground font-medium" : "text-muted-foreground")}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Extras */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Дополнительные опции</label>
        {extrasConfig.map((extra) => {
          const Icon = extra.icon;
          const isSelected = state.selectedExtras.includes(extra.id);
          const extraPrice = calc.getExtraPrice(extra.id);
          return (
            <button key={extra.id} type="button" onClick={() => toggleExtra(extra.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all", isSelected ? "border-primary bg-primary/10" : "border-border bg-secondary/50 hover:border-muted-foreground/40")}>
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center shrink-0", isSelected ? "bg-primary border-primary" : "border-muted-foreground/40")}>
                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <Icon className={cn("w-4 h-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-sm flex-1", isSelected ? "text-foreground font-medium" : "text-muted-foreground")}>{extra.label}</span>
              <span className="text-xs text-muted-foreground">+{extraPrice.toLocaleString("ru-RU")} ₽/сут</span>
            </button>
          );
        })}
      </div>

      {/* Savings / Economy options */}
      <div className="space-y-3">
        <label className="text-sm font-medium flex items-center gap-2">
          <PiggyBank className="w-4 h-4 text-primary" /> Экономия 💰
        </label>
        <p className="text-xs text-muted-foreground -mt-1">Снизьте стоимость, отказавшись от необязательных услуг</p>
        {savingsConfig.map((saving) => {
          const isSelected = state.selectedSavings.includes(saving.id);
          const discountLabel = saving.type === "fixed"
            ? `−${saving.discount.toLocaleString("ru-RU")} ₽`
            : `−${saving.discount}%`;
          return (
            <button key={saving.id} type="button" onClick={() => toggleSaving(saving.id)} className={cn("w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all", isSelected ? "border-green-500 bg-green-500/10" : "border-border bg-secondary/50 hover:border-muted-foreground/40")}>
              <div className={cn("w-5 h-5 rounded border flex items-center justify-center shrink-0", isSelected ? "bg-green-500 border-green-500" : "border-muted-foreground/40")}>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={cn("text-sm flex-1", isSelected ? "text-foreground font-medium" : "text-muted-foreground")}>{saving.label}</span>
              <span className={cn("text-xs font-medium", isSelected ? "text-green-500" : "text-muted-foreground")}>{discountLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Promo */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Промокод</label>
        {state.appliedPromo ? (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-primary bg-primary/10">
            <Percent className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium flex-1">{promoCodes[state.appliedPromo].label}</span>
            <button type="button" onClick={() => onChange({ appliedPromo: null, promoCode: "" })} className="text-xs text-muted-foreground hover:text-foreground">Удалить</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input type="text" placeholder="Введите промокод" value={state.promoCode} onChange={(e) => { onChange({ promoCode: e.target.value }); setPromoError(""); }} className={inputClass} />
            <button type="button" onClick={applyPromo} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shrink-0">Применить</button>
          </div>
        )}
        {promoError && <p className="text-xs text-destructive">{promoError}</p>}
      </div>

      {/* Summary */}
      {calc.days > 0 && selectedCar && (
        <div className="bg-secondary/50 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Car className="h-4 w-4 text-primary" /> Ваше предложение
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Автомобиль</span><span className="font-medium">{selectedCar.label}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Базовая ставка</span><span>{calc.baseRate.toLocaleString("ru-RU")} ₽/сут</span></div>
            {calc.durationDiscountPercent > 0 && (
              <div className="flex justify-between"><span className="text-muted-foreground">📅 Скидка ({Math.round(calc.durationDiscountPercent * 100)}%)</span><span className="text-primary font-medium">{calc.discountedRate.toLocaleString("ru-RU")} ₽/сут</span></div>
            )}
            {(calc.ageMultiplier > 1 || calc.expMultiplier > 1) && (
              <div className="flex justify-between"><span className="text-muted-foreground text-xs">Коэффициент</span><span className="text-xs">×{(calc.ageMultiplier * calc.expMultiplier).toFixed(2)}</span></div>
            )}
            <div className="flex justify-between"><span className="text-muted-foreground">Аренда ({calc.days} сут.)</span><span>{calc.baseCost.toLocaleString("ru-RU")} ₽</span></div>
            {calc.extrasCost > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Доп. опции</span><span>{calc.extrasCost.toLocaleString("ru-RU")} ₽</span></div>}
            {calc.firstDayDiscount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">🔥 Скидка</span><span className="text-primary font-medium">−{calc.firstDayDiscount.toLocaleString("ru-RU")} ₽</span></div>}
            {calc.promoDiscountAmount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">🏷 Промокод</span><span className="text-primary font-medium">−{calc.promoDiscountAmount.toLocaleString("ru-RU")} ₽</span></div>}
            <div className="border-t border-border pt-2 flex justify-between font-semibold">
              <span>Итого</span><span className="text-gradient-gold text-lg">{calc.totalCost.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
          <div className="border-t border-border pt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Предоплата ({PREPAY_PERCENT}%)</span><span className="text-primary font-semibold">{calc.prepay.toLocaleString("ru-RU")} ₽</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Остаток при получении</span><span>{calc.remaining.toLocaleString("ru-RU")} ₽</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Залог (возвратный)</span><span>{calc.deposit.toLocaleString("ru-RU")} ₽</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2Calculator;
