import { Star, Quote } from "lucide-react";

const reviews = [
  {
    text: "Арендовал BMW 420i на свадьбу. Машина в идеальном состоянии, менеджер привез вовремя, все оформили за 10 минут. Спасибо 3D Drive!",
    author: "Алексей",
    city: "Альметьевск",
  },
  {
    text: "Брал Porsche Macan для деловой встречи. Клиент был впечатлен. Очень доволен сервисом и прозрачными условиями. Рекомендую!",
    author: "Марат",
    city: "Казань",
  },
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Отзывы</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Нам <span className="text-gradient-gold">доверяют</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((r) => (
            <div
              key={r.author}
              className="bg-card-gradient gold-border rounded-2xl p-8 relative hover:gold-glow transition-shadow duration-500"
            >
              <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                «{r.text}»
              </p>
              <div>
                <div className="font-semibold text-sm">{r.author}</div>
                <div className="text-xs text-muted-foreground">{r.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
