import { Heart, Briefcase, MapPin, Car } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";

const purposes = [
  {
    icon: <Heart className="w-7 h-7" />,
    title: "Свадьбы и фотосессии",
    desc: "Создайте идеальный образ с BMW 420i или Porsche Macan. Идеальные кадры и восторг гостей гарантированы.",
  },
  {
    icon: <Briefcase className="w-7 h-7" />,
    title: "Бизнес и встречи",
    desc: "Встречайте партнеров и инвесторов на премиальном автомобиле. Подчеркните статус вашей компании.",
  },
  {
    icon: <MapPin className="w-7 h-7" />,
    title: "Путешествия и выходные",
    desc: "Свобода передвижения без ограничений. Комфорт, надежность и стиль в каждой поездке.",
  },
  {
    icon: <Car className="w-7 h-7" />,
    title: "Тест-драйв перед покупкой",
    desc: "Оцените характеристики автомобиля в реальных условиях перед принятием решения о покупке.",
  },
];

const ForWhomSection = () => {
  return (
    <section className="section-padding bg-gradient-dark">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Кому мы помогаем</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Аренда для <span className="text-gradient-gold">разных целей</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {purposes.map((p, i) => (
            <AnimatedItem key={p.title} delay={i * 0.1}>
              <div className="bg-card-gradient gold-border rounded-2xl p-8 flex gap-5 hover:gold-glow transition-shadow duration-500 h-full">
                <div className="text-primary shrink-0 mt-1">{p.icon}</div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ForWhomSection;
