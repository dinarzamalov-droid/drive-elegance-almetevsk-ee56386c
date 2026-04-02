import { useState } from "react";
import { Car, Clock, Camera, Heart, Briefcase, Plane, PartyPopper, MapPin, Phone, Send, User, CheckCircle2 } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";
import { toast } from "sonner";
import chauffeurHero from "@/assets/chauffeur-hero.jpg";

const occasions = [
  { icon: Heart, title: "Свадьбы и торжества", desc: "Украшенный автомобиль, пунктуальный водитель, красная ковровая дорожка" },
  { icon: Briefcase, title: "Деловые поездки", desc: "Представительский класс для встреч, переговоров и конференций" },
  { icon: Plane, title: "Трансферы", desc: "Аэропорт, вокзал, межгород — встретим с табличкой точно в срок" },
  { icon: Camera, title: "Фото и видеосъёмки", desc: "Авто как декорация или транспорт для съёмочной команды" },
  { icon: PartyPopper, title: "Выпускные и праздники", desc: "Эффектный подъезд, подсветка, атмосфера люкса" },
  { icon: MapPin, title: "Экскурсии по городу", desc: "Комфортный маршрут по достопримечательностям с гидом-водителем" },
];

const tiers = [
  { cars: "BMW 420i / LiXiang L6", price: "3 500", perHour: true },
  { cars: "Porsche Macan / Mercedes GLB", price: "3 000", perHour: true },
];

const features = [
  "Опытный водитель в костюме",
  "Минимальный заказ — от 3 часов",
  "Чистый, ухоженный автомобиль",
  "Бесплатная вода и зарядки",
  "Подача за 30 минут по городу",
  "Индивидуальный маршрут",
];

const ChauffeurSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", occasion: "", date: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Введите имя и телефон");
      return;
    }
    setSending(true);
    const text = encodeURIComponent(
      `Заказ с водителем от 3D Drive\nИмя: ${form.name}\nТелефон: ${form.phone}\nПовод: ${form.occasion || "не указан"}\nДата: ${form.date || "не указана"}`
    );
    window.open(`https://wa.me/79868262332?text=${text}`, "_blank");
    toast.success("Заявка отправлена в WhatsApp!");
    setSending(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  return (
    <section id="chauffeur" className="section-padding bg-gradient-dark overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* Hero */}
        <AnimatedSection className="text-center mb-12">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            Премиальный сервис
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-gold">Аренда с водителем</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Персональный водитель за рулём премиального автомобиля — для деловых поездок, торжеств, трансферов и особых событий
          </p>
        </AnimatedSection>

        {/* Hero image */}
        <AnimatedSection delay={0.1} className="mb-14">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={chauffeurHero}
              alt="Аренда автомобиля с водителем — премиальный сервис 3D Drive"
              width={1280}
              height={720}
              loading="lazy"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
              {features.map((f) => (
                <span key={f} className="flex items-center gap-1.5 bg-background/70 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Occasions grid */}
        <AnimatedSection className="mb-14">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-8">
            Для каких поводов
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {occasions.map((o, i) => (
              <AnimatedItem key={o.title} delay={i * 0.07}>
                <div className="bg-card-gradient gold-border rounded-xl p-5 h-full hover:gold-glow transition-shadow duration-500">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <o.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{o.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{o.desc}</p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>

        {/* Pricing + Order form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pricing */}
          <AnimatedSection delay={0.1}>
            <h3 className="text-xl md:text-2xl font-bold mb-6">Тарифы</h3>
            <div className="space-y-4 mb-6">
              {tiers.map((tier) => (
                <div key={tier.cars} className="bg-card-gradient gold-border rounded-xl p-5 flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">{tier.cars}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gradient-gold text-xl font-bold">{tier.price} ₽</span>
                    <span className="text-muted-foreground text-xs block">/час</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              Минимальный заказ — от 3 часов. Подача по Альметьевску бесплатно.
            </div>
          </AnimatedSection>

          {/* Quick order form */}
          <AnimatedSection delay={0.2}>
            <h3 className="text-xl md:text-2xl font-bold mb-6">Быстрый заказ</h3>
            <form onSubmit={handleSubmit} className="bg-card-gradient gold-border rounded-xl p-6 space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ваше имя *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="Телефон *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
              <select
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                className={inputClass}
              >
                <option value="">Повод (необязательно)</option>
                {occasions.map((o) => (
                  <option key={o.title} value={o.title}>{o.title}</option>
                ))}
              </select>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass}
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-gold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Отправить заявку в WhatsApp
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ChauffeurSection;
