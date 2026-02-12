import React, { useRef } from "react";
import BannerSection from "./BannerSection";
import StatsSection from "./Stats";
import WeDeliver from "./WeDeliver";
import SetApartSection from "./SetApartSection";
import ExtraPerformanceAdvice from "./ExtraPerformanceAdvice";
import TeamGoal from "./TeamGoal";
import Disclaimer from "./Disclaimer";
import { useLocation } from "react-router-dom";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import FeaturedIn from "../../../components/HTML/FeaturedIn";
import Fullpage from "../../../components/Layout/Fullpage";
import CommonCalendlySection from "../common/CommonCalendlySection";
import VideosSection from "../../../components/HTML/VideosSection";

const WealthManagementCalendly = () => {

    const location = useLocation();

    const landingPageLocation = location.pathname;

    const getCalendlyUrl = (currLocation) => {

        return "https://calendly.com/fintoo/dummy-for-it"

        // const normalizedPath = currLocation.replace(/\/$/, '');
        // switch (normalizedPath) {
        //     case '/web/wealth-management-consultation-landing-page-calendly':
        //         return "https://calendly.com/d/cpyn-7fh-wcb/15-mins-wealth-management-session-with-expert?embed_domain=www.fintoo.in&embed_type=Inline&hide_event_type_details=1"
        //     case '/web/wealth-management-consultation-landing-page-calendly-fintoo5':
        //         return "https://calendly.com/d/cnv5-y97-9p6/15-minute-wealth-management-consultation-with-an-expert?embed_domain=www.fintoo.in&embed_type=Inline"
        //     default:
        //         break;
        // }
    }

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
            <TeamGoal />
            <VideosSection />
            <section ref={targetRef} >
                <CommonCalendlySection isWP={true} extraPamamsObj={{ service: "26", plan_name: 'Wealth Management' }} calendlyUrl={getCalendlyUrl(landingPageLocation)} />
            </section>
            <Disclaimer />
        </Fullpage>
    );
}

export default WealthManagementCalendly;
