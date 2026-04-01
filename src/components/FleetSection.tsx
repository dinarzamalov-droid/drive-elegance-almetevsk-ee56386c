import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import bmwImg from "@/assets/bmw-420i.jpg";
import bmw1 from "@/assets/bmw-1.jpg";
import bmw2 from "@/assets/bmw-2.jpg";
import bmw3 from "@/assets/bmw-3.jpg";
import bmw4 from "@/assets/bmw-4.jpg";
import bmw5 from "@/assets/bmw-5.jpg";
import porscheImg from "@/assets/porsche-macan.jpg";
import porsche1 from "@/assets/porsche-1.jpg";
import porsche2 from "@/assets/porsche-2.jpg";
import porsche3 from "@/assets/porsche-3.jpg";
import porsche4 from "@/assets/porsche-4.jpg";
import porsche5 from "@/assets/porsche-5.jpg";
import porsche6 from "@/assets/porsche-6.jpg";
import mercedesImg from "@/assets/mercedes-glb.jpg";
import lixiangImg from "@/assets/lixiang-l6.jpg";
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
    images: [porscheImg, porsche1, porsche2, porsche3, porsche4, porsche5, porsche6],
    price: "12 000",
    deposit: "25 000",
    specs: "252 л.с., полный привод, компактный SUV + stage 1",
    description: "Статус и уверенность в любых дорожных условиях",
  },
  {
    name: "Mercedes GLB",
    images: [mercedesImg],
    price: "11 000",
    deposit: "25 000",
    specs: "5 мест, 150 л.с., просторный салон",
    description: "Комфорт для семьи или деловой поездки",
  },
  {
    name: "LiXiang L6",
    images: [lixiangImg, lixiang1, lixiang2, lixiang3, lixiang4, lixiang5, lixiang6],
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
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          setCurrent((p) => (p + 1) % images.length);
        }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              setCurrent(i);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              current === i ? "bg-foreground w-3" : "bg-foreground/40"
            }`}
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
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Автопарк</p>
          <h2 className="text-3xl md:text-5xl font-bold">Выберите свой <span className="text-gradient-gold">стиль</span></h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cars.map((car, i) => (
            <AnimatedItem key={car.name} delay={i * 0.15}>
              <div className="group bg-card-gradient gold-border rounded-2xl overflow-hidden hover:gold-glow transition-all duration-500 h-full">
                <div className="relative overflow-hidden h-56 md:h-64">
                  <CarImageCarousel images={car.images} name={car.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 pointer-events-none">
                    <h3 className="text-2xl font-bold">{car.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground text-sm mb-4">{car.description}</p>
                  <p className="text-muted-foreground text-xs mb-5">{car.specs}</p>
                  <div className="flex items-end justify-between mb-5">
                    <div>
                      <span className="text-xs text-muted-foreground">от</span>
                      <span className="text-2xl font-bold text-gradient-gold ml-1">{car.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">руб./сутки</span>
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
                    className="block w-full bg-gradient-gold text-primary-foreground text-center py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
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
