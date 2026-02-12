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
import { useEffect } from "react";
import ApplyWhiteBg from "../components/ApplyWhiteBg";
import HideFooter from "../components/HideFooter";
import HideHeader from "../components/HideHeader";
const AssistedUAEDubai = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: "HIDE_FOOTER", payload: true });
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
        <AppointmentBox
          extraParams={{"rm_id": "361"}}
          eventCode={"Callback_mintyApp_11"}
          serviceName="nri"
          eventUrl={
            "https://calendly.com/fintoo/15-minutes-consultation-call-nri-desk?hide_event_type_details=1"
          }
          planId="29"
        />
        {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.insurance} onSuccess={() => SetShow(true)} /> */}
      </section>
      <UAEFooter />
    </>
  );
};
export default AssistedUAEDubai;
