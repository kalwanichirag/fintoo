import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.css";
import Modal from "react-bootstrap/Modal";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  ASSESSMENT_YEAR,
  imagePath,
  DATA_BELONGS_TO,
  X_CRM_ACCESS_TOKEN,
  X_CRM_USER,
} from "../../../constants";
import {
  Createorderid,
  Getcouponlist,
  Paymentsuccess,
  VerifyPayment,
} from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";
import {
  getUserId,
  loginRedirectGuest,
  getItemLocal,
} from "../../../common_utilities";
import SimpleReactValidator from "simple-react-validator";
import FintooLoader from "../../../components/FintooLoader";
import { useDispatch } from "react-redux";
import ApplyWhiteBg from "../../../components/ApplyWhiteBg";
import HideFooter from "../../../components/HideFooter";
import HideHeader from "../../../components/HideHeader";
import FintooInlineLoader from "../../../components/FintooInlineLoader";
import giftBox from "../../../Assets/Images/giftbox.png";

function PlanSubscription() {
  const simpleValidator = useRef(new SimpleReactValidator());
  const [show, setShow] = useState(false);
  const [showcoupon, setShowCoupon] = useState(false);
  const [isNDAChecked, setNDAChecked] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [planDetails, setPlanDetails] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkPaymentStatus, setCheckPaymentStatus] = useState(false);
  const [checkPaymentStatusText, setCheckPaymentStatusText] = useState("");
  const [couponList, setCouponList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [, forceUpdate] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const plan = getItemLocal("pid") || {};
  const pd = getItemLocal("pd") || {};
  const params = new URLSearchParams(window.location.search);
  const leadIdFromApi = (localStorage.getItem("user_data") || "") ? JSON.parse(localStorage.getItem("user_data")) : {};

  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      // style: 'currency',
      currency: "INR",
    }).format(value);


  const webengagePayload = {
    url: window.location.href,
    "list price": Number(plan?.plan_amount || 0),
    MRP: Number(plan?.plan_description?.original_amount || 0),
    "list discount": Math.max(
      Number(plan?.plan_description?.original_amount || 0) -
      Number(plan?.plan_amount || 0),
      0
    ),
    "plan name": plan?.plan_name || "",
    "plan id": plan?.plan_uuid || "",
    "lead id": leadIdFromApi.user_lead_id ? String(leadIdFromApi.user_lead_id) : "",
    name: pd?.full_name || "",
    email: pd?.email || "",
    utm_source: params.get("utm_source") || "",
    phone: pd?.mobile ? `+91${pd.mobile}` : "",
    dob: pd?.dob ? new Date(pd.dob) : "",
    gender: pd?.gender || "",
    "pan card": !!pd?.pan,
    "Service": plan?.service || "ITR Filing"
  };

  const member = getItemLocal("pd") ?? "";
  const docUserId = member.user_id ?? "";

  const calculateGST = (amount) => {
    return Math.round(amount * 0.18);
  };

  const loadCashfreeScript = () => {
    return new Promise((resolve) => {
      if (window.Cashfree) {
        resolve(true);
        return;
      }

      const script =
        document.createElement("script");

      script.src =
        "https://sdk.cashfree.com/js/v3/cashfree.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

const CreateOrderID = async () => {
  try {
    const response = await Createorderid({
      amount: Math.round(Number(totalAmount)),
      user_id: docUserId,
    });

    if (
      response.status_code === 200 &&
      response.data?.order_id
    ) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const VerifyCashfreePayment = async (
  orderId
) => {
  try {
    const response = await VerifyPayment(
      orderId
    );

    if (
      response.status_code === 200 &&
      response.data?.payment_status
    ) {
      return response;
    }

    return {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

const handlePaymentSuccess = async (
  paymentId,
  orderId
) => {
  try {
    setIsLoading(true);

    const payload = {
      user_id: docUserId,
      plan_uuid:
        planDetails.plan_uuid ||
        planDetails.plan_id,
      total_amount: (planDetails.plan_amount).toString(),
      coupon_name: couponApplied
        ? couponCode
        : "",
      trxn_id: paymentId,
      data_belongs_to: DATA_BELONGS_TO,
    };

    const response = await Paymentsuccess(
      payload
    );

    if (response.status_code === 200) {

      if (window?.webengage?.track) {
        window.webengage.track("payment successful", {
          ...webengagePayload,
          "transaction id": paymentId,
          "payment mode": "Cashfree",
          "order id": orderId,
          "coupon code": couponApplied ? couponCode : "",
          "coupon discount amount": discount,
          "total payable": Number(planDetails.plan_amount || 0) + gst,
          "net payable": Number(totalAmount || 0),
        });
      }
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message:
            response.message ||
            "Payment successful",
          type: "success",
        },
      });

      navigate(
        `${process.env.PUBLIC_URL}/itr-upload-docs`
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  const handleShowcoupon = () => {
    simpleValidator.current.hideMessages();
    setShowCoupon(true);
  };

  const handleCloseCoupon = () => {
    setDiscount(0);
    setCouponCode("");
    setShowCoupon(false);

    const planAmount = Number(planDetails?.plan_amount || 0);
    const gstAmount = calculateGST(planAmount);

    setGst(gstAmount);
    setTotalAmount(planAmount + gstAmount);

    forceUpdate(1);
  };

 const handleRemoveCoupon = () => {
  setDiscount(0);
  setCouponCode("");
  setCouponApplied(false);

   const planAmount = Number(planDetails?.plan_amount || 0);
   const gstAmount = calculateGST(planAmount);

   setGst(gstAmount);
   setTotalAmount(planAmount + gstAmount);

   if (window?.webengage?.track) {
     window.webengage.track("coupon removed", {
       ...webengagePayload,
       "coupon code": couponCode,
       "coupon discount amount": discount,
       "total payable": Number(planAmount) + gstAmount,
       "net payable": Number(planAmount) + gstAmount,
     });
   }

  forceUpdate(1);
};

const handleApplyCoupon = () => {
  let formValid = simpleValidator.current.allValid();

  simpleValidator.current.showMessages();
  forceUpdate(1);

  if (!formValid) return;

  const matchedCoupon = couponList.find(
    (c) =>
      c.coupon_name?.toLowerCase() ===
        couponCode?.toLowerCase() &&
      c.is_active === 1
  );

  if (!matchedCoupon) {
    dispatch({
      type: "RENDER_TOAST",
      payload: {
        message: "Invalid Coupon",
        type: "error",
      },
    });
    return;
  }

  if (
    matchedCoupon.coupon_valid_plan &&
    matchedCoupon.coupon_valid_plan !== planDetails.name
  ) {
    dispatch({
      type: "RENDER_TOAST",
      payload: {
        message: "Coupon not valid for selected plan",
        type: "error",
      },
    });
    return;
  }

  let discountAmount = 0;

  if (matchedCoupon.is_percentage === 1) {
    discountAmount = Math.floor(
      (planDetails.plan_amount *
        matchedCoupon.coupon_value) /
        100
    );
  } else {
    discountAmount = matchedCoupon.coupon_value;
  }

  const grossAmount = Math.max(
    0,
    planDetails.plan_amount - discountAmount
  );

  const gstAmount =
    grossAmount > 0
      ? calculateGST(grossAmount)
      : 0;

  const finalAmount =
    grossAmount + gstAmount;

  setDiscount(discountAmount);
  setGst(gstAmount);
  setTotalAmount(finalAmount);
  setCouponApplied(true);
  setShowCoupon(false);

  if (window?.webengage?.track) {
    window.webengage.track("coupon applied", {
      ...webengagePayload,
      "coupon code": couponCode,
      "coupon discount amount": discountAmount,
      "total payable": Number(planDetails.plan_amount || 0) + gstAmount,
      "net payable": Number(finalAmount),
    });
  }

  simpleValidator.current.hideMessages();
};

  useEffect(() => {
  fetchCoupons();
}, []);

const fetchCoupons = async () => {
  try {
    const headers = {
      "X-CRM-Access-Token": X_CRM_ACCESS_TOKEN,
      "X-CRM-User": X_CRM_USER,
    };

    const response = await axios.get(
      `${process.env.REACT_APP_CRM_BASE_URL}/get_coupon_list`,
      { headers }
    );

    if (response?.data?.data) {
      setCouponList(response.data.data);
    }
  } catch (error) {
    console.log("Coupon API Error:", error);
  }
};
  useEffect(() => {
    try {
      if (getUserId() == null) {
        loginRedirectGuest();
        throw 'Login required';
      }
      let plan = getItemLocal("pid");
      if (!plan) {
        navigate(`${process.env.PUBLIC_URL}/itr-file`);
        throw 'pid missing';
      }
      const planAmount = Number(plan.plan_amount || 0);
      const gstAmount = calculateGST(planAmount);

      setPlanDetails(plan);
      setGst(gstAmount);
      setTotalAmount(planAmount + gstAmount);
      // fetchUserDetails();
      document.body.classList.add("bg-color");
    } catch (e) {
      console.error("PlanSub---->", e);
    }
    return () => {
      document.body.classList.remove("bg-color");
    };
  }, []);

  const checkout = async () => {
  if (totalAmount === 0) {
    await handlePaymentSuccess(
      `FREE_${Date.now()}`,
      null
    );
    return;
  }

  const loaded =
    await loadCashfreeScript();

  if (!loaded) return;

  const order =
    await CreateOrderID();

  if (!order) return;

    if (window?.webengage?.track) {
      window.webengage.track("payment initiated", {
        ...webengagePayload,
        "coupon code": couponApplied ? couponCode : "",
        "coupon discount amount": discount,
        "total payable": Number(planDetails.plan_amount || 0) + gst,
        "net payable": Number(totalAmount),
      });
    }

    const cashfree = window.Cashfree({
      mode:
        process.env.REACT_APP_MODE?.toLowerCase() === "live"
          ? "production"
          : "sandbox",
    });

  const checkoutOptions = {
    paymentSessionId:
      order.payment_session_id,
    redirectTarget: "_modal",
  };

  cashfree
    .checkout(checkoutOptions)
    .then(async (result) => {
      if (result.paymentDetails) {
        const verify =
          await VerifyCashfreePayment(
            order.order_id
          );

        if (
          verify?.status_code === 200 &&
          verify?.data?.payment_status === "SUCCESS"
        ) {
          await handlePaymentSuccess(
            verify.data.payment_id,
            order.order_id
          );
        } else {
          if (window?.webengage?.track) {
            window.webengage.track("payment failed", {
              ...webengagePayload,
              "failure reason": verify?.data?.payment_message || "Payment Failed",
              "transaction id": verify?.data?.payment_id || "",
              "payment mode": "Cashfree",
              "order id": order.order_id,
              "coupon code": couponApplied ? couponCode : "",
              "coupon discount amount": discount,
              "total payable": Number(planDetails.plan_amount || 0) + gst,
              "net payable": Number(totalAmount),
            });
          }

          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Payment failed",
              type: "error",
            },
          });
        }
      }
    });
};

  return (
    <>
      <HideFooter />
      <HideHeader />
      <ApplyWhiteBg />

      <FintooLoader isLoading={isLoading} />

      {checkPaymentStatus == false && (
        <>
          <div className={`${styles.PlanSubscription}`}>
            <div className={`${styles.login_header}`}>
              <Link
                className="text-decoration-none"
                to={`${process.env.PUBLIC_URL}/itr-profile`}
              >
                <div
                  className={`${styles.back_arrow}`}
                >
                  <img
                   src={imagePath + "/static/media/Images/icons/back-arrow.svg"}
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
                        Subscription
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
                                <label>{planDetails.plan_name}</label>
                              </div>
                              <div
                                className="col-4 text-align-right"
                                style={{ borderLeft: "1px solid #ccc" }}
                              >
                                <div className={`${styles.subs_right_amt}`}>
                                  ₹{" "}
                                  {numberFormat(
                                    planDetails.plan_amount
                                  )}
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
                      <div className="col-md-7 m-auto">
                        <div className="d-flex align-items-center justify-content-between pt-2">
                          <div
                            className={`${styles.coupon_block} ${styles.material} ${styles.applyoffer_div} `}
                          >
                            <span>
                              <img
                                alt="Apply Offer"
                                 src={giftBox}
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
                      </div>
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
                                  ₹{" "}
                                  {numberFormat(
                                    planDetails.plan_amount
                                  )}
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
                                    <span>
                                      <img
                                        onClick={handleShow}
                                        className="pointer"
                                        style={{
                                          width: 15,
                                          paddingLeft: "4px",
                                        }}
                                        src={imagePath + "/static/media/Images/icons/pink-information.svg"}
                                      />
                                    </span>
                                  </sup>
                                </div>
                              </div>
                              <div className="col-4">
                                <div
                                  style={{
                                    textAlign: "right",
                                    fontWeight: "bold",
                                  }}
                                  className={`${styles.price}`}
                                >
                                  ₹{" "}
                                  {numberFormat(totalAmount)} 
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
                            onClick={checkout}
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
          <Modal
  show={show}
  centered
  className="billing_Modal"
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
        <div>₹ {numberFormat(planDetails?.plan_amount || 0)}</div>
      </li>

      <li className={`${styles.two_col_list} ${styles.f_bold}`}>
        <div className={`${styles.Bottom}`}>Discount applied</div>
        <div className={`${styles.Bottom}`}>
          - ₹ {numberFormat(discount)}
        </div>
      </li>

      <li
        className={`outline ${styles.two_col_list} ${styles.f_bold}`}
      >
        <div className={`${styles.Bottom}`}>Gross payable</div>
        <div className={`${styles.Bottom}`}>
          ₹{" "}
          {numberFormat(
            (planDetails?.plan_amount || 0) - discount
          )}
        </div>
      </li>

      <li className={`outline ${styles.two_col_list}`}>
        <div className={`${styles.Bottom}`}>GST (18%)</div>
        <div className={`${styles.Bottom}`}>
          ₹ {numberFormat(gst)}
        </div>
      </li>

      <li
        className={`outline ${styles.two_col_list} ${styles.fill_row} ${styles.f_bold}`}
      >
        <div>Net payable</div>
        <div>₹ {numberFormat(totalAmount)}</div>
      </li>
    </ul>
  </div>
</Modal>
          {/* Coupon */}
          <Modal
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
          </Modal>
        </>
      )}

      {checkPaymentStatus == true && (
        <>
          <p style={{ paddingTop: "4rem" }}></p>
          <FintooInlineLoader isLoading={true} />
          <p className="text-center">{checkPaymentStatusText}</p>
        </>
      )}
    </>
  );
}

export default PlanSubscription;
