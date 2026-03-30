import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import bmwImg from "@/assets/bmw-420i.jpg";
import porscheImg from "@/assets/porsche-macan.jpg";
import mercedesImg from "@/assets/mercedes-glb.jpg";

const slides = [heroBg, bmwImg, porscheImg, mercedesImg];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: current === i ? 1 : 0 }}
        >
          <img
            src={src}
            alt="Premium car"
            className="w-full h-full object-cover"
            style={{ animation: current === i ? "heroZoom 8s ease-out forwards" : "none" }}
            width={1920}
            height={1080}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />

      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-32 container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-primary font-semibold text-sm md:text-base tracking-widest uppercase mb-4 animate-fade-up">
            3D Drive · Альметьевск
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up-delay-1">
            Премиальная аренда{" "}
            <span className="text-gradient-gold">автомобилей</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 animate-fade-up-delay-2">
            Для тех, кто ценит статус, свободу и безупречный сервис.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
            <a
              href="#booking"
              className="bg-gradient-gold text-primary-foreground px-8 py-4 rounded-lg text-base font-bold hover:opacity-90 transition-opacity text-center"
            >
              Забронировать авто
            </a>
            <a
              href="https://wa.me/79868262332"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-primary/30 text-foreground px-8 py-4 rounded-lg text-base font-medium hover:border-primary/60 transition-colors text-center"
            >
              Написать в WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        <button
          onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
          className="w-10 h-10 rounded-full border border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrent((p) => (p + 1) % slides.length)}
          className="w-10 h-10 rounded-full border border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
