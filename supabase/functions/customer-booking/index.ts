import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "contracts";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // ~10 years

const ALLOWED_UPDATE_FIELDS = new Set([
  "phone", "email", "delivery_time", "city",
  "contract_url", "contract_docx_url",
]);

const ALLOWED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normPhone(v: string) { return (v || "").trim().replace(/\s+/g, ""); }
function normEmail(v: string) { return (v || "").trim().toLowerCase(); }

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const action = body?.action as string;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    if (action === "get") {
      const phone = normPhone(body.phone);
      const email = normEmail(body.email);
      if (!phone && !email) return json({ error: "Введите телефон или email" }, 400);
      let q = supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(1);
      if (phone) q = q.eq("phone", phone);
      if (email) q = q.ilike("email", email);
      const { data, error } = await q;
      if (error) throw error;
      return json({ booking: data?.[0] || null });
    }

    if (action === "update") {
      const bookingId = body.bookingId as string;
      const phone = normPhone(body.phone);
      const email = normEmail(body.email);
      const updates = body.updates as Record<string, unknown> | undefined;
      if (!bookingId || !updates) return json({ error: "Неверные параметры" }, 400);
      if (!phone || !email) return json({ error: "Нужны телефон и email для подтверждения" }, 400);

      const { data: existing, error: fetchErr } = await supabase
        .from("bookings").select("id, phone, email").eq("id", bookingId).maybeSingle();
      if (fetchErr) throw fetchErr;
      if (!existing) return json({ error: "Бронирование не найдено" }, 404);
      if (normPhone(existing.phone) !== phone || normEmail(existing.email) !== email) {
        return json({ error: "Не удалось подтвердить владельца" }, 403);
      }

      const filtered: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (ALLOWED_UPDATE_FIELDS.has(k)) filtered[k] = v;
      }
      if (Object.keys(filtered).length === 0) return json({ error: "Нечего обновлять" }, 400);

      const { error } = await supabase.from("bookings").update(filtered).eq("id", bookingId);
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "upload_contract") {
      const bookingId = body.bookingId as string;
      const phone = normPhone(body.phone);
      const email = normEmail(body.email);
      const fileBase64 = body.fileBase64 as string;
      const suffix = (body.suffix as string) || "pdf";
      const contentType = (body.contentType as string) || "application/pdf";

      if (!bookingId || !fileBase64) return json({ error: "Нужны bookingId и файл" }, 400);
      if (!phone || !email) return json({ error: "Нужны телефон и email" }, 400);
      if (!ALLOWED_CONTENT_TYPES.has(contentType)) return json({ error: "Недопустимый тип файла" }, 400);
      if (!["pdf", "docx"].includes(suffix)) return json({ error: "Недопустимое расширение" }, 400);

      const { data: existing, error: fetchErr } = await supabase
        .from("bookings").select("id, phone, email").eq("id", bookingId).maybeSingle();
      if (fetchErr) throw fetchErr;
      if (!existing) return json({ error: "Бронирование не найдено" }, 404);
      if (normPhone(existing.phone) !== phone || normEmail(existing.email) !== email) {
        return json({ error: "Не удалось подтвердить владельца" }, 403);
      }

      const bytes = base64ToBytes(fileBase64);
      // Limit ~15MB
      if (bytes.byteLength > 15 * 1024 * 1024) return json({ error: "Файл слишком большой" }, 413);

      const safeName = `contract_${bookingId.slice(0, 8)}_${Date.now()}.${suffix}`;
      const path = `${bookingId}/${safeName}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, bytes, {
        contentType, upsert: true,
      });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
      if (signErr || !signed?.signedUrl) throw signErr || new Error("Не удалось создать ссылку");
      return json({ url: signed.signedUrl });
    }

    return json({ error: "Неизвестное действие" }, 400);
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
