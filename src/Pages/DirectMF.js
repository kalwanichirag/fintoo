import React, { useEffect, useState } from "react";
import DirectMFHeaderSection from "../components/HTML/DirectMF/DirectMFHeaderSection";
import DirectMFTestimonialSection from "../components/HTML/DirectMF/DirectMFTestimonials";
import ExpertAdvisorySection from "../components/HTML/DirectMF/ExpertAdvisorySection";
import FeaturesSection from "../components/HTML/DirectMF/FeaturesSection";
import LifeChoiceSection from "../components/HTML/DirectMF/LifeChoiceSection";
import StatsSection from "../components/HTML/DirectMF/StatsSection";
import FaqSection from "../components/HTML/DirectMF/FaqSection";
import Fullpage from "../components/Layout/Fullpage";
import WealthContactForm from "../components/WealthManagementContactForm";
import backImg from "../components/Layout/Fullpage/assets/insurance1-contact-form-background.jpg";
import { servicesTypes } from "../components/WealthManagementContactForm/model";
import ThankyouSection from "../components/ThankyouSection";
import Main from "./DMF/Main";
import AppointmentBox from "../components/Pages/Calendly";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
function DirectMF() {
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
  React.useEffect(() => {
    document.body.classList.add('MainDivRemove');
  }, []);

  return (
    <Fullpage>
      <div style={{ backgroundColor: "white", overflow: "hidden" }}>
        <DirectMFHeaderSection />

        <div className="mb-md-5">
          <FeaturesSection />
        </div>

        <StatsSection />
        <ClientTestimonial />
        {utmSource && tagval ? (
          <AppointmentBox
            extraParams={{ "utm_source": utmSource, }}
            eventCode={tagval}
            serviceName="mutual_fund"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-mutual-fund?hide_event_type_details=1"}
            planId="46"
            pageName={"Direct Mutual Fund"}
          />
        ) : (
          <AppointmentBox
            eventCode={'Callback_mintyApp_25'}
            serviceName="mutual_fund"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-mutual-fund?hide_event_type_details=1"}
              planId="46"
                          pageName={"Direct Mutual Fund"}

          />
        )}
        {/* <AppointmentBox eventCode={'Callback_mintyApp_25'} serviceName="Mutual Fund" eventUrl="https://calendly.com/fintoo/15-min-consultation-call-mutual-fund?hide_event_type_details=1" /> */}

        <FaqSection />
        {show && <ThankyouSection onClose={() => SetShow(false)} />}
      </div>
    </Fullpage>
  );
}

export default DirectMF;
