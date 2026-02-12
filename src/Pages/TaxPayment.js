import { useState, useEffect } from "react";
import { apiCall, getItemLocal, getParentUserId, getPublicMediaURL, getUserId } from "../common_utilities";
import FintooLoader from "../components/FintooLoader";
import '../checkboxstyle.css';
import { BASE_API_URL, imagePath, CHECK_SESSION } from "../constants";
import axios from "axios";
import commonEncode from '../commonEncode';
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import HideHeader from "../components/HideHeader";
import HideFooter from "../components/HideFooter";
import { useNavigate } from "react-router-dom";
import style from './style.module.css'
import MainLayout from "../components/Layout/MainLayout";
import { ExpertNameInfo } from "./ExpertAppointment";
import StepComponent from "../components/StepsComponent";
import MemberLayout from "../components/Layout/MemberLayout";
import { useSelector } from "react-redux";

const TaxPaymentPage = () => {
  const [showBillingDetails, SetShowBillingDetails] = useState(false)
  const [paymentPayloadData, SetPaymentPayloadData] = useState({
    user_id: "",
    user_name: "",
    user_email: "",
    user_phone: "",

    plan_id: "",
    c_id: "",
    expert_id: "",
    discountedAmount: "",
    expertTotalFees: "",
    TotalAmount: "",
    gross_amount: "",
    value_after_discount: "",

    emp_name: "",
    emp_position: "",
    rating: "",
    emp_experience: "",
    imagepath: ""
  })
  const [isNDAChecked, setNDAChecked] = useState(false);
  const [NDAMsg, setNDAMsg] = useState('');

  let navigate = useNavigate();

  const userid = getUserId();

  useEffect(() => {

    let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));

    const currentMemberData = users.filter(data => data.id == getUserId())[0]

    const memberParentData = users.filter(data => data.id == getParentUserId())[0]

    if (getUserId() != getParentUserId()) {
      if ((currentMemberData.email == memberParentData.email) || (currentMemberData.mobile == memberParentData.mobile) || !currentMemberData.email || !currentMemberData.mobile) {
        return navigate(`${process.env.PUBLIC_URL}/updateMember`);
      }
    }
  }, [])

  useEffect(() => {
    document.body.classList.add("main-layout");

    if (!localStorage.getItem('FintooTaxPlanInfo')) {
      return navigate(`${process.env.PUBLIC_URL}/expert?service=tax-planning`);
    }

    const FintooTaxPlanInfo = JSON.parse(localStorage.getItem('FintooTaxPlanInfo'));
    
    if (FintooTaxPlanInfo) {

      const discountedAmount = (FintooTaxPlanInfo.discountPercent / 100) * FintooTaxPlanInfo.expertTotalFees;

      const finalAmount = FintooTaxPlanInfo.expertTotalFees - discountedAmount;

      SetPaymentPayloadData(prev => ({
        ...prev,
        plan_id: FintooTaxPlanInfo.planId,
        couponCode: FintooTaxPlanInfo.couponCode,
        // discountedAmount: discountedAmount,
        discountedAmount: Number(FintooTaxPlanInfo.expertTotalFees - FintooTaxPlanInfo.value_after_discount),
        c_id: FintooTaxPlanInfo.couponCodeId,
        expert_id: FintooTaxPlanInfo.RMId,
        expertTotalFees: Number(FintooTaxPlanInfo.expertTotalFees),
        // TotalAmount: finalAmount,
        TotalAmount: Number(FintooTaxPlanInfo.value_after_discount),
        // gross_amount: finalAmount + ((18 / 100) * finalAmount),
        gross_amount: Number(FintooTaxPlanInfo.value_after_discount) + ((18 / 100) * FintooTaxPlanInfo.value_after_discount),
        value_after_discount: Number(FintooTaxPlanInfo.value_after_discount),

        emp_name: FintooTaxPlanInfo.employee_name,
        emp_position: FintooTaxPlanInfo.emp_qualification,
        rating: FintooTaxPlanInfo.rating,
        emp_experience: FintooTaxPlanInfo.emp_experience,
        imagepath: FintooTaxPlanInfo.imagepath
      }))
    }

    getSessionData()

    return (() => localStorage.removeItem('FintooTaxPlanInfo'))
  }, []);

  const getSessionData = async () => {

    let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("allMemberUser")));

    const currentUserData = users.filter(data => data.id == userid)[0]

    SetPaymentPayloadData(prev => ({
      ...prev, user_id: currentUserData.id,
      user_name: currentUserData.name,
      user_phone: currentUserData.mobile ?? '',
    }))
  }

  const handleNDAClick = (e) => {
    if (e.target.checked == false) {
      setNDAMsg('Please accept terms and conditions.')
    } else {
      setNDAMsg('')
    }
    setNDAChecked(e.target.checked)
  }

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
  }

  const razorPay = () => {
    if (isNDAChecked) {
      if (paymentPayloadData.gross_amount !== 0) {
        checkout();
      }
      else {
        handleZeroPayment();
      }
    }
    else {
      setNDAMsg('Please accept terms and conditions.')
    }
  }

  const handleZeroPayment = async () => {

    let api_data_suceess = ""
    const parsedCouponId = paymentPayloadData.c_id !== "" ? parseInt(paymentPayloadData.c_id, 10) : null;

    api_data_suceess = {
      "user_id": Number(paymentPayloadData.user_id),
      "plan_id": Number(paymentPayloadData.plan_id),
      "c_id": parsedCouponId,
      "expert_id": paymentPayloadData.expert_id,
      "total_amount": paymentPayloadData.expertTotalFees,
      "total_payable_amount": paymentPayloadData.TotalAmount,
      "net_payable": paymentPayloadData.gross_amount,
    }

    let CheckRazorpayPaymentStatusdata = await apiCall(
      BASE_API_URL + "restapi/payment/CheckRazorpayPaymentStatusApi/",
      api_data_suceess,
      false,
      false
    );

    try {
      var decoded_res = JSON.parse(commonEncode.decrypt(CheckRazorpayPaymentStatusdata));
    }
    catch {
      var decoded_res = CheckRazorpayPaymentStatusdata;
    }
    if (decoded_res) {
      var response = decoded_res.data
      if (decoded_res.error_code == "103") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error('You have already paid for this service.');
        return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
      }
      if (decoded_res.error_code == "100") {
        const planInfo = {
          plan_id: paymentPayloadData.plan_id
        }
        localStorage.setItem('FintooUserPlanInfoInfo', JSON.stringify(planInfo));

        return navigate(`${process.env.PUBLIC_URL}/expert-appointment`);
      }
      else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(decoded_res.data)
      }
    }
  }

  const checkout = async () => {
    const loadrzrpay = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!loadrzrpay) {
      return
    }

    let totalpaywithGSTP = 7
    var apiURL = 'restapi/payment/RazorpayOrderApi/'

    const parsedCouponId = paymentPayloadData.c_id !== "" ? parseInt(paymentPayloadData.c_id, 10) : null;

    let data = {
      "user_id": Number(getUserId()), "payment_amount": paymentPayloadData.gross_amount, "plan_id": Number(paymentPayloadData.plan_id),
      "expert_id": paymentPayloadData.expert_id, "c_id": parsedCouponId
    }

    let res = await apiCall(
      BASE_API_URL + apiURL,
      data,
      false,
      false
    );
    try {
      var decoded_res = JSON.parse(commonEncode.decrypt(res));
    }
    catch {
      var decoded_res = res;
    }
    if (decoded_res) {
      var response = decoded_res.data
      if (decoded_res.error_code == "103") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error('You have already paid for this service.');
        return navigate(`${process.env.PUBLIC_URL}/commondashboard`);
      }
      if (decoded_res.error_code == "100") {

        var options = {
          "rzp_live_rYE1IuyTWkWiDv": "GOfFTB1HlrGQlqsnrYnCPhmj",
          // "key": "rzp_test_jMQKjxtY0nGGqJ",
          "amount": "10021312",
          "currency": "INR",
          "name": "Fintoo",
          "description": "Financial Planning",
          "image": "https://stg.minty.co.in/static/userflow/img/fintoo_razor_pay_logo.png",
          "order_id": decoded_res.id,
          "handler": function (response) {
            let is_success = true
            handlePaySuccess(response, is_success)
          },
          "prefill": {
            "name": paymentPayloadData.user_name,
            "email": paymentPayloadData.user_email,
            "contact": paymentPayloadData.user_phone
          },
          "notes": {
            "address": "Fintoo Wealth Private Limited B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059]"
          },
          "theme": {
            "color": "#042b62"
          },
          "readonly": {
            "contact": true,
            "email": true,
            "name": true
          },
          config: {
            display: {
              hide:
                [{
                  method: "paylater"
                }]
            }
          },
        };

        options.order_id = response.id
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
        rzp1.on('payment.failed', function (response) {

          var failure_payload = { razorpay_order_id: response.error.metadata.order_id, razorpay_payment_id: response.error.metadata.payment_id }

          let is_success = false
          handlePaySuccess(failure_payload, is_success)

        });
      }
      else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(decoded_res.data)
      }

    }

  }

  const handlePaySuccess = async (data, is_success) => {

    let api_data_suceess = ""
    const parsedCouponId = paymentPayloadData.c_id !== "" ? parseInt(paymentPayloadData.c_id, 10) : null;

    if (is_success) {
      api_data_suceess = {
        "user_id": Number(paymentPayloadData.user_id),
        "plan_id": Number(paymentPayloadData.plan_id),
        "c_id": parsedCouponId,
        "expert_id": paymentPayloadData.expert_id,
        "total_amount": paymentPayloadData.expertTotalFees,
        "total_payable_amount": paymentPayloadData.TotalAmount,
        "net_payable": paymentPayloadData.gross_amount,
        "razorpay_order_id": data.razorpay_order_id,
        "razorpay_payment_id": data.razorpay_payment_id,
        "razorpay_signature": data.razorpay_signature,

      }
    } else {
      api_data_suceess = {
        "user_id": Number(paymentPayloadData.user_id),
        "plan_id": Number(paymentPayloadData.plan_id),
        "c_id": parsedCouponId,
        "expert_id": paymentPayloadData.expert_id,
        "total_amount": paymentPayloadData.expertTotalFees,
        "total_payable_amount": paymentPayloadData.TotalAmount,
        "net_payable": paymentPayloadData.gross_amount,
        "razorpay_order_id": data.razorpay_order_id,
        "razorpay_payment_id": data.razorpay_payment_id,
      }
    }

    await apiCall(
      BASE_API_URL + "restapi/payment/CheckRazorpayPaymentStatusApi/",
      api_data_suceess,
      false,
      false
    );

    if (is_success) {
      const planInfo = {
        plan_id: paymentPayloadData.plan_id
      }
      localStorage.setItem('FintooUserPlanInfoInfo', JSON.stringify(planInfo));
      localStorage.removeItem('FintooTaxPlanInfo');

      return navigate(`${process.env.PUBLIC_URL}/expert-appointment`);
    }

  }

  const stepsData = [
    {
      current: false,
      stepCompleted: true,
      name: 'Select the Expert',
    },
    {
      current: true,
      stepCompleted: false,
      name: 'Pay for Consultancy',
    },
    {
      current: false,
      stepCompleted: false,
      name: 'Book an Appointment',
    },
    {
      current: false,
      stepCompleted: false,
      name: 'Upload Documents',
    }
  ]

  return (
    <MainLayout>
      {/* <MemberLayout switchToParent={true} redirectUrl={`${process.env.PUBLIC_URL}/expert?service=tax-planning`}> */}
      <MemberLayout redirectUrl={`${process.env.PUBLIC_URL}/expert?service=tax-planning`}>
        <div className="Paymentpage">
          <FintooLoader isLoading={false} />
          <HideHeader />

          <div className="login-header">
            <div
              className="back-arrow"
              onClick={() => {
                localStorage.removeItem('FintooTaxPlanInfo');
                navigate(`${process.env.PUBLIC_URL}/expert?service=tax-planning`);
              }}
            >
              <img
                src="https://stg.minty.co.in/static/userflow/img/icons/back-arrow.svg"
                alt="Back Arrow"
              />
            </div>
          </div>
          <section className="payment-section TaxPaymentSection bg-white">

            <div className="container-fluid">
              <div className="row align-items-center justify-content-center">
                <div className="col-md-6">
                  <div className="login-block" >
                    <form
                      className="payment-form"
                    >

                      <input type="hidden" name="productinfo" />
                      <input type="hidden" name="coupon" />
                      <input type="hidden" name="user_id" />

                      <input type="hidden" name="firstname" />
                      <input type="hidden" name="email" />
                      <input type="hidden" name="isprofile" />

                      <div className="row form-row">
                        <div className="col-md-6 subspay" >
                          <div className="paymt">
                            <div className={`${style.stepContainer}`}>
                              <StepComponent stepsData={stepsData} />
                            </div>

                            <div className="row form-row text-center">
                              <div className="col-md-6">

                                <div style={{ textAlign: 'start' }}>
                                  <ExpertNameInfo appointment={paymentPayloadData} imgClass={'expertDetailImgContainer3'} />
                                </div>
                                <div className="material-radio">
                                  <ul className="inline" style={{ padding: 0 }}>
                                    <li
                                      className="radio subs_radio custom-background-color"

                                    >
                                      <div className="row" style={{ color: 'white' }}>
                                        <div className="col-8" style={{ padding: "10px" }}>
                                          <label className="text-white">Tax planning and management</label>
                                        </div>
                                        <div
                                          className="col-4"
                                          style={{ padding: "10px", borderLeft: "1px solid #ccc", textAlign: "right" }}
                                        >
                                          <span className="subs_right_amt text-white">
                                            ₹ {Number(paymentPayloadData.expertTotalFees).toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </li>

                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div style={{ width: "100%", height: "10px" }}>&nbsp;</div>

                            <div className="row form-row text-center" id="couponapply_section">
                              <div className="col-md-6">
                                <div
                                  className="coupon-block material input applyoffer_div"
                                  style={{ margin: "0", maxWidth: "130px", height: "29px" }}
                                >
                                  <span>
                                    <img
                                      src="https://static.fintoo.in/static/userflow/img/icons/giftbox.png"
                                      alt="Apply Offer"
                                      style={{ float: "left", width: "15px" }}
                                    />
                                    <button
                                      type="button"
                                      value="Apply coupon code"
                                      className="apply-coupon-code custom-color"
                                    >
                                      {paymentPayloadData.couponCode}
                                    </button>
                                  </span>
                                </div>
                              </div>
                            </div>
                            {/* } */}

                            <div style={{ width: "100%", height: "10px" }}>&nbsp;</div>
                            <div className="row form-row text-center">
                              <div className="col-md-6">
                                <ul className="pay-block">
                                  <li>
                                    <div className="row">
                                      <div className="col-8">
                                        <p style={{ textAlign: "left" }}>Total Payable Amount</p>
                                      </div>
                                      <div className="col-4">
                                        {/* <p className="text-right">₹ {Number(paymentPayloadData.TotalAmount).toLocaleString()}</p> */}
                                        <p className="text-right">₹ {Number(paymentPayloadData.expertTotalFees).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="row">
                                      <div className="col-8">
                                        <p style={{ textAlign: "left" }}>Discount applied</p>
                                      </div>
                                      <div className="col-4">
                                        <p className="text-right">-₹ {Number(paymentPayloadData.discountedAmount).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="row">
                                      <div className="col-8">
                                        <p style={{ textAlign: "left" }}>Gross payable</p>
                                      </div>
                                      <div className="col-4">
                                        <p className="text-right">₹ {Number(paymentPayloadData.TotalAmount).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="row">
                                      <div className="col-8">
                                        <p style={{ textAlign: "left" }}>GST</p>
                                      </div>
                                      <div className="col-4">
                                        <p className="text-right">₹ {((18 / 100) * paymentPayloadData.TotalAmount).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </li>
                                  <li className="net_payable">
                                    <div className="row">
                                      <div className="col-8">
                                        <p style={{ textAlign: "left" }}>
                                          Net Payable
                                          {/* <span onClick={() => SetShowBillingDetails(true)} ><img style={{ width: "15px", marginTop: "-10px" }} src={imagePath + "https://static.fintoo.in/static/userflow/img/icons/pink-information.svg"} /></span> */}
                                        </p>
                                      </div>
                                      <div className="col-4">
                                        <p style={{ textAlign: "right", fontWeight: "bold" }}>
                                          ₹ {Number(paymentPayloadData.gross_amount).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="row form-row">
                              <div className="col-md-8 offset-md-2">
                                <ul className="agreement-block" style={{ marginTop: "0px" }}>
                                  <li className="material-checkbox">
                                    <div className="checkbox-container" style={{ margin: "0px" }}>
                                      <input
                                        type="checkbox"
                                        name="nda"
                                        id="ndacheck"
                                        className="custom-checkbox"
                                        tabIndex="1"
                                        onChange={handleNDAClick}
                                        style={{ zIndex: "2 !important" }}
                                      />
                                      <label for="ndacheck" className="checkbox-label"
                                      >I have read and accept the
                                        <a href={process.env.PUBLIC_URL + "/terms-conditions"} target="_blank" className="custom-color ms-2"> Terms and conditions applied</a>
                                        <br />
                                        <span className="error">{NDAMsg}</span>
                                      </label>
                                    </div>

                                  </li>

                                </ul>
                              </div>
                            </div>
                            <div className="row form-row mt-4">
                              <div className="col">
                                <div className="btn-container text-center">
                                  <button
                                    type="button"
                                    id="razorPay"
                                    className="default-btn"
                                    onClick={() => razorPay()}
                                    style={{ fontSize: "16px" }}
                                  >
                                    Pay
                                  </button>

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br />
                      <br />
                    </form>
                  </div>
                </div>
                <div className="col-md-6 bg-illustration text-center">
                  {/* <img className="w-100 TaxPaymentSectionIllustration" src={imagePath + "https://static.fintoo.in/static/userflow/img/login-illustration.svg"} alt="" /> */}
                  <img className="TaxPaymentSectionIllustration"
                    style={{ width: '65%' }}
                    src={getPublicMediaURL("static/media/DG/Images/pana.svg")}
                    alt="" />
                </div>
              </div>
            </div>
          </section>


          <section className={`popup apply-popup bill-details-popup ${showBillingDetails ? 'active' : ''}`} id="billingDetails">
            <div className="popup-container">
              <div className="popup-wrapper">
                <div className="header-box d-flex popup-header text-center">
                  <h2 className="page-header">Billing Detail</h2>
                  <a
                    href="#"
                    onClick={() => SetShowBillingDetails(false)}
                    className="popup-closebtn"
                  >×</a
                  >
                </div>
                <div className="popup-body">
                  <ul className="bill-details-list">
                    <li className="two-col-list">
                      <p>Total payable Amount</p>
                      <p>₹ {Number(paymentPayloadData.expertTotalFees).toLocaleString()}</p>
                    </li>

                    <li className="two-col-list color-blue f-bold">
                      <p>Discount applied</p>
                      <p>-₹ {Number(paymentPayloadData.discountedAmount).toLocaleString()}</p>
                    </li>
                    <li className="two-col-list f-bold outline" >

                      <p>Gross payable</p>
                      <p>₹ {Number(paymentPayloadData.TotalAmount).toLocaleString()}</p>
                    </li>
                    <li className="two-col-list">
                      <p className="pb-0">GST</p>
                      <p className="pb-0">₹ {((18 / 100) * paymentPayloadData.TotalAmount).toLocaleString()}</p>
                    </li>

                    <li className="two-col-list f-bold fill-row">
                      <p>Net payable</p>
                      <p>₹ {Number(paymentPayloadData.gross_amount).toLocaleString()}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <HideFooter />
        </div>
      </MemberLayout>

    </MainLayout>
  );
};


export default TaxPaymentPage;




