import { Calendar, Clock, Save, Fuel, Crown, RotateCcw, Bell, MessageCircle } from "lucide-react";
import FuelCalculator from "@/components/FuelCalculator";
import LoyaltySection from "@/components/LoyaltySection";
import RepeatBookingBanner from "@/components/RepeatBookingBanner";

const features = [
  { icon: RotateCcw, title: "Повтор аренды в 1 клик", desc: "Восстановите последнее бронирование мгновенно" },
  { icon: Calendar, title: "Быстрый выбор дат", desc: "Кнопки «Завтра», «На выходные», «На неделю»" },
  { icon: Save, title: "Сохранение выбора", desc: "Настройки не пропадут при закрытии сайта" },
  { icon: Clock, title: "Добавить в календарь", desc: "Сохраните даты в Google Calendar" },
  { icon: Bell, title: "Напоминания", desc: "Уведомления о начале и конце аренды" },
  { icon: Fuel, title: "Калькулятор топлива", desc: "Рассчитайте расход на маршрут" },
  { icon: Crown, title: "Программа лояльности", desc: "Уровни, бонусы и скидки" },
  { icon: MessageCircle, title: "Онлайн-чат", desc: "Связь с менеджером через Telegram и WhatsApp" },
];

const FeaturesSection = () => (
  <section id="features" className="section-padding">
    <div className="container mx-auto max-w-5xl space-y-10">
      <div className="text-center space-y-3">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase">Удобства</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">✨ Удобные функции</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Всё, что делает аренду простой, быстрой и приятной
        </p>
      </div>

      {/* Repeat booking banner */}
      <RepeatBookingBanner />

      {/* Feature cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-card-gradient gold-border rounded-2xl p-5 text-center hover:-translate-y-1 transition-transform duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1 text-sm">{f.title}</h3>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Fuel calculator */}
      <div className="max-w-lg mx-auto">
        <FuelCalculator />
      </div>
    </div>

    {/* Loyalty */}
    <LoyaltySection />
  </section>
);

export default FeaturesSection;
