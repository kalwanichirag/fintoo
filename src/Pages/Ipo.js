import React, { useEffect, useState } from "react";
import FaqSection from "../components/HTML/IpoPage/FaqSection";
import IpoWhyTrustUsSection from "../components/HTML/IpoPage/WhyInvestIpoSection";
import IpoHeaderSection from "../components/HTML/IpoPage/IpoPageHeaderSection";
import Fullpage from "../components/Layout/Fullpage";
import { servicesTypes } from "../components/WealthManagementContactForm/model";
import ThankyouSection from "../components/ThankyouSection";
import AppointmentBox from "../components/Pages/Calendly";
import ClientTestimonial from "../components/HTML/ClientTestimonial";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
function IpoPage() {
  const [show, SetShow] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  const [utmSource, setUtmSource] = useState(26);
  const [tagval, setTagval] = useState(null);
  useEffect(() => {
    function extractParametersFromURL() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const utmSourceParam = urlSearchParams.get("utm_source");
        const tagvalParam = urlSearchParams.get("tags");

        if (utmSourceParam || tagvalParam) {
            setUtmSource(utmSourceParam);
            setTagval(tagvalParam);
            setPageurl(window.location.pathname);
            const cookieOptions = { expires: 0.0208 };
            // const cookieOptions = { expires: 0.00139 };
            Cookies.set("utm_source", utmSourceParam || "", cookieOptions);
            Cookies.set("tagval", tagvalParam || "", cookieOptions);
            Cookies.set("pageurl", window.location.pathname, cookieOptions);
        } else {
            const storedUtmSource = Cookies.get("utm_source") || null;
            const storedTagval = Cookies.get("tagval") || null;
            const storedPageurl = Cookies.get("pageurl") || null;

            setUtmSource(storedUtmSource);
            setTagval(storedTagval);
            setPageurl(storedPageurl);
        }
    }

    extractParametersFromURL();
    window.addEventListener("popstate", extractParametersFromURL);

    return () => {
        window.removeEventListener("popstate", extractParametersFromURL);
    };
}, [window.location.search]);

useEffect(() => {
    const interval = setInterval(() => {
        if (!Cookies.get("utm_source") && !Cookies.get("tagval") && !Cookies.get("pageurl")) {
            setUtmSource(utmSource);
            setTagval(null);
            setPageurl(null);
        }
    }, 500);

    return () => clearInterval(interval);
}, []);

  return (
    <Fullpage>
      <div style={{ backgroundColor: "white" }}>
        <IpoHeaderSection />
        <IpoWhyTrustUsSection />
        {/* <IpoClientTestimonialSection /> */}
        <ClientTestimonial />
        {/* <IpoFeaturedIn /> */}

        {utmSource && tagval ? (
          <AppointmentBox
            extraParams={{ "utm_source": utmSource, }}
            eventCode={tagval}
            serviceName="ipo"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-ipo?hide_event_type_details=1"}
            planId="50"
            pageName={"IPO"}
          />
        ) : (
          <AppointmentBox
            eventCode={'Callback_mintyApp_113'}
            serviceName="ipo"
            eventUrl={"https://calendly.com/fintoo/15-min-consultation-call-ipo?hide_event_type_details=1"}
              planId="50"
              pageName={"IPO"}
          />
        )}
        {/* <AppointmentBox eventCode={'Callback_mintyApp_113'} serviceName="IPO" eventUrl="https://calendly.com/fintoo/15-min-consultation-call-ipo?hide_event_type_details=1" /> */}


        {/* <WealthContactForm imgSrc={backImg} serviceType={servicesTypes.IPO} onSuccess={() => SetShow(true)} /> */}
        {show && <ThankyouSection onClose={() => SetShow(false)} />}
        <FaqSection />
      </div>
    </Fullpage>
  );
}

export default IpoPage;
