import React, { useEffect, useState } from 'react'
import Style from "./style.module.css"
import HideFooter from '../../components/HideFooter'
import HideHeader from '../../components/HideHeader'
import AppointmentBox from '../../components/Pages/Calendly'
import Calendar from '../../components/Pages/Calendly/Calendar';
import VerificationSection from '../../components/Pages/Calendly/VerificationSection'
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

const PersonalFinancialPlan = () => {
    const [utmSource, setUtmSource] = useState("");
    const [tagval, setTagval] = useState(null);
    const [pageurl, setPageurl] = React.useState();
    useEffect(() => {
        function extractParametersFromURL() {
            // const urlSearchParams = new URLSearchParams(new URL(url).search);
            const urlSearchParams = new URLSearchParams(window.location.search);
            const utmSource = urlSearchParams.get('utm_source');
            const tagval = urlSearchParams.get('tags');
            setPageurl(location.pathname);
            setUtmSource(utmSource);
            setTagval(tagval);
        }
        extractParametersFromURL();
        window.addEventListener('popstate', extractParametersFromURL);
        return () => {
            window.removeEventListener('popstate', extractParametersFromURL);
        };
    }, []);

    useEffect(() => {
        document.body.classList.add("Personal-finance")
        return () => {
            document.body.classList.remove("Personal-finance")
        }
    }, [])
    const extraParams = {
        plan_name: 'Financial Plan',
        service: "98",
    }
    return (
        <div className={Style.personalfinancePage}>
            <HideHeader />
            <div className={Style.fhlogo}>
                <img
                    src={process.env.REACT_APP_STATIC_URL + "media/FH.png"}
                    alt="Fintoo logo"
                />
            </div>
            <div className={`row ${Style.PFdivider}`}>
                <div className={`col-md-6 col-12 ${Style.leftSection}`}>
                    <div className={Style.pfInfo}>
                        <div className={Style.pfHeader}>Get A Personal Financial Advisor To Guide You Towards Financial Growth.</div>
                        <div className={Style.pfsubHeader}>Trusted by 2,50,000+ Indians and NRI for the right financial advice</div>
                    </div>
                    <div className={Style.pfpoints}>
                        <div className={Style.pflistbox}>
                            <div><CachetIcon /></div>
                            <div className={Style.pflist}>Team of qualified and experienced advisors</div>
                        </div>
                        <div className={Style.pflistbox}>
                            <div><CachetIcon /></div>
                            <div className={Style.pflist}>Tailored and comprehensive Financial plan</div>
                        </div>
                        <div className={Style.pflistbox}>
                            <div><CachetIcon /></div>
                            <div className={Style.pflist}>Backed by AI technology and human experience</div>
                        </div>
                        <div className={Style.pflistbox}>
                            <div><CachetIcon /></div>
                            <div className={Style.pflist}>Proven market-beating performance</div>
                        </div>
                    </div>
                </div>
                <div className='col-md-6 col-12'>
                    {utmSource && tagval ? (
                        <>
                            <VerificationSection logo={false} extraParams={{ "utm_source": utmSource, }} eventCode={tagval} serviceName="personal financial planning" eventUrl={"https://calendly.com/fintoo/test1"} planId="29" addIncomSlabAndComment={true} />
                            {/* <Calendar extraParams={{ "utm_source": utmSource, }} eventCode={tagval} planId="29" url={'https://calendly.com/fintoo/test1'} serviceName={'personal financial planning'} /> */}
                        </>
                    ) : (
                        <VerificationSection extraParams={extraParams} logo={false} eventCode={'undefined_calendly'} serviceName="personal financial planning" eventUrl={"https://calendly.com/fintoo/test1"} planId="29" addIncomSlabAndComment={true} />
                    )
                    }

                </div>
            </div>
            <HideFooter />
        </div>
    )
}

export default PersonalFinancialPlan
