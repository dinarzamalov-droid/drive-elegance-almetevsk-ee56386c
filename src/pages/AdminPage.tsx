import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, LogOut, RefreshCw, RotateCcw, BarChart3, CalendarDays, Users, Car, Crown, Bell, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminBookings from "@/components/admin/AdminBookings";
import AdminClients from "@/components/admin/AdminClients";
import AdminFleet from "@/components/admin/AdminFleet";
import AdminLoyalty from "@/components/admin/AdminLoyalty";
import AdminFeed from "@/components/admin/AdminFeed";
import type { Booking, FleetCar, Client } from "@/components/admin/types";

const tabs = [
  { id: "analytics", label: "Аналитика", icon: BarChart3 },
  { id: "bookings", label: "Бронирования", icon: CalendarDays },
  { id: "clients", label: "Клиенты", icon: Users },
  { id: "fleet", label: "Автопарк", icon: Car },
  { id: "loyalty", label: "Лояльность", icon: Crown },
  { id: "feed", label: "Лента", icon: Bell },
];

const ADMIN_EMAIL = "3d.drive@mail.ru";

const AdminPage = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fleet, setFleet] = useState<FleetCar[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analytics");

  // Verify admin role on mount + on auth changes
  useEffect(() => {
    const verify = async (uid: string | undefined) => {
      if (!uid) { setAuthenticated(false); setChecking(false); return; }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (error || !data) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }
      setAuthenticated(true);
      setChecking(false);
      await loadData();
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      verify(session?.user?.id);
    });

    supabase.auth.getSession().then(({ data }) => verify(data.session?.user?.id));

    return () => sub.subscription.unsubscribe();
  }, []);

  const invoke = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("admin-bookings", { body });
    if (error) throw error;
    if (data.error) throw new Error(data.error);
    setBookings(data.bookings || []);
    setFleet(data.fleet || []);
    setClients(data.clients || []);
    return data;
  };

  const loadData = async () => {
    setLoading(true);
    try { await invoke({}); } catch (err: any) { toast.error(err.message); } finally { setLoading(false); }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Регистрация выполнена. Войдите в кабинет.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // onAuthStateChange will run verify() and load data
      }
    } catch (err: any) {
      toast.error(err.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  const refresh = () => loadData();
  const hardReload = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("_nocache", Date.now().toString());
    window.location.href = url.toString();
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try { await invoke({ action: "update_status", bookingId: id, status }); toast.success("Статус обновлён"); } catch (err: any) { toast.error(err.message); }
  };
  const updateFleet = async (id: string, data: Record<string, unknown>) => {
    try { await invoke({ action: "update_fleet", carId: id, ...data }); toast.success("Авто обновлено"); } catch (err: any) { toast.error(err.message); }
  };
  const updateClient = async (id: string, data: Record<string, unknown>) => {
    try { await invoke({ action: "update_client", clientId: id, ...data }); toast.success("Клиент обновлён"); } catch (err: any) { toast.error(err.message); }
  };
  const addBonus = async (clientId: string, amount: number) => {
    try { await invoke({ action: "add_bonus", clientId, amount }); } catch (err: any) { toast.error(err.message); }
  };
  const syncClients = async () => {
    setLoading(true);
    try { await invoke({ action: "sync_clients" }); toast.success("Клиенты синхронизированы"); } catch (err: any) { toast.error(err.message); } finally { setLoading(false); }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[80vh]">
          <form onSubmit={handleAuth} className="bg-card-gradient gold-border rounded-2xl p-8 w-full max-w-sm space-y-5">
            <div className="text-center">
              <Lock className="w-10 h-10 mx-auto mb-3 text-primary" />
              <h1 className="text-2xl font-bold">Админ-панель</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {mode === "login" ? "Вход по email и паролю" : "Регистрация администратора"}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Доступ открыт только для <span className="text-primary">{ADMIN_EMAIL}</span>
              </p>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email" autoComplete="email" required
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль" autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <button type="submit" disabled={!email || !password || loading}
              className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-gold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all">
              {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </button>
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors">
              {mode === "login" ? "Первый вход? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
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
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h1 className="text-2xl font-bold">Админ-панель</h1>
            <div className="flex gap-2">
              <button onClick={syncClients} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Users className="w-3.5 h-3.5" /> Синхронизировать клиентов
              </button>
              <button onClick={refresh} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Обновить
              </button>
              <button onClick={hardReload} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-accent text-accent-foreground hover:bg-accent/80 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Обновить без кэша
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                <LogOut className="w-3.5 h-3.5" /> Выйти
              </button>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto mb-6 pb-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}>
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "analytics" && <AdminAnalytics bookings={bookings} fleet={fleet} />}
          {activeTab === "bookings" && <AdminBookings bookings={bookings} onUpdateStatus={updateBookingStatus} onRefresh={refresh} />}
          {activeTab === "clients" && <AdminClients clients={clients} bookings={bookings} onUpdateClient={updateClient} />}
          {activeTab === "fleet" && <AdminFleet fleet={fleet} onUpdateFleet={updateFleet} />}
          {activeTab === "loyalty" && <AdminLoyalty clients={clients} onAddBonus={addBonus} />}
          {activeTab === "feed" && <AdminFeed bookings={bookings} />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
