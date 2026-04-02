import { cn } from "@/lib/utils";
import { cars } from "@/lib/bookingData";
import bmwImg from "@/assets/bmw-420i.jpg";
import porsche1 from "@/assets/porsche-1.jpg";
import mercedes1 from "@/assets/mercedes-1.jpg";
import lixiang1 from "@/assets/lixiang-1.jpg";

const carImages: Record<string, string> = {
  "bmw-420i": bmwImg,
  "porsche-macan": porsche1,
  "mercedes-glb": mercedes1,
  "lixiang-l6": lixiang1,
};

interface Step1Props {
  selectedCar: string;
  onSelect: (car: string) => void;
}

const Step1CarSelect = ({ selectedCar, onSelect }: Step1Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Выберите автомобиль</h2>
        <p className="text-muted-foreground text-sm">Нажмите на карточку для выбора</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cars.map((car) => (
          <button
            key={car.value}
            type="button"
            onClick={() => onSelect(car.value)}
            className={cn(
              "rounded-2xl overflow-hidden text-left transition-all duration-300 border-2",
              selectedCar === car.value
                ? "border-primary gold-glow scale-[1.02]"
                : "border-border hover:border-muted-foreground/40"
            )}
          >
            <div className="h-40 overflow-hidden car-plate-overlay">
              <img
                src={carImages[car.value]}
                alt={car.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4 bg-card">
              <h3 className="font-bold text-lg">{car.label}</h3>
              <p className="text-xs text-muted-foreground mb-2">{car.specs}</p>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-xl font-bold text-gradient-gold">
                    {car.price.toLocaleString("ru-RU")}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">₽/сут</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Залог: {car.deposit.toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Step1CarSelect;
