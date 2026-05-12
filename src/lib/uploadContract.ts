import { supabase } from "@/integrations/supabase/client";
import { generateContract, type GeneratedContract, type ContractData } from "./generateContract";
import { generateContractDocx } from "./generateContractDocx";
import { buildContractData } from "./contractHelper";
import { cars, ageOptions, experienceOptions, extrasConfig } from "./bookingData";
import type { BookingState } from "./bookingData";
import type { Booking } from "@/components/admin/types";

const BUCKET = "contracts";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // ~10 years

async function uploadBlobAndSign(blob: Blob, bookingId: string, suffix: string, contentType: string): Promise<string | null> {
  const safeName = `contract_${bookingId.slice(0, 8)}_${Date.now()}.${suffix}`;
  const path = `${bookingId}/${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType, upsert: true });
  if (uploadError) {
    console.error(`Contract upload error (${suffix}):`, uploadError);
    return null;
  }
  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signError || !signed?.signedUrl) {
    console.error(`Contract signed URL error (${suffix}):`, signError);
    return null;
  }
  return signed.signedUrl;
}

async function uploadAndSign(generated: GeneratedContract, bookingId: string): Promise<string | null> {
  const url = await uploadBlobAndSign(generated.blob, bookingId, "pdf", "application/pdf");
  URL.revokeObjectURL(generated.blobUrl);
  return url;
}

async function generateAndUploadBoth(data: ContractData, bookingId: string): Promise<{ pdfUrl: string | null; docxUrl: string | null }> {
  let pdfUrl: string | null = null;
  let docxUrl: string | null = null;
  try {
    const pdf = generateContract(data, { autoDownload: false });
    pdfUrl = await uploadBlobAndSign(pdf.blob, bookingId, "pdf", "application/pdf");
    URL.revokeObjectURL(pdf.blobUrl);
  } catch (err) {
    console.error("PDF generation failed:", err);
  }
  try {
    const docx = await generateContractDocx(data);
    docxUrl = await uploadBlobAndSign(
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

/**
 * Generate, upload and sign a contract from the live booking flow state.
 */
export async function uploadContractForBooking(
  state: BookingState,
  bookingId: string,
): Promise<string | null> {
  try {
    const data = buildContractData(state);
    if (!data) return null;
    const result = generateContract(data, { autoDownload: false });
    return await uploadAndSign(result, bookingId);
  } catch (err) {
    console.error("Contract upload failed:", err);
    return null;
  }
}

/**
 * Re-generate, upload and sign a contract (PDF + DOCX) from an existing DB Booking row.
 * Used by the admin panel for old bookings that don't have contract URLs yet.
 */
export async function regenerateContractFromBooking(
  booking: Booking,
): Promise<{ pdfUrl: string | null; docxUrl: string | null } | null> {
  try {
    const car = cars.find((c) => c.value === booking.car_value);
    if (!car) return null;

    const fullName = `${booking.last_name} ${booking.first_name} ${booking.middle_name ?? ""}`.trim();
    const ageLabel = ageOptions.find((a) => a.value === booking.age_category)?.label ?? booking.age_category;
    const expLabel = experienceOptions.find((e) => e.value === booking.experience_category)?.label ?? booking.experience_category;
    const extrasList = (booking.selected_extras ?? []).map((id) => extrasConfig.find((e) => e.id === id)?.label ?? id);

    const formatDate = (iso: string) => {
      const d = new Date(iso);
      return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
    };

    const data: ContractData = {
      name: fullName,
      phone: booking.phone,
      email: booking.email,
      passportSeries: booking.passport_series ?? undefined,
      passportNumber: booking.passport_number ?? undefined,
      passportDate: booking.passport_date ?? undefined,
      passportCode: booking.passport_code ?? undefined,
      licenseNumber: booking.license_number ?? undefined,
      licenseDate: booking.license_date ?? undefined,
      carLabel: booking.car_label,
      dateFrom: formatDate(booking.date_from),
      dateTo: formatDate(booking.date_to),
      days: booking.days,
      dailyRate: booking.daily_rate,
      extrasList,
      extrasCost: booking.extras_cost,
      totalCost: booking.total_cost,
      prepay: booking.prepay,
      remaining: booking.remaining,
      deposit: booking.deposit,
      ageLabel,
      experienceLabel: expLabel,
      city: booking.city,
      vehicle: car.vehicle,
    };

    const { pdfUrl, docxUrl } = await generateAndUploadBoth(data, booking.id);

    const update: Record<string, string> = {};
    if (pdfUrl) update.contract_url = pdfUrl;
    if (docxUrl) update.contract_docx_url = docxUrl;

    if (Object.keys(update).length > 0) {
      const { error } = await supabase
        .from("bookings" as any)
        .update(update as any)
        .eq("id", booking.id);
      if (error) console.error("Failed to save contract URLs:", error);
    }

    return { pdfUrl, docxUrl };
  } catch (err) {
    console.error("Contract regeneration failed:", err);
    return null;
  }
}
