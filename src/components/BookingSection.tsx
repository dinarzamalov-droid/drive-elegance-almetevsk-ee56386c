import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AnimatedSection from "./AnimatedSection";

const cars = [
  { value: "bmw-420i", label: "BMW 420i", price: "14 000" },
  { value: "porsche-macan", label: "Porsche Macan", price: "12 000" },
  { value: "mercedes-glb", label: "Mercedes GLB", price: "11 000" },
];

const BookingSection = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [car, setCar] = useState("");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const selectedCar = cars.find((c) => c.value === car);
  const days =
    dateFrom && dateTo
      ? Math.max(1, Math.ceil((dateTo.getTime() - dateFrom.getTime()) / 86400000))
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !car || !dateFrom || !dateTo) return;

    const carLabel = selectedCar?.label ?? car;
    const from = format(dateFrom, "dd.MM.yyyy");
    const to = format(dateTo, "dd.MM.yyyy");
    const text = encodeURIComponent(
      `Бронирование с сайта 3D Drive\nИмя: ${name}\nТелефон: ${phone}\nАвтомобиль: ${carLabel}\nДаты: ${from} — ${to} (${days} сут.)`
    );
    window.open(`https://wa.me/79868262332?text=${text}`, "_blank");
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <section id="booking" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            Бронирование
          </p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Забронируйте <span className="text-gradient-gold">ваш автомобиль</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-card-gradient gold-border rounded-2xl p-8 space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Автомобиль</label>
              <Select value={car} onValueChange={setCar}>
                <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Выберите автомобиль" />
                </SelectTrigger>
                <SelectContent>
                  {cars.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label} — от {c.price} ₽/сутки
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Дата начала</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-secondary border-border",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd.MM.yyyy") : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(d) => {
                        setDateFrom(d);
                        if (dateTo && d && dateTo <= d) setDateTo(undefined);
                      }}
                      disabled={(date) => date < today}
                      locale={ru}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Дата окончания</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-secondary border-border",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd.MM.yyyy") : "Выберите дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      disabled={(date) => date < (dateFrom ?? today)}
                      locale={ru}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {selectedCar && days > 0 && (
              <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-4 py-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Car className="h-4 w-4" />
                  <span>{selectedCar.label} × {days} сут.</span>
                </div>
                <span className="font-bold text-gradient-gold">
                  от {(parseInt(selectedCar.price.replace(/\s/g, "")) * days).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Имя</label>
                <input
                  type="text"
                  required
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Телефон</label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Забронировать через WhatsApp
            </button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default BookingSection;
