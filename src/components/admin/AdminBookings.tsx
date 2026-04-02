import { format } from "date-fns";
import { X, Search, Download } from "lucide-react";
import { useState } from "react";
import type { Booking } from "./types";
import { statusLabels, methodLabels, paymentLabels } from "./types";

interface Props {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: string) => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2 mt-2">{title}</h3>
    <div className="bg-secondary/50 rounded-lg p-3 space-y-1.5">{children}</div>
  </div>
);

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <span className={`text-right ${bold ? "font-bold" : ""}`}>{value}</span>
  </div>
);

const AdminBookings = ({ bookings, onUpdateStatus }: Props) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return !q || b.last_name.toLowerCase().includes(q) || b.first_name.toLowerCase().includes(q) || b.car_label.toLowerCase().includes(q) || b.phone.includes(q) || b.email.toLowerCase().includes(q);
  });

  const exportCsv = () => {
    if (filtered.length === 0) return;
    const headers = ["Дата создания","Фамилия","Имя","Телефон","Email","Авто","Дата начала","Дата окончания","Дней","Сумма","Предоплата","Залог","Оплата","Статус","Промокод","Город","Мессенджер"];
    const rows = filtered.map((b) => [
      b.created_at, b.last_name, b.first_name, b.phone, b.email, b.car_label,
      b.date_from, b.date_to, b.days, b.total_cost, b.prepay, b.deposit,
      methodLabels[b.payment_method] || b.payment_method,
      statusLabels[b.status] || b.status,
      b.promo_code || "", b.city, b.preferred_messenger || "",
    ]);
    const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Поиск по имени, авто, телефону..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
        </div>
        <button onClick={exportCsv} disabled={filtered.length === 0} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50">
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Дата</th>
              <th className="text-left px-4 py-3 font-semibold">Клиент</th>
              <th className="text-left px-4 py-3 font-semibold">Авто</th>
              <th className="text-left px-4 py-3 font-semibold">Период</th>
              <th className="text-right px-4 py-3 font-semibold">Сумма</th>
              <th className="text-center px-4 py-3 font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Нет бронирований</td></tr>
            ) : filtered.map((b) => (
              <tr key={b.id} onClick={() => setSelected(b)} className="border-t border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{format(new Date(b.created_at), "dd.MM.yy HH:mm")}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{b.last_name} {b.first_name}</div>
                  <div className="text-xs text-muted-foreground">{b.phone}</div>
                </td>
                <td className="px-4 py-3 font-medium">{b.car_label}</td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{b.date_from} — {b.date_to} ({b.days} д.)</td>
                <td className="px-4 py-3 text-right font-medium">{b.total_cost.toLocaleString("ru-RU")} ₽</td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <select value={b.status} onChange={(e) => onUpdateStatus(b.id, e.target.value)} className={`px-2 py-1 rounded-full text-xs font-medium border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${b.status === "new" ? "bg-primary/20 text-primary" : b.status === "confirmed" ? "bg-green-500/20 text-green-400" : b.status === "cancelled" ? "bg-destructive/20 text-destructive" : "bg-blue-500/20 text-blue-400"}`}>
                    <option value="new">Новая</option>
                    <option value="confirmed">Подтверждена</option>
                    <option value="completed">Завершена</option>
                    <option value="cancelled">Отменена</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Бронирование #{selected.id.slice(0, 8)}</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <Section title="Клиент">
                <Row label="ФИО" value={`${selected.last_name} ${selected.first_name} ${selected.middle_name || ""}`} />
                <Row label="Телефон" value={selected.phone} />
                <Row label="Email" value={selected.email} />
              </Section>
              <Section title="Автомобиль и даты">
                <Row label="Автомобиль" value={selected.car_label} />
                <Row label="Период" value={`${selected.date_from} — ${selected.date_to} (${selected.days} д.)`} />
                <Row label="Город" value={selected.city} />
              </Section>
              <Section title="Финансы">
                <Row label="Итого" value={`${selected.total_cost.toLocaleString("ru-RU")} ₽`} bold />
                <Row label="Предоплата" value={`${selected.prepay.toLocaleString("ru-RU")} ₽`} />
                <Row label="Остаток" value={`${selected.remaining.toLocaleString("ru-RU")} ₽`} />
                <Row label="Залог" value={`${selected.deposit.toLocaleString("ru-RU")} ₽`} />
                <Row label="Оплата" value={methodLabels[selected.payment_method] || selected.payment_method} />
              </Section>
              <Section title="Статус">
                <Row label="Создано" value={format(new Date(selected.created_at), "dd.MM.yyyy HH:mm")} />
                <Row label="Статус" value={statusLabels[selected.status] || selected.status} />
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
