import { Car, Clock, Camera } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";

const tiers = [
  {
    cars: "BMW 420i / LiXiang L6",
    price: "3 500 ₽/час",
  },
  {
    cars: "Porsche Macan / Mercedes GLB",
    price: "3 000 ₽/час",
  },
];

const ChauffeurSection = () => {
  const handleOrder = () => {
    const text = encodeURIComponent(
      "Здравствуйте! Хочу заказать автомобиль с водителем от 3D Drive."
    );
    window.open(`https://wa.me/79868262332?text=${text}`, "_blank");
  };

  return (
    <section id="chauffeur" className="section-padding bg-gradient-dark">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection className="text-center mb-10">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            Сопровождение
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="text-gradient-gold">Аренда с водителем</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-sm">Фото- и видеосъёмки</span>
            <span className="mx-1">|</span>
            <span className="text-sm">Свадьбы и торжества</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm">Минимальный заказ — от 3 часов</span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {tiers.map((tier, i) => (
            <AnimatedItem key={tier.cars} delay={i * 0.1}>
              <div className="bg-card-gradient gold-border rounded-2xl p-6 text-center hover:gold-glow transition-shadow duration-500">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-sm mb-2">{tier.cars}</h3>
                <p className="text-gradient-gold text-2xl font-bold">{tier.price}</p>
              </div>
            </AnimatedItem>
          ))}
        </div>

        <AnimatedSection delay={0.25} className="text-center">
          <button
            onClick={handleOrder}
            className="bg-gradient-gold text-primary-foreground px-8 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Заказать сопровождение
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ChauffeurSection;
