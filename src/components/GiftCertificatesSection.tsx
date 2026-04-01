import { useState, useRef } from "react";
import { Gift, ChevronLeft, ChevronRight, Star, Car, Users, UserCheck, Crown } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import CustomCertificateForm from "./CustomCertificateForm";
import { cn } from "@/lib/utils";

const certificates = [
  {
    id: "impression",
    title: "ВПЕЧАТЛЕНИЕ",
    price: "5 000 / 10 000 / 15 000 / 20 000 ₽",
    description: "Сумма списывается при бронировании любого авто",
    icon: Gift,
    accent: false,
  },
  {
    id: "weekend",
    title: "ВЫХОДНЫЕ",
    price: "28 000 ₽",
    description: "2 дня аренды BMW 420i — скорость и стиль на выходные",
    icon: Car,
    accent: false,
  },
  {
    id: "status",
    title: "СТАТУС",
    price: "12 000 ₽",
    description: "1 день аренды Porsche Macan — почувствуй мощь",
    icon: Star,
    accent: true,
  },
  {
    id: "family",
    title: "СЕМЕЙНЫЙ",
    price: "22 000 ₽",
    description: "2 дня аренды Mercedes GLB — комфорт для всей семьи",
    icon: Users,
    accent: false,
  },
  {
    id: "chauffeur",
    title: "ЛИЧНЫЙ ВОДИТЕЛЬ",
    price: "10 000 ₽",
    description: "8 часов с персональным водителем на любом авто",
    icon: UserCheck,
    accent: false,
  },
  {
    id: "vip",
    title: "VIP-НАБОР",
    price: "от 50 000 ₽",
    description: "3 дня аренды + КАСКО + водитель — максимум привилегий",
    icon: Crown,
    accent: true,
  },
];

const GiftCertificatesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -distance : distance, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  };

  const handleOrder = (title: string) => {
    const text = encodeURIComponent(
      `Здравствуйте! Хочу приобрести подарочный сертификат «${title}» от 3D Drive.`
    );
    window.open(`https://wa.me/79868262332?text=${text}`, "_blank");
  };

  return (
    <section id="certificates" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            Подарочные сертификаты
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Подарите <span className="text-gradient-gold">впечатление</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Эмоции, статус и свобода — идеальный подарок для близких, партнёров или сотрудников
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="relative">
          {/* Navigation arrows — hidden on mobile */}
          <button
            onClick={() => scroll("left")}
            className={cn(
              "hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-secondary border border-border text-foreground hover:border-primary transition-colors",
              !canScrollLeft && "opacity-0 pointer-events-none"
            )}
            aria-label="Назад"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={cn(
              "hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-secondary border border-border text-foreground hover:border-primary transition-colors",
              !canScrollRight && "opacity-0 pointer-events-none"
            )}
            aria-label="Вперёд"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 md:mx-0 md:px-0"
          >
            {certificates.map((cert) => {
              const Icon = cert.icon;
              return (
                <div
                  key={cert.id}
                  className={cn(
                    "snap-start shrink-0 w-[280px] sm:w-[300px] flex flex-col rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02]",
                    cert.accent
                      ? "bg-gradient-to-br from-primary/15 to-primary/5 border-primary/40 shadow-lg shadow-primary/10"
                      : "bg-card-gradient border-border"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      cert.accent ? "bg-primary/20" : "bg-secondary"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", cert.accent ? "text-primary" : "text-muted-foreground")} />
                  </div>

                  <h3 className="text-sm font-bold tracking-wider text-foreground mb-1">
                    {cert.title}
                  </h3>
                  <p className="text-gradient-gold text-lg font-bold mb-2">{cert.price}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {cert.description}
                  </p>

                  <button
                    onClick={() => handleOrder(cert.title)}
                    className={cn(
                      "mt-5 w-full py-3 rounded-lg text-sm font-semibold transition-all",
                      cert.accent
                        ? "bg-gradient-gold text-primary-foreground hover:opacity-90"
                        : "border border-primary text-primary hover:bg-primary/10"
                    )}
                  >
                    Заказать
                  </button>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default GiftCertificatesSection;
