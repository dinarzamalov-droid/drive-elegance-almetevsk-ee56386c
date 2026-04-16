import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { initialBookingState, cars } from "@/lib/bookingData";
import { getBookingCalculations } from "@/lib/bookingCalculations";
import type { BookingState } from "@/lib/bookingData";
import BookingProgress from "@/components/booking/BookingProgress";
import Step1CarSelect from "@/components/booking/Step1CarSelect";
import Step2Calculator from "@/components/booking/Step2Calculator";
import Step3ClientData, { validateStep3 } from "@/components/booking/Step3ClientData";
import Step4Contract from "@/components/booking/Step4Contract";
import Step5Payment from "@/components/booking/Step5Payment";
import Step6Confirmation from "@/components/booking/Step6Confirmation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TOTAL_STEPS = 6;

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedCar = searchParams.get("car") ?? "";

  const [step, setStep] = useState(preselectedCar ? 2 : 1);
  const [saving, setSaving] = useState(false);
  const [step3Attempted, setStep3Attempted] = useState(false);
  const [profileAutoFilled, setProfileAutoFilled] = useState(false);
  const [state, setState] = useState<BookingState>({
    ...initialBookingState,
    car: preselectedCar || initialBookingState.car,
  });

  const update = useCallback((partial: Partial<BookingState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      try {
        const serializable = {
          ...next,
          dateFrom: next.dateFrom?.toISOString() ?? null,
          dateTo: next.dateTo?.toISOString() ?? null,
        };
        localStorage.setItem("3ddrive_booking", JSON.stringify(serializable));
      } catch {}
      return next;
    });
  }, []);

  // Restore from localStorage + autofill from profile
  useEffect(() => {
    const init = async () => {
      // 1. Restore from localStorage
      try {
        const saved = localStorage.getItem("3ddrive_booking");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (preselectedCar) {
            const clientFields = {
              lastName: parsed.lastName || "",
              firstName: parsed.firstName || "",
              middleName: parsed.middleName || "",
              phone: parsed.phone || "",
              email: parsed.email || "",
              birthDate: parsed.birthDate || "",
              passportSeries: parsed.passportSeries || "",
              passportNumber: parsed.passportNumber || "",
              passportDate: parsed.passportDate || "",
              passportCode: parsed.passportCode || "",
              passportIssuedBy: parsed.passportIssuedBy || "",
              registrationAddress: parsed.registrationAddress || "",
              licenseNumber: parsed.licenseNumber || "",
              licenseDate: parsed.licenseDate || "",
              preferredMessenger: parsed.preferredMessenger || "",
            };
            setState((prev) => ({ ...prev, ...clientFields }));
          } else {
            setState((prev) => ({
              ...prev,
              ...parsed,
              dateFrom: parsed.dateFrom ? new Date(parsed.dateFrom) : undefined,
              dateTo: parsed.dateTo ? new Date(parsed.dateTo) : undefined,
            }));
          }
        }
      } catch {}

      // 2. Autofill from authenticated user profile
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name, middle_name, phone, email, passport_series, passport_number, passport_date, passport_code, passport_issued_by, registration_address, license_number, license_date")
            .eq("user_id", session.user.id)
            .single();

          if (profile) {
            const p = profile as any;
            const hasData = p.first_name || p.last_name || p.phone || p.passport_series;
            if (hasData) {
              setState((prev) => ({
                ...prev,
                lastName: prev.lastName || p.last_name || "",
                firstName: prev.firstName || p.first_name || "",
                middleName: prev.middleName || p.middle_name || "",
                phone: prev.phone || p.phone || "",
                email: prev.email || p.email || "",
                passportSeries: prev.passportSeries || p.passport_series || "",
                passportNumber: prev.passportNumber || p.passport_number || "",
                passportDate: prev.passportDate || p.passport_date || "",
                passportCode: prev.passportCode || p.passport_code || "",
                passportIssuedBy: prev.passportIssuedBy || p.passport_issued_by || "",
                registrationAddress: prev.registrationAddress || p.registration_address || "",
                licenseNumber: prev.licenseNumber || p.license_number || "",
                licenseDate: prev.licenseDate || p.license_date || "",
              }));
              setProfileAutoFilled(true);
            }
          }
        }
      } catch {}
    };

    init();
  }, []);

  const calc = getBookingCalculations(state);

  // Check if birthday falls within ±3 days of rental period
  const isBirthdayInRange = useCallback((birthDate: string, dateFrom?: Date, dateTo?: Date): boolean => {
    if (!birthDate || !dateFrom || !dateTo) return false;
    const bd = new Date(birthDate);
    const year1 = dateFrom.getFullYear();
    const year2 = dateTo.getFullYear();
    const years = new Set([year1, year2]);
    for (const y of years) {
      const bdThisYear = new Date(y, bd.getMonth(), bd.getDate());
      const rangeStart = new Date(dateFrom.getTime() - 3 * 86400000);
      const rangeEnd = new Date(dateTo.getTime() + 3 * 86400000);
      if (bdThisYear >= rangeStart && bdThisYear <= rangeEnd) return true;
    }
    return false;
  }, []);

  const canNext = (): boolean => {
    switch (step) {
      case 1: return !!state.car;
      case 2: return !!state.dateFrom && !!state.dateTo && calc.days > 0;
      case 3:
        return validateStep3(state).length === 0;
      case 4: return true;
      case 5: return !!state.paymentMethod;
      default: return false;
    }
  };

  const saveBooking = async () => {
    if (!calc.selectedCar || !state.dateFrom || !state.dateTo) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("bookings" as any).insert({
        car_value: state.car,
        car_label: calc.selectedCar.label,
        date_from: state.dateFrom.toISOString().split("T")[0],
        date_to: state.dateTo.toISOString().split("T")[0],
        days: calc.days,
        city: state.city,
        delivery_time: state.deliveryTime,
        age_category: state.age,
        experience_category: state.experience,
        selected_extras: state.selectedExtras,
        daily_rate: calc.adjustedRate,
        extras_cost: calc.extrasCost,
        total_cost: calc.totalCost,
        prepay: calc.prepay,
        remaining: calc.remaining,
        deposit: calc.deposit,
        promo_code: state.appliedPromo,
        last_name: state.lastName.trim(),
        first_name: state.firstName.trim(),
        middle_name: state.middleName.trim(),
        phone: state.phone.trim(),
        email: state.email.trim(),
        passport_series: state.passportSeries,
        passport_number: state.passportNumber,
        passport_date: state.passportDate || null,
        passport_code: state.passportCode || null,
        license_number: state.licenseNumber,
        license_date: state.licenseDate || null,
        payment_method: state.paymentMethod,
        preferred_messenger: state.preferredMessenger,
      } as any);
      if (error) throw error;
      toast.success("Бронирование сохранено!");

      // Sync profile with latest client data
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from("profiles").update({
            first_name: state.firstName.trim(),
            last_name: state.lastName.trim(),
            middle_name: state.middleName.trim(),
            phone: state.phone.trim(),
            email: state.email.trim(),
            passport_series: state.passportSeries,
            passport_number: state.passportNumber,
            passport_date: state.passportDate || null,
            passport_code: state.passportCode || null,
            passport_issued_by: state.passportIssuedBy || null,
            registration_address: state.registrationAddress || null,
            license_number: state.licenseNumber,
            license_date: state.licenseDate || null,
          } as any).eq("user_id", session.user.id);
        }
      } catch (profileErr) {
        console.error("Profile sync error:", profileErr);
      }
      try {
        await supabase.functions.invoke("sync-google-sheets", {
          body: {
            action: "append_booking",
            booking: {
              car_value: state.car,
              car_label: calc.selectedCar.label,
              date_from: state.dateFrom!.toISOString().split("T")[0],
              date_to: state.dateTo!.toISOString().split("T")[0],
              days: calc.days,
              city: state.city,
              delivery_time: state.deliveryTime,
              age_category: state.age,
              experience_category: state.experience,
              selected_extras: state.selectedExtras,
              daily_rate: calc.adjustedRate,
              extras_cost: calc.extrasCost,
              total_cost: calc.totalCost,
              prepay: calc.prepay,
              remaining: calc.remaining,
              deposit: calc.deposit,
              promo_code: state.appliedPromo,
              last_name: state.lastName.trim(),
              first_name: state.firstName.trim(),
              middle_name: state.middleName.trim(),
              phone: state.phone.trim(),
              email: state.email.trim(),
              passport_series: state.passportSeries,
              passport_number: state.passportNumber,
              passport_date: state.passportDate,
              passport_code: state.passportCode,
              license_number: state.licenseNumber,
              license_date: state.licenseDate,
              payment_method: state.paymentMethod,
              preferred_messenger: state.preferredMessenger,
              status: "new",
              created_at: new Date().toISOString(),
            },
          },
        });
      } catch (sheetErr) {
        console.error("Google Sheets sync error:", sheetErr);
      }
    } catch (err) {
      console.error("Booking save error:", err);
      toast.error("Ошибка сохранения бронирования");
    } finally {
      setSaving(false);
    }
  };

  const next = async () => {
    if (step === 3 && !canNext()) {
      setStep3Attempted(true);
      toast.error("Заполните все обязательные поля");
      return;
    }
    if (step < TOTAL_STEPS && canNext()) {
      // Birthday validation on leaving step 3
      if (step === 3) {
        const inRange = isBirthdayInRange(state.birthDate, state.dateFrom, state.dateTo);
        if (state.isBirthday && !inRange) {
          toast.error("Дата рождения не совпадает с периодом аренды. Скидка «День рождения» не может быть применена.");
          update({ isBirthday: false });
          return;
        }
        if (!state.isBirthday && inRange) {
          update({ isBirthday: true });
          toast.success("🎂 Поздравляем! Мы заметили, что ваш день рождения совпадает с арендой — скидка 10% на первый день применена автоматически!");
        }
      }
      if (step === 5) {
        await saveBooking();
      }
      setStep(step + 1);
    }
  };
  const prev = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <BookingProgress currentStep={step} />

          <div className="bg-card-gradient gold-border rounded-2xl p-6 sm:p-8">
            {step === 1 && (
              <Step1CarSelect
                selectedCar={state.car}
                onSelect={(car) => { update({ car }); setStep(2); }}
              />
            )}
            {step === 2 && <Step2Calculator state={state} onChange={update} />}
            {step === 3 && <Step3ClientData state={state} onChange={update} showErrors={step3Attempted} profileAutoFilled={profileAutoFilled} onDismissAutoFill={() => setProfileAutoFilled(false)} />}
            {step === 4 && <Step4Contract state={state} />}
            {step === 5 && <Step5Payment state={state} onChange={update} />}
            {step === 6 && <Step6Confirmation state={state} />}

            {/* Navigation buttons */}
            {step < TOTAL_STEPS && (
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prev}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Назад
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={!canNext() || saving}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all",
                    canNext() && !saving
                      ? "bg-gradient-gold text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Сохранение...</>
                  ) : (
                    <>{step === 5 ? "Подтвердить бронирование" : "Далее"} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )}

            {step === 6 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                >
                  Вернуться на главную
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
