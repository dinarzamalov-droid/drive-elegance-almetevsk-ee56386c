import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Heart, Crown, CalendarDays, FileText, LogOut, Settings, Star, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cars } from "@/lib/bookingData";
import { formatPhone, formatPassportSeries, formatPassportNumber, formatPassportCode, formatLicenseNumber, stripPhone, stripDigits } from "@/lib/formatUtils";

interface Profile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
  email: string;
  passport_series: string;
  passport_number: string;
  passport_date: string;
  passport_code: string;
  passport_issued_by: string;
  registration_address: string;
  license_number: string;
  license_date: string;
  loyalty_level: string;
  bonus_balance: number;
  total_spent: number;
  total_rentals: number;
  favorite_cars: string[];
}

interface Booking {
  id: string;
  car_label: string;
  car_value: string;
  date_from: string;
  date_to: string;
  days: number;
  total_cost: number;
  status: string;
  created_at: string;
  prepay: number;
  deposit: number;
}

const statusLabels: Record<string, string> = { new: "Новая", confirmed: "Подтверждена", completed: "Завершена", cancelled: "Отменена" };

const tabs = [
  { id: "profile", label: "Профиль", icon: User },
  { id: "bookings", label: "Мои аренды", icon: CalendarDays },
  { id: "loyalty", label: "Лояльность", icon: Crown },
  { id: "favorites", label: "Избранное", icon: Heart },
  { id: "settings", label: "Настройки", icon: Settings },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).single();
      if (profileData) setProfile(profileData as unknown as Profile);

      // Fetch bookings by email
      if (profileData?.email) {
        const { data: bookingsData } = await supabase.from("bookings").select("id, car_label, car_value, date_from, date_to, days, total_cost, status, created_at, prepay, deposit").eq("email", profileData.email).order("created_at", { ascending: false });
        if (bookingsData) setBookings(bookingsData);
      }

      setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Вы вышли из аккаунта");
    navigate("/");
  };

  const saveProfile = async () => {
    if (!profile) return;
    const { error } = await supabase.from("profiles").update(editForm).eq("user_id", profile.user_id);
    if (error) { toast.error("Ошибка сохранения"); return; }
    setProfile({ ...profile, ...editForm });
    setEditing(false);
    toast.success("Профиль обновлён");
  };

  const toggleFavorite = async (carValue: string) => {
    if (!profile) return;
    const favs = profile.favorite_cars || [];
    const newFavs = favs.includes(carValue) ? favs.filter(c => c !== carValue) : [...favs, carValue];
    const { error } = await supabase.from("profiles").update({ favorite_cars: newFavs }).eq("user_id", profile.user_id);
    if (error) { toast.error("Ошибка"); return; }
    setProfile({ ...profile, favorite_cars: newFavs });
  };

  const repeatBooking = (booking: Booking) => {
    navigate(`/booking?car=${booking.car_value}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[80vh]">
          <div className="text-muted-foreground">Загрузка...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  const discount = profile.loyalty_level === "VIP" ? 15 : profile.loyalty_level === "ПРЕМИУМ" ? 10 : 5;
  const activeBookings = bookings.filter(b => b.status === "new" || b.status === "confirmed");
  const completedBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  const inputClass = "w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold">{profile.last_name} {profile.first_name}</h1>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
              <LogOut className="w-4 h-4" /> Выйти
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-card-gradient border border-border rounded-xl p-4 text-center">
              <Crown className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">{profile.loyalty_level}</div>
              <div className="text-xs text-muted-foreground">Уровень</div>
            </div>
            <div className="bg-card-gradient border border-border rounded-xl p-4 text-center">
              <Star className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">{profile.bonus_balance}</div>
              <div className="text-xs text-muted-foreground">Бонусы</div>
            </div>
            <div className="bg-card-gradient border border-border rounded-xl p-4 text-center">
              <div className="text-lg font-bold">{discount}%</div>
              <div className="text-xs text-muted-foreground">Скидка</div>
            </div>
            <div className="bg-card-gradient border border-border rounded-xl p-4 text-center">
              <div className="text-lg font-bold">{bookings.length}</div>
              <div className="text-xs text-muted-foreground">Аренд</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto mb-6 pb-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              {editing ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="text-xs text-muted-foreground mb-1 block">Фамилия</label><input value={editForm.last_name ?? profile.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} className={inputClass} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Имя</label><input value={editForm.first_name ?? profile.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} className={inputClass} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Отчество</label><input value={editForm.middle_name ?? profile.middle_name} onChange={(e) => setEditForm({ ...editForm, middle_name: e.target.value })} className={inputClass} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Телефон</label><input value={formatPhone(editForm.phone ?? profile.phone)} onChange={(e) => setEditForm({ ...editForm, phone: stripPhone(e.target.value) })} className={inputClass} placeholder="+7 (___) ___-__-__" /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Серия паспорта</label><input value={formatPassportSeries(editForm.passport_series ?? profile.passport_series)} onChange={(e) => setEditForm({ ...editForm, passport_series: stripDigits(e.target.value, 4) })} className={inputClass} placeholder="12 34" maxLength={5} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Номер паспорта</label><input value={formatPassportNumber(editForm.passport_number ?? profile.passport_number)} onChange={(e) => setEditForm({ ...editForm, passport_number: stripDigits(e.target.value, 6) })} className={inputClass} placeholder="567890" maxLength={6} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Код подразделения</label><input value={formatPassportCode(editForm.passport_code ?? profile.passport_code)} onChange={(e) => setEditForm({ ...editForm, passport_code: stripDigits(e.target.value, 6) })} className={inputClass} placeholder="123-456" maxLength={7} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Кем выдан паспорт</label><input value={editForm.passport_issued_by ?? profile.passport_issued_by} onChange={(e) => setEditForm({ ...editForm, passport_issued_by: e.target.value })} className={inputClass} /></div>
                    <div className="sm:col-span-2"><label className="text-xs text-muted-foreground mb-1 block">Адрес регистрации</label><input value={editForm.registration_address ?? profile.registration_address} onChange={(e) => setEditForm({ ...editForm, registration_address: e.target.value })} className={inputClass} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Номер ВУ</label><input value={formatLicenseNumber(editForm.license_number ?? profile.license_number)} onChange={(e) => setEditForm({ ...editForm, license_number: stripDigits(e.target.value, 10) })} className={inputClass} placeholder="99 01 792618" maxLength={14} /></div>
                    <div><label className="text-xs text-muted-foreground mb-1 block">Дата выдачи ВУ</label><input value={editForm.license_date ?? profile.license_date} onChange={(e) => setEditForm({ ...editForm, license_date: e.target.value })} className={inputClass} /></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveProfile} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-gold text-primary-foreground hover:opacity-90">Сохранить</button>
                    <button onClick={() => setEditing(false)} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-secondary text-foreground">Отмена</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {[
                      ["ФИО", `${profile.last_name} ${profile.first_name} ${profile.middle_name || ""}`],
                      ["Телефон", profile.phone || "—"],
                      ["Email", profile.email],
                      ["Паспорт", profile.passport_series && profile.passport_number ? `${profile.passport_series} ${profile.passport_number}` : "—"],
                      ["Кем выдан", profile.passport_issued_by || "—"],
                      ["Адрес", profile.registration_address || "—"],
                      ["ВУ", profile.license_number || "—"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-2 bg-secondary/50 rounded-lg p-3">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-medium text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => { setEditing(true); setEditForm({}); }} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-gold text-primary-foreground hover:opacity-90">
                    Редактировать
                  </button>
                </>
              )}
            </div>
          )}

          {/* Bookings tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              {activeBookings.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Активные брони</h3>
                  <div className="space-y-3">
                    {activeBookings.map((b) => (
                      <div key={b.id} className="bg-card-gradient border border-primary/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-bold">{b.car_label}</div>
                          <div className="text-sm text-muted-foreground">{b.date_from} — {b.date_to} · {b.days} д.</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold">{b.total_cost.toLocaleString("ru-RU")} ₽</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.status === "new" ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-400"}`}>
                            {statusLabels[b.status]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">История аренд</h3>
                {completedBookings.length === 0 && activeBookings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>У вас пока нет бронирований</p>
                    <button onClick={() => navigate("/booking")} className="mt-3 px-6 py-2 rounded-lg text-sm font-semibold bg-gradient-gold text-primary-foreground">Забронировать</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {completedBookings.map((b) => (
                      <div key={b.id} className="flex items-center justify-between bg-secondary/50 border border-border rounded-lg p-3">
                        <div>
                          <span className="font-medium text-sm">{b.car_label}</span>
                          <span className="text-xs text-muted-foreground ml-2">{b.date_from} — {b.date_to}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{b.total_cost.toLocaleString("ru-RU")} ₽</span>
                          <button onClick={() => repeatBooking(b)} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20" title="Повторить">
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loyalty tab */}
          {activeTab === "loyalty" && (
            <div className="space-y-6">
              <div className="bg-card-gradient gold-border rounded-2xl p-6 text-center">
                <Crown className="w-12 h-12 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{profile.loyalty_level}</div>
                <p className="text-muted-foreground text-sm">Скидка {discount}% на следующую аренду</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{profile.bonus_balance}</div>
                  <div className="text-xs text-muted-foreground">Бонусов</div>
                </div>
                <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{profile.total_spent.toLocaleString("ru-RU")} ₽</div>
                  <div className="text-xs text-muted-foreground">Всего потрачено</div>
                </div>
                <div className="bg-secondary/50 border border-border rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">{profile.total_rentals}</div>
                  <div className="text-xs text-muted-foreground">Аренд</div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-sm">Как повысить уровень</h3>
                {[
                  { level: "СВОБОДА", condition: "Автоматически после первой аренды", discount: "5%" },
                  { level: "ПРЕМИУМ", condition: "5 аренд или 5 000 ₽/год", discount: "10%" },
                  { level: "VIP", condition: "10 аренд или 15 000 ₽/год", discount: "15%" },
                ].map((l) => (
                  <div key={l.level} className={`flex items-center justify-between p-3 rounded-lg ${l.level === profile.loyalty_level ? "bg-primary/10 border border-primary/30" : "bg-secondary/50"}`}>
                    <div>
                      <span className="font-medium text-sm">{l.level}</span>
                      <span className="text-xs text-muted-foreground ml-2">— {l.condition}</span>
                    </div>
                    <span className="text-sm font-bold">{l.discount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorites tab */}
          {activeTab === "favorites" && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cars.map((car) => {
                  const isFav = (profile.favorite_cars || []).includes(car.value);
                  return (
                    <div key={car.value} className={`bg-card-gradient border rounded-xl p-5 flex items-center justify-between ${isFav ? "border-primary/40" : "border-border"}`}>
                      <div>
                        <h3 className="font-bold">{car.label}</h3>
                        <p className="text-sm text-muted-foreground">{car.specs}</p>
                        <p className="text-gradient-gold font-bold mt-1">{car.price.toLocaleString("ru-RU")} ₽/сут</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <button onClick={() => toggleFavorite(car.value)} className={`p-2 rounded-full transition-colors ${isFav ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-primary"}`}>
                          <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
                        </button>
                        <button onClick={() => navigate(`/booking?car=${car.value}`)} className="text-xs text-primary hover:underline">Забронировать</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Settings tab */}
          {activeTab === "settings" && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold">Настройки аккаунта</h3>
              <div className="space-y-3">
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors">
                  <span className="text-sm font-medium text-destructive">Выйти из аккаунта</span>
                  <LogOut className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
