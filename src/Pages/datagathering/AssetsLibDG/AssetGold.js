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
import { apiCall } from "../../../common_utilities";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SimpleReactValidator from "simple-react-validator";
import { Modal } from "react-bootstrap";
import LinkYourHoldingsDG from "./LinkYourHoldingsDG";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useDispatch } from "react-redux";
import GoalsDropdown from "../../../components/GoalsDropdown/GoalDropdown";
import customStyles from "../../../components/CustomStyles";
import commonEncode from "../../../commonEncode";
import FintooLoader from "../../../components/FintooLoader";
import { ADVISORY_MULTIPLE_ASSETS_LINKAGE_API, imagePath } from "../../../constants";
import { ScrollToTop } from "../ScrollToTop"
import { Buffer } from "buffer";
import Uniquepannotfoundmodal from "./Uniquepannotfoundmodal";

function AssetGold(props) {

  const [showuniqueUANModal, setShowuniqueUANModal] = useState(false);
  const [pannumbers, setPanNumbers] = useState([]);
  const [familyecas, setFamilyEcas] = useState([]);
  const [memberdataid, setMemberDataId] = useState({})
  const setAssetsDetails = props.setAssetsDetails;
  const assetsDetails = props.assetsDetails;
  const familyData = props.familyData;
  const goalData = props.goalData;
  const setDate = props.setDate;
  const goldfunds = props.goldfunds;
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
  const assetEditId = props.assetEditId;
  const [retirementDate, setRetirementDate] = useState("");
  const [lifeExpectancyDate, setLifeExpectancyDate] = useState("");
  const [familySortedData, setFamilySortedData] = useState([]);
  const [multipleTotalInvestedValue, setMultipleTotalInvestedValue] = useState(0);
  const [multipleTotalCurrentValue, setMultipleTotalCurrentValue] = useState(0);
  const [multipleTotalAssetValueLinked, setMultipleTotalAssetValueLinked] = useState(0);
  const [multipleTotalAssetValueForLinkages, setMultipleTotalAssetValueForLinkages] = useState(0);
  const [multipleTotalRecurringInvestment, setMultipleTotalRecurringInvestment] = useState(0);
  const data = props.filteredAssetsData.select_subclass
  const [subClass, setSubClass] = useState("");
  const [investmentFrom, setInvestmentFrom] = useState("");
  const [selfData, setSelfData] = useState({});

  const [selectedButton, setSelectedButton] = useState("Manual Entry");
  const [selectedExtraOption, setSelectedExtraOption] = useState("Manual Entry");

  // useEffect(() => {
  //   if (assetsDetails.asset_name === "Gold ETF/MF") {
  //     setSelectedButton("Manual Entry");
  //     setSelectedExtraOption("Manual Entry");
  //   }
  // }, [assetsDetails.asset_name]);
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

  const dynamicLabelsToRemove = ['Others', 'Gold ETF', 'Sovereign Gold Bonds', 'Gold Mutual Fund', 'Physical Gold'];
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
  //         if (_records[i].value == 23 &&_records[i].asset_recurring == '1' || _records[i].asset_recurring == "One Time") {
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

  const simpleValidator = useRef(new SimpleReactValidator());
  const [, setForceUpdate] = useState(0);
  const dispatch = useDispatch();

  const goldfundsData = goldfunds.map((index, value) => {
    return {
      label: index.fund_name,
      value: index.current_nav,
      data: index,
    };
  });


  const handleGoldFundSelection = (selectedOption) => {
    setAssetsDetails((prev) => ({
      ...prev,
      user_asset_name: selectedOption.label,
      user_asset_current_price: parseFloat(selectedOption.value).toFixed(2),
      scheme_equity: selectedOption.data,
    }));
    // setAssetsDetails({
    //   ...assetsDetails,
    //   user_asset_name: selectedOption.label, // Set the asset_name using the selected fund name
    //   user_asset_current_price: parseFloat(selectedOption.value).toFixed(2),
    // });
  };

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

    if (assetsDetails.asset_sub_category_id == 23 && selectedExtraOption == "Manual Entry" && assetsDetails.user_asset_occurance == "Recurring") {
      if (assetsDetails.user_asset_valid_till == "Retirement") {
        setAssetsDetails({
          ...assetsDetails,
          // user_asset_valid_till: "3",
          user_asset_end_date: moment(retirement_date).format("DD/MM/YYYY"),
          user_asset_for: member.value,
        });
      } else if (assetsDetails.user_asset_valid_till == "Life Expectancy") {
        setAssetsDetails({
          ...assetsDetails,
          user_asset_end_date: moment(life_expectancy_date).format("DD/MM/YYYY"),
          user_asset_for: member.value,
        });
      }
    } else {

      setAssetsDetails({
        ...assetsDetails,
        user_asset_for: member.value,
      })
    }

  }


  const Input = (props) => {
    const { autoComplete = props.autoComplete } = props.selectProps;
    return <components.Input {...props} autoComplete={autoComplete} />;
  };

  const handleGoldSubmit = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      addAssetsSubmit(e);
      setGoalSelected(false);
      setSelectedGoals(false);
      setSelectedGoalsId(false);
      setSelectedPriorityArray([]);
      setAutoMatedGoal(true);
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
    }
  };

  const handleGoldUpdate = async (e) => {
    e.preventDefault();
    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
      updateAssetsSubmit(e);
      setGoalSelected(false);
      setSelectedGoals(false);
      setSelectedGoalsId([]);
      setSelectedPriorityArray([]);
      setAutoMatedGoal(true);
      simpleValidator.current.hideMessages();
      setForceUpdate((v) => ++v);
    }
  };

  const handleGoldCancel = async (e) => {
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
      // }
      // var payload_retire_data = commonEncode.encrypt(JSON.stringify(retire_data));
      // var config_ret = await apiCall(
      //   ADVISORY_UPDATE_RETIREMENT_DATE_API_URL,
      //   payload_retire_data,
      //   false,
      //   false
      // );
      // var res_ret = JSON.parse(commonEncode.decrypt(config_ret));
      // if (res_ret.error_code == "100") {
      //   var retirement_date = moment(res_ret['data'][0]['dob'])
      //     .add(res_ret['data'][0]['retirement_age'], "y")
      //     .format("MM/DD/YYYY");
      //   var life_expectancy_date = moment(res_ret['data'][0]['dob'])
      //     .add(res_ret['data'][0]['life_expectancy'], "y")
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
        setSelfData({ 'retirement_date': retirement_date, 'life_expectancy_date': life_expectancy_date });

      }
    }
    catch {
      (e) => {
      }
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

  const showuniqueUANModalclose = () => {
    setShowuniqueUANModal(false);
  }


  // {
  //   title: "Gold",
  //   id: 42,
  //   child: [
  //     { title: "Gold ETF", id: 70 },
  //     { title: "Gold Mutual Fund", id: 71 },
  //     { title: "Physical Gold", id: 69 },
  //     { title: "Sovereign Gold Bonds", id: 72 },
  //     { title: "Others", id: 73 },
  //   ],
  // },

  return (
    <div>
      <FintooLoader isLoading={isLoading} />
      {(assetsDetails.asset_sub_name_uuid == "sovereign_gold_bonds") && (
        <form noValidate="novalidate" name="goldassetform">
          <div className="row d-flex align-items-center">
            <div className="col-md-5 pt-1 custom-input">
              <div className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null} `} style={{ paddingTop: "19px" }}>
                <input type="text" id="asset_name_123" name="asset_name"
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
                  }} required autoComplete="off" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label htmlFor="name">Name of Asset*</label>
              </div>
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
            <div className="col-md-5 custom-input">
              <div className={`form-group mt-1 ${assetsDetails.user_asset_quantity ? "inputData" : null} `}>
                <span>
                  <input type="number" id="user_asset_quantity_342" name="user_asset_quantity"
                    value={assetsDetails.user_asset_quantity}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                      });
                    }} required autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">No. of Units*</label>
                </span>
                <span className="info-hover-box">
                  <span className="icon">
                    <img
                      alt="More information"
                      src={imagePath + '/static/media/more_information.svg'}
                    />
                  </span>
                  <span className="msg">
                    We are taking the units to calculate the exact value and
                    returns for your investments according to current market
                    price.
                  </span>
                </span>
              </div>
              {simpleValidator.current.message(
                "Asset Units",
                assetsDetails.user_asset_quantity,
                "required",
                { messages: { required: "Please add units" } }
              )}
            </div>
          </div>

          <div className="row py-md-2">
            <div className="col-md-5 custom-input">
              <div className={`form-group ${assetsDetails.user_asset_avg_purchase_price ? "inputData" : null} `}>
                <input type="number" id="user_asset_avg_purchase_price_1232" name="user_asset_avg_purchase_price"
                  value={assetsDetails.user_asset_avg_purchase_price}
                  onChange={(e) => {
                    setAssetsDetails({
                      ...assetsDetails,
                      user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                    });
                  }} required autoComplete="off" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label htmlFor="name">Purchase Price (Per gm) (₹)*</label>
              </div>
              {simpleValidator.current.message(
                "Asset Purchase Amount",
                assetsDetails.user_asset_avg_purchase_price,
                "required",
                { messages: { required: "Please add purchase price" } }
              )}
            </div>
            <div className="col-md-5 custom-input">
              <div className={`form-group ${assetsDetails.user_asset_investment_amount ? "inputData" : null} `}>
                <span>
                  <input type="number" id="user_asset_investment_amount" name="user_asset_investment_amount"
                    value={assetsDetails.user_asset_investment_amount}
                    readOnly required autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Invested Amount (₹)</label>
                </span>
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

          <div className="row py-md-2">
            <div className="col-md-5 custom-input">
              <div className={`form-group  ${assetsDetails.user_asset_current_price ? "inputData" : null} `}>
                <input type="number" id="user_asset_current_price_312" name="user_asset_current_price"
                  value={assetsDetails.user_asset_current_price}
                  onChange={(e) => {
                    setAssetsDetails({
                      ...assetsDetails,
                      user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                    });
                  }} required autoComplete="off" />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label htmlFor="name">Current Price (₹)*</label>
              </div>
              {simpleValidator.current.message(
                "Asset Current Price",
                assetsDetails.user_asset_current_price,
                "required",
                { messages: { required: "Please add curren price" } }
              )}
            </div>
            <div className="col-md-5 custom-input">
              <div className={`form-group  ${assetsDetails.user_asset_current_amount ? "inputData" : null} `}>
                <span>
                  <input type="number" id="user_asset_current_price_433" name="user_asset_current_price"
                    className="shadow-none"
                    value={assetsDetails.user_asset_current_amount}
                    readOnly autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Current Value (₹)</label>
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

          <div className="row py-md-2 mt-md-4">
            <div className="col-md-8">
              <div className="d-md-flex">
                <Form.Label className=" ">
                  Consider This Asset In Automated Linkage*
                </Form.Label>
                <span className="info-hover-left-box ms-md-4">
                  <span name="icon">
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
                        type={"Asset"}
                        asset_maturity_date={assetsDetails?.user_asset_end_date}
                        assetEditId={assetEditId}
                        isGoalFilter={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
                        isAssetRecurring={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
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
                    <Link to={process.env.PUBLIC_URL + "/datagathering/goals"}>
                      <div className="previous-btn form-arrow d-flex align-items-center">
                        <FaArrowLeft />
                        <span className="hover-text">&nbsp;Previous</span>
                      </div>
                    </Link>

                    {addForm && (
                      <button
                        onClick={(e) => handleGoldSubmit(e)}
                        className="default-btn gradient-btn save-btn"
                      >
                        Save & Add More
                      </button>
                    )}
                    {updateForm && (
                      <div>
                        <button
                          onClick={(e) => handleGoldCancel(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => handleGoldUpdate(e)}
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
      {(!props.assetEditId || props.assetEditId == "") && (
        <div>
          {assetsDetails.asset_sub_name_uuid == 'gold_etf_mf' && (
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
          {assetsDetails.asset_sub_name_uuid == 'gold_etf_mf' &&
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
                    The statement uploaded i.e. CAMS doesn't fetch the existing
                    SIP's, Post statement upload do edit the existing SIP's in
                    the funds fetched in the system.
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
                  <div className={`form-group ${docPassword ? "inputData" : null} `}>
                    <input type="password" id="password_90" name="Password" value={docPassword}
                      onChange={(e) => {
                        setDocPassword(e.target.value);
                      }} required autoComplete="off" />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label htmlFor="name">Password*</label>
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
                            to={process.env.PUBLIC_URL + "/datagathering/goals"}
                          >
                            <div className="previous-btn form-arrow d-flex align-items-center">
                              <FaArrowLeft />
                              <span className="hover-text">&nbsp;Previous</span>
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
          {assetsDetails.asset_sub_name_uuid == 'gold_etf_mf' &&
            selectedExtraOption == "Manual Entry" && (
              <form noValidate="novalidate" name="goldassetform">
                <div className="row d-flex align-items-center py-md-2">
                  <div className="col-md-5">
                    <div className="material">
                      <Form.Label>
                        Start Typing To Search For Your Gold Mutual Funds*
                      </Form.Label>
                      {goldfunds && goldfunds.length > 0 && (
                        <Select
                          classNamePrefix="sortSelect"
                          components={{ Input }}
                          autoComplete="new-password"
                          isSearchable={true}
                          styles={customStyles}
                          options={goldfundsData}
                          onChange={(e) => handleGoldFundSelection(e)}
                          value={goldfundsData.filter(
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
                    <div className="material pt-1">
                      <Form.Label>Who Is This Investment For*</Form.Label>
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
                            });
                            handleAssetMemberMaturityDate(e);
                          }
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

                <div className="row py-md-2 mt-2">
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
                    <div className="row d-flex align-items-center py-md-2 ">
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
                        <div className={`form-group w-100 ${assetsDetails.user_asset_sip_amount ? "inputData" : null}`} style={{ paddingTop: '17px' }}>
                          <input type="text" name="user_asset_sip_amount" id="user_asset_sip_amount_321"
                            value={assetsDetails.user_asset_sip_amount}
                            onChange={(e) => {
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_sip_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                              });
                            }}
                            autoComplete="off" />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name">SIP Amount (₹)*</label>
                        </div>
                        <div className="w-100">
                          {simpleValidator.current.message(
                            "SIP Amount",
                            assetsDetails.user_asset_sip_amount,
                            "required",
                            {
                              messages: { required: "Please enter SIP Amount" },
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row py-md-2">
                      <div className="col-md-5 custom-input">
                        <div className={`form-group mt-2 w-100 ${assetsDetails.user_asset_investment_amount ? "inputData" : null}`}>
                          <input type="number" name="user_asset_investment_amount" id="user_asset_investment_amount_321"
                            value={assetsDetails.user_asset_investment_amount}
                            onChange={(e) => {
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                              });
                            }}
                            autoComplete="off" />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name">Total Invested Amount (₹)*</label>
                        </div>
                        <div className="w-100">
                          {simpleValidator.current.message(
                            "Asset Purchase Amount",
                            assetsDetails.user_asset_investment_amount,
                            "required",
                            {
                              messages: { required: "Please add invested amount" },
                            }
                          )}
                        </div>
                      </div>
                      <div className="col-md-5 custom-input">
                        <div className={`form-group mt-2 w-100 ${assetsDetails.user_asset_quantity ? "inputData" : null}`}>
                          <input type="number" name="user_asset_investment_amount" id="user_asset_quantity_213"
                            value={assetsDetails.user_asset_quantity}
                            onChange={(e) => {
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                              });
                            }}
                            autoComplete="off" />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name">No. Of Units*</label>
                        </div>
                        <div className="w-100" >
                          {simpleValidator.current.message(
                            "Asset Units",
                            assetsDetails.user_asset_quantity,
                            "required",
                            { messages: { required: "Please add units" } }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row py-md-2">
                      <div className="col-md-5 custom-input">
                        <div className={`form-group mt-1 w-100 ${assetsDetails.user_asset_current_price ? "inputData" : null}`}>
                          <input type="number" name="user_asset_investment_amount" id="user_asset_investment_amount_1123"
                            value={assetsDetails.user_asset_current_price}
                            readOnly
                            autoComplete="off" />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name">Current Price (₹)*</label>
                        </div>
                        <div className="w-100">
                          {simpleValidator.current.message(
                            "Asset Current Price",
                            assetsDetails.user_asset_current_price,
                            "required",
                            { messages: { required: "Please add current price" } }
                          )}
                        </div>
                      </div>
                      <div className="col-md-5  ">
                        <div className=" d-flex justify-content-between flex-grow-1 custom-input">
                          <div className={`form-group mt-1 w-100 ${assetsDetails.user_asset_current_amount ? "inputData" : null}`}>
                            <span>
                              <input type="number" name="user_asset_investment_amount" id="user_asset_investment_amount"
                                value={assetsDetails.user_asset_current_amount}
                                readOnly
                                autoComplete="off" />
                              <span className="highlight"></span>
                              <span className="bar"></span>
                              <label htmlFor="name">Current value (₹)</label>
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
                    </div>
                    <div className="row py-md-2 mt-2">
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
                    <div className="row mt-2">
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
                                  user_asset_end_date: moment(
                                    retirementDate
                                  )
                                    .add(
                                      retirementDate,
                                      "y"
                                    )
                                    .format("DD/MM/YYYY"),
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
                                  user_asset_end_date: moment(
                                    lifeExpectancyDate
                                  )
                                    .add(
                                      lifeExpectancyDate,
                                      "y"
                                    )
                                    .format("DD/MM/YYYY"),
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
                      <div className="col-md-5 mt-2">
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
                        <div className={`form-group w-100 ${assetsDetails.user_asset_quantity ? "inputData" : null}`} style={{ paddingTop: "19px" }}>
                          <input type="number" name="user_asset_investment_amount" id="user_asset_investment_amount_4909"
                            value={assetsDetails.user_asset_quantity}
                            onChange={(e) => {
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                              });
                            }}
                            autoComplete="off" />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name">No. Of Units*</label>
                        </div>
                        <div className="w-100" >
                          {simpleValidator.current.message(
                            "Asset Units",
                            assetsDetails.user_asset_quantity,
                            "required",
                            { messages: { required: "Please add units" } }
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row py-md-2">
                      <div className="col-md-5 custom-input">
                        <div className={`form-group w-100 ${assetsDetails.user_asset_avg_purchase_price ? "inputData" : null}`}>
                          <input type="number" name="user_asset_investment_amount" id="user_asset_avg_purchase_price_2222"
                            value={assetsDetails.user_asset_avg_purchase_price}
                            onChange={(e) => {
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                              });
                            }}
                            autoComplete="off" />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name">Avg. buy Price (₹)*</label>
                        </div>
                        <div className="w-100">
                          {simpleValidator.current.message(
                            "Asset Current Price",
                            assetsDetails.user_asset_avg_purchase_price,
                            "required",
                            {
                              messages: { required: "Please add avg. buy price" },
                            }
                          )}
                        </div>
                      </div>

                      <div className="col-md-5 custom-input">
                        <div className={`form-group w-100 ${assetsDetails.user_asset_investment_amount ? "inputData" : null}`}>
                          <span>
                            <input type="number" name="user_asset_investment_amount" id="user_asset_investment_amount_4564"
                              value={assetsDetails.user_asset_investment_amount}
                              onChange={(e) => {
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_investment_amount: e.target.value,
                                });
                              }}
                              readOnly
                              autoComplete="off" />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Invested Amount (₹)</label>
                          </span>
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

                    <div className="row py-md-2">
                      <div className="col-md-5 custom-input">
                        <div className={`form-group  w-100 ${assetsDetails.user_asset_current_price ? "inputData" : null}`}>
                          <input type="number" name="user_asset_current_price" id="user_asset_current_price_90909"
                            value={assetsDetails.user_asset_current_price}
                            readOnly
                            autoComplete="off" />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name">Current Price (₹)*</label>
                        </div>
                        <div className="w-100">
                          {simpleValidator.current.message(
                            "Asset Current Price",
                            assetsDetails.user_asset_current_price,
                            "required",
                            { messages: { required: "Please add current price" } }
                          )}
                        </div>
                      </div>
                      <div className="col-md-5 custom-input">
                        <div className={`form-group w-100 ${assetsDetails.user_asset_current_amount ? "inputData" : null}`}>
                          <span>
                            <input type="number" name="user_asset_current_amount" id="user_asset_current_amount"
                              value={assetsDetails.user_asset_current_amount}
                              readOnly
                              autoComplete="off" />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Current Value (₹)</label>
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
                          Select a goal below to map this investment with a goal
                          of your choice. Otherwise, Fintoo will link it
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
                              type={"Asset"}
                              asset_maturity_date={
                                assetsDetails?.user_asset_end_date
                              }
                              assetEditId={assetEditId}
                              isGoalFilter={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
                              isAssetRecurring={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}

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
                              onClick={(e) => handleGoldSubmit(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Save & Add More
                            </button>
                          )}
                          {props.updateForm && (
                            <div>
                              <button
                                onClick={(e) => handleGoldCancel(e)}
                                className="default-btn gradient-btn save-btn"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={(e) => handleGoldUpdate(e)}
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
          {assetsDetails.asset_sub_name_uuid == 'gold_etf_mf' &&
            selectedExtraOption == "Link your Holdings" && (
              <LinkYourHoldingsDG
                customStyles={customStyles}
                session={session}
              />
            )}
        </div>
      )}
      {props.assetEditId && assetsDetails.asset_sub_name_uuid == 'gold_etf_mf' && (
        <div>
          <form noValidate="novalidate" name="goldassetform">
            <div className="row d-flex align-items-center py-md-2">
              <div className="col-md-5">
                <div className="material mt-2">
                  <Form.Label>
                    Start Typing To Search For Your Gold Mutual Funds*
                  </Form.Label>
                  {goldfunds && goldfunds.length > 0 && (
                    <Select
                      classNamePrefix="sortSelect"
                      isDisabled={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
                      components={{ Input }}
                      autoComplete="new-password"
                      isSearchable={true}
                      styles={customStyles}
                      options={goldfundsData}
                      onChange={(e) => handleGoldFundSelection(e)}
                      value={goldfundsData.filter(
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
                <div className="material mt-2">
                  <Form.Label>Who Is This Investment For*</Form.Label>
                  {familyData && (
                    <Select
                      classNamePrefix="sortSelect"
                      isDisabled={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
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

            <div className="row py-md-2">
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
                      disabled={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
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
                <div className="row d-flex align-items-center py-md-2">
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
                          readOnly={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
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
                    <div className={`form-group ${assetsDetails.user_asset_investment_amount ? "inputData" : null} `}>
                      <input type="text" name="user_asset_investment_amount" id="user_asset_investment_amount_4322"
                        className="shadow-none"
                        value={assetsDetails.user_asset_investment_amount}
                        readOnly={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          });
                        }}
                        required autoComplete="off" />
                      <span className="highlight"></span>
                      <span className="bar"></span>
                      <label htmlFor="name">SIP Amount (₹)*</label>
                    </div>
                    {simpleValidator.current.message(
                      "SIP Amount",
                      assetsDetails.user_asset_investment_amount,
                      "required",
                      { messages: { required: "Please enter SIP Amount" } }
                    )}

                  </div>
                </div>
                <div className="row d-flex align-items-center py-md-2">
                  <div className="col-md-5 custom-input">
                    <div className={`form-group ${assetsDetails.user_asset_investment_amount ? "inputData" : null} `}>
                      <input type="number" name="user_asset_investment_amount" id="user_asset_investment_amount"
                        value={assetsDetails.user_asset_investment_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          });
                        }} required autoComplete="off" />
                      <span className="highlight"></span>
                      <span className="bar"></span>
                      <label htmlFor="name">Total Invested Amount (₹)*</label>
                    </div>
                    {simpleValidator.current.message(
                      "Asset Purchase Amount",
                      assetsDetails.user_asset_investment_amount,
                      "required",
                      { messages: { required: "Please add invested amount" } }
                    )}
                  </div>
                  <div className="col-md-5 custom-input">
                    <div className={`form-group w-100 ${assetsDetails.user_asset_quantity ? "inputData" : null}`}>
                      <input type="number" name="user_asset_quantity" id="user_asset_quantity_0989"
                        value={assetsDetails.user_asset_quantity}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                          });
                        }}
                        autoComplete="off" />
                      <span className="highlight"></span>
                      <span className="bar"></span>
                      <label htmlFor="name">Current Fund Value (₹)</label>
                    </div>
                    {simpleValidator.current.message(
                      "Asset Units",
                      assetsDetails.user_asset_quantity,
                      "required",
                      { messages: { required: "Please add units" } }
                    )}
                  </div>
                </div>
                <div className="row d-flex align-items-center py-md-2">
                  <div className="col-md-5 custom-input">
                    <div className={`form-group ${assetsDetails.user_asset_current_price ? "inputData" : null} `}>
                      <input type="number" name="user_asset_current_price" id="user_asset_current_price_8980"
                        value={assetsDetails.user_asset_current_price}
                        readOnly required autoComplete="off" />
                      <span className="highlight"></span>
                      <span className="bar"></span>
                      <label htmlFor="name">Current Price (₹)*</label>
                    </div>
                    {simpleValidator.current.message(
                      "Asset Current Price",
                      assetsDetails.user_asset_current_price,
                      "required",
                      { messages: { required: "Please add current price" } }
                    )}
                  </div>
                  <div className="col-md-5 custom-input">
                    <div className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null} `}>
                      <span>
                        <input type="number" name="user_asset_current_amount" id="user_asset_current_amount_0909"
                          value={assetsDetails.user_asset_current_amount}
                          readOnly required autoComplete="off" />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label htmlFor="name">Current value (₹)</label>
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
                          readOnly={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
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
                <div className="row mt-2">
                  <div className="col-9">
                    <div className="">
                      <div className="d-flex pt-2" style={{ clear: "both" }}>
                        <FintooRadio2
                          checked={assetsDetails.user_asset_valid_till == "Retirement"}
                          readOnly={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_valid_till: "Retirement",
                              user_asset_end_date: moment(
                                retirementDate
                              )
                                .add(
                                  retirementDate,
                                  "y"
                                )
                                .format("DD/MM/YYYY"),
                            });
                          }}
                          title="Upto Retirement Age"
                        />
                        <FintooRadio2
                          checked={assetsDetails.user_asset_valid_till == "Life Expectancy"}
                          readOnly={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
                          onClick={() => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_valid_till: "Life Expectancy",
                              user_asset_end_date: moment(
                                lifeExpectancyDate
                              )
                                .add(
                                  lifeExpectancyDate,
                                  "y"
                                )
                                .format("DD/MM/YYYY"),
                            });
                          }}
                          title="Upto Life Expectancy Age"
                        />
                        <FintooRadio2
                          checked={assetsDetails.user_asset_valid_till == "Perpetual"}
                          readOnly={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
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
                <div className="row py-md-2">
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
                          readOnly={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
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
                    <div className={`form-group mt-2 w-100 ${assetsDetails.user_asset_quantity ? "inputData" : null}`}>
                      <input type="number" name="user_asset_investment_amount" id="user_asset_investment_amount_3221"
                        value={assetsDetails.user_asset_quantity}
                        readOnly={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                          });
                        }}
                        autoComplete="off" />
                      <span className="highlight"></span>
                      <span className="bar"></span>
                      <label htmlFor="name">No. Of Units*</label>
                    </div>
                    {simpleValidator.current.message(
                      "Asset Units",
                      assetsDetails.user_asset_quantity,
                      "required",
                      { messages: { required: "Please add units" } }
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
                        placeholder="Avg. buy Price (₹)*"
                        disabled={(assetsDetails?.user_asset_source ?? "").toLowerCase() == 'external'}
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

                <div className="row py-md-2">
                  <div className="col-md-5 ">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Current Price (₹)*"
                      className="mb-3 material"
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
                        type="number"
                        placeholder="Current Value (₹)"
                        className="shadow-none"
                        value={assetsDetails.user_asset_current_amount}
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
                          type={"Asset"}
                          asset_maturity_date={assetsDetails?.user_asset_end_date}
                          assetEditId={assetEditId}
                          isGoalFilter={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
                          isAssetRecurring={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
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
                          onClick={(e) => handleGoldSubmit(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Save & Add More
                        </button>
                      )}
                      {props.updateForm && (
                        <div>
                          <button
                            onClick={(e) => handleGoldCancel(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleGoldUpdate(e)}
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

      {assetsDetails.asset_sub_name_uuid == 'physical_gold' && (
        <>
          <form noValidate="novalidate" name="goldassetform">
            <div className="row d-flex align-items-center">
              <div className="col-md-5 custom-input">
                <div className={`form-group w-100 ${assetsDetails.user_asset_name ? "inputData" : null}`} style={{ paddingTop: "17px" }}>
                  <input type="text" name="asset_name" id="asset_name_2134"
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
                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Name of Asset*</label>
                </div>
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
                <div className="material" style={{ paddingTop: "" }}>
                  <Form.Label>Who Is This Investment For*</Form.Label>
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

            <div className="row d-flex align-items-center">
              <div className="col-md-5">
                <div className="material">
                  <Form.Label className="mb-0">
                    Date of Purchase
                  </Form.Label>
                  <div
                    className="dt-conbx"
                    style={{
                      borderBottom: "1px solid #dadada",
                      paddingTop:
                        assetsDetails.asset_sub_name_uuid == 'physical_gold'
                          ? "3.5px"
                          : "0",
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
                <div className={`form-group w-100 ${assetsDetails.user_asset_quantity ? "inputData" : null}`} style={{ paddingTop: "15px" }}>
                  <input type="number" name="asset_name" id="asset_name_90889"
                    value={assetsDetails.user_asset_quantity}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">No Of Gms*</label>
                </div>
                {simpleValidator.current.message(
                  "Asset Units",
                  assetsDetails.user_asset_quantity,
                  "required",
                  { messages: { required: "Please add units" } }
                )}
              </div>
            </div>

            <div className="row py-md-2">
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 w-100 ${assetsDetails.user_asset_current_price ? "inputData" : null}`}>
                  <input type="number" name="asset_name" id="user_asset_current_price_878"
                    value={assetsDetails.user_asset_current_price}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Current Gold Price ( Per Gram )*</label>
                </div>

                {simpleValidator.current.message(
                  "Current Gold Price ( Per Gram )",
                  assetsDetails.user_asset_current_price,
                  "required",
                  { messages: { required: "Please add current price" } }
                )}
              </div>
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 w-100 ${assetsDetails.user_asset_current_amount ? "inputData" : null}`}>
                  <input type="number" name="user_asset_current_amount" id="user_asset_current_amount_9232"
                    value={assetsDetails.user_asset_current_amount}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_current_amount: e.target.value,
                      });
                    }}
                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Current Value (₹)</label>
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
                          type={"Asset"}
                          asset_maturity_date={assetsDetails?.user_asset_end_date}
                          assetEditId={assetEditId}
                          isGoalFilter={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
                          isAssetRecurring={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
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
                          onClick={(e) => handleGoldSubmit(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Save & Add More
                        </button>
                      )}
                      {props.updateForm && (
                        <div>
                          <button
                            onClick={(e) => handleGoldCancel(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleGoldUpdate(e)}
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
        </>
      )}
      {assetsDetails.asset_sub_name_uuid == 'commodity_others' && (
        <>
          <form noValidate="novalidate" name="goldassetform">
            <div className="row d-flex align-items-center">
              <div className="col-md-5 custom-input">
                <div className={`form-group w-100 ${assetsDetails.user_asset_name ? "inputData" : null}`} style={{ paddingTop: "17px" }}>
                  <input type="text" name="asset_name" id="asset_name_646"
                    maxLength={35}
                    className="shadow-none"
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
                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Name of Asset*</label>
                </div>
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
                <div className="material" style={{ marginTop: "0" }}>
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
                      isDisabled={
                        assetsDetails.asset_type &&
                        assetsDetails.asset_type != "none"
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="row d-flex align-items-center py-md-2">
              <div className="col-md-5">
                <div className="material">
                  <Form.Label className="mb-0">
                    Date of Purchase
                  </Form.Label>
                  <div
                    className="dt-conbx"
                    style={{
                      borderBottom: "1px solid #dadada",
                      paddingTop:
                        assetsDetails.asset_sub_name_uuid == 'physical_gold'
                          ? "3.5px"
                          : "0",
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
                <div className={`form-group w-100 ${assetsDetails.user_asset_quantity ? "inputData" : null}`} style={{ paddingTop: "15px" }}>
                  <input type="number" name="asset_name" id="user_asset_quantity_7567"
                    value={assetsDetails.user_asset_quantity}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">No Of Gms*</label>
                </div>

                {simpleValidator.current.message(
                  "Asset Units",
                  assetsDetails.user_asset_quantity,
                  "required",
                  { messages: { required: "Please add units" } }
                )}
              </div>
            </div>
            <div className="row py-md-2">
              {/* <div className="col-md-5 custom-input ">
                <div className={`form-group mt-1 w-100 inputData`}>
                  <input type="number" name="asset_name" id="asset_name_3432"
                    value={assetsDetails.asset_gold_karat}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        asset_gold_karat: e.target.value,
                      });
                    }}
                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Karat</label>
                </div>
              </div> */}
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 w-100 ${assetsDetails.user_asset_investment_amount ? "inputData" : null}`}>
                  <input type="number" name="asset_name" id="asset_name_8908"
                    value={assetsDetails.user_asset_investment_amount}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Invested Amount (₹)</label>
                </div>
                {simpleValidator.current.message(
                  "Asset Purchase Amount",
                  assetsDetails.user_asset_investment_amount,
                  "required",
                  { messages: { required: "Please add invested amount" } }
                )}
              </div>
            </div>

            <div className="row py-md-2">
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 w-100 ${assetsDetails.user_asset_current_price ? "inputData" : null}`}>
                  <input type="number" name="user_asset_current_price" id="user_asset_current_price_3763"
                    value={assetsDetails.user_asset_current_price}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                      });
                    }}

                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Current Gold Price ( Per Gram )*</label>
                </div>
                {simpleValidator.current.message(
                  "Asset Current Price",
                  assetsDetails.user_asset_current_price,
                  "required",
                  { messages: { required: "Please add current price" } }
                )}
              </div>
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 w-100 ${assetsDetails.user_asset_current_amount ? "inputData" : null}`}>
                  <span>
                    <input type="number" name="user_asset_current_price" id="user_asset_current_amount_9090"
                      value={assetsDetails.user_asset_current_amount}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_current_amount: e.target.value,
                        });
                      }}
                      readOnly
                      autoComplete="off" />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label htmlFor="name">Current Value</label>
                  </span>
                  <span className="info-hover-box">
                    <span className="icon">
                      <img
                        alt="More information"
                        src={imagePath + '/static/media/more_information.svg'}
                      />
                    </span>
                    <span className="msg">
                      Auto calculated by No. of Gms and Current Gold Price
                    </span>
                  </span>
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
                          asset_maturity_date={assetsDetails?.user_asset_end_date}
                          type={"Asset"}
                          assetEditId={assetEditId}
                          isGoalFilter={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
                          isAssetRecurring={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
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
                          onClick={(e) => handleGoldSubmit(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Save & Add More
                        </button>
                      )}
                      {props.updateForm && (
                        <div>
                          <button
                            onClick={(e) => handleGoldCancel(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleGoldUpdate(e)}
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
        </>
      )}



      {/* {assetsDetails.asset_sub_category_id == 125 && (
        <>
          <form noValidate="novalidate" name="goldassetform">
            <div className="row d-flex align-items-center">
              <div className="col-md-5 custom-input">
                <div className={`form-group w-100 ${assetsDetails.user_asset_name ? "inputData" : null}`} style={{ paddingTop: "17px" }}>
                  <input type="text" name="asset_name" id="asset_name_898"
                    maxLength={35}
                    className="shadow-none"
                    value={"Gold"}
                    disabled="disabled"
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_name: e.target.value,
                      });
                    }}
                    autoComplete="off" />
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Asset Class</label>
                </div>
              </div>
              <div className="col-md-5">
                <div className="material" style={{ marginTop: assetsDetails.asset_sub_category_id == 27 ? "0px" : "0" }}>
                  <Form.Label>Select Subclass *</Form.Label>
                  {props.filteredAssetsData.select_subclass && (
                    <input
                      name="user_asset_investment_amount"
                      id="user_asset_investment_amount_12"
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
                    id="user_asset_investment_amount_4435"
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
                    id="user_asset_investment_amount_3232"
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
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Total Invested Value</label>
                </div>
              </div>
            </div>
            <div className="row py-md-2">
              <div className="col-md-5 custom-input ">
                <div className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    id="user_asset_investment_amount_6267"
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
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Total Current Value</label>
                </div>
              </div>
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    id="user_asset_investment_amount_45"
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
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Asset Value Linked</label>
                </div>
              </div>
            </div>

            <div className="row py-md-2">
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    id="user_asset_investment_amount_8988"
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
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Asset Available for Linkages</label>
                </div>
              </div>
              <div className="col-md-5 custom-input">
                <div className={`form-group mt-1 inputData`}>
                  <input
                    type="Number"
                    id="user_asset_investment_amount_90908"
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
                  <span className="highlight"></span>
                  <span className="bar"></span>
                  <label htmlFor="name">Recurring Investment</label>
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
                          asset_maturity_date={assetsDetails?.user_asset_end_date}
                          type={"Asset"}
                          assetEditId={assetEditId}
                          isGoalFilter={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
                          isAssetRecurring={assetsDetails.user_asset_occurance == "Recurring" ? "Recurring" : "One Time"}
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
                          onClick={(e) => handleGoldSubmit(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Save & Add More
                        </button>
                      )}
                      {props.updateForm && (
                        <div>
                          <button
                            onClick={(e) => handleGoldCancel(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleGoldUpdate(e)}
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

export default AssetGold;
