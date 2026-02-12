import React, { useState } from "react";
import commonEncode from "../../commonEncode";
import { apiCall, getItemLocal, getParentUserId } from "../../common_utilities";
import Poppimg from "../Assets/Dashboard/PopupImg.jpeg";
import { Modal } from "react-bootstrap";

const RenewPopup = (props) => {
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const userid = getParentUserId();

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const renew = async () => {
    // try {
    //   let url = CHECK_SESSION;
    //   let data = { user_id: userid, sky: getItemLocal("sky") };
    //   let session_data = await apiCall(url, data, true, false);
    //   let api_data = {
    //     user_id: session_data["data"]["id"],
    //     fp_log_id: session_data["data"]["fp_log_id"],
    //   };
    //   var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
    //   var cart_data = await apiCall(
    //     ADVISORY_CART_DATA_RENEW_API_URL,
    //     payload_data,
    //     false,
    //     false
    //   );
    //   var res = JSON.parse(commonEncode.decrypt(cart_data));
    //   if (res["error_code"] == "100") {
    //     if (session_data["data"]["plan_id"] == 31) {
    //       let getexpertpayment = await apiCall(
    //         ADVISORY_EXPERT_PAYMENT +
    //           "?fp_log_id=" +
    //           session_data["data"]["fp_log_id"] +
    //           "&user_id=" +
    //           session_data["data"]["id"],
    //         "",
    //         false,
    //         false
    //       );
    //       if (getexpertpayment["error_code"] == "100") {
    //         if (getexpertpayment["message"] == "Contact Your RM") {
    //           setShow(true);
    //         } else {
    //           var options = {
    //             rzp_test_jMQKjxtY0nGGqJ: "WrEvgiywMPJYbshGWAsCBlaq", // Enter the Key ID generated from the Dashboard
    //             amount: getexpertpayment["data"]["amount"] * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    //             // "recurring":true,
    //             currency: "INR",
    //             name: "Fintoo",
    //             description: "Financial Planning",
    //             image:
    //               "https://stg.minty.co.in/static/userflow/img/fintoo_razor_pay_logo.png",
    //             order_id: getexpertpayment["data"]["fp_cart_id"], //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    //             // "redirect":true,
    //             callback_url: BASE_API_URL + "razor_pay_payment_success/",
    //             // "handler": function (response){
    //             // alert(response.razorpay_payment_id);
    //             // alert(response.razorpay_order_id);
    //             // alert(response.razorpay_signature)
    //             // alert(response.notes)
    //             // },
    //             prefill: {
    //               name: session_data["data"]["user_details"]["first_name"],
    //               email: session_data["data"]["user_details"]["email"],
    //               contact:
    //                 session_data["data"]["user_details"]["mobile"].toString(),
    //             },
    //             notes: {
    //               address:
    //                 "Fintoo Wealth Private Limited B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059]",
    //             },
    //             theme: {
    //               color: "#042b62",
    //             },
    //             readonly: {
    //               contact: true,
    //               email: true,
    //               name: true,
    //             },
    //             config: {
    //               display: {
    //                 hide: [
    //                   {
    //                     method: "paylater",
    //                   },
    //                 ],
    //               },
    //             },
    //           };
    //           const loadrzrpay = await loadRazorpayScript(
    //             "https://checkout.razorpay.com/v1/checkout.js"
    //           );

    //           var rzp1 = new window.Razorpay(options);
    //           rzp1.open();
    //           rzp1.on("payment.failed", function (response) {
    //             var failure_payload = commonEncode.encrypt(
    //               JSON.stringify({
    //                 razorpay_order_id: response.error.metadata.order_id,
    //                 razorpay_payment_id: response.error.metadata.payment_id,
    //               })
    //             );

    //             let res2 = apiCall(
    //               ADVISORY_PAYMENT_FAILURE,
    //               failure_payload,
    //               false,
    //               false
    //             );
    //             let decoded_res = JSON.parse(commonEncode.decrypt(res2));
    //             if (decoded_res) {
    //               window.location.href = BASE_API_URL + "payment_failure/";
    //             }
    //           });
    //         }
    //       }
    //     } else {
    //       var updatesession_data = { plan_payment_status: 6 };
    //       var res = await apiCall(
    //         ADVISORY_UPDATE_AUTH_DATA_API_URL,
    //         updatesession_data,
    //         false,
    //         false
    //       );
    //       if (session_data["data"]["fp_plan_sub_cat"] == 2) {
    //         window.location.href = process.env.PUBLIC_URL + "/userflow/payment/";
    //       } else {
    //         window.location.href = process.env.PUBLIC_URL + "/pricing/";
    //       }
    //     }
    //   }
    // } catch (e) {
    //   setError(true);
    // }
  };
  return (
    <>
      {(props.open === true || props.show === true) && (
        <>
          <div className="PopupImg">
            <img src={Poppimg} />
          </div>
          {show ? (
            <>
              <div className="p-2">
                <p className="PopupContent">
                  In order to enhance your experience, we have updated some of
                  our payment terms. Please contact your dedicated Wealth
                  Manager for more information.
                </p>
                <div className="ButtonBx">
                  <button className="ReNew custom-background-color" onClick={props.onClose}>
                    Ok
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-2">
                <p className="PopupContent">
                  Your Financial Planning Subscription with Fintoo which was due
                  for renewal on <b>"{props.subscriptionenddate}"</b> has now
                  expired. We request you to re-activate your subscription to
                  continue your journey towards financial growth with Fintoo.
                </p>
                <div className="ButtonBx align-items-center">
                  <button className="ReNew custom-background-color" onClick={renew}>
                    Renew Now
                  </button>
                  <div className="SkipBtn" onClick={props.onClose}>
                    Skip &gt;
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* <Modal centered show={show} onHide={()=> {
                setShow(false);

            }}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
        <div className="PopupImg">
            <img src={Poppimg} />
          </div>
          <div className="p-2">
            <p className="PopupContent">
            In order to enhance your experience, we have updated some of our payment terms. Please contact your dedicated Wealth Manager for more information.
            </p>
            <div className="ButtonBx">
              <button className="ReNew" onClick={props.onClose}>
                Ok
              </button>
             
            </div>
          </div>
           
        </Modal.Body>
      </Modal> */}
    </>
  );
};

export default RenewPopup;
