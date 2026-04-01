import jsPDF from "jspdf";

interface ContractData {
  name: string;
  phone: string;
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
}

export function generateContract(data: ContractData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const marginL = 20;
  const marginR = 20;
  const contentW = W - marginL - marginR;
  let y = 20;

  const addLine = (size: number, style: string, text: string, align: "left" | "center" | "right" = "left") => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    const lines = doc.splitTextToSize(text, contentW);
    const lineH = size * 0.45;
    for (const line of lines) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      if (align === "center") {
        doc.text(line, W / 2, y, { align: "center" });
      } else if (align === "right") {
        doc.text(line, W - marginR, y, { align: "right" });
      } else {
        doc.text(line, marginL, y);
      }
      y += lineH;
    }
    y += 2;
  };

  const today = new Date();
  const contractNo = `3DD-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000 + 1000)}`;
  const todayStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

  // Header
  addLine(16, "bold", "DOGOVOR ARENDY TRANSPORTNOGO SREDSTVA", "center");
  addLine(10, "normal", `No ${contractNo} ot ${todayStr}`, "center");
  y += 4;

  addLine(10, "normal", `OOO "3D Drive" (Arendodatel) i ${data.name} (Arendator),`);
  addLine(10, "normal", `tel.: ${data.phone},`);
  addLine(10, "normal", `zaklyuchili nastoyashchij dogovor o nizhessleduyushchem:`);
  y += 4;

  // Section 1
  addLine(12, "bold", "1. PREDMET DOGOVORA");
  addLine(10, "normal", `1.1 Arendodatel peredayet, a Arendator prinimayet vo vremennoye vladeniye i polzovaniye transportnoye sredstvo:`);
  addLine(10, "bold", `    Avtomobil: ${data.carLabel}`);
  addLine(10, "normal", `1.2 Srok arendy: s ${data.dateFrom} po ${data.dateTo} (${data.days} sut.)`);
  addLine(10, "normal", `1.3 Vozrast arendatora: ${data.ageLabel}`);
  addLine(10, "normal", `1.4 Stazh vozhdeniya: ${data.experienceLabel}`);
  y += 4;

  // Section 2
  addLine(12, "bold", "2. STOIMOST I PORYADOK RASCHETOV");
  addLine(10, "normal", `2.1 Sutochnaya stavka arendy: ${data.dailyRate.toLocaleString("ru-RU")} RUB`);
  if (data.extrasList.length > 0) {
    addLine(10, "normal", `2.2 Dopolnitelnyye optsii: ${data.extrasList.join(", ")}`);
    addLine(10, "normal", `    Stoimost optsij za ves srok: ${data.extrasCost.toLocaleString("ru-RU")} RUB`);
  }
  addLine(10, "bold", `2.3 Itogo stoimost arendy: ${data.totalCost.toLocaleString("ru-RU")} RUB`);
  addLine(10, "normal", `2.4 Predoplata (20%): ${data.prepay.toLocaleString("ru-RU")} RUB`);
  addLine(10, "normal", `2.5 Ostatok pri poluchenii: ${data.remaining.toLocaleString("ru-RU")} RUB`);
  addLine(10, "normal", `2.6 Zalog (vozvratnyj): ${data.deposit.toLocaleString("ru-RU")} RUB`);
  y += 4;

  // Section 3
  addLine(12, "bold", "3. PRAVA I OBYAZANNOSTI STORON");
  addLine(10, "normal", "3.1 Arendator obyazuyetsya:");
  addLine(10, "normal", "    - ispolzovat TS po naznacheniyu;");
  addLine(10, "normal", "    - ne peredavat TS tretyim litsam;");
  addLine(10, "normal", "    - vernut TS v nadlezhashchem sostoyanii;");
  addLine(10, "normal", "    - soblyudat PDD.");
  addLine(10, "normal", "3.2 Arendodatel obyazuyetsya:");
  addLine(10, "normal", "    - peredat TS v tekhnicheski ispravnom sostoyanii;");
  addLine(10, "normal", "    - obespechit dokumenty na TS.");
  y += 4;

  // Section 4
  addLine(12, "bold", "4. OTVETSTVENNOST");
  addLine(10, "normal", "4.1 V sluchaye povrezhdeniya TS Arendator nesyot materialnuyu otvetstvennost.");
  addLine(10, "normal", "4.2 Zalog udyerzhivayetsya v sluchaye narusheniya uslovij dogovora.");
  y += 4;

  // Section 5
  addLine(12, "bold", "5. ZAKLYUCHITELNYYE POLOZHENIYA");
  addLine(10, "normal", "5.1 Dogovor vstupayetv silu s momenta podpisaniya.");
  addLine(10, "normal", "5.2 Spory razreshayutsya v sootvetstvii s zakonodatelstvom RF.");
  addLine(10, "normal", "5.3 Dogovor sostavlen v 2 ekzemplyarakh.");
  y += 10;

  // Signatures
  addLine(12, "bold", "PODPISI STORON:");
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Arendodatel:", marginL, y);
  doc.text("Arendator:", W / 2 + 10, y);
  y += 8;
  doc.line(marginL, y, marginL + 60, y);
  doc.line(W / 2 + 10, y, W / 2 + 70, y);
  y += 5;
  doc.text('OOO "3D Drive"', marginL, y);
  doc.text(data.name, W / 2 + 10, y);

  doc.save(`Dogovor_${contractNo}.pdf`);
}
