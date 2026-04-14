import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SPREADSHEET_ID = "1wd_yW_Gt8weqHhkEKGL3kdbID0wVD5EdYD7tyijoqU0";
const SHEET_NAME = "Бронирования";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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

  // Import the private key — handle escaped newlines
  const cleanedPem = privateKeyPem.replace(/\\n/g, "\n");
  const keyData = cleanedPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

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

  const sig = toBase64Url(new Uint8Array(signature));

  const jwt = `${unsignedToken}.${sig}`;

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok) throw new Error(`Token error: ${JSON.stringify(tokenData)}`);
  return tokenData.access_token;
}

async function appendRow(accessToken: string, values: string[]) {
  const range = `${SHEET_NAME}!A:Z`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [values] }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sheets append error: ${err}`);
  }
  return await res.json();
}

async function ensureHeaderRow(accessToken: string) {
  const range = `${SHEET_NAME}!A1:Z1`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    // Sheet might not exist — try to create it
    const createUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
    await fetch(createUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      }),
    });
  }

  const data = await res.json();
  if (!data.values || data.values.length === 0) {
    // Write header row
    const headerUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;
    await fetch(headerUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
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
          "Доп. опции", "Тариф/час", "Доп. расходы",
          "Итого", "Предоплата", "Остаток", "Залог",
          "Промокод", "Способ оплаты", "Мессенджер"
        ]],
      }),
    });
  }
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
      const { booking } = body;
      if (!booking) return json({ error: "booking data required" }, 400);

      await ensureHeaderRow(accessToken);

      const row = [
        booking.id || "",
        booking.created_at || new Date().toISOString(),
        booking.status || "new",
        booking.car_label || "",
        booking.date_from || "",
        booking.date_to || "",
        String(booking.days || ""),
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
        String(booking.daily_rate || ""),
        String(booking.extras_cost || ""),
        String(booking.total_cost || ""),
        String(booking.prepay || ""),
        String(booking.remaining || ""),
        String(booking.deposit || ""),
        booking.promo_code || "",
        booking.payment_method || "",
        booking.preferred_messenger || "",
      ];

      await appendRow(accessToken, row);
      return json({ success: true });
    }

    if (action === "sync_all_bookings") {
      // Fetch all bookings from DB and sync to sheet
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;

      await ensureHeaderRow(accessToken);

      if (bookings && bookings.length > 0) {
        const rows = bookings.map((b: any) => [
          b.id, b.created_at, b.status, b.car_label,
          b.date_from, b.date_to, String(b.days),
          b.last_name, b.first_name, b.middle_name || "",
          b.phone, b.email,
          b.passport_series || "", b.passport_number || "",
          b.passport_date || "", b.passport_code || "",
          b.license_number || "", b.license_date || "",
          b.city, b.delivery_time || "",
          b.age_category, b.experience_category,
          (b.selected_extras || []).join(", "),
          String(b.daily_rate), String(b.extras_cost),
          String(b.total_cost), String(b.prepay),
          String(b.remaining), String(b.deposit),
          b.promo_code || "", b.payment_method,
          b.preferred_messenger || "",
        ]);

        // Clear existing data and write all
        const range = `${SHEET_NAME}!A2:AF`;
        const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:clear`;
        await fetch(clearUrl, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
        await fetch(writeUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ values: rows }),
        });
      }

      return json({ success: true, count: bookings?.length || 0 });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("sync-google-sheets error:", err);
    return json({ error: err.message }, 500);
  }
});
