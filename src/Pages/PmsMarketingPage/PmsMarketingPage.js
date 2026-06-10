import React from "react";
import "../../components/Insurance/tailwind.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import TrustedBySection from "./components/TrustedBySection";
import TopPmsSection from "./components/TopPmsSection";
import ChallengesSection from "./components/ChallengesSection";
import DifferenceSection from "./components/DifferenceSection";
import ReturnsSection from "./components/ReturnsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import OfferingsSection from "./components/OfferingsSection";
import FeesSection from "./components/FeesSection";
import StartSection from "./components/StartSection";
import LocationsSection from "./components/LocationsSection";
import FaqSection from "./components/FaqSection";
import MarketingStyles from "./components/MarketingStyles";

export default function PmsMarketingPage() {
  return (
    <div className="pms-marketing-page tw-min-h-screen tw-overflow-x-hidden tw-bg-black tw-text-white">
      <MarketingStyles />
      <Header />
      <main className="tw-pt-16">
        <HeroSection />
        <TrustedBySection />
        <TopPmsSection />
        <ChallengesSection />
        <DifferenceSection />
        <ReturnsSection />
        <TestimonialsSection />
        <OfferingsSection />
        <FeesSection />
        <StartSection />
        <LocationsSection />
        <FaqSection />
      </main>
    </div>
  );
}
