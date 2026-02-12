import React, { useEffect, useState } from "react";
import FaqSection from "../components/HTML/Stockadvisory/FaqSection";
import HeaderSection from "../components/HTML/Stockadvisory/HeaderSection";
import YoutubevideoSection from "../components/HTML/Stockadvisory/YoutubevideoSection";
import SecuritySection from "../components/HTML/SecuritySection";
import Fullpage from "../components/Layout/Fullpage";
import WealthContactForm from "../components/WealthManagementContactForm";
import backImg from "../components/Layout/Fullpage/assets/advisor-min.jpg";
import WidgetSection from "../components/HTML/Stockadvisory/WidgetSection";
import AdvisorycardSection from "../components/HTML/Stockadvisory/AdvisorySection";
import ReportsPage from "../components/HTML/Stockadvisory/ReportsPage";
import FeaturesSection from "../components/HTML/Stockadvisory/FeaturesSection";
import FeaturedIn from "../components/HTML/Stockadvisory/FeaturedIn";
import { servicesTypes } from "../components/WealthManagementContactForm/model";
import AppointmentBox from "../components/Pages/Calendly";
import AssistedUAESection from "../components/HTML/Stockadvisory/AssistedUAESection";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
const Stockadvisory = () => {
  const [show, SetShow] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  const [utmSource, setUtmSource] = useState(26);
  const [tagval, setTagval] = useState(null);
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
    <Fullpage>
      <HeaderSection />
      <section style={{
        backgroundColor: "#E6EAEF"
      }}>
        <WidgetSection />
      </section>
      <AssistedUAESection />
      <AdvisorycardSection />
      <FeaturesSection />
      <ReportsPage />
      <YoutubevideoSection />
      <SecuritySection />
      {/* <FeaturedIn /> */}
      <section style={{

      }} id="GETREPORTS">
        {utmSource && tagval ? (
          <AppointmentBox
            extraParams={{ "utm_source": utmSource, }}
            eventCode={tagval}
            serviceName="direct_domestic_equity"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-domestic-equity?hide_event_type_details=1"}
            planId="48"
            pageName={"Stock Advisory"}
          />
        ) : (
          <AppointmentBox
            eventCode={'Callback_mintyApp_89'}
            serviceName="direct_domestic_equity"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-domestic-equity?hide_event_type_details=1"}
              planId="48"
              pageName={"Stock Advisory"}
          />
        )}
        {/* <AppointmentBox eventCode={'Callback_mintyApp_89'} serviceName="Direct Domestic Equity" eventUrl="https://calendly.com/fintoo/15-min-consultation-call-domestic-equity?hide_event_type_details=1" /> */}
        {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.stockAdvisory}/> */}
      </section>
      <FaqSection />
    </Fullpage>
  );
};
export default Stockadvisory;
