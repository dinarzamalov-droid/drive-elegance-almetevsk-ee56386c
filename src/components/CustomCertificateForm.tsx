import { useState } from "react";
import { Gift, Check } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import MessengerSelect from "./MessengerSelect";
import { MessengerType, openMessenger } from "@/lib/messengerUtils";
import { cn } from "@/lib/utils";

const presetAmounts = [3000, 5000, 10000, 15000, 20000, 30000, 50000];

const CustomCertificateForm = () => {
  const [amount, setAmount] = useState(5000);
  const [customInput, setCustomInput] = useState("");
  const [giverName, setGiverName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [greeting, setGreeting] = useState("");
  const [delivery, setDelivery] = useState<"email" | "physical">("email");
  const [agreed, setAgreed] = useState(false);
  const [messenger, setMessenger] = useState<MessengerType>("whatsapp");

  const deliveryCost = delivery === "physical" ? 300 : 0;
  const total = amount + deliveryCost;

  const handlePreset = (val: number) => {
    setAmount(val);
    setCustomInput("");
  };

  const handleCustom = (val: string) => {
    setCustomInput(val);
    const num = parseInt(val);
    if (!isNaN(num) && num >= 1000 && num <= 50000) {
      setAmount(num);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !agreed) return;

    const lines = [
      `Заказ подарочного сертификата 3D Drive`,
      ``,
      `Сумма: ${amount.toLocaleString("ru-RU")} ₽`,
      giverName ? `От кого: ${giverName}` : "",
      `Получатель: ${recipientName}`,
      recipientEmail ? `Email: ${recipientEmail}` : "",
      recipientPhone ? `Телефон: ${recipientPhone}` : "",
      greeting ? `Поздравление: ${greeting}` : "",
      `Способ: ${delivery === "email" ? "Электронный (мгновенно)" : "Физический (+300 ₽ доставка)"}`,
      `Итого к оплате: ${total.toLocaleString("ru-RU")} ₽`,
    ]
      .filter(Boolean)
      .join("\n");

    openMessenger(messenger, lines);
  };

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <AnimatedSection delay={0.4}>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-card-gradient gold-border rounded-2xl p-6 sm:p-8 space-y-6 mt-12"
      >
        <div className="text-center mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Gift className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Сертификат на любую сумму</h3>
          <p className="text-muted-foreground text-sm mt-1">
            от 1 000 до 50 000 ₽ — получатель сам выберет авто и дату
          </p>
        </div>

        {/* Amount presets */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Сумма сертификата</label>
          <div className="flex flex-wrap gap-2">
            {presetAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handlePreset(val)}
                className={cn(
                  "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border",
                  amount === val && !customInput
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-secondary border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                )}
              >
                {val.toLocaleString("ru-RU")} ₽
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1000}
            max={50000}
            step={500}
            placeholder="Или введите свою сумму (₽)"
            value={customInput}
            onChange={(e) => handleCustom(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Имя дарителя</label>
            <input
              type="text"
              placeholder="Как подписать сертификат"
              value={giverName}
              onChange={(e) => setGiverName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Имя получателя <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Кому дарим"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Recipient contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email получателя</label>
            <input
              type="email"
              placeholder="Для отправки сертификата"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Телефон получателя</label>
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Greeting */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Текст поздравления</label>
          <textarea
            rows={3}
            placeholder="Напишите личное поздравление — оно будет напечатано на сертификате"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Delivery */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Способ получения</label>
          {(
            [
              {
                value: "email" as const,
                label: "Электронный сертификат",
                desc: "Мгновенно на email",
                extra: "",
              },
              {
                value: "physical" as const,
                label: "Физический сертификат",
                desc: "В подарочной упаковке с доставкой",
                extra: "+300 ₽",
              },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDelivery(opt.value)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200",
                delivery === opt.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/50 hover:border-muted-foreground/40"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  delivery === opt.value ? "border-primary" : "border-muted-foreground/40"
                )}
              >
                {delivery === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <div className="flex-1">
                <span
                  className={cn(
                    "text-sm",
                    delivery === opt.value ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {opt.label}
                </span>
                <span className="text-xs text-muted-foreground ml-2">{opt.desc}</span>
              </div>
              {opt.extra && (
                <span className="text-xs text-muted-foreground whitespace-nowrap">{opt.extra}</span>
              )}
            </button>
          ))}
        </div>

        {/* Total */}
        <div className="bg-secondary/50 rounded-xl p-5 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Номинал сертификата</span>
            <span className="text-foreground">{amount.toLocaleString("ru-RU")} ₽</span>
          </div>
          {deliveryCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Доставка</span>
              <span className="text-foreground">{deliveryCost.toLocaleString("ru-RU")} ₽</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between font-semibold">
            <span className="text-foreground">Итого к оплате</span>
            <span className="text-gradient-gold text-lg">{total.toLocaleString("ru-RU")} ₽</span>
          </div>
        </div>

        {/* Messenger */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Отправить через:</label>
          <MessengerSelect value={messenger} onChange={setMessenger} />
        </div>

        {/* Agreement */}
        <button
          type="button"
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 text-left w-full"
        >
          <div
            className={cn(
              "w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
              agreed ? "bg-primary border-primary" : "border-muted-foreground/40"
            )}
          >
            {agreed && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
          <span className="text-xs text-muted-foreground leading-relaxed">
            Я даю согласие на обработку персональных данных и принимаю условия использования сертификата
          </span>
        </button>

        <button
          type="submit"
          disabled={!agreed || !recipientName.trim()}
          className="w-full bg-gradient-gold text-primary-foreground py-3.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Оформить сертификат
        </button>
      </form>
    </AnimatedSection>
  );
};

export default CustomCertificateForm;
