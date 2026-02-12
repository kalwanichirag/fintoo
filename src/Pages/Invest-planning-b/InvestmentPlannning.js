import CTAFormB from "../../components/InvestmentPlanning/CTAFormB";
import Hero from "../../components/InvestmentPlanning/Hero";
import KeyTakeawaysSection from "../../components/InvestmentPlanning/KeyTakeawaysSection";
import Disclaimer from "../../components/retirement-planning/Disclaimer";
import { useEffect } from "react";

export default function InvestmentPlanningNewB() {
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
            <KeyTakeawaysSection />
<CTAFormB/>
            <Disclaimer />
        </>
    )
}