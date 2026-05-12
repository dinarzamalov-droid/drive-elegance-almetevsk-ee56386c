import { supabase } from "@/integrations/supabase/client";
import { generateContract } from "./generateContract";
import { generateContractDocx } from "./generateContractDocx";
import { buildContractData } from "./contractHelper";
import type { BookingState } from "./bookingData";

const BUCKET = "contracts";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

async function uploadAndSign(blob: Blob, bookingId: string, suffix: string, contentType: string): Promise<string | null> {
  const safeName = `contract_${bookingId.slice(0, 8)}_${Date.now()}.${suffix}`;
  const path = `${bookingId}/${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType, upsert: true });
  if (uploadError) {
    console.error(`Upload error (${suffix}):`, uploadError);
    return null;
  }
  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signError || !signed?.signedUrl) {
    console.error(`Signed URL error (${suffix}):`, signError);
    return null;
  }
  return signed.signedUrl;
}

/**
 * Generate, upload PDF + DOCX and return signed URLs for both.
 */
export async function uploadBothContractsForBooking(
  state: BookingState,
  bookingId: string,
): Promise<{ pdfUrl: string | null; docxUrl: string | null }> {
  const data = buildContractData(state);
  if (!data) return { pdfUrl: null, docxUrl: null };

  let pdfUrl: string | null = null;
  let docxUrl: string | null = null;

  try {
    const pdf = generateContract(data, { autoDownload: false });
    pdfUrl = await uploadAndSign(pdf.blob, bookingId, "pdf", "application/pdf");
    URL.revokeObjectURL(pdf.blobUrl);
  } catch (err) {
    console.error("PDF generation failed:", err);
  }

  try {
    const docx = await generateContractDocx(data);
    docxUrl = await uploadAndSign(
      docx.blob,
      bookingId,
      "docx",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
  } catch (err) {
    console.error("DOCX generation failed:", err);
  }

  return { pdfUrl, docxUrl };
}
