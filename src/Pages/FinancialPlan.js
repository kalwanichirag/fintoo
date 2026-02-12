import React, { useEffect, useState, useRef } from "react"; // Added useRef
import AdvisorycardSection from "../components/HTML/FinancialPlan/AdvisorySection";
import FinancialReport from "../components/HTML/FinancialPlan/FinancialReport";
import FPCardSection from "../components/HTML/FinancialPlan/FPCardSection";
import HeaderSection from "../components/HTML/FinancialPlan/HeaderSection";
import FaqSection from "../components/HTML/FinancialPlan/FaqSection";
import StepsFinancialPlan from "../components/HTML/FinancialPlan/StepsFinancialPlan";
import SecuritySection from "../components/HTML/SecuritySection";
import YoutubevideoSection from "../components/HTML/FinancialPlan/YoutubevideoSection";
import Fullpage from "../components/Layout/Fullpage";
import ThankyouSection from "../components/ThankyouSection";
import AppointmentBox from "../components/Pages/Calendly";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const FinancialPlan = () => {
  const [show, SetShow] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  const [utmSource, setUtmSource] = useState(26);
  const [tagval, setTagval] = useState(null);

  const fpCardSectionRef = useRef(null); 

  useEffect(() => {
    function extractParametersFromURL() {
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
  }, [location]);

  useEffect(() => {
    if (location.hash === "#FPCardSection" && fpCardSectionRef.current) {
      fpCardSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <Fullpage>
      <HeaderSection />
      <p style={{height : "6rem"}} ref={fpCardSectionRef}></p>
      <div> 
        <FPCardSection />
      </div>
      <AdvisorycardSection />
      <StepsFinancialPlan />
      <FinancialReport />
      <SecuritySection DynamicBgColor={'#FFFFFF'} />
      <YoutubevideoSection />
      <section id="book-appointment">
        {utmSource && tagval ? (
          <AppointmentBox
            extraParams={{ "utm_source": utmSource, }}
            eventCode={tagval}
            serviceName="financial_planning"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-financial-planning-advisory?hide_event_type_details=1"}
            planId="29"
          />
        ) : (
          <AppointmentBox
            eventCode={'Callback_mintyApp_8'}
            serviceName="financial_planning"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-financial-planning-advisory?hide_event_type_details=1"}
            planId="29"
          />
        )}
      </section>
      <FaqSection />
      {show && <ThankyouSection onClose={() => SetShow(false)} />}
    </Fullpage>
  );
};

export default FinancialPlan;
