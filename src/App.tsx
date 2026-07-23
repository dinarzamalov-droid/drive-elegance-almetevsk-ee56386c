import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop.tsx";
import Index from "./pages/Index.tsx";

const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const BookingPage = lazy(() => import("./pages/BookingPage.tsx"));
const EditBookingPage = lazy(() => import("./pages/EditBookingPage.tsx"));
const AdminPage = lazy(() => import("./pages/AdminPage.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.tsx"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/my-booking" element={<EditBookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
