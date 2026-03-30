import { Phone, MessageCircle, Send, MapPin } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Заявка с сайта 3D Drive%0AИмя: ${formData.name}%0AТелефон: ${formData.phone}%0AСообщение: ${formData.message}`;
    window.open(`https://wa.me/79868262332?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="section-padding bg-gradient-dark">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Контакты</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Остались вопросы? <span className="text-gradient-gold">Свяжитесь с нами</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            <a href="tel:+79868262332" className="flex items-center gap-4 bg-card-gradient gold-border rounded-xl p-5 hover:gold-glow transition-shadow">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Телефон</div>
                <div className="font-semibold text-sm">+7 (986) 826 23 32</div>
              </div>
            </a>
            <a href="https://wa.me/79868262332" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-card-gradient gold-border rounded-xl p-5 hover:gold-glow transition-shadow">
              <MessageCircle className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">WhatsApp</div>
                <div className="font-semibold text-sm">Написать сообщение</div>
              </div>
            </a>
            <a href="https://t.me/3ddrive" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-card-gradient gold-border rounded-xl p-5 hover:gold-glow transition-shadow">
              <Send className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Telegram</div>
                <div className="font-semibold text-sm">@3ddrive</div>
              </div>
            </a>
            <div className="flex items-center gap-4 bg-card-gradient gold-border rounded-xl p-5">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Адрес</div>
                <div className="font-semibold text-sm">Альметьевск (офис откроется в 2026 году)</div>
              </div>
            </div>
          </div>

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
            <button
              type="submit"
              className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Отправить
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
