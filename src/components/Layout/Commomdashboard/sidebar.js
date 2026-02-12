import React, { useEffect, useRef, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router-dom";
import pmc from "./commonDashboard.module.css";
import Call from "../../../Assets/Images/CommonDashboard/phonecall.png";
import Mail from "../../../Assets/Images/CommonDashboard/Mail.png";
import Expiry from "../../../Assets/Images/CommonDashboard/evaluation.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  STATIC_URL,
  BASE_API_URL,
  CHECK_SESSION,
  imagePath,
  DATA_BELONGS_TO,
} from "../../../constants";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  getUserId,
  removeSlash,
} from "../../../common_utilities";
import commonEncode from "../../../commonEncode";
import Calendly from "../../CommonDashboard/Calendly";
import { useNavigate } from "react-router-dom";

import Advisory from "../../../Assets/Images/CommonDashboard/01_advisory.svg";
import PlanofAction from "../../../Assets/Images/CommonDashboard/02_plan_of_action.svg";
import PersonalTax from "../../../Assets/Images/CommonDashboard/03_personal_tax.svg";
import Investment from "../../../Assets/Images/CommonDashboard/02_investment.svg";
import Transaction from "../../../Assets/Images/CommonDashboard/04_transactions.svg";
import { HiOutlineMail } from "react-icons/hi";
import Fintootour from "../../../Pages/Fintootour";
import RenewPopupTextbox from "../../CommonDashboard/RenewPopupTextbox";
import KYCTextbox from "../../CommonDashboard/KYCTextbox";
import { Modal } from "react-bootstrap";
import RenewPopup from "../../CommonDashboard/RenewPopup";
import { Getpaymentstatus } from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";
const CommonDSidebar = (props) => {

  const planIsExpired = getItemLocal("plan_is_expired");

  const dispatch = useDispatch();
  const location = useLocation();
  const { showPage } = props;
  // const url = window.location.pathname.split("/").pop();
  const mobileNavRef = useRef(null);
  const [rmdetails, setRmDetails] = useState({});
  useEffect(() => {

  }, [rmdetails])
  const [calendlydata, setCalendlyData] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [planExpiryDate, setPlanExpiryDate] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleTrigger = () => setIsOpen(!isOpen);
  const [currentLocation, setCurrentLocation] = useState("");

  const [planuuid, setPlanUuid] = useState("");
  const [dashboardpage, setDashboardPage] = useState(-1);
  const [email, setEmail] = useState('');
  const emailContainerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [renewpopup, setRenewPopup] = useState(0);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [dgShow, setDGShow] = useState(false)
  const [fpLifecycleStatus, setFpLifecycleStatus] = useState(null);
  const [subscriptionenddate, setSubscriptionEndDate] = useState("");

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, [url]);

  useEffect(() => {
    setCurrentLocation(location.pathname);
  }, [location]);

  useEffect(() => {
    paymentStatus()
    // getSessiondata();
  }, []);

  const userid = getParentUserId();

  const paymentStatus = async () => {
      const payload = {
        user_id: getParentUserId(),
        data_belongs_to: DATA_BELONGS_TO
      };
      const res = await Getpaymentstatus(payload);
      if (res?.status_code === 200) {
        var rmdetails = res.data
        var rm_details = {}
        if (rmdetails["plan_uuid"] == "fp_robo") {
          rm_details.imagepath = ""
          rm_details.emp_name = "Online"
          rm_details.username = "support@fintoo.in"
          rm_details.emp_mobile = "9699800600"
        }
        else{
          rm_details.imagepath = rmdetails.rm_data.imagepath ? rmdetails.rm_data.imagepath : ""
          rm_details.emp_name = rmdetails.rm_data.emp_name
          rm_details.username = rmdetails.rm_data.emp_email
          rm_details.emp_mobile = rmdetails.rm_data.emp_mobile
        }
        setRmDetails(rm_details);
        setPaymentCompleted(rmdetails.plan_name != "Assisted Advisory"? true : false);
        if (rmdetails.plan_name != "Assisted Advisory"){
          let paymentDate = rmdetails.plan_expiry_date;
          paymentDate = new Date(paymentDate);
          const day = paymentDate.getDate();
          const month = paymentDate.toLocaleString("default", { month: "long" });
          const year = paymentDate.getFullYear();
          const getDaySuffix = (day) => {
            if (day >= 11 && day <= 13) return "th";
            switch (day % 10) {
              case 1: return "st";
              case 2: return "nd";
              case 3: return "rd";
              default: return "th";
            }
          };
          const formattedDate = `${day}${getDaySuffix(day)} ${month}, ${year}`;
          setPlanExpiryDate(formattedDate);
        }
      }
    }
  

  const [currentUrl, setCurrentUrl] = useState("");
  React.useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location]);

  useEffect(() => {
    if (document.querySelector(".plan-of-action-cls") == null) return;
    if (dashboardpage > 1 && planuuid == "fp_robo") {
      document.querySelectorAll(".plan-of-action-cls").forEach((v) => {
        v.style.display = "block";
      });
    } else {
      document.querySelectorAll(".plan-of-action-cls").forEach((v) => {
        v.style.display = "none";
      });
    }
  }, [dashboardpage, planuuid]);

  // const getSessiondata = async () => {
  //   try {
  //     let url = '';
  //     // let url = CHECK_SESSION;
  //     let data = { user_id: userid, sky: getItemLocal("sky") };
  //     let session_data = await apiCall(url, data, true, true);
  //     if ((session_data.error_code = "100" && session_data.data != "")) {
  //       // if (
  //       //   session_data.data.fp_lifecycle_status == "" ||
  //       //   !session_data.data.fp_lifecycle_status
  //       // ) {
  //       //   var lifecycledata = 0;
  //       // } else {
  //       //   var lifecycledata = session_data.data.fp_lifecycle_status;
  //       // }
  //       let lifecycledata = session_data.data.fp_lifecycle_status || 0;
  //       setFpLifecycleStatus(lifecycledata);
  //       // setPlanSubCat(session_data.data.fp_plan_sub_cat);
  //       setDashboardPage(lifecycledata);
  //       setPlanType(session_data.data.fp_plan_type);
  //       let api_data = {
  //         fp_log_id: session_data["data"]["fp_log_id"],
  //         user_id: session_data["data"]["id"],
  //       };
  //       var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
  //       var renew_data = await apiCall(
  //         ADVISORY_RENEWPAYMENT_API_URL,
  //         payload_data,
  //         false,
  //         false
  //       );
  //       var res = JSON.parse(commonEncode.decrypt(renew_data));
  //       if ((res.error_code = "100" && res.data != "")) {
  //         setRenewPopup(res.data["show_popup"]);
  //         setSubscriptionEndDate(res.data["subscription_end_date"]);
  //       } else {
  //         setRenewPopup(0);
  //         setSubscriptionEndDate("");
  //       }
  //       getOngoingPlanDates();
  //     } else {
  //       setDashboardPage(0);
  //       setRenewPopup(0);
  //       setPlanType(0);
  //       setPlanSubCat(0);
  //       setSubscriptionEndDate("");
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  useEffect(() => {
    const emailContainer = emailContainerRef.current;
    if (emailContainer && email.length > 26) {
      emailContainer.classList.add('animateRMMail');
    } else if (emailContainer) {
      emailContainer.classList.remove('animateRMMail');
    }
  }, [email]);

  useEffect(() => {
    setEmail(rmdetails.username);
  }, [rmdetails?.username]);

  useEffect(() => {
    const ndasignstatus = getItemLocal("ndasignstatus")
    const datagatehringstatus = getItemLocal("datagatheringstatus")
    const reportstatus = getItemLocal("reportstatus")

    setPlanUuid(getItemLocal("plan_uuid"))

    if (reportstatus == "Y") {
      setDashboardPage(2)
    }
    else if (ndasignstatus == "Y" || datagatehringstatus == "Y") {
      setDashboardPage(1)
    }
    else {
      setDashboardPage(0)
    }
  }, [])
 
  

  return (
    <>
      {/* for DG */}

      {renewpopup == 2 ? (
        <div className="RenewMsgbox">
          <RenewPopupTextbox showpopup={true} />
        </div>
      ) : (
        ""
      )}


      <div id="" className={`${pmc.navbar} portfolio-navbar-sidebar`}>
        <div className={`${pmc.SidebarBox}`} ref={mobileNavRef}>
          <div className={`${pmc.menuitem} `}>
            {/* <Link
            className={`text-decoration-none d-flex menu-link-182 ${
              pmc["aaa"]
            } ${
              currentUrl.toLowerCase().indexOf("dashboard") > -1 &&
              currentUrl.toLowerCase().split("/")[
                currentUrl.toLowerCase().split("/").length - 1
              ] == "dashboard"
                ? "active"
                : "Inactive"
            }`}
            to={`${process.env.PUBLIC_URL}/direct-mutual-fund/commondashboard/dashboard`}
          > */}
            <div
              id="DashboardItem"
              onClick={() => {
                if (
                  !(
                    currentLocation == "/commondashboard" ||
                    currentLocation == "/commondashboard/"
                  )
                ) {
                  navigate(`${process.env.PUBLIC_URL}/commondashboard`);
                }
                dispatch({
                  type: "CHANGE_COMMONDASHBOARD",
                  payload: "dashboard",
                });
              }}
              className={`text-decoration-none d-flex menu-link-182 ${pmc["aaa"]
                } ${pmc.menulink} ${showPage === "dashboard" &&
                  (currentLocation == "/commondashboard" ||
                    currentLocation == "/commondashboard/")
                  ? pmc.activeMenu + " sidebar-custom-color-activeMenu"
                  : "Inactive"
                }`}
            >
              <div>
                <img
                  // src={imagePath + Advisory}
                  src={imagePath + Advisory}
                  width={20}
                />
              </div>
              <div className={pmc.menutext + " sidebar-custom-color"}>
                Dashboard
              </div>
            </div>

            {/* </Link> */}
          </div>

          {dashboardpage !== 0 && (
            <div style={{
              cursor: planIsExpired === "Y" ? "not-allowed" : "pointer",
              opacity: planIsExpired === "Y" ? 0.5 : 1,
            }} className={` ${pmc.menuitem}`}>

              {/* renewpopup === 2 */}
              {planIsExpired === "Y" ? (<>
                <div
                  className={({ isActive, isPending }) =>
                    "text-decoration-none pointer" +
                    (isPending
                      ? pmc.pendingMenu
                      : isActive
                        ? pmc.activeMenu + " sidebar-custom-color-activeMenu"
                        : pmc.InactiveMenu)
                  }
                  onClick={() => {
                    onOpenModal();
                  }}
                >
                  <div
                    className={` text-decoration-none d-flex menu-link-182 `}
                  >
                    <div>
                      <img
                        src={imagePath + Transaction}
                        width={20}
                      />
                    </div>
                    <div style={{
                cursor: planIsExpired === "Y" ? "not-allowed" : "pointer",
                opacity: planIsExpired === "Y" ? 0.5 : 1,
              }} className={`${pmc.menutext + " sidebar-custom-color"} `}>
                      Data Gathering
                    </div>
                  </div>
                </div>
              </>) : <>
                <NavLink
                  className={({ isActive, isPending }) =>
                    "text-decoration-none " +
                    (isPending
                      ? pmc.pendingMenu
                      : isActive
                        ? pmc.activeMenu + " sidebar-custom-color-activeMenu"
                        : pmc.InactiveMenu)
                  }
                  to={`${process.env.PUBLIC_URL}/datagathering/about-you`}
                >
                  <div
                    className={` text-decoration-none d-flex menu-link-182 `}
                  >
                    <div>

                      <img
                        src={imagePath + "/static/media/DG/DataGathering.svg"}
                        width={20}
                      />
                    </div>
                    <div   className={`${pmc.menutext + " sidebar-custom-color"} `}>
                      Data Gathering
                    </div>
                  </div>
                </NavLink>
              </>
              }

            </div>
          )}
          <div
            id=""
            className={` ${pmc.menuitem} plan-of-action-cls`}
            style={{
              cursor: planIsExpired ===  "Y" ? "not-allowed" : "pointer",
              opacity: planIsExpired ===  "Y" ? 0.5 : 1,
            }}
          >
            <div
              id="Plan _of_Action"
              onClick={(e) => {
                if (planIsExpired === "Y") {
                  e.preventDefault(); // block click
                  return;
                }
                navigate(`${process.env.PUBLIC_URL}/commondashboard`);
                dispatch({
                  type: "CHANGE_COMMONDASHBOARD",
                  payload: "planofaction",
                });
              }}
              className={`text-decoration-none d-flex menu-link-182 ${pmc.menulink} ${
                showPage === "planofaction"
                ? `${pmc.activeMenu + " sidebar-custom-color-activeMenu"}`
                : `${pmc.Inactive}`
                }`}
                
            >
              <div>
                <img src={imagePath + PlanofAction} width={20} />
              </div>
              <div style={{
                cursor: planIsExpired === "Y" ? "not-allowed" : "pointer",
                opacity: planIsExpired === "Y" ? 0.5 : 1,
              }} className={`${pmc.menutext + " sidebar-custom-color"}`}>
                Plan of Action 
              </div>
            </div>
          </div>

       

          <div className={`PortfolioCoach ${pmc.menuitem} `}>
            <NavLink
              className={({ isActive, isPending }) =>
                "text-decoration-none " +
                (isActive
                  ? `${pmc.activeMenu + " sidebar-custom-color-activeMenu"}`
                  : `${pmc.Inactive}`)
              }
              to={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/`}
            >
              <div
                // onClick={() => {
                //   dispatch({
                //     type: "CHANGE_COMMONDASHBOARD",
                //     payload: "dashboard",
                //   });
                // }}
                className={` text-decoration-none d-flex menu-link-182 `}
              >
                <div>
                  <img
                    // src={
                    //   process.env.REACT_APP_STATIC_URL +
                    //   "media/DMF/03_personal_tax.svg"
                    // }
                    src={imagePath + PersonalTax}
                    width={20}
                  />
                </div>
                <div className={`${pmc.menutext + " sidebar-custom-color"} `}>
                  Portfolio{" "}
                </div>
              </div>
            </NavLink>
          </div>
          <div className={`ReportItem ${pmc.menuitem}`}>
            <NavLink
              className={`text-decoration-none d-flex menu-link-182 ${pmc.menulink
                } ${showPage === "dashboard" &&
                  (removeSlash(currentLocation) == "/commondashboard/Report" ||
                    removeSlash(currentLocation) == "/commondashboard/Report-details")
                  ? `${pmc.activeMenu + " sidebar-custom-color-activeMenu"}`
                  : `${pmc.Inactive}`
                }`}
              to={`${process.env.PUBLIC_URL}/commondashboard/Report`}
            >
              <div
                // onClick={() => {
                //   dispatch({
                //     type: "CHANGE_COMMONDASHBOARD",
                //     payload: "dashboard",
                //   });
                // }}
                className={` text-decoration-none d-flex menu-link-182 `}
              >
                <div>
                  <img
                    // src={
                    //   process.env.REACT_APP_STATIC_URL +
                    //   "media/DMF/04_transactions.svg"
                    // }
                    src={imagePath + Transaction}
                    width={20}
                  />
                </div>
                <div
                  style={{
                    paddingTop: ".1rem",
                  }}
                  className={`${pmc.menutext + " sidebar-custom-color"} `}
                >
                  Report{" "}
                </div>
              </div>
            </NavLink>
          </div>
          <div className={` ${pmc.menuitem}`}>
            <NavLink
              className={({ isActive, isPending }) =>
                "text-decoration-none " +
                (isPending
                  ? pmc.pendingMenu
                  : isActive
                    ? pmc.activeMenu + " sidebar-custom-color-activeMenu"
                    : pmc.InactiveMenu)
              }
              to={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard/transaction`}
            >
              <div
                // onClick={() => {
                //   dispatch({
                //     type: "CHANGE_COMMONDASHBOARD",
                //     payload: "dashboard",
                //   });
                // }}
                className={` text-decoration-none d-flex menu-link-182 `}
              >
                <div>
                  <img
                    src={imagePath + Transaction}
                    width={20}
                  />
                </div>
                <div className={`${pmc.menutext + " sidebar-custom-color"} `}>
                  Transaction{" "}
                </div>
              </div>
            </NavLink>
          </div>

          <hr className="mt-md-3 ms-3 d-none d-md-block" />
          <div className={`d-none d-md-block mt-4 mb-4 ${pmc.RmBox}`}>
            {paymentCompleted && planExpiryDate && (
              <>
                <div>
                  <span>
                    {" "}
                    <img
                      src={Expiry}

                      width={20}
                    />{" "}
                  </span>
                  <span className={pmc.MailTxt}>Plan Expiry Date</span>
                </div>
                <div className={pmc.Rminfo} style={{ width: "100%", padding: ".4rem 0" }}>{planExpiryDate}</div>
              </>
            )}
          </div>
          {paymentCompleted && planExpiryDate && (
            <hr className="mt-md-3 ms-3 d-none d-md-block" />
          )}
          {rmdetails && Object.keys(rmdetails).length != 0 ? (
            <div
              style={
                {
                  // display : "none"
                }
              }
              className={`${pmc.RmBox} d-none d-md-block`}

            >
              <div className={pmc.RmImg}>
                {rmdetails.imagepath != "" ? (
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL_PYTHON +
                      rmdetails.imagepath
                    }
                  />
                ) : (
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DMF/profile-picture.svg"
                    }
                  />
                )}
              </div>
              <div
                style={{
                  lineHeight: "21px",
                }}
              >
                <div className={pmc.RmProfile}>
                  {planuuid == "fp_robo" ? (
                    ""
                  ) : (
                    <>
                      {planuuid != "fp_robo"
                        ? "Wealth Manager"
                        : ""}
                    </>
                  )}
                </div>
                <div className={pmc.RmName}>
                  {rmdetails.emp_name}
                </div>
              </div>
              <hr width={100} className="mt-2 mb-2" />
              <div
                className="mb-2"
                style={{
                  lineHeight: "21px",
                  marginTop: "1rem"
                }}
              >
                <div>
                  <span>
                    {" "}
                    <img
                      src={Mail}
                      style={{
                        opacity: ".4",
                      }}
                      width={14}
                    />{" "}
                  </span>
                  <span className={pmc.MailTxt}>Email</span>
                </div>
                <div ref={emailContainerRef} className={pmc.Rminfo}>{rmdetails.username}</div>
              </div>
              <div
                style={{
                  lineHeight: "21px",
                  marginTop: "1rem"
                }}
              >
                <div>
                  <span>
                    {" "}
                    <img
                      src={Call}
                      style={{
                        opacity: ".4",
                      }}
                      width={14}
                    />{" "}
                  </span>
                  <span className={pmc.MailTxt}>Mobile No.</span>
                </div>
                <div className={pmc.Rminfo}>{rmdetails.emp_mobile}</div>
              </div>
              <div className={pmc.bookDemo}>
                {/* <button onClick={() => setShow(true)}>Book appointment</button> */}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Calendly
        show={show}
        handleClose={() => setShow(false)}
        calendlydata={calendlydata}
        rmdetails={rmdetails}
      />

      <Modal
        className="Modalpopup"
        open={open}
        showCloseIcon={false}
        onClose={onCloseModal}
        center
      >
        <div className="text-center">
          <h2 className="HeaderText">Attention !!</h2>
          <RenewPopup
            open={open}
            onClose={onCloseModal}
            subscriptionenddate={subscriptionenddate}
          />
        </div>
      </Modal>

    </>
  );
};

export default CommonDSidebar;
