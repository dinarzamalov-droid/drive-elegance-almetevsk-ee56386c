import { CheckCircle, FileText, MessageCircle, Send, CalendarPlus, Download } from "lucide-react";
import { format } from "date-fns";
import { cars, ageOptions, experienceOptions, extrasConfig, PREPAY_PERCENT } from "@/lib/bookingData";
import { getBookingCalculations } from "@/lib/bookingCalculations";
import { generateContract } from "@/lib/generateContract";
import { downloadIcsFile } from "@/lib/generateIcs";
import type { BookingState } from "@/lib/bookingData";

interface Step6Props {
  state: BookingState;
}

const Step6Confirmation = ({ state }: Step6Props) => {
  const calc = getBookingCalculations(state);
  const selectedCar = cars.find((c) => c.value === state.car);
  const fullName = `${state.lastName} ${state.firstName} ${state.middleName}`.trim();

  const buildMessageText = () => {
    const from = state.dateFrom ? format(state.dateFrom, "dd.MM.yyyy") : "";
    const to = state.dateTo ? format(state.dateTo, "dd.MM.yyyy") : "";
    const ageLabel = ageOptions.find((a) => a.value === state.age)?.label ?? state.age;
    const expLabel = experienceOptions.find((e) => e.value === state.experience)?.label ?? state.experience;
    const extrasText = state.selectedExtras.length
      ? `\nОпции: ${state.selectedExtras.map((id) => extrasConfig.find((e) => e.id === id)?.label).join(", ")}`
      : "";
    const paymentLabel = state.paymentMethod === "cash" ? "Наличные" : state.paymentMethod === "transfer" ? "Перевод" : "Онлайн";

    return `Бронирование с сайта 3D Drive\nФИО: ${fullName}\nТелефон: ${state.phone}\nEmail: ${state.email}\nАвтомобиль: ${selectedCar?.label}\nВозраст: ${ageLabel}\nСтаж: ${expLabel}\nДаты: ${from} — ${to} (${calc.days} сут.)\nГород: ${state.city}, ${state.deliveryTime}${extrasText}\n\nИтого: ${calc.totalCost.toLocaleString("ru-RU")} ₽\nПредоплата: ${calc.prepay.toLocaleString("ru-RU")} ₽\nОстаток: ${calc.remaining.toLocaleString("ru-RU")} ₽\nЗалог: ${calc.deposit.toLocaleString("ru-RU")} ₽\nСпособ оплаты: ${paymentLabel}`;
  };

  const sendWhatsApp = () => {
    const text = encodeURIComponent(buildMessageText());
    window.open(`https://wa.me/79868262332?text=${text}`, "_blank");
  };

  const sendTelegram = () => {
    const text = encodeURIComponent(buildMessageText());
    window.open(`https://t.me/share/url?url=${encodeURIComponent("3D Drive")}&text=${text}`, "_blank");
  };

  const handleDownload = () => {
    if (!selectedCar || !state.dateFrom || !state.dateTo) return;
    generateContract({
      name: fullName,
      phone: state.phone,
      carLabel: selectedCar.label,
      dateFrom: format(state.dateFrom, "dd.MM.yyyy"),
      dateTo: format(state.dateTo, "dd.MM.yyyy"),
      days: calc.days,
      dailyRate: calc.adjustedRate,
      extrasList: calc.extrasList,
      extrasCost: calc.extrasCost,
      totalCost: calc.totalCost,
      prepay: calc.prepay,
      remaining: calc.remaining,
      deposit: calc.deposit,
      ageLabel: ageOptions.find((a) => a.value === state.age)?.label ?? state.age,
      experienceLabel: experienceOptions.find((e) => e.value === state.experience)?.label ?? state.experience,
    });
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Бронирование оформлено!</h2>
        <p className="text-muted-foreground text-sm">
          Автомобиль <span className="text-foreground font-medium">{selectedCar?.label}</span> забронирован на {calc.days} суток
        </p>
      </div>

      <div className="bg-secondary/50 rounded-xl p-5 space-y-2 text-sm text-left">
        <div className="flex justify-between"><span className="text-muted-foreground">Итого</span><span className="font-bold text-gradient-gold">{calc.totalCost.toLocaleString("ru-RU")} ₽</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Предоплата</span><span className="text-primary font-semibold">{calc.prepay.toLocaleString("ru-RU")} ₽</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Залог</span><span>{calc.deposit.toLocaleString("ru-RU")} ₽</span></div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Отправить бронь менеджеру:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={sendWhatsApp} className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity">
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </button>
          <button onClick={sendTelegram} className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm bg-[hsl(200,80%,50%)] text-primary-foreground hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4" /> Telegram
          </button>
        </div>
        <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-primary text-primary hover:bg-primary/10 transition-colors">
          <FileText className="w-4 h-4" /> Скачать договор PDF
        </button>
        {state.dateFrom && state.dateTo && (
          <button
            onClick={() => {
              const from = format(state.dateFrom!, "yyyyMMdd");
              const to = format(state.dateTo!, "yyyyMMdd");
              const title = encodeURIComponent(`Аренда ${selectedCar?.label} — 3D Drive`);
              const details = encodeURIComponent(`Автомобиль: ${selectedCar?.label}\nТелефон: ${state.phone}\nПредоплата: ${calc.prepay.toLocaleString("ru-RU")} ₽`);
              window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${from}/${to}&details=${details}`, "_blank");
            }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 transition-colors"
          >
            <CalendarPlus className="w-4 h-4" /> Добавить в календарь
          </button>
        )}
      </div>
    </div>
  );
};

export default Step6Confirmation;
