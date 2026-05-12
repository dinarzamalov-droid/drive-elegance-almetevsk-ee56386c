import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const UnsubscribePage = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "ready" | "already" | "invalid" | "submitting" | "done" | "error">("loading");

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey: SUPABASE_ANON },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.valid) setState("ready");
        else if (d?.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      })
      .catch(() => setState("error"));
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await res.json();
      if (d?.success || d?.reason === "already_unsubscribed") setState("done");
      else setState("error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Отписка от рассылки</h1>
          {state === "loading" && <p className="text-muted-foreground">Проверяем ссылку…</p>}
          {state === "invalid" && <p className="text-muted-foreground">Ссылка недействительна или устарела.</p>}
          {state === "already" && <p className="text-muted-foreground">Вы уже отписаны от рассылки.</p>}
          {state === "ready" && (
            <>
              <p className="text-muted-foreground">Подтвердите отписку — мы перестанем присылать вам письма.</p>
              <button onClick={confirm} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                Подтвердить отписку
              </button>
            </>
          )}
          {state === "submitting" && <p className="text-muted-foreground">Отправляем…</p>}
          {state === "done" && <p className="text-foreground">Готово — вы отписаны.</p>}
          {state === "error" && <p className="text-destructive">Произошла ошибка. Попробуйте позже.</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UnsubscribePage;
