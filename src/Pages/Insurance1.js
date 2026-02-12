import React, { useEffect, useRef, useState } from "react";
import FaqSection from "../components/HTML/Insurance/FaqSection";
import HeaderSection from "../components/HTML/Insurance/HeaderSection";
import HowWeWorkSection from "../components/HTML/Insurance/HowWeWorkSection";
import WhyInsuranceSection from "../components/HTML/Insurance/WhyInsuranceSection";
import SecuritySection from "../components/HTML/SecuritySection";
import Fullpage from "../components/Layout/Fullpage";
import { servicesTypes } from "../components/WealthManagementContactForm/model";
import ThankyouSection from "../components/ThankyouSection";
import AppointmentBox from "../components/Pages/Calendly";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import Insurancecalculator from "../components/HTML/Insurance/insurancecalculator";
function Insurance1() {
  const [show, SetShow] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  const [utmSource, setUtmSource] = useState(26);
  const [tagval, setTagval] = useState(null);
  const WhyInsuranceSectionRef = useRef(null);

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
    if (location.hash === "#WhyInsuranceSection" && WhyInsuranceSectionRef.current) {
      WhyInsuranceSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <Fullpage>
      <div style={{ backgroundColor: "white" }}>
        <HeaderSection />
        <p style={{ height: "6rem" }} ref={WhyInsuranceSectionRef}></p>
        <WhyInsuranceSection />
        {/* <WidgetSection /> */}
        <HowWeWorkSection />
        <SecuritySection DynamicBgColor={"#E6EAEF"} />
        <Insurancecalculator title={"Human Life Value Calculator"} description={"Determine your ideal sum assured effortlessly with our Human Life Value Calculator. Customize key values to get a precise estimate of the financial protection your family needs."} />
        <ClientTestimonial />
        {/* <InsuranceClientTestimonialSection /> */}
        <section
          style={{
            // 
          }}
          id="book-appointment"
        >
          {utmSource && tagval ? (
            <AppointmentBox
              extraParams={{ "utm_source": utmSource, }}
              eventCode={tagval}
              serviceName="insurance"
              eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-risk-management?hide_event_type_details=1"}
              planId="45"
              pageName={"Risk Mangement"}
            />
          ) : (
            <AppointmentBox
              eventCode={'Callback_mintyApp_12'}
              serviceName="insurance"
              eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-risk-management?hide_event_type_details=1"}
              planId="45"
              pageName={"Risk Mangement"}

            />
          )}
          {/* <AppointmentBox eventCode={'Callback_mintyApp_12'} serviceName="Insurance" eventUrl="https://calendly.com/fintoo/15-min-consultation-call-risk-management?hide_event_type_details=1" /> */}
          {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.insurance} onSuccess={() => SetShow(true)} /> */}
        </section>
        <FaqSection />
        {show && <ThankyouSection onClose={() => SetShow(false)} />}
      </div>
    </Fullpage>
  );
}

export default Insurance1;
