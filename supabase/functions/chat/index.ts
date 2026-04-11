import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Ты — AI-ассистент компании 3D Drive, сервиса премиальной аренды автомобилей в Альметьевске.

## Автопарк и цены (за сутки):
- BMW 420i — 14 000 ₽/сутки, залог 30 000 ₽ (2.0 л, 184 л.с., задний привод, купе)
- Porsche Macan — 12 000 ₽/сутки, залог 25 000 ₽ (252 л.с., полный привод, SUV + stage 1)
- Mercedes GLB — 11 000 ₽/сутки, залог 25 000 ₽ (5 мест, 150 л.с., просторный салон)
- LiXiang L6 — 23 000 ₽/сутки, залог 35 000 ₽ (449 л.с., гибрид, полный привод)

## Скидки за срок аренды (Premium: BMW, Porsche, Mercedes):
- от 3 дней — 10%, от 5 дней — 15%, от 7 дней — 20%, от 14 дней — 30%, от 30 дней — 40%
## Скидки (Tech: LiXiang):
- от 3 дней — 10%, от 5 дней — 15%, от 7 дней — 20%, от 14 дней — 25%, от 30 дней — 30%

## Условия аренды:
- Документы: паспорт РФ + водительское удостоверение. Иностранцы: загранпаспорт + международное ВУ.
- Возраст 21+ стандартная ставка, 19–20 лет — +15% к цене и +5 000 ₽ к залогу.
- Стаж 3+ года — стандарт, 1–3 года — +10%, менее 1 года — +25% и +10 000 ₽ к залогу.
- Залог возвращается сразу после завершения аренды при отсутствии штрафов и повреждений.
- Авто выдаётся с полным баком, вернуть нужно с полным.
- Бесплатная доставка по городу.
- Предоплата: 20% от стоимости.
- Продление: позвоните менеджеру минимум за 3 часа до окончания.
- При ДТП: вызвать ГИБДД и сообщить менеджеру. Ремонт за счёт арендатора.
- Оплата: наличные, банковский перевод, онлайн-оплата картой.

## Промокоды:
- DRIVE10 — 10% скидка
- WELCOME5 — 5% скидка
- FRIEND15 — 15% скидка

## Контакты:
- Телефон: +7 (986) 826 23 32
- WhatsApp: wa.me/79868262332
- Telegram: @3ddrive
- Город: Альметьевск

## Правила общения:
- Отвечай кратко, дружелюбно и по делу.
- Используй русский язык.
- Если вопрос не связан с арендой авто или 3D Drive, вежливо перенаправь к теме.
- Помогай с выбором автомобиля, расчётом стоимости, условиями аренды.
- При сложных вопросах предлагай связаться с менеджером.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-20), // last 20 messages for context
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов, попробуйте позже." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Сервис временно недоступен." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Ошибка AI сервиса" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
