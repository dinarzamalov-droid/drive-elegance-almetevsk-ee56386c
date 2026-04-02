import { MapPin, Clock, Car, Landmark, Compass, Calendar, Factory, ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const routes = [
  {
    title: "Сердце нефтяной столицы",
    time: "2–3 часа",
    distance: "10 км",
    description: "Прогулка по главным достопримечательностям центральной части Альметьевска.",
    points: [
      "Площадь Нефтяников — мечеть и храм по соседству",
      "Башня «Татнефть» — архитектурная доминанта города",
      "Общественный центр «Алмет» — сердце современного Альметьевска",
      "Сквер Каракуз — уютная экотропа и зелёная зона",
    ],
  },
  {
    title: "Водная гладь и набережные",
    time: "1–2 часа",
    distance: "5 км",
    description: "Путешествие по обновленным набережным и паркам у воды.",
    points: [
      "Каскад прудов — деревянные мостки и виды на воду",
      "Городское водохранилище («Альметьевское море»)",
      "Современный пляж с резиновой уткой",
      "Эко-парк вдоль реки Бигаш",
    ],
  },
  {
    title: "Парки здоровья и семейного отдыха",
    time: "2–3 часа",
    distance: "8 км",
    description: "Зелёные зоны для всей семьи, не выезжая за город.",
    points: [
      "Парк «Саулык» — зоны здоровья, планетарий, спортплощадки",
      "Городской парк имени 60-летия нефти Татарстана",
      "Сквер «Яшьлек» — интерактивное пространство",
      "Индустриальный сквер со скейт-парком",
    ],
  },
];

const sights = [
  { icon: "🕌", title: "Соборная мечеть", desc: "Религиозно-просветительский центр." },
  { icon: "🏢", title: "Башня «Татнефть»", desc: "Узнаваемый силуэт из чёрного стекла." },
  { icon: "🎨", title: "Картинная галерея", desc: "800 м² выставочных залов." },
  { icon: "🧪", title: "Центр «Алмет»", desc: "Научно-развлекательный центр." },
  { icon: "🌳", title: "Сквер Каракуз", desc: "Скульптура Намдакова и экотропа." },
  { icon: "🏊", title: "Городской пляж", desc: "Белоснежный песок и скалодром." },
];

const events = [
  { period: "Ежегодно", name: "Фестиваль «Каракуз»", place: "Городской парк" },
  { period: "Лето", name: "Фестиваль «Сказки о золотых яблоках»", place: "Улицы города" },
  { period: "Выходные", name: "Научные шоу и мастер-классы", place: "Центр «Альметрика»" },
];

const TourismSection = () => {
  const navigate = useNavigate();

  return (
    <section id="tourism" className="section-padding">
      <div className="container mx-auto max-w-5xl space-y-10">
        <div className="text-center space-y-3">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase">Туристам</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">🚗 Альметьевск для туристов</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Исследуйте город на премиальном автомобиле
          </p>
        </div>

        {/* Routes */}
        <div className="grid gap-6 md:grid-cols-3">
          {routes.map((route) => (
            <div key={route.title} className="bg-card-gradient gold-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {route.time}</span>
                <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /> {route.distance}</span>
              </div>
              <h3 className="text-lg font-semibold">{route.title}</h3>
              <p className="text-sm text-muted-foreground">{route.description}</p>
              <ul className="space-y-2">
                {route.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sights */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sights.map((s) => (
            <div key={s.title} className="flex gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
              <span className="text-3xl shrink-0">{s.icon}</span>
              <div>
                <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Events */}
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.name} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border flex-wrap">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shrink-0">
                {e.period}
              </span>
              <span className="font-medium text-sm flex-1">{e.name}</span>
              <span className="text-xs text-muted-foreground">{e.place}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-gold rounded-2xl p-8 text-center text-primary-foreground">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Исследуйте Альметьевск на премиальном авто</h3>
          <button
            onClick={() => navigate("/booking")}
            className="inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Выбрать автомобиль <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TourismSection;
