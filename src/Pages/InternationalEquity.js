import React, { useEffect, useState } from "react";
import InternationalEquityAdvantagesSection from "../components/HTML/InternationalEquity/AdvantagesSection";
import InternationalEquityHeaderSection from "../components/HTML/InternationalEquity/InternatinoalEquityHeaderSection";
import InternationalEquityContactForm from "../components/HTML/InternationalEquity/InternationalEquityContactSection";
import WhyInvestSection from "../components/HTML/InternationalEquity/WhyInvestSection";
import FaqSection from "../components/HTML/InternationalEquity/FaqSection";
import Fullpage from "../components/Layout/Fullpage";
import { servicesTypes } from "../components/WealthManagementContactForm/model";
import ThankyouSection from "../components/ThankyouSection";
import AppointmentBox from "../components/Pages/Calendly";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
function InternationalEquity() {
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
      <div style={{ backgroundColor: "white" }}>
        <InternationalEquityHeaderSection />

        {/* <InternationalEquityContactForm serviceType={servicesTypes.internationalEquity} onSuccess={() => SetShow(true)} /> */}

        <InternationalEquityAdvantagesSection />

        <section
          style={{
            backgroundColor: "#E6EAEF",
          }}
        >
          <WhyInvestSection />
        </section>

        {show && <ThankyouSection onClose={() => SetShow(false)} />}
        <section id="calendlySection">
          {utmSource && tagval ? (
            <AppointmentBox
              extraParams={{ "utm_source": utmSource, }}
              eventCode={tagval}
              serviceName="direct_international_equity"
              eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-international-equity?hide_event_type_details=1"}
              planId="49"
               pageName={"International Stock Advisory"}
            />
          ) : (
            <AppointmentBox
              eventCode={'Callback_mintyApp_90'}
              serviceName="direct_international_equity"
              eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-international-equity?hide_event_type_details=1"}
                planId="49"
                pageName={"International Stock Advisory"}
            />
          )}
        </section>

        {/* <AppointmentBox eventCode={'Callback_mintyApp_90'} serviceName="Direct International Equity" eventUrl="https://calendly.com/fintoo/15-min-consultation-call-international-equity?hide_event_type_details=1" /> */}
        <FaqSection />
      </div>
    </Fullpage>
  );
}

export default InternationalEquity;
