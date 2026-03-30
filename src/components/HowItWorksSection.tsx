const steps = [
  { num: "01", title: "Выбор авто", desc: "Выберите автомобиль на сайте или по телефону" },
  { num: "02", title: "Оформление", desc: "Пришлите фото прав и паспорта, согласуйте условия" },
  { num: "03", title: "Поездка", desc: "Получите авто в идеальном состоянии и наслаждайтесь" },
];

const HowItWorksSection = () => {
  return (
    <section className="section-padding bg-gradient-dark">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Как мы работаем</p>
          <h2 className="text-3xl md:text-5xl font-bold">
            Аренда в <span className="text-gradient-gold">3 шага</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="text-center relative">
              <div className="text-6xl font-black text-gradient-gold opacity-30 mb-4">{s.num}</div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-4 w-8 h-px bg-primary/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
