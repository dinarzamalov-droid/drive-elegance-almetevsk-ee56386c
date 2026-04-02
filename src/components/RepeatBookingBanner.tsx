import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, X } from "lucide-react";
import { cars } from "@/lib/bookingData";

const RepeatBookingBanner = () => {
  const navigate = useNavigate();
  const [lastCar, setLastCar] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("3ddrive_booking");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed.car) setLastCar(parsed.car);
    } catch {}
  }, []);

  if (!lastCar || dismissed) return null;

  const car = cars.find((c) => c.value === lastCar);
  if (!car) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <RotateCcw className="w-5 h-5 text-primary shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            Повторить аренду {car.label}?
          </p>
          <p className="text-xs text-muted-foreground">Ваш последний выбор сохранён</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => navigate(`/booking?car=${lastCar}`)}
          className="px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Повторить
        </button>
        <button onClick={() => setDismissed(true)} className="p-1 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RepeatBookingBanner;
