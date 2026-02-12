import styles from "./style.module.css";
import React, { useEffect, useState, } from "react";
import Cookies from 'js-cookie'
import VerificationSection from "../../../components/Pages/Calendly/VerificationSection";
import useIntersectionObserver from "../../../Utils/Hooks/UseIntersectionObserver";

const CommonCalendlySection = ({ isWP = false, extraPamamsObj, calendlyUrl }) => {

    const extraParams = {
        plan_name: extraPamamsObj?.plan_name ?? 'Financial Plan',
        service: extraPamamsObj?.service ?? "98",
    }

    let eventURL = "https://calendly.com/fintoo/15-mins-consultation"

    if (calendlyUrl) {
        eventURL = calendlyUrl
    }

    const [utmSource, setUtmSource] = useState("");
    const [tagval, setTagval] = useState(null);
    const [pageurl, setPageurl] = useState();

    useEffect(() => {
        function extractParametersFromURL() {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const utmSourceParam = urlSearchParams.get("utm_source");
            const tagvalParam = urlSearchParams.get("tags");

            if (utmSourceParam || tagvalParam) {
                setUtmSource(utmSourceParam);
                setTagval(tagvalParam);
                setPageurl(window.location.pathname);

                const cookieOptions = { expires: 0.00139 };
                Cookies.set("utm_source", utmSourceParam || "", cookieOptions);
                Cookies.set("tagval", tagvalParam || "", cookieOptions);
                Cookies.set("pageurl", window.location.pathname, cookieOptions);
            } else {
                const storedUtmSource = Cookies.get("utm_source") || null;
                const storedTagval = Cookies.get("tagval") || null;
                const storedPageurl = Cookies.get("pageurl") || null;

                setUtmSource(storedUtmSource);
                setTagval(storedTagval);
                setPageurl(storedPageurl);
            }
        }

        extractParametersFromURL();
        window.addEventListener("popstate", extractParametersFromURL);

        return () => {
            window.removeEventListener("popstate", extractParametersFromURL);
        };
    }, [window.location.search]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!Cookies.get("utm_source") && !Cookies.get("tagval") && !Cookies.get("pageurl")) {
                setUtmSource(utmSource);
                setTagval(null);
                setPageurl(null);
            }
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={`${styles.CalendlySection}`}>
            <div className={`${styles.CalendlySectionText}`}>
                <h1 >
                    Book an introductory <span style={{ color: 'rgb(221, 115, 0)' }}>Complimentary 15 Minutes Call</span> with our Financial Experts to know more about our offerings and advice.
                </h1>
            </div>
            <div className={`${styles.CalendlySectionCalendly}`}>
                <div className={`${styles.CalendlyVerificationSection}`}>
                    {tagval ? (
                        <>
                            <VerificationSection isWP={isWP} eventCode={tagval} serviceName="financial_planning" eventUrl={eventURL} planId="29" extraParams={extraParams} addIncomSlabAndComment={true} />
                        </>
                    ) : (
                        <VerificationSection isWP={isWP} eventCode={''} serviceName="financial_planning" eventUrl={eventURL} planId="29" extraParams={extraParams} addIncomSlabAndComment={true} />
                    )
                    }
                </div>
            </div>
        </section>
    );
};

export default CommonCalendlySection;
