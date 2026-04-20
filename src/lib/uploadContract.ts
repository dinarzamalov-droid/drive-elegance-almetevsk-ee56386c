import { supabase } from "@/integrations/supabase/client";
import { generateContract, type GeneratedContract } from "./generateContract";
import { buildContractData } from "./contractHelper";
import { cars, ageOptions, experienceOptions, extrasConfig } from "./bookingData";
import type { BookingState } from "./bookingData";
import type { Booking } from "@/components/admin/types";

const BUCKET = "contracts";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // ~10 years

async function uploadAndSign(generated: GeneratedContract, bookingId: string): Promise<string | null> {
  // Supabase Storage rejects non-ASCII chars in object keys — use a safe ASCII filename
  const safeName = `contract_${bookingId.slice(0, 8)}_${Date.now()}.pdf`;
  const path = `${bookingId}/${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, generated.blob, { contentType: "application/pdf", upsert: true });
  URL.revokeObjectURL(generated.blobUrl);
  if (uploadError) {
    console.error("Contract upload error:", uploadError);
    return null;
  }
  const { data: signed, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signError || !signed?.signedUrl) {
    console.error("Contract signed URL error:", signError);
    return null;
  }
  return signed.signedUrl;
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
 * Re-generate, upload and sign a contract from an existing DB Booking row.
 * Used by the admin panel for old bookings that don't have a contract_url yet.
 */
export async function regenerateContractFromBooking(booking: Booking): Promise<string | null> {
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

    const result = generateContract({
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
    }, { autoDownload: false });

    const url = await uploadAndSign(result, booking.id);
    if (!url) return null;

    const { error } = await supabase
      .from("bookings" as any)
      .update({ contract_url: url } as any)
      .eq("id", booking.id);
    if (error) {
      console.error("Failed to save contract_url:", error);
      return null;
    }
    return url;
  } catch (err) {
    console.error("Contract regeneration failed:", err);
    return null;
  }
}
