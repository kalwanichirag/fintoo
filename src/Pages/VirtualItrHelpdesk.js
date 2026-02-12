import HeaderSection from "../components/HTML/VirtualItrHelpdesk/HeaderSection";
import FaqSection from "../components/HTML/Insurance/FaqSection";
import SecuritySection from "../components/HTML/SecuritySection";
import Fullpage from "../components/Layout/Fullpage";
import WealthContactForm from "../components/HTML/VirtualItrHelpdesk/WealthManagementContactForm";
import FeaturedIn from "../components/HTML/VirtualItrHelpdesk/FeaturedIn";
import ITRClientTestimonialSectionInsuranceClientTestimonialSection from "../components/HTML/VirtualItrHelpdesk/ITRClientTestimonialSection";
import HelpDesk from "../components/HTML/VirtualItrHelpdesk/HelpDesk";
import { servicesTypes } from "../components/WealthManagementContactForm/model";
import { useState } from "react";
import ThankyouSection from "../components/ThankyouSection";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
const VirtualItrHelpdesk = () => {
  const [show, SetShow] = useState(false)

  return (
    <Fullpage>
      <HeaderSection />
      <HelpDesk />
      <SecuritySection DynamicBgColor={'#E6EAEF'} />
      <ClientTestimonial />
      {/* <ITRClientTestimonialSectionInsuranceClientTestimonialSection /> */}
      <FeaturedIn headerText={"Corporate Companies We Are Proud To Be Associated With."} />
      <FaqSection />
      <section id="Asknow">
        <WealthContactForm serviceType={servicesTypes.virtualItr} onSuccess={() => SetShow(true)} />
      </section>
      {show && <ThankyouSection onClose={() => SetShow(false)} />}
    </Fullpage>
  );
};
export default VirtualItrHelpdesk;