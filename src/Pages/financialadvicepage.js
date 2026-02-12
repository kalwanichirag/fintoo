import React from 'react'
import HeroSection from '../components/FinancialPlanningPage/Hero'
import TrustBar from '../components/FinancialPlanningPage/TrustBar'
import AboutSection from '../components/FinancialPlanningPage/About'
import ServicesSection from '../components/FinancialPlanningPage/Service'
import HowItWorksSection from '../components/FinancialPlanningPage/HowItWorks'
import WhyChoose from '../components/FinancialPlanningPage/WhyChoose'
import PerformanceSection from '../components/FinancialPlanningPage/PerformanceSection'
import TestimonialsSection from '../components/FinancialPlanningPage/Testimonals'
import FaqSection from '../components/FinancialPlanningPage/Faqs'
import FinalCTA from '../components/FinancialPlanningPage/FinalCTA'
import Disclaimer from "../components/retirement-planning/Disclaimer";
import { useEffect,useRef } from 'react'


const FinancialAdvicePage = ({formtype}) => {
  
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
  const ctaRef = useRef(null);

  // pass scroll function to hero
  const scrollToCTA = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HeroSection onBookClick={scrollToCTA} />
      <TrustBar />
      <AboutSection />
      <ServicesSection />
      <HowItWorksSection onBookClick={scrollToCTA} />
      <WhyChoose onBookClick={scrollToCTA} />
      <PerformanceSection />
      <TestimonialsSection />
      <FaqSection />
       <div ref={ctaRef}>
        <FinalCTA formtype={formtype} />
      </div>
      <Disclaimer />

    </>
  )
}

export default FinancialAdvicePage