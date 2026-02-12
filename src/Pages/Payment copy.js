import { useState, useEffect } from "react";
import { apiCall, getFpLogId, getItemLocal, getParentUserId, getPublicMediaURL, loginRedirectGuest, setFplogid } from "../common_utilities";
import FintooLoader from "../components/FintooLoader";
import '../checkboxstyle.css';
import { imagePath } from "../constants";
import axios from "axios";
import commonEncode from '../commonEncode';
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import HideHeader from "../components/HideHeader";
import HideFooter from "../components/HideFooter";
import { Link } from "react-router-dom";

import { Createorderid, Getcouponlist } from "../FrappeIntegration-Services/services/payment-api/paymentapiService";
const PaymentPage = () => {

  useEffect(() => {
    document.body.classList.add("main-layout");
  }, []);

  const retrievedPlan = JSON.parse(localStorage.getItem('financialPlan'));
  const planType = retrievedPlan?.plan_name
  const planFreq = retrievedPlan?.plan_freq == 6 ? "Half Yearly" : '';
  const baseAmount = retrievedPlan?.plan_amount;
  const totalpay = retrievedPlan?.plan_amount;
  const selectedPlanId = "PC-1";

  const [coupon, setCoupon] = useState([])

  const [enteredCoupon, setEnteredCoupon] = useState('');
  const [couponList, setCouponList] = useState([]);
  const [couponList1, setCouponList1] = useState([]);
  const [couponApplied, setCouponApplied] = useState('');
  const [discountTotal, setDiscountTotal] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [isCouponInvalid, setCouponInvalid] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [orderId, setOrderID] = useState(null);
  const [totalAmount, setTotalAmount] = useState(totalpay);
  const [rawAmount, setRawAmount] = useState(0);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await Getcouponlist()
        if (response.status_code === 200) {
          setCouponList(response.data);
        }
      } catch (error) {
        console.error('Error fetching coupons', error);
      }
    };

    fetchCoupons();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isNDAChecked, setNDAChecked] = useState(false);
  const [NDAMsg, setNDAMsg] = useState('');
  const [isCouponPopUpActive, setCouponActive] = useState(false)
  const [isBillingPopupActive, setBillingPopupActive] = useState(false)
  const [isBookingPopUpActive, setBookingPopUpActive] = useState(false)
  const [productInfopay, setProductInfopay] = useState(0)
  const [totalpaywithGST, setTotalPaywithGST] = useState(0)
  const [couponInput, setCouponInput] = useState('')
  const [sessionData, setSessionData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isHasPlan, setIsHasPlan] = useState(0);
  const [planCartPay, setPlanCartPay] = useState([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isRecurringDisabled, setIsRecurringDisabled] = useState(false);
  const [subscriptionMonths, setSubscriptionMonths] = useState(null);
  const [grossPayable, setGrossPayable] = useState(false);
  const [planImg, setPlanImg] = useState('');
  const [plansubcat, setPlansubcat] = useState('');
  const [monthlyAmount, setMonthlyamount] = useState('');
  const [rm_id, setRMid] = useState('');
  const [rmdetailsName, setRMdetailsName] = useState('');
  const [rmdetailsPosition, setRMdetailsPosition] = useState('');
  const [rmdetailsImg, setRMdetailsImg] = useState('');
  const [forQuarter, setForQuarter] = useState('');
  const [netPayable, setNetPayable] = useState('');
  const [isFAChecked, setFAChecked] = useState(false);
  const [isOfferInvalid, setInvalidOffer] = useState(false);
  const [login_image, setLoginImage] = useState("");
  const plan_types = { 1: "Basic", 2: "Basic Pro", 3: "Classic", 4: "Classic Plus", 5: "Premium", 6: "Elite", 7: "Elite Prime" };

  const rsFilter = (value) => {
    if (!isNaN(value)) {
      var is_negative = false;
      var result = Math.floor(value).toString();
      if (result.includes('-')) {
        result = result.replace('-', '');
        is_negative = true;
      }

      var lastThree = result.substring(result.length - 3);
      var otherNumbers = result.substring(0, result.length - 3);
      if (otherNumbers != '')
        lastThree = ',' + lastThree;
      var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

      if (is_negative == true) {
        output = '-' + output;
      }
      return output;
    }
  }


  const openPopup = (popupName) => {
    if (popupName == 'applyCoupon') {
      setCouponActive(true)
      setBillingPopupActive(false)
      setBookingPopUpActive(false)
      setCouponInvalid(false)
      setEnteredCoupon('')

    }
    if (popupName == 'billingDetails') {
      setBillingPopupActive(true)
      setCouponActive(false)
      setBookingPopUpActive(false)

    }
    if (popupName == 'bookAppointment') {
      setBookingPopUpActive(true)
      setBillingPopupActive(false)
      setCouponActive(false)
    }
  }

  const removePopup = () => {

    setBillingPopupActive(false)
    setBookingPopUpActive(false)
    setCouponActive(false)
  }

  const validatepaymentform = () => {

    var nda = true;
    var faa = true;
    if (isNDAChecked == false) {
      nda = false;
    }
    if (nda) {
      return true;
    } else {
      return false;
    }


  }
  const handleNDAClick = (e) => {
    if (e.target.checked == false) {
      setNDAMsg('Please accept Non-Disclosure Agreement.')
    } else {
      setNDAMsg('')
    }
    setNDAChecked(e.target.checked)
  }

  const handleCouponCodeChange = (value) => {
    setEnteredCoupon(value);
    setCouponInvalid(false);
    setCouponError('');
  };

  const calculateGST = (amount) => {
    return Math.floor(amount * 0.18);
  };


  const applyOfferManual = () => {
    if (enteredCoupon === '') {
      setCouponError('Please enter coupon');
      setCouponInvalid(true);
      return;
    }

    const matchedCoupon = couponList.find(
      (c) => c.coupon_name === enteredCoupon && c.coupon_status === 1
    );

    if (!matchedCoupon) {
      setCouponError('Invalid Coupon');
      setCouponInvalid(true);
      return;
    }

    if (matchedCoupon.coupon_valid_count > 10) {
      setCouponError('Coupon usage limit exceeded');
      setCouponInvalid(true);
      return;
    }

    if (matchedCoupon.coupon_valid_plan !== selectedPlanId) {
      setCouponError('Coupon not valid for selected plan');
      setCouponInvalid(true);
      return;
    }

    let discount = 0;
    if (matchedCoupon.coupon_is_percentage === 1) {
      discount = Math.floor((totalpay * matchedCoupon.coupon_value) / 100);
    } else {
      discount = matchedCoupon.coupon_value;
    }

    const gst = calculateGST(totalpay - discount);
    const total = (totalpay - discount) + gst;

    setDiscountTotal(discount);
    setTotalGST(gst);
    setCouponApplied(enteredCoupon);
    setCouponInvalid(false);
    setCouponError('');
    setCouponActive(false);
    setRawAmount(total);
    setTotalAmount(total);
  };


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };


  const razorPay = async () => {
    if (!isNDAChecked) {
      setNDAMsg('Please accept Non-Disclosure Agreement.');
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    CreateOrderID();

    const options = {
      key: "rzp_live_rYE1IuyTWkWiDv",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Fintoo",
      description: "Financial Planning",
      image: "https://stg.minty.co.in/static/userflow/img/fintoo_razor_pay_logo.png",
      callback_url: "/razor_pay_payment_success/",
      prefill: {
        name: 'Shubham Kamble',
        email: 'shubham.kamble@fintoo.in',
        contact: "91" + '9359960767'
      },
      notes: {
        address: "Fintoo Wealth Private Limited B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059"
      },
      theme: {
        color: "#042b62"
      },
      readonly: {
        contact: true,
        email: true,
        name: true
      },
      config: {
        display: {
          hide: [
            { method: "paylater" }
          ]
        }
      },
      handler: function (response) {
        //console.log("Payment success", response);
        // Handle payment success callback
      },
      modal: {
        ondismiss: function () {
          //console.log("Payment popup closed by user");
        }
      }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();

    // Don’t run this right away — handle failure in `handler` or `modal.ondismiss`
  };


  const CreateOrderID = async () => {

    const data = {
      amount: parseInt(totalAmount)
    };
    try {
      const response = await Createorderid(data);
      if (response.status_code === 200) {
        setOrderID(response.data.order_id);
      }
    } catch (error) {
      console.error('Error fetching coupons', error);
    }

  }

  const skippayment = () => {
    if (isNDAChecked) {

      if (planCartPay.length == 0) {
        setIsLoading(false)
      }
      else if (validatepaymentform()) {

        var subscription_freq = planCartPay.subscription_freq
        var plan_sub_cat = planCartPay.plan_sub_cat_id
        if (couponInput != '') {
          setIsRecurring(false)
          setIsRecurringDisabled(true)
        }
        setIsLoading(true)
        // skiprazorpayment(subscription_freq, plan_sub_cat)
      }
    }
    else {
      setNDAMsg('Please accept Non-Disclosure Agreement.')
    }
  }



  return (
    <>
      <div className="Paymentpage">
        <FintooLoader isLoading={isLoading} />
        <HideHeader />

        <div className="login-header">
          <a
            target="_self"
            href={
              getItemLocal("fhc")
                ? `${process.env.PUBLIC_URL}/financial-health-checkup`
                : `${process.env.PUBLIC_URL}/pricing`
            }
          >
            <div
              className="back-arrow"

            >
              <img
                src="https://stg.minty.co.in/static/userflow/img/icons/back-arrow.svg"
                alt="Back Arrow"
              />
            </div>
          </a>

        </div>

        <section className="payment-section h-100 bg-white">
          <div className="container-fluid">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-6">
                <div className="" >
                  <form
                    action="{{redirect_url}}"
                    onSubmit={() => validatepaymentform()}
                    className="payment-form"
                    method="POST"
                  >
                    {/* {totalpay > discountTotal ?
                              (totalpay+totalGST)-discountTotal: ''} */}

                    <input type="hidden" name="productinfo" value={productInfopay} />
                    <input type="hidden" name="coupon" value={couponInput} />
                    <input type="hidden" name="user_id" value={getParentUserId()} />

                    <input type="hidden" name="firstname" value={sessionData != '' ? sessionData.first_name : ''} />
                    <input type="hidden" name="email" value={sessionData != '' ? sessionData.email : ''} />
                    <input type="hidden" name="isprofile" value={sessionData != '' ? sessionData.mobile : ''} />

                    <div className="row form-row">
                      <div className="col-md-6 subspay" >
                        <div
                          className="custom-switch d-md-flex d-block text-center ms-md-0 ms-3 mt-2"
                          style={{ marginBottom: "0px", fontWeight: "500" }}>
                          <span
                            style={{ fontSize: "20px", }}
                            className="switch-label "
                          >Subscription
                          </span>
                        </div>

                        <div className="custom-switch justify-content-md-start justify-content-center"
                          style={{ marginBottom: "5px", paddingTop: ".4rem" }}>
                          <span
                            style={{
                              fontSize: "14px",
                              paddingLeft: "7px",
                              color: "grey",
                              fontWeight: "500",
                            }}
                          >Financial Planning</span>
                        </div>
                        <div className="paymt">
                          <div className="row form-row text-center">
                            <div className="col-md-6">
                              <div className="material-radio">
                                <ul className="inline" style={{ padding: 0 }}>
                                  <li
                                    className="radio subs_radio custom-background-color"

                                  >
                                    <div className="row">
                                      <div className="col-8" style={{ padding: "10px" }}>
                                        {/* {forQuarter == 'Q0' ? 
                                        <label className="text-white">{planType} - ({planFreq})</label> : <label className="text-white">{planType} ({forQuarter}) - ({planFreq})</label>} */}
                                        <label className="text-white">{planType} - ({planFreq})</label>
                                      </div>
                                      <div
                                        className="col-md-4"
                                        style={{
                                          padding: "10px",
                                          borderLeft: "1px solid #ccc",
                                          textAlign: "right",
                                          color: "#fff"
                                        }}
                                      >
                                        <span className="subs_right_amt text-white">
                                          ₹ {baseAmount ? rsFilter(baseAmount) : '0'}
                                        </span>
                                      </div>
                                    </div>
                                  </li>

                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="row form-row" style={{ display: "none" }}>
                            <div className="col-md-6">
                              <ul className="custom-radio-block payment-options checked">
                                <li className="d-block">
                                  <label className="custom-radio-container"
                                  ><img
                                      src={BASE_API_URL + "userflow/img/icons/credit-card.svg"}
                                    />
                                    Pay
                                    <input type="radio" checked="checked" name="radio" />
                                    <span className="checkmark"></span>
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div style={{ width: "100%", height: "10px" }}>&nbsp;</div>
                          {couponApplied == '' &&
                            <div className="row form-row text-center" id="couponapply_section">
                              <div className="col-md-6">
                                <div
                                  className="coupon-block material input applyoffer_div"
                                  onClick={() => openPopup('applyCoupon')}
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
                                      Apply Offer
                                    </button>
                                    <b className="right_arrow"></b>
                                  </span>
                                </div>
                              </div>
                            </div>
                          }
                          {couponApplied != '' &&
                            <div
                              className="row form-row text-center"
                              id="couponapplied_section"

                            >
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-8">
                                    <div
                                      className="coupon-block material input applyoffer_div"
                                      onClick={() => openPopup('applyCoupon')}
                                      style={{ margin: "0px", width: "fit-content" }}
                                    >
                                      <span className="offerApplied">
                                        <img
                                          src="https://static.fintoo.in/static/userflow/img/icons/giftbox.png"
                                          alt="Apply Offer"
                                          style={{ float: "left", width: "15px", marginTop: "3px" }}
                                        />&nbsp;
                                        <span
                                          className="offer-applied"
                                          style={{ fontWeight: "500", fontSize: "16px" }}
                                        >{couponApplied}</span>&nbsp;
                                      </span>
                                    </div>
                                  </div>
                                  <div className="col-4 text-right" style={{ marginTop: "8px" }}>
                                    <div
                                      className="delete"
                                      onClick={() => deleteCoupon('offerApplied')}
                                    ><img
                                        // src={BASE_API_URL+"static/userflow/img/icons/delete.svg"}
                                        src={imagePath + "/static/media/Images/userflow/img/icons/delete.svg"}
                                        alt="Delete"
                                        width="16"
                                        height="16"
                                      /></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }
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
                                      <p className="text-right">₹{totalpay ? rsFilter(totalpay) : '0'}</p>
                                    </div>
                                  </div>
                                </li>
                                {couponApplied != '' &&
                                  <li
                                    className="color-light-blue offerApplied"
                                    id="offerApplied"

                                  >
                                    <div className="row">
                                      <div className="col-md-8">
                                        {/* <p style={{color:"#042b62",fontSize:"10px !important",textAlign:"left"}}> */}
                                        <p style={{ fontSize: "10px !important", textAlign: "left" }}>
                                          {/* <span style={{color: "#042b62"}}>Discount Applied</span> (<span className="offer-applied">{couponApplied}</span>) */}
                                          <span>Discount Applied</span> <span className="custom-color">({couponApplied})</span>
                                        </p>

                                      </div>
                                      <div className="col-md-4">
                                        <p className="text-right custom-color">
                                          -₹ {discountTotal}
                                        </p>
                                      </div>
                                    </div>
                                  </li>

                                }
                                {/* {isCouponInvalid==true && <li
                                               className="color-pink"
                                               id="couponinvalid"
                                               
                                             >
                                              <p>Coupon invalid!</p>
                                             </li>} */}


                                {couponApplied == '' &&
                                  <li>
                                    <div className="row">
                                      <div className="col-8">
                                        <p style={{ textAlign: "left" }}>Discount applied</p>
                                      </div>
                                      <div className="col-4">
                                        <p className="text-right">-₹ {discountTotal ? discountTotal : 0.00}</p>
                                      </div>
                                    </div>
                                  </li>
                                }
                                <li>
                                  <div className="row">
                                    <div className="col-8">
                                      <p style={{ textAlign: "left" }}>Gross payable</p>
                                    </div>
                                    <div className="col-4">
                                      <p className="text-right">₹ {rsFilter(totalpay - discountTotal)}</p>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="row">
                                    <div className="col-8">
                                      <p style={{ textAlign: "left" }}>GST</p>
                                    </div>
                                    <div className="col-4">
                                      <p className="text-right">₹{totalpay - discountTotal ? rsFilter(totalGST) : 0}</p>
                                    </div>
                                  </div>
                                </li>
                                <li className="net_payable">
                                  <div className="row">
                                    <div className="col-8">
                                      <p style={{ textAlign: "left" }}>
                                        {/* Net Payable <a href="#" onClick={() => openPopup('billingDetails')}><img style={{ width: "15px", marginTop: "-10px" }} src={imagePath + "https://static.fintoo.in/static/userflow/img/icons/pink-information.svg"} /></a> */}
                                        Net Payable
                                      </p>
                                    </div>
                                    <div className="col-4">
                                      <p style={{ textAlign: "right", fontWeight: "bold" }}>
                                        ₹{rsFilter(totalAmount)}
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
                                  {/* {(forQuarter == 'Q1' || forQuarter == 'Q0') &&  */}

                                  <div className="checkbox-container" style={{ margin: "0px" }}>
                                    <input
                                      type="checkbox"
                                      name="nda"
                                      id="ndacheck"
                                      className="custom-checkbox"
                                      tabIndex="1"
                                      // checked={isNDAChecked}
                                      onChange={handleNDAClick}
                                      style={{ zIndex: "2 !important" }}
                                    />
                                    <label for="ndacheck" className="checkbox-label"
                                    >I have read and accept the
                                      <Link
                                        to={process.env.PUBLIC_URL + "/userflow/nda/"}
                                        className="custom-color ms-2"
                                      >NDA - Non-Disclosure Agreement</Link>
                                      <br />
                                      <span className="error">{NDAMsg}</span>
                                    </label>
                                  </div>
                                  {/* } */}

                                </li>

                              </ul>
                            </div>
                          </div>
                          <div className="row form-row mt-4">
                            <div className="col">
                              <div className="btn-container text-center">
                                {
                                  parseInt(totalAmount) > 0 && <button
                                    type="button"
                                    id="razorPay"
                                    className="default-btn"
                                    onClick={razorPay}
                                    style={{ fontSize: "16px" }}
                                  >
                                    Pay
                                  </button>}
                                {
                                  totalAmount == 0 && <button
                                    type="button btn-container"
                                    onClick={() => skippayment()}
                                    className="default-btn"
                                    style={{ fontSize: "16px" }}
                                  >
                                    Pay
                                  </button>
                                }

                                {/* <a
                                            type="hidden"
                                            id="razorpaystartprocess"
                                            onclick="loaderscreen('show');"
                                          ></a> */}
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
              <div className="col-md-6">
                <img className="TaxPaymentSectionIllustration"
                  style={{ width: '65%' }}
                  src={getPublicMediaURL("static/media/DG/Images/pana.svg")}
                  alt="" />
              </div>
            </div>
          </div>
        </section>
        <section className={`popup apply-popup  ${isBookingPopUpActive ? 'active' : ''}`} >
          <div className="popup-container" style={{ maxHeight: "90vh", overflow: "hidden" }}>
            <a href="#" className="p_close js__p_close" title="Close">
              <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/cancel.svg"} alt="" />
            </a>
            <div className="popup-wrapper">

              <div className="header-box d-flex popup-header text-center" style={{ background: "white !important" }}>
                <input type="hidden" name="rm_id" id="rm_id" value={rm_id} />

                <h4 className="page-header" style={{ color: "#9cd155", fontWeight: "bold", fontSize: "24px !important" }}>Book Appointment With Expert</h4>

              </div>
              <div style={{ borderBottom: "0.8px solid #90a4aa", marginRight: "20px", marginLeft: "20px" }}></div>
              <div className="popup-body">
                <span>
                  <div>
                    <p className="Appt_Des">
                      Intoductory call with our financial Advisor to know more about our
                      offerings and advice
                    </p>
                  </div>
                  <div id="Cal_API">

                    <div className="calendly-inline-widget" data-url="https://calendly.com/fintoo/15-minutes-consultation-expert?embed_domain=minty.co.in&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1&name={{calendlydata.name}}&email={{calendlydata.email}}&a3=+91{{calendlydata.mobile}}&a4={{rmdetails_name}}" style={{ minWidth: "320px", height: "630px" }}></div>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className={`popup apply-popup  ${isCouponPopUpActive ? 'active' : ''}`} id="applyCoupon">
          <div className="popup-container">
            <div className="popup-wrapper">
              <div className="header-box d-flex popup-header text-center">
                <h2 className="page-header ">Apply Offer_1</h2>
                <a
                  href="#"
                  onClick={() => removePopup()}

                  className="popup-closebtn"
                >×</a
                >
              </div>
              <div className="popup-body">
                <span>
                  <form className="ng-pristine ng-valid">
                    <ul className="coupon-list" style={{ margin: "10px 0" }}>
                      <li>
                        <div className="coupon-name" style={{ alignItems: "flex-start" }}>
                          <div>
                            <input
                              type="text"
                              name="coupon_code"
                              id="coupon_code"
                              className="coupon"
                              value={enteredCoupon}
                              onChange={(e) => handleCouponCodeChange(e.target.value)}
                              style={{
                                width: "128px",
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                textAlign: "center",
                                marginRight: "10px"
                              }}
                              placeholder="Enter Coupon"
                            />
                            <br />
                            {isCouponInvalid && <p
                              id="c_error"
                              className="error text-center"
                              style={{ display: "block" }}
                            >
                              Invalid Coupon
                            </p>}

                          </div>
                          <button
                            type="button"
                            value="Apply"
                            onClick={() => applyOfferManual()}
                            className="coupon1 default-btn"
                            style={{ fontSize: '16px', padding: "8px 50px" }}
                          >
                            Apply
                          </button>
                        </div>
                      </li>
                      {couponList1.length >= 1 &&
                        couponList1.map(coupon => {
                          <li>
                            <div class="coupon-name">
                              <p
                                class="coupon"
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  width: "128px",
                                  padding: "8px 15px"
                                }}
                              >
                                {coupon.c_code}
                              </p>
                              {couponInput == coupon.c_id && <button
                                ng-if="couponinput==offer.c_id"
                                disabled="disabled"
                                type="button"
                                value="Apply"
                                class="coupon1 default-btn FP10120"
                              >
                                Coupon Applied
                              </button>}
                              {couponInput != coupon.c_id && <button
                                type="button"
                                value="Apply"
                                onClick={() => applyOffer1(coupon)}
                                class="coupon1 default-btn"
                              >
                                Apply
                              </button>
                              }
                            </div>
                            <div class="coupon-note">
                              {coupon.c_ispercentage == 1 &&
                                <h3 style={{ fontSize: "15px !important" }}>
                                  Save {coupon.c_discount}% OFF
                                </h3>
                              }
                              {
                                coupon.c_ispercentage == 1 &&
                                <h3 style={{ fontSize: "15px !important" }}>
                                  Save ₹{coupon.c_discount} OFF
                                </h3>
                              }

                              <p>{coupon.c_desc}</p>
                            </div>
                          </li>
                        })

                      }

                    </ul>
                  </form>
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className={`popup apply-popup bill-details-popup ${isBillingPopupActive ? 'active' : ''}`} id="billingDetails">
          <div className="popup-container">
            <div className="popup-wrapper">
              <div className="header-box d-flex popup-header text-center">
                <h2 className="page-header">Billing Detail</h2>
                <a
                  href="#"
                  onClick={() => removePopup()}
                  className="popup-closebtn"
                >×</a
                >
              </div>
              <div className="popup-body">
                <ul className="bill-details-list">
                  <li className="two-col-list">
                    <p>Total payable Amount</p>
                    <p>₹ {totalpay ? totalpay : ''}</p>
                  </li>

                  <li className="two-col-list color-blue f-bold">
                    <p>Discount applied</p>
                    <p>-₹ {discountTotal ? discountTotal : 0.00}</p>
                  </li>
                  <li className="two-col-list f-bold outline" >

                    <p>Gross payable</p>
                    <p>₹ {rsFilter(totalpay - discountTotal)}</p>
                  </li>
                  <li className="two-col-list">
                    <p className="pb-0">GST</p>
                    <p className="pb-0">₹{totalpay - discountTotal ? rsFilter(totalGST) : 0}</p>
                  </li>

                  <li className="two-col-list f-bold fill-row">
                    <p>Net payable</p>
                    <p>₹ {totalAmount}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <HideFooter />

      </div>
    </>
  );
};
export default PaymentPage;




