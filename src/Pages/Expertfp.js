import React, { useEffect, useRef, useState } from "react";
import Styles from "./Expertfp.module.css";
import HideHeader from "../components/HideHeader";
import HideFooter from "../components/HideFooter";
import { Link } from "react-router-dom";
import FintooCheckbox from "../components/FintooCheckbox/FintooCheckbox";
import {
  apiCall,
  fetchData,
  fetchEncryptData,
  getItemLocal,
  getParentUserId,
  getUserId,
  loginRedirectGuest,
  setItemLocal,
} from "../common_utilities";
import {
  BASE_API_URL,
  DATA_BELONGS_TO,
  imagePath,
} from "../constants";
import FintooLoader from "../components/FintooLoader";
import { Fp_Expert, Get_Expert_Fp_Document, Sign_Desk_Api, Sign_Desk_Api_Check } from "../FrappeIntegration-Services/services/financial-planning-api/fpagreementapi";
import { check_all_status_api, fetchUserProfileDetails, updateOpportunityStatus } from "../FrappeIntegration-Services/services/user-management-api/userApiService";
function Expertfp() {
  const [termsError, setTermsMsg] = useState("");
  const [terms, setTerms] = useState("");
  const [fpData, setFpData] = useState("");
  const [sessiondata, setSessionData] = useState({});
  const [signDeskResponse, setSignDeskResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [plan_uuid, setPlanuuid] = useState("");
  const session_data = useRef();

  const user_id = getUserId()

  useEffect(() => {
    // getSessionData();
    if (user_id) {
      handleCheckAllStatus();
    }

  }, []);

  useEffect(() => {
    if (plan_uuid) {
      fetchFpAgreement();
    }
  }, [plan_uuid])

  const handleCheckAllStatus = async () => {
    try {

      const result = await check_all_status_api(getParentUserId());

      if (result?.status_code === "200") {
        const {
          plan_uuid
        } = result?.data;
        setPlanuuid(plan_uuid);
      } else {
        console.error("Status check failed:", result?.message);
      }

    } catch (error) {
      console.error("Error checking user status:", error);
    }
  };

  useEffect(() => {
    if (
      sessiondata["fp_lifecycle_status"] != "1" &&
      (sessiondata["fp_plan_type"] == "8" || sessiondata["fp_plan_type"] == "6")
    ) {
      setIsLoading(false);
      window.location.href = BASE_API_URL + "datagathering/about-you/";
    }
  }, [sessiondata]);

  const getSessionData = async () => {
    try {
      let url = '';
      // let url = CHECK_SESSION;
      let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

      session_data.current = await apiCall(url, data, true, false);
      if (session_data.current.error_code == "102") {
        loginRedirectGuest();
      } else {
        setSessionData(session_data.current.data);
        fetchFpAgreement(session_data.current.data);
      }
    } catch (e) {
      console.log("err", e);
    }
  };

  const fetchFpAgreement = async () => {
    try {
      const response = await Fp_Expert(user_id, plan_uuid)

      if (response.status_code == "200") {
        setFpData(response.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        window.location.href = process.env.PUBLIC_URL + "/commondashboard/";
      }
    } catch (e) {
      console.log("err", e);
    }
  };

  const handleCheckboxClick = (e) => {
    if (e.target.checked == false) {
      setTermsMsg("Please agree to proceed");
    } else {
      setTermsMsg("");
    }
    setTerms(e.target.checked);
  };

  const proceedSignature = async () => {
    if (terms == true && termsError == "") {
      try {
        setIsLoading(true);

        let response = await Get_Expert_Fp_Document(user_id, plan_uuid)
        if (response.status_code == "200") {
          var b64FileString = response.data?.b64_file_string;

          const payload = {
            user_id: getParentUserId(),
            file_content: b64FileString,
            is_expert: plan_uuid == "fp_robo" ? false : true
          }

          const signDeskResponse = await Sign_Desk_Api(payload)

          if (signDeskResponse.status_code == "200") {

            setSignDeskResponse(signDeskResponse["data"]);
            let widgetURL =
              signDeskResponse["data"]["signer_info"][0]["invitation_link"];

            const openInWidgetWindow = (url) => {
              const widgetWindow = window.open(url, "widgetWindow", "width=1080,height=840");

              let hasReceived200 = false;

              const checkStatusInterval = setInterval(async () => {
                const checkResponse = await Sign_Desk_Api_Check(payload.user_id);

                if (checkResponse.status_code === "200") {
                  hasReceived200 = true;
                  clearInterval(checkStatusInterval);
                  clearTimeout(timeoutHandler);
                  widgetWindow.close();
                  setItemLocal("generate_report", 1);
                  const result = await check_all_status_api(getParentUserId());

                  if (result?.status_code === "200") {
                    const {
                      nda_sign_check,
                      data_gethering_check,
                      report_check,
                      plan_is_expired,
                      plan_uuid,
                      opportunity_id
                    } = result.data;

                    setItemLocal("ndasignstatus", nda_sign_check);
                    setItemLocal("datagatheringstatus", data_gethering_check);
                    setItemLocal("reportstatus", report_check);
                    setItemLocal("plan_is_expired", plan_is_expired);
                    setItemLocal("plan_uuid", plan_uuid);
                    setItemLocal("opportunity_id", opportunity_id);

                    if (plan_uuid == "fp_expert") {
                      let fpUserData = await fetchUserProfileDetails(getParentUserId(), DATA_BELONGS_TO)
                      const fpuserData = fpUserData?.status_code === 200 && fpUserData.data ? fpUserData.data : [];
                      if (fpuserData) {
                        let payload = {
                          "party_name": fpuserData.user_lead_id || "",
                          "opportunity_id": opportunity_id,
                          "custom_opportunity_status": "FP Agreement Signed"
                        }
                        var config_pfs = await updateOpportunityStatus(payload)
                      }
                    }
                  }

                  window.location.href = process.env.PUBLIC_URL + "/report/intro";
                }
              }, 5000); // every 5 seconds

              // Timeout after 2 minute
              const TWO_MINUTES = 2 * 60 * 1000;

              const timeoutHandler = setTimeout(() => {
                if (!hasReceived200) {
                  clearInterval(checkStatusInterval);
                  widgetWindow.close();
                  window.location.href = process.env.PUBLIC_URL + "/datagathering/about-you";
                }
              }, TWO_MINUTES);
            };

            openInWidgetWindow(widgetURL);
          } else {
            console.log("Error has occurred.", signDeskResponse);
            // toastr.error((response.data['message']));
            // window.location.href = '/datagathering/about-you';
          }
        } else {
          console.log("Error has occurred.", response);
          if (response["error_code"] == 103) {
            //console.log(response["data"]);
          }
          setIsLoading(false);
        }
      } catch (err) {
        setIsLoading(false);
        console.log(err);
      }
    } else {
      setTermsMsg("Please agree to proceed");
      setTerms(!terms);
    }
  };

  const updateLifecycleStatus = async (step, fp_log_id) => {
    try {
      var config = {
        method: "POST",
        url: '',
        data: {
          step: step,
          fp_log_id: fp_log_id,
        },
      };
      let response = await fetchData(config);
      if (response["error_code"] == "100") {

      } else {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <HideHeader />
      <FintooLoader isLoading={isLoading} />
      <div className={`${Styles.backgrounddiv}`}>
        <div className={`${Styles.expertfp}`}></div>
      </div>
      <div className={`${Styles.whitebox}`}>
        <div className="container-fluid">
          <div>
            <Link to={process.env.PUBLIC_URL + "/datagathering/about-you"}>
              <div className={`${Styles.backarrow}`}>
                <img
                  src={imagePath + "/static/media/Images/icons/back-arrow.svg"}
                />
              </div>
            </Link>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="row justify-content-center">
                <div className="col-md-10 mt-5 h-100">
                  <div className="h-100 mt-5">
                    <p
                      className={`${Styles.fpcontent}`}
                      dangerouslySetInnerHTML={{
                        __html: fpData ? fpData : "",
                      }}
                    ></p>
                  </div>
                  {/*  */}

                  <div
                    className=" checkbox-container position-relative"
                    style={{ margin: "4rem 0px 0px" }}
                  >
                    <input
                      type="checkbox"
                      tabIndex="1"
                      className="custom-checkbox"
                      onClick={handleCheckboxClick}
                    />
                    <label
                      for="rememberMe"
                      // className="checkbox-label"
                      style={{
                        paddingTop: "2px",
                        fontWeight: "500",
                        fontSize: "15px",
                      }}
                    >
                      I Agree to the terms and conditions
                    </label>
                    <span className="error">{termsError}</span>
                  </div>
                  <button
                    type={"button"}
                    onClick={proceedSignature}
                    className={`${Styles.Proceedbtn}`}
                  >
                    Proceed to Signature
                  </button>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HideFooter />
    </>
  );
}

export default Expertfp;
