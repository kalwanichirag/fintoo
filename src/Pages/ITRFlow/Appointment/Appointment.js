import React, { useState, useEffect } from "react";
import styles from "./style.module.css";

import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/logo.svg";
import Confirm from "../images/Confirm.png";
import commonEncode from "../../../commonEncode";
import AppointmentBox from "../../../components/Pages/Calendly/ITRindex";
import ApplyWhiteBg from "../../../components/ApplyWhiteBg";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import {
  getUserId,
  loginRedirectGuest,
  getItemLocal,
  getCookieData,
} from "../../../common_utilities";
import { useDispatch } from "react-redux";
function Appointment() {
  const [value, setvalue] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (getUserId() == null) {
      loginRedirectGuest();
      return;
    }

    if (getItemLocal("sc") == 1) {
      navigate(process.env.PUBLIC_URL + "/itr-thank-you");
      return;
    }

    if (localStorage.getItem("pid") == null) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Select plan before proceed.", type: "error" },
      });
      navigate(process.env.PUBLIC_URL + "/itr-file");
      return;
    }
    document.body.classList.add("bg-color");
    setvalue(JSON.parse(commonEncode.decrypt(localStorage.getItem("pid"))));
    return () => {
      document.body.classList.remove("bg-color");
    };
  }, []);

  useEffect(() => {
    if (getUserId() == null) return;
    if (window.location.host.indexOf("fintoo.ae") > -1) {
      if (value.plan_id == 39) {
        setUrl(
          "https://calendly.com/d/cpv4-znn-b6m/60min-live-itr-filing?hide_event_type_details=1&hide_gdpr_banner=1%22"
        );
      } else if (value.plan_id == 40) {
        setUrl(
          "https://calendly.com/d/cpv4-znn-b6m/60min-live-itr-filing?hide_event_type_details=1&hide_gdpr_banner=1%22"
        );
      } else if (value.plan_id == 41) {
        setUrl(
          "https://calendly.com/d/cpv4-znn-b6m/60min-live-itr-filing?hide_event_type_details=1&hide_gdpr_banner=1%22"
        );
      } else if (value.plan_id == 42) {
        setUrl(
          "https://calendly.com/d/cpv4-znn-b6m/60min-live-itr-filing?hide_event_type_details=1&hide_gdpr_banner=1%22"
        );
      } else {
        setUrl(" ");
      }
    } else {
      if (getCookieData("itr-page")) {
        setUrl(
          "https://calendly.com/d/crvg-zyp-prd/itr-filling"
        );
      } else {
        setUrl(
          "https://calendly.com/d/crvg-zyp-prd/itr-filling"
        );
      }
    }
  }, [value]);

  return (
    <>
      <HideFooter />
      <HideHeader />
      <ApplyWhiteBg />

      <div className={`${styles.PlanSubscription}`}>
        <section className={`${styles.Appointment_section}`}>
          <div className="container-fluid">
            <div className="row ">
              <div className="col-md-6 col-12">
                <div className={`${styles.Appointment_section_block}`}>
                  <div className="d-flex justify-content-center">
                    <img src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="fintoo logo" />
                  </div>
                  <h2 className={`text-center ${styles.page_header}`}>
                    Schedule Appointment
                  </h2>
                  <p className={`text-center ${styles.page_subTxt}`}>
                    Tax Filing | {value.plan_name}
                  </p>
                </div>

                <div className={` ${styles.AppointmentFrame}`}>
                  <div className="">
                    <AppointmentBox
                      eventCode={"ITR_2025"}
                      serviceName="income_tax_filing"
                      eventUrl={url}
                      plan_id= {value.plan_id}
                      extraParams={{
                        tagval:
                          window.location.host.indexOf("fintoo.ae") > -1
                            ? "incomeslab"
                            : "itr_filing_2025",
                        service:
                          window.location.host.indexOf("fintoo.ae") > -1
                            ? "34"
                            : "91",
                        // service: '34',
                        utm_source: "26",
                        rm_id: 96,
                        skip_mail: "1",
                        comment:
                          window.location.host.indexOf("fintoo.ae") > -1
                            ? "UAE filing 2023"
                            : "ITR filing 2025",
                        tags:
                          window.location.host.indexOf("fintoo.ae") > -1
                            ? "ITR_2025_LandingPage_UAE"
                            : "itr_filing_2025",
                        itr: "itr",
                        // plan_id : value.plan_id,
                        plan_name: value.plan_name,
                      }}
                    />
                  </div>
                </div>
                <div className={`d-none ${styles.AppointmentConfirmFrame}`}>
                  <div className={` ${styles.Confirmed}`}>
                    <div className={`${styles.confirmBox}`}>
                      <div className="d-flex justify-content-center">
                        <img src={Confirm} />
                      </div>
                      <div className="mt-5">
                        <p> Confirmed </p>
                      </div>
                      <div className="mt-4">You are Scheduled with fintoo.</div>
                      <div className="mt-4">Redirecting....</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`col-6 h100 ${styles.login_illustration}`}></div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Appointment;
