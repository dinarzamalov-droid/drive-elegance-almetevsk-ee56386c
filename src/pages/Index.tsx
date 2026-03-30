import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FleetSection from "@/components/FleetSection";
import BookingSection from "@/components/BookingSection";
import TermsSection from "@/components/TermsSection";
import WhyUsSection from "@/components/WhyUsSection";
import ForWhomSection from "@/components/ForWhomSection";
import ReviewsSection from "@/components/ReviewsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import PlansSection from "@/components/PlansSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FleetSection />
      <TermsSection />
      <WhyUsSection />
      <ForWhomSection />
      <ReviewsSection />
      <HowItWorksSection />
      <FaqSection />
      <ContactSection />
      <PlansSection />
      <Footer />
    </div>
  );
};

export default Index;
