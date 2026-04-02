import { cn } from "@/lib/utils";
import { getBookingCalculations } from "@/lib/bookingCalculations";
import type { BookingState } from "@/lib/bookingData";

interface Step5Props {
  state: BookingState;
  onChange: (partial: Partial<BookingState>) => void;
}

const paymentMethods = [
  { value: "cash" as const, label: "💵 Наличные", desc: "Оплата при получении" },
  { value: "transfer" as const, label: "💳 Перевод на карту", desc: "По реквизитам менеджера" },
  { value: "online" as const, label: "🌐 Онлайн-оплата", desc: "Картой прямо сейчас" },
];

const Step5Payment = ({ state, onChange }: Step5Props) => {
  const calc = getBookingCalculations(state);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Способ оплаты</h2>
        <p className="text-muted-foreground text-sm">
          Предоплата: <span className="text-primary font-semibold">{calc.prepay.toLocaleString("ru-RU")} ₽</span>
        </p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.value}
            type="button"
            onClick={() => onChange({ paymentMethod: method.value })}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
              state.paymentMethod === method.value
                ? "border-primary bg-primary/10 gold-glow"
                : "border-border bg-secondary/50 hover:border-muted-foreground/40"
            )}
          >
            <span className="text-2xl">{method.label.split(" ")[0]}</span>
            <div className="flex-1">
              <p className={cn("font-medium text-sm", state.paymentMethod === method.value ? "text-foreground" : "text-muted-foreground")}>
                {method.label.split(" ").slice(1).join(" ")}
              </p>
              <p className="text-xs text-muted-foreground">{method.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {state.paymentMethod === "online" && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm text-center">
          <p className="text-primary font-medium">Онлайн-оплата будет подключена в ближайшее время</p>
          <p className="text-muted-foreground text-xs mt-1">Пока вы можете выбрать другой способ или оформить бронь — менеджер свяжется с вами</p>
        </div>
      )}
    </div>
  );
};

export default Step5Payment;
