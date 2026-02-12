import React, { useEffect, useState } from "react";
import HeaderSection from "../components/HTML/Notices/HeaderSection";
import FaqSection from "../components/HTML/Notices/FaqSection";
import Fullpage from "../components/Layout/Fullpage";
import NeedHelpSection from "../components/HTML/Notices/NeedHelpSection";
import NoticesType from "../components/HTML/Notices/NoticesType";
import TaxNotice from "../components/HTML/Notices/TaxNotice";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import AppointmentBox from "../components/Pages/Calendly";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
function Notices() {
  const [show, SetShow] = useState(false)
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
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
    <Fullpage style={{ backgroundColor: "white" }}>
      <HeaderSection />
      <TaxNotice />
      <NoticesType />

      <ClientTestimonial />

      <NeedHelpSection />
      {/* <section id="book-appointment">
        {utmSource && tagval ? (
          <AppointmentBox
            extraParams={{ "utm_source": utmSource, }}
            eventCode={tagval}
            serviceName="Income Tax Notices"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-tax-notices?hide_event_type_details=1"}
          />
        ) : (
          <AppointmentBox
            eventCode={'Callback_mintyApp_35'}
            serviceName="Income Tax Notices"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-tax-notices?hide_event_type_details=1"}
            planId = "37"
          />
        )}
      </section> */}
      <FaqSection />
    </Fullpage>
  );
}
export default Notices;
