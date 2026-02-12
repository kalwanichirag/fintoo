import { useState, useEffect, useRef } from "react";
// import CalendarIcon from "../../Assets/Images/CommonDashboard/calendar-323.png";
import { DATA_BELONGS_TO, imagePath } from "../../constants";
import Slider from "react-slick";
import {
  addSuffix,
  apiCall,
  restApiCall,
  fetchEncryptData,
  getFpUserDetailId,
  getItemLocal,
  getParentUserId,
  getUserId,
  getMemberId,
} from "../../common_utilities";
import {
  BASE_API_URL,
} from "../../constants";
import commonEncode from "../../commonEncode";
import { ADVISORY_GET_SCORECARD_API_URL, CHECK_SESSION, ADVISORY_DOWNLOAD_REPORT, FRAPPE_API_URL } from "../../constants";
import { useDispatch } from "react-redux";
import apiClient from "../../FrappeIntegration-Services/services/apiClient";
import Cookies from 'js-cookie';
import Scorecard from "./Scorecard";
import MeterBox from "./Scorecard";
import RenewPopup from "./RenewPopup";
import Modal from "react-responsive-modal";
import * as BootModal from "react-bootstrap";
import BootStrapModal from "react-bootstrap/Modal";
import DownloadModal from "./DownloadModal";
import KYCPopup from "./KYCPopup";
import Graph from "../../Assets/Images/CommonDashboard/04_graph_new.svg";
import RenewPopupTextbox from "./RenewPopupTextbox";
import KYCTextbox from "./KYCTextbox";
import { Link } from "react-router-dom";
import CreditReport from "./CreditScore/CreditReport";
import Fetchloan from "../../Pages/datagathering/AssetsLibDG/CIIBIL_Report/Fetchloan";
import Reportmodal from "./Report/Reportmodal";
import MFReportModal from "../../Pages/datagathering/MFReport/MFReportModal";
import MFReport from "./MFReport/MFReport";
import { getReports } from "../../Services/ReportService";
import TaxFiling from "./TaxFiling";
import InvestMutualFund from "./InvestMutualFund";
import SavingAccountSection from "../../Pages/MoneyManagement/views/CommonDashboard/SavingAccountSection";
import GlobalInvestment from "./GlobalInvestment";
import RecommendationList from "./Recom/RecommendationList";
import Style from "./Recom/style.module.css"
import { GetNetworthLiabilites, GetScoreCard } from "../../FrappeIntegration-Services/services/financial-planning-api/dashboardApi";
import { getMedicalInsurance } from "../../FrappeIntegration-Services/services/financial-planning-api/insurance";
import { GetDocumentDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/document";
import MainDashboard from "../dashboardnew/MainContent";
import { fetchUserProfileDetails } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";

function CardBoxGoals(props) {
  const renewpopup = props.renewpopup;
  const dispatch = useDispatch();
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDates, setSelecteDates] = useState([]);
  const [error, setError] = useState(false);
  const [scorecardvalue, setScorecardValue] = useState(0);
  const [ssessiondata, setSessionData] = useState({});
  const [kycDone, setKycDone] = useState(false);
  const [fpDone, setFPDone] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [spinneremail, setSpinneremail] = useState(0);
  const [emailLoading, setEmailLoading] = useState({ PAR: false, MF: false });
  const date = new Date().getUTCDate();
  const [allMembers, setAllMembers] = useState([]);
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
      Link: "",
      last_generated_Date: "",
    },
    MF: {
      Link: "",
      last_generated_Date: "",
    },
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    const userId = getUserId();

    // const ReportData = await getReports([userId], [182, 163]);
    const ReportData = await GetDocumentDetails(getUserId(), DATA_BELONGS_TO, "mf_screening_report,par_report");


    const PARReportLink =
      ReportData.data?.length > 0
        ? ReportData.data.filter(
          (data) => data.user_document_user_id == userId && data.document_cat_uuid == "par_report"
        )[0]
        : "";
    const MFReportLink =
      ReportData.data?.length > 0
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

  const [childData, setChildData] = useState("");
  const [memberID, setMemberID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMemberSelected, setMember] = useState(false);
  const [isDataLoaded, setDataLoadFlag] = useState(false);
  const [lifeinsuranceData, setLifeInsuranceCoverData] = useState("");
  const [networtliabilitesdata, setNetwortLiabilitesData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openModalByName, setOpenModalByName] = useState("");
  const [kycModal, setKycModal] = useState(false);
  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  const [GraphUrl, setGraphUrl] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [defaultSelectedMember, setDefaultSelectedMember] = useState([]);
  const sliderRef = useRef();
  const sliderRef1 = useRef();
  useEffect(() => {
    getSummary();
    getLifeInsuranceCover();
    getNetwortLiabilites();
    getDocument();
    getEquifaxData();

    var graph_img = imagePath + "https://stg.minty.co.in" + Graph;
    setGraphUrl(graph_img);

    // document.getElementById('GraphImage').style.background = 'url(' + imagePath + "https://stg.minty.co.in" + Graph + ") no-repeat right top";
  }, [props?.member_id, props?.member_selected]);

  const userid = getParentUserId();

  const getEquifaxData = async () => {
    // var session_data = props.sessiondata
    // let url = CHECK_SESSION;
    // let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
    // let session_data = await apiCall(url, data, true, false);
    // // setSession(session_data["data"]);

    // try {
    //   let reqdata = {
    //     user_id: session_data["data"].id,
    //     fp_log_id: session_data["data"].fp_log_id,
    //   };
    //   let respData = await restApiCall(
    //     ADVISORY_GETEQUIFAX_MEMBER_DATA_API,
    //     reqdata,
    //     true,
    //     false
    //   );

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
    //           // let credit_score = valid_members[i].cibil_score;
    //           // setIsFetched(true);
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
    //         // let member_selected = props.member_selected ? "member_id" : "all";

    //         // check for Family option, show for self
    //         if (
    //           (member_selected == "all" && equifax_data[i].relation_id == 1) ||
    //           (member_selected == "member_id" &&
    //             equifax_data[i].member_id == member_id)
    //         ) {
    //           let credit_score = equifax_data[i].cibil_score;
    //           setIsFetched(true);

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

  const getSummary = async () => {
    try {
      // let url = CHECK_SESSION;
      // let data = { user_id: userid, sky: getItemLocal("sky") };
      // let session_data = await apiCall(url, data, true, false);
      // setSessionData(session_data["data"]);
      // let api_data = {
      //   fp_log_id: session_data["data"]["fp_log_id"],
      //   user_id: session_data["data"]["id"],
      //   fp_user_id: session_data["data"]["fp_user_id"],
      // };

      // var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
      // var scorecard_data = await apiCall(
      //   ADVISORY_GET_SCORECARD_API_URL+"?user_id=d4m1af2v0a",
      //   "",
      //   false,
      //   false
      // );
      var scorecard_data = await GetScoreCard(getUserId(), DATA_BELONGS_TO)
      // var res = JSON.parse(commonEncode.decrypt(scorecard_data));
      if (scorecard_data.status_code == "200" && scorecard_data.data != "") {
        setScorecardValue(scorecard_data.data.total_score);
      } else {
        setScorecardValue(0);
      }
    } catch (e) {
      setError(true);
    }
  };
  const CloseLoanModal = () => {
    setOpenModalByName(null);
    sliderRef.current.slickPlay();
  };
  const getNetwortLiabilites = async () => {
    try {
      // let url = '';
      // let url = CHECK_SESSION;
      // let data = { user_id: userid, sky: getItemLocal("sky") };
      // let session_data = await apiCall(url, data, true, false);

      let member_id = props?.member_id ? props.member_id : getUserId();
      // member_id = getFpUserDetailId();

      let member_selected = props.member_selected ? "member_id" : "all";

      if (getItemLocal("family")) {
        member_selected = "all";
      } else {
        member_selected = "member_id";
      }

      // let api_data = {
      //   fp_log_id: session_data["data"]["fp_log_id"],
      //   user_id: session_data["data"]["id"],
      //   fp_user_id: member_id,
      //   filter_type: member_selected,
      // };

      // var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
      // var networtliabilites_data = await apiCall(
      //   ADVISORY_GET_NETWORTHLIABILITES_API_URL + "?user_id=d4m1af2v0a&filter_type=all&user_asset_for=d4m1af2v0a" ,
      //   "",
      //   false,
      //   false
      // );
      var networtliabilites_data = await GetNetworthLiabilites(getParentUserId(), getUserId(), member_selected, DATA_BELONGS_TO)
      // var res = JSON.parse(commonEncode.decrypt(networtliabilites_data));
      if ((networtliabilites_data.status_code = 200 && networtliabilites_data.data != "")) {
        setNetwortLiabilitesData(networtliabilites_data.data);
      } else {
        setNetwortLiabilitesData({
          asset_data: 0,
          asset_sum_formatted: "0",
          liability_sum: 0,
          liability_sum_formatted: "0",
          networth_sum: 0,
          networth_sum_formatted: "0",
        });
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

  const getDocument = async () => {
    // try {
    //   var payload = {
    //     method: "POST",
    //     url: CHECK_SESSION,
    //     data: { user_id: getParentUserId(), sky: getItemLocal("sky") },
    //   };
    //   let session_data = await fetchEncryptData(payload);
    //   if (session_data["error_code"] == "100") {
    //     setSessionData(session_data.data);
    //     if (session_data.data.plan_payment_status == "1") {
    //       setPaymentDone(true);
    //     }

    //     const staticDate = new Date("10/01/2023"); // this date added for handle old user (1st Oct 2023)
    //     const plan_date = new Date(session_data.data.plan_date);
    //     if (plan_date > staticDate) {
    //       var payload = {
    //         method: "POST",
    //         url: ADVISORY_GET_DOCUMENTS_API,
    //         data: {
    //           user_id: session_data["data"]["id"],
    //           fp_log_id: session_data["data"]["fp_log_id"],
    //         },
    //       };
    //       let get_document = await fetchEncryptData(payload);
    //       let showPopup = 0;
    //       if (get_document["error_code"] == "100") {
    //         if (
    //           session_data["data"]["plan_id"] == "31" &&
    //           session_data["data"]["plan_payment_status"] == "1"
    //         ) {
    //           setFPDone(false);
    //           showPopup = 1;
    //         }
    //         const currentDate = new Date();
    //         for (const doc of get_document.data) {
    //           if (doc.doc_type === 167 || doc.doc_type === 168) {
    //             setKycDone(true);
    //           }
    //           const docAddedDate = new Date(doc.doc_added);
    //           if (docAddedDate < staticDate) {
    //             if (doc.doc_type === 154 || doc.doc_type === 134) {
    //               setFPDone(true);
    //               showPopup = 1;
    //             }
    //           } else {
    //             if (doc.doc_type === 164) {
    //               docAddedDate.setFullYear(docAddedDate.getFullYear() + 1);
    //               if (docAddedDate > currentDate) {
    //                 setFPDone(true);
    //                 showPopup = 1;
    //               }
    //             }
    //           }
    //         }
    //         if (showPopup == 0) {
    //           setFPDone(true);
    //         }
    //       } else {
    //         setFPDone(false);
    //         setKycDone(false);
    //       }
    //       setKycDone(true); // remove this line after digi locker working
    //     } else {
    //       setFPDone(true);
    //       setKycDone(true);
    //     }
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const CloseparModal = () => {
    setOpenModalByName(null);
    sliderRef.current.slickPlay();
    sliderRef1.current.slickPlay();
    fetchReportsData();
  };

  const CloseMfModal = () => {
    sliderRef.current.slickPlay();
    sliderRef1.current.slickPlay();
    fetchReportsData();
  };

  // Initialize user data for reports
  const initializeUserData = () => {
    try {
      let userData = {};
      let userEmail = "";
      let userName = "";
      let userId = null;

      // 1. Try to get from cookies user_data
      const userDataFromCookies = Cookies.get('user_data');
      if (userDataFromCookies) {
        try {
          userData = JSON.parse(userDataFromCookies);
          userEmail = userData.email || userData.user_email || "";
          userName = userData.name || userData.user_name || "";
          userId = userData.user_id || userData.id;
        } catch (e) {
          console.warn('Failed to parse user_data from cookies:', e);
        }
      }

      // 2. Try to get from localStorage user_data
      if (!userEmail || !userId) {
        const userDataFromLocalStorage = localStorage.getItem('user_data');
        if (userDataFromLocalStorage) {
          try {
            userData = JSON.parse(userDataFromLocalStorage);
            userEmail = userData.email || userData.user_email || "";
            userName = userData.name || userData.user_name || "";
            userId = userData.user_id || userData.id;
          } catch (e) {
            console.warn('Failed to parse user_data from localStorage:', e);
          }
        }
      }

      // 3. Try to get from member data in localStorage
      if (!userEmail || !userName) {
        try {
          const memberData = localStorage.getItem("member");
          if (memberData) {
            const members = JSON.parse(commonEncode.decrypt(memberData));
            const currentUserId = getUserId() || getParentUserId();
            const currentUser = members.find(member => member.id == currentUserId);

            if (currentUser) {
              userEmail = userEmail || currentUser.email || "";
              userName = userName || currentUser.name || currentUser.user_name || "";
              userId = userId || currentUser.id;
            }
          }
        } catch (e) {
          console.warn('Failed to get user data from member:', e);
        }
      }

      // 4. Get user ID if still not found
      if (!userId) {
        userId = getUserId() || getParentUserId();
      }

      // Split name into first and last name
      const nameParts = userName.split(' ');
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(' ') || "";

      // Create session data object
      const sessionData = {
        id: userId,
        email: userEmail,
        user_details: {
          first_name: firstName,
          last_name: lastName
        },
        fp_lifecycle_status: 2,
        fp_log_id: getItemLocal("fp_log_id") || "",
      };

      setSessionData(sessionData);
      return sessionData;

    } catch (error) {
      console.error("Error initializing user data:", error);
      // Fallback with minimal data
      const fallbackSessionData = {
        id: getParentUserId() || getUserId(),
        email: "",
        user_details: {
          first_name: "User",
          last_name: ""
        },
        fp_lifecycle_status: 2,
        fp_log_id: "",
      };
      setSessionData(fallbackSessionData);
      return fallbackSessionData;
    }
  };

  // Download report function
  const downloadReport = async (reportValue) => {
    try {
      const user_id = getParentUserId();
      const summary_report = reportValue === 1 ? 1 : 0;

      const apiUrl = `${ADVISORY_DOWNLOAD_REPORT}?filename=all&merge=all&user_id=${user_id}&summary_report=${summary_report}`;

      const response = await apiClient(apiUrl, {
        method: 'GET'
      });

      if (response.status_code === 200) {

        // Check if response contains a download URL
        let downloadUrl = null;

        // First check if data is a direct URL string
        if (typeof response.data === 'string' && response.data.startsWith('http')) {
          downloadUrl = response.data;
        } else if (response.data && response.data.download_url) {
          downloadUrl = response.data.download_url;
        } else if (response.data && response.data.s3_url) {
          downloadUrl = response.data.s3_url;
        } else if (response.data && response.data.url) {
          downloadUrl = response.data.url;
        } else if (response.data && response.data.file_url) {
          downloadUrl = response.data.file_url;
        } else if (response.data && response.data.report_url) {
          downloadUrl = response.data.report_url;
        } else if (response.data && response.data.pdf_url) {
          downloadUrl = response.data.pdf_url;
        } else if (response.data && response.data.report_link) {
          downloadUrl = response.data.report_link;
        } else if (response.data && response.data.link) {
          downloadUrl = response.data.link;
        }

        if (downloadUrl) {
          // Open the report in a new tab
          window.open(downloadUrl, '_blank');
        } else {
          // If no direct URL found, try to create a download link with the API URL
          const directDownloadUrl = `${apiUrl}&download=true`;
          const link = document.createElement('a');
          link.href = directDownloadUrl;
          link.target = '_blank';
          link.download = `report_${summary_report === 1 ? 'summary' : 'detailed'}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        // Show success message
        if (summary_report == 0) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Your report is ready to download.",
              type: "success",
            },
          });
        }
        setSpinner(0);
        setSpinneremail(0);
      } else {
        console.error("API Error:", response);
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Failed to download report. Please try again.",
            type: "error",
          },
        });
        setSpinner(0);
        setSpinneremail(0);
      }
    } catch (error) {
      console.error("Error:", error);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Failed to download report. Please try again.",
          type: "error",
        },
      });
      setSpinner(0);
      setSpinneremail(0);
    }
  };

  // Send report email function
  const sendReportMail = async (type, reportLink) => {
    try {
      // Set loading state based on type
      if (type === 'PAR' || type === 'MF') {
        setEmailLoading(prev => ({ ...prev, [type]: true }));
      }

      // Get session data
      const sessionData = initializeUserData();

      // Check if sessionData is available
      if (!sessionData || !sessionData.email) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "User email not found. Please ensure you are logged in and try again.",
            type: "error",
          },
        });
        if (type === 'PAR' || type === 'MF') {
          setEmailLoading(prev => ({ ...prev, [type]: false }));
        }
        return;
      }

      // Check if reportLink is available
      if (!reportLink) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Report not available for email. Please try again later.",
            type: "error",
          },
        });
        if (type === 'PAR' || type === 'MF') {
          setEmailLoading(prev => ({ ...prev, [type]: false }));
        }
        return;
      }

      let emailPayloadData = {};

      // Handle different report types
      if (type === 'SUMMARY') {
        emailPayloadData = {
          userdata: { to: sessionData["email"] },
          subject: 'Fintoo: Your Summary Report is Ready!',
          template: 'welcome_expert_services.html',
          contextvar: {
            client_name: sessionData["user_details"]["first_name"] + " " + sessionData["user_details"]["last_name"],
            attachment_name: "Summary Report"
          }
        };
      } else if (type === 'DETAILED') {
        emailPayloadData = {
          userdata: { to: sessionData["email"] },
          subject: 'Fintoo: Your Detailed Report is Ready!',
          template: 'welcome_expert_services.html',
          contextvar: {
            client_name: sessionData["user_details"]["first_name"] + " " + sessionData["user_details"]["last_name"],
            attachment_name: "Detailed Report"
          }
        };
      } else if (type === 'MF') {
        emailPayloadData = {
          userdata: { to: sessionData["email"] },
          subject: 'Fintoo: Your Personalized Mutual Fund Screening Report is Here!',
          template: 'welcome_expert_services.html',
          contextvar: {
            client_name: sessionData["user_details"]["first_name"] + " " + sessionData["user_details"]["last_name"],
            attachment_name: "MF Screening Report"
          }
        };
      } else if (type === 'PAR') {
        emailPayloadData = {
          userdata: { to: sessionData["email"] },
          subject: 'Fintoo: Your Personalized Portfolio Analysis Report Awaits!',
          template: 'welcome_expert_services.html',
          contextvar: {
            client_name: sessionData["user_details"]["first_name"] + " " + sessionData["user_details"]["last_name"],
            attachment_name: "Portfolio Analysis Report"
          }
        };
      }

      // Use the API directly
      const mailRes = await apiClient(FRAPPE_API_URL + "send_email", {
        method: "POST",
        body: JSON.stringify(emailPayloadData),
      });

      if (mailRes && (mailRes.status_code === 200 || mailRes.status_code === "200")) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Email sent successfully",
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Email not sent, Something went wrong...",
            type: "error",
          },
        });
      }
    } catch (error) {
      console.error("Error in sendReportMail:", error);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Failed to send email. Please try again.",
          type: "error",
        },
      });
    } finally {
      // Clear loading state
      if (type === 'PAR' || type === 'MF') {
        setEmailLoading(prev => ({ ...prev, [type]: false }));
      }
    }
  };

  // Summary report functions
  const summaryReport = async () => {
    setSpinner(2);
    await downloadReport(1);
  };

  const summaryEmail = async () => {
    try {
      setSpinneremail(1);

      // First call download API to get the report URL
      const user_id = getParentUserId();
      const summary_report = 1; // Summary report

      const apiUrl = `${ADVISORY_DOWNLOAD_REPORT}?filename=all&merge=all&user_id=${user_id}&summary_report=${summary_report}`;

      const response = await apiClient(apiUrl, {
        method: 'GET'
      });

      if (response.status_code === 200) {
        // Extract the report URL from response
        let reportUrl = null;

        if (typeof response.data === 'string' && response.data.startsWith('http')) {
          reportUrl = response.data;
        } else if (response.data && response.data.download_url) {
          reportUrl = response.data.download_url;
        } else if (response.data && response.data.s3_url) {
          reportUrl = response.data.s3_url;
        } else if (response.data && response.data.url) {
          reportUrl = response.data.url;
        }

        if (reportUrl) {
          // Now send email with the report URL
          await sendReportMail('SUMMARY', reportUrl);
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Failed to get report URL for email.",
              type: "error",
            },
          });
        }
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Failed to generate report for email.",
            type: "error",
          },
        });
      }
    } catch (error) {
      console.error("Error in summaryEmail:", error);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Failed to send email. Please try again.",
          type: "error",
        },
      });
    } finally {
      setSpinneremail(0);
    }
  };

  // Detailed report functions
  const detailedReport = async () => {
    setSpinner(3);
    await downloadReport(0);
  };

  const detailedEmail = async () => {
    try {
      setSpinneremail(3);

      // First call download API to get the report URL
      const user_id = getParentUserId();
      const summary_report = 0; // Detailed report

      const apiUrl = `${ADVISORY_DOWNLOAD_REPORT}?filename=all&merge=all&user_id=${user_id}&summary_report=${summary_report}`;

      const response = await apiClient(apiUrl, {
        method: 'GET'
      });

      if (response.status_code === 200) {
        // Extract the report URL from response
        let reportUrl = null;

        if (typeof response.data === 'string' && response.data.startsWith('http')) {
          reportUrl = response.data;
        } else if (response.data && response.data.download_url) {
          reportUrl = response.data.download_url;
        } else if (response.data && response.data.s3_url) {
          reportUrl = response.data.s3_url;
        } else if (response.data && response.data.url) {
          reportUrl = response.data.url;
        }

        if (reportUrl) {
          // Now send email with the report URL
          await sendReportMail('DETAILED', reportUrl);
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Failed to get report URL for email.",
              type: "error",
            },
          });
        }
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Failed to generate report for email.",
            type: "error",
          },
        });
      }
    } catch (error) {
      console.error("Error in detailedEmail:", error);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Failed to send email. Please try again.",
          type: "error",
        },
      });
    } finally {
      setSpinneremail(0);
    }
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 8000,
    autoplay: true,
    fade: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    margin: 20,
    centerPadding: "20",
    dotsClass: "slick-dots categories-slick-dots dashboard-slick-dots",
  };
 useEffect(() => {
  if (!networtliabilitesdata || !window.webengage?.user?.setAttribute) return;

  const {
    networth_sum_formatted,
    asset_sum_formatted,
    liability_sum_formatted,
  } = networtliabilitesdata;

  if (
    !networth_sum_formatted ||
    !asset_sum_formatted ||
    !liability_sum_formatted
  ) {
    return;
  }

  const isFamily = !props.member_selected;

  const networthType = isFamily ? "Family Net Worth" : "Personal Net Worth";

  try {
    window.webengage.user.setAttribute("Networth Type", networthType);
    window.webengage.user.setAttribute(
      "networth_value",
      String(networth_sum_formatted)
    );
    window.webengage.user.setAttribute(
      "Assets",
      String(asset_sum_formatted)
    );
    window.webengage.user.setAttribute(
      "Liabilities",
      String(liability_sum_formatted)
    );
  } catch {
    // Ignore WebEngage init timing issues
  }

}, [networtliabilitesdata, props.member_selected]);

  useEffect(() => {
    if (!window.webengage?.user?.setAttribute) return;
    if (scorecardvalue === null || scorecardvalue === undefined) return;

    try {
      window.webengage.user.setAttribute(
        "scorecard_value",
        String(scorecardvalue)
      );
    } catch {
      // Ignore WebEngage init timing issues
    }

  }, [scorecardvalue]);
  const [userLeadId, setUserLeadId] = useState(null);

  useEffect(() => {
    const getUserLead = async () => {
      const res = await fetchUserProfileDetails(getUserId());
      const leadId = res?.data?.user_lead_id;

      // console.log(leadId, "userleadid response");
      setUserLeadId(leadId);
    };

    getUserLead();
  }, []);

  useEffect(() => {
    if (!userLeadId) return;

    const loginWebEngage = () => {
      if (window.webengage) {
        webengage.user.login(String(userLeadId));
        console.log("WebEngage login done:", userLeadId);
      } else {
        setTimeout(loginWebEngage, 200); // retry every 200ms until SDK loads
      }
    };

    loginWebEngage();
  }, []);
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
        const renewalDateISO = new Date(expiryDate).toISOString();


        if (window.webengage?.user) {
          console.log(" Sending renewal date to WebEngage:", renewalDateISO);

          window.webengage.user.setAttribute({
            "Renewal Date": renewalDateISO,
          });
        }
      }
    } catch (error) {
      // console.error(" Error fetching renewal date:", error);
    }
  };

  useEffect(() => {
    renewalDate();
  }, []);

  return (
    <>
      {/* <MainDashboard/> */}
      <div className="d-md-flex justify-content-md-between justify-content-md-center mb-4">
        {renewpopup == 1 ? (
          <div className="RenewMsgbox">
            <RenewPopupTextbox showpopup={true} />
          </div>
        ) : (
          ""
        )}
        {renewpopup != 1 && <div className="RenewMsgbox">{<KYCTextbox />}</div>}
      </div>


      <div className="card-box GoalBox ml-auto" style={{ margin: "0 1rem" }}>
        <div className="row d-flex align-items-center">

          <div className="col-md-4 col-lg-4 col-12">
            <Slider ref={sliderRef1} {...settings}>
              <div
                className="cardBox GraphImg autoAdvisory"
                id="GraphImage"
                style={{ backgroundImage: `url(${GraphUrl})` }}
              // style={{backgroundImage: 'url(${imagePath} + "https://stg.minty.co.in" + ${Graph})'}}
              >
                {renewpopup == 1 ? (
                  <>
                    <div className="me-4 mt-4 AssettotalValue">
                      <div className="TextLabel">
                        {/* {!props.member_selected
                        ? "Family Net Worth"
                        : "Net Worth"} */}
                        Assets Value
                      </div>
                      <div className={`d-flex align-items-center`}>
                        <div
                          className={`valueLabel ${networtliabilitesdata &&
                            (networtliabilitesdata.asset_sum_formatted ||
                              networtliabilitesdata.asset_sum_formatted === 0)
                            ? null
                            : "shine"
                            }`}
                        >
                          ₹{" "}
                          <span>
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
                      <div>
                        <a
                          className="text-decoration-none text-black"
                          onClick={onOpenModal}
                        >
                          <div className="">
                            <div className="TextLabel">
                              {!props.member_selected
                                ? "Family Net Worth"
                                : "Net Worth"}
                            </div>
                            <div
                              className={`d-flex align-items-center justify-content-between ${networtliabilitesdata &&
                                (networtliabilitesdata.networth_sum_formatted ||
                                  networtliabilitesdata.networth_sum_formatted ===
                                  0)
                                ? null
                                : "shine"
                                }`}
                            >
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
                      <div
                        className="borderRight"
                        style={{ margin: "0 2rem" }}
                      ></div>
                      <div className="">
                        <a
                          className="text-decoration-none text-black"
                          onClick={onOpenModal}
                        >
                          <div className="me-4">
                            <div className="TextLabel">
                              {!props.member_selected
                                ? "Overall Liabilities"
                                : "Liabilities"}
                            </div>
                            <div
                              className={`d-flex align-items-center justify-content-between ${networtliabilitesdata &&
                                (networtliabilitesdata.liability_sum_formatted ||
                                  networtliabilitesdata.liability_sum_formatted ===
                                  0)
                                ? null
                                : "shine"
                                }`}
                            >
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
                ) : (
                  <>
                    <div className="me-4 mt-4 AssettotalValue">
                      <div className="TextLabel">
                        {/* {!props.member_selected
                        ? "Family Net Worth"
                        : "Net Worth"} */}
                        Assets Value
                      </div>
                      <div className={`d-flex align-items-center`}>
                        <div
                          className={`valueLabel ${networtliabilitesdata &&
                            (networtliabilitesdata.asset_sum_formatted ||
                              networtliabilitesdata.asset_sum_formatted === 0)
                            ? null
                            : "shine"
                            }`}
                        >
                          ₹{" "}
                          <span>
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
                      <div>
                        <a
                          className="text-decoration-none text-black"
                          href={
                            ssessiondata.plan_id === 29
                              ? process.env.PUBLIC_URL +
                              "/report/assets-liabilities?tab=networth"
                              : process.env.PUBLIC_URL +
                              "/datagathering/assets-liabilities"
                          }
                        >
                          <div className="">
                            <div className="TextLabel">
                              {!props.member_selected
                                ? "Family Net Worth"
                                : "Net Worth"}
                            </div>
                            <div
                              className={`d-flex align-items-center justify-content-between ${networtliabilitesdata &&
                                (networtliabilitesdata.networth_sum_formatted ||
                                  networtliabilitesdata.networth_sum_formatted ===
                                  0)
                                ? null
                                : "shine"
                                }`}
                            >
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
                      <div
                        style={{ margin: "0 2rem" }}
                        className="borderRight"
                      ></div>
                      <div>
                        <a
                          className="text-decoration-none text-black"
                          href={
                            ssessiondata.plan_id === 29
                              ? process.env.PUBLIC_URL +
                              "/report/assets-liabilities?tab=liabilities"
                              : process.env.PUBLIC_URL +
                              "/datagathering/assets-liabilities"
                          }
                        >
                          <div className="me-4">
                            <div className="TextLabel">
                              {!props.member_selected
                                ? "Overall Liabilities"
                                : "Liabilities"}
                            </div>
                            <div
                              className={`d-flex align-items-center justify-content-between ${networtliabilitesdata &&
                                (networtliabilitesdata.liability_sum_formatted ||
                                  networtliabilitesdata.liability_sum_formatted ===
                                  0)
                                ? null
                                : "shine"
                                }`}
                            >
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
              <div className="cardBox  autoAdvisory lifeInsurance">
                {renewpopup == 1 ? (
                  <div className="autoAdvisoryLabel d-flex">
                    <div className="">
                      <a
                        className="text-decoration-none text-black"
                        onClick={onOpenModal}
                      >
                        <div className="me-2">
                          <diwwwv className="TextLabel">
                            {!props.member_selected
                              ? "Total Life Insurance"
                              : "Life Insurance"}
                          </diwwwv>
                          <div
                            className={`d-flex align-items-center justify-content-between ${lifeinsuranceData &&
                              (lifeinsuranceData.life_insurance_sum_assured_formatted ||
                                lifeinsuranceData.life_insurance_sum_assured_formatted ===
                                0)
                              ? null
                              : "shine"
                              }`}
                          >
                            <div className="valueLabel">
                              &#8377;{" "}
                              <span className="bigBalue">
                                {
                                  lifeinsuranceData.life_insurance_sum_assured_formatted
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div
                      className="borderRight"
                      style={{ margin: "0 2rem" }}
                    ></div>
                    <div className="ms-4 d-flex justify-content-end">
                      <div>
                        <a
                          className="text-decoration-none text-black"
                          onClick={onOpenModal}
                        >
                          <div className="TextLabel">Medical Cover</div>
                          <div
                            style={{ width: "50%" }}
                            className={`d-flex align-items-center justify-content-between ${lifeinsuranceData &&
                              (lifeinsuranceData.medical_insurance_sum_assured_formatted ||
                                lifeinsuranceData.medical_insurance_sum_assured_formatted ===
                                0)
                              ? null
                              : "shine"
                              }`}
                          >
                            <div className="valueLabel">
                              &#8377;{" "}
                              <span>
                                {
                                  lifeinsuranceData.medical_insurance_sum_assured_formatted
                                }
                              </span>
                            </div>
                          </div>
                        </a>
                      </div>
                      {/* <div className="Imgbox">
                   <img className="" src={Medicalinsurance} width={130} />
                 </div> */}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 autoAdvisoryLabel">
                    <div className="">
                      <a
                        className="text-decoration-none text-black"
                        href={
                          ssessiondata.plan_id === 29
                            ? process.env.PUBLIC_URL +
                            "/report/risk-management?tab=lifeinsurance"
                            : process.env.PUBLIC_URL +
                            "/datagathering/insurance"
                        }
                      >
                        <div className="me-4">
                          <div className="TextLabel">
                            {!props.member_selected
                              ? "Total Life Insurance"
                              : "Life Insurance"}
                          </div>
                          <div
                            style={{ width: "50%" }}
                            className={`d-flex align-items-center justify-content-between ${lifeinsuranceData &&
                              (lifeinsuranceData.life_insurance_sum_assured_formatted ||
                                lifeinsuranceData.life_insurance_sum_assured_formatted ===
                                0)
                              ? null
                              : "shine"
                              }`}
                          >
                            <div className="valueLabel">
                              &#8377;{" "}
                              <span className="bigBalue">
                                {
                                  lifeinsuranceData.life_insurance_sum_assured_formatted
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                    <div className="">
                      <div>
                        <a
                          className="text-decoration-none text-black"
                          href={
                            ssessiondata.plan_id === 29
                              ? process.env.PUBLIC_URL +
                              "/report/risk-management?tab=medicalinsurance"
                              : process.env.PUBLIC_URL +
                              "/datagathering/insurance"
                          }
                        >
                          <div className="TextLabel">Medical Cover</div>
                          <div
                            style={{ width: "50%" }}
                            className={`d-flex align-items-center justify-content-between ${lifeinsuranceData &&
                              (lifeinsuranceData.medical_insurance_sum_assured_formatted ||
                                lifeinsuranceData.medical_insurance_sum_assured_formatted ===
                                0)
                              ? null
                              : "shine"
                              }`}
                          >
                            <div className="valueLabel">
                              &#8377;{" "}
                              <span>
                                {
                                  lifeinsuranceData.medical_insurance_sum_assured_formatted
                                }
                              </span>
                            </div>
                          </div>
                        </a>
                      </div>
                      {/* <div className="Imgbox">
                <img className="" src={Medicalinsurance} width={130} />
              </div> */}
                    </div>
                    <div
                      style={{
                        float: "right",
                        marginTop: "-4.1rem",
                      }}
                    >
                      <img
                        width={200}
                        src={
                          process.env.REACT_APP_STATIC_URL +
                          "media/Mediclaim_Insurance.svg"
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </Slider>
          </div>

          <div className="col-md-4 col-lg-4 col-12 ">
            <Slider ref={sliderRef1} {...settings}>
              <div
                className="cardBox col-md-4 col-lg-4 col-12 ScoreCardBox mt-md-0 mt-5"
                id="scorecard"
              >
                <div
                  style={{
                    fontSize: "1.6rem",
                  }}
                  className="text-bold"
                >
                  Your Scorecard
                </div>
                <div>
                  <Scorecard value={scorecardvalue} width={170} />
                </div>
                <div className="d-flex justify-content-start">
                  {getItemLocal("reportstatus") == "Y" && (
                    <>
                      {renewpopup === 1 ? (
                        <button
                          onClick={onOpenModal}
                          className="viewReport pointer custom-background-color custom-border-color"
                        >
                          View Report
                        </button>
                      )
                        // : !kycDone || !fpDone ? (
                        //   <button
                        //     onClick={() => setKycModal(true)}
                        //     className="viewReport pointer custom-background-color custom-border-color"
                        //   >
                        //     View Report
                        //   </button>
                        // ) 
                        : (
                          <button
                            onClick={() => setOpenModal(true)}
                            className="viewReport pointer custom-background-color custom-border-color"
                          >
                            View Report
                          </button>
                        )}
                    </>
                  )}

                  <button
                    style={{
                      background: "none !important",
                    }}
                    className="pointer custom-background-color custom-border-color EditData"
                  >
                    {renewpopup === 1 ? (
                      <a
                        onClick={() => {
                          onOpenModal();
                        }}
                        className="pointer"
                      >
                        Edit Data
                      </a>
                    ) : (
                      <a
                        href={process.env.PUBLIC_URL + "/datagathering/about-you"}
                        className="pointer"
                      >
                        Edit Data
                      </a>
                    )}
                  </button>
                </div>
              </div>
              <div
                className="cardBox p-0 autoAdvisory CreditReportbox"
                style={{
                  background: isFetched == true ? "none !important" : "",
                }}
              >
                <div
                  style={{
                    borderRadius: isFetched ? "15px" : "15px 137px 137px 15px",
                    background: "#fff",
                    width: isFetched ? "100%" : "60%",
                    height: "100%",
                    padding: "0 1rem",
                  }}
                >
                  <CreditReport
                    sessiondata={ssessiondata}
                    userid={getParentUserId()}
                    //  member_id={}
                    isFetched={isFetched}
                    setOpenModalByName={(v) => {
                      sliderRef.current.slickPause();
                      sliderRef1.current.slickPause();
                      setOpenModalByName(v);
                    }}
                  />
                </div>
              </div>
            </Slider>
          </div>

          <DownloadModal
            show={openModal}
            onHide={() => setOpenModal(false)}
            ssessiondata={ssessiondata}
            downloadReport={downloadReport}
            summaryReport={summaryReport}
            detailedReport={detailedReport}
            summaryEmail={summaryEmail}
            detailedEmail={detailedEmail}
            spinner={spinner}
            spinneremail={spinneremail}
            setSpinner={setSpinner}
            setSpinneremail={setSpinneremail}
          />

          <div className="col-md-4 col-lg-4 col-12">
            <Slider ref={sliderRef} {...settings}>
              <div className="cardBox p-0 autoAdvisory mfReportbox" style={{ backgroundColor: "#EEF9FF", }}>
                <div style={{
                  borderRadius: "15px 137px 137px 15px",
                  background: "#fff",
                  width: "60%",
                  height: "100%",
                  padding: "1rem"
                }}>
                  <MFReport setOpenModalByName={(v) => {
                    sliderRef1.current.slickPause();
                    sliderRef.current.slickPause();
                    setOpenModalByName(v);
                  }} popup={"mfreport"} title={"MF Screening"}
                    reportLink={reportsData.MF}
                    sendReportMail={sendReportMail}
                    emailLoading={emailLoading}
                  />
                </div>
                {/* */}
              </div>

              <div
                className="cardBox p-0 autoAdvisory ParReportbox"
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
                    popup={"parreport"}
                    title={"Consolidated Portfolio"}
                    reportLink={reportsData.PAR}
                    sendReportMail={sendReportMail}
                    emailLoading={emailLoading}
                  />
                </div>
                {/* */}
              </div>
            </Slider>
          </div>
        </div>
      </div>

      {(getItemLocal("plan_uuid") != "fp_robo" && getItemLocal("plan_uuid") != "") ?
        <div className="d-md-flex w-100 my-5">
          <div className="col-md-7">
            <SavingAccountSection />
          </div>
          <div style={{ marginTop: '2.3rem', }} className="col-md-5">
            <RecommendationList />
          </div>
        </div>
        :
        <div className="w-100 my-5">
          <div className="col-md-12">
            <SavingAccountSection />
          </div>
        </div>
      }


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
                className="cardBox p-0 autoAdvisory mfReportbox goalInvestment"
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
                  {/* <InvestMutualFund
                    setOpenModalByName={(v) => {
                      sliderRef1.current.slickPause();
                      sliderRef.current.slickPause();
                      setOpenModalByName(v);
                    }}
                    popup={"mfreport"}
                    title={"Tax Filing"}
                    reportLink={reportsData.MF}
                  /> */}
                  <GlobalInvestment />
                </div>
                {/* */}
              </div>
            </Slider>
          </div>
        </div>
      </div>

      <KYCPopup
        kycDone={kycDone}
        fpDone={fpDone}
        show={kycModal}
        sessiondata={ssessiondata}
        onHide={() => setKycModal(false)}
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
            subscriptionenddate={props.subscriptionenddate}
          />
        </div>
      </Modal>

      <BootModal.Modal
        dialogClassName="Nsdlcsdl-modal-width"
        className="Modalpopup"
        show={openModalByName == "Fecth_your_Loan"}
        centered
        animationDuration={0}
      >
        <Fetchloan
          Closemodal={CloseLoanModal}
          session={ssessiondata}
          allMembers={allMembers}
          isCardBox={true}
          getEquifaxData={getEquifaxData}
          defaultSelectedMember={defaultSelectedMember}
          is_plan={true}
        />
      </BootModal.Modal>

      <Reportmodal
        open={openModalByName == "PAR_Report"}
        Closemodal={CloseparModal}
        forpar={true}
        fetchReportsData={fetchReportsData}
      />

      <MFReportModal
        open={openModalByName == "MF_Screening"}
        CloseMfModal={CloseMfModal}
        setOpenModalByName={setOpenModalByName}
        fetchReportsData={fetchReportsData}
      />
    </>
  );
}

export default CardBoxGoals;
