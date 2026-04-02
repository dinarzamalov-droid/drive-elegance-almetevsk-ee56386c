import { useState } from "react";
import { Fuel, MapPin, Calculator } from "lucide-react";
import { cars } from "@/lib/bookingData";

const carFuelData: Record<string, { consumption: number; fuelType: string }> = {
  "bmw-420i": { consumption: 8, fuelType: "АИ-95" },
  "porsche-macan": { consumption: 10, fuelType: "АИ-98" },
  "mercedes-glb": { consumption: 7, fuelType: "АИ-95" },
  "lixiang-l6": { consumption: 6, fuelType: "Гибрид" },
};

const FUEL_PRICE = 56; // средняя цена АИ-95

const FuelCalculator = () => {
  const [selectedCar, setSelectedCar] = useState(cars[0].value);
  const [distance, setDistance] = useState<number>(0);

  const fuel = carFuelData[selectedCar];
  const liters = fuel ? ((distance / 100) * fuel.consumption) : 0;
  const cost = Math.round(liters * FUEL_PRICE);

  return (
    <div className="bg-card-gradient gold-border rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Fuel className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Калькулятор топлива</h3>
          <p className="text-sm text-muted-foreground">Рассчитайте расход на поездку</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Автомобиль</label>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {cars.map((car) => (
              <option key={car.value} value={car.value}>
                {car.label} ({carFuelData[car.value]?.consumption ?? "?"} л/100 км)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
            <MapPin className="w-4 h-4 inline mr-1" />
            Расстояние (км)
          </label>
          <input
            type="number"
            min={0}
            value={distance || ""}
            onChange={(e) => setDistance(Number(e.target.value))}
            placeholder="Например: 300"
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {distance > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center justify-center gap-2 text-foreground font-semibold">
              <Calculator className="w-4 h-4 text-primary" />
              Расход: {liters.toFixed(1)} л
            </div>
            <div className="text-lg font-bold text-primary">
              ≈ {cost.toLocaleString("ru-RU")} ₽
            </div>
            <p className="text-xs text-muted-foreground">
              При цене {FUEL_PRICE} ₽/л ({fuel?.fuelType})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuelCalculator;
