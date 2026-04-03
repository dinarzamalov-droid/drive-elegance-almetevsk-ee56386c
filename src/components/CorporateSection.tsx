import { useState } from "react";
import { Building2, FileText, Send } from "lucide-react";
import MessengerSelect from "./MessengerSelect";
import { MessengerType, openMessenger } from "@/lib/messengerUtils";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";

const CorporateSection = () => {
  const [form, setForm] = useState({
    company: "",
    inn: "",
    contact: "",
    phone: "",
    email: "",
    needDocs: false,
    deferred: false,
    message: "",
  });
  const [messenger, setMessenger] = useState<MessengerType>("whatsapp");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.contact.trim() || !form.phone.trim()) return;

    const docsLine = form.needDocs ? "Нужны закрывающие документы" : "";
    const deferredLine = form.deferred ? "Нужна отсрочка платежа" : "";
    const extras = [docsLine, deferredLine].filter(Boolean).join(", ");

    const text =
      `Корпоративная заявка с сайта 3D Drive\n\nКомпания: ${form.company}\nИНН: ${form.inn || "не указан"}\nКонтактное лицо: ${form.contact}\nТелефон: ${form.phone}\nEmail: ${form.email || "не указан"}${extras ? `\n\n${extras}` : ""}${form.message ? `\n\nСообщение: ${form.message}` : ""}`
    ;
    openMessenger(messenger, text);
  };

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <section id="corporate" className="section-padding bg-gradient-dark">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            Для бизнеса
          </p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Корпоративным <span className="text-gradient-gold">клиентам</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm md:text-base">
            Долгосрочные контракты, индивидуальные условия, отсрочка платежа и закрывающие документы.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Benefits */}
          <AnimatedItem delay={0}>
            <div className="space-y-6">
              {[
                {
                  icon: Building2,
                  title: "Индивидуальные условия",
                  desc: "Гибкие тарифы для корпоративных клиентов с фиксированной ежемесячной ставкой.",
                },
                {
                  icon: FileText,
                  title: "Закрывающие документы",
                  desc: "Акты, счёт-фактуры, договоры — всё для вашей бухгалтерии.",
                },
                {
                  icon: Send,
                  title: "Быстрое оформление",
                  desc: "Коммерческое предложение в течение 1 часа. Договор — за 1 день.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-card-gradient gold-border rounded-xl p-6 flex gap-4"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </AnimatedItem>

          {/* Form */}
          <AnimatedItem delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="bg-card-gradient gold-border rounded-2xl p-6 sm:p-8 space-y-5"
            >
              <h3 className="text-lg font-bold text-gradient-gold">Запросить КП</h3>

              <input
                type="text"
                required
                placeholder="Название компании *"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="ИНН"
                value={form.inn}
                onChange={(e) => setForm({ ...form, inn: e.target.value })}
                className={inputClass}
              />
              <input
                type="text"
                required
                placeholder="Контактное лицо *"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className={inputClass}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="tel"
                  required
                  placeholder="Телефон *"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="space-y-3">
                {[
                  { key: "needDocs" as const, label: "Нужны закрывающие документы" },
                  { key: "deferred" as const, label: "Нужна отсрочка платежа" },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form[opt.key]}
                      onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        form[opt.key] ? "bg-primary border-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {form[opt.key] && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{opt.label}</span>
                  </label>
                ))}
              </div>

              <textarea
                placeholder="Комментарий"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClass} resize-none`}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Отправить через:</label>
                <MessengerSelect value={messenger} onChange={setMessenger} />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Запросить коммерческое предложение
              </button>
            </form>
          </AnimatedItem>
        </div>
      </div>
    </section>
  );
};

export default CorporateSection;
