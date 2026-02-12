import React, { useEffect, useRef, useState } from "react";
import BannerSection from "./BannerSection";
import StatsSection from "./Stats";
import WeDeliver from "./WeDeliver";
import SetApartSection from "./SetApartSection";
import ExtraPerformanceAdvice from "./ExtraPerformanceAdvice";
import TeamGoal from "./TeamGoal";
import CalendlySection from "./CalendlySection";
import Disclaimer from "./Disclaimer";
import { useLocation } from "react-router-dom";
import Fullpage from "../../../components/Layout/Fullpage";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import FeaturedIn from "../../../components/HTML/FeaturedIn";
import VideosSection from "../../../components/HTML/VideosSection";
import Styles from "./style.module.css";
import TrackRecord from "./TrackRecord";
import WhyHniTrustFintoo from "./WhyHniTrust";
import LandingPageCalendly from "../../../components/landingpagesCalendly/LandingPageCalendly";
import LandingPageOtp from "../../../components/landingpagesOtp/LandingPageOtp";
import ClientTestimonial from "../../../components/HTML/ClientTestimonial";

const WealthManagementForIndianandNRI = ({formtype}) => {

    const [isCalendlyVisible, setIsCalendlyVisible] = useState(false);
    const [isBannerVisible, setIsBannerVisible] = useState(false);
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
    }, [isCalendlyVisible, isBannerVisible])

    const location = useLocation();

    const landingPageLocation = location.pathname;

    const getCalendlyUrl = (currLocation) => {
        return "https://calendly.com/fintoo/dummy-for-it"
        // const normalizedPath = currLocation.replace(/\/$/, '');
        // switch (normalizedPath) {
        //     case '/web/financial-planning/':
        //         return "https://calendly.com/d/4j9-7sh-yry/15-minutes-consultation-call?embed_domain=www.fintoo.in&embed_type=Inline&hide_event_type_details=1&month=2025-05"
        //     default:
        //         return "https://calendly.com/d/4j9-7sh-yry/15-minutes-consultation-call?embed_domain=www.fintoo.in&embed_type=Inline&hide_event_type_details=1&month=2025-05"
        // }
    }

    const targetRef = useRef(null);
    const targetRef2 = useRef(null);
    const bannerRef = useRef(null);

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

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // When the CalendlySection is in view, set the state to true
                    if (entry.isIntersecting) {
                        setIsCalendlyVisible(true);
                    } else {
                        setIsCalendlyVisible(false);
                    }
                });
            },
            {
                rootMargin: "0px",
                threshold: 0.5, // Trigger visibility when 50% of the section is in view
            }
        );

        if (targetRef.current) {
            observer.observe(targetRef.current);
        }

        // Cleanup on component unmount
        return () => {
            if (targetRef.current) {
                observer.unobserve(targetRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    // When the CalendlySection is in view, set the state to true
                    if (entry.isIntersecting) {
                        setIsBannerVisible(true);
                    } else {
                        setIsBannerVisible(false);
                    }
                });
            },
            {
                rootMargin: "0px",
                threshold: 0.5, // Trigger visibility when 50% of the section is in view
            }
        );

        if (bannerRef.current) {
            observer.observe(bannerRef.current);
        }

        // Cleanup on component unmount
        return () => {
            if (bannerRef.current) {
                observer.unobserve(bannerRef.current);
            }
        };
    }, []);

    return (
        <Fullpage>
            <HideFooter />
            <HideHeader />
            <section ref={bannerRef}>
                <BannerSection scrollToForm={scrollToForm} scrollToNextSection={scrollToNextSection} isCalendlyVisible={isCalendlyVisible} isBannerVisible={isBannerVisible} />
            </section>

            <section className={`${Styles.desktopView}`} ref={targetRef2}>
                <FeaturedIn />
            </section>
            <WeDeliver />
            <SetApartSection />
            <WhyHniTrustFintoo/>
             <section className={`${Styles.mobileView}`}>
                <TrackRecord />
            </section>
            <div className={`${Styles.desktopView}`}>
                <ExtraPerformanceAdvice />
                <StatsSection />
            </div>
            <ClientTestimonial/>
            {/* <VideosSection /> */}
            <TeamGoal />
            <section className={`${Styles.mobileView}`}>
                <FeaturedIn />
            </section>
            <section ref={targetRef}  >
            {formtype == "otp" ? (<LandingPageOtp servicename={"assisted_advisory_fixed_fees"}  pageName="Wealth Management for NRI" calendlyurl={"https://calendly.com/d/4j9-7sh-yry/15-minutes-consultation-call?hide_event_type_details=1"}/>

                ) :
                <LandingPageCalendly pageName="Wealth Management for NRI" servicename={"assisted_advisory_fixed_fees"} calendlyurl={"https://calendly.com/d/4j9-7sh-yry/15-minutes-consultation-call?hide_event_type_details=1"}/>

}
     
           
            </section>
            <Disclaimer />
            {/* <div
                // className={`${Styles.BookAppointmentBtn} ${Styles.stickyBookAppointmentBtn} ${Styles.moileView}`}
                className={`${Styles.BookAppointmentBtn} ${Styles.stickyBookAppointmentBtn} `}
                onClick={() => scrollToForm()}
            >
                Book An Appointment
            </div> */}
        </Fullpage>
    );
}

export default WealthManagementForIndianandNRI;
