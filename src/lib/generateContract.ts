import jsPDF from "jspdf";
import { ROBOTO_BASE64 } from "./robotoFont";
import { ROBOTO_BOLD_BASE64 } from "./robotoBoldFont";
import { CONTRACT_BLOCKS, type ContractBlock } from "./contractTemplate";

interface ContractData {
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  passportSeries?: string;
  passportNumber?: string;
  passportDate?: string;
  passportCode?: string;
  passportIssuedBy?: string;
  registrationAddress?: string;
  licenseNumber?: string;
  licenseDate?: string;
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
  city?: string;
  vehicle?: {
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

export interface GeneratedContract {
  blobUrl: string;
  blob: Blob;
  fileName: string;
  download: () => void;
}

const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

function fmtNum(n: number) {
  return n.toLocaleString("ru-RU");
}

/** Грубое преобразование ФИО в родительный падеж для акта приёма-передачи */
function toGenitive(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts
    .map((w) => {
      if (/[аеёиоуыэюя]$/i.test(w)) {
        if (/я$/i.test(w)) return w.slice(0, -1) + "и";
        if (/а$/i.test(w)) return w.slice(0, -1) + "ы";
      }
      if (/[бвгджзйклмнпрстфхцчшщ]$/i.test(w)) return w + "а";
      if (/й$/i.test(w)) return w.slice(0, -1) + "я";
      if (/ь$/i.test(w)) return w.slice(0, -1) + "я";
      return w;
    })
    .join(" ");
}

function buildPlaceholders(data: ContractData): Record<string, string> {
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;
  const contractNo = String(Math.floor(Math.random() * 900 + 100));
  const validUntil = `31 декабря ${today.getFullYear()}`;
  const v = data.vehicle || {
    year: 0, vin: "—", enginePower: 0, plate: "—", certNumber: "—",
    body: "—", color: "—", fuel: "—", fuelLevel: 0, fuelType: "—", mileageLimit: 300,
  };
  const passportFull = [
    data.passportSeries && data.passportNumber ? `${data.passportSeries} ${data.passportNumber}` : null,
    data.passportIssuedBy ? `выдан ${data.passportIssuedBy}` : null,
    data.passportDate ? `дата выдачи ${data.passportDate}` : null,
    data.passportCode ? `код подразделения ${data.passportCode}` : null,
  ].filter(Boolean).join(", ") || "—";
  const licenseFull = data.licenseNumber || "—";

  return {
    contractNo,
    date: dateStr,
    dateDay: String(today.getDate()).padStart(2, "0"),
    dateMonthName: MONTHS[today.getMonth()],
    dateYear: String(today.getFullYear()),
    city: data.city || "Альметьевск",
    name: data.name,
    nameGenitive: toGenitive(data.name),
    birthDate: data.birthDate || "—",
    licenseFull,
    licenseValid: data.licenseDate || "—",
    passportFull,
    passportAddress: data.registrationAddress || "—",
    phone: data.phone,
    email: data.email || "—",
    carLabel: data.carLabel,
    vehicleYear: String(v.year || "—"),
    vin: v.vin,
    enginePower: String(v.enginePower || "—"),
    plate: v.plate,
    certNumber: v.certNumber,
    body: v.body,
    color: v.color,
    fuel: v.fuel,
    fuelLevel: String(v.fuelLevel),
    fuelType: v.fuelType,
    dateFromFull: `${data.dateFrom} 19:00`,
    dateToFull: `${data.dateTo} 19:00`,
    dateFrom: data.dateFrom,
    dateTo: data.dateTo,
    mileageLimit: String(v.mileageLimit),
    totalCost: fmtNum(data.totalCost),
    prepay: fmtNum(data.prepay),
    deposit: fmtNum(data.deposit),
    contractValidUntil: validUntil,
  };
}

function applyPlaceholders(text: string, ph: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => ph[k] ?? `{{${k}}}`);
}

export function generateContract(
  data: ContractData,
  options: { autoDownload?: boolean } = { autoDownload: true },
): GeneratedContract {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  setupFonts(doc);

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const marginL = 18;
  const marginR = 18;
  const marginB = 20;
  const contentW = W - marginL - marginR;
  let y = 20;

  const ph = buildPlaceholders(data);

  const ensureSpace = (needed: number) => {
    if (y + needed > H - marginB) {
      doc.addPage();
      y = 20;
    }
  };

  const drawText = (size: number, style: "normal" | "bold", text: string, align: "left" | "center" = "left", lineGap = 1.5) => {
    doc.setFontSize(size);
    doc.setFont("Roboto", style);
    const lines: string[] = doc.splitTextToSize(text, contentW);
    const lineH = size * 0.45;
    for (const line of lines) {
      ensureSpace(lineH);
      if (align === "center") doc.text(line, W / 2, y, { align: "center" });
      else doc.text(line, marginL, y);
      y += lineH;
    }
    y += lineGap;
  };

  const drawTable = (rows: [string, string][]) => {
    doc.setFontSize(9);
    doc.setFont("Roboto", "normal");
    const col1 = contentW * 0.55;
    const col2 = contentW * 0.45;
    const padX = 2;
    const lineH = 4.2;
    for (const [k, v] of rows) {
      const kVal = applyPlaceholders(k, ph);
      const vVal = applyPlaceholders(v, ph);
      const kLines: string[] = doc.splitTextToSize(kVal, col1 - padX * 2);
      const vLines: string[] = doc.splitTextToSize(vVal, col2 - padX * 2);
      const rowH = Math.max(kLines.length, vLines.length) * lineH + 2;
      ensureSpace(rowH);
      doc.setDrawColor(180);
      doc.rect(marginL, y - lineH + 1, col1, rowH);
      doc.rect(marginL + col1, y - lineH + 1, col2, rowH);
      let yk = y;
      for (const l of kLines) { doc.text(l, marginL + padX, yk); yk += lineH; }
      let yv = y;
      for (const l of vLines) { doc.text(l, marginL + col1 + padX, yv); yv += lineH; }
      y += rowH;
    }
    y += 2;
  };

  const drawSignatures = () => {
    ensureSpace(70);
    const colW = contentW / 2 - 4;
    const xL = marginL;
    const xR = marginL + colW + 8;
    const startY = y;
    doc.setFontSize(9);
    doc.setFont("Roboto", "bold");
    doc.text("Арендодатель", xL, y);
    doc.text("Арендатор", xR, y);
    y += 5;
    doc.setFont("Roboto", "normal");
    const left = [
      "Наименование: 3D Drive",
      "Адрес: 423403, Россия, Республика Татарстан,",
      "г. Альметьевск, ул. Гафиатуллина 48",
      "ИНН: 164491440697",
      "ОГРН: 325169000076451",
      "р/счет №: 40802810529950002605",
      "Тел: +7 (986) 826-23-32",
      "Банк: ФИЛИАЛ «НИЖЕГОРОДСКИЙ» АО «АЛЬФА-БАНК»",
      "корр. счёт: 30101810200000000824",
      "",
      "ИП Замалов Д.Р.",
      "Подпись ________________ /",
    ];
    const right = [
      `ФИО: ${data.name}`,
      `Дата рождения: ${data.birthDate || "—"}`,
      `Паспорт: ${ph.passportFull}`,
      `Адрес: ${ph.passportAddress}`,
      `Тел: ${data.phone}`,
      `Email: ${data.email || "—"}`,
      `Водительское удостоверение: ${ph.licenseFull}`,
      `сроком действия до ${ph.licenseValid} г.`,
      "",
      "",
      "",
      "Подпись ________________ /",
    ];
    const lineH = 4.2;
    let yL = y, yR = y;
    for (const t of left) {
      const ls: string[] = doc.splitTextToSize(t, colW);
      for (const l of ls) { doc.text(l, xL, yL); yL += lineH; }
    }
    for (const t of right) {
      const ls: string[] = doc.splitTextToSize(t, colW);
      for (const l of ls) { doc.text(l, xR, yR); yR += lineH; }
    }
    y = Math.max(yL, yR) + 4;
    void startY;
  };

  const drawActSignatures = () => {
    ensureSpace(20);
    doc.setFontSize(9);
    doc.setFont("Roboto", "normal");
    doc.text(`Арендодатель: Замалов Динар Рамисович  / ______________________`, marginL, y);
    y += 6;
    doc.text(`Арендатор: ${data.name}  / ______________________`, marginL, y);
    y += 6;
  };

  const renderBlock = (b: ContractBlock) => {
    switch (b.kind) {
      case "h1":
        ensureSpace(10);
        drawText(13, "bold", applyPlaceholders(b.text, ph), "center", 3);
        break;
      case "h2":
        ensureSpace(8);
        drawText(11, "bold", applyPlaceholders(b.text, ph), "left", 2);
        break;
      case "p":
        drawText(9, "normal", applyPlaceholders(b.text, ph));
        break;
      case "table":
        drawTable(b.rows);
        break;
      case "spacer":
        y += b.size ?? 3;
        break;
      case "pagebreak":
        doc.addPage();
        y = 20;
        break;
      case "signatures":
        drawSignatures();
        break;
      case "actSignatures":
        drawActSignatures();
        break;
    }
  };

  for (const block of CONTRACT_BLOCKS) renderBlock(block);

  const blob = doc.output("blob");
  const blobUrl = URL.createObjectURL(blob);
  const fileName = `Договор_аренды_${ph.contractNo}.pdf`;

  const download = () => {
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
    a.click();
  };

  if (options.autoDownload) download();

  return { blobUrl, blob, fileName, download };
}
