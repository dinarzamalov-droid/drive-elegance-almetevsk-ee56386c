import { format } from "date-fns";
import { cars, ageOptions, experienceOptions } from "@/lib/bookingData";
import { getBookingCalculations } from "@/lib/bookingCalculations";
import type { BookingState } from "@/lib/bookingData";

export function buildContractData(state: BookingState) {
  const calc = getBookingCalculations(state);
  const selectedCar = cars.find((c) => c.value === state.car);
  if (!selectedCar || !state.dateFrom || !state.dateTo) return null;

  const fullName = `${state.lastName} ${state.firstName} ${state.middleName}`.trim();

  return {
    name: fullName,
    phone: state.phone,
    email: state.email,
    birthDate: state.birthDate,
    passportSeries: state.passportSeries,
    passportNumber: state.passportNumber,
    passportDate: state.passportDate,
    passportCode: state.passportCode,
    licenseNumber: state.licenseNumber,
    licenseDate: state.licenseDate,
    carLabel: selectedCar.label,
    dateFrom: format(state.dateFrom, "dd.MM.yyyy"),
    dateTo: format(state.dateTo, "dd.MM.yyyy"),
    days: calc.days,
    dailyRate: calc.adjustedRate,
    extrasList: calc.extrasList,
    extrasCost: calc.extrasCost,
    totalCost: calc.totalCost,
    prepay: calc.prepay,
    remaining: calc.remaining,
    deposit: calc.deposit,
    ageLabel: ageOptions.find((a) => a.value === state.age)?.label ?? state.age,
    experienceLabel: experienceOptions.find((e) => e.value === state.experience)?.label ?? state.experience,
    city: state.city,
    vehicle: selectedCar.vehicle,
  };
}
