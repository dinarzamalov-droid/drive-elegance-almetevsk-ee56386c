export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  let result = "+7";
  if (digits.length > 1) result += " (" + digits.slice(1, 4);
  if (digits.length >= 4) result += ")";
  if (digits.length > 4) result += " " + digits.slice(4, 7);
  if (digits.length > 7) result += "-" + digits.slice(7, 9);
  if (digits.length > 9) result += "-" + digits.slice(9, 11);
  return result;
}

export function formatPassportSeries(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + " " + digits.slice(2);
}

export function formatPassportNumber(value: string): string {
  return value.replace(/\D/g, "").slice(0, 6);
}

export function formatPassportCode(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 3) return digits;
  return digits.slice(0, 3) + "-" + digits.slice(3);
}

export function formatLicenseNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + " " + digits.slice(2);
  return digits.slice(0, 2) + " " + digits.slice(2, 4) + " " + digits.slice(4);
}

export function stripPhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

export function stripDigits(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max);
}
