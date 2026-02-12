import React, { useState, useEffect } from "react";
import styles from "./fhc.module.css";
import HideHeader from "../../components/HideHeader";
import HideFooter from "../../components/HideFooter";
import ApplyWhiteBg from "../../components/ApplyWhiteBg";
import Fhcheader from "../../components/FHC/FHCheader/Fhcheader";
import Fhctopsection from "../../components/FHC/Fhctopsection/Fhctopsection";
import Membershiporg from "../../components/FHC/Membershiporg";
import Howitsworks from "../../components/FHC/Howitsworks";
import ClientTestimonial from "../../components/HTML/ClientTestimonial";
import UAEFooter from "../../components/HTML/Footer/UAEFooter";
import WhatExpect from "../../components/FHC/WhatExpect";
import { apiCall, getItemLocal, getParentUserId } from "../../common_utilities";
import commonEncode from "../../commonEncode";
import { Buffer } from "buffer";
import ScrollToTop from "../../components/HTML/ScrollToTop";

function FHC() {
  useEffect(() => {
    document.body.classList.remove('bgImagClass', 'login-demo');
    document.body.classList.add('fhcpage');
    return function cleanup() {
      document.body.classList.add('bgImagClass', 'login-demo');
      document.body.classList.remove('fhcpage');
    };
  }, []);

  const redirectToLogin = async (src = "dmf") => {
    if (
      getItemLocal("fhc") &&
      getItemLocal("dXNlcmlk") &&
      getItemLocal("sky")
    ) {
      let user_id = getParentUserId();
      let session_key = getItemLocal("sky");
      var redirect_url = "/commondashboard";
      // let url = CHECK_SESSION;
      // let data = { user_id: user_id, sky: session_key };
      // let session_data = await apiCall(url, data, true, false);
      // if (session_data["error_code"] == "100") {
      //   let fpLifecycleStatus = session_data["data"]["fp_lifecycle_status"];
      //   fpLifecycleStatus = fpLifecycleStatus ? fpLifecycleStatus : 0;
      //   if (fpLifecycleStatus == 0 || fpLifecycleStatus == "") {
      //     let url = ADVISORY_GET_PRICINGDETAILS_API_URL;
      //     let pricing_data = await apiCall(url, "", false, false);
      //     if (pricing_data["error_code"] == "100") {
      //       pricing_data =
      //         pricing_data["data"]["plan_details"]["plandetails"];
      //       let pricingData = pricing_data.filter(
      //         (data) => data.plan_id == 29
      //       );
      //       pricingData = pricingData[0];
      //       var amount = 0;
      //       if (
      //         pricingData.amount.isquaterly == 0 &&
      //         pricingData.amount.total != "custom"
      //       ) {
      //         amount = parseInt(pricingData.amount.total);
      //       } else {
      //         amount = pricingData.amount.Q1;
      //       }
      //       let cartdatatosend = {
      //         user_id: parseInt(user_id),
      //         plan_id: pricingData.plan_id,
      //         plan_sub_cat_id: pricingData.id,
      //         amount: amount,
      //         subscription_freq: pricingData.payment_frequency,
      //       };
      //       let url = ADVISORY_ADDTOCART_API_URL;
      //       let cart_data = await apiCall(url, cartdatatosend, true, false);
      //       if (cart_data.error_code == "100") {
      //         redirect_url = "/userflow/payment";
      //       }
      //     }
      //   }
      // }
      let redUri =
        process.env.PUBLIC_URL +
        "/checkredirect?redirect=" +
        process.env.PUBLIC_URL +
        redirect_url;
      let sky = session_key;
      let auth1 = commonEncode.encrypt(
        "" + JSON.stringify(parseInt(user_id)) + "|" + sky
      );
      let auth = btoa(auth1);
      let redAuth = redUri ? "" + redUri + "/?auth=" + auth : "?auth=" + auth;
      window.location.href = redAuth;
      return;
    } else {
      localStorage.removeItem("fhc");
      localStorage.removeItem("dXNlcmlk");
      localStorage.removeItem("sky");
      let urlParams = new URLSearchParams(window.location.search);
      let utm_source = urlParams.get('utm_source');
      let utm_campaign = urlParams.get('utm_campaign');
      let tags = urlParams.get('tags');
      const FHCKey = "1";
      const t = window.location.origin + "/userflow/payment";
      var redirectURL =
        window.location.origin +
        process.env.PUBLIC_URL +
        "/checkredirect?redirect=" +
        encodeURI(t);
      let loginUrl =
        process.env.PUBLIC_URL +
        "/register/?src=" +
        Buffer.from(commonEncode.encrypt(src)).toString("base64") +
        "&redirect_uri=" +
        Buffer.from(commonEncode.encrypt(redirectURL)).toString("base64") +
        "&fhc=" +
        Buffer.from(commonEncode.encrypt(FHCKey)).toString("base64");
      if (utm_source) {
        loginUrl += "&utm_source=" + Buffer.from(utm_source);
      }

      if (utm_campaign) {
        loginUrl += "&utm_campaign=" + Buffer.from(utm_campaign);
      }

      if (tags) {
        loginUrl += "&tags=" + Buffer.from(tags);
      }
      window.location = loginUrl;
    }
  };

  return (
    <>
      <ApplyWhiteBg />
      <HideHeader />
      <HideFooter />
      <div className="fhcSection">
        <Fhcheader redirectToLogin={redirectToLogin} />
        <Fhctopsection />
        <div className={`${styles.Membershiporg}`}>
          <Membershiporg />
        </div>
        <Howitsworks redirectToLogin={redirectToLogin} />
        <WhatExpect />
      </div>
      <div>
        <ClientTestimonial />
      </div>
      <UAEFooter />
      <ScrollToTop />
    </>
  );
}

export default FHC;