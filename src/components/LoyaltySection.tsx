import { useState, useEffect } from "react";
import { Crown, Gift, Star, TrendingUp } from "lucide-react";

interface LoyaltyState {
  totalSpent: number;
  rentals: number;
  bonusPoints: number;
}

const levels = [
  { name: "СВОБОДА", minSpent: 0, discount: 0, color: "bg-secondary text-foreground" },
  { name: "ПРЕМИУМ", minSpent: 50000, discount: 5, color: "bg-primary text-primary-foreground" },
  { name: "VIP", minSpent: 150000, discount: 10, color: "bg-gradient-gold text-primary-foreground" },
];

const BONUS_PER_10K = 500;

function getLevel(totalSpent: number) {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalSpent >= levels[i].minSpent) return levels[i];
  }
  return levels[0];
}

function getNextLevel(totalSpent: number) {
  for (const l of levels) {
    if (totalSpent < l.minSpent) return l;
  }
  return null;
}

const LoyaltySection = () => {
  const [state, setState] = useState<LoyaltyState>({ totalSpent: 0, rentals: 0, bonusPoints: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("3ddrive_loyalty");
      if (saved) setState(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (s: LoyaltyState) => {
    setState(s);
    localStorage.setItem("3ddrive_loyalty", JSON.stringify(s));
  };

  const level = getLevel(state.totalSpent);
  const nextLevel = getNextLevel(state.totalSpent);
  const progress = nextLevel
    ? Math.min(100, Math.round(((state.totalSpent - level.minSpent) / (nextLevel.minSpent - level.minSpent)) * 100))
    : 100;

  const addTestRental = () => {
    const amount = 15000;
    const newBonuses = Math.floor(amount / 10000) * BONUS_PER_10K;
    save({
      totalSpent: state.totalSpent + amount,
      rentals: state.rentals + 1,
      bonusPoints: state.bonusPoints + newBonuses,
    });
  };

  const reset = () => save({ totalSpent: 0, rentals: 0, bonusPoints: 0 });

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            <Crown className="w-8 h-8 inline mr-2 text-primary" />
            Программа лояльности
          </h2>
          <p className="text-muted-foreground">Чем чаще арендуете — тем больше преимуществ</p>
        </div>

        <div className="bg-card-gradient gold-border rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Current level */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ваш уровень</p>
              <span className={`inline-block px-4 py-1.5 rounded-full font-bold text-sm ${level.color}`}>
                {level.name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Аренд</p>
              <p className="text-2xl font-bold text-foreground">{state.rentals}</p>
            </div>
          </div>

          {/* Bonuses */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <Gift className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Бонусов</p>
              <p className="text-lg font-bold text-foreground">{state.bonusPoints.toLocaleString("ru-RU")} ₽</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <Star className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-xs text-muted-foreground">Скидка</p>
              <p className="text-lg font-bold text-foreground">{level.discount}%</p>
            </div>
          </div>

          {/* Progress to next level */}
          {nextLevel && (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>До уровня {nextLevel.name}</span>
                <span>{(nextLevel.minSpent - state.totalSpent).toLocaleString("ru-RU")} ₽</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-gold rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Каждые 10 000 ₽ аренды = 500 ₽ бонусов. Бонусы покрывают до 30% стоимости.
          </p>

          {/* Demo buttons */}
          <div className="flex gap-3 justify-center">
            <button onClick={addTestRental} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              ➕ Тестовая аренда
            </button>
            <button onClick={reset} className="px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-foreground transition-colors">
              🔄 Сбросить
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoyaltySection;
