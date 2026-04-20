import { supabase } from "@/integrations/supabase/client";
import { generateContract } from "./generateContract";
import { buildContractData } from "./contractHelper";
import type { BookingState } from "./bookingData";

const BUCKET = "contracts";
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10; // 10 years (effectively permanent for admin viewing)

/**
 * Generates a contract PDF from a booking state and uploads it to the
 * "contracts" storage bucket. Returns a signed URL that can be saved
 * to the booking record and opened from the admin panel.
 */
export async function uploadContractForBooking(
  state: BookingState,
  bookingId: string,
): Promise<string | null> {
  try {
    const data = buildContractData(state);
    if (!data) return null;

    const result = generateContract(data, { autoDownload: false });
    const path = `${bookingId}/${result.fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, result.blob, {
        contentType: "application/pdf",
        upsert: true,
      });

    // Free the temporary in-memory blob URL — we only needed the Blob itself.
    URL.revokeObjectURL(result.blobUrl);

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
  } catch (err) {
    console.error("Contract upload failed:", err);
    return null;
  }
}
