import React, { useEffect, useRef, useState } from "react";
import { Suspense, lazy } from "react";
import BannerSection from "./BannerSection";
import WeDeliver from "./WeDeliver";
const SetApartSection = lazy(() => import("./SetApartSection"));
const ExtraPerformanceAdvice = lazy(() => import("./ExtraPerformanceAdvice"));
const TeamGoal = lazy(() => import("./TeamGoal"));
const ClientTestimonial = lazy(() => import("../../../components/HTML/ClientTestimonial"));
const TrackRecord = lazy(() => import("./TrackRecord"));
const StatsSection = lazy(() => import("./Stats"));

import Disclaimer from "./Disclaimer";
import Fullpage from "../../../components/Layout/Fullpage";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import FeaturedIn from "../../../components/HTML/FeaturedIn";

import Styles from "./style.module.css";
import LandingPageCalendly from "../../../components/landingpagesCalendly/LandingPageCalendly";
import LandingPageOtp from "../../../components/landingpagesOtp/LandingPageOtp";

const FinancialPlanningPageCalendly = ({ formtype }) => {

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
                <BannerSection scrollToForm={scrollToForm} scrollToNextSection={scrollToNextSection} isBannerVisible={isBannerVisible} />
            </section>

            <section className={`${Styles.desktopView}`} ref={targetRef2}>
                <FeaturedIn />
            </section>
            <WeDeliver />
            <Suspense fallback={<div style={{ height: 200 }} />}>

                <SetApartSection />
            </Suspense>
            <Suspense fallback={<div style={{ height: 200 }} />}>

                <section className={`${Styles.mobileView}`}>
                    <TrackRecord />
                </section>
            </Suspense>
            <Suspense fallback={<div style={{ height: 200 }} />}>

                <div className={`${Styles.desktopView}`}>
                    <ExtraPerformanceAdvice />
                    <StatsSection />
                </div>

                <ClientTestimonial />
            </Suspense>
            {/* <VideosSection /> */}
            <TeamGoal />
            <section className={`${Styles.mobileView}`}>
                <FeaturedIn />
            </section>
            <section ref={targetRef} >
                {formtype == "otp" ? (<LandingPageOtp pageName="Financial Planning" calendlyurl={"https://calendly.com/d/cr76-3f4-jgz/15-mins-consultation-call-with-financial-planner?hide_event_type_details=1"}  />
                ) :
                    <LandingPageCalendly  pageName="Financial Planning" servicename={"assisted_advisory_fixed_fees"} calendlyurl={"https://calendly.com/d/cr76-3f4-jgz/15-mins-consultation-call-with-financial-planner?hide_event_type_details=1"} />
                }

                {/* <CommonCalendlySection isWP={true} extraPamamsObj={{ service: "100", plan_name: 'Assisted Advisory (Fixed Fees)' }} calendlyUrl={getCalendlyUrl(landingPageLocation)} /> */}
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

export default FinancialPlanningPageCalendly;
