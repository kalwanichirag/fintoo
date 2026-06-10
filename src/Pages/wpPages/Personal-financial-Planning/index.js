import React, { useEffect } from 'react'
import Style from "./style.module.css"
import HideHeader from '../../../components/HideHeader';
import HideFooter from '../../../components/HideFooter';
import LandingPageCalendly from '../../../components/landingpagesCalendly/LandingPageCalendly';
import LandingPageOtp from '../../../components/landingpagesOtp/LandingPageOtp';
import ClientTestimonial from '../../../components/HTML/ClientTestimonial';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ClientReviews from '../../../components/HTML/ClientReviews';

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

const ChartGrowthIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path d="M4 19H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6.5 15.5L10 12L13 14.5L18 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.5 8.5H18V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SafeIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <rect x="4" y="5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="15.5" cy="12" r="1.6" fill="currentColor" />
        <path d="M7.5 9H10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7.5 12H9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const UsersIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4.5 18C5.3 15.8 7 14.5 9 14.5C11 14.5 12.7 15.8 13.5 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="16.5" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M14.5 17.5C15 16.1 16.1 15.1 17.6 14.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const TrophyIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path d="M8 5H16V8C16 10.2 14.2 12 12 12C9.8 12 8 10.2 8 8V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M10 12.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 12.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 18H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M6.5 6H5.5C4.67 6 4 6.67 4 7.5C4 9.43 5.57 11 7.5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M17.5 11C19.43 11 21 9.43 21 7.5C21 6.67 20.33 6 19.5 6H18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const trustMessages = [
    "India's Most Trusted Wealth Advisory for Goal-Based Financial Planning",
    "Certified Planners Helping 2,50,000+ Indians and NRIs Build Smarter Wealth",
    "20+ Years of Advisory Experience Focused on Long-Term Financial Growth",
];

const compactStats = [
    {
        value: "14.8%",
        label: "Avg. Annualized Return",
        tone: Style.statBlue,
        accent: Style.cardBlue,
        icon: ChartGrowthIcon,
        eyebrow: "Performance",
        subtext: "+3.2% vs Market"
    },
    {
        value: "₹4000Cr+",
        label: "Assets Under Tracking",
        tone: Style.statGreen,
        accent: Style.cardGreen,
        icon: SafeIcon,
        eyebrow: "Scale",
        subtext: "Growing 15% YoY"
    },
    {
        value: "2,50,000+",
        label: "Happy Clients",
        tone: Style.statViolet,
        accent: Style.cardViolet,
        icon: UsersIcon,
        eyebrow: "Trust",
        subtext: "97% Retention Rate"
    },
    {
        value: "20+",
        label: "Years Experience",
        tone: Style.statOrange,
        accent: Style.cardOrange,
        icon: TrophyIcon,
        eyebrow: "Legacy",
        subtext: "Market Leadership"
    },
];

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
            <div className={Style.topTrustBar}>
                <div className={Style.topTrustViewport}>
                    <div className={Style.topTrustTrack}>
                        {trustMessages.map((message) => (
                            <div className={Style.topTrustMessage} key={message}>
                                {message}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
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
               <div className={Style.compactTrustBlock}>
                        <div className={Style.compactStatsGrid}>
                            {compactStats.map((stat) => (
                                <div className={`${Style.compactStatCard} ${stat.accent}`} key={stat.label}>
                                    <div className={Style.compactStatTop}>
                                        <div className={Style.compactStatEyebrow}>{stat.eyebrow}</div>
                                        <div className={Style.compactStatIconWrap}>
                                            <stat.icon className={`${Style.compactStatIcon} ${stat.tone}`} />
                                        </div>
                                    </div>
                                    <div className={`${Style.compactStatValue} ${stat.tone}`}>{stat.value}</div>
                                    <div className={Style.compactStatLabel}>{stat.label}</div>
                                    <div className={Style.compactStatSubtext}>{stat.subtext}</div>
                                </div>
                            ))}
                        </div>
                    </div>
<div className={Style.clientReviewsHeader}>
 What Our Clients Say About Us

</div>
<div className={Style.testimonialSection}>
<ClientReviews />
</div>
          <div className="container-fluid pt-4">
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
