import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FloatingMessenger from "@/components/FloatingMessenger";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import AboutSection from "@/components/AboutSection";
import FleetSection from "@/components/FleetSection";
import CompareSection from "@/components/CompareSection";
import BookingSection from "@/components/BookingSection";
import TermsSection from "@/components/TermsSection";
import WhyUsSection from "@/components/WhyUsSection";
import ForWhomSection from "@/components/ForWhomSection";
import ReviewsSection from "@/components/ReviewsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import HandoverSection from "@/components/HandoverSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import CorporateSection from "@/components/CorporateSection";
import GiftCertificatesSection from "@/components/GiftCertificatesSection";
import ClubCardsSection from "@/components/ClubCardsSection";

import TourismSection from "@/components/TourismSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FleetSection />
      <CompareSection />
      <BookingSection />
      <TermsSection />
      <WhyUsSection />
      <ForWhomSection />
      <ReviewsSection />
      <HowItWorksSection />
      <HandoverSection />
      <FeaturesSection />
      <TourismSection />
      <FaqSection />
      <CorporateSection />
      <GiftCertificatesSection />
      <ClubCardsSection />
      <ContactSection />
      
      <Footer />
      <FloatingMessenger />
      <ThemeSwitcher />
    </div>
  );
};

export default Index;
