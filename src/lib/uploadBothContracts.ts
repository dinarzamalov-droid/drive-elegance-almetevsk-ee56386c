import { supabase } from "@/integrations/supabase/client";
import { generateContract } from "./generateContract";
import { generateContractDocx } from "./generateContractDocx";
import { buildContractData } from "./contractHelper";
import type { BookingState } from "./bookingData";

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < buf.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(buf.subarray(i, i + chunkSize)));
  }
  return btoa(binary);
}

async function uploadViaFunction(
  blob: Blob,
  bookingId: string,
  suffix: "pdf" | "docx",
  contentType: string,
  phone: string,
  email: string,
): Promise<string | null> {
  try {
    const fileBase64 = await blobToBase64(blob);
    const { data, error } = await supabase.functions.invoke("customer-booking", {
      body: {
        action: "upload_contract",
        bookingId, phone, email,
        fileBase64, suffix, contentType,
      },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data?.url ?? null;
  } catch (err) {
    console.error(`Upload error (${suffix}):`, err);
    return null;
  }
}

/**
 * Generate, upload PDF + DOCX (via edge function with service role) and return signed URLs.
 */
export async function uploadBothContractsForBooking(
  state: BookingState,
  bookingId: string,
): Promise<{ pdfUrl: string | null; docxUrl: string | null }> {
  const data = buildContractData(state);
  if (!data) return { pdfUrl: null, docxUrl: null };

  const phone = state.phone.trim();
  const email = state.email.trim();

  let pdfUrl: string | null = null;
  let docxUrl: string | null = null;

  try {
    const pdf = generateContract(data, { autoDownload: false });
    pdfUrl = await uploadViaFunction(pdf.blob, bookingId, "pdf", "application/pdf", phone, email);
    URL.revokeObjectURL(pdf.blobUrl);
  } catch (err) {
    console.error("PDF generation failed:", err);
  }

  try {
    const docx = await generateContractDocx(data);
    docxUrl = await uploadViaFunction(
      docx.blob, bookingId, "docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      phone, email,
    );
  } catch (err) {
    console.error("DOCX generation failed:", err);
  }

  return { pdfUrl, docxUrl };
}
