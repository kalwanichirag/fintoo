import React, { useEffect, useState } from "react";
import WealthContactForm from "../components/WealthManagementContactForm/";
import backImg from "../components/Layout/Fullpage/assets/insurance1-contact-form-background.jpg";
import SecuritySection from "../components/HTML/SecuritySection";
import { Helmet } from "react-helmet-async";
import BondInvestmentHeaderSection from "../components/HTML/BondInvestment/BondInvestmentHeader";
import WhyChooseBondInvestmentSection from "../components/HTML/BondInvestment/WhyChooseBondInvestmentSection";
import BondinvestmentVideoSection from "../components/HTML/BondInvestment/BondInvestmentVideoSection";
import { servicesTypes } from "../components/WealthManagementContactForm/model";
import Fullpage from "../components/Layout/Fullpage";
import ThankyouSection from "../components/ThankyouSection";
import AppointmentBox from "../components/Pages/Calendly";
import FaqSection from '../components/HTML/BondInvestment/FaqSection';
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
function BondInvestment() {
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
       <Helmet>
        <title>Best Online Bond Investment Platform</title>
        <meta name="description" content="Explore all available bonds, select the ones that match your requirements, and invest for a secure and profitable financial future." />
      </Helmet>
      <div style={{ backgroundColor: "white" }}>
        <BondInvestmentHeaderSection />
        <WhyChooseBondInvestmentSection />
        <BondinvestmentVideoSection />
        <SecuritySection />
        {/* <FaqSection /> */}
        <section
          style={{

          }}
          id="bondInvestmentContact"
        >
          {utmSource && tagval ? (
            <AppointmentBox
              extraParams={{ "utm_source": utmSource, }}
              eventCode={tagval}
              serviceName="bonds"
              eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-bond-investment?hide_event_type_details=1"}
              planId="47"
              pageName={"Bond Investment"}
            />
          ) : (
            <AppointmentBox
              eventCode={'Callback_mintyApp_33'}
              serviceName="bonds"
              eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-bond-investment?hide_event_type_details=1"}
              planId="47"
              pageName={"Bond Investment"}
            />
          )}
          {/* <AppointmentBox eventCode={'Callback_mintyApp_33'} serviceName="Bonds" eventUrl="https://calendly.com/fintoo/15-min-consultation-call-bond-investment?hide_event_type_details=1" /> */}
          {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.bondInvestment} onSuccess={() => SetShow(true)} /> */}
        </section>
        <FaqSection />
        {show && <ThankyouSection onClose={() => SetShow(false)} />}
      </div>
    </Fullpage>
  );
}

export default BondInvestment;
