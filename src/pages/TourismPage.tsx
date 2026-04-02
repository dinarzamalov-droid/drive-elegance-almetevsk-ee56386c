import { MapPin, Clock, Car, Landmark, Compass, Calendar, Factory, ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      "Сквер Каракуз со скульптурой Даши Намдакова",
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
  { icon: "🕌", title: "Соборная мечеть имени Ризы Фахретдина", desc: "Религиозно-просветительский центр с библиотекой, музеем и халяль-рестораном." },
  { icon: "🏢", title: "Башня «Татнефть»", desc: "Узнаваемый силуэт с волнообразным фасадом из чёрного стекла." },
  { icon: "🎨", title: "Картинная галерея", desc: "Более 800 м² выставочных залов во Дворце культуры «Нефтяник»." },
  { icon: "🧪", title: "Общественный центр «Алмет»", desc: "Научно-развлекательный центр, выставки и интерактивный «Альмониум»." },
  { icon: "🌳", title: "Сквер Каракуз", desc: "Скульптура Даши Намдакова, экотропа и аллея яблонь." },
  { icon: "🏊", title: "Городской пляж", desc: "Белоснежный песок, скалодром, верёвочный парк." },
  { icon: "🎭", title: "Татарский драматический театр", desc: "Архитектурно уникальное здание с классикой и экспериментами." },
  { icon: "🖼️", title: "«Сказки о золотых яблоках»", desc: "Музей под открытым небом — муралы и арт-объекты по всему городу." },
  { icon: "🏺", title: "Акташский провал", desc: "Самое глубокое озеро республики — 28 метров. Памятник природы." },
  { icon: "⛲", title: "Памятник нефти", desc: "Скульптура в честь трёхмиллиардной тонны нефти." },
];

const events = [
  { period: "Ежегодно", name: "Этнокультурный фестиваль «Каракуз»", place: "Городской парк" },
  { period: "Лето", name: "Фестиваль уличного искусства «Сказки о золотых яблоках»", place: "Улицы города" },
  { period: "Сезонно", name: "Концерты и театральные постановки", place: "Драматический театр, центр «Алмет»" },
  { period: "Выходные", name: "Научные шоу и мастер-классы", place: "Центр «Альметрика»" },
];

const usefulLinks = [
  "🏨 Отели Альметьевска",
  "🍽️ Рестораны и кафе",
  "🚌 Транспорт и такси",
  "🎟️ Афиша и билеты",
  "🗺️ Карта достопримечательностей",
  "📷 Фотолокации города",
];

const TourismPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl space-y-12">

          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">🚗 Альметьевск для туристов</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Исследуйте город на премиальном автомобиле — свобода, комфорт и незабываемые впечатления
            </p>
          </div>

          {/* Quote */}
          <div className="bg-card-gradient gold-border rounded-2xl p-8 text-center">
            <p className="text-lg italic text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              «Альметьевск — идеальный город для однодневной прогулки. Очень уютный, с широкими аллеями
              и каскадом прудов в центре. Ты не торопишься, а наслаждаешься мелкими радостями жизни»
            </p>
            <p className="text-sm text-muted-foreground mt-4">— Из отзыва путешественницы Дарьи</p>
          </div>

          {/* Routes */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <Compass className="w-6 h-6 text-primary" /> Готовые маршруты на автомобиле
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {routes.map((route) => (
                <div key={route.title} className="bg-card-gradient gold-border rounded-2xl p-6 space-y-4 hover:scale-[1.02] transition-transform">
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
          </section>

          {/* Sights */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <Landmark className="w-6 h-6 text-primary" /> Что посмотреть в Альметьевске
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {sights.map((s) => (
                <div key={s.title} className="flex gap-4 p-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/30 transition-colors">
                  <span className="text-3xl shrink-0">{s.icon}</span>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{s.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Guide */}
          <section className="bg-card-gradient gold-border rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-2">🧭 Гид по Альметьевску</h2>
            <p className="text-muted-foreground text-sm mb-6">Воспользуйтесь цифровыми помощниками, чтобы не пропустить ничего интересного.</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: "📱", title: "Приложение «Алга»", desc: "Онлайн-гид с интерактивной картой и тематическими экскурсиями." },
                { icon: "🗣️", title: "Экскурсия с гидом", desc: "Проверенные гиды покажут город с необычной стороны." },
                { icon: "🎧", title: "Аудиогиды", desc: "Самостоятельные прогулки с аудиосопровождением." },
              ].map((g) => (
                <div key={g.title} className="bg-secondary/50 rounded-xl p-5 text-center space-y-2">
                  <span className="text-4xl">{g.icon}</span>
                  <h4 className="font-semibold text-sm">{g.title}</h4>
                  <p className="text-xs text-muted-foreground">{g.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Events */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-primary" /> Афиша мероприятий
            </h2>
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
          </section>

          {/* Industrial tourism */}
          <section className="bg-card-gradient gold-border rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Factory className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div className="space-y-3">
                <h2 className="text-xl font-bold">Промышленный туризм: Ромашкинское месторождение</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Альметьевск — сердце нефтяного Татарстана. Ромашкинское месторождение входит в двадцатку
                  крупнейших в мире. Экскурсии на нефтепромыслы становятся всё более популярными среди
                  путешественников, интересующихся технологиями и историей освоения недр.
                </p>
              </div>
            </div>
          </section>

          {/* Useful links */}
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <ExternalLink className="w-6 h-6 text-primary" /> Полезные ссылки
            </h2>
            <div className="flex flex-wrap gap-3">
              {usefulLinks.map((link) => (
                <span
                  key={link}
                  className="px-4 py-2.5 rounded-full bg-secondary border border-border text-sm font-medium hover:border-primary/40 transition-colors cursor-default"
                >
                  {link}
                </span>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-gold rounded-2xl p-8 sm:p-10 text-center text-primary-foreground">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Исследуйте Альметьевск на премиальном авто
            </h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto text-sm">
              BMW 420i, Porsche Macan, Mercedes GLB или LiXiang L6 — выберите автомобиль и отправляйтесь в путешествие
            </p>
            <button
              onClick={() => navigate("/booking")}
              className="inline-flex items-center gap-2 bg-background text-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Выбрать автомобиль <ArrowRight className="w-4 h-4" />
            </button>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TourismPage;
