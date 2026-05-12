import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";
import { CONTRACT_BLOCKS } from "./contractTemplate";
import { buildPlaceholders, applyPlaceholders, type ContractData } from "./generateContract";

export interface GeneratedDocx {
  blob: Blob;
  fileName: string;
}

const border = { style: BorderStyle.SINGLE, size: 4, color: "BBBBBB" };
const cellBorders = { top: border, bottom: border, left: border, right: border };

function p(text: string, opts: { bold?: boolean; size?: number; align?: AlignmentType; heading?: typeof HeadingLevel[keyof typeof HeadingLevel] } = {}) {
  return new Paragraph({
    alignment: opts.align,
    heading: opts.heading,
    spacing: { after: 80 },
    children: [new TextRun({ text, bold: opts.bold, size: opts.size ?? 20 })],
  });
}

function makeTable(rows: [string, string][], ph: Record<string, string>) {
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: [4950, 4050],
    rows: rows.map(([k, v]) =>
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            width: { size: 4950, type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: applyPlaceholders(k, ph), size: 18 })] })],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 4050, type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 100, right: 100 },
            children: [new Paragraph({ children: [new TextRun({ text: applyPlaceholders(v, ph), size: 18 })] })],
          }),
        ],
      })
    ),
  });
}

export async function generateContractDocx(data: ContractData): Promise<GeneratedDocx> {
  const ph = buildPlaceholders(data);
  const children: (Paragraph | Table)[] = [];

  for (const b of CONTRACT_BLOCKS) {
    switch (b.kind) {
      case "h1":
        children.push(p(applyPlaceholders(b.text, ph), { bold: true, size: 28, align: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1 }));
        break;
      case "h2":
        children.push(p(applyPlaceholders(b.text, ph), { bold: true, size: 24, heading: HeadingLevel.HEADING_2 }));
        break;
      case "p":
        children.push(p(applyPlaceholders(b.text, ph)));
        break;
      case "table":
        children.push(makeTable(b.rows, ph));
        children.push(new Paragraph({ children: [new TextRun("")] }));
        break;
      case "spacer":
        children.push(new Paragraph({ children: [new TextRun("")] }));
        break;
      case "pagebreak":
        children.push(new Paragraph({ children: [new TextRun("")], pageBreakBefore: true }));
        break;
      case "signatures":
        children.push(p("Арендодатель: ИП Замалов Динар Рамисович  / ______________________", { bold: true }));
        children.push(p(`Арендатор: ${data.name}  / ______________________`, { bold: true }));
        break;
      case "actSignatures":
      case "wearSignatures":
        children.push(p(`Арендодатель: ИП Замалов Д.Р.  / ______________________`));
        children.push(p(`Арендатор: ${data.name}  / ______________________`));
        break;
    }
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 20 } } } },
    sections: [
      {
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } } },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Договор_аренды_${ph.contractNo}.docx`;
  return { blob, fileName };
}
