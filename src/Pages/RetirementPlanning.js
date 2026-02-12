import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import FaqSection from "../components/HTML/RetirementPlanning/FaqSection";
import FinancialReport from "../components/HTML/RetirementPlanning/FinancialReport";
import HeaderSection from "../components/HTML/RetirementPlanning/HeaderSection";
import HowWeWorkSection from "../components/HTML/RetirementPlanning/StepsFinancialPlan";
import YoutubevideoSection from "../components/HTML/RetirementPlanning/YoutubevideoSection";
import SecuritySection from "../components/HTML/SecuritySection";
import Fullpage from "../components/Layout/Fullpage";
import AppointmentBox from "../components/Pages/Calendly";
import { useLocation } from "react-router-dom";

const RetirementPlanning = () => {
  const [utmSource, setUtmSource] = useState(null);
  const [tagval, setTagval] = useState(null);
  const [pageurl, setPageurl] = useState(null);
  const location = useLocation();
  const HowWeWorkSectionRef = useRef(null);

  useEffect(() => {
    function extractParametersFromURL() {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const utmSourceParam = urlSearchParams.get("utm_source");
      const tagvalParam = urlSearchParams.get("tags");

      if (utmSourceParam || tagvalParam) {
        setUtmSource(utmSourceParam);
        setTagval(tagvalParam);
        setPageurl(location.pathname);

        const cookieOptions = { expires: 0.0208 };
        // const cookieOptions = { expires: 0.00139 };
        Cookies.set("utm_source", utmSourceParam || "", cookieOptions);
        Cookies.set("tagval", tagvalParam || "", cookieOptions);
        Cookies.set("pageurl", location.pathname, cookieOptions);
      } else {

        const storedUtmSource = Cookies.get("utm_source");
        const storedTagval = Cookies.get("tagval");
        const storedPageurl = Cookies.get("pageurl");

        if (storedUtmSource || storedTagval) {
          setUtmSource(storedUtmSource);
          setTagval(storedTagval);
          setPageurl(storedPageurl);
        }
      }
    }

    extractParametersFromURL();
    window.addEventListener("popstate", extractParametersFromURL);
    return () => {
      window.removeEventListener("popstate", extractParametersFromURL);
    };
  }, [location]);

  useEffect(() => {
    if (location.hash === "#HowWeWorkSection" && HowWeWorkSectionRef.current) {
      HowWeWorkSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <Fullpage>
      <HeaderSection />
      <p style={{ height: "6rem" }} ref={HowWeWorkSectionRef}></p>
      <HowWeWorkSection />
      <FinancialReport />
      <YoutubevideoSection />
      <SecuritySection />
      <section id="book-appointment">
        {utmSource && tagval ? (
          <AppointmentBox
            extraParams={{ utm_source: utmSource, service: 98 }}
            eventCode={tagval}
            serviceName="retirement_planning"
            eventUrl="https://calendly.com/fintoo/15-minutes-consultation-call-retirement-planning?hide_event_type_details=1"
            planId="20"
            pageName="Retirement Planning"
          />
        ) : (
          <AppointmentBox
            eventCode={"Callback_mintyApp_10"}
            serviceName="retirement_planning"
            eventUrl="https://calendly.com/fintoo/15-minutes-consultation-call-retirement-planning?hide_event_type_details=1"
            planId="20"
            pageName="Retirement Planning"

          />
        )}
      </section>
      <FaqSection />
    </Fullpage>
  );
};

export default RetirementPlanning;
