import { Shield, FileCheck, Users, Car } from "lucide-react";

const baseReqs = [
  "Возраст: от 21 года",
  "Стаж вождения: от 3 лет",
  "Залог: от 25 000 до 30 000 руб.",
];

const altOptions = [
  { icon: <Users className="w-5 h-5" />, title: "Повышенная ставка", desc: "+20–50% к суточной стоимости" },
  { icon: <Shield className="w-5 h-5" />, title: "Увеличенный залог", desc: "+10 000–25 000 руб." },
  { icon: <FileCheck className="w-5 h-5" />, title: "Комбинированный", desc: "Умеренное повышение ставки и залога" },
  { icon: <Car className="w-5 h-5" />, title: "С водителем", desc: "+5 000 руб./сутки" },
];

const extras = [
  "Страховка КАСКО — от 1 500 руб./сутки",
  "Безлимитный пробег — от 2 000 руб./сутки",
  "Доставка авто — бесплатно",
];

const TermsSection = () => {
  return (
    <section id="terms" className="section-padding bg-gradient-dark">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Условия аренды</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Гибкие условия <span className="text-gradient-gold">для каждого</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-card-gradient gold-border rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-6 text-gradient-gold">Базовые требования</h3>
            <ul className="space-y-4">
              {baseReqs.map((r) => (
                <li key={r} className="flex items-start gap-3 text-muted-foreground text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card-gradient gold-border rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-6 text-gradient-gold">Альтернативные варианты</h3>
            <div className="space-y-5">
              {altOptions.map((o) => (
                <div key={o.title} className="flex items-start gap-3">
                  <div className="text-primary mt-0.5">{o.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{o.title}</div>
                    <div className="text-xs text-muted-foreground">{o.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card-gradient gold-border rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-6 text-gradient-gold">Дополнительные опции</h3>
            <ul className="space-y-4">
              {extras.map((e) => (
                <li key={e} className="flex items-start gap-3 text-muted-foreground text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsSection;
