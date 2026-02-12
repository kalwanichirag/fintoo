import React, { useEffect, useState } from "react";
import { sendMail } from "../FrappeIntegration-Services/services/user-management-api/userApiService";

const PaymentFailurePopup = () => {
  const [response, setResponse] = useState("");
  const [flag, setFlag] = useState(0);
  const [fromcrm, setFromCrm] = useState(0);
  const [url, setUrl] = useState("");
  const redirecttoPayment = (url) => {
    window.location.href = url;
  };

   const redirecttologin=()=>{
    window.location = process.env.PUBLIC_URL + "/login"
  }

  const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  const hasQueryParams = () => {
    return window.location.search.length > 0;
  };

  const failurfunction = async () => {
    window.location.href = "/pricing";
    // if (error_response) {
    //   try {
    //     var mail_payload = {
    //       userdata: {
    //         to: "tech.financialhospital@gmail.com",
    //       },
    //       subject: "Error occured during payment for details",
    //       template: JSON.stringify(error_response),
    //       contextvar: {},
    //     };
    //     // var mail_config = {
    //     //   method: "POST",
    //     //   url: BASE_API_URL + "restapi/sendmail/",
    //     //   data: commonEncode.encrypt(JSON.stringify(mail_payload)),
    //     // };
    //     var mail_res = await sendMail(mail_payload);
    //     if (mail_res) {
    //       window.location.href = "/pricing";
    //     } else {
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // } else {
    //   window.location.href = "/pricing";
    // }
  };

  useEffect(() => {
    if (hasQueryParams()) {
      const encodedResponse = getQueryParam("response_data");
      const flag = getQueryParam("flag");
      const url = getQueryParam("url");
      const from_crm = getQueryParam("from_crm");
      const decodedResponse = atob(encodedResponse);
      setResponse(decodedResponse);
      setFlag(flag);
      setUrl(url);
      setFromCrm(from_crm)
    }
  }, []);

  return (
    <div className="white-modal fn-redeem-modal">
      <div
        className="popup payment-popup schedule-meeting-popup active"
        id="payment"
      >
        <div className="popup-container" style={{ overflow: "visible" }}>
          <div className="popup-wrapper text-center">
            <div className="header-box popupHeaderimg popup-header d-flex justify-content-center">
              <img
              src={
                process.env.REACT_APP_STATIC_URL +
                "media/unsucesfull.svg"
              }
                className="popup-img "
                alt="Popup Header"
              />
            </div>
            <div className="popup-body payment-popupbody paymentfail-popupbody">
              <div className="offer-content">
                <div className="row justify-content-center">
                  <div className="col-md-12 mb-3">
                    <div className="popup-illustration">
                      <img
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/unsuccessful-payment.svg"
                        }
                        className="mb-4 payment_success_img"
                        alt="Payment Success Illustration"
                      />
                    </div>
                    <h2 className="mt-0 mb-0">
                      <span style={{color : "#042b62"}} className="pink-link">Payment Failure!</span>
                    </h2>
                  </div>
                </div>
                {flag === 1 ? (
                  <button
                    className="outline-btn popup-green-btn d-block"
                    onClick={() => redirecttoPayment(url)}
                    type="button"
                  >
                    Continue
                  </button>
                ) : fromcrm === "1" ? (
                  <button
                    className="popup-green-btn  green-btn d-block"
                    onClick={() =>  redirecttologin()}
                    type="button"
                  >
                    Continue
                  </button>
                ):(
                  <button
                    className="popup-green-btn  green-btn d-block"
                    onClick={() => failurfunction()}
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

export default PaymentFailurePopup;
