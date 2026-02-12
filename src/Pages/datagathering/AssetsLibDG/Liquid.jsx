import React, { useEffect, useRef, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import ReactDatePicker from "../../../components/HTML/ReactDatePicker/ReactDatePicker";
import FintooRadio2 from "../../../components/FintooRadio2";
import Switch from "react-switch";
import moment from "moment";
import DgRoundedButton from "../../../components/HTML/DgRoundedButton";
import DgDragDrop from "../../../components/HTML/DgDragDrop";
import SimpleReactValidator from "simple-react-validator";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaHubspot } from "react-icons/fa";
import DgDragDrop2 from "../../../components/HTML/DgDragDrop/DgDragDrop2";
import { Modal } from "react-bootstrap";
import LinkYourHoldingsDG from "./LinkYourHoldingsDG";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useDispatch } from "react-redux";
import FintooLoader from "../../../components/FintooLoader";
import GoalsDropdown from "../../../components/GoalsDropdown/GoalDropdown";
import Styles from "../AssetsLibDG/NSDL_CSDL/style.module.css";
import customStyles from "../../../components/CustomStyles";
import commonEncode from "../../../commonEncode";
import {
  apiCall,
  createCookie,
  fetchData,
  fetchEncryptData,
  getItemLocal,
  getParentUserId,
  getUserId,
  restApiCall,
  setItemLocal,
} from "../../../common_utilities";
import { imagePath } from "../../../constants";
import Bankbalance from "../BankCashbalance/Bankbalance.module.css";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Bankselect from "../BankCashbalance/Bankselect";
import socket, { onMessageHandler } from "../BankCashbalance/socket";
import BankAccountSelection from "../BankCashbalance/BankAccountSelection";
import { ScrollToTop } from "../ScrollToTop";
import { Buffer } from "buffer";
import Uniquepannotfoundmodal from "./Uniquepannotfoundmodal";
import { getFamilyMember } from "../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { autoUpdateAccountTransactions, fetchTrackedBankDetails, getBankList, stopTrackingBank } from "../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";
import { FetchBankbalaceDetailsdetails } from "../../../FrappeIntegration-Services/services/financial-planning-api/externalApi";
import { faL } from "@fortawesome/free-solid-svg-icons";
// const socket = new WebSocket("wss://webvwlive.finvu.in/consentapi");
const options = [
  { value: "Self", label: " Andrew Doe (Self)" },
  { value: " Alex_Doe", label: " Alex Doe" },
  { value: " Samanta_Doe", label: "Samanta Doe" },
  { value: "  Grey_Doe", label: "Grey Doe" },
];

