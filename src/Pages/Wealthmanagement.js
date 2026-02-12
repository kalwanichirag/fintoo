import AssistedUAESection from "../components/AssistedUAESection";
import HowWeGuide from "../components/HowWeGuide";
import FeaturedIn from "../components/HTML/FeaturedIn";
import InsuranceClientTestimonialSection from "../components/HTML/Insurance/InsuranceClientTestimonialSection";
import InvestmentsOffered from "../components/InvestmentsOffered";
import KeyDifferentiators from "../components/KeyDifferentiators";

import VideoBox from "../components/VideoBox";
import OurAchievements from "../components/HTML/OurAchievements";
import Fullpage from "../components/Layout/Fullpage";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import AppointmentBox from "../components/Pages/Calendly";
import UAEHeader from "../components/MainHeader/UAEHeader";
import UAEFooter from "../components/HTML/Footer/UAEFooter";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import ApplyWhiteBg from "../components/ApplyWhiteBg";
import HideFooter from "../components/HideFooter";
import HideHeader from "../components/HideHeader";
import { useLocation } from "react-router-dom";
const Wealthmanagement = () => {
  // const url = "https://www.fintoo.ae/web/wealth-management/?utm_source=7&utm_medium=13&utm_campaign=98&tags=UAE_GSA_Fintoo_UAE_Wealth_Management_Phrase_oct23";
  const [show, SetShow] = useState(false)
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  const [utmSource, setUtmSource] = useState(26);
  const [tagval, setTagval] = useState(null);
  useEffect(() => {
    dispatch({ type: "HIDE_FOOTER", payload: true });
  }, []);
  // useEffect(() => {
  //   function extractParametersFromURL() {
  //     // const urlSearchParams = new URLSearchParams(new URL(url).search);
  //     const urlSearchParams = new URLSearchParams(window.location.search);
  //     const utmSource = urlSearchParams.get('utm_source');
  //     const tagval = urlSearchParams.get('tags');

  //     setUtmSource(utmSource);
  //     setTagval(tagval);
  //   }
  //   extractParametersFromURL();
  //   window.addEventListener('popstate', extractParametersFromURL);
  //   return () => {
  //     window.removeEventListener('popstate', extractParametersFromURL);
  //   };
  // }, []);
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
    <>
      <HideFooter />
      <HideHeader />
      <ApplyWhiteBg />

      <UAEHeader />

      <VideoBox />

      <section id="Howweguide">
        <HowWeGuide />
      </section>
      <section style={{ backgroundColor: "#F1F9FD" }}>
        <AssistedUAESection />
      </section>
      <InvestmentsOffered />
      <KeyDifferentiators />
      <ClientTestimonial />
      {/* <InsuranceClientTestimonialSection /> */}
      <OurAchievements />
      <section>
        <FeaturedIn />
      </section>
      <section
        style={
          {
            //
          }
        }
        id="ContactUs"
      >
        {
          pageurl === "web/nri-desk-dubai" ? (
            <AppointmentBox
              extraParams={{ "rm_id": "361" }}
              eventCode={"Callback_mintyApp_11"}
              serviceName="nri"
              eventUrl={
                "https://calendly.com/fintoo/15-minutes-consultation-call-nri-desk?hide_event_type_details=1"
              }
              planId="29"
            />
          ) : (
            utmSource && tagval ? (
              <AppointmentBox
                extraParams={{ "utm_source": utmSource, }}
                eventCode={tagval}
                serviceName="financial_planning"
                eventUrl={
                  "https://calendly.com/fintoo/15-minutes-consultation-call-uae-ads?hide_event_type_details=1"
                }
                planId="29"
              />
            ) : (
              <AppointmentBox
                extraParams={{ "rm_id": "96", "utm_source": utmSource ? utmSource : "26", }}
                eventCode={"Callback_mintyApp_8"}
                serviceName="financial_planning"
                eventUrl={
                  "https://calendly.com/fintoo/15-minutes-consultation-call-uae-ads?hide_event_type_details=1"
                }
                planId="29"
              />
            )
          )
        }
        {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.insurance} onSuccess={() => SetShow(true)} /> */}
      </section>
      <UAEFooter />
    </>
  );
};
export default Wealthmanagement;
