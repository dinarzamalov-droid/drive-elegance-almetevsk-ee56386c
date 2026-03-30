import AnimatedSection from "./AnimatedSection";

const PlansSection = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto max-w-3xl">
        <AnimatedSection>
          <div className="bg-card-gradient gold-border rounded-2xl p-8 text-center">
            <h3 className="text-lg font-bold text-gradient-gold mb-4">В планах</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Мы растем. В 2026–2027 году: пополнение парка BMW X5 и 3 Series, запуск детейлинг-центра,
              аренда яхт на Камском море. Следите за новостями.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PlansSection;
