import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Car, Shield, Gauge, UserCheck, Check, User, Clock, FileText, Gift, Heart, Tag, Percent, MessageCircle, Send, Phone, PiggyBank } from "lucide-react";
import { generateContract } from "@/lib/generateContract";
import { openMessenger } from "@/lib/messengerUtils";
import { formatPhone } from "@/lib/formatUtils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ContractPreviewDialog from "./ContractPreviewDialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnimatedSection from "./AnimatedSection";

type CarCategory = "premium" | "tech";

const durationDiscounts: Record<CarCategory, { minDays: number; discount: number }[]> = {
  premium: [
    { minDays: 30, discount: 0.40 },
    { minDays: 14, discount: 0.30 },
    { minDays: 7, discount: 0.20 },
    { minDays: 5, discount: 0.15 },
    { minDays: 3, discount: 0.10 },
  ],
  tech: [
    { minDays: 30, discount: 0.30 },
    { minDays: 14, discount: 0.25 },
    { minDays: 7, discount: 0.20 },
    { minDays: 5, discount: 0.15 },
    { minDays: 3, discount: 0.10 },
  ],
};

function getDurationDiscount(category: CarCategory, days: number): number {
  const tiers = durationDiscounts[category];
  for (const tier of tiers) {
    if (days >= tier.minDays) return tier.discount;
  }
  return 0;
}

const promoCodes: Record<string, { label: string; percent: number }> = {
  DRIVE10: { label: "DRIVE10 — 10% на всю аренду", percent: 10 },
  WELCOME5: { label: "WELCOME5 — 5% на всю аренду", percent: 5 },
  FRIEND15: { label: "FRIEND15 — 15% на всю аренду", percent: 15 },
};

const cars = [
  { value: "bmw-420i", label: "BMW 420i", price: 14000, deposit: 30000, category: "premium" as CarCategory, extras: { mileage: 2000, delivery: 2500 } },
  { value: "porsche-macan", label: "Porsche Macan", price: 12000, deposit: 25000, category: "premium" as CarCategory, extras: { mileage: 2500, delivery: 2500 } },
  { value: "mercedes-glb", label: "Mercedes GLB", price: 11000, deposit: 25000, category: "premium" as CarCategory, extras: { mileage: 1500, delivery: 2500 } },
  { value: "lixiang-l6", label: "LiXiang L6", price: 23000, deposit: 35000, category: "tech" as CarCategory, extras: { mileage: 3000, delivery: 2500 } },
];

const savingsConfig = [
  { id: "no-wash", label: "Подача без мойки", hint: "Автомобиль подаётся чистым, но без полировки. При возврате состояние оценивается менеджером — всё честно и прозрачно 🙌", discount: 500, type: "fixed" as const },
  { id: "empty-tank", label: "Возврат с пустым баком", hint: "Не нужно искать заправку перед возвратом — остаток топлива рассчитывается по рыночной цене и просто удерживается из залога ⛽", discount: 1500, type: "fixed" as const },
  { id: "economy-pack", label: "Пакет «Эконом» (без мойки + пустой бак)", hint: "Максимальная экономия — объединяет обе опции со скидкой", discount: 10, type: "percent" as const },
];

const extrasConfig = [
  { id: "mileage", label: "Безлимитный пробег", icon: Gauge },
  { id: "delivery", label: "Доставка автомобиля (1 час водителя)", icon: UserCheck },
] as const;

const ageOptions = [
  { value: "21+", label: "21 год и старше", multiplier: 1.0, depositExtra: 0 },
  { value: "19-20", label: "19–20 лет", multiplier: 1.15, depositExtra: 5000 },
];

const experienceOptions = [
  { value: "3+", label: "3 года и более", multiplier: 1.0, depositExtra: 0 },
  { value: "1-3", label: "от 1 до 3 лет", multiplier: 1.1, depositExtra: 0 },
  { value: "0-1", label: "менее 1 года", multiplier: 1.25, depositExtra: 10000 },
];

const PREPAY_PERCENT = 20;

