import { Crown, Plus, Minus } from "lucide-react";
import { useState } from "react";
import type { Client } from "./types";
import { toast } from "sonner";

interface Props {
  clients: Client[];
  onAddBonus: (clientId: string, amount: number) => void;
}

const AdminLoyalty = ({ clients, onAddBonus }: Props) => {
  const [bonusInput, setBonusInput] = useState<Record<string, string>>({});

  const sortedClients = [...clients].sort((a, b) => b.total_spent - a.total_spent);

  const nextLevel = (c: Client) => {
    if (c.loyalty_level === "VIP") return "Максимальный уровень";
    if (c.loyalty_level === "ПРЕМИУМ") return "VIP";
    return "ПРЕМИУМ";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3 mb-2">
        <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{clients.filter(c => c.loyalty_level === "СВОБОДА").length}</div>
          <div className="text-xs text-muted-foreground">СВОБОДА</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{clients.filter(c => c.loyalty_level === "ПРЕМИУМ").length}</div>
          <div className="text-xs text-muted-foreground">ПРЕМИУМ</div>
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{clients.filter(c => c.loyalty_level === "VIP").length}</div>
          <div className="text-xs text-muted-foreground">VIP</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Клиент</th>
              <th className="text-center px-4 py-3 font-semibold">Уровень</th>
              <th className="text-right px-4 py-3 font-semibold">Потрачено</th>
              <th className="text-right px-4 py-3 font-semibold">Бонусы</th>
              <th className="text-center px-4 py-3 font-semibold">След. уровень</th>
              <th className="text-center px-4 py-3 font-semibold">Начисление</th>
            </tr>
          </thead>
          <tbody>
            {sortedClients.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Нет клиентов</td></tr>
            ) : sortedClients.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{c.last_name} {c.first_name}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.loyalty_level === "VIP" ? "bg-primary/20 text-primary" : c.loyalty_level === "ПРЕМИУМ" ? "bg-yellow-500/20 text-yellow-400" : "bg-secondary text-muted-foreground"}`}>
                    {c.loyalty_level}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{c.total_spent.toLocaleString("ru-RU")} ₽</td>
                <td className="px-4 py-3 text-right font-medium">{c.bonus_balance.toLocaleString("ru-RU")}</td>
                <td className="px-4 py-3 text-center text-muted-foreground text-xs">{nextLevel(c)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-center">
                    <input
                      type="number"
                      placeholder="0"
                      value={bonusInput[c.id] || ""}
                      onChange={(e) => setBonusInput({ ...bonusInput, [c.id]: e.target.value })}
                      className="w-16 text-center bg-secondary border border-border rounded px-1 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={() => {
                        const val = parseInt(bonusInput[c.id]);
                        if (!isNaN(val) && val > 0) { onAddBonus(c.id, val); setBonusInput({ ...bonusInput, [c.id]: "" }); toast.success(`+${val} бонусов`); }
                      }}
                      className="p-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        const val = parseInt(bonusInput[c.id]);
                        if (!isNaN(val) && val > 0) { onAddBonus(c.id, -val); setBonusInput({ ...bonusInput, [c.id]: "" }); toast.success(`-${val} бонусов`); }
                      }}
                      className="p-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLoyalty;
