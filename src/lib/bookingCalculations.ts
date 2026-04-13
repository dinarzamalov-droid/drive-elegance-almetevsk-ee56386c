import { cars, ageOptions, experienceOptions, getDurationDiscount, promoCodes, PREPAY_PERCENT, extrasConfig, savingsConfig } from "./bookingData";
import type { BookingState } from "./bookingData";

export function getBookingCalculations(state: BookingState) {
  const selectedCar = cars.find((c) => c.value === state.car);
  const ageOpt = ageOptions.find((a) => a.value === state.age);
  const expOpt = experienceOptions.find((e) => e.value === state.experience);
  const ageMultiplier = ageOpt?.multiplier ?? 1;
  const expMultiplier = expOpt?.multiplier ?? 1;

  const days =
    state.dateFrom && state.dateTo
      ? Math.max(1, Math.ceil((state.dateTo.getTime() - state.dateFrom.getTime()) / 86400000))
      : 0;

  const baseRate = selectedCar?.price ?? 0;
  const durationDiscountPercent = selectedCar ? getDurationDiscount(selectedCar.category, days) : 0;
  const discountedRate = Math.round(baseRate * (1 - durationDiscountPercent));
  const adjustedRate = Math.round(discountedRate * ageMultiplier * expMultiplier);

  const getExtraPrice = (id: string) => {
    if (!selectedCar) return 0;
    return (selectedCar.extras as Record<string, number>)[id] ?? 0;
  };

  const extrasPerDay = state.selectedExtras.reduce((sum, id) => sum + getExtraPrice(id), 0);

  const hasDiscount = state.isBirthday || state.isWedding;
  const firstDayDiscount = hasDiscount ? Math.round((adjustedRate + extrasPerDay) * 0.1) : 0;

  const promoDiscount = state.appliedPromo && promoCodes[state.appliedPromo]
    ? promoCodes[state.appliedPromo].percent
    : 0;

  // Savings calculation
  const savingsFixed = state.selectedSavings.reduce((sum, id) => {
    const s = savingsConfig.find((c) => c.id === id);
    return s && s.type === "fixed" ? sum + s.discount : sum;
  }, 0);
  const savingsPercent = state.selectedSavings.reduce((sum, id) => {
    const s = savingsConfig.find((c) => c.id === id);
    return s && s.type === "percent" ? sum + s.discount : sum;
  }, 0);

  const baseCost = adjustedRate * days;
  const extrasCost = extrasPerDay * days;
  const subtotal = baseCost + extrasCost - firstDayDiscount;
  const promoDiscountAmount = Math.round(subtotal * promoDiscount / 100);
  const afterPromo = subtotal - promoDiscountAmount;
  const savingsPercentAmount = Math.round(afterPromo * savingsPercent / 100);
  const totalSavings = savingsFixed + savingsPercentAmount;
  const totalCost = Math.max(0, afterPromo - totalSavings);
  const prepay = Math.round((totalCost * PREPAY_PERCENT) / 100);
  const remaining = totalCost - prepay;
  const ageDepositExtra = ageOpt?.depositExtra ?? 0;
  const expDepositExtra = expOpt?.depositExtra ?? 0;
  const deposit = (selectedCar?.deposit ?? 0) + ageDepositExtra + expDepositExtra;

  const extrasList = state.selectedExtras.map(
    (id) => extrasConfig.find((e) => e.id === id)?.label ?? id
  );

  return {
    selectedCar,
    ageMultiplier,
    expMultiplier,
    days,
    baseRate,
    durationDiscountPercent,
    discountedRate,
    adjustedRate,
    extrasPerDay,
    getExtraPrice,
    firstDayDiscount,
    hasDiscount,
    promoDiscount,
    baseCost,
    extrasCost,
    subtotal,
    promoDiscountAmount,
    totalCost,
    prepay,
    remaining,
    deposit,
    extrasList,
  };
}
