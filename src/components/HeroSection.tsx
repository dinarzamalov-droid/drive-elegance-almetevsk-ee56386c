import { useState, useEffect, useRef } from "react";
import SmartImage from "@/components/SmartImage";
import { ChevronLeft, ChevronRight, Phone, Send, MessageCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import bmwImg from "@/assets/bmw-420i.jpg";
import rangeroverImg from "@/assets/rangerover-1.jpg";
import lixiangImg from "@/assets/lixiang-1.jpg";

const slides = [rangeroverImg, bmwImg, lixiangImg];
const messengerOptions = [
  { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/79868262332", icon: Phone },
  { key: "telegram", label: "Telegram", href: "https://t.me/3ddrive", icon: Send },
  { key: "max", label: "МАХ", href: "https://max.ru/user/79868262332", icon: MessageCircle },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [messengerOpen, setMessengerOpen] = useState(false);
  const [selectedMessenger, setSelectedMessenger] = useState(messengerOptions[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const handle = (e: MouseEvent) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setMessengerOpen(false); }; document.addEventListener("mousedown", handle); return () => document.removeEventListener("mousedown", handle); }, []);
  useEffect(() => { const timer = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000); return () => clearInterval(timer); }, []);

  return <section className="relative h-screen overflow-hidden bg-[#0b0f14]">
    {slides.map((src, i) => <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: current === i ? 1 : 0 }}><SmartImage src={src} alt="3D Drive — премиальный автомобиль" className="w-full h-full object-cover saturate-[0.72] contrast-[1.12] brightness-[0.82]" style={{ animation: current === i ? "heroZoom 9s ease-out forwards" : "none" }} width={1920} height={1080} priority={i === 0} decoding={i === 0 ? "sync" : "async"} /></div>)}
    <div className="absolute inset-0 bg-gradient-to-r from-[#070b10]/95 via-[#101722]/55 to-[#7b8794]/10" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-[#0a1018]/45" />
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent" />
    <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-32 container mx-auto px-4"><div className="max-w-3xl">
      <p className="text-slate-300 font-semibold text-sm md:text-base tracking-[0.24em] uppercase mb-4 animate-fade-up">3D Drive · Альметьевск</p>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up-delay-1 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">Премиальная аренда <span className="bg-gradient-to-r from-slate-100 via-slate-400 to-slate-200 bg-clip-text text-transparent">автомобилей</span></h1>
      <p className="text-lg md:text-xl text-slate-200 max-w-xl mb-8 animate-fade-up-delay-2">Статус. Свобода. Безупречный сервис.</p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-up-delay-3"><a href="#booking" className="bg-gradient-to-r from-slate-200 via-slate-400 to-slate-200 text-slate-950 px-8 py-4 rounded-lg text-base font-bold hover:brightness-110 transition text-center">Забронировать авто</a><div className="relative" ref={dropdownRef}><div className="flex"><a href={selectedMessenger.href} target="_blank" rel="noopener noreferrer" className="flex-1 border border-slate-400/40 text-white px-6 py-4 rounded-l-lg text-base font-medium hover:border-slate-200/70 transition-colors flex items-center justify-center gap-2"><selectedMessenger.icon className="w-5 h-5 shrink-0" />Написать в {selectedMessenger.label}</a><button onClick={() => setMessengerOpen(!messengerOpen)} className="border border-l-0 border-slate-400/40 text-white px-3 py-4 rounded-r-lg"><ChevronDown className={cn("w-4 h-4 transition-transform", messengerOpen && "rotate-180")} /></button></div>{messengerOpen && <div className="absolute bottom-full mb-2 left-0 w-full bg-card border border-border rounded-lg shadow-xl overflow-hidden z-30">{messengerOptions.map((m) => <button key={m.key} onClick={() => { setSelectedMessenger(m); setMessengerOpen(false); }} className={cn("w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors text-foreground", selectedMessenger.key === m.key && "bg-secondary")}><m.icon className="w-4 h-4" />{m.label}</button>)}</div>}</div></div>
    </div></div>
    <div className="absolute bottom-8 right-8 z-10 flex gap-2"><button onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)} className="w-10 h-10 rounded-full border border-slate-400/40 flex items-center justify-center text-slate-300 hover:border-white hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button><button onClick={() => setCurrent((p) => (p + 1) % slides.length)} className="w-10 h-10 rounded-full border border-slate-400/40 flex items-center justify-center text-slate-300 hover:border-white hover:text-white transition-colors"><ChevronRight className="w-5 h-5" /></button></div>
  </section>;
};
export default HeroSection;
