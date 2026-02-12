import React, { useEffect, useRef, useState } from "react";
import { BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import ReactDatePicker from "../../../components/HTML/ReactDatePicker/ReactDatePicker";
import moment from "moment";
import Slider from "../../../components/HTML/Slider";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
// import FetchLoanSuccess from "../../../components/FetchLoanSuccess";
import Cibilreport from './CIIBIL_Report/Cibil_Report.module.css';
import {
  imagePath,
  DATA_BELONGS_TO
} from "../../../constants";
import {
  apiCall,
  calculateEMI,
  getItemLocal,
  getParentFpLogId,
  getParentUserId,
  getUserId,
  indianRupeeFormat,
  restApiCall, loginRedirectGuest
} from "../../../common_utilities";
import commonEncode from "../../../commonEncode";
import DGstyles from "../DG.module.css";
import Select from "react-select";
import { Buffer } from "buffer";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { Modal } from "react-bootstrap";
import customStyles from "../../../components/CustomStyles";
import FintooLoader from "../../../components/FintooLoader";
import DgRoundedButton from "../../../components/HTML/DgRoundedButton";
import FintooDatePicker from "../../../components/HTML/FintooDatePicker";
import ReportStepper from "./CIIBIL_Report/ReportStepper";
import Creditreportprocess from "./CIIBIL_Report/Creditreportprocess";
import Fetchloan from "./CIIBIL_Report/Fetchloan";
import { ScrollToTop } from "../ScrollToTop"
import { toaster } from "evergreen-ui";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";
import FintooCheckbox from "../../../components/FintooCheckbox/FintooSubCheckbox";
import { getFamilyMember } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { addLiablityDetails, getLiabilityDetails, Delete_External_Loans, Fetchexternalholdingdetails, Update_External_User_Loan_Details, deleteLiablityDetails, UpdateLiablityDetails, getLiablityCategoryList } from "../../../FrappeIntegration-Services/services/financial-planning-api/liabilities";
const Liabilities = (props) => {

  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
  const [holdingDetails, setHolingDeatils] = useState([]);
  const [existingHoldingUserIds, setExistingHoldingUserIds] = useState([]);
  const [scroll, setScroll] = useState(false);
  const [liabilityOptions,setLiabilityOptions] = useState([])

  useEffect(() => {
    const handleScroll = () => {
      const removefixheader3 = document.querySelector('.fetchloanbox');
      const FixdgsubHeader3 = document.querySelector('.FixdgHeader');
      const FixdgmainHeader3 = document.querySelector('.DGheaderFix3');
      const scrollPosition1 = window.scrollY;
      if (props.tab === "tab2") {
        if (removefixheader3 && FixdgsubHeader3 && FixdgmainHeader3) {
          const removefixheaderRect3 = removefixheader3.getBoundingClientRect();
          const threshold3 = 70;
          if (removefixheaderRect3.top > 130 && scrollPosition1 > 50) {
            setScroll(true)
            FixdgsubHeader3.classList.add("DGsubheaderFix");
            if (removefixheaderRect3.top <= threshold3) {
              FixdgmainHeader3.classList.remove("DGmainHeaderFix");
            }
            else {
              FixdgmainHeader3.classList.add("DGmainHeaderFix");
            }
          } else {
            setScroll(false);
            FixdgsubHeader3.classList.remove("DGsubheaderFix");
            FixdgmainHeader3.classList.remove("DGmainHeaderFix");
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);

    };
  }, [props.tab]);
  // const customStyles = {
  //   option: (base, { data, isDisabled, isFocused, isSelected }) => {
  //     return {
  //       ...base,
  //       backgroundColor: isFocused ? "#ffff" : "#042b62",
  //       color: isFocused ? "#042b62" : "#fff",
  //       cursor: "pointer",
  //     };
  //   },
  //   menuList: (base) => ({
  //     ...base,
  //     height: "100px",
  //     overflowY: "scroll",
  //     scrollBehavior: "smooth",
  //     "::-webkit-scrollbar": {
  //       width: "4px",
  //       height: "0px",
  //     },
  //     "::-webkit-scrollbar-track": {
  //       background: "#fff",
  //     },
  //     "::-webkit-scrollbar-thumb": {
  //       background: "#042b62",
  //     },
  //     "::-webkit-scrollbar-thumb:hover": {
  //       background: "#555",
  //     },
  //   }),
  // };
  const imageMap = {
    "Business Loan": "liability_business.svg",
    "Car Loan": "liability_car.svg",
    "Consumer Loan": "liability_consumer.svg",
    "Credit Card Loan": "liability_mortgage.svg",
    "Housing Loan": "liability_housing.svg",
    "Loan from friends and family": "liability_famil_friends.svg",
    "Property Loan": "liability_other_property_loan.svg",
    "Personal Loan": "liability_personal.svg",
    "Other Loan": "fetch_loan.svg"
  }
  const liabilityCategory = async () => {
      try {
        setIsDataLoading(true);
  
        let liability_data = await getLiablityCategoryList();
        if (liability_data["status_code"] == "200") {
          setIsDataLoading(false);
          const apiData = liability_data["data"][0]
          const transformed = apiData.category_list.flatMap(category =>
              category.subcategories.map(sub => ({
                liability_sub_cat_uuid: sub.liability_sub_cat_uuid,
                liability_cat_uuid: category.liability_cat_uuid,
                title: sub.liability_sub_name,
                img: `${imagePath}/static/media/DG/assets-liabilities/${imageMap[sub.liability_sub_name]}`
              }))
            );

          // ✅ Sort alphabetically by title
          transformed.sort((a, b) =>
            a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
          );

          // transformed.push({
          //   liability_sub_cat_uuid: "fetch_loan",
          //   liability_cat_uuid: "cat_fetch_loan",
          //   title: "Fetch Loan",
          //   img: `${imagePath}/static/media/DG/assets-liabilities/fetch_loan.svg`
          // })
          setLiabilityOptions(transformed);
        }
      } catch { }
    };
  // const liability_option = [
  //   {
  //     id: "LBSCAT-7",
  //     cat_id: "LBCAT-3",
  //     title: "Business Loan",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/liability_business.svg",
  //   },
  //   {
  //     id: "LBSCAT-3",
  //     title: "Car Loan",
  //     cat_id: "LBCAT-1",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/liability_car.svg",
  //   },
  //   {
  //     id: "LBSCAT-5",
  //     cat_id: "LBCAT-2",
  //     title: "Consumer Loan",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/liability_consumer.svg",
  //   },
  //   {
  //     id: "LBSCAT-6",
  //     cat_id: "LBCAT-2",
  //     title: "Credit Card",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/liability_mortgage.svg",
  //   },
  //   {
  //     id: "LBSCAT-1",
  //     cat_id: "LBCAT-1",
  //     title: "Housing",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/liability_housing.svg",
  //   },
  //   {
  //     id: "LBSCAT-8",
  //     cat_id: "LBCAT-3",
  //     title: "Loan From Family And Friends",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/liability_famil_friends.svg",
  //   },
  //   {
  //     id: "LBSCAT-2",
  //     cat_id: "LBCAT-1",
  //     title: "Other Property Loan",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/liability_other_property_loan.svg",
  //   },
  //   {
  //     id: "LBSCAT-4",
  //     cat_id: "LBCAT-2",
  //     title: "Personal Loan",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/liability_personal.svg",
  //   },
  //   {
  //     id: 30,
  //     title: "Fetch Loan",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/fetch_loan.svg",
  //   },
  //   {
  //     id: "LBSCAT-9",
  //     cat_id: "LBCAT-3",
  //     title: "Others",
  //     img:
  //       imagePath +
  //       "/static/media/DG/assets-liabilities/fetch_loan.svg",
  //   },
  // ];

  const defaultLiabilitiesDetails = {
    user_liability_name: "Business Loan",
    liability_category_type: "Business Loan",
    liability_cat_uuid: "business_and_informal_loans",
    liability_sub_cat_uuid: "business_loan",
    user_liability_outstanding_amount: "",
    user_liability_user_id: 0,
    user_liability_end_date: "",
    user_liability_for: getParentUserId(),
    liability_frequency: "1",
    user_liability_emi_amount: "",
    user_liability_emi_rate: 7,
    user_liability_remarks: "",
    liability_type: ""
  };

  const defaultHandleError = {
    user_liability_name: "",
    user_liability_outstanding_amount: "",
    user_liability_end_date: "",
    user_liability_emi_amount: "",
  };

  const defaultLiabilityChecks = {
    checkEMI: 0,
    notCalculated: "0",
    checkLiabilityOutstandingAmount: "0",
    checkLiabilityEndDate: "0",
    checkEMIRate: "0",
  };

  const [liabilitiesData, setLiabilitiesData] = useState(
    defaultLiabilitiesDetails
  );
  const [openModalByName, setOpenModalByName] = useState("");
  const memberData = props.familyData;
  const isFetch = props?.isFetch;
  const [liabilityCheck, setLiabilityCheck] = useState(defaultLiabilityChecks);
  const [handlerror, setHandleError] = useState(defaultHandleError);
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Business Loan");
  const [session, setSession] = useState("");
  const [fplogid, setFpLogId] = useState("");
  const [userId, setUserid] = useState("");
  const [equifaxData, setEquifaxData] = useState([]);

  const [liabilityData, setLiabilityData] = useState([]);
  const [liabilityId, setLiabilityId] = useState("");
  const [showview, setShowView] = useState(true);
  const [addForm, setAddForm] = useState(true);
  const [updateForm, setUpdateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [isPlan, setIsPlan] = useState(true);

  console.log("allMembers", allMembers)

  const [selectedMember, setSelectedMember] = useState("");
  const [errors, setErrors] = useState("");
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [panEditable, setPanEditable] = useState(false);
  const [fetchLoan, setFetchloan] = useState(false);
  const [deletetoggleliabilities, setDeleteToggleliabilities] = useState(false);
  const [selectedliabilitiesCategories, setSelectedliabilitiesCategories] = useState([]);
  const frequencylist = {
    1: "Monthly",
    2: "Quarterly",
    3: "Half Yearly",
    4: "Yearly",
  };

  const handleClose = (type, form) => {
    if (type == "yes" && form == "liability") {
      removeLiability(liabilityId);
    } else {
      setShow(false);
    }
  };
  const handleShow = () => setShow(true);
  const userid = getParentUserId();
  const fp_log_id = getParentFpLogId();

  const cntRef = useRef(null);
  const scrollToRef = () => {
    cntRef.current.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    if (!liabilitiesData.user_liability_outstanding_amount) {
      setLiabilitiesData({
        ...liabilitiesData,
        user_liability_emi_amount: "",
      });
    }
  }, [liabilitiesData?.user_liability_outstanding_amount]);

  useEffect(() => {
    setLiabilitiesData({
      ...liabilitiesData,
      liability_emi: "",
    });
    let emiAmt = 0;
    let liabilityEMIAmount = 0;
    let not_calculated = "1";
    if (
      liabilityCheck.checkLiabilityOutstandingAmount !==
      liabilitiesData.user_liability_outstanding_amount ||
      liabilityCheck.checkLiabilityEndDate !==
      liabilitiesData.user_liability_end_date ||
      liabilityCheck.checkEMIRate !== liabilitiesData.user_liability_emi_rate
    ) {
      setLiabilityCheck({
        ...liabilityCheck,
        notCalculated: "0",
      });
      not_calculated = "0";
    }
    if (
      liabilitiesData.user_liability_emi_rate &&
      liabilitiesData.user_liability_end_date &&
      liabilitiesData.user_liability_outstanding_amount &&
      not_calculated === "0"
    ) {
      let currentDate = new Date();
      let targetDateStr = liabilitiesData.user_liability_end_date;
      let [targetDay, targetMonth, targetYear] = targetDateStr.split("/");
      let targetDateFormatted = `${targetYear}-${targetMonth}-${targetDay}`;
      let targetDate = new Date(targetDateFormatted);
      let currentDay = currentDate.getDate();
      targetDay = targetDate.getDate();

      let monthsDiff =
        (targetDate.getFullYear() - currentDate.getFullYear()) * 12 +
        (targetDate.getMonth() - currentDate.getMonth());

      if (currentDay < targetDay) {
        monthsDiff++;
      }

      let principalAmount = liabilitiesData.user_liability_outstanding_amount;
      let interestRatePerAnnum = liabilitiesData.user_liability_emi_rate;
      let loanTenureInMonths = monthsDiff;

      emiAmt = calculateEMI(
        principalAmount,
        interestRatePerAnnum,
        loanTenureInMonths
      );

      // emiAmt = PMT(
      //   (liabilitiesData.user_liability_emi_rate * 0.01) / 12,
      //   liabilitiesData.user_liability_end_date,
      //   liabilitiesData.user_liability_outstanding_amount
      // );

      if (`${emiAmt}`.length > 9) {
        liabilityEMIAmount = Math.round(emiAmt);
      }
      setLiabilitiesData({
        ...liabilitiesData,
        user_liability_emi_amount: liabilityEMIAmount,
      });
      setLiabilityCheck({
        checkEMI: emiAmt,
      });
    }
  }, [
    liabilitiesData?.user_liability_emi_rate,
    liabilitiesData?.user_liability_end_date,
    liabilitiesData?.user_liability_outstanding_amount,
  ]);

  useEffect(() => {
    let currentEMI = liabilitiesData.user_liability_emi_amount;
    let liabilityEMI = "";
    if (liabilityCheck.checkEMI != liabilitiesData.user_liability_emi_amount) {
      setLiabilitiesData({
        ...liabilitiesData,
        liability_emi: currentEMI,
      });
      liabilityEMI = currentEMI;
    }
    if (liabilityEMI) {
      if (liabilityCheck.checkEMI != liabilitiesData.user_liability_emi_amount) {
        setLiabilitiesData({
          ...liabilitiesData,
          currentEMI: liabilityEMI,
        });
      }
    }
  }, [liabilitiesData?.user_liability_emi_amount]);

  useEffect(() => {
    document.body.classList.add("dg-layout");
    return () => {
      document.body.classList.remove("rp-layout");
    };
  }, []);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
  }, []);

  useEffect(() => {
    // if (isFetch) {
    //   setSelectedOption("Fetch Loan");
    // }
    liabilityCategory()
    getLiabilityList()
    // // checksession();
  }, []);


  const handleDisableRefresh = () => {
    toastr.options.positionClass = "toast-bottom-left";
    toastr.error("Please note that you can refresh your CIBIL score after a 30-day waiting period from the last updated date.",
      // { 
      //     timeOut: 3000,
      //     onclick: () => {
      //         toastr.clear();
      //       },
      // }
    );
  };


  const onLoadInit = async (session) => {
    try {
      // getEquifaxData(session);
    } catch (e) {
      console.log(e);
    }
  };

  // "user_id": selectedMember.liability_member_id,
  //                   "user_pan": selectedMember.pan,
  //                   "user_dob": String(selectedMember.dob),
  //                   "data_belongs_to": DATA_BELONGS_TO,
  //                   "user_loan_for": selectedMember.liability_member_id,
  //                   "user_mobile": Number(selectedMember.mobile),

  const getEquifaxData = async () => {
    try {
      const checkData = await getFamilyMember(user_data.user_id);
      const payload = {
        user_id: user_data.user_id,
        holding_type: "Loan",
        data_belongs_to: DATA_BELONGS_TO
      };
    
      const response = await Fetchexternalholdingdetails(payload);

      let holdingUserIds = [];
      if (response.status_code === 200 && response.data?.holding_details) {
        setHolingDeatils(response.data.holding_details);
        holdingUserIds = response.data.holding_details.map(item => item.user_id);
        setExistingHoldingUserIds(holdingUserIds);
      }
      if (checkData.status_code === "200" && checkData.data?.length > 0) {
        const all = checkData.data
          .filter(v => !holdingUserIds.includes(v.user_id))
          .map(v => ({
            name: v.user_name,
            id: v.user_id,
            mobile: v.mobile_number,
            dob: v.dob,
            pan: v.pan,
            label: v.user_name,
            value: v.user_id,
          }));

        setAllMembers(all);
      }

    } catch (error) {
      console.log("getEquifaxData error:", error);
    }
  };


  useEffect(() => {
    getEquifaxData()
  }, [])

  const scrollToForm = () => {
    const { offsetTop } = cntRef.current;
    window.scroll({ top: offsetTop - 50 });
  };

  const scrollToList = () => {
    const { offsetTop } = cntRef.current;
    window.scroll({ top: offsetTop - 1500 });
  };

  useEffect(() => {
    if (liabilitiesData.user_liability_name != "") {
      setHandleError({
        ...handlerror,
        user_liability_name: "",
      });
    }
    if (liabilitiesData.user_liability_outstanding_amount != "") {
      setHandleError({
        ...handlerror,
        user_liability_outstanding_amount: "",
      });
    }
    if (liabilitiesData.user_liability_emi_amount != "") {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "",
      });
    }
    if (liabilitiesData.user_liability_end_date != null) {
      setHandleError({
        ...handlerror,
        user_liability_end_date: "",
      });
    }
    if (liabilitiesData.user_liability_emi_amount && liabilitiesData.user_liability_emi_amount.toString().length >= 9) {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "Please enter less than 9 digits",
      });
      scrollToRef();
    }

    if (liabilitiesData.user_liability_emi_amount && liabilitiesData.user_liability_emi_amount.toString().length < 10) {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "",
      });
    }
    if (liabilitiesData.user_liability_emi_amount && liabilitiesData.user_liability_emi_amount.toString() == "0") {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "Please enter EMI amount",
      });
      scrollToRef();
    }
  }, [
    liabilitiesData.user_liability_name,
    liabilitiesData.user_liability_outstanding_amount,
    liabilitiesData.user_liability_emi_amount,
    liabilitiesData.user_liability_end_date,
  ]);

  // const checkSession = async () => {
  //   let url = '';
