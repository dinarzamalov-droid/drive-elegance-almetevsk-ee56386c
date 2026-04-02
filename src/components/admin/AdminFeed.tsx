import { useMemo } from "react";
import { format } from "date-fns";
import { Bell } from "lucide-react";
import type { Booking } from "./types";
import { statusLabels } from "./types";

interface Props {
  bookings: Booking[];
}

const AdminFeed = ({ bookings }: Props) => {
  const events = useMemo(() => {
    return bookings
      .slice(0, 30)
      .map((b) => ({
        id: b.id,
        time: format(new Date(b.created_at), "dd.MM.yy HH:mm"),
        text: `${b.last_name} ${b.first_name} — ${b.car_label}`,
        status: statusLabels[b.status] || b.status,
        statusKey: b.status,
        amount: b.total_cost,
      }));
  }, [bookings]);

  return (
    <div className="space-y-2">
      {events.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">Нет событий</div>
      ) : events.map((e) => (
        <div key={e.id} className="flex items-center gap-3 bg-secondary/50 border border-border rounded-lg p-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            e.statusKey === "new" ? "bg-primary/20" :
            e.statusKey === "confirmed" ? "bg-green-500/20" :
            e.statusKey === "cancelled" ? "bg-destructive/20" :
            "bg-blue-500/20"
          }`}>
            <Bell className={`w-4 h-4 ${
              e.statusKey === "new" ? "text-primary" :
              e.statusKey === "confirmed" ? "text-green-400" :
              e.statusKey === "cancelled" ? "text-destructive" :
              "text-blue-400"
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{e.text}</div>
            <div className="text-xs text-muted-foreground">{e.time} · {e.status} · {e.amount.toLocaleString("ru-RU")} ₽</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminFeed;
