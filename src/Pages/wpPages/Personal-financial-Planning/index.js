import React, { useEffect } from 'react'
import Style from "./style.module.css"
import HideHeader from '../../../components/HideHeader';
import HideFooter from '../../../components/HideFooter';
import LandingPageCalendly from '../../../components/landingpagesCalendly/LandingPageCalendly';
import LandingPageOtp from '../../../components/landingpagesOtp/LandingPageOtp';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const CachetIcon = ({ width = 24, height = 24, fill = 'currentColor', ...props }) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill={fill}
        {...props}
    >
        <title>Cachet</title>
        <path d="M11.746.254C5.265.254 0 5.519 0 12c0 6.481 5.265 11.746 11.746 11.746 6.482 0 11.746-5.265 11.746-11.746 0-1.44-.26-2.82-.734-4.097l-.264-.709-1.118 1.118.1.288c.373 1.064.575 2.207.575 3.4a10.297 10.297 0 01-10.305 10.305A10.297 10.297 0 011.441 12 10.297 10.297 0 0111.746 1.695c1.817 0 3.52.47 5.002 1.293l.32.178 1.054-1.053-.553-.316A11.699 11.699 0 0011.746.254zM22.97.841l-13.92 13.92-3.722-3.721-1.031 1.03 4.752 4.753L24 1.872z" />
    </svg>
);

const PersonalFinancialPlan = ({formtype}) => {
    
   
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-T15R5ED28G";
        script.async = true;
        document.head.appendChild(script);

        const script2 = document.createElement("script");
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-T15R5ED28G');
        `;
        document.head.appendChild(script2);

        return () => {
            document.head.removeChild(script);
            document.head.removeChild(script2);
        };
    }, []);
  

    useEffect(() => {
        document.body.classList.add("Personal-finance")
        return () => {
            document.body.classList.remove("Personal-finance")
        }
    }, [])
   
    return (
        <div className={Style.personalfinancePage}>
            <HideHeader />
            <div className={Style.fhlogo}>
                <img
                    src={process.env.REACT_APP_STATIC_URL + "media/FH.png"}
                    alt="Fintoo logo"
                />
            </div>
            <div className={`row ${Style.PFdivider} align-items-center justify-content-between`}>
                <div className={`col-md-6 col-12 ${Style.leftSection}`}>
                    <div className={Style.pfInfo}>
                        <div className={Style.pfHeader}>Get A Personal Financial Advisor To Guide You Towards Financial Growth.</div>
                        <div className={Style.pfsubHeader}>Trusted by 2,50,000+ Indians and NRI for the right financial advice</div>
                    </div>
                    <div className={Style.pfpoints}>
                        <div className={Style.pflistbox}>
                            <div><CachetIcon /></div>
                            <div className={Style.pflist}>
Certified Expertise – Chartered financial planners and registered investment advisors trusted by HNIs across India.</div>
                        </div>
                        <div className={Style.pflistbox}>
                            <div><CachetIcon /></div>
                            <div className={Style.pflist}>Personalized Planning – From retirement investment options to education investment plans, your goals drive our strategy.</div>
                        </div>
                        <div className={Style.pflistbox}>
                            <div><CachetIcon /></div>
                            <div className={Style.pflist}>
Best Investment Options – Access handpicked portfolios, systematic investment plans, and global wealth opportunities.</div>
                        </div>
                        <div className={Style.pflistbox}>
                            <div><CachetIcon /></div>
                            <div className={Style.pflist}>
Tax-Smart Strategies – Best tax saving plans and holistic financial planning services.</div>
                        </div>
                        <div className={Style.pflistbox}>
                            <div><CachetIcon /></div>
                        <div className={Style.pflist}>

Trusted Wealth Partner – Leading wealth management company in India, delivering discretion, performance, and legacy planning.
                            </div>
                            </div>
                    </div>
                </div>
                <div className='col-md-5 col-12 '>
                    {formtype == "otp" ? (<LandingPageOtp  variant='minimal' pageName="Personal Financial Planning" calendlyurl={"https://calendly.com/d/2zt-z8p-34k/15-min-consultation-call-financial-planning?hide_event_type_details=1"}/>
                ) :
                     <LandingPageCalendly pageName="Personal Financial Planning" servicename={"assisted_advisory_fixed_fees"} calendlyurl={"https://calendly.com/d/2zt-z8p-34k/15-min-consultation-call-financial-planning?hide_event_type_details=1"} variant='minimal'/>

}


                   
                </div>
            </div>

          <div className="container-fluid mt-5 pt-4">
  <div className={Style.disclaimerWrapper}>
    <p className={Style.disclaimerTitle}>
      Disclaimer & Regulatory Information
    </p>

    <p className={Style.disclaimerText}>
     Fintoo Wealth Private Limited (Brand Name - Fintoo.in, Fintoo app, Fintoo) makes no warranties or representations, express or implied, on products and services offered through the platform. It accepts no liability for any damages or losses, however, caused in connection with the use of, or on the reliance of its advisory or related services. Past performance is not indicative of future returns. Please consider your specific investment requirements, risk tolerance, goal, time frame, risk and reward balance and the cost associated with the investment before choosing a fund, or designing a portfolio that suits your needs. Performance and returns of any investment portfolio can neither be predicted nor guaranteed. Investments made on advisory are subject to market risks, read all scheme related documents carefully.


    </p>

      <div className={Style.disclaimerExpanded}>

© Fintoo Wealth Private Limited [SEBI RIA Registration No: INA000020031] [BASL Membership ID: 2252] [Type of Registration: Non-Individual] [Validity of registration: March 26,2025-Perpetual] [Address: Fintoo Wealth Private Limited, B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059] [CIN - U66301MH2023PTC414206] [GST No : 27AAFCF7114E1ZV] [Principal Officer details : Mr. Mihir Shah (mihir.shah@fintoo.in)] [Compliance Officer details : Mrs. Nisha Harchekar (nisha.harchekar@fintoo.in)] [Corresponding SEBI regional/local office: Plot No. C 4-A , G Block, Near Bank of India, Bandra Kurla Complex,Bandra East, Mumbai, Maharashtra 400051]
              
                <br />
              <div className='text-center'> Copyright © 2025 Fintoo,. All rights reserved</div>
              </div>
              
              
  </div>
</div>


            <HideFooter />
        </div>
    )
}

export default PersonalFinancialPlan
