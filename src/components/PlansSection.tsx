const PlansSection = () => {
  return (
    <section className="section-padding">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-card-gradient gold-border rounded-2xl p-8">
            <h3 className="text-lg font-bold text-gradient-gold mb-4">В планах</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Мы растем. В 2026–2027 году: пополнение парка BMW X5 и 3 Series, запуск детейлинг-центра,
              аренда яхт на Камском море. Следите за новостями.
            </p>
          </div>
          <div className="bg-card-gradient gold-border rounded-2xl p-8">
            <h3 className="text-lg font-bold text-gradient-gold mb-4">Для бизнеса</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Корпоративным клиентам — долгосрочные контракты, индивидуальные условия, отсрочка платежа.
              Запросите коммерческое предложение.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
