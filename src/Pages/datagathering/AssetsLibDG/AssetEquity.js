import React, { useEffect, useRef, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Select, { components } from "react-select";
import ReactDatePicker from "../../../components/HTML/ReactDatePicker/ReactDatePicker";
import FintooRadio2 from "../../../components/FintooRadio2";
import Switch from "react-switch";
import moment from "moment";
import DgRoundedButton from "../../../components/HTML/DgRoundedButton";
import DgDragDrop from "../../../components/HTML/DgDragDrop";
import DgDragDrop2 from "../../../components/HTML/DgDragDrop/DgDragDrop2";
import {
  exchange_rate,
  imagePath,
} from "../../../constants";
import { Buffer } from "buffer";
import { apiCall, rsFilter } from "../../../common_utilities";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SimpleReactValidator from "simple-react-validator";
import { Row, Modal } from "react-bootstrap";
import AssetOthers from "./AssetOthers";
import LinkYourHoldingsDG from "./LinkYourHoldingsDG";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useDispatch } from "react-redux";
import GoalsDropdown from "../../../components/GoalsDropdown/GoalDropdown";
import ConnectWithBroker from "./ConnectWithBroker";
import customStyles from "../../../components/CustomStyles";
import commonEncode from "../../../commonEncode";
import FintooLoader from "../../../components/FintooLoader";
import Styles from "./NSDL_CSDL/style.module.css";
import Nsdlcsdl from "./NSDL_CSDL/Nsdlcsdl";
import { ScrollToTop } from "../ScrollToTop"
import Uniquepannotfoundmodal from "./Uniquepannotfoundmodal";
import { saveUserAssetDetails } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
const linkyourHoldings = [
  { value: "Self", label: "Self" },
  { value: "Spouse", label: "Spouse" },
];
function AssetEquity(props) {
  const [selectedButton, setSelectedButton] = useState("");
  const [selectedExtraOption, setSelectedExtraOption] = useState("");
  const [showUANModal, setShowUANModal] = useState(false);
  const [selectedSubOption_1, setSelectedSubOption_1] = useState("");
  const [pannumbers, setPanNumbers] = useState([]);
  const [familyecas, setFamilyEcas] = useState([]);
  const [memberdataid, setMemberDataId] = useState({})
  const setAssetsDetails = props.setAssetsDetails;
  const assetsDetails = props.assetsDetails;
  const familyData = props.familyData;
  const goalData = props.goalData;
  const setDate = props.setDate;
  const disableField = props.disableexternal;
  const eqfunds = props.eqfunds;
  const upload_options = props.upload_options;
  const usequity = props.usequity;
  const equityShares = props.equityShares;
  const session = props.session;
  const selectedOption = props.selectedOption;
  const selectedSubOption = props.selectedSubOption;
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
  const [absReturn, setAbsReturn] = useState(" ");
  const assetEditId = props.assetEditId;
  const [, forceUpdate] = useState();
  const [retirementDate, setRetirementDate] = useState("");
  const [lifeExpectancyDate, setLifeExpectancyDate] = useState("");
  const [familySortedData, setFamilySortedData] = useState([]);
  const [multipleTotalInvestedValue, setMultipleTotalInvestedValue] = useState(0);
  const [multipleTotalCurrentValue, setMultipleTotalCurrentValue] = useState(0);
  const [multipleTotalAssetValueLinked, setMultipleTotalAssetValueLinked] = useState(0);
  const [multipleTotalAssetValueForLinkages, setMultipleTotalAssetValueForLinkages] = useState(0);
  const [multipleTotalRecurringInvestment, setMultipleTotalRecurringInvestment] = useState(0);
  const [subClass, setSubClass] = useState("");
  const [investmentFrom, setInvestmentFrom] = useState("");
  const [showuniqueUANModal, setShowuniqueUANModal] = useState(false);
  const data = props.filteredAssetsData.select_subclass
  const [selfData, setSelfData] = useState({});
  const isOneTime = assetsDetails.user_asset_occurance === "One Time";

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
    setMultipleTotalInvestedValue(0)
    setMultipleTotalCurrentValue(0)
    setMultipleTotalAssetValueLinked(0)
    setMultipleTotalAssetValueForLinkages(0)
    setMultipleTotalRecurringInvestment(0)
  }, [assetsDetails.asset_sub_category_id]);

  const result = Object.values(groupedData).map(item => {
    return {
      asset_id: item.asset_id,
      value: item.value,
      label: item.label,
      asset_recurring: item.asset_recurring,
      user_asset_investment_amount: item.user_asset_investment_amount,
      user_asset_for: item.user_asset_for,
      total_invested_value: item.total_invested_value,
      total_current_value: item.total_current_value,
      total_linked_goals_value: item.total_linked_goals_value
    };
  });
  const uniqueData = result
  const dynamicLabelsToRemove = ['ESOPs', 'Future & Options', 'PMS', 'Unlisted / AIF Equity', 'Others', 'US Equity', 'Equity Shares', 'Equity Mutual Funds'];
  // Extract unique labels
  const uniqueLabels = [...new Set(uniqueData.map(item => item.label))];

  // Remove entries with dynamic labels
  // const modifiedData = uniqueData.filter(item => {
  //   if (dynamicLabelsToRemove.includes(item.label) && uniqueLabels.includes(item.label)) {
  //     uniqueLabels.splice(uniqueLabels.indexOf(item.label), 1);
  //     return true;
  //   }
  //   return !dynamicLabelsToRemove.includes(item.label);
  // });

  useEffect(() => {
    if ('multi_linkage_goal_data' in assetsDetails && Array.isArray(assetsDetails.multi_linkage_goal_data) && assetsDetails.multi_linkage_goal_data.length > 0) {
      setMultipleTotalInvestedValue(assetsDetails['multi_linkage_goal_data'][0]['user_asset_current_amount'])
      setMultipleTotalCurrentValue(assetsDetails['multi_linkage_goal_data'][0]['totalcurrentvalue'])
      setMultipleTotalAssetValueLinked(assetsDetails['multi_linkage_goal_data'][0]['totalassetvaluelinked'])
      setMultipleTotalAssetValueForLinkages(assetsDetails['multi_linkage_goal_data'][0]['totalassetvalueforlinkages'])
      setMultipleTotalRecurringInvestment(assetsDetails['multi_linkage_goal_data'][0]['totalrecurringinvestment'])
      setSubClass(assetsDetails['asset_name'])
      const resultObject = familyData.find(item => item.value === assetsDetails['user_asset_for']);
      const labelName = resultObject ? resultObject.label : null;
      setInvestmentFrom(labelName)
    }
  }, [assetsDetails?.multi_linkage_goal_data]);

  // useEffect(() => {
  //   if (assetsDetails?.asset_sub_class_id) {
  //     let all_subclass = props.filteredAssetsData.all_subclass.filter(v => v.value == assetsDetails.asset_sub_class_id).map(v => v.user_asset_for);
  //     all_subclass = [...new Set(all_subclass)];
  //     var totalInvestedValue = 0;
  //     var totalCurrentValue = 0;
  //     var totalAssetValueLinked = 0;
  //     var totalAssetValueForLinkages = 0;
  //     var totalRecurringInvestment = 0
  //     for (let i = 0; i < props.filteredAssetsData.all_subclass.length; i++) {
  //       let _records = props.filteredAssetsData.all_subclass;
  //       if (_records[i].value == assetsDetails.asset_sub_class_id && _records[i].user_asset_for == assetsDetails.user_asset_for) {
  //         totalInvestedValue = totalInvestedValue + Number(_records[i].total_invested_value)
  //         totalCurrentValue = totalCurrentValue + Number(_records[i].total_current_value)
  //         if (_records[i].total_linked_goals_value == 1) {
  //           totalAssetValueLinked = totalAssetValueLinked + Number(_records[i].total_current_value)
  //         }
  //         else {
  //           totalAssetValueForLinkages = totalAssetValueForLinkages + Number(_records[i].total_current_value)
  //         }
  //         if (_records[i].value == 11 &&_records[i].asset_recurring == '1' || _records[i].asset_recurring == "One Time") {
  //           totalRecurringInvestment = totalRecurringInvestment + Number(_records[i].user_asset_investment_amount)
  //         }
  //       }
  //     }
  //     setMultipleTotalInvestedValue(totalInvestedValue)
  //     setMultipleTotalCurrentValue(totalCurrentValue)
  //     setMultipleTotalAssetValueLinked(totalAssetValueLinked)
  //     setMultipleTotalAssetValueForLinkages(totalAssetValueForLinkages)
  //     setMultipleTotalRecurringInvestment(totalRecurringInvestment)
  //     setFamilySortedData(familyData.filter(v => all_subclass.includes(v.value)));
  //   }
  //   else {
  //     setFamilySortedData([]);
  //   }
  // }, [assetsDetails?.asset_sub_class_id, assetsDetails?.asset_id, assetsDetails?.user_asset_for,]);

  // EQUITY SHARES
  const equitySharesData = equityShares.data
    ? equityShares.data.map((item) => ({
      label: item.stock_full_name,
      value: item.isin, // unique ID
      price: item.nse_current_price || item.bse_current_price, // separate price field
      data: item,
    }))
    : [];

  const handleEquityShareSelection = (selectedOption) => {
    setAssetsDetails({
      ...assetsDetails,
      user_asset_name: selectedOption.label,
      user_asset_current_price: parseFloat(selectedOption.price || 0).toFixed(2),
      scheme_equityshare: selectedOption.data,
    });
  };



  // EQUITY MUTUAL FUNDS
  const equityFundsData = eqfunds.map((item) => ({
    label: item.scheme_name,
    value: item.nav,
    data: item,
  }));

  const usEquityData = usequity.map((item) => ({
    label: item.us_equity_name,
    value: item.us_equity_price,
  }));

  const handleEquityFundSelection = (selected) => {
    setAssetsDetails((prev) => ({
      ...prev,
      user_asset_name: selected.label,
      user_asset_current_price: parseFloat(selected.value).toFixed(2),
      asset_unique_code: selected.data.scheme_code,
      // scheme_equity: selected.data,
    }));
  };


  const handleUSEquitySelection = (selectedOption) => {
    setAssetsDetails({
      ...assetsDetails,
      user_asset_name: selectedOption.label, // Set the asset_name using the selected equity name
      user_asset_current_price: parseFloat(selectedOption.value).toFixed(2),
      // asset_unique_code: selectedOption.value,
    });
  };

  const handleOnetimeButtonChange = (v) => {
    const member = familyData.find((mem) => mem.value === assetsDetails.user_asset_for);

    const occurance = v ? "One Time" : "Recurring";

    setAssetsDetails((prev) => ({
      ...prev,
      user_asset_occurance: occurance,
      user_asset_avg_purchase_price: " ",
    }));

    handleAssetMemberMaturityDate(member, occurance, occurance);
  };


  const handleAssetMemberMaturityDate = async (
    member,
    onetimechange = "One Time",
    isrecurring = "One Time"
  ) => {
    let retirement_date = "";
    let life_expectancy_date = "";

    // Make sure to parse date using correct input format
    if (member?.dob && member?.retirement_age && member?.life_expectancy) {
      retirement_date = moment(member.dob, "DD/MM/YYYY")
        .add(member.retirement_age, "y")
        .format("DD/MM/YYYY");

      life_expectancy_date = moment(member.dob, "DD/MM/YYYY")
        .add(member.life_expectancy, "y")
        .format("DD/MM/YYYY");
    }

    let newEndDate = "";

    if (assetsDetails.user_asset_valid_till === "Retirement") {
      newEndDate = retirement_date;
    } else if (assetsDetails.user_asset_valid_till === "Life Expectancy") {
      newEndDate = life_expectancy_date;
    }

    const baseUpdate = {
      ...assetsDetails,
      user_asset_for: member.value,
      user_asset_occurance: isrecurring,
      user_asset_avg_purchase_price: " ",
    };

    if (assetsDetails.user_asset_valid_till !== "Perpetual") {
      baseUpdate.user_asset_end_date = newEndDate;
    }

    setAssetsDetails(baseUpdate);
  };



  const handleCurrencySelection = (isINR) => {
    const multiplier = isINR ? 1 / exchange_rate : exchange_rate;

    setAssetsDetails((prev) => ({
      ...prev,
      user_asset_currency: isINR ? "INR" : "Dollar",
      user_asset_avg_purchase_price: parseFloat(
        prev.user_asset_avg_purchase_price * multiplier
      ).toFixed(2),
      user_asset_current_price: parseFloat(
        prev.user_asset_current_price * multiplier
      ).toFixed(2),
      user_asset_investment_amount: parseFloat(
        prev.user_asset_investment_amount * multiplier
      ).toFixed(2),
    }));
  };


  const Input = (props) => {
    const { autoComplete = props.autoComplete } = props.selectProps;
    return <components.Input {...props} autoComplete={autoComplete} />;
  };

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

    //       let url = '' + '?user_id=' + btoa(commonEncode.encrypt((session["data"]["id"]).toString())) + '&fp_log_id=' + btoa(commonEncode.encrypt((session["data"]["fp_log_id"]).toString())) + '&fp_user_id=' + btoa(commonEncode.encrypt((session["data"]["fp_user_id"]).toString())) + "&web=1";

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

  const handleEquitySubmit = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      // setIsLoading(true);
      addAssetsSubmit(e);
      setGoalSelected(false);
      setSelectedGoalsId(false);
      setSelectedPriorityArray([]);
      setAutoMatedGoal(true);
      setSelectedGoals("Automated Linkage");
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
    }
  };

  const handleUSEquitySubmit = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      // setIsLoading(true);
      // addAssetsSubmit(e);
      // setGoalSelected(false);
      // setSelectedGoalsId(false);
      // setSelectedPriorityArray([]);
      // setAutoMatedGoal(true);
      // setSelectedGoals("Automated Linkage");
      // simpleValidator.current.hideMessages();
      // setForceUpdate((v) => ++v);
    }
  };

  const handleEquityUpdate = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      // setIsLoading(true);
      updateAssetsSubmit(e);
      setGoalSelected(false);

      setSelectedGoalsId([]);
      setSelectedPriorityArray([]);
      setAutoMatedGoal(true);
      setSelectedGoals("Automated Linkage");
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
    }
  };

  const handleEquityCancel = async (e) => {
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
      setSelectedGoalsId([]);
      setSelectedPriorityArray([]);
      props.getfpgoalsdata();
    }
    setForceUpdate((v) => ++v);
  }, [
    assetsDetails?.asset_sub_category_id,
    assetsDetails?.user_asset_occurance,
    selectedButton,
  ]);

  useEffect(() => {
    if (assetsDetails.asset_sub_category_id == 4) {
      var returns = (
        ((assetsDetails?.user_asset_current_price -
          assetsDetails?.user_asset_avg_purchase_price) /
          assetsDetails?.user_asset_avg_purchase_price) *
        100
      ).toFixed(2);
      var returnPer = (
        (assetsDetails?.user_asset_current_price -
          assetsDetails?.user_asset_avg_purchase_price) /
        assetsDetails?.user_asset_avg_purchase_price
      ).toFixed(2);
      setAbsReturn(returns);
    }
  }, [
    assetsDetails?.user_asset_avg_purchase_price,
    assetsDetails?.user_asset_current_price,
    assetsDetails?.asset_abreturn,
  ]);

  useEffect(() => {
    simpleValidator.current.hideMessages();
    setForceUpdate((v) => ++v);
  }, [selectedSubOption]);

  const showuniqueUANModalclose = () => {
    setShowuniqueUANModal(false);
  }

  return (
    <div>

      <FintooLoader isLoading={isLoading} />
      {(assetsDetails.asset_sub_name_uuid == "esops" ||
        assetsDetails.asset_type_name_uuid == 'pms' ||
        assetsDetails.asset_type_name_uuid == 'unlisted') && (
          <form noValidate="novalidate" name="goldassetform">

            <>
              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="row d-flex align-items-center">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                      } `}
                    style={{ paddingTop: "19px" }}
                  >
                    <input
                      type="text"
                      id="asset_name_equity"
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
                        forceUpdate(1);
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
                <div className="col-md-5 mt-1">
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
                      />
                    )}
                  </div>
                </div>
              </div>

              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="row d-flex align-items-center py-md-1 ">
                <div className="col-md-5">
                  <div className="material">
                    <Form.Label>Date of Purchase</Form.Label>
                    <div
                      className="dt-conbx"
                      style={{
                        borderBottom: "1px solid #dadada",
                        paddingTop: "3px",
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
                        className="pt-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-5 custom-input">
                  <div
                    style={{ paddingTop: "15px" }}
                    className={`form-group  ${assetsDetails.user_asset_quantity ? "inputData" : null
                      } `}
                  >
                    <input
                      type="Number"
                      id="user_asset_quantity_euity"
                      name="user_asset_quantity"
                      value={assetsDetails.user_asset_quantity}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                        });
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">No. of Shares*</label>
                  </div>
                  <div className="w-100">
                    {simpleValidator.current.message(
                      "Asset Units",
                      assetsDetails.user_asset_quantity,
                      "required|min:1,num",
                      {
                        messages: {
                          required: "Please add shares",
                          min: "Number of shares must be greater than 0",
                        },
                      }
                    )}
                  </div>
                </div>
              </div>
              {
                //console.log("pointerEvents", assetsDetails)
              }
              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="row py-md-2 mt-1">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_avg_purchase_price ? "inputData" : null
                      } `}
                  >
                    <input
                      type="Number"
                      id="user_asset_quantity_euity_2"
                      name="user_asset_quantity"
                      value={assetsDetails.user_asset_avg_purchase_price}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                        });
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
                    "required",
                    {
                      messages: {
                        required: "Please add avg. buy price",
                      },
                    }
                  )}
                </div>

                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_investment_amount ? "inputData" : null
                      } `}
                  >
                    <input
                      type="text"
                      id="user_asset_investment_amount_1"
                      name="user_asset_investment_amount"
                      value={assetsDetails.user_asset_investment_amount}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_investment_amount: e.target.value,
                        });
                      }}
                      readOnly
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Invested Amount (₹)</label>
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
                    className={`form-group ${assetsDetails.user_asset_current_price ? "inputData" : null
                      } `}
                  >
                    <input
                      type="Number"
                      id="user_asset_current_price_1"
                      name="user_asset_current_price"
                      value={assetsDetails.user_asset_current_price}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                        });
                      }}
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
                    className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null
                      } `}
                  >
                    <span>
                      <input
                        type="text"
                        id="user_asset_current_price_equity_1"
                        name="user_asset_investment_amount"
                        value={assetsDetails.user_asset_current_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_current_amount: e.target.value,
                          });
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
                        Auto Calculated by No Of Units and Current Price
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              {assetsDetails.asset_sub_category_id == 4 && (
                <>
                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="row mt-2">
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group ${absReturn ? "inputData" : null
                          } `}
                      >
                        <span>
                          <input
                            type="text"
                            id="asset_abreturn"
                            name="asset_abreturn"
                            value={absReturn}
                            onChange={(e) => {
                              setAssetsDetails({
                                ...assetsDetails,
                                asset_abreturn: absReturn,
                              });
                            }}
                            readOnly
                            autoComplete="off"
                          />
                          <span class="highlight"></span>
                          <span class="bar"></span>
                          <label for="name">Absolute Return (%)</label>
                        </span>
                        <span className="info-hover-box">
                          <span className="icon">
                            <img
                              alt="More information"
                              src={imagePath + '/static/media/more_information.svg'}
                            />
                          </span>
                          <span className="msg">
                            Auto calculated by current value and invested amount
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
                            user_asset_automated_linkage: v ? 1 : 0 ? 1 : 0
                          })
                        }
                        checked={assetsDetails.user_asset_automated_linkage === 1 ? true : false}
                        activeBoxShadow="0 0 2px 3px #042b62"
                        className="react-switch px-2"
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
                            user_asset_maturity_date={assetsDetails?.user_asset_end_date}
                            isGoalFilter={
                              assetsDetails.user_asset_occurance == "One Time" ? "One Time" : "Recurring"
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
                            onClick={(e) => handleEquitySubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleEquityCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleEquityUpdate(e)}
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
            </>
          </form>
        )}

      {/* for US equity form */}
      {assetsDetails.asset_type_name_uuid == 'us_equity' && (
        <form noValidate="novalidate" name="goldassetform" className="mt-3">
          <div style={{
            pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
            opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
            cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
          }} className="row d-flex align-items-center py-md-2">
            <div className="col-md-5 ">
              <div className="material">
                <Form.Label>
                  Start Typing To Search For Your US Equity Shares*
                </Form.Label>
                {props.usequity && props.usequity.length > 0 && (
                  <Select
                    classNamePrefix="sortSelect"
                    components={{ Input }}
                    autoComplete="new-password"
                    isSearchable={true}
                    styles={customStyles}
                    options={usEquityData}
                    onChange={handleUSEquitySelection}
                    value={usEquityData.find(
                      (v) => v.label === assetsDetails.user_asset_name
                    )}
                  />
                )}
              </div>

              {simpleValidator.current.message(
                "Asset Name",
                assetsDetails.user_asset_name,
                "required",
                {
                  messages: {
                    required: "Please select US share name",
                  },
                }
              )}
            </div>
            <div className="col-md-5">
              <div className="material mt-1">
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
          }} className="row py-md-2 mt-3">
            <div className="col-md-8">
              <div className="d-flex">
                <Form.Label className=" ">Select Currency:</Form.Label>
                <div className="d-flex ms-md-4">
                  <div>$</div>

                  <Switch
                    onChange={handleCurrencySelection}
                    checked={assetsDetails.user_asset_currency === "INR"}
                    className="react-switch px-2"
                    activeBoxShadow="0 0 2px 3px #042b62"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={40}
                    onColor="#042b62"
                    offColor="#d8dae5"
                  />
                  <div>₹</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
            opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
            cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
          }} className="row py-md-2">
            <div className="col-md-8">
              <div className="d-flex">
                <Form.Label className=" ">
                  Is The Equity One Time Or Recurring?*
                </Form.Label>
                <div className="d-flex ms-md-4">
                  <div>One Time</div>
                  <Switch
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
              }} className="row py-md-2 mt-3">
                <div className="col-md-5 mt-1">
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
                  >
                    <input
                      type="text"
                      name="user_asset_sip_amount"
                      id="user_asset_sip_amount_eq_1"
                      value={assetsDetails.user_asset_sip_amount}
                      onChange={(e) => {
                        if (e.target.value <= 0 || e.target.value == "-") {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_sip_amount: "",
                          });
                        } else {
                          let val = e.target.value
                            .slice(0, 14)
                            .replace(/[^0-9.]/g, "");
                          let res_val = "";

                          if (val.indexOf(".") > -1) {
                            let strAfterDot = val.split(".", 2)[1];
                            if (
                              strAfterDot != undefined &&
                              strAfterDot.length <= 2
                            ) {
                              res_val = val;
                            } else {
                              var strBeforeDot = val.split(".", 1)[0];
                              res_val =
                                strBeforeDot + "." + strAfterDot.slice(0, 2);
                            }
                          } else {
                            res_val = val;
                          }

                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_sip_amount: res_val,
                          });
                        }

                        // if (e.target.value == 0) {
                        //   setAssetsDetails({
                        //     ...assetsDetails,
                        //     user_asset_sip_amount: "",
                        //   });
                        // }else{
                        //   setAssetsDetails({
                        //     ...assetsDetails,
                        //     user_asset_sip_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                        //   });
                        // }
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">SIP Amount*</label>
                  </div>
                  {simpleValidator.current.message(
                    "Asset Purchase Amount",
                    assetsDetails.user_asset_sip_amount,
                    "required|numeric|min:1,num",
                    {
                      messages: {
                        required: "Please add sip amount",
                        min: "Please enter valid asset amount",
                      },
                    }
                  )}
                </div>
              </div>
              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="row d-flex align-items-center py-md-2">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group
                   ${assetsDetails.user_asset_investment_amount == 0
                        ? "inputData"
                        : assetsDetails.user_asset_investment_amount
                          ? "inputData"
                          : null
                      }
                    `}
                  >
                    <input
                      type="text"
                      id="user_asset_investment_amount_eq_2"
                      name="user_asset_investment_amount"
                      value={assetsDetails.user_asset_investment_amount}
                      onChange={(e) => {
                        if (e.target.value < 0 || e.target.value == "-") {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: "",
                          });
                        } else {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          });
                        }

                        // setAssetsDetails({
                        //   ...assetsDetails,
                        //   user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                        // });
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Total Invested Amount *</label>
                  </div>
                  {simpleValidator.current.message(
                    "Asset Invested Amount",
                    assetsDetails.user_asset_investment_amount,
                    "required|numeric|min:1,num",
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
                      id="user_asset_quantity_eq_2"
                      name="user_asset_quantity"
                      value={assetsDetails.user_asset_quantity}
                      onChange={(e) => {
                        if (e.target.value <= 0 || e.target.value == "-") {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: "",
                          });
                        } else {
                          let val = e.target.value
                            .slice(0, 6)
                            .replace(/[^0-9.]/g, "");
                          let res_val = "";

                          if (val.indexOf(".") > -1) {
                            let strAfterDot = val.split(".", 2)[1];
                            if (
                              strAfterDot != undefined &&
                              strAfterDot.length <= 2
                            ) {
                              res_val = val;
                            } else {
                              var strBeforeDot = val.split(".", 1)[0];
                              res_val =
                                strBeforeDot + "." + strAfterDot.slice(0, 2);
                            }
                          } else {
                            res_val = val;
                          }
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: res_val,
                          });
                        }
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">No. Of Shares*</label>
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
              }} className="row d-flex align-items-center py-md-2">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_current_price
                      ? "inputData"
                      : null
                      } `}
                  >
                    <input
                      type="Number"
                      id="user_asset_quantity_eq_5"
                      name="user_asset_quantity"
                      readOnly
                      className="shadow-none"
                      value={assetsDetails.user_asset_current_price}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                        });
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Current Price *</label>
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
                <div className="col-md-5  custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null
                      } `}
                  >
                    <span>
                      <input
                        type="text"
                        id="user_asset_current_amount_eq_4"
                        name="user_asset_current_amount"
                        value={assetsDetails.user_asset_current_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_current_amount: e.target.value,
                          });
                        }}
                        readOnly
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Current value</label>
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
                        Auto calculated by No of Shares and Current Price.
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
                        // maxDate=""
                        // maxDate={moment(
                        //   "31",
                        //   "DD/MM/YYYY"
                        // ).toDate()}
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
              {/* <div className="row">
                <div className="col-9">
                  <div className="">
                    <div className="d-flex pt-2" style={{ clear: "both" }}>
                      <FintooRadio2
                        checked={assetsDetails.user_asset_valid_till == "3"}
                        onClick={() => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_valid_till: "3",
                            user_asset_end_date: moment(retirementDate)
                              .add(retirementDate, "y")
                              .format("DD/MM/YYYY"),
                          });
                        }}
                        title="Upto Retirement Age"
                      />
                      <FintooRadio2
                        checked={assetsDetails.user_asset_valid_till == "2"}
                        onClick={() => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_valid_till: "2",
                            user_asset_end_date: moment(lifeExpectancyDate)
                              .add(lifeExpectancyDate, "y")
                              .format("DD/MM/YYYY"),
                          });
                        }}
                        title="Upto Life Expectancy Age"
                      />
                      <FintooRadio2
                        checked={assetsDetails.user_asset_valid_till == "1"}
                        onClick={() => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_valid_till: "1",
                            user_asset_end_date: moment(
                              "2099-12-31",
                              "YYYY-MM-DD"
                            ).format("DD/MM/YYYY"),
                          });
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
                          Perpetual SIPs refer to those with no tenure end date.
                          Most fund houses assume such SIPs to continue till
                          2099 and it can be only linked to goals after 2099.
                          Advice to select specific end date based on goals
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div> */}
            </>
          )}
          {assetsDetails.user_asset_occurance == "One Time" && (
            <>
              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="row d-flex align-items-center py-md-2">
                <div className="col-md-5 mt-1">
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
                    className={`form-group ${assetsDetails.user_asset_quantity ? "inputData" : null
                      } `}
                    style={{ paddingTop: "15px" }}
                  >
                    <input
                      type="Number"
                      id="user_asset_quantity_eq_23"
                      name="user_asset_quantity"
                      maxLength={35}
                      className="shadow-none"
                      value={
                        assetsDetails.user_asset_quantity === 0
                          ? ""
                          : assetsDetails.user_asset_quantity
                      }
                      onChange={(e) => {
                        if (e.target.value <= 0 || e.target.value == "-") {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: "",
                          });
                        } else {
                          let val = e.target.value
                            .slice(0, 6)
                            .replace(/[^0-9.]/g, "");
                          let res_val = "";

                          if (val.indexOf(".") > -1) {
                            let strAfterDot = val.split(".", 2)[1];
                            if (
                              strAfterDot != undefined &&
                              strAfterDot.length <= 2
                            ) {
                              res_val = val;
                            } else {
                              var strBeforeDot = val.split(".", 1)[0];
                              res_val =
                                strBeforeDot + "." + strAfterDot.slice(0, 2);
                            }
                          } else {
                            res_val = val;
                          }
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: res_val,
                          });
                        }

                        // if (e.target.value == 0 || e.target.value < 0) {
                        //     setAssetsDetails({
                        //       ...assetsDetails,
                        //       user_asset_quantity: "",
                        //     });
                        // }
                        //  else {
                        //     setAssetsDetails({
                        //       ...assetsDetails,
                        //       // user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.').replace(/[^0-9]*/g,''),
                        //       user_asset_quantity: val
                        //     });
                        // }
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">No. of Shares*</label>
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
              }} className="row d-flex align-items-center py-md-2">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_avg_purchase_price ? "inputData" : null
                      } `}
                  >
                    <input
                      type="text"
                      id="avg_buy_price_eq_21"
                      name="avg_buy_price"
                      value={assetsDetails.user_asset_avg_purchase_price}
                      onChange={(e) => {
                        if (
                          e.target.value < 0 ||
                          e.target.value == "-" ||
                          e.target.value == ""
                        ) {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_avg_purchase_price: "",
                          });
                        } else {
                          let val = e.target.value
                            .slice(0, 6)
                            .replace(/[^0-9.]/g, "");
                          let res_val = "";

                          if (val.indexOf(".") > -1) {
                            let strAfterDot = val.split(".", 2)[1];
                            if (
                              strAfterDot != undefined &&
                              strAfterDot.length <= 2
                            ) {
                              res_val = val;
                            } else {
                              var strBeforeDot = val.split(".", 1)[0];
                              res_val =
                                strBeforeDot + "." + strAfterDot.slice(0, 2);
                            }
                          } else {
                            res_val = val;
                          }
                          // const strBeforeDot = "";
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_avg_purchase_price: res_val,
                          });
                        }
                      }}
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Avg. buy Price *</label>
                  </div>
                  {simpleValidator.current.message(
                    "avg_buy_price",
                    assetsDetails.user_asset_avg_purchase_price,
                    "required",
                    {
                      messages: {
                        required: "Please add avg. buy price",
                      },
                    }
                  )}
                </div>

                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_investment_amount ? "inputData" : null
                      } `}
                  >
                    <span>
                      <input
                        type="text"
                        id="asset_name_eq_22"
                        name="asset_name"
                        value={assetsDetails.user_asset_investment_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value,
                          });
                        }}
                        readOnly
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Invested Amount</label>
                    </span>
                    <span className="info-hover-box">
                      <span className="icon">
                        <img
                          alt="More information"
                          src={imagePath + '/static/media/more_information.svg'}
                        />
                      </span>
                      <span className="msg">
                        Auto Calculated by No Of Shares and Avg. Buy Price
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="row d-flex align-items-center py-md-2">
                <div className="col-md-5 custom-input">
                  <div
                    className={`form-group ${assetsDetails.user_asset_current_price
                      ? "inputData"
                      : null
                      } `}
                  >
                    <input
                      type="Number"
                      id="user_asset_current_price_eq_2"
                      name="user_asset_current_price"
                      value={assetsDetails.user_asset_current_price}
                      readOnly
                      required
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Current Price *</label>
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
                    className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null
                      } `}
                  >
                    <span>
                      <input
                        type="text"
                        id="user_asset_current_amount_eq_4"
                        name="user_asset_current_amount"
                        value={assetsDetails.user_asset_current_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_current_amount: e.target.value,
                          });
                        }}
                        readOnly
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Current value</label>
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
                        Auto calculated by No of Shares and Current Price.
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
                        user_asset_maturity_date={assetsDetails?.user_asset_end_date}
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
                    <Link to={process.env.PUBLIC_URL + "/datagathering/goals"}>
                      <div className="previous-btn form-arrow d-flex align-items-center">
                        <FaArrowLeft />
                        <span className="hover-text">&nbsp;Previous</span>
                      </div>
                    </Link>

                    {addForm && (
                      <button
                        onClick={(e) => handleEquitySubmit(e)}
                        className="default-btn gradient-btn save-btn"
                      >
                        Save & Add More
                      </button>
                    )}
                    {updateForm && (
                      <div>
                        <button
                          onClick={(e) => handleEquityCancel(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => handleEquityUpdate(e)}
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
      )}
      {
        //console.log("setSelectedButton", assetEditId, assetsDetails.asset_sub_name_uuid)
      }
      {(!props.assetEditId || props.assetEditId == "") &&
        assetsDetails.asset_sub_name_uuid == 'equity_mf' && (
          <div>
            {assetsDetails.asset_sub_name_uuid == 'equity_mf' && (
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
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_name: " ",
                      });
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

            {assetsDetails.asset_sub_name_uuid == 'equity_mf' &&
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
                        Choose 'Period' as <b>Specific Period</b> of your choice
                      </li>
                      <li>
                        Select <b>“01-01-1990” in “From Date”</b>
                      </li>
                      <li>
                        Choose 'Folio Listing' as{" "}
                        <b>without Zero Balance Folios</b>
                      </li>
                      <li>
                        Enter your <b>Email and choose password</b>/key for your
                        CAMS statement
                      </li>
                      <li>
                        You will get your <b>CAMS statement</b> on your email
                        within 10 minutes
                      </li>
                    </ol>
                  </div>
                  <div className="col-md-10">
                    <p>
                      <b>Note</b>: CAMS PDF can be uploaded one time a day ( Per
                      PAN )
                    </p>
                    <p>
                      The statement uploaded i.e. CAMS doesn't fetch the
                      existing SIP's, Post statement upload do edit the existing
                      SIP's in the funds fetched in the system.
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
                        id="Password_3"
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
                                process.env.PUBLIC_URL + "/datagathering/goals"
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
            <br />
            <br />
            {/* <button onClick={() => {
              setShowuniqueUANModal(true)
            }}>Show Unique Pan Found</button> */}
            {assetsDetails.asset_sub_name_uuid == 'equity_mf' &&
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
                    <div className="col-md-5">
                      <div className="material">
                        <Form.Label>
                          Start Typing To Search For Your Equity Mutual Funds*
                        </Form.Label>
                        {eqfunds && eqfunds.length > 0 && (
                          <Select
                            isDisabled={(assetsDetails?.user_asset_source ?? "").toLowerCase() === "external"}
                            classNamePrefix="sortSelect"
                            components={{ Input }}
                            autoComplete="new-password"
                            isSearchable={true}
                            styles={customStyles}
                            options={equityFundsData}
                            onChange={handleEquityFundSelection}
                            value={equityFundsData.find(
                              (v) => v.label === assetsDetails.user_asset_name
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
                    <div className="col-md-5">
                      <div
                        className="material"
                        style={{
                          paddingTop: "5px",
                        }}
                      >
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
                  }} className="row py-md-2 mt-3">
                    <div className="col-md-8">
                      <div className="d-flex">
                        <Form.Label className=" ">
                          Is The Equity One Time Or Recurring?*
                        </Form.Label>
                        <div className="d-flex ms-md-4">
                          <div>One Time</div>
                          <Switch
                            onChange={(v) => {
                              const occuranceValue = v ? "Recurring" : "One Time";
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_occurance: occuranceValue,
                                user_asset_avg_purchase_price: "",
                              }));

                              handleOnetimeButtonChange(!v);
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
                        <div className="col-md-5 mt-1">
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
                            className={`form-group 
                          ${assetsDetails.user_asset_sip_amount == 0
                                ? "inputData"
                                : assetsDetails.user_asset_sip_amount
                                  ? "inputData"
                                  : null
                              } 
                          `}
                            style={{ paddingTop: "15px" }}
                          >
                            <input
                              type="text"
                              id="user_asset_sip_amount_eq_4"
                              name="user_asset_sip_amount"
                              value={assetsDetails.user_asset_sip_amount}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_sip_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                });
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
                      }} className="row d-flex align-items-center py-md-2">
                        <div className="col-md-5 custom-input">
                          <div
                            className={`form-group ${assetsDetails.user_asset_investment_amount == 0
                              ? "inputData"
                              : assetsDetails.user_asset_investment_amount
                                ? "inputData"
                                : null
                              } `}
                          >
                            <input
                              type="text"
                              id="asset_name_eq_123"
                              name="asset_name"
                              value={assetsDetails.user_asset_investment_amount}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                });
                              }}
                              required
                              autoComplete="off"
                            />
                            <span class="highlight"></span>
                            <span class="bar"></span>
                            <label for="name">Total Invested Amount (₹)*</label>
                          </div>
                          {simpleValidator.current.message(
                            "Asset Invested Amount",
                            assetsDetails.user_asset_investment_amount,
                            "required|numeric|min:1,num",
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
                              type="number"
                              id="asset_name_e1_44"
                              name="asset_name"
                              value={assetsDetails.user_asset_quantity}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                                });
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
                        <div className="col-md-5">
                          <FloatingLabel
                            controlId="floatingInput"
                            label="Current Price (₹)*"
                            className="material"
                          >
                            <Form.Control
                              type="number"
                              placeholder="Current Price (₹)*"
                              className="shadow-none"
                              value={assetsDetails.user_asset_current_price}
                              readOnly
                            />
                          </FloatingLabel>

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
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_current_amount: e.target.value,
                                  });
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
                      <div style={{
                        pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                        opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                        cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                      }} className="row py-md-2 mt-3">
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
                              "SIP End Date*",
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
                                checked={assetsDetails.user_asset_valid_till == "Retirement"}
                                onClick={() => {
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_valid_till: "Retirement",
                                    user_asset_end_date: moment(retirementDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                                  });
                                }}
                                title="Upto Retirement Age"
                              />
                              <FintooRadio2
                                checked={assetsDetails.user_asset_valid_till == "Life Expectancy"}
                                onClick={() => {
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_valid_till: "Life Expectancy",
                                    user_asset_end_date: moment(lifeExpectancyDate, "DD/MM/YYYY").format("DD/MM/YYYY"),

                                  });
                                }}
                                title="Upto Life Expectancy Age"
                              />
                              <FintooRadio2
                                checked={assetsDetails.user_asset_valid_till == "Perpetual"}
                                onClick={() => {
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_valid_till: "Perpetual",
                                    user_asset_end_date: moment(
                                      "2099-12-31",
                                      "YYYY-MM-DD"
                                    ).format("DD/MM/YYYY"),
                                  });
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
                                  end date. Most fund houses assume such SIPs to
                                  continue till 2099 and it can be only linked
                                  to goals after 2099. Advice to select specific
                                  end date based on goals
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
                      }} className="row d-flex align-items-center py-md-2">
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
                            className={`form-group ${assetsDetails.user_asset_quantity ? "inputData" : null
                              } `}
                            style={{ paddingTop: "15px" }}
                          >
                            <input
                              type="Number"
                              id="user_asset_quantity_e1_444"
                              name="user_asset_quantity"
                              value={assetsDetails.user_asset_quantity}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                                });
                              }}
                              required
                              autoComplete="off"
                            />
                            <span class="highlight"></span>
                            <span class="bar"></span>
                            <label for="name">No. of Units*</label>
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
                      }} className="row d-flex align-items-center py-md-2">
                        <div className="col-md-5 custom-input">
                          <div
                            className={`form-group ${assetsDetails.user_asset_avg_purchase_price
                              ? "inputData"
                              : null
                              } `}
                          >
                            <input
                              type="Number"
                              id="user_asset_avg_purchase_price_234"
                              name="user_asset_avg_purchase_price"
                              value={assetsDetails.user_asset_avg_purchase_price}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                                });
                              }}
                              required
                              autoComplete="off"
                            />
                            <span class="highlight"></span>
                            <span class="bar"></span>
                            <label for="name">Avg Buy Price*</label>
                          </div>
                          {simpleValidator.current.message(
                            "Asset Current Price",
                            assetsDetails.user_asset_avg_purchase_price,
                            "required|min:1",
                            {
                              messages: {
                                required: "Please add avg. buy price",
                              },
                            }
                          )}
                        </div>

                        <div className="col-md-5 custom-input">
                          <div
                            className={`form-group ${assetsDetails.user_asset_investment_amount
                              ? "inputData"
                              : null
                              } `}
                          >
                            <span>
                              <input
                                type="text"
                                id="user_asset_investment_amount_334"
                                name="user_asset_investment_amount"
                                value={assetsDetails.user_asset_investment_amount}
                                onChange={(e) => {
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_investment_amount: e.target.value,
                                  });
                                }}
                                readOnly
                                required
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
                      }} className="row d-flex align-items-center py-md-2">
                        <div className="col-md-5 custom-input">
                          <div
                            className={`form-group ${assetsDetails.user_asset_current_price
                              ? "inputData"
                              : null
                              } `}
                          >
                            <input
                              type="Number"
                              id="user_asset_current_price_445"
                              name="user_asset_current_price"
                              value={assetsDetails.user_asset_current_price}
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
                            className={`form-group ${assetsDetails.user_asset_current_amount
                              ? "inputData"
                              : null
                              } `}
                          >
                            <span>
                              <input
                                type="text"
                                id="user_asset_current_amount_5555"
                                name="user_asset_current_amount"
                                value={assetsDetails.user_asset_current_amount}
                                onChange={(e) => {
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_current_amount: e.target.value,
                                  });
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
                                Auto Calculated by No Of Units and Current Price
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
                            goal of your choice. Otherwise, Fintoo will link it
                            automatically with your high priority goal. In case,
                            you do not wish to utilize this investment for any
                            goal, select "NO".
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
                                end date of the asset
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
                                  assetsDetails?.user_asset_end_date
                                }
                                isGoalFilter={
                                  assetsDetails.user_asset_occurance == "One Time"
                                    ? "One Time"
                                    : "Recurring"
                                }
                                isAssetRecurring={
                                  assetsDetails.user_asset_occurance == "One Time"
                                    ? "One Time"
                                    : "Recurring"
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
                                process.env.PUBLIC_URL + "/datagathering/goals"
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
                                onClick={(e) => handleEquitySubmit(e)}
                                className="default-btn gradient-btn save-btn"
                              >
                                Save & Add More
                              </button>
                            )}
                            {props.updateForm && (
                              <div>
                                <button
                                  onClick={(e) => handleEquityCancel(e)}
                                  className="default-btn gradient-btn save-btn"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={(e) => handleEquityUpdate(e)}
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
            {assetsDetails.asset_sub_name_uuid == 'equity_mf' &&
              selectedExtraOption == "Link your Holdings" && (
                <>
                  <LinkYourHoldingsDG
                    customStyles={customStyles}
                    session={session}
                  />
                </>
              )}
          </div>
        )}
      {props.assetEditId && assetsDetails.asset_sub_name_uuid == 'equity_mf' && (
        <div>
          <form noValidate="novalidate" name="goldassetform">
            <div style={{
              pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
              opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
              cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
            }} className="row py-md-2">
              <div className="col-md-5">
                <div className="material">
                  <Form.Label>
                    Start Typing To Search For Your Equity Mutual Funds*
                  </Form.Label>
                  {eqfunds && eqfunds.length > 0 && (
                    <Select
                      isDisabled={
                        (assetsDetails?.user_asset_source ?? "").toLowerCase() ==
                        "external"
                      }
                      classNamePrefix="sortSelect"
                      components={{ Input }}
                      autoComplete="new-password"
                      isSearchable={true}
                      styles={customStyles}
                      options={equityFundsData}
                      onChange={handleEquityFundSelection}
                      value={equityFundsData.filter(
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
              <div className="col-md-5">
                <div
                  className="material"
                  style={{
                    paddingTop: "5px",
                  }}
                >
                  <Form.Label>Who Is This Investment For*</Form.Label>
                  {familyData && (
                    <Select
                      isDisabled={
                        (assetsDetails?.user_asset_source ?? "").toLowerCase() ==
                        "external"
                      }
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

            <div style={{
              pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
              opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
              cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
            }} className="row py-md-2">
              <div className="col-md-8">
                <div className="d-flex">
                  <Form.Label className=" ">
                    Is The Equity One Time Or Recurring?*
                  </Form.Label>
                  <div className="d-flex ms-md-4">
                    <div>One Time</div>
                    <Switch
                      disabled={
                        (assetsDetails?.user_asset_source ?? "").toLowerCase() ==
                        "ecas"
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
                  <div className="col-md-5 custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_sip_amount ? "inputData" : null
                        }`}
                      style={{ paddingTop: " " }}
                    >
                      <input
                        type="text"
                        id="user_asset_sip_amount_9090"
                        name="user_asset_sip_amount"
                        maxLength={35}
                        readOnly={
                          (
                            assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        value={assetsDetails.user_asset_sip_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_sip_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          });
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
                <div className="row d-flex align-items-center py-md-2">
                  {/* <div className="col-md-5 custom-input">
                    <div
                      className={`form-group ${
                        assetsDetails.user_asset_avg_purchase_price == 0
                          ? "inputData"
                          : assetsDetails.user_asset_avg_purchase_price
                          ? "inputData"
                          : null
                      } `}
                    >
                      <input
                        type="text"
                        name="user_asset_avg_purchase_price"
                        maxLength={35}
                        readOnly={
                          (
                            assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        value={assetsDetails.user_asset_avg_purchase_price}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          });
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Name of Asset*</label>
                    </div>
                    {simpleValidator.current.message(
                      "Asset Purchase Amount",
                      assetsDetails.user_asset_avg_purchase_price,
                      "required",
                      { messages: { required: "Please add invested value" } }
                    )}
                  </div> */}
                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="col-md-5 custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_avg_purchase_price == 0
                        ? "inputData"
                        : assetsDetails.user_asset_avg_purchase_price
                          ? "inputData"
                          : null
                        } `}
                    >
                      <input
                        type="text"
                        id="user_asset_investment_amount"
                        name="user_asset_investment_amount"
                        value={assetsDetails.user_asset_investment_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          });
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Total Invested Amount (₹)*</label>
                    </div>
                    {simpleValidator.current.message(
                      "Asset Invested Amount",
                      assetsDetails.user_asset_investment_amount,
                      "required|numeric|min:1,num",
                      {
                        messages: {
                          required: "Please add invested amount",
                        },
                      }
                    )}
                  </div>
                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="col-md-5 custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_quantity ? "inputData" : null
                        } `}
                    >
                      <input
                        type="number"
                        id="user_asset_quantity_333"
                        name="user_asset_quantity"
                        value={assetsDetails.user_asset_quantity}
                        readOnly={
                          (
                            assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                          });
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
                }} className="row d-flex align-items-center py-md-2">
                  <div className="col-md-5 custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_current_price
                        ? "inputData"
                        : null
                        } `}
                    >
                      <input
                        type="Number"
                        id="user_asset_current_price_444"
                        name="user_asset_current_price"
                        value={assetsDetails.user_asset_current_price}
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
                      { messages: { required: "Please add current price" } }
                    )}
                  </div>
                  <div className="col-md-5  custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null
                        } `}
                    >
                      <span>
                        <input
                          type="text"
                          id="user_asset_current_amount_5553"
                          name="user_asset_current_amount"
                          value={assetsDetails.user_asset_current_amount}
                          onChange={(e) => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_current_amount: e.target.value,
                            });
                          }}
                          readOnly
                          required
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
                }} className="row py-md-2">
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
                          readOnly={
                            (
                              assetsDetails?.user_asset_source ?? ""
                            ).toLowerCase() == "external"
                          }
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
                        "SIP End Date*",
                        assetsDetails.user_asset_end_date,
                        "required",
                        { messages: { required: "Please add SIP end date " } }
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
                      <div className="d-flex pt-2" style={{ clear: "both" }}>
                        <FintooRadio2
                          readOnly={
                            (
                              assetsDetails?.user_asset_source ?? ""
                            ).toLowerCase() == "external"
                          }
                          checked={assetsDetails.user_asset_valid_till == "Retirement"}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_valid_till: "Retirement",
                              user_asset_end_date: moment(retirementDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                            });
                          }}
                          title="Upto Retirement Age"
                        />
                        <FintooRadio2
                          readOnly={
                            (
                              assetsDetails?.user_asset_source ?? ""
                            ).toLowerCase() == "external"
                          }
                          checked={assetsDetails.user_asset_valid_till == "Life Expectancy"}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_valid_till: "Life Expectancy",
                              user_asset_end_date: moment(lifeExpectancyDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                            });
                          }}
                          title="Upto Life Expectancy Age"
                        />
                        <FintooRadio2
                          readOnly={
                            (
                              assetsDetails?.user_asset_source ?? ""
                            ).toLowerCase() == "external"
                          }
                          checked={assetsDetails.user_asset_valid_till == "Perpetual"}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_valid_till: "Perpetual",
                              user_asset_end_date: moment(
                                "2099-12-31",
                                "YYYY-MM-DD"
                              ).format("DD/MM/YYYY"),
                            });
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
                            Perpetual SIPs refer to those with no tenure end
                            date. Most fund houses assume such SIPs to continue
                            till 2099 and it can be only linked to goals after
                            2099. Advice to select specific end date based on
                            goals
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
                }} className="row d-flex align-items-center py-md-2">
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
                      className={`form-group ${assetsDetails.user_asset_quantity ? "inputData" : null
                        } `}
                      style={{ paddingTop: "15px" }}
                    >
                      <input
                        type="number"
                        id="user_asset_quantity_4989"
                        name="user_asset_quantity"
                        maxLength={35}
                        readOnly={
                          (
                            assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        value={assetsDetails.user_asset_quantity}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                          });
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">No. of Units*</label>
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
                  <div className="col-md-5 ">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Avg. buy Price (₹)*"
                      className="material"
                    >
                      <Form.Control
                        disabled={
                          (
                            assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        placeholder="Avg. buy Price (₹)*"
                        className="shadow-none"
                        type="number"
                        value={assetsDetails.user_asset_avg_purchase_price}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                          });
                        }}
                      />
                    </FloatingLabel>

                    {simpleValidator.current.message(
                      "Asset Current Price",
                      assetsDetails.user_asset_avg_purchase_price,
                      "required",
                      { messages: { required: "Please add avg. buy price" } }
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
                        type="number"
                        value={assetsDetails.user_asset_investment_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value,
                          });
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

                <div style={{
                  pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                  opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                  cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                }} className="row py-md-2">
                  <div className="col-md-5 ">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Current Price (₹)*"
                      className="material"
                    >
                      <Form.Control
                        placeholder="Current Price (₹)*"
                        className="shadow-none"
                        type="number"
                        value={assetsDetails.user_asset_current_price}
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
                      label="Current Value (₹)*"
                      className="mb-3 material d-flex"
                    >
                      <Form.Control
                        placeholder="Current Value (₹)"
                        className="shadow-none"
                        value={assetsDetails.user_asset_current_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_current_amount: e.target.value,
                          });
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
                          user_asset_maturity_date={assetsDetails?.user_asset_end_date}
                          isGoalFilter={
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

                      {props.addForm && (
                        <button
                          onClick={(e) => handleEquitySubmit(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Save & Add More
                        </button>
                      )}
                      {props.updateForm && (
                        <div>
                          <button
                            onClick={(e) => handleEquityCancel(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleEquityUpdate(e)}
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
        </div>
      )}

      {(!props.assetEditId || props.assetEditId == "") &&
        assetsDetails.asset_sub_name_uuid == 'equity_shares' && (
          <div>
            {assetsDetails.asset_sub_name_uuid == 'equity_shares' && (
              <div className="">
                <div className={`${Styles.LineHR}`}></div>
                <div className="mt-4">
                  <div className={`${Styles.Assettitle}`}>
                    Fetch Your Stocks Holdings -{" "}
                    <span>
                      Import your Existing Stocks to get a better view of your
                      stocks investment
                    </span>
                  </div>
                </div>
                <div className="d-md-flex justify-content-center">
                  {/* <DgRoundedButton
                    active={selectedButton == "Upload Statement"}
                    onClick={() => {
                      setSelectedButton("Upload Statement");
                      setSelectedExtraOption("Upload Statement");
                      setSelectedSubOption_1("CDSL");
                    }}
                    title="Upload Statement"
                  /> */}

                  <DgRoundedButton
                    active={selectedButton == "Manual Entry"}
                    onClick={() => {
                      setSelectedButton("Manual Entry");
                      setSelectedExtraOption("Manual Entry");
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_name: " ",
                      });
                    }}
                    title="Manual Entry"
                  />
                  <DgRoundedButton
                    active={selectedButton == "Link your stocks holding"}
                    onClick={() => {
                      setSelectedButton("Link your stocks holding");
                      setSelectedExtraOption("Link your stocks holding");
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_name: " ",
                      });
                    }}
                    title="Link your stocks holding"
                  />
                </div>
              </div>
            )}
            {assetsDetails.asset_sub_name_uuid == 'equity_shares' &&
              selectedExtraOption == "Link your stocks holding" && (
                // <div>
                //   <Nsdlcsdl />
                //   {/* Link your Holdings Table */}
                //   <div>
                //   {/* <div className="inner-box">
                //       <div className="table-responsive">
                //         <table className="bgStyleTable uploadFileTable">
                //           <tbody>
                //             <tr>
                //               <th>Name</th>
                //               <th>Fetched From</th>
                //               <th>Type</th>
                //               <th>Connected On</th>
                //               <th>Updated On</th>
                //               <th className="text-center">Action</th>
                //             </tr>
                //             <tr>
                //               <td>Darrell Steward</td>
                //               <td>Groww</td>
                //               <td>Finvu/smallcase</td>
                //               <td>12/09/2023</td>
                //               <td>24/09/2023</td>
                //               <td>
                //               <div className="d-flex">
                //               <div>
                //                 <img
                //               onClick={() => {
                //                 setShowUANModal(true)
                //               }

                //               }
                //                   style={{ cursor: "pointer" }}
                //                   src={
                //                     process.env.REACT_APP_STATIC_URL +
                //                     "media/DG/Delete.svg"
                //                   }
                //                   alt="Delete"
                //                 />
                //               </div>
                //               <div className="ps-4">
                //                 <img
                //                   style={{ cursor: "pointer" }}
                //                   src={
                //                     process.env.REACT_APP_STATIC_URL +
                //                     "media/DG/Refresh.svg"
                //                   }
                //                   alt="Refresh"
                //                 />
                //               </div>
                //             </div>
                //               </td>
                //             </tr>
                //             </tbody>
                //             </table>
                //             </div>

                //             </div> */}
                //   </div>
                // </div>

                <>
                  <Nsdlcsdl />
                  <ConnectWithBroker
                    customStyles={customStyles}
                    session={session}
                    filteredHoldingsData={props.equityFilteredHoldings}
                    filterBroker={props.filterBroker}
                    handleFilterBroker={props.handleFilterBroker}
                  />
                </>
              )}
            {/* {(assetsDetails.asset_sub_name_uuid == 'equity_shares' &&
            selectedExtraOption == "Upload Statement") && (
              <div>
                {selectedSubOption_1 == "CDSL" && (
                  <form
                    encType="multipart/form-data"
                    method="post"
                    action="http://localhost/fileupload.php"
                  >
                    <FintooLoader isLoading={isLoading} />
                    <div className="col-md-10" value="CAMS">
                      <h4>CDSL</h4>
                      <p>
                        Consolidated account statement (CAS)
                        is a summary of your current stock
                        holdings available at CDSL or NSDL
                        depository. To download your CAS,
                        follow the steps mentioned below based
                        on your demat account depository. -
                        For CDSL :
                      </p>
                      <ol>
                        <li>
                          Login to{" "}
                          <a
                            target="_new"
                            style={{ color: "green" }}
                            href="https://www.cdslindia.com/CAS/LoginCAS.aspx"
                          >
                            <u>CDSL</u>
                          </a>{" "}
                          website.
                        </li>
                        <li>
                          Provide your PAN, date of birth and
                          BO ID to log in.
                        </li>
                        <li>
                          Download the latest available CAS by
                          selecting the latest date range.
                        </li>
                      </ol>
                      <div className="col-md-12">
                        <p>
                          <b>Note</b>: CDSL PDF can be
                          uploaded one time a day ( Per PAN )
                        </p>
                        <p style={{
                          color: "red"
                        }}>
                          In the Equity share, the Purchase
                          Price will be the same as the
                          Current Price because in CDSL Report
                          they do not mention Purchase price.
                          If you know the Purchase price you
                          can Edit it &amp; you can change it
                          after uploading.
                        </p>
                      </div>
                    </div>
                    <div>
                      <DgDragDrop2 className="iconupload" value={dropFiles} onFilesSelected={handleFilesSelected} />
                      {simpleValidator.current.message('Password', dropFiles, 'required', { messages: { required: 'Please select atleast one document to upload' } })}
                    </div>
                    <div className="col-md-12">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Password*"
                        className="material"
                      >
                        <Form.Control type="password" placeholder="Password*"
                          value={docPassword}
                          onChange={(e) => {
                            setDocPassword(e.target.value)
                          }}
                        />
                        {simpleValidator.current.message('Password', docPassword, 'required', { messages: { required: 'Please enter the password' } })}
                      </FloatingLabel>
                    </div>
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
                                  onClick={() =>
                                    setTab("tab1")
                                  }
                                >
                                  <FaArrowLeft />
                                  <span className="hover-text">
                                    &nbsp;Previous
                                  </span>
                                </div>
                              </Link>

                              {props.addForm && (
                                <button
                                  onClick={(e) =>
                                    handleUploadSubmit(e)
                                  }
                                  className="default-btn gradient-btn save-btn"
                                >
                                  Save & Add More
                                </button>
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
                  </form>
                )}
                {selectedSubOption_1 == "NSDL" && (
                  <form
                    encType="multipart/form-data"
                    method="post"
                    action="http://localhost/fileupload.php"
                  >
                    <FintooLoader isLoading={isLoading} />
                    <div className="col-md-10" value="CAMS">
                      <h4>NDSL</h4>
                      <p >
                        Consolidated account statement (CAS)
                        is a summary of your current stock
                        holdings available at CDSL or NSDL
                        depository. To download your CAS,
                        follow the steps mentioned below based
                        on your demat account depository. -
                        For NSDL :
                      </p>
                      <ol>
                        <li>
                          Login to{" "}
                          <a
                            target="_new"
                            style={{ color: "green" }}
                            href="https://eservices.nsdl.com/"
                          >
                            <u>NDSL</u>
                          </a>{" "}
                          website.
                        </li>
                        <li>
                          Register using your DP ID, Client ID
                          and registered mobile number.
                        </li>
                        <li>
                          Authenticate using the OTP received
                          on mobile.
                        </li>
                        <li>
                          Set your login credentials and login
                          to download CAS.
                        </li>
                      </ol>
                      <div className="col-md-12">
                        <p>
                          <b>Note</b>: NSDL PDF can be
                          uploaded one time a day ( Per PAN )
                        </p>
                        <p style={{
                          color: "red"
                        }}>
                          In the Equity share, the Purchase
                          Price will be the same as the
                          Current Price because in NSDL Report
                          they do not mention Purchase price.
                          If you know the Purchase price you
                          can Edit it & you can change it
                          after uploading.
                        </p>
                      </div>
                    </div>
                    <div>
                      <DgDragDrop2 className="iconupload" value={dropFiles} onFilesSelected={handleFilesSelected} />
                      {simpleValidator.current.message('Password', dropFiles, 'required', { messages: { required: 'Please select atleast one document to upload' } })}
                    </div>
                    <div className="col-md-12">
                      <FloatingLabel
                        controlId="floatingInput"
                        label="Password*"
                        className="material"
                      >
                        <Form.Control type="password" placeholder="Password*"
                          value={docPassword}
                          onChange={(e) => {
                            setDocPassword(e.target.value)
                          }}
                        />
                        {simpleValidator.current.message('Password', dropFiles, 'required', { messages: { required: 'Please enter the password' } })}
                      </FloatingLabel>
                    </div>
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
                                  onClick={() =>
                                    setTab("tab1")
                                  }
                                >
                                  <FaArrowLeft />
                                  <span className="hover-text">
                                    &nbsp;Previous
                                  </span>
                                </div>
                              </Link>

                              {props.addForm && (
                                <button
                                  onClick={(e) =>
                                    handleUploadSubmit(e)
                                  }
                                  className="default-btn gradient-btn save-btn"
                                >
                                  Save & Add More
                                </button>
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
                  </form>
                )}
              </div>
            )} */}

            {assetsDetails.asset_sub_name_uuid == 'equity_shares' &&
              selectedExtraOption == "Upload Statement" && (
                <ul className="card-list ">
                  {upload_options.map((v, i) => (
                    <React.Fragment key={i}>
                      <li
                        onClick={() => {
                          setSelectedSubOption_1(v.title);
                        }}
                        className={`li-options ${selectedSubOption_1 == v.title ? "active" : ""
                          }`}
                      >
                        <label title={v.title}>
                          <img src={v.img} />
                          <span>{v.title}</span>
                        </label>
                      </li>
                    </React.Fragment>
                  ))}
                </ul>
              )}

            {assetsDetails.asset_sub_name_uuid == 'equity_shares' &&
              selectedExtraOption == "Upload Statement" &&
              selectedSubOption_1 == "CDSL" && (
                <form
                  encType="multipart/form-data"
                  method="post"
                  action="http://localhost/fileupload.php"
                >
                  <FintooLoader isLoading={isLoading} />
                  <div className="col-md-10" value="CAMS">
                    <h4>CDSL</h4>
                    <p>
                      Consolidated account statement (CAS) is a summary of your
                      current stock holdings available at CDSL or NSDL
                      depository. To download your CAS, follow the steps
                      mentioned below based on your demat account depository. -
                      For CDSL :
                    </p>
                    <ol>
                      <li>
                        Login to{" "}
                        <a
                          target="_new"
                          className="custom_link"
                          href="https://www.cdslindia.com/CAS/LoginCAS.aspx"
                        >
                          <u>CDSL</u>
                        </a>{" "}
                        website.
                      </li>
                      <li>
                        Provide your PAN, date of birth and BO ID to log in.
                      </li>
                      <li>
                        Download the latest available CAS by selecting the
                        latest date range.
                      </li>
                    </ol>
                    <div className="col-md-12">
                      <p>
                        <b>Note</b>: CDSL PDF can be uploaded one time a day (
                        Per PAN )
                      </p>
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        In the Equity share, the Purchase Price will be the same
                        as the Current Price because in CDSL Report they do not
                        mention Purchase price. If you know the Purchase price
                        you can Edit it &amp; you can change it after uploading.
                      </p>
                    </div>
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
                        id="Password_5"
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
                                process.env.PUBLIC_URL + "/datagathering/goals"
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

            {assetsDetails.asset_sub_name_uuid == 'equity_shares' &&
              selectedExtraOption == "Upload Statement" &&
              selectedSubOption_1 == "NSDL" && (
                <form
                  encType="multipart/form-data"
                  method="post"
                  action="http://localhost/fileupload.php"
                >
                  <FintooLoader isLoading={isLoading} />
                  <div className="col-md-10" value="CAMS">
                    <h4>NDSL</h4>
                    <p>
                      Consolidated account statement (CAS) is a summary of your
                      current stock holdings available at CDSL or NSDL
                      depository. To download your CAS, follow the steps
                      mentioned below based on your demat account depository. -
                      For NSDL :
                    </p>
                    <ol>
                      <li>
                        Login to{" "}
                        <a
                          target="_new"
                          className="custom_link"
                          href="https://eservices.nsdl.com/"
                        >
                          <u>NDSL</u>
                        </a>{" "}
                        website.
                      </li>
                      <li>
                        Register using your DP ID, Client ID and registered
                        mobile number.
                      </li>
                      <li>Authenticate using the OTP received on mobile.</li>
                      <li>
                        Set your login credentials and login to download CAS.
                      </li>
                    </ol>
                    <div className="col-md-12">
                      <p>
                        <b>Note</b>: NSDL PDF can be uploaded one time a day (
                        Per PAN )
                      </p>
                      <p
                        style={{
                          color: "red",
                        }}
                      >
                        In the Equity share, the Purchase Price will be the same
                        as the Current Price because in NSDL Report they do not
                        mention Purchase price. If you know the Purchase price
                        you can Edit it & you can change it after uploading.
                      </p>
                    </div>
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
                        id="Password_9"
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
                                process.env.PUBLIC_URL + "/datagathering/goals"
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

            {assetsDetails.asset_sub_name_uuid == 'equity_shares' &&
              selectedExtraOption == "Manual Entry" && (
                <form noValidate="novalidate" name="goldassetform">
                  <div style={{
                    pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                    opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                    cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                  }} className="row d-flex align-items-center py-md-2">
                    <div className="col-md-5">
                      <div className="material">
                        <Form.Label>
                          Start Typing To Search For Your Equity Shares*
                        </Form.Label>
                        {props.equityShares.data &&
                          props.equityShares.data.length > 0 && (
                            <Select
                              classNamePrefix="sortSelect"
                              components={{ Input }}
                              autoComplete="new-password"
                              isSearchable={true}
                              styles={customStyles}
                              options={equitySharesData}
                              onChange={handleEquityShareSelection}
                              value={equitySharesData.find(
                                (v) => v.label === assetsDetails.user_asset_name
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
                    <div className="col-md-5">
                      <div
                        className="material"
                        style={{
                          paddingTop: "5px",
                        }}
                      >
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
                  }} className="row py-md-2 mt-3">
                    <div className="col-md-8">
                      <div className="d-flex">
                        <Form.Label className="">Is The Equity One Time Or Recurring?*</Form.Label>
                        <div className="d-flex ms-md-4">
                          <div>One Time</div>
                          <Switch
                            onChange={(v) => {
                              const occuranceValue = v ? "Recurring" : "One Time";
                              setAssetsDetails((prev) => ({
                                ...prev,
                                user_asset_occurance: occuranceValue,
                                user_asset_avg_purchase_price: "",
                              }));

                              handleOnetimeButtonChange(!v);
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

                  {
                    //console.log("assetsDetails.user_asset_occurance", assetsDetails.user_asset_occurance)
                  }


                  {assetsDetails.user_asset_occurance == "Recurring" && (
                    <>
                      <div style={{
                        pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                        opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                        cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                      }} className="row py-md-2">
                        <div className="col-md-5 mt-1">
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
                          >
                            <input
                              type="text"
                              id="user_asset_sip_amount_555"
                              name="user_asset_sip_amount"
                              value={assetsDetails.user_asset_sip_amount}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_sip_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                });
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
                      }} className="row d-flex align-items-center py-md-2">
                        <div className="col-md-5 custom-input">
                          <div
                            className={`form-group ${assetsDetails.user_asset_investment_amount == 0
                              ? "inputData"
                              : assetsDetails.user_asset_investment_amount
                                ? "inputData"
                                : null
                              } `}
                          >
                            <input
                              type="text"
                              id="user_asset_investment_amount"
                              name="user_asset_investment_amount"
                              value={assetsDetails.user_asset_investment_amount}
                              onChange={(e) => {

                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                });
                              }}
                              required
                              autoComplete="off"
                            />
                            <span class="highlight"></span>
                            <span class="bar"></span>
                            <label for="name">Total Invested Amount (₹)*</label>
                          </div>
                          {simpleValidator.current.message(
                            "Asset Invested Amount",
                            assetsDetails.user_asset_investment_amount,
                            "required|numeric|min:1,num",
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
                              type="number"
                              id="user_asset_quantity_9090"
                              name="user_asset_quantity"
                              value={assetsDetails.user_asset_quantity}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                                });
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
                      }} className="row d-flex align-items-center py-md-2">
                        <div className="col-md-5 custom-input">
                          <div
                            className={`form-group ${assetsDetails.user_asset_current_price
                              ? "inputData"
                              : null
                              } `}
                          >
                            <input
                              type="Number"
                              id="user_asset_quantity_7877"
                              name="user_asset_quantity"
                              value={assetsDetails.user_asset_current_price}
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
                            className={`form-group ${assetsDetails.user_asset_current_amount
                              ? "inputData"
                              : null
                              } `}
                          >
                            <span>
                              <input
                                type="text"
                                id="user_asset_current_amount_4532"
                                name="user_asset_current_amount"
                                value={assetsDetails.user_asset_current_amount}
                                onChange={(e) => {
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_current_amount: e.target.value,
                                  });
                                }}
                                readOnly
                                autoComplete="off"
                              />
                              <span class="highlight"></span>
                              <span class="bar"></span>
                              <label for="name">Current value ss (₹)</label>
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
                      }} className="row py-md-2 mt-1">
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
                              "SIP End Date*",
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
                                checked={assetsDetails.user_asset_valid_till == "Retirement"}
                                onClick={() => {
                                  setAssetsDetails((prev) => ({
                                    ...prev,
                                    user_asset_valid_till: "Retirement",
                                    user_asset_end_date: moment(retirementDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                                  }));
                                  // setAssetsDetails({
                                  //   ...assetsDetails,
                                  //   user_asset_valid_till: "3",
                                  //   user_asset_end_date: moment(retirementDate)
                                  //     .add(retirementDate, "y")
                                  //     .format("DD/MM/YYYY"),
                                  // });
                                }}
                                title="Upto Retirement Age"
                              />
                              <FintooRadio2
                                checked={assetsDetails.user_asset_valid_till == "Life Expectancy"}
                                onClick={() => {
                                  setAssetsDetails((prev) => ({
                                    ...prev,
                                    user_asset_valid_till: "Life Expectancy",
                                    user_asset_end_date: moment(lifeExpectancyDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
                                  }))
                                }}
                                title="Upto Life Expectancy Age"
                              />
                              <FintooRadio2
                                checked={assetsDetails.user_asset_valid_till == "Perpetual"}
                                onClick={() => {
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_valid_till: "Perpetual",
                                    user_asset_end_date: moment(
                                      "2099-12-31",
                                      "YYYY-MM-DD"
                                    ).format("DD/MM/YYYY"),
                                  });
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
                                  end date. Most fund houses assume such SIPs to
                                  continue till 2099 and it can be only linked
                                  to goals after 2099. Advice to select specific
                                  end date based on goals
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
                      }} className="row d-flex align-items-center">
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
                            className={`form-group ${assetsDetails.user_asset_quantity ? "inputData" : null
                              } `}
                            style={{ paddingTop: "15px" }}
                          >
                            <input
                              type="number"
                              id="user_asset_quantity_890"
                              name="user_asset_quantity"
                              value={assetsDetails.user_asset_quantity}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                                });
                              }}
                              required
                              autoComplete="off"
                            />
                            <span class="highlight"></span>
                            <span class="bar"></span>
                            <label for="name">No. of Units*</label>
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
                      }} className="row d-flex align-items-center">
                        <div className="col-md-5 custom-input">
                          <div
                            className={`form-group ${assetsDetails.user_asset_avg_purchase_price
                              ? "inputData"
                              : null
                              } `}
                            style={{ paddingTop: "15px" }}
                          >
                            <input
                              type="Number"
                              id="user_asset_avg_purchase_price_99909"
                              name="user_asset_avg_purchase_price"
                              value={assetsDetails.user_asset_avg_purchase_price}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                                });
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
                            "required",
                            {
                              messages: {
                                required: "Please add avg. buy price",
                              },
                            }
                          )}
                        </div>

                        <div className="col-md-5 custom-input">
                          <div
                            className={`form-group ${assetsDetails.user_asset_investment_amount
                              ? "inputData"
                              : null
                              } `}
                            style={{ paddingTop: "15px" }}
                          >
                            <input
                              type="text"
                              id="user_asset_avg_purchase_price_9090"
                              name="user_asset_avg_purchase_price"
                              value={assetsDetails.user_asset_investment_amount}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_investment_amount: e.target.value,
                                });
                              }}
                              readOnly
                              required
                              autoComplete="off"
                            />
                            <span class="highlight"></span>
                            <span class="bar"></span>
                            <label for="name">Invested Amount (₹)</label>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                        opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                        cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                      }} className="row d-flex align-items-center ">
                        <div className="col-md-5 custom-input">
                          <div
                            className={`form-group ${assetsDetails.user_asset_current_price
                              ? "inputData"
                              : null
                              } `}
                            style={{ paddingTop: "15px" }}
                          >
                            <input
                              type="Number"
                              id="user_asset_avg_purchase_price_88778"
                              name="user_asset_avg_purchase_price"
                              value={assetsDetails.user_asset_current_price}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                });
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
                            className={`form-group ${assetsDetails.user_asset_current_amount
                              ? "inputData"
                              : null
                              } `}
                            style={{ paddingTop: "15px" }}
                          >
                            <span>
                              <input
                                type="text"
                                id="user_asset_investment_amount_88893"
                                name="user_asset_investment_amount"
                                value={assetsDetails.user_asset_current_amount}
                                onChange={(e) => {
                                  setAssetsDetails({
                                    ...assetsDetails,
                                    user_asset_current_amount: e.target.value,
                                  });
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
                                Auto Calculated by No Of Units and Current Price
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
                            goal of your choice. Otherwise, Fintoo will link it
                            automatically with your high priority goal. In case,
                            you do not wish to utilize this investment for any
                            goal, select "NO".
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
                                You can only assign goals which are prior to the
                                end date of the asset
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
                                  assetsDetails?.user_asset_end_date
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
                                process.env.PUBLIC_URL + "/datagathering/goals"
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
                                onClick={(e) => handleEquitySubmit(e)}
                                className="default-btn gradient-btn save-btn"
                              >
                                Save & Add More
                              </button>
                            )}
                            {props.updateForm && (
                              <div>
                                <button
                                  onClick={(e) => handleEquityCancel(e)}
                                  className="default-btn gradient-btn save-btn"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={(e) => handleEquityUpdate(e)}
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
            {assetsDetails.asset_sub_name_uuid == 'equity_shares' &&
              selectedExtraOption == "Connect with broker" && (
                <>
                  <ConnectWithBroker
                    customStyles={customStyles}
                    session={session}
                  />
                </>
              )}
          </div>
        )}
      {props.assetEditId && assetsDetails.asset_sub_name_uuid == 'equity_shares' && (
        <div>
          <form noValidate="novalidate" name="goldassetform">
            <div className="row d-flex align-items-center py-md-2">
              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="col-md-5">
                <div className="material">
                  <Form.Label>
                    Start Typing To Search For Your Equity Shares*
                  </Form.Label>
                  {props.equityShares.data &&
                    props.equityShares.data.length > 0 && (
                      <Select
                        isDisabled={
                          (
                            props?.assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        classNamePrefix="sortSelect"
                        components={{ Input }}
                        autoComplete="new-password"
                        isSearchable={true}
                        styles={customStyles}
                        options={equitySharesData}
                        onChange={handleEquityShareSelection}
                        value={equitySharesData.filter(
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
              <div style={{
                pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
              }} className="col-md-5">
                <div
                  className="material"
                  style={{
                    paddingTop: "5px",
                  }}
                >
                  <Form.Label>Who Is This Investment For*</Form.Label>
                  {familyData && (
                    <Select
                      isDisabled={
                        (
                          props?.assetsDetails?.user_asset_source ?? ""
                        ).toLowerCase() == "external"
                      }
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

            <div style={{
              pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
              opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
              cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
            }} className="row py-md-2">
              <div className="col-md-8">
                <div className="d-flex">
                  <Form.Label className=" ">
                    Is The Equity One Time Or Recurring?*
                  </Form.Label>
                  <div className="d-flex ms-md-4">
                    <div>One Time</div>
                    <Switch
                      onChange={(v) => {
                        const occuranceValue = v ? "Recurring" : "One Time"; //
                        setAssetsDetails((prev) => ({
                          ...prev,
                          user_asset_occurance: occuranceValue,
                          user_asset_avg_purchase_price: "",
                        }));
                      }}
                      disabled={
                        (
                          props?.assetsDetails?.user_asset_source ?? ""
                        ).toLowerCase() == "external"
                      }
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
                        id="user_asset_investment_amount_8992"
                        name="user_asset_investment_amount"
                        value={assetsDetails.user_asset_sip_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_sip_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          });
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
                }} className="row d-flex align-items-center py-md-2">
                  <div className="col-md-5 custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_investment_amount == 0
                        ? "inputData"
                        : assetsDetails.user_asset_investment_amount
                          ? "inputData"
                          : null
                        } `}
                      style={{ paddingTop: "15px" }}
                    >

                      <input
                        type="text"
                        id="user_asset_investment_amount_9834"
                        name="user_asset_investment_amount"
                        value={assetsDetails.user_asset_investment_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          });
                        }}
                        required
                        autoComplete="off"
                      />
                      <span class="highlight"></span>
                      <span class="bar"></span>
                      <label for="name">Total Invested Amount (₹)*</label>
                    </div>
                    {simpleValidator.current.message(
                      "Asset Invested Amount",
                      assetsDetails.user_asset_investment_amount,
                      "required|numeric|min:1,num",
                      { messages: { required: "Please add invested amount" } }
                    )}
                  </div>
                  <div className="col-md-5 custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_quantity ? "inputData" : null
                        } `}
                      style={{ paddingTop: "15px" }}
                    >
                      <input
                        type="number"
                        id="user_asset_quantity_4442"
                        name="user_asset_quantity"
                        value={assetsDetails.user_asset_quantity}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                          });
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
                  <div className="col-md-5">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Current Price (₹)*"
                      className="material"
                    >
                      <Form.Control
                        type="number"
                        placeholder="Current Price (₹)*"
                        className="shadow-none"
                        value={assetsDetails.user_asset_current_price}
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
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_current_amount: e.target.value,
                            });
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
                <div style={{
                  pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                  opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                  cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                }} className="row py-md-2">
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
                        "SIP End Date*",
                        assetsDetails.user_asset_end_date,
                        "required",
                        { messages: { required: "Please add SIP end date " } }
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
                      <div className="d-flex pt-2" style={{ clear: "both" }}>
                        <FintooRadio2
                          checked={assetsDetails.user_asset_valid_till == "Retirement"}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_valid_till: "Retirement",
                              user_asset_end_date: moment(retirementDate, "DD/MM/YYYY").format("DD/MM/YYYY"),

                            });
                          }}
                          title="Upto Retirement Age"
                        />
                        <FintooRadio2
                          checked={assetsDetails.user_asset_valid_till == "Life Expectancy"}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_valid_till: "Life Expectancy",
                              user_asset_end_date: moment(lifeExpectancyDate, "DD/MM/YYYY").format("DD/MM/YYYY"),

                            });
                          }}
                          title="Upto Life Expectancy Age"
                        />
                        <FintooRadio2
                          checked={assetsDetails.user_asset_valid_till == "Perpetual"}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_valid_till: "Perpetual",
                              user_asset_end_date: moment(
                                "2099-12-31",
                                "YYYY-MM-DD"
                              ).format("DD/MM/YYYY"),
                            });
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
                            Perpetual SIPs refer to those with no tenure end
                            date. Most fund houses assume such SIPs to continue
                            till 2099 and it can be only linked to goals after
                            2099. Advice to select specific end date based on
                            goals
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
                }} className="row py-md-2">
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

                  <div className="col-md-5 ">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="No. of Units*"
                      className="material"
                    >
                      <Form.Control
                        disabled={
                          (
                            props?.assetsDetails?.user_asset_source ?? ""
                          ).toLowerCase() == "external"
                        }
                        placeholder="No. of Units*"
                        className="shadow-none"
                        type="number"
                        value={assetsDetails.user_asset_quantity}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                          });
                        }}
                      />
                    </FloatingLabel>

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
                  <div className="col-md-5 ">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Avg. buy Price (₹)*"
                      className="material"
                    >
                      <Form.Control
                        placeholder="Avg. buy Price (₹)*"
                        className="shadow-none"
                        type="number"
                        value={assetsDetails.user_asset_avg_purchase_price}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                          });
                        }}
                      />
                    </FloatingLabel>

                    {simpleValidator.current.message(
                      "Asset Current Price",
                      assetsDetails.user_asset_avg_purchase_price,
                      "required",
                      { messages: { required: "Please add avg. buy price" } }
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
                        type="number"
                        value={assetsDetails.user_asset_investment_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value,
                          });
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

                <div style={{
                  pointerEvents: assetsDetails.user_asset_source == "External" ? "none" : "auto",
                  opacity: assetsDetails.user_asset_source == "External" ? 0.5 : 1,
                  cursor: assetsDetails.user_asset_source == "External" ? "not-allowed" : "pointer",
                }} className="row py-md-2">
                  <div className="col-md-5 ">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Current Price (₹)*"
                      className="material"
                    >
                      <Form.Control
                        placeholder="Current Price (₹)*"
                        className="shadow-none"
                        type="number"
                        value={assetsDetails.user_asset_current_price}
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
                      label="Current Value (₹)*"
                      className="mb-3 material d-flex"
                    >
                      <Form.Control
                        placeholder="Current Value (₹)"
                        className="shadow-none"
                        value={assetsDetails.user_asset_current_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_current_amount: e.target.value,
                          });
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
                          user_asset_maturity_date={assetsDetails?.user_asset_end_date}
                          isGoalFilter={
                            assetsDetails.user_asset_occurance == "One Time" ? "One Time" : "Recurring"
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

                      {props.addForm && (
                        <button
                          onClick={(e) => handleEquitySubmit(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Save & Add More
                        </button>
                      )}
                      {props.updateForm && (
                        <div>
                          <button
                            onClick={(e) => handleEquityCancel(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleEquityUpdate(e)}
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
        </div>
      )}
      <Modal
        classNames={{
          modal: "RefreshModalpopup",
        }}
        show={showUANModal}
        showCloseIcon={false}
        onClose={() => () => { }}
        centered
        animationDuration={0}
      >
        <div className="" style={{ padding: "0 !important" }}>
          <div className="">
            <div className="RefreshModalpopup_Heading col-11 d-flex justify-content-center">
              <span>Kindly Confirm</span>
            </div>
            <div className={`${Styles.modalBody}`}>
              <div className={`text-center ${Styles.modalText}`}>
                Are you sure you want to unlink your fetched equities
              </div>
              <div className={`text-center ${Styles.modalnoteText}`}>
                Note: Once unlinked you wont be updated on your investment
              </div>
              <div className="ButtonBx d-flex justify-content-center">
                <button
                  className="Cancel"
                  onClick={() => {
                    setShowUANModal(false);
                  }}
                >
                  Cancel
                </button>
                <button className="Unlink">Unlink</button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* {assetsDetails.asset_sub_category_id == 125 && (
        <>
          <form noValidate="novalidate" name="goldassetform">
            <div className="row d-flex align-items-center">
              <div className="col-md-5 custom-input">
                <div className={`form-group w-100 ${assetsDetails.user_asset_name ? "inputData" : null}`} style={{ paddingTop: "17px" }}>
                  <input type="text" name="asset_name"
                    maxLength={35}
                    id="asset_name_6764"
                    className="shadow-none"
                    value={"Equity"}
                    disabled="disabled"
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_name: e.target.value,
                      });
                    }}
                    autoComplete="off" />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Asset Class</label>
                </div>
              </div>
              <div className="col-md-5">
                <div className="material" style={{ marginTop: assetsDetails.asset_sub_category_id == "commodity_others" ? "0px" : "0" }}>
                  <Form.Label>Select Subclass *</Form.Label>
                  {props.filteredAssetsData.select_subclass && (
                    
                    <input
                      name="user_asset_investment_amount"
                      id="user_asset_investment_amount_89893"
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
                  )}
                </div>
              </div>
            </div>
            <div className="row d-flex align-items-center py-md-2">
              <div className="col-md-5">
                <div className="material">
                  <Form.Label> Investment From *</Form.Label>
                  <input
                    name="user_asset_investment_amount"
                    id="user_asset_investment_amount_33321"
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
                  
                </div>
              </div>
              <div className="col-md-5 custom-input">
                <div
                  className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    id="user_asset_investment_amount_4452"
                    name="user_asset_investment_amount"
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
                    name="user_asset_investment_amount"
                    id="user_asset_investment_amount_43223"
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
                    id="user_asset_investment_amount_9090998"
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
                    name="user_asset_investment_amount"
                    id="user_asset_investment_amount_2344"
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
                    name="user_asset_investment_amount"
                    id="user_asset_investment_amount_778737"
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
                        <div className="d-flex" style={{ textAlign: "left!important" }}>
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
                          user_asset_maturity_date={assetsDetails?.user_asset_end_date}
                          type={"Asset"}
                          assetEditId={assetEditId}
                          isGoalFilter={assetsDetails.user_asset_occurance == 'One Time' ? "One Time" : "Recurring"}
                          isAssetRecurring={assetsDetails.user_asset_occurance == 'One Time' ? "One Time" : "Recurring"}
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
                          onClick={(e) => handleEquitySubmit(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Save & Add More
                        </button>
                      )}
                      {props.updateForm && (
                        <div>
                          <button
                            onClick={(e) => handleEquityCancel(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleEquityUpdate(e)}
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
      )} */}
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
}

export default AssetEquity;
