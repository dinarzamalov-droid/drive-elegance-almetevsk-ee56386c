import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { initialBookingState, cars } from "@/lib/bookingData";
import { getBookingCalculations } from "@/lib/bookingCalculations";
import type { BookingState } from "@/lib/bookingData";
import BookingProgress from "@/components/booking/BookingProgress";
import Step1CarSelect from "@/components/booking/Step1CarSelect";
import Step2Calculator from "@/components/booking/Step2Calculator";
import Step3ClientData from "@/components/booking/Step3ClientData";
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
  const [state, setState] = useState<BookingState>({
    ...initialBookingState,
    car: preselectedCar || initialBookingState.car,
  });

  const update = useCallback((partial: Partial<BookingState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const calc = getBookingCalculations(state);

  const canNext = (): boolean => {
    switch (step) {
      case 1: return !!state.car;
      case 2: return !!state.dateFrom && !!state.dateTo && calc.days > 0;
      case 3:
        return !!(state.lastName.trim() && state.firstName.trim() && state.middleName.trim() &&
          state.phone.trim() && state.email.trim() && state.passportSeries && state.passportNumber &&
          state.licenseNumber && state.agreed);
      case 4: return true;
      case 5: return !!state.paymentMethod;
      default: return false;
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS && canNext()) setStep(step + 1);
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
            {step === 3 && <Step3ClientData state={state} onChange={update} />}
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
                  disabled={!canNext()}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all",
                    canNext()
                      ? "bg-gradient-gold text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  )}
                >
                  {step === 5 ? "Подтвердить бронирование" : "Далее"} <ArrowRight className="w-4 h-4" />
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
