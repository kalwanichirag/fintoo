import React, { useState, useEffect, useRef } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Select, { components } from "react-select";
import ReactDatePicker from "../../../components/HTML/ReactDatePicker/ReactDatePicker";
import FintooRadio2 from "../../../components/FintooRadio2";
import Switch from "react-switch";
import moment from "moment";
import Slider from "../../../components/HTML/Slider";
import DgRoundedButton from "../../../components/HTML/DgRoundedButton";
import DgDragDrop from "../../../components/HTML/DgDragDrop";
import DgDragDrop2 from "../../../components/HTML/DgDragDrop/DgDragDrop2";
import commonEncode from "../../../commonEncode";
import {
  BASE_API_URL,
  imagePath,
} from "../../../constants";
import {
  apiCall,
  fetchData,
  fetchEncryptData,
  fv,
  getParentUserId,
  setItemLocal,
} from "../../../common_utilities";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SimpleReactValidator from "simple-react-validator";
import { Modal } from "react-bootstrap";
import LinkYourHoldingsDG from "./LinkYourHoldingsDG";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useDispatch } from "react-redux";
import GoalsDropdown from "../../../components/GoalsDropdown/GoalDropdown";
import LinkEPF from "./LinkEPF";
import customStyles from "../../../components/CustomStyles";
import FintooLoader from "../../../components/FintooLoader";
import { ScrollToTop } from "../ScrollToTop"
import { Buffer } from "buffer";
import Uniquepannotfoundmodal from "./Uniquepannotfoundmodal";
import Liquid from "./Liquid";
import { autoUpdateAccountTransactions, fetchTrackedBankDetails, stopTrackingBank } from "../../../FrappeIntegration-Services/services/money-management-api/moneyManagementService";
import Styles from "../AssetsLibDG/NSDL_CSDL/style.module.css";
const Purchaseoptions = [
  { value: 'Cumulative', label: "Cumulative" },
  { value: 'Non-Cumulative', label: "Non-Cumulative" },
];
const Frequencyoptions = [
  { value: 'Monthly', label: "Monthly" },
  { value: 'Quarterly', label: "Quarterly" },
  { value: 'Half Yearly', label: "Half Yearly" },
  { value: 'Yearly', label: "Yearly" },
];
function AssetDebt(props) {

  const navigate = useNavigate();
  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');

  const [fetchbankbalanceDetails, setFetchBankBalanceDeatils] = useState([]);

  const syncBtnRef = useRef(null)


  const [selectDebtFunds, setSelectedDebtFunds] = useState("");
  const [retirementDate, setRetirementDate] = useState("");
  const [lifeExpectancyDate, setLifeExpectancyDate] = useState("");
  const [editFlag, setEditFlag] = useState(false);
  const [showuniqueUANModal, setShowuniqueUANModal] = useState(false);
  const [pannumbers, setPanNumbers] = useState([]);
  const [familyecas, setFamilyEcas] = useState([]);
  const [selfData, setSelfData] = useState({});
  const [selectedEndAge, setselectedEndAge] = useState("1");
  const [memberdataid, setMemberDataId] = useState({})
  const setAssetsDetails = props.setAssetsDetails;
  const assetsDetails = props.assetsDetails;
  const familyData = props.familyData;
  const goalData = props.goalData;
  const setDate = props.setDate;
  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true);
  const [userId, setUserId] = useState("");
  const [assetId, setAssetId] = useState("");


  const debtfunds = props.debtfunds;

  const session = props.session;
  const addForm = props.addForm;
  const updateForm = props.updateForm;
  const addAssetsSubmit = props.addAssetsSubmit;
  const cancelAssetForm = props.cancelAssetForm;
  const updateAssetsSubmit = props.updateAssetsSubmit;
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
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, setForceUpdate] = useState(0);
  const dispatch = useDispatch();
  const assetEditId = props.assetEditId;
  const skipFirstTimeLoad = useRef(null);


  const [selectedButton, setSelectedButton] = useState("");
  const [selectedExtraOption, setSelectedExtraOption] = useState("");

  useEffect(() => {
    if (assetsDetails.asset_type_name_uuid === "epf") {
      setSelectedButton("EPF Manual Entry");
      setSelectedExtraOption("EPF Manual Entry");
    } else if (assetsDetails.asset_type_name_uuid === "saving_account") {
      setSelectedButton("Bank Statement Manual Entry");
      setSelectedExtraOption("Bank Statement Manual Entry");
    }
  }, [assetsDetails.asset_type_name_uuid]);

  const linkyourHoldings = [
    { value: "Self", label: "Self" },
    { value: "Spouse", label: "Spouse" },
  ];
  const [selectedOption, setSelectedOptionLink] = useState(null);


  const debtFundsData = debtfunds.map((item) => {
    return {
      label: item.scheme_name,
      value: item.nav,
      data: item,
    };
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isInstallmentVisible, setInstallmentIsVisible] = useState(false);

  const handleDebtFundSelection = (selectedOption) => {
    setAssetsDetails((prev) => ({
      ...prev,
      user_asset_name: selectedOption.label,
      user_asset_current_price: parseFloat(selectedOption.value).toFixed(2),
      // scheme_equity: selectedOption.data,
    }));
    // setAssetsDetails((prev) => ({
    //   ...prev,
    //   user_asset_name: selectedOption.label, // Set the asset_name using the selected fund name
    //   user_asset_current_price: parseFloat(selectedOption.value).toFixed(2),
    // }));
  };

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

  useEffect(() => {
    if (getParentUserId()) {
      FetchBankbalaceDetails()
    }
  }, [])

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

    // let payload2 = {
    //   url: ADVISORY_DELETE_BANK_DATA,
    //   data: {
    //     user_id: id.toString(),
    //     asset_id: asset_id,
    //   },
    //   method: "post",
    // };

    // const r = await fetchData(payload);
    // if (r["error_code"] == "0") {
    //   props.deleteAssetData(asset_id);
    //   toastr.options.positionClass = "toast-bottom-left";
    //   // toastr.success("Data deleted successfully");
    //   FetchBankbalaceDetails();
    // }
  };

  useEffect(() => {
    if (assetsDetails.user_asset_payout_type == "Non-Cumulative") {
      setIsVisible(true);
    }
  }, [assetsDetails?.user_asset_payout_type]);

  const Input = (props) => {
    const { autoComplete = props.autoComplete } = props.selectProps;
    return <components.Input {...props} autoComplete={autoComplete} />;
  };

  const changeHandler = (e) => {
    if (e === 2) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // EPF states

  const [showEPFForm, setShowEPFForm] = useState(false);
  const [showUANModal, setShowUANModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isManual, setIsManual] = useState(false);

  //constants

  useEffect(() => {
    setShowEPFForm(false);
    setShowUANModal(false);
    setShowOTPModal(false);
  }, assetsDetails.asset_sub_name_uuid == 'debt_mf');

  // Upload Document

  const [docPassword, setDocPassword] = useState("");
  const [dropFiles, setdropFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const ecashUploadDocument = async () => {
    try {
      var form = new FormData();
      form.append("ecash_type", "CAMS");
      form.append("ecash_passkey", docPassword);
      form.append("fp_user_id", session["data"]["fp_user_id"]);
      form.append("fp_log_id", session["data"]["fp_log_id"]);
      form.append("doc_user_id", session["data"]["id"]);

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

      if (ecash_upload["error_code"] == "100") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("Document uploaded successfully");
        getUnassignedAsset()
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
        setdropFiles([]);
        setDocPassword("");
        setForceUpdate((v) => ++v);
        dispatch({ type: "RESET_DRAGZONE", payload: true });
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
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
      setIsLoading(true);
      ecashUploadDocument();
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
      dispatch({ type: "RESET_DRAGZONE", payload: true });
    }
  };

  useEffect(() => {
    simpleValidator.current.hideMessages();
    simpleValidator.current.purgeFields();

    if (assetEditId) {
      if (selectedGoals == "Automated Linkage") {
        setAutoMatedGoal(true);
        setSelectedGoals("Automated Linkage");
      } else {
        setAutoMatedGoal(false);
      }
    } else {
      setAutoMatedGoal(true);
      setSelectedGoals("Automated Linkage");
    }
    if (session && !assetEditId) {
      setGoalSelected(false);
      setSelectedGoalsId(false);
      setSelectedPriorityArray([]);
      props.getfpgoalsdata(session.data.fp_log_id);
    }
    setForceUpdate((v) => ++v);
  }, [
    assetsDetails?.asset_type_name_uuid,
    assetsDetails?.user_asset_occurance,
    selectedButton,
  ]);

  // useEffect(() => {
  //   getRetirementData();
  // }, []);

  // const getRetirementData = async () => {
  //   try {
  //     // var retire_data = {
  //     //   fp_log_id: session["data"]["fp_log_id"],
  //     //   fp_user_id: session["data"]["id"],
  //     // };
  //     // var payload_retire_data = commonEncode.encrypt(
  //     //   JSON.stringify(retire_data)
  //     // );
  //     // var config_ret = await apiCall(
  //     //   ADVISORY_UPDATE_RETIREMENT_DATE_API_URL,
  //     //   payload_retire_data,
  //     //   false,
  //     //   false
  //     // );
  //     // var res_ret = JSON.parse(commonEncode.decrypt(config_ret));
  //     // if (res_ret.error_code == "100") {
  //     //   var retirement_date = moment(res_ret["data"][0]["dob"])
  //     //     .add(res_ret["data"][0]["retirement_age"], "y")
  //     //     .format("MM/DD/YYYY");
  //     //   var life_expectancy_date = moment(res_ret["data"][0]["dob"])
  //     //     .add(res_ret["data"][0]["life_expectancy"], "y")
  //     //     .format("MM/DD/YYYY");
  //     //   setRetirementDate(retirement_date);
  //     //   setLifeExpectancyDate(life_expectancy_date);
  //     // }
  //     if (session) {
  //       var retirement_date = moment(session["data"]["user_details"]['dob'])
  //         .add(session["data"]["user_details"]['retirement_age'], "y")
  //         .format("MM/DD/YYYY");
  //       var life_expectancy_date = moment(session["data"]["user_details"]['dob'])
  //         .add(session["data"]["user_details"]['life_expectancy'], "y")
  //         .format("MM/DD/YYYY");

  //       setRetirementDate(retirement_date);
  //       setLifeExpectancyDate(life_expectancy_date);
  //       setSelfData({ 'retirement_date': retirement_date, 'life_expectancy_date': life_expectancy_date });

  //     }
  //   } catch {
  //     (e) => { };
  //   }
  // };

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

  const handleAssetMemberMaturityDate = async (member) => {
    let retirement_date = ""
    let life_expectancy_date = ""
    if (member['isdependent'] == "0") {
      retirement_date = moment(member['dob'])
        .add(member['retirement_age'], "y")
        .format("MM/DD/YYYY");
      life_expectancy_date = moment(member['dob'])
        .add(member['life_expectancy'], "y")
        .format("MM/DD/YYYY");
    } else {
      // setRetirementDate(selfData["retirement_date"]);
      // setLifeExpectancyDate(selfData["life_expectancy_date"]);
      retirement_date = selfData["retirement_date"];
      life_expectancy_date = selfData["life_expectancy_date"]
    }
    setRetirementDate(retirement_date);
    setLifeExpectancyDate(life_expectancy_date);

    // setAssetsDetails((prev) => ({
    //   ...prev,
    //   user_asset_for: e.value,
    // }));
    if (assetsDetails.asset_sub_name_uuid == 'debt_mf' && selectedExtraOption == "Manual Entry") {
      if (selectedEndAge == "Upto Retirement Age") {
        setAssetsDetails({
          ...assetsDetails,
          // user_asset_valid_till: "Upto Retirement Age",
          user_asset_end_date: moment(retirement_date).format("DD/MM/YYYY"),
          user_asset_for: member.value,
        });
        // assetsDetails.user_asset_end_date = moment(retirement_date).format("DD/MM/YYYY");
      } else if (selectedEndAge == "Upto Life Expectancy Age") {
        setAssetsDetails({
          ...assetsDetails,
          // user_asset_valid_till: "Upto Retirement Age",
          user_asset_end_date: moment(life_expectancy_date).format("DD/MM/YYYY"),
          user_asset_for: member.value,
        });
      }
    }
    if (assetsDetails.asset_type_name_uuid == "epf" && selectedExtraOption == "EPF Manual Entry") {
      if (selectedEndAge == "Upto Retirement Age") {
        setAssetsDetails({
          ...assetsDetails,
          // user_asset_valid_till: "Upto Retirement Age",
          user_asset_maturity_date: moment(retirement_date).format("DD/MM/YYYY"),
          user_asset_for: member.value,
        });
      }
    }
    if (assetsDetails.asset_type_name_uuid == 'ppf' || assetsDetails.asset_type_name_uuid == 'pension_schemes' || assetsDetails.asset_type_name_uuid == 'sukanya_samriddhi_yojana' || assetsDetails.asset_type_name_uuid == 'rd') {
      if (selectedEndAge == "Upto Retirement Age") {
        setAssetsDetails({
          ...assetsDetails,
          user_asset_valid_till: "Retirement",
          user_asset_maturity_date: moment(retirement_date).format("DD/MM/YYYY"),
          user_asset_for: member.value,
        });
      }
    }
    // if (selectedEndAge == "1"){
    //   setAssetsDetails({
    //   ...assetsDetails,
    //   user_asset_valid_till: "Upto Retirement Age",
    //   user_asset_maturity_date: moment(retirement_date)
    //     .add(retirement_date, "y")
    //     .format("DD/MM/YYYY"),
    //   user_asset_for: member.value,
    // });
    // }else if (selectedEndAge == "2"){
    //   setAssetsDetails((prev) => ({
    //     ...prev,
    //     user_asset_valid_till: "2",
    //     user_asset_end_date: moment(life_expectancy_date)
    //       .add(life_expectancy_date, "y")
    //       .format("DD/MM/YYYY"),
    //   }));
    // }

  }
  const [formSubmitted, setFormSubmitted] = useState(false);
  const handleDebtSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    const isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    const type = assetsDetails.asset_type_name_uuid;

    // Frequency validation
    let isFrequencySelected = !!assetsDetails.user_asset_freq;
    let isFrequencyValid = true;

    if (
      ["nps", "pension_schemes", "ppf", "sukanya_samriddhi_yojana", "rd"].includes(type) &&
      assetsDetails.user_asset_freq === "One Time"
    ) {
      isFrequencyValid = false;
      isFrequencySelected = false; // treat as not selected
    }

    if (!assetsDetails.user_asset_freq) {
      isFrequencyValid = false;
      isFrequencySelected = false;
    }

    // Payout type validation
    let isPayoutTypeValid = true;

    if (
      [
        "fixed_deposit",
        "post_office_schemes",
        "debentures",
        "public_bonds",
        "private_bonds",
        "government_schemes_others"
      ].includes(type) &&
      !assetsDetails.user_asset_payout_type
    ) {
      isPayoutTypeValid = false;
    }

    if (isFormValid && isFrequencySelected && isFrequencyValid && isPayoutTypeValid) {
      addAssetsSubmit(e);
      setGoalSelected(false);
      setSelectedGoalsId(false);
      setSelectedPriorityArray([]);
      setAutoMatedGoal(true);
      setSelectedGoals("Automated Linkage");
      simpleValidator.current.hideMessages();
      setFormSubmitted(false);
      setForceUpdate((v) => ++v);
    }
  };


  const handleDebtUpdate = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      // setIsLoading(true);
      updateAssetsSubmit(e);
      setGoalSelected(false);

      setSelectedGoalsId(false);
      setSelectedPriorityArray([]);
      setAutoMatedGoal(true);
      setSelectedGoals("Automated Linkage");
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
    }
  };

  const handleDebtCancel = async (e) => {
    e.preventDefault();
    cancelAssetForm(e);
    simpleValidator.current.hideMessages();
    setForceUpdate((v) => ++v);
  };

  const showuniqueUANModalclose = () => {
    setShowuniqueUANModal(false);
  }

  // {
  //   title: "Debt",
  //   id: 38,
  //   child: [
  //     { title: "Debentures", id: 80 },
  //     { title: "Debt Mutual Funds", id: 77 },
  //     { title: "EPF", id: 117 },
  //     { title: "Fixed Deposit", id: 75 },
  //     { title: "Gratuity", id: 82 },
  //     { title: "Govt Bonds", id: 79 },
  //     { title: "Govt. Schemes", id: 76 },
  //     { title: "NPS", id: 118 },
  //     { title: "NSC/KVP", id: 84 },
  //     { title: "Pension Schemes", id: 85 },
  //     { title: "Post Office Scheme", id: 78 },
  //     { title: "PPF/GPF/VPF", id: 81 },
  //     { title: "Sukanya Samriddhi Yojana", id: 86 },
  //     { title: "Recurring Deposit", id: 120 },
  //     { title: "Others", id: 87 },
  //   ],
  // },
  {
    //console.log("moneymanagement_thanks", assetsDetails)
  }

  const handleClose = (type) => {
    if (type == "yes") {
      handleDelete(userId, assetId);
    } else {
      setShow(false);
    }
  };

  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <form noValidate="novalidate" name="goldassetform">
        {(assetsDetails.asset_type_name_uuid == 'fixed_deposit' || //Fixed Deposit
          assetsDetails.asset_type_name_uuid == 'post_office_schemes' || //post_office_schemes
          // assetsDetails.asset_type_name_uuid == 13 || //Post Office Schemes
          // assetsDetails.asset_type_name_uuid == 79 || // govt. bonds --- missing
          assetsDetails.asset_type_name_uuid == 'debentures' || // Debentures
          assetsDetails.asset_type_name_uuid == 'public_bonds' || // public_bonds
          assetsDetails.asset_type_name_uuid == 'private_bonds' || // public_bonds
          assetsDetails.asset_type_name_uuid == 'government_schemes_others')  // Others
          && (
            <>
              <form noValidate="novalidate" name="goldassetform">
                <div className="row d-flex align-items-center">
                  <div className="col-md-5 custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                        } `}
                      style={{ paddingTop: "18px" }}
                    >
                      <input
                        type="text"
                        id="asset_name_d"
                        name="asset_name"
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
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Name of Asset*</label>
                    </div>
                    {simpleValidator.current.message(
                      "Asset Name",
                      assetsDetails.user_asset_name,
                      "required|min:3|max:60",
                      {
                        messages: {
                          required: "Please enter asset name",
                          max: "Asset name must be between 3-35 characters.",
                          min: "Asset name must be between 3-35 characters.",
                        },
                      }
                    )}
                  </div>
                  <div className="col-md-5">
                    <div className="material">
                      <Form.Label>Who is investment For?*</Form.Label>
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
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="row d-flex align-items-center py-md-2 ">
                  <div className="col-md-5 ">
                    <div className="material" style={{ marginTop: "5px" }}>
                      <Form.Label className="mb-0">Date of Purchase*</Form.Label>
                      <div
                        className="dt-conbx"
                        style={{
                          borderBottom: "1px solid #dadada",
                          paddingTop: "0px",
                        }}
                      >
                        <ReactDatePicker
                          select_date={moment(
                            assetsDetails.user_asset_purchase_date,
                            "DD/MM/YYYY"
                          ).toDate()}
                          setDate={(date) => {
                            setDate(date, "assetPurchaseDate");
                          }}
                          minDate={""}
                          maxDate={moment().toDate()}
                          className="pt-4"
                        />
                      </div>
                      {simpleValidator.current.message(
                        "Asset Purchase Date",
                        assetsDetails.user_asset_purchase_date,
                        "required",
                        { messages: { required: "Please select purchase date" } }
                      )}
                    </div>
                  </div>
                  <div className="col-md-5  custom-input">
                    <div
                      className={`${assetsDetails.user_asset_investment_amount ? "inputData" : null
                        } `}
                      style={{ paddingTop: "19px" }}
                    >
                      <input
                        type="Number"
                        id="user_asset_investment_amount"
                        name="user_asset_investment_amount"
                        value={assetsDetails.user_asset_investment_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                            isEditable: true,
                          });
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Purchase Amount (₹)*</label>
                    </div>
                    <div className="w-100">
                      {simpleValidator.current.message(
                        "Asset Purchase Amount",
                        assetsDetails.user_asset_investment_amount,
                        "required",
                        {
                          messages: {
                            required: "Please add asset purchase amount",
                          },
                        }
                      )}
                    </div>
                  </div>
                </div>

                <div className="row py-md-2 mt-3">
                  <div className="col-md-5 mt-4">
                    <div className="material">
                      <Form.Label>
                        Rate Of Return (%)* : {assetsDetails.user_asset_ror}
                      </Form.Label>
                      <div
                        className={`${assetsDetails.user_asset_ror < 1 && "sl-hide-left"
                          } ${assetsDetails.user_asset_ror > 18.5 && "sl-hide-right"}`}
                      >
                        <Slider
                          key={"sld-" + assetsDetails.asset_type_name_uuid}
                          min={0}
                          max={20}
                          step={0.05}
                          value={assetsDetails.user_asset_ror}
                          onChange={(v) =>
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_ror: v,
                              isEditable: true,
                            })
                          }
                        // defaultValue={assetsDetails.user_asset_ror}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="material">
                      <Form.Label>Payout Type*</Form.Label>

                      <Select
                        classNamePrefix="sortSelect"
                        styles={customStyles}
                        options={Purchaseoptions}
                        defaultValue={Purchaseoptions[0]}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_payout_type: e.value,
                            isEditable: true,
                          });
                          changeHandler(e.value);
                        }}
                        value={Purchaseoptions.filter(
                          (v) => v.value == assetsDetails.user_asset_payout_type
                        )}
                      />
                    </div>
                    {formSubmitted &&
                      [
                        "fixed_deposit",
                        "post_office_schemes",
                        "debentures",
                        "public_bonds",
                        "private_bonds",
                        "government_schemes_others"
                      ].includes(assetsDetails.asset_type_name_uuid) &&
                      !assetsDetails.user_asset_payout_type && (
                        <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                          Please select payout type
                        </div>
                      )}
                  </div>
                </div>
                {isVisible ? (
                  <>
                    <div className="row py-md-2">
                      <div className="col-md-5">
                        <div className="material">
                          <Form.Label>Frequency*</Form.Label>
                          <Select
                            classNamePrefix="sortSelect"
                            isSearchable={false}
                            styles={customStyles}
                            defaultValue={Frequencyoptions[3]}
                            options={Frequencyoptions}
                            onChange={(e) => {
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_freq: e.value,
                                isEditable: true,
                              });
                            }}
                            value={Frequencyoptions.filter(
                              (v) => v.value == assetsDetails.user_asset_freq
                            )}
                          />
                        </div>
                      </div>


                    </div>
                  </>
                ) : null}
                <div className="row d-flex align-items-center py-md-2 ">
                  <div className="col-md-5 ">
                    <div className="material">
                      <Form.Label className="mb-0">Maturity Date*</Form.Label>
                      <div
                        className="dt-conbx"
                        style={{
                          borderBottom: "1px solid #dadada",
                          // paddingTop: "0px",
                        }}
                      >
                        <ReactDatePicker
                          select_date={moment(
                            assetsDetails.user_asset_maturity_date,
                            "DD/MM/YYYY"
                          ).toDate()}
                          setDate={(date) => {
                            setDate(date, "maturityDate");
                          }}
                          minDate={moment().toDate()}
                          maxDate={moment().add(100, "years").toDate()}
                        // className="pt-4"
                        />
                      </div>
                    </div>
                    {simpleValidator.current.message(
                      "Maturity Date",
                      assetsDetails.user_asset_maturity_date,
                      "required",
                      {
                        messages: {
                          required: "Please select maturity date ",
                        },
                      }
                    )}
                  </div>
                  <div className="col-md-5 custom-input">
                    <div
                      className={`form-group inputData`}
                      style={{ paddingTop: "15px" }}
                    >
                      <span>
                        <input
                          type="Number"
                          id="user_asset_maturity_amount"
                          name="user_asset_maturity_amount"
                          value={assetsDetails.user_asset_maturity_amount}
                          onChange={(e) => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_maturity_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                            });
                          }}
                          required
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">Maturity Amount*</label>
                      </span>
                      <span
                        className="info-hover-box float-right"
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
                          Auto calculated on the basis of Purchase Amount and Rate
                          Of Return. You can also edit it and enter your desired
                          maturity amount.
                        </span>
                      </span>
                    </div>
                    <div>
                      <div>
                        {simpleValidator.current.message(
                          "Asset Maturity Amount",
                          assetsDetails.user_asset_maturity_amount,
                          "required",
                          {
                            messages: {
                              required: "Please enter maturity amount",
                            },
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row py-md-2 mt-2">
                  <div className="col-md-8">
                    <div className="d-md-flex">
                      <Form.Label className=" ">
                        Consider This Asset In Automated Linkage*
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
                          Select a goal below to map this investment with a goal
                          of your choice. Otherwise, Fintoo will link it
                          automatically with your high priority goal. In case, you
                          do not wish to utilize this investment for any goal,
                          select "NO".
                        </span>
                      </span>
                      <div className="d-flex  ms-4">
                        <div>No</div>
                        <Switch
                          onChange={(v) =>
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
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
                      <div className="col-md-12 mt-md-0 mt-5">
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
                              <div style={{ whiteSpace: "nowrap" }}>
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
                              setAutoMatedGoal={setAutoMatedGoal}
                              isAutoMatedGoal={isAutoMatedGoal}
                              setGoalLink={setGoalLink}
                              user_asset_maturity_date={
                                assetsDetails.user_asset_maturity_date
                              }
                              type={"Asset"}
                              isGoalFilter={"Recurring"}
                              isAssetRecurring={
                                assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"
                              }
                            ></GoalsDropdown>
                          ) : (
                            ""
                          )}
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

                          {addForm && (
                            <button
                              onClick={(e) => handleDebtSubmit(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Save & Add More
                            </button>
                          )}
                          {props.updateForm && (
                            <div>
                              <button
                                onClick={(e) => handleDebtCancel(e)}
                                className="default-btn gradient-btn save-btn"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => handleDebtUpdate(e)}
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
                              props.setTab("tab2")
                            }}
                          >
                            <span
                              className="hover-text"
                              style={{ maxWidth: 100 }}
                            >
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
        {assetsDetails.asset_type_name_uuid == 'nsc' && (
          // NSC
          <>
            <form noValidate="novalidate" name="goldassetform">
              <div className="row d-flex align-items-center">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                      } `}
                    style={{ paddingTop: "17px" }}
                  >
                    <input
                      type="text"
                      id="asset_name_d_2"
                      name="asset_name"
                      maxLength={35}
                      value={assetsDetails.user_asset_name}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_name: e.target.value,
                        }));
                      }}
                      onBlur={() => {
                        simpleValidator.current.showMessageFor("Asset Name");
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Name of Asset*</label>
                  </div>
                  {simpleValidator.current.message(
                    "Asset Name",
                    assetsDetails.user_asset_name,
                    "required|min:3|max:60",
                    {
                      messages: {
                        required: "Please enter asset name",
                        max: "Asset name must be between 3-35 characters.",
                        min: "Asset name must be between 3-35 characters.",
                      },
                    }
                  )}
                </div>
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label>Who is investment For?*</Form.Label>
                    {familyData && (
                      <Select
                        classNamePrefix="sortSelect"
                        isSearchable={false}
                        styles={customStyles}
                        options={familyData}
                        onChange={(e) => {
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_for: e.value,
                          }))
                          handleAssetMemberMaturityDate(e)
                        }}
                        value={familyData.filter(
                          (v) => v.value == assetsDetails.user_asset_for
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="row  d-flex align-items-center py-md-2">
                <div className="col-md-5 ">
                  <div className="material">
                    <Form.Label>Date of Purchase*</Form.Label>
                    <div
                      className="dt-conbx"
                      style={{
                        borderBottom: "1px solid #dadada",
                        paddingTop: "0px",
                      }}
                    >
                      <ReactDatePicker
                        select_date={moment(
                          assetsDetails.user_asset_purchase_date,
                          "DD/MM/YYYY"
                        ).toDate()}
                        setDate={(date) => {
                          setDate(date, "assetPurchaseDate");
                        }}
                        minDate={""}
                        maxDate={moment().toDate()}
                        className="pt-4"
                      />
                    </div>
                  </div>

                  {simpleValidator.current.message(
                    "Asset Purchase Date",
                    assetsDetails.user_asset_purchase_date,
                    "required",
                    { messages: { required: "Please select purchase date" } }
                  )}
                </div>
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_investment_amount ? "inputData" : null
                      } `}
                    style={{ paddingTop: "15px" }}
                  >
                    <input
                      type="Number"
                      id="user_asset_investment_amount"
                      name="user_asset_investment_amount"
                      value={assetsDetails.user_asset_investment_amount}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          isEditable: true,
                        }));
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name"> Purchase Amount (₹)*</label>
                  </div>
                  <div className="w-100">
                    {simpleValidator.current.message(
                      "Asset Purchase Amount",
                      assetsDetails.user_asset_investment_amount,
                      "required",
                      {
                        messages: {
                          required: "Please add asset purchase amount",
                        },
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="row py-md-2 mt-3">
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label>
                      Rate Of Return (%)* : {assetsDetails.user_asset_ror}
                    </Form.Label>

                    {/* <div
                    className={`${
                      assetsDetails.user_asset_ror < 1 && "sl-hide-left"
                    } ${assetsDetails.user_asset_ror > 18.5 && "sl-hide-right"}`}
                  > */}
                    <Slider
                      key={"sld-" + assetsDetails.asset_type_name_uuid}
                      min={0}
                      max={20}
                      step={0.05}
                      value={assetsDetails.user_asset_ror}
                      onChange={(v) =>
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_ror: v,
                          isEditable: true,
                        })
                      }
                    />
                    {/* </div> */}
                  </div>
                </div>
              </div>
              <div className="row d-flex align-items-center py-md-2 mt-3">
                <div className="col-md-5 ">
                  <div className="material">
                    <Form.Label>Maturity Date*</Form.Label>
                    <div
                      className="dt-conbx"
                      style={{
                        borderBottom: "1px solid #dadada",
                        paddingTop: "0px",
                      }}
                    >
                      <ReactDatePicker
                        select_date={moment(
                          assetsDetails.user_asset_maturity_date,
                          "DD/MM/YYYY"
                        ).toDate()}
                        setDate={(date) => {
                          setDate(date, "maturityDate");
                        }}
                        minDate={moment().toDate()}
                        maxDate={moment().add(100, "years").toDate()}
                        className="pt-4"
                      />
                    </div>
                  </div>
                  <div>
                    {simpleValidator.current.message(
                      "Maturity Date",
                      assetsDetails.user_asset_maturity_date,
                      "required",
                      {
                        messages: {
                          required: "Please select maturity date ",
                        },
                      }
                    )}
                  </div>
                </div>
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group inputData `}
                    style={{ paddingTop: "15px" }}
                  >
                    <span>
                      <input
                        type="Number"
                        id="user_asset_quantity_d"
                        name="user_asset_quantity"
                        value={assetsDetails.user_asset_maturity_amount}
                        onChange={(e) => {
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_maturity_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          }));
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Maturity Amount (₹)*</label>
                    </span>
                    <span
                      className="info-hover-box float-right"
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
                        Auto calculated on the basis of Purchase Amount and Rate
                        Of Return. You can also edit it and enter your desired
                        maturity amount.
                      </span>
                    </span>
                  </div>

                  <div>
                    {simpleValidator.current.message(
                      "Asset Maturity Amount",
                      assetsDetails.user_asset_maturity_amount,
                      "required",
                      {
                        messages: {
                          required: "Please enter maturity amount",
                        },
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="row py-md-2">
                <div className="col-md-8">
                  <div className="d-md-flex">
                    <Form.Label className=" ">
                      Consider This Asset In Automated Linkage*
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
                        Select a goal below to map this investment with a goal
                        of your choice. Otherwise, Fintoo will link it
                        automatically with your high priority goal. In case, you
                        do not wish to utilize this investment for any goal,
                        select "NO".
                      </span>
                    </span>
                    <div className="d-flex  ms-4">
                      <div>No</div>
                      <Switch
                        onChange={(v) =>
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                          }))
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
                    <div className="col-md-12 mt-md-0 mt-5">
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
                            <div style={{ whiteSpace: "nowrap" }}>
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
                            setAutoMatedGoal={setAutoMatedGoal}
                            isAutoMatedGoal={isAutoMatedGoal}
                            setGoalLink={setGoalLink}
                            user_asset_maturity_date={
                              assetsDetails.user_asset_maturity_date
                            }
                            type={"Asset"}
                            isGoalFilter={"Recurring"}
                            isAssetRecurring={
                              assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"
                            }
                          ></GoalsDropdown>
                        ) : (
                          ""
                        )}
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

                        {addForm && (
                          <button
                            onClick={(e) => handleDebtSubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {props.updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleDebtCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleDebtUpdate(e)}
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
                            props.setTab("tab2")
                          }}
                        >
                          <span
                            className="hover-text"
                            style={{ maxWidth: 100 }}
                          >
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
        {assetsDetails.asset_type_name_uuid == 'gratuity' && (
          // Gratuity
          <>
            <form noValidate="novalidate" name="goldassetform">
              <div className="row d-flex align-items-center">
                <div className="col-md-5  custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                      } `}
                    style={{ paddingTop: "17px" }}
                  >
                    <input
                      type="text"
                      id="user_asset_quantity_d_4"
                      name="user_asset_quantity"
                      maxLength={35}
                      value={assetsDetails.user_asset_name}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_name: e.target.value,
                        }));
                      }}
                      onBlur={() => {
                        simpleValidator.current.showMessageFor("Asset Name");
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Name of Asset*</label>
                  </div>
                  <div>
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
                </div>
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label>Who is investment For?*</Form.Label>
                    {familyData && (
                      <Select
                        classNamePrefix="sortSelect"
                        isSearchable={false}
                        styles={customStyles}
                        options={familyData}
                        onChange={(e) => {
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_for: e.value,
                          }))
                          handleAssetMemberMaturityDate(e)
                        }}
                        value={familyData.filter(
                          (v) => v.value == assetsDetails.user_asset_for
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="row py-md-2">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group mt-2 ${assetsDetails.user_asset_monthly_salary || assetsDetails.user_asset_monthly_salary === 0
                      ? "inputData"
                      : null
                      } `}
                  >
                    <input
                      type="Number"
                      id="user_asset_monthly_salary"
                      name="user_asset_monthly_salary"
                      value={assetsDetails.user_asset_monthly_salary}
                      onChange={(e) =>
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_monthly_salary: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          isEditable: true,
                        })
                      }
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">
                      Monthly Salary (Basic Pay + D.A) (₹)*
                    </label>
                  </div>
                  {simpleValidator.current.message(
                    "Asset Current Price",
                    assetsDetails.user_asset_monthly_salary,
                    "required",
                    {
                      messages: {
                        required: "Please add monthly salary",
                      },
                    }
                  )}
                </div>
                <div className="col-md-5 mt-4">
                  <div className="material">
                    <Form.Label>
                      No of Service Years (Minimum 5 Years)*
                    </Form.Label>
                    <div
                      className={`${assetsDetails.user_asset_service_years < 7 && "sl-hide-left"
                        } ${assetsDetails.user_asset_service_years > 48 && "sl-hide-right"
                        }`}
                    >
                      <Slider
                        min={5}
                        max={50}
                        value={assetsDetails.user_asset_service_years}
                        step={1}
                        onChange={(v) =>
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_service_years: v,
                            isEditable: true,
                          })
                        }
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
              </div>

              <div className="row py-md-2">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group  ${assetsDetails.user_asset_gratuity_amount
                      ? "inputData"
                      : null
                      } `}
                  >
                    {//console.log(assetsDetails.user_asset_gratuity_amount)
                    }
                    <span>
                      <input
                        type="Number"
                        id="user_asset_gratuity_amount_d_2"
                        name="user_asset_gratuity_amount"
                        value={
                          assetsDetails.user_asset_gratuity_amount === 0
                            ? ""
                            : assetsDetails.user_asset_gratuity_amount
                        }
                        onChange={(e) => {
                          if (e.target.value == 0) {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_gratuity_amount: "",
                            });
                          } else {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                              user_asset_gratuity_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                            });
                          }
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Gratuity Accured (₹)*</label>
                    </span>
                    <span className="info-hover-box">
                      <span className="icon">
                        <img
                          alt="More information"
                          src={imagePath + '/static/media/more_information.svg'}
                        />
                      </span>
                      <span className="msg">
                        Auto calculated on the basis of Monthly Salary and No of
                        Service Years. You can also edit it and enter your
                        desired Gratuity Accured.
                      </span>
                    </span>
                  </div>
                  <div style={{ top: "37pd" }}>
                    {simpleValidator.current.message(
                      "Asset Gratuity Amount",
                      assetsDetails.user_asset_gratuity_amount,
                      "required|numeric|min:1,num",
                      {
                        messages: {
                          required: "This field is required",
                          min: "This field is required",
                        },
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="row py-md-2">
                <div className="col-md-8 mt-2">
                  <div className="d-md-flex">
                    <Form.Label className=" ">
                      Consider This Asset In Automated Linkage*
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
                        Select a goal below to map this investment with a goal
                        of your choice. Otherwise, Fintoo will link it
                        automatically with your high priority goal. In case, you
                        do not wish to utilize this investment for any goal,
                        select "NO".
                      </span>
                    </span>
                    <div className="d-flex  ms-4">
                      <div>No</div>
                      <Switch
                        onChange={(v) =>
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                          }))
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
                    <div className="col-md-5 mt-md-0 mt-5">
                      <div className="material">
                        {/* <div className="m-0 btn-sm default-btn gradient-btn save-btn" onClick={() => setGoalSelected(true)}>Select Goals</div> */}
                        {/* <br></br>
                    <br></br> */}

                        {selectedGoals && goalData.length > 0 ? (
                          <div style={{ textAlign: "left!important" }}>
                            <b>Selected Goal : </b> Retirement Goal - Self
                          </div>
                        ) : (
                          ""
                        )}
                        {/* {isGoalSelected ? <GoalsDropdown setGoalSelected={setGoalSelected} goals={goalData} unchangedgoaldata={unchangedgoaldata} closeModal={closeModal} selectGoals={selectGoals} selectedGoals={selectedGoals} selectedGoalIdArray={selectedGoalIdArray} selectedGoalsId={selectedGoalsId} setPriorityArray={setPriorityArray} selectedPriorityArray={selectedPriorityArray} setAutoMatedGoal={setAutoMatedGoal} isAutoMatedGoal={isAutoMatedGoal} setGoalLink={setGoalLink} type={'Asset'} user_asset_maturity_date={assetsDetails.user_asset_maturity_date} isGratuity={true}></GoalsDropdown> : ''} */}
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

                        {addForm && (
                          <button
                            onClick={(e) => handleDebtSubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {props.updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleDebtCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleDebtUpdate(e)}
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
                            props.setTab("tab2")
                          }}
                        >
                          <span
                            className="hover-text"
                            style={{ maxWidth: 100 }}
                          >
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
        {(assetsDetails.asset_type_name_uuid == 'nps' || //nps
          assetsDetails.asset_type_name_uuid == 'pension_schemes' || // Pension Schemes
          assetsDetails.asset_type_name_uuid == 'ppf' || // PPF
          assetsDetails.asset_type_name_uuid == 'sukanya_samriddhi_yojana' || // Sukanya Samriddhi Yojana
          assetsDetails.asset_type_name_uuid == 'rd') // RD
          && (
            <>
              <form noValidate="novalidate" name="goldassetform">
                <div className="row d-flex align-center">
                  <div className="col-md-5  custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                        } `}
                      style={{ paddingTop: "15px" }}
                    >
                      <input
                        type="text"
                        id="asset_name_d_4"
                        name="asset_name"
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
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Name of Asset*</label>
                    </div>
                    {simpleValidator.current.message(
                      "Asset Name",
                      assetsDetails.user_asset_name,
                      "required|min:3|max:60",
                      {
                        messages: {
                          required: "Please enter asset name",
                          max: "Asset name must be between 3-35 characters.",
                          min: "Asset name must be between 3-35 characters.",
                        },
                      }
                    )}
                  </div>
                  <div className="col-md-5">
                    <div className="material mt-3">
                      <Form.Label> Who is investment For?*</Form.Label>
                      {familyData && (
                        <Select
                          classNamePrefix="sortSelect"
                          isSearchable={false}
                          styles={customStyles}
                          options={familyData}
                          onChange={(e) => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_for: e.value,
                            })
                            handleAssetMemberMaturityDate(e)
                          }}
                          value={familyData.filter(
                            (v) => v.value == assetsDetails.user_asset_for
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="row py-md-2">
                  <div className="col-md-5 custom-input">
                    <div
                      className={`form-group mt-1 ${assetsDetails.user_asset_current_amount
                        ? "inputData"
                        : null
                        } `}
                    >
                      <input
                        type="Number"
                        id="Account_Balance"
                        name="user_asset_current_amount"
                        value={assetsDetails.user_asset_current_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_current_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                            isEditable: true,
                          });
                        }}
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Account Balance As On Today (₹)</label>
                    </div>
                  </div>
                  <div className="col-md-5 custom-input">
                    <div
                      className={`form-group mt-1 ${assetsDetails.user_asset_investment_amount ? "inputData" : null
                        } `}
                    >
                      <input
                        type="Number"
                        id="Investment_Amount"
                        name="user_asset_investment_amount"
                        value={assetsDetails.user_asset_investment_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                            isEditable: true,
                          });
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">
                        Investment Amount (per frequency) (₹)*
                      </label>
                    </div>
                    <div>
                      {simpleValidator.current.message(
                        "user_asset_investment_amount",
                        assetsDetails.user_asset_investment_amount,
                        "required|numeric|min:1,num",
                        {
                          messages: {
                            required: "Please enter Investment amount ",
                            min: "Please enter valid Investment amount ",
                          },
                        }
                      )}
                    </div>
                  </div>
                </div>

                <div className="row py-md-2 align-items-center">
                  <div className="col-md-5 ">
                    <div className="dark-label">
                      <Form.Label>Frequency*</Form.Label>
                      <div className="d-md-flex pt-4" style={{ clear: "both" }}>
                        <FintooRadio2
                          checked={assetsDetails.user_asset_freq == "Monthly"}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_freq: "Monthly",
                              isEditable: true,
                            });
                          }}
                          title="Monthly"
                        />

                        <FintooRadio2
                          checked={assetsDetails.user_asset_freq == "Quarterly"}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_freq: "Quarterly",
                              isEditable: true,
                            });
                          }}
                          title="Quarterly"
                        />

                        <FintooRadio2
                          checked={assetsDetails.user_asset_freq == "Half Yearly"}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_freq: "Half Yearly",
                              isEditable: true,
                            });
                          }}
                          title="Half Yearly"
                        />

                        <FintooRadio2
                          checked={assetsDetails.user_asset_freq == "Yearly"}
                          onClick={(e) => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_freq: "Yearly",
                              isEditable: true,
                            });
                          }}
                          title="Yearly"
                        />
                      </div>
                      {formSubmitted &&
                        (
                          !assetsDetails.user_asset_freq ||
                          (
                            ["nps", "pension_schemes", "ppf", "sukanya_samriddhi_yojana", "rd"].includes(
                              assetsDetails.asset_type_name_uuid
                            ) &&
                            assetsDetails.user_asset_freq === "One Time"
                          )
                        ) && (
                          <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                            Please select a valid frequency
                          </div>
                        )}

                    </div>
                  </div>

                  {assetsDetails.user_asset_freq == "Yearly" ? (
                    <>
                      <div className="col-md-5 mt-md-4">
                        <div className="d-flex ">
                          <Form.Label
                            className=" "
                            style={{
                              whiteSpace: "nowrap",
                            }}
                          >
                            Installment for the year is Paid or not*
                          </Form.Label>
                          <div className="d-flex ms-md-5">
                            <div>No</div>
                            <Switch
                              onChange={(v) =>
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_installment_paid: v ? 1 : 0,
                                })
                              }
                              checked={assetsDetails.user_asset_installment_paid === 1}
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
                    </>
                  ) : null}
                </div>

                <div className="row py-md-2 mt-2">
                  <div className="col-md-5">
                    {assetsDetails.asset_type_name_uuid == "ppf" && (
                      <div className="material">
                        <Form.Label>
                          Rate Of Return (%)* : {assetsDetails.user_asset_ror}
                        </Form.Label>
                        <div
                          className={`${assetsDetails.user_asset_ror < 1 && "sl-hide-left"
                            } ${assetsDetails.user_asset_ror > 18.5 && "sl-hide-right"}`}
                        >
                          <Slider
                            key={"sld-" + assetsDetails.asset_type_name_uuid}
                            min={0}
                            max={20}
                            step={0.05}
                            value={assetsDetails.user_asset_ror}
                            onChange={(v) =>
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_ror: v,
                                isEditable: true,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                    {assetsDetails.asset_type_name_uuid == "nps" && (
                      <div className="material">
                        <Form.Label>
                          Rate Of Return (%)* : {assetsDetails.user_asset_ror}
                        </Form.Label>
                        <div
                          className={`${assetsDetails.user_asset_ror < 1 && "sl-hide-left"
                            } ${assetsDetails.user_asset_ror > 18.5 && "sl-hide-right"}`}
                        >
                          <Slider
                            key={"sld-" + assetsDetails.asset_type_name_uuid}
                            min={0}
                            max={20}
                            step={0.05}
                            value={
                              assetsDetails.user_asset_ror == 0
                                ? 10
                                : assetsDetails.user_asset_ror
                            }
                            onChange={(v) =>
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_ror: v,
                                isEditable: true,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                    {(assetsDetails.asset_type_name_uuid == "pension_schemes" ||
                      assetsDetails.asset_type_name_uuid == "sukanya_samriddhi_yojana" ||
                      assetsDetails.asset_type_name_uuid == "rd") && (
                        <div className="material">
                          <Form.Label>
                            Rate Of Return (%)* : {assetsDetails.user_asset_ror}
                          </Form.Label>
                          <div
                            className={`${assetsDetails.user_asset_ror < 1 && "sl-hide-left"
                              } ${assetsDetails.user_asset_ror > 18.5 && "sl-hide-right"}`}
                          >
                            <Slider
                              key={"sld-" + assetsDetails.asset_type_name_uuid}
                              min={0}
                              max={20}
                              step={0.05}
                              // defaultValue={assetsDetails.user_asset_ror}
                              value={
                                assetsDetails.user_asset_ror == 0
                                  ? 6.8
                                  : assetsDetails.user_asset_ror
                              }
                              onChange={(v) => {
                                if (v != 0) {
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_ror: v,
                                    isEditable: true,
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                {assetsDetails.asset_type_name_uuid == "nps" ? null : (
                  <div className="row py-md-2">
                    <div className="col-5">
                      <div className="dark-label">
                        <Form.Label>Maturity Date*</Form.Label>
                        <div
                          className="dt-conbx"
                          style={{
                            borderBottom: "1px solid #dadada",
                            // paddingTop: "19px",
                          }}
                        >
                          <ReactDatePicker
                            select_date={moment(
                              assetsDetails.user_asset_maturity_date,
                              "DD/MM/YYYY"
                            ).toDate()}
                            setDate={(date) => {
                              setDate(date, "maturityDate");
                            }}
                            minDate={moment().add(1, "days").toDate()}
                            maxDate={moment().add(100, "years").toDate()}
                            className="pt-4"
                          />
                        </div>
                        <div>
                          {simpleValidator.current.message(
                            "Maturity Date",
                            assetsDetails.user_asset_maturity_date,
                            "required",
                            {
                              messages: {
                                required: "Please select maturity date ",
                              },
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="dark-label">
                        <div className="d-flex" style={{ clear: "both" }}>
                          <FintooRadio2
                            checked={assetsDetails.user_asset_valid_till == "Retirement"}
                            onClick={() => {
                              setselectedEndAge("Upto Retirement Age");
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_valid_till: "Retirement",
                                user_asset_maturity_date: moment(retirementDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                              });
                            }}
                            title="Upto Retirement Age"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row py-md-2">
                  <div className="col-md-5 custom-input">
                    <div className={`form-group mt-1 inputData`}>
                      <span>
                        <input
                          type="Number"
                          id="Maturity_Amount_1"
                          name="user_asset_quantity"
                          value={assetsDetails.user_asset_maturity_amount}
                          onChange={(e) => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_maturity_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                            });
                          }}
                          required
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">Maturity Amount (₹)*</label>
                      </span>
                      <span className="info-hover-box">
                        <span className="icon">
                          <img
                            alt="More information"
                            src={imagePath + '/static/media/more_information.svg'}
                          />
                        </span>
                        <span className="msg">
                          Auto calculated on the basis of Purchase Amount and Rate
                          Of Return. You can also edit it and enter your desired
                          maturity amount.
                        </span>
                      </span>
                    </div>
                    {simpleValidator.current.message(
                      "Maturity Amount",
                      assetsDetails.user_asset_maturity_amount,
                      "required|numeric|min:1,num",
                      {
                        messages: {
                          required: "Please enter maturity amount ",
                          min: "Please enter valid maturity amount ",
                        },
                      }
                    )}
                  </div>
                </div>

                <div className="row py-md-2 mt-md-4">
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
                          Select a goal below to map this investment with a goal
                          of your choice. Otherwise, Fintoo will link it
                          automatically with your high priority goal. In case, you
                          do not wish to utilize this investment for any goal,
                          select "NO".
                        </span>
                      </span>
                      <div className="d-flex ms-md-4">
                        <div>No</div>
                        <Switch
                          onChange={(v) =>
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
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
                              <div style={{ whiteSpace: "nowrap" }}>
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
                              setAutoMatedGoal={setAutoMatedGoal}
                              isAutoMatedGoal={isAutoMatedGoal}
                              setGoalLink={setGoalLink}
                              type={"Asset"}
                              user_asset_maturity_date={
                                assetsDetails.user_asset_maturity_date
                              }
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

                          {addForm && (
                            <button
                              onClick={(e) => handleDebtSubmit(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Save & Add More
                            </button>
                          )}
                          {props.updateForm && (
                            <div>
                              <button
                                onClick={(e) => handleDebtCancel(e)}
                                className="default-btn gradient-btn save-btn"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => handleDebtUpdate(e)}
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
                              props.setTab("tab2")
                            }}
                          >
                            <span
                              className="hover-text"
                              style={{ maxWidth: 100 }}
                            >
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

        {(!props.assetEditId || props.assetEditId == "") &&
          assetsDetails.asset_sub_name_uuid == 'debt_mf' && (
            <div>
              {/* Debt Mutual Funds */}
              {assetsDetails.asset_sub_name_uuid == 'debt_mf' && (
                <div>
                  <div className="d-md-flex justify-content-center">
                    {/* <DgRoundedButton
                      active={selectedButton == "Upload Statement"}
                      onClick={() => {
                        setSelectedButton("Upload Statement");
                        setSelectedExtraOption("Upload Statement");
                      }}
                      title="Upload Statement"
                    /> */}
                    <DgRoundedButton
                      active={selectedButton == "Manual Entry"}
                      onClick={() => {
                        setSelectedButton("Manual Entry");
                        setSelectedExtraOption("Manual Entry");
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_name: " ",
                        }));
                      }}
                      title="Manual Entry"
                    />
                    <DgRoundedButton
                      active={selectedButton == "Link your Holdings"}
                      onClick={() => {
                        setSelectedButton("Link your Holdings");
                        setSelectedExtraOption("Link your Holdings");
                      }}
                      title="Link your Holdings"
                    />
                  </div>
                </div>
              )}
              {assetsDetails.asset_sub_name_uuid == 'debt_mf' &&
                selectedExtraOption == "Upload Statement" && (
                  <form
                    encType="multipart/form-data"
                    method="post"
                    action="http://localhost/fileupload.php"
                    onSubmit={handleUploadSubmit}
                  >
                    <div className="col-md-10" value="CAMS">
                      <h4>Cams / Karvy</h4>
                      <ol>
                        <li>
                          Visit{" "}
                          <a
                            style={{ color: "green" }}
                            target="_new"
                            href="https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement"
                          >
                            <u>CAMS</u>
                          </a>{" "}
                          website.
                        </li>
                        <li>
                          Go to Statements &gt;&gt; View More then select{" "}
                          <b>CAS - CAMS+KFintech</b>
                        </li>
                        <li>
                          Choose 'Statement Type' as Detailed{" "}
                          <b>(Includes transaction listing)</b>
                        </li>
                        <li>
                          Choose 'Period' as <b>Specific Period</b> of your
                          choice
                        </li>
                        <li>
                          Select <b>“01-01-1990” in “From Date”</b>
                        </li>
                        <li>
                          Choose 'Folio Listing' as{" "}
                          <b>without Zero Balance Folios</b>
                        </li>
                        <li>
                          Enter your <b>Email and choose password</b>/key for
                          your CAMS statement
                        </li>
                        <li>
                          You will get your <b>CAMS statement</b> on your email
                          within 10 minutes
                        </li>
                      </ol>
                    </div>
                    <div className="col-md-10">
                      <p>
                        <b>Note</b>: CAMS PDF can be uploaded one time a day (
                        Per PAN )
                      </p>
                      <p>
                        The statement uploaded i.e. CAMS doesn't fetch the
                        existing SIP's, Post statement upload do edit the
                        existing SIP's in the funds fetched in the system.
                      </p>
                    </div>
                    <div>
                      <DgDragDrop2
                        className="iconupload"
                        value={dropFiles}
                        onFilesSelected={handleFilesSelected}
                      />
                      {simpleValidator.current.message(
                        "Password",
                        dropFiles,
                        "required",
                        {
                          messages: {
                            required:
                              "Please select atleast one document to upload",
                          },
                        }
                      )}
                    </div>
                    <div className="col-md-12 custom-input mt-5">
                      <div
                        className={`form-group ${docPassword ? "inputData" : null
                          } `}
                      >
                        <input
                          type="text"
                          id="Password"
                          name="Password"
                          value={docPassword}
                          onChange={(e) => {
                            setDocPassword(e.target.value);
                          }}
                          required
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">Password*</label>
                      </div>
                      {simpleValidator.current.message(
                        "Password",
                        docPassword,
                        "required",
                        { messages: { required: "Please enter the password" } }
                      )}
                    </div>
                    <div className="row py-2">
                      <div className=" text-center">
                        <div>
                          <div className="btn-container">
                            <div className="d-flex justify-content-center">
                              <Link
                                to={
                                  process.env.PUBLIC_URL +
                                  "/datagathering/goals"
                                }
                              >
                                <div className="previous-btn form-arrow d-flex align-items-center">
                                  <FaArrowLeft />
                                  <span className="hover-text">
                                    &nbsp;Previous
                                  </span>
                                </div>
                              </Link>

                              {props.addForm && (
                                <button
                                  onClick={(e) => handleUploadSubmit(e)}
                                  className="default-btn gradient-btn save-btn"
                                >
                                  Save & Add More
                                </button>
                              )}

                              <div
                                className="next-btn form-arrow d-flex align-items-center"
                                onClick={() => {
                                  ScrollToTop();
                                  props.setTab("tab2")
                                }}
                              >
                                <span
                                  className="hover-text"
                                  style={{ maxWidth: 100 }}
                                >
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
                )}
              {assetsDetails.asset_sub_name_uuid == "debt_mf" &&
                selectedExtraOption == "Manual Entry" && (
                  <form
                    noValidate="novalidate"
                    name="goldassetform"
                    className="mt-2"
                  >
                    <div style={{
                      pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                      opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                      cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                    }} className="row d-flex align-items-center py-md-2">
                      <div className="col-md-5 ">
                        <div className="material">
                          <Form.Label
                            style={{
                              whiteSpace: "normal",
                            }}
                          >
                            {" "}
                            Start Typing To Search For Your Debt Mutual Funds*{" "}
                          </Form.Label>
                          {debtfunds && debtfunds.length > 0 && (
                            <Select
                              isDisabled={(assetsDetails?.user_asset_source ?? "").toLowerCase() === "external"}
                              classNamePrefix="sortSelect"
                              components={{ Input }}
                              autoComplete="new-password"
                              isSearchable={true}
                              styles={customStyles}
                              options={debtFundsData}
                              onChange={handleDebtFundSelection}
                              value={debtFundsData
                                .filter(
                                  (v) => v.label == assetsDetails.user_asset_name
                                )}
                            />
                          )}
                        </div>
                        {simpleValidator.current.message(
                          "Asset Name",
                          assetsDetails.user_asset_name,
                          "required",
                          { messages: { required: "Please select fund name" } }
                        )}
                      </div>
                      <div
                        className={`col-md-5 ${assetsDetails.asset_sub_name_uuid == 'debt_mf'
                          ? "mt-md-1"
                          : ""
                          }`}
                      >
                        <div className="material">
                          <Form.Label>Who Is This Investment For*</Form.Label>

                          {familyData && (
                            <Select
                              disabled={
                                (
                                  assetsDetails?.user_asset_source ?? ""
                                ).toLowerCase() == "external"
                              }
                              classNamePrefix="sortSelect"
                              isSearchable={false}
                              styles={customStyles}
                              options={familyData}
                              onChange={(e) => {
                                setAssetsDetails((prev) => ({
                                  ...prev,
                                  user_asset_for: e.value,
                                }));
                                handleAssetMemberMaturityDate(e);
                              }
                              }
                              value={familyData.filter(
                                (v) => v.value == assetsDetails.user_asset_for
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                      opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                      cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                    }} className="row py-md-2">
                      <div className="col-md-8 mt-3">
                        <div className="d-flex">
                          <Form.Label className=" ">
                            Is The Equity One Time Or Recurring?*
                          </Form.Label>
                          <div className="d-flex ms-md-4">
                            <div>One Time</div>
                            <Switch
                              disabled={
                                (
                                  assetsDetails?.user_asset_source ?? ""
                                ).toLowerCase() == "external"
                              }
                              onChange={(v) => {
                                const occuranceValue = v ? "Recurring" : "One Time";
                                setAssetsDetails((prev) => ({
                                  ...prev,
                                  user_asset_occurance: occuranceValue,
                                  user_asset_avg_purchase_price: "",
                                }));
                              }}
                              checked={assetsDetails.user_asset_occurance === "Recurring"}
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

                    {assetsDetails.user_asset_occurance == "Recurring" && (
                      <>
                        <div style={{
                          pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                          opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                          cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                        }} className="row d-flex align-items-center py-md-2">
                          <div className="col-md-5 ">
                            <div className="material">
                              <Form.Label>SIP Start Date</Form.Label>
                              <div
                                className="dt-conbx"
                                style={{
                                  borderBottom: "1px solid #dadada",
                                  paddingTop: "0px",
                                }}
                              >
                                <ReactDatePicker
                                  disabled={
                                    (
                                      assetsDetails?.user_asset_source ?? ""
                                    ).toLowerCase() == "external"
                                  }
                                  select_date={moment(
                                    assetsDetails.user_asset_purchase_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                  setDate={(date) => {
                                    setDate(date, "assetPurchaseDate");
                                  }}
                                  minDate={""}
                                  maxDate={moment().toDate()}
                                  className="pt-4"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-5 custom-input">
                            <div
                              className={`form-group ${assetsDetails.user_asset_sip_amount ? "inputData" : null
                                } `}
                              style={{ paddingTop: "15px" }}
                            >
                              <input
                                type="text"
                                id="SIP_Amount"
                                name="asset_name"
                                maxLength={35}
                                value={
                                  assetsDetails.user_asset_sip_amount === 0
                                    ? ""
                                    : assetsDetails.user_asset_sip_amount
                                }
                                readOnly={
                                  (
                                    assetsDetails?.user_asset_source ?? ""
                                  ).toLowerCase() == "external"
                                }
                                onChange={(e) => {
                                  if (e.target.value == 0) {
                                    setAssetsDetails((prev) => ({
                                      ...prev,
                                      user_asset_sip_amount: "",
                                    }));
                                  } else {
                                    setAssetsDetails((prev) => ({
                                      ...prev,
                                      user_asset_sip_amount: e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                      ),
                                    }));
                                  }
                                }}
                                required
                                autoComplete="off"
                              />
                              <span class="highlight"></span>
                              <span class="bar"></span>
                              <label for="name">SIP Amount (₹)*</label>
                            </div>
                            {simpleValidator.current.message(
                              "SIP Amount",
                              assetsDetails.user_asset_sip_amount,
                              "required|numeric|min:1,num",
                              {
                                messages: {
                                  required: "Please enter SIP amount",
                                  min: "Please enter valid SIP amount",
                                },
                              }
                            )}
                          </div>
                        </div>
                        <div style={{
                          pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                          opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                          cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                        }} className="row py-md-2">
                          <div className="col-md-5 custom-input">
                            <div
                              className={`form-group ${assetsDetails.user_asset_avg_purchase_price
                                ? "inputData"
                                : null
                                } `}
                            >
                              <input
                                type="Number"
                                id="Total_Invested_Amount"
                                name="user_asset_quantity_2"
                                placeholder=""
                                className="shadow-none"
                                value={assetsDetails.user_asset_avg_purchase_price}
                                readOnly={
                                  (
                                    assetsDetails?.user_asset_source ?? ""
                                  ).toLowerCase() == "external"
                                }
                                onChange={(e) => {
                                  setAssetsDetails((prev) => ({
                                    ...prev,
                                    user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                    isEditable: true,
                                  }));
                                }}
                                required
                                autoComplete="off"
                              />
                              <span class="highlight"></span>
                              <span class="bar"></span>
                              <label for="name">
                                Total Invested Amount (₹)*
                              </label>
                            </div>

                            {simpleValidator.current.message(
                              "Asset Purchase Amount",
                              assetsDetails.user_asset_avg_purchase_price,
                              "required",
                              {
                                messages: {
                                  required: "Please add invested amount",
                                },
                              }
                            )}
                          </div>
                          <div className="col-md-5 custom-input">
                            <div
                              className={`form-group ${assetsDetails.user_asset_quantity ? "inputData" : null
                                } `}
                            >
                              <input
                                type="Number"
                                id="No_Of_Units"
                                name="user_asset_quantity"
                                value={assetsDetails.user_asset_quantity}
                                readOnly={
                                  (
                                    assetsDetails?.user_asset_source ?? ""
                                  ).toLowerCase() == "external"
                                }
                                onChange={(e) => {
                                  setAssetsDetails((prev) => ({
                                    ...prev,
                                    user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                                  }));
                                }}
                                required
                                autoComplete="off"
                              />
                              <span class="highlight"></span>
                              <span class="bar"></span>
                              <label for="name">No. Of Units*</label>
                            </div>

                            {simpleValidator.current.message(
                              "Asset Units",
                              assetsDetails.user_asset_quantity,
                              "required|min:1,num",
                              {
                                messages: {
                                  required: "Please add units",
                                  min: "Number of units must be greater than 0",
                                },
                              }
                            )}
                          </div>
                        </div>
                        <div style={{
                          pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                          opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                          cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                        }} className="row py-md-2">
                          <div className="col-md-5 custom-input">
                            <div
                              className={`form-group ${assetsDetails.user_asset_current_price
                                ? "inputData"
                                : null
                                } `}
                            >
                              <input
                                type="text"
                                id="Current_Price"
                                name="user_asset_avg_purchase_price"
                                placeholder=""
                                className="shadow-none"
                                value={assetsDetails.user_asset_current_price}
                                onChange={(e) => {
                                  setAssetsDetails((prev) => ({
                                    ...prev,
                                    user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                    isEditable: true,
                                  }));
                                }}
                                readOnly
                                required
                                autoComplete="off"
                              />
                              <span class="highlight"></span>
                              <span class="bar"></span>
                              <label for="name">Current Price (₹)*</label>
                            </div>
                            {simpleValidator.current.message(
                              "Current Price",
                              assetsDetails.user_asset_avg_purchase_price,
                              "required",
                              {
                                messages: {
                                  required: "Please enter Current Price",
                                },
                              }
                            )}
                          </div>
                          <div className="col-md-5 custom-input ">
                            <div
                              className={`form-group  ${assetsDetails.user_asset_current_amount
                                ? "inputData"
                                : null
                                } `}
                            >
                              <span>
                                <input
                                  type="text"
                                  name="user_asset_quantity_2"
                                  id="Current_value"
                                  placeholder=""
                                  className="shadow-none"
                                  value={assetsDetails.user_asset_current_amount}
                                  onChange={(e) => {
                                    setAssetsDetails((prev) => ({
                                      ...prev,
                                      user_asset_current_amount: e.target.value,
                                    }));
                                  }}
                                  readOnly
                                  autoComplete="off"
                                />
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label for="name">Current value (₹)</label>
                              </span>
                              <span
                                className="info-hover-box float-right"
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
                                  Auto calculated by SIP amount and current NAV.
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div style={{
                          pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                          opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                          cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                        }} className="row py-md-2 mt-2">
                          <div className="col-md-5 ">
                            <div className="material">
                              <Form.Label>SIP End Date*</Form.Label>
                              <div
                                className="dt-conbx"
                                style={{
                                  borderBottom: "1px solid #dadada",
                                  // paddingTop: "19px",
                                }}
                              >
                                <ReactDatePicker
                                  select_date={moment(
                                    assetsDetails.user_asset_end_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                  setDate={(date) => {
                                    setDate(date, "assetendDate");
                                  }}
                                  minDate={moment().toDate()}
                                  maxDate={""}
                                  className="pt-4"
                                />
                              </div>
                              {simpleValidator.current.message(
                                "SIP End Date",
                                assetsDetails.user_asset_end_date,
                                "required",
                                {
                                  messages: {
                                    required: "Please add SIP end date ",
                                  },
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                          opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                          cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                        }} className="row mt-2">
                          <div className="col-9">
                            <div className="">
                              <div
                                className="d-flex pt-2"
                                style={{ clear: "both" }}
                              >
                                <FintooRadio2
                                  checked={
                                    assetsDetails.user_asset_valid_till == "Retirement"
                                  }
                                  onClick={() => {
                                    setselectedEndAge("Upto Retirement Age");
                                    setAssetsDetails((prev) => ({
                                      ...prev,
                                      user_asset_valid_till: "Retirement",
                                      user_asset_end_date: moment(retirementDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                                    }));
                                  }}
                                  title="Upto Retirement Age"
                                />
                                {
                                  //console.log("lifeExpectancyDate", retirementDate, lifeExpectancyDate)
                                }
                                <FintooRadio2
                                  checked={
                                    assetsDetails.user_asset_valid_till == "Life Expectancy"
                                  }
                                  onClick={() => {
                                    setselectedEndAge("Upto Life Expectancy Age");
                                    setAssetsDetails((prev) => ({
                                      ...prev,
                                      user_asset_valid_till: "Life Expectancy",
                                      user_asset_end_date: moment(lifeExpectancyDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                                    }))
                                  }}
                                  title="Upto Life Expectancy Age"
                                />
                                <FintooRadio2
                                  checked={
                                    assetsDetails.user_asset_valid_till == "Perpetual"
                                  }
                                  onClick={() => {
                                    setselectedEndAge("Perpetual");
                                    setAssetsDetails((prev) => ({
                                      ...prev,
                                      user_asset_valid_till: "Perpetual",
                                      user_asset_end_date: moment(
                                        "2099-12-31",
                                        "YYYY-MM-DD"
                                      ).format("DD/MM/YYYY"),
                                    }));
                                  }}
                                  title="Perpetual"
                                />
                                <span className="info-hover-box">
                                  <span className="icon">
                                    <img
                                      alt="More information"
                                      src={imagePath + '/static/media/more_information.svg'}
                                    />
                                  </span>
                                  <span className="msg">
                                    Perpetual SIPs refer to those with no tenure
                                    end date. Most fund houses assume such SIPs
                                    to continue till 2099 and it can be only
                                    linked to goals after 2099. Advice to select
                                    specific end date based on goals
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {assetsDetails.user_asset_occurance == "One Time" && (
                      <>
                        <div style={{
                          pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                          opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                          cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                        }} className="row d-flex align-items-center py-md-2 mt-2">
                          <div className="col-md-5 ">
                            <div className="material">
                              <Form.Label>Date of Purchase</Form.Label>
                              <div
                                className="dt-conbx"
                                style={{
                                  borderBottom: "1px solid #dadada",
                                  paddingTop: "0px",
                                }}
                              >
                                <ReactDatePicker
                                  readOnly={
                                    (
                                      assetsDetails?.user_asset_source ?? ""
                                    ).toLowerCase() == "external"
                                  }
                                  select_date={moment(
                                    assetsDetails.user_asset_purchase_date,
                                    "DD/MM/YYYY"
                                  ).toDate()}
                                  setDate={(date) => {
                                    setDate(date, "assetPurchaseDate");
                                  }}
                                  minDate={""}
                                  maxDate={moment().toDate()}
                                  className="pt-2"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-5 custom-input">
                            <div
                              className={`form-group  ${assetsDetails.user_asset_quantity ? "inputData" : null
                                } `}
                              style={{ paddingTop: "15px" }}
                            >
                              <input
                                type="Number"
                                id="user_asset_quantity_debt_1"
                                name="user_asset_quantity_1"
                                value={assetsDetails.user_asset_quantity}
                                readOnly={
                                  (
                                    assetsDetails?.user_asset_source ?? ""
                                  ).toLowerCase() == "external"
                                }
                                onChange={(e) => {
                                  setAssetsDetails((prev) => ({
                                    ...prev,
                                    user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                                  }));
                                }}
                                required
                                autoComplete="off"
                              />
                              <span class="highlight"></span>
                              <span class="bar"></span>
                              <label for="name">No. Of Units*</label>
                            </div>
                            {simpleValidator.current.message(
                              "Asset Units",
                              assetsDetails.user_asset_quantity,
                              "required|min:1,num",
                              {
                                messages: {
                                  required: "Please add units",
                                  min: "Number of units must be greater than 0",
                                },
                              }
                            )}
                          </div>
                        </div>

                        <div style={{
                          pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                          opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                          cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                        }} className="row py-md-2">
                          <div className="col-md-5 custom-input">
                            <div
                              className={`form-group  ${assetsDetails.user_asset_avg_purchase_price
                                ? "inputData"
                                : null
                                } `}
                            >
                              <input
                                type="Number"
                                id="user_asset_avg_purchase_price_d_10"
                                name="user_asset_avg_purchase_price"
                                value={assetsDetails.user_asset_avg_purchase_price}
                                disabled={
                                  (
                                    assetsDetails?.user_asset_source ?? ""
                                  ).toLowerCase() == "external"
                                }
                                onChange={(e) => {
                                  setAssetsDetails((prev) => ({
                                    ...prev,
                                    user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                                    isEditable: true,
                                  }));
                                }}
                                required
                                autoComplete="off"
                              />
                              <span class="highlight"></span>
                              <span class="bar"></span>
                              <label for="name">Avg. buy Price (₹)*</label>
                            </div>
                            {simpleValidator.current.message(
                              "Asset Current Price",
                              assetsDetails.user_asset_avg_purchase_price,
                              "required|min:1,num",
                              {
                                messages: {
                                  required: "Please add avg. buy price",
                                  min: "Invested value must be greater than 0",
                                },
                              }
                            )}
                          </div>
                          <div className="col-md-5 custom-input">
                            <div
                              className={`form-group  ${assetsDetails.user_asset_investment_amount
                                ? "inputData"
                                : null
                                } `}
                            >
                              <span>
                                <input
                                  type="text"
                                  id="Invested_Amount"
                                  name="user_asset_quantity_1"
                                  value={assetsDetails.user_asset_investment_amount}
                                  onChange={(e) => {
                                    setAssetsDetails((prev) => ({
                                      ...prev,
                                      user_asset_investment_amount: e.target.value,
                                    }));
                                  }}
                                  readOnly
                                  autoComplete="off"
                                />
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label for="name">Invested Amount (₹)</label>
                              </span>
                              <span className="info-hover-box">
                                <span className="icon">
                                  <img
                                    alt="More information"
                                    src={imagePath + '/static/media/more_information.svg'}
                                  />
                                </span>
                                <span className="msg">
                                  Auto Calculated by No Of Units and Avg. Buy
                                  Price
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                          opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                          cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                        }} className="row py-md-2">
                          <div className="col-md-5 custom-input">
                            <div
                              className={`form-group  ${assetsDetails.user_asset_current_price
                                ? "inputData"
                                : null
                                } `}
                            >
                              <input
                                type="text"
                                id="Current_Price_1"
                                name="user_asset_avg_purchase_price"
                                value={assetsDetails.user_asset_current_price}
                                onChange={(e) => {
                                  setAssetsDetails((prev) => ({
                                    ...prev,
                                    user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                    isEditable: true,
                                  }));
                                }}
                                readOnly
                                required
                                autoComplete="off"
                              />
                              <span class="highlight"></span>
                              <span class="bar"></span>
                              <label for="name">Current Price (₹)*</label>
                            </div>
                            {simpleValidator.current.message(
                              "Asset Current Price",
                              assetsDetails.user_asset_current_price,
                              "required",
                              {
                                messages: {
                                  required: "Please add current price",
                                },
                              }
                            )}
                          </div>
                          <div className="col-md-5 custom-input">
                            <div
                              className={`form-group  ${assetsDetails.user_asset_current_amount
                                ? "inputData"
                                : null
                                } `}
                            >
                              <span>
                                <input
                                  type="text"
                                  id="user_asset_avg_purchase_price_2"
                                  name="user_asset_avg_purchase_price"
                                  value={assetsDetails.user_asset_current_amount}
                                  onChange={(e) => {
                                    setAssetsDetails((prev) => ({
                                      ...prev,
                                      user_asset_current_amount: e.target.value,
                                    }));
                                  }}
                                  readOnly
                                  autoComplete="off"
                                />
                                <span class="highlight"></span>
                                <span class="bar"></span>
                                <label for="name">Current Value (₹)</label>
                              </span>
                              <span className="info-hover-box">
                                <span className="icon">
                                  <img
                                    alt="More information"
                                    src={imagePath + '/static/media/more_information.svg'}
                                  />
                                </span>
                                <span className="msg">
                                  Auto Calculated by No Of Units and Current
                                  Price
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="row py-md-2 mt-md-4">
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
                              Select a goal below to map this investment with a
                              goal of your choice. Otherwise, Fintoo will link
                              it automatically with your high priority goal. In
                              case, you do not wish to utilize this investment
                              for any goal, select "NO".
                            </span>
                          </span>
                          <div className="d-flex ms-md-4">
                            <div>No</div>
                            <Switch
                              onChange={(v) =>
                                setAssetsDetails((prev) => ({
                                  ...prev,
                                  user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                                }))
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
                                  You can only assign goals which are prior to
                                  the end date of the asset
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
                                  setAutoMatedGoal={setAutoMatedGoal}
                                  isAutoMatedGoal={isAutoMatedGoal}
                                  setGoalLink={setGoalLink}
                                  type={"Asset"}
                                  user_asset_maturity_date={
                                    assetsDetails.user_asset_end_date
                                  }
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
                                to={
                                  process.env.PUBLIC_URL +
                                  "/datagathering/goals"
                                }
                              >
                                <div className="previous-btn form-arrow d-flex align-items-center">
                                  <FaArrowLeft />
                                  <span className="hover-text">
                                    &nbsp;Previous
                                  </span>
                                </div>
                              </Link>

                              {addForm && (
                                <button
                                  onClick={(e) => handleDebtSubmit(e)}
                                  className="default-btn gradient-btn save-btn"
                                >
                                  Save & Add More
                                </button>
                              )}
                              {props.updateForm && (
                                <div>
                                  <button
                                    onClick={(e) => handleDebtCancel(e)}
                                    className="default-btn gradient-btn save-btn"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={(e) => handleDebtUpdate(e)}
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
                                  props.setTab("tab2")
                                }}
                              >
                                <span
                                  className="hover-text"
                                  style={{ maxWidth: 100 }}
                                >
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
                )}
              {assetsDetails.asset_sub_name_uuid == 'debt_mf' &&
                selectedExtraOption == "Link your Holdings" && (
                  <LinkYourHoldingsDG
                    customStyles={customStyles}
                    session={session}
                  />
                )}
            </div>
          )}

        {props.assetEditId && assetsDetails.asset_sub_name_uuid == 'debt_mf' && (
          <div>
            <form noValidate="novalidate" name="goldassetform">
              <div className="row py-md-2">
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label
                      style={{
                        whiteSpace: "normal",
                      }}
                    >
                      {" "}
                      Start Typing To Search For Your Debt Mutual Funds*{" "}
                    </Form.Label>
                    {debtfunds && debtfunds.length > 0 && (
                      <Select
                        isDisabled={
                          (
                            assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        classNamePrefix="sortSelect"
                        components={{ Input }}
                        autoComplete="new-password"
                        isSearchable={true}
                        styles={customStyles}
                        options={debtFundsData}
                        onChange={handleDebtFundSelection}
                        value={debtFundsData
                          .filter((v) => v.label == assetsDetails.user_asset_name)}
                      />
                    )}
                  </div>
                  {simpleValidator.current.message(
                    "Asset Name",
                    assetsDetails.user_asset_name,
                    "required",
                    { messages: { required: "Please select fund name" } }
                  )}
                </div>
                <div
                  className={`col-md-5 ${assetsDetails.asset_sub_name_uuid == 'debt_mf' ? "mt-md-1" : ""
                    }`}
                >
                  <div className="material">
                    <Form.Label>Who Is This Investment For*</Form.Label>
                    {familyData && (
                      <Select
                        isDisabled={
                          (
                            assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        classNamePrefix="sortSelect"
                        isSearchable={false}
                        styles={customStyles}
                        options={familyData}
                        onChange={(e) => {
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_for: e.value,
                          }));
                          handleAssetMemberMaturityDate(e);

                        }
                        }
                        value={familyData.filter(
                          (v) => v.value == assetsDetails.user_asset_for
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="row py-md-2">
                <div className="col-md-8 mt-2">
                  <div className="d-flex">
                    <Form.Label className=" ">
                      Is The Equity One Time Or Recurring?*
                    </Form.Label>
                    <div className="d-flex ms-md-4">
                      <div>One Time</div>
                      <Switch
                        disabled={
                          (
                            assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        onChange={(v) => {
                          const occuranceValue = v ? "Recurring" : "One Time";
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_occurance: occuranceValue,
                            user_asset_avg_purchase_price: "",
                          }));
                        }}
                        checked={assetsDetails.user_asset_occurance === "Recurring"}
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

              {assetsDetails.user_asset_occurance == "Recurring" && (
                <>
                  <div className="row py-md-2">
                    <div className="col-md-5 ">
                      <div className="material">
                        <Form.Label>SIP Start Date</Form.Label>
                        <div
                          className="dt-conbx"
                          style={{
                            borderBottom: "1px solid #dadada",
                            paddingTop: "0px",
                          }}
                        >
                          <ReactDatePicker
                            readOnly={
                              (
                                assetsDetails?.user_asset_source ?? ""
                              ).toLowerCase() == "external"
                            }
                            select_date={moment(
                              assetsDetails.user_asset_purchase_date,
                              "DD/MM/YYYY"
                            ).toDate()}
                            setDate={(date) => {
                              setDate(date, "assetPurchaseDate");
                            }}
                            minDate={""}
                            maxDate={moment().toDate()}
                            className="pt-4"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 ">
                      <div className="material">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="SIP Amount (₹)*"
                          className="material"
                        >
                          <Form.Control
                            disabled={
                              (
                                assetsDetails?.user_asset_source ?? ""
                              ).toLowerCase() == "external"
                            }
                            type="Number"
                            placeholder=""
                            className="shadow-none"
                            value={
                              assetsDetails.user_asset_sip_amount === 0
                                ? ""
                                : assetsDetails.user_asset_sip_amount
                            }
                            onChange={(e) => {
                              if (e.target.value == 0) {
                                setAssetsDetails((prev) => ({
                                  ...prev,
                                  user_asset_sip_amount: "",
                                }));
                              } else {
                                setAssetsDetails((prev) => ({
                                  ...prev,
                                  user_asset_sip_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                }));
                              }
                            }}
                          />
                        </FloatingLabel>
                        {simpleValidator.current.message(
                          "SIP Amount",
                          assetsDetails.user_asset_sip_amount,
                          "required|numeric|min:1,num",
                          {
                            messages: {
                              required: "Please enter SIP amount",
                              min: "Please enter valid SIP amount",
                            },
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row d-flex align-items-center py-md-2">
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group ${assetsDetails.user_asset_avg_purchase_price
                          ? "inputData"
                          : null
                          } `}
                      >
                        <input
                          type="Number"
                          id="Total_Invested_Amount_4"
                          name="user_asset_quantity_2"
                          placeholder=""
                          className="shadow-none"
                          readOnly={
                            (
                              assetsDetails?.user_asset_source ?? ""
                            ).toLowerCase() == "external"
                          }
                          value={assetsDetails.user_asset_avg_purchase_price}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                              isEditable: true,
                            }));
                          }}
                          required
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">Total Invested Amount (₹)*</label>
                      </div>
                      {simpleValidator.current.message(
                        "Asset Purchase Amount",
                        assetsDetails.user_asset_avg_purchase_price,
                        "required",
                        { messages: { required: "Please add invested amount" } }
                      )}
                    </div>
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group ${assetsDetails.user_asset_quantity ? "inputData" : null
                          } `}
                      >
                        <input
                          type="Number"
                          id="user_asset_quantity_d_8"
                          name="user_asset_quantity_2"
                          value={assetsDetails.user_asset_quantity}
                          readOnly={
                            (
                              assetsDetails?.user_asset_source ?? ""
                            ).toLowerCase() == "external"
                          }
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                            }));
                          }}
                          required
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">No. Of Units*</label>
                      </div>

                      {simpleValidator.current.message(
                        "Asset Units",
                        assetsDetails.user_asset_quantity,
                        "required|min:1,num",
                        {
                          messages: {
                            required: "Please add units",
                            min: "Number of units must be greater than 0",
                          },
                        }
                      )}
                    </div>
                  </div>
                  <div className="row py-md-2">
                    <div className="col-md-5">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Current Price (₹)*"
                        className="mb-3 material"
                      >
                        <Form.Control
                          type="text"
                          placeholder=""
                          className="shadow-none"
                          value={assetsDetails.user_asset_current_price}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                              isEditable: true,
                            }));
                          }}
                          readOnly
                        />
                      </FloatingLabel>
                    </div>
                    <div className="col-md-5  ">
                      <div className=" d-flex justify-content-between flex-grow-1">
                        <FloatingLabel
                          controlId="floatingInput"
                          label="Current value (₹)"
                          className="mb-3 material d-flex"
                        >
                          <Form.Control
                            type="number"
                            placeholder="Current value (₹)"
                            value={assetsDetails.user_asset_current_amount}
                            onChange={(e) => {
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_current_amount: e.target.value,
                              }));
                            }}
                            readOnly
                          />
                          <span
                            className="info-hover-box float-right"
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
                              Auto calculated by SIP amount and current NAV.
                            </span>
                          </span>
                        </FloatingLabel>
                      </div>
                    </div>
                  </div>
                  <div className="row py-md-2">
                    <div className="col-md-5 ">
                      <div className="material">
                        <Form.Label>SIP End Date*</Form.Label>
                        <div
                          className="dt-conbx"
                          style={{
                            borderBottom: "1px solid #dadada",
                            // paddingTop: "19px",
                          }}
                        >
                          <ReactDatePicker
                            select_date={moment(
                              assetsDetails.user_asset_end_date,
                              "DD/MM/YYYY"
                            ).toDate()}
                            readOnly={
                              (
                                assetsDetails?.user_asset_source ?? ""
                              ).toLowerCase() == "external"
                            }
                            setDate={(date) => {
                              setDate(date, "assetendDate");
                            }}
                            minDate={moment().toDate()}
                            maxDate={""}
                            className="pt-4"
                          />
                        </div>
                        {simpleValidator.current.message(
                          "SIP End Date",
                          assetsDetails.user_asset_end_date,
                          "required",
                          { messages: { required: "Please add SIP end date " } }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-9 mt-2">
                      <div className="">
                        <div className="d-flex pt-2" style={{ clear: "both" }}>
                          <FintooRadio2
                            checked={assetsDetails.user_asset_valid_till == "Retirement"}
                            onClick={() => {
                              setselectedEndAge("Upto Retirement Age");
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_valid_till: "Retirement",
                                user_asset_end_date: moment(retirementDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                              }));
                              // setAssetsDetails((prev) => ({
                              //   ...prev,
                              //   user_asset_valid_till: "Upto Retirement Age",
                              //   user_asset_end_date: moment(retirementDate)
                              //     .add(retirementDate, "y")
                              //     .format("DD/MM/YYYY"),
                              // }));
                            }}
                            readOnly={
                              (
                                assetsDetails?.user_asset_source ?? ""
                              ).toLowerCase() == "external"
                            }
                            title="Upto Retirement Age"
                          />
                          <FintooRadio2
                            checked={assetsDetails.user_asset_valid_till == "Life Expectancy"}
                            onClick={() => {
                              setselectedEndAge("Upto Life Expectancy Age");
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_valid_till: "Life Expectancy",
                                user_asset_end_date: moment(lifeExpectancyDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                              }));
                              // setAssetsDetails((prev) => ({
                              //   ...prev,
                              //   user_asset_valid_till: "Upto Life Expectancy Age",
                              //   user_asset_end_date: moment(lifeExpectancyDate)
                              //     .add(lifeExpectancyDate, "y")
                              //     .format("DD/MM/YYYY"),
                              // }));
                            }}
                            readOnly={
                              (
                                assetsDetails?.user_asset_source ?? ""
                              ).toLowerCase() == "external"
                            }
                            title="Upto Life Expectancy Age"
                          />
                          <FintooRadio2
                            checked={assetsDetails.user_asset_valid_till == "Retirement"}
                            onClick={() => {
                              setselectedEndAge("Perpetual");
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_valid_till: "Retirement",
                                user_asset_end_date: moment(
                                  "2099-12-31",
                                  "YYYY-MM-DD"
                                ).format("DD/MM/YYYY"),
                              }));
                            }}
                            readOnly={
                              (
                                assetsDetails?.user_asset_source ?? ""
                              ).toLowerCase() == "external"
                            }
                            title="Perpetual"
                          />
                          <span className="info-hover-box">
                            <span className="icon">
                              <img
                                alt="More information"
                                src={imagePath + '/static/media/more_information.svg'}
                              />
                            </span>
                            <span className="msg">
                              Perpetual SIPs refer to those with no tenure end
                              date. Most fund houses assume such SIPs to
                              continue till 2099 and it can be only linked to
                              goals after 2099. Advice to select specific end
                              date based on goals
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {assetsDetails.user_asset_occurance == "One Time" && (
                <>
                  <div className="row d-flex align-items-center py-md-2">
                    <div className="col-md-5 ">
                      <div className="material">
                        <Form.Label>Date of Purchase</Form.Label>
                        <div
                          className="dt-conbx"
                          style={{
                            borderBottom: "1px solid #dadada",
                            paddingTop: "0px",
                          }}
                        >
                          <ReactDatePicker
                            select_date={moment(
                              assetsDetails.user_asset_purchase_date,
                              "DD/MM/YYYY"
                            ).toDate()}
                            readOnly={
                              (
                                assetsDetails?.user_asset_source ?? ""
                              ).toLowerCase() == "external"
                            }
                            setDate={(date) => {
                              setDate(date, "assetPurchaseDate");
                            }}
                            minDate={""}
                            maxDate={moment().toDate()}
                            className="pt-2"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group mt-2 ${assetsDetails.user_asset_quantity ? "inputData" : null
                          } `}
                      >
                        <input
                          type="Number"
                          id="user_asset_quantity_d_9"
                          name="user_asset_quantity_3"
                          value={assetsDetails.user_asset_quantity}
                          readOnly={
                            (
                              assetsDetails?.user_asset_source ?? ""
                            ).toLowerCase() == "external"
                          }
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                            }));
                          }}
                          required
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">No. Of Units*</label>
                      </div>
                      {simpleValidator.current.message(
                        "Asset Units",
                        assetsDetails.user_asset_quantity,
                        "required|min:1,num",
                        {
                          messages: {
                            required: "Please add units",
                            min: "Number of units must be greater than 0",
                          },
                        }
                      )}
                    </div>
                  </div>

                  <div className="row py-md-2">
                    <div className="col-md-5 ">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Avg. buy Price (₹)*"
                        className="mb-3 material"
                      >
                        <Form.Control
                          placeholder="Avg. buy Price (₹)"
                          className="shadow-none"
                          type="number"
                          disabled={
                            (
                              assetsDetails?.user_asset_source ?? ""
                            ).toLowerCase() == "external"
                          }
                          value={assetsDetails.user_asset_avg_purchase_price}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                              isEditable: true,
                            }));
                          }}
                        />
                      </FloatingLabel>
                      {simpleValidator.current.message(
                        "Asset Current Price",
                        assetsDetails.user_asset_avg_purchase_price,
                        "required|min:1,num",
                        {
                          messages: {
                            required: "Please add avg. buy price",
                            min: "Invested value must be greater than 0",
                          },
                        }
                      )}
                    </div>

                    <div className="col-md-5 ">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Invested Amount (₹)"
                        className="mb-3 material d-flex"
                      >
                        <Form.Control
                          placeholder="Invested Amount (₹)"
                          className="shadow-none"
                          value={assetsDetails.user_asset_investment_amount}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_investment_amount: e.target.value,
                            }));
                          }}
                          readOnly
                        />
                        <span className="info-hover-box">
                          <span className="icon">
                            <img
                              alt="More information"
                              src={imagePath + '/static/media/more_information.svg'}
                            />
                          </span>
                          <span className="msg">
                            Auto Calculated by No Of Units and Avg. Buy Price
                          </span>
                        </span>
                      </FloatingLabel>
                    </div>
                  </div>

                  <div className="row py-md-2">
                    <div className="col-md-5 ">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Current Price (₹)*"
                        className="mb-3 material"
                      >
                        <Form.Control
                          placeholder="Current Price (₹)"
                          className="shadow-none"
                          type="number"
                          value={assetsDetails.user_asset_current_price}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                              isEditable: true,
                            }));
                          }}
                          readOnly
                        />
                      </FloatingLabel>
                      {simpleValidator.current.message(
                        "Asset Current Price",
                        assetsDetails.user_asset_current_price,
                        "required",
                        { messages: { required: "Please add current price" } }
                      )}
                    </div>
                    <div className="col-md-5 ">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Current Value (₹)"
                        className="mb-3 material d-flex"
                      >
                        <Form.Control
                          placeholder="Current Value (₹)"
                          className="shadow-none"
                          value={assetsDetails.user_asset_current_amount}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_current_amount: e.target.value,
                            }));
                          }}
                          readOnly
                        />
                        <span className="info-hover-box">
                          <span className="icon">
                            <img
                              alt="More information"
                              src={imagePath + '/static/media/more_information.svg'}
                            />
                          </span>
                          <span className="msg">
                            Auto Calculated by No Of Units and Current Price
                          </span>
                        </span>
                      </FloatingLabel>
                    </div>
                  </div>
                </>
              )}

              <div className="row py-md-2 mt-md-4">
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
                        Select a goal below to map this investment with a goal
                        of your choice. Otherwise, Fintoo will link it
                        automatically with your high priority goal. In case, you
                        do not wish to utilize this investment for any goal,
                        select "NO".
                      </span>
                    </span>
                    <div className="d-flex ms-md-4">
                      <div>No</div>
                      <Switch
                        onChange={(v) =>
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                          }))
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
                            setAutoMatedGoal={setAutoMatedGoal}
                            isAutoMatedGoal={isAutoMatedGoal}
                            setGoalLink={setGoalLink}
                            type={"Asset"}
                            user_asset_maturity_date={
                              assetsDetails.user_asset_end_date
                            }
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

                        {addForm && (
                          <button
                            onClick={(e) => handleDebtSubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {props.updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleDebtCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleDebtUpdate(e)}
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
                            props.setTab("tab2")
                          }}
                        >
                          <span
                            className="hover-text"
                            style={{ maxWidth: 100 }}
                          >
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
          </div>
        )}

        {(!props.assetEditId || props.assetEditId == "") &&
          assetsDetails.asset_type_name_uuid == 'epf' && (
            <div>
              {/* {assetsDetails.asset_type_name_uuid == 'epf' && (
                <div className="d-md-flex justify-content-center">
                  <DgRoundedButton
                    active={selectedButton == "EPF Manual Entry"}
                    onClick={() => {
                      setSelectedButton("EPF Manual Entry");
                      setSelectedExtraOption("EPF Manual Entry");
                    }}
                    title="Manual Entry"
                  />
                  <DgRoundedButton
                    active={selectedButton == "Link EPF"}
                    onClick={() => {
                      setSelectedButton("Link EPF");
                      setSelectedExtraOption("Link EPF");
                    }}
                    title="Link EPF"
                  />
                </div>
              )} */}
              {assetsDetails.asset_type_name_uuid == 'epf' && (
                <form noValidate="novalidate" name="goldassetform">
                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="row d-flex align-items-center py-md-2">
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                          } `}
                        style={{ paddingTop: "19px" }}
                      >
                        <input
                          type="text"
                          id="asset_name_d_9"
                          name="asset_name"
                          maxLength={35}
                          value={assetsDetails.user_asset_name}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_name: e.target.value,
                            }));
                          }}
                          required
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">Name of Asset*</label>
                      </div>
                      <div>
                        {simpleValidator.current.message(
                          "Asset Name",
                          assetsDetails.user_asset_name,
                          "required|min:3|max:60",
                          {
                            messages: {
                              required: "Please enter asset name",
                              max: "Asset name must be between 3-35 characters.",
                              min: "Asset name must be between 3-35 characters.",
                            },
                          }
                        )}
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="material" style={{ marginTop: "2px" }}>
                        <Form.Label>Who Is This Investment For*</Form.Label>
                        {familyData && (
                          <Select
                            classNamePrefix="sortSelect"
                            isSearchable={false}
                            styles={customStyles}
                            options={familyData}
                            onChange={(e) => {
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_for: e.value,
                              }));
                              handleAssetMemberMaturityDate(e);

                            }
                            }
                            value={familyData.filter(
                              (v) => v.value == assetsDetails.user_asset_for
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="row py-md-2">
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group  ${assetsDetails.user_asset_current_amount
                          ? "inputData"
                          : null
                          } `}
                      >
                        <input
                          type="Number"
                          id="EPF_bal"
                          name="user_asset_current_amount"
                          value={assetsDetails.user_asset_current_amount}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_current_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                              isEditable: true,
                            }));
                          }}
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">Current EPF Balance (₹)</label>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="row py-md-2">
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group  ${assetsDetails.user_asset_epf_employee
                          ? "inputData"
                          : null
                          } `}
                      >
                        <input
                          type="Number"
                          id="user_asset_epf_employee"
                          name="user_asset_epf_employee"
                          value={assetsDetails.user_asset_epf_employee}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_epf_employee: e.target.value.slice(
                                0,
                                11
                              ),
                              isEditable: true,
                            }));
                          }}
                          required
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">
                          Employee's Monthly contribution to EPF (Rs.)*
                        </label>
                      </div>
                      <div>
                        {simpleValidator.current.message(
                          "Employee's Monthly contribution to EPF (Rs.)*",
                          assetsDetails.user_asset_epf_employee,
                          "required",
                          {
                            messages: {
                              required: "Please enter employee contribution",
                            },
                          }
                        )}
                      </div>
                    </div>
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group  ${assetsDetails.user_asset_epf_employer
                          ? "inputData"
                          : null
                          } `}
                      >
                        <input
                          type="Number"
                          id="employee_monthly_contribution"
                          name="user_asset_epf_employer"
                          value={assetsDetails.user_asset_epf_employer}
                          onChange={(e) => {
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_epf_employer: e.target.value.slice(
                                0,
                                11
                              ),
                              isEditable: true,
                            }));
                          }}
                          required
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">
                          Employer's Monthly contribution to EPF (Rs.)*
                        </label>
                      </div>
                      <div>
                        {simpleValidator.current.message(
                          "Employer's Monthly contribution to EPF (Rs.)*",
                          assetsDetails.user_asset_epf_employer,
                          "required",
                          {
                            messages: {
                              required: "Please enter employer contribution",
                            },
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="row py-md-2 mt-3">
                    <div className="col-md-5 ">
                      <div className="material">
                        <Form.Label>
                          Rate Of Return(%)* :{" "}
                          {assetsDetails.user_asset_ror == 0
                            ? 8.1
                            : assetsDetails.user_asset_ror}
                        </Form.Label>
                        <div
                          className={`${assetsDetails.user_asset_ror < 1 && "sl-hide-left"
                            } ${assetsDetails.user_asset_ror > 18.5 && "sl-hide-right"
                            }`}
                        >
                          <Slider
                            min={0}
                            max={20}
                            value={
                              assetsDetails.user_asset_ror == 0
                                ? 8.1
                                : assetsDetails.user_asset_ror
                            }
                            step={0.05}
                            onChange={(v) =>
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_ror:
                                  Math.round(
                                    (parseFloat(v) + Number.EPSILON) * 100
                                  ) / 100,
                                isEditable: true,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="material">
                        <Form.Label>
                          Growth Rate In EPF Contribution (%)* :{" "}
                          {assetsDetails.user_asset_growth_rate == 0
                            ? 10
                            : assetsDetails.user_asset_growth_rate}
                        </Form.Label>
                        <Slider
                          min={0}
                          max={50}
                          value={
                            assetsDetails.user_asset_growth_rate == 0
                              ? 10
                              : assetsDetails.user_asset_growth_rate
                          }
                          onChange={(v) =>
                            setAssetsDetails((prev) => ({
                              ...prev,
                              user_asset_growth_rate: v,
                              isEditable: true,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="row py-md-2">
                    <div className="col-md-5 mt-md-1">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Maturity Date*"
                        className="material"
                        style={{
                          marginTop: "2px",
                        }}
                      >
                        <div
                          className="dt-conbx"
                          style={{
                            borderBottom: "1px solid #dadada",
                            paddingTop: "16px",
                          }}
                        >
                          <ReactDatePicker
                            select_date={moment(
                              assetsDetails.user_asset_maturity_date,
                              "DD/MM/YYYY"
                            ).toDate()}
                            setDate={(date) => {
                              setDate(date, "maturityDate");
                            }}
                            minDate={moment().toDate()}
                            maxDate={moment().add(100, "years").toDate()}
                            className="pt-4"
                          />
                        </div>
                      </FloatingLabel>
                      <div>
                        {simpleValidator.current.message(
                          "Maturity Date",
                          assetsDetails.user_asset_maturity_date,
                          "required",
                          {
                            messages: {
                              required: "Please select maturity date ",
                            },
                          }
                        )}
                      </div>
                    </div>
                    <div className="col-md-5 mt-2">
                      <div className="dark-label">
                        <div className="d-flex" style={{ clear: "both" }}>
                          <FintooRadio2
                            checked={assetsDetails.user_asset_valid_till == "Retirement"}
                            onClick={() => {
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_valid_till: "Retirement",
                                user_asset_maturity_date: moment(retirementDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                              }));
                              // setAssetsDetails((prev) => ({
                              //   ...prev,
                              //   user_asset_valid_till: "Upto Retirement Age",
                              //   user_asset_maturity_date: moment(retirementDate)
                              //     .add(retirementDate, "y")
                              //     .format("DD/MM/YYYY"),
                              // }));
                            }}
                            title="Upto Retirement Age"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="row py-md-2 mt-4">
                    <div className="col-md-5 custom-input">
                      <div className={`form-group inputData`}>
                        <span>
                          {" "}
                          <input
                            type="Number"
                            id="user_asset_current_price_d_8"
                            name="user_asset_current_price"
                            value={assetsDetails.user_asset_maturity_amount}
                            onChange={(e) => {
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_maturity_amount: e.target.value.slice(
                                  0,
                                  11
                                ),
                              }));
                            }}
                            required
                            autoComplete="off"
                          />
                          <span class="highlight"></span>
                          <span class="bar"></span>
                          <label for="name">Maturity Amount*</label>
                        </span>
                        <span
                          className="info-hover-box float-right"
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
                            Auto calculated on the basis of Purchase Amount
                            and Rate Of Return. You can also edit it and enter
                            your desired maturity amount.
                          </span>
                        </span>
                      </div>

                      <div>
                        {simpleValidator.current.message(
                          "Asset Maturity Amount",
                          assetsDetails.user_asset_maturity_amount,
                          "required",
                          {
                            messages: {
                              required: "Please enter maturity amount",
                            },
                          }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row py-md-2 mt-md-2">
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
                            Select a goal below to map this investment with a
                            goal of your choice. Otherwise, Fintoo will link
                            it automatically with your high priority goal. In
                            case, you do not wish to utilize this investment
                            for any goal, select "NO".
                          </span>
                        </span>
                        <div className="d-flex ms-md-4">
                          <div>No</div>
                          <Switch
                            onChange={(v) =>
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                              }))
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
                                You can only assign goals which are prior to
                                the end date of the asset
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
                                goals={
                                  props.retirementGoalID
                                    ? goalData.filter((goal) => {
                                      return (
                                        goal.value == props.retirementGoalID
                                      );
                                    })
                                    : goalData
                                }
                                unchangedgoaldata={unchangedgoaldata}
                                closeModal={closeModal}
                                selectGoals={selectGoals}
                                selectedGoals={selectedGoals}
                                selectedGoalIdArray={selectedGoalIdArray}
                                selectedGoalsId={selectedGoalsId}
                                setPriorityArray={setPriorityArray}
                                selectedPriorityArray={selectedPriorityArray}
                                setAutoMatedGoal={setAutoMatedGoal}
                                isAutoMatedGoal={isAutoMatedGoal}
                                setGoalLink={setGoalLink}
                                type={"Asset"}
                                user_asset_maturity_date={
                                  assetsDetails.user_asset_maturity_date
                                }
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
                              to={
                                process.env.PUBLIC_URL +
                                "/datagathering/goals"
                              }
                            >
                              <div className="previous-btn form-arrow d-flex align-items-center">
                                <FaArrowLeft />
                                <span className="hover-text">
                                  &nbsp;Previous
                                </span>
                              </div>
                            </Link>

                            {addForm && (
                              <button
                                onClick={(e) => handleDebtSubmit(e)}
                                className="default-btn gradient-btn save-btn"
                              >
                                Save & Add More
                              </button>
                            )}
                            {updateForm && (
                              <div>
                                <button
                                  onClick={(e) => handleDebtCancel(e)}
                                  className="default-btn gradient-btn save-btn"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={(e) => handleDebtUpdate(e)}
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
                                props.setTab("tab2")
                              }}
                            >
                              <span
                                className="hover-text"
                                style={{ maxWidth: 100 }}
                              >
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
              )}
              {assetsDetails.asset_type_name_uuid == 'epf' &&
                selectedExtraOption == "Link EPF" && (
                  <LinkEPF
                    setShowOTPModal={setShowOTPModal}
                    customStyles={customStyles}
                    session={session}
                  />
                )}
            </div>
          )}


        {props.assetEditId && assetsDetails.asset_type_name_uuid == 'epf' && (
          <div>
            <form noValidate="novalidate" name="goldassetform">
              <div className="row py-md-2">
                <div className="col-md-5 pt-1">
                  <FloatingLabel
                    controlId="floatingInput "
                    label="Name of Asset*"
                    className="mb-3 material"
                  >
                    <Form.Control
                      type="text"
                      className="shadow-none"
                      placeholder="First Name*"
                      maxLength={35}
                      value={assetsDetails.user_asset_name}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_name: e.target.value,
                        }));
                      }}
                    />
                  </FloatingLabel>
                  <div>
                    {simpleValidator.current.message(
                      "Asset Name",
                      assetsDetails.user_asset_name,
                      "required|min:3|max:60",
                      {
                        messages: {
                          required: "Please enter asset name",
                          max: "Asset name must be between 3-35 characters.",
                          min: "Asset name must be between 3-35 characters.",
                        },
                      }
                    )}
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label>Who Is This Investment For*</Form.Label>
                    {familyData && (
                      <Select
                        classNamePrefix="sortSelect"
                        isSearchable={false}
                        styles={customStyles}
                        options={familyData}
                        onChange={(e) => {
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_for: e.value,
                          }));
                          handleAssetMemberMaturityDate(e);

                        }
                        }
                        value={familyData.filter(
                          (v) => v.value == assetsDetails.user_asset_for
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="row py-md-2">
                <div className="col-md-5 ">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Current EPF Balance (₹)"
                    className="mb-3 material"
                  >
                    <Form.Control
                      placeholder="Current EPF Balance (₹)"
                      className="shadow-none"
                      value={assetsDetails.user_asset_current_amount}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_current_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                        }));
                      }}
                    />
                  </FloatingLabel>
                </div>
              </div>

              <div className="row py-md-2">
                <div className="col-md-5 ">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Employee's Monthly contribution to EPF (Rs.)*"
                    className="mb-3 material"
                  >
                    <Form.Control
                      placeholder="Employee's Monthly contribution to EPF (Rs.)*"
                      className="shadow-none"
                      type="number"
                      value={assetsDetails.user_asset_epf_employee}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_epf_employee: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          isEditable: true,
                        }));
                      }}
                    />
                  </FloatingLabel>
                  <div>
                    {simpleValidator.current.message(
                      "Employee's Monthly contribution to EPF (Rs.)*",
                      assetsDetails.user_asset_epf_employee,
                      "required",
                      {
                        messages: {
                          required: "Please enter employee contribution",
                        },
                      }
                    )}
                  </div>
                </div>
                <div className="col-md-5 ">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Employer's Monthly contribution to EPF (Rs.)*"
                    className="mb-3 material"
                  >
                    <Form.Control
                      placeholder="Employer's Monthly contribution to EPF (Rs.)*"
                      className="shadow-none"
                      type="number"
                      value={assetsDetails.user_asset_epf_employer}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_epf_employer: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          isEditable: true,
                        }));
                      }}
                    />
                  </FloatingLabel>
                  <div>
                    {simpleValidator.current.message(
                      "Employer's Monthly contribution to EPF (Rs.)*",
                      assetsDetails.user_asset_epf_employer,
                      "required",
                      {
                        messages: {
                          required: "Please enter employer contribution",
                        },
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className="row py-md-2">
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label>
                      Rate Of Return(%)* : {parseFloat(assetsDetails.user_asset_ror)}
                    </Form.Label>
                    <div
                      className={`${assetsDetails.user_asset_ror < 1 && "sl-hide-left"
                        } ${assetsDetails.user_asset_ror > 18.5 && "sl-hide-right"}`}
                    >
                      <Slider
                        min={0}
                        max={20}
                        value={assetsDetails.user_asset_ror}
                        step={0.05}
                        onChange={(v) => {
                          if (v != 0) {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_ror: v,
                              isEditable: true,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label>
                      Growth Rate In EPF Contribution (%)* :{" "}
                      {parseInt(assetsDetails.user_asset_growth_rate)}
                    </Form.Label>
                    <Slider
                      min={0}
                      max={50}
                      value={assetsDetails.user_asset_growth_rate}
                      onChange={(v) => {
                        if (v != 0) {
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_growth_rate: v,
                            isEditable: true,
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row py-md-2">
                <div className="col-md-5 mt-md-1">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Maturity Date*"
                    className="mb-4 material"
                    style={{
                      marginTop: "2px",
                    }}
                  >
                    <div
                      className="dt-conbx"
                      style={{
                        borderBottom: "1px solid #dadada",
                        paddingTop: "8px",
                      }}
                    >
                      <ReactDatePicker
                        select_date={moment(
                          assetsDetails.user_asset_maturity_date,
                          "DD/MM/YYYY"
                        ).toDate()}
                        setDate={(date) => {
                          setDate(date, "maturityDate");
                        }}
                        minDate={moment().toDate()}
                        maxDate={moment().add(100, "years").toDate()}
                        className="pt-4"
                      />
                    </div>
                  </FloatingLabel>
                  <div>
                    {simpleValidator.current.message(
                      "Maturity Date",
                      assetsDetails.user_asset_maturity_date,
                      "required",
                      {
                        messages: {
                          required: "Please select maturity date ",
                        },
                      }
                    )}
                  </div>
                </div>
                <div className="col-md-5 ">
                  <div className="dark-label">
                    <div className="d-flex" style={{ clear: "both" }}>
                      <FintooRadio2
                        checked={
                          assetsDetails.user_asset_valid_till == "Retirement"
                        }
                        onClick={() => {
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_valid_till: "Retirement",
                            user_asset_maturity_date: moment(retirementDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                          }));
                          // setAssetsDetails((prev) => ({
                          //   ...prev,
                          //   user_asset_valid_till: "Upto Retirement Age",
                          //   user_asset_maturity_date: moment(retirementDate)
                          //     .add(retirementDate, "y")
                          //     .format("DD/MM/YYYY"),
                          // }));
                        }}
                        title="Upto Retirement Age"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row py-md-2">
                <div className="col-md-5 ">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Maturity Amount*"
                    className="mb-3 material d-flex"
                  >
                    <Form.Control
                      type="Number"
                      placeholder="Maturity Amount*"
                      className="shadow-none"
                      value={assetsDetails.user_asset_maturity_amount}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          user_asset_maturity_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                        }));
                      }}
                    />
                    <span
                      className="info-hover-box float-right"
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
                        Auto calculated on the basis of Purchase Amount and Rate
                        Of Return. You can also edit it and enter your desired
                        maturity amount.
                      </span>
                    </span>
                  </FloatingLabel>
                  <div>
                    {simpleValidator.current.message(
                      "Asset Maturity Amount",
                      assetsDetails.user_asset_maturity_amount,
                      "required",
                      {
                        messages: {
                          required: "Please enter ma5turity amount",
                        },
                      }
                    )}
                  </div>
                </div>
              </div>
              <div className="row py-md-2 mt-md-4">
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
                        Select a goal below to map this investment with a goal
                        of your choice. Otherwise, Fintoo will link it
                        automatically with your high priority goal. In case, you
                        do not wish to utilize this investment for any goal,
                        select "NO".
                      </span>
                    </span>
                    <div className="d-flex ms-md-4">
                      <div>No</div>
                      <Switch
                        onChange={(v) =>
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                          }))
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
                            goals={
                              props.retirementGoalID
                                ? goalData.filter((goal) => {
                                  return goal.value == props.retirementGoalID;
                                })
                                : goalData
                            }
                            unchangedgoaldata={unchangedgoaldata}
                            closeModal={closeModal}
                            selectGoals={selectGoals}
                            selectedGoals={selectedGoals}
                            selectedGoalIdArray={selectedGoalIdArray}
                            selectedGoalsId={selectedGoalsId}
                            setPriorityArray={setPriorityArray}
                            selectedPriorityArray={selectedPriorityArray}
                            setAutoMatedGoal={setAutoMatedGoal}
                            isAutoMatedGoal={isAutoMatedGoal}
                            setGoalLink={setGoalLink}
                            type={"Asset"}
                            user_asset_maturity_date={
                              assetsDetails.user_asset_maturity_date
                            }
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

                        {addForm && (
                          <button
                            onClick={(e) => handleDebtSubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleDebtCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleDebtUpdate(e)}
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
                            props.setTab("tab2")
                          }
                          }
                        >
                          <span
                            className="hover-text"
                            style={{ maxWidth: 100 }}
                          >
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
          </div>
        )}

        {/* Bank Balance & Manual entry*/}

        {(!props.assetEditId || props.assetEditId == "") &&
          assetsDetails.asset_type_name_uuid == 'saving_account' && (
            <div>
              {assetsDetails.asset_type_name_uuid == 'saving_account' && (
                <div className="d-md-flex justify-content-center">
                  <DgRoundedButton
                    active={selectedButton == "Bank Statement Manual Entry"}
                    onClick={() => {
                      setSelectedButton("Bank Statement Manual Entry");
                      setSelectedExtraOption("Bank Statement Manual Entry");
                    }}
                    title="Manual Entry"
                  />
                  <DgRoundedButton
                    active={selectedButton == "Link Your Bank Statement"}
                    onClick={() => {
                      setSelectedButton("Link Your Bank Statement");
                      setSelectedExtraOption("Link Your Bank Statement");
                      // setOpenModalByName("Link_Account_Bank");
                      setItemLocal("dgexternalfetchbankbal", true)
                      // navigate(`${process.env.PUBLIC_URL}/money-management/bank-tracking-overview/`);
                    }}
                    title="Link Your Bank Statement"
                  />
                </div>
              )}

              {assetsDetails.asset_type_name_uuid == 'saving_account' &&
                selectedExtraOption == "Bank Statement Manual Entry" && (
                  <form noValidate="novalidate" name="goldassetform">
                    <div className="row d-flex align-items-center">


                      <div style={{
                        pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                        opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                        cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                      }} className="col-md-5 custom-input">
                        <div
                          className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                            } `}
                          style={{ paddingTop: "17px" }}
                        >
                          <input
                            type="text"
                            id="asset_name_d_2"
                            name="asset_name"
                            maxLength={35}
                            value={assetsDetails.user_asset_name}
                            onChange={(e) => {
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_name: e.target.value,
                              }));
                            }}
                            onBlur={() => {
                              simpleValidator.current.showMessageFor("Asset Name");
                            }}
                            required
                            autoComplete="off"
                          />
                          <span class="highlight"></span>
                          <span class="bar"></span>
                          <label for="name">Name of Asset*</label>
                        </div>
                        {simpleValidator.current.message(
                          "Asset Name",
                          assetsDetails.user_asset_name,
                          "required|min:3|max:60",
                          {
                            messages: {
                              required: "Please enter asset name",
                              max: "Asset name must be between 3-35 characters.",
                              min: "Asset name must be between 3-35 characters.",
                            },
                          }
                        )}
                      </div>
                      <div style={{
                        pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                        opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                        cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                      }} className="col-md-5">
                        <div className="material">
                          <Form.Label>Who is investment For?*</Form.Label>
                          {familyData && (
                            <Select
                              classNamePrefix="sortSelect"
                              isSearchable={false}
                              styles={customStyles}
                              options={familyData}
                              onChange={(e) => {
                                setAssetsDetails((prev) => ({
                                  ...prev,
                                  user_asset_for: e.value,
                                }))
                                handleAssetMemberMaturityDate(e)
                              }}
                              value={familyData.filter(
                                (v) => v.value == assetsDetails.user_asset_for
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {//console.log("pointerEvents", assetsDetails)
                    }
                    <div style={{
                      pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                      opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                      cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                    }} className="col-md-5 mt-md-0 custom-input">
                      <div
                        className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null
                          } `}
                      >
                        <input
                          type="number"
                          id="user_asset_current_amount"
                          name="user_asset_current_amount"
                          value={assetsDetails.user_asset_current_amount}
                          onChange={(e) => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_current_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                            });
                          }}
                          autoComplete="off"
                        />
                        <span class="highlight"></span>
                        <span class="bar"></span>
                        <label for="name">Current Balance*</label>
                      </div>
                      {simpleValidator.current.message(
                        "Current Balance",
                        assetsDetails.user_asset_current_amount,
                        "required",
                        { messages: { required: "Please add asset value" } }
                      )}
                    </div>

                    <div className="row py-md-2">
                      <div className="col-md-8">
                        <div className="d-md-flex">
                          <Form.Label className=" ">
                            Consider This Asset In Automated Linkage*
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
                              Select a goal below to map this investment with a goal
                              of your choice. Otherwise, Fintoo will link it
                              automatically with your high priority goal. In case, you
                              do not wish to utilize this investment for any goal,
                              select "NO".
                            </span>
                          </span>
                          <div className="d-flex  ms-4">
                            <div>No</div>
                            <Switch
                              onChange={(v) =>
                                setAssetsDetails((prev) => ({
                                  ...prev,
                                  user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                                }))
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
                          <div className="col-md-12 mt-md-0 mt-5">
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
                                  <div style={{ whiteSpace: "nowrap" }}>
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
                                  setAutoMatedGoal={setAutoMatedGoal}
                                  isAutoMatedGoal={isAutoMatedGoal}
                                  setGoalLink={setGoalLink}
                                  user_asset_maturity_date={
                                    assetsDetails.user_asset_maturity_date
                                  }
                                  type={"Asset"}
                                  isGoalFilter={"Recurring"}
                                  isAssetRecurring={
                                    assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"
                                  }
                                ></GoalsDropdown>
                              ) : (
                                ""
                              )}
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

                              {addForm && (
                                <button
                                  onClick={(e) => handleDebtSubmit(e)}
                                  className="default-btn gradient-btn save-btn"
                                >
                                  Save & Add More
                                </button>
                              )}
                              {props.updateForm && (
                                <div>
                                  <button
                                    onClick={(e) => handleDebtCancel(e)}
                                    className="default-btn gradient-btn save-btn"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={(e) => handleDebtUpdate(e)}
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
                                  props.setTab("tab2")
                                }}
                              >
                                <span
                                  className="hover-text"
                                  style={{ maxWidth: 100 }}
                                >
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
                )}
              {assetsDetails.asset_type_name_uuid == 'saving_account' &&
                selectedExtraOption == "Link Your Bank Statement" && (

                  <>
                    <center>
                      <DgRoundedButton
                        active={selectedButton == "Link Bank Account"}
                        onClick={() => {
                          // setSelectedButton("Link Your Bank Statement");
                          // setSelectedExtraOption("Link Your Bank Statement");
                          // setOpenModalByName("Link_Account_Bank");
                          setItemLocal("dgexternalfetchbankbal", true)
                          navigate(`${process.env.PUBLIC_URL}/money-management/bank-tracking-overview/`);
                        }}
                        title="Link Bank Account"
                      />
                    </center>
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
                              <tr key={item.name}>
                                {/* Linked Bank with logo */}
                                <td className="d-flex align-items-center gap-2">

                                  {item.mm_fip_name}
                                </td>

                                {/* Member Name */}
                                <td>{item.first_name} {item.last_name}</td>

                                {/* Mobile Number */}
                                <td>{item.mm_mobile_number}</td>

                                {/* Connected On */}
                                <td>{moment(item.creation).format("LL")}</td>

                                {/* Last Updated */}
                                <td>{moment(item.modified).format("LL")}</td>

                                {/* Action Buttons */}
                                <td>
                                  <div className="d-flex gap-3 align-items-center">
                                    {/* Refresh Button */}
                                    <div
                                      ref={syncBtnRef}
                                      title="Refresh"
                                      onClick={handleSyncNowClick}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <i
                                        className={`fa-solid fa-rotate mt-1 ${Styles.rotateAnimetion}`}
                                        style={{ fontSize: "1.3rem" }}
                                      ></i>
                                    </div>

                                    {/* Delete Button */}
                                    <div>
                                      <img
                                        onClick={() => {
                                          handleShow();
                                          setUserId(item.mm_user_id);
                                          setAssetId(item);
                                        }}
                                        style={{ cursor: "pointer" }}
                                        src={process.env.REACT_APP_STATIC_URL + "media/DG/Delete.svg"}
                                        alt="Delete"
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No Bank Accounts Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>

                )}
            </div>
          )}
        {props.assetEditId && assetsDetails.asset_type_name_uuid == 'saving_account' && (
          <div>
            <form noValidate="novalidate" name="goldassetform">
              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="row d-flex align-items-center">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                      } `}
                    style={{ paddingTop: "17px" }}
                  >
                    <input
                      type="text"
                      id="asset_name_d_2"
                      name="asset_name"
                      maxLength={35}
                      value={assetsDetails.user_asset_name}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_name: e.target.value,
                        }));
                      }}
                      onBlur={() => {
                        simpleValidator.current.showMessageFor("Asset Name");
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Name of Asset*</label>
                  </div>
                  {simpleValidator.current.message(
                    "Asset Name",
                    assetsDetails.user_asset_name,
                    "required|min:3|max:60",
                    {
                      messages: {
                        required: "Please enter asset name",
                        max: "Asset name must be between 3-35 characters.",
                        min: "Asset name must be between 3-35 characters.",
                      },
                    }
                  )}
                </div>
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label>Who is investment For?*</Form.Label>
                    {familyData && (
                      <Select
                        classNamePrefix="sortSelect"
                        isSearchable={false}
                        styles={customStyles}
                        options={familyData}
                        onChange={(e) => {
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_for: e.value,
                          }))
                          handleAssetMemberMaturityDate(e)
                        }}
                        value={familyData.filter(
                          (v) => v.value == assetsDetails.user_asset_for
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="col-md-5 mt-md-0 custom-input">
                <div
                  className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null
                    } `}
                >
                  <input
                    type="number"
                    id="user_asset_current_amount_liquid_1"
                    name="user_asset_current_amount"
                    value={assetsDetails.user_asset_current_amount}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_current_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Current Balance*</label>
                </div>
                {simpleValidator.current.message(
                  "Current Balance",
                  assetsDetails.user_asset_current_amount,
                  "required",
                  { messages: { required: "Please add asset value" } }
                )}
              </div>

              <div className="row py-md-2">
                <div className="col-md-8">
                  <div className="d-md-flex">
                    <Form.Label className=" ">
                      Consider This Asset In Automated Linkage*
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
                        Select a goal below to map this investment with a goal
                        of your choice. Otherwise, Fintoo will link it
                        automatically with your high priority goal. In case, you
                        do not wish to utilize this investment for any goal,
                        select "NO".
                      </span>
                    </span>
                    <div className="d-flex  ms-4">
                      <div>No</div>
                      <Switch
                        onChange={(v) =>
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                          }))
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
                    <div className="col-md-12 mt-md-0 mt-5">
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
                            <div style={{ whiteSpace: "nowrap" }}>
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
                            setAutoMatedGoal={setAutoMatedGoal}
                            isAutoMatedGoal={isAutoMatedGoal}
                            setGoalLink={setGoalLink}
                            user_asset_maturity_date={
                              assetsDetails.user_asset_maturity_date
                            }
                            type={"Asset"}
                            isGoalFilter={"Recurring"}
                            isAssetRecurring={
                              assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"
                            }
                          ></GoalsDropdown>
                        ) : (
                          ""
                        )}
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

                        {addForm && (
                          <button
                            onClick={(e) => handleDebtSubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {props.updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleDebtCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleDebtUpdate(e)}
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
                            props.setTab("tab2")
                          }}
                        >
                          <span
                            className="hover-text"
                            style={{ maxWidth: 100 }}
                          >
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
          </div>
        )}

        {/* New Cat  */}

        {assetsDetails.asset_type_name_uuid == 'cash' && (
          // NSC
          <>
            <form noValidate="novalidate" name="goldassetform">
              <div className="row d-flex align-items-center">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                      } `}
                    style={{ paddingTop: "17px" }}
                  >
                    <input
                      type="text"
                      id="asset_name_d_2"
                      name="asset_name"
                      maxLength={35}
                      value={assetsDetails.user_asset_name}
                      onChange={(e) => {
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_name: e.target.value,
                        }));
                      }}
                      onBlur={() => {
                        simpleValidator.current.showMessageFor("Asset Name");
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Name of Asset*</label>
                  </div>
                  {simpleValidator.current.message(
                    "Asset Name",
                    assetsDetails.user_asset_name,
                    "required|min:3|max:60",
                    {
                      messages: {
                        required: "Please enter asset name",
                        max: "Asset name must be between 3-35 characters.",
                        min: "Asset name must be between 3-35 characters.",
                      },
                    }
                  )}
                </div>
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label>Who is investment For?*</Form.Label>
                    {familyData && (
                      <Select
                        classNamePrefix="sortSelect"
                        isSearchable={false}
                        styles={customStyles}
                        options={familyData}
                        onChange={(e) => {
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_for: e.value,
                          }))
                          handleAssetMemberMaturityDate(e)
                        }}
                        value={familyData.filter(
                          (v) => v.value == assetsDetails.user_asset_for
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-md-5 mt-md-0 custom-input">
                <div
                  className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null
                    } `}
                >
                  <input
                    type="number"
                    id="user_asset_current_amount_liquid_1"
                    name="user_asset_current_amount"
                    value={assetsDetails.user_asset_current_amount}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_current_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Current Balance*</label>
                </div>
                {simpleValidator.current.message(
                  "Current Balance",
                  assetsDetails.user_asset_current_amount,
                  "required",
                  { messages: { required: "Please add asset value" } }
                )}
              </div>

              <div className="row py-md-2">
                <div className="col-md-8">
                  <div className="d-md-flex">
                    <Form.Label className=" ">
                      Consider This Asset In Automated Linkage*
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
                        Select a goal below to map this investment with a goal
                        of your choice. Otherwise, Fintoo will link it
                        automatically with your high priority goal. In case, you
                        do not wish to utilize this investment for any goal,
                        select "NO".
                      </span>
                    </span>
                    <div className="d-flex  ms-4">
                      <div>No</div>
                      <Switch
                        onChange={(v) =>
                          setAssetsDetails((prev) => ({
                            ...prev,
                            user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                          }))
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
                    <div className="col-md-12 mt-md-0 mt-5">
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
                            <div style={{ whiteSpace: "nowrap" }}>
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
                            setAutoMatedGoal={setAutoMatedGoal}
                            isAutoMatedGoal={isAutoMatedGoal}
                            setGoalLink={setGoalLink}
                            user_asset_maturity_date={
                              assetsDetails.user_asset_maturity_date
                            }
                            type={"Asset"}
                            isGoalFilter={"Recurring"}
                            isAssetRecurring={
                              assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"
                            }
                          ></GoalsDropdown>
                        ) : (
                          ""
                        )}
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

                        {addForm && (
                          <button
                            onClick={(e) => handleDebtSubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {props.updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleDebtCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleDebtUpdate(e)}
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
                            props.setTab("tab2")
                          }}
                        >
                          <span
                            className="hover-text"
                            style={{ maxWidth: 100 }}
                          >
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


        {/* Bank Balance & Manual entry  */}
        {/* {
          console.log("filteredAssetsData", props.filteredAssetsData)
        }
        {
          assetsDetails.asset_type_name_uuid == 'saving_account' && (
            <Liquid filteredAssetsData={props.filteredAssetsData} rentalincomeData={props.rentalincomeData} schemedata={props.schemedata} liquidfunds={props.liquidfunds} assetsDetails={assetsDetails} />
          )
        } */}

        <Modal
          classNames={{
            modal: "Modalpopup2",
          }}
          show={showUANModal}
          showCloseIcon={false}
          onClose={() => () => { }}
          center
          animationDuration={0}
        >
          <div className="" style={{ padding: "0 !important" }}>
            {/* <h2 className="HeaderText text-center">Link Your EPF Account</h2> */}
            <div className="Modalpopup2_heading">
              <div className="col-11 d-flex justify-content-center">
                {" "}
                <span>Link Your EPF Account</span>
              </div>
              <div
                className="col-1 text-light cursor-pointer"
                onClick={() => setShowUANModal(false)}
              >
                <i class="fa-regular fa-circle-xmark"></i>
              </div>
            </div>

            <div>
              <br />

              <div className="my-md-4">
                <div className="px-5">
                  <span className="lbl-newbond">Enter UAN *</span>
                  <br />
                  <input id="Pan" className={` w-100 fntoo-textbox-react`} type="text" />
                </div>
              </div>
              <br />
              <div className="ButtonBx">
                <button
                  className="ReNew"
                  onClick={() => {
                    setShowOTPModal(true);
                    setShowUANModal(false);
                    setIsManual(false);
                  }}
                >
                  Send OTP
                </button>
              </div>
              <br />
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
      </form>
    </>
  );
}

export default AssetDebt;



// Savings Acc.
// Cash
// Public bonds
// Pvt. Bonds
// Others Two - Mismacth