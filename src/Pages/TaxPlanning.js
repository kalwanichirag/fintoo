import React, { useEffect, useRef, useState } from "react";
import FaqSection from "../components/HTML/TaxPlanning/FaqSection";
import SecuritySection from "../components/HTML/SecuritySection";
import TaxPlanningHeaderSection from "../components/HTML/TaxPlanning/TaxPlanningHeaderSection";
import TaxPlanningVideoSection from "../components/HTML/TaxPlanning/TaxPlanningVideoSection";
import WhyTaxPlanningSection from "../components/HTML/TaxPlanning/WhyTaxPlanningSection";
import WealthContactForm from "../components/WealthManagementContactForm/";
import backImg from "../components/Layout/Fullpage/assets/tax-planning-contact-bg.jpg";
import Fullpage from "../components/Layout/Fullpage";
import { servicesTypes } from "../components/WealthManagementContactForm/model"
import ThankyouSection from "../components/ThankyouSection";
import AppointmentBox from "../components/Pages/Calendly";
import WidgetSection from "../components/HTML/TaxPlanning/WidgetSection";
import TPCardSection from "../components/HTML/TaxPlanning/TPCardSection";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
function TaxPlanning() {
  const [show, SetShow] = useState(false)
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  const [utmSource, setUtmSource] = useState(26);
  const [tagval, setTagval] = useState(null);
  const TaxPlanningRef = useRef(null);
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

  useEffect(() => {
    if (location.hash === "#TaxPlanningSection" && TaxPlanningRef.current) {
      TaxPlanningRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <Fullpage>
      <div style={{ backgroundColor: "white" }}>
        <TaxPlanningHeaderSection />
        <p style={{ height: "6rem" }} ref={TaxPlanningRef}></p>
        <TPCardSection />
        {/* <WhyTaxPlanningSection /> */}
        <WidgetSection />
        {/* <TaxPlanningVideoSection /> */}
        <SecuritySection />
        {/* <section style={{

        }} id="GetStarted">
          {utmSource && tagval ? (
            <AppointmentBox
              extraParams={{ "utm_source": utmSource, }}
              eventCode={tagval}
              serviceName="Tax Planning"
              eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-tax-planning-website?hide_event_type_details=1"}
            />
          ) : (
            <AppointmentBox
              eventCode={'Callback_mintyApp_9'}
              serviceName="Tax Planning"
              eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-tax-planning-website?hide_event_type_details=1"}
              planId = "44"
            />
          )}
        </section> */}
        {/* <AppointmentBox eventCode={'Callback_mintyApp_9'} serviceName="Tax Planning" eventUrl="https://calendly.com/fintoo/15-min-consultation-call-tax-planning-website?hide_event_type_details=1" /> */}
        {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.taxPlanning} onSuccess={() => SetShow(true)} /> */}
        <FaqSection />
        {show && <ThankyouSection onClose={() => SetShow(false)} />}
      </div>
    </Fullpage>
  );

}

export default TaxPlanning;
