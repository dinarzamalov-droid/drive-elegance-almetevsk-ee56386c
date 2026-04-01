import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import bmwImg from "@/assets/bmw-420i.jpg";
import bmw1 from "@/assets/bmw-1.jpg";
import bmw2 from "@/assets/bmw-2.jpg";
import bmw3 from "@/assets/bmw-3.jpg";
import bmw4 from "@/assets/bmw-4.jpg";
import bmw5 from "@/assets/bmw-5.jpg";
import porsche1 from "@/assets/porsche-1.jpg";
import porsche2 from "@/assets/porsche-2.jpg";
import porsche3 from "@/assets/porsche-3.jpg";
import porsche4 from "@/assets/porsche-4.jpg";
import porsche5 from "@/assets/porsche-5.jpg";
import porsche6 from "@/assets/porsche-6.jpg";
import mercedes1 from "@/assets/mercedes-1.jpg";
import mercedes2 from "@/assets/mercedes-2.jpg";
import mercedes3 from "@/assets/mercedes-3.jpg";
import mercedes4 from "@/assets/mercedes-4.jpg";
import mercedes5 from "@/assets/mercedes-5.jpg";
import mercedes6 from "@/assets/mercedes-6.jpg";
import lixiang1 from "@/assets/lixiang-1.jpg";
import lixiang2 from "@/assets/lixiang-2.jpg";
import lixiang3 from "@/assets/lixiang-3.jpg";
import lixiang4 from "@/assets/lixiang-4.jpg";
import lixiang5 from "@/assets/lixiang-5.jpg";
import lixiang6 from "@/assets/lixiang-6.jpg";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";

const cars = [
  {
    name: "BMW 420i",
    images: [bmwImg, bmw1, bmw2, bmw3, bmw4, bmw5],
    price: "14 000",
    deposit: "30 000",
    specs: "245 л.с., 0-100 за 5,8 сек, купе",
    description: "Динамика, статус, идеален для свадеб и фотосессий",
  },
  {
    name: "Porsche Macan",
    images: [porsche1, porsche2, porsche3, porsche4, porsche5, porsche6],
    price: "12 000",
    deposit: "25 000",
    specs: "252 л.с., полный привод, компактный SUV + stage 1",
    description: "Статус и уверенность в любых дорожных условиях",
  },
  {
    name: "Mercedes GLB",
    images: [mercedes1, mercedes2, mercedes3, mercedes4, mercedes5, mercedes6],
    price: "11 000",
    deposit: "25 000",
    specs: "5 мест, 150 л.с., просторный салон",
    description: "Комфорт для семьи или деловой поездки",
  },
  {
    name: "LiXiang L6",
    images: [lixiang1, lixiang2, lixiang3, lixiang4, lixiang5, lixiang6],
    price: "23 000",
    deposit: "35 000",
    specs: "449 л.с., гибрид, полный привод, премиум-кроссовер",
    description: "Технологичный премиум-кроссовер. Гибрид, мощный, стильный серый цвет",
  },
];

const CarImageCarousel = ({ images, name }: { images: string[]; name: string }) => {
  const [current, setCurrent] = useState(0);

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
        width={1920}
        height={1080}
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${name} ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            current === i ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          width={1920}
          height={1080}
        />
      ))}
      <button
        onClick={(e) => {
          e.preventDefault();
          setCurrent((p) => (p - 1 + images.length) % images.length);
        }}
        className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-background/80"
        aria-label={`Предыдущее фото ${name}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          setCurrent((p) => (p + 1) % images.length);
        }}
        className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-background/80"
        aria-label={`Следующее фото ${name}`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              setCurrent(i);
            }}
            className={`h-1.5 rounded-full transition-all ${current === i ? "w-3 bg-foreground" : "w-1.5 bg-foreground/40"}`}
            aria-label={`Фото ${i + 1} ${name}`}
          />
        ))}
      </div>
    </div>
  );
};

const FleetSection = () => {
  return (
    <section id="fleet" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection className="mb-16 text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Автопарк</p>
          <h2 className="text-3xl font-bold md:text-5xl">
            Выберите свой <span className="text-gradient-gold">стиль</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {cars.map((car, i) => (
            <AnimatedItem key={car.name} delay={i * 0.15}>
              <div className="group h-full overflow-hidden rounded-2xl bg-card-gradient gold-border transition-all duration-500 hover:gold-glow">
                <div className="relative h-56 overflow-hidden md:h-64">
                  <CarImageCarousel images={car.images} name={car.name} />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="pointer-events-none absolute bottom-4 left-4">
                    <h3 className="text-2xl font-bold">{car.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-sm text-muted-foreground">{car.description}</p>
                  <p className="mb-5 text-xs text-muted-foreground">{car.specs}</p>
                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">от</span>
                      <span className="ml-1 text-2xl font-bold text-gradient-gold">{car.price}</span>
                      <span className="ml-1 text-xs text-muted-foreground">руб./сутки</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Залог: </span>
                      <span className="text-sm font-semibold text-foreground">{car.deposit} ₽</span>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/79868262332"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-lg bg-gradient-gold py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Забронировать
                  </a>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
