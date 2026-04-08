import { Phone, MessageCircle, Send, MapPin } from "lucide-react";
import { useState } from "react";
import MessengerSelect from "./MessengerSelect";
import { MessengerType, openMessenger, messengerMeta } from "@/lib/messengerUtils";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [messenger, setMessenger] = useState<MessengerType>("whatsapp");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Заявка с сайта 3D Drive\nИмя: ${formData.name}\nТелефон: ${formData.phone}\nСообщение: ${formData.message}`;
    openMessenger(messenger, text);
  };

  return (
    <section id="contact" className="section-padding bg-gradient-dark">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Контакты</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Остались вопросы? <span className="text-gradient-gold">Свяжитесь с нами</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            {[
              { href: "tel:+79868262332", icon: <Phone className="w-5 h-5 text-primary" />, label: "Телефон", value: "+7 (986) 826 23 32" },
              { href: "https://wa.me/79868262332", icon: <MessageCircle className="w-5 h-5 text-primary" />, label: "WhatsApp", value: "Написать сообщение", external: true },
              { href: "https://t.me/3ddrive", icon: <Send className="w-5 h-5 text-primary" />, label: "Telegram", value: "@3ddrive", external: true },
            ].map((item, i) => (
              <AnimatedItem key={item.label} delay={i * 0.1}>
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 bg-card-gradient gold-border rounded-xl p-5 hover:gold-glow transition-shadow"
                >
                  {item.icon}
                  <div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="font-semibold text-sm">{item.value}</div>
                  </div>
                </a>
              </AnimatedItem>
            ))}
            <AnimatedItem delay={0.3}>
              <div className="flex items-center gap-4 bg-card-gradient gold-border rounded-xl p-5">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Адрес</div>
                  <div className="font-semibold text-sm">Альметьевск (офис откроется в 2026 году)</div>
                </div>
              </div>
            </AnimatedItem>
          </div>

          <AnimatedItem delay={0.2}>
            <form onSubmit={handleSubmit} className="bg-card-gradient gold-border rounded-2xl p-8 space-y-5">
              <h3 className="text-lg font-bold text-gradient-gold">Обратная связь</h3>
              <input
                type="text"
                placeholder="Ваше имя"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <input
                type="tel"
                placeholder="Телефон"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <textarea
                placeholder="Сообщение"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
              />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Отправить через:</label>
                <MessengerSelect value={messenger} onChange={setMessenger} />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Отправить
              </button>
            </form>
          </AnimatedItem>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
