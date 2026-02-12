import { useState, useEffect } from "react";
import {
  getItemLocal,
  getParentUserId,
  getPublicMediaURL,
  getUserId,
  setItemLocal,
} from "../common_utilities";
import FintooLoader from "../components/FintooLoader";
import "../checkboxstyle.css";
import { BASE_API_URL, DATA_BELONGS_TO } from "../constants";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import HideHeader from "../components/HideHeader";
import HideFooter from "../components/HideFooter";
import { Link, useNavigate } from "react-router-dom";
import {
  Createorderid,
  Getcouponlist,
  Getpaymentstatus,
  Paymentfail,
  Paymentsuccess,
} from "../FrappeIntegration-Services/services/payment-api/paymentapiService";
import { IoMdArrowBack } from "react-icons/io";
import style from "./style.module.css";
import StepComponent from "../components/StepsComponent";
import { ExpertNameInfo } from "./ExpertAppointment";
import { check_all_status_api } from "../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getAppointmentDetails } from "../FrappeIntegration-Services/services/tax-planning-api/taxApiService";
import { FaGift } from "react-icons/fa";

const PaymentPage = () => {
  let navigate = useNavigate();
  useEffect(() => {
    document.body.classList.add("main-layout");
    return () => {
      document.body.classList.remove("main-layout");
    };
  }, []);

  const planUUID = localStorage.getItem("plan_uuid");
  let memberData = getItemLocal("member");

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
    imagepath: "",
  });

  const retrievedPlan = JSON.parse(localStorage.getItem("financialPlan"));
  const planType = retrievedPlan?.plan_name;
  const planFreq = retrievedPlan?.plan_freq == 6 ? "Half Yearly" : "";
  const baseAmount = retrievedPlan?.plan_amount;
  const totalpay = retrievedPlan?.plan_amount;
  const planId = retrievedPlan?.plan_uuid;
  const selectedPlanId = retrievedPlan?.name;
  const [paymentStatus, setPaymentstatus] = useState([]);
  const [coupon, setCoupon] = useState([]);
  const [enteredCoupon, setEnteredCoupon] = useState("");
  const [couponList, setCouponList] = useState([]);
  const [couponList1, setCouponList1] = useState([]);
  const [couponApplied, setCouponApplied] = useState("");
  const [discountTotal, setDiscountTotal] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [isCouponInvalid, setCouponInvalid] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [orderId, setOrderID] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [rawAmount, setRawAmount] = useState(0);

  useEffect(() => {
    if (planUUID === "tax_plan" && paymentPayloadData?.gross_amount) {
      setTotalAmount(paymentPayloadData.gross_amount);
    } else if (totalpay) {
      setTotalAmount(totalpay);
    }
  }, [planUUID, paymentPayloadData, totalpay]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await Getcouponlist();
        if (response.status_code === 200) {
          setCouponList(response.data);
        }
      } catch (error) {
        console.error("Error fetching coupons", error);
      }
    };

    fetchCoupons();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isNDAChecked, setNDAChecked] = useState(true);
  const [NDAMsg, setNDAMsg] = useState("");
  const [isCouponPopUpActive, setCouponActive] = useState(false);
  const [isBillingPopupActive, setBillingPopupActive] = useState(false);
  const [isBookingPopUpActive, setBookingPopUpActive] = useState(false);
  const [productInfopay, setProductInfopay] = useState(0);
  const [totalpaywithGST, setTotalPaywithGST] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [sessionData, setSessionData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isHasPlan, setIsHasPlan] = useState(0);
  const [planCartPay, setPlanCartPay] = useState([]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isRecurringDisabled, setIsRecurringDisabled] = useState(false);
  const [subscriptionMonths, setSubscriptionMonths] = useState(null);
  const [grossPayable, setGrossPayable] = useState(false);
  const [planImg, setPlanImg] = useState("");
  const [plansubcat, setPlansubcat] = useState("");
  const [monthlyAmount, setMonthlyamount] = useState("");
  const [rm_id, setRMid] = useState("");
  const [rmdetailsName, setRMdetailsName] = useState("");
  const [rmdetailsPosition, setRMdetailsPosition] = useState("");
  const [rmdetailsImg, setRMdetailsImg] = useState("");
  const [forQuarter, setForQuarter] = useState("");
  const [netPayable, setNetPayable] = useState("");
  const [isFAChecked, setFAChecked] = useState(false);
  const [isOfferInvalid, setInvalidOffer] = useState(false);
  const [login_image, setLoginImage] = useState("");
  const plan_types = {
    1: "Basic",
    2: "Basic Pro",
    3: "Classic",
    4: "Classic Plus",
    5: "Premium",
    6: "Elite",
    7: "Elite Prime",
  };

  const rsFilter = (value) => {
    if (!isNaN(value)) {
      var is_negative = false;
      var result = Math.floor(value).toString();
      if (result.includes("-")) {
        result = result.replace("-", "");
        is_negative = true;
      }

      var lastThree = result.substring(result.length - 3);
      var otherNumbers = result.substring(0, result.length - 3);
      if (otherNumbers != "") lastThree = "," + lastThree;
      var output =
        otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

      if (is_negative == true) {
        output = "-" + output;
      }
      return output;
    }
  };

  const openPopup = (popupName) => {
    if (popupName == "applyCoupon") {
      setCouponActive(true);
      setBillingPopupActive(false);
      setBookingPopUpActive(false);
      setCouponInvalid(false);
      setEnteredCoupon("");
    }
    if (popupName == "billingDetails") {
      setBillingPopupActive(true);
      setCouponActive(false);
      setBookingPopUpActive(false);
    }
    if (popupName == "bookAppointment") {
      setBookingPopUpActive(true);
      setBillingPopupActive(false);
      setCouponActive(false);
    }
  };

  const removePopup = () => {
    setBillingPopupActive(false);
    setBookingPopUpActive(false);
    setCouponActive(false);
  };

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
  };

  const handleNDAClick = (e) => {
    if (e.target.checked == false) {
      setNDAMsg(
        `Please accept ${planUUID == "tax_plan"
          ? "terms and conditions"
          : "Non-Disclosure Agreement"
        }.`
      );
    } else {
      setNDAMsg("");
    }
    setNDAChecked(e.target.checked);
  };

  const handleCouponCodeChange = (value) => {
    setEnteredCoupon(value);
    setCouponInvalid(false);
    setCouponError("");
  };

  const calculateGST = (amount) => {
    return Math.floor(amount * 0.18);
  };

  const applyOfferManual = () => {
    if (enteredCoupon === "") {
      setCouponError("Please enter coupon");
      setCouponInvalid(true);
      return;
    }
    const matchedCoupon = couponList.find(
      (c) =>
        c.coupon_name.toLowerCase() === enteredCoupon.toLowerCase() &&
        c.coupon_status === 1
    );

    if (!matchedCoupon) {
      setCouponError("Invalid Coupon");
      setCouponInvalid(true);
      return;
    }

    // if (matchedCoupon.coupon_valid_count > 10) {
    //   setCouponError("Coupon usage limit exceeded");
    //   setCouponInvalid(true);
    //   return;
    // }

    if (matchedCoupon.coupon_valid_plan !== selectedPlanId) {
      setCouponError("Coupon not valid for selected plan");
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
    const total = totalpay - discount + gst;

    setDiscountTotal(discount);
    setTotalGST(gst);
    setCouponApplied(enteredCoupon);
    setCouponInvalid(false);
    setCouponError("");
    setCouponActive(false);
    setRawAmount(total);
    setTotalAmount(total);
  };

  const CreateOrderID = async () => {
    const data = {
      amount:
        planUUID === "tax_plan"
          ? parseInt(paymentPayloadData.gross_amount)
          : parseInt(totalAmount),
    };

    try {
      const response = await Createorderid(data);

      if (response.status_code === 200 && response.data?.order_id) {
        setOrderID(response.data.order_id);
        return response.data.order_id;
      } else {
        console.error("Order ID generation failed", response);
        return null;
      }
    } catch (error) {
      console.error("Error creating order ID:", error);
      return null;
    }
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

  const Paymentstatus = async () => {
    try {
      const payload = {
        user_id: getUserId(),
        plan_name: planType,
        data_belongs_to: DATA_BELONGS_TO
      };
      const res = await Getpaymentstatus(payload);

      const { status_code, message } = res;

      switch (status_code) {
        case 200:
          setPaymentstatus(res.data);
          return res.data;
        case 404:
          break;
        case 500:
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(message);
          break;
        case 400:
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(message);
          setPaymentstatus([]);
          break;
        case 403:
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(message);
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const razorPay = async () => {
    if (planUUID == "tax_plan") {
      const result = await getAppointmentDetails(getUserId());
      if (result?.data.length > 0) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("You have already paid for this service.");
        navigate(`${process.env.PUBLIC_URL}/commondashboard`);
        return;
      }
    }

    if (isNDAChecked) {
      if (paymentPayloadData.gross_amount !== 0) {
        if (planUUID == "tax_plan") {
          const payload = {
            user_id: getUserId(),
            plan_name: planType,
            data_belongs_to: DATA_BELONGS_TO
          };
          const paymentStatus = await Getpaymentstatus(payload);
          if (paymentStatus && paymentStatus["status_code"] == 200) {
            const today = new Date();
            const plan = paymentStatus?.data;
            const expiryDate = new Date(plan.plan_expiry_date);
            if (selectedPlanId && plan.user_pay_plan_id){
              if (selectedPlanId == plan.user_pay_plan_id) {
                if (today < expiryDate) {
                  toastr.options.positionClass = "toast-bottom-left";
                  toastr.error("You have already paid for this service.");
                  navigate(`${process.env.PUBLIC_URL}/commondashboard`);
                }
              }  
            } else{
              checkout();
            }
          }
          else {
            checkout();
          }
        } else {
          checkout();
        }
      }
    } else {
      setNDAMsg(
        `Please accept ${planUUID == "tax_plan"
          ? "terms and conditions"
          : "Non-Disclosure Agreement"
        }.`
      );
    }
  };

  const checkout = async () => {
    if (!isNDAChecked) {
      setNDAMsg(
        `Please accept ${planUUID == "tax_plan"
          ? "terms and conditions"
          : "Non-Disclosure Agreement"
        }.`
      );
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      // alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const generatedOrderId = await CreateOrderID();
    if (!generatedOrderId) {
      // alert("Order ID generation failed.");
      return;
    }

    const options = {
      key:  process.env.REACT_APP_MODE == "live" ? "rzp_live_rYE1IuyTWkWiDv" : "rzp_test_SA4S6rcFbk4JvI",
      amount:
        planUUID == "tax_plan"
          ? parseInt(paymentPayloadData.gross_amount) * 100
          : totalAmount * 100,
      currency: "INR",
      name: "Fintoo",
      description: "Financial Planning",
      image:
        "https://stg.minty.co.in/static/userflow/img/fintoo_razor_pay_logo.png",
      callback_url: "/razor_pay_payment_success/",
      order_id: orderId,
      prefill: {
        name: memberData[0].name,
        email: memberData[0].user_email,
        contact: "91" + memberData[0].mobile,
      },
      notes: {
        address:
          "Fintoo Wealth Private Limited B/309, Dynasty Business park, Opp Sangam Cinema, Andheri (East), J B Nagar, Mumbai, Maharashtra 400059",
      },
      theme: {
        color: "#042b62",
      },
      readonly: {
        contact: true,
        email: true,
        name: true,
      },
      config: {
        display: {
          hide: [{ method: "paylater" }],
        },
      },
      handler: function (response) {
        if (planUUID === "tax_plan") {
          handlePaySuccess(response, generatedOrderId, false);
        } else {
          handlePaySuccess(response, generatedOrderId, true);
        }
      },
      modal: {
        ondismiss: function () {
          //console.log("Payment popup closed by user");
        },
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();

    // Don’t run this right away — handle failure in `handler` or `modal.ondismiss`
    rzp1.on("payment.failed", async function (response) {
      const failure_payload = {
        user_id: userData.user_id,
        razorpay_order_id: orderId,
        razorpay_payment_id: response.error.metadata.payment_id,
        amount: totalAmount,
        user_pay_plan_id: planUUID,
        user_pay_coupon_code: enteredCoupon || "",
      };
      let decoded_res = await Paymentfail(failure_payload);
      if (decoded_res) {
        window.location.href = "/payment_failure/";
      }
    });
  };

  // For tax-payment - API Pending
  const handlePaySuccess = async (data, generatedOrderId, is_success) => {
    const parsedCouponId =
      paymentPayloadData.c_id !== "" ? paymentPayloadData.c_id : null;

    let api_data_success = {
      razorpay_order_id: generatedOrderId,
      razorpay_payment_id: data.razorpay_payment_id,
      data_belongs_to: DATA_BELONGS_TO,
    };
    
    if (is_success) {
      api_data_success = {
        user_id: getUserId(),
        plan_uuid: planId,
        total_amount: totalpay.toString(),
        coupon_name: couponApplied,
        trxn_id: data.razorpay_payment_id,
        data_belongs_to: DATA_BELONGS_TO
      };
    } else {
      api_data_success = {
        user_id: getUserId(),
        plan_uuid: planUUID,
        total_amount: paymentPayloadData["expertTotalFees"].toString(),
        coupon_name: paymentPayloadData["c_id"],
        trxn_id: data.razorpay_payment_id,
        data_belongs_to: DATA_BELONGS_TO,
        rm_id: paymentPayloadData["expert_id"],
      };
    }

    try {
      setIsLoading(true);
      const response = await Paymentsuccess(api_data_success);

      if (Number(response.status_code) === 200) {
        const planInfo = { plan_id: paymentPayloadData.plan_id };
        localStorage.setItem("FintooUserPlanInfoInfo", JSON.stringify(planInfo));
        localStorage.removeItem("FintooTaxPlanInfo");
        const result = await check_all_status_api(getUserId());

        switch (result?.status_code) {
          case "200":
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
            break;

          case "400":
          case "403":
          case "404":
          case "500":
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error(result?.message || "Something went wrong");
            break;

          default:
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Unexpected error occurred.");
            break;
        }


        return navigate(
          `${process.env.PUBLIC_URL}${is_success ? "/datagathering/about-you" : "/expert-appointment"
          }`
        );
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Payment success handling failed:", error);
    }
  };

  const returnHash = () => {
    var hash_char = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    var token = "";
    for (var i = 0; i < 32; i++) {
      token += hash_char[Math.floor(Math.random() * hash_char.length)];
    }
    return token; //Will return a 32 bit "hash"
  };

  const skippayment = async () => {
   
    var razorpay_payment_id = returnHash();
    if (isNDAChecked) {
      // if (planCartPay.length == 0) {
      //   setIsLoading(false);
      // } else 

      if (validatepaymentform()) {
        // var subscription_freq = planCartPay.subscription_freq;
        // var plan_sub_cat = planCartPay.plan_sub_cat_id;
        if (couponInput != "") {
          setIsRecurring(false);
          setIsRecurringDisabled(true);
        }
        setIsLoading(true);
        const api_data_suceess = {
          user_id: getUserId(),
          plan_uuid: planId,
          total_amount: totalpay.toString(),
          coupon_name: couponApplied,
          data_belongs_to: DATA_BELONGS_TO,
          trxn_id: razorpay_payment_id,
        };
        const response = await Paymentsuccess(api_data_suceess);

        switch (response.status_code) {
          case 200:
            const planInfo = {
              plan_id: paymentPayloadData.plan_id,
            };
            localStorage.setItem("FintooUserPlanInfoInfo", JSON.stringify(planInfo));
            localStorage.removeItem("FintooTaxPlanInfo");
            return navigate(`${process.env.PUBLIC_URL}/datagathering/about-you`);

          default:
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error(response?.message  || "Something went wrong");
            setIsLoading(false);
            break;
        }

      }
    } else {
      setNDAMsg(
        `Please accept ${planUUID == "tax_plan"
          ? "terms and conditions"
          : "Non-Disclosure Agreement"
        }.`
      );
    }
  };

  const deleteCoupon = async (id) => {
    setCouponInput("");
    setCouponApplied(0);
    setTotalAmount(totalpay);
    setTotalGST(0);
    setDiscountTotal(0);
  };

  // New logic tax & fp payment
  useEffect(() => {
    document.body.classList.add("main-layout");
    if (!localStorage.getItem("FintooTaxPlanInfo")) {
      if (planUUID === "tax_plan") {
        return navigate(
          `${process.env.PUBLIC_URL}/expert?service=tax-planning`
        );
      }
    }

    const FintooTaxPlanInfo = JSON.parse(
      localStorage.getItem("FintooTaxPlanInfo")
    );

    if (FintooTaxPlanInfo) {
      const discountedAmount =
        Number(FintooTaxPlanInfo.expertTotalFees) -
        Number(FintooTaxPlanInfo.value_after_discount);
      const finalAmount = Number(FintooTaxPlanInfo.value_after_discount);
      const gst = calculateGST(finalAmount);

      // write code to redirect to login page if memberData is not present
      if (!memberData || memberData.length === 0) {
        return navigate(`${process.env.PUBLIC_URL}/login`);
      }

      SetPaymentPayloadData((prev) => ({
        ...prev,
        user_id: memberData[0].id,
        user_name: memberData[0].name,
        user_email: memberData[0].user_email,
        user_phone: memberData[0].mobile,
        plan_id: FintooTaxPlanInfo.planId,
        couponCode: FintooTaxPlanInfo.couponCode,
        discountedAmount: discountedAmount,
        c_id: FintooTaxPlanInfo.couponCodeId,
        expert_id: FintooTaxPlanInfo.RMId,
        expertTotalFees: Number(FintooTaxPlanInfo.expertTotalFees),
        TotalAmount: finalAmount,
        gross_amount: finalAmount + gst,
        value_after_discount: finalAmount,
        emp_name: FintooTaxPlanInfo.employee_name,
        emp_position: FintooTaxPlanInfo.custom_qualification,
        rating: FintooTaxPlanInfo.rating,
        emp_experience: FintooTaxPlanInfo.custom_experience,
        imagepath: FintooTaxPlanInfo.imagepath,
      }));
    }
  }, []);

  const fhcExists = getItemLocal("fhc");

  const backPath =
    planUUID === "tax_plan"
      ? `${process.env.PUBLIC_URL}/expert?service=tax-planning`
      : fhcExists
        ? `${process.env.PUBLIC_URL}/financial-health-checkup`
        : `${process.env.PUBLIC_URL}/pricing`;

  const stepsData = [
    {
      current: false,
      stepCompleted: true,
      name: "Select the Expert",
    },
    {
      current: true,
      stepCompleted: false,
      name: "Pay for Consultancy",
    },
    {
      current: false,
      stepCompleted: false,
      name: "Book an Appointment",
    },
    {
      current: false,
      stepCompleted: false,
      name: "Upload Documents",
    },
  ];

  useEffect(() => {
    let total_gst = calculateGST(totalpay - discountTotal)
    setTotalGST(total_gst)
    setTotalAmount(totalpay - discountTotal + total_gst)
  }, [totalpay, discountTotal, totalpay])

  return (
    <>
      <div className="Paymentpage">
        <FintooLoader isLoading={isLoading} />
        <HideHeader />

        <div className="login-header">
          <Link to={backPath}>
            <div className="back-arrow" style={{ cursor: "pointer" }}>
              <IoMdArrowBack style={{ fontSize: "1.7rem" }} />
            </div>
          </Link>
        </div>

        <section className="payment-section TaxPaymentSection h-100 bg-white">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-md-6 m-auto">
                {planUUID === "tax_plan" && (
                  <>
                    <div className={`md:pt-5 ${style.stepContainer}`}>
                      <StepComponent stepsData={stepsData} />
                    </div>
                  </>
                )}
                <div className="row">
                  <form
                    onSubmit={(e) => { e.preventDefault(); validatepaymentform(); }}
                    className={`${planUUID == "tax_plan" ? "" : style["payment-form"]}`}
                  // method="POST"
                  >
                    <input
                      type="hidden"
                      name="productinfo"
                      value={productInfopay}
                    />
                    <input type="hidden" name="coupon" value={couponInput} />
                    <input
                      type="hidden"
                      name="user_id"
                      value={getParentUserId()}
                    />

                    <input
                      type="hidden"
                      name="firstname"
                      value={sessionData != "" ? sessionData.first_name : ""}
                    />
                    <input
                      type="hidden"
                      name="email"
                      value={sessionData != "" ? sessionData.email : ""}
                    />
                    <input
                      type="hidden"
                      name="isprofile"
                      value={sessionData != "" ? sessionData.mobile : ""}
                    />

                    <div className="col-md-6 m-auto">
                      <div className="subspay">
                        {planUUID === "tax_plan" && (
                          <>
                            <div style={{ textAlign: "start" }}>
                              <ExpertNameInfo
                                appointment={paymentPayloadData}
                                imgClass={"expertDetailImgContainer3"}
                              />
                            </div>
                          </>
                        )}
                        {planUUID !== "tax_plan" && (
                          <>
                            <div
                              className="custom-switch d-md-flex d-block text-center ms-md-1 ms-3 mt-2"
                              style={{ marginBottom: "0px", fontWeight: "500" }}
                            >
                              <span
                                style={{ fontSize: "20px" }}
                                className="switch-label "
                              >
                                Subscription
                              </span>
                            </div>

                            <div
                              className="custom-switch justify-content-md-start justify-content-center"
                              style={{
                                marginBottom: "5px",
                                paddingTop: ".4rem",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "14px",
                                  paddingLeft: "7px",
                                  color: "grey",
                                  fontWeight: "500",
                                }}
                              >
                                Financial Planning
                              </span>
                            </div>
                          </>
                        )}

                        <div className="paymt">
                          <div className="row form-row text-center">
                            <div className="col-md-6">
                              <div className="material-radio">
                                <ul className="inline" style={{ padding: 0 }}>
                                  <li className="radio subs_radio custom-background-color">
                                    <div className="row">
                                      <div
                                        className="col-md-8 col-7"
                                        style={{ padding: "10px" }}
                                      >
                                        {planUUID == "tax_plan" ? (
                                          <label className="text-white">
                                            Tax planning and management
                                          </label>
                                        ) : (
                                          <label className="text-white">
                                            {planType} - ({planFreq})
                                          </label>
                                        )}
                                      </div>
                                      <div
                                        className="col-md-4 col-5"
                                        style={{
                                          padding: "10px",
                                          borderLeft: "1px solid #ccc",
                                          textAlign: "right",
                                          color: "#fff",
                                        }}
                                      >
                                        {planUUID == "tax_plan" ? (
                                          <span>
                                            ₹{" "}
                                            {rsFilter(
                                              paymentPayloadData.expertTotalFees
                                            )}
                                          </span>
                                        ) : (
                                          <span className="subs_right_amt ">
                                            ₹{" "}
                                            {baseAmount
                                              ? rsFilter(baseAmount)
                                              : "0"}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div
                            className="row form-row"
                            style={{ display: "none" }}
                          >
                            <div className="col-md-6">
                              <ul className="custom-radio-block payment-options checked">
                                <li className="d-block">
                                  <label className="custom-radio-container">
                                    <img
                                      src={
                                        BASE_API_URL +
                                        "userflow/img/icons/credit-card.svg"
                                      }
                                    />
                                    Pay
                                    <input
                                      type="radio"
                                      checked="checked"
                                      name="radio"
                                    />
                                    <span className="checkmark"></span>
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div style={{ width: "100%", height: "10px" }}>
                            &nbsp;
                          </div>

                          {couponApplied == "" && (
                            <div
                              className="row form-row text-center"
                              id="couponapply_section"
                            >
                              <div className="col-md-6">
                                <div
                                  className="coupon-block material input applyoffer_div"
                                  {...(planUUID !== "tax_plan"
                                    ? {
                                      onClick: () => openPopup("applyCoupon"),
                                    }
                                    : {})}
                                  style={{
                                    margin: "0",
                                    maxWidth: "max-content",
                                    height: "29px",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0 8px", // Optional: gives spacing inside the box
                                    gap: "5px", // Optional: spacing between image and text
                                  }}
                                >
                                 <FaGift
  size={15}
  color="#042b62"
  style={{ marginRight: "4px" }}
/>

                                  <button
                                    type="button"
                                    value="Apply coupon code"
                                    className="apply-coupon-code custom-color"
                                    style={{
                                      padding: 0,
                                      background: "none",
                                      border: "none",
                                      lineHeight: "1", // Ensures vertical alignment
                                      fontSize: "14px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {planUUID === "tax_plan"
                                      ? paymentPayloadData.couponCode
                                      : "Apply Offer"}
                                  </button>
                                  {planUUID !== "tax_plan" && (
                                    <b className="right_arrow"></b>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {couponApplied != "" && (
                            <div
                              className="row form-row text-center"
                              id="couponapplied_section"
                            >
                              <div className="col-md-6">
                                <div className="row">
                                  <div className="col-8">
                                    <div
                                      className="coupon-block material input applyoffer_div"
                                      onClick={() => openPopup("applyCoupon")}
                                      style={{
                                        margin: "0px",
                                        width: "fit-content",
                                      }}
                                    >
                                      <span className="offerApplied">
                                        <img
                                          src="https://static.fintoo.in/static/userflow/img/icons/giftbox.png"
                                          alt="Apply Offer"
                                          style={{
                                            float: "left",
                                            width: "15px",
                                            marginTop: "3px",
                                          }}
                                        />
                                        &nbsp;
                                        <span
                                          className="offer-applied"
                                          style={{
                                            fontWeight: "500",
                                            fontSize: "16px",
                                          }}
                                        >
                                          {couponApplied}
                                        </span>
                                        &nbsp;
                                      </span>
                                    </div>
                                  </div>
                                  <div
                                    className="col-4 text-right"
                                    style={{ marginTop: "8px" }}
                                  >
                                    <div
                                      className="delete"
                                      onClick={() =>
                                        deleteCoupon("offerApplied")
                                      }
                                    >
                                      <img
                                        src={
                                          process.env.REACT_APP_STATIC_URL +
                                          "media/DG/Delete.svg"
                                        }
                                        alt="Delete"
                                        width="16"
                                        height="16"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div style={{ width: "100%", height: "10px" }}>
                            &nbsp;
                          </div>
                          <div className="row form-row text-center">
                            <div className="col-md-6">
                              <ul className="pay-block">
                                <li>
                                  <div className="row">
                                    <div className="col-8">
                                      <p style={{ textAlign: "left" }}>
                                        Total Payable Amount
                                      </p>
                                    </div>
                                    <div className="col-4">
                                      <p className="text-right">
                                        ₹
                                        {planUUID == "tax_plan"
                                          ? rsFilter(
                                            paymentPayloadData.expertTotalFees
                                          )
                                          : totalpay
                                            ? rsFilter(totalpay)
                                            : "0"}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                                {couponApplied != "" && (
                                  <li
                                    className="color-light-blue offerApplied"
                                    id="offerApplied"
                                  >
                                    <div className="row">
                                      <div className="col-md-8">
                                        <p
                                          style={{
                                            fontSize: "10px !important",
                                            textAlign: "left",
                                          }}
                                        >
                                          <span>Discount Applied</span>{" "}
                                          <span className="custom-color">
                                            ({couponApplied})
                                          </span>
                                        </p>
                                      </div>
                                      <div className="col-md-4">
                                        <p className="text-right custom-color">
                                          -₹ ({discountTotal})
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                )}

                                {couponApplied == "" && (
                                  <li>
                                    <div className="row">
                                      <div className="col-8">
                                        <p style={{ textAlign: "left" }}>
                                          Discount applied
                                        </p>
                                      </div>
                                      <div className="col-4">
                                        <p className="text-right">
                                          -₹
                                          {planUUID == "tax_plan"
                                            ? rsFilter(
                                              paymentPayloadData.discountedAmount
                                            )
                                            : discountTotal
                                              ? discountTotal
                                              : 0.0}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                )}
                                <li>
                                  <div className="row">
                                    <div className="col-8">
                                      <p style={{ textAlign: "left" }}>
                                        Gross payable
                                      </p>
                                    </div>
                                    <div className="col-4">
                                      <p className="text-right">
                                        ₹
                                        {planUUID == "tax_plan"
                                          ? rsFilter(
                                            paymentPayloadData.TotalAmount
                                          )
                                          : rsFilter(totalpay - discountTotal)}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="row">
                                    <div className="col-8">
                                      <p style={{ textAlign: "left" }}>GST</p>
                                    </div>
                                    <div className="col-4">
                                      <p className="text-right">
                                        ₹
                                        {planUUID == "tax_plan"
                                          ? calculateGST(
                                            paymentPayloadData.TotalAmount
                                          )
                                          : totalpay - discountTotal
                                            ? rsFilter(totalGST)
                                            : 0}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                                <li className="net_payable">
                                  <div className="row">
                                    <div className="col-8">
                                      <p style={{ textAlign: "left" }}>
                                        Net Payable
                                      </p>
                                    </div>
                                    <div className="col-4">
                                      <p
                                        style={{
                                          textAlign: "right",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        ₹{" "}
                                        {planUUID == "tax_plan"
                                          ? rsFilter(
                                            paymentPayloadData.gross_amount
                                          )
                                          : rsFilter(totalAmount)}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="row form-row">
                            <div className="col-md-8 offset-md-2">
                              <ul
                                className="agreement-block"
                                style={{ marginTop: "0px" }}
                              >
                                <li className="material-checkbox">
                                  <div
                                    className="checkbox-container"
                                    style={{ margin: "0px" }}
                                  >
                                    <input
                                      type="checkbox"
                                      name="nda"
                                      id="ndacheck"
                                      className="custom-checkbox new"
                                      tabIndex="1"
                                      checked={isNDAChecked} 
                                      onChange={handleNDAClick}
                                      style={{ zIndex: "2 !important" }}
                                    />
                                    <label
                                      for="ndacheck"
                                      className="checkbox-label mt-2 "
                                    >
                                      I have read and accept the
                                      {planUUID == "tax_plan" ? (
                                        <>
                                          <Link
                                            to={
                                              process.env.PUBLIC_URL +
                                              "/terms-conditions"
                                            }
                                            className="custom-color ms-2"
                                          >
                                            Terms and conditions applied
                                          </Link>
                                          <br />
                                          <span className="error">
                                            {NDAMsg}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <Link
                                            to={
                                              process.env.PUBLIC_URL +
                                              "/userflow/nda/"
                                            }
                                            className="custom-color ms-2"
                                          >
                                            NDA - Non-Disclosure Agreement
                                          </Link>
                                          <br />
                                          <span className="error">
                                            {NDAMsg}
                                          </span>
                                        </>
                                      )}
                                    </label>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="row form-row mt-4">
                            <div className="col">
                              <div className="btn-container text-center">
                                {parseInt(totalAmount) > 0 && (
                                  <button
                                    type="button"
                                    id="razorPay"
                                    className="default-btn"
                                    onClick={razorPay}
                                    style={{ fontSize: "16px" }}
                                  >
                                    Pay
                                  </button>
                                )}
                                {totalAmount == 0 && (
                                  <button
                                    type="button btn-container"
                                    onClick={skippayment}
                                    className="default-btn"
                                    style={{ fontSize: "16px" }}
                                  >
                                    Pay
                                  </button>
                                )}
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
              <div className="col-md-6 d-none d-md-block">
                <img
                  className="TaxPaymentSectionIllustration"
                  style={{ width: "65%", margin: "auto" }}
                  src={getPublicMediaURL("static/media/DG/Images/pana.svg")}
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
        <section
          className={`popup apply-popup  ${isBookingPopUpActive ? "active" : ""
            }`}
        >
          <div
            className="popup-container"
            style={{ maxHeight: "90vh", overflow: "hidden" }}
          >
            <a href="#" className="p_close js__p_close" title="Close">
              <img
                src={process.env.REACT_APP_STATIC_URL + "media/DMF/cancel.svg"}
                alt=""
              />
            </a>
            <div className="popup-wrapper">
              <div
                className="header-box d-flex popup-header text-center"
                style={{ background: "white !important" }}
              >
                <input type="hidden" name="rm_id" id="rm_id" value={rm_id} />

                <h4
                  className="page-header"
                  style={{
                    color: "#9cd155",
                    fontWeight: "bold",
                    fontSize: "24px !important",
                  }}
                >
                  Book Appointment With Expertss
                </h4>
              </div>
              <div
                style={{
                  borderBottom: "0.8px solid #90a4aa",
                  marginRight: "20px",
                  marginLeft: "20px",
                }}
              ></div>
              <div className="popup-body">
                <span>
                  <div>
                    <p className="Appt_Des">
                      Intoductory call with our financial Advisor to know more
                      about our offerings and advice
                    </p>
                  </div>
                  <div id="Cal_API">
                    <div
                      className="calendly-inline-widget"
                      data-url="https://calendly.com/fintoo/15-minutes-consultation-expert?embed_domain=minty.co.in&embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1&name={{calendlydata.name}}&email={{calendlydata.email}}&a3=+91{{calendlydata.mobile}}&a4={{rmdetails_name}}"
                      style={{ minWidth: "320px", height: "630px" }}
                    ></div>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </section>
        <section
          className={`popup apply-popup  ${isCouponPopUpActive ? "active" : ""
            }`}
          id="applyCoupon"
        >
          <div className="popup-container">
            <div className="popup-wrapper">
              <div className="header-box d-flex popup-header text-center">
                <h2 className="page-header ">Apply Offer</h2>
                <a
                  href="#"
                  onClick={() => removePopup()}
                  className="popup-closebtn"
                >
                  {" "}
                  ×{" "}
                </a>
              </div>
              <div className="popup-body">
                <span>
                  <form className="ng-pristine ng-valid">
                    <ul className="coupon-list" style={{ margin: "10px 0" }}>
                      <li>
                        <div
                          className="coupon-name"
                          style={{ alignItems: "flex-start" }}
                        >
                          <div>
                            <input
                              type="text"
                              name="coupon_code"
                              id="coupon_code"
                              className="coupon"
                              value={enteredCoupon}
                              onChange={(e) =>
                                handleCouponCodeChange(e.target.value)
                              }
                              style={{
                                width: "128px",
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                textAlign: "center",
                                marginRight: "10px",
                              }}
                              placeholder="Enter Coupon"
                            />
                            <br />
                            {isCouponInvalid && (
                              <p
                                id="c_error"
                                className="error text-center"
                                style={{ display: "block" }}
                              >
                                Invalid Coupon
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            value="Apply"
                            onClick={() => applyOfferManual()}
                            className="coupon1 default-btn"
                            style={{ fontSize: "16px", padding: "8px 50px" }}
                          >
                            Apply
                          </button>
                        </div>
                      </li>
                      {couponList1.length >= 1 &&
                        couponList1.map((coupon) => {
                          <li>
                            <div class="coupon-name">
                              <p
                                class="coupon"
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  width: "128px",
                                  padding: "8px 15px",
                                }}
                              >
                                {coupon.c_code}
                              </p>
                              {couponInput == coupon.c_id && (
                                <button
                                  ng-if="couponinput==offer.c_id"
                                  disabled="disabled"
                                  type="button"
                                  value="Apply"
                                  class="coupon1 default-btn FP10120"
                                >
                                  Coupon Applied
                                </button>
                              )}
                              {couponInput != coupon.c_id && (
                                <button
                                  type="button"
                                  value="Apply"
                                  onClick={() => applyOffer1(coupon)}
                                  class="coupon1 default-btn"
                                >
                                  Apply
                                </button>
                              )}
                            </div>
                            <div class="coupon-note">
                              {coupon.c_ispercentage == 1 && (
                                <h3 style={{ fontSize: "15px !important" }}>
                                  Save {coupon.c_discount}% OFF
                                </h3>
                              )}
                              {coupon.c_ispercentage == 1 && (
                                <h3 style={{ fontSize: "15px !important" }}>
                                  Save ₹{coupon.c_discount} OFF
                                </h3>
                              )}

                              <p>{coupon.c_desc}</p>
                            </div>
                          </li>;
                        })}
                    </ul>
                  </form>
                </span>
              </div>
            </div>
          </div>
        </section>
        <section
          className={`popup apply-popup bill-details-popup ${isBillingPopupActive ? "active" : ""
            }`}
          id="billingDetails"
        >
          <div className="popup-container">
            <div className="popup-wrapper">
              <div className="header-box d-flex popup-header text-center">
                <h2 className="page-header">Billing Detail</h2>
                <a
                  href="#"
                  onClick={() => removePopup()}
                  className="popup-closebtn"
                >
                  ×
                </a>
              </div>
              <div className="popup-body">
                <ul className="bill-details-list">
                  <li className="two-col-list">
                    <p>Total payable Amount</p>
                    <p>₹ {totalpay ? totalpay : ""}</p>
                  </li>

                  <li className="two-col-list color-blue f-bold">
                    <p>Discount applied</p>
                    <p>-₹ {discountTotal ? discountTotal : 0.0}</p>
                  </li>
                  <li className="two-col-list f-bold outline">
                    <p>Gross payable</p>
                    <p>₹ {rsFilter(totalpay - discountTotal)}</p>
                  </li>
                  <li className="two-col-list">
                    <p className="pb-0">GST</p>
                    <p className="pb-0">
                      ₹{totalpay - discountTotal ? rsFilter(totalGST) : 0}
                    </p>
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
