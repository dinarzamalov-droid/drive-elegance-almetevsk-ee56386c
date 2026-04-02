import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const stepLabels = [
  "Автомобиль",
  "Расчёт",
  "Данные",
  "Договор",
  "Оплата",
  "Готово",
];

interface BookingProgressProps {
  currentStep: number;
}

const BookingProgress = ({ currentStep }: BookingProgressProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, i) => {
          const step = i + 1;
          const isCompleted = currentStep > step;
          const isCurrent = currentStep === step;
          return (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {i > 0 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors duration-300",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-300",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : "bg-secondary text-muted-foreground border border-border"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step}
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors duration-300",
                      isCompleted ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-1.5 text-center leading-tight",
                  isCurrent ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingProgress;
