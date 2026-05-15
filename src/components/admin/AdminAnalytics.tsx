import { useMemo } from "react";
import {
  TrendingUp, TrendingDown, Car, Users, CreditCard, BarChart3,
  CalendarDays, Wallet, Trophy, Activity, Percent, Clock,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import type { Booking, FleetCar } from "./types";

interface Props {
  bookings: Booking[];
  fleet: FleetCar[];
}

// Яркая палитра, не зависит от темы — чтобы графики не сливались с фоном
const PALETTE = ["#F97316", "#3B82F6", "#10B981", "#A855F7", "#EAB308", "#EC4899", "#06B6D4", "#EF4444"];
const STATUS_COLORS: Record<string, string> = {
  new: "#3B82F6",
  confirmed: "#10B981",
  completed: "#A855F7",
  cancelled: "#EF4444",
};
const STATUS_LABELS: Record<string, string> = {
  new: "Новые", confirmed: "Подтверждены", completed: "Завершены", cancelled: "Отменены",
};

const monthNames = ["Янв","Фев","Мар","Апр","Май","Июн","Июл","Авг","Сен","Окт","Ноя","Дек"];
const weekdayNames = ["Вс","Пн","Вт","Ср","Чт","Пт","Сб"];

const fmtRub = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;

const tooltipStyle = {
  backgroundColor: "rgba(20,20,28,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

const AdminAnalytics = ({ bookings, fleet }: Props) => {
  const stats = useMemo(() => {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(dayStart); weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    let dayRev = 0, weekRev = 0, monthRev = 0, prevMonthRev = 0, yearRev = 0;
    let dayCount = 0, weekCount = 0, monthCount = 0;
    let confirmedCount = 0, cancelledCount = 0, completedCount = 0;
    let totalDays = 0;

    for (const b of bookings) {
      const d = new Date(b.created_at);
      const cost = b.total_cost || 0;
      if (d >= dayStart) { dayRev += cost; dayCount++; }
      if (d >= weekStart) { weekRev += cost; weekCount++; }
      if (d >= monthStart) { monthRev += cost; monthCount++; }
      if (d >= prevMonthStart && d < prevMonthEnd) prevMonthRev += cost;
      if (d >= yearStart) yearRev += cost;
      if (b.status === "confirmed") confirmedCount++;
      if (b.status === "cancelled") cancelledCount++;
      if (b.status === "completed") completedCount++;
      totalDays += b.days || 0;
    }

    const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "new").length;
    const busyCars = fleet.filter(c => c.status === "busy").length;
    const utilization = fleet.length > 0 ? Math.round((busyCars / fleet.length) * 100) : 0;
    const avgCheck = bookings.length > 0 ? Math.round(yearRev / bookings.length) : 0;
    const avgDays = bookings.length > 0 ? (totalDays / bookings.length).toFixed(1) : "0";
    const conversion = bookings.length > 0 ? Math.round(((confirmedCount + completedCount) / bookings.length) * 100) : 0;
    const cancelRate = bookings.length > 0 ? Math.round((cancelledCount / bookings.length) * 100) : 0;

    // Прогноз: текущая выручка месяца / прошедшие дни * дни в месяце
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const monthForecast = dayOfMonth > 0 ? Math.round((monthRev / dayOfMonth) * daysInMonth) : 0;
    const monthDelta = prevMonthRev > 0 ? Math.round(((monthRev - prevMonthRev) / prevMonthRev) * 100) : 0;

    return {
      dayRev, weekRev, monthRev, prevMonthRev, yearRev, monthForecast, monthDelta,
      dayCount, weekCount, monthCount,
      activeBookings, utilization, avgCheck, avgDays, conversion, cancelRate,
      total: bookings.length,
    };
  }, [bookings, fleet]);

  // Выручка + кол-во по месяцам текущего года
  const monthlyData = useMemo(() => {
    const year = new Date().getFullYear();
    const acc = monthNames.map((name) => ({ name, revenue: 0, count: 0 }));
    for (const b of bookings) {
      const d = new Date(b.created_at);
      if (d.getFullYear() !== year) continue;
      acc[d.getMonth()].revenue += b.total_cost || 0;
      acc[d.getMonth()].count += 1;
    }
    return acc;
  }, [bookings]);

  // Выручка по дням за последние 30 дней
  const dailyData = useMemo(() => {
    const days: { date: string; revenue: number }[] = [];
    const now = new Date();
    const map: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
      days.push({ date: `${d.getDate()}.${String(d.getMonth()+1).padStart(2,"0")}`, revenue: 0 });
    }
    for (const b of bookings) {
      const key = new Date(b.created_at).toISOString().slice(0, 10);
      if (key in map) map[key] += b.total_cost || 0;
    }
    Object.values(map).forEach((v, i) => { days[i].revenue = v; });
    return days;
  }, [bookings]);

  const carData = useMemo(() => {
    const byCar: Record<string, number> = {};
    for (const b of bookings) byCar[b.car_label] = (byCar[b.car_label] || 0) + 1;
    return Object.entries(byCar)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [bookings]);

  const statusData = useMemo(() => {
    const byStatus: Record<string, number> = {};
    for (const b of bookings) byStatus[b.status] = (byStatus[b.status] || 0) + 1;
    return Object.entries(byStatus).map(([name, value]) => ({
      name: STATUS_LABELS[name] || name, key: name, value,
    }));
  }, [bookings]);

  const weekdayData = useMemo(() => {
    const arr = weekdayNames.map((name) => ({ name, count: 0 }));
    for (const b of bookings) arr[new Date(b.created_at).getDay()].count++;
    return arr;
  }, [bookings]);

  const topClients = useMemo(() => {
    const map: Record<string, { name: string; revenue: number; count: number }> = {};
    for (const b of bookings) {
      const key = b.phone || b.email;
      if (!key) continue;
      if (!map[key]) map[key] = { name: `${b.last_name} ${b.first_name}`.trim(), revenue: 0, count: 0 };
      map[key].revenue += b.total_cost || 0;
      map[key].count++;
    }
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [bookings]);

  const statCards = [
    { label: "Сегодня", value: fmtRub(stats.dayRev), sub: `${stats.dayCount} брони`, icon: TrendingUp, color: "#10B981" },
    { label: "Неделя", value: fmtRub(stats.weekRev), sub: `${stats.weekCount} брони`, icon: CalendarDays, color: "#3B82F6" },
    { label: "Месяц", value: fmtRub(stats.monthRev), sub: `${stats.monthCount} брони`, icon: BarChart3, color: "#A855F7" },
    { label: "Год", value: fmtRub(stats.yearRev), sub: `${stats.total} всего`, icon: Wallet, color: "#F97316" },
    { label: "Прогноз месяца", value: fmtRub(stats.monthForecast), sub: stats.monthDelta >= 0 ? `+${stats.monthDelta}% к прошлому` : `${stats.monthDelta}% к прошлому`, icon: stats.monthDelta >= 0 ? TrendingUp : TrendingDown, color: stats.monthDelta >= 0 ? "#10B981" : "#EF4444" },
    { label: "Активных броней", value: stats.activeBookings, sub: "новые + подтверждённые", icon: Activity, color: "#EAB308" },
    { label: "Средний чек", value: fmtRub(stats.avgCheck), sub: `${stats.avgDays} дн. в среднем`, icon: CreditCard, color: "#06B6D4" },
    { label: "Загрузка парка", value: `${stats.utilization}%`, sub: `${fleet.filter(c => c.status === "busy").length}/${fleet.length} занято`, icon: Car, color: "#EC4899" },
    { label: "Конверсия", value: `${stats.conversion}%`, sub: "подтв. + завершённые", icon: Percent, color: "#10B981" },
    { label: "Отмены", value: `${stats.cancelRate}%`, sub: `${bookings.filter(b => b.status === "cancelled").length} отменены`, icon: TrendingDown, color: "#EF4444" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div className="text-lg font-bold leading-tight">{s.value}</div>
            <div className="text-[11px] text-muted-foreground mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Выручка за последние 30 дней
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(v) => v >= 1000 ? `${Math.round(v/1000)}k` : v} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtRub(v)} />
            <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2.5} dot={{ fill: "#F97316", r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Выручка по месяцам
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(v) => v >= 1000 ? `${Math.round(v/1000)}k` : v} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => fmtRub(v)} />
              <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Car className="w-4 h-4 text-primary" /> Популярность авто
          </h3>
          {carData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={carData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={80} innerRadius={40}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: "#94a3b8", strokeWidth: 1 }}
                >
                  {carData.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke="rgba(0,0,0,0.3)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} брони`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">Нет данных</div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Статусы броней
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={STATUS_COLORS[entry.key] || PALETTE[i % PALETTE.length]} stroke="rgba(0,0,0,0.3)" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">Нет данных</div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Брони по дням недели
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekdayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} брони`} />
              <Bar dataKey="count" fill="#A855F7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" /> Топ-5 клиентов по выручке
        </h3>
        {topClients.length > 0 ? (
          <div className="space-y-2">
            {topClients.map((c, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: PALETTE[i], color: "#fff" }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.name || "Без имени"}</div>
                  <div className="text-xs text-muted-foreground">{c.count} аренд</div>
                </div>
                <div className="text-right font-bold text-sm">{fmtRub(c.revenue)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm text-center py-6">Нет данных</div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
