import { Car, Clock, Camera, Heart, Briefcase, Plane, PartyPopper, MapPin, CheckCircle2 } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";
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
  { cars: "BMW 420i", price: "4 000" },
  { cars: "LiXiang L6", price: "4 500" },
  { cars: "Range Rover Sport", price: "5 000" },
  { cars: "Mercedes GLB", price: "3 500" },
  { cars: "Porsche Macan", price: "3 500" },
];

const features = [
  "Опытный водитель в костюме",
  "Минимальный заказ — от 3 часов",
  "Чистый, ухоженный автомобиль",
  "Бесплатная вода и зарядки",
  "Подача за 30 минут по городу",
  "Индивидуальный маршрут",
];

const ChauffeurSection = () => (
  <section id="chauffeur" className="section-padding bg-gradient-dark overflow-hidden">
    <div className="container mx-auto max-w-6xl">
      <AnimatedSection className="text-center mb-12">
        <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Премиальный сервис</p>
        <h2 className="text-3xl md:text-5xl font-bold mb-4"><span className="text-gradient-gold">Аренда с водителем</span></h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">Персональный водитель за рулём премиального автомобиля — для деловых поездок, торжеств, трансферов и особых событий</p>
      </AnimatedSection>
      <AnimatedSection delay={0.1} className="mb-14">
        <div className="relative rounded-2xl overflow-hidden">
          <img src={chauffeurHero} alt="Аренда автомобиля с водителем — премиальный сервис 3D Drive" width={1280} height={720} loading="lazy" className="w-full h-64 md:h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3">
            {features.map((f) => <span key={f} className="flex items-center gap-1.5 bg-background/70 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />{f}</span>)}
          </div>
        </div>
      </AnimatedSection>
      <AnimatedSection className="mb-14">
        <h3 className="text-xl md:text-2xl font-bold text-center mb-8">Для каких поводов</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {occasions.map((o, i) => <AnimatedItem key={o.title} delay={i * 0.07}><div className="bg-card-gradient gold-border rounded-xl p-5 h-full hover:gold-glow transition-shadow duration-500"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3"><o.icon className="w-5 h-5 text-primary" /></div><h4 className="font-bold text-sm mb-1">{o.title}</h4><p className="text-muted-foreground text-xs leading-relaxed">{o.desc}</p></div></AnimatedItem>)}
        </div>
      </AnimatedSection>
      <AnimatedSection delay={0.1} className="max-w-4xl mx-auto">
        <h3 className="text-xl md:text-2xl font-bold mb-6">Тарифы</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {tiers.map((tier) => <div key={tier.cars} className="bg-card-gradient gold-border rounded-xl p-5 flex items-center justify-between gap-4"><div className="flex items-center gap-3 min-w-0"><div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0"><Car className="w-5 h-5 text-primary" /></div><span className="font-semibold text-sm md:text-base">{tier.cars}</span></div><div className="text-right shrink-0"><span className="text-gradient-gold text-xl md:text-2xl font-bold">{tier.price} ₽</span><span className="text-muted-foreground text-xs block">/час</span></div></div>)}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-xs"><Clock className="w-4 h-4 text-primary shrink-0" />Минимальный заказ — от 3 часов. Подача по Альметьевску бесплатно.</div>
      </AnimatedSection>
    </div>
  </section>
);

export default ChauffeurSection;
