import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.css";

import Modal from "react-bootstrap/Modal";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  RAZOR_PAY_KEY,
  ASSESSMENT_YEAR,
  imagePath,
} from "../../../constants";
import {
  apiCall,
  fetchEncryptData,
  getParentUserId,
  getUserId,
  loginRedirectGuest,
  getItemLocal,
} from "../../../common_utilities";
import commonEncode from "../../../commonEncode";
import SimpleReactValidator from "simple-react-validator";
import FintooLoader from "../../../components/FintooLoader";
import { useDispatch } from "react-redux";
import ApplyWhiteBg from "../../../components/ApplyWhiteBg";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import FintooInlineLoader from "../../../components/FintooInlineLoader";

//import Razorpay from 'razorpay';

function UpgradePlan() {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [show, setShow] = useState(false);
  const [showcoupon, setShowCoupon] = useState(false);
  const [isNDAChecked, setNDAChecked] = useState(false);
  const [userDetails, setUserDetails] = useState([]);
  const [paymentId, setPaymentId] = useState("");
  const [planDetails, setPlanDetails] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkPaymentStatus, setCheckPaymentStatus] = useState(false);
  const [checkPaymentStatusText, setCheckPaymentStatusText] = useState("");
  const [paymentLink, setPaymentLink] = useState('');
  const queryParameters = new URLSearchParams(window.location.search)

  const [, forceUpdate] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const payment_amount = atob(queryParameters.get("payment_amount"))
  const plan_id = atob(queryParameters.get("plan_id"))
  const rm_id = atob(queryParameters.get("rm_id"))
  const user_id = atob(queryParameters.get("user_id"))
  const plan_name = atob(queryParameters.get("plan_name"))


  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      // style: 'currency',
      currency: "INR",
    }).format(value);

  //   const member = getItemLocal('pd')
  //   const docUserId = member.user_id  

  useEffect(() => {
    // paymentStatus();
  }, []);

  const paymentStatus = async () => {
    var res = await axios.post('', {
      user_id: docUserId,
      check_payment: "1",
      assessment_year: ASSESSMENT_YEAR,
    });
    if (res.data["error_code"] == "100") {
      setIsLoading(false);
      setCheckPaymentStatus(true);
      setTimeout(() => {
        setCheckPaymentStatusText('Checking payment status...');
        setTimeout(() => {
          setCheckPaymentStatusText('Redirecting to document upload...');
          setTimeout(() => {
            navigate(`${process.env.PUBLIC_URL}/itr-upload-docs`);
            dispatch({
              type: "RENDER_TOAST",
              payload: { message: res.data["message"], type: "success" },
            });
          }, 2000);
        }, 2000)
      }, 2000);

      return;
    } else {
      setIsLoading(false);
      navigate(`${process.env.PUBLIC_URL}/itr-plan-subscription`);
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: resp_data["message"], type: "success" },
      });
      return;
    }
  };

  //   const handleShowcoupon = () => {
  //     simpleValidator.current.hideMessages();
  //     setShowCoupon(true);
  //   };

  //   const handleCloseCoupon = () => {
  //     setDiscount(0);
  //     setCouponCode("");
  //     setShowCoupon(false);
  //     setGst(planDetails.plan_gst_amount);
  //     forceUpdate(1);
  //   };

  //   const handleRemoveCoupon = () => {
  //     setDiscount(0);
  //     setCouponCode("");
  //     setCouponApplied(false);
  //     setGst(planDetails.plan_gst_amount);
  //     forceUpdate(1);
  //   };

  //   const handleApplyCoupon = async () => {
  //     try {
  //       let formValid = simpleValidator.current.allValid();
  //       simpleValidator.current.showMessages();
  //       forceUpdate(1);
  //       if (formValid == false) return;

  //       const resp = await apiCall(TAX_CHECK_VALID_COUPON_API_URL, {
  //         coupon_code: couponCode,
  //       });
  //       if (resp["error_code"] != "100") {
  //         dispatch({
  //           type: "RENDER_TOAST",
  //           payload: { message: resp["message"], type: "error" },
  //         });
  //         setCouponCode("");
  //         setShowCoupon(false);
  //         simpleValidator.current.hideMessages();
  //         return;
  //       }

  //       let respData = resp["data"][0];
  //       let Discount = respData["c_discount"];
  //       if (respData["c_ispercentage"] == 1) {
  //         Discount = Math.round(
  //           (planDetails.plan_original_price / 100) * respData["c_discount"]
  //         );
  //       }

  //       if (planDetails.plan_original_price - Discount == 0) {
  //         setGst(0);
  //       } else {
  //         let payableAmt = planDetails.plan_original_price - Discount;
  //         let Gst = Math.round((payableAmt / 100) * 18);
  //         setGst(Gst);
  //       }

  //       setDiscount(Discount);
  //       setShowCoupon(false);
  //       setCouponApplied(true);
  //       simpleValidator.current.hideMessages();
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   useEffect(() => {
  //     if (getUserId() == null) {
  //       loginRedirectGuest();
  //     }
  //     try {
  //       let plan = getItemLocal("pid");
  //       if (!plan) navigate(`${process.env.PUBLIC_URL}/itr-file`);
  //       setPlanDetails(plan);
  //       setGst(plan.plan_gst_amount);
  //     } catch {
  //       navigate(`${process.env.PUBLIC_URL}/itr-file`);
  //     }

  //     fetchUserDetails();
  //     document.body.classList.add("bg-color");
  //     return () => {
  //       document.body.classList.remove("bg-color");
  //     };
  //   }, []);

  async function displayRazorpay() {
    // let totalPayable = planDetails.plan_original_price;
    // let Discount = discount;
    // let grossPayable = planDetails.plan_original_price - discount;
    // let netGst = gst;
    let netPayable = payment_amount;
    let plan_id = atob(queryParameters.get("plan_id"));
    let rm_id = atob(queryParameters.get("rm_id"));

    const data = {
      user_id: user_id,
      payment_amount: Number(payment_amount),
      plan_id: Number(atob(queryParameters.get("plan_id"))),
      rm_id: Number(atob(queryParameters.get("rm_id"))),
    };

    const res = await loadScript(RAZORPAY_CHECKOUT);
    // creating a new order
    const result = await axios.post(RAZORPAY_CREATE_ORDER, data);
    // Getting the order details back
    const { amount, id: order_id, currency } = result.data.data;

    const options = {
      key: RAZOR_PAY_KEY, // Enter the Key ID generated from the Dashboard
      amount: Number(payment_amount),
      currency: currency,
      name: "Fintoo",
      description: "ITR",
      image:
        "https://stg.minty.co.in/static/userflow/img/fintoo_razor_pay_logo.png",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          user_id: user_id,
          payment_amount: netPayable,
          plan_id: atob(queryParameters.get("plan_id")),
          rm_id: atob(queryParameters.get("rm_id")),
          upgrade: "plan"
        };
        setIsLoading(true);
        const result = await axios.post(RAZORPAY_PAYMENT_SUCCESS, data);
        if (result.data.error_code == "100") {
          setIsLoading(false);
          navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentSucess?a=itr`);
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: result.data.message, type: "success" },
          });
          return;
        } else {
          setIsLoading(false);
          navigate(`${process.env.PUBLIC_URL}/itr-plan-upgrade`);
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: result.data.message, type: "fail" },
          });
          return;
        }
        currency;
      },
      prefill: {
        name: userDetails.name ? userDetails.name : userDetails.email,
        email: userDetails.email,
        contact: userDetails.mobile,
      },
      notes: {
        address:
          "Fintoo Wealth Private Limited B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059]",
      },
      theme: {
        color: "#042b62",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", async function (response) {
      if (response.error.reason == "payment_failed") {
        var failure_payload = JSON.stringify({
          razorpay_order_id: response.error.metadata.order_id,
          razorpay_payment_id: response.error.metadata.payment_id,
          user_id: user_id,
          payment_amount: Number(payment_amount),
        });
        let res = await axios.post(RAZORPAY_PAYMENT_FAILURE, failure_payload);
        setIsLoading(false);
        navigate(`${process.env.PUBLIC_URL}/direct-mutual-fund/PaymentFailed?a=itr`);
        return;
      }
    });

  }
  const loadScript = (src) => {
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

  const fetchUserDetails = async () => {
    // try {
    //   var payload = {
    //     method: "post",
    //     url: TAX_GET_USER_PERSONAL_DETAILS_API_URL,
    //     data: { user_id: getParentUserId(), data_belongs_to: DATA_BELONGS_TO },
    //   };

    //   var res = await fetchEncryptData(payload);
    //   setUserDetails(res.data);
    // } catch (e) {}
  };

  return (
    <>
      <HideFooter />
      <HideHeader />
      <ApplyWhiteBg />

      <FintooLoader isLoading={isLoading} />

      {checkPaymentStatus == false && (<>
        <div className={`${styles.PlanSubscription}`}>
          <div className={`${styles.login_header}`}>
            <Link
              className="text-decoration-none"
              to={`${process.env.PUBLIC_URL}/itr-profile`}
            >
              <div
                className={`${styles.back_arrow}`}
                onClick={() => {
                  navigate(`${process.env.PUBLIC_URL}/itr-plan-profile`);
                }}
              >
                <img
                  src={imagePath + "/static/media/Images/userflow/img/icons/back-arrow.svg"}
                  alt="Back Arrow"
                />
              </div>
            </Link>
          </div>

          <section className={`${styles.login_section}`}>
            <div className="container-fluid">
              <div className="row ">
                <div className="col-12 col-md-7">
                  <div className={`${styles.login_block}`}>
                    <h2 className={`text-center ${styles.page_header}`}>
                      UPGRADE PLAN
                    </h2>
                    <p className={`text-center ${styles.page_subTxt}`}>
                      Tax Filing
                    </p>
                  </div>
                  <div className="row">
                    <div className="col-md-7 m-auto">
                      <div className={`${styles.PlanType}`}>
                        <div className={`${styles.radio_subs_radio}`}>
                          <div className="row">
                            <div className="col-8">
                              <label>{plan_name}</label>
                            </div>
                            <div
                              className="col-4 text-align-right"
                              style={{ borderLeft: "1px solid #ccc" }}
                            >
                              <div className={`${styles.subs_right_amt}`}>
                                ₹ {numberFormat(payment_amount)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="row form-row text-center"
                    id="couponapply_section"
                  >
                    {/* <div className="col-md-7 m-auto">
                      <div className="d-flex align-items-center justify-content-between pt-2">
                        <div
                          className={`${styles.coupon_block} ${styles.material} ${styles.applyoffer_div} `}
                        >
                          <span>
                            <img
                              alt="Apply Offer"
                              src="https://images.minty.co.in/static/userflow/img/icons/giftbox.png"
                            />
                            <button
                              type="button"
                              value="Apply coupon code"
                              className={`${styles.apply_coupon_code}`}
                              onClick={handleShowcoupon}
                              disabled={couponApplied}
                            >
                              {couponApplied ? couponCode : "Apply Offer"}
                            </button>
                            <span className={`${styles.nextArrow}`}>
                              <IoIosArrowDroprightCircle />{" "}
                            </span>
                          </span>
                        </div>
                        {couponApplied && (
                          <div>
                            <i
                              class="fa fa-trash"
                              aria-hidden="true"
                              onClick={handleRemoveCoupon}
                            ></i>
                          </div>
                        )}
                      </div>
                    </div> */}
                  </div>
                  <div className="row form-row text-center">
                    <div className="col-md-7 m-auto">
                      <div className={`${styles.pay_block}`}>
                        <div>
                          <div className="row">
                            <div className="col-8">
                              <div
                                className={`${styles.text}`}
                                style={{ textAlign: "left" }}
                              >
                                Total Payable Amount
                              </div>
                            </div>
                            <div className="col-4">
                              <div className={`${styles.price}`}>
                                ₹ {numberFormat(payment_amount)}
                              </div>
                            </div>
                          </div>

                          {couponApplied && (
                            <div className="row">
                              <div className="col-8">
                                <div
                                  className={`${styles.text}`}
                                  style={{ textAlign: "left" }}
                                >
                                  Discount Applied{" "}
                                  <span className={styles.discount}>
                                    ({couponCode})
                                  </span>
                                </div>
                              </div>
                              <div className="col-4">
                                <div
                                  className={`${styles.price} ${styles.discount}`}
                                >
                                  - ₹ {discount}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className={`${styles.net_payable}`}>
                          <div className="row mt-4">
                            <div className="col-8">
                              <div
                                className={`${styles.text}`}
                                style={{ textAlign: "left" }}
                              >
                                Net Payable
                                <sup>
                                  {/* <span>
                                    <img
                                      onClick={handleShow}
                                      className="pointer"
                                      style={{ width: 15, paddingLeft: "4px" }}
                                      src="https://images.minty.co.in/static/userflow/img/icons/pink-information.svg"
                                    />
                                  </span> */}
                                </sup>
                              </div>
                            </div>
                            <div className="col-4">
                              <div
                                style={{ textAlign: "right", fontWeight: "bold" }}
                                className={`${styles.price}`}
                              >
                                ₹{" "}
                                {numberFormat(
                                  payment_amount
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row form-row">
                    <div className="col-md-7 m-auto offset-md-2">
                      <div
                        className={`${styles.agreement_block}`}
                        style={{ marginTop: 0 }}
                      >
                        <div className="material-checkbox">
                          <div
                            className={`${styles.checkbox_container}`}
                            style={{ margin: 0 }}
                          >
                            <input
                              type="checkbox"
                              name="nda"
                              id="ndacheck"
                              className={`${styles.custom_checkbox}`}
                              style={{ zIndex: "2 !important" }}
                              checked={isNDAChecked}
                            // onChange={(e) => setNDAChecked(e.target.value)}
                            />
                            {/* <label
                              htmlFor="nda"
                              className={`${styles.checkbox_label}`}
                            >
                              I have read and accept the
                              <a
                                href="https://www.fintoo.in/terms-conditions/"
                                target="_self"
                              >
                                Terms & Conditions
                              </a>
                            </label> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row form-row mt-4">
                    <div className="col">
                      <div className="btn-container text-center">
                        <button
                          onClick={() => displayRazorpay()}
                          type="button"
                          id="razorPay"
                          className={`${styles.default_btn}`}
                        // disabled={!isNDAChecked}
                        >
                          Pay
                        </button>
                        {paymentId && <p>Payment ID: {paymentId}</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`d-none d-md-block col-md-5 h100 ${styles.login_illustration}`}
                ></div>
              </div>
            </div>
          </section>
        </div>
        {/* <Modal
          show={show}
          centered
          className="billing_Modal"
          // className={`modal-dialog  Billingpopup ${styles.Billingpopup} `}
        >
          <div className={`${styles.BillingHeader}`}>
            <div className="w-100">Billing Details</div>
            <span>
              <IoClose onClick={handleClose} />
            </span>
          </div>
          <div>
            <ul className={`${styles.bill_details_list}`}>
              <li className={`${styles.two_col_list}`}>
                <div>Total payable Amount</div>
                <div>₹ {planDetails.plan_original_price}</div>
              </li>
              <li className={`${styles.two_col_list}  ${styles.f_bold}`}>
                <div className={`${styles.Bottom}`}>Discount applied</div>
                <div className={`${styles.Bottom}`}>-₹ {discount}</div>
              </li>
              <li className={`outline ${styles.two_col_list}  ${styles.f_bold}`}>
                <div className={`${styles.Bottom}`}>Gross payable</div>
                <div className={`${styles.Bottom}`}>
                  ₹ {planDetails.plan_original_price - discount}
                </div>
              </li>
              <li className={`outline ${styles.two_col_list}`}>
                <div className={`${styles.Bottom}`}>GST (18%)</div>
                <div className={`${styles.Bottom}`}>₹ {gst}</div>
              </li>
              <li
                className={`outline ${styles.two_col_list} ${styles.fill_row} ${styles.f_bold}`}
              >
                <div>Net payable</div>
                <div>₹ {planDetails.plan_original_price - discount + gst}</div>
              </li>
            </ul>
          </div>
        </Modal> */}
        {/* Coupon */}
        {/* <Modal
          show={showcoupon}
          centered
          className=" coupon_modal"
          // className={`modal-dialog  Billingpopup ${styles.Billingpopup} `}
        >
          <div className={`${styles.BillingHeader}`}>
            <div className="w-100">Apply Offer</div>
            <span>
              <IoClose onClick={handleCloseCoupon} />
            </span>
          </div>
          <div>
            <form className="ng-pristine ng-valid" siq_id="autopick_4374">
              <ul
                className={`${styles.coupon_list}`}
                style={{ margin: "10px 0" }}
              >
                <li>
                  <div className={`${styles.coupon_name}`}>
                    <div>
                      <input
                        autoComplete="off"
                        type="text"
                        name="couponCode"
                        id="couponCode"
                        value={couponCode}
                        className={`${styles.coupon}`}
                        style={{
                          width: 128,
                          paddingLeft: 5,
                          paddingRight: 5,
                          textAlign: "center",
                          marginRight: 10,
                        }}
                        placeholder="Enter Coupon"
                        onChange={(e) => {
                          setCouponCode(e.target.value.replaceAll(" ", ""));
                        }}
                        // onBlur={() => {
                        //   simpleValidator.current.showMessageFor("couponCode");
                        // }}
                      />
                      {simpleValidator.current.message(
                        "couponCode",
                        couponCode?.replaceAll(" ", ""),
                        "required",
                        {
                          messages: {
                            required: "Please enter valid coupon code",
                          },
                        }
                      )}
                    </div>
                    <button
                      type="button"
                      value="Apply"
                      onClick={() => {
                        handleApplyCoupon();
                      }}
                      className={`${styles.coupon1} ${styles.default_btn}`}
                    >
                      Apply
                    </button>
                  </div>
                </li>
              </ul>
            </form>
          </div>
        </Modal> */}
      </>)}

      {checkPaymentStatus == true && (
        <>
          <p style={{ paddingTop: '4rem' }}></p>
          <FintooInlineLoader isLoading={true} />
          <p className="text-center">{checkPaymentStatusText}</p>
        </>
      )}
    </>
  );
}

export default UpgradePlan;
