const stats = [
  { value: "3+", label: "года на рынке" },
  { value: "100+", label: "довольных клиентов" },
  { value: "98%", label: "возвратов без штрафов" },
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-gradient-dark">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">О компании</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-gradient-gold">3D Drive</span> — больше чем автопрокат
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Мы создаем культуру премиальной мобильности в Татарстане. Наш парк — это автомобили, которые дарят впечатления:
            BMW 420i для динамичных поездок, Porsche Macan для уверенности, Mercedes GLB для комфорта.
          </p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mt-4">
            Мы не просто выдаем ключи. Мы обеспечиваем прозрачные условия, честные залоги и безупречное состояние каждого авто.
            Наша цель — стать №1 в России, и мы уже на пути к этому.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card-gradient gold-border rounded-xl p-8 text-center hover:gold-glow transition-shadow duration-500"
            >
              <div className="text-4xl md:text-5xl font-bold text-gradient-gold mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm font-medium uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
