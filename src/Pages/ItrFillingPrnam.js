import EndToEndSolutionSection from "../components/HTML/NriTaxationLandingPage/EndToEndSolutionSection";
import NriTaxationHeaderSection from "../components/HTML/NriTaxationLandingPage/NriTaxationLandingPageHeaderSection";

import ITRFileHeaderSection from "../components/HTML/ITRFile/ITRFileHeaderSection";
import ITRVideoCardSection from "../components/HTML/ITRFile/ITRVideoCardSection";
import WhyTrustUsSection from "../components/HTML/NriTaxationLandingPage/WhyTrustUsSection";
import FaqSection from "../components/HTML/FinancialPlan/FaqSection";

import ApplyWhiteBg from "../components/ApplyWhiteBg";
import HideFooter from "../components/HideFooter";
import HideHeader from "../components/HideHeader";
import PrnamHeader from "../components/MainHeader/PrnamHeader";

const ItrFillingPrnam = () => {
  return (
    <>
      <>
        <HideFooter />
        <HideHeader />
        <ApplyWhiteBg />
        <PrnamHeader />
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
export default ItrFillingPrnam;
