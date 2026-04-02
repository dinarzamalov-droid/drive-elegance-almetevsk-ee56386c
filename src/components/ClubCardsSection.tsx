import { useState } from "react";
import { Crown, Star, Zap, Check, X } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ClubCard {
  id: string;
  title: string;
  price: string;
  icon: typeof Crown;
  accent: boolean;
  benefits: string[];
  modalDetails: {
    conditions: string[];
    privileges: string[];
    duration: string;
  };
}

const cards: ClubCard[] = [
  {
    id: "freedom",
    title: "СВОБОДА",
    price: "Бесплатно",
    icon: Zap,
    accent: false,
    benefits: [
      "Бонус 1% от каждой аренды",
      "Скидка 5% на вторую аренду",
      "Бессрочная карта",
    ],
    modalDetails: {
      conditions: [
        "Выдаётся автоматически после первой аренды",
        "Без оплаты, без обязательств",
      ],
      privileges: [
        "Накопительный бонус 1% от стоимости каждой аренды",
        "Скидка 5% на вторую и последующие аренды",
        "Доступ к акциям и спецпредложениям для участников клуба",
        "Уведомления о новых автомобилях в парке",
      ],
      duration: "Бессрочно",
    },
  },
  {
    id: "premium",
    title: "ПРЕМИУМ",
    price: "5 000 ₽/год",
    icon: Star,
    accent: true,
    benefits: [
      "Скидка 10% на все аренды",
      "Приоритетное бронирование",
      "Бесплатная доставка авто",
    ],
    modalDetails: {
      conditions: [
        "Оплата: 5 000 руб./год",
        "Или бесплатно после 5 аренд в течение 12 месяцев",
      ],
      privileges: [
        "Скидка 10% на все аренды",
        "Залог снижен на 50%",
        "Приоритетное бронирование",
        "Бесплатная доставка авто",
        "Бесплатная химчистка после каждой 5-й аренды",
        "Отдельный менеджер в WhatsApp 24/7",
      ],
      duration: "12 месяцев с момента активации",
    },
  },
  {
    id: "vip",
    title: "VIP",
    price: "15 000 ₽/год",
    icon: Crown,
    accent: false,
    benefits: [
      "Скидка 15% на все аренды",
      "Залог 0 ₽",
      "Безлимитный пробег",
      "Личный консьерж",
      "Доступ к новинкам первым",
    ],
    modalDetails: {
      conditions: [
        "Оплата: 15 000 руб./год",
        "Или бесплатно после 10 аренд в течение 12 месяцев",
      ],
      privileges: [
        "Скидка 15% на все аренды",
        "Залог 0 ₽ — полное доверие",
        "Безлимитный пробег включён",
        "Личный консьерж-менеджер",
        "Приоритетный доступ к новым автомобилям",
        "Бесплатная доставка и возврат в любое время",
        "Бесплатная химчистка после каждой аренды",
        "Приглашения на закрытые мероприятия 3D Drive",
      ],
      duration: "12 месяцев с момента активации",
    },
  },
];

const ClubCardsSection = () => {
  const [selectedCard, setSelectedCard] = useState<ClubCard | null>(null);

  const handleOrder = (card: ClubCard) => {
    const text = encodeURIComponent(
      `Здравствуйте! Хочу оформить клубную карту «${card.title}» от 3D Drive.`
    );
    window.open(`https://wa.me/79868262332?text=${text}`, "_blank");
  };

  return (
    <section id="club" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            Клубные карты
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Больше чем <span className="text-gradient-gold">скидки</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Становитесь частью премиального клуба и получайте привилегии, которые делают аренду ещё комфортнее
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  className={cn(
                    "relative flex flex-col rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02]",
                    card.accent
                      ? "bg-gradient-to-br from-primary/15 to-primary/5 border-primary/40 shadow-lg shadow-primary/10"
                      : "bg-card-gradient border-border"
                  )}
                >
                  {card.accent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                      Популярный
                    </div>
                  )}

                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                      card.accent ? "bg-primary/20" : "bg-secondary"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", card.accent ? "text-primary" : "text-muted-foreground")} />
                  </div>

                  <h3 className="text-lg font-bold tracking-wider text-foreground mb-1">
                    {card.title}
                  </h3>
                  <p className="text-gradient-gold text-xl font-bold mb-5">{card.price}</p>

                  <ul className="space-y-3 flex-1 mb-6">
                    {card.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleOrder(card)}
                      className={cn(
                        "w-full py-3 rounded-lg text-sm font-semibold transition-all",
                        card.accent
                          ? "bg-gradient-gold text-primary-foreground hover:opacity-90"
                          : "border border-primary text-primary hover:bg-primary/10"
                      )}
                    >
                      Оформить
                    </button>
                    <button
                      onClick={() => setSelectedCard(card)}
                      className="w-full py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Подробнее →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedCard} onOpenChange={(open) => !open && setSelectedCard(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          {selectedCard && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Клубная карта «<span className="text-gradient-gold">{selectedCard.title}</span>»
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Условия получения</h4>
                  <ul className="space-y-1.5">
                    {selectedCard.modalDetails.conditions.map((c) => (
                      <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Привилегии</h4>
                  <ul className="space-y-1.5">
                    {selectedCard.modalDetails.privileges.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm border-t border-border pt-3">
                  <span className="text-muted-foreground">Срок действия</span>
                  <span className="text-foreground font-medium">{selectedCard.modalDetails.duration}</span>
                </div>

                <button
                  onClick={() => {
                    handleOrder(selectedCard);
                    setSelectedCard(null);
                  }}
                  className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Оформить карту
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ClubCardsSection;
