import { useState } from "react";
import { CheckCircle, Eye, MessageCircle, Send, CalendarPlus, Download, Phone } from "lucide-react";
import { toast } from "sonner";
import { openMessenger } from "@/lib/messengerUtils";
import { format } from "date-fns";
import { cars, ageOptions, experienceOptions, extrasConfig, PREPAY_PERCENT } from "@/lib/bookingData";
import { getBookingCalculations } from "@/lib/bookingCalculations";
import { generateContract } from "@/lib/generateContract";
import { buildContractData } from "@/lib/contractHelper";
import { downloadIcsFile } from "@/lib/generateIcs";
import ContractPreviewDialog from "@/components/ContractPreviewDialog";
import type { BookingState } from "@/lib/bookingData";

interface Step6Props {
  state: BookingState;
}

const Step6Confirmation = ({ state }: Step6Props) => {
  const calc = getBookingCalculations(state);
  const selectedCar = cars.find((c) => c.value === state.car);
  const fullName = `${state.lastName} ${state.firstName} ${state.middleName}`.trim();

  const [contractPreview, setContractPreview] = useState<{ blobUrl: string; fileName: string; download: () => void } | null>(null);

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

  const sendVia = (m: "whatsapp" | "telegram" | "max") => {
    openMessenger(m, buildMessageText());
  };

  const handleViewContract = () => {
    const contractData = buildContractData(state);
    if (!contractData) {
      toast.error("Не удалось сформировать договор. Проверьте данные.");
      return;
    }
    try {
      const result = generateContract(contractData, { autoDownload: false });
      setContractPreview({ blobUrl: result.blobUrl, fileName: result.fileName, download: result.download });
    } catch (err) {
      console.error("Contract generation error:", err);
      toast.error("Не удалось сгенерировать PDF. Попробуйте ещё раз.");
    }
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
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => sendVia("whatsapp")} className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm bg-[#25D366] text-white hover:opacity-90 transition-opacity">
            <Phone className="w-4 h-4" /> WhatsApp
          </button>
          <button onClick={() => sendVia("telegram")} className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm bg-[#26A5E4] text-white hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4" /> Telegram
          </button>
          <button onClick={() => sendVia("max")} className="flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-[#1a1a1a] to-[#333] text-white border border-primary/30 hover:opacity-90 transition-opacity">
            <MessageCircle className="w-4 h-4" /> МАХ
          </button>
        </div>
        <button onClick={handleViewContract} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-primary text-primary hover:bg-primary/10 transition-colors">
          <Eye className="w-4 h-4" /> Просмотреть договор (PDF)
        </button>
        {state.dateFrom && state.dateTo && (
          <>
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
              <CalendarPlus className="w-4 h-4" /> Google Календарь
            </button>
            <button
              onClick={() => {
                downloadIcsFile({
                  title: `Аренда ${selectedCar?.label} — 3D Drive`,
                  description: `Автомобиль: ${selectedCar?.label}\nТелефон: ${state.phone}\nПредоплата: ${calc.prepay.toLocaleString("ru-RU")} ₽`,
                  dateFrom: state.dateFrom!,
                  dateTo: state.dateTo!,
                  location: state.city,
                });
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 transition-colors"
            >
              <Download className="w-4 h-4" /> Скачать .ics (Apple/Outlook)
            </button>
          </>
        )}
      </div>

      <ContractPreviewDialog
        open={!!contractPreview}
        onClose={() => setContractPreview(null)}
        blobUrl={contractPreview?.blobUrl ?? null}
        fileName={contractPreview?.fileName ?? ""}
        onDownload={() => contractPreview?.download()}
        showAgreeButton={false}
      />
    </div>
  );
};

export default Step6Confirmation;
