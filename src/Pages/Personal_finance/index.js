
import { useEffect, useState } from "react";
import UAEFooter from "../../components/HTML/Footer/UAEFooter";
import HideFooter from "../../components/HideFooter";
import HideHeader from "../../components/HideHeader";
import Fullpage from "../../components/Layout/Fullpage";
import Personalfinance from "../../components/Pages/Calendly/Personalfinance";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
const Personal_finance = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [pageurl, setPageurl] = useState();
    const [utmSource, setUtmSource] = useState(26);
    const [tagval, setTagval] = useState(null);
    useEffect(() => {
        function extractParametersFromURL() {
            // const urlSearchParams = new URLSearchParams(new URL(url).search);
            const urlSearchParams = new URLSearchParams(window.location.search);
            const utmSource = urlSearchParams.get('utm_source');
            const tagval = urlSearchParams.get('tags');
            setPageurl(location.pathname);
            setUtmSource(utmSource);
            setTagval(tagval);
        }
        extractParametersFromURL();
        window.addEventListener('popstate', extractParametersFromURL);
        return () => {
            window.removeEventListener('popstate', extractParametersFromURL);
        };
    }, []);
    return (
        <Fullpage>
            <HideHeader />
            <HideFooter />
            <section
                id="ContactUs"
                style={{
                    margin: '3rem 0'
                }}
            >
                {utmSource && tagval ? (
                    <Personalfinance
                        extraParams={{ "utm_source": utmSource, "rm_id": "96", "service":"98" }}
                        eventCode={tagval}
                        serviceName="Financial Plan"
                        eventUrl={
                            "https://calendly.com/marketing-ae/30-min-consultation-call-ebook?hide_event_type_details=1&hide_gdpr_banner=1"
                        }
                    />
                ) : (
                    <Personalfinance
                        extraParams={{ "rm_id": "96", "service":"98"  }}
                        eventCode={"Callback_mintyApp_98"}
                        serviceName="Financial Plan"
                        eventUrl={
                            "https://calendly.com/marketing-ae/30-min-consultation-call-ebook?hide_event_type_details=1&hide_gdpr_banner=1"
                        }
                    />
                )}
                {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.insurance} onSuccess={() => SetShow(true)} /> */}
            </section>
            <UAEFooter />
        </Fullpage>
    );
};
export default Personal_finance;
