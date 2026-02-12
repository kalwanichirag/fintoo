import AssistedUAESection from "../components/AssistedUAESection";
import ContactUs from "../components/ContactUs";
import FooterUAE from "../components/FooterUAE";
import HowWeGuide from "../components/HowWeGuide";
import AdvisorySection from "../components/HTML/Advisory";
import FeaturedIn from "../components/HTML/FeaturedIn";
import InsuranceClientTestimonialSection from "../components/HTML/Insurance/InsuranceClientTestimonialSection";
import InvestmentsOffered from "../components/InvestmentsOffered";
import KeyDifferentiators from "../components/KeyDifferentiators";

import VideoBox from "../components/VideoBox";
import OurAchievements from "../components/HTML/OurAchievements";
import Fullpage from "../components/Layout/Fullpage";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import AppointmentBox from "../components/Pages/Calendly";
const AssistedUAE = () => {
  return (
    <Fullpage>
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
          eventCode={"Callback_mintyApp_11"}
          serviceName="nri"
          eventUrl={
            "https://calendly.com/fintoo/15-minutes-consultation-call-nri-desk?hide_event_type_details=1"
          }
          planId="29"
        />
        {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.insurance} onSuccess={() => SetShow(true)} /> */}
      </section>
    </Fullpage>
  );
};
export default AssistedUAE;
