import { useMemo } from "react";
import { TrendingUp, Car, Users, CreditCard, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { Booking, FleetCar } from "./types";

interface Props {
  bookings: Booking[];
  fleet: FleetCar[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

const AdminAnalytics = ({ bookings, fleet }: Props) => {
  const stats = useMemo(() => {
    const now = new Date();
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(dayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    let dayRev = 0, weekRev = 0, monthRev = 0, yearRev = 0;
    for (const b of bookings) {
      const d = new Date(b.created_at);
      const cost = b.total_cost || 0;
      if (d >= dayStart) dayRev += cost;
      if (d >= weekStart) weekRev += cost;
      if (d >= monthStart) monthRev += cost;
      if (d >= yearStart) yearRev += cost;
    }

    const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "new").length;
    const busyCars = fleet.filter(c => c.status === "busy").length;
    const utilization = fleet.length > 0 ? Math.round((busyCars / fleet.length) * 100) : 0;
    const avgCheck = bookings.length > 0 ? Math.round(yearRev / bookings.length) : 0;

    return { dayRev, weekRev, monthRev, yearRev, activeBookings, utilization, avgCheck, total: bookings.length };
  }, [bookings, fleet]);

  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    const monthNames = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
    for (const b of bookings) {
      const d = new Date(b.created_at);
      const key = monthNames[d.getMonth()];
      months[key] = (months[key] || 0) + (b.total_cost || 0);
    }
    return Object.entries(months).map(([name, revenue]) => ({ name, revenue }));
  }, [bookings]);

  const carData = useMemo(() => {
    const byCar: Record<string, number> = {};
    for (const b of bookings) {
      byCar[b.car_label] = (byCar[b.car_label] || 0) + 1;
    }
    return Object.entries(byCar).map(([name, value]) => ({ name, value }));
  }, [bookings]);

  const statCards = [
    { label: "Сегодня", value: `${stats.dayRev.toLocaleString("ru-RU")} ₽`, icon: TrendingUp },
    { label: "Неделя", value: `${stats.weekRev.toLocaleString("ru-RU")} ₽`, icon: TrendingUp },
    { label: "Месяц", value: `${stats.monthRev.toLocaleString("ru-RU")} ₽`, icon: TrendingUp },
    { label: "Год", value: `${stats.yearRev.toLocaleString("ru-RU")} ₽`, icon: TrendingUp },
    { label: "Бронирований", value: stats.total, icon: BarChart3 },
    { label: "Активных", value: stats.activeBookings, icon: CreditCard },
    { label: "Загрузка парка", value: `${stats.utilization}%`, icon: Car },
    { label: "Средний чек", value: `${stats.avgCheck.toLocaleString("ru-RU")} ₽`, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-card-gradient border border-border rounded-xl p-4 text-center">
            <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <div className="text-lg font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {monthlyData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-4">Выручка по месяцам</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => `${v.toLocaleString("ru-RU")} ₽`} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {carData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-4">Популярность авто</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={carData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {carData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
