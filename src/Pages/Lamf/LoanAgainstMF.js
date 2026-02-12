import React, { useEffect, useState } from "react";

import Fullpage from "../../components/Layout/Fullpage";

import ThankyouSection from "../../components/ThankyouSection";

import AppointmentBox from "../../components/Pages/Calendly";
import ClientTestimonial from "../../components/HTML/ClientTestimonial";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import LandingHeaderSection from "./LandingHeaderSection";
import FeatureSection from "./FeatureSection";
import GetCash from "./GetCash";
import FaqSection from "./FaqSection";

const LoanAgainstMF = () => {
  const [show, SetShow] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageurl, setPageurl] = React.useState();
  const [utmSource, setUtmSource] = useState(26);
  const [tagval, setTagval] = useState(null);
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
  React.useEffect(() => {
    document.body.classList.add('MainDivRemove');

  }, []);
  return (
    <Fullpage>
      <div style={{ backgroundColor: "white", overflow: "hidden" }}>
        <LandingHeaderSection />
        <FeatureSection />
        <GetCash />
        <FaqSection />
      </div>
    </Fullpage>
  );
}

export default LoanAgainstMF;
