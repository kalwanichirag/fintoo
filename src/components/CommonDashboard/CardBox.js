import React, { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Trade from "../../Assets/Images/CommonDashboard/Trade.png";
import Medicalinsurance from "../../Assets/Images/CommonDashboard/02_Medical_insurance.png";
import DataGathering from "../../Assets/Images/CommonDashboard/01_data_gathering.png";
import FinancialPlan from "../../Assets/Images/CommonDashboard/02_build_financial_plan.png";
import {
  imagePath,
  DATA_BELONGS_TO,
  CHECK_SESSION,
} from "../../constants";
import RenewPopup from "./RenewPopup";
import Button from "react-bootstrap/Button";
import Modal from "react-responsive-modal";
import {
  apiCall,
  getItemLocal,
  getUserId,
  getParentUserId,
  getFpUserDetailId,
  restApiCall,
  addSuffix,
  fetchEncryptData,
  getFpLogId,
} from "../../common_utilities";
import { Link } from "react-router-dom";
import KYCTextbox from "./KYCTextbox";
import RenewPopupTextbox from "./RenewPopupTextbox";
import commonEncode from "../../commonEncode";
import Slider from "react-slick";
import CreditReport from "./CreditScore/CreditReport";
import * as BootModal from "react-bootstrap";
import Fetchloan from "../../Pages/datagathering/AssetsLibDG/CIIBIL_Report/Fetchloan";
import Scorecard from "./Scorecard";
import CalendarIcon from "../../Assets/Images/CommonDashboard/calender.svg";
import MFReport from "./MFReport/MFReport";
import Nsdlcsdl from "../../Pages/datagathering/AssetsLibDG/NSDL_CSDL/Nsdlcsdl";
import MFReportModal from "../../Pages/datagathering/MFReport/MFReportModal";
import Reportmodal from "./Report/Reportmodal";
import Fetchreport from "./Report/Fetchreport";
import { getReports } from "../../Services/ReportService";
import TaxFiling from "./TaxFiling";
import InvestMutualFund from "./InvestMutualFund";
import SavingAccountSection from "../../Pages/MoneyManagement/views/CommonDashboard/SavingAccountSection";
import GlobalInvestment from "./GlobalInvestment";
import { GetNetworthLiabilites } from "../../FrappeIntegration-Services/services/financial-planning-api/dashboardApi";
import { getMedicalInsurance } from "../../FrappeIntegration-Services/services/financial-planning-api/insurance";
import { GetDocumentDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/document";
import { fetchUserProfileDetails } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { Getpaymentstatus } from "../../FrappeIntegration-Services/services/payment-api/paymentapiService";
import MainDashboard from "../dashboardnew/MainContent";
import { loginWebEngageSafe } from "../../Utils/Webengage/safeLogin";

function CardBox({ lifecyclestatus, renewpopup, subscriptionenddate }) {
  const planIsExpired = getItemLocal("plan_is_expired");
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [sessionData, setSessionData] = useState({});
  const [isFetched, setIsFetched] = useState(false);
  const [openModalByName, setOpenModalByName] = useState("");
  const [allMembers, setAllMembers] = useState([]);
  const [defaultSelectedMember, setDefaultSelectedMember] = useState([]);
  const [isPlan, setIsPlan] = useState(true);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [networtliabilitesdata, setNetwortLiabilitesData] = useState({});
  const [lifeinsuranceData, setLifeInsuranceCoverData] = useState("");
  const [error, setError] = useState(false);
  const sliderRef = useRef();
  const sliderRef2 = useRef();
  const sliderRef1 = useRef();
  const [isDataLoaded, setDataLoadFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);





  // const [equifaxDetails, setEquifaxDetails] = useState([]);
  const date = new Date().getUTCDate();
  const year = new Date().toLocaleDateString("en", { year: "2-digit" });
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = new Date();

  const [reportsData, setReportData] = useState({
    PAR: {
      Link: '',
      last_generated_Date: ''
    },
    MF: {
      Link: '',
      last_generated_Date: ''
    }
  });

  useEffect(() => {
    fetchReportsData();
  }, [])

  const fetchReportsData = async () => {
    const userId = getUserId();

    // const ReportData = await getReports([userId], [182, 163]);
    const ReportData = await GetDocumentDetails(getUserId(), DATA_BELONGS_TO, "mf_screening_report,par_report");


    const PARReportLink =
      ReportData?.data?.length > 0
        ? ReportData.data.filter(
          (data) => data.user_document_user_id == userId && data.document_cat_uuid == "par_report"
        )[0]
        : "";
    const MFReportLink =
      ReportData?.data?.length > 0
        ? ReportData.data.filter(
          (data) => data.user_document_user_id == userId && data.document_cat_uuid == "mf_screening_report"
        )[0]
        : "";




    setReportData(prev => ({
      ...prev,
      PAR: {
        Link: PARReportLink?.document_file_url,
        last_generated_Date: PARReportLink?.creation
      },
      MF: {
        Link: MFReportLink?.document_file_url,
        last_generated_Date: MFReportLink?.creation
      }
    }))
  }

  useEffect(() => {
    getEquifaxData();
    getNetwortLiabilites();
    getLifeInsuranceCover();
  }, []);

  const userid = getParentUserId();


  // {
  //   console.log("pp fp user id: ", getFpUserDetailId());
  // }

  // const getSessiondata = async() => {
  //   let url = '';
  // let url = CHECK_SESSION;
  //   let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
  //   let session_data = await apiCall(url, data, true, false);
  //   setSessionData(session_data["data"]);

  //   console.log("pp ss: ", session_data);
  // }

  const CloseLoanModal = () => {
    setOpenModalByName(null);
    sliderRef.current.slickPlay();
    sliderRef2.current.slickPlay();
  };
  const CloseparModal = () => {
    setOpenModalByName(null)
    sliderRef.current.slickPlay();
    sliderRef2.current.slickPlay();
    fetchReportsData()
  }

  const CloseMfModal = () => {
    sliderRef.current.slickPlay();
    sliderRef2.current.slickPlay();
    fetchReportsData()
  }

  const getEquifaxData = async () => {
    // var session_data = props.sessiondata
    // let url = '';
    // let url = CHECK_SESSION;
    // let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    // let session_data = await apiCall(url, data, true, false);
    // setSessionData(session_data["data"]);

    // // console.log("pp ss: ", session_data);
    // try {
    //   var isPlanActive = true;
    //   // if(session_data.data['user_details'].fp_log_id == null){
    //   //   isPlanActive = false;
    //   // }
    //   // setIsPlan(isPlanActive);
    //   let reqdata = null;
    //   if (session_data.data["user_details"].fp_log_id == null) {
    //     reqdata = {
    //       user_id: session_data["data"].id,
    //       is_plan: "0",
    //     };
    //     setIsPlan(false);
    //   } else {
    //     reqdata = {
    //       user_id: session_data["data"].id,
    //       fp_log_id: session_data["data"].fp_log_id,
    //     };
    //     setIsPlan(true);
    //   }

    // let respData = await restApiCall(
    //   '',
    //   reqdata,
    //   true,
    //   false
    // );

    //   if (respData.error_code == "100") {
    //     // setEquifaxData(respData.data);
    //     let member_selected = "";

    //     if (getItemLocal("family")) {
    //       member_selected = "all";
    //     } else {
    //       member_selected = "member_id";
    //     }
    //     let member_id = getFpUserDetailId();

    //     if (respData.valid_members.length > 0) {
    //       var valid_members = respData.valid_members;

    //       const all = respData.valid_members.map((v) =>
    //         v.relation_id == 1
    //           ? {
    //             name: v.first_name + " " + v.last_name,
    //             id: v.id,
    //             dob: v.dob,
    //             pan: v.PAN,
    //             mobile: v.alternate_mobile,
    //             label: v.first_name + " " + v.last_name + " (Self)",
    //             value: v.id,
    //           }
    //           : {
    //             name: v.first_name + " " + v.last_name,
    //             id: v.id,
    //             dob: v.dob,
    //             pan: v.PAN,
    //             mobile: v.alternate_mobile,
    //             label: v.first_name + " " + v.last_name,
    //             value: v.id,
    //           }
    //       );
    //       setAllMembers([...all]);

    //       for (let i = 0; i < valid_members.length; i++) {
    //         // check for Family option, show for self
    //         if (
    //           (member_selected == "all" && valid_members[i].relation_id == 1) ||
    //           (member_selected == "member_id" &&
    //             valid_members[i].id == member_id)
    //         ) {

    //           let mem = valid_members[i];

    //           if (mem.relation_id == 1) {
    //             setDefaultSelectedMember({
    //               name: mem.first_name + " " + mem.last_name,
    //               id: mem.id,
    //               dob: mem.dob,
    //               pan: mem.PAN,
    //               mobile: mem.alternate_mobile,
    //               label: mem.first_name + " " + mem.last_name + " (Self)",
    //               value: mem.id,
    //             });
    //           } else {
    //             setDefaultSelectedMember({
    //               name: mem.first_name + " " + mem.last_name,
    //               id: mem.id,
    //               dob: mem.dob,
    //               pan: mem.PAN,
    //               mobile: mem.alternate_mobile,
    //               label: mem.first_name + " " + mem.last_name,
    //               value: mem.id,
    //             });
    //           }

    //           break;
    //         }
    //       }
    //     } else {
    //       setAllMembers([]);
    //     }

    //     if (respData.data.length > 0) {
    //       let equifax_data = respData.data;

    //       for (let i = 0; i < equifax_data.length; i++) {

    //         // check for Family option, show for self
    //         if (
    //           (member_selected == "all" && equifax_data[i].relation_id == 1) ||
    //           (member_selected == "member_id" &&
    //             equifax_data[i].member_id == member_id)
    //         ) {
    //           let credit_score = equifax_data[i].cibil_score;
    //           setIsFetched(true);
    //           //   setEquifaxDetails({
    //           //     id: equifax_data[i].id,
    //           //     member_id: equifax_data[i].member_id,
    //           //     first_name: equifax_data[i].first_name,
    //           //     last_updated: equifax_data[i].Updated_datetime,
    //           //     can_refresh: equifax_data[i].canRefresh,
    //           //     refreshDate: equifax_data[i].refreshDate,
    //           //     cibil_score: equifax_data[i].cibil_score
    //           //  });
    //           break;
    //         }
    //       }
    //     }
    //   } else {
    //     setAllMembers([]);
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const getNetwortLiabilites = async () => {
    try {
      // let url = '';
      // let url = CHECK_SESSION;
      // let data = { user_id: userid, sky: getItemLocal("sky") };
      // let session_data = await apiCall(url, data, true, false);

      // let fp_log_id = "";
      // try{
      //   fp_log_id = await getFpLogId()
      // }
      // catch (e) {
      //   fp_log_id = ""
      // }
      // let assetsget = {
      //   method: "post",
      //   url: '',
      //   data: {
      //     update_share: "1",
      //     filter_id: "0",
      //     user_id: getParentUserId(),
      //     fp_log_id: fp_log_id,
      //   },
      // };
      // let assetsget_data = await fetchEncryptData(assetsget);

      // let member_id = props?.member_id ? props.member_id : getUserId();
      let member_id = getFpUserDetailId();

      // let member_selected = props.member_selected ? "member_id" : "all";
      let member_selected;

      if (getItemLocal("family")) {
        member_selected = "all";
      } else {
        member_selected = "member_id";
      }

      var networtliabilites_data = await GetNetworthLiabilites(getParentUserId(), getUserId(), member_selected, DATA_BELONGS_TO)
      if ((networtliabilites_data.status_code = 200 && networtliabilites_data.data != "")) {
        setNetwortLiabilitesData(networtliabilites_data.data);
      } else {
        setNetwortLiabilitesData({ "asset_data": 0, "asset_sum_formatted": "0", "liability_sum": 0, "liability_sum_formatted": "0", "networth_sum": 0, "networth_sum_formatted": "0" });
      }
    } catch (e) {
      setError(true);
    }
  };

  const getLifeInsuranceCover = async () => {
    try {
      const userId = getParentUserId();

      if (!userId) {
        console.error('User ID not found');
        setIsLoading(false);
        return;
      }

      let member_id = getUserId();
      // member_id = getFpUserDetailId();
      let member_selected = "";

      if (getItemLocal("family")) {
        member_selected = "all";
      } else {
        member_selected = "member_id";
      }
      const decoded_res = await getMedicalInsurance(userId, member_selected, member_id);
      if (decoded_res["status_code"] == "200") {
        setDataLoadFlag(true);
        setIsLoading(false);
        setLifeInsuranceCoverData(decoded_res["data"]);
      } else {
        setDataLoadFlag(true);
        setIsLoading(false);
        setLifeInsuranceCoverData({
          life_insurance_sum_assured: 0,
          life_insurance_sum_assured_formatted: "0",
          medical_insurance_sum_assured: 0,
          medical_insurance_sum_assured_formatted: "0",
        });
      }
    } catch (e) {
      setError(true);
    }
  };


  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    autoplaySpeed: 8000,
    autoplay: false,
    fade: false,
    slidesToShow: 1,
    // slidesToScroll: 1,
    arrows: false,
    margin: 20,
    centerPadding: "20",
    dotsClass: "slick-dots categories-slick-dots dashboard-slick-dots",
  };

  useEffect(() => {
    if (!networtliabilitesdata) return;

    if (window.webengage) {
      // Net Worth / Family Net Worth
      window.webengage.user.setAttribute(
        getItemLocal("family") ? "networth_value" : "networth_value",
        `${networtliabilitesdata.networth_sum_formatted || "0"}`
      );

      // Assets
      window.webengage.user.setAttribute(
        "Assets",
        `${networtliabilitesdata.asset_sum_formatted || "0"}`
      );

      // Liabilities
      window.webengage.user.setAttribute(
        "Liabilities",
        `${networtliabilitesdata.liability_sum_formatted || "0"}`
      );
    }
  }, [networtliabilitesdata]);

  const [userLeadId, setUserLeadId] = useState(null);

  useEffect(() => {
    const getUserLead = async () => {
      const res = await fetchUserProfileDetails(getUserId());
      console.log(res, "userleadid response");
      setUserLeadId(res?.data?.user_lead_id);
    };

    getUserLead(); // ✅ call it
  }, []);

  useEffect(() => {
    if (!userLeadId) return;
    const loggedIn = loginWebEngageSafe(userLeadId);
    if (loggedIn) {
      console.log("WebEngage login done:", userLeadId);
    }
  }, [userLeadId]);

  const renewalDate = async () => {
  try {
    const parentUserId = getParentUserId();
    if (!parentUserId) {
     // console.error(" Parent user ID missing");
      return;
    }

    const payload = {
      user_id: parentUserId,
      data_belongs_to: DATA_BELONGS_TO,
    };

    const res = await Getpaymentstatus(payload);
   // console.log(" Payment status response:", res);

    if (res?.status_code == 200) {
      const expiryDate = res?.data?.plan_expiry_date;

      if (!expiryDate) {
      //  console.warn(" Plan expiry date missing");
        return;
      }

      if (window.webengage?.user) {
     console.log(" Sending renewal date to WebEngage:", expiryDate);

        window.webengage.user.setAttribute({
          "Renewal Date": expiryDate,
        });
      }
    }
  } catch (error) {
   // console.error(" Error fetching renewal date:", error);
  }
};

useEffect(() => {
  if (!userLeadId) return;
  renewalDate();
}, [userLeadId]);


const [useNewDashboard, setUseNewDashboard] = useState(true);

  return (
    <>
 {useNewDashboard ? (
      <MainDashboard />
    ) : (
          <>
<MainDashboard/>
      <div className="d-md-flex justify-content-md-between justify-content-md-center">
        {renewpopup == 1 ? (
          <div className="RenewMsgbox">
            <RenewPopupTextbox showpopup={true} />
          </div>
        ) : (
          ""
        )}
        {renewpopup != 1 && <div className="RenewMsgbox">{<KYCTextbox />}</div>}
      </div>

      <div className=" ml-auto ">
        <div style={{
          margin: "0rem"
        }} className="row ">
          <div className="col-md-4 col-lg-4 col-12">
            <Slider ref={sliderRef2} {...settings}>
              <div className="cardBox GraphImg autoAdvisory">
                <div className="autoAdvisoryLabel">
                  {renewpopup == 1 ? (
                    <>
                      <div className="me-4 mt-4 AssettotalValue">
                        <div className="TextLabel">Assets Value</div>
                        <div className={`d-flex align-items-center`}>
                          <div className={`valueLabel ${networtliabilitesdata && (networtliabilitesdata.asset_sum_formatted || networtliabilitesdata.asset_sum_formatted === 0) ? null : "shine"}`}>
                            ₹{" "}
                            <span >
                              <span className="bigBalue">
                                {networtliabilitesdata &&
                                  networtliabilitesdata.asset_sum_formatted}
                              </span>
                            </span>
                          </div>
                          <div className="ps-4">
                            <Link
                              to={
                                process.env.PUBLIC_URL +
                                "/direct-mutual-fund/portfolio/dashboard/"
                              }
                            >
                              <img
                                width={20}
                                height={20}
                                className="pointer"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/DG/NextImg.svg"
                                }
                              />
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="autoAdvisoryLabel mt-3 d-flex">
                        <div className="borderRight">
                          <a className="text-decoration-none text-black" href="#">
                            <div className="me-3">
                              <div className="TextLabel">Liabilities</div>
                              <div className={`d-flex align-items-center justify-content-between ${networtliabilitesdata && (networtliabilitesdata.liability_sum_formatted || networtliabilitesdata.liability_sum_formatted === 0) ? null : "shine"}`}>
                                <div className="valueLabel">
                                  ₹{" "}
                                  <span>
                                    {networtliabilitesdata &&
                                      networtliabilitesdata.liability_sum_formatted}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div className="ms-3">
                          <a className="text-decoration-none text-black" href="#">
                            <div className="TextLabel">Net Worth</div>
                            <div className={`d-flex align-items-center justify-content-between ${networtliabilitesdata && (networtliabilitesdata.networth_sum_formatted || networtliabilitesdata.networth_sum_formatted === 0) ? null : "shine"}`}>
                              <div className="valueLabel">
                                ₹{" "}
                                <span className="bigBalue">
                                  {networtliabilitesdata &&
                                    networtliabilitesdata.networth_sum_formatted}
                                </span>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="me-4 mt-4 AssettotalValue">
                        <div className="TextLabel">Assets Value</div>
                        <div className={`d-flex align-items-center`}>
                          <div className={`valueLabel ${networtliabilitesdata && (networtliabilitesdata.asset_sum_formatted || networtliabilitesdata.asset_sum_formatted === 0) ? null : "shine"}`}>
                            ₹{" "}
                            <span >
                              <span className="bigBalue">
                                {networtliabilitesdata &&
                                  networtliabilitesdata.asset_sum_formatted}
                              </span>
                            </span>
                          </div>
                          <div className="ps-4">
                            <Link
                              to={
                                process.env.PUBLIC_URL +
                                "/direct-mutual-fund/portfolio/dashboard/"
                              }
                            >
                              <img
                                width={20}
                                height={20}
                                className="pointer"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/DG/NextImg.svg"
                                }
                              />
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="autoAdvisoryLabel mt-3 d-flex">
                        <div className="">
                          <a
                            className="text-decoration-none text-black"
                            href={
                              process.env.PUBLIC_URL +
                              "/datagathering/assets-liabilities"

                            }
                          >
                            <div className="me-3">
                              <div className="TextLabel">
                                {/* {!props.member_selected
                        ? "Family Net Worth"
                        : "Net Worth"} */}
                                Net Worth
                              </div>
                              <div className={`d-flex align-items-center justify-content-between ${networtliabilitesdata && (networtliabilitesdata.networth_sum_formatted || networtliabilitesdata.networth_sum_formatted === 0) ? null : "shine"}`}>
                                <div className="valueLabel">
                                  ₹{" "}
                                  <span className="bigBalue">
                                    {networtliabilitesdata &&
                                      networtliabilitesdata.networth_sum_formatted}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>
                        <div className="borderRight" style={{ margin: "0 2rem" }}></div>
                        <div className="ms-3">
                          <a
                            className="text-decoration-none text-black"
                            href={

                              process.env.PUBLIC_URL +
                              "/datagathering/assets-liabilities"

                            }
                          >
                            <div className="me-3">
                              <div className="TextLabel">
                                {/* {!props?.member_selected
                          ? "Overall Liabilities"
                          : "Liabilities"} */}
                                Liabilities
                              </div>
                              <div className={`d-flex align-items-center justify-content-between ${networtliabilitesdata && (networtliabilitesdata.liability_sum_formatted || networtliabilitesdata.liability_sum_formatted === 0) ? null : "shine"}`}>
                                <div className="valueLabel">
                                  ₹{" "}
                                  <span>
                                    {networtliabilitesdata &&
                                      networtliabilitesdata.liability_sum_formatted}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </a>
                        </div>

                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="cardBox  autoAdvisory lifeInsurance">
                {renewpopup == 1 ? (
                  <>
                    <div className="mt-4 autoAdvisoryLabel d-flex">
                      <div className="d-flex justify-content-end ms-4">
                        <a className="text-decoration-none text-black" href="#">
                          <div>
                            <div className="TextLabel">Medical Cover</div>
                            <div style={{ width: "50%" }} className={`d-flex align-items-center justify-content-between ${lifeinsuranceData && (lifeinsuranceData.medical_insurance_sum_assured_formatted || lifeinsuranceData.medical_insurance_sum_assured_formatted === 0) ? null : "shine"}`}>
                              <div className="valueLabel">
                                &#8377;{" "}
                                <span>
                                  {lifeinsuranceData.medical_insurance_sum_assured_formatted}
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                        {/* <div className="Imgbox">
                        <img className="" src={Medicalinsurance} width={130} />
                      </div> */}
                      </div>
                      <div className="borderRight" style={{ margin: "0 2rem" }}></div>
                      <div className="ms-3">
                        <a className="text-decoration-none text-black" href="#">
                          <div className="me-3">
                            <div className="TextLabel">
                              Life Insurance
                            </div>
                            <div className={`d-flex align-items-center justify-content-between ${lifeinsuranceData && (lifeinsuranceData.life_insurance_sum_assured_formatted || lifeinsuranceData.life_insurance_sum_assured_formatted === 0) ? null : "shine"}`}>
                              <div className="valueLabel">
                                &#8377;{" "}
                                <span className="bigBalue">
                                  {lifeinsuranceData.life_insurance_sum_assured_formatted}
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div style={{
                        float: "right",
                        // marginTop: "1.7rem"

                      }}>
                        <img
                          width={250}
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DG.svg"
                          }
                        />
                      </div>

                    </div>
                  </>
                ) : (

                  <div className="mt-4 autoAdvisoryLabel ">
                    <div className="">
                      <a
                        className="text-decoration-none text-black"
                        href={process.env.PUBLIC_URL +
                          "/datagathering/insurance"
                        }
                      >
                        <div className="me-3">
                          <div className="TextLabel">Life Insurance</div>
                          <div style={{ width: "50%" }} className={`d-flex align-items-center justify-content-between ${lifeinsuranceData && (lifeinsuranceData.life_insurance_sum_assured_formatted || lifeinsuranceData.life_insurance_sum_assured_formatted === 0) ? null : "shine"}`}>
                            <div className="valueLabel">
                              &#8377;{" "}
                              <span className="bigBalue">
                                {lifeinsuranceData.life_insurance_sum_assured_formatted}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className="d-flex mt-3">
                      <a
                        className="text-decoration-none text-black"
                        href={process.env.PUBLIC_URL +
                          "/datagathering/insurance"
                        }
                      >
                        <div>
                          <div className="TextLabel">Medical Cover</div>
                          <div style={{ width: "100%" }} className={`d-flex align-items-center justify-content-between ${lifeinsuranceData && (lifeinsuranceData.medical_insurance_sum_assured_formatted || lifeinsuranceData.medical_insurance_sum_assured_formatted === 0) ? null : "shine"}`}>
                            <div className="valueLabel">
                              &#8377;{" "}
                              <span>
                                {lifeinsuranceData.medical_insurance_sum_assured_formatted}
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                      {/* <div className="Imgbox">
                      <img className="" src={Medicalinsurance} width={130} />
                    </div> */}
                    </div>
                    <div style={{
                      float: "right",
                      marginTop: "-5.5rem"

                    }}>
                      <img
                        width={200}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/Mediclaim_Insurance.svg"
                        }
                      />
                    </div>
                  </div>
                )
                }
              </div>
            </Slider>
          </div>
      
          {lifecyclestatus == 0 ? (
            <div className="col-md-4 col-lg-4 col-12 DGCreditreport">
              <Slider ref={sliderRef} {...settings}>
              <div className="col-md-4 w-100 col-lg-4 col-12 cardBox ScoreCardBox FPlan  autoAdvisory ">
                <div className="pt-4" style={{}}>
                  <div style={{
                    fontSize: "1.2rem",
                    fontWeight: '400'
                  }}>Build Your</div>
                  <div style={{
                    fontSize: "1.5rem", fontWeight: "bold", textTransform: "uppercase"
                  }}>Financial Plan</div>
                </div>
                <div className="">
                  <button className="custom-background-color custom-border-color pointer" style={{ float: "left" }}>
                    <Link
                      to={`${process.env.PUBLIC_URL}/pricing`}
                      className=" investBtn"
                    >
                      Start Now </Link>
                  </button>
                </div>
                <div style={{ marginTop: window.innerWidth <= 768 ? '-1rem' : '1.5rem', float: "right" }}>
                  <img
                    width={200}
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/Person.svg"
                    }
                  />
                </div>
              </div>
              <div className="cardBox d-none p-0 autoAdvisory CreditReportbox" style={{ backgroundImage: isFetched ? "none" : "", }}>
                  <div style={{
                    borderRadius: "15px 137px 137px 15px",
                    background: "#fff",
                    width: "60%",
                    height: "100%",
                    padding: "1rem"
                  }}>
                    <CreditReport
                      sessiondata={sessionData}
                      userid={getParentUserId()}
                      isFetched={isFetched}
                      setOpenModalByName={(v) => {
                        sliderRef.current.slickPause();
                        sliderRef2.current.slickPause();
                        setOpenModalByName(v);
                      }}
                      isPlan={isPlan}
                    // equifaxDetails={equifaxDetails}
                    />
                  </div>
                </div>
              </Slider>
            </div>
          ) : (
            <div className="col-md-4 col-lg-4 col-12 DGCreditreport">
              <Slider ref={sliderRef} {...settings}>
              <div className="col-md-4 w-100 col-lg-4 col-12 cardBox ScoreCardBox FPlan">
                <div className="pt-4" style={{}}>
                  <div style={{
                    fontSize: "1.2rem",
                    fontWeight: '400'
                  }}> Complete Your</div>
                  <div style={{
                    fontSize: "1.5rem", fontWeight: "bold", textTransform: "uppercase"
                  }}>Data Gathering</div>
                </div>
                <div className="">
                  {renewpopup === 1 ? (
                    <button className="pointer" onClick={onOpenModal}
                      style={{
                        padding: ".4rem 1.4rem",
                        backgroundColor: "#042b62",
                        border: "1px solid #042b62",
                        float: "left"
                      }}>
                      Start Now
                    </button>
                  ) : (<>
                    <button className="pointer"
                      style={{
                        // padding: ".4rem 1.4rem",
                        backgroundColor: "#042b62",
                        border: "1px solid #042b62",
                        float: "left"
                      }}>
                      <a
                        href={planIsExpired === "Y" ? process.env.PUBLIC_URL + "/pricing" : process.env.PUBLIC_URL + "/datagathering/about-you"}
                        className="text-uppercase investBtn"
                      >
                        Start Now </a>
                    </button>
                  </>)}
                </div>
                <div className="BgImgs" style={{
                  float: "right",
                  // marginTop: "1.7rem"

                }}>
                  <img
                    width={250}
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DG.svg"
                    }
                  />
                </div>
              </div>
              <div className="cardBox d-none p-0 autoAdvisory CreditReportbox" style={{ backgroundImage: isFetched ? "none" : "", }}>
                  <div style={{
                    borderRadius: "15px 137px 137px 15px",
                    background: "#fff",
                    width: "60%",
                    height: "100%",
                    padding: "1rem"
                  }}>
                    <CreditReport
                      sessiondata={sessionData}
                      userid={getParentUserId()}
                      isFetched={isFetched}
                      setOpenModalByName={(v) => {
                        sliderRef.current.slickPause();
                        sliderRef2.current.slickPause();
                        setOpenModalByName(v);
                      }}
                      isPlan={isPlan}
                    // equifaxDetails={equifaxDetails}
                    />
                  </div>
                </div> 
 </Slider>

            </div>
          )}
          <div className="col-md-4 col-lg-4 col-12">
            <Slider ref={sliderRef} {...settings}>
              <div
                className="cardBox p-0 autoAdvisory mfReportbox"
                style={{ backgroundColor: "#EEF9FF" }}
              >
                <div
                  style={{
                    borderRadius: "15px 137px 137px 15px",
                    background: "#fff",
                    width: "60%",
                    height: "100%",
                    padding: "1rem",
                  }}
                >
                  <MFReport
                    setOpenModalByName={(v) => {
                      sliderRef1.current.slickPause();
                      sliderRef.current.slickPause();
                      setOpenModalByName(v);
                    }}
                    popup={"mfreport"}
                    title={"MF Screening"}
                    reportLink={reportsData.MF}
                  />
                </div>
                {/* */}
              </div>
              <div className="cardBox p-0 autoAdvisory ParReportbox" style={{ backgroundColor: "#EEF9FF", }}>
                <div style={{
                  borderRadius: "15px 137px 137px 15px",
                  background: "#fff",
                  width: "60%",
                  height: "100%",
                  padding: "1rem"
                }}>
                  <MFReport
                    //  hideSlide={sliderRef2.current.slickPause()}
                    setOpenModalByName={(v) => {
                      sliderRef2.current.slickPause();
                      sliderRef.current.slickPause();
                      setOpenModalByName(v);
                    }}
                    popup={"parreport"}
                    title={"Consolidated Portfolio"}
                    reportLink={reportsData.PAR}
                  />
                </div>
                {/* */}
              </div>
            </Slider>
          </div>
        </div>
      </div>
      <SavingAccountSection />
      <div className="mt-5" style={{ margin: "0 1rem" }}>
        <div className="row gap-4 gap-md-0 gap-lg-0">
          <div className="col-md-4 col-lg-4 col-12">
            <Slider ref={sliderRef1} {...settings}>
              <div
                className="cardBox p-0 autoAdvisory mfReportbox"
                style={{ backgroundColor: "#EEF9FF" }}
              >
                <div
                  style={{
                    borderRadius: "15px 137px 137px 15px",
                    background: "#fff",
                    width: "60%",
                    height: "100%",
                    padding: "1rem",
                  }}
                >
                  <TaxFiling
                    setOpenModalByName={(v) => {
                      sliderRef1.current.slickPause();
                      sliderRef.current.slickPause();
                      setOpenModalByName(v);
                    }}
                    popup={"mfreport"}
                    title={"Tax Filing"}
                    reportLink={reportsData.MF}
                  />
                </div>
                {/* */}
              </div>
            </Slider>
          </div>
          <div className="col-md-4 col-lg-4 col-12">
            <Slider ref={sliderRef1} {...settings}>
              <div
                className="cardBox p-0 autoAdvisory mfReportbox mfInvestExplore"
                style={{ backgroundColor: "#EEF9FF" }}
              >
                <div
                  style={{
                    borderRadius: "15px 137px 137px 15px",
                    background: "#fff",
                    width: "60%",
                    height: "100%",
                    padding: "1rem",
                  }}
                >
                  <InvestMutualFund
                    setOpenModalByName={(v) => {
                      sliderRef1.current.slickPause();
                      sliderRef.current.slickPause();
                      setOpenModalByName(v);
                    }}
                    popup={"mfreport"}
                    title={"Tax Filing"}
                    reportLink={reportsData.MF}
                  />
                </div>
                {/* */}
              </div>
            </Slider>
          </div>
          <div className="col-md-4 col-lg-4 col-12">
            <Slider ref={sliderRef1} {...settings}>
              <div
                className="cardBox p-0 autoAdvisory goalInvestment"
                style={{ backgroundColor: "#EEF9FF" }}
              >
                <div
                  style={{
                    borderRadius: "15px 137px 137px 15px",
                    background: "#fff",
                    width: "60%",
                    height: "100%",
                    padding: "1rem",
                  }}
                >
                  <GlobalInvestment />
                </div>
                {/* */}
              </div>
            </Slider>
          </div>
        </div>
      </div>

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

      {/* {isFetched == false &&  */}
      <BootModal.Modal
        dialogClassName="Nsdlcsdl-modal-width"
        className="Modalpopup"
        show={openModalByName == "Fecth_your_Loan"}
        centered
        animationDuration={0}
      >
        <Fetchloan
          Closemodal={CloseLoanModal}
          session={sessionData}
          allMembers={allMembers}
          isCardBox={true}
          getEquifaxData={getEquifaxData}
          defaultSelectedMember={defaultSelectedMember}
          is_plan={isPlan}
        />
      </BootModal.Modal>


      <Reportmodal open={openModalByName == 'PAR_Report'} Closemodal={CloseparModal}
        forpar={true} fetchReportsData={fetchReportsData} />


      <MFReportModal open={openModalByName == 'MF_Screening'} CloseMfModal={CloseMfModal} setOpenModalByName={setOpenModalByName} fetchReportsData={fetchReportsData} />
 </>
       )}
       
      {/* for Success Popup */}
      {/* <BootModal.Modal dialogClassName="Nsdlcsdl-modal-width"
        className="Modalpopup"
        show={open == "PAR_Report_Success"}
        centered
        animationDuration={0}  >
        <Fetchreport Closemodal={CloseSuccessReportModal} />
      </BootModal.Modal> */}
    </>
  );
}

export default CardBox;
