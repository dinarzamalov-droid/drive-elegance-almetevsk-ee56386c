import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SPREADSHEET_ID = "1wd_yW_Gt8weqHhkEKGL3kdbID0wVD5EdYD7tyijoqU0";
const SHEET_NAME = "Бронирования";
const DATA_RANGE = `${SHEET_NAME}!A:AF`;
const HEADER_RANGE = `${SHEET_NAME}!A1:AF1`;

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getSupabaseAdmin() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Supabase service credentials not configured");
  return createClient(url, key);
}

// Build JWT from service account credentials
async function getAccessToken(): Promise<string> {
  const email = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKeyPem = Deno.env.get("GOOGLE_PRIVATE_KEY");
  if (!email || !privateKeyPem) throw new Error("Google credentials not configured");

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const toBase64Url = (buf: Uint8Array) => {
    let binary = "";
    for (const b of buf) binary += String.fromCharCode(b);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  const enc = (obj: unknown) => {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    return toBase64Url(bytes);
  };

  const unsignedToken = `${enc(header)}.${enc(payload)}`;

  let cleanedPem = privateKeyPem.trim();
  if ((cleanedPem.startsWith('"') && cleanedPem.endsWith('"')) ||
      (cleanedPem.startsWith("'") && cleanedPem.endsWith("'"))) {
    cleanedPem = cleanedPem.slice(1, -1);
  }
  if (cleanedPem.includes("\\n")) {
    cleanedPem = cleanedPem.replace(/\\n/g, "\n");
  }

  if (!cleanedPem.includes("BEGIN PRIVATE KEY")) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY secret is invalid: expected a PEM block starting with '-----BEGIN PRIVATE KEY-----'. " +
      "Please paste the full private_key value from the Google service account JSON file."
    );
  }

  const keyData = cleanedPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\s\r\n]/g, "");

  if (keyData.length < 500) {
    throw new Error(`GOOGLE_PRIVATE_KEY appears truncated (${keyData.length} base64 chars)`);
  }

  const raw = atob(keyData);
  const binaryKey = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) binaryKey[i] = raw.charCodeAt(i);

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const jwt = `${unsignedToken}.${toBase64Url(new Uint8Array(signature))}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  return tokenData.access_token;
}

async function sheetsRequest(accessToken: string, url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Sheets API ${res.status}: ${text}`);
  }
  return res;
}

async function ensureHeaderRow(accessToken: string) {
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(HEADER_RANGE)}`;
  let sheetExists = true;
  let data: any = null;

  try {
    const res = await sheetsRequest(accessToken, readUrl);
    data = await res.json();
  } catch {
    sheetExists = false;
  }

  if (!sheetExists) {
    const createUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
    await sheetsRequest(accessToken, createUrl, {
      method: "POST",
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      }),
    });
    data = null;
  }

  if (!data?.values?.length) {
    const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(HEADER_RANGE)}?valueInputOption=RAW`;
    await sheetsRequest(accessToken, writeUrl, {
      method: "PUT",
      body: JSON.stringify({
        values: [[
          "ID", "Дата создания", "Статус", "Автомобиль",
          "Дата начала", "Дата окончания", "Дни/Часы",
          "Фамилия", "Имя", "Отчество",
          "Телефон", "Email",
          "Паспорт серия", "Паспорт номер", "Паспорт дата", "Паспорт код",
          "ВУ номер", "ВУ дата",
          "Город", "Время подачи",
          "Возраст", "Стаж",
          "Доп. опции", "Тариф/сутки", "Доп. расходы",
          "Итого", "Предоплата", "Остаток", "Залог",
          "Промокод", "Способ оплаты", "Мессенджер"
        ]],
      }),
    });
  }
}

