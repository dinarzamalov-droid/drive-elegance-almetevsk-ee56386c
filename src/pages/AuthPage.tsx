import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        toast.success("Добро пожаловать!");
        navigate("/profile");
      } else {
        if (!form.firstName.trim() || !form.lastName.trim()) {
          toast.error("Введите имя и фамилию");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;

        // Update profile with name and phone
        if (data.user) {
          await supabase.from("profiles").update({
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            phone: form.phone.trim(),
          }).eq("user_id", data.user.id);
        }

        toast.success("Проверьте email для подтверждения регистрации");
      }
    } catch (err: any) {
      toast.error(err.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="bg-card-gradient gold-border rounded-2xl p-8 w-full max-w-md space-y-6">
          <div className="text-center">
            <User className="w-10 h-10 mx-auto mb-3 text-primary" />
            <h1 className="text-2xl font-bold">{isLogin ? "Вход" : "Регистрация"}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin ? "Войдите в личный кабинет" : "Создайте аккаунт для удобного бронирования"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input type="text" placeholder="Имя *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} required={!isLogin} />
                  </div>
                  <div className="relative">
                    <input type="text" placeholder="Фамилия *" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} required={!isLogin} />
                  </div>
                </div>
                <input type="tel" placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${inputClass} pl-10`} required />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" placeholder="Пароль *" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`${inputClass} pl-10`} required minLength={6} />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold text-sm bg-gradient-gold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {loading ? "Загрузка..." : isLogin ? "Войти" : "Зарегистрироваться"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {isLogin ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
