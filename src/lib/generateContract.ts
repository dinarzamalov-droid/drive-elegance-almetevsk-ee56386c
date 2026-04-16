import jsPDF from "jspdf";
import { ROBOTO_BASE64 } from "./robotoFont";
import { ROBOTO_BOLD_BASE64 } from "./robotoBoldFont";

interface ContractData {
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  passportSeries: string;
  passportNumber: string;
  passportDate: string;
  passportCode: string;
  licenseNumber: string;
  licenseDate: string;
  carLabel: string;
  dateFrom: string;
  dateTo: string;
  days: number;
  dailyRate: number;
  extrasList: string[];
  extrasCost: number;
  totalCost: number;
  prepay: number;
  remaining: number;
  deposit: number;
  ageLabel: string;
  experienceLabel: string;
  city: string;
  vehicle: {
    year: number;
    vin: string;
    enginePower: number;
    plate: string;
    certNumber: string;
    body: string;
    color: string;
    fuel: string;
    fuelLevel: number;
    fuelType: string;
    mileageLimit: number;
  };
}

function setupFonts(doc: jsPDF) {
  doc.addFileToVFS("Roboto-Regular.ttf", ROBOTO_BASE64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.addFileToVFS("Roboto-Bold.ttf", ROBOTO_BOLD_BASE64);
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
  doc.setFont("Roboto", "normal");
}

export function generateContract(data: ContractData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  setupFonts(doc);

  const W = doc.internal.pageSize.getWidth();
  const marginL = 18;
  const marginR = 18;
  const contentW = W - marginL - marginR;
  let y = 18;

  const fmt = (n: number) => n.toLocaleString("ru-RU");

  const checkPage = (needed: number = 8) => {
    if (y > 280 - needed) {
      doc.addPage();
      y = 18;
    }
  };

  const addText = (size: number, style: "normal" | "bold", text: string, align: "left" | "center" = "left") => {
    doc.setFontSize(size);
    doc.setFont("Roboto", style);
    const lines: string[] = doc.splitTextToSize(text, contentW);
    const lineH = size * 0.42;
    for (const line of lines) {
      checkPage(lineH + 2);
      if (align === "center") {
        doc.text(line, W / 2, y, { align: "center" });
      } else {
        doc.text(line, marginL, y);
      }
      y += lineH;
    }
    y += 1.5;
  };

  const gap = (h: number = 3) => { y += h; };

  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
  const contractNo = Math.floor(Math.random() * 900 + 100);
  const v = data.vehicle;

  // === HEADER ===
  addText(14, "bold", `ДОГОВОР АРЕНДЫ ТС № ${contractNo}`, "center");
  gap(2);
  doc.setFontSize(9);
  doc.setFont("Roboto", "normal");
  doc.text(`г. ${data.city}`, marginL, y);
  doc.text(todayStr, W - marginR, y, { align: "right" });
  y += 6;

  addText(9, "normal", `Индивидуальный предприниматель Замалов Динар Рамисович, именуемый в дальнейшем «Арендодатель», с одной стороны и ${data.name}, ${data.birthDate} г.р., именуемый в дальнейшем «Арендатор», с другой стороны, заключили настоящий договор о следующем.`);
  gap(4);

  // === 1. ПРЕДМЕТ ДОГОВОРА ===
  addText(11, "bold", "1. ПРЕДМЕТ ДОГОВОРА");
  gap(1);
  addText(9, "normal", "1.1. Арендодатель передает, а Арендатор принимает во временное пользование транспортное средство:");
  gap(1);

  const carInfo = [
    `Марка: ${data.carLabel}`,
    `Год выпуска: ${v.year}`,
    `VIN: ${v.vin}`,
    `Мощность двигателя: ${v.enginePower} л.с.`,
    `Государственный регистрационный знак: ${v.plate}`,
    `Свидетельство о регистрации: ${v.certNumber}`,
    `Кузов: ${v.body}`,
    `Цвет: ${v.color}`,
    `Рекомендуемое топливо: ${v.fuel}`,
    `Уровень топлива (расход по км): ${v.fuelLevel}`,
    `Тип топлива: ${v.fuelType}`,
  ];
  for (const line of carInfo) {
    addText(9, "normal", line);
  }
  gap(2);

  addText(9, "normal", `1.2. Срок аренды: с ${data.dateFrom} до ${data.dateTo}. Всего: ${data.days} суток.`);
  addText(9, "normal", `1.3. Место передачи ТС: г. ${data.city}.`);
  addText(9, "normal", "1.4. ТС предоставляется в аренду исключительно для личного пользования.");
  addText(9, "normal", "1.5. ТС может использоваться только в пределах Республики Татарстан. Выезд за пределы — только по письменному согласованию.");
  gap(4);

  // === 2. ОБЯЗАТЕЛЬСТВА СТОРОН ===
  addText(11, "bold", "2. ОБЯЗАТЕЛЬСТВА СТОРОН");
  gap(1);
  addText(9, "bold", "2.1. Арендатор обязан:");
  const obligations = [
    "— Иметь водительские права категории B и стаж вождения не менее 3 лет.",
    "— Лично управлять ТС, не передавать третьим лицам.",
    "— Соблюдать ПДД РФ, не превышать скоростной режим (трасса 130 км/ч, город 80 км/ч).",
    "— Вернуть ТС в чистом виде, с полным баком топлива.",
    "— Не курить в салоне.",
    "— Не использовать ТС для такси, буксировки, дрифта, бернаута, гонок, езды по бездорожью.",
    "— При ДТП немедленно сообщить Арендодателю, вызвать ГИБДД.",
  ];
  for (const o of obligations) addText(9, "normal", o);
  gap(2);

  addText(9, "bold", "2.2. Арендатору ЗАПРЕЩАЕТСЯ:");
  const prohibitions = [
    "— Передавать управление третьим лицам.",
    "— Использовать ТС в коммерческих целях.",
    "— Превышать скоростной режим.",
    "— Курить в салоне, распивать алкоголь.",
    "— Перевозить детей без специальных кресел.",
    "— Оставлять ТС открытым.",
    "— Парковаться в неположенном месте.",
  ];
  for (const p of prohibitions) addText(9, "normal", p);
  gap(4);

  // === 3. ФИНАНСОВЫЕ УСЛОВИЯ ===
  addText(11, "bold", "3. ФИНАНСОВЫЕ УСЛОВИЯ");
  gap(1);
  addText(9, "normal", `3.1. Стоимость аренды: ${fmt(data.dailyRate)} ₽/сутки.`);
  addText(9, "normal", `3.2. Общая сумма аренды: ${fmt(data.totalCost)} ₽.`);
  if (data.extrasList.length > 0) {
    addText(9, "normal", `3.3. Дополнительные опции: ${data.extrasList.join(", ")} (${fmt(data.extrasCost)} ₽).`);
  }
  addText(9, "normal", `3.4. Предоплата (20%): ${fmt(data.prepay)} ₽.`);
  addText(9, "normal", `3.5. Остаток при получении: ${fmt(data.remaining)} ₽.`);
  addText(9, "normal", `3.6. Залог (возвратный): ${fmt(data.deposit)} ₽ (возвращается после аренды при отсутствии нарушений).`);
  addText(9, "normal", `3.7. Лимит пробега: ${v.mileageLimit} км/сутки. Перепробег — 25 ₽/км.`);
  gap(1);
  addText(9, "normal", "3.8. При задержке возврата ТС:");
  addText(9, "normal", "    — от 1 до 4 часов — доплата 30% стоимости аренды");
  addText(9, "normal", "    — от 4 до 12 часов — доплата 50%");
  addText(9, "normal", "    — от 12 до 24 часов — доплата 100%");
  gap(4);

  // === 4. ОТВЕТСТВЕННОСТЬ ===
  addText(11, "bold", "4. ОТВЕТСТВЕННОСТЬ");
  gap(1);
  const penalties = [
    "4.1. За повреждения ТС в результате ДТП по вине Арендатора — полная стоимость восстановительного ремонта.",
    "4.2. За утерю ключей — штраф 100 000 руб. + стоимость изготовления нового комплекта.",
    "4.3. За оставление ТС в открытом виде — штраф 20 000 руб.",
    "4.4. За эвакуацию ТС на штрафстоянку по вине Арендатора — возмещение расходов + штраф 50 000 руб.",
    "4.5. За управление в состоянии алкогольного/наркотического опьянения — штраф 50 000 руб. + полный ущерб.",
    "4.6. За передачу управления третьим лицам — штраф 100 000 руб.",
    "4.7. За превышение скоростного режима — штраф 10 000 руб.",
    "4.8. За курение (включая вэйп, кальян, электронные сигареты) в салоне — штраф 10 000 руб.",
    "4.9. За утрату свидетельства о регистрации ТС (СТС) — штраф 10 000 руб.",
    "4.10. За умышленное повреждение ТС — штраф 30 000 руб. + стоимость ущерба.",
    "4.11. За заправку нерекомендованным топливом — штраф 50 000 руб. + стоимость ущерба.",
    "4.12. За буксировку другого ТС или использование прицепа — штраф 10 000 руб.",
    "4.13. За нарушение скоростного режима (отдельно по правилам) — штраф 10 000 руб.",
    "4.14. За передачу ТС в субаренду или третьим лицам — штраф 100 000 руб.",
    "4.15. За управление ТС без действующего ВУ — штраф 50 000 руб. + полный ущерб.",
    "4.16. За загрязнение салона, требующее химической чистки — стоимость химчистки 10 000 руб.",
    "4.17. За мойку кузова при возврате грязного авто — 1 000–1 500 руб.",
    "4.18. За возврат с уровнем топлива ниже, чем при выдаче — 100 руб./литр.",
  ];
  for (const p of penalties) addText(9, "normal", p);
  gap(4);

  // === 5. ДАННЫЕ АРЕНДАТОРА ===
  addText(11, "bold", "5. ДАННЫЕ АРЕНДАТОРА");
  gap(1);
  addText(9, "normal", `ФИО: ${data.name}`);
  addText(9, "normal", `Дата рождения: ${data.birthDate}`);
  addText(9, "normal", `Паспорт: ${data.passportSeries} ${data.passportNumber} выдан ${data.passportDate}, код ${data.passportCode}`);
  addText(9, "normal", `Телефон: ${data.phone}`);
  addText(9, "normal", `Email: ${data.email}`);
  addText(9, "normal", `Водительское удостоверение: ${data.licenseNumber} выдан ${data.licenseDate}`);
  gap(4);

  // === 6. ПОМОЩЬ НА ДОРОГЕ ===
  addText(11, "bold", "6. ПОМОЩЬ НА ДОРОГЕ (за дополнительную плату)");
  gap(1);
  const roadHelp = [
    "— Экстренная техническая помощь при ДТП/неисправности",
    "— Эвакуация автомобиля (в радиусе 50 км)",
    "— Выезд аварийного комиссара",
    "— Содействие в сборе документов для страховой",
    "— Подвоз топлива",
    "— Забор авто со штрафстоянки",
  ];
  for (const r of roadHelp) addText(9, "normal", r);
  gap(4);

  // === 7. СОГЛАСИЕ НА ОБРАБОТКУ ===
  addText(11, "bold", "7. СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ");
  gap(1);
  addText(9, "normal", "Арендатор дает согласие на обработку своих персональных данных (ФИО, паспорт, ВУ, телефон, адрес) для целей заключения и исполнения договора. Согласие действует бессрочно, может быть отозвано письменным уведомлением за 30 дней.");
  gap(4);

  // === 8. ПРИЛОЖЕНИЯ ===
  addText(11, "bold", "8. ПРИЛОЖЕНИЯ");
  gap(1);
  addText(9, "normal", "Приложение №1 — Акт приёма-передачи ТС");
  addText(9, "normal", "Приложение №2 — Правила пользования автомобилем");
  addText(9, "normal", "Приложение №3 — Критерии определения нормального износа автомобиля");
  gap(6);

  // === ПРИЛОЖЕНИЕ №1 ===
  checkPage(40);
  addText(11, "bold", "АКТ ПРИЁМА-ПЕРЕДАЧИ ТРАНСПОРТНОГО СРЕДСТВА (Приложение №1)", "center");
  gap(2);
  doc.setFontSize(9);
  doc.setFont("Roboto", "normal");
  doc.text(`г. ${data.city}`, marginL, y);
  doc.text(todayStr, W - marginR, y, { align: "right" });
  y += 5;
  addText(9, "normal", `Арендодатель передал, а Арендатор принял автомобиль ${data.carLabel}, госномер ${v.plate}, в технически исправном состоянии, чистым, с полным баком топлива.`);
  gap(1);
  addText(9, "normal", "Пробег на момент передачи: ___________ км.");
  addText(9, "normal", "Уровень топлива: полный бак.");
  addText(9, "normal", "Претензий к внешнему виду и техническому состоянию нет.");
  gap(4);
  addText(9, "normal", "Арендодатель: ИП Замалов Д.Р.  /_______________/");
  addText(9, "normal", `Арендатор: ${data.name}  /_______________/`);
  gap(6);

  // === ПРИЛОЖЕНИЕ №2 ===
  checkPage(40);
  addText(11, "bold", "ПРАВИЛА ПОЛЬЗОВАНИЯ АВТОМОБИЛЕМ (Приложение №2)", "center");
  gap(2);
  const rules = [
    `1. Суточный пробег ${v.mileageLimit} км. Перепробег — 25 руб./км.`,
    "2. География использования: Республика Татарстан.",
    "3. При ДТП по вине Арендатора — полное возмещение ущерба.",
    "4. Топливо: возврат с полным баком, иначе 100 руб./литр.",
    "5. Автомобиль возвращается чистым. Мойка кузова — 1 000–1 500 руб., химчистка салона — 10 000 руб.",
    "6. Утрата СТС — штраф 10 000 руб.",
    "7. Утрата ключей — штраф 100 000 руб. + стоимость изготовления.",
    "8. Выезд представителя Арендодателя — 2 500 руб.",
    "9. Курение запрещено (штраф 10 000 руб.).",
    "10. Буксировка запрещена (штраф 10 000 руб.).",
    "11. Ограничение скорости: трасса — 130 км/ч, город — 80 км/ч (штраф 10 000 руб.).",
    "12. Запрещены: дрифт, бернаут, гонки, езда по бездорожью.",
  ];
  for (const r of rules) addText(9, "normal", r);
  gap(6);

  // === ПРИЛОЖЕНИЕ №3 ===
  checkPage(40);
  addText(11, "bold", "КРИТЕРИИ ОПРЕДЕЛЕНИЯ НОРМАЛЬНОГО ИЗНОСА АВТОМОБИЛЯ (Приложение №3)", "center");
  gap(2);
  addText(9, "bold", "Приемлемо:");
  const acceptable = [
    "— Сколы и царапины до 5 см, удаляемые полировкой",
    "— Вмятины до 1 см (не более двух на деталь)",
    "— Сколы от камней до 1% поверхности, без коррозии",
  ];
  for (const a of acceptable) addText(9, "normal", a);
  gap(2);
  addText(9, "bold", "Неприемлемо:");
  const unacceptable = [
    "— Сколы и царапины более 5 см",
    "— Вмятины более 1 см",
    "— Коррозия, сколы до металла",
    "— Повреждения дисков (царапины более 2 см, деформация)",
    "— Трещины на стекле в зоне А (более 0,2 см)",
    "— Загрязнения салона, требующие химчистки",
    "— Порезы, разрывы обивки",
    "— Неприятные запахи",
  ];
  for (const u of unacceptable) addText(9, "normal", u);
  gap(8);

  // === 9. ПОДПИСИ СТОРОН ===
  checkPage(30);
  addText(11, "bold", "9. ПОДПИСИ СТОРОН");
  gap(4);
  doc.setFontSize(9);
  doc.setFont("Roboto", "normal");
  doc.text("Арендодатель: ИП Замалов Д.Р.", marginL, y);
  doc.text("Арендатор:", W / 2 + 10, y);
  y += 8;
  doc.line(marginL, y, marginL + 60, y);
  doc.line(W / 2 + 10, y, W / 2 + 70, y);
  y += 5;
  doc.text("ИП Замалов Д.Р.", marginL, y);
  doc.text(data.name, W / 2 + 10, y);
  y += 6;
  doc.text(`Дата: ${todayStr}`, marginL, y);

  doc.save(`Договор_аренды_${contractNo}.pdf`);
}
