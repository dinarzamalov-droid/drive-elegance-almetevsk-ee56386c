import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Phone, Send, MessageCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import heroBg from "@/assets/hero-bg.jpg";
import bmwImg from "@/assets/bmw-420i.jpg";
import porscheImg from "@/assets/porsche-macan.jpg";
import mercedesImg from "@/assets/mercedes-glb.jpg";

const slides = [heroBg, bmwImg, porscheImg, mercedesImg];

const messengerOptions = [
  { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/79868262332", icon: Phone, color: "bg-[#25D366]" },
  { key: "telegram", label: "Telegram", href: "https://t.me/3ddrive", icon: Send, color: "bg-[#26A5E4]" },
  { key: "max", label: "МАХ", href: "https://max.ru/user/79868262332", icon: MessageCircle, color: "bg-gradient-to-r from-[#1a1a1a] to-[#333]" },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [selectedMessenger, setSelectedMessenger] = useState(messengerOptions[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMessengerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-32 container mx-auto px-4">
        <div className="max-w-3xl">
          <p className="text-primary font-semibold text-sm md:text-base tracking-widest uppercase mb-4 animate-fade-up drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            3D Drive · Альметьевск
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up-delay-1 text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Премиальная аренда{" "}
            <span className="text-gradient-gold">автомобилей</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 max-w-xl mb-8 animate-fade-up-delay-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            Для тех, кто ценит статус, свободу и безупречный сервис.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3">
            <a
              href="#booking"
              className="bg-gradient-gold text-primary-foreground px-8 py-4 rounded-lg text-base font-bold hover:opacity-90 transition-opacity text-center"
            >
              Забронировать авто
            </a>
            <div className="relative" ref={dropdownRef}>
              <div className="flex">
                <a
                  href={selectedMessenger.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-primary/30 text-foreground px-6 py-4 rounded-l-lg text-base font-medium hover:border-primary/60 transition-colors flex items-center justify-center gap-2"
                >
                  <selectedMessenger.icon className="w-5 h-5 shrink-0" />
                  Написать в {selectedMessenger.label}
                </a>
                <button
                  onClick={() => setMessengerOpen(!messengerOpen)}
                  className="border border-l-0 border-primary/30 text-foreground px-3 py-4 rounded-r-lg hover:border-primary/60 transition-colors flex items-center"
                >
                  <ChevronDown className={cn("w-4 h-4 transition-transform", messengerOpen && "rotate-180")} />
                </button>
              </div>
              {messengerOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-full bg-card border border-border rounded-lg shadow-xl overflow-hidden z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  {messengerOptions.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => { setSelectedMessenger(m); setMessengerOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors text-foreground",
                        selectedMessenger.key === m.key && "bg-secondary"
                      )}
                    >
                      <m.icon className="w-4 h-4 shrink-0" />
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
