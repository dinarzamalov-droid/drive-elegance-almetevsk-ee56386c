import { FileText } from "lucide-react";
import { cars, ageOptions, experienceOptions, PREPAY_PERCENT } from "@/lib/bookingData";
import { getBookingCalculations } from "@/lib/bookingCalculations";
import { generateContract } from "@/lib/generateContract";
import { buildContractData } from "@/lib/contractHelper";
import { format } from "date-fns";
import type { BookingState } from "@/lib/bookingData";

interface Step4Props {
  state: BookingState;
}

const Step4Contract = ({ state }: Step4Props) => {
  const calc = getBookingCalculations(state);
  const selectedCar = cars.find((c) => c.value === state.car);
  const fullName = `${state.lastName} ${state.firstName} ${state.middleName}`.trim();

  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

  const handleDownload = () => {
    const contractData = buildContractData(state);
    if (!contractData) return;
    generateContract(contractData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Проект договора</h2>
        <p className="text-muted-foreground text-sm">Проверьте данные перед подтверждением</p>
      </div>

      <div className="bg-secondary/50 rounded-xl p-5 space-y-4 text-sm font-mono">
        <div className="text-center font-bold text-base font-sans">
          ДОГОВОР АРЕНДЫ ТРАНСПОРТНОГО СРЕДСТВА
        </div>
        <p className="text-center text-muted-foreground text-xs">от {todayStr}</p>

        <div className="space-y-2">
          <p><span className="text-muted-foreground">Арендатор:</span> {fullName}</p>
          <p><span className="text-muted-foreground">Телефон:</span> {state.phone}</p>
          <p><span className="text-muted-foreground">Email:</span> {state.email}</p>
          <p><span className="text-muted-foreground">Паспорт:</span> {state.passportSeries} {state.passportNumber}</p>
          <p><span className="text-muted-foreground">ВУ:</span> {state.licenseNumber}</p>
        </div>

        <hr className="border-border" />

        <div className="space-y-2">
          <p><span className="text-muted-foreground">Автомобиль:</span> <span className="font-semibold">{selectedCar?.label}</span></p>
          <p><span className="text-muted-foreground">Период:</span> {state.dateFrom ? format(state.dateFrom, "dd.MM.yyyy") : "—"} — {state.dateTo ? format(state.dateTo, "dd.MM.yyyy") : "—"} ({calc.days} сут.)</p>
          <p><span className="text-muted-foreground">Город подачи:</span> {state.city}, {state.deliveryTime}</p>
        </div>

        <hr className="border-border" />

        <div className="space-y-2">
          <p><span className="text-muted-foreground">Суточная ставка:</span> {calc.adjustedRate.toLocaleString("ru-RU")} ₽</p>
          {calc.extrasList.length > 0 && (
            <p><span className="text-muted-foreground">Опции:</span> {calc.extrasList.join(", ")} ({calc.extrasCost.toLocaleString("ru-RU")} ₽)</p>
          )}
          <p className="font-bold"><span className="text-muted-foreground">Итого:</span> {calc.totalCost.toLocaleString("ru-RU")} ₽</p>
          <p><span className="text-muted-foreground">Предоплата ({PREPAY_PERCENT}%):</span> {calc.prepay.toLocaleString("ru-RU")} ₽</p>
          <p><span className="text-muted-foreground">Остаток:</span> {calc.remaining.toLocaleString("ru-RU")} ₽</p>
          <p><span className="text-muted-foreground">Залог:</span> {calc.deposit.toLocaleString("ru-RU")} ₽</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDownload}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-primary text-primary hover:bg-primary/10 transition-colors"
      >
        <FileText className="w-4 h-4" />
        Скачать PDF договора
      </button>
    </div>
  );
};

export default Step4Contract;
