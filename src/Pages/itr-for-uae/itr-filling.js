import EndToEndSolutionSection from "../../components/HTML/NriTaxationLandingPage/EndToEndSolutionSection";
import NriTaxationHeaderSection from "../../components/HTML/NriTaxationLandingPage/NriTaxationLandingPageHeaderSection";
import ITRFile from "../ITRFile";
import ITRFileHeaderSection from "../../components/HTML/ITRFile/ITRFileHeaderSection";
import ITRVideoCardSection from "../../components/HTML/ITRFile/ITRVideoCardSection/UaePrice";
import WhyTrustUsSection from "../../components/HTML/NriTaxationLandingPage/WhyTrustUsSection";
import FaqSection from "../../components/HTML/FinancialPlan/FaqSection";

import UAEHeader2 from "../../components/MainHeader/UAEHeader2";
import ApplyWhiteBg from "../../components/ApplyWhiteBg";
import HideFooter from "../../components/HideFooter";
import HideHeader from "../../components/HideHeader";
const ItrFilling = () => {
  return (
    <>
      <>
        <HideFooter />
        <HideHeader />
        <ApplyWhiteBg />
        <UAEHeader2 />
        <NriTaxationHeaderSection />
        <EndToEndSolutionSection />
        <ITRFileHeaderSection />
        <ITRVideoCardSection />
        <WhyTrustUsSection />
        <FaqSection />
      </>
    </>
  );
};
export default ItrFilling;
