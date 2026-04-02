import { Eye, Wrench, SlidersHorizontal, Truck, Scale } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";

const advantages = [
  { icon: <Eye className="w-6 h-6" />, title: "Прозрачность", desc: "Фиксированные залоги, понятные договоры, никаких скрытых платежей" },
  { icon: <Wrench className="w-6 h-6" />, title: "Надежность", desc: "Каждый автомобиль проходит технический осмотр после каждой аренды" },
  { icon: <SlidersHorizontal className="w-6 h-6" />, title: "Гибкость", desc: "4 варианта условий для разных категорий клиентов" },
  { icon: <Truck className="w-6 h-6" />, title: "Удобство", desc: "Бесплатная доставка по Альметьевску, оформление за 10 минут" },
  { icon: <Scale className="w-6 h-6" />, title: "Официально", desc: "Работаем легально, все договоры оформлены по закону" },
];

const WhyUsSection = () => {
  return (
    <section id="why-us" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Преимущества</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Почему выбирают <span className="text-gradient-gold">3D Drive</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {advantages.map((a, i) => (
            <AnimatedItem key={a.title} delay={i * 0.1}>
              <div className="bg-card-gradient gold-border rounded-xl p-6 text-center hover:gold-glow transition-shadow duration-500 group h-full">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  {a.icon}
                </div>
                <h3 className="font-bold text-sm mb-2">{a.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{a.desc}</p>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
