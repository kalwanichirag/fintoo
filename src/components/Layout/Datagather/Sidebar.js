import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../MainHeader/style.module.css";
import {
  apiCall,
  fetchData,
  fetchEncryptData,
  getItemLocal,
  getParentFpLogId,
  getParentUserId,
  loginRedirectGuest,
  setItemLocal,
} from "../../../common_utilities";
import {
  DATA_BELONGS_TO,
  imagePath,
} from "../../../constants";
import commonEncode from "../../../commonEncode";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "react-bootstrap";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import KYCPopup from "../../CommonDashboard/KYCPopup";
import FintooLoader from "../../FintooLoader";
import { CheckProfileStatus } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { Getpaymentstatus } from "../../../FrappeIntegration-Services/services/payment-api/paymentapiService";
import { check_all_status_api } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { GetDocumentDetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/document";
const userid = getParentUserId();

const Sidebar = () => {
  const dispatch = useDispatch();
  // const dgSidebarData?.profileData = useSelector(state => state.dgSidebarData?.profileData);
  const [profileData, setProfileData] = useState([]);
  const reloadAdvisorySideBar = useSelector(
    (state) => state.reloadAdvisorySideBar
  );
  // const [dgSidebarData?.profileData, setdgSidebarData?.profileData] = useState([]);
  const [setPercentage, setSetPercentage] = useState("");
  const [stylePercentage, setStylePercentage] = useState("");
  const [number, setNumber] = useState("");
  const [numberr, setNumberr] = useState("");
  const [kycverify, setKYCVerify] = useState("0");
  const [kycwaiting, setKYCWaiting] = useState(false);
  const [path, setPath] = useState("");
  const [textMessage, setTextMessage] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [kycModal, setKycModal] = useState(false);
  const [kycDone, setKycDone] = useState(false);
  const [fpDone, setFPDone] = useState(false);
  const [sessiondata, setSessionData] = useState({})
  const session_data = useRef();
  const [incomeExpenseCookie, setIncomeExpenseCookie] = useState(false);
  const [assetLiabilityCookie, setAssetLiabilityCookie] = useState(false);
  const [insuranceCookie, setInsuranceCookie] = useState(false);
  const [uniqueSectionsWithTotalZeroArray, setUniqueSectionsWithTotalZeroArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const fpLogId = getParentFpLogId();
  const dgSidebarData = useSelector(state => state.dgSidebarData);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const [isLoad, setIsLoad] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [incompleteSection, setIncompleteSection] = useState("");
  useEffect(() => {
    // Simulating data loading or any other async operation
    setTimeout(() => {
      setIsLoad(false);
    }, 2000);
  }, []);

  // useEffect(() => {
  //   if (location.pathname === process.env.PUBLIC_URL + "/datagathering/my-document") {
  //     setIsVisible(false);
  //   } else {
  //     setIsVisible(true);
  //   }
  // }, [location]);
  useEffect(() => {
    const storedVisibility = localStorage.getItem('isVisible');
    const url = window.location.href;
    const urlsToMatch = [
      process.env.PUBLIC_URL + "/datagathering/about-you",
      process.env.PUBLIC_URL + "/datagathering/income-expenses",
      process.env.PUBLIC_URL + "/datagathering/goals",
      process.env.PUBLIC_URL + "/datagathering/goals/",
      process.env.PUBLIC_URL + "/datagathering/insurance",
      process.env.PUBLIC_URL + "/datagathering/assets-liabilities"
    ];

    if (urlsToMatch.some(matchUrl => url.includes(matchUrl))) {
      setIsVisible(true); // Set isVisible to true if URL matches
      localStorage.removeItem('isVisible'); // Remove item from localStorage
      setIsActive(true);
    } else {
      if (storedVisibility !== null) {
        setIsVisible(storedVisibility === 'true');
      }
    }
  }, []);

  const toggleVisibility = () => {
    const updatedVisibility = !isVisible;
    setIsVisible(updatedVisibility);
    localStorage.setItem('isVisible', updatedVisibility.toString());
  };


  const handleNavigationIconClick = () => {
    setIsVisible(true);
  }
  useEffect(() => {
    // getSessionData();
    // getprofilestatus();
    if (sessionStorage.getItem('showIncomeToast') == "1") {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error('In Income & Expenses section in "Income" Do add Self/Spouse\'s Recurring Income');
      sessionStorage.removeItem("showIncomeToast");
    }
    if (sessionStorage.getItem('showAssetsToast') == "1") {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error('In Assets & Liabilities section "Assets" is incomplete');
      sessionStorage.removeItem("showAssetsToast");
    }

    if (sessionStorage.getItem('showAboutYouToast') == "1") {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error('In About You section "Your Info" is Mandatory');
      sessionStorage.removeItem("showAboutYouToast");
    }
  }, []);

  useEffect(() => {
    if (Number(setPercentage) == 0) return;
    var _a = false;
    // if (setPercentage >= 67) {
    if (profileData && profileData[4]['total'] == 1 && profileData[5]['total'] == 1) {
      if (localStorage.getItem('incomeExpenseCookie') != 1) {
        // localStorage.setItem('incomeExpenseCookie', 1);
        _a = false;
      } else {
        _a = true;
      }
    } else {
      localStorage.removeItem('incomeExpenseCookie');
      _a = false;
    }
    setIncomeExpenseCookie(_a);
  }, [setPercentage]);

  useEffect(() => {
    if (Number(setPercentage) == 0) return;
    var _b = false;
    // if (setPercentage >= 83) {
    if (profileData && profileData[6]['total'] == 1) {
      if (localStorage.getItem('assetLiabilityCookie') != 1) {
        // localStorage.setItem('assetLiabilityCookie', 1);
        _b = false;
      } else {
        _b = true;
      }
    } else {
      localStorage.removeItem('assetLiabilityCookie');
      _b = false;
    }
    setAssetLiabilityCookie(_b);
  }, [setPercentage]);


  useEffect(() => {
    if (Number(setPercentage) == 0) return;
    var _c = false;
    // if (setPercentage >= 100) {
    if (profileData && profileData[8]['total'] == 1) {
      if (localStorage.getItem('insuranceCookie') != 1) {
        // localStorage.setItem('insuranceCookie', 1);
        _c = false;
      } else {
        _c = true;
      }
    } else {
      localStorage.removeItem('insuranceCookie');
      _c = false;
    }
    setInsuranceCookie(_c);
  }, [setPercentage]);

  // useEffect(() => {
  //   if (dgSidebarData?.profileData) {
  //     getprofilestatus();
  //     dispatch({ type: 'UPDATE_PROFILE', payload: false });
  //   }
  // }, [dgSidebarData?.profileData]);

  useEffect(() => {
    if (reloadAdvisorySideBar) {
      getprofilestatus();
      dispatch({ type: "RELOAD_SIDEBAR", payload: false });
    }
  }, [reloadAdvisorySideBar]);

  const getSessionData = async () => {
    // try {
    //   let url = CHECK_SESSION;
    //   let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

    //   session_data.current = await apiCall(url, data, true, false);
    //   if (session_data.current.error_code == "102") {
    //     loginRedirectGuest();
    //   } else {
    //     await getDocument();
    //     setSessionData(session_data.current.data)
    //     getprofilestatus(session_data.current);
    //   }
    // } catch (e) {
    //   console.log("error ==> ", e);
    // }
  };

  const scrollToTop = () => {
    window.scroll({ top: 0 });
  };


  const handleIncompleteOk = async () => {
    setShow(false);
    sessionStorage.setItem("generatereport", "1");
    setLoading(true)
    // getprofilestatus("1");
    handleIncompleteSidebarTabs("1");
  }

  const getprofilestatus = async (flag_ok = "") => {
    try {
      var res = await CheckProfileStatus(getParentUserId());
      if (res['status_code'] == '200') {
        var checkDgSidebarData = JSON.stringify(dgSidebarData["profileData"]) === JSON.stringify(res['data']);

        // dispatch({ type: "DG_SIDEBAR_DATA", payload: {...dgSidebarData, profileData: decoded_res['data']} });
        setProfileData(res['data']);
        dispatch({ type: "UPDATE_PROFILE", payload: res['data'] });
        setSetPercentage(res['data'][13]['profile_completed'])

        const profile_completed_mapping = {
          17: 117.496,
          34: 100.555,
          50: 70.4973,
          67: 46.9982,
          83: 23.4991,
          100: 0
        };
        IncompleteSectionsURL(flag_ok, res['data']);
        const profile_completed = res['data'][13]['profile_completed'] === 66 ? 67 : res['data'][13]['profile_completed'];
        dispatch({
          type: "DG_SIDEBAR_DATA",
          payload: {
            ...dgSidebarData,
            percentage: profile_completed_mapping[profile_completed] || 0,
            profileData: res['data']
          },
        });
        setStylePercentage(profile_completed_mapping[profile_completed] || 0);
        const sectionIdsToCheck = [108, 109, 5, 6, 7, 8];
        const allConditionsMet = sectionIdsToCheck.every((sectionId) => {
          const matchingEntry = res["data"].find(
            (entry) => entry.section_id === sectionId
          );
          return matchingEntry && matchingEntry.total > 0;
        });

        const sectionIdsToCheckk = [108, 109];
        const allConditionsMett = sectionIdsToCheckk.every((sectionId) => {
          const matchingEntryy = res["data"].find(
            (entry) => entry.section_id === sectionId
          );
          return matchingEntryy && matchingEntryy.total > 0;
        });

        const knowYourRiskCompleteCheck = res["data"].find(
          (entry) => entry.section_id == 109
        );
        if (knowYourRiskCompleteCheck) {
          if (knowYourRiskCompleteCheck.total == 0) {
            setIncompleteSection("knowyourrisk")
          }
        }

        let newNumber;

        if (allConditionsMet) {
          newNumber = "1";
        } else {
          newNumber = "0";
        }
        setNumber(newNumber);

        let newNumberr;
        if (allConditionsMett) {
          newNumberr = "1";
        } else {
          newNumberr = "0";
        }
        setNumberr(newNumberr);
        if (checkDgSidebarData) return;
        const sectionTextMap = {
          108: "About You",
          109: "Know Your Risk",
          5: "Goals",
          6: "Income & Expenses",
          7: "Income & Expenses",
          8: "Assets & Liabilities",
        };

        const filteredData = res["data"].filter((item) =>
          [108, 3, 5, 6, 7, 8].includes(item.section_id)
        );
        const sectionsWithTotalZeroTextArray = filteredData
          .filter((item) => item.total === 0)
          .map((item) => sectionTextMap[item.section_id]);

        const uniqueSectionsWithTotalZeroTextArray = [
          ...new Set(sectionsWithTotalZeroTextArray),
        ];

        const sectionsWithTotalZeroText =
          uniqueSectionsWithTotalZeroTextArray.join(", ");
        setTextMessage(sectionsWithTotalZeroText);

        setUniqueSectionsWithTotalZeroArray(uniqueSectionsWithTotalZeroTextArray);

        handleIncompleteSidebarTabs(flag_ok);
      }
    } catch (e) {
      console.error("error ----> ", e);
    }

  };
  const IncompleteSectionsURL = (flag_ok = "", data) => {
    const sectionTextMap = {
      108: "About You",
      108: "About You",
      5: "Goals",
      6: "Income & Expenses",
      7: "Income & Expenses",
      8: "Assets & Liabilities",
    };
    const filteredData = data.filter((item) =>
      [108, 3, 5, 6, 7, 8].includes(item.section_id)
    );
    const sectionsWithTotalZeroTextArray = filteredData
      .filter((item) => item.total === 0)
      .map((item) => sectionTextMap[item.section_id]);
    const uniqueSectionsWithTotalZeroTextArray = [
      ...new Set(sectionsWithTotalZeroTextArray),
    ];

    const sectionsWithTotalZeroText =
      uniqueSectionsWithTotalZeroTextArray.join(", ");
    setTextMessage(sectionsWithTotalZeroText);

    setUniqueSectionsWithTotalZeroArray(uniqueSectionsWithTotalZeroTextArray);

    handleIncompleteSidebarTabs(flag_ok, uniqueSectionsWithTotalZeroTextArray);
  }
  const handleIncompleteSidebarTabs = (flag_ok = "") => {

    if (uniqueSectionsWithTotalZeroArray) {
      if (
        uniqueSectionsWithTotalZeroArray.includes("About You") &&
        uniqueSectionsWithTotalZeroArray.includes("Income & Expenses") &&
        uniqueSectionsWithTotalZeroArray.includes("Assets & Liabilities")
      ) {
        if (flag_ok == "1") {
          sessionStorage.setItem("showAboutYouToast", "1");
          window.location.href = process.env.PUBLIC_URL + "/datagathering/about-you";

        } else {
          setPath(process.env.PUBLIC_URL + "/datagathering/about-you");
        }
      } else if (
        uniqueSectionsWithTotalZeroArray.includes("Income & Expenses") &&
        uniqueSectionsWithTotalZeroArray.includes("Assets & Liabilities")
      ) {
        if (flag_ok == "1") {
          sessionStorage.setItem("showIncomeToast", "1");
          sessionStorage.setItem("showExpenseToast", "1");
          window.location.href = process.env.PUBLIC_URL + "/datagathering/income-expenses";

        }
        else {
          setPath(process.env.PUBLIC_URL + "/datagathering/income-expenses");
        }

      } else if (
        uniqueSectionsWithTotalZeroArray.includes("Income & Expenses")
      ) {
        if (flag_ok == "1") {
          sessionStorage.setItem("showIncomeToast", "1");
          sessionStorage.setItem("showExpenseToast", "1");

          window.location.href = process.env.PUBLIC_URL + "/datagathering/income-expenses";

        }
        else {
          setPath(process.env.PUBLIC_URL + "/datagathering/income-expenses");
        }

      } else if (
        uniqueSectionsWithTotalZeroArray.includes("Assets & Liabilities")
      ) {
        if (flag_ok == "1") {
          sessionStorage.setItem("showAssetsToast", "1");
          window.location.href = process.env.PUBLIC_URL + "/datagathering/assets-liabilities";

        } else {
          setPath(process.env.PUBLIC_URL + "/datagathering/assets-liabilities");
        }

      } else if (uniqueSectionsWithTotalZeroArray.includes("About You")) {
        if (flag_ok == "1") {
          sessionStorage.setItem("showAboutYouToast", "1");
          window.location.href = process.env.PUBLIC_URL + "/datagathering/assets-liabilities";

        } else {
          setPath(process.env.PUBLIC_URL + "/datagathering/about-you");
        }
        // toastr.options.positionClass = "toast-bottom-left";
        // toastr.error("In About You section Know Your Risk is mandatory ");
      }
    }
  }

  const url = window.location.pathname.split("/").pop();
  const [openMenu, setOpenMenu] = useState(false);
  useEffect(() => {
    // Function will retrigger on URL change

    window.scrollTo(0, 0);
  }, [url]);

  // const showToast = () => {
  //   toastr.error("In About You section Know Your Risk is mandatory ");
  //   toastr.options.positionClass = "toast-bottom-left";
  // };

  const showToast = () => {
    var incompleteTab = "Your Info"
    if (incompleteSection && incompleteSection == "knowyourrisk") {
      incompleteTab = "Know Your Risk";
    }
    toastr.options.positionClass = 'toast-bottom-left';
    toastr.error('In About You section "' + incompleteTab + '" is Mandatory');
  };


  const percentageText = () => {
    try {
      return dgSidebarData?.profileData[13]['profile_completed'];
    } catch (e) {
      return 0;
    }
  };

  const getDocument = async () => {
    try {
      const res = await paymentStatus();
      if (res?.status_code == 200) {
        const payment_data = res.data
        let isKycDone = false;

        if (
          payment_data.plan_uuid === "fp_expert" &&
          payment_data.plan_name !== "Assisted Advisory"
        ) {
          const resDoc = await GetDocumentDetails(
            getParentUserId(),
            DATA_BELONGS_TO
          );

          if (resDoc?.status_code === 200) {
            isKycDone = resDoc.data.some(
              (doc) =>
                doc.document_cat_uuid === "e_aadhar" ||
                doc.document_cat_uuid === "panDirect"
            );
          }
        } else {
          isKycDone = true;
        }

        setKycDone(isKycDone);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const paymentStatus = async () => {
    const payload = {
      user_id: getParentUserId(),
      data_belongs_to: DATA_BELONGS_TO
    };
    const res = await Getpaymentstatus(payload);
    return res
  }
  const handleGenerateReport = async () => {
    // if(getItemLocal("reportstatus") == "Y"){
    //   window.location.href = process.env.PUBLIC_URL + "/report/intro/";
    // }

    if (getItemLocal("ndasignstatus") == "Y" && getItemLocal("datagatheringstatus") == "Y" && getItemLocal("reportstatus") == "N") {
      handleShow();
    } else {

      const res = await paymentStatus();
      if (res?.status_code == 200) {
        const payment_data = res.data
        if (payment_data["plan_uuid"] == "fp_expert") {
          var rm_name = payment_data["rm_data"]["emp_name"]
          window.location.href = process.env.PUBLIC_URL + "/commondashboard?rm=" + commonEncode.encrypt(rm_name)
        }
        else {
          window.location.href = process.env.PUBLIC_URL + "/report/intro/"
        }

      }
      else {
        window.location.href = process.env.PUBLIC_URL + "/commondashboard"
      }
      // if (session_data.current["data"]["plan_payment_status"] == "1") {
      //   if (session_data.current["data"]["plan_id"] == 31) {
      //     window.location.href = process.env.PUBLIC_URL + "/report/intro/"
      //   }
      //   else {
      //     localStorage.removeItem('ParReportData')
      //     window.location.href = process.env.PUBLIC_URL + "/report/intro/"
      //   }
      // }
      // else {
      //   if (session_data.current["data"]["plan_id"] == 31) {

      //     var config = {
      //       method: "POST",
      //       url: '',
      //       data: {
      //         user_id: getParentUserId(),
      //       },
      //     };

      //     let rm_resp = await fetchData(config);
      //     var rm_name = ""
      //     if (rm_resp["error_code"] == "100") {
      //       rm_name = rm_resp['data'][0]['emp_name']
      //     }
      //     window.location.href = process.env.PUBLIC_URL + "/commondashboard?rm=" + commonEncode.encrypt(rm_name)

      //   }
      //   else {
      //     window.location.href = process.env.PUBLIC_URL + "/commondashboard"
      //   }

      // }
    }
  }

  const handleRedirection = async () => {
    // if (getItemLocal("reportstatus") == "Y") {
    //   window.location.href = process.env.PUBLIC_URL + "/report/intro"
    // }
    const res = await paymentStatus();
    if (res.status_code == 200) {
      const payment_data = res.data
      if (payment_data["plan_uuid"] == "fp_expert") {
        var rm_name = payment_data["rm_data"]["emp_name"]
        window.location.href = process.env.PUBLIC_URL + "/commondashboard?rm=" + commonEncode.encrypt(rm_name)
      }
      else {
        window.location.href = process.env.PUBLIC_URL + "/datagathering/expert-fp/"
      }

    }
    else {
      window.location.href = process.env.PUBLIC_URL + "/commondashboard"
    }
    // if (session_data.current["data"]["plan_id"] == 31) {
    //   await updateLifecycleStatus(2, fpLogId)

    //   // get rm name
    //   var config = {
    //     method: "POST",
    //     url: '',
    //     data: {
    //       user_id: getParentUserId(),
    //     },
    //   };

    //   let rm_resp = await fetchData(config);
    //   var rm_name = ""
    //   if (rm_resp["error_code"] == "100") {
    //     rm_name = rm_resp['data'][0]['emp_name']
    //   }
    //   window.location.href = process.env.PUBLIC_URL + "/commondashboard/?rm=" + commonEncode.encrypt(rm_name)
    // } else {
    //   window.location.href = process.env.PUBLIC_URL + "/datagathering/expert-fp/"
    // }
  }

  const updateLifecycleStatus = async (step, fp_log_id) => {
    try {
      var config = {
        method: "POST",
        url: '',
        data: {
          step: step,
          fp_log_id: fp_log_id,
        },
      };
      let response = await fetchData(config);
      if (response["error_code"] == "100") {
        // if(session_data.current["data"]["fp_plan_type"] == '8'){
        await updateAuthData({ fp_lifecycle_status: 2, nda_flag: "1" });
        await updateAuthData({ fp_lifecycle_status: 2, nda_flag: "fp" });
        // }
      } else {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const updateAuthData = async (payload) => {
    try {
      var config = {
        method: "POST",
        url: ADVISORY_UPDATE_AUTH_DATA,
        data: payload,
      };
      let response = await fetchData(config);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getDocument();
    getprofilestatus();
  }, [])
  // useEffect(()=>{
  //   let kyc_verify = "0";
  //   if((dgSidebarData?.kyc_verify) == "1") return;
  //   if(session_data.current){
  //     if((kycDone && session_data.current.data.plan_payment_status == "1" && (session_data.current.data.fp_plan_type == "6" || session_data.current.data.fp_plan_type == "8") ) || (kycDone && session_data.current.data.plan_payment_status != "1" && session_data.current.data.fp_plan_type == "8")){
  //       kyc_verify = "1";
  //       dispatch({ type: "DG_SIDEBAR_DATA", payload: {...dgSidebarData, kyc_verify: kyc_verify }});
  //     }
  //   }
  //   if (session_data.current) {
  //     if (session_data.current.data.fp_plan_type == "8") {
  //       if (session_data.current.data.plan_payment_status == "1") {
  //         if (kycDone) {
  //           kyc_verify = "1";
  //         }
  //       } else if (session_data.current.data.plan_payment_status != "1") {
  //         kyc_verify = "1";
  //       }
  //       dispatch({ type: "DG_SIDEBAR_DATA", payload: {...dgSidebarData, kyc_verify: kyc_verify }});
  //     }
  //   }

  // },[session_data?.current?.data?.plan_payment_status, session_data?.current?.data?.fp_plan_type]);
  const checkAllStatusApi = async () => {
    const result = await check_all_status_api(getParentUserId());

    if (result?.status_code === "200") {
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
    }
  }
  useEffect(() => {
    if (number == "1" && (setPercentage === 83 || setPercentage === 100)) {
      checkAllStatusApi()
    }
  }, [number, setPercentage])

  useEffect(() => {
    if (!getItemLocal("token")) {
      window.location.href = '/login';
      return;
    }
  }, [getItemLocal("token")])

  return (
    <>
      <FintooLoader isLoading={loading} />
      <div
        className={`sidebar DgSidebar d-none d-md-block expfphide ${isLoad ? "fade-in" : null}`}
        id="menu-sidebar"
      >
        <div className="top-left-block">
          <a href="/" target="_self" className="logo">
            <img src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} alt="Fintoo Logo" />
          </a>
          <a
            href=""
            ng-click="removeClassFromId('menu-sidebar')"
            className="mobile-menu-close-btn"
          >
            ×
          </a>
          <div className="progress">
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
            >
              <circle
                className="cls-1"
                cx={25}
                cy={25}
                r="22.44"
                fill="none"
                stroke="#042b62"
                strokeWidth={1}
                style={{ opacity: "0.1" }}
              />
              <circle
                id="bar"
                className="cls-1"
                cx={25}
                cy={25}
                r="22.44"
                fill="transparent"
                stroke="#042b62"
                strokeWidth={2}
                strokeDasharray={141}
                strokeDashoffset={dgSidebarData?.percentage ? dgSidebarData.percentage : 0}
                style={{ strokeDashoffset: dgSidebarData?.percentage ? dgSidebarData.percentage : 0 }}
              />
            </svg>
            <span className="value " id="datagatheringhamburger">
              {percentageText() === 66 ? '67%' : percentageText() + '%'}
            </span>
            <span className="status">Profile Completed</span>
          </div>
        </div>
        <div
          id="generatereportbutton"
          style={{
            padding: ".8rem 0px"
          }}
          className="download-btn-container mt-2 text-center"
        >
          {/* <span>Click Here</span> */}
          {/* <a href="" class="download-btn download-step1">Download</a> */}

          {number === "0" ? (
            <button
              className="download-btn download-step-1 default-background-grey"
              id="viewBotton"
              style={{ textAlign: "center" }}
              onClick={handleShow}
            >
              Generate Report
            </button>
          )
            : (!kycDone) ? (
              <button
                onClick={() => setKycModal(true)}
                style={{ textAlign: "center", }}
                id="viewBotton"
                className="download-btn download-step-1 default-background-grey"
              >
                Generate Report
              </button>
            )
              : (
                <button
                  className="download-btn download-step-1 default-background-grey"
                  id="viewBotton"
                  style={{ textAlign: "center", }}
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </button>
              )}
        </div>
        <KYCPopup
          kycDone={kycDone}
          show={kycModal}
          onHide={() => setKycModal(false)}
        />
        {number === "0" && (
          <Modal
            className="popupmodal"
            centered
            show={show}
            onHide={handleClose}
          >
            <Modal.Header className="ModalHead">
              <div className="text-center">Profile not completed!!</div>
            </Modal.Header>
            <div className=" px-3 d-grid place-items-center align-item-center">
              <div className=" HeaderModal">
                <p
                  style={{
                    marginTop: "2rem",
                  }}
                >
                  {" "}
                </p>
                <div
                  style={{
                    fontSize: "1rem",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  You have not completed mandatory sections {textMessage} which
                  are needed to generate a report.
                </div>
                <div className="text-center py-3">
                  {" "}
                  Click Ok to check and complete the steps.
                </div>
                <div className="d-flex justify-content-center pb-5">
                  {/* <Link to={path}>
                    <button onClick={handleClose} className="outline-btn">
                      ok
                    </button> 
                  </Link> */}

                  <button onClick={handleIncompleteOk} className="outline-btn">
                    Ok
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {number == "1" && (setPercentage === 83 || setPercentage === 100) && kycDone &&
          getItemLocal("datagatheringstatus") && (
            <Modal
              className="popupmodal"
              centered
              show={show}
              onHide={handleClose}
            >
              <Modal.Header className="ModalHead">
                <div className="text-center">Generate Report</div>
              </Modal.Header>
              <div className="px-3 d-grid place-items-center align-item-center">
                <div className="HeaderModal">
                  <p style={{ marginTop: "2rem" }}> </p>
                  <div
                    style={{
                      fontSize: "1rem",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    You have completed all the steps.
                  </div>
                  <div className="dgReporttext py-3">
                    Once report is generated, you will not be able to edit
                    details in "About you" section. Are you sure you want to
                    generate report ?.
                  </div>
                  <div className="dgReporttext dgReportNote">
                    Note: As The Next Step, We Request You To View & Accept The
                    Financial Planning Agreement To Proceed Further, So That You
                    Can Download The Report.
                  </div>
                  <div className="d-flex generateReportDG pt-3 pb-4 ">
                    <button onClick={handleRedirection} className="outline-btn mt-4">
                      Yes
                    </button>
                    <Link style={{
                      textDecoration: "none",
                    }} className="" to={path}>
                      <button
                        onClick={handleClose}
                        className="outline-btn ms-md-4 mt-4"
                      >
                        No
                      </button>
                    </Link>

                  </div>
                </div>
              </div>
            </Modal>
          )}

        <div className="navigation-container left-scroll">
          {/* ngInclude: '/static/template/navigation.html' */}
          <div
            ng-include="'/static/template/navigation.html'"
            className=""
            style={{}}
          >
            <ul className="right-navigation ">

              <li className="navigation-icon">
                <div
                  className="pointer d-flex align-items-center"
                  style={{
                    padding: ".7rem 0",
                  }}
                  onClick={() => {
                    toggleVisibility();
                  }}
                >
                  <img
                    style={{
                      width: "30px",
                      margin: "0 10px"
                    }}
                    src={imagePath + "/static/media/DG/DataGathering.svg"}
                    alt=""
                  />
                  <div className="" style={{
                    color: isVisible ? "#242424" : "#555",
                    fontSize: "12px"
                  }}> Data Gathering</div>
                  <div>
                    <img
                      width={15}
                      style={{
                        fontWeight: "bold",
                        marginLeft: "4.5rem",
                        transform: isVisible ? "rotate(90deg)" : ""
                      }}
                      // src={process.env.REACT_APP_STATIC_URL + "media/DG/Right.svg"}
                      src={imagePath + '/static/media/DG/Right.svg'}
                      alt=""
                    />
                  </div>
                </div>
                <div style={{
                  opacity: isLoad ? ".7" : "1"
                }}>
                  {isVisible && (
                    <ul className={`data-gathering ${isVisible ? null : 'hidden'}}`}>
                      <li className="navigation-icon" onClick={handleNavigationIconClick}>
                        <Link
                          // ng-click="animateBg('bg-about')"
                          // ng-class="getClass('/about')"
                          // ng-href="/datagathering/about-you"
                          to={process.env.PUBLIC_URL + "/datagathering/about-you"}
                          className={url == "about-you" && isActive ? "active" : ""}
                          style={{}}
                        >

                          <img
                            src={imagePath + "/static/media/DG/about-you.svg"}
                            alt=""
                          />{" "}
                          About You<span className="required">*</span>
                          {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                            <span className=""></span>
                          ) : (
                            dgSidebarData?.profileData[11] && dgSidebarData?.profileData[11]["total"] !== 0 ? (
                              <span className="navtick tick" />
                            ) : (
                              <span className="navtick incomplete">×</span>
                            )
                          )}
                        </Link>
                      </li>

                      {numberr === "0" ? (
                        <li className="income-expenses navigation-icon" onClick={handleNavigationIconClick}>
                          <Link
                            to={process.env.PUBLIC_URL + "/datagathering/about-you/#" + incompleteSection}
                            className={url == "income-expenses" && isActive ? "active" : ""}
                            style={{}}
                            onClick={numberr === "0" ? showToast : null}
                          >
                            <img
                              src={imagePath + "/static/media/DG/income-expenses.svg"}
                              alt="Income expenses"
                            />{" "}
                            Income &amp; Expenses<span className="required">*</span>
                            {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                              <span className=""></span>
                            ) : (
                              dgSidebarData?.profileData &&
                                dgSidebarData?.profileData[4] &&
                                dgSidebarData?.profileData[5] &&
                                dgSidebarData?.profileData[4]["total"] !== 0 &&
                                dgSidebarData?.profileData[5]["total"] !== 0 ? (
                                <span className="navtick tick" />
                              ) : (
                                <span className="navtick incomplete">×</span>
                              )
                            )}
                          </Link>
                        </li>
                      ) : (
                        <li className="income-expenses navigation-icon" onClick={handleNavigationIconClick}>
                          <Link
                            to={
                              process.env.PUBLIC_URL + "/datagathering/income-expenses"
                            }
                            className={url == "income-expenses" && isActive ? "active" : ""}
                            style={{}}
                          >
                            <img
                              src={imagePath + "/static/media/DG/income-expenses.svg"}
                              alt="Income expenses"
                            />{" "}
                            Income &amp; Expenses<span className="required">*</span>
                            {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                              <span className=""></span>
                            ) : (
                              dgSidebarData?.profileData &&
                                dgSidebarData?.profileData[4] &&
                                dgSidebarData?.profileData[5] &&
                                dgSidebarData?.profileData[4]["total"] !== 0 &&
                                dgSidebarData?.profileData[5]["total"] !== 0 ? (
                                <span className="navtick tick" />
                              ) : (
                                <span className="navtick incomplete">×</span>
                              )
                            )}
                          </Link>
                        </li>
                      )}

                      {numberr === "0" ? (
                        <li className="goals navigation-icon" onClick={handleNavigationIconClick}>
                          <Link
                            to={process.env.PUBLIC_URL + "/datagathering/about-you/#" + incompleteSection}
                            className={url == "goals" && isActive ? "active" : ""}
                            onClick={numberr === "0" ? showToast : null}
                          >
                            <img
                              src={imagePath + "/static/media/DG/goal.svg"}
                              alt=""
                            />{" "}
                            Goals<span className="required">*</span>
                            {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                              <span className=""></span>
                            ) : (
                              dgSidebarData?.profileData[3] && dgSidebarData?.profileData[3]["total"] !== 0 ? (
                                <span className="navtick tick" />
                              ) : (
                                <span className="navtick incomplete">×</span>
                              )
                            )}
                          </Link>
                        </li>
                      ) : (
                        <li className="goals navigation-icon" onClick={handleNavigationIconClick}>
                          <Link
                            to={process.env.PUBLIC_URL + "/datagathering/goals"}
                            className={url == "goals" && isActive ? "active" : ""}
                          >
                            <img
                              src={imagePath + "/static/media/DG/goal.svg"}
                              alt=""
                            />{" "}
                            Goals<span className="required">*</span>
                            {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                              <span className=""></span>
                            ) : (
                              dgSidebarData?.profileData[3] && dgSidebarData?.profileData[3]["total"] !== 0 ? (
                                <span className="navtick tick" />
                              ) : (
                                <span className="navtick incomplete">×</span>
                              )
                            )}
                          </Link>
                        </li>
                      )}

                      {numberr === "0" ? (
                        <li className="assets-liabilities navigation-icon" onClick={handleNavigationIconClick}>
                          <Link
                            to={process.env.PUBLIC_URL + "/datagathering/about-you/#" + incompleteSection}
                            className={url == "assets-liabilities" && isActive ? "active" : ""}
                            onClick={numberr === "0" ? showToast : null}
                          >
                            <img
                              src={imagePath + "/static/media/DG/assets-liabilities.svg"}
                              alt=""
                            />{" "}
                            Assets &amp; Liabilities<span className="required">*</span>
                            {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                              <span className=""></span>
                            ) : (
                              dgSidebarData?.profileData[6] && dgSidebarData?.profileData[6]["total"] !== 0 ? (
                                <span className="navtick tick" />
                              ) : (
                                <span className="navtick incomplete">×</span>
                              )
                            )}
                          </Link>
                        </li>
                      ) : (
                        <li className="assets-liabilities navigation-icon" onClick={handleNavigationIconClick}>
                          <Link
                            to={
                              process.env.PUBLIC_URL +
                              "/datagathering/assets-liabilities"
                            }
                            className={url == "assets-liabilities" && isActive ? "active" : ""}
                          >
                            <img
                              src={imagePath + "/static/media/DG/assets-liabilities.svg"}
                              alt=""
                            />{" "}
                            Assets &amp; Liabilities<span className="required">*</span>
                            {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                              <span className=""></span>
                            ) : (
                              dgSidebarData?.profileData[6] && dgSidebarData?.profileData[6]["total"] !== 0 ? (
                                <span className="navtick tick" />
                              ) : (
                                <span className="navtick incomplete">×</span>
                              )
                            )}
                          </Link>
                        </li>
                      )}

                      {incomeExpenseCookie && getItemLocal("ndasignstatus") == "Y" && (
                        <Modal centered className="popupmodal popupmodal-new" show={incomeExpenseCookie}>
                          <Modal.Header className="ModalHead">
                            <div className="text-center m-popup-header"> Bravo !!</div>
                          </Modal.Header>
                          <div className="px-3 pt-3 d-flex justify-content-between place-items-center align-item-center">
                            <div>
                              <img
                                style={{
                                  maxWidth: "100%"
                                }}
                                src="https://static.fintoo.in/static/assets/img/Income-and-expenses-1.png"
                              />
                            </div>
                            <div style={{
                              padding: "0 1rem"
                            }} className="">
                              <div
                                style={{
                                  fontSize: "1rem",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  fontStyle: "italic"
                                }}
                              >
                                "A Goal Without A Plan Is Just A Wish."

                              </div>
                              <div style={{
                                lineHeight: "1.7rem"
                              }} className=" py-3">What is life without Goals? For your convenience, we have already added the "Retirement Goal" in the Goal Section. So please, go ahead and add your other goals to understand about your future journey.</div>
                              <div style={{
                                lineHeight: "1.7rem"
                              }} className=" py-3">"PS: Don't forget to include your spouse's opinion in Financial Matters as Home Ministry does not like to be kept aloof from critical decisions."</div>

                            </div>

                          </div>
                          <div className="d-flex justify-content-center pb-4">
                            <Link className="mt-4" to={process.env.PUBLIC_URL + "/datagathering/goals"}>
                              <button onClick={() => { localStorage.removeItem('incomeExpenseCookie'); setIncomeExpenseCookie(false) }} className="outline-btn ms-4">
                                Ok
                              </button>
                            </Link>
                          </div>
                        </Modal>
                      )}


                      {assetLiabilityCookie && getItemLocal("ndasignstatus") == "Y" && (
                        <Modal centered className="popupmodal popupmodal-new" show={assetLiabilityCookie}>
                          <Modal.Header className="ModalHead">
                            <div className="text-center m-popup-header">Whoop !!</div>
                          </Modal.Header>
                          <div className="px-3 d-grid place-items-center align-item-center">

                            <div style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }} className="HeaderModal">
                              <img

                                style={{
                                  maxWidth: "35%",
                                }}
                                // src="https://static.fintoo.in/static/assets/img/Insurance-1.png"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/wp/insurance-1.png"
                                }
                              />
                            </div>
                            <div
                              style={{
                                fontSize: "1rem",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontStyle: "italic",
                                padding: ".5rem 2rem"
                              }}
                            >
                              "In India, Less Than 1% Of The People Have a Financial / Wealth Planner"

                            </div>

                            <div className="dgReporttext py-3">Now, you have successfully filled all the mandatory fields required to generate your Financial Planning Report. However, we also recommend you to fill the "Insurance" section as well to give you a proper "Human Life Value" and other "Insurance Analysis".</div>
                            <div className="d-flex align-items-center justify-content-center pb-5 pt-4">
                              <Link className="" >
                                <button style={{
                                  margin: 0,

                                }} onClick={() => { localStorage.removeItem('assetLiabilityCookie'); setAssetLiabilityCookie(false); scrollToTop() }} className="outline-btn ms-4">
                                  Add More
                                </button>
                              </Link>
                              {number == "1" && setPercentage === 83 &&
                                getItemLocal("datagatheringstatus") ? (
                                // <Link className="mt-4" to={`${process.env.PUBLIC_URL}/datagathering/expert-fp`}>
                                <button
                                  onClick={() => {
                                    localStorage.removeItem('assetLiabilityCookie');
                                    setAssetLiabilityCookie(false);
                                    handleGenerateReport();
                                  }}
                                  className="outline-btn ms-4">
                                  Generate Report
                                </button>
                                // </Link>
                              ) : (
                                <>
                                  {numberr === "1" && (
                                    <Link className="">
                                      <button
                                        onClick={() => {
                                          localStorage.removeItem('assetLiabilityCookie');
                                          setAssetLiabilityCookie(false);
                                          handleGenerateReport();
                                        }}
                                        className="outline-btn ms-4">
                                        Generate Report
                                      </button>
                                    </Link>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </Modal>
                      )}

                      {insuranceCookie && (fpDone && kycDone) && getItemLocal("ndasignstatus") == "Y" && (
                        <Modal centered className="popupmodal popupmodal-new" show={insuranceCookie}>
                          <Modal.Header className="ModalHead">
                            <div className="text-center p-0 m-popup-header">Cheers !!</div>
                          </Modal.Header>
                          <div style={{ placeItems: "center" }} className="px-3 d-grid  align-item-center">
                            <div style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }} className="HeaderModal">
                              <img

                                style={{
                                  maxWidth: "35%",
                                }}
                                // src="https://static.fintoo.in/static/assets/img/Insurance-1.png"
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/wp/insurance-1.png"
                                }
                              />
                            </div>
                            <div
                              style={{
                                fontSize: "1rem",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontStyle: "italic",
                                padding: ".5rem 2rem"
                              }}
                            >
                              "We Are Grateful And Honored To Be Your Trusted Wealth Advisor."

                            </div>
                            <div className="dgReporttext text-center py-3">`You can generate your Financial Planning Report now`</div>
                            <div className="d-flex pt-4 justify-content-center align-items-center pb-5">
                              <div>
                                <Link>
                                  <button onClick={() => { localStorage.removeItem('insuranceCookie'); setInsuranceCookie(false); scrollToTop(); }}
                                    className="outline-btn ms-4">
                                    Ok
                                  </button>
                                </Link>
                              </div>

                              {number == "1" && (setPercentage === 83 || setPercentage === 100) &&
                                getItemLocal("datagatheringstatus") ? (
                                // <Link className="mt-4" to={`${process.env.PUBLIC_URL}/datagathering/expert-fp`}>
                                <button
                                  onClick={() => {
                                    localStorage.removeItem('insuranceCookie');
                                    setInsuranceCookie(false);
                                    handleGenerateReport();
                                  }}
                                  className="outline-btn ms-4">
                                  Generate Report
                                </button>
                                // </Link>
                              ) :
                                (
                                  <>
                                    {numberr === "1" && (
                                      <button
                                        onClick={() => {
                                          localStorage.removeItem('insuranceCookie');
                                          setInsuranceCookie(false);
                                          handleGenerateReport();
                                        }}
                                        className="outline-btn ms-4">
                                        Generate Report
                                      </button>
                                    )}
                                  </>
                                )}

                            </div>
                          </div>
                        </Modal>
                      )}

                      {numberr === "0" ? (
                        <li className="insurance navigation-icon" onClick={handleNavigationIconClick}>
                          <Link
                            to={process.env.PUBLIC_URL + "/datagathering/about-you/#" + incompleteSection}
                            className={url == "insurance" && isActive ? "active" : ""}
                            onClick={numberr === "0" ? showToast : null}
                          >
                            <img
                              src={imagePath + "/static/media/DG/insurance.svg"}
                              alt="Insurance"
                            />{" "}
                            Insurance
                            {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                              <span className=""></span>
                            ) : (
                              dgSidebarData?.profileData[8] && dgSidebarData?.profileData[8]["total"] !== 0 && (
                                <span className="navtick tick" />
                              )
                            )}
                          </Link>
                        </li>
                      ) : (
                        <li className="insurance navigation-icon" onClick={handleNavigationIconClick}>
                          <Link
                            to={process.env.PUBLIC_URL + "/datagathering/insurance"}
                            className={url == "insurance" && isActive ? "active" : ""}
                          >
                            <img
                              src={imagePath + "/static/media/DG/insurance.svg"}
                              alt="Insurance"
                            />{" "}
                            Insurance
                            {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                              <span className=""></span>
                            ) : (
                              dgSidebarData?.profileData[8] && dgSidebarData?.profileData[8]["total"] !== 0 && (
                                <span className="navtick tick" />
                              )
                            )}
                          </Link>
                        </li>
                      )}


                    </ul>
                  )}
                </div>
              </li>

              <li className={`document navigation-icon ${isLoad ? "fade-in" : null}`}>
                <Link
                  to={process.env.PUBLIC_URL + "/datagathering/my-document"}
                  className={url == "my-document" ? "active" : ""}
                  onClick={(e) => {
                    // Prevent toggling visibility when clicking on "My Documents" link
                    e.stopPropagation();
                  }}
                >
                  <img
                    src={imagePath + "/static/media/DG/my-documents.svg"}
                    alt=""
                  />{" "}
                  My Documents
                  {/* <span className="navtick tick" id="tick_my_document_id" /> */}
                </Link>
              </li>
              <li className="dashboard-summary navigation-icon">
                <Link
                  style={{ display: "block" }}
                  to={
                    process.env.PUBLIC_URL +
                    "/commondashboard"
                  }
                  target="_self"
                >
                  <img
                    src={imagePath + "/static/media/DG/summary.svg"}
                    alt=""
                  />
                  Dashboard
                  <span className="navtick" id="tick_summary_id" />
                </Link>
              </li>
              <li className="dashboard-summary navigation-icon">
                <Link
                  style={{ display: "block" }}
                  to={
                    process.env.PUBLIC_URL +
                    "/tax-planning-page/"
                  }
                  target="_self"
                >
                  <img
                    src={imagePath + "/static/media/DG/summary.svg"}
                    alt=""
                  />
                  Tax Planning
                  <span className="navtick" id="tick_summary_id" />
                </Link>
              </li>
            </ul>
            <ul className="mobile-bottom-nav ">
              <li>
                <a href="/logout" target="_self">
                  Logout
                </a>
              </li>
              <li>
                <a href="/" target="_self">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="sidebarMobile d-block d-md-none" id="menu-sidebar">
        <div
          className={styles["RP-menu-button"]}
          onClick={() => setOpenMenu(true)}
        >
          {openMenu ? (
            <></>
          ) : (
            <>
              <div className="d-flex justify-content-between">
                <div className="ms-2">
                  <img
                    className={`${styles.mobileImg}`}
                    width={40}
                    src={imagePath + "/static/media/Images/assets/img/mobile-menu-icon.svg"}
                  />
                </div>
                <div className={`${styles.Logo}`}>
                  <img
                    width={80}
                    src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div
          className={`${styles["RP-mobile-menu-wrapper"]} ${openMenu ? styles["active"] : ""
            } `}
          id="hamburger"
        >
          <div className={styles[""]}>
            <a
              onClick={() => setOpenMenu(false)}
              className={styles["close-menu"]}
            >
              ×
            </a>
          </div>
          <div className="top-left-block">
            <a href="/" target="_self" className="logo">
              <img src={process.env.REACT_APP_STATIC_URL + "media/wp/Fintoologo_.svg"} />
            </a>
            <a
              href=""
              ng-click="removeClassFromId('menu-sidebar')"
              className="mobile-menu-close-btn"
            >
              ×
            </a>
            <div className="progress">
              <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
              >
                <circle
                  className="cls-1"
                  cx={25}
                  cy={25}
                  r="22.44"
                  fill="none"
                  stroke="#042b62"
                  strokeWidth={1}
                  style={{ opacity: "0.1" }}
                />
                <circle
                  id="bar"
                  className="cls-1"
                  cx={25}
                  cy={25}
                  r="22.44"
                  fill="transparent"
                  stroke="#042b62"
                  strokeWidth={2}
                  strokeDasharray={141}
                  strokeDashoffset={0}
                  style={{ strokeDashoffset: 0 }}
                />
              </svg>
              <span className="value " id="datagatheringhamburger">
                100%
              </span>
              <span className="status">Profile Completed</span>
            </div>
          </div>
          <div
            id="generatereportbutton"
            className="download-btn-container text-center"
          >
            <a
              className="download-btn download-step-1"
              href="#"
              id="viewBotton"
              ng-click="updatelifecyclestatus()"
              style={{ textAlign: "center" }}
            >
              View Report
            </a>
          </div>
          <div className="navigation-container left-scroll">
            <div className="" style={{}}>
              <ul className="right-navigation mt-4">
                <li>
                  <Link
                    to={process.env.PUBLIC_URL + "/datagathering/about-you"}
                    className={url == "about-you" ? "active" : ""}
                    style={{}}
                  >
                    <img
                      src={imagePath + "/static/media/DG/about-you.svg"}
                      alt=""
                    />{" "}
                    About You<span className="required">*</span>

                    {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                      <span className=""></span>
                    ) : (
                      dgSidebarData?.profileData[11] && dgSidebarData?.profileData[11]["total"] !== 0 ? (
                        <span className="navtick tick" />
                      ) : (
                        <span className="navtick incomplete">×</span>
                      )
                    )}
                  </Link>
                </li>
                <li className="income-expenses navigation-icon">
                  <Link
                    to={
                      process.env.PUBLIC_URL + "/datagathering/income-expenses"
                    }
                    className={url == "income-expenses" && isActive ? "active" : ""}
                    style={{}}
                  >
                    <img
                      src={imagePath + "/static/media/DG/income-expenses.svg"}
                      alt="Income expenses"
                    />{" "}
                    Income &amp; Expenses<span className="required">*</span>
                    {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                      <span className=""></span>
                    ) : (
                      dgSidebarData?.profileData &&
                        dgSidebarData?.profileData[4] &&
                        dgSidebarData?.profileData[5] &&
                        dgSidebarData?.profileData[4]["total"] !== 0 &&
                        dgSidebarData?.profileData[5]["total"] !== 0 ? (
                        <span className="navtick tick" />
                      ) : (
                        <span className="navtick incomplete">×</span>
                      )
                    )}
                  </Link>
                </li>
                <li className="goals navigation-icon">
                  <Link
                    to={process.env.PUBLIC_URL + "/datagathering/goals"}
                    className={url == "goals" && isActive ? "active" : ""}
                  >
                    <img
                      src={imagePath + "/static/media/DG/goal.svg"}
                      alt=""
                    />{" "}
                    Goals<span className="required">*</span>
                    {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                      <span className=""></span>
                    ) : (
                      dgSidebarData?.profileData[3] && dgSidebarData?.profileData[3]["total"] !== 0 ? (
                        <span className="navtick tick" />
                      ) : (
                        <span className="navtick incomplete">×</span>
                      )
                    )}
                  </Link>
                </li>
                <li className="assets-liabilities navigation-icon">
                  <Link
                    to={
                      process.env.PUBLIC_URL +
                      "/datagathering/assets-liabilities"
                    }
                    className={url == "assets-liabilities" && isActive ? "active" : ""}
                  >
                    <img
                      src={imagePath + "/static/media/DG/assets-liabilities.svg"}
                      alt=""
                    />{" "}
                    Assets &amp; Liabilities<span className="required">*</span>
                    {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                      <span className=""></span>
                    ) : (
                      dgSidebarData?.profileData[6] && dgSidebarData?.profileData[6]["total"] !== 0 ? (
                        <span className="navtick tick" />
                      ) : (
                        <span className="navtick incomplete">×</span>
                      )
                    )}
                  </Link>
                </li>
                <li className="insurance navigation-icon">
                  <Link
                    to={process.env.PUBLIC_URL + "/datagathering/insurance"}
                    className={url == "insurance" ? "active" : ""}
                  >
                    <img
                      src={imagePath + "/static/media/DG/insurance.svg"}
                      alt="Insurance"
                    />{" "}
                    Insurance
                    {(!dgSidebarData?.profileData || Object.keys(dgSidebarData?.profileData).length === 0) ? (
                      <span className=""></span>
                    ) : (
                      dgSidebarData?.profileData[8] && dgSidebarData?.profileData[8]["total"] !== 0 && (
                        <span className="navtick tick" />
                      )
                    )}
                  </Link>
                </li>
                <li className="document navigation-icon">
                  <Link
                    to={process.env.PUBLIC_URL + "/datagathering/my-document"}
                    className={url == "my-document" ? "active" : ""}
                  >
                    <img
                      src={imagePath + "/static/media/DG/my-documents.svg"}
                      alt=""
                    />{" "}
                    My Documents
                    <span className="navtick tick" id="tick_my_document_id" />
                  </Link>
                </li>
                <li className="dashboard-summary navigation-icon">
                  <Link
                    style={{ display: "block" }}
                    to={
                      process.env.PUBLIC_URL +
                      "/direct-mutual-fund/commondashboard"
                    }
                    target="_self"
                  >
                    <img
                      src={imagePath + "/static/media/DG/summary.svg"}
                      alt=""
                    />
                    Dashboard
                    <span className="navtick" id="tick_summary_id" />
                  </Link>
                </li>
              </ul>
              <ul className="mobile-bottom-nav ">
                <li>
                  <a href="/logout" target="_self">
                    Logout
                  </a>
                </li>
                <li>
                  <a href="/" target="_self">
                    Dashboard
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;