import bmwImg from "@/assets/bmw-420i.jpg";
import porscheImg from "@/assets/porsche-macan.jpg";
import mercedesImg from "@/assets/mercedes-glb.jpg";

const cars = [
  {
    name: "BMW 420i",
    image: bmwImg,
    price: "14 000",
    deposit: "30 000",
    specs: "245 л.с., 0-100 за 5,8 сек, купе",
    description: "Динамика, статус, идеален для свадеб и фотосессий",
  },
  {
    name: "Porsche Macan",
    image: porscheImg,
    price: "12 000",
    deposit: "25 000",
    specs: "252 л.с., полный привод, компактный SUV + stage 1",
    description: "Статус и уверенность в любых дорожных условиях",
  },
  {
    name: "Mercedes GLB",
    image: mercedesImg,
    price: "11 000",
    deposit: "25 000",
    specs: "5 мест, 150 л.с., просторный салон",
    description: "Комфорт для семьи или деловой поездки",
  },
];

const FleetSection = () => {
  return (
    <section id="fleet" className="section-padding">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm tracking-widest uppercase mb-4">Автопарк</p>
          <h2 className="text-3xl md:text-5xl font-bold">Выберите свой <span className="text-gradient-gold">стиль</span></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.name}
              className="group bg-card-gradient gold-border rounded-2xl overflow-hidden hover:gold-glow transition-all duration-500"
            >
              <div className="relative overflow-hidden h-56 md:h-64">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  width={1920}
                  height={1080}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold">{car.name}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-4">{car.description}</p>
                <p className="text-muted-foreground text-xs mb-5">{car.specs}</p>
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <span className="text-xs text-muted-foreground">от</span>
                    <span className="text-2xl font-bold text-gradient-gold ml-1">{car.price}</span>
                    <span className="text-xs text-muted-foreground ml-1">руб./сутки</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground">Залог: </span>
                    <span className="text-sm font-semibold text-foreground">{car.deposit} ₽</span>
                  </div>
                </div>
                <a
                  href="https://wa.me/79868262332"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gradient-gold text-primary-foreground text-center py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Забронировать
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FleetSection;
