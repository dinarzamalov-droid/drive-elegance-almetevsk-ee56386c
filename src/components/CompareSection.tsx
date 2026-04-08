import { useState } from "react";
import { Check, X, Car, Zap, Gauge, Shield, DollarSign, Users } from "lucide-react";
import { cars } from "@/lib/bookingData";
import { useNavigate } from "react-router-dom";

const carDetails: Record<string, {
  power: string;
  acceleration: string;
  drive: string;
  seats: number;
  fuelType: string;
  consumption: string;
  trunk: string;
  features: string[];
}> = {
  "bmw-420i": {
    power: "184 л.с.",
    acceleration: "7,5 сек",
    drive: "Задний",
    seats: 4,
    fuelType: "АИ-100",
    consumption: "7 л/100 км",
    trunk: "440 л",
    features: ["Купе", "2.0 л", "Harman Kardon", "Камера 360°"],
  },
  "porsche-macan": {
    power: "252 л.с. + Stage 1",
    acceleration: "6,2 сек",
    drive: "Полный (AWD)",
    seats: 5,
    fuelType: "АИ-100",
    consumption: "10 л/100 км",
    trunk: "500 л",
    features: ["SUV", "Спорт-подвеска", "BOSE", "Панорама"],
  },
  "mercedes-glb": {
    power: "150 л.с.",
    acceleration: "9,1 сек",
    drive: "Передний",
    seats: 5,
    fuelType: "АИ-100",
    consumption: "7 л/100 км",
    trunk: "570 л",
    features: ["Семейный", "MBUX", "Просторный салон", "LED-оптика"],
  },
  "lixiang-l6": {
    power: "449 л.с.",
    acceleration: "5,4 сек",
    drive: "Полный (AWD)",
    seats: 5,
    fuelType: "АИ-100",
    consumption: "6 л/100 км",
    trunk: "607 л",
    features: ["Гибрид", "Автопилот", "Экран 15\"", "Массаж сидений"],
  },
};

const specs: { key: string; label: string; icon: React.ElementType; getValue: (carValue: string) => string }[] = [
  { key: "price", label: "Цена / сутки", icon: DollarSign, getValue: (v) => `${(cars.find(c => c.value === v)?.price ?? 0).toLocaleString("ru-RU")} ₽` },
  { key: "deposit", label: "Залог", icon: Shield, getValue: (v) => `${(cars.find(c => c.value === v)?.deposit ?? 0).toLocaleString("ru-RU")} ₽` },
  { key: "power", label: "Мощность", icon: Zap, getValue: (v) => carDetails[v]?.power ?? "—" },
  { key: "acceleration", label: "0–100 км/ч", icon: Gauge, getValue: (v) => carDetails[v]?.acceleration ?? "—" },
  { key: "drive", label: "Привод", icon: Car, getValue: (v) => carDetails[v]?.drive ?? "—" },
  { key: "seats", label: "Мест", icon: Users, getValue: (v) => String(carDetails[v]?.seats ?? "—") },
  { key: "fuel", label: "Топливо", icon: Gauge, getValue: (v) => carDetails[v]?.fuelType ?? "—" },
  { key: "consumption", label: "Расход", icon: Gauge, getValue: (v) => carDetails[v]?.consumption ?? "—" },
  { key: "trunk", label: "Багажник", icon: Car, getValue: (v) => carDetails[v]?.trunk ?? "—" },
];

const CompareSection = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(cars.map(c => c.value));

  const toggle = (value: string) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.length > 2 ? prev.filter(v => v !== value) : prev
        : [...prev, value]
    );
  };

  const activeCars = cars.filter(c => selected.includes(c.value));

  return (
    <section id="compare" className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Сравнение автомобилей
          </h2>
          <p className="text-muted-foreground">Выберите от 2 до 4 автомобилей для сравнения</p>
        </div>

        {/* Toggle chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {cars.map(car => (
            <button
              key={car.value}
              onClick={() => toggle(car.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selected.includes(car.value)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {car.label}
            </button>
          ))}
        </div>

        {/* Comparison table */}
        <div className="bg-card-gradient gold-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Header */}
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium min-w-[120px]">Характеристика</th>
                  {activeCars.map(car => (
                    <th key={car.value} className="p-4 text-center font-bold text-foreground min-w-[130px]">
                      {car.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map((spec, i) => (
                  <tr key={spec.key} className={i % 2 === 0 ? "bg-secondary/20" : ""}>
                    <td className="p-4 text-muted-foreground font-medium flex items-center gap-2">
                      <spec.icon className="w-4 h-4 text-primary shrink-0" />
                      {spec.label}
                    </td>
                    {activeCars.map(car => (
                      <td key={car.value} className="p-4 text-center text-foreground font-medium">
                        {spec.getValue(car.value)}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Features row */}
                <tr className="border-t border-border">
                  <td className="p-4 text-muted-foreground font-medium">Особенности</td>
                  {activeCars.map(car => (
                    <td key={car.value} className="p-4 text-center">
                      <div className="flex flex-col gap-1">
                        {carDetails[car.value]?.features.map(f => (
                          <span key={f} className="inline-flex items-center justify-center gap-1 text-xs text-foreground">
                            <Check className="w-3 h-3 text-primary" /> {f}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* CTA row */}
          <div className="border-t border-border p-4 flex flex-wrap justify-center gap-3">
            {activeCars.map(car => (
              <button
                key={car.value}
                onClick={() => navigate(`/booking?car=${car.value}`)}
                className="px-5 py-2.5 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Забронировать {car.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompareSection;
