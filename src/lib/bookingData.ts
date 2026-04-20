import { Gauge } from "lucide-react";

export type CarCategory = "premium" | "tech";

export const cars = [
  { value: "bmw-420i", label: "BMW 420i", price: 14000, deposit: 30000, category: "premium" as CarCategory, specs: "2.0 л, 184 л.с., задний привод, купе", extras: { mileage: 2000, delivery: 2500 }, vehicle: { year: 2021, vin: "WBA31AV05NFL72427", enginePower: 184, plate: "Р016ТВ716", certNumber: "99 78 722006", body: "ЛИФТБЭК", color: "СЕРЫЙ", fuel: "БЕНЗИН", fuelLevel: 60, fuelType: "100", mileageLimit: 300 } },
  { value: "porsche-macan", label: "Porsche Macan", price: 12000, deposit: 25000, category: "premium" as CarCategory, specs: "252 л.с., полный привод, SUV + stage 1", extras: { mileage: 2500, delivery: 2500 }, vehicle: { year: 2018, vin: "WP1ZZZ95ZJB13501", enginePower: 252, plate: "У261СА716", certNumber: "99 81 491848", body: "ЛЕГКОВОЙ УНИВЕРСАЛ", color: "СИНИЙ", fuel: "БЕНЗИН", fuelLevel: 65, fuelType: "100", mileageLimit: 300 } },
  { value: "mercedes-glb", label: "Mercedes GLB", price: 11000, deposit: 25000, category: "premium" as CarCategory, specs: "5 мест, 150 л.с., просторный салон", extras: { mileage: 1500, delivery: 2500 }, vehicle: { year: 2021, vin: "W1N2476871W125187", enginePower: 150, plate: "С700ТС716", certNumber: "99 70 053353", body: "ЛЕГКОВОЙ УНИВЕРСАЛ", color: "БЕЛЫЙ", fuel: "БЕНЗИН", fuelLevel: 60, fuelType: "98", mileageLimit: 300 } },
  { value: "lixiang-l6", label: "LiXiang L6", price: 23000, deposit: 35000, category: "tech" as CarCategory, specs: "449 л.с., гибрид, полный привод", extras: { mileage: 3000, delivery: 2500 }, vehicle: { year: 2024, vin: "LJN4E5E24RB000000", enginePower: 449, plate: "—", certNumber: "—", body: "ЛЕГКОВОЙ УНИВЕРСАЛ", color: "ЧЁРНЫЙ", fuel: "ГИБРИД", fuelLevel: 70, fuelType: "АИ-100", mileageLimit: 300 } },
];

export const extrasConfig = [
  { id: "mileage", label: "Безлимитный пробег", icon: Gauge },
  { id: "delivery", label: "Доставка автомобиля (1 час водителя)", icon: Gauge },
] as const;

export const savingsConfig = [
  { id: "no-wash", label: "Подача без мойки", hint: "Автомобиль подаётся чистым, но без полировки. При возврате состояние оценивается менеджером — всё честно и прозрачно 🙌", discount: 500, type: "fixed" as const },
  { id: "empty-tank", label: "Возврат с пустым баком", hint: "Не нужно искать заправку перед возвратом — остаток топлива рассчитывается по рыночной цене и просто удерживается из залога ⛽", discount: 1500, type: "fixed" as const },
  { id: "economy-pack", label: "Пакет «Эконом» (без мойки + пустой бак)", hint: "Максимальная экономия — объединяет обе опции со скидкой", discount: 10, type: "percent" as const },
] as const;

export const ageOptions = [
  { value: "21+", label: "21 год и старше", multiplier: 1.0, depositExtra: 0 },
  { value: "19-20", label: "19–20 лет", multiplier: 1.15, depositExtra: 5000 },
];

export const experienceOptions = [
  { value: "3+", label: "3 года и более", multiplier: 1.0, depositExtra: 0 },
  { value: "1-3", label: "от 1 до 3 лет", multiplier: 1.1, depositExtra: 0 },
  { value: "0-1", label: "менее 1 года", multiplier: 1.25, depositExtra: 10000 },
];

export const durationDiscounts: Record<CarCategory, { minDays: number; discount: number }[]> = {
  premium: [
    { minDays: 30, discount: 0.40 },
    { minDays: 14, discount: 0.30 },
    { minDays: 7, discount: 0.20 },
    { minDays: 5, discount: 0.15 },
    { minDays: 3, discount: 0.10 },
  ],
  tech: [
    { minDays: 30, discount: 0.30 },
    { minDays: 14, discount: 0.25 },
    { minDays: 7, discount: 0.20 },
    { minDays: 5, discount: 0.15 },
    { minDays: 3, discount: 0.10 },
  ],
};

export function getDurationDiscount(category: CarCategory, days: number): number {
  const tiers = durationDiscounts[category];
  for (const tier of tiers) {
    if (days >= tier.minDays) return tier.discount;
  }
  return 0;
}

export const promoCodes: Record<string, { label: string; percent: number }> = {
  DRIVE10: { label: "DRIVE10 — 10%", percent: 10 },
  WELCOME5: { label: "WELCOME5 — 5%", percent: 5 },
  FRIEND15: { label: "FRIEND15 — 15%", percent: 15 },
};

export const PREPAY_PERCENT = 20;

export interface BookingState {
  // Step 1: Car
  car: string;
  // Step 2: Calculator
  age: string;
  experience: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  city: string;
  deliveryTime: string;
  selectedExtras: string[];
  selectedSavings: string[];
  isBirthday: boolean;
  isWedding: boolean;
  promoCode: string;
  appliedPromo: string | null;
  // Step 3: Client data
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  birthDate: string;
  passportSeries: string;
  passportNumber: string;
  passportDate: string;
  passportCode: string;
  passportIssuedBy: string;
  registrationAddress: string;
  licenseNumber: string;
  licenseDate: string;
  agreed: boolean;
  // Messenger for notifications
  preferredMessenger: "telegram" | "whatsapp" | "max" | "";
  // Step 5: Payment
  paymentMethod: "cash" | "transfer" | "online" | "";
}

export const initialBookingState: BookingState = {
  car: "",
  age: "21+",
  experience: "3+",
  dateFrom: undefined,
  dateTo: undefined,
  city: "Альметьевск",
  deliveryTime: "10:00",
  selectedExtras: [],
  selectedSavings: [],
  isBirthday: false,
  isWedding: false,
  promoCode: "",
  appliedPromo: null,
  lastName: "",
  firstName: "",
  middleName: "",
  phone: "",
  email: "",
  birthDate: "",
  passportSeries: "",
  passportNumber: "",
  passportDate: "",
  passportCode: "",
  passportIssuedBy: "",
  registrationAddress: "",
  licenseNumber: "",
  licenseDate: "",
  agreed: false,
  preferredMessenger: "",
  paymentMethod: "",
};
