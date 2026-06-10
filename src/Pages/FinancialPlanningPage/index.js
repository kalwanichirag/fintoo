import React, { useRef } from "react";
import Fullpage from "../../components/Layout/Fullpage";
import VideosSection from "../../components/HTML/VideosSection";
import BannerSection from "./BannerSection";
import HideFooter from "../../components/HideFooter";
import HideHeader from "../../components/HideHeader";
import MFSnippetFooter from "../../components/HTML/Footer/MFSnippetFooter";
import FeaturedIn from "../../components/HTML/FeaturedIn";
import ClientTestimonial from "../../components/HTML/ClientTestimonial";
import StatsSection from "./Stats";
import WeDeliver from "./WeDeliver";
import SetApartSection from "./SetApartSection";
import ExtraPerformanceAdvice from "./ExtraPerformanceAdvice";
import TeamGoal from "./TeamGoal";
import CalendlySection from "./CalendlySection";

const FinancialPlanningPage = () => {

    const targetRef = useRef(null);
    const targetRef2 = useRef(null);

    const scrollToForm = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const scrollToNextSection = () => {
        if (targetRef2.current) {
            targetRef2.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <Fullpage>
            <HideFooter />
            <HideHeader />
            <BannerSection scrollToForm={scrollToForm} scrollToNextSection={scrollToNextSection} />
            <section ref={targetRef2}>
                <FeaturedIn />
            </section>
            <WeDeliver />
            <SetApartSection />
            <ExtraPerformanceAdvice />
            <StatsSection />
            <ClientTestimonial />
            <VideosSection />
            <TeamGoal />
            <section ref={targetRef} >
                <CalendlySection />
            </section>
        </Fullpage>
    );
}

export default FinancialPlanningPage;
