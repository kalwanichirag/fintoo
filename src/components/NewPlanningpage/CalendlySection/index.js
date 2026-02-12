import styles from "./style.module.css";
import VerificationSection from "../../../components/Pages/Calendly/VerificationSection";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
const extraParams = {
    // plan_name: 'Financial Plan',
    // service: "98",
}

const CalendlySectionView = ({ pageName, formData }) => {
    const [utmSource, setUtmSource] = useState(26);
    const [tagval, setTagval] = useState("");
    const [pageurl, setPageurl] = React.useState();
    // const cookieOptions = { expires: 0.0208 };
    // // const cookieOptions = { expires: 0.00139 };
    useEffect(() => {
        function extractParametersFromURL() {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const utmSourceParam = urlSearchParams.get("utm_source");
            const tagvalParam = urlSearchParams.get("tags");

            if (utmSourceParam || tagvalParam) {
                setUtmSource(utmSourceParam);
                setTagval(tagvalParam);
                setPageurl(window.location.pathname);
                const cookieOptions = { expires: 0.0208 };
                // const cookieOptions = { expires: 0.00139 };
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
                <div>
                    <svg width="80" height="88" viewBox="0 0 80 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse opacity="0.0786365" cx="40.0094" cy="44.4609" rx="39.15" ry="43.5" fill="white" />
                        <path d="M40.4578 28.9609C31.5126 28.9609 24.2578 35.4371 24.2578 43.4371C24.2578 51.4371 31.5126 57.9133 40.4578 57.9133C41.8665 57.9133 43.3456 57.7609 44.7543 57.38L52.8543 60.8847C52.9248 60.8847 52.9952 60.9609 53.1361 60.9609C53.2769 60.9609 53.4178 60.8847 53.5587 60.8086C53.77 60.6562 53.8404 60.3514 53.8404 60.1228L53.0656 52.5038C55.39 49.9895 56.6578 46.7133 56.6578 43.4371C56.6578 35.4371 49.403 28.9609 40.4578 28.9609Z" fill="white" />
                    </svg>

                </div>
                <h2 >
                    Schedule a Complimentary Consultation with Fintoo Today
                </h2>
            </div>
            <div className={`${styles.CalendlySectionCalendly}`}>
                <div className={`${styles.CalendlyVerificationSection}`}>
                    {tagval ? (
                        <>
                            <VerificationSection eventCode={tagval} serviceName="robo_advisory_499_plan" eventUrl={"https://calendly.com/fintoo/fintoo-15-mins-consultation-call-yt-fp"} planId="29" extraParams={{ "utm_source": utmSource, }} addIncomSlabAndComment={false} pageName={pageName} />
                        </>
                    ) : (
                        <VerificationSection eventCode={'Callback_mintyApp_8'} serviceName="robo_advisory_499_plan" eventUrl={"https://calendly.com/fintoo/fintoo-15-mins-consultation-call-yt-fp"} planId="29"  extraParams={extraParams} addIncomSlabAndComment={false} pageName={pageName} />
                    )
                    }
                </div>
            </div>
        </section>
    );
};

export default CalendlySectionView;
