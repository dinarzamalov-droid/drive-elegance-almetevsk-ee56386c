import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, LogOut, RefreshCw, Search, Download, X, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Booking {
  id: string;
  car_label: string;
  car_value: string;
  date_from: string;
  date_to: string;
  days: number;
  daily_rate: number;
  extras_cost: number;
  total_cost: number;
  prepay: number;
  remaining: number;
  deposit: number;
  last_name: string;
  first_name: string;
  middle_name: string | null;
  phone: string;
  email: string;
  passport_series: string | null;
  passport_number: string | null;
  passport_date: string | null;
  passport_code: string | null;
  license_number: string | null;
  license_date: string | null;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
  city: string;
  delivery_time: string | null;
  age_category: string;
  experience_category: string;
  selected_extras: string[] | null;
  promo_code: string | null;
}

const statusLabels: Record<string, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  completed: "Завершена",
  cancelled: "Отменена",
};

const paymentLabels: Record<string, string> = {
  pending: "Ожидание",
  paid: "Оплачено",
};

const methodLabels: Record<string, string> = {
  cash: "Наличные",
  transfer: "Перевод",
  online: "Онлайн",
};

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [storedPassword, setStoredPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const fetchBookings = async (pwd: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-bookings", {
        body: { password: pwd },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setBookings(data.bookings || []);
    } catch (err: any) {
      toast.error(err.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId: string, status: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-bookings", {
        body: { password: storedPassword, action: "update_status", bookingId, status },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setBookings(data.bookings || []);
      toast.success(`Статус изменён на «${statusLabels[status] || status}»`);
    } catch (err: any) {
      toast.error(err.message || "Ошибка обновления");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-bookings", {
        body: { password },
      });
      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }
      setStoredPassword(password);
      setBookings(data.bookings || []);
      setAuthenticated(true);
      toast.success("Добро пожаловать!");
    } catch (err: any) {
      toast.error(err.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };


  const exportCsv = () => {
    if (filtered.length === 0) return;
    const headers = ["Дата создания","Фамилия","Имя","Телефон","Email","Авто","Дата начала","Дата окончания","Дней","Сумма","Предоплата","Залог","Оплата","Статус","Промокод","Город"];
    const rows = filtered.map((b) => [
      b.created_at, b.last_name, b.first_name, b.phone, b.email, b.car_label,
      b.date_from, b.date_to, b.days, b.total_cost, b.prepay, b.deposit,
      methodLabels[b.payment_method] || b.payment_method,
      statusLabels[b.status] || b.status,
      b.promo_code || "", b.city,
    ]);
    const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV экспортирован");
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      !q ||
      b.last_name.toLowerCase().includes(q) ||
      b.first_name.toLowerCase().includes(q) ||
      b.car_label.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.email.toLowerCase().includes(q)
    );
  });

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[80vh]">
          <form onSubmit={handleLogin} className="bg-card-gradient gold-border rounded-2xl p-8 w-full max-w-sm space-y-6">
            <div className="text-center">
              <Lock className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h1 className="text-2xl font-bold">Админ-панель</h1>
              <p className="text-muted-foreground text-sm mt-1">Введите пароль для доступа</p>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              type="submit"
              disabled={!password || loading}
              className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-gold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? "Проверка..." : "Войти"}
            </button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-2xl font-bold">Бронирования ({bookings.length})</h1>
            <div className="flex gap-2">
              <button
                onClick={exportCsv}
                disabled={filtered.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" /> CSV
              </button>
              <button
                onClick={() => fetchBookings(storedPassword)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Обновить
              </button>
              <button
                onClick={() => { setAuthenticated(false); setPassword(""); setStoredPassword(""); setBookings([]); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Выйти
              </button>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по имени, авто, телефону, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
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
                  <th className="text-right px-4 py-3 font-semibold">Предоплата</th>
                  <th className="text-center px-4 py-3 font-semibold">Оплата</th>
                  <th className="text-center px-4 py-3 font-semibold">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      {loading ? "Загрузка..." : "Нет бронирований"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className="border-t border-border hover:bg-secondary/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {format(new Date(b.created_at), "dd.MM.yy HH:mm")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{b.last_name} {b.first_name}</div>
                        <div className="text-xs text-muted-foreground">{b.phone}</div>
                      </td>
                      <td className="px-4 py-3 font-medium">{b.car_label}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {b.date_from} — {b.date_to} ({b.days} д.)
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {b.total_cost.toLocaleString("ru-RU")} ₽
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {b.prepay.toLocaleString("ru-RU")} ₽
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs">{methodLabels[b.payment_method] || b.payment_method}</span>
                      </td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={b.status}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                            b.status === "new" ? "bg-primary/20 text-primary" :
                            b.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                            b.status === "cancelled" ? "bg-destructive/20 text-destructive" :
                            b.status === "completed" ? "bg-blue-500/20 text-blue-400" :
                            "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <option value="new">Новая</option>
                          <option value="confirmed">Подтверждена</option>
                          <option value="completed">Завершена</option>
                          <option value="cancelled">Отменена</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail modal */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Бронирование #{selected.id.slice(0, 8)}</h2>
                <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <Section title="Клиент">
                  <Row label="ФИО" value={`${selected.last_name} ${selected.first_name} ${selected.middle_name || ""}`} />
                  <Row label="Телефон" value={selected.phone} />
                  <Row label="Email" value={selected.email} />
                  <Row label="Паспорт" value={selected.passport_series && selected.passport_number ? `${selected.passport_series} ${selected.passport_number}` : "—"} />
                  {selected.passport_date && <Row label="Дата выдачи" value={selected.passport_date} />}
                  {selected.passport_code && <Row label="Код подразделения" value={selected.passport_code} />}
                  <Row label="ВУ" value={selected.license_number || "—"} />
                  {selected.license_date && <Row label="Дата выдачи ВУ" value={selected.license_date} />}
                </Section>

                <Section title="Автомобиль и даты">
                  <Row label="Автомобиль" value={selected.car_label} />
                  <Row label="Период" value={`${selected.date_from} — ${selected.date_to} (${selected.days} д.)`} />
                  <Row label="Город" value={selected.city} />
                  {selected.delivery_time && <Row label="Время подачи" value={selected.delivery_time} />}
                  <Row label="Возраст" value={selected.age_category} />
                  <Row label="Стаж" value={selected.experience_category} />
                  {selected.selected_extras && selected.selected_extras.length > 0 && (
                    <Row label="Опции" value={selected.selected_extras.join(", ")} />
                  )}
                </Section>

                <Section title="Финансы">
                  <Row label="Суточная ставка" value={`${selected.daily_rate.toLocaleString("ru-RU")} ₽`} />
                  {selected.extras_cost > 0 && <Row label="Доп. опции" value={`${selected.extras_cost.toLocaleString("ru-RU")} ₽`} />}
                  <Row label="Итого" value={`${selected.total_cost.toLocaleString("ru-RU")} ₽`} bold />
                  <Row label="Предоплата" value={`${selected.prepay.toLocaleString("ru-RU")} ₽`} />
                  <Row label="Остаток" value={`${selected.remaining.toLocaleString("ru-RU")} ₽`} />
                  <Row label="Залог" value={`${selected.deposit.toLocaleString("ru-RU")} ₽`} />
                  {selected.promo_code && <Row label="Промокод" value={selected.promo_code} />}
                  <Row label="Способ оплаты" value={methodLabels[selected.payment_method] || selected.payment_method} />
                  <Row label="Статус оплаты" value={paymentLabels[selected.payment_status] || selected.payment_status} />
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
      <Footer />
    </div>
  );
};

export default AdminPage;
