import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const VALID_STATUSES = ["new", "confirmed", "cancelled", "completed"];
const VALID_FLEET_STATUSES = ["free", "busy", "maintenance"];
const VALID_LIST_STATUSES = ["normal", "white", "black"];
const VALID_LOYALTY_LEVELS = ["СВОБОДА", "ПРЕМИУМ", "VIP"];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { password, action } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // ── Auth: prefer JWT + admin role; fall back to legacy ADMIN_PASSWORD ──
    const authHeader = req.headers.get("Authorization") || "";
    const jwt = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    let authorized = false;

    if (jwt) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
      });
      const { data: userData } = await userClient.auth.getUser();
      if (userData?.user) {
        const adminClient = createClient(supabaseUrl, serviceKey);
        const { data: isAdmin } = await adminClient.rpc("has_role", {
          _user_id: userData.user.id,
          _role: "admin",
        });
        if (isAdmin === true) authorized = true;
      }
    }

    if (!authorized) {
      const adminPassword = Deno.env.get("ADMIN_PASSWORD");
      if (adminPassword && password && password === adminPassword) {
        authorized = true;
      }
    }

    if (!authorized) {
      return json({ error: "Доступ запрещён. Войдите как администратор." }, 401);
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // ── Update booking status ──
    if (action === "update_status") {
      const { bookingId, status } = body;
      if (!bookingId || !status || !VALID_STATUSES.includes(status)) {
        return json({ error: "Неверные параметры" }, 400);
      }
      const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
      if (error) throw error;
    }

    // ── Fleet actions ──
    if (action === "update_fleet") {
      const { carId, status, mileage, notes } = body;
      if (!carId) return json({ error: "carId обязателен" }, 400);
      const update: Record<string, unknown> = {};
      if (status && VALID_FLEET_STATUSES.includes(status)) update.status = status;
      if (typeof mileage === "number") update.mileage = mileage;
      if (typeof notes === "string") update.notes = notes;
      if (Object.keys(update).length === 0) return json({ error: "Нечего обновлять" }, 400);
      const { error } = await supabase.from("fleet").update(update).eq("id", carId);
      if (error) throw error;
    }

    // ── Client actions ──
    if (action === "update_client") {
      const { clientId, list_status, loyalty_level, bonus_balance, notes } = body;
      if (!clientId) return json({ error: "clientId обязателен" }, 400);
      const update: Record<string, unknown> = {};
      if (list_status && VALID_LIST_STATUSES.includes(list_status)) update.list_status = list_status;
      if (loyalty_level && VALID_LOYALTY_LEVELS.includes(loyalty_level)) update.loyalty_level = loyalty_level;
      if (typeof bonus_balance === "number") update.bonus_balance = bonus_balance;
      if (typeof notes === "string") update.notes = notes;
      if (Object.keys(update).length === 0) return json({ error: "Нечего обновлять" }, 400);
      const { error } = await supabase.from("clients").update(update).eq("id", clientId);
      if (error) throw error;
    }

    if (action === "add_bonus") {
      const { clientId, amount, reason } = body;
      if (!clientId || typeof amount !== "number") return json({ error: "clientId и amount обязательны" }, 400);
      const { data: client, error: fetchErr } = await supabase.from("clients").select("bonus_balance").eq("id", clientId).single();
      if (fetchErr) throw fetchErr;
      const newBalance = Math.max(0, (client.bonus_balance || 0) + amount);
      const { error } = await supabase.from("clients").update({ bonus_balance: newBalance }).eq("id", clientId);
      if (error) throw error;
    }

    // ── Sync clients from bookings ──
    if (action === "sync_clients") {
      const { data: bookings } = await supabase.from("bookings").select("first_name, last_name, middle_name, phone, email, total_cost");
      if (bookings) {
        const byPhone: Record<string, { first_name: string; last_name: string; middle_name: string | null; phone: string; email: string; total_spent: number; total_rentals: number }> = {};
        for (const b of bookings) {
          if (!byPhone[b.phone]) {
            byPhone[b.phone] = { first_name: b.first_name, last_name: b.last_name, middle_name: b.middle_name, phone: b.phone, email: b.email, total_spent: 0, total_rentals: 0 };
          }
          byPhone[b.phone].total_spent += b.total_cost || 0;
          byPhone[b.phone].total_rentals += 1;
        }
        for (const client of Object.values(byPhone)) {
          const { error } = await supabase.from("clients").upsert(
            { ...client },
            { onConflict: "phone" }
          );
        }
      }
    }

    // ── Fetch all data ──
    const [bookingsRes, fleetRes, clientsRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("fleet").select("*").order("car_label"),
      supabase.from("clients").select("*").order("last_name"),
    ]);

    if (bookingsRes.error) throw bookingsRes.error;
    if (fleetRes.error) throw fleetRes.error;
    if (clientsRes.error) throw clientsRes.error;

    return json({
      bookings: bookingsRes.data,
      fleet: fleetRes.data,
      clients: clientsRes.data,
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
});
