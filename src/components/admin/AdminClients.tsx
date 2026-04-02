import { useState } from "react";
import { Search, UserX, UserCheck, Crown } from "lucide-react";
import type { Client, Booking } from "./types";
import { listStatusLabels } from "./types";

interface Props {
  clients: Client[];
  bookings: Booking[];
  onUpdateClient: (id: string, data: Record<string, unknown>) => void;
}

const AdminClients = ({ clients, bookings, onUpdateClient }: Props) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.last_name.toLowerCase().includes(q) || c.first_name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
  });

  const clientBookings = selected ? bookings.filter(b => b.phone === selected.phone) : [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Поиск по имени, телефону, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Клиент</th>
              <th className="text-left px-4 py-3 font-semibold">Телефон</th>
              <th className="text-left px-4 py-3 font-semibold">Email</th>
              <th className="text-center px-4 py-3 font-semibold">Уровень</th>
              <th className="text-right px-4 py-3 font-semibold">Потрачено</th>
              <th className="text-right px-4 py-3 font-semibold">Бонусы</th>
              <th className="text-center px-4 py-3 font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Нет клиентов. Нажмите «Синхронизировать» для импорта из бронирований.</td></tr>
            ) : filtered.map((c) => (
              <tr key={c.id} onClick={() => setSelected(c)} className="border-t border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                <td className="px-4 py-3 font-medium">{c.last_name} {c.first_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.loyalty_level === "VIP" ? "bg-primary/20 text-primary" : c.loyalty_level === "ПРЕМИУМ" ? "bg-yellow-500/20 text-yellow-400" : "bg-secondary text-muted-foreground"}`}>
                    {c.loyalty_level}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">{c.total_spent.toLocaleString("ru-RU")} ₽</td>
                <td className="px-4 py-3 text-right">{c.bonus_balance.toLocaleString("ru-RU")}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.list_status === "black" ? "bg-destructive/20 text-destructive" : c.list_status === "white" ? "bg-green-500/20 text-green-400" : "bg-secondary text-muted-foreground"}`}>
                    {listStatusLabels[c.list_status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Client detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{selected.last_name} {selected.first_name}</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-secondary">✕</button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{selected.loyalty_level}</div>
                <div className="text-xs text-muted-foreground">Уровень</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{selected.bonus_balance}</div>
                <div className="text-xs text-muted-foreground">Бонусы</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{selected.total_rentals}</div>
                <div className="text-xs text-muted-foreground">Аренд</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <select value={selected.loyalty_level} onChange={(e) => { onUpdateClient(selected.id, { loyalty_level: e.target.value }); setSelected({ ...selected, loyalty_level: e.target.value }); }} className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                  <option value="СВОБОДА">СВОБОДА</option>
                  <option value="ПРЕМИУМ">ПРЕМИУМ</option>
                  <option value="VIP">VIP</option>
                </select>
                <select value={selected.list_status} onChange={(e) => { onUpdateClient(selected.id, { list_status: e.target.value }); setSelected({ ...selected, list_status: e.target.value }); }} className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm">
                  <option value="normal">Обычный</option>
                  <option value="white">Белый список</option>
                  <option value="black">Чёрный список</option>
                </select>
              </div>
            </div>

            {clientBookings.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-2">История аренд</h3>
                <div className="space-y-2">
                  {clientBookings.slice(0, 10).map((b) => (
                    <div key={b.id} className="flex justify-between items-center bg-secondary/50 rounded-lg p-2.5 text-sm">
                      <div>
                        <span className="font-medium">{b.car_label}</span>
                        <span className="text-muted-foreground ml-2">{b.date_from} — {b.date_to}</span>
                      </div>
                      <span className="font-medium">{b.total_cost.toLocaleString("ru-RU")} ₽</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
