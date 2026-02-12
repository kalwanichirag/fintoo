import styles from "./style.module.css";
import VerificationSection from "../../../components/Pages/Calendly/VerificationSection";
import { useEffect, useState } from "react";

const extraParams = {
    plan_name: 'Financial Plan',
    service: "98",
}

const CalendlySection = () => {

    const [tagval, setTagval] = useState("");

    useEffect(() => {
        function extractParametersFromURL() {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const tagval = urlSearchParams.get('tags');
            setTagval(tagval);
        }
        extractParametersFromURL();
        window.addEventListener('popstate', extractParametersFromURL);
        return () => {
            window.removeEventListener('popstate', extractParametersFromURL);
        };
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
                            <VerificationSection eventCode={tagval} serviceName="financial_planning" eventUrl={"https://calendly.com/fintoo/15-mins-consultation"} planId="29" extraParams={extraParams} addIncomSlabAndComment={true} />
                        </>
                    ) : (
                        <VerificationSection eventCode={'undefined_calendly'} serviceName="financial_planning" eventUrl={"https://calendly.com/fintoo/15-mins-consultation"} planId="29" extraParams={extraParams} addIncomSlabAndComment={true}/>
                    )
                    }
                </div>
            </div>
        </section>
    );
};

export default CalendlySection;
