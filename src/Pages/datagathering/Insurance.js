import React, { useEffect, useState, useRef } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import QuizeRadio from "../../components/HTML/QuizRadio";
import { GrEdit } from "react-icons/gr";
import { Row, Modal } from "react-bootstrap";
import { BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import Switch from "react-switch";
import Slider from "../../components/HTML/Slider";
import DatagatherLayout from "../../components/Layout/Datagather";
import FintooRadio2 from "../../components/FintooRadio2";
import ReactDatePicker from "../../components/HTML/ReactDatePicker/ReactDatePicker";
import Select from "react-select";
import {
  imagePath,
  DATA_BELONGS_TO,
} from "../../constants";
import { Link, useLocation } from "react-router-dom";
import DGstyles from "./DG.module.css";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  loginRedirectGuest,
  setBackgroundDivImage,
  rsFilter,
  getprofilestatus,
  getParentFpLogId,
  getFpLogId,
  setFplogid,
} from "../../common_utilities";
import {
  ADVISORY_ADD_UPDATE_INSURANCE_DATA,
  ADVISORY_GETGOALSDATA_API_URL,
  // ADVISORY_GET_INSURANCE_API_URL,
  ADVISORY_GET_INSURANCE_TYPE,
  ADVISORY_GET_MEDICLAIM,
  ADVISORY_ADD_MEDICLAIM,
  ADVISORY_GET_ULIP_DATA,
  ADVISORY_REMOVE_INSURANCE_DATA,
  BASE_API_URL,
  CHECK_SESSION,
  // STATIC_URL,
} from "../../constants";
import commonEncode from "../../commonEncode";
import { toast } from "react-toastify";
import GoalsDropdown from "../../components/GoalsDropdown/GoalDropdown";
import { useDispatch } from "react-redux";
import QuizRadio2 from "../../components/HTML/QuizRadio/index2";
import FintooLoader from "../../components/FintooLoader";
import customStyles from "../../components/CustomStyles";
import MembersDropdown from "../../components/GoalsDropdown/MembersDropdown";
import { ScrollToTop } from './ScrollToTop';
import FintooCheckbox from "../../components/FintooCheckbox/FintooSubCheckbox";
import { addInsuranceDetails, addUpdateUserMediclaimAnswers, deleteInsuranceDetails, getInsuranceCategoryList, getInsuranceDetails, getInsuranceType, getInsuranceUlipList, getKnowyourmediclaimQuestion, getKnowyourmediclaimQuestionAnswers, UpdateInsuranceDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/insurance";
import { getFamilyMember, getMedicalInsurance, updateUserRiskAnswers } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getGoalDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/goal";
import { CheckProfileStatus } from "../../FrappeIntegration-Services/services/master-api/masterApiService";
// import ClearFix from "material-ui/internal/ClearFix";
// import Slider from "../../components/HTML/Slider";
const Insurance = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("tab1");
  const [selectedOption, setSelectedOption] = useState("Endowment");
  const [sessiondata, setSessionData] = useState([]);
  const [editflag, setEditFlag] = useState(false);
  const [insuranceId, setInsuranceId] = useState(0);
  const [insuranceName, setInsuranceName] = useState("");
  const [insuranceCategoryType, setinsuranceCategoryType] = useState("");
  const [insuranceList, setInsuranceList] = useState([]);
  const [insurancetype, setInsuranceType] = useState([]);
  const [goaldata, setGoalData] = useState([]);
  const [unchangedgoaldata, setUnchangedGoalData] = useState([]);
  const [ulipFund, setUlipFund] = useState([]);
  const [insurnaceTotal, setInsuranceTotal] = useState(0);
  const [memberdata, setMemberData] = useState([]);
  const [showview, setShowView] = useState(true);
  const [inputFields, setInputFields] = useState([{}]);
  const [inputFieldsBonus, setInputFieldsBonus] = useState([{}]);
  const [bonus, setBonus] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [checkMediclaim, setCheckMediclaim] = useState(0);
  const [quizData, setQuizData] = useState(0);
  const [oneTimeFlag, setOneTimeFlag] = useState(0);
  const [isGoalSelected, setGoalSelected] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState("Automated Linkage");
  const [selectedGoalsId, setSelectedGoalsId] = useState(false);
  const [selectedPriorityArray, setSelectedPriorityArray] = useState([]);
  const [isAutoMatedGoal, setAutoMatedGoal] = useState(true);
  const [policyYears, setPolicyYears] = useState("");
  const [errorFlag, setErrorFlag] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  // changes for mediclaim
  const [openMemberDropdown, setOpenMemberDropdown] = useState(false);
  const [familyData, setFamilyData] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [familyMultiData, setFamilyMutliData] = useState([]);
  const [deletetoggleinsurance, setDeleteToggleinsurance] = useState(false);
  const [selectedinsuranceCategories, setSelectedinsuranceCategories] = useState([]);
  const handleChange = (nextChecked) => {
    setBonus(nextChecked);
  };
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState("");
  const removefixheader = useRef(null);
  const [scroll, setScroll] = useState(false);
  const [insuOptions, setInsuOptions] = useState([]);
  const [linkageDetails, setLinkageDetails] = useState([]);
  useEffect(() => {
    const handleScroll = () => {
      const removefixheader = document.querySelector('.d-block .removefixheader');
      const FixdgsubHeader = document.querySelector('.FixdgHeader');
      const FixdgmainHeader = document.querySelector('.DGheaderFix');
      const scrollPosition = window.scrollY;

      if (removefixheader && FixdgsubHeader && FixdgmainHeader) {
        const removefixheaderRect = removefixheader.getBoundingClientRect(); { }
        const threshold = 70;
        if (scrollPosition > 50) {
          setScroll(true)
          FixdgsubHeader.classList.add("DGsubheaderFix");
          if (removefixheaderRect.top <= threshold) {
            FixdgmainHeader.classList.remove("DGmainHeaderFix");
          }
          else {
            FixdgmainHeader.classList.add("DGmainHeaderFix");
          }
        } else {
          setScroll(false);
          FixdgsubHeader.classList.remove("DGsubheaderFix");
          FixdgmainHeader.classList.remove("DGmainHeaderFix");
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);

    };
  }, []);
  useEffect(() => {
    document.body.classList.add("dg-layout");

    const interval = setInterval(() => {
      const bgInsurance = document.getElementById("bg-insurance");
      if (bgInsurance) {
        bgInsurance.style.background = `url(${imagePath}/static/media/DG/bg/insurance.svg) no-repeat right top`;
        clearInterval(interval);
        setBackgroundDivImage();
      }
    }, 50);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("dg-layout");
    };
  }, []);
  ;

  useEffect(() => {
    setTimeout(() => {
      setCurrentUrl(location.pathname);
    }, 100);
  }, [location]);
  const [, forceUpdate] = useState();
  const addInputField = () => {
    const updatedData = {
      ...inputFields,
      insurance_frequency: "1",
    };

    if (inputFields.length == 4) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("You can only add up to five recurring benefits. ");
    }
    if (inputFields.length == 5) return;
    const updatedDataList = inputFields.map((item) => ({
      ...item,
      // insurance_frequency: "1",
    }));

    const checkData = () => {
      const missingDataIndex = updatedDataList.findIndex(
        (data) =>
          !data.start_date ||
          !data.end_date ||
          !data.amount ||
          !data.frequency
      );

      if (missingDataIndex !== -1) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Please fill all the data");
      } else {
        // Check insurance_recurring_amount
        const invalidRecurringAmountIndex = updatedDataList.findIndex(
          // (data) => data.insurance_recurring_amount < 1
          (data) =>
            data.amount < 1 ||
            // data.amount >= 10000000 ||
            String(data.amount).startsWith("0")
        );

        if (invalidRecurringAmountIndex !== -1) {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Amount must be a number between 1 and 9,999,999 and must not start with a 0");
        } else {
          if (inputFields.length >= 5) return;
          setInputFields([...inputFields, {}]);
        }
      }
    };
    checkData();
  };

  const addInputBonusField = () => {
    if (inputFieldsBonus.length == 4) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("You can only add up to five bonus benefits.");
    }
    if (inputFieldsBonus.length == 5) return;
    const checkData = () => {
      const missingDataIndex = inputFieldsBonus.findIndex(
        (data) => !data.bonus_date || !data.bonus_amount
      );
      if (missingDataIndex !== -1) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Please fill all the data");
      } else {
        // Check bonus_amount
        const invalidBonusAmountIndex = inputFieldsBonus.findIndex(
          // (data) => data.bonus_amount < 1
          (data) =>
            data.bonus_amount < 1 ||
            // data.amount >= 10000000 ||
            String(data.bonus_amount).startsWith("0")
        );
        if (invalidBonusAmountIndex !== -1) {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error("Amount must be a number between 1 and 9,999,999 and must not start with a 0");
        } else {
          if (inputFieldsBonus.length >= 5) return;
          setInputFieldsBonus([...inputFieldsBonus, {}]);
        }
      }
    };
    checkData();
  };

  const removeInputFields = (index) => {
    const rows = [...inputFields];
    rows.splice(index, 1);
    setInputFields(rows);
  };

  const removeinputFieldsBonus = (index) => {
    const rows = [...inputFieldsBonus];
    rows.splice(index, 1);
    setInputFieldsBonus(rows);
  };
  const defaultInsuranceData = {
    insurance_for_member: "",
    insurance_cat_uuid: "endowment",
    user_insurance_premium_freq: "1",
    insurance_frequency: "1",
    user_insurance_user_id: "",
    user_insurance_goal_linkage_ids: "",
    user_insurance_inflation_rate: 7,
    user_insurance_name: "Endowment",
    insurance_category_name: "Endowment",
    user_insurance_ulip_sec_id: "",
    user_insurance_premium_amount: "",
    bonus_amount: "",
    user_insurance_sum_assured: "",
    user_insurance_maturity_amount: "",
    user_insurance_current_fund_value: "",
    user_insurance_surrender_value: "",
    insurance_policy_enddate: "",
    user_insurance_end_date: "",
    user_insurance_start_date: "",
    bonus_date: "",
    amount: "",
    user_insurance_policy_term: "",
    user_insurance_remarks: "",
    user_insurance_topup: "",
    user_insurance_occurance: "One Time",
    user_insurance_automated_linkage: "1",
    insurance_hasPredisease: false,
    disease_name: "",
    insurance_bonus: false,
    ulip_data: {},
    insurance_id: 0,
    id: 0,
    insurance_total_members: 0,
    user_insurance_policy_number: 0,
    insurance_type_id: "",
    user_insurance_start_date: moment().format("DD/MM/YYYY"),
    user_insurance_start_date: moment().format("DD/MM/YYYY"),
    members: [],
  };
  const [insuranceData, setInsuranceData] = useState(defaultInsuranceData);
  const defaultHandleError = {
    insuranceName: "",
    insurancePremiunAmount: "",
    insuranceSumAssured: "",
    insurancePremiumPaymentEndDate: "",
    insurancePolicyTerm: "",
    insuranceDiseaseName: "",
    insuranceTotalMember: "",
    insuranceType: "",
    insuranceSelectMembers: "",
    insurancePolicyNumber: ""
  };
  const [handleError, setHandleError] = useState(defaultHandleError);
  const cntRef = useRef(null);
  const scrollToinsuranceRef = () => {
    cntRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const userid = getParentUserId();
  const fpLogId = getParentFpLogId();
  const checkprofile = async () => {
    try {
      // let api_data = {
      //   user_id: getPa,
      //   fp_log_id: fpLogId,
      //   web: 1,
      // };
      // var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
      var res = await CheckProfileStatus(getParentUserId());
      if (res["status_code"] == "200") {
        dispatch({ type: "UPDATE_PROFILE", payload: res["data"] });
        const profile_completed_mapping = {
          17: 117.496,
          50: 70.4973,
          67: 46.9982,
          83: 23.4991,
          100: 0,
        };

        const profile_completed =
          res["data"][13]["profile_completed"] === 66
            ? 67
            : res["data"][13]["profile_completed"];
        const sectionIdsToCheck = [1, 3, 5, 6, 7, 8];
        const allConditionsMet = sectionIdsToCheck.every((sectionId) => {
          const matchingEntry = res["data"].find(
            (entry) => entry.section_id === sectionId
          );
          return matchingEntry && matchingEntry.total > 0;
        });

        const sectionIdsToCheckk = [1, 3];
        const allConditionsMett = sectionIdsToCheckk.every((sectionId) => {
          const matchingEntryy = res["data"].find(
            (entry) => entry.section_id === sectionId
          );
          return matchingEntryy && matchingEntryy.total > 0;
        });

        let newNumber;
        if (allConditionsMet) {
          newNumber = "1";
        } else {
          newNumber = "0";
        }

        let newNumberr;
        if (allConditionsMett) {
          newNumberr = "1";
        } else {
          newNumberr = "0";
        }
        const sectionTextMap = {
          1: "About You",
          3: "About You",
          5: "Goals",
          6: "Income & Expenses",
          7: "Income & Expenses",
          8: "Assets & Liabilities",
        };

        const filteredData = res["data"].filter((item) =>
          [1, 3, 5, 6, 7, 8].includes(item.section_id)
        );

        const sectionsWithTotalZeroTextArray = filteredData
          .filter((item) => item.total === 0)
          .map((item) => sectionTextMap[item.section_id]);

        const uniqueSectionsWithTotalZeroTextArray = [
          ...new Set(sectionsWithTotalZeroTextArray),
        ];
        const sectionsWithTotalZeroText =
          uniqueSectionsWithTotalZeroTextArray.join(", ");

        if (
          uniqueSectionsWithTotalZeroTextArray.includes("About You") &&
          uniqueSectionsWithTotalZeroTextArray.includes("Income & Expenses") &&
          uniqueSectionsWithTotalZeroTextArray.includes("Assets & Liabilities")
        ) {
          sessionStorage.setItem("showAboutYouToast", "1");
          window.location.href =
            process.env.PUBLIC_URL + "/datagathering/about-you";
        } else if (uniqueSectionsWithTotalZeroTextArray.includes("About You")) {
          sessionStorage.setItem("showAboutYouToast", "1");
          window.location.href =
            process.env.PUBLIC_URL + "/datagathering/about-you";
        }
      }
    } catch (e) {
      console.error("error", e);
    }
  };
  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    } else {
    }
  }, []);

  useEffect(() => {
    if (inputFields.length == 0) {
      setInsuranceData({
        ...insuranceData,
        user_insurance_occurance: "One Time",
      });
    }
  }, [inputFields]);

  useEffect(() => {
    if (inputFields.length == 0) {
      setInputFields([{}]);
    }
  }, [insuranceData?.user_insurance_occurance]);

  useEffect(() => {
    if (inputFieldsBonus.length == 0) {
      setInsuranceData({
        ...insuranceData,
        insurance_bonus: false,
      });
    }
  }, [inputFieldsBonus]);

  useEffect(() => {
    if (inputFieldsBonus.length == 0) {
      setInputFieldsBonus([{}]);
    }
  }, [insuranceData?.insurance_bonus]);

  // useEffect(() => {
  //   setInputFields((v) => {
  //     return v.map((x, i) => {
  //       if (i == 0)
  //         x.insurance_min_date = insuranceData.user_insurance_start_date;
  //       return x;
  //     });
  //   });
  // }, [insuranceData?.user_insurance_start_date]);

  // useEffect(() => {
  //   setInputFieldsBonus((v) => {
  //     return v.map((x, i) => {
  //       if (i == 0)
  //         x.insurance_min_date = insuranceData.user_insurance_start_date;
  //       return x;
  //     });
  //   });
  // }, [insuranceData?.user_insurance_start_date]);
  const imageMap = {
    "Endowment": "endownment.svg",
    "General": "general.svg",
    "Guaranteed Income Plan": "assured_income_plan.svg",
    "Mediclaim": "medical.svg",
    "Pension Plan": "personal_plan.svg",
    "Term Plan": "term_plan.svg",
    "ULIP": "ULIPs.svg",
    "Others": "other.svg"
  }

  const insuranceCategory = async () => {
    try {
      setIsDataLoading(true);

      let insurance_data = await getInsuranceCategoryList();


      if (insurance_data["status_code"] == "200") {
        setIsDataLoading(false);
        const apiData = insurance_data["data"]
        const transformed = apiData.map((item) => ({
          title: item.insurance_name,
          insurance_category_name: item.insurance_name,
          value: item.insurance_id,
          insurance_cat_uuid: item.insurance_cat_uuid,
          image: `${imagePath}/static/media/DG/insurance/insurance_${imageMap[item.insurance_name]}`
        }));

        setInsuOptions(transformed);
      }
    } catch { }
  };

  // const options = [
  //   {
  //     title: "Endowment",
  //     insurance_category_name: "Endowment",
  //     value: "INSC-1",
  //     image:
  //       imagePath +
  //       "/static/assets/img/insurance/insurance_endownment.svg",
  //   },
  //   {
  //     title: "General",
  //     insurance_category_name: "INSC-54",
  //     value: "general",
  //     image:
  //       imagePath +
  //       "/static/assets/img/insurance/insurance_general.svg",
  //   },
  //   {
  //     title: "Guaranteed Income Plan",
  //     insurance_category_name: "Guaranteed Income Plan",
  //     value: "INSC-3",
  //     image:
  //       imagePath +
  //       "/static/assets/img/insurance/insurance_assured_income_plan.svg",
  //   },
  //   {
  //     title: "Mediclaim",
  //     insurance_category_name: "Mediclaim",
  //     value: "INSC-27",
  //     image:
  //       imagePath +
  //       "/static/assets/img/insurance/insurance_medical.svg",
  //   },
  //   {
  //     title: "Pension Plan",
  //     insurance_category_name: "Pension Plan",
  //     value: "INSC-20",
  //     image:
  //       imagePath +
  //       "/static/assets/img/insurance/insurance_personal_plan.svg",
  //   },
  //   {
  //     title: "Term Plan",
  //     insurance_category_name: "Term Plan",
  //     value: "INSC-50",
  //     image:
  //       imagePath +
  //       "/static/assets/img/insurance/insurance_term_plan.svg",
  //   },
  //   {
  //     title: "ULIP",
  //     insurance_category_name: "ULIP",
  //     value: "INSC-51",
  //     image:
  //       imagePath +
  //       "/static/assets/img/insurance/insurance_ULIPs.svg",
  //   },
  //   {
  //     title: "Others",
  //     insurance_category_name: "Others",
  //     value: "INSC-14",
  //     image:
  //       imagePath +
  //       "/static/assets/img/insurance/insurance_other.svg",
  //   },
  // ];

  useEffect(() => {
    if (insuranceData.user_insurance_occurance === "One Time") {
      setInputFields([]);
    }
  }, [insuranceData.user_insurance_occurance]);

  useEffect(() => {
    if (insuranceData.insurance_bonus === false) {
      setInputFieldsBonus([]);
    }
  }, [insuranceData.insurance_bonus]);

  const scrollToInsuranceForm = () => {
    const { offsetTop } = cntRef.current;

    window.scroll({ top: offsetTop - 50 });
  };
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    document.body.classList.add("dg-layout");
    return () => {
      document.body.classList.remove("rp-layout");
    };
  }, []);

  const sortOptionsPayment = [
    { value: "1", label: "Monthly" },
    { value: "2", label: "Quarterly" },
    { value: "3", label: "Half Yearly" },
    { value: "4", label: "Yearly" },
  ];
  const sortOptionsPaymentt = [
    { value: "1", label: "Monthly" },
    { value: "2", label: "Quarterly" },
    { value: "3", label: "Half Yearly" },
    { value: "4", label: "Yearly" },
    { value: "One Time", label: "One Time" },
  ];
  const sortOptionsFrequency = [
    { value: "1", label: "Monthly" },
    { value: "2", label: "Quarterly" },
    { value: "3", label: "Half Yearly" },
    { value: "4", label: "Yearly" },
    { value: "5", label: "Once In 2 Years" },
    { value: "6", label: "Once In 3 Years" },
    { value: "7", label: " Once In 4 Years" },
    { value: "8", label: "  Once In 5 Years" },
    // { value: "9", label: "  Once In 5 Years" },
    // { value: "3", label: "Half Yearly" },
  ];

  useEffect(() => {
    // setIsLoading(true)
    // getSessionData();
    insuranceCategory();
    checkprofile();
    getMediclaimQuestions();
    getInsuranceList(0);
    getmediclaimans()
    getinsuranceType();
    // getmediclaimans();
    getUlipFund();
    getGoalsList();
  }, []);

  // useEffect(() => {
  //   if (insuranceData['user_insurance_premium_freq'] == '5') {
  //     setOneTimeFlag(true);
  //   } else {
  //     setOneTimeFlag(false);
  //   }
  // }, [insuranceData['user_insurance_premium_freq']]);

  // const getSessionData = async () => {
  //   try {
  //     try {
  //       let fp_log_id = await getFpLogId();
  //       setFplogid(fp_log_id);
  //     } catch {
  //       setFplogid("");
  //     }
  //     let url = '';
  // let url = CHECK_SESSION;
  //     let data = { user_id: userid, sky: getItemLocal("sky") };
  //     let session_data = await apiCall(url, data, true, false);
  //     if (session_data["error_code"] == "100") {
  //       // setIsLoading(false)

  //       setSessionData(session_data["data"]);
  //       checkprofile(session_data);
  //       // getmediclaimans(session_data);
  //       setInsuranceData({
  //         ...insuranceData,
  //         user_id: userid,
  //         fp_log_id: fpLogId,
  //       });
  //       getInsuranceList(fpLogId, 0);
  //       getGoalsList(fpLogId);
  //       getmediclaimans(fpLogId);
  //     } else {
  //       // setIsLoading(false)

  //       setSessionData({});
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  const getInsuranceList = async (check_first_save = 1) => {
    try {
      setIsDataLoading(true);

      // let url =
      //   BASE_API_URL +
      //   "restapi/getuserinsurance/?user_id=" +
      //   userid +
      //   "&fp_log_id=" +
      //   fpLogId +
      //   "&web=1";
      let insurance_data = await getInsuranceDetails(userid, "");
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      setIsDataLoading(false);

      if (insurance_data["status_code"] == "200") {
        setInsuranceList(insurance_data["data"]);
        var insuranceLength = insurance_data["data"].length;
        var total = 0;
        var insurance_total = insurance_data["data"];
        insurance_total.map((v) => {
          total += v.user_insurance_sum_assured;
        });
        setInsuranceTotal(total);
        if (check_first_save == 1 && insuranceLength == 1) {
          localStorage.setItem("insuranceCookie", 1);
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        } else {
          localStorage.removeItem("insuranceCookie");
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        }
      } else {
        dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        setInsuranceList([]);
        setInsuranceTotal(0);
      }
    } catch { }
  };

  const getinsuranceType = async () => {
    try {
      // let url = ADVISORY_GET_INSURANCE_TYPE
      let user_insurance_type = await getInsuranceType();
      if (user_insurance_type["status_code"] == "200") {
        var insurance_array = [];
        var insurance = user_insurance_type["data"];
        insurance.map((ins) => {
          insurance_array.push({ value: ins.name, label: ins.insurance_mst_name });
        });
        setInsuranceType(insurance_array);
      } else {
        setInsuranceType([]);
      }
    } catch { }
  };

  const getmediclaimans = async () => {
    try {
      // let api_data = {
      //   fp_log_id: fplogid,
      //   user_id: userid,
      // };
      // var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
      var decoded_res = await getKnowyourmediclaimQuestionAnswers(getParentUserId())
      if (decoded_res["status_code"] == "200") {
        setQuizData(decoded_res["data"][0]);
        const answerData = decoded_res["data"];
        const answerMap = {}
        answerData.forEach((ans) => {
          answerMap[ans.mediclaim_question_id] = ans.mediclaim_option_id;
          // updateIdMap[ans.mediclaim_question_id] = ans.answer_id;
        });
        setSelectedAnswer(answerMap)
        setTotalCount(answerData.length);
        // if ("q1_ans" in decoded_res["data"][0])
        //   setSelectedAnswer(decoded_res["data"][0]["q1_ans"]);
        // if ("q2_ans" in decoded_res["data"][0])
        //   setSelectedAnswerr(decoded_res["data"][0]["q2_ans"]);
        // if ("q3_ans" in decoded_res["data"][0])
        //   setSelectedAnswerrr(decoded_res["data"][0]["q3_ans"]);
        // setCheckMediclaim(decoded_res["error_code"]);
      } else {
        // setCheckMediclaim(decoded_res["error_code"]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // const getUlipFund = async () => {
  //   try {
  //     let url = ADVISORY_GET_ULIP_DATA;
  //     let ulip_fund = await apiCall(url, "", false, false);
  //     if (ulip_fund["error_code"] == "100") {
  //       var ulip_array = [];
  //       var ulip = ulip_fund["data"];
  //       ulip.map((u) => {
  //         ulip_array.push({ value: u.ms_secid, label: u.share_name });
  //       });
  //       setUlipFund(ulip_array);
  //     } else {
  //       setUlipFund([]);
  //     }
  //   } catch {}
  // };

  const getUlipFund = async () => {
    try {
      // let url = ADVISORY_GET_ULIP_DATA;
      let ulip_fund = await getInsuranceUlipList();
      if (ulip_fund["status_code"] == "200") {
        var ulip_array = [];
        var ulip = ulip_fund["data"];
        var labelSet = new Set(); // Create a Set to store unique labels
        ulip.forEach((u) => {
          const label = u.insurance_ulip_name;
          if (!labelSet.has(label)) {
            // Check if the label is not already in the Set
            ulip_array.push({ value: u.insurance_ulip_sec_id, label });
            labelSet.add(label); // Add the label to the Set to mark it as seen
          }
        });
        setUlipFund(ulip_array);
      } else {
        setUlipFund([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getMemberList = async () => {
    try {
      // let data = {
      //   user_id: userid,
      //   is_direct: "1",
      // };
      // let member_data = await apiCall(, data, true, false);
      // if (member_data.error_code == "100") {
      //   var member_array = [];
      //   var members = member_data["data"];
      //   // setFamilyData(members);
      //   members.map((member) => {
      //     if (member.parent_user_id == 0) {
      //       // setIncomeForMember(member.fp_user_id)
      //       var goal_for_member = member.fp_user_id;
      //       member_array.push({ value: member.fp_user_id, label: "Self" });
      //       setInsuranceData({
      //         ...insuranceData,
      //         insurance_for_member: goal_for_member,
      //       });
      //       if (insuranceData.insurance_cat_id == 48) {
      //         member_array.push({ value: 0, label: "Family Floater" });
      //       } else {
      //         member_array.push({ value: 0, label: "Family" });
      //       }
      //       if (insuranceData.insurance_cat_id == 48) {
      //         member_array.push({ value: 1, label: "Family Multi Individual" });
      //         setInsuranceData({
      //           ...insuranceData,
      //           insurance_for_member: 1,
      //         });
      //       }
      //     } else {
      //       member_array.push({ value: member.fp_user_id, label: member.NAME });
      //     }
      //   });

      //   if (member_array.length > 0) {
      //     setMemberData(member_array);
      //   } else {
      //     setMemberData([]);
      //   }
      // } else {
      //   setMemberData([]);
      // }
      let member_data = await getFamilyMember(userid);
      if (member_data.status_code == 200) {
        var member_array = [];
        var members = member_data["data"];
        // setFamilyData(members);
        members.map((member) => {
          if (member.user_parent_id == "0" || member.user_parent_id == null) {
            // setIncomeForMember(member.fp_user_id)
            var goal_for_member = member.user_id;
            member_array.push({ value: member.user_id, label: "Self" });

            if (insuranceData.id == 0) {
              setInsuranceData({
                ...insuranceData,
                insurance_for_member: goal_for_member,
              });
            }

            // member_array.push({ value: 0, label: "Family" });

            if (insuranceData.insurance_cat_uuid == "mediclaim") {
              member_array.push({ value: "Family Floater", label: "Family Floater" });
            } else {
              member_array.push({ value: "Family", label: "Family" });
            }

            if (insuranceData.insurance_cat_uuid == "mediclaim") {
              member_array.push({ value: "Family Multi Individual", label: "Family Multi Individual" });
            } else {
              for (let i = 0; i < member_array.length; i++) {
                if (member_array["value"] == "Family Multi Individual") {
                  member_array.splice(i, 1);
                  break;
                }
              }
            }

            if (
              insuranceData.insurance_cat_uuid == "mediclaim" &&
              insuranceData.id == 0
            ) {
              setInsuranceData({
                ...insuranceData,
                insurance_for_member: "Family Multi Individual",
              });
            }
          } else {
            member_array.push({ value: member.user_id, label: member.user_name });
          }
        });

        if (member_array.length > 0) {
          setMemberData(member_array);
        } else {
          setMemberData([]);
        }
      } else {
        setMemberData([]);
      }
    } catch { }
  };

  const addUpdateInsurance = async (e) => {

    e.preventDefault();
    setIsLoading(true);
    try {
      // let url = ADVISORY_ADD_UPDATE_INSURANCE_DATA;
      // if (selectedGoalsId != false) {
      //   insuranceData["user_insurance_goal_linkage_ids"] = selectedGoalsId.join(",");
      // }
      if (
        insuranceData.user_insurance_bonus_details &&
        insuranceData.user_insurance_bonus_details.length >= 1
      ) {
        insuranceData.bonus_amount = 1;
      } else {
        insuranceData.bonus_amount = 0;
      }
      insuranceData.insurance_source = "1";
      insuranceData.user_insurance_premium_freq = sortOptionsPaymentt.find(
        (option) => option.value === insuranceData.user_insurance_premium_freq
      )?.label;

      let payload = {
        user_insurance_user_id: insuranceData.user_insurance_user_id,
        insurance_cat_uuid: insuranceData.insurance_cat_uuid,
        user_insurance_name: insuranceData.user_insurance_name,
        user_insurance_premium_amount: parseInt(insuranceData.user_insurance_premium_amount),
        user_insurance_for: insuranceData.insurance_for_member,
        user_insurance_sum_assured: parseInt(insuranceData.user_insurance_sum_assured),
        user_insurance_premium_freq: insuranceData.user_insurance_premium_freq,
        user_insurance_start_date: insuranceData.user_insurance_start_date,
        user_insurance_policy_term: parseInt(insuranceData.user_insurance_policy_term),
        user_insurance_context: "Individual",
        user_insurance_remarks: insuranceData.user_insurance_remarks ? insuranceData.user_insurance_remarks : "",
        data_belongs_to: DATA_BELONGS_TO,
      };

      if (insuranceData.user_insurance_premium_freq != "One Time") {
        payload.user_insurance_end_date = insuranceData.user_insurance_end_date
      }

      if (insuranceData.user_insurance_policy_number) {
        payload["user_insurance_policy_number"] = insuranceData.user_insurance_policy_number;
      }

      if (insuranceData.insurance_cat_uuid == "general") {
        payload["insurance_type_id"] = insuranceData.insurance_type_id
      }

      if (insuranceData.insurance_cat_uuid == "mediclaim") {
        const allowedValuesMap = {
          "Family": "Family",
          "Family Floater": "Family Floater",
          "Family Multi Individual": "Family Multi Individual"
        };

        payload["user_insurance_context"] = allowedValuesMap[insuranceData.insurance_for_member] || "Individual";
        if (insuranceData.insurance_for_member == "Family Multi Individual" || insuranceData.insurance_for_member == "Family Floater") {
          payload["user_insurance_member_ids"] = insuranceData.members
        }
      }

      if (insuranceData.insurance_cat_uuid == "term_plan") {
        payload["user_insurance_maturity_amount"] = parseInt(insuranceData.user_insurance_maturity_amount ? insuranceData.user_insurance_maturity_amount : 0);
      }

      if (insuranceData.insurance_cat_uuid == "ulip") {
        payload["user_insurance_current_fund_value"] = (insuranceData.user_insurance_current_fund_value).toString();
        payload["user_insurance_ulip_sec_id"] = insuranceData.user_insurance_ulip_sec_id
      }

      if (insuranceData.insurance_cat_uuid == "general" || insuranceData.insurance_cat_uuid == "mediclaim") {
        payload["user_insurance_topup"] = parseInt(insuranceData.user_insurance_topup ? insuranceData.user_insurance_topup : 0);
        payload["user_insurance_inflation_rate"] = (insuranceData.user_insurance_inflation_rate).toString();
      }

      const validCategories = ['guaranteed_income_plan', 'endowment', 'pension_plan', 'ulip', 'others'];

      if (validCategories.includes(insuranceData.insurance_cat_uuid)) {
        payload["user_insurance_surrender_value"] = parseInt(insuranceData.user_insurance_surrender_value ? insuranceData.user_insurance_surrender_value : 0);
        payload["user_insurance_automated_linkage"] = (insuranceData.user_insurance_automated_linkage).toString();
        payload["user_insurance_occurance"] = insuranceData.user_insurance_occurance;
        payload["user_insurance_maturity_amount"] = parseInt(insuranceData.user_insurance_maturity_amount ? insuranceData.user_insurance_maturity_amount : 0);
        if (insuranceData.user_insurance_automated_linkage == '1') {
          payload["user_insurance_goal_linkage_ids"] = linkageDetails.length > 0 ? linkageDetails : [];
        }
        const hasValidBonus = inputFieldsBonus.some(obj => Object.keys(obj).length > 0);
        if (hasValidBonus) {
          payload["user_insurance_bonus_details"] = inputFieldsBonus
        }

        if (insuranceData.user_insurance_occurance == "Recurring") {
          const insurance_details = inputFields.map(detail => {
            const match = sortOptionsFrequency.find(opt => opt.value === detail.frequency);
            return {
              ...detail,
              frequency: match.label
            };
          });
          payload["user_insurance_details"] = insurance_details
        }

      }

      let insurance_Data
      if (editflag == true) {
        payload["user_insurance_id"] = insuranceData.insurance_id;
        insurance_Data = await UpdateInsuranceDetails(payload, insuranceData.insurance_id);
      } else {
        insurance_Data = await addInsuranceDetails(payload);
      }
      if (insurance_Data["status_code"] == "200") {
        scrollToTop();
        var savetext =
          editflag
            ? " updated "
            : " saved ";
        var checkFirstSave =
          editflag
            ? 0
            : 1;
        var msg = insuranceData.user_insurance_name
          ? " - " + insuranceData.user_insurance_name
          : "";

        setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          insuranceData.insurance_category_name +
          msg +
          savetext +
          "successfully"
        );
        getGoalsList();
        setInsuranceData({
          ...defaultInsuranceData,
          user_insurance_user_id: getParentUserId()
          // insurance_id: insurance_Data["data"]["insurance_id"],
        });
        setGoalSelected(false);
        setSelectedGoals("Automated Linkage");
        setSelectedMembers([]);
        setLinkageDetails([])
        setSelectedGoalsId(false);
        setSelectedPriorityArray([]);
        setAutoMatedGoal(true);
        setSelectedOption(defaultInsuranceData.insurance_category_name);
        await getInsuranceList(checkFirstSave);
        setHandleError({ ...defaultHandleError });
        setEditFlag(false);
      } else {
        setIsLoading(false);
        insuranceData.user_insurance_premium_freq = sortOptionsPaymentt.find(
          (option) => option.label === insuranceData.user_insurance_premium_freq
        )?.value;
        setInsuranceData({ ...insuranceData });
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Oops something went wrong!!");
      }
    } catch {
      setIsLoading(false);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong!!");
    }
  };

  const editInsuranceData = async (id) => {
    // setIsLoading(true);
    try {
      // let url =
      //   BASE_API_URL +
      //   "restapi/getuserinsurance/?user_id=" +
      //   userid +
      //   "&fp_log_id=" +
      //   fplogid +
      //   "&insurance_id=" +
      //   id.toString() +
      //   "&web=1";
      setHandleError({
        ...handleError,
        insuranceName: "",
        insurancePremiunAmount: "",
        insuranceSumAssured: "",
        insurancePremiumPaymentEndDate: "",
        insurancePolicyTerm: "",
        insuranceDiseaseName: "",
        insuranceTotalMember: "",
        insuranceType: "",
        insuranceSelectMembers: "",
        insurancePolicyNumber: ""
      });

      let edit_inurance_data = await getInsuranceDetails(userid, id);
      if (edit_inurance_data["status_code"] == "200") {
        var insData = edit_inurance_data["data"][0];
        // if (insData.members !== null){
        // setSelectedMembers(JSON.parse(insData.members?.replace(/'/g, '"')))
        // }
        const insu_member = []
        var insurance_mem = (insData.user_insurance_member_ids != "null" && insData.user_insurance_member_ids != null) ? JSON.parse(insData.user_insurance_member_ids) : null;
        if (insurance_mem !== null) {
          if (insurance_mem !== "") {
            if (insurance_mem.some((filter) => filter.value === getParentUserId())) {
              insu_member.push("Self");

            }
            membersData.forEach((data) => {
              if (insurance_mem.some((filter) => (filter.value === data.user_id) && (data.user_parent_id != "0" && data.user_parent_id != null))) {
                insu_member.push(`${data.user_name}`);

              }
            });
            setSelectedMembers(insu_member);
          } else {
            setSelectedMembers([]);
          }
        }
        else {
          setSelectedMembers([]);
        }
        insData["insurance_for_member"] = insData["user_insurance_for"];
        insData["user_insurance_premium_freq"] = sortOptionsPaymentt.find(
          (option) => option.label === insData["user_insurance_premium_freq"]
        )?.value
        insData["user_insurance_details"] = (insData["user_insurance_details"] != "null" && insData["user_insurance_details"] != null) ? JSON.parse(insData["user_insurance_details"]).map(detail => {
          const match = sortOptionsFrequency.find(opt => opt.label === detail.frequency);
          return {
            ...detail,
            frequency: match ? match.value : detail.frequency
          };
        }) : []
        insData["user_insurance_bonus_details"] = (insData["user_insurance_bonus_details"] != "null" && insData["user_insurance_bonus_details"] != null) ? JSON.parse(insData["user_insurance_bonus_details"]) : []

        let ulidData = {};
        if (insData["insurance_cat_uuid"] == "ulip") {
          ulidData = {
            share_name: insData["user_insurance_name"],
            ms_secid: insData["user_insurance_ulip_sec_id"],
          };
        } else {
          ulidData = {};
        }
        if (insData["user_insurance_details"] == [] || Object.keys(insData["user_insurance_details"]).length === 0) {
          setInputFields([{}]);
        } else {
          setInputFields(insData["user_insurance_details"]);
        }

        if (insData["user_insurance_bonus_details"] == [] || Object.keys(insData["user_insurance_bonus_details"]).length === 0) {
          setInputFieldsBonus([{}]);
        } else {
          setInputFieldsBonus(insData["user_insurance_bonus_details"]);
        }

        setInsuranceData({
          ...insData,
          insurance_id: insData.name,
          insurance_category_name: insData.insurance_category_type,
          user_insurance_occurance:
            insData.user_insurance_occurance,
          user_insurance_bonus_details: Object.keys(insData["user_insurance_bonus_details"]).length > 0 ? insData.user_insurance_bonus_details : [],
          insurance_bonus: Object.keys(insData["user_insurance_bonus_details"]).length > 0 ? true : false,
          ulip_data: ulidData,
          members: insurance_mem ? insurance_mem : [],
          insurance_total_members: insurance_mem ? insurance_mem.length : 0
        });
        scrollToInsuranceForm();
        setSelectedOption(insData.insurance_category_type);
        var msg = insData.user_insurance_name ? " - " + insData.user_insurance_name : "";
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          "You can now edit details for " +
          insData.insurance_category_type +
          msg
        );
        goaldata.forEach(resetPriorityKey);
        unchangedgoaldata.forEach(resetPriorityKey);
        setLinkageDetails([])
        if (insData["linked_goals"].length > 0) {
          var linkedGoals = insData["linked_goals"];
          var selectedGoals = [];
          var goalIds = [];
          var priorityArray = [];
          var linkage_details = []
          linkedGoals.forEach((goal) => {
            if (goal.goal_details.goal_for_name == "") {
              goal.goal_details.goal_for_name = "Family";
            }
            selectedGoals.push(goal.goal_details.user_goal_name + "-" + goal.goal_details.goal_for_name);
            goalIds.push(goal.goal_details.name);
            priorityArray.push(goal.linkage_priority);
            goaldata.forEach((goal_obj) => {
              if (goal_obj.value == goal.goal_details.name) {
                goal_obj.priority = parseInt(goal.linkage_priority);
              }
            });
            unchangedgoaldata.forEach((goal_obj) => {
              if (goal_obj.value == goal.goal_details.name) {
                goal_obj.priority = parseInt(goal.linkage_priority);
              }
            });
            linkage_details.push({ linkage_goal_id: goal.goal_details.name, linkage_priority: goal.linkage_priority })
          });

          setLinkageDetails(linkage_details);
          setGoalData(goaldata);
          setUnchangedGoalData(unchangedgoaldata);
          setSelectedGoals(selectedGoals.toString());
          setSelectedGoalsId(goalIds);
          setSelectedPriorityArray(priorityArray);
          setAutoMatedGoal(false);
          // setIsLoading(false);
        } else {
          setAutoMatedGoal(true);
          setSelectedGoals("Automated Linkage");
          setSelectedGoalsId([]);
          setLinkageDetails([])
          // setIsLoading(false);
        }
      } else {
        // setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Oops something went wrong!!");
      }
    } catch (e) {
      // setIsLoading(false);
      console.log("error", e);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong!!");
    }
  };

  const resetPriorityKey = (obj) => {
    if ("priority" in obj) {
      delete obj.priority;
    }
  };

  const deleteInsurance = async () => {
    try {
      let data = {
        insurance_id: selectedinsuranceCategories,
        data_belongs_to: DATA_BELONGS_TO,
      };
      let deleteinsuranceData = await deleteInsuranceDetails(data);
      if (deleteinsuranceData["status_code"] == "200") {
        setShow(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(" Data been deleted successfully");

        // Immediately update local state to remove deleted records
        setInsuranceList(prev => prev.filter(item => !selectedinsuranceCategories.includes(item.name)));

        // Recalculate total
        const updatedList = insuranceList.filter(item => !selectedinsuranceCategories.includes(item.name));
        const newTotal = updatedList.reduce((total, item) => total + (item.user_insurance_sum_assured || 0), 0);
        setInsuranceTotal(newTotal);

        // Also refresh data from server to ensure consistency
        setTimeout(() => {
          getInsuranceList(0);
        }, 500);

        dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        setInsuranceData(defaultInsuranceData);
        setHandleError({
          ...handleError,
          insuranceName: "",
          insurancePremiunAmount: "",
          insuranceSumAssured: "",
          insurancePremiumPaymentEndDate: "",
          insurancePolicyTerm: "",
          insuranceDiseaseName: "",
          insuranceTotalMember: "",
          insuranceType: "",
          insuranceSelectMembers: "",
          insurancePolicyNumber: ""
        });
        setSelectedGoals("Automated Linkage");
        setSelectedMembers([]);
        setSelectedGoalsId(false);
        setLinkageDetails([])
        setSelectedPriorityArray([]);
        setAutoMatedGoal(true);
        setSelectedOption("Endowment");
        setEditFlag(false);
        scrollToTop();
        setSelectedinsuranceCategories([]);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Oops something went wrong!!");
      }
    } catch (error) {
      toastr.options.positionClass = "toast-bottom-left";

      // Enhanced error handling to show specific API error messages
      let errorMessage = "Something Went Wrong";
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          if (typeof errorData.message === 'string') {
            errorMessage = errorData.message;
          } else if (errorData.message.message) {
            errorMessage = errorData.message.message;
          }
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toastr.error(errorMessage);
    }
  };

  const getGoalsList = async () => {
    try {
      // let url = ADVISORY_GETGOALSDATA_API_URL;
      // let data = { user_id: userid, fp_log_id: fplogid };
      let goal_data = await getGoalDetails(getParentUserId())
      if (goal_data["status_code"] == "200") {
        var goal_array = [];
        var goal_array1 = [];
        var goalData = goal_data["data"];
        goalData.map((v) => {
          goal_array.push({
            label: v.user_goal_name,
            value: v.name,
            goal_end_date: v.user_goal_end_date,
            goal_start_date: v.user_goal_start_date,
            goal_isRecurring: v.goal_isRecurring ? "1" : "0",
          });
          goal_array1.push({
            label: v.user_goal_name,
            value: v.name,
            goal_end_date: v.user_goal_end_date,
            goal_start_date: v.user_goal_start_date,
            goal_isRecurring: v.goal_isRecurring ? "1" : "0",
          });
        });
        setGoalData(goal_array);
        setUnchangedGoalData(goal_array1);
      } else {
        setGoalData([]);
        setUnchangedGoalData([]);
      }
    } catch (err) {
      console.log("Error", err);
    }
  };
  const setDate = (date, dateType) => {
    if (dateType == "purcDate") {
      // goaldetails.goal_start_date = moment(date).format("DD/MM/YYYY");
      setInsuranceData({
        ...insuranceData,
        user_insurance_start_date: moment(date).format("DD/MM/YYYY"),
      });
    } else if (dateType == "startDate") {
      setInsuranceData({
        ...insuranceData,
        user_insurance_start_date: moment(date).format("DD/MM/YYYY"),
      });
    } else if (dateType == "endDate") {
      setInsuranceData({
        ...insuranceData,
        user_insurance_end_date: moment(date).format("DD/MM/YYYY"),
      });
    } else {
      setInsuranceData({
        ...insuranceData,
        user_insurance_end_date: moment(date).format("DD/MM/YYYY"),
      });
    }
  };

  const handleInsuranceName = (insName) => {
    if (insName == "") {
      if (insuranceData.insurance_cat_uuid == "ulip") {
        setHandleError({
          ...handleError,
          insuranceName: "Please select ULIP name",
        });
        scrollToinsuranceRef();
      } else {
        setHandleError({
          ...handleError,
          insuranceName: "Please enter plan name",
        });
        scrollToinsuranceRef();
      }
    } else if (insName.length < 3 || insName.length > 35) {
      setHandleError({
        ...handleError,
        insuranceName: "Name must be between 3-35 characters",
      });
      scrollToinsuranceRef();
    } else {
      setHandleError({ ...handleError, insuranceName: "" });
    }
  };

  const handlePremiumValue = (currentvalue) => {
    if (currentvalue == "") {
      handleError.insurancePremiunAmount = "Please enter premium amount";
      scrollToinsuranceRef();
      // setHandleError({...handleError,insurancePremiunAmount:"Please enter premium amount"})
    } else if (!/^\d+$/.test(currentvalue) || /^0\d+/.test(currentvalue) || parseInt(currentvalue, 10) < 1) {
      handleError.insurancePremiunAmount =
        "Please enter a value greater than or equal to 1.";
      scrollToinsuranceRef();
    } else {
      handleError.insurancePremiunAmount = "";
      // setHandleError({...handleError,insurancePremiunAmount:""})
    }
  };

  const handleSumAssured = (currentvalue) => {
    if (currentvalue == "") {
      handleError.insuranceSumAssured = "Please enter sum assured";
      scrollToinsuranceRef();
      // setHandleError({...handleError,insuranceSumAssured:"Please enter sum assured"})
    } else if (/^0+$/.test(currentvalue) || /^0\d+/.test(currentvalue) || parseInt(currentvalue, 10) < 1) {
      handleError.insuranceSumAssured =
        "Please enter a value greater than or equal to 1.";
      scrollToinsuranceRef();
    } else {
      handleError.insuranceSumAssured = "";
      // setHandleError({...handleError,insuranceSumAssured:""})
    }
  };

  const handlePremiumPaymentEndDate = (premiumEndDate) => {
    if (premiumEndDate == "") {
      handleError.insurancePremiumPaymentEndDate =
        "Please select premium payment end date";
      scrollToinsuranceRef();
      // setHandleError({...handleError,insurancePremiumPaymentEndDate:"Please select premium payment end date"})
    } else {
      handleError.insurancePremiumPaymentEndDate = "";
      // setHandleError({...handleError,insurancePremiumPaymentEndDate:""})
    }
  };

  const handleInsuranceType = (insType) => {
    if (insType == "") {
      handleError.insuranceType = "This field is required";
      scrollToinsuranceRef();
      // setHandleError({...handleError,insuranceType:"This field is required"})
    } else {
      handleError.insuranceType = "";
      // setHandleError({...handleError,insuranceType:""})
    }
  };

  // useEffect(() => {
  //   if (
  //     insuranceData.user_insurance_end_date != "" &&
  //     insuranceData.user_insurance_premium_freq != "One Time"
  //   ) {
  //     var currentDate = new Date().getFullYear();
  //     var insurance_EndDatec = moment(
  //       insuranceData.user_insurance_end_date,
  //       "DD/MM/YYYY"
  //     ).format("y");
  //     var policy_year = parseInt(insurance_EndDatec) - parseInt(currentDate);
  //     setPolicyYears(policy_year);
  //     setInsuranceData({ ...insuranceData, user_insurance_policy_term: policy_year });
  //     setHandleError({ ...handleError, insurancePolicyTerm: "" });
  //   }
  // }, [insuranceData.user_insurance_end_date]);

  useEffect(() => {
    if (
      insuranceData.user_insurance_end_date !== "" &&
      insuranceData.user_insurance_premium_freq !== "One Time"
    ) {
      var currentDate = new Date();
      var purchaseDate = moment(
        insuranceData.user_insurance_start_date,
        "DD/MM/YYYY"
      );

      // Extract years from purchaseDate and currentDate
      var purchaseYear = purchaseDate.year();
      var currentYear = currentDate.getFullYear();

      // Compare years
      if (purchaseYear < currentYear) {
        // New calculations for the case when user_insurance_start_date is less than current date
        var insuranceEndDate = moment(
          insuranceData.user_insurance_end_date,
          "DD/MM/YYYY"
        ).format("y");
        var policyYear = parseInt(insuranceEndDate) - purchaseYear;
        setPolicyYears(policyYear);
        setInsuranceData({
          ...insuranceData,
          user_insurance_policy_term: policyYear,
        });
        setHandleError({ ...handleError, insurancePolicyTerm: "" });
      } else {
        // Existing flow when user_insurance_start_date is not less than current date
        var insuranceEndDateCurrent = moment(
          insuranceData.user_insurance_end_date,
          "DD/MM/YYYY"
        ).format("y");
        var policyYearCurrent =
          parseInt(insuranceEndDateCurrent) - currentYear;
        setPolicyYears(policyYearCurrent);
        setInsuranceData({
          ...insuranceData,
          user_insurance_policy_term: policyYearCurrent,
        });
        setHandleError({ ...handleError, insurancePolicyTerm: "" });
      }
    }
  }, [insuranceData.user_insurance_end_date, insuranceData.user_insurance_start_date]);

  const handlePolicyTerm = (policyTerm) => {
    if (policyTerm == "") {
      handleError.insurancePolicyTerm = "Please enter policy terms";
      // setHandleError({ ...handleError, insurancePolicyTerm: "Please enter policy terms" });
      scrollToinsuranceRef();
    } else if (policyTerm > 100) {
      handleError.insurancePolicyTerm = "Policy term should not exceed 100";
      // setHandleError({ ...handleError, insurancePolicyTerm: "Policy term should not exceed 100" });
      scrollToinsuranceRef();
    } else if (policyTerm == 0) {
      handleError.insurancePolicyTerm = "Please add Policy Terms(Years) more than 0";
      // setHandleError({ ...handleError, insurancePolicyTerm: "Please add Policy Terms(Years) more than 0" });
      scrollToinsuranceRef();
    } else if (policyYears > policyTerm) {
      handleError.insurancePolicyTerm = "Please add Policy Terms(Years) more than " + policyYears;
      // setHandleError({ ...handleError, insurancePolicyTerm: "Please add Policy Terms(Years) more than " + policyYears });
      scrollToinsuranceRef();
      setErrorFlag(false);
    } else {
      setErrorFlag(true);
      handleError.insurancePolicyTerm = "";
      // setHandleError({ ...handleError, insurancePolicyTerm: "" })
    }
  };

  const handlePolicyNumber = (policyNumber) => {
  const policyLength = policyNumber ? policyNumber.toString().length : 0;
  
  if (policyNumber == 0 || policyNumber == "") {
    handleError.insurancePolicyNumber = "";
    setErrorFlag(true);
  } else if (policyLength < 6) {
    handleError.insurancePolicyNumber = "Policy number should be at least 6 characters long";
    scrollToinsuranceRef();
    setErrorFlag(false);
  } else if (policyLength > 12) {
    handleError.insurancePolicyNumber = "Policy number should not exceed 12 characters";
    scrollToinsuranceRef();
    setErrorFlag(false);
  }else {
    handleError.insurancePolicyNumber = "";
    setErrorFlag(true);
  }
};

  // const handleNumberOfMembers = (members) => {
  //   const filteredData = memberdata.filter(
  //     (item) => item.value !== 0 && item.value !== 1 && item.label !== "Self"
  //   );
  //   if (members == "") {
  //     setHandleError({
  //       ...handleError,
  //       insuranceTotalMember: "Please enter total members ",
  //     });
  //   } else if (members > filteredData.length) {
  //     setHandleError({
  //       ...handleError,
  //       insuranceTotalMember:
  //         "  Please enter a value less than or equal to " + filteredData.length,
  //     });
  //   } else {
  //     setHandleError({ ...handleError, insuranceTotalMember: "" });
  //   }
  // };

  const handleDiseaseName = (disease) => {
    if (disease == "") {
      // handleError.insuranceDiseaseName="Please enter disease name"
      setHandleError({
        ...handleError,
        insuranceDiseaseName: "Please enter disease name",
      });
      scrollToinsuranceRef();
    } else {
      // handleError.insuranceDiseaseName=""
      setHandleError({ ...handleError, insuranceDiseaseName: "" });
    }
  };

  const handleNumberOfMembers = (members) => {
    if (members.length < 2) {
      setHandleError({
        ...handleError,
        insuranceTotalMember: "Please select a minimum of 2 members. ",
      });
      scrollToinsuranceRef();
    } else {
      setHandleError({ ...handleError, insuranceTotalMember: "" });
    }
  };

  // const handleSelectMembersError = (member) => {
  //   if (member == ""){
  //     setHandleError({
  //       ...handleError,
  //       insuranceSelectMembers:"Please select a minimum of 2 members",
  //     })
  //   }
  //   else{
  //     setHandleError({
  //       ...handleError,
  //       insuranceSelectMembers:"",
  //     })
  //   }
  // }

  const handleSubmit = async (e) => {
    const filteredData = memberdata.filter(
      (item) => item.value !== 0 && item.value !== 1 && item.label !== "Self"
    );
    const check_insurance_bonus = inputFieldsBonus.every(
      (item) =>
        item.hasOwnProperty("bonus_date") &&
        item.bonus_date &&
        item.hasOwnProperty("bonus_amount") &&
        item.bonus_amount.trim() !== ""
    );
    const check_insurance_recurring = inputFields.every(
      (item) =>
        item.amount &&
        item.start_date &&
        item.frequency &&
        item.end_date
    );
    e.preventDefault();
    if (insuranceData.user_insurance_name === "") {
      handleInsuranceName("");
    }
    if (insuranceData.user_insurance_premium_amount === "") {
      handlePremiumValue("");
    }
    if (insuranceData.user_insurance_sum_assured === "") {
      handleSumAssured("");
    }
    if (insuranceData.user_insurance_premium_freq !== "One Time" && insuranceData.user_insurance_end_date === "") {
      handlePremiumPaymentEndDate("");
    }
    if (
      insuranceData.user_insurance_policy_term === "" ||
      insuranceData.user_insurance_policy_term === 0
    ) {
      handlePolicyTerm("");
    }
    if (insuranceData.insurance_type_id === "") {
      handleInsuranceType("");
    }
    if (
      insuranceData.user_insurance_policy_number === "" ||
      insuranceData.user_insurance_policy_number === 0
    ) {
      handlePolicyNumber("");
    }
    // if (
    //   insuranceData.disease_name === "" ||
    //   insuranceData.disease_name === null
    // ) {
    //   handleDiseaseName("");
    // }

    // if (
    //   insuranceData.insurance_total_members === "" ||
    //   insuranceData.insurance_total_members > filteredData
    // ) {
    //   handleNumberOfMembers("");
    // }

    if (
      insuranceData.insurance_total_members === "" ||
      insuranceData.insurance_total_members < 2
    ) {
      handleNumberOfMembers("");
    }

    // if (
    //   insuranceData.members === "" ||
    //   insuranceData.members === null
    // ) {
    //   handleSelectMembersError("");
    // }

    if (insuranceData.insurance_cat_uuid == "general") {
      if (
        insuranceData.user_insurance_name != "" &&
        insuranceData.user_insurance_premium_amount != "" &&
        insuranceData.user_insurance_sum_assured != "" &&
        // insuranceData.user_insurance_end_date != "" &&
        insuranceData.user_insurance_policy_term != "" &&
        insuranceData.user_insurance_policy_term != 0 &&
        errorFlag == true &&
        insuranceData.insurance_type_id != ""
      ) {
        if (!insuranceData.user_insurance_user_id) {
          insuranceData.user_insurance_user_id = getParentUserId();
        }
        if (
          errorFlag == true &&
          insuranceData["user_insurance_name"].length >= 3 &&
          insuranceData["user_insurance_name"].length <= 35
        ) {
          addUpdateInsurance(e);
          // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        } else {
        }
      }
    } else if (insuranceData.insurance_cat_uuid == "mediclaim") {
      if (
        insuranceData.insurance_for_member == "Family Floater" ||
        insuranceData.insurance_for_member == "Family Multi Individual"
      ) {
        if (
          insuranceData.user_insurance_name != "" &&
          insuranceData.user_insurance_premium_amount != "" &&
          insuranceData.user_insurance_sum_assured != "" &&
          // insuranceData.user_insurance_end_date != "" &&
          insuranceData.user_insurance_policy_term != "" &&
          insuranceData.user_insurance_policy_term != 0 &&
          insuranceData.insurance_total_members != 0 &&
          errorFlag == true
        ) {
          if (!insuranceData.user_insurance_user_id) {
            insuranceData.user_insurance_user_id = getParentUserId();
          }
          if (
            errorFlag == true &&
            insuranceData["user_insurance_name"].length >= 3 &&
            insuranceData["user_insurance_name"].length <= 35
          ) {
            if (insuranceData.insurance_total_members >= 2) {
              addUpdateInsurance(e);
            }
            // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          } else {
          }
        }
      } else {
        if (
          insuranceData.user_insurance_name != "" &&
          insuranceData.user_insurance_premium_amount != "" &&
          insuranceData.user_insurance_sum_assured != "" &&
          // insuranceData.user_insurance_end_date != "" &&
          insuranceData.user_insurance_policy_term != "" &&
          insuranceData.user_insurance_policy_term != 0 &&
          errorFlag == true
        ) {
          if (!insuranceData.user_insurance_user_id) {
            insuranceData.user_insurance_user_id = getParentUserId();
          }
          if (
            errorFlag == true &&
            insuranceData["user_insurance_name"].length >= 3 &&
            insuranceData["user_insurance_name"].length <= 35
          ) {
            addUpdateInsurance(e);
          } else {
          }
        }
      }
    } else if (
      insuranceData.insurance_cat_uuid == "term_plan" ||
      insuranceData.insurance_cat_uuid == "ulip"
    ) {
      if (
        insuranceData.insurance_cat_uuid == "ulip" &&
        insuranceData.user_insurance_name == "ULIP"
      ) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Please select ULIP name");
      }
      if (
        insuranceData.user_insurance_name != "" &&
        insuranceData.user_insurance_premium_amount != "" &&
        insuranceData.user_insurance_sum_assured != "" &&
        // insuranceData.user_insurance_end_date != "" &&
        insuranceData.user_insurance_policy_term != "" &&
        errorFlag == true &&
        insuranceData.user_insurance_policy_term != 0
      ) {
        if (!insuranceData.user_insurance_user_id) {
          insuranceData.user_insurance_user_id = getParentUserId();
        }
        if (
          insuranceData.insurance_cat_uuid == "ulip" &&
          insuranceData.user_insurance_name == "ULIP"
        ) {
        } else {
          if (insuranceData.insurance_cat_uuid != "ulip") {
            if (
              errorFlag == true &&
              insuranceData["user_insurance_name"].length >= 3 &&
              insuranceData["user_insurance_name"].length <= 35
            ) {
              addUpdateInsurance(e);
              // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
            } else {
            }
          } else {
            if (insuranceData["insurance_bonus"] == true) {
              insuranceData.user_insurance_bonus_details = inputFieldsBonus;
            } else {
              insuranceData.user_insurance_bonus_details = [];
            }

            if (insuranceData["user_insurance_occurance"] == "Recurring") {
              insuranceData.recurring_insurance = inputFields;
            } else {
              insuranceData.recurring_insurance = [];
            }
            addUpdateInsurance(e);
            // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          }
        }
      }
    } else {

      if (
        insuranceData.user_insurance_occurance == "Recurring" ||
        insuranceData.insurance_bonus == true
      ) {
        if (
          insuranceData.user_insurance_name != "" &&
          insuranceData.user_insurance_premium_amount != "" &&
          insuranceData.user_insurance_sum_assured != "" &&
          // insuranceData.user_insurance_end_date != "" &&
          insuranceData.user_insurance_policy_term != "" &&
          insuranceData.user_insurance_policy_term != 0
          // insuranceData.user_insurance_end_date != "" &&
          // insuranceData.insurance_recurring_amount != ""
        ) {
          const missingDataa = inputFields.reduce(
            (missingFieldss, data, index) => {
              if (!data.start_date) {
                // missingFields.push(`bonus_date is missing in data ${index + 1}`);
                missingFieldss.push(`Start Date`);
              }
              if (!data.end_date) {
                // missingFields.push(`bonus_date is missing in data ${index + 1}`);
                missingFieldss.push(`End Date`);
              }
              if (!data.amount) {
                // missingFields.push(`bonus_amount is missing in data ${index + 1}`);
                missingFieldss.push(`Amount`);
              }
              if (!data.frequency) {
                // missingFields.push(`bonus_amount is missing in data ${index + 1}`);
                missingFieldss.push(`Frequency`);
              }
              return missingFieldss;
            },
            []
          );

          const missingDataStringg = JSON.stringify(missingDataa);
          const cleanedStringg = missingDataStringg.replace(/[\[\],"]/g, "");
          const commaSeparatedStringg = missingDataa.join(", ");

          const missingData = inputFieldsBonus.reduce(
            (missingFields, data, index) => {
              if (!data.bonus_date) {
                // missingFields.push(`bonus_date is missing in data ${index + 1}`);
                missingFields.push(`Date Of Bonus`);
              }
              if (!data.bonus_amount) {
                // missingFields.push(`bonus_amount is missing in data ${index + 1}`);
                missingFields.push(`Bonus Amount`);
              }
              return missingFields;
            },
            []
          );

          const missingDataString = JSON.stringify(missingData);
          const cleanedString = missingDataString.replace(/[\[\],"]/g, "");
          const commaSeparatedString = missingData.join(", ");

          if (!insuranceData.user_insurance_user_id) {
            insuranceData.user_insurance_user_id = getParentUserId();
          }

          if (
            insuranceData["insurance_bonus"] == true &&
            check_insurance_bonus == false
          ) {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Please fill the details : " + commaSeparatedString);
          } else if (
            insuranceData["user_insurance_occurance"] == "Recurring" &&
            check_insurance_recurring == false
          ) {
            toastr.options.positionClass = "toast-bottom-left";
            toastr.error("Please fill the details : " + commaSeparatedStringg);
          } else {
            if (insuranceData["user_insurance_occurance"] == "Recurring") {
              insuranceData.recurring_insurance = inputFields;
            } else {
              insuranceData.recurring_insurance = [];
            }
            const convertedData = inputFieldsBonus.map((item) => {
              const date = new Date(item.bonus_date);
              const isValidDate = !isNaN(date);

              const bonus_date = isValidDate
                ? date.toLocaleDateString("en-GB")
                : item.bonus_date;

              return { ...item, bonus_date };
            });
            let allDatesAreDistinct = true;
            if (insuranceData["insurance_bonus"] == true) {
              const dateSet = new Set();
              for (const item of convertedData) {
                if (dateSet.has(item.bonus_date)) {
                  allDatesAreDistinct = false;
                  break;
                }
                dateSet.add(item.bonus_date);
              }
            } else {
              insuranceData.user_insurance_bonus_details = [];
            }
            if (
              insuranceData["insurance_bonus"] == true &&
              Object.keys(convertedData).length > 1
            ) {
              if (allDatesAreDistinct == false) {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Please enter unique date of bonus");
              } else {
                insuranceData.user_insurance_bonus_details = convertedData;
                let isValidRecurringAmount = true;
                let isValidBonusAmount = true;
                if (insuranceData["user_insurance_occurance"] == "Recurring") {
                  isValidRecurringAmount = inputFields.every((item) => {
                    const recurringAmount = parseInt(
                      item.amount,
                      10
                    );
                    return (
                      recurringAmount >= 1 &&
                      // recurringAmount < 10000000 &&
                      !item.amount.startsWith("0") &&
                      !isNaN(recurringAmount)
                    );
                  });
                }

                if (insuranceData["insurance_bonus"] == true) {
                  isValidBonusAmount = inputFieldsBonus.every((item) => {
                    const bonusAmount = parseInt(
                      item.bonus_amount,
                      10
                    );
                    return (
                      bonusAmount >= 1 &&
                      // bonusAmount < 10000000 &&
                      !item.bonus_amount.startsWith("0") &&
                      !isNaN(bonusAmount)
                    );
                  });
                }

                if (
                  isValidRecurringAmount == true &&
                  isValidBonusAmount == true
                ) {
                  if (
                    errorFlag == true &&
                    insuranceData["user_insurance_name"].length >= 3 &&
                    insuranceData["user_insurance_name"].length <= 35
                  ) {
                    addUpdateInsurance(e);
                    // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
                  } else {
                  }
                } else {
                  toastr.options.positionClass = "toast-bottom-left";
                  toastr.error("Amount must be a number between 1 and 9,999,999 and must not start with a 0");
                }
              }
            } else {
              insuranceData.user_insurance_bonus_details = convertedData;
              let isValidRecurringAmount = true;
              let isValidBonusAmount = true;
              if (insuranceData["user_insurance_occurance"] == "Recurring") {
                isValidRecurringAmount = inputFields.every((item) => {
                  const recurringAmount = parseInt(
                    item.amount,
                    10
                  );
                  return (
                    recurringAmount >= 1 &&
                    // recurringAmount < 10000000 &&
                    !item.amount.startsWith("0") &&
                    !isNaN(recurringAmount)
                  );
                });
              }

              if (insuranceData["insurance_bonus"] == true) {
                isValidBonusAmount = inputFieldsBonus.every((item) => {
                  const bonusAmount = parseInt(item.bonus_amount, 10);
                  return (
                    bonusAmount >= 1 &&
                    // bonusAmount < 10000000 &&
                    !item.bonus_amount.startsWith("0") &&
                    !isNaN(bonusAmount)
                  );
                });
              }

              if (
                isValidRecurringAmount == true &&
                isValidBonusAmount == true
              ) {
                if (
                  errorFlag == true &&
                  insuranceData["user_insurance_name"].length >= 3 &&
                  insuranceData["user_insurance_name"].length <= 35
                ) {
                  addUpdateInsurance(e);
                  // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
                } else {
                }
              } else {
                toastr.options.positionClass = "toast-bottom-left";
                toastr.error("Amount must be a number between 1 and 9,999,999 and must not start with a 0");
              }
            }
          }
        }
      } else {
        if (
          insuranceData.user_insurance_premium_freq == "One Time" &&
          insuranceData.user_insurance_policy_term != "" &&
          insuranceData.user_insurance_policy_term != 0
        ) {
          if (
            insuranceData.user_insurance_name != "" &&
            insuranceData.user_insurance_premium_amount != "" &&
            insuranceData.user_insurance_sum_assured != "" &&
            errorFlag == true &&
            // insuranceData.user_insurance_end_date != "" &&
            insuranceData.user_insurance_policy_term != "" &&
            insuranceData.user_insurance_policy_term != 0
          ) {
            if (!insuranceData.user_insurance_user_id) {
              insuranceData.user_insurance_user_id = getParentUserId();
            }
            if (insuranceData["user_insurance_occurance"] == "Recurring") {
              insuranceData.recurring_insurance = inputFields;
            } else {
              insuranceData.recurring_insurance = [];
            }
            if (insuranceData["insurance_bonus"] == true) {
              insuranceData.user_insurance_bonus_details = inputFieldsBonus;
            } else {
              insuranceData.user_insurance_bonus_details = [];
            }
            if (
              errorFlag == true &&
              insuranceData["user_insurance_name"].length >= 3 &&
              insuranceData["user_insurance_name"].length <= 35
            ) {
              addUpdateInsurance(e);
              // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
            } else {
            }
          }
        } else {
          if (
            insuranceData.user_insurance_name != "" &&
            insuranceData.user_insurance_premium_amount != "" &&
            insuranceData.user_insurance_sum_assured != "" &&
            insuranceData.user_insurance_end_date != "" &&
            insuranceData.user_insurance_policy_term != "" &&
            insuranceData.user_insurance_policy_term != 0
          ) {
            if (!insuranceData.user_insurance_user_id) {
              insuranceData.user_insurance_user_id = getParentUserId();
            }
            if (insuranceData["user_insurance_occurance"] == "Recurring") {
              insuranceData.recurring_insurance = inputFields;
            } else {
              insuranceData.recurring_insurance = [];
            }
            if (insuranceData["insurance_bonus"] == true) {
              insuranceData.user_insurance_bonus_details = inputFieldsBonus;
            } else {
              insuranceData.user_insurance_bonus_details = [];
            }
            if (
              errorFlag == true &&
              insuranceData["user_insurance_name"].length >= 3 &&
              insuranceData["user_insurance_name"].length <= 35
            ) {
              addUpdateInsurance(e);
              // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
            } else {
            }
          }
        }
      }
    }

  };

  const scrollToTop = () => {
    window.scroll({ top: 0 });
  };

  const cancelInsuranceForm = (e) => {
    e.preventDefault();
    setInsuranceData({
      ...defaultInsuranceData,
      user_insurance_user_id: getParentUserId()
    });
    setSelectedOption(defaultInsuranceData.user_insurance_name);
    setHandleError({ ...defaultHandleError });
    setEditFlag(false);
    getGoalsList();
    setGoalSelected(false);
    setSelectedGoals("Automated Linkage");
    setSelectedGoalsId(false);
    setLinkageDetails([])
    setSelectedPriorityArray([]);
    setSelectedMembers([]);
    setAutoMatedGoal(true);
    scrollToTop();
  };

  const [updateId, setUpdateId] = useState("");
  const [mediclaimQues, setMediclaimQues] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  // const [selectedAnswerr, setSelectedAnswerr] = useState("");
  // const [selectedAnswerrr, setSelectedAnswerrr] = useState("");
  const [questionNumber, setQuestionNumber] = useState("");

  const handleResponse = (value, questionNum) => {

    if (!value) {
      toastr.error("Please select an answer before proceeding.");
      return;
    }
    setQuestionNumber(questionNum);
    if (value === null || value === "") {
      if (questionNum === "MQ-3") {
        setTab("tab2");
        scrollToTop();
      }
    } else if (value === undefined) {
      if (questionNum === "MQ-3") {
        setTab("tab2");
        scrollToTop();
      }
    } else {
      if (questionNum >= "MQ-1") {
        // if (checkMediclaim == "103") {
        addmediclaim(value, questionNum);
        // } else {
        //   updatemediclaim(questionNum);
        // }
        // setTotalCount((v) => ++v);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          "Answer for question " + questionNum + " saved successfully"
        );

        const fieldsToCheck = ["q1_ans", "q2_ans", "q3_ans"];
        const allValuesPresent = fieldsToCheck.every(
          (field) => quizData[field] || quizData[field] === 0
        );

        if (questionNum === "MQ-3") {
          setTab("tab2");
          scrollToTop();
        } else {
        }
      } else {
      }
    }
  };

  const getMediclaimQuestions = async () => {
    try {

      var mediclaim_ques = await getKnowyourmediclaimQuestion()

      if (mediclaim_ques["status_code"] == "200") {
        setMediclaimQues(mediclaim_ques["data"])
      } else {
        setMediclaimQues([])
      }
    } catch {
      (e) => {
        console.log("Error", e);
      };
    }
  }
  const addmediclaim = async (value, questionNum) => {

    try {
      var payload = {
        user_id: getParentUserId(),
        question_id: questionNum,
        answer_option_id: value,
      };

      var mediclaim_user_ans = await addUpdateUserMediclaimAnswers(payload)
      getmediclaimans();
    } catch {
      (e) => {
        console.log("Error", e);
      };
    }
  };

  const updatemediclaim = async (questionNum) => {
    let session_data = sessiondata;
    let a;
    if (questionNum == 1) {
      a = selectedAnswer;
    } else if (questionNum == 2) {
      a = selectedAnswerr;
    } else if (questionNum == 3) {
      a = selectedAnswerrr;
    }
    try {
      var gtys_data = {
        fp_log_id: userid,
        user_id: fpLogId,
        total_points: 10,
        q_id: questionNum,
        update_id: updateId,
        ans: a,
      };
      var payload_gtys_data = commonEncode.encrypt(JSON.stringify(gtys_data));
      var config_gtys = await apiCall(
        ADVISORY_UPDATE_MEDICALAIM,
        payload_gtys_data,
        false,
        false
      );

      var res_gtys = JSON.parse(commonEncode.decrypt(config_gtys));
      getmediclaimans();
    } catch {
      (e) => {
        console.log("Error", e);
      };
    }
  };

  useEffect(() => {
    if (insuranceData.insurance_for_member === "") {
      getMemberList();
    }
    // insuranceData.user_insurance_occurance = Boolean(
    //   insuranceData.user_insurance_occurance
    // );
  }, [insuranceData.insurance_for_member]);

  useEffect(() => {
    if (selectedOption == "Mediclaim") {
      getMemberList();
    }
  }, [selectedOption]);
  const [frequencyChange, setFrequencyChange] = useState(0);

  const cleanInsuranceArray = () => {
    let _a = inputFields;
    for (let i = 0; i < _a.length; i++) {
      switch (Number(_a[i].insurance_frequency)) {
        case 2:
          if (_a[i].user_insurance_start_date) {
            _a[i]["insurance_min_end_date"] = moment(
              _a[i].user_insurance_start_date,
              "DD/MM/YYYY"
            )
              .clone()
              .add(3, "month")
              .add(1, "day");
          }
          if (_a[i].user_insurance_start_date && _a[i].user_insurance_end_date) {
            var d1 = moment(_a[i].user_insurance_start_date, "DD/MM/YYYY");
            var d2 = moment(_a[i].user_insurance_end_date, "DD/MM/YYYY");
            if (moment(d2).diff(d1, "months") < 3) {
              _a[i].user_insurance_end_date = d1
                .clone()
                .add(3, "month")
                .add(1, "day")
                .format("DD/MM/YYYY");
            }
          }
          break;
        case 3:
          if (_a[i].user_insurance_start_date) {
            _a[i]["insurance_min_end_date"] = moment(
              _a[i].user_insurance_start_date,
              "DD/MM/YYYY"
            )
              .clone()
              .add(6, "month")
              .add(1, "day");
          }
          if (_a[i].user_insurance_start_date && _a[i].user_insurance_end_date) {
            var d1 = moment(_a[i].user_insurance_start_date, "DD/MM/YYYY");
            var d2 = moment(_a[i].user_insurance_end_date, "DD/MM/YYYY");
            if (moment(d2).diff(d1, "months") < 6) {
              _a[i].user_insurance_end_date = d1
                .clone()
                .add(6, "month")
                .add(1, "day")
                .format("DD/MM/YYYY");
            }
          }
          break;
        case 4:
          if (_a[i].user_insurance_start_date) {
            _a[i]["insurance_min_end_date"] = moment(
              _a[i].user_insurance_start_date,
              "DD/MM/YYYY"
            )
              .clone()
              .add(1, "year")
              .add(1, "day");
          }
          if (_a[i].user_insurance_start_date && _a[i].user_insurance_end_date) {
            var d1 = moment(_a[i].user_insurance_start_date, "DD/MM/YYYY");
            var d2 = moment(_a[i].user_insurance_end_date, "DD/MM/YYYY");
            if (moment(d2).diff(d1, "year") < 1) {
              _a[i].user_insurance_end_date = d1
                .clone()
                .add(1, "year")
                .add(1, "day")
                .format("DD/MM/YYYY");
            }
          }
          break;
        case 6:
          if (_a[i].user_insurance_start_date) {
            _a[i]["insurance_min_end_date"] = moment(
              _a[i].user_insurance_start_date,
              "DD/MM/YYYY"
            )
              .clone()
              .add(2, "year")
              .add(1, "day");
          }
          if (_a[i].user_insurance_start_date && _a[i].user_insurance_end_date) {
            var d1 = moment(_a[i].user_insurance_start_date, "DD/MM/YYYY");
            var d2 = moment(_a[i].user_insurance_end_date, "DD/MM/YYYY");
            if (moment(d2).diff(d1, "year") < 2) {
              _a[i].user_insurance_end_date = d1
                .clone()
                .add(2, "year")
                .add(1, "day")
                .format("DD/MM/YYYY");
            }
          }
          break;
        case 7:
          if (_a[i].user_insurance_start_date) {
            _a[i]["insurance_min_end_date"] = moment(
              _a[i].user_insurance_start_date,
              "DD/MM/YYYY"
            )
              .clone()
              .add(3, "year")
              .add(1, "day");
          }
          if (_a[i].user_insurance_start_date && _a[i].user_insurance_end_date) {
            var d1 = moment(_a[i].user_insurance_start_date, "DD/MM/YYYY");
            var d2 = moment(_a[i].user_insurance_end_date, "DD/MM/YYYY");
            if (moment(d2).diff(d1, "year") < 3) {
              _a[i].user_insurance_end_date = d1
                .clone()
                .add(3, "year")
                .add(1, "day")
                .format("DD/MM/YYYY");
            }
          }
          break;
        case 8:
          if (_a[i].user_insurance_start_date) {
            _a[i]["insurance_min_end_date"] = moment(
              _a[i].user_insurance_start_date,
              "DD/MM/YYYY"
            )
              .clone()
              .add(4, "year")
              .add(1, "day");
          }
          if (_a[i].user_insurance_start_date && _a[i].user_insurance_end_date) {
            var d1 = moment(_a[i].user_insurance_start_date, "DD/MM/YYYY");
            var d2 = moment(_a[i].user_insurance_end_date, "DD/MM/YYYY");
            if (moment(d2).diff(d1, "year") < 4) {
              _a[i].user_insurance_end_date = d1
                .clone()
                .add(4, "year")
                .add(1, "day")
                .format("DD/MM/YYYY");
            }
          }
          break;
        case 9:
          if (_a[i].user_insurance_start_date) {
            _a[i]["insurance_min_end_date"] = moment(
              _a[i].user_insurance_start_date,
              "DD/MM/YYYY"
            )
              .clone()
              .add(5, "year")
              .add(1, "day");
          }
          if (_a[i].user_insurance_start_date && _a[i].user_insurance_end_date) {
            var d1 = moment(_a[i].user_insurance_start_date, "DD/MM/YYYY");
            var d2 = moment(_a[i].user_insurance_end_date, "DD/MM/YYYY");
            if (moment(d2).diff(d1, "year") < 5) {
              _a[i].user_insurance_end_date = d1
                .clone()
                .add(5, "year")
                .add(1, "day")
                .format("DD/MM/YYYY");
            }
          }
          break;
        case 1:
        default:
          if (_a[i].user_insurance_start_date) {
            _a[i]["insurance_min_end_date"] = moment(
              _a[i].user_insurance_start_date,
              "DD/MM/YYYY"
            )
              .clone()
              .add(1, "month")
              .add(1, "day");
          }
          if (_a[i].user_insurance_start_date && _a[i].user_insurance_end_date) {
            var d1 = moment(_a[i].user_insurance_start_date, "DD/MM/YYYY");
            var d2 = moment(_a[i].user_insurance_end_date, "DD/MM/YYYY");
            if (moment(d2).diff(d1, "months") < 1) {
              _a[i].user_insurance_end_date = d1
                .clone()
                .add(1, "month")
                .add(1, "day")
                .format("DD/MM/YYYY");
            }
          }
          break;
      }
      if (
        _a[i + 1] &&
        moment(_a[i + 1].user_insurance_start_date, "DD/MM/YYYY").valueOf() <
        moment(_a[i].user_insurance_end_date, "DD/MM/YYYY").valueOf()
      ) {
        _a[i + 1].user_insurance_start_date = moment(
          _a[i].user_insurance_end_date,
          "DD/MM/YYYY"
        )
          .clone()
          .add(1, "day")
          .format("DD/MM/YYYY");
      }
    }
    setInputFields([..._a]);
  };

  useEffect(() => {
    cleanInsuranceArray();
  }, [frequencyChange]);

  const closeModal = () => {
    setGoalSelected(false);
  };
  const selectGoals = (goals, goalId, priority) => {
    if (goals.length > 0) {
      const nameIndex = goals.indexOf("Automated Linkage");
      if (nameIndex != -1) {
        // setSelectedGoals(goals.splice(nameIndex, 1));
        setSelectedGoals("Automated Linkage");
        setLinkageDetails([])
      } else {
        setSelectedGoals(goals.toString());
        // const updatedLinkageDetails = goals.map((goal, index) => ({
        //   linkage_goal_id: goalId[index],
        //   linkage_priority: priority[index] || 1
        // }));

        // setLinkageDetails(updatedLinkageDetails);
        setLinkageDetails(prev => {
          const updated = [];

          // Loop through current selected goals
          for (let i = 0; i < goals.length; i++) {
            const id = goalId[i];
            const linkage_priority = priority[i] || 1;

            updated.push({
              linkage_goal_id: id,
              linkage_priority: linkage_priority
            });
          }

          return updated;
        });
      }
    }
    if (selectedGoalsId.length > 0) {
      const index = selectedGoalsId.indexOf("");
      if (index != -1) {
        selectedGoalIdArray(selectedGoalsId.splice(index, 1));
      }
    }
  };
  const selectedGoalIdArray = (goalIds) => {
    setSelectedGoalsId(goalIds);
  };
  const setPriorityArray = (priorityArray) => {
    setSelectedPriorityArray(priorityArray);
  };
  const setGoalLink = (goalIds) => {
    if (goalIds.length > 0) {
      if (selectedGoalsId.length > 0) {
        const idIndex = selectedGoalsId.indexOf("");
        if (idIndex != -1) {
          goalIds.splice(idIndex, 1);
        }
      }
      setInsuranceData({
        ...insuranceData,
        user_insurance_goal_linkage_ids: goalIds,
      });
    }
  };

  // New Mediclain Logic
  // const [openMemberDropdown, setOpenMemberDropdown] = useState(false);
  // const [familyData, setFamilyData] = useState([]);
  // const [selectedMembers, setSelectedMembers] = useState([]);
  // const [familyMultiData, setFamilyMutliData] = useState([]);

  useEffect(() => {
    familyMemberData();
  }, [insuranceData?.insurance_for_member]);

  function calculateAge(dob) {
    // Parse the date string in dd/mm/yyyy format
    const parts = dob.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is zero-based in JavaScript Date
    const year = parseInt(parts[2], 10);

    const birthDate = new Date(year, month, day);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();

    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  const [membersData, setMembersData] = useState([]);

  const familyMemberData = async () => {
    const user_id = getParentUserId();
    // var family_data = await apiCall(
    //   ADVISORY_GET_FAMILY_DATA_API_URL +
    //   "?parent_user_id=" +
    //   user_id +
    //   "&fp_log_id=" +
    //   fp_log_id +
    //   "&web=1",
    //   "",
    //   false,
    //   true
    // );
    var family_data = await getFamilyMember(user_id)
    // setFamilyData(response);
    setMembersData(family_data?.data);

    const filteredNamesMulti = family_data?.data
      .filter((member) => {
        if (
          member.relation === "Spouse" ||
          (member.relation === "Son" &&
            calculateAge(member.dob) >= 18 &&
            member.is_dependent == true) ||
          (member.relation === "Daughter" &&
            calculateAge(member.dob) >= 18 &&
            member.is_dependent == true) ||
          ((member.relation === "Father" ||
            member.relation === "Mother") &&
            member.is_dependent == true)
        ) {
          return true;
        }
        if (
          (member.relation === "Son" && calculateAge(member.dob) < 18) ||
          (member.relation === "Daughter" && calculateAge(member.dob) < 18)
        ) {
          return true;
        }
        if (member.relation === "Self") {
          return true;
        }
      })
      .map((member) => (
        { value: `${member.user_id}`, label: `${member.relation == "Self" ? "Self" : member.user_name}` }));

    // const familyListMulti = [{ value: `${member.user_details_id}`, label: "Self" }, ...filteredNamesMulti];
    setFamilyMutliData(filteredNamesMulti);



    const filteredNames = family_data?.data
      .filter((member) => {
        if (
          member.relation === "Spouse" ||
          (member.relation === "Son" && calculateAge(member.dob) < 18) ||
          (member.relation === "Daughter" && calculateAge(member.dob) < 18)
        ) {
          return true;
        }
        if (member.relation === "Self") {
          return true;
        }
      })
      .map((member) => ({ value: `${member.user_id}`, label: `${member.relation == "Self" ? "Self" : member.user_name}` }));

    // const familyList = [{ value: `${sessiondata.fp_user_id}`, label: "Self" }, ...filteredNames];

    if (insuranceData.insurance_for_member == "Family Floater" && !editflag) {
      var slm = ["Self"];
      setInsuranceData({
        ...insuranceData,
        insurance_total_members: 1,
        members: [{ value: `${getParentUserId()}`, label: "Self" }],
      })
      const spouse = family_data.data.find(
        (member) => {
          if (member.relation === "Spouse") {
            slm.push(`${member.user_name}`)
            setInsuranceData({
              ...insuranceData,
              insurance_total_members: 2,
              members: [{ value: `${getParentUserId()}`, label: "Self" }, { value: `${member.user_id}`, label: `${member.user_name}` }],
            })
          }

        }
      );
      setSelectedMembers(slm);
    }
    if (insuranceData.insurance_for_member === "Family Multi Individual" && !editflag) {
      var slm = ["Self"];
      setInsuranceData({
        ...insuranceData,
        insurance_total_members: 1,
        members: [{ value: `${getParentUserId()}`, label: "Self" }],
      });
      setSelectedMembers(slm);
    }
    setFamilyData(filteredNames);
  };

  const handleMemberSelect = async () => {
    setOpenMemberDropdown(true);
  };

  useEffect(() => {
    if (insuranceData.insurance_cat_uuid == "mediclaim") {
      if (!editflag) {
        setSelectedMembers([]);
        setInsuranceData((prev) => ({
          ...prev,
          members: [],
        }));
      }
    }
  }, [insuranceData.insurance_for_member, editflag]);

  useEffect(() => {
    if (selectedMembers.length > 1) {
      setHandleError((prev) => ({
        ...prev,
        insuranceTotalMember: "",
      }));
    }
  }, [selectedMembers]);


  const handleMember = (type) => {
    if (type == "Family Multi Individual") {
      setSelectedMembers(["Self"]);
      setInsuranceData((prev) => ({
        ...prev,
        members: [{ value: `${getParentUserId()}`, label: "Self" }],
        insurance_total_members: 1
      }));
    }
  }

  const transformOptions = (options) =>
    options.map((opt) => ({
      title: opt.mediclaim_option_text,
      value: opt.mediclaim_option_id, // or keep the original ID if needed
    }));

  useEffect(() => {
    setSelectedinsuranceCategories([]);
  }, [tab])

  return (
    <DatagatherLayout>
      <FintooLoader isLoading={isLoading} />
      <div className="">
        <div className="background-div">
          <div
            className={`bg ${currentUrl.indexOf("datagathering/insurance") > -1 ? "active" : ""
              }`}
            id="bg-insurance"
          ></div>
        </div>
        <div className="white-box">
          <div className="d-flex justify-content-md-center tab-box DGheaderFix">
            <div className="d-flex top-tab-menu income-expense-menu noselect">
              <div
                className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                onClick={() => setTab("tab1")}
              >
                <div className="tab-menu-title">KNOW YOUR MEDICLAIM</div>
              </div>
              <div
                className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                onClick={() => setTab("tab2")}
              >
                <div className="tab-menu-title">INSURANCE</div>
              </div>
            </div>
          </div>
          <div>
            <div className={tab == "tab1" ? "d-block slidesmooth" : "d-none"}>
              {/* <p
               
                className="space75"
              >
                Note : As you have already generated the report you can not edit
                "YOUR INFO" section.
              </p> */}
              <div className="step-progress">
                {totalCount == "0" && (
                  <svg
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
                      id="svgBarkyb"
                      className="cls-1"
                      cx={25}
                      cy={25}
                      r="22.44"
                      fill="transparent"
                      stroke="#042b62"
                      strokeWidth={2}
                      strokeDasharray={141}
                      strokeDashoffset={141}
                      style={{ strokeDashoffset: 140.995 }}
                    />
                  </svg>
                )}
                {totalCount == "1" && (
                  <svg
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
                      id="svgBarkyb"
                      className="cls-1"
                      cx={25}
                      cy={25}
                      r="22.44"
                      fill="transparent"
                      stroke="#042b62"
                      strokeWidth={2}
                      strokeDasharray={141}
                      strokeDashoffset={141}
                      style={{ strokeDashoffset: 93.9965 }}
                    />
                  </svg>
                )}
                {totalCount == "2" && (
                  <svg
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
                      id="svgBarkyb"
                      className="cls-1"
                      cx={25}
                      cy={25}
                      r="22.44"
                      fill="transparent"
                      stroke="#042b62"
                      strokeWidth={2}
                      strokeDasharray={141}
                      strokeDashoffset={141}
                      style={{ strokeDashoffset: 46.9982 }}
                    />
                  </svg>
                )}
                {totalCount == "3" && (
                  <svg
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
                      id="svgBarkyb"
                      className="cls-1"
                      cx={25}
                      cy={25}
                      r="22.44"
                      fill="transparent"
                      stroke="#042b62"
                      strokeWidth={2}
                      strokeDasharray={141}
                      strokeDashoffset={141}
                      style={{ strokeDashoffset: 0 }}
                    />
                  </svg>
                )}
                <span className="value">
                  <span id="svgStepValuekyb">
                    {totalCount <= 3 ? totalCount : 3}
                  </span>
                  /3
                </span>
              </div>
              {mediclaimQues.map((question, index) => (
                <QuizRadio2
                  key={question.mediclaim_question_id}
                  q={question.mediclaim_question_text}
                  number={index + 1}
                  options={transformOptions(question.options)}
                  handleResponse={(e) =>
                    handleResponse(e, question.mediclaim_question_id)
                  }
                  selectedAnswer={selectedAnswer[question.mediclaim_question_id]}
                  setSelectedAnswer={(val) =>
                    setSelectedAnswer((prev) => ({
                      ...prev,
                      [question.mediclaim_question_id]: val,
                    }))
                  }
                />
              ))}
              {/* <QuizRadio2
                q="Do you have any existing medical conditions ?"
                number={1}
                options={[
                  { title: "Yes", value: 1 },
                  { title: "No", value: 2 },
                ]}
                handleResponse={(e) => handleResponse(e, "MQ-1")}
                selectedAnswer={selectedAnswer}
                setSelectedAnswer={setSelectedAnswer}
              />
              <QuizRadio2
                q="In case you need to get hospitalized, which kind of hospital would you prefer?"
                number={2}
                options={[
                  {
                    title:
                      "Reputed Multispeciality Hospital With All Required Facilities",
                    value: 3,
                  },
                  {
                    title: "Mid-Level Hospital With Basic Facilities",
                    value: 2,
                  },
                  {
                    title: "Govt. Hospital",
                    value: 1,
                  },
                ]}
                handleResponse={(e) => handleResponse(e, "MQ-2")}
                selectedAnswer={selectedAnswerr}
                setSelectedAnswer={setSelectedAnswerr}
              />
              <QuizRadio2
                q="How much risk does your daily work require you to take?"
                number={3}
                options={[
                  { title: "High Level Of Risk", value: 1 },
                  { title: "Mid Level Of Risk", value: 2 },
                  {
                    title: "Low Level Of Risk",
                    value: 3,
                  },
                ]}
                handleResponse={(e) => handleResponse(e, "MQ-3")}
                selectedAnswer={selectedAnswerrr}
                setSelectedAnswer={setSelectedAnswerrr}
              /> */}
              <div className="row text-center">
                <div className="btn-container">
                  <div className="d-flex justify-content-center">
                    <Link
                      to={
                        process.env.PUBLIC_URL +
                        "/datagathering/assets-liabilities"
                      }
                    >
                      <div className="previous-btn form-arrow d-flex align-items-center">
                        <FaArrowLeft />
                        <span className="hover-text">&nbsp;Previous</span>
                      </div>
                    </Link>
                    <div
                      className="next-btn form-arrow d-flex align-items-center"
                      onClick={() => {
                        ScrollToTop();
                        setTab("tab2")
                      }
                      }
                    >
                      <span className="hover-text" style={{ maxWidth: 100 }}>
                        Continue&nbsp;
                      </span>
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={tab == "tab2" ? "d-block slidesmooth" : "d-none"}>
              <div className="row">
                <div className="col-md-10 col-12">
                  <div className="">
                    <div className="shimmercard br hide" id="assets-shimmer">
                      <div className="wrapper">
                        <div className="comment br animate w80" />
                        <div className="comment br animate" />
                      </div>
                    </div>
                  </div>
                  <div style={{
                    height: scroll ? "58px" : null,
                  }} className={`d-flex align-items-center mb-2 top-tab-menu justify-content-between FixdgHeader`}>
                    <div className="d-flex align-items-center">
                      {insuranceList && insuranceList.length > 0 && (
                        <FintooCheckbox
                          checked={selectedinsuranceCategories.length === insuranceList.length}
                          onChange={() => {
                            if (selectedinsuranceCategories.length === insuranceList.length) {
                              setSelectedinsuranceCategories([]);
                              setDeleteToggleinsurance(false);
                            } else {
                              const allIds = insuranceList.map(insurance => insurance.name);
                              setSelectedinsuranceCategories(allIds);
                              setDeleteToggleinsurance(true);
                            }
                          }}
                        />
                      )}
                      <div className="inner-box ">
                        <div
                          className="total-amt"
                          style={{
                            fontSize: "1.1rem",
                          }}
                        >
                          {insurnaceTotal > 0
                            ? "Total Insurance :  ₹" + rsFilter(insurnaceTotal)
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div>
                      {
                        selectedinsuranceCategories.length > 0 &&
                        insuranceList.length > 0 &&
                        deletetoggleinsurance == true && (
                          <span
                            onClick={() => {
                              handleShow();
                              // setInsuranceId(i.id),
                              // setInsuranceName(i.user_insurance_name),
                              // setinsuranceCategoryType(
                              //   i.insurance_category_name
                              // );
                            }}
                            style={{
                              marginRight: "2rem",
                              cursor: "pointer "
                            }}
                            className="opt-options-2 pointer"
                          >
                            <MdDelete style={{ color: "#042b62", fontSize: "1.6rem" }} />
                          </span>
                        )
                      }
                    </div>
                  </div>
                  <div className="inner-box">
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

                    {isDataLoading == false &&
                      insuranceList &&
                      insuranceList.length > 0 &&
                      insuranceList.map((i, index) => (
                        <div className="d-flex align-items-center" key={index}>
                          <FintooCheckbox
                            id={i.name}
                            checked={selectedinsuranceCategories.includes(i.name)}
                            title={i.title}
                            onChange={() => {
                              setSelectedinsuranceCategories((prevSelected) => {
                                if (prevSelected.includes(i.name)) {
                                  const updatedSelection = prevSelected.filter((id) => id !== i.name);
                                  setDeleteToggleinsurance(updatedSelection.length > 0); // Check if any checkbox is still selected
                                  return updatedSelection;
                                } else {
                                  setDeleteToggleinsurance(true);
                                  return [...prevSelected, i.name];
                                }
                              });
                            }}
                          />
                          <div key={i} className="inner-container w-100">
                            <h4 className="">
                              {i.insurance_category_type} - {i.user_insurance_name}
                            </h4>

                            <div className="row">
                              <div className="col-md-4">
                                <div className="display-style">
                                  <span>Sum Assured:</span>
                                  <p className="">
                                    ₹{rsFilter(i.user_insurance_sum_assured)}
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="display-style">
                                  <span>Member:</span>
                                  <p className="">
                                    {
                                      i.user_insurance_for === "Family Floater"
                                        ? "Family Floater"
                                        : i.user_insurance_for == "Family Multi Individual"
                                          ? "Family Multi Individual"
                                          : i.user_insurance_for == "Family"
                                            ? "Family"
                                            : i.user_insurance_for
                                              ? i.insurance_for_name
                                              : "Not added"}
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-3">
                                <div className="display-style">
                                  <span>Goal:</span>
                                  <p
                                    className=""
                                    style={{
                                      textOverflow: "ellipsis",
                                      width: "187px",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      textAlign: "left",
                                    }}
                                  >
                                    {
                                      i.user_insurance_automated_linkage === 1 ?
                                        (i.insurance_goal_names ? i.insurance_goal_names : "Not Added") :
                                        "Not Added"
                                    }
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <div className="opt-options">
                                  <span>
                                    <BsPencilFill
                                      onClick={() => {
                                        editInsuranceData(i.name),
                                          setEditFlag(true);
                                      }}
                                    />
                                  </span>

                                  {/* <span
                                  onClick={() => {
                                    handleShow(),
                                      setInsuranceId(i.id),
                                      setInsuranceName(i.user_insurance_name),
                                      setinsuranceCategoryType(
                                        i.insurance_category_name
                                      );
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
                <div className="removefixheader col-md-10 col-12">
                  <div className="accordion mt-4">
                    <div className="accordion-panel active">
                      <div className="accordion-header d-flex justify-content-between">
                        <h4 className="accordion-heading">
                          <img
                            className="accordian-img"
                            src={
                              imagePath +
                              "/static/media/DG/insurance/insurance_insurance_form.svg"
                            }
                          />
                          Insurance
                        </h4>
                        <div
                          onClick={() => setShowView(!showview)}
                          className={`${DGstyles.HideSHowicon} hideShowIconCustom`}
                        >
                          {showview == true ? <>-</> : <>+</>}
                        </div>
                      </div>
                      {showview && (
                        <div
                          className={`accordion-content  family ${DGstyles.bgInsurance}`}
                        >
                          <div className="row py-2">
                            <span>
                              <label className="">
                                Nature Of Payment : ({selectedOption})
                              </label>
                              {/* end ngIf: categorydetail!=''  */}
                            </span>
                            <div className="col-md-10 col-12">
                              <ul className="card-list">
                                {insuOptions.map((v, i) => (
                                  <React.Fragment key={i}>
                                    <li
                                      onClick={() => {
                                        setSelectedOption(
                                          v.insurance_category_name
                                        );
                                        setHandleError({
                                          ...defaultHandleError,
                                        });
                                        setInsuranceData({
                                          ...defaultInsuranceData,
                                          user_insurance_name: v.title,
                                          insurance_cat_uuid: v.insurance_cat_uuid,
                                          insurance_category_name:
                                            v.insurance_category_name,
                                          user_insurance_user_id: getParentUserId(),
                                        });

                                        setEditFlag(false);
                                        // scrollToInsuranceForm();
                                        scrollToinsuranceRef();
                                        setGoalSelected(false);
                                        setSelectedGoals("Automated Linkage");
                                        setSelectedGoalsId(false);
                                        setLinkageDetails([])
                                        setSelectedPriorityArray([]);
                                        setAutoMatedGoal(true);
                                        getGoalsList();
                                        setSelectedMembers([]);
                                      }}
                                      className={`li-options ${selectedOption == v.title
                                        ? "active"
                                        : ""
                                        }`}
                                    >
                                      {/* <input type="radio" value="One Time" id="type-5" name="type" data-show=".recurring-group" // ref="Father" ng-model="family.relation_id" className="" > */}
                                      <label htmlFor="type-2">
                                        <img alt={v.title} src={v.image} />
                                        {v.title}
                                      </label>
                                    </li>
                                  </React.Fragment>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div ref={cntRef}>
                            <form noValidate="novalidate" name="goldassetform">
                              <div className="row d-flex align-items-center">
                                <div className="col-md-5 col-12 custom-input">
                                  {insuranceData.insurance_cat_uuid !==
                                    "ulip" && (
                                      <div className="flex-grow-1">
                                        <div
                                          className={`form-group w-100 ${insuranceData.user_insurance_name
                                            ? "inputData"
                                            : null
                                            }`}
                                          style={{ paddingTop: "19px" }}
                                        >
                                          <input
                                            type="text"
                                            name="user_insurance_name"
                                            id="user_insurance_name"
                                            value={insuranceData.user_insurance_name}
                                            onChange={(e) => {
                                              setInsuranceData({
                                                ...insuranceData,
                                                user_insurance_name: e.target.value,
                                              });
                                              handleInsuranceName(e.target.value);
                                            }}
                                            autoComplete="off"
                                          />
                                          <span className="highlight"></span>
                                          <span className="bar"></span>
                                          <label htmlFor="name">Name of Plan*</label>
                                        </div>
                                        <div className="error">
                                          {handleError.insuranceName}
                                        </div>
                                      </div>
                                    )}
                                  {insuranceData.insurance_cat_uuid ==
                                    "ulip" && (
                                      <div className="flex-grow-1">
                                        {/* <FloatingLabel
                                          controlId="floatingInput"
                                          label=""
                                          className="material"
                                        ></FloatingLabel> */}
                                        <Select
                                          classNamePrefix="sortSelect"
                                          isSearchable={true}
                                          styles={customStyles}
                                          placeholder="Start typing to search for your ULIP"
                                          // onChange={(v) => toggleSort(v.value)}
                                          // value={sortOptions.filter((v) => v.value == params.sort)}
                                          onChange={(e) => {
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_name: e.label,
                                              user_insurance_ulip_sec_id: e.value,
                                              ulip_data: {
                                                share_name: e.label,
                                                ms_secid: e.value,
                                              },
                                            });
                                          }}
                                          value={ulipFund.filter(
                                            (e) =>
                                              e.label ==
                                              insuranceData["ulip_data"]
                                                .share_name
                                          )}
                                          options={ulipFund}
                                        />
                                        <div className="error">
                                          {handleError.insuranceName}
                                        </div>
                                      </div>
                                    )}
                                </div>
                                <div className="col-md-5 pt-1 col-12">
                                  <div className="material">
                                    <Form.Label>Insurance For*</Form.Label>
                                    <Select
                                      classNamePrefix="sortSelect"
                                      isSearchable={false}
                                      styles={customStyles}
                                      // onChange={(v) => toggleSort(v.value)}
                                      // value={sortOptions.filter((v) => v.value == params.sort)}
                                      onChange={(e) => {
                                        setInsuranceData({
                                          ...insuranceData,
                                          insurance_for_member: e.value,
                                        });
                                        handleMember(e.value);
                                      }}
                                      value={memberdata.filter(
                                        (e) =>
                                          e.value ==
                                          insuranceData.insurance_for_member
                                      )}
                                      options={memberdata}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row py-2 mt-3 d-flex align-items-center">
                                <div className="col-md-5 col-12 custom-input">
                                  <div
                                    className={`form-group  w-100 ${insuranceData.user_insurance_premium_amount
                                      ? "inputData"
                                      : null
                                      }`}
                                  // style={{paddingTop : "19px"}}
                                  >
                                    <input
                                      type="text"
                                      id="user_insurance_premium_amount"
                                      name="user_insurance_premium_amount"
                                      pattern="[0-9]*"
                                      minLength={1}
                                      maxLength={9}
                                      value={
                                        insuranceData.user_insurance_premium_amount
                                      }
                                      onChange={(e) => {
                                        const inputValue = e.target.value;
                                        if (inputValue.length <= 9 && /^\d*$/.test(inputValue)) {
                                          setInsuranceData({
                                            ...insuranceData,
                                            user_insurance_premium_amount: e.target
                                              .validity.valid
                                              ? e.target.value
                                              : insuranceData.user_insurance_premium_amount,
                                          });
                                          handlePremiumValue(inputValue);
                                        }
                                      }}
                                      autoComplete="off"
                                    />
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label htmlFor="name">
                                      Premium Amount (₹)*
                                    </label>
                                  </div>
                                  <div className="error">
                                    {handleError.insurancePremiunAmount}
                                  </div>
                                </div>
                                <div className="col-md-5 col-12 custom-input">
                                  <div
                                    className={`form-group w-100 ${insuranceData.user_insurance_sum_assured
                                      ? "inputData"
                                      : null
                                      }`}
                                  // style={{paddingTop : "19px"}}
                                  >
                                    <input
                                      type="text"
                                      name="user_insurance_premium_amount"
                                      id="user_insurance_sum_assured"
                                      pattern="[0-9]*"
                                      minLength={1}
                                      maxLength={9}
                                      value={
                                        insuranceData.user_insurance_sum_assured
                                      }
                                      onChange={(e) => {
                                        setInsuranceData({
                                          ...insuranceData,
                                          user_insurance_sum_assured: e.target
                                            .validity.valid
                                            ? e.target.value
                                            : insuranceData.user_insurance_sum_assured,
                                        });
                                        handleSumAssured(e.target.value);
                                      }}
                                      autoComplete="off"
                                    />
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label htmlFor="name">Sum Assured(₹)*</label>
                                  </div>
                                  <div className="error">
                                    {handleError.insuranceSumAssured}
                                  </div>
                                </div>
                              </div>
                              {insuranceData.insurance_cat_uuid == "term_plan" && (
                                <>
                                  <div className="row py-2 d-flex align-items-center">
                                    <div className="col-md-5 col-12 custom-input">
                                      <div
                                        className={`form-group  w-100 ${insuranceData.user_insurance_maturity_amount ==
                                          0
                                          ? "inputData"
                                          : insuranceData.user_insurance_maturity_amount
                                            ? "inputData"
                                            : null
                                          }`}
                                      >
                                        <input
                                          type="text"
                                          name="user_insurance_maturity_amount"
                                          id="user_insurance_maturity_amount"
                                          pattern="[0-9]*"
                                          minLength={1}
                                          maxLength={9}
                                          value={
                                            insuranceData.user_insurance_maturity_amount
                                          }
                                          onChange={(e) => {
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_maturity_amount: e
                                                .target.validity.valid
                                                ? e.target.value
                                                : insuranceData.user_insurance_maturity_amount,
                                            });
                                            // handlePremiumValue(e.target.value);
                                          }}
                                          autoComplete="off"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">
                                          Insurance Maturity Amount If Any (₹)
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-2">
                                    <div className="col-md-5 col-12 mt-1">
                                      <div className="material">
                                        <Form.Label>
                                          Premium Payment Frequency*
                                        </Form.Label>
                                        <Select
                                          classNamePrefix="sortSelect"
                                          isSearchable={false}
                                          styles={customStyles}
                                          onChange={(v) =>
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_premium_freq:
                                                v.value,
                                            })
                                          }
                                          value={sortOptionsPaymentt.filter(
                                            (v) =>
                                              v.value ==
                                              insuranceData.user_insurance_premium_freq
                                          )}
                                          options={sortOptionsPaymentt}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {insuranceData.insurance_cat_uuid == "ulip" && (
                                <>
                                  <div className="row py-2 d-flex align-items-center">
                                    <div className="col-md-5 col-12 custom-input">
                                      <div
                                        className={`form-group  w-100 ${insuranceData.user_insurance_current_fund_value ==
                                          0
                                          ? "inputData"
                                          : insuranceData.user_insurance_current_fund_value
                                            ? "inputData"
                                            : null
                                          }`}
                                      >
                                        <input
                                          type="text"
                                          name="user_insurance_current_fund_value"
                                          id="user_insurance_current_fund_value"
                                          pattern="[0-9]*"
                                          value={
                                            insuranceData.user_insurance_current_fund_value
                                          }
                                          onChange={(e) => {
                                            if (e.target.value <= 9) {
                                              setInsuranceData({
                                                ...insuranceData,
                                                user_insurance_current_fund_value: e
                                                  .target.validity.valid
                                                  ? e.target.value
                                                  : insuranceData.user_insurance_current_fund_value,
                                              });
                                            }
                                          }}
                                          autoComplete="off"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">
                                          Current Fund Value (₹)
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-md-5 col-12 custom-input">
                                      <div
                                        className={`form-group w-100 ${insuranceData.user_insurance_surrender_value
                                          ? "inputData"
                                          : null
                                          }`}
                                      >
                                        <input
                                          type="text"
                                          name="user_insurance_surrender_value"
                                          id="user_insurance_surrender_value"
                                          pattern="[0-9]*"
                                          value={
                                            insuranceData.user_insurance_surrender_value
                                          }
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (inputValue.length <= 9) {
                                              setInsuranceData({
                                                ...insuranceData,
                                                user_insurance_surrender_value: e
                                                  .target.validity.valid
                                                  ? e.target.value
                                                  : insuranceData.user_insurance_surrender_value,
                                              });
                                            }
                                          }}
                                          autoComplete="off"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">
                                          Surrender Value(₹)
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-5 mt-2  col-12 ">
                                    <div className="material">
                                      <Form.Label>
                                        Premium Payment Frequency*
                                      </Form.Label>
                                      <Select
                                        classNamePrefix="sortSelect"
                                        isSearchable={false}
                                        styles={customStyles}
                                        onChange={(v) =>
                                          setInsuranceData({
                                            ...insuranceData,
                                            user_insurance_premium_freq: v.value,
                                          })
                                        }
                                        value={sortOptionsPaymentt.filter(
                                          (v) =>
                                            v.value ==
                                            insuranceData.user_insurance_premium_freq
                                        )}
                                        options={sortOptionsPaymentt}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                              {insuranceData.insurance_cat_uuid == "mediclaim" && (
                                <>
                                  <div className="row py-3">
                                    <div
                                      className="col-md-5 col-12 custom-input"
                                      style={{ paddingTop: "" }}
                                    >
                                      <div
                                        className={`form-group  w-100  ${insuranceData.user_insurance_topup
                                          ? "inputData"
                                          : insuranceData.user_insurance_topup ==
                                            0
                                            ? "inputData"
                                            : null
                                          }`}
                                      >
                                        <input
                                          type="text"
                                          name="user_insurance_topup"
                                          id="user_insurance_topup"
                                          pattern="[0-9]*"
                                          minLength={1}
                                          maxLength={9}
                                          className=""
                                          value={
                                            insuranceData.user_insurance_topup
                                          }
                                          onChange={(e) => {
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_topup: e.target
                                                .validity.valid
                                                ? e.target.value
                                                : insuranceData.user_insurance_topup,
                                            });
                                            // handlePremiumValue(e.target.value);
                                          }}
                                          autoComplete="off"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">Top Up (₹)</label>
                                      </div>
                                    </div>
                                    <div className="col-md-5  col-12">
                                      <div className="material">
                                        <Form.Label>
                                          Premium Payment Frequency*
                                        </Form.Label>
                                        <Select
                                          classNamePrefix="sortSelect"
                                          isSearchable={false}
                                          styles={customStyles}
                                          onChange={(v) =>
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_premium_freq:
                                                v.value,
                                            })
                                          }
                                          value={sortOptionsPayment.filter(
                                            (v) =>
                                              v.value ==
                                              insuranceData.user_insurance_premium_freq
                                          )}
                                          options={sortOptionsPayment}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {insuranceData.insurance_cat_uuid == "general" && (
                                <>
                                  <div className="row py-3">
                                    <div
                                      className="col-md-5 col-12 custom-input"
                                      style={{ paddingTop: "9px" }}
                                    >
                                      <div
                                        className={`form-group  w-100  ${insuranceData.user_insurance_topup
                                          ? "inputData"
                                          : insuranceData.user_insurance_topup ==
                                            0
                                            ? "inputData"
                                            : null
                                          }`}
                                      >
                                        <input
                                          type="text"
                                          name="insurance_premium_topup_s"
                                          id="insurance_premium_topup_s"
                                          pattern="[0-9]*"
                                          minLength={1}
                                          className="pt-1"
                                          maxLength={9}
                                          value={
                                            insuranceData.user_insurance_topup
                                          }
                                          onChange={(e) => {
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_topup: e.target
                                                .validity.valid
                                                ? e.target.value
                                                : insuranceData.user_insurance_topup,
                                            });
                                          }}
                                          autoComplete="off"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">Top Up (₹)</label>
                                      </div>
                                    </div>
                                    <div
                                      className="col-md-5 col-12"
                                      style={{ position: "relative" }}
                                    >
                                      <div className="material">
                                        <Form.Label>
                                          Type of Insurance*
                                        </Form.Label>
                                        <Select
                                          classNamePrefix="sortSelect"
                                          isSearchable={false}
                                          styles={customStyles}
                                          onChange={(v) => {
                                            setInsuranceData({
                                              ...insuranceData,
                                              insurance_type_id: v.value,
                                            });
                                            handleInsuranceType(v.value);
                                          }}
                                          value={insurancetype.filter(
                                            (v) =>
                                              v.value ==
                                              insuranceData.insurance_type_id
                                          )}
                                          options={insurancetype}
                                        />
                                        <div
                                          style={{
                                            position: "absolute",
                                            bottom: "-22px",
                                          }}
                                          className="error"
                                        >
                                          {handleError.insuranceType}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row py-3">
                                    <div className="col-md-5 col-12">
                                      <div className="material">
                                        <Form.Label>
                                          Premium Payment Frequency*
                                        </Form.Label>
                                        <Select
                                          classNamePrefix="sortSelect"
                                          isSearchable={false}
                                          styles={customStyles}
                                          onChange={(v) =>
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_premium_freq:
                                                v.value,
                                            })
                                          }
                                          value={sortOptionsPayment.filter(
                                            (v) =>
                                              v.value ==
                                              insuranceData.user_insurance_premium_freq
                                          )}
                                          options={sortOptionsPayment}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 col-12">
                                      <div className="material">
                                        <Form.Label>
                                          Inflation Rate (%)* :{" "}
                                          {insuranceData.user_insurance_inflation_rate}
                                        </Form.Label>
                                        <Slider
                                          min={0}
                                          max={30}
                                          step={1}
                                          value={insuranceData.user_insurance_inflation_rate}
                                          onChange={(x) =>
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_inflation_rate:
                                                Math.round(
                                                  (parseFloat(x) +
                                                    Number.EPSILON) *
                                                  100
                                                ) / 100,
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              {(insuranceData.insurance_cat_uuid == "endowment" ||
                                insuranceData.insurance_cat_uuid == "guaranteed_income_plan" ||
                                insuranceData.insurance_cat_uuid == "pension_plan" ||
                                insuranceData.insurance_cat_uuid == "others") && (
                                  <div className="row d-flex align-items-center  py-2">
                                    <div className="col-md-5 col-12">
                                      <div className="material">
                                        <Form.Label>
                                          Premium Payment Frequency*
                                        </Form.Label>
                                        <Select
                                          classNamePrefix="sortSelect"
                                          isSearchable={false}
                                          styles={customStyles}
                                          onChange={(v) =>
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_premium_freq: v.value,
                                            })
                                          }
                                          value={sortOptionsPaymentt.filter(
                                            (v) =>
                                              v.value ==
                                              insuranceData.user_insurance_premium_freq
                                          )}
                                          options={sortOptionsPaymentt}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-5 col-12 custom-input">
                                      <div
                                        className={`form-group w-100 ${insuranceData.user_insurance_surrender_value
                                          ? "inputData"
                                          : null
                                          }`}
                                        style={{ paddingTop: "15px" }}
                                      >
                                        <input
                                          type="text"
                                          name="insurance_surrender_value_s"
                                          id="insurance_surrender_value_ss"
                                          pattern="[0-9]*"
                                          value={
                                            insuranceData.user_insurance_surrender_value
                                          }
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (inputValue.length <= 9) {
                                              setInsuranceData({
                                                ...insuranceData,
                                                user_insurance_surrender_value: e
                                                  .target.validity.valid
                                                  ? e.target.value
                                                  : insuranceData.user_insurance_surrender_value,
                                              });
                                            }
                                          }}
                                          autoComplete="off"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">
                                          Surrender Value(₹)
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              <div className="row mt-2 d-flex align-items-center">
                                <div className="col-md-5 col-12">
                                  <div className="dark-label">
                                    <Form.Label>Date of Purchase*</Form.Label>
                                    <div
                                      className="dt-conbx"
                                      style={{
                                        borderBottom: "1px solid #dadada",
                                      }}
                                    >
                                      <ReactDatePicker
                                        className="pt-4"
                                        select_date={moment(
                                          insuranceData.user_insurance_start_date,
                                          "DD/MM/YYYY"
                                        ).toDate()}
                                        setDate={(date) => {
                                          setDate(date, "purcDate");
                                          // handleStartDate(date);
                                        }}
                                        minDate={""}
                                        maxDate={moment().toDate()}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {insuranceData["user_insurance_premium_freq"] ==
                                  "One Time" ? (
                                  <>
                                    <div className="col-md-5 col-12 custom-input">

                                      <div
                                        className={`form-group  w-100 ${insuranceData.user_insurance_policy_term ==
                                          0
                                          ? "inputData"
                                          : insuranceData.user_insurance_policy_term
                                            ? "inputData"
                                            : null
                                          }`}
                                        style={{
                                          paddingTop:
                                            insuranceData[
                                              "user_insurance_premium_freq"
                                            ] == "One Time"
                                              ? "24.5px"
                                              : "0px",
                                        }}
                                      >
                                        <input
                                          type="text"
                                          name="insurance_policyterm_s"
                                          id="insurance_policyterm_s"
                                          pattern="[0-9]*"
                                          maxLength={100}
                                          value={
                                            insuranceData.user_insurance_policy_term
                                          }
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (inputValue.length <= 3) {
                                              setInsuranceData({
                                                ...insuranceData,
                                                user_insurance_policy_term:
                                                  e.target.value,
                                              });
                                              handlePolicyTerm(e.target.value);
                                            }
                                          }}
                                          required
                                          autoComplete="off"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">
                                          Policy Term (Years)*
                                        </label>
                                      </div>
                                      <div className="error">
                                        {handleError.insurancePolicyTerm}
                                      </div>
                                    </div>
                                    <div className="row d-flex align-items-center  py-2">
                                      <div className="col-md-5 col-12 custom-input">
                                        <div
                                          className={`form-group  w-100 ${insuranceData.user_insurance_policy_number ==
                                            0
                                            ? "inputData"
                                            : insuranceData.user_insurance_policy_number
                                              ? "inputData"
                                              : null
                                            }`}
                                          style={{
                                            paddingTop:
                                              insuranceData[
                                                "user_insurance_premium_freq"
                                              ] == "One Time"
                                                ? "24.5px"
                                                : "0px",
                                          }}
                                        >
                                          <input
                                            type="number"
                                            name="insurance_policynumber_s"
                                            id="Policy_Number"
                                            maxLength={12}
                                            pattern="[0-9]*"
                                            value={
                                              insuranceData.user_insurance_policy_number
                                            }
                                            onChange={(e) => {

                                              setInsuranceData({
                                                ...insuranceData,
                                                user_insurance_policy_number:
                                                  e.target.value,
                                              });
                                              handlePolicyNumber(e.target.value)
                                            }}
                                            required
                                            autoComplete="off"
                                          />
                                          <span className="highlight"></span>
                                          <span className="bar"></span>
                                          <label htmlFor="name">
                                            Policy Number
                                          </label>
                                        </div>
                                        <div className="error">
                                          {handleError.insurancePolicyNumber}
                                        </div>
                                      </div>
                                    </div>

                                  </>
                                ) : (
                                  <>
                                    <div
                                      className="col-md-5  col-12"
                                      style={{ position: "relative" }}
                                    >
                                      {oneTimeFlag != true && (
                                        <div
                                          className="dark-label"
                                          style={{
                                            paddingTop:
                                              insuranceData[
                                                "user_insurance_premium_freq"
                                              ] !== "One Time"
                                                ? "3px"
                                                : "0px",
                                          }}
                                        >
                                          <Form.Label>
                                            Premium Payment End Date*
                                          </Form.Label>
                                          <div
                                            className="dt-conbx"
                                            style={{
                                              borderBottom: "1px solid #dadada",
                                            }}
                                          >
                                            <ReactDatePicker
                                              className="pt-4"
                                              select_date={moment(
                                                insuranceData.user_insurance_end_date,
                                                "DD/MM/YYYY"
                                              ).toDate()}
                                              setDate={(date) => {
                                                setDate(date, "paymetEndDate");
                                                handlePremiumPaymentEndDate(date);
                                              }}
                                              minDate={moment(insuranceData.user_insurance_start_date, "DD/MM/YYYY")
                                                .add(1, "y")
                                                .toDate()}
                                              maxDate={""}
                                            />
                                          </div>
                                          <div
                                            className="error"
                                            style={{
                                              position: "absolute",
                                              bottom: "-22px",
                                            }}
                                          >
                                            {
                                              handleError.insurancePremiumPaymentEndDate
                                            }
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                              {insuranceData["user_insurance_premium_freq"] !==
                                "One Time" ? (
                                <>
                                  <div className="row d-flex align-items-center  py-2">
                                    <div className="col-md-5 col-12   custom-input">
                                      <div
                                        className={`form-group mt-4 w-100 ${insuranceData.user_insurance_policy_term == 0
                                          ? "inputData"
                                          : insuranceData.user_insurance_policy_term
                                            ? "inputData"
                                            : null
                                          }`}
                                      >
                                        <input
                                          type="text"
                                          id="insurance_policyterm_w"
                                          name="insurance_policyterm_w"
                                          pattern="[0-9]*"
                                          minLength={1}
                                          maxLength={100}
                                          value={
                                            insuranceData.user_insurance_policy_term
                                          }
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            if (inputValue.length <= 3) {
                                              setInsuranceData({
                                                ...insuranceData,
                                                user_insurance_policy_term:
                                                  e.target.value,
                                              });
                                              handlePolicyTerm(e.target.value);
                                            }
                                          }}
                                          required
                                          autoComplete="off"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">
                                          Policy Term (Years)*
                                        </label>
                                        <div className="error">
                                          {handleError.insurancePolicyTerm}
                                        </div>
                                      </div>

                                    </div>
                                    <div className="col-md-5 col-12   custom-input">
                                      <div
                                        className={`form-group mt-4 w-100 ${insuranceData.user_insurance_policy_number == 0
                                          ? "inputData"
                                          : insuranceData.user_insurance_policy_number
                                            ? "inputData"
                                            : null
                                          }`}
                                      >
                                        <input
                                          type="number"
                                          id="insurance_policynumber_w"
                                          name="insurance_policynumber_w"
                                          pattern="[0-9]*"
                                          minLength={6}
                                          maxLength={12}
                                          value={
                                            insuranceData.user_insurance_policy_number
                                          }
                                          onChange={(e) => {
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_policy_number:
                                               e.target.value
                                            });
                                            handlePolicyNumber(e.target.value)
                                          }}
                                          required
                                          autoComplete="off"
                                        />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">
                                          Policy Number
                                        </label>
                                        <div className="error">
                                          {handleError.insurancePolicyNumber}
                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </>
                              ) : (
                                <></>
                              )}
                              {insuranceData.insurance_cat_uuid != "term_plan" &&
                                insuranceData.insurance_cat_uuid != "general" &&
                                insuranceData.insurance_cat_uuid != "mediclaim" && (
                                  <>
                                    <div className="row py-md-2  py-2">
                                      <div className="col-md-10 col-12">
                                        <div className="d-md-flex d-grid ">
                                          <Form.Label className="">
                                            Consider This Insurance In Automated
                                            Linkage*
                                          </Form.Label>
                                          <div>
                                            <div className="d-flex  ">
                                              <div className="ps-md-3  info-hover-left-box">
                                                <span className="icon">
                                                  <img
                                                    alt="More information"
                                                    src={imagePath + '/static/media/more_information.svg'}
                                                  />
                                                </span>
                                                <span className="msg">
                                                  Select a goal below to map
                                                  this insurance with a goal of
                                                  your choice. Otherwise, Fintoo
                                                  will link it automatically
                                                  with your high priority goal.
                                                  In case, you do not wish to
                                                  utilize this insurance for any
                                                  goal, select "NO".
                                                </span>
                                              </div>
                                              <div className="d-flex ps-4">
                                                <div>No</div>
                                                <Switch
                                                  onChange={(e) =>
                                                    setInsuranceData({
                                                      ...insuranceData,
                                                      user_insurance_automated_linkage: e == true ? "1" : "0",
                                                    })
                                                  }
                                                  checked={
                                                    insuranceData.user_insurance_automated_linkage == "1"
                                                  }
                                                  className="react-switch px-2"
                                                  activeBoxShadow="0 0 2px 3px #042b62"
                                                  uncheckedIcon={false}
                                                  checkedIcon={false}
                                                  height={20}
                                                  width={40}
                                                  onColor="#042b62"
                                                  offColor="#d8dae5"
                                                />
                                                <div>Yes</div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {insuranceData.user_insurance_automated_linkage ==
                                      "1" && (
                                        <>
                                          <div className="row py-md-2">
                                            <div className="col-md-8 mt-md-2">
                                              <div className="d-md-flex">
                                                <Form.Label>
                                                  Link This Insurance To Goals
                                                </Form.Label>
                                                <span
                                                  className="ms-md-4 info-hover-left-box float-right"
                                                  style={{
                                                    position:
                                                      "relative !important",
                                                  }}
                                                >
                                                  <span className="icon">
                                                    <img
                                                      alt="More information"
                                                      src={imagePath + '/static/media/more_information.svg'}
                                                    />
                                                  </span>
                                                  <span className="msg">
                                                    You can only assign goals
                                                    which are prior to the end
                                                    date of the SIP, if any
                                                  </span>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row ">
                                            <div className="col-md- col-12">
                                              <div className="material arrowSpace">
                                                <div className="">
                                                  <br></br>
                                                  <div
                                                    className="m-0 btn-sm default-btn gradient-btn save-btn"
                                                    onClick={() =>
                                                      setGoalSelected(true)
                                                    }
                                                  >
                                                    Select Goals
                                                  </div>
                                                  <br></br>
                                                  <br></br>

                                                  {selectedGoals ? (
                                                    <div
                                                      style={{
                                                        textAlign:
                                                          "left!important",
                                                      }}
                                                    >
                                                      <b>Selected Goals : </b>{" "}
                                                      {selectedGoals}
                                                    </div>
                                                  ) : (
                                                    ""
                                                  )}

                                                  {isGoalSelected ? (
                                                    <GoalsDropdown
                                                      insuranceData={
                                                        insuranceData
                                                      }
                                                      setGoalSelected={
                                                        setGoalSelected
                                                      }
                                                      goals={goaldata}
                                                      unchangedgoaldata={
                                                        unchangedgoaldata
                                                      }
                                                      closeModal={closeModal}
                                                      selectGoals={selectGoals}
                                                      selectedGoals={
                                                        selectedGoals
                                                      }
                                                      selectedGoalIdArray={
                                                        selectedGoalIdArray
                                                      }
                                                      selectedGoalsId={
                                                        selectedGoalsId
                                                      }
                                                      setPriorityArray={
                                                        setPriorityArray
                                                      }
                                                      selectedPriorityArray={
                                                        selectedPriorityArray
                                                      }
                                                      setAutoMatedGoal={
                                                        setAutoMatedGoal
                                                      }
                                                      isAutoMatedGoal={
                                                        isAutoMatedGoal
                                                      }
                                                      setGoalLink={setGoalLink}
                                                      insurancePolicyTerm={
                                                        insuranceData.user_insurance_policy_term
                                                      }
                                                      insurancePurchaseDate={
                                                        insuranceData.user_insurance_start_date
                                                      }
                                                      insuranceCategoryId={
                                                        insuranceData.insurance_cat_uuid
                                                      }
                                                      type={"Insurance"}
                                                    ></GoalsDropdown>
                                                  ) : (
                                                    ""
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                  </>
                                )}

                              {insuranceData.insurance_cat_uuid != "term_plan" &&
                                // insuranceData.insurance_cat_uuid != 44 &&
                                insuranceData.insurance_cat_uuid != "general" &&
                                insuranceData.insurance_cat_uuid != "mediclaim" && (
                                  <>
                                    <div className="row py-3">
                                      <div className="col-md-10 col-12">
                                        <div className="d-md-flex d-grid py-2">
                                          <Form.Label className="">
                                            Is The Maturity One Time Or
                                            Recurring?*
                                          </Form.Label>

                                          <div className="d-flex ms-md-5 ">
                                            <div> One Time</div>
                                            <Switch
                                              onChange={(e) =>
                                                setInsuranceData({
                                                  ...insuranceData,
                                                  user_insurance_occurance: e == true ? "Recurring" : "One Time",
                                                })
                                              }
                                              checked={
                                                insuranceData.user_insurance_occurance == "Recurring"
                                              }
                                              className="react-switch px-2"
                                              activeBoxShadow="0 0 2px 3px #042b62"
                                              uncheckedIcon={false}
                                              checkedIcon={false}
                                              height={20}
                                              width={40}
                                              onColor="#042b62"
                                              offColor="#d8dae5"
                                            />
                                            <div>Recurring</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {insuranceData.user_insurance_occurance ==
                                      "Recurring" && (
                                        <>
                                          {inputFields.map((data, index) => {
                                            return (
                                              <div
                                                className="row py-md-3 py-2"
                                                key={index}
                                              >
                                                <div className="col-md-9 col-12 addMaturity ">
                                                  <div className="dark-label">
                                                    <Form.Label>Start Date*</Form.Label>
                                                    <div
                                                      className="dt-conbx"
                                                      style={{ borderBottom: "1px solid #dadada" }}
                                                    >
                                                      <ReactDatePicker
                                                        className="pt-2"
                                                        select_date={moment(data.start_date, "DD/MM/YYYY").toDate()}
                                                        setDate={(date) => {
                                                          const formattedStart = moment(date).format("DD/MM/YYYY");

                                                          setInputFields((v) =>
                                                            v.map((v, i) => {
                                                              if (index === i) {
                                                                v.start_date = formattedStart;

                                                                // Auto set End Date = Start Date + 1 month + 1 day
                                                                v.end_date = moment(date)
                                                                  .add(1, "month")
                                                                  .add(1, "day")
                                                                  .format("DD/MM/YYYY");
                                                              }
                                                              return v;
                                                            })
                                                          );

                                                          setFrequencyChange((v) => ++v);
                                                        }}
                                                        minDate={
                                                          Boolean(inputFields[index - 1]) &&
                                                            inputFields[index - 1]["end_date"]
                                                            ? moment(inputFields[index - 1]["end_date"], "DD/MM/YYYY")
                                                              .add(1, "day")
                                                              .toDate()
                                                            : moment(
                                                              insuranceData.user_insurance_start_date,
                                                              "DD/MM/YYYY"
                                                            ).toDate()
                                                        }
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="ms-2 dark-label">
                                                    <Form.Label>End Date*</Form.Label>
                                                    <div
                                                      className="dt-conbx"
                                                      style={{ borderBottom: "1px solid #dadada" }}
                                                    >
                                                      <ReactDatePicker
                                                        className="pt-4"
                                                        select_date={moment(data.end_date, "DD/MM/YYYY").toDate()}
                                                        setDate={(date) => {
                                                          const formattedEnd = moment(date).format("DD/MM/YYYY");

                                                          setInputFields((v) =>
                                                            v.map((v, i) => {
                                                              if (index === i) {
                                                                v.end_date = formattedEnd;
                                                              }
                                                              return v;
                                                            })
                                                          );

                                                          setFrequencyChange((v) => ++v);
                                                        }}
                                                        // Disable all dates before Start Date + 1 month + 1 day
                                                        minDate={
                                                          data.start_date
                                                            ? moment(data.start_date, "DD/MM/YYYY")
                                                              .add(1, "month")
                                                              .add(1, "day")
                                                              .toDate()
                                                            : moment().toDate()
                                                        }
                                                        disabled={!data.start_date} // disable until Start Date is picked
                                                      />
                                                    </div>
                                                  </div>

                                                  <div className="custom-input ms-2">
                                                    <div
                                                      className={`form-group ${data.amount
                                                        ? "inputData"
                                                        : null
                                                        }`}
                                                      style={{
                                                        paddingTop: "12.3px",
                                                      }}
                                                    >
                                                      <input
                                                        type="number"
                                                        name="amount"
                                                        id="amount"
                                                        pattern="[0-9]*"
                                                        value={
                                                          data.amount
                                                        }
                                                        onChange={(e) => {
                                                          const inputValue =
                                                            e.target.value;
                                                          if (
                                                            inputValue.length <=
                                                            9
                                                          ) {
                                                            // setInsuranceData({
                                                            //   ...insuranceData,
                                                            //   insurance_recurring_amount:
                                                            //     e.target.validity
                                                            //       .valid
                                                            //       ? e.target.value
                                                            //       : insuranceData.insurance_recurring_amount,
                                                            // });
                                                            setInputFields(
                                                              (v) => {
                                                                return v.map(
                                                                  (v, i) => {
                                                                    if (
                                                                      index == i
                                                                    ) {
                                                                      v.amount =
                                                                        e.target.value;
                                                                    }
                                                                    return v;
                                                                  }
                                                                );
                                                              }
                                                            );
                                                            // handelInsuranceAmount(
                                                            //   e.target.value
                                                            // );
                                                          }
                                                        }}
                                                        required
                                                        autoComplete="off"
                                                      />
                                                      <span className="highlight"></span>
                                                      <span className="bar"></span>
                                                      <label htmlFor="name">
                                                        Amount (₹)*
                                                      </label>
                                                    </div>

                                                    {/* <div className="error">
                                                        {
                                                          handleError.insuranceAmount
                                                        }
                                                      </div> */}
                                                  </div>
                                                  <div className="ms-2 mt-1">
                                                    <div
                                                      className="material"
                                                      style={{ marginTop: "7px" }}
                                                    >
                                                      <Form.Label>
                                                        Frequency*
                                                      </Form.Label>
                                                      <Select
                                                        classNamePrefix="sortSelect"
                                                        isSearchable={false}
                                                        styles={customStyles}
                                                        onChange={(e) => {
                                                          setInputFields((v) => {
                                                            return v.map(
                                                              (v, i) => {
                                                                if (index == i) {
                                                                  v.frequency =
                                                                    e.value;
                                                                }
                                                                return v;
                                                              }
                                                            );
                                                          });
                                                          setFrequencyChange(
                                                            (v) => ++v
                                                          );
                                                        }}
                                                        // value={sortOptionsFrequency.filter(
                                                        //   (v) =>
                                                        //     v.value ==
                                                        //     insuranceData.insurance_frequency
                                                        // )}
                                                        value={sortOptionsFrequency.find(
                                                          (option) =>
                                                            option.value ===
                                                            data.frequency ??
                                                            "1"
                                                        )}
                                                        options={
                                                          sortOptionsFrequency
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-md-3">
                                                  <div className="d-flex mt-md-2">
                                                    <button
                                                      style={{
                                                        width: "max-content",
                                                      }}
                                                      type="button"
                                                      onClick={() => {
                                                        removeInputFields(index);
                                                      }}
                                                      className="default-btn"
                                                    >
                                                      Remove
                                                    </button>
                                                    <button
                                                      type="button"
                                                      style={{
                                                        width: "max-content",
                                                        whiteSpace: "nowrap",
                                                      }}
                                                      onClick={addInputField}
                                                      className={`default-btn ms-4 ${inputFields.length == 5 ||
                                                        index !=
                                                        inputFields.length - 1
                                                        ? "d-none"
                                                        : ""
                                                        }`}
                                                    >
                                                      Add more
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </>
                                      )}
                                  </>
                                )}

                              {insuranceData.insurance_cat_uuid == "mediclaim" && (
                                <>
                                  <div className="col-md-5 col-12">
                                    <div className="material">
                                      <Form.Label>
                                        Inflation Rate (%)* :{" "}
                                        {insuranceData.user_insurance_inflation_rate}
                                      </Form.Label>
                                      <Slider
                                        min={0}
                                        max={30}
                                        step={1}
                                        value={insuranceData.user_insurance_inflation_rate}
                                        onChange={(x) =>
                                          setInsuranceData({
                                            ...insuranceData,
                                            user_insurance_inflation_rate:
                                              Math.round(
                                                (parseFloat(x) +
                                                  Number.EPSILON) *
                                                100
                                              ) / 100,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  {insuranceData.insurance_for_member == "Family Multi Individual" && (
                                    <div
                                      style={{
                                        color: "red",
                                        fontSize: ".9rem",
                                        paddingTop: "10px",
                                      }}
                                      className=""
                                    >
                                      Note: You should include two or more
                                      persons in the Multi-Individual Mediclaim.
                                    </div>
                                  )}
                                  {insuranceData.insurance_for_member == "Family Floater" && (
                                    <div
                                      style={{
                                        color: "red",
                                        fontSize: ".9rem",
                                        paddingTop: "10px",
                                      }}
                                      className=""
                                    >
                                      Note: A family floater can have a maximum
                                      of four members: the self, the spouse, and
                                      two children under four.
                                    </div>
                                  )}
                                  {insuranceData.insurance_for_member == "Family Multi Individual" && (
                                    <div className="row mt-4">
                                      <div className="col-md-12 mt-md-0">
                                        <div className="material   w-100">
                                          <div
                                            className="m-0 btn-sm default-btn gradient-btn save-btn"
                                            onClick={() => handleMemberSelect()}
                                          >
                                            Select Members
                                          </div>
                                          <br></br>
                                          <br></br>
                                          {selectedMembers ? (
                                            <div
                                              className="d-flex"
                                              style={{
                                                textAlign: "left!important",
                                              }}
                                            >
                                              <div>
                                                <b>Selected Members : </b>
                                              </div>
                                              <div className="ms-1">
                                                {selectedMembers.join(", ")}
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          <div
                                            className="error "
                                            style={{ position: "relative" }}
                                          >
                                            {handleError.insuranceTotalMember}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {insuranceData.insurance_for_member == "Family Floater" && (
                                    <div className="row mt-4">
                                      <div className="col-md-12 mt-md-0">
                                        <div className="material   w-100">
                                          <div
                                            className="m-0 btn-sm default-btn gradient-btn save-btn"
                                            onClick={() => handleMemberSelect()}
                                          >
                                            Select Members
                                          </div>
                                          <br></br>
                                          <br></br>
                                          {selectedMembers ? (
                                            <div
                                              className="d-flex"
                                              style={{
                                                textAlign: "left!important",
                                              }}
                                            >
                                              <div>
                                                <b>Selected Members : </b>
                                              </div>
                                              <div className="ms-1">
                                                {selectedMembers.join(", ")}
                                              </div>
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          <div
                                            className="error "
                                            style={{ position: "relative" }}
                                          >
                                            {handleError.insuranceTotalMember}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}

                              {insuranceData.insurance_cat_uuid != "term_plan" &&
                                // insuranceData.insurance_cat_uuid != 44 &&
                                insuranceData.insurance_cat_uuid != "general" &&
                                insuranceData.insurance_cat_uuid != "mediclaim" && (
                                  <>
                                    <div className="row py-3">
                                      <div className="col-md-10 col-12">
                                        <div className="d-flex">
                                          <Form.Label className="">
                                            Add Bonus
                                          </Form.Label>
                                          <div className="d-flex ms-3">
                                            <div className="ms-md-3 info-hover-left-box">
                                              <span className="icon">
                                                <img
                                                  alt="More information"
                                                  src={imagePath + '/static/media/more_information.svg'}
                                                />
                                              </span>
                                              <span className="msg">
                                                Add bonus amount and expected
                                                receiving date.
                                              </span>
                                            </div>
                                            <div className="d-flex ms-md-4 ms-3 ">
                                              <div>No</div>
                                              <Switch
                                                onChange={(e) =>
                                                  setInsuranceData({
                                                    ...insuranceData,
                                                    insurance_bonus: e,
                                                  })
                                                }
                                                checked={
                                                  insuranceData.insurance_bonus
                                                }
                                                className="react-switch px-2"
                                                activeBoxShadow="0 0 2px 3px #042b62"
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                height={20}
                                                width={40}
                                                onColor="#042b62"
                                                offColor="#d8dae5"
                                              />
                                              <div>Yes</div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {insuranceData.insurance_bonus == true && (
                                      <>
                                        {inputFieldsBonus.map((data, index) => {
                                          return (
                                            <div
                                              className="row py-md-3 py-2 BonusData"
                                              key={index}
                                            >
                                              <div className="col-md-6 col-12 addMaturity ">
                                                <div className="col-3 w-100 custom-input">
                                                  <div
                                                    className={`form-group mt-3 w-100 ${data.bonus_amount
                                                      ? "inputData"
                                                      : null
                                                      }`}
                                                    style={{
                                                      paddingTop: "3.5px",
                                                    }}
                                                  >
                                                    <input
                                                      type="number"
                                                      name="Bonus_Amount*"
                                                      id="bonus_amount"
                                                      pattern="[0-9]*"
                                                      value={
                                                        data.bonus_amount
                                                      }
                                                      onChange={(e) => {
                                                        const inputValue =
                                                          e.target.value;
                                                        if (
                                                          inputValue.length <=
                                                          9
                                                        ) {
                                                          // setInsuranceData({
                                                          //   ...insuranceData,
                                                          //   bonus_amount:
                                                          //     e.target.validity
                                                          //       .valid
                                                          //       ? e.target.value
                                                          //       : insuranceData.bonus_amount,
                                                          // });
                                                          setInputFieldsBonus(
                                                            (v) => {
                                                              return v.map(
                                                                (v, i) => {
                                                                  if (
                                                                    index == i
                                                                  ) {
                                                                    v.bonus_amount =
                                                                      e.target.value;
                                                                  }
                                                                  return v;
                                                                }
                                                              );
                                                            }
                                                          );
                                                          // handelInsuranceBonusAmount(
                                                          //   e.target.value
                                                          // );
                                                        }
                                                      }}
                                                      required
                                                      autoComplete="off"
                                                    />
                                                    <span className="highlight"></span>
                                                    <span className="bar"></span>
                                                    <label htmlFor="name">
                                                      Bonus Amount (₹)*
                                                    </label>
                                                  </div>
                                                  {/* <div className="error">
                                                      {
                                                        handleError.insuranceBonusAmount
                                                      }
                                                    </div> */}
                                                </div>

                                                <div className="col-md-3 pt-1 w-100 Boxmaturity">
                                                  <Form.Label className="mb-0">
                                                    Date Of Bonus*
                                                  </Form.Label>
                                                  <div
                                                    className="dt-conbx"
                                                    style={{
                                                      borderBottom:
                                                        "1px solid #dadada",
                                                      // paddingTop: "19px",
                                                    }}
                                                  >
                                                    <ReactDatePicker
                                                      className="pt-2"
                                                      select_date={moment(
                                                        data.bonus_date,
                                                        "DD/MM/YYYY"
                                                      ).toDate()}
                                                      setDate={(date) => {
                                                        date =
                                                          moment(date).format(
                                                            "DD/MM/YYYY"
                                                          );
                                                        setInputFieldsBonus(
                                                          (v) => {
                                                            return v.map(
                                                              (v, i) => {
                                                                if (
                                                                  index == i
                                                                ) {
                                                                  v.bonus_date =
                                                                    date;
                                                                }
                                                                return v;
                                                              }
                                                            );
                                                          }
                                                        );
                                                      }}
                                                      // minDate={
                                                      //   data.insurance_min_date ??
                                                      //   moment().toDate()
                                                      // }
                                                      minDate={
                                                        data.user_insurance_start_date
                                                          ? moment(
                                                            data.user_insurance_start_date,
                                                            "DD/MM/YYYY"
                                                          ).toDate()
                                                          : moment().toDate()
                                                      }
                                                      maxDate={""}
                                                    />
                                                  </div>
                                                  {/* <div className="error">
                                                    {
                                                      handleError.insuranceBonusDate
                                                    }
                                                  </div> */}
                                                </div>
                                              </div>
                                              <div className="col-md-6">
                                                <div className="d-flex mt-md-2">
                                                  <button
                                                    style={{
                                                      width: "max-content",
                                                    }}
                                                    type="button"
                                                    onClick={() => {
                                                      removeinputFieldsBonus(
                                                        index
                                                      );
                                                    }}
                                                    className="default-btn"
                                                  >
                                                    Remove
                                                  </button>
                                                  <button
                                                    type="button"
                                                    style={{
                                                      width: "max-content",
                                                      whiteSpace: "nowrap",
                                                    }}
                                                    onClick={addInputBonusField}
                                                    // className="default-btn ms-4"
                                                    className={`default-btn ms-4 ${inputFieldsBonus.length ==
                                                      5 ||
                                                      index !=
                                                      inputFieldsBonus.length -
                                                      1
                                                      ? "d-none"
                                                      : ""
                                                      }`}
                                                  >
                                                    Add more
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </>
                                    )}
                                  </>
                                )}

                              {insuranceData.insurance_cat_uuid != "term_plan" &&
                                // insuranceData.insurance_cat_uuid != 44 &&
                                insuranceData.insurance_cat_uuid != "general" &&
                                insuranceData.insurance_cat_uuid != "mediclaim" && (
                                  <div className="col-md-5 mt-2 custom-input">
                                    <div
                                      className={`form-group  w-100 
                                      ${insuranceData.user_insurance_maturity_amount
                                          ? "inputData"
                                          : insuranceData.user_insurance_maturity_amount ==
                                            0
                                            ? "inputData"
                                            : null
                                        }
                                      `}
                                    >
                                      <input
                                        type="text"
                                        name="Maturity_amt"
                                        id="Maturity_amt"
                                        pattern="[0-9]*"
                                        value={
                                          insuranceData.user_insurance_maturity_amount
                                        }
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          if (inputValue.length <= 9) {
                                            setInsuranceData({
                                              ...insuranceData,
                                              user_insurance_maturity_amount: e
                                                .target.validity.valid
                                                ? e.target.value
                                                : insuranceData.user_insurance_maturity_amount,
                                            });
                                            // handelInsuranceAmount(e.target.value);
                                          }
                                        }}
                                        autoComplete="off"
                                      />
                                      <span className="highlight"></span>
                                      <span className="bar"></span>
                                      <label htmlFor="name">
                                        Maturity Bonus (₹)
                                      </label>
                                    </div>

                                    {/* <div className="error">
                                      {handleError.insuranceAmount}
                                    </div> */}
                                  </div>
                                )}
                              <div className="row mt-3">
                                <div className="col-md-9 col-12 custom-input">
                                  <div className={`form-group ${insuranceData.user_insurance_remarks ? "inputData" : null} `}>
                                    <input
                                      type="text"
                                      name="Remarks"
                                      id="Remarks"
                                      value={insuranceData.user_insurance_remarks}
                                      onChange={(e) => {
                                        setInsuranceData({
                                          ...insuranceData,
                                          user_insurance_remarks: e.target.value,
                                        });
                                        // handlePremiumValue(e.target.value);
                                      }}
                                      autoComplete="off"
                                    />
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label htmlFor="name">Remarks</label>
                                  </div>
                                </div>
                              </div>
                            </form>
                            <div className="row py-2">
                              <div className=" text-center">
                                <div>
                                  <div className="btn-container">
                                    <div className="d-flex justify-content-center">
                                      <div
                                        className="previous-btn form-arrow d-flex align-items-center"
                                        onClick={() => {
                                          ScrollToTop();
                                          setTab("tab1")
                                        }
                                        }
                                      >
                                        <FaArrowLeft />
                                        <span className="hover-text">
                                          &nbsp;Previous
                                        </span>
                                      </div>
                                      {editflag == true ? (
                                        <>
                                          <button
                                            className="default-btn gradient-btn save-btn"
                                            onClick={(e) =>
                                              cancelInsuranceForm(e)
                                            }
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            className="default-btn gradient-btn save-btn"
                                            onClick={(e) => handleSubmit(e)}
                                          >
                                            Update
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          className="default-btn gradient-btn save-btn"
                                          onClick={(e) => handleSubmit(e)}
                                        >
                                          Save & Add More
                                        </button>
                                      )}
                                      <Link
                                        to={
                                          process.env.PUBLIC_URL +
                                          "/datagathering/my-document"
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MembersDropdown
        open={openMemberDropdown}
        onClose={() => setOpenMemberDropdown(false)}
        familyData={familyData}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        familyMultiData={familyMultiData}
        insuranceData={insuranceData}
        setInsuranceData={setInsuranceData}
        editflag={editflag}
        membersData={membersData}
        familyMemberData={familyMemberData}
      />
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
          <button onClick={() => deleteInsurance()} className="outline-btn m-2">
            Yes
          </button>
          <button onClick={handleClose} className="outline-btn m-2">
            No
          </button>
        </div>
      </Modal>
    </DatagatherLayout>
  );
};
export default Insurance;