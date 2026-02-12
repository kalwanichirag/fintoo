import AdvisorycardSection from "../components/HTML/InvestmentPlanning/AdvisorySection";
import HeaderSection from "../components/HTML/InvestmentPlanning/HeaderSection";
import FaqSection from "../components/HTML/InvestmentPlanning/FaqSection";
import SecuritySection from "../components/HTML/SecuritySection";
import YoutubevideoSection from "../components/HTML/InvestmentPlanning/YoutubevideoSection";
import Fullpage from "../components/Layout/Fullpage";
import WealthContactForm from "../components/WealthManagementContactForm";
import backImg from "../components/Layout/Fullpage/assets/advisor-min.jpg";
import StepsInvestmentPlan from "../components/HTML/InvestmentPlanning/StepsInvestmentPlan";
import { servicesTypes } from "../components/WealthManagementContactForm/model";
import React, { useEffect, useRef, useState } from "react";
import ThankyouSection from "../components/ThankyouSection";
import AppointmentBox from "../components/Pages/Calendly";
import KeyDifferentiators from "../components/HTML/InvestmentPlanning/KeyDifferentiators";
import Equity_Offerings from "../components/HTML/InvestmentPlanning/Equity_Offerings";
import DebtInvestments from "../components/HTML/InvestmentPlanning/DebtInvestments";
import AlternateInvestments from "../components/HTML/InvestmentPlanning/AlternateInvestments";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
const InvestPlanning = () => {
  const [show, SetShow] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  // useEffect(() => {
  //   dispatch({ type: "HIDE_FOOTER", payload: true });
  // }, []);
  const [utmSource, setUtmSource] = useState(26);
  const [tagval, setTagval] = useState(null);
  const AdvisorycardSectionRef = useRef(null); 
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
    if (location.hash === "#AdvisorycardSection" && AdvisorycardSectionRef.current) {
      AdvisorycardSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);
  
  return (
    <Fullpage>
      <HeaderSection />
      <p style={{height : "6rem"}} ref={AdvisorycardSectionRef}></p>
      <AdvisorycardSection />
      <section
        style={{
          backgroundColor: "#E6EAEF",
        }}
      >
        <KeyDifferentiators />
        {/* <StepsInvestmentPlan /> */}
      </section>
      <Equity_Offerings />

      {/* <section
        style={{
          backgroundColor: "#fff",
        }}
      >
        {/* <StepsInvestmentPlan /> */}
      {/* </section> */}
      <section
        style={{
          backgroundColor: "#E6EAEF",
        }}
      >
        <DebtInvestments />
      </section>
      <AlternateInvestments />
      {/* <YoutubevideoSection /> */}
      <SecuritySection DynamicBgColor={"#E6EAEF"} />
      <section style={{}} id="book-appointment">

        {utmSource && tagval ? (
          <AppointmentBox
            extraParams={{ "utm_source": utmSource, }}
            eventCode={tagval}
            serviceName="investment_planning"
            eventUrl="https://calendly.com/fintoo/15-min-consultation-call-investment-planning"
            planId="18"
            pageName={"Investment Planning"}
          />
        ) : (
          <AppointmentBox
            eventCode={'Callback_mintyApp_57'}
            serviceName="investment_planning"
            eventUrl="https://calendly.com/fintoo/15-min-consultation-call-investment-planning"
              planId="18"
                          pageName={"Investment Planning"}

          />
        )}
        {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.investmentPlanning} onSuccess={() => SetShow(true)} /> */}
      </section>
      <FaqSection />
      {show && <ThankyouSection onClose={() => SetShow(false)} />}
    </Fullpage>
  );
};
export default InvestPlanning;
