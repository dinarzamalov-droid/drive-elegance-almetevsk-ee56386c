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
  },
  {
    q: "Могу ли я арендовать авто, если стаж меньше 3 лет?",
    a: "Да. Для этого предусмотрены альтернативные условия: повышенная ставка или увеличенный залог.",
  },
  {
    q: "Есть ли доставка?",
    a: "Да, доставка автомобиля по городу бесплатная.",
  },
  {
    q: "Нужно ли заправлять авто?",
    a: "Автомобиль выдается с полным баком. Вернуть нужно с полным.",
  },
];

const FaqSection = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">FAQ</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Часто задаваемые <span className="text-gradient-gold">вопросы</span>
          </h2>
        </AnimatedSection>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AnimatedItem key={i} delay={i * 0.1}>
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
      </div>
    </section>
  );
};

export default FaqSection;
