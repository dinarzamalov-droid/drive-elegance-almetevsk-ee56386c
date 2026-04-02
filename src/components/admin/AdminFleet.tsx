import { Car, Wrench, CheckCircle } from "lucide-react";
import type { FleetCar } from "./types";
import { fleetStatusLabels } from "./types";

interface Props {
  fleet: FleetCar[];
  onUpdateFleet: (id: string, data: Record<string, unknown>) => void;
}

const statusIcon = (s: string) => {
  if (s === "free") return <CheckCircle className="w-4 h-4 text-green-400" />;
  if (s === "busy") return <Car className="w-4 h-4 text-primary" />;
  return <Wrench className="w-4 h-4 text-yellow-400" />;
};

const AdminFleet = ({ fleet, onUpdateFleet }: Props) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {fleet.map((car) => (
          <div key={car.id} className="bg-card-gradient border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm">{car.car_label}</h3>
              {statusIcon(car.status)}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Статус</span>
                <select
                  value={car.status}
                  onChange={(e) => onUpdateFleet(car.id, { status: e.target.value })}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border-none cursor-pointer focus:outline-none ${
                    car.status === "free" ? "bg-green-500/20 text-green-400" :
                    car.status === "busy" ? "bg-primary/20 text-primary" :
                    "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  <option value="free">Свободен</option>
                  <option value="busy">Занят</option>
                  <option value="maintenance">На ТО</option>
                </select>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Пробег</span>
                <input
                  type="number"
                  defaultValue={car.mileage}
                  onBlur={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val !== car.mileage) onUpdateFleet(car.id, { mileage: val });
                  }}
                  className="w-24 text-right bg-secondary border border-border rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-muted-foreground text-xs self-center ml-1">км</span>
              </div>
            </div>

            <textarea
              defaultValue={car.notes}
              placeholder="Заметки..."
              onBlur={(e) => {
                if (e.target.value !== car.notes) onUpdateFleet(car.id, { notes: e.target.value });
              }}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs resize-none h-16 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFleet;
