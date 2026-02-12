import React, { useState, useEffect } from "react";
import Logo from "../images/logo.svg";
import AskFintoo from "../images/AskFintoo.png";
import Andriod from "../images/Anroid.png";
import style from "./style.module.css";

import { useSearchParams } from "react-router-dom";
import ApplyWhiteBg from "../../../components/ApplyWhiteBg";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import {
  getUserId,
  loginRedirectGuest,
  getParentUserId,
  apiCall,
  getItemLocal,
  setItemLocal,
} from "../../../common_utilities";
import {} from "../../../constants";
import { Link } from "react-router-dom";

function ITRThankyou() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [updatedCFS, setUpdatedCFS] = useState(false);

  window.history.pushState(null, null, window.location.href);
  window.addEventListener("popstate", function (event) {
    window.location.replace(`${process.env.PUBLIC_URL}/itr-file`);
  });

  useEffect(() => {
    document.body.classList.add("bg-color");
    setItemLocal("sc", 1);
    onLoatIntit();
    return () => {
      document.body.classList.remove("bg-color");
    };
  }, []);

  const scheduleAppointment = async () => {
    try {
      let url = TAX_SCHEDULE_APPOINTMENT;
      let data = { user_id: getUserId() };
      let resp = await apiCall(url, data);
      if (resp["error_code"] == "100") {
        //pass
      } else {
        console.error("error");
      }
    } catch (e) {
      console.error("error -> ", e);
    }
  };

  const onLoatIntit = async () => {
    // try {
    //   if (!updatedCFS) {
    //     let plan_data = getItemLocal("pd");
    //     if (plan_data) {
    //       plan_data["itr_only"] = "1";
    //       plan_data["current_filing_status"] = "4";
    //       let url = TAX_UPDATE_USER_DETAILS_API_URL;
    //       let resp_data = await apiCall(url, plan_data);
    //       if (resp_data["error_code"] == "100") {
    //         setUpdatedCFS(true);
    //       }
    //     }
    //   }
    // } catch {}
    scheduleAppointment();
  };

  return (
    <>
      <HideFooter />
      <HideHeader />
      <ApplyWhiteBg />

      <div className={`${style.ITRthankyousection}`}>
        <div className="container-fluid">
          <div className={`row ${style.ITRReverseRow}`}>
            <div className="col-12 col-md-6 mt-5">
              <div className="d-flex justify-content-center">
                <a href={`${process.env.PUBLIC_URL}/`}>
                  <>
                    {/* {searchParams.get("country") == "UAE" ? ( */}
                      <img
                        style={{ width: "500px" }}
                        src={
                          process.env.PUBLIC_URL +
                          "/static/media/Fintoo_vita_logo.png"
                        }
                      />
                    {/* ) : ( */}
                      <img className={`${style.logo}`} src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="Fintoo Logo" />
                    {/* )} */}
                  </>
                </a>
              </div>
              <div className="d-flex justify-content-center">
                <p className={`${style.text}`}>Thank You!</p>
              </div>
              <div className={`text-center ${style.thankyoupara}`}>
                <p>
                  We are happy that you trusted our expertise for your tax
                  filing. We hope that we were able to make your tax filing
                  easier, quicker and stress-free.{" "}
                </p>
              </div>
              <div className={`text-center ${style.thankyoupara}`}>
                <p>
                  When you are so particular about tax optimisation and tax
                  saving, why not focus on 360-degree financial planning for
                  lifelong financial independence? Therefore, we are inviting
                  you to:
                </p>
              </div>
              <div className="mb-5 mt-5 d-flex justify-content-center">
                <a
                  href={`${process.env.PUBLIC_URL}/`}
                  className={`${style.exploreBtn} `}
                >
                  Explore Our Other Services
                </a>
              </div>
              <div className={`${style.BottomSection}`}>
                <div className={`${style.AskFintoo}`}>
                  <img src={AskFintoo} />
                </div>
                <div className={`${style.AppSection}`}>
                  <div className={`text-center ${style.textApp}`}>
                    Download the app
                  </div>
                  <div className="d-flex">
                    <div className="">
                      <img width={50} src={Andriod} />
                      <a href="https://play.google.com/store/apps/details?id=com.financialhospital.admin.finh">
                        <img
                          width={130}
                          src="https://images.minty.co.in/web/static/media/footer/minty-android-app.png"
                        />
                      </a>
                    </div>
                    <div className={`${style.Hrline}`}></div>
                    <div className=" ps-sm-4 ms-5">
                      <img className="" width={50} src={Andriod} />
                      <a href="https://apps.apple.com/in/app/fintoo/id1339092462">
                        <img
                          width={130}
                          src="https://images.minty.co.in/web/static/media/footer/minty-app-store.png"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`col-12 col-md-6 h100 ${style.login_illustration}`}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ITRThankyou;
