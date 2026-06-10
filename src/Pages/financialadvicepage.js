import React, { useEffect, useRef, useState } from 'react'
import HeroSection from '../components/FinancialPlanningPage/Hero'
import TrustBar from '../components/FinancialPlanningPage/TrustBar'
import AboutSection from '../components/FinancialPlanningPage/About'
import ServicesSection from '../components/FinancialPlanningPage/Service'
import HowItWorksSection from '../components/FinancialPlanningPage/HowItWorks'
import WhyChoose from '../components/FinancialPlanningPage/WhyChoose'
import PerformanceSection from '../components/FinancialPlanningPage/PerformanceSection'
import FaqSection from '../components/FinancialPlanningPage/Faqs'
import FinalCTA from '../components/FinancialPlanningPage/FinalCTA'
import Disclaimer from "../components/retirement-planning/Disclaimer";
import ClientTestimonial from "../components/HTML/ClientTestimonial";

const FinancialAdvicePage = ({formtype}) => {
  const ctaRef = useRef(null);
  const heroRef = useRef(null);
  const [showStickyButton, setShowStickyButton] = useState(false);
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-T15R5ED28G";
    script.async = true;
    document.head.appendChild(script);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-T15R5ED28G');
    `;
    document.head.appendChild(script2);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(script2);
    };
  }, []);

  useEffect(() => {
    const heroSection = heroRef.current;

    if (!heroSection || typeof IntersectionObserver === "undefined") {
      setShowStickyButton(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyButton(!entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(heroSection);

    return () => observer.disconnect();
  }, []);

  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div ref={heroRef}>
        <HeroSection onBookClick={scrollToCTA} />
      </div>
      <TrustBar />
      <AboutSection />
      <ServicesSection />
      <HowItWorksSection onBookClick={scrollToCTA} />
      <WhyChoose onBookClick={scrollToCTA} />
      <PerformanceSection />
      <ClientTestimonial />
      <FaqSection />
      <div ref={ctaRef}>
        <FinalCTA formtype={formtype} />
      </div>
      <Disclaimer />
      <button
        type="button"
        onClick={scrollToCTA}
        aria-label="Go to booking section"
        className={`tw-fixed tw-z-50 tw-inline-flex tw-items-center tw-justify-center tw-border-0 tw-rounded-full tw-px-5 tw-py-3 tw-text-sm sm:tw-text-base tw-font-semibold tw-text-white tw-shadow-2xl tw-transition-all tw-duration-500 tw-ease-out tw-whitespace-nowrap ${
          showStickyButton
            ? "tw-opacity-100 tw-translate-y-0 tw-pointer-events-auto"
            : "tw-opacity-0 tw-translate-y-4 tw-pointer-events-none"
        }`}
        style={{
          right: "16px",
          bottom: "max(16px, env(safe-area-inset-bottom))",
          background: "linear-gradient(135deg, #dd7300 0%, #f97316 50%, #fb923c 100%)",
        }}
      >
        <i className="fas fa-calendar-alt tw-mr-2"></i>
        Book Free Session
      </button>

    </>
  )
}

export default FinancialAdvicePage