function bookingToRow(booking: any): string[] {
  return [
    booking.id || "",
    booking.created_at || new Date().toISOString(),
    booking.status || "new",
    booking.car_label || "",
    booking.date_from || "",
    booking.date_to || "",
    String(booking.days ?? ""),
    booking.last_name || "",
    booking.first_name || "",
    booking.middle_name || "",
    booking.phone || "",
    booking.email || "",
    booking.passport_series || "",
    booking.passport_number || "",
    booking.passport_date || "",
    booking.passport_code || "",
    booking.license_number || "",
    booking.license_date || "",
    booking.city || "",
    booking.delivery_time || "",
    booking.age_category || "",
    booking.experience_category || "",
    (booking.selected_extras || []).join(", "),
    String(booking.daily_rate ?? ""),
    String(booking.extras_cost ?? ""),
    String(booking.total_cost ?? ""),
    String(booking.prepay ?? ""),
    String(booking.remaining ?? ""),
    String(booking.deposit ?? ""),
    booking.promo_code || "",
    booking.payment_method || "",
    booking.preferred_messenger || "",
  ];
}

async function resolveBookingId(booking: any) {
  if (booking?.id) return booking;

  const supabase = getSupabaseAdmin();
  const query = supabase
    .from("bookings")
    .select("id, created_at, status")
    .eq("phone", booking.phone || "")
    .eq("email", booking.email || "")
    .eq("car_label", booking.car_label || "")
    .eq("date_from", booking.date_from || "")
    .eq("date_to", booking.date_to || "")
    .order("created_at", { ascending: false })
    .limit(1);

  const { data, error } = await query;
  if (error) throw error;
  const found = data?.[0];
  if (!found?.id) {
    throw new Error("Could not resolve booking id from Supabase");
  }

  return {
    ...booking,
    id: found.id,
    created_at: found.created_at || booking.created_at,
    status: found.status || booking.status,
  };
}

async function findSheetRowByBookingId(accessToken: string, bookingId: string): Promise<number | null> {
  const range = `${SHEET_NAME}!A2:A`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`;
  const res = await sheetsRequest(accessToken, url);
  const data = await res.json();
  const values: any[][] = data.values || [];
  const index = values.findIndex((row) => String(row?.[0] || "") === bookingId);
  return index >= 0 ? index + 2 : null;
}

async function upsertBookingRow(accessToken: string, booking: any): Promise<"inserted" | "updated"> {
  const row = bookingToRow(booking);
  const existingRow = await findSheetRowByBookingId(accessToken, booking.id);

  if (existingRow) {
    const range = `${SHEET_NAME}!A${existingRow}:AF${existingRow}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
    await sheetsRequest(accessToken, url, {
      method: "PUT",
      body: JSON.stringify({ values: [row] }),
    });
    return "updated";
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(DATA_RANGE)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  await sheetsRequest(accessToken, url, {
    method: "POST",
    body: JSON.stringify({ values: [row] }),
  });
  return "inserted";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action } = body;
    const accessToken = await getAccessToken();

    if (action === "append_booking") {
      if (!body.booking) return json({ error: "booking data required" }, 400);

      await ensureHeaderRow(accessToken);
      const booking = await resolveBookingId(body.booking);
      const resultAction = await upsertBookingRow(accessToken, booking);

      return json({
        success: true,
        action: resultAction,
        booking_id: booking.id,
      });
    }

    if (action === "sync_all_bookings") {
      const supabase = getSupabaseAdmin();
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      await ensureHeaderRow(accessToken);

      const clearRange = `${SHEET_NAME}!A2:AF`;
      const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(clearRange)}:clear`;
      await sheetsRequest(accessToken, clearUrl, { method: "POST" });

      if (bookings?.length) {
        const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(`${SHEET_NAME}!A2:AF`)}?valueInputOption=USER_ENTERED`;
        await sheetsRequest(accessToken, writeUrl, {
          method: "PUT",
          body: JSON.stringify({ values: bookings.map(bookingToRow) }),
        });
      }

      return json({
        success: true,
        action: "full_sync",
        count: bookings?.length || 0,
      });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("sync-google-sheets error:", err);
    return json({ error: (err as Error).message }, 500);
  }
});
