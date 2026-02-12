import { useState, useEffect } from "react";
import Footer from "../components/MainComponents/Footer";
import { ReactComponent as Logo } from "../Assets/Images/logo.svg";
import MainLayout from "../components/Layout/MainLayout";
import * as toastr from "toastr";
import { apiCall, getItemLocal, getParentUserId } from "../common_utilities";
import {
  BASE_API_URL,
  DATA_BELONGS_TO,
  imagePath,
  STATIC_URL,
} from "../constants";
import PricingPopup from "./PricingPopup";
// import Modal from "react-responsive-modal";
import { Modal } from "react-bootstrap";
import FintooLoader from "../components/FintooLoader";

import commonEncode from "../commonEncode";
import { Buffer } from "buffer";
import GuestLayout from "../components/Layout/GuestLayout";
import ApplyWhiteBg from "../components/ApplyWhiteBg";
import { SegmentedControl } from "segmented-control";
import TaxPricingView from "./Pricing/views/TaxPricingView";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Getpaymentstatus, getpricinglist } from "../FrappeIntegration-Services/services/payment-api/paymentapiService";


const PricingPage = () => {
  let navigate = useNavigate();
  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');

  const [tabNo, setTabNo] = useState(1);
  const [sessionData, setSessionData] = useState([]);
  const [paymentStatus, setPaymentstatus] = useState([])
  const [pricingData, setPricingData] = useState([]);
  const [taxPricingData, setTaxPricingData] = useState([]);
  const [reqplandict, setReqPlanDict] = useState({});
  const [taxData, setTaxsData] = useState([]);
  const [open, setOpen] = useState(false);

  const onCloseModal = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceTab, SetServiceTab] = useState(2)

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    SetServiceTab(() => defaultService())

    const keyDownHandle = (e) => {
      e.preventDefault()
    }
    window.addEventListener("keydown", keyDownHandle);

    return (() => window.removeEventListener("keydown", keyDownHandle))
  }, [])

  useEffect(() => {
    document.body.classList.add("white-bg");
    return (() => document.body.classList.remove("white-bg"))
  }, [])

  useEffect(() => {
    if (location.href.includes("#tax_plan")) {
      setTabNo(2);
    } else {
      setTabNo(1);
    }
  }, []);
  useEffect(() => {
    // getSessionData();
    getPlanDetails();
    getTaxDetails();

  }, []);

  const userid = getParentUserId();
  const getSessionData = async () => {
    // try {
    //   let url = CHECK_SESSION;
    //   let data = { user_id: userid, sky: getItemLocal("sky") };
    //   let session_data = await apiCall(url, data, true, false);
    //   setSessionData(session_data["data"]);
    // } catch {
    //   setSessionData([]);
    // }
  };

  const getPlanDetails = async () => {
    try {
      setIsLoading(true);
      const pricing_data = await getpricinglist()

      if (pricing_data.status_code === 200) {
        const filteredPlans = pricing_data.data.filter(p =>
          p.plan_uuid === "fp_expert" ||
          p.plan_uuid === "fp_basic" ||
          p.plan_name === "Financial Health Checkup"
        );

        const tax_pricing_data = pricing_data.data.filter(p =>
          p.plan_uuid === "tax_plan" || p.plan_uuid === "income_tax"
        );

        setPricingData(filteredPlans);
        setTaxPricingData(tax_pricing_data);
        setIsLoading(false);
      }

    } catch {
      setIsLoading(true);
      setPricingData({});
      setTaxPricingData([]);
    }
  };

  const Paymentstatus = async (plan_name) => {
    // 
    try {
      const payload = {
        user_id: user_data.user_id,
        plan_name: plan_name,
        data_belongs_to: DATA_BELONGS_TO
      }
      const res = await Getpaymentstatus(payload)
      if (res.status_code === 200) {
        setPaymentstatus(res.data)
      } else {
        setPaymentstatus([])
      }

    } catch (e) {
      console.error(e)
    }
  };



  const getTaxDetails = async () => {
    try {
      setIsLoading(true);
      let url = ADVISORY_GET_TAXDETAILS_API_URL;
      let tax_data = await apiCall(url, "", false, false);
      if (tax_data["error_code"] == "100") {
        setIsLoading(false);
        setTaxsData(tax_data["data"]["tax_plan_details"]["taxplandetails"]);
      }
    } catch {
      setIsLoading(true);
      setTaxsData({});
    }
  };
  const loginRedirect = () => {
    localStorage.removeItem("userid");
    let t = window.location.href;
    if (window.location.pathname == "/") {
      t = t + "web/commondashboard";
    }
    if (t == "https://stg.minty.co.in/web/pricing/") {
      var redirectURL =
        window.location.origin +
        process.env.PUBLIC_URL +
        "/checkredirect?redirect=" +
        encodeURI(process.env.PUBLIC_URL + "/commondashboard/");
    }
    else {
      var redirectURL =
        window.location.origin +
        process.env.PUBLIC_URL +
        "/checkredirect?redirect=" +
        encodeURI(t);
    }

    var goTo =
      LOGIN_PAGE +
      "?src=" +
      Buffer.from(commonEncode.encrypt("dmf")).toString("base64") +
      "&redirect_uri=" +
      Buffer.from(commonEncode.encrypt(redirectURL)).toString("base64");
    // let redirectToThis = window.location.href;
    // let checkAuth = window.location.href.split("auth");
    // if (checkAuth.length > 1) {
    //   redirectToThis = checkAuth[0].substring(0, checkAuth[0].length - 1).replace(/\/+$/, '');
    // }
    // localStorage.setItem("redirectToThis", redirectToThis);
    window.location = goTo;
    // return;
  };

  // function CreateOrder(total_amount, frq, plan_sub_cat, plan_id, x) {

  //   localStorage.setItem('financialPlan', JSON.stringify(x));

  //   var amount = 0;
  //   if (total_amount.isquaterly == 0 && total_amount.total != "custom") {
  //     amount = parseInt(total_amount.total);
  //   } else {
  //     amount = total_amount.Q1;
  //   }
  //   setReqPlanDict({
  //     amount: amount,
  //     frq: frq,
  //     plan_sub_cat: plan_sub_cat,
  //     plan_id: plan_id,
  //   });

  //   if (
  //     sessionData &&
  //     sessionData.fp_log_id &&
  //     (plan_id == "fp_robo" || plan_id == "fp_expert") &&
  //     sessionData.fp_plan_sub_cat == plan_sub_cat
  //   ) {
  //     window.location = process.env.PUBLIC_URL + "/commondashboard/";
  //   } else if (

  //     plan_id == "fp_robo" || plan_id == "fp_expert"
  //   ) {
  //     if (
  //       (sessionData["plan_payment_status"] == "1" ||
  //         sessionData["plan_payment_status"] == "3" ||
  //         sessionData["plan_payment_status"] == "6" ||
  //         sessionData["plan_payment_status"] == "7") &&
  //       sessionData.fp_plan_sub_cat
  //     ) {
  //       if (sessionData.fp_plan_sub_cat > plan_sub_cat) {
  //         {
  //           setOpen(true);
  //         }
  //       } else {
  //         expertDetails(plan_id);
  //       }
  //     } else {
  //       expertDetails(plan_id);
  //     }
  //   } else if (plan_sub_cat != 7) {
  //     // window.location.href = BASE_API_URL + "login/";
  //     // loginRedirect()

  //   } else {
  //     if (plan_id == "fp_robo" || plan_id == "fp_expert") {
  //       expertDetails(plan_id);
  //     }
  //   }
  // }

  const CreateOrder = async (total_amount, frq, plan_sub_cat, plan_id, x) => {
    if (
      getParentUserId() == null &&
      (plan_id === "fp_robo" || plan_id === "fp_basic")
    ) {
      window.location.href = process.env.PUBLIC_URL + "/login";
      return;
    }
    else {
      const payload = {
        user_id: getParentUserId(),
        plan_name: x.plan_name,
        data_belongs_to: DATA_BELONGS_TO
      }
      const res = await Getpaymentstatus(payload)
      if (res.status_code === 200) {
        setPaymentstatus(res.data)

        const plan = res?.data;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiryDate = new Date(plan.plan_expiry_date);
        expiryDate.setHours(0, 0, 0, 0);

        const selected_plan_uuid = plan.plan_uuid
        if (today <= expiryDate) {
          if (
            (plan_id === "fp_robo" || plan_id === "fp_basic") &&
            ["platinum", "elite", "elite_prime"].includes(selected_plan_uuid)
          ) {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("You have already paid for this service.");
            navigate(`${process.env.PUBLIC_URL}/commondashboard`);
          }
          else if (
            plan_id === "fp_expert" &&
            (selected_plan_uuid === "fp_robo" || selected_plan_uuid === "fp_basic")
          ) {
            localStorage.removeItem("plan_uuid");
            localStorage.setItem('financialPlan', JSON.stringify(x));

            var amount = 0;
            if (total_amount.isquaterly == 0 && total_amount.total != "custom") {
              amount = parseInt(total_amount.total);
            } else {
              amount = total_amount.Q1;
            }
            setReqPlanDict({
              amount: amount,
              frq: frq,
              plan_sub_cat: plan_sub_cat,
              plan_id: plan_id,
            });

            expertDetails(plan_id);
          } else {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("You have already paid for this service.");
            navigate(`${process.env.PUBLIC_URL}/commondashboard`);
          }
        }
        else {
          localStorage.removeItem("plan_uuid");
          localStorage.setItem('financialPlan', JSON.stringify(x));

          var amount = 0;
          if (total_amount.isquaterly == 0 && total_amount.total != "custom") {
            amount = parseInt(total_amount.total);
          } else {
            amount = total_amount.Q1;
          }
          setReqPlanDict({
            amount: amount,
            frq: frq,
            plan_sub_cat: plan_sub_cat,
            plan_id: plan_id,
          });

          expertDetails(plan_id)
        }
      }
      else {
        localStorage.removeItem("plan_uuid");
        localStorage.setItem('financialPlan', JSON.stringify(x));

        var amount = 0;
        if (total_amount.isquaterly == 0 && total_amount.total != "custom") {
          amount = parseInt(total_amount.total);
        } else {
          amount = total_amount.Q1;
        }
        setReqPlanDict({
          amount: amount,
          frq: frq,
          plan_sub_cat: plan_sub_cat,
          plan_id: plan_id,
        });

        if (

          plan_id == "fp_robo" || plan_id == "fp_expert" || plan_id === "fp_basic"
        ) {

          if (sessionData.fp_plan_sub_cat > plan_sub_cat) {
            {
              setOpen(true);
            }
          } else {
            expertDetails(plan_id);
          }

        } else if (plan_sub_cat != 7) {
          // window.location.href = BASE_API_URL + "login/";
          // loginRedirect()

        } else {
          if (plan_id == "fp_robo" || plan_id == "fp_expert" || plan_id === "fp_basic") {
            expertDetails(plan_id);
          }
        }
      }
    }
  }

  const expertDetails = async (plan_id, plan_sub_cat, amount, frq) => {
    if (plan_id == "fp_robo" || plan_id === "fp_basic") {

      setIsLoading(true);
      // let url = ADVISORY_ADDTOCART_API_URL;
      // let cart_data = await apiCall(url, cartdatatosend, true, false);
      // if (cart_data.error_code == "100") {
      setIsLoading(false);
      window.location.href = process.env.PUBLIC_URL + "/userflow/payment/";
      // }
    } else if (plan_id == "fp_expert") {
      setIsLoading(true);
      window.location = process.env.PUBLIC_URL + "/expert";
    }
  };

  const addTaxCart = async (plan_id) => {
    window.location =
      "http://www.erokda.in/tax/itr-filing.php?pid=" + "" + plan_id;
  };
  const defaultService = () => {
    const service = searchParams.get('service');
    switch (service) {
      case 'financial-planning':
        return 0
      case 'tax-planning':
        return 1
      case 'estate-planning':
        return 2
      default:
        return 0
    }
  }

  const getSearchParam = (val) => {
    switch (val) {
      case 0:
        return 'financial-planning'
      case 1:
        return 'tax-planning'
      case 2:
        return 'estate-planning'
      default:
        return 'financial-planning'
    }
  }
  const PLAN_ORDER = {
    fp_basic: 1,
    fp_robo: 2,
    fp_expert: 3
  };

  return (
    <GuestLayout>
      <div className="pricingSegmentControlContainer">
        <SegmentedControl
          name="taxResident"
          className="my-segment-2"
          options={[
            {
              label: "Financial Planning",
              value: 0,
              default: defaultService() == 0
            },

            { label: "Tax Planning", value: 1, default: defaultService() == 1 },
          ]}
          setValue={(newValue) => {
            setSearchParams({ 'service': getSearchParam(newValue) })
            SetServiceTab(newValue)
          }}
        />
      </div>

      <div className="container-fluid white-bg">
        {serviceTab === 0 && <div>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 w-100">
              <div className="s-head text-center mb-80">
                <h2 className="upperText">
                  AI-Based Personalized Financial Planning Solutions Trusted By
                  2,00,000+ Investors.
                </h2>
                <p
                  className="mt-2 BottomText"
                  style={{
                    color: "gray",
                  }}
                >
                  Fintoo's AI-Based comprehensive financial planning solution is a
                  perfect combination of advanced technology and the extensive
                  experience of financial planning experts. As each client is
                  unique, we develop a unique and customised plan for each of our
                  clients.
                </p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="pric-tables price-table">
                <div className="PricingBox row gap-4 justify-content-center">
                  {pricingData
                    ?.slice()
                    .sort((a, b) => {
                      return (PLAN_ORDER[a.plan_uuid] || 99) -
                        (PLAN_ORDER[b.plan_uuid] || 99);
                    })
                    .map((x) => (
                      <div
                        className={`col-12 col-md-6 col-lg-4 item sm-mb50 item-active ${x.plan_uuid === "fp_robo" ? "pricing-featured" : ""
                          }`}
                        key={x.name}
                      >
                        <div className="type Price-type text-center mb-15 mt-5"
                        >
                          {x.plan_name == "" ? (
                            <div style={{ fontWeight: "bold", }}>
                              ASSISTED ADVISORY
                            </div>
                          ) : (
                            <div style={{ fontWeight: "bold", }}>{x.plan_name.toUpperCase()}</div>
                          )}
                        </div>
                        <br />
                        <div className="amount text-center mb-40">
                          {x.plan_name == "Financial Health Checkup" && (
                            <h4>₹ {parseInt(x.plan_amount).toLocaleString()}</h4>
                          )}
                          {x.plan_name == "Basic" && (
                            <h4>₹ {parseInt(x.plan_amount).toLocaleString()}</h4>
                          )}
                          {x.plan_name == "Assisted Advisory" && (
                            <h4>{x.plan_description.amount.total == "custom" && "Custom"}</h4>
                          )}
                        </div>
                        {/* {x.plan_name} */}

                        {x.plan_name == "Assisted Advisory" && (
                          <div className="text-center custombtmText text-gray p">
                            Get a completely customised financial plan according
                            to your unique requirement
                          </div>
                        )}
                        {x.plan_name == "Financial Health Checkup" && (
                          <div className="text-center custombtmText text-gray p">
                            Half Yearly
                          </div>
                        )}

                        {x.plan_name == "Basic" && (
                          <div className="text-center custombtmText text-gray p">
                            Half Yearly
                          </div>
                        )}
                        <div className="feat">
                          {x.plan_uuid === "fp_basic" ? (
                            <ul>
                              <li className="d-flex align-items-center">
                                <img
                                  className="pe-2 checkPng"
                                  style={{ width: "16px" }}
                                  src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                  alt=""
                                />
                                <span className="ml-2">Mutual Fund Screening Report</span>
                              </li>

                              <li className="d-flex align-items-center">
                                <img
                                  className="pe-2 checkPng"
                                  style={{ width: "16px" }}
                                  src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                  alt=""
                                />
                                <span className="ml-2">Consolidated Portfolio Report</span>
                              </li>
                            </ul>
                          ) : (

                            <ul>
                              <li className="d-flex align-items-center">
                                <span>
                                  {x.plan_description.dedicated_wealth_manager == 0 && (
                                    <img
                                      className="pe-2"
                                      style={{ width: "16px" }}
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/Pricing/cancel.png"
                                      }
                                      alt=""
                                    />
                                  )}
                                  {x.plan_description.dedicated_wealth_manager == 1 && (
                                    <img
                                      className="pe-2 checkPng"
                                      style={{ width: "16px" }}
                                      src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                      alt=""
                                    />
                                  )}
                                </span>
                                <span
                                  className={`ml-2`}
                                >
                                  Dedicated Wealth Manager
                                </span>
                              </li>
                              <li className="d-flex align-items-md-center">
                                <span>
                                  {x.plan_description.comprehensive_fp == 0 && (
                                    <img
                                      className="pe-2"
                                      style={{ width: "16px" }}
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/Pricing/cancel.png"
                                      }
                                      alt=""
                                    />
                                  )}
                                  {x.plan_description.comprehensive_fp == 1 && (
                                    <img
                                      className="pe-2 checkPng"
                                      style={{ width: "16px" }}
                                      src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                      alt=""
                                    />
                                  )}
                                </span>
                                <span
                                  className={`ml-2`}
                                >
                                  Comprehensive Financial Planning
                                </span>
                              </li>

                              <li className="d-flex align-items-center" key={x.name}>
                                <span>
                                  {x.plan_description.will_estate_planning == 0 && (
                                    <img
                                      className="pe-2"
                                      style={{ width: "16px" }}
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/Pricing/cancel.png"
                                      }
                                      alt=""
                                    />
                                  )}
                                  {x.plan_description.will_estate_planning == 1 && (
                                    <img
                                      className="pe-2 checkPng"
                                      style={{ width: "16px" }}
                                      src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                      alt=""
                                    />
                                  )}
                                </span>
                                <span
                                  className={`ml-2`}
                                >
                                  {" "}
                                  Will & Estate Planning
                                </span>
                              </li>
                              <li className="d-flex align-items-center">
                                <span>
                                  {x.plan_description.risk_management.data == 0 && (
                                    <img
                                      className="pe-2"
                                      style={{ width: "16px" }}
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/Pricing/cancel.png"
                                      }
                                      alt=""
                                    />
                                  )}
                                  {x.plan_description.risk_management.data == 1 && (
                                    <img
                                      className="pe-2 checkPng"
                                      style={{ width: "16px" }}
                                      src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                      alt=""
                                    />
                                  )}
                                </span>
                                <span
                                  className={`ml-2`}
                                >
                                  Risk Management
                                </span>
                              </li>
                              <li className="d-flex align-items-center">
                                <span>
                                  <img
                                    className="pe-2 checkPng"
                                    style={{ width: "16px" }}
                                    src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                    alt=""
                                  />
                                </span>
                                <span
                                  className={`ml-2`}
                                >
                                  Review Frequency{" "}
                                  <span
                                    className={`ExtraTxt ${x.plan_name == "Assisted Advisory"
                                      ? "text-secondary"
                                      : "text-secondary"
                                      }`}
                                  >
                                    (
                                    {x.plan_description.review_frequency == "3"
                                      ? "Quarterly"
                                      : "Monthly"}
                                    )
                                  </span>
                                </span>
                              </li>
                              <li className="d-flex">
                                <span>
                                  {x.plan_description
                                    .private_wealth_managment.data == 0 && (
                                      <img
                                        className="pe-2"
                                        style={{ width: "16px" }}
                                        src={
                                          process.env.REACT_APP_STATIC_URL +
                                          "media/Pricing/cancel.png"
                                        }
                                        alt=""
                                      />
                                    )}
                                  {x.plan_description
                                    .private_wealth_managment.data == 1 && (
                                      <img
                                        className="pe-2 checkPng"
                                        style={{ width: "16px" }}
                                        src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                        alt=""
                                      />
                                    )}
                                </span>
                                <span
                                  className={`ml-2`}
                                >
                                  Private Wealth Management{" "}
                                  <span
                                    className={`ExtraTxt`}
                                  >
                                    {
                                      x.plan_name == "Assisted Advisory" ? "(" + x.plan_description.private_wealth_managment.meta.web + ")" : x.plan_description.private_wealth_managment.meta.web
                                    }
                                    {/* {x.private_wealth_managment.meta.web} */}
                                  </span>
                                  {/* <br /> */}
                                  {/* <div className="Extrainfo">
                                  (Direct MF, Domestic Equity, Intl Equity,
                                  Unlisted Equity, Bonds, Debt & Alternate)
                                </div> */}
                                </span>
                              </li>
                              <li className="d-flex ">
                                <span>
                                  {x.plan_description.rebalancing_portfolio.data == 0 && (
                                    <img
                                      className="pe-2"
                                      style={{ width: "16px" }}
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/Pricing/cancel.png"
                                      }
                                      alt=""
                                    />
                                  )}
                                  {x.plan_description.rebalancing_portfolio.data == 1 && (
                                    <img
                                      className="pe-2 checkPng"
                                      style={{ width: "16px" }}
                                      src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                      alt=""
                                    />
                                  )}
                                </span>
                                <span
                                  className={`ml-2`}
                                >
                                  Rebalancing of Portfolio
                                  <span
                                    className={`ExtraTxt`}
                                  >
                                    &nbsp;
                                    {x.plan_description.rebalancing_portfolio.meta.web
                                      ? x.plan_description.rebalancing_portfolio.meta.web
                                      : "(Advisory & Execution)"}
                                  </span>
                                </span>
                              </li>
                              <li className="d-flex align-items-center">
                                <span>
                                  {x.plan_description.tax_filling.data == 0 && (
                                    <img
                                      className="pe-2"
                                      style={{ width: "16px" }}
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/Pricing/cancel.png"
                                      }
                                      alt=""
                                    />
                                  )}
                                  {x.plan_description.tax_filling.data == 1 && (
                                    <img
                                      className="pe-2 checkPng"
                                      style={{ width: "16px" }}
                                      src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                      alt=""
                                    />
                                  )}
                                </span>

                                <span
                                  className={`ml-2`}
                                >
                                  {" "}
                                  Tax Filing &nbsp;
                                  <span className="ExtraTxt text-secondary">
                                    {x.plan_description.tax_filling.meta.web}
                                  </span>
                                </span>
                              </li>
                              <li className="d-flex align-items-center">
                                <span>
                                  {x.plan_description.chat_with_expert.data == 0 && (
                                    <img
                                      className="pe-2"
                                      style={{ width: "16px" }}
                                      src={
                                        process.env.REACT_APP_STATIC_URL +
                                        "media/Pricing/cancel.png"
                                      }
                                      alt=""
                                    />
                                  )}
                                  {x.plan_description.chat_with_expert.data == 1 && (
                                    <img
                                      className="pe-2 checkPng"
                                      style={{ width: "16px" }}
                                      src={process.env.REACT_APP_STATIC_URL + "media/Pricing/check.svg"}
                                      alt=""
                                    />
                                  )}
                                </span>
                                <span
                                  className={`ml-2`}
                                >
                                  Chat With Expert
                                </span>
                              </li>
                            </ul>
                          )}
                        </div>

                        <div className="BtnBox">
                          <button
                            onClick={() =>
                              CreateOrder(
                                x.plan_description.amount,
                                x.plan_freq,
                                x.service_sub_id,
                                x.plan_uuid,
                                x
                              )
                            }
                          >
                            {" "}
                            Get Started{" "}
                          </button>
                        </div>
                        <br></br>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <Modal className="Modalpopup" show={open} onHide={onCloseModal} centered>
            <div className="text-center">
              <h2 className="HeaderText">Information !!</h2>
              <PricingPopup
                open={open}
                onClose={onCloseModal}
                sessionData={sessionData}
                reqplandict={reqplandict}
              />
            </div>
          </Modal>
        </div>}
        {
          serviceTab === 1 && <TaxPricingView taxPricingData={taxPricingData} />
        }

      </div>


    </GuestLayout>
  );
};
export default PricingPage;
