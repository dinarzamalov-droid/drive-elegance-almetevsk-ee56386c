import { format } from "date-fns";

interface IcsEvent {
  title: string;
  description: string;
  dateFrom: Date;
  dateTo: Date;
  location?: string;
}

export function downloadIcsFile({ title, description, dateFrom, dateTo, location }: IcsEvent) {
  const fmt = (d: Date) => format(d, "yyyyMMdd");
  const now = format(new Date(), "yyyyMMdd'T'HHmmss");

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//3D Drive//Booking//RU",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${fmt(dateFrom)}`,
    `DTEND;VALUE=DATE:${fmt(dateTo)}`,
    `DTSTAMP:${now}`,
    `UID:${Date.now()}@3ddrive.ru`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    location ? `LOCATION:${location}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "3ddrive-booking.ics";
  a.click();
  URL.revokeObjectURL(url);
}
