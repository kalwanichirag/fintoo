import React, { useEffect, useState } from "react";
import {
  apiCall,
  fetchData,
  fetchEncryptData,
  getFpLogId,
  setFplogid,
  setItemLocal,
  setUserId,
  storeUserSession
} from "../common_utilities";
import FintooLoader from "../components/FintooLoader";
import { ADVISORY_UPDATE_AUTH_DATA, BASE_API_URL } from "../constants";
import commonEncode from "../commonEncode";
import axios from "axios";

const PaymentSuccessPopup = () => {
  const [responseData, setResponseData] = useState("");
  const [payuResponse, setPayuResponse] = useState("");
  const [flag, setFlag] = useState(0);
  const [userToken, setUserToken] = useState("");
  const [userData, setUserData] = useState("");
  const [url, setUrl] = useState("");
  const [fromCRM, setFromCRM] = useState(0);
  const [loading, setLoading] = useState(false);

  const paymentContinue = async () => {
    try {
      let fp_log_id = await getFpLogId();
      setFplogid(fp_log_id);
    } catch {
      setFplogid("");
    }
    window.location.href = "/web/datagathering/about-you/";
  };

  const redirectToSummary = async (payU_response) => {
    try {
      let fp_log_id = await getFpLogId();
      setFplogid(fp_log_id);
    } catch {
      setFplogid("");
    }
    setLoading(true);
    try {
      let payUData = JSON.parse(payU_response[0]);
      let logId = payUData["fp_log_ids"][0];
      let updatedSessionData = [];
      var res = await apiCall(
        BASE_API_URL +
        "login-to-module/?user_id=" +
        btoa(payUData["user_id"].toString()) +
        "&password=" +
        btoa("Pl62odf39eqi") +
        "&module=expert",
        "",
        false,
        false
      );
      // var res_login = JSON.parse(res.data);
      setItemLocal("sky", res.sky);

      if (res.error_code == "100") {
        var res = await apiCall(
          BASE_API_URL +
          "restapi/userflow/getongoingplan/?user_id=" +
          // btoa(b64encode(payUData["user_id"].toString())) +
          btoa(commonEncode.encrypt(payUData["user_id"].toString())) +
          "&web=1",
          "",
          false,
          false
        );
        var response = JSON.parse(commonEncode.decrypt(res));
        if (response.error_code == "100") {
          response.data.map((r) => {
            if (r["fp_log_id"] == logId) {
              updatedSessionData = r;
            }
          });
          if (updatedSessionData != undefined) {
            // var payload_data  = commonEncode.encrypt(JSON.stringify(updatedSessionData))

            var res_auth = await apiCall(
              BASE_API_URL + "restapi/updateauthdata/",
              updatedSessionData,
              false,
              false
            );
            // var response = JSON.parse(commonEncode.decrypt(res_auth));
            var response;
            try {
              response = JSON.parse(commonEncode.decrypt(res_auth));

            }
            catch {
              response = res_auth;
            }

            try {
              let fp_log_id = await getFpLogId();
              setFplogid(fp_log_id)
            }
            catch {
              setFplogid("")
            }
            setUserId(response.data["user_details"]["user_id"]);

            if (response) {
              window.location = process.env.PUBLIC_URL + "/datagathering/about-you";
            }
          } else {
          }
        }
      } else {
        window.location.href = "/web/datagathering/about-you/";
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const redirecttologin = async () => {
    if (userData && userToken) {
      const queryparam = { "user_data": userData, "token": userToken, "redirect_to": "" }
      await storeUserSession(queryparam)
    }
    else {
      window.location = process.env.PUBLIC_URL + "/login"
    }
  }

  const payUSucessButton = async (payU_response) => {
    localStorage.removeItem("plan_details");
    localStorage.removeItem("rm_id");
    setLoading(true);
    let payUData = JSON.parse(payU_response[0]);
    let amount = JSON.parse(payUData["cart_ids"]["amount"]);
    if (payU_response.length == 2) {
      if (payUData["fp_log_ids"].length > 1) {
        window.location = "/userflow/dashboard-ongoing-plan/";
        setLoading(false);
      } else if (payUData["fp_log_ids"].length == 1) {
        let logId = payUData["fp_log_ids"][0];
        let updatedSessionData = [];
        var res = await apiCall(
          BASE_API_URL +
          "restapi/userflow/getongoingplan/?user_id=" +
          btoa(payUData["user_id"].toString()) +
          "&web=1",
          "",
          false,
          false
        );
        if (res.error_code == "100") {
          res.data.map((r) => {
            if (r["fp_log_id"] == logId) {
              updatedSessionData = r;
            }
          });
          if (updatedSessionData != undefined) {
            try {
              var mail_payload = {
                userdata: {
                  to: "tech.financialhospital@gmail.com",
                },
                subject: "PayU response for details",
                template: JSON.stringify(payU_response),
                contextvar: {},
              };
              var mail_config = {
                method: "POST",
                url: BASE_API_URL + "restapi/sendmail/",
                data: commonEncode.encrypt(JSON.stringify(mail_payload)),
              };
              var mail_res = await axios(mail_config);
              if (mail_res) {
                if (amount["for_quarter"] == 0 || amount["for_quarter"] == 1) {
                  try {
                    let fp_log_id = await getFpLogId();
                    setFplogid(fp_log_id);
                  } catch {
                    setFplogid("");
                  }
                  window.location = "/web/datagathering/about-you/";
                  var f = "Purchased";
                } else {
                  window.location = "/commondashboard/";
                  var f = "Renewed";
                }
                setLoading(false);
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Plan " + f + " Successfully");
              } else {
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    }
    if (payU_response.length === 1) {
      try {
        var mail_payload = {
          userdata: {
            to: email,
          },
          subject: "PayU response for details",
          template: "Lost PayU response",
          contextvar: {},
        };
        var mail_config = {
          method: "POST",
          url: BASE_API_URL + "restapi/sendmail/",
          data: commonEncode.encrypt(JSON.stringify(mail_payload)),
        };
        var mail_res = await axios(mail_config);
        if (mail_res) {
        }
      } catch (error) {
        handleErrorResponse(error);
      }
    }
  };

  const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  function hasQueryParams() {
    return window.location.search.length > 0;
  }

  // function clearQueryParams() {
  //   history.replaceState({}, document.title, window.location.pathname);
  // }

  useEffect(() => {
    if (hasQueryParams()) {
      const encodedResponseData = getQueryParam("response_data");
      const encodedPayuResponse = getQueryParam("payu_response");
      const flag = getQueryParam("flag");
      const url = getQueryParam("url");
      const from_crm = getQueryParam("from_crm");
      const user_token = getQueryParam("token");
      const user_data = getQueryParam("user_data");
      const decodedResponseData = atob(encodedResponseData);
      const decodedPayuResponse = atob(encodedPayuResponse);
      setResponseData(decodedResponseData);
      setPayuResponse(decodedPayuResponse);
      setUserData(user_data);
      setUserToken(user_token);
      setFlag(flag);
      setUrl(url);
      setFromCRM(from_crm);
    }
  }, []);

  return (
    <div className="white-modal fn-redeem-modal">
      <div
        className="popup payment-popup schedule-meeting-popup active"
        id="payment"
      >
        <FintooLoader isLoading={loading} />
        <div className="popup-container" style={{ overflow: "visible" }}>
          <div className="popup-wrapper text-center">
            <div className="header-box popupHeaderimg popup-header d-flex justify-content-center">
              <img
                src="https://static.fintoo.in/static/userflow/img/popup/pop-up-tick.svg"
                className="popup-img "
                alt="Popup Header"
              />
            </div>
            <div className="popup-body payment-popupbody">
              <div className="offer-content">
                <div className="row justify-content-center">
                  <div className="col-md-12 mb-3">
                    <div className="popup-illustration">
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/payment-success-popup.svg"
                        }
                        className="mb-4 payment_success_img"
                        alt="Payment Success Illustration"
                      />
                    </div>
                    <h2 className="mt-0 mb-0">
                      <span style={{ color: "#042b62" }} className="pink-link">Payment Successful!</span>
                    </h2>
                  </div>
                </div>
                {flag === 1 ? (
                  <>
                    <p>
                      Thank You For Completing The Payment Process! We have sent
                      the invoice on your email. Now, your dedicated Wealth
                      Manager will contact you and share your Financial Planning
                      Reports with you once the payment gets realized.
                    </p>
                    <button
                      className="outline-btn popup-green-btn d-block"
                      onClick={() => {
                        redirectToSummary([responseData, payuResponse]);
                      }}
                      type="button"
                    >
                      Continue
                    </button>
                  </>
                ) : fromCRM === "1" ? (
                  <button
                    className="outline-btn popup-green-btn d-block"
                    onClick={() => {
                      // redirectToSummary([responseData, payuResponse]);
                      redirecttologin()
                    }}
                    type="button"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    className="outline-btn popup-green-btn d-block"
                    onClick={() => {
                      payUSucessButton([responseData, payuResponse]);
                    }}
                    type="button"
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPopup;
