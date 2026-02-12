import FaqSection from "../components/HTML/NriTaxationLandingPage/FaqSection";
import ITRFileHeaderSection from "../components/HTML/ITRFile/ITRFileHeaderSection";
import Fullpage from "../components/Layout/Fullpage";
import { useState } from "react";
import ITRVideoCardSection from "../components/HTML/ITRFile/ITRVideoCardSection";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import HideHeader from "../components/HideHeader";
import HideFooter from "../components/HideFooter";
import ITRHowToFile from "../components/ITRHowToFile";
import Incometaxfiling from "../components/Pages/Calendly/Incometaxfiling";

function ITRFileLandingae() {
  const [show, SetShow] = useState(false);

  return (
    <Fullpage>
      <HideHeader />
      <HideFooter />
      <div style={{ backgroundColor: "white" }}>
        {/* <div className="text-center pt-4">
          <img
            src={process.env.PUBLIC_URL + "/static/media/logo.svg"}
            alt="Fintoo logo"
          />
        </div> */}
        <ITRFileHeaderSection />
        <div id="ITRBook">
          <Incometaxfiling
            eventCode={"NRI_calendly_itr_filing_2025"}
            serviceName="Income Tax Filing"
            eventUrl="https://calendly.com/d/38t-xkr-6h4/itr-15-mins-introduction-with-tax-expert?hide_event_type_details=1&hide_gdpr_banner=1&month=2023-07"
          />
        </div>
        <div id="ITRVideo">
          <ITRVideoCardSection />
        </div>
        <ITRHowToFile />
        <ClientTestimonial />
        <FaqSection />
      </div>

      <footer className="new-itr-page-footer">
        <div className="container">
          <p className="elementor-heading-title elementor-size-default pt-4">
            Fintoo Wealth Private Limited (Brand Name - Fintoo.in, Fintoo app,
            Fintoo) makes no warranties or representations, express or implied,
            on products and services offered through the platform. It accepts no
            liability for any damages or losses, however, caused in connection
            with the use of, or on the reliance of its advisory or related
            services.
            <br />
            Past performance is not indicative of future returns. Please
            consider your specific investment requirements, risk tolerance,
            goal, time frame, risk and reward balance and the cost associated
            with the investment before choosing a fund, or designing a portfolio
            that suits your needs. Performance and returns of any investment
            portfolio can neither be predicted nor guaranteed. Investments made
            on advisory are subject to market risks, read all scheme related
            documents carefully. Marketing and distribution of various financial
            products such as Mutual Funds,Loans,Insurance,Bonds, Domestic Equity
            and International Equity are powered by Mihika Financial Services
            Private Limited (FintooInvest.in, FintooInvest app, FintooInvest).
          </p>

          <p className="elementor-heading-title elementor-size-default pt-4">
            © Fintoo Wealth Private Limited [SEBI RIA Registration No:
            INA000020031] [Type of Registration: Non-Individual] [Validity of
            registration: February 17, 2021-Perpetual] [Address: Fintoo Wealth Private Limited, B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059] [ARN - 21209]
             [CIN - U66301MH2023PTC414206] [GST
            No : 27AAFCF7114E1ZV] [Principal Officer details : Principal
            Officer: Ms. Nidhi Manchanda(nidhi.manchanda@fintoo.in)]
            [Corresponding SEBI regional/local office: Plot No. C 4-A , G Block,
            Near Bank of India, Bandra Kurla Complex,Bandra East, Mumbai,
            Maharashtra 400051]
          </p>
          <p className="elementor-heading-title elementor-size-default py-4 text-center">
            Copyright © 2022 Fintoo,. All rights reserved
          </p>
        </div>
      </footer>
    </Fullpage>
  );
}

export default ITRFileLandingae;
