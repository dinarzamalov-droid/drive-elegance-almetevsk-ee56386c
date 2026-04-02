import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Edit3, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EditBookingPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: "", email: "", delivery_time: "", city: "" });

  const searchBooking = async () => {
    if (!phone.trim() && !email.trim()) {
      toast.error("Введите телефон или email");
      return;
    }
    setLoading(true);
    try {
      let query = supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(1);
      if (phone.trim()) query = query.eq("phone", phone.trim());
      if (email.trim()) query = query.eq("email", email.trim());
      const { data, error } = await query;
      if (error) throw error;
      if (!data || data.length === 0) {
        toast.error("Бронирование не найдено");
        setBooking(null);
        return;
      }
      const b = data[0];
      setBooking(b);
      setForm({ phone: b.phone, email: b.email, delivery_time: b.delivery_time || "", city: b.city });
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Ошибка поиска");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    if (!booking) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          phone: form.phone,
          email: form.email,
          delivery_time: form.delivery_time,
          city: form.city,
        })
        .eq("id", booking.id);
      if (error) throw error;
      setBooking({ ...booking, ...form });
      setEditing(false);
      toast.success("Бронирование обновлено!");
    } catch (err: any) {
      toast.error(err.message || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-lg">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> На главную
          </button>

          <div className="bg-card-gradient gold-border rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <Edit3 className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h1 className="text-2xl font-bold">Моё бронирование</h1>
              <p className="text-muted-foreground text-sm mt-1">Найдите бронь по телефону или email</p>
            </div>

            {/* Search */}
            <div className="space-y-3">
              <input type="tel" placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
              <button
                onClick={searchBooking}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm bg-gradient-gold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
              >
                <Search className="w-4 h-4" /> {loading ? "Поиск..." : "Найти бронирование"}
              </button>
            </div>

            {/* Booking details */}
            {booking && (
              <div className="space-y-4 border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Бронь #{booking.id.slice(0, 8)}</h2>
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                    {booking.status === "new" ? "Новая" : booking.status === "confirmed" ? "Подтверждена" : booking.status}
                  </span>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Авто</span><span className="font-medium">{booking.car_label}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Даты</span><span>{booking.date_from} — {booking.date_to}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Итого</span><span className="font-bold">{booking.total_cost?.toLocaleString("ru-RU")} ₽</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Предоплата</span><span>{booking.prepay?.toLocaleString("ru-RU")} ₽</span></div>
                </div>

                {editing ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Телефон</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Город</label>
                      <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Время подачи</label>
                      <input type="time" value={form.delivery_time} onChange={(e) => setForm({ ...form, delivery_time: e.target.value })} className={inputClass} />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setEditing(false)} className="flex-1 py-3 rounded-lg text-sm font-semibold border border-border text-muted-foreground hover:text-foreground transition-colors">
                        Отмена
                      </button>
                      <button onClick={saveChanges} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold bg-gradient-gold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all">
                        <Save className="w-4 h-4" /> Сохранить
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold border border-primary text-primary hover:bg-primary/10 transition-colors">
                    <Edit3 className="w-4 h-4" /> Редактировать
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditBookingPage;
