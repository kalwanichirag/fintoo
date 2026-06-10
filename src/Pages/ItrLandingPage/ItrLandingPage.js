import React from "react";
import "../../components/Insurance/tailwind.css";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";
import ServeSection from "./components/ServeSection";
import ProcessSection from "./components/ProcessSection";
import ServicesSection from "./components/ServicesSection";
import ComparisonSection from "./components/ComparisonSection";
import MetricsSection from "./components/MetricsSection";
import TrustSection from "./components/TrustSection";
import TeamSection from "./components/TeamSection";
import FaqSection from "./components/FaqSection";
import BookingSection from "./components/BookingSection";
import Footer from "./components/Footer";
import Disclaimer from "../../components/retirement-planning/Disclaimer";
import CorporateTaxSolutions from "./components/CorporateTaxSolutions";

export default function ItrLandingPage() {
  return (
    <div className="itr-marketing-page tw-min-h-screen tw-overflow-x-hidden tw-bg-[#fdf9f3] tw-font-dmsans tw-text-fintoo-blue">
    
      <main>
        <HeroSection />
        <MarqueeSection />
        <CorporateTaxSolutions/>
        <ServeSection />
        <ProcessSection />
       
        <ComparisonSection />
       
        <TrustSection />
        <TeamSection />
        <FaqSection />
        <BookingSection />
      </main>
      <a
        href="#booking"
        className="tw-fixed tw-bottom-5 tw-right-4 tw-z-50 tw-rounded-full tw-bg-fintoo-orange tw-px-5 tw-py-3 tw-text-sm tw-font-bold tw-uppercase tw-text-white tw-no-underline tw-shadow-[0_10px_30px_rgba(221,115,0,0.35)] hover:tw-bg-[#f08c1a] hover:tw-text-white md:tw-hidden"
      >
        Book Now
      </a>
     <Disclaimer/>
    </div>
  );
}