const Liquid = (props) => {
  const navigate = useNavigate();
  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
  const syncBtnRef = useRef(null)
  const [selectedButton, setSelectedButton] = useState(" ");
  const [selectedExtraOption, setSelectedExtraOption] = useState(" ");
  const setAssetsDetails = props.setAssetsDetails;
  const [show, setShow] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [mobileOtp, setMobileOtp] = useState("");
  // const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(true);
  const [showuniqueUANModal, setShowuniqueUANModal] = useState(false);
  const [pannumbers, setPanNumbers] = useState([]);
  const [familyecas, setFamilyEcas] = useState([]);
  const [memberdataid, setMemberDataId] = useState({})
  const assetsDetails = props.assetsDetails;
  const familyData = props.familyData;
  const goalData = props.goalData;
  const setDate = props.setDate;
  const schemedata = props.schemedata;
  const addForm = props.addForm;
  const updateForm = props.updateForm;
  const addAssetsSubmit = props.addAssetsSubmit;
  const cancelAssetForm = props.cancelAssetForm;
  const updateAssetsSubmit = props.updateAssetsSubmit;
  const assetForMember = props.assetForMember;
  const liquidfunds = props.liquidfunds;
  const session = props.session;
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [, setForceUpdate] = useState(0);
  const dispatch = useDispatch();
  const [retirementDate, setRetirementDate] = useState("");
  const [lifeExpectancyDate, setLifeExpectancyDate] = useState("");
  const [openModalByName, setOpenModalByName] = useState("");
  const handleShow = () => setShow(true);
  const setGoalSelected = props.setGoalSelected;
  const closeModal = props.closeModal;
  const selectGoals = props.selectGoals;
  const selectedGoals = props.selectedGoals;
  const selectedGoalIdArray = props.selectedGoalIdArray;
  const selectedGoalsId = props.selectedGoalsId;
  const setPriorityArray = props.setPriorityArray;
  const selectedPriorityArray = props.selectedPriorityArray;
  const setAutoMatedGoal = props.setAutoMatedGoal;
  const isAutoMatedGoal = props.isAutoMatedGoal;
  const setGoalLink = props.setGoalLink;
  const isGoalSelected = props.isGoalSelected;
  const setSelectedGoals = props.setSelectedGoals;
  const setSelectedGoalsId = props.setSelectedGoalsId;
  const setSelectedPriorityArray = props.setSelectedPriorityArray;
  const unchangedgoaldata = props.unchangedgoaldata;
  const assetEditId = props.assetEditId;
  const [mobileNumber, setMobileNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [familySortedData, setFamilySortedData] = useState([]);

  let user_details = [];

  const [fetchbankbalanceDetails, setFetchBankBalanceDeatils] = useState([]);

  const [multipleTotalInvestedValue, setMultipleTotalInvestedValue] =
    useState(0);
  const [multipleTotalCurrentValue, setMultipleTotalCurrentValue] = useState(0);
  const [multipleTotalAssetValueLinked, setMultipleTotalAssetValueLinked] =
    useState(0);
  const [
    multipleTotalAssetValueForLinkages,
    setMultipleTotalAssetValueForLinkages,
  ] = useState(0);
  const [
    multipleTotalRecurringInvestment,
    setMultipleTotalRecurringInvestment,
  ] = useState(0);
  // const data = props.filteredAssetsData.select_subclass;
  const data = [];
  const [subClass, setSubClass] = useState("");
  const [investmentFrom, setInvestmentFrom] = useState("");

  const scrollToList = () => {
    window.scroll({ top: 0 });
  };

  const groupedData = {};
  if (data) {
    for (const item of data) {
      const key = `${item.user_asset_for}-${item.value}`;
      if (!groupedData[key]) {
        groupedData[key] = { ...item, asset_id: [] };
      }
      groupedData[key].asset_id.push(item.asset_id);
    }
  }

  useEffect(() => {
    if (assetsDetails.asset_sub_category_id != 125) {
      setMultipleTotalInvestedValue(0);
      setMultipleTotalCurrentValue(0);
      setMultipleTotalAssetValueLinked(0);
      setMultipleTotalAssetValueForLinkages(0);
      setMultipleTotalRecurringInvestment(0);
    }
  }, [assetsDetails.asset_sub_category_id]);

  const result = Object.values(groupedData).map((item) => {
    return {
      asset_id: item.asset_id,
      value: item.value,
      label: item.label,
      asset_recurring: item.asset_recurring,
      user_asset_investment_amount: item.user_asset_investment_amount,
      user_asset_for: item.user_asset_for,
      total_invested_value: item.total_invested_value,
      total_current_value: item.total_current_value,
      total_linked_goals_value: item.total_linked_goals_value,
    };
  });
  const uniqueData = result;

  const dynamicLabelsToRemove = ["Others", "Bank Balance", "Liquid Funds"];
  // Extract unique labels
  const uniqueLabels = [...new Set(uniqueData.map((item) => item.label))];

  // Remove entries with dynamic labels
  // const modifiedData = uniqueData.filter((item) => {
  //   if (
  //     dynamicLabelsToRemove.includes(item.label) &&
  //     uniqueLabels.includes(item.label)
  //   ) {
  //     uniqueLabels.splice(uniqueLabels.indexOf(item.label), 1);
  //     return true;
  //   }
  //   return !dynamicLabelsToRemove.includes(item.label);
  // });

  useEffect(() => {
    if (
      "multi_linkage_goal_data" in assetsDetails &&
      Array.isArray(assetsDetails.multi_linkage_goal_data) &&
      assetsDetails.multi_linkage_goal_data.length > 0
    ) {
      setMultipleTotalInvestedValue(
        assetsDetails["multi_linkage_goal_data"][0]["user_asset_current_amount"]
      );
      setMultipleTotalCurrentValue(
        assetsDetails["multi_linkage_goal_data"][0]["totalcurrentvalue"]
      );
      setMultipleTotalAssetValueLinked(
        assetsDetails["multi_linkage_goal_data"][0]["totalassetvaluelinked"]
      );
      setMultipleTotalAssetValueForLinkages(
        assetsDetails["multi_linkage_goal_data"][0][
        "totalassetvalueforlinkages"
        ]
      );
      setMultipleTotalRecurringInvestment(
        assetsDetails["multi_linkage_goal_data"][0]["totalrecurringinvestment"]
      );
      setSubClass(assetsDetails["asset_name"]);
      const resultObject = familyData.find(
        (item) => item.value === assetsDetails["user_asset_for"]
      );
      const labelName = resultObject ? resultObject.label : null;
      setInvestmentFrom(labelName);
    }
  }, [assetsDetails?.multi_linkage_goal_data]);

  // useEffect(() => {
  //   if (assetsDetails?.asset_sub_class_id) {
  //     let all_subclass = props.filteredAssetsData.all_subclass
  //       .filter((v) => v.value == assetsDetails.asset_sub_class_id)
  //       .map((v) => v.user_asset_for);
  //     all_subclass = [...new Set(all_subclass)];
  //     var totalInvestedValue = 0;
  //     var totalCurrentValue = 0;
  //     var totalAssetValueLinked = 0;
  //     var totalAssetValueForLinkages = 0;
  //     var totalRecurringInvestment = 0;
  //     for (let i = 0; i < props.filteredAssetsData.all_subclass.length; i++) {
  //       let _records = props.filteredAssetsData.all_subclass;
  //       if (
  //         _records[i].value == assetsDetails.asset_sub_class_id &&
  //         _records[i].user_asset_for == assetsDetails.user_asset_for
  //       ) {
  //         totalInvestedValue =
  //           totalInvestedValue + Number(_records[i].total_invested_value);
  //         totalCurrentValue =
  //           totalCurrentValue + Number(_records[i].total_current_value);
  //         if (_records[i].total_linked_goals_value == 1) {
  //           totalAssetValueLinked =
  //             totalAssetValueLinked + Number(_records[i].total_current_value);
  //         } else {
  //           totalAssetValueForLinkages =
  //             totalAssetValueForLinkages +
  //             Number(_records[i].total_current_value);
  //         }
  //         if (
  //           (_records[i].value == 62 && _records[i].asset_recurring == "1") ||
  //           _records[i].asset_recurring == true
  //         ) {
  //           totalRecurringInvestment =
  //             totalRecurringInvestment + Number(_records[i].user_asset_investment_amount);
  //         }
  //       }
  //     }
  //     setMultipleTotalInvestedValue(totalInvestedValue);
  //     setMultipleTotalCurrentValue(totalCurrentValue);
  //     setMultipleTotalAssetValueLinked(totalAssetValueLinked);
  //     setMultipleTotalAssetValueForLinkages(totalAssetValueForLinkages);
  //     setMultipleTotalRecurringInvestment(totalRecurringInvestment);
  //     setFamilySortedData(
  //       familyData.filter((v) => all_subclass.includes(v.value))
  //     );
  //   } else {
  //     setFamilySortedData([]);
  //   }
  // }, [
  //   assetsDetails?.asset_sub_class_id,
  //   assetsDetails?.asset_id,
  //   assetsDetails?.user_asset_for,
  // ]);

  // const liquidfundsData = liquidfunds.map((index, value) => {
  //   return {
  //     // label: index.fund_name,
  //     // value: index.current_nav,
  //   };
  // });

  const handleLiquidFundSelection = (selectedOption) => {
    setAssetsDetails({
      ...assetsDetails,
      user_asset_name: selectedOption.label, // Set the asset_name using the selected fund name
      user_asset_current_price: parseFloat(selectedOption.value).toFixed(2),
    });
  };

  const handleLiquidSubmit = async (e) => {
    e.preventDefault();

    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      // setIsLoading(true);
      addAssetsSubmit(e);
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
    }
  };

  const handleLiquidUpdate = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      // setIsLoading(true);
      updateAssetsSubmit(e);
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
      setGoalSelected(false);
      setSelectedGoalsId([]);
      setSelectedPriorityArray([]);
      // setAutoMatedGoal(true);
      setSelectedGoals("Automated Linkage");
    }
  };

  const handleLiquidCancel = async (e) => {
    e.preventDefault();
    cancelAssetForm(e);
    simpleValidator.current.hideMessages();
    setForceUpdate((v) => ++v);
  };

  useEffect(() => {
    simpleValidator.current.hideMessages();
    simpleValidator.current.purgeFields();

    if (assetEditId) {
      if (selectedGoals == "Automated Linkage") {
        // setAutoMatedGoal(true);
        setSelectedGoals("Automated Linkage");
      } else {
        setAutoMatedGoal(false);
      }
    } else {
      // setAutoMatedGoal(true);
      // setSelectedGoals("Automated Linkage");
    }
    if (session && !assetEditId) {
      setSelectedGoalsId([]);
      setSelectedPriorityArray([]);
      setGoalSelected(false);
      props.getfpgoalsdata(session.data.fp_log_id);
    }
    setForceUpdate((v) => ++v);
  }, [
    assetsDetails?.asset_sub_category_id,
    assetsDetails?.user_asset_occurance,
    selectedButton,
  ]);

  // Upload Document

  const [docPassword, setDocPassword] = useState("");
  const [dropFiles, setdropFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const ecashUploadDocument = async () => {
    try {
      var form = new FormData();
      form.append("ecash_type", "CAMS");
      form.append("ecash_passkey", docPassword);
      form.append("fp_user_id", parseInt(session["data"]["fp_user_id"]));
      form.append("fp_log_id", parseInt(session["data"]["fp_log_id"]));
      form.append("doc_user_id", parseInt(session["data"]["id"]));

      for (let i = 0; i < dropFiles.length; i++) {
        form.append(`file[${i}]`, dropFiles[i], dropFiles[i].name);
      }
      setIsLoading(true);
      var ecash_upload = await apiCall(
        '',
        form,
        false,
        false
      );
      if (ecash_upload["error_code"] === "100") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("Document uploaded successfully");
        // setIsLoading(false);
        getUnassignedAsset();
        setdropFiles([]);
        setDocPassword("");
        setForceUpdate((v) => ++v);
        dispatch({ type: "RESET_DRAGZONE", payload: true });
        setIsLoading(false);
      } else if (ecash_upload["error_code"] == "102") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(ecash_upload["data"]);
        setdropFiles([]);
        setDocPassword("");
        setForceUpdate((v) => ++v);
        dispatch({ type: "RESET_DRAGZONE", payload: true });
        setIsLoading(false);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
        // var retire_data = {
        //   fp_log_id: session["data"]["fp_log_id"],
        //   fp_user_id: session["data"]["id"],
        // };
        // var payload_retire_data = commonEncode.encrypt(
        //   JSON.stringify(retire_data)
        // );
        // var config_ret = await apiCall(
        //   ADVISORY_UPDATE_RETIREMENT_DATE_API_URL,
        //   payload_retire_data
        // );
        // var res_ret = JSON.parse(commonEncode.decrypt(config_ret));
        // if (res_ret.error_code == "100") {
        //   var retirement_date = moment(res_ret["data"][0]["dob"]).add(
        //     res_ret["data"][0]["retirement_age"],
        //     "y"
        //   );
        //   var life_expectancy_date = moment(res_ret["data"][0]["dob"]).add(
        //     res_ret["data"][0]["life_expectancy"],
        //     "y"
        //   );
        //   setRetirementDate(retirement_date);
        //   setLifeExpectancyDate(life_expectancy_date);
        // }
        if (session) {
          var retirement_date = moment(session["data"]["user_details"]['dob'])
            .add(session["data"]["user_details"]['retirement_age'], "y")
            .format("MM/DD/YYYY");
          var life_expectancy_date = moment(session["data"]["user_details"]['dob'])
            .add(session["data"]["user_details"]['life_expectancy'], "y")
            .format("MM/DD/YYYY");

          setRetirementDate(retirement_date);
          setLifeExpectancyDate(life_expectancy_date);
        }
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const getUnassignedAsset = async () => {
    // try {
    //   var payload = { "user_id": session["data"]["id"], "fp_log_id": session["data"]["fp_log_id"], "fp_user_id": session["data"]["fp_user_id"] }
    //   var unassigned_asset = await apiCall(
    //     ADVISORY_GET_UNASSIGNED_ASSET,
    //     payload,
    //     false,
    //     false
    //   );
    //   if (unassigned_asset["error_code"] == "100") {
    //     setPanNumbers(unassigned_asset.data)
    //     if (unassigned_asset.data != 'false') {
    //       setShowuniqueUANModal(true)
    //     }
    //     var response_pan = unassigned_asset.data
    //     var temp_member_id = 0
    //     var familyDetails = await apiCall(
    //       BASE_API_URL + "restapi/getfpfamilydata/" +
    //       "?parent_user_id=" +
    //       Buffer.from(commonEncode.encrypt((session["data"]["id"]).toString())).toString("base64") + '&fp_log_id=' + Buffer.from(commonEncode.encrypt((session["data"]["fp_log_id"]).toString())).toString("base64") +
    //       "&web=1",
    //     )
    //     if (familyDetails.data != undefined) {
    //       setFamilyEcas(familyDetails.data)

    //       let url = ADVISORY_GET_FP_USER_DATA + '?user_id=' + btoa(commonEncode.encrypt((session["data"]["id"]).toString())) + '&fp_log_id=' + btoa(commonEncode.encrypt((session["data"]["fp_log_id"]).toString())) + '&fp_user_id=' + btoa(commonEncode.encrypt((session["data"]["fp_user_id"]).toString())) + "&web=1";

    //       let fpUserData = await apiCall(url, "", true, false);
    //       if (fpUserData.data.length > 0) {
    //         if (familyDetails.data.length > 0 && familyDetails.data != undefined) {
    //           temp_member_id = familyDetails.data[0].id
    //         }
    //         else {
    //           setFamilyEcas([])
    //         }
    //       }
    //       else {
    //         setFamilyEcas([])
    //       }
    //     }
    //     var item = {}
    //     for (var pan = 0; pan < unassigned_asset.data.length; pan++) {
    //       item["familydata_ecas_" + response_pan[pan].asset_pan] = temp_member_id.toString();
    //     }
    //     setMemberDataId(item)
    //   }
    // }
    // catch (e) {
    //   console.log(e)
    // }
  }

  useEffect(() => {
    if (!familyData || !Array.isArray(familyData)) return;

    // Find the primary user — you can adjust this logic if needed
    const parentUser = familyData.find(member => member.label === "Self");

    if (parentUser && parentUser.dob && parentUser.retirement_age && parentUser.life_expectancy) {
      // Parse DOB in DD/MM/YYYY format
      const dobMoment = moment(parentUser.dob, "DD/MM/YYYY");

      const retirement_date = dobMoment
        .clone()
        .add(parentUser.retirement_age, "years")
        .format("DD/MM/YYYY");

      const life_expectancy_date = dobMoment
        .clone()
        .add(parentUser.life_expectancy, "years")
        .format("DD/MM/YYYY");

      setRetirementDate(retirement_date);
      setLifeExpectancyDate(life_expectancy_date);
    }
  }, [familyData]);

  const getRetirementData = async () => {
    try {
      // var retire_data = {
      //   fp_log_id: session["data"]["fp_log_id"],
      //   fp_user_id: session["data"]["id"],
      // };
      // var payload_retire_data = commonEncode.encrypt(
      //   JSON.stringify(retire_data)
      // );
      // var config_ret = await apiCall(
      //   ADVISORY_UPDATE_RETIREMENT_DATE_API_URL,
      //   payload_retire_data,
      //   false,
      //   false
      // );
      // var res_ret = JSON.parse(commonEncode.decrypt(config_ret));
      // if (res_ret.error_code == "100") {
      //   var retirement_date = moment(res_ret["data"][0]["dob"])
      //     .add(res_ret["data"][0]["retirement_age"], "y")
      //     .format("MM/DD/YYYY");
      //   var life_expectancy_date = moment(res_ret["data"][0]["dob"])
      //     .add(res_ret["data"][0]["life_expectancy"], "y")
      //     .format("MM/DD/YYYY");
      //   setRetirementDate(retirement_date);
      //   setLifeExpectancyDate(life_expectancy_date);
      // }
      if (session) {
        var retirement_date = moment(session["data"]["user_details"]['dob'])
          .add(session["data"]["user_details"]['retirement_age'], "y")
          .format("MM/DD/YYYY");
        var life_expectancy_date = moment(session["data"]["user_details"]['dob'])
          .add(session["data"]["user_details"]['life_expectancy'], "y")
          .format("MM/DD/YYYY");

        setRetirementDate(retirement_date);
        setLifeExpectancyDate(life_expectancy_date);
      }
    } catch {
      (e) => { };
      (e) => { };
    }
  };

  const handleFilesSelected = (files) => {
    const dropFiles = Array.from(files).slice(0, 1);
    setdropFiles(dropFiles);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      // setIsLoading(true);
      ecashUploadDocument();
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
      dispatch({ type: "RESET_DRAGZONE", payload: true });
    }
  };

  const Input = (props) => {
    const { autoComplete = props.autoComplete } = props.selectProps;
    return <components.Input {...props} autoComplete={autoComplete} />;
  };

  const [bankBalanceData, setBankBalanceData] = useState([]);

  const FetchBankbalaceDetails = async () => {
    if (!user_data?.user_id) return;

    const payload = {
      user_id: [user_data.user_id]
    };

    try {
      const response = await fetchTrackedBankDetails(payload);

      switch (response.status_code) {
        case 200:
          const filteredAccounts = response.data;
          setFetchBankBalanceDeatils(filteredAccounts);
          dispatch({ type: "SET_LINKED_ACCOUNT_DATA", payload: filteredAccounts });

          // let totalBalance = 0;
          // const accountNumbers = [];
          // const accountLastUpdatedDates = [];

          // filteredAccounts.forEach(account => {
          //   totalBalance += account.mm_total_balance;
          //   accountNumbers.push(account.mm_account_masked_id);
          //   accountLastUpdatedDates.push(account.modified);
          // });

          // setTotalBankBalance(totalBalance);
          // setDashboardData(filteredAccounts);
          // setAllAccountNo(accountNumbers);
          // setAllLastUpdatedDates(accountLastUpdatedDates);
          break;

        case 400:
        case 404:
          setFetchBankBalanceDeatils([]);
          break;

        case 422:
        case 500:
          // showAlert('error', response.message);
          break;
      }
    } catch (error) {
      console.error('FetchBankbalaceDetails error:', error);
    }
  };



  const [selectedMember, setSelectedMember] = useState("");
  const [allMembers, setAllMembers] = useState([]);

  // Account Aggregator

  const sessionData = useRef("");

  useEffect(() => {
    getmemberdata();
    FetchBankbalaceDetails()
    // const checksession = async () => {
    //   let url = '';
// let url = CHECK_SESSION;
    //   let data = { user_id: getUserId(), sky: getItemLocal("sky") };
    //   let session_data = await apiCall(url, data, true, false);

    //   if (session_data["error_code"] == "100") {
    //     sessionData.current = session_data;
    //   }
    // };
    // // checksession();
  }, []);

  const handleChange = async (e) => {
    try {
      if (Boolean(e) == false) {
        let member = allMembers;
        setSelectedMember({ ...member[0] });
      } else {
        setSelectedMember({ ...e });
        // setErrors({});
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  useEffect(() => {
    handleChange();
  }, [allMembers]);

  useEffect(() => {
    setOpenModalByName("");
    setSelectedButton("");
    setSelectedExtraOption("");
  }, []);
  // }, [props.assetEditId]);
  // Member Data for Account Aggregator

  const [memberData, setMemberData] = useState([]);
  const [errors, setErrors] = useState("");
  const [mobileError, setMobileError] = useState("");

  // const checksession = async () => {
  //   let url = '';
// let url = CHECK_SESSION;
  //   let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
  //   return await apiCall(url, data, true, false);
  // };

  const getmemberdata = async () => {
    try {
      // let sessionData = await // checksession();
      // let reqdata = {
      //   fp_user_id: sessionData["data"]["fp_user_id"],
      //   fp_log_id: sessionData["data"]["fp_log_id"],
      //   user_id: sessionData["data"]["id"],
      // };

      let checkData = await getFamilyMember(user_data.user_id);

      if (checkData.status_code === 200) {
        setMemberData(checkData);

        const all = checkData.data.map((v) => ({
          name: v.user_name,
          id: v.user_id,
          mobile: v.mobile_number,
          label: v.user_name,
          value: v.user_id,
        }));

        setAllMembers(all);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };


  useEffect(() => {
    const mobileErrors = findMobileErrors();

    if (selectedMember.mobile != "" && selectedMember.mobile != null) {
      if (Object.keys(mobileErrors).length > 0) {
        setErrors((v) => ({ ...v, ...mobileErrors }));
      }
    }
  }, [selectedMember.mobile]);

  const handleCheckboxClick = (e) => {
    setIsTermsChecked(e.target.checked);
    if (!isTermsChecked) {
      setTermsError("");
    } else {
      setTermsError("Please accept the Terms & Conditions.");
    }
  };

  const handleLinkAccountClick = () => {
    let mobileError = "";
    let termsError = "";

    const mobileErrors = findMobileErrors();

    if (mobileErrors.userMobile) {
      mobileError = mobileErrors.userMobile;
    }

    if (!isTermsChecked) {
      termsError = "Please accept the Terms & Conditions.";
    }

    if (mobileError || termsError) {
      setTermsError(termsError);
      setMobileError(mobileError);
    } else {
      setTermsError("");
      setMobileError("");
      localStorage.setItem("userdetails", selectedMember.id);
      localStorage.setItem("username", selectedMember.label);
      commonEncode.encrypt(createCookie("user", selectedMember.mobile, 15));

      navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/bank-list/`);
    }
  };

  useEffect(() => {
    setTermsError("");
    setMobileError("");
    setIsTermsChecked(false);
  }, [selectedMember]);

  const findMobileErrors = () => {
    const newErrors = {};
    let regex = /^[789]\d{9}$/;

    if (!selectedMember.mobile || selectedMember.mobile.trim() === "") {
      newErrors.userMobile = "Please enter mobile number!";
    } else if (selectedMember.mobile.length !== 10) {
      newErrors.userMobile = "Please enter a valid 10-digit mobile number!";
    } else if (!regex.test(selectedMember.mobile)) {
      newErrors.userMobile = "Please enter a valid mobile number!";
      // } else if (isMobileNumberLinked(selectedMember.mobile)) {
      //   newErrors.userMobile = "Mobile number is already linked.";
    } else {
      newErrors.userMobile = "";
    }

    return newErrors;
  };

  const isMobileNumberLinked = (mobile) => {
    return bankBalanceData.some((obj) => obj.mobile_number === mobile);
  };

  const handleMobileChange = (e) => {
    const newMobile = e.target.value.slice(0, 10);
    setSelectedMember({ ...selectedMember, mobile: newMobile });

    if (newMobile.length !== 10) {
      setMobileError("Please enter a 10-digit mobile number");
      return;
    }

    const mobileErrors = findMobileErrors();

    setMobileError(mobileErrors.userMobile);

    // if (isMobileNumberLinked(newMobile)) {
    //   setMobileError("Mobile number is already linked.");
    // }
  };

  const handleDelete = async (id, asset_id) => {

    const payload = {
      user_id: asset_id.mm_user_id,
      consentId: asset_id.mm_consent_id
    };
    try {
      const result = await stopTrackingBank(payload);
      if (result.status_code == 200) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("Bank Unlinked Successfully");
        handleClose();
        FetchBankbalaceDetails();
        // window.location.reload();
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Error: Revoking consent.");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    let payload2 = {
      url: ADVISORY_DELETE_BANK_DATA,
      data: {
        user_id: id.toString(),
        asset_id: asset_id,
      },
      method: "post",
    };

    const r = await fetchData(payload);
    if (r["error_code"] == "0") {
      props.deleteAssetData(asset_id);
      toastr.options.positionClass = "toast-bottom-left";
      // toastr.success("Data deleted successfully");
      FetchBankbalaceDetails();
    }
  };

  const [sessionId, setUserSessionId] = useState("");
  const { v4: uuidv4 } = require("uuid");

  const handleRefresh = async (
    user_id,
    consent_id,
    consent_handle,
    daterange_from,
    daterange_to,
    cust_id
  ) => {
    setIsLoading(true);
    const rid = uuidv4();
    const ts = new Date().toISOString();
    const loginPayload = {
      header: {
        rid: rid,
        ts: ts,
        channelId: "finsense",
      },
      body: {
        userId: "channel@fintoo",
        password: "85a333fb49044c7e91611a0d962ff8ba",
      },
    };

    const url =
      "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/User/Login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginPayload),
    };

    const loginResponse = await fetch(url, options);

    if (loginResponse.status === 200) {
      const responseData = await loginResponse.json();
      const token = responseData.body.token;
      try {
        let fir_request_payload = {
          header: {
            rid: rid,
            ts: ts,
            channelId: "finsense",
          },
          body: {
            custId: cust_id,
            consentId: consent_id,
            consentHandleId: consent_handle,
            dateTimeRangeFrom: daterange_from,
            dateTimeRangeTo: daterange_to,
          },
        };

        const requestBody = JSON.stringify(fir_request_payload);

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: requestBody,
        };

        fetch(
          "https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIRequest",
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.body && data.body.sessionId) {
              setUserSessionId(data.body.sessionId);
              FIStatus(
                data.body.sessionId,
                cust_id,
                consent_handle,
                consent_id,
                token,
                daterange_from,
                daterange_to
              );
            } else {
              setIsLoading(false);
              toastr.options.positionClass = "toast-bottom-left";
              toastr.error("Could not fetch session id from the bank");
            }
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      } catch (e) {
        console.log("Error", e);
      }
    }
  };

  const FIStatus = async (
    sId,
    custID,
    ConsentHandle,
    consentID,
    token,
    daterange_from,
    daterange_to,
    retryCount = 0
  ) => {
    let sessionId = sId;

    try {
      const customHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const payload = {
        url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIStatus/${consentID}/${sessionId}/${ConsentHandle}/${custID}`,
        headers: customHeaders,
        method: "get",
      };

      const r = await fetchData(payload);

      if (r.body.fiRequestStatus === "READY") {
        FIPfmDataReport(
          sId,
          token,
          custID,
          consentID,
          ConsentHandle,
          daterange_from,
          daterange_to
        );
      } else {
        if (retryCount < 5) {
          setTimeout(
            () =>
              FIStatus(
                sId,
                custID,
                ConsentHandle,
                consentID,
                token,
                daterange_from,
                daterange_to,
                retryCount + 1
              ),
            15000
          );
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(
            "Financial Information (FI) Status is PENDING / REJECTED"
          );
          setIsLoading(false);
          // navigate(
          //   `${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`
          // );
        }
      }
    } catch (error) {
      console.error("OTP error", error);
    }
  };

  const FIPfmDataReport = async (
    sID,
    token,
    custID,
    consentID,
    ConsentHandle,
    daterange_from,
    daterange_to
  ) => {
    try {
      let customHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + token,
      };

      let payload = {
        url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/Consent/${consentID}`,
        headers: customHeaders,
        method: "get",
      };

      const r = await fetchData(payload);
      if (r.body.status == "ACTIVE") {
        let linkref = r.body.ConsentDetail.Accounts["0"].linkRefNumber;

        try {
          let customHeaders = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          };

          let payload = {
            url: `https://fintoo.fiulive.finfactor.co.in/finsense/API/V2/FIPfmDataReport/${ConsentHandle}/${sID}/${linkref}`,
            headers: customHeaders,
            method: "get",
          };

          const userData = await fetchData(payload);
          let balancePayload = {
            bankName: userData.body.statementAccounts["0"].bank,
            memberName: userData.body.customerInfo.name,
            mobileNumber: userData.body.customerInfo.mobile,
          };

          toastr.options.positionClass = "toast-bottom-left";
          toastr.success("Data updated successfully");
          setIsLoading(false);

          // setUserBalancePayload(balancePayload);
          // setOpenModalByName("ApprovedConsent");

          try {
            let assetPayload = {
              id: assetId,
              Created_By: 0,
              Updated_By: 0,
              user_asset_investment_amount:
                userData?.body.statementAccounts["0"].currentBalance,
              asset_abreturn: "0",
              user_asset_growth_rate: "10",
              asset_broker_id: 0,
              asset_category_id: 40,
              user_asset_city_type: "0",
              user_asset_current_price: "",
              asset_currency: false,
              user_asset_source: "broker",
              asset_epf_ismanual: "1",
              asset_folio_number: null,
              asset_footnote: null,
              user_asset_freq: "One Time",
              asset_goal_link_id: 0,
              asset_goalname: null,
              asset_gold_karat: 0,
              asset_isActive: "1",
              user_asset_ownership: "Free Hold",
              user_asset_valid_till: "Retirement",
              user_asset_allocation: "false",
              asset_iselss: "1",
              asset_islinkable: true,
              user_asset_occurance: false,
              user_asset_property_type: "Self-Occupied",
              user_asset_maturity_amount: 0,
              asset_maturity_date: null,
              user_asset_for: 0,
              user_asset_end_date: null,
              user_asset_name: "Bank Balance",
              asset_pan: null,
              asset_payout_type: "1",
              user_asset_pincode: "",
              user_asset_avg_purchase_price: "",
              user_asset_purchase_date: null,
              asset_rental_amount: "",
              asset_rental_income: null,
              user_asset_ror: "0",
              asset_sub_category_id: 61,
              asset_unique_code: "",
              user_asset_quantity: "",
              categorydetail: "Bank Balance",
              created_datetime: moment().format("DD/MM/YYYY"),
              employee_contribution: "",
              employer_contribution: "",
              fp_log_id: session["data"]["fp_log_id"],
              user_asset_installment_paid: 1,
              membername1: "",
              stock_mf: null,
              stock_name: null,
              subcategorydetail: "",
              user_asset_current_amount: "",
              user_asset_investment_amount: "",
              totalmaturtiyamount: "",
              updated_datetime: moment().format("DD/MM/YYYY"),
              user_id: session["data"]["id"],
              scheme_equityshare: {},
            };

            const r = await apiCall(
              ADVISORY_UPDATE_ASSETS_API,
              assetPayload,
              true,
              false
            );

            if (r["error_code"] == "100") {
              try {
                let bankBalancePayload = {
                  url: ADVISORY_ADD_BANK_DATA,
                  data: {
                    bank_name: userData?.body?.statementAccounts["0"].bank,
                    member_name: userData?.body?.customerInfo.name,
                    mobile_number: custID.replace(/[^0-9]/g, ""),
                    user_id: "" + session["data"]["id"],
                    fp_log_id: "" + session["data"]["fp_log_id"],
                    consent_id: consentID,
                    consent_handle: ConsentHandle,
                    cust_id: custID,
                    daterange_from: daterange_from,
                    daterange_to: daterange_to,
                    updated_datetime: new Date().toISOString(),
                  },
                  method: "post",
                };

                const r = await fetchData(bankBalancePayload);

                if (r["error_code"] == "100") {
                  console.log("Error", r);
                }
              } catch (e) {
                console.log("Error"), e;
              }
            }
          } catch (e) {
            console.log("Error", e);
          }
        } catch (e) {
          console.log("Error", e);
        }
      } else {
        setIsLoading(false);
        navigate(`${process.env.PUBLIC_URL}/datagathering/assets-liabilities/`);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  useEffect(() => {
    if (window.location.href.includes("openLinkYourStatement=1")) {
      setOpenModalByName("Link_Account_Bank");
    }
  }, []);

  const handleCloseModal = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const openLinkYourStatement = urlParams.get("openLinkYourStatement");

    if (openLinkYourStatement === "1") {
      window.location.href =
        "https://stg.minty.co.in/datagathering/assets-liabilities";
    } else {
      setOpenModalByName(null);
    }
  };

  const handleClose = (type) => {
    if (type == "yes") {
      handleDelete(userId, assetId);
    } else {
      setShow(false);
    }
  };

  const showuniqueUANModalclose = () => {
    setShowuniqueUANModal(false);
  }

  const getMemberIdFn = () => {
    let isFamilySelected = Boolean(localStorage.getItem("family"));
    if (!isFamilySelected) {
      const userId = getUserId();
      const userIdArray = [userId];
      return userIdArray;
    } else {
      let users = JSON.parse(commonEncode.decrypt(localStorage.getItem("member")));
      const idsArray = users.map(item => String(item.id));
      return idsArray;
    }
  };

  const handleSyncNowClick = async () => {
    if (!user_data?.user_id) return;
    syncBtnRef.current.classList.add(Styles.syncBtn);
    const payload = {
      user_ids: [user_data.user_id]
    };

    try {
      const result = await autoUpdateAccountTransactions(payload);

      if (result.status_code === 200) {

        if (result.data.length === 0) {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success("Data already fetched");
          syncBtnRef.current.classList.remove(Styles.syncBtn);
          return;
        }
        await FetchBankbalaceDetails();

        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("Sync completed!");
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Sync failed!");
      }

    } catch (error) {
      console.error("Sync error:", error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong!");
    } finally {
      syncBtnRef.current.classList.remove(Styles.syncBtn);
    }
  };


  return (
    <div>
      <FintooLoader isLoading={isLoading} />

      {/* {(!props.assetEditId || props.assetEditId == "") &&
        assetsDetails.asset_sub_category_id == 61 && ( */}
      <>
        <div className="d-md-flex d-grid place-items-center place-content-center justify-content-center">
          <DgRoundedButton
            active={selectedButton == "Link Your Bank Statement"}
            onClick={() => {
              // setSelectedButton("Link Your Bank Statement");
              // setSelectedExtraOption("Link Your Bank Statement");
              // setOpenModalByName("Link_Account_Bank");
              setItemLocal("dgexternalfetchbankbal", true)
              navigate(`${process.env.PUBLIC_URL}/money-management/bank-tracking-overview/`);
            }}
            title="Link Your Bank Statement"
          />
          <DgRoundedButton
            active={selectedButton == "Manual Entry"}
            onClick={() => {
              setSelectedButton("Manual Entry");
              setSelectedExtraOption("Manual Entry");
              setAssetsDetails({
                ...assetsDetails,
                user_asset_name: "Bank Balance",
              });
            }}
            title="Enter Manually"
          />
        </div>
        {selectedButton == "Manual Entry" && (
          <form noValidate="novalidate" name="goldassetform">
            <div className="row">
              <div className="col-md-5 pt-1">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Name of Asset*"
                  className="mb-3 material"
                >
                  <Form.Control
                    placeholder="Name of Asset*"
                    className="shadow-none"
                    maxLength={35}
                    value={assetsDetails.user_asset_name}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_name: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      simpleValidator.current.showMessageFor("Asset Name");
                      forceUpdate(1);
                    }}
                    disabled={
                      assetsDetails.asset_type &&
                      assetsDetails.asset_type != "none"
                    }
                  />
                </FloatingLabel>
                {simpleValidator.current.message(
                  "Asset Name",
                  assetsDetails.user_asset_name,
                  "required|alpha_space|min:3|max:60",
                  {
                    messages: {
                      alpha_space: "Alphabets are allowed only.",
                      required: "Please enter asset name",
                      max: "Asset name must be between 3-35 characters.",
                      min: "Asset name must be between 3-35 characters.",
                    },
                  }
                )}
              </div>
              <div className="col-md-5">
                <div className="material">
                  <Form.Label>Name of holder*</Form.Label>
                  {familyData && (
                    <Select
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={familyData}
                      onChange={(e) =>
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_for: e.value,
                        })
                      }
                      value={familyData.filter(
                        (v) => v.value == assetsDetails.user_asset_for
                      )}
                      isDisabled={
                        assetsDetails.asset_type &&
                        assetsDetails.asset_type != "none"
                      }
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="row py-md-2">
              {assetsDetails.asset_sub_category_id != 63 && (
                <div className="col-md-5 mt-md-0">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Current Balance*"
                    className="mb-3 material"
                    style={{
                      paddingTop: "4px",
                    }}
                  >
                    <Form.Control
                      placeholder="Current Balance*"
                      className="shadow-none"
                      value={assetsDetails.user_asset_current_amount}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_current_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                        });
                      }}
                    />
                  </FloatingLabel>
                  {simpleValidator.current.message(
                    "Current Balance",
                    assetsDetails.user_asset_current_amount,
                    "required",
                    { messages: { required: "Please add asset value" } }
                  )}
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="d-md-flex">
                  <Form.Label className=" ">
                    Consider This Asset In Automated Linkage*
                  </Form.Label>
                  <span className="info-hover-left-box ms-md-4">
                    <span Name="icon">
                      <img
                        alt="More information"
                         src={imagePath + '/static/media/more_information.svg'}
                      />
                    </span>
                    <span className="msg">Ex: 400097</span>
                  </span>
                  <div className="d-flex ms-md-4">
                    <div>No</div>
                    <Switch
                      onChange={(v) =>
                        setAssetsDetails({
                          ...assetsDetails,
                            user_asset_automated_linkage : v
                        })
                      }
                       checked={assetsDetails.user_asset_automated_linkage === 1 ? true : false}
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
              {assetsDetails.user_asset_automated_linkage === true || assetsDetails.user_asset_automated_linkage === 1 && (
                <>
                  <div className="row py-md-2">
                    <div className="col-md-8 mt-md-2">
                      <div className="d-md-flex">
                        <Form.Label className="link_asset_style">
                          Link This Investment Asset to Goal
                        </Form.Label>{" "}
                        <span
                          className="ms-md-4 info-hover-left-box float-right"
                          style={{
                            position: "relative !important",
                          }}
                        >
                          <span className="icon">
                            <img
                              alt="More information"
                               src={imagePath + '/static/media/more_information.svg'}
                            />
                          </span>
                          <span className="msg">
                            You can only assign goals which are prior to the
                            end date of the SIP, if any
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 mt-md-0">
                    <div className="material   w-100">
                      <div
                        className="m-0 btn-sm default-btn gradient-btn save-btn"
                        onClick={() => setGoalSelected(true)}
                      >
                        Select Goals
                      </div>
                      <br></br>
                      <br></br>

                      {selectedGoals ? (
                        <div style={{ textAlign: "left!important" }}>
                          <b>Selected Goals : </b> {selectedGoals}
                        </div>
                      ) : (
                        ""
                      )}
                      {isGoalSelected ? (
                        <GoalsDropdown
                          setGoalSelected={setGoalSelected}
                          goals={goalData}
                          unchangedgoaldata={unchangedgoaldata}
                          closeModal={closeModal}
                          selectGoals={selectGoals}
                          selectedGoals={selectedGoals}
                          selectedGoalIdArray={selectedGoalIdArray}
                          selectedGoalsId={selectedGoalsId}
                          setPriorityArray={setPriorityArray}
                          selectedPriorityArray={selectedPriorityArray}
                          // setAutoMatedGoal={setAutoMatedGoal}
                          isAutoMatedGoal={isAutoMatedGoal}
                          setGoalLink={setGoalLink}
                          type={"Asset"}
                          asset_maturity_date={
                            assetsDetails?.user_asset_end_date
                          }
                        ></GoalsDropdown>
                      ) : (
                        ""
                      )}
                      <div className=""></div>
                    </div>
                  </div>
                </>
              )}
              <div className="row py-2">
                <div className=" text-center">
                  <div>
                    <div className="btn-container">
                      <div className="d-flex justify-content-center">
                        <Link
                          to={
                            process.env.PUBLIC_URL +
                            "/datagathering/insurance"
                          }
                        >
                          <div
                            className="previous-btn form-arrow d-flex align-items-center"
                            onClick={() => setTab("tab1")}
                          >
                            <FaArrowLeft />
                            <span className="hover-text">
                              &nbsp;Previous
                            </span>
                          </div>
                        </Link>

                        {addForm && (
                          <button
                            onClick={(e) => handleLiquidSubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleLiquidCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleLiquidUpdate(e)}
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
          </form>
        )}
        {/* { */}
        {/* // assetsDetails.asset_sub_category_id === 61 && */}
        {selectedButton !== "Manual Entry" && (
          <div className="mt-md-4">
            {//console.log("fetchbankbalanceDetails", fetchbankbalanceDetails)
            }
            <div className="table-responsive rTabl">
              <table className="bgStyleTable">
                <tbody>
                  <tr>
                    <th>Linked Bank</th>
                    <th>Member Name</th>
                    <th>Mobile Number</th>
                    <th>Connected On</th>
                    <th>Last Updated</th>
                    <th>Action</th>
                  </tr>
                  {fetchbankbalanceDetails && fetchbankbalanceDetails.length > 0 ? (
                    fetchbankbalanceDetails.map((item) => (
                      <tr key={item.id}>
                        <td>{item.mm_fip_name}</td>
                        <td>{item.first_name}</td>
                        <td>{item.mm_mobile_number}</td>
                        <td>
                          {moment(item.creation).format("LL")}
                        </td>
                        <td>
                          {moment(item.modified).format("LL")}
                        </td>
                        <td>
                          <div className="d-flex gap-3 align-items-center ">
                            <div ref={syncBtnRef} title="Refresh" onClick={handleSyncNowClick} style={{ cursor: "pointer" }}>
                              <i className={`fa-solid fa-rotate mt-1 ${Styles.rotateAnimetion}`} style={{
                                fontSize: "1.3rem"
                              }}></i>
                            </div>
                            <div>
                              <img
                                onClick={() => {
                                  handleShow();
                                  setUserId(item.mm_user_id);
                                  setAssetId(item);
                                }}
                                style={{ cursor: "pointer" }}
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/DG/Delete.svg"
                                }
                                alt="Delete"
                              />
                            </div>

                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
      {/* )} */}
      {/* {assetsDetails.asset_sub_category_id === 61 &&
        selectedExtraOption === "Link Your Bank Statement" && (
          <>
            <div className="d-flex justify-content-center">
              <DgRoundedButton
                active={selectedButton === "Link Account"}
                onClick={() => {
                  setSelectedButton("Link Account");
                  setSelectedExtraOption("Link Account");
                  setOpenModalByName("Link_Account_Bank");
                }}
                title="Link Account"
              />
            </div>
            <div className="mt-md-4">
              <div className="table-responsive rTabl">
                <table className="bgStyleTable">
                  <tbody>
                    <tr>
                      <th>Linked Bank</th>
                      <th>Member Name</th>
                      <th>Mobile Number</th>
                      <th>Connected On</th>
                      <th>Last Updated</th>
                      <th>Action</th>
                    </tr>
                    {bankBalanceData && bankBalanceData.length > 0 ? (
                      bankBalanceData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.bank_name}</td>
                          <td>{item.member_name}</td>
                          <td>{item.mobile_number}</td>
                          <td>{moment(item.created_datetime).format("LL")}</td>
                          <td>{moment(item.updated_datetime).format("LL")}</td>
                          <td>
                            <div className="d-flex">
                              <div>
                                <img
                                  onClick={() => {
                                    handleShow();
                                    setUserId(item.user_id);
                                    setAssetId(item.asset_id);
                                  }}
                                  style={{ cursor: "pointer" }}
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "media/DG/Delete.svg"
                                  }
                                  alt="Delete"
                                />
                              </div>
                              <div className="ps-4">
                                <div>
                                  <img
                                    onClick={() => {
                                      handleRefresh(
                                        item.user_id,
                                        item.consent_id,
                                        item.consent_handle,
                                        item.daterange_from,
                                        item.daterange_to,
                                        item.cust_id
                                      );
                                      setAssetId(item.asset_id);
                                    }}
                                    style={{ cursor: "pointer" }}
                                    src={
                                      process.env.REACT_APP_STATIC_URL +
                                      "media/DG/Refresh.svg"
                                    }
                                    alt="Refresh"
                                  />
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )} */}



      {/* For Link Account */}

      <Modal
        dialogClassName="Nsdlcsdl-modal-width"
        show={openModalByName == "Link_Account_Bank"}
        centered
        animationDuration={0}
      >
        <div className="" style={{ padding: "0 !important" }}>
          <div className="">
            <div className="RefreshModalpopup_Heading col-12 d-flex ">
              <div className={`${Styles.modal_Heading}`}>
                Link Your Bank Account
              </div>
              <div className={`${Styles.CloseBtnpopup}`}>
                <img
                  onClick={() => {
                    handleCloseModal();
                  }}
                  style={{ cursor: "pointer", right: 0 }}
                  src={process.env.REACT_APP_STATIC_URL + "media/DG/Close.svg"}
                  alt="Close"
                />
              </div>
            </div>
            <div className={`modalBody ${Styles.DematmodalBody}`}>
              <div
                className={`${Styles.LeftSection}  ${Styles.LiquidLeftSection}`}
              >
                <div>
                  To retrieve your bank balance, please enter your details:
                </div>
                <div className="mt-3">
                  <div className={`${Styles.title}`}>Member</div>
                  <div className="mt-2">
                    <Select
                      classNamePrefix="sortSelect"
                      placeholder="Select Member"
                      isSearchable={false}
                      styles={customStyles}
                      options={allMembers}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={allMembers?.filter(
                        (v) => v.id == selectedMember.id
                      )}
                    />
                  </div>
                  <div className="mt-3">
                    <div className={`${Styles.title}`}>Mobile Number</div>
                    <div className="mt-2">
                      <input
                        className={`${Styles.inputField}`}
                        type="number"
                        id="mobile"
                        placeholder="Enter Your Mobile Number"
                        value={selectedMember.mobile ?? ""}
                        onChange={(e) => handleMobileChange(e)}
                      />
                      {errors.userMobile && (
                        <p className="error">{errors.userMobile}</p>
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          id="isTermsChecked"
                          name=""
                          tabIndex="1"
                          className={`custom-checkbox ${Styles.inputCheckBox}`}
                          checked={isTermsChecked}
                          onChange={(e) => {
                            handleCheckboxClick(e);
                          }}
                        />
                        <label
                          htmlFor="terms"
                          style={{
                            paddingTop: "2px",
                            fontSize: "15px",
                            cursor: "pointer",
                            paddingLeft: "8px",
                          }}
                        >
                          Accept &nbsp;
                          <a
                            className={`${Styles.LinkTerms}`}
                            style={{
                              fontWeight: "500",
                            }}
                            href="https://finvu.in/terms" // Replace with the URL you want to link to
                            target="_blank"
                          >
                            Terms & Conditions
                          </a>
                        </label>
                      </div>
                      <div className="error">{termsError}</div>
                    </div>
                  </div>
                  <div className="ButtonBx d-flex justify-content-center">
                    <button
                      type="button"
                      className="Unlink"
                      onClick={(e) => {
                        handleLinkAccountClick(e);
                      }}
                    >
                      Link Account
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`d-md-block d-none ${Styles.RightSection} ${Styles.LiquidRightSection}`}
              >
                <center>
                  <img
                    src={
                      process.env.REACT_APP_STATIC_URL +
                      "media/DG/BankLayout.png"
                    }
                    alt="Bank"
                  />
                </center>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Consent Under Process */}
      <Modal
        centered
        backdrop="static"
        show={openModalByName == "ApprovedConsent"}
        onHide={() => {
          setOpenModalByName("ApprovedConsent");
        }}
      >
        <div className={`${Bankbalance.ApprovedConsent}`}>
          <div className={`text-center ${Bankbalance.modalHeader}`}>
            Consent Under Process
          </div>
          <div className={`${Bankbalance.ApprovedConsentData}`}>
            { }
            <div>
              <img
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/DG/ConsentDenied.png"
                }
              />
            </div>
            <div className={`${Bankbalance.ApprovedConsentcontent}`}>
              It is taking longer than usual to fetch your data. We will notify
              you once your consent is approved by the bank.
            </div>
          </div>
          <div className={`mt-4 ${Bankbalance.alternateOption}`}>
            <button
              style={{ padding: "10px 64px" }}
              onClick={() => {
                setOpenModalByName("");
                FetchBankbalaceDetails();
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>

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
              handleClose("yes");
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
      {assetsDetails.asset_sub_category_id == 125 && (
        <>
          <form noValidate="novalidate" name="goldassetform">
            <div className="row d-flex align-items-center">
              <div className="col-md-5 custom-input">
                <div
                  className={`form-group w-100 ${assetsDetails.user_asset_name ? "inputData" : null
                    }`}
                  style={{ paddingTop: "17px" }}
                >
                  <input
                    type="text"
                    id="asset_name_2332"
                    name="asset_name"
                    maxLength={35}
                    className="shadow-none"
                    value={"Liquid"}
                    disabled="disabled"
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_name: e.target.value,
                      });
                    }}
                    autoComplete="off"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Asset Class</label>
                </div>
              </div>
              <div className="col-md-5">
                <div
                  className="material"
                  style={{
                    marginTop:
                      assetsDetails.asset_sub_category_id == 73 ? "0px" : "0",
                  }}
                >
                  <Form.Label>Select Subclass *</Form.Label>
                  {/* {props.filteredAssetsData.select_subclass && (
                    // <Select
                    //   classNamePrefix="sortSelect"
                    //   isSearchable={false}
                    //   styles={customStyles}
                    //   options={modifiedData}
                    //   onChange={(e) => {
                    //     setAssetsDetails((prev) => ({
                    //       ...prev,
                    //       asset_sub_class_id: e.value,
                    //       asset_id: e.asset_id,
                    //     }));
                    //   }}
                    //   value={props.filteredAssetsData.select_subclass.filter(
                    //     (v) => v.value == assetsDetails.asset_sub_class_id
                    //   )}
                    // /> */}
                  <input
                    name="user_asset_investment_amount"
                    id="user_asset_investment_amount_232"
                    className="shadow-none "
                    disabled="disabled"
                    value={subClass}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  {/* // )} */}
                </div>
              </div>
            </div>

            <div className="row d-flex align-items-center py-md-2">
              <div className="col-md-5">
                <div className="material">
                  <Form.Label> Investment From *</Form.Label>
                  <input
                    name="user_asset_investment_amount"
                    id="user_asset_investment_amount_553"
                    className="shadow-none "
                    disabled="disabled"
                    value={investmentFrom}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  {/* {familySortedData && (
                    <Select
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      placeholder="Select..."
                      options={familySortedData}
                      onChange={(e) =>
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_for: e.value,
                        })
                      }
                      value={familySortedData.filter(
                        (v) => v.value == assetsDetails.user_asset_for
                      )}
                    />
                  )} */}
                </div>
              </div>
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    name="user_asset_investment_amount"
                    id="user_asset_investment_amount_989"
                    className="shadow-none "
                    disabled="disabled"
                    value={multipleTotalInvestedValue}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Total Invested Value</label>
                </div>
              </div>
            </div>
            <div className="row py-md-2">
              <div className="col-md-5 custom-input ">
                <div className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    id="user_asset_investment_amount_763"
                    name="user_asset_investment_amount"
                    className="shadow-none "
                    disabled="disabled"
                    value={multipleTotalCurrentValue}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Total Current Value</label>
                </div>
              </div>
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    id="user_asset_investment_amount_998"
                    name="user_asset_investment_amount"
                    className="shadow-none "
                    disabled="disabled"
                    value={multipleTotalAssetValueLinked}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Asset Value Linked</label>
                </div>
              </div>
            </div>

            <div className="row py-md-2">
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    id="user_asset_investment_amount_4343"
                    name="user_asset_investment_amount"
                    className="shadow-none "
                    disabled="disabled"
                    value={multipleTotalAssetValueForLinkages}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Asset Available for Linkages</label>
                </div>
              </div>
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    id="user_asset_investment_amount_7653"
                    name="user_asset_investment_amount"
                    className="shadow-none "
                    disabled="disabled"
                    value={multipleTotalRecurringInvestment}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Recurring Investment</label>
                </div>
              </div>
            </div>

            <div className="row py-md-2 mt-md-1">
              <div className="col-md-8">
                <div className="d-md-flex">
                  <Form.Label className=" ">
                    Consider This Asset In Automated Linkage*
                  </Form.Label>
                  <span className="info-hover-left-box ms-md-4">
                    <span Name="icon">
                      <img
                        alt="More information"
                         src={imagePath + '/static/media/more_information.svg'}
                      />
                    </span>
                    <span className="msg">
                      Select a goal below to map this investment with a goal of
                      your choice. Otherwise, Fintoo will link it automatically
                      with your high priority goal. In case, you do not wish to
                      utilize this investment for any goal, select "NO".
                    </span>
                  </span>
                  <div className="d-flex ms-md-4">
                    <div>No</div>
                    <Switch
                      onChange={(v) =>
                        setAssetsDetails({
                          ...assetsDetails,
                            user_asset_automated_linkage : v
                        })
                      }
                       checked={assetsDetails.user_asset_automated_linkage === 1 ? true : false}
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

            {assetsDetails.user_asset_automated_linkage === true || assetsDetails.user_asset_automated_linkage === 1 && (
              <>
                <div className="row py-md-2">
                  <div className="col-md-8 mt-md-2">
                    <div className="d-md-flex">
                      <Form.Label className="link_asset_style">
                        Link This Investment Asset to Goal
                      </Form.Label>
                      <span
                        className="ms-md-4 info-hover-left-box float-right"
                        style={{
                          position: "relative !important",
                        }}
                      >
                        <span className="icon">
                          <img
                            alt="More information"
                             src={imagePath + '/static/media/more_information.svg'}
                          />
                        </span>
                        <span className="msg">
                          You can only assign goals which are prior to the end
                          date of the asset
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 mt-md-2 mt-5">
                    <div className="material">
                      <div
                        className="m-0 btn-sm default-btn gradient-btn save-btn"
                        onClick={() => setGoalSelected(true)}
                      >
                        Select Goals
                      </div>
                      <br></br>
                      <br></br>

                      {selectedGoals ? (
                        <div
                          className="d-flex"
                          style={{ textAlign: "left!important" }}
                        >
                          <div>
                            <b>Selected Goals : </b>
                          </div>
                          <div className="ms-1">{selectedGoals}</div>
                        </div>
                      ) : (
                        ""
                      )}
                      {isGoalSelected ? (
                        <GoalsDropdown
                          setGoalSelected={setGoalSelected}
                          goals={goalData}
                          unchangedgoaldata={unchangedgoaldata}
                          closeModal={closeModal}
                          selectGoals={selectGoals}
                          selectedGoals={selectedGoals}
                          selectedGoalIdArray={selectedGoalIdArray}
                          selectedGoalsId={selectedGoalsId}
                          setPriorityArray={setPriorityArray}
                          selectedPriorityArray={selectedPriorityArray}
                          // setAutoMatedGoal={setAutoMatedGoal}
                          isAutoMatedGoal={isAutoMatedGoal}
                          setGoalLink={setGoalLink}
                          asset_maturity_date={assetsDetails?.user_asset_end_date}
                          type={"Asset"}
                          assetEditId={assetEditId}
                          isGoalFilter={
                            assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"
                          }
                          isAssetRecurring={
                            assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"
                          }
                        ></GoalsDropdown>
                      ) : (
                        ""
                      )}
                      <div className=""></div>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="row py-2">
              <div className=" text-center">
                <div>
                  <div className="btn-container">
                    <div className="d-flex justify-content-center">
                      <Link
                        to={process.env.PUBLIC_URL + "/datagathering/goals"}
                      >
                        <div className="previous-btn form-arrow d-flex align-items-center">
                          <FaArrowLeft />
                          <span className="hover-text">&nbsp;Previous</span>
                        </div>
                      </Link>

                      {props.addForm && (
                        <button
                          type="button"
                          onClick={(e) => handleLiquidSubmit(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Save & Add More
                        </button>
                      )}
                      {props.updateForm && (
                        <div>
                          <button
                            onClick={(e) => handleLiquidCancel(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleLiquidUpdate(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Update
                          </button>
                        </div>
                      )}

                      <div
                        className="next-btn form-arrow d-flex align-items-center"
                        onClick={() => {
                          ScrollToTop();
                          props.setTab("tab2");
                        }}
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
            </div>
          </form>
        </>
      )}
      <Modal
        classNames={{
          modal: "RefreshModalpopup",
        }}
        show={showuniqueUANModal}
        showCloseIcon={false}
        onClose={() => () => { }}
        centered
        animationDuration={0}
      >
        <Uniquepannotfoundmodal showuniqueUANModalclose={showuniqueUANModalclose} pannumbers={pannumbers} familyecas={familyecas} familyData={familyData} memberdataid={memberdataid} session={session} />
      </Modal>
    </div>
  );
};

export default Liquid;
