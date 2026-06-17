import { format } from "date-fns";
import { X, Search, Download, FileText, FileType2, Loader2, Sparkles, IdCard, Sheet, FolderDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { regenerateContractFromBooking } from "@/lib/uploadContract";
import { supabase } from "@/integrations/supabase/client";
import type { Booking } from "./types";
import { statusLabels, methodLabels, paymentLabels } from "./types";

interface Props {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: string) => void;
  onRefresh?: () => void | Promise<void>;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-2 mt-2">{title}</h3>
    <div className="bg-secondary/50 rounded-lg p-3 space-y-1.5">{children}</div>
  </div>
);

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className="flex justify-between gap-4">
    <span className="text-muted-foreground shrink-0">{label}</span>
    <span className={`text-right ${bold ? "font-bold" : ""}`}>{value}</span>
  </div>
);

const AdminBookings = ({ bookings, onUpdateStatus, onRefresh }: Props) => {
  const [search, setSearch] = useState("");
  const [carFilter, setCarFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [downloadingContracts, setDownloadingContracts] = useState(false);

  const uniqueCars = Array.from(new Set(bookings.map((b) => b.car_label))).sort();
  const hasFilters = !!(search || carFilter || phoneFilter || dateFrom || dateTo);
  const resetFilters = () => {
    setSearch(""); setCarFilter(""); setPhoneFilter(""); setDateFrom(""); setDateTo("");
  };

  const handleRegenerate = async (booking: Booking) => {
    setGeneratingId(booking.id);
    try {
      const result = await regenerateContractFromBooking(booking);
      if (!result || (!result.pdfUrl && !result.docxUrl)) {
        toast.error("Не удалось сгенерировать договор");
        return;
      }
      toast.success("Договор сгенерирован и сохранён");
      if (selected?.id === booking.id) {
        setSelected({
          ...selected,
          contract_url: result.pdfUrl ?? selected.contract_url,
          contract_docx_url: result.docxUrl ?? selected.contract_docx_url,
        });
      }
      await onRefresh?.();
    } catch (err) {
      console.error(err);
      toast.error("Ошибка генерации договора");
    } finally {
      setGeneratingId(null);
    }
  };

  const normalizePhone = (p: string) => p.replace(/\D/g, "");

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    if (q && !(b.last_name.toLowerCase().includes(q) || b.first_name.toLowerCase().includes(q) || b.car_label.toLowerCase().includes(q) || b.phone.includes(q) || b.email.toLowerCase().includes(q))) return false;
    if (carFilter && b.car_label !== carFilter) return false;
    if (phoneFilter) {
      const np = normalizePhone(phoneFilter);
      if (np && !normalizePhone(b.phone).includes(np)) return false;
    }
    if (dateFrom && b.date_to < dateFrom) return false;
    if (dateTo && b.date_from > dateTo) return false;
    return true;
  });

  const exportCsv = () => {
    if (filtered.length === 0) return;
    const headers = ["Дата создания","Фамилия","Имя","Телефон","Email","Авто","Дата начала","Дата окончания","Дней","Сумма","Предоплата","Залог","Оплата","Статус","Промокод","Город","Мессенджер"];
    const rows = filtered.map((b) => [
      b.created_at, b.last_name, b.first_name, b.phone, b.email, b.car_label,
      b.date_from, b.date_to, b.days, b.total_cost, b.prepay, b.deposit,
      methodLabels[b.payment_method] || b.payment_method,
      statusLabels[b.status] || b.status,
      b.promo_code || "", b.city, b.preferred_messenger || "",
    ]);
    const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPassportsCsv = () => {
    if (filtered.length === 0) return;
    const headers = [
      "Дата создания","Фамилия","Имя","Отчество","Телефон","Email",
      "Паспорт серия","Паспорт номер","Дата выдачи","Код подразделения",
      "ВУ номер","ВУ дата","Авто","Период"
    ];
    const rows = filtered.map((b) => [
      b.created_at, b.last_name, b.first_name, b.middle_name || "", b.phone, b.email,
      b.passport_series || "", b.passport_number || "", b.passport_date || "", b.passport_code || "",
      b.license_number || "", b.license_date || "",
      b.car_label, `${b.date_from} — ${b.date_to}`,
    ]);
    const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `passports_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Выгружено ${filtered.length} записей`);
  };

  const syncToSheets = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke("sync-google-sheets", {
        body: { action: "sync_all_bookings" },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`Синхронизировано ${data?.count ?? 0} бронирований с Google Sheets`);
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Ошибка синхронизации";
      toast.error(`Не удалось синхронизировать: ${msg}`);
    } finally {
      setSyncing(false);
    }
  };

  const downloadAllContracts = async () => {
    const withContracts = filtered.filter((b) => b.contract_url || b.contract_docx_url);
    if (withContracts.length === 0) {
      toast.info("Нет договоров для скачивания");
      return;
    }
    setDownloadingContracts(true);
    try {
      for (const b of withContracts) {
        const url = b.contract_url || b.contract_docx_url;
        if (!url) continue;
        window.open(url, "_blank", "noopener,noreferrer");
        await new Promise((r) => setTimeout(r, 350));
      }
      toast.success(`Открыто ${withContracts.length} договоров в новых вкладках`);
    } finally {
      setDownloadingContracts(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Поиск по имени, авто, телефону..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        <select value={carFilter} onChange={(e) => setCarFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">Все авто</option>
          {uniqueCars.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
        <input type="tel" placeholder="Телефон" value={phoneFilter} onChange={(e) => setPhoneFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="Период с" className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="Период по" className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <button onClick={resetFilters} disabled={!hasFilters} className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-40">
          <X className="w-4 h-4" /> Сбросить фильтры
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div className="text-xs text-muted-foreground">Найдено: <span className="text-foreground font-semibold">{filtered.length}</span> из {bookings.length}</div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCsv} disabled={filtered.length === 0} title="Скачать список бронирований CSV" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={exportPassportsCsv} disabled={filtered.length === 0} title="Выгрузить паспортные данные клиентов" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50">
            <IdCard className="w-4 h-4" /> Паспорта
          </button>
          <button onClick={downloadAllContracts} disabled={downloadingContracts || filtered.length === 0} title="Открыть все договоры" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50">
            {downloadingContracts ? <Loader2 className="w-4 h-4 animate-spin" /> : <FolderDown className="w-4 h-4" />} Договоры
          </button>
          <button onClick={syncToSheets} disabled={syncing} title="Синхронизировать с Google Sheets" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors disabled:opacity-50">
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sheet className="w-4 h-4" />} Google Sheets
          </button>
        </div>
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
              <th className="text-center px-4 py-3 font-semibold">Договор</th>
              <th className="text-center px-4 py-3 font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Нет бронирований</td></tr>
            ) : filtered.map((b) => (
              <tr key={b.id} onClick={() => setSelected(b)} className="border-t border-border hover:bg-secondary/50 transition-colors cursor-pointer">
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{format(new Date(b.created_at), "dd.MM.yy HH:mm")}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{b.last_name} {b.first_name}</div>
                  <div className="text-xs text-muted-foreground">{b.phone}</div>
                </td>
                <td className="px-4 py-3 font-medium">{b.car_label}</td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{b.date_from} — {b.date_to} ({b.days} д.)</td>
                <td className="px-4 py-3 text-right font-medium">{b.total_cost.toLocaleString("ru-RU")} ₽</td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-1.5">
                    {b.contract_url ? (
                      <a
                        href={b.contract_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Скачать PDF договора"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </a>
                    ) : null}
                    {b.contract_docx_url ? (
                      <a
                        href={b.contract_docx_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Скачать Word договора"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <FileType2 className="w-4 h-4" />
                      </a>
                    ) : null}
                    {!b.contract_url && !b.contract_docx_url ? (
                      <button
                        type="button"
                        disabled={generatingId === b.id}
                        onClick={() => handleRegenerate(b)}
                        title="Сгенерировать договор"
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50"
                      >
                        {generatingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      </button>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <select value={b.status} onChange={(e) => onUpdateStatus(b.id, e.target.value)} className={`px-2 py-1 rounded-full text-xs font-medium border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${b.status === "new" ? "bg-primary/20 text-primary" : b.status === "confirmed" ? "bg-green-500/20 text-green-400" : b.status === "cancelled" ? "bg-destructive/20 text-destructive" : "bg-blue-500/20 text-blue-400"}`}>
                    <option value="new">Новая</option>
                    <option value="confirmed">Подтверждена</option>
                    <option value="completed">Завершена</option>
                    <option value="cancelled">Отменена</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Бронирование #{selected.id.slice(0, 8)}</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-secondary transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <Section title="Клиент">
                <Row label="ФИО" value={`${selected.last_name} ${selected.first_name} ${selected.middle_name || ""}`} />
                <Row label="Телефон" value={selected.phone} />
                <Row label="Email" value={selected.email} />
              </Section>
              <Section title="Автомобиль и даты">
                <Row label="Автомобиль" value={selected.car_label} />
                <Row label="Период" value={`${selected.date_from} — ${selected.date_to} (${selected.days} д.)`} />
                <Row label="Город" value={selected.city} />
              </Section>
              <Section title="Финансы">
                <Row label="Итого" value={`${selected.total_cost.toLocaleString("ru-RU")} ₽`} bold />
                <Row label="Предоплата" value={`${selected.prepay.toLocaleString("ru-RU")} ₽`} />
                <Row label="Остаток" value={`${selected.remaining.toLocaleString("ru-RU")} ₽`} />
                <Row label="Залог" value={`${selected.deposit.toLocaleString("ru-RU")} ₽`} />
                <Row label="Оплата" value={methodLabels[selected.payment_method] || selected.payment_method} />
              </Section>
              <Section title="Статус">
                <Row label="Создано" value={format(new Date(selected.created_at), "dd.MM.yyyy HH:mm")} />
                <Row label="Статус" value={statusLabels[selected.status] || selected.status} />
              </Section>
              <Section title="Договор">
                <div className="flex flex-col gap-2">
                  {selected.contract_url && (
                    <a
                      href={selected.contract_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      Скачать PDF договора
                    </a>
                  )}
                  {selected.contract_docx_url && (
                    <a
                      href={selected.contract_docx_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-medium"
                    >
                      <FileType2 className="w-4 h-4" />
                      Скачать Word договора
                    </a>
                  )}
                  <button
                    type="button"
                    disabled={generatingId === selected.id}
                    onClick={() => handleRegenerate(selected)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 ${
                      selected.contract_url || selected.contract_docx_url
                        ? "bg-secondary text-foreground hover:bg-secondary/80"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {generatingId === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {selected.contract_url || selected.contract_docx_url ? "Перегенерировать (PDF + Word)" : "Сгенерировать договор (PDF + Word)"}
                  </button>
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
