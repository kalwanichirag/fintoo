import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { Buffer } from "buffer";

function ITRNewThankyou() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [updatedCFS, setUpdatedCFS] = useState(false);

  const approveComputation = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const itrId = Buffer.from(urlParams.get('itr_id'), "base64").toString("ascii");
    const userId = Buffer.from(urlParams.get('user_id'), "base64").toString("ascii");
    const rmId = Buffer.from(urlParams.get('rm_id'), "base64").toString("ascii");
    
    let data = {"user_id":userId, "emp_id":rmId, "itr_id":itrId};
    let url = TAX_APPROVE_COMPUTATION;
    let resp_data = await apiCall(url, data);
    if (resp_data['error_code'] != "100") {
      console.error("ERROR! SOMETHING WENT WRONG!!");
    }
  }

  window.history.pushState(null, null, window.location.href);
  window.addEventListener("popstate", function (event) {
    window.location.replace(`${process.env.PUBLIC_URL}/itr-file`);
  });

  useEffect(() => {
    document.body.classList.add("bg-color");
    onLoatIntit();
    approveComputation();
    return () => {
      document.body.classList.remove("bg-color");
    };
  }, []);

  const onLoatIntit = async () => {
    // try {
    //   if (!updatedCFS){
    //     let plan_data = getItemLocal("pd");
    //     if (plan_data){
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
  }


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
                {searchParams.get("country") == "UAE" ? (
                  <img
                    style={{ width: "500px" }}
                    src={
                      process.env.PUBLIC_URL +
                      "/static/media/Fintoo_vita_logo.png"
                    }
                  />
                ) : (
                  <img className={`${style.logo}`} src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="Fintoo Logo"/>
                )}
              </div>
              <br/><br/>
              <div className="d-flex justify-content-center">
                
                <p className={`${style.text}`}>Thank You!</p>
              </div>
              <div className={`text-center ${style.thankyoupara}`}>
                <br/><br/>
                <p>Thank you for approving computation. We will continue your ITR process.</p>
                <br/><br/><br/>
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

export default ITRNewThankyou;
