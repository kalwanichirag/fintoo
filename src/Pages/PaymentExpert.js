import { useState, useEffect } from "react";
import { apiCall} from "../common_utilities";
import FintooLoader from "../components/FintooLoader";
import '../checkboxstyle.css';
import { BASE_API_URL} from "../constants";
import axios from "axios";
import commonEncode from '../commonEncode';
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import HideHeader from "../components/HideHeader";
import HideFooter from "../components/HideFooter";

const PaymentExpertPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    document.body.classList.add("main-layout");
    // var login_img = imagePath + "https://static.fintoo.in/static/userflow/img/login-illustration.svg";

    // setLoginImage(login_img);
  }, []);

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

  useEffect(() => {
    if (hasQueryParams()) {
      const user_id = getQueryParam("user_id");
      const cart_id = getQueryParam("cart_id");
      const amount = getQueryParam("amount");
      const fp_user_log = getQueryParam("fp_user_log");
      const rm_id = getQueryParam("rm_id");
      const plan_sub_cat = getQueryParam("plan_sub_cat");
      const from_crm = getQueryParam("from_crm");
      const for_quarter = getQueryParam("for_quarter");
      const subscription_months = getQueryParam("subscription_months");
      // const aua_per = getQueryParam("aua_per");
      const actual_investment = getQueryParam("actual_investment");
      const original_amt = getQueryParam("original_amt");
      
      var params = {
        'from_crm': atob(from_crm),
        'actual_investment': atob(actual_investment),
        'original_amt': atob(original_amt)
      }

      getExpertData(atob(user_id), atob(fp_user_log), atob(amount), atob(cart_id), 
      atob(subscription_months), atob(plan_sub_cat), atob(rm_id), atob(for_quarter), params);

    }
  }, []);

  const getExpertData = async(userID, fp_log_id, amount, cart_id, subscription_months, plan_sub_cat, rm_id,
     for_quarter, params) => {

    // setIsLoading(true);
    let payload = {
      fp_log_id: parseInt(fp_log_id),
      user_id: parseInt(userID),
      amount: parseInt(amount),
      cart_id: parseInt(cart_id),
      subscription_months: parseInt(subscription_months),
      plan_sub_cat: plan_sub_cat,
      rm_id: parseInt(rm_id),
      for_quarter: parseInt(for_quarter)
    }

    let getexpertpayment = await apiCall(
      '',
      payload,
      false,
      false
    );
    if (getexpertpayment["error_code"] == "100") {
      if(getexpertpayment["message"] == 'success'){
        var resp_data = getexpertpayment["data"];

        var options = {
          rzp_live_rYE1IuyTWkWiDv: "GOfFTB1HlrGQlqsnrYnCPhmj", // Enter the Key ID generated from the Dashboard
          amount:  resp_data["amount"]* 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          // "recurring":true,
          currency: "INR",
          name: "Fintoo",
          description: "Financial Planning",
          image:
            "https://stg.minty.co.in/static/userflow/img/fintoo_razor_pay_logo.png",
          order_id: resp_data["fp_cart_id"], //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          // "redirect":true,
          callback_url: BASE_API_URL + "razor_pay_payment_success/?from_crm=1",
          // "handler": function (response){
          //   // let decoded_res = JSON.parse(commonEncode.decrypt(success_res));
          //   // // if (decoded_res) {
          //   //   window.location.href = BASE_API_URL + "payment_failure/";
          //   // }
          // },
          prefill: {
            name: resp_data['name'],
            email: resp_data['email'],
            contact: resp_data['contact'].toString()
          },
          notes: {
            address:
              "Fintoo Wealth Private Limited B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059]",
          },
          theme: {
            color: "#042b62",
          },
          readonly: {
            contact: true,
            email: true,
            name: true,
          },
          // config: {
          //   display: {
          //     hide: [
          //       {
          //         method: "paylater",
          //       },
          //     ],
          //   },
          // },
        };
        // setIsLoading(false);
        const loadrzrpay = await loadRazorpayScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        var rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on("payment.failed", function (response) {
          var failure_payload = commonEncode.encrypt(
            JSON.stringify({
              razorpay_order_id: response.error.metadata.order_id,
              razorpay_payment_id: response.error.metadata.payment_id,
            })
          );

          let res2 = apiCall(
            ADVISORY_PAYMENT_FAILURE,
            failure_payload,
            false,
            false
          );
          let decoded_res = JSON.parse(commonEncode.decrypt(res2));
          if (decoded_res) {
            window.location.href = BASE_API_URL + "payment_failure/";
          }
        });

      }else{
      }
    }
    else{
      localStorage.setItem('expertPaymentError', JSON.stringify(getexpertpayment['message']));
      window.location.href = process.env.PUBLIC_URL + '/login';
    }

  }

  function hasQueryParams() {
    return window.location.search.length > 0;
  }

  const getQueryParam = (name) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  };

  
  return (
    <>
      <div className="Paymentpage">
        <FintooLoader isLoading={isLoading} />
        <HideHeader />

        {/* <div className="login-header">
          <a target="_self" href={process.env.PUBLIC_URL + "/pricing"} >
            <div
              className="back-arrow"

            >
              <img
                src="https://stg.minty.co.in/static/userflow/img/icons/back-arrow.svg"
                alt="Back Arrow"
              />
            </div>
          </a>

        </div> */}
        
        <HideFooter />

      </div>
    </>
  );
};
export default PaymentExpertPage;




