import FaqSection from "../components/HTML/ITRFile/FaqSection";
import ITRFileHeaderSection from "../components/HTML/ITRFile/ITRFileHeaderSection";
import Fullpage from "../components/Layout/Fullpage";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import ITRVideoCardSection from "../components/HTML/ITRFile/ITRVideoCardSection";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import ITRHowToFile from "../components/ITRHowToFile";
import Incometaxfiling from "../components/Pages/Calendly/Incometaxfiling";
function ITRFile() {
  const [show, SetShow] = useState(false);

  return (
    <Fullpage>
       <Helmet>
        <meta name="keywords" content="e filing income tax login, income tax login, itr login, itr filing, itr e-filing, income tax e filing, income tax return filing, itr efiling, income tax filing, income tax e filing portal, itr filing online" />
       </Helmet>
      <div style={{ backgroundColor: "white" }}>
        <ITRFileHeaderSection />
        {/* <ITRCardSection /> */}
        {/* <ITRHowToFile /> */}
        {/* <div id="ITRBook">
         <Incometaxfiling eventCode={'itr_filing_2025'} serviceName="Income Tax Filing" eventUrl="https://calendly.com/d/223-wk6-b79/itr-15-mins-introduction-with-tax-expert?hide_event_type_details=1&hide_gdpr_banner=1&month=2023-07"/>
        </div> */}
        <div id="ITRVideo">
          <ITRVideoCardSection />
        </div>
        <ITRHowToFile />
        {/* <ITRFile /> */}
        <ClientTestimonial />
        <FaqSection />
      </div>
    </Fullpage>
  );
}

export default ITRFile;
