import { Phone, MessageCircle, Send, MapPin } from "lucide-react";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";

const ContactSection = () => (
  <section id="contact" className="section-padding bg-gradient-dark">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-12"><p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Контакты</p><h2 className="text-3xl md:text-5xl font-bold">Свяжитесь с <span className="text-gradient-gold">3D Drive</span></h2></AnimatedSection>
      <div className="space-y-4 max-w-2xl mx-auto">
        {[
          { href: "tel:+79868262332", icon: <Phone className="w-5 h-5 text-primary" />, label: "Телефон", value: "+7 (986) 826 23 32" },
          { href: "https://wa.me/79868262332", icon: <Phone className="w-5 h-5 text-primary" />, label: "WhatsApp", value: "Написать сообщение", external: true },
          { href: "https://t.me/3ddrive", icon: <Send className="w-5 h-5 text-primary" />, label: "Telegram", value: "@3ddrive", external: true },
          { href: "https://max.ru/user/79868262332", icon: <MessageCircle className="w-5 h-5 text-primary" />, label: "МАХ", value: "Написать сообщение", external: true },
        ].map((item, i) => <AnimatedItem key={item.label} delay={i * 0.1}><a href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined} className="flex items-center gap-4 bg-card-gradient gold-border rounded-xl p-5 hover:gold-glow transition-shadow">{item.icon}<div><div className="text-xs text-muted-foreground">{item.label}</div><div className="font-semibold text-sm">{item.value}</div></div></a></AnimatedItem>)}
        <AnimatedItem delay={0.3}><div className="flex items-center gap-4 bg-card-gradient gold-border rounded-xl p-5"><MapPin className="w-5 h-5 text-primary" /><div><div className="text-xs text-muted-foreground">Адрес</div><div className="font-semibold text-sm">Альметьевск</div></div></div></AnimatedItem>
      </div>
    </div>
  </section>
);
export default ContactSection;
