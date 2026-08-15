import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Briefcase, RefreshCw, Phone, Mail, FileText, Clock } from "lucide-react";

export interface CorporateRequest {
  id: string;
  company: string;
  inn: string | null;
  contact_name: string;
  phone: string;
  email: string | null;
  need_docs: boolean;
  deferred_payment: boolean;
  message: string | null;
  status: string;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  won: "Договор",
  lost: "Отказ",
};

const AdminCorporate = () => {
  const [items, setItems] = useState<CorporateRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("corporate_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data || []) as CorporateRequest[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("corporate_requests").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const exportCsv = () => {
    const head = ["Дата", "Компания", "ИНН", "Контакт", "Телефон", "Email", "Документы", "Отсрочка", "Комментарий", "Статус"];
    const rows = items.map((i) => [
      new Date(i.created_at).toLocaleString("ru-RU"),
      i.company, i.inn ?? "", i.contact_name, i.phone, i.email ?? "",
      i.need_docs ? "да" : "нет", i.deferred_payment ? "да" : "нет",
      (i.message ?? "").replace(/\n/g, " "), statusLabels[i.status] ?? i.status,
    ]);
    const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `corporate-requests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const newCount = items.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Briefcase className="w-4 h-4 text-primary" />
          Корпоративные заявки
          {newCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">{newCount} новых</span>
          )}
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={load} className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Обновить
          </button>
          <button onClick={exportCsv} disabled={!items.length} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm disabled:opacity-50">
            Экспорт CSV
          </button>
        </div>
      </div>

      {!items.length && !loading && (
        <p className="text-sm text-muted-foreground py-8 text-center">Корпоративных заявок пока нет.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((i) => (
          <div key={i.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-sm">{i.company}</p>
                <p className="text-xs text-muted-foreground">ИНН: {i.inn || "—"} · {new Date(i.created_at).toLocaleString("ru-RU")}</p>
              </div>
              <select
                value={i.status}
                onChange={(e) => setStatus(i.id, e.target.value)}
                className="text-xs bg-secondary border border-border rounded-lg px-2 py-1"
              >
                {Object.entries(statusLabels).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>

            <p className="text-sm">{i.contact_name}</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <a href={`tel:${i.phone}`} className="flex items-center gap-1 text-primary"><Phone className="w-3 h-3" />{i.phone}</a>
              {i.email && <a href={`mailto:${i.email}`} className="flex items-center gap-1 text-primary"><Mail className="w-3 h-3" />{i.email}</a>}
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {i.need_docs && <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary"><FileText className="w-3 h-3" />Закрывающие документы</span>}
              {i.deferred_payment && <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-secondary"><Clock className="w-3 h-3" />Отсрочка платежа</span>}
            </div>

            {i.message && <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2">{i.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCorporate;
