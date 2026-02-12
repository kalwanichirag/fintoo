import React, { useRef } from "react";
import Fullpage from "../../components/Layout/Fullpage";
import VideosSection from "../../components/HTML/VideosSection";
import BannerSection from "./BannerSection";
import HideFooter from "../../components/HideFooter";
import HideHeader from "../../components/HideHeader";
import MFSnippetFooter from "../../components/HTML/Footer/MFSnippetFooter";
import FeaturedIn from "../../components/HTML/FeaturedIn";
import StatsSection from "./Stats";
import WeDeliver from "./WeDeliver";
import SetApartSection from "./SetApartSection";
import ExtraPerformanceAdvice from "./ExtraPerformanceAdvice";
import TeamGoal from "./TeamGoal";
import CalendlySection from "./CalendlySection";
import FeatureScroll from "./FeatureScroll";
import ClientTestimonial from "../../components/HTML/ClientTestimonial";
import PortfolioReviewSection from "./PortfolioReviewSection";
const FinancialPlanningPageMF = () => {

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
            {/* <WeDeliver /> */}
            <SetApartSection />
            <FeatureScroll />
            {/* <ExtraPerformanceAdvice /> */}
            <StatsSection />
            <VideosSection />
            {/* <TeamGoal /> */}
            <section ref={targetRef} >
                <PortfolioReviewSection />
            </section>
            <ClientTestimonial />
            <MFSnippetFooter />
        </Fullpage>
    );
}

export default FinancialPlanningPageMF;
