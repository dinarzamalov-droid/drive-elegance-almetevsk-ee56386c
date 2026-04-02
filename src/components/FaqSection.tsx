import { useState } from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedSection, { AnimatedItem } from "./AnimatedSection";

const faqs = [
  {
    q: "Какой залог и когда возвращается?",
    a: "Залог составляет от 25 000 до 30 000 руб. в зависимости от авто. Возвращается сразу после завершения аренды при отсутствии штрафов и повреждений.",
    tags: "залог деньги возврат",
  },
  {
    q: "Могу ли я арендовать авто, если стаж меньше 3 лет?",
    a: "Да. Для этого предусмотрены альтернативные условия: повышенная ставка или увеличенный залог.",
    tags: "стаж опыт водитель",
  },
  {
    q: "Есть ли доставка?",
    a: "Да, доставка автомобиля по городу бесплатная.",
    tags: "доставка подача город",
  },
  {
    q: "Нужно ли заправлять авто?",
    a: "Автомобиль выдается с полным баком. Вернуть нужно с полным.",
    tags: "бензин топливо бак заправка",
  },
  {
    q: "Какие документы нужны для аренды?",
    a: "Паспорт РФ и водительское удостоверение. Для граждан других стран — загранпаспорт и международное ВУ.",
    tags: "документы паспорт права ву",
  },
  {
    q: "Можно ли продлить аренду?",
    a: "Да, позвоните менеджеру минимум за 3 часа до окончания текущего срока. Продление возможно при отсутствии других бронирований.",
    tags: "продление срок",
  },
  {
    q: "Что будет при ДТП?",
    a: "Ремонт за счёт арендатора согласно договору. В любом случае вызывайте ГИБДД и сообщите менеджеру.",
    tags: "дтп авария страховка",
  },
  {
    q: "Какие способы оплаты доступны?",
    a: "Наличные, банковский перевод или онлайн-оплата картой.",
    tags: "оплата карта наличные перевод",
  },
];

const FaqSection = () => {
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((faq) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return faq.q.toLowerCase().includes(s) || faq.a.toLowerCase().includes(s) || faq.tags.toLowerCase().includes(s);
  });

  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Часто задаваемые <span className="text-gradient-gold">вопросы</span>
          </h2>
        </AnimatedSection>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по вопросам..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">Ничего не найдено. Попробуйте другой запрос.</p>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {filtered.map((faq, i) => (
              <AnimatedItem key={faq.q} delay={i * 0.1}>
                <AccordionItem
                  value={`faq-${i}`}
                  className="bg-card-gradient gold-border rounded-xl px-6 border-none"
                >
                  <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline hover:text-primary py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </AnimatedItem>
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
