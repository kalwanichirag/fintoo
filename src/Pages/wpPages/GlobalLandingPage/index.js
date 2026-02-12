import React, { useRef } from "react";
import BannerSection from "./BannerSection";
import StatsSection from "./Stats";
import WeDeliver from "./WeDeliver";
import SetApartSection from "./SetApartSection";
import ExtraPerformanceAdvice from "./ExtraPerformanceAdvice";
import TeamGoal from "./TeamGoal";
import CalendlySection from "./CalendlySection";
import Disclaimer from "./Disclaimer";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import FeaturedIn from "../../../components/HTML/FeaturedIn";
import Fullpage from "../../../components/Layout/Fullpage";
import CommonCalendlySection from "../common/CommonCalendlySection";
import VideosSection from "../../../components/HTML/VideosSection";

const GlobalLandingPage = () => {

    const targetRef = useRef(null);
    const targetRef2 = useRef(null);

    const scrollToForm = () => {
        webengage.track("book complimentary session clicked", {
            "cta name": window.location.href ?? ''
        });
        
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
            <VideosSection />
            <TeamGoal />
            <section ref={targetRef} >
                {/* <CommonCalendlySection isWP={true} extraPamamsObj={{ service: "11", plan_name: 'NRI' }} calendlyUrl="https://calendly.com/fintoo/15-minutes-consultation-call-with-global-expert?embed_domain=www.fintoo.in&embed_type=Inline&hide_event_type_details=1&month=2025-05" /> */}
                <CommonCalendlySection isWP={true} extraPamamsObj={{ service: "11", plan_name: 'NRI' }} calendlyUrl="https://calendly.com/fintoo/dummy-for-it" />
            </section>
            <Disclaimer />
        </Fullpage>
    );
}

export default GlobalLandingPage;