// let url = CHECK_SESSION;
  //   let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
  //   let session_data = await apiCall(url, data, true, false);

  //   if (session_data.error_code == "100") {
  //     setSession(session_data["data"]);
  //     setFpLogId(fp_log_id);

  //     if (session_data.data['user_details'].fp_log_id == null) {
  //       setIsPlan(false);

  //     } else {
  //       setIsPlan(true);
  //     }

  //     setIsDataLoading(true);
  //     setLiabilitiesData({
  //       ...liabilitiesData,
  //       user_liability_for: session_data["data"]["fp_user_id"],
  //     });
  //     var liability_payload = await apiCall(
  //       ADVISORY_GETLIABILITIES_API_URL +
  //       "?user_id=" +
  //       Buffer.from(commonEncode.encrypt(userid.toString())).toString(
  //         "base64"
  //       ) +
  //       "&fp_log_id=" +
  //       Buffer.from(commonEncode.encrypt(fp_log_id.toString())).toString(
  //         "base64"
  //       ) +
  //       "&web=1"
  //     );
  //     await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  //     setIsDataLoading(false);

  //     var liability_res = liability_payload;
  //     if (liability_res["error_code"] == "100") {
  //       setLiabilityData(liability_res.data);
  //     } else {
  //       setLiabilityData([]);
  //     }

  //     onLoadInit(session_data["data"]);

  //   }
  // };

  const getLiabilityList = async () => {
    try {
      // let url =
      //   ADVISORY_GETLIABILITIES_API_URL +
      //   "?user_id=" +
      //   Buffer.from(commonEncode.encrypt(userid.toString())).toString(
      //     "base64"
      //   ) +
      //   "&fp_log_id=" +
      //   Buffer.from(commonEncode.encrypt(fp_log_id.toString())).toString(
      //     "base64"
      //   ) +
      //   "&web=1";
      let liability_res = await getLiabilityDetails(getParentUserId(),null);
      if (liability_res["status_code"] == "200") {
        setLiabilityData(liability_res.data);
      } else {
        setLiabilityData([]);
      }
    } catch {
      toastr.error("Something Went Wrong", {
        position: "bottom-left",
      });
    }
  };

  const handleUnlink = async (equifax_id, user_name, user_id) => {
    // var selected_name = "";
    // // // var selected_pan = "";
    // holdingDetails.filter((item) => {
    //   if (item.id == equifax_id) {
    //     selected_name = item.user_name;
    //   }
    // });

    try {
      const reqdata = {
        user_id : user_id,
        external_holding_id: equifax_id,
        data_belongs_to : DATA_BELONGS_TO
      };

      const respData  = await Delete_External_Loans(reqdata)

      if (respData.status_code == 200) {
        // setEquifaxData(respData.data);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(user_name + "'s loan has been unlinked successfully.");
        getEquifaxData(session);
        getLiabilityList();
      } else {
        // toastr.options.positionClass = "toast-bottom-left";
        // toastr.success(respData.message);
        console.log(respData.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleRefreshLoans = async (equifax_id, member_id, selected_name) => {
    try {
      var payload = {
        "fp_equifax_id": equifax_id,
        "user_liability_for": member_id,
        "user_id": session.id,
        "fp_log_id": session.fp_log_id
      };

      const respData = await Update_External_User_Loan_Details(payload);

      // let respData = await restApiCall(
      //   ADVISORY_UPDATE_FETCHEDLOANS_API,
      //   payload,
      //   true,
      //   false
      // );

      if (respData.status_code == 200) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(selected_name + "'s loan has been refreshed successfully.");
        getEquifaxData(session);
        getLiabilityList();
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong!");
      }
    } catch (e) {
      console.log(e);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateForm(false);

    let f_errors = {};

    if (liabilitiesData.user_liability_name == "") {
      // setHandleError({
      //   ...handlerror,
      //   user_liability_name: "Please enter goal name",
      // });
      f_errors["user_liability_name"] = "Please enter goal name";
      scrollToRef();
    }

    if (liabilitiesData.user_liability_outstanding_amount == "") {
      // setHandleError({
      //   ...handlerror,
      //   user_liability_outstanding_amount: "Please enter current outstanding amount",
      // });
      f_errors["user_liability_outstanding_amount"] =
        "Please enter current outstanding amount";
      scrollToRef();
    }
    if (liabilitiesData.user_liability_emi_amount == "") {
      // setHandleError({
      //   ...handlerror,
      //   user_liability_emi_amount: "Please enter the liability current emi",
      // });

      f_errors["user_liability_emi_amount"] = "Please enter EMI amount";
      scrollToRef();
    } else if (liabilitiesData.user_liability_emi_amount <= 0) {
      // setHandleError({
      //   ...handlerror,
      //   user_liability_emi_amount: "Please enter EMI amount",
      // });
      f_errors["user_liability_emi_amount"] = "Please enter the liability current emi";
      scrollToRef();
    } else if (liabilitiesData.user_liability_emi_amount.toString().length >= 9) {
      // setHandleError({
      //   ...handlerror,
      //   user_liability_emi_amount: "Please enter less than 9 digits",
      // });
      f_errors["user_liability_emi_amount"] = "Please enter less than 9 digits";
      scrollToRef();
    } else {
      var liability_outstanding_amount = liabilitiesData.user_liability_outstanding_amount;
      if (parseInt(liabilitiesData.user_liability_emi_amount) > parseInt(liability_outstanding_amount)) {
        f_errors["user_liability_emi_amount"] = "Please enter EMI amount less than outstanding amount";
        scrollToRef();
      }
    }
    if (
      liabilitiesData.user_liability_end_date == null ||
      liabilitiesData.user_liability_end_date == ""
    ) {
      // setHandleError({
      //   ...handlerror,
      //   user_liability_end_date: "Please select end date",
      // });
      f_errors["user_liability_end_date"] = "Please select end date";
      scrollToRef();
    }

    if (f_errors) {
      setHandleError((previous) => ({
        ...previous,
        ...f_errors,
      }));
    }

    if (
      liabilitiesData.user_liability_name != "" &&
      liabilitiesData.user_liability_outstanding_amount != "" &&
      liabilitiesData.user_liability_emi_amount != "" &&
      liabilitiesData.user_liability_end_date != null &&
      liabilitiesData.user_liability_emi_amount.toString().length < 10 &&
      liabilitiesData.user_liability_emi_amount != 0 &&
      liabilitiesData.user_liability_emi_amount > 0 &&
      parseInt(liabilitiesData.user_liability_emi_amount) < parseInt(liabilitiesData.user_liability_outstanding_amount)
    ) {
      saveLiability(e);
    }
  };

  const saveLiability = async (e) => {
    try {
      // let url = ADVISORY_SAVE_UPDATE_LIABILITIES_API_URL;
      var payload = liabilitiesData;

      
      // payload.user_liability_emi_amount = liabilitiesData.liability_emi;
      payload.user_liability_user_id = getParentUserId();
      setLoading(true);
      if ("user_liability_id" in liabilitiesData) {
        delete payload.user_liability_loan_account_no 
        var res = await UpdateLiablityDetails(payload);
      }else{
        var res = await addLiablityDetails(payload);
      }
      if ((res.status_code = "200")) {
        getLiabilityList();
        scrollToList();
        setLiabilitiesData({
          ...defaultLiabilitiesDetails,
          user_liability_for: getParentUserId(),
        });
        setSelectedOption("Business Loan");
        setHandleError({
          ...handlerror,
          user_liability_name: "",
          user_liability_outstanding_amount: "",
          user_liability_end_date: "",
          user_liability_emi_amount: "",
        });
        var savetext = liabilitiesData.user_liability_id ? " updated " : " saved ";
        var msg = liabilitiesData.user_liability_name
          ? " - " + liabilitiesData.user_liability_name
          : "";
        toastr.options.positionClass = "toast-bottom-left";
        // Find matching liability option
        const matchedLiability = liabilityOptions.find(
          (item) => item.liability_sub_cat_uuid === liabilitiesData.liability_sub_cat_uuid
        );

        // Fallback title if not found
        const liabilityTitle = matchedLiability ? matchedLiability.title : "Liability";

        // Show success message
        toastr.success(
          "Data " +
            savetext +
            " successfully for " +
            liabilityTitle +
            msg
        );
        // toastr.success(
        //   "Data" +
        //   savetext +
        //   "successfully for " +
        //   liabilitiesData.liability_sub_category_type +
        //   msg
        // );
        setAddForm(true);
        setUpdateForm(false);
        setLoading(false);
      } else {
        setLoading(false);
        toastr.error("Oops something went wrong!!", {
          position: "bottom-left",
        });
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      toastr.error("Something Went Wrong", {
        position: "bottom-left",
      });
    }
  };

  const cancelFormData = async (e) => {
    e.preventDefault();
    setAddForm(true);
    setUpdateForm(false);
    scrollToList();
    setLiabilitiesData({
      ...defaultLiabilitiesDetails,
      user_liability_for: getParentUserId(),
    });
    setSelectedOption("Business Loan");
    setHandleError({
      ...handlerror,
      user_liability_name: "",
      user_liability_outstanding_amount: "",
      user_liability_end_date: "",
      user_liability_emi_amount: "",
    });
  };

  const updateFormData = async (e) => {
    setUpdateForm(true);
    e.preventDefault();
    if (liabilitiesData.user_liability_name == "") {
      setHandleError({
        ...handlerror,
        user_liability_name: "Please enter goal name",
      });
      scrollToRef();
    }
    if (liabilitiesData.user_liability_outstanding_amount == "") {
      setHandleError({
        ...handlerror,
        user_liability_outstanding_amount: "Please enter current outstanding amount",
      });
      scrollToRef();
    }
    if (liabilitiesData.user_liability_emi_amount == "") {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "Please enter the liability current emi",
      });
      scrollToRef();
    }
    if (liabilitiesData.user_liability_emi_amount <= 0) {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "Please enter EMI amount",
      });
      scrollToRef();
    }
    if (liabilitiesData.user_liability_emi_amount.toString().length >= 9) {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "Please enter less than 9 digits",
      });
      scrollToRef();
    }
    else if (parseInt(liabilitiesData.user_liability_emi_amount) > parseInt(liabilitiesData.user_liability_outstanding_amount)) {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "Please enter EMI amount less than outstanding amount",
      });
      scrollToRef();
    }
    if (liabilitiesData.user_liability_end_date == null) {
      setHandleError({
        ...handlerror,
        user_liability_end_date: "Please enter liability end date",
      });
      scrollToRef();
    }

    if (
      liabilitiesData.user_liability_name != "" &&
      liabilitiesData.user_liability_outstanding_amount != "" &&
      liabilitiesData.user_liability_emi_amount != "" &&
      liabilitiesData.user_liability_end_date != null &&
      liabilitiesData.user_liability_emi_amount.toString().length < 10 &&
      liabilitiesData.user_liability_emi_amount != 0 &&
      liabilitiesData.user_liability_emi_amount > 0 &&
      parseInt(liabilitiesData.user_liability_emi_amount) < parseInt(liabilitiesData.user_liability_outstanding_amount)
    ) {
      saveLiability();
    }
  };

  const editLiability = async (id) => {
    try {
      let liability_id = id;
      setLiabilityId(id);
      // let url =
      //   ADVISORY_GETLIABILITIES_API_URL +
      //   "?liability_id= " +
      //   Buffer.from(commonEncode.encrypt(liability_id.toString())).toString(
      //     "base64"
      //   ) +
      //   "&web=1";
      var getliab_payload = await getLiabilityDetails(null,liability_id);

      var lib_res = getliab_payload;
      if (lib_res["status_code"] == "200") {
        if (lib_res.data.length > 0) {
          let liabData = lib_res["data"]["0"];
          // if (liabData["liability_emi"]) {
          setLiabilityCheck({
            notCalculated: "1",
            checkLiabilityOutstandingAmount:
              liabData["user_liability_outstanding_amount"],
            checkLiabilityEndDate: liabData["user_liability_end_date"],
            checkEMIRate: liabData["user_liability_emi_rate"],
          });
          // }
          setLiabilitiesData(liabData);
          scrollToForm();
          setSelectedOption(liabData["liability_sub_category_type"]);
          setHandleError({
            ...handlerror,
            user_liability_name: "",
            user_liability_outstanding_amount: "",
            user_liability_end_date: "",
            user_liability_emi_amount: "",
          });
          toastr.options.positionClass = "toast-bottom-left";
          var msg = liabData["user_liability_name"]
            ? " - " + liabData["user_liability_name"]
            : " ";
          toastr.success(
            " You can now edit details for " + liabData["liability_sub_category_type"] + msg
          );
        }
      } else {
        setLiabilityData([]);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (e) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const removeLiability = async (id) => {

    const equifaxIds = liabilityData
      .filter(item => item.liability_type === "equifax")
      .map(item => item.id);
    const status = equifaxIds.length > 0 ? equifaxIds.every(id => selectedliabilitiesCategories.includes(id)) : false;
    const ids = equifaxData.map(data => data.id);

    try {
      // let url = ADVISORY_REMOVE_LIABILITIES_API_URL;
      var remove_payload = {
        user_liability_id: selectedliabilitiesCategories,
        // deletedflag: status,
        // equifax_unique_id: ids,
        // user_liability_user_id: getParentUserId(),
        data_belongs_to: DATA_BELONGS_TO,
      };
      // setLoading(true);
      let deleteLiabilityData = await deleteLiablityDetails(remove_payload);
      if (deleteLiabilityData["status_code"] == "200") {
        setShow(false);
        // setLoading(false);
        getLiabilityList();
        getEquifaxData();
        toastr.options.positionClass = "toast-bottom-left";
        var msg = liabilitiesData.user_liability_name
          ? " - " + liabilitiesData.user_liability_name
          : " ";
        // toastr.success(selectedOption + msg + " has been deleted successfully");
        toastr.success(" Data been deleted successfully");
        setLiabilitiesData({
          ...defaultLiabilitiesDetails,
          user_liability_for: getParentUserId(),
        });
        setHandleError(defaultHandleError);
        setSelectedOption("Business Loan");
        setAddForm(true);
        setUpdateForm(false);
        scrollToList();
        setSelectedliabilitiesCategories([]);
      } else {
        // setLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const handleLiabilityName = (name) => {
    if (name == "") {
      setHandleError({
        ...handlerror,
        user_liability_name: "Please enter liability name",
      });
      scrollToRef();
    } else if (name.length < 3 || name.length > 35) {
      setHandleError({
        ...handlerror,
        user_liability_name: "Name must be between 3-35 characters",
      });
      scrollToRef();
    } else {
      setHandleError({ ...handlerror, user_liability_name: "" });
    }
  };

  const handleLiabilityOutstandingValue = (currentvalue) => {
    let f_error = {};
    if (currentvalue == "") {
      f_error["user_liability_outstanding_amount"] =
        "Please enter current outstanding amount";
    } else if (currentvalue <= 0) {
      f_error["user_liability_outstanding_amount"] =
        "Please enter a value greater than or equal to 1";
    } else {
      f_error["user_liability_outstanding_amount"] = "";
    }

    setHandleError((previous) => ({
      ...previous,
      ...f_error,
    }));
  };

  const handleCurrentEMI = (currentvalue) => {
    if (currentvalue == "") {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "Please enter EMI amount",
      });
      scrollToRef();
    }
  };

  const handleLiabilityEMIValue = (currentvalue) => {
    if (currentvalue <= 0) {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "Please enter EMI amount",
      });
      scrollToRef();
    }
    if (currentvalue.toString().length > 9) {
      setHandleError({
        ...handlerror,
        user_liability_emi_amount: "Please enter less than 9 digits",
      });
      scrollToRef();
    }
    if (currentvalue == null) {
      setHandleError({
        ...handlerror,
        user_liability_end_date: "Please enter liability end date",
      });
      scrollToRef();
    }
  };

  const handleEndDate = (enddate) => {
    handlerror.user_liability_end_date = "Please select end date";
    if (enddate == "") {
      setHandleError({
        ...handlerror,
        user_liability_end_date: "Please select end date",
      });
      scrollToRef();
    } else {
      setHandleError({ ...handlerror, user_liability_end_date: "" });
    }
  };

  const handleCategoryClick = (liab, type) => {
    if (type == "liability") {
      const { id, ...updatedLiabilitiesData } = liabilitiesData;
      setLiabilitiesData({
        ...updatedLiabilitiesData, // Spread the updated object
        user_liability_name: liab.title,
        liability_category_type: liab.title,
        liability_cat_uuid: liab.liability_cat_uuid,
        liability_sub_cat_uuid: liab.liability_sub_cat_uuid,
        user_liability_end_date: null,
        user_liability_outstanding_amount: "",
        user_liability_remarks: "",
        liability_emi: "",
        user_liability_for: getParentUserId(),
        user_liability_emi_rate: 7,
        liability_type: "",
        user_liability_emi_amount: "",
      });
      setAddForm(true);
      setUpdateForm(false);
    }
  };

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  function calculateTotalLiabilities() {
    if (!liabilityData) return 0;

    return liabilityData.reduce((total, liab) => {
      if (liab.user_liability_outstanding_amount) {
        const outstandingamount = parseFloat(liab.user_liability_outstanding_amount);
        return total + outstandingamount;
      }
    }, 0);
  }

  const CloseLoanModal = () => {
    setOpenModalByName(null);
  }

  const Info = styled(ReactTooltip)`
  max-width: 278px;
  padding-top: 9px;
  background: "#fff";
`;
  const InfoMessage = styled.p`
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
`;

  // const Fetchexternalholding = async () => {
  //   // 
  //   // if (!user_data?.user_id) return;
  //   // setLoading(true);
  //   const payload = {
  //     user_id: user_data.user_id,
  //     holding_type: "Loan",
  //     data_belongs_to: DATA_BELONGS_TO
  //   }
  //   try {
  //     const response = await Fetchexternalholdingdetails(payload);

  //     switch (response.status_code) {
  //       case 200:
  //         setHolingDeatils(response.data.holding_details);
  //         setExistingHoldingUserIds(holdingDetails.map((data, i) => data.user_id))
  //         break;
  //       case 400:
  //       // case "404":
  //       case 422:
  //       case 500:
  //         // showAlert('error', response.message);
  //         break;
  //     }
  //   } catch (error) {
  //     // showAlert('error', error);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   Fetchexternalholding()
  // }, [])


  return (
    <div>
      <FintooLoader isLoading={loading} />
      <div className="row">
        <div className="col-md-10">
          <div className={`${ liabilityData && liabilityData.length > 0 ? "inner-box" : ""}`}>
            <div className="shimmercard br hide" id="liability-shimmer">
              <div className="wrapper">
                <div className="comment br animate w80" />
                <div className="comment br animate" />
              </div>
            </div>
          </div>
          {/* ngIf: liabilitydata.length */}
          <div className={`FixdgHeader d-flex align-items-center top-tab-menu justify-content-between`}>
            <div className="d-flex align-items-center">
              {
               liabilityData && liabilityData.length > 0  && (
                  <FintooCheckbox
                    checked={selectedliabilitiesCategories.length === liabilityData.length}
                    onChange={() => {
                      if (selectedliabilitiesCategories.length === liabilityData.length) {
                        setSelectedliabilitiesCategories([]);
                        setDeleteToggleliabilities(false);
                      } else {
                        const allIds = liabilityData.map(Lib => Lib.user_liability_id);
                        setSelectedliabilitiesCategories(allIds);
                        setDeleteToggleliabilities(true);
                      }
                    }}
                  />
                )}
              <div className="">
                {liabilityData && liabilityData.length > 0 && (
                  <div
                    className="total-amt"
                    style={{
                      fontSize: "1.1rem",
                    }}
                  >
                    {" "}
                    Total Liability:{" "}
                    <span>
                      {indianRupeeFormat(Number(calculateTotalLiabilities()))}{" "}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              {
                selectedliabilitiesCategories.length > 0 &&
                liabilityData.length > 0 &&
                deletetoggleliabilities == true && (
                  <span
                    onClick={() => {
                      handleShow();
                      // setInsuranceId(i.id),
                      // setInsuranceName(i.insurance_name),
                      // setinsuranceCategoryType(
                      //   i.insurance_category_name
                      // );
                    }}
                    style={{
                      marginRight: "2rem",
                      cursor: "pointer"
                    }}
                    className="opt-options-2 pointer"
                  >
                    <MdDelete style={{ color: "#042b62", fontSize: "1.6rem" }} />
                  </span>
                )
              }
            </div>
          </div>
          <div className="inner-box" style={{ margin: "11px 0" }}>
            {isDataLoading && (
              <div>
                <div className=" inner-container mt-4 pt-4">
                  <div
                    className="shine w-25 mb-1"
                    style={{ height: ".7rem" }}
                  ></div>
                  <div
                    className="shine w-100"
                    style={{ height: ".7rem" }}
                  ></div>
                </div>
                <div className=" inner-container mt-4 pt-4">
                  <div
                    className="shine w-25 mb-1"
                    style={{ height: ".7rem" }}
                  ></div>
                  <div
                    className="shine w-100"
                    style={{ height: ".7rem" }}
                  ></div>
                </div>
              </div>
            )}
            <div className="" style={{ margin: "0px 0" }}>
              {isDataLoading == false &&
                liabilityData &&
                liabilityData.map((lib, index) => (
                  <div className="d-flex align-items-center" key={index}>
                    <FintooCheckbox
                      id={lib.user_liability_id}
                      checked={selectedliabilitiesCategories.includes(lib.user_liability_id)}
                      title={lib.title}
                      onChange={() => {
                        setSelectedliabilitiesCategories((prevSelected) => {
                          if (prevSelected.includes(lib.user_liability_id)) {
                            const updatedSelection = prevSelected.filter((id) => id !== lib.user_liability_id);
                            setDeleteToggleliabilities(updatedSelection.length > 0); // Check if any checkbox is still selected
                            return updatedSelection;
                          } else {
                            setDeleteToggleliabilities(true);
                            return [...prevSelected, lib.user_liability_id];
                          }
                        });
                      }}
                    />
                    <div key={lib} className="inner-container mt-4 w-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <h4 className="w-100">
                          {
                            //console.log("liability_sub_category_type", lib)
                          }
                          {lib.liability_sub_category_type}{" "}
                          {lib?.user_liability_name && ` - ${lib.user_liability_name}`}
                          {/* {lib?.user_user_liability_name ? " - " + lib.user_user_liability_name : ""} */}
                          {lib.liability_type == "equifax" ?
                            " (Fetched)" : ""
                          }
                        </h4>
                        {lib.incomplete_flag &&
                          <div className="d-flex  w-100" style={{
                            justifyContent: "right"
                          }}>
                            <div className="incompleteMsg" style={{ padding: ".2rem .8rem", color: "red", background: 'rgba(255, 0, 0, 0.10)', borderRadius: 4, fontSize: ".9rem" }}> Incomplete  <span className="info-hover-box ms-2">
                              <span className="icon">
                                <img
                                  width={15}
                                  alt="More information"
                                   src={imagePath + '/static/media/more_information.svg'}
                                />
                              </span>
                              <span style={{ color: "#042b62" }} className="msg">
                                We've fetched this loan details from Equifax. The details received from them are incomplete, we request you to click on edit button and fill the blank fields.
                              </span>
                            </span>
                            </div>
                          </div>
                        }
                      </div>

                      <div className="row mt-2">
                        <div className="col-md-4">
                          <div className="display-style">
                            <span>
                              {/* Value ({frequencylist[lib.liability_frequency]}): */}
                              Value:
                            </span>
                            <p
                              className="invest-show "
                              title={lib.user_liability_emi_amount && `${indianRupeeFormat(lib.user_liability_emi_amount)}`
                              }
                            >
                              {lib.user_liability_emi_amount &&
                                indianRupeeFormat(lib.user_liability_emi_amount)
                              }
                              {/* {indianRupeeFormat(lib.liability_emi)} */}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="display-style"></div>
                          {/* <div className="display-style">
                            <span>Mapped Asset:</span>
                            <p>
                              {lib.related_asset_name
                                ? lib.related_asset_name
                                : "Not added"}
                            </p>
                          </div> */}
                        </div>
                        <div className="col-md-3">
                          <div className="display-style">
                            <span>Member:</span>
                            <p
                              style={{
                                textOverflow: "ellipsis",
                                width: "187px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textAlign: "left",
                              }}
                            >
                              {lib.liability_for_name ? lib.liability_for_name : "Not added"}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <div className="opt-options">
                            <span>
                              <BsPencilFill
                                onClick={() => {
                                  editLiability(lib.user_liability_id);
                                  setUpdateForm(true);
                                  setAddForm(false);
                                }}
                              />
                            </span>

                            {/* <span
                            onClick={() => {
                              handleShow();
                              setLiabilityId(lib.id);
                            }}
                            className="opt-options-2"
                          >
                            <MdDelete />
                          </span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* <div className=" fetchloanbox mt-3">
            <img className="d-none d-md-block" style={{ width: "100%", height: "100%" }}
              onClick={() => {
                setOpenModalByName("Fecth_your_Loan")
              }}
              src={process.env.REACT_APP_STATIC_URL + "media/DG/Fecthloan.png"} />
            <img className="d-md-none d-block" style={{ width: "100%", height: "100%" }}
              onClick={() => {
                setOpenModalByName("Fecth_your_Loan")
              }}
              src={process.env.REACT_APP_STATIC_URL + "media/DG/mobileFetchLoan.png"} />
          </div> */}
          {/* {liabilityData &&
              liabilityData.map((lib) => (
                <div key={lib} className="inner-container mt-4">
                   {
                      isDataLoading == false && (
                        <h4>
                        {lib.categoryname}{" "}
                        {lib.user_liability_name ? " - " + lib.user_liability_name : ""}
                        </h4>
                      )
                   }
                 
                  {
                      isDataLoading == false && (
                        <div className="row">
                          <div className="col-md-4">
                            <div className="display-style">
                              <span>
                                Value ({frequencylist[lib.liability_frequency]}):
                              </span>
                              <p
                                className="invest-show "
                                title={`${indianRupeeFormat(lib.liability_emi)}`}
                              >
                                {indianRupeeFormat(lib.liability_emi)}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="display-style">
                              <span>Mapped Asset:</span>
                              <p>
                                {lib.related_asset_name
                                  ? lib.related_asset_name
                                  : "Not added"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="display-style">
                              <span>Member:</span>
                              <p
                                style={{
                                  textOverflow: "ellipsis",
                                  width: "187px",
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textAlign: "left",
                                }}
                              >
                                {lib.membername ? lib.membername : "Not added"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="opt-options">
                              <span>
                                <BsPencilFill
                                  onClick={() => {
                                    editLiability(lib.id);
                                    setUpdateForm(true);
                                    setAddForm(false);
                                  }}
                                />
                              </span>
      
                              <span
                                onClick={() => {
                                  handleShow();
                                  setLiabilityId(lib.id);
                                }}
                                className="opt-options-2"
                              >
                                <MdDelete />
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                   }
                 
                </div>
              ))} */}


        </div>
        <div className="col-md-12 col-lg-10 mt-4">
          <div className="accordion">
            <div className="accordion-panel active" id="assetbox">
              <div className="accordion-header d-flex justify-content-between">
                <h4 className="accordion-heading">
                  <img
                    alt="Asset"
                    className="accordian-img"
                    src={
                      imagePath +
                      "/static/media/DG/assets-liabilities/liability_top.svg"
                    }
                  />
                  <span
                    style={{
                      fontWeight: "500",
                      paddingTop: "2em",
                    }}
                  >
                    Nature of Liabilities
                  </span>
                </h4>
                <div
                  onClick={() => setShowView(!showview)}
                  className={`${DGstyles.HideSHowicon} hideShowIconCustom`}
                >
                  {showview == true ? <>-</> : <>+</>}
                </div>
              </div>
              {showview && (
                <div className="accordion-content assets">
                  <div className="">
                    {/**/}
                    <style
                      type="text/css"
                      className=""
                      dangerouslySetInnerHTML={{
                        __html:
                          "\n    #cd_upload{width: 100%;\n    flex: 100%;max-width: 100%;}\n    label[for=upload-7]\n    {border: 1px solid rgba(54, 54, 54, 0.15)!important;background: #ccd5e0!important;color: #042b62!important;box-shadow: none!important;text-align: center;}\n    label[for=upload-7] span{position: absolute;left: 0;right: 0;}\n    label[for=upload-7] span img{position: relative;}\n    #eqmf_connect_broker .link{\n        font-size: 14px;\n        padding: 8px 15px;\n        display: block;\n        background: #8bc53f;\n        border: solid 1px #8bc53f;\n        color: #fff;\n        border-radius: 20px;\n        width: fit-content;\n        width: -webkit-fit-content;\n        margin: 30px auto;\n        display: block;\n    }\n    #eqmf_connect_broker .link:hover{\n        background: #fff;\n        color: #8bc53f;\n    }\n",
                      }}
                    />
                    <div className="container-fluid ">
                      <div className="row">
                        <div className="col-md-10">
                          <span>
                            <label className="">
                              Category : ({selectedOption})
                            </label>
                          </span>
                          <ul className="card-list">
                            {liabilityOptions.map((x, i) => (
                              <React.Fragment key={i}>
                                <li
                                  id={x.liability_sub_cat_uuid}
                                  onClick={() => {
                                    setHandleError({
                                      ...defaultHandleError,
                                    });
                                    setSelectedOption(x.title);
                                    scrollToForm();
                                    handleCategoryClick(x, "liability");
                                  }}
                                  className={`li-options ${selectedOption.toLowerCase() ==
                                    x.title.toLowerCase()
                                    ? "active"
                                    : ""
                                    }`}
                                >
                                  <label htmlFor="type-2">
                                    <img alt={x.title} src={x.img} />
                                    {x.title}
                                  </label>
                                </li>
                              </React.Fragment>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {selectedOption != "Fetch Loan" && (
                        <div className="forms-container">
                          <div
                            id="eqmf_manual_form"
                            style={{ display: "block" }}
                          >
                            <div className="">
                              <div className="">
                                <div className="">
                                  <div ref={cntRef} id="formBox">
                                    <form
                                      noValidate="novalidate"
                                      name="goldassetform"
                                      id="goldregisterform"
                                    >
                                      <div className="row d-flex align-items-center">
                                        <div className="col-md-5 custom-input">
                                          <div
                                            className={`form-group  ${liabilitiesData.user_liability_name
                                              ? "inputData"
                                              : null
                                              } `}
                                            style={{ paddingTop: "17px" }}
                                          >
                                            <input
                                              type="text"
                                              id="user_liability_name"
                                              name="user_liability_name"
                                              value={
                                                liabilitiesData.user_liability_name
                                              }
                                              className={`${liabilitiesData.liability_type === "equifax" &&
                                                liabilitiesData.incomplete_flag === false ?
                                                "disabled"
                                                : ""
                                                }`}
                                              maxLength={35}
                                              onChange={(e) => {
                                                setLiabilitiesData({
                                                  ...liabilitiesData,
                                                  user_liability_name:
                                                    e.target.value,
                                                });
                                                handleLiabilityName(
                                                  e.target.value
                                                );
                                              }}
                                              required
                                              autoComplete="off"
                                            />
                                            <span className="highlight"></span>
                                            <span className="bar"></span>
                                            <label htmlFor="name">
                                              Name Of Liablity*
                                            </label>
                                          </div>

                                          <div className="error">
                                            {handlerror.user_liability_name}
                                          </div>
                                        </div>
                                        <div className="col-md-5">
                                          <div className="material">
                                            <Form.Label>
                                              {" "}
                                              Name of Holder*{" "}
                                            </Form.Label>
                                            <Select
                                              classNamePrefix="sortSelect"
                                              isSearchable={false}
                                              styles={customStyles}
                                              options={memberData}
                                              className={`${liabilitiesData.liability_type === "equifax"
                                                // && liabilitiesData.incomplete_flag === false
                                                ?
                                                "disabled"
                                                : ""
                                                }`}
                                              value={memberData.filter(
                                                (v) =>
                                                  v.value ==
                                                  liabilitiesData.user_liability_for
                                              )}
                                              onChange={(e) => {
                                                setLiabilitiesData({
                                                  ...liabilitiesData,
                                                  user_liability_for: e.value,
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row d-flex align-items-center">
                                        <div className="col-md-5 custom-input">
                                          <div
                                            className={`form-group ${liabilitiesData.user_liability_outstanding_amount
                                              ? "inputData"
                                              : null
                                              }`}
                                            style={{ paddingTop: "19px" }}
                                          >
                                            <input
                                              type="number"
                                              id="user_liability_outstanding_amount"
                                              name="user_liability_outstanding_amount"
                                              min="1"
                                              className={`${liabilitiesData.liability_type === "equifax" &&
                                                liabilitiesData.incomplete_flag === false ?
                                                "disabled"
                                                : ""
                                                }`}
                                              maxLength="10"
                                              onInput={maxLengthCheck}
                                              value={
                                                liabilitiesData.user_liability_outstanding_amount
                                              }
                                              onChange={(e) => {
                                                const inputValue =
                                                  e.target.value;
                                                if (inputValue.length <= 11) {
                                                  setLiabilitiesData({
                                                    ...liabilitiesData,
                                                    user_liability_outstanding_amount:
                                                      inputValue,
                                                  });
                                                  handleLiabilityOutstandingValue(
                                                    inputValue
                                                  );
                                                }
                                              }}
                                              required
                                              autoComplete="off"
                                            />
                                            <span className="highlight"></span>
                                            <span className="bar"></span>
                                            <label htmlFor="name">
                                              Current Outstanding Amount*
                                            </label>
                                          </div>
                                          <div className=" error">
                                            {
                                              handlerror.user_liability_outstanding_amount
                                            }
                                          </div>
                                        </div>
                                        <div className="col-md-5 ">
                                          <div
                                            className="dark-label"
                                            style={{
                                              paddingTop: "6px",
                                            }}
                                          >
                                            <Form.Label>End Date*</Form.Label>
                                            <div
                                              className={`dt-conbx ${liabilitiesData.user_liability_outstanding_amount
                                                ? "inputData"
                                                : null
                                                } ${(liabilitiesData.liability_type === "equifax" &&
                                                  liabilitiesData.incomplete_flag === false) ?
                                                  "disabled"
                                                  : ""
                                                }  `}
                                              style={{
                                                borderBottom:
                                                  "1px solid #dadada",
                                              }}
                                            >
                                              <ReactDatePicker
                                                select_date={moment(
                                                  liabilitiesData.user_liability_end_date,
                                                  "DD/MM/YYYY"
                                                ).toDate()}
                                                setDate={(date) => {
                                                  setLiabilitiesData({
                                                    ...liabilitiesData,
                                                    user_liability_end_date:
                                                      moment(date).format(
                                                        "DD/MM/YYYY"
                                                      ),
                                                  });
                                                  handleEndDate();
                                                }}
                                                minDate={moment()
                                                  .add(1, "months")
                                                  .add(1, "days")
                                                  .toDate()}
                                                maxDate={""}
                                                className={`pt-4 ${(liabilitiesData.liability_type === "equifax" &&
                                                  liabilitiesData.incomplete_flag === false) ?
                                                  "disabled"
                                                  : ""
                                                  }`}
                                              />
                                            </div>
                                            <div
                                              style={{
                                                color: "red",
                                                position: "absolute",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {handlerror.user_liability_end_date}
                                            </div>
                                          </div>
                                          {/* <div >
                                           
                                          </div> */}
                                        </div>
                                      </div>
                                      <div className="row mt-4">
                                        <div className="col-md-5 mt-3">
                                          <div className="material ">
                                            <div className="d-flex justify-content-end">
                                              <Form.Label>
                                                EMI Interest Rate (%)* :{" "}
                                                {
                                                  liabilitiesData.user_liability_emi_rate
                                                }
                                              </Form.Label>
                                            </div>
                                            <div
                                              className={`${liabilitiesData.user_liability_emi_rate <
                                                2 && "sl-hide-left"
                                                } ${liabilitiesData.user_liability_emi_rate >
                                                18 && "sl-hide-right"
                                                } ${liabilitiesData.liability_type === "equifax" &&
                                                  liabilitiesData.incomplete_flag === false ?
                                                  "disabled"
                                                  : ""
                                                }`}
                                            >
                                              <Slider
                                                min={0}
                                                max={20}
                                                value={Number(
                                                  liabilitiesData.user_liability_emi_rate
                                                )}
                                                step={`${liabilitiesData.liability_type === "equifax" && liabilitiesData.incomplete_flag == false
                                                  ? 0.01 : 0.05}`}
                                                onChange={(v) => {
                                                  setLiabilitiesData({
                                                    ...liabilitiesData,
                                                    user_liability_emi_rate:
                                                      Math.round(
                                                        (parseFloat(v) +
                                                          Number.EPSILON) *
                                                        100
                                                      ) / 100,
                                                  });
                                                }}
                                                handleStyle={{
                                                  borderColor: "#042b62",
                                                  backgroundColor: "#042b62",
                                                }}
                                                railStyle={{
                                                  backgroundColor: "#ade9c0",
                                                }}
                                                trackStyle={{
                                                  backgroundColor: "#ade9c0",
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        <div className="col-md-5 custom-input">
                                          <div
                                            className={`form-group  ${liabilitiesData.user_liability_emi_amount
                                              ? "inputData"
                                              : null
                                              }`}
                                          >
                                            <span>
                                              <input
                                                type="text"
                                                id="user_liability_emi_amount"
                                                name="user_liability_emi_amount"
                                                className={`${liabilitiesData.liability_type === "equifax" &&
                                                  liabilitiesData.incomplete_flag === false ?
                                                  "disabled"
                                                  : ""
                                                  }`}
                                                value={
                                                  liabilitiesData.user_liability_emi_amount ?? ""
                                                }
                                                onChange={(e) => {
                                                  setLiabilitiesData({
                                                    ...liabilitiesData,
                                                    user_liability_emi_amount: e.target.value.slice(0, 9),
                                                  });
                                                  handleCurrentEMI(
                                                    e.target.value
                                                  );
                                                }}
                                                required
                                                autoComplete="off"
                                              />
                                              <span className="highlight"></span>
                                              <span className="bar"></span>
                                              <label htmlFor="name">
                                                Current EMI*
                                              </label>
                                            </span>
                                            <span className="info-hover-box">
                                              <span className="icon">
                                                <img
                                                  alt="More information"
                                                   src={imagePath + '/static/media/more_information.svg'}
                                                />
                                              </span>
                                              <span className="msg">
                                                Current EMI is Auto Calculated
                                                as per outstanding balance & EMI
                                                End Date. If you think EMI Auto
                                                Calculation is different, you
                                                can Edit & add your Current EMI.
                                              </span>
                                            </span>
                                          </div>
                                          <div className="error">
                                            {handlerror.user_liability_emi_amount}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-12 custom-input">
                                          <div
                                            className={`form-group mt-2 ${liabilitiesData.user_liability_remarks
                                              ? "inputData"
                                              : null
                                              } `}
                                          >
                                            <input
                                              type="text"
                                              id="Remarks_lib"
                                              name="Remarks"
                                              value={
                                                liabilitiesData.user_liability_remarks
                                              }
                                              onChange={(e) =>
                                                setLiabilitiesData({
                                                  ...liabilitiesData,
                                                  user_liability_remarks:
                                                    e.target.value,
                                                })
                                              }
                                              autoComplete="off"
                                            />
                                            <span className="highlight"></span>
                                            <span className="bar"></span>
                                            <label htmlFor="name">Remarks</label>
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div></div>

                          <div className="row py-2">
                            <div className=" text-center">
                              <div>
                                <div className="btn-container">
                                  <div className="d-flex justify-content-center">
                                    <div
                                      className="previous-btn form-arrow d-flex align-items-center"
                                      onClick={() => {
                                        ScrollToTop();
                                        props.setTab("tab1")
                                      }
                                      }
                                    >
                                      <FaArrowLeft />
                                      <span className="hover-text">
                                        &nbsp;Previous
                                      </span>
                                    </div>

                                    {addForm && (
                                      <button
                                        onClick={(e) => handleSubmit(e)}
                                        className="default-btn gradient-btn save-btn"
                                      >
                                        Save & Add More
                                      </button>
                                    )}
                                    {updateForm && (
                                      <div>
                                        <button
                                          onClick={(e) => cancelFormData(e)}
                                          className="default-btn gradient-btn save-btn"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={(e) => updateFormData(e)}
                                          className="default-btn gradient-btn save-btn"
                                        >
                                          Update
                                        </button>
                                      </div>
                                    )}
                                    <Link
                                      to={
                                        process.env.PUBLIC_URL +
                                        "/datagathering/insurance"
                                      }
                                    >
                                      <div className="next-btn form-arrow d-flex align-items-center">
                                        <span
                                          className="hover-text"
                                          style={{ maxWidth: 100 }}
                                        >
                                          Continue&nbsp;
                                        </span>
                                        <FaArrowRight />
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedOption == "Fetch Loan" && (
                        <div className="forms-container">
                          <div
                            id="eqmf_manual_form"
                            style={{ display: "block" }}
                          >
                            <div className="">
                              <div className="">
                                <div className="">
                                  <div ref={cntRef} id="formBox">
                                    <div className="d-flex justify-content-center">
                                      <button onClick={() => {
                                        setOpenModalByName("Fecth_your_Loan")
                                      }} className={Cibilreport.buttonStyle12}>Fetch New Loan</button>
                                    </div>
                                    <div className="mt-md-4">
                                      <div className="table-responsive rTabl">
                                        <table className="bgStyleTable">
                                          <tbody>
                                            <tr>
                                              <th style={{ textAlign: "center" }}>Name of Liability</th>
                                              <th style={{ textAlign: "center" }}>Fetched From</th>
                                              <th style={{ textAlign: "center" }}>Connected on</th>
                                              <th style={{ textAlign: "center" }}>Updated on</th>
                                              <th style={{ textAlign: "center" }}>Action</th>
                                            </tr>

                                            {holdingDetails.length > 0 ? (

                                              holdingDetails.map((member, i) => (
                                                <tr key={i}>
                                                  <td
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    {member.user_name}

                                                    {
                                                      //console.log("holdingDetails", holdingDetails)
                                                    }
                                                  </td>
                                                  <td>
                                                    Equifax
                                                  </td>
                                                  <td>
                                                    {member.holding_daterange_to}
                                                  </td>
                                                  <td>
                                                    {member.holding_daterange_from}
                                                  </td>
                                                  <td>
                                                    <div className="ButtonBx d-flex justify-content-center">
                                                      <button
                                                        className="Cancel mt-3"
                                                        onClick={() => {
                                                          handleUnlink(member.holding_id, member.user_name,member.user_id)
                                                        }}
                                                      >
                                                        Unlink
                                                      </button>

                                                      {/* {member.canRefresh == true ? */}
                                                        <button
                                                          className="Cancel ms-md-0 mt-3 ms-2"
                                                          style={{ backgroundColor: "none" }}
                                                          onClick={() => {
                                                            handleRefreshLoans(member.holding_id, member.user_id, member.user_name, member);
                                                          }}
                                                        >
                                                          Refresh
                                                        </button>
                                                        {/* : */}
                                                        <>
                                                          {/* <button
                                                            // style={{ backgroundColor: "none" }}
                                                            // data-tip
                                                            // data-for={`loan-${member.id}`}
                                                            // data-disabled="false"
                                                            className="Cancel RefreshDisable ms-md-0 mt-3 ms-2"
                                                            style={{
                                                              userSelect: "none",
                                                              opacity: .5,
                                                              backgroundColor: "none"
                                                            }}
                                                            onClick={() => { handleDisableRefresh(); }}
                                                          >
                                                            Refresh
                                                          </button> */}

                                                          {/* <ReactTooltip className="Refresh-tooltip" id={`loan-${member.id}`} place="bottom" type="light">
                                                            <div>On {member.refreshDate}, you can update your loan details.</div>
                                                          </ReactTooltip> */}
                                                        </>

                                                      {/* // } */}


                                                    </div>
                                                  </td>
                                                </tr>

                                              )))
                                              :
                                              <>
                                                <tr>
                                                  <td
                                                    colSpan="5"
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    No Details Found
                                                  </td>
                                                </tr>
                                              </>
                                            }

                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div></div>

                          <div className="row mt-md-4">
                            <div className=" text-center">
                              <div>
                                <div className="btn-container">
                                  <div className="d-flex justify-content-center">
                                    <div
                                      className="previous-btn form-arrow d-flex align-items-center"
                                      onClick={() => {
                                        ScrollToTop()
                                        props.setTab("tab1")
                                      }
                                      }
                                    >
                                      <FaArrowLeft />
                                      <span className="hover-text">
                                        &nbsp;Previous
                                      </span>
                                    </div>
                                    <Link
                                      to={
                                        process.env.PUBLIC_URL +
                                        "/datagathering/insurance"
                                      }
                                    >
                                      <div className="next-btn form-arrow d-flex align-items-center">
                                        <span
                                          className="hover-text"
                                          style={{ maxWidth: 100 }}
                                        >
                                          Continue&nbsp;
                                        </span>
                                        <FaArrowRight />
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <FetchLoanSuccess open={isOpen} setIsOpen={setIsOpen} modalData={modalData} /> */}

      <Modal className="popupmodal" centered show={show} onHide={handleClose}>
        <Modal.Header className="ModalHead">
          <div className="text-center">Delete Confirmation</div>
        </Modal.Header>
        <div className=" p-5 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              This will permanently erase the record and its associated
              information.
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button
            onClick={() => {
              handleClose("yes", "liability");
            }}
            className="outline-btn m-2"
          >
            Yes
          </button>

          <button
            onClick={() => {
              handleClose("no");
            }}
            className="outline-btn m-2"
          >
            No
          </button>
        </div>
      </Modal>

      {/*  */}
      {/* <Modal
        dialogClassName="Nsdlcsdl-modal-width"
        show={openModalByName == "Fecth_your_Loan"}
        centered
        animationDuration={0}
      >
        <Fetchloan
          Closemodal={CloseLoanModal} session={session}
          allMembers={allMembers}
          getEquifaxData={getEquifaxData}
          getLiabilityList={getLiabilityList}
          // handleFetchSuccess={handleFetchSuccess}
          is_plan={isPlan}
        />
      </Modal> */}

    </div >
  );
};

export default Liabilities;