const BookingSection = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState(cars[0].value);
  const [age, setAge] = useState("21+");
  const [experience, setExperience] = useState("3+");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [contractViewed, setContractViewed] = useState(false);
  const [contractPreview, setContractPreview] = useState<{ blobUrl: string; fileName: string; download: () => void } | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isBirthday, setIsBirthday] = useState(false);
  const [isWedding, setIsWedding] = useState(false);
  const [selectedSavings, setSelectedSavings] = useState<string[]>([]);
  const selectedCar = cars.find((c) => c.value === car);
  const ageMultiplier = ageOptions.find((a) => a.value === age)?.multiplier ?? 1;
  const expMultiplier = experienceOptions.find((e) => e.value === experience)?.multiplier ?? 1;

  const days =
    dateFrom && dateTo
      ? Math.max(1, Math.ceil((dateTo.getTime() - dateFrom.getTime()) / 86400000))
      : 0;

  const baseRate = selectedCar?.price ?? 0;
  const durationDiscountPercent = selectedCar ? getDurationDiscount(selectedCar.category, days) : 0;
  const discountedRate = Math.round(baseRate * (1 - durationDiscountPercent));
  const adjustedRate = Math.round(discountedRate * ageMultiplier * expMultiplier);

  const getExtraPrice = (id: string) => {
    if (!selectedCar) return 0;
    return (selectedCar.extras as Record<string, number>)[id] ?? 0;
  };

  const extrasPerDay = selectedExtras.reduce((sum, id) => sum + getExtraPrice(id), 0);

  const hasDiscount = isBirthday || isWedding;
  const firstDayDiscount = hasDiscount ? Math.round((adjustedRate + extrasPerDay) * 0.1) : 0;

  const promoDiscount = appliedPromo && promoCodes[appliedPromo]
    ? promoCodes[appliedPromo].percent
    : 0;

  // Early booking discount
  const daysUntilStart = dateFrom
    ? Math.floor((dateFrom.getTime() - Date.now()) / 86400000)
    : 0;
  const earlyBookingPercent = daysUntilStart >= 14 ? 5 : daysUntilStart >= 7 ? 3 : 0;

  // Savings calculation
  const savingsFixed = selectedSavings.reduce((sum, id) => {
    const s = savingsConfig.find((c) => c.id === id);
    return s && s.type === "fixed" ? sum + s.discount : sum;
  }, 0);
  const savingsPercent = selectedSavings.reduce((sum, id) => {
    const s = savingsConfig.find((c) => c.id === id);
    return s && s.type === "percent" ? sum + s.discount : sum;
  }, 0);

  const baseCost = adjustedRate * days;
  const extrasCost = extrasPerDay * days;
  const subtotal = baseCost + extrasCost - firstDayDiscount;
  const promoDiscountAmount = Math.round(subtotal * promoDiscount / 100);
  const afterPromo = subtotal - promoDiscountAmount;
  const earlyBookingAmount = Math.round(afterPromo * earlyBookingPercent / 100);
  const savingsPercentAmount = Math.round((afterPromo - earlyBookingAmount) * savingsPercent / 100);
  const totalSavings = savingsFixed + savingsPercentAmount;
  const totalCost = Math.max(0, afterPromo - earlyBookingAmount - totalSavings);
  const prepay = Math.round((totalCost * PREPAY_PERCENT) / 100);
  const remaining = totalCost - prepay;
  const ageDepositExtra = ageOptions.find((a) => a.value === age)?.depositExtra ?? 0;
  const expDepositExtra = experienceOptions.find((e) => e.value === experience)?.depositExtra ?? 0;
  const deposit = (selectedCar?.deposit ?? 0) + ageDepositExtra + expDepositExtra;

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (promoCodes[code]) {
      setAppliedPromo(code);
      setPromoError("");
    } else {
      setAppliedPromo(null);
      setPromoError("Промокод не найден");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const toggleSaving = (id: string) => {
    setSelectedSavings((prev) => {
      let next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      if (id === "economy-pack" && next.includes("economy-pack")) {
        next = next.filter((s) => !["no-wash", "empty-tank"].includes(s));
        next.push("economy-pack");
      } else if (["no-wash", "empty-tank"].includes(id) && next.includes("economy-pack")) {
        next = next.filter((s) => s !== "economy-pack");
      }
      return next;
    });
  };

  const buildMessageText = () => {
    const fullName = `${lastName.trim()} ${firstName.trim()} ${middleName.trim()}`;
    const carLabel = selectedCar?.label ?? car;
    const from = dateFrom ? format(dateFrom, "dd.MM.yyyy") : "";
    const to = dateTo ? format(dateTo, "dd.MM.yyyy") : "";
    const ageLabel = ageOptions.find((a) => a.value === age)?.label ?? age;
    const expLabel = experienceOptions.find((e) => e.value === experience)?.label ?? experience;
    const extrasText = selectedExtras.length
      ? `\nОпции: ${selectedExtras.map((id) => extrasConfig.find((e) => e.id === id)?.label).join(", ")}`
      : "";
    const durationText = durationDiscountPercent > 0
      ? `\n📅 Скидка за срок (${Math.round(durationDiscountPercent * 100)}%): ставка ${discountedRate.toLocaleString("ru-RU")} ₽/сут`
      : "";
    const discountText = firstDayDiscount > 0
      ? `\n🔥 Скидка (${isBirthday ? "день рождения" : "день свадьбы"}): −${firstDayDiscount.toLocaleString("ru-RU")} ₽`
      : "";
    const promoText = promoDiscountAmount > 0
      ? `\n🏷 Промокод ${appliedPromo}: −${promoDiscountAmount.toLocaleString("ru-RU")} ₽`
      : "";

    return `Бронирование с сайта 3D Drive\nФИО: ${fullName}\nТелефон: ${phone}\nАвтомобиль: ${carLabel}\nВозраст: ${ageLabel}\nСтаж: ${expLabel}\nДаты: ${from} — ${to} (${days} сут.)${extrasText}${durationText}${discountText}${promoText}\n\nСуточная ставка: ${adjustedRate.toLocaleString("ru-RU")} ₽\nИтого: ${totalCost.toLocaleString("ru-RU")} ₽\nПредоплата (${PREPAY_PERCENT}%): ${prepay.toLocaleString("ru-RU")} ₽\nОстаток при получении: ${remaining.toLocaleString("ru-RU")} ₽\nЗалог: ${deposit.toLocaleString("ru-RU")} ₽`;
  };

  const isFormValid = lastName.trim() && firstName.trim() && middleName.trim() && phone.trim() && car && dateFrom && dateTo && agreed;

  const sendVia = (m: "whatsapp" | "telegram" | "max") => {
    if (!isFormValid) return;
    openMessenger(m, buildMessageText());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendVia("whatsapp");
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  const showSummary = selectedCar && days > 0;

  return (
    <section id="booking" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            Калькулятор аренды
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Рассчитайте <span className="text-gradient-gold">стоимость аренды</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Выберите автомобиль, укажите свои параметры — получите персональное предложение
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-card-gradient gold-border rounded-2xl p-6 sm:p-8 space-y-6"
          >
            {/* Car toggle buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Автомобиль</label>
              <div className="flex flex-wrap gap-2">
                {cars.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCar(c.value)}
                    className={cn(
                      "flex-1 min-w-[120px] px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border",
                      car === c.value
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                        : "bg-secondary border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Ваш возраст
                </label>
                <Select value={age} onValueChange={setAge}>
                  <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ageOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Стаж вождения
                </label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Дата заезда</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-secondary border-border",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd.MM.yyyy") : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(d) => {
                        setDateFrom(d);
                        if (dateTo && d && dateTo <= d) setDateTo(undefined);
                      }}
                      disabled={(date) => date < today}
                      locale={ru}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Дата выезда</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-secondary border-border",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd.MM.yyyy") : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      disabled={(date) => date < (dateFrom ?? today)}
                      locale={ru}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Duration discount info */}
            {days >= 3 && selectedCar && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
                <span className="text-primary font-medium">
                  📅 Скидка за срок аренды {Math.round(durationDiscountPercent * 100)}% — ставка {discountedRate.toLocaleString("ru-RU")} ₽/сут вместо {baseRate.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            )}




            {/* Discounts */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Скидки 🔥</label>
              {[
                { id: "birthday", label: "День рождения — скидка 10% на первые сутки", icon: Gift, checked: isBirthday, toggle: () => { setIsBirthday(!isBirthday); if (!isBirthday) setIsWedding(false); } },
                { id: "wedding", label: "День свадьбы — скидка 10% на первые сутки", icon: Heart, checked: isWedding, toggle: () => { setIsWedding(!isWedding); if (!isWedding) setIsBirthday(false); } },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={item.toggle}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200",
                      item.checked
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/50 hover:border-muted-foreground/40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                        item.checked ? "bg-primary border-primary" : "border-muted-foreground/40"
                      )}
                    >
                      {item.checked && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <Icon className={cn("w-4 h-4 shrink-0", item.checked ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-sm flex-1", item.checked ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Extras */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Дополнительные опции</label>
              {extrasConfig.map((extra) => {
                const Icon = extra.icon;
                const isSelected = selectedExtras.includes(extra.id);
                const extraPrice = getExtraPrice(extra.id);
                return (
                  <button
                    key={extra.id}
                    type="button"
                    onClick={() => toggleExtra(extra.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/50 hover:border-muted-foreground/40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/40"
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <Icon className={cn("w-4 h-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-sm flex-1", isSelected ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {extra.label}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {extra.id === "delivery" ? `+${extraPrice.toLocaleString("ru-RU")} ₽/час` : `+${extraPrice.toLocaleString("ru-RU")} ₽/сут`}
                    </span>
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

              {/* Early booking info */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm space-y-1">
                <span className="text-green-600 dark:text-green-400 font-medium block">🕐 Скидка за раннее бронирование</span>
                <span className="text-muted-foreground text-xs block">Бронируйте заранее — скидка применяется автоматически:</span>
                <div className="flex gap-4 mt-1">
                  <span className={`text-xs font-medium ${earlyBookingPercent === 3 ? "text-green-500" : "text-muted-foreground"}`}>• 7+ дней → 3%</span>
                  <span className={`text-xs font-medium ${earlyBookingPercent === 5 ? "text-green-500" : "text-muted-foreground"}`}>• 14+ дней → 5%</span>
                </div>
                {earlyBookingPercent > 0 && (
                  <span className="text-green-600 dark:text-green-400 text-xs font-semibold block mt-1">
                    ✅ Применена скидка {earlyBookingPercent}% (−{earlyBookingAmount.toLocaleString("ru-RU")} ₽)
                  </span>
                )}
              </div>
              {savingsConfig.map((saving) => {
                const isSelected = selectedSavings.includes(saving.id);
                const discountLabel = saving.type === "fixed"
                  ? `−${saving.discount.toLocaleString("ru-RU")} ₽`
                  : `−${saving.discount}%`;
                return (
                  <button key={saving.id} type="button" onClick={() => toggleSaving(saving.id)} className={cn("w-full flex flex-col gap-1 p-3 rounded-lg border text-left transition-all", isSelected ? "border-green-500 bg-green-500/10" : "border-border bg-secondary/50 hover:border-muted-foreground/40")}>
                    <div className="flex items-center gap-3 w-full">
                      <div className={cn("w-5 h-5 rounded border flex items-center justify-center shrink-0", isSelected ? "bg-green-500 border-green-500" : "border-muted-foreground/40")}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={cn("text-sm flex-1", isSelected ? "text-foreground font-medium" : "text-muted-foreground")}>{saving.label}</span>
                      <span className={cn("text-xs font-medium", isSelected ? "text-green-500" : "text-muted-foreground")}>{discountLabel}</span>
                    </div>
                    {saving.hint && <p className="text-xs text-muted-foreground pl-8 leading-relaxed">{saving.hint}</p>}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                Промокод
              </label>
              {appliedPromo ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-primary bg-primary/10">
                  <Percent className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground font-medium flex-1">
                    {promoCodes[appliedPromo].label}
                  </span>
                  <button
                    type="button"
                    onClick={removePromo}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Введите промокод"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
                  >
                    Применить
                  </button>
                </div>
              )}
              {promoError && (
                <p className="text-xs text-destructive">{promoError}</p>
              )}
            </div>

            {/* Price breakdown */}
            {showSummary && (
              <div className="bg-secondary/50 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Car className="h-4 w-4 text-primary" />
                  Ваше предложение
                </h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Автомобиль</span>
                    <span className="text-foreground font-medium">{selectedCar.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Базовая ставка</span>
                    <span className="text-foreground">{baseRate.toLocaleString("ru-RU")} ₽/сут</span>
                  </div>
                  {durationDiscountPercent > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        📅 Скидка за срок ({Math.round(durationDiscountPercent * 100)}%)
                      </span>
                      <span className="text-primary font-medium">{discountedRate.toLocaleString("ru-RU")} ₽/сут</span>
                    </div>
                  )}
                  {(ageMultiplier > 1 || expMultiplier > 1) && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Коэффициент (возраст/стаж)</span>
                      <span className="text-foreground text-xs">×{(ageMultiplier * expMultiplier).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Аренда ({days} сут.)
                    </span>
                    <span className="text-foreground">{baseCost.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  {extrasCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Доп. опции</span>
                      <span className="text-foreground">{extrasCost.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                  {firstDayDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        🔥 Скидка ({isBirthday ? "день рождения" : "день свадьбы"})
                      </span>
                      <span className="text-primary font-medium">−{firstDayDiscount.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                  {promoDiscountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        🏷 Промокод {appliedPromo} ({promoDiscount}%)
                      </span>
                      <span className="text-primary font-medium">−{promoDiscountAmount.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                  {earlyBookingAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">🕐 Раннее бронирование ({earlyBookingPercent}%)</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">−{earlyBookingAmount.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                  {totalSavings > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">💰 Экономия</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">−{totalSavings.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span className="text-foreground">Итого</span>
                    <span className="text-gradient-gold text-lg">{totalCost.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Предоплата ({PREPAY_PERCENT}%)</span>
                    <span className="text-primary font-semibold">{prepay.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Остаток при получении</span>
                    <span className="text-foreground">{remaining.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Залог (возвратный)</span>
                    <span className="text-foreground">{deposit.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>
              </div>
            )}

            {/* ФИО */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Фамилия *</label>
                <input
                  type="text"
                  required
                  placeholder="Иванов"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Имя *</label>
                <input
                  type="text"
                  required
                  placeholder="Иван"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Отчество *</label>
                <input
                  type="text"
                  required
                  placeholder="Иванович"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Телефон */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Телефон</label>
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formatPhone(phone)}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Agreement */}
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className="flex items-start gap-3 text-left w-full"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                  agreed ? "bg-primary border-primary" : "border-muted-foreground/40"
                )}
              >
                {agreed && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <span className="text-xs text-muted-foreground leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с условиями договора аренды и подтверждаете бронирование.
              </span>
            </button>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Отправить бронирование через:</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={() => sendVia("whatsapp")}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold text-sm bg-[#25D366] text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={() => sendVia("telegram")}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold text-sm bg-[#26A5E4] text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Telegram
                </button>
                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={() => sendVia("max")}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#1a1a1a] to-[#333] text-white border border-primary/30 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-4 h-4" />
                  МАХ
                </button>
              </div>
              <button
                type="button"
                disabled={!car || !dateFrom || !dateTo || !lastName.trim() || !firstName.trim() || !middleName.trim() || !phone.trim()}
                onClick={() => {
                  if (!selectedCar || !dateFrom || !dateTo) {
                    toast.error("Заполните автомобиль и даты аренды");
                    return;
                  }
                  try {
                    generateContract({
                      name: `${lastName.trim()} ${firstName.trim()} ${middleName.trim()}`,
                      phone: formatPhone(phone),
                      carLabel: selectedCar.label,
                      dateFrom: format(dateFrom, "dd.MM.yyyy"),
                      dateTo: format(dateTo, "dd.MM.yyyy"),
                      days,
                      dailyRate: adjustedRate,
                      extrasList: selectedExtras.map((id) => extrasConfig.find((e) => e.id === id)?.label ?? id),
                      extrasCost,
                      totalCost,
                      prepay,
                      remaining,
                      deposit,
                      ageLabel: ageOptions.find((a) => a.value === age)?.label ?? age,
                      experienceLabel: experienceOptions.find((e) => e.value === experience)?.label ?? experience,
                    });
                    toast.success("Договор скачан");
                  } catch (err) {
                    console.error("Contract generation error:", err);
                    toast.error("Не удалось сгенерировать PDF. Попробуйте ещё раз.");
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm border border-primary text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FileText className="w-4 h-4" />
                Скачать договор
              </button>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BookingSection;
