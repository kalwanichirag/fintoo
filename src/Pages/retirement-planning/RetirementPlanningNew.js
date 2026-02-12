import React, { useEffect } from "react";
import Hero from "../../components/retirement-planning/Hero";
import HowFintooHelps from "../../components/retirement-planning/HowFintoo";
import WhyRetirementPlanning from "../../components/retirement-planning/WhyRetirementPlanning";
import Testimonials from "../../components/retirement-planning/testimonials";
import FinalCTA from "../../components/retirement-planning/FinalCta";
import Disclaimer from "../../components/retirement-planning/Disclaimer";

export default function RetirementPlanningNew({formtype}) {
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

  return (
    <>
      <Hero />
      <HowFintooHelps />
      <WhyRetirementPlanning />
      <Testimonials />
      <FinalCTA formtype={formtype} />
      <Disclaimer />
    </>
  );
}
