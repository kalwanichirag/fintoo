import FaqSection from "../components/HTML/ITRFile/FaqSection";
import ITRFileHeaderSection from "../components/HTML/ITRFile/ITRFileHeaderSection";
import Fullpage from "../components/Layout/Fullpage";
import { useState } from "react";

import ITRVideoCardSection from "../components/HTML/ITRFile/ITRVideoCardSection";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import HideHeader from "../components/HideHeader";
import HideFooter from "../components/HideFooter";
import ITRHowToFile from "../components/ITRHowToFile";
import UAEFooter from "../components/HTML/Footer/UAEFooter";
import Incometaxfiling from "../components/Pages/Calendly/Incometaxfiling";
function ITRFileLanding() {
  const [show, SetShow] = useState(false);

  return (
    <Fullpage>
      <HideHeader />
      <HideFooter />
      <div
        style={{
          backgroundColor: "white",
          scrollBehavior: "smooth !important",
        }}
      >
        <ITRFileHeaderSection />
        {/* <ITRCardSection /> */}
        {/* <ITRHowToFile /> */}
        {/* <div id="ITRBook">
          <Incometaxfiling
            extraParams={{tagval: window.location.host.indexOf("fintoo.ae") ? "NRI_calendly_itr_filing_2025" : "Live_ITR_calendly_itr_filing_2025", tags: window.location.host.indexOf("fintoo.ae") ? "NRI_calendly_itr_filing_2025" : "Live_ITR_calendly_itr_filing_2025", "skip_sms":"1", "service": "34"}}
            eventCode={"Callback_mintyApp_9"}
            serviceName="Income Tax Filing"
            eventUrl="https://calendly.com/d/223-wk6-b79/itr-15-mins-introduction-with-tax-expert?hide_event_type_details=1&hide_gdpr_banner=1&month=2023-07"
          />
        </div> */}
        <div id="ITRVideo">
          <ITRVideoCardSection />
        </div>
        <ITRHowToFile />
        <ClientTestimonial />
        <FaqSection />
      </div>

      <UAEFooter />
    </Fullpage>
  );
}

export default ITRFileLanding;
