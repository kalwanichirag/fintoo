import React, { useState, useRef, useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import ReactDatePicker from "../../../components/HTML/ReactDatePicker/ReactDatePicker";
import FintooRadio2 from "../../../components/FintooRadio2";
import Switch from "react-switch";
import moment from "moment";
import Slider from "../../../components/HTML/Slider";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import SimpleReactValidator from "simple-react-validator";
import GoalsDropdown from "../../../components/GoalsDropdown/GoalDropdown";
import customStyles from "../../../components/CustomStyles";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useDispatch } from "react-redux";
import { apiCall } from "../../../common_utilities";
import { ADVISORY_MULTIPLE_ASSETS_LINKAGE_API, imagePath } from "../../../constants";
import { ScrollToTop } from "../ScrollToTop"
function Alternate(props) {
  const setAssetsDetails = props.setAssetsDetails;
  const assetsDetails = props.assetsDetails;
  const familyData = props.familyData;
  const goalData = props.goalData;
  const unchangedgoaldata = props.unchangedgoaldata;
  const setDate = props.setDate;
  const cryptodata = props.cryptodata;
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
  const assetEditId = props.assetEditId;
  const dispatch = useDispatch();
  const [familySortedData, setFamilySortedData] = useState([]);
  const [multipleTotalInvestedValue, setMultipleTotalInvestedValue] = useState(0);
  const [multipleTotalCurrentValue, setMultipleTotalCurrentValue] = useState(0);
  const [multipleTotalAssetValueLinked, setMultipleTotalAssetValueLinked] = useState(0);
  const [multipleTotalAssetValueForLinkages, setMultipleTotalAssetValueForLinkages] = useState(0);
  const [multipleTotalRecurringInvestment, setMultipleTotalRecurringInvestment] = useState(0);
  const data = props.filteredAssetsData.select_subclass
  const [subClass, setSubClass] = useState("");
  const [investmentFrom, setInvestmentFrom] = useState("");
  const cntRef = useRef(null);
  const scrollToRef = () => {
    if (cntRef.current) {
      cntRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('cntRef.current is null');
    }
  };

  useEffect(() => {
    scrollToRef();
  }, []);

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
      setMultipleTotalInvestedValue(0)
      setMultipleTotalCurrentValue(0)
      setMultipleTotalAssetValueLinked(0)
      setMultipleTotalAssetValueForLinkages(0)
      setMultipleTotalRecurringInvestment(0)
    }
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
  const dynamicLabelsToRemove = ['Art Investment', 'Commodity', 'Currency', 'Vintage/ Luxury Cars', 'Others'];
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
  //         // if (_records[i].asset_recurring == '1' || _records[i].asset_recurring == true) {
  //         //   totalRecurringInvestment = totalRecurringInvestment + Number(_records[i].user_asset_investment_amount)
  //         // }
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
  const [, forceUpdate] = useState();
  const [, setForceUpdate] = useState(0);

  const handleAlternateSubmit = async (e) => {
    e.preventDefault();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);
  
    if (assetsDetails.user_asset_occurance == "Recurring") {
      // Handle SIP form validation
      const isSipFormValid =
        simpleValidator.current.fieldValid("SIP Amount") &&
        simpleValidator.current.fieldValid("Total Invested Amount (₹)*") &&
        (simpleValidator.current.fieldValid("No. Of Coins*") || simpleValidator.current.fieldValid("No. Of Units*")) &&
        simpleValidator.current.fieldValid("Current Price (₹)*");
  
      if (isSipFormValid) {
        addAssetsSubmit(e);
        setGoalSelected(false);
        setSelectedGoals("Automated Linkage");
        setSelectedGoalsId(false);
        setSelectedPriorityArray([]);
        setAutoMatedGoal(true);
  
        simpleValidator.current.hideMessages();
        setForceUpdate((v) => ++v);
      }
    } else {
      // Handle regular asset form validation
      const isRegularFormValid =
        ((simpleValidator.current.fieldValid("No. Of Coins*") || simpleValidator.current.fieldValid("No. Of Units*")) &&
          simpleValidator.current.fieldValid("Avg. Purchase Price (₹)*") &&
          simpleValidator.current.fieldValid("Current Price (₹)*"))
  
      if (isRegularFormValid) {
        addAssetsSubmit(e);
        setGoalSelected(false);
        setSelectedGoals("Automated Linkage");
        setSelectedGoalsId(false);
        setSelectedPriorityArray([]);
        setAutoMatedGoal(true);
        simpleValidator.current.hideMessages();
        setForceUpdate((v) => ++v);
      }
  
    }
  };
  

  const handleAlternateUpdate = async (e) => {
   
    // if (assetsDetails.asset_sub_category_id == 125) {
    //   updateAssetsSubmit(e);
    // }
    e.preventDefault();
    simpleValidator.current.showMessages();
    scrollToRef();
    setForceUpdate((v) => ++v);

    if (assetsDetails.user_asset_occurance == "Recurring") {
      // Handle SIP form validation
      const isSipFormValid =
        simpleValidator.current.fieldValid("SIP Amount") &&
        simpleValidator.current.fieldValid("Total Invested Amount (₹)*") &&
        (simpleValidator.current.fieldValid("No. Of Coins*") || simpleValidator.current.fieldValid("No. Of Units*")) &&
        simpleValidator.current.fieldValid("Current Price (₹)*");
      scrollToRef();
      if (isSipFormValid) {
        updateAssetsSubmit(e);
        simpleValidator.current.hideMessages();
        scrollToRef();
        setForceUpdate((v) => ++v);
      }
    } else {
      // Handle regular asset form validation
      const isRegularFormValid =
        ((simpleValidator.current.fieldValid("No. Of Coins*") || simpleValidator.current.fieldValid("No. Of Units*")) &&
          simpleValidator.current.fieldValid("Avg. Purchase Price (₹)*") &&
          simpleValidator.current.fieldValid("Current Price (₹)*"))
      if (isRegularFormValid) {
        // Your logic to submit regular asset data here
        updateAssetsSubmit(e);
        simpleValidator.current.hideMessages();
        setForceUpdate((v) => ++v);
        scrollToRef();
      }
    }
  };

  const handleAlternateCancel = async (e) => {
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
      props.getfpgoalsdata(session.data.fp_log_id);
    }
    setForceUpdate((v) => ++v);
  }, [assetsDetails?.asset_sub_category_id, assetsDetails?.user_asset_occurance]);

  const Input = (props) => {
    const { autoComplete = props.autoComplete } = props.selectProps;
    return <components.Input {...props} autoComplete={autoComplete} />;
  };

  // {
  //   title: "Alternate",
  //   id: 41,
  //   child: [
  //     { title: "Art Investment", id: 64 }, // Missing
  //     { title: "Vintage/Luxury Cars", id: 66 }, // Missing
  //     { title: "Commodity", id: 36 }, // missing
  //     { title: "Cryptocurrency", id: 119 }, // Missing
  //     { title: "Currency", id: 37 },
  //     { title: "Others", id: 67 },
  //   ],
  // },

  // Private Equity
  // "AIF"

  return (
    <div>

      {(
        assetsDetails.asset_sub_name_uuid == 'currency') && (
          <>
            <form noValidate="novalidate" name="goldassetform" className={assetsDetails.asset_sub_category_id == 119 ? "mt-4" : "mt-2"}>
              <div className="row d-flex align-items-center">
                {assetsDetails.asset_sub_category_id == 119 ? (
                  <div className="col-md-5 pt-1">
                    <div className="material ">
                      <Form.Label>
                        {" "}
                        Start Typing To Search For Your Crypto*{" "}
                      </Form.Label>
                      {props.cryptodata && props.cryptodata.length > 0 && (
                        <Select
                          classNamePrefix="sortSelect"
                          isSearchable={true}
                          styles={customStyles}
                          options={cryptodata}
                          onChange={(v) =>
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_name: v.label,
                              user_asset_current_price: v.value,
                            })
                          }
                          value={cryptodata.filter(
                            (v) => v.label == assetsDetails.user_asset_name
                          )}
                        />
                      )}
                    </div>
                    {simpleValidator.current.message(
                      "Cryptocurrency",
                      assetsDetails.user_asset_name
                        .replace("Cryptocurrency", "")
                        .trim(),
                      "required",
                      {
                        messages: {
                          required: "Please select a cryptocurrency",
                        },
                      }
                    )}
                  </div>
                ) : (
                  <div className="col-md-5 custom-input">
                    <div
                      className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                        } `}
                      style={{ paddingTop: "19px" }}
                    >
                      <input
                        type="text"
                        name="asset_name_2_1"
                        id="asset_name_2_1"
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
                      <span className="highlight"></span>
                      <span className="bar"></span>
                      <label htmlFor="name">Name of Asset*</label>
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
                )}

                <div
                  className={`col-md-5 ${assetsDetails.asset_sub_category_id == 119
                    ? "mt-md-2"
                    : "mt-md-0"
                    }`}
                  style={{ paddingTop: assetsDetails.asset_sub_category_id == 119 ? "1px" : "0px" }}
                >
                  <div className="material" >
                    <Form.Label>Who is This Investment For?*</Form.Label>
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
              {/* {assetsDetails.asset_sub_category_id != 119 && ( */}
              <div className="row py-md-2">
                <div className="col-md-8">
                  <div className="d-flex">
                    <Form.Label className=" ">
                      One Time Or Recurring*
                    </Form.Label>
                    <div className="d-flex ms-md-4">
                      <div>One Time</div>
                      <Switch
                        onChange={(v) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_occurance: v ? "Recurring" : "One Time", 
                            user_asset_avg_purchase_price: " ",
                          });
                        }}
                        checked={assetsDetails.user_asset_occurance == "Recurring"}
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
              {/* )} */}
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
                        className={`form-group mt-1 ${assetsDetails.user_asset_sip_amount ? "inputData" : null
                          } `}
                        style={{ paddingTop: '11px' }}
                      >
                        <input
                          type="text"
                          name="user_asset_sip_amount"
                          id="user_asset_sip_amount_9"
                          className="shadow-none"
                          value={assetsDetails.user_asset_sip_amount}
                          onChange={(e) => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_sip_amount: e.target.value.slice(0, 12),
                            });
                          }}
                          required
                          autoComplete="off"
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label htmlFor="name">SIP Amount (₹)*</label>
                      </div>
                      {simpleValidator.current.message(
                        "SIP Amount",
                        assetsDetails.user_asset_sip_amount,
                        "required|numeric|min:1,num",
                        { messages: { required: "Please add SIP Amount" } }
                      )}
                    </div>
                  </div>
                  <div className="row py-md-2">
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group mt-1 ${assetsDetails.user_asset_avg_purchase_price ? "inputData" : null
                          } `}
                      >
                        <input
                          type="text"
                          id="user_asset_occurance"
                          name="user_asset_occurance"
                          value={
                            // If asset is recurring, set it to an empty string
                            assetsDetails.user_asset_avg_purchase_price // Otherwise, use the regular value
                          }
                          onChange={(e) => {
                            if (assetsDetails.user_asset_occurance) {
                              // Allow input if asset is not recurring
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                              });
                            }
                          }}
                          required
                          autoComplete="off"
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label htmlFor="name">Total Invested Amount (₹)*</label>
                      </div>
                      {simpleValidator.current.message(
                        "Total Invested Amount (₹)*",
                        assetsDetails.user_asset_avg_purchase_price,
                        "required",
                        {
                          messages: { required: "Please add invested amount" },
                        }
                      )}
                    </div>
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group mt-1 ${assetsDetails.user_asset_quantity ? "inputData" : null
                          } `}
                      >
                        <input
                          type="Number"
                          id="user_asset_quantity"
                          name="user_asset_quantity"
                          value={assetsDetails.user_asset_quantity}
                          onChange={(e) => {
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                            });
                          }}
                          required
                          autoComplete="off"
                        />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label htmlFor="name">No. Of Coins*</label>
                      </div>
                      <div
                        className="w-100"
                      // style={{ position: "absolute", bottom: "0px" }}
                      >
                        {simpleValidator.current.message(
                          "No. Of Coins*",
                          assetsDetails.user_asset_quantity,
                          "required",
                          { messages: { required: "Please add units" } }
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row py-md-2">
                    <div className="col-md-5 custom-input">
                      <div
                        className={`form-group mt-1 ${assetsDetails.user_asset_current_price
                          ? "inputData"
                          : null
                          } `}
                      >
                        <input
                          type="Number"
                          id="user_asset_current_price"
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
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label htmlFor="name">Current Price (₹)*</label>
                      </div>
                      {simpleValidator.current.message(
                        "Current Price (₹)*",
                        assetsDetails.user_asset_current_price,
                        "required",
                        {
                          messages: {
                            required: "Please enter current unit price",
                          },
                        }
                      )}
                    </div>
                    <div className="col-md-5 custom-input ">
                      <div
                        className={`form-group mt-1 ${assetsDetails.user_asset_current_amount
                          ? "inputData"
                          : null
                          } `}
                      >
                        <span>
                          <input
                            type="text"
                            id="user_asset_current_amount"
                            className="w-100"
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
                    <div className="col-md-5 mt-2">
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
                          { messages: { required: "Please add SIP end date " } }
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {(assetsDetails.user_asset_occurance == "One Time") && (
                  <>
                    <div className="row d-flex align-items-center">
                      <div
                        className="col-md-5 mt-md-1 custom-input"
                        style={{
                          paddingTop:
                            assetsDetails.asset_sub_name_uuid == 'currency' ? "" : "19px ",
                        }}
                      >
                        <div
                          className={`form-group mt-2 ${assetsDetails.user_asset_quantity ? "inputData" : null
                            } `}
                        >
                          <input
                            type="Number"
                            id='user_asset_quantity_11'
                            name="user_asset_quantity"
                            value={assetsDetails.user_asset_quantity}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.');
                              const isZeroDecimal = value === '0.0';
                              setAssetsDetails({
                                ...assetsDetails,
                                user_asset_quantity: isZeroDecimal ? '' : value,
                              });
                            }}
                            required
                            autoComplete="off"
                          />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name">
                            {" "}
                            {assetsDetails.asset_sub_name_uuid == 'currency'
                              ? "No. Of Coins*"
                              : "No. Of Units*"}
                          </label>
                        </div>
                        <div
                          className="w-100"
                        // style={{ position: "absolute", top: assetsDetails.asset_sub_category_id == 37 ? "3px" : "15px" }}
                        >
                          {simpleValidator.current.message(
                            "No. Of Units*",
                            assetsDetails.user_asset_quantity,
                            "required|numeric|min:0.1,num",
                            {
                              messages: {
                                required: "Please add units ",
                                min: "Please enter valid units ",
                              },
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row py-md-2">
                      <div className="col-md-5 custom-input">
                        <div
                          className={`form-group mt-1 ${assetsDetails.user_asset_avg_purchase_price ? "inputData" : null
                            } `}
                        >

                          <input
                            type="Number"
                            id="user_asset_avg_purchase_price_s"
                            name="user_asset_avg_purchase_price"
                            value={
                              assetsDetails.user_asset_occurance == "One Time"
                                ? assetsDetails.user_asset_avg_purchase_price
                                : " "
                            }
                            onChange={(e) => {
                              if (assetsDetails.user_asset_occurance == "One Time") {
                                // Allow input if asset is not recurring
                                setAssetsDetails({
                                  ...assetsDetails,
                                  user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                                });
                              }
                            }}
                            required
                            autoComplete="off"
                          />
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name"> Avg. Purchase Price (₹)*</label>
                        </div>
                        {simpleValidator.current.message(
                          "Avg. Purchase Price (₹)*",
                          assetsDetails.user_asset_avg_purchase_price,
                          "required",
                          {
                            messages: { required: "Please add avg. purchase price" },
                          }
                        )}
                      </div>
                      <div className="col-md-5 custom-input">
                        <div
                          className={`form-group mt-1 ${assetsDetails.user_asset_investment_amount ? "inputData" : null
                            } `}
                        >
                          <span>
                            <input
                              type="text"
                              id="Invested_Amount_s"
                              name="Invested_Amount"
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
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Invested Amount (₹)</label>
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
                              Auto Calculated by No Of Units and Avg. Buy Price
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row py-md-2">
                      <div className="col-md-5 custom-input">
                        <div
                          className={`form-group mt-1 ${assetsDetails.user_asset_current_price
                            ? "inputData"
                            : null
                            } `}
                        >
                          <input
                            type="Number"
                            id="user_asset_current_price_s"
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
                          <span className="highlight"></span>
                          <span className="bar"></span>
                          <label htmlFor="name">Current Price (₹)*</label>
                        </div>
                        {simpleValidator.current.message(
                          "Current Price (₹)*",
                          assetsDetails.user_asset_current_price,
                          "required",
                          { messages: { required: "Please add current price" } }
                        )}
                      </div>
                      <div className="col-md-5  custom-input">
                        <div
                          className={`form-group mt-1 ${assetsDetails.user_asset_current_amount
                            ? "inputData"
                            : null
                            } `}
                        >
                          <span>
                            <input
                              className="w-100"
                              type="text"
                              id="user_asset_current_amount_1"
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
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label htmlFor="name">Current Value (₹)</label>
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
                              Auto Calculated by No Of Units and Current Price
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              {assetsDetails.asset_sub_category_id == 119 && (
                <div className="row py-md-2 mt-3">
                  <div className="col-md-5">
                    <div className="material">
                      <Form.Label>
                        Expected Return (%)* :{" "}
                        {Number(
                          assetsDetails.user_asset_ror == 0
                            ? 20
                            : assetsDetails.user_asset_ror
                        )}
                      </Form.Label>
                      <div
                        className={`${assetsDetails.user_asset_ror < -75 && "sl-hide-left"
                          } ${assetsDetails.user_asset_ror > 80 && "sl-hide-right"}`}
                      >
                        <Slider
                          min={-100}
                          max={100}
                          value={
                            assetsDetails.user_asset_ror == 0
                              ? 20
                              : assetsDetails.user_asset_ror
                          }
                          onChange={(v) =>
                            setAssetsDetails({
                              ...assetsDetails,
                              user_asset_ror:
                                Math.round(
                                  (parseFloat(v) + Number.EPSILON) * 100
                                ) / 100,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="row py-md-2">
                <div className="col-md-8 mt-md-2">
                  <div className="d-md-flex">
                    <Form.Label className=" ">
                      Consider This Asset In Goal Linkage*
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
                        Select a goal below to map this investment with a goal of
                        your choice. Otherwise, Fintoo will link it automatically
                        with your high priority goal. In case, you do not wish to
                        utilize this investment for any goal, select "NO".
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
                            onClick={(e) => handleAlternateSubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleAlternateCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleAlternateUpdate(e)}
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
        )}
      {
        (
          assetsDetails.asset_sub_name_uuid == 'aif' || assetsDetails.asset_sub_name_uuid == 'private_equity'
        ) && (
          <form noValidate="novalidate" name="goldassetform">
            <>
              <div className="row d-flex align-items-center">
                <div className="col-md-5 mt-md-0 mt-2 custom-input">
                  <div className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null} `} style={{ paddingTop: "19px" }}>
                    <input type="text" name="asset_name"
                      maxLength={35}
                      value={assetsDetails.user_asset_name}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          asset_name: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        simpleValidator.current.showMessageFor("Asset Name");
                        forceUpdate(1);
                      }} required autoComplete="off" />
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
                <div className="col-md-5 mt-md-1 mt-3">
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

              <div className="row d-flex align-items-center py-md-1 ">
                <div className="col-md-5 mt-md-0 mt-2 mt-md-0 mt-4">
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
                <div className="col-md-5 mt-md-0 mt-2 custom-input" >
                  <div style={{ paddingTop: "15px" }} className={`form-group  ${assetsDetails.user_asset_quantity ? "inputData" : null} `} >
                    <input type="Number" name="user_asset_quantity"
                      value={assetsDetails.user_asset_quantity}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_quantity: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                        });
                      }} required autoComplete="off" />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">No. of Shares*</label>
                  </div>
                  <div className="w-100">
                    {simpleValidator.current.message(
                      "No. Of Units*",
                      assetsDetails.user_asset_quantity,
                      "required",
                      { messages: { required: "Please add shares" } }
                    )}
                  </div>
                </div>
              </div>

              <div className="row py-md-2">
                <div className="col-md-5 mt-md-1 mt-2 custom-input">
                  <div className={`form-group ${assetsDetails.user_asset_avg_purchase_price ? "inputData" : null} `}>
                    <input type="Number" name="user_asset_avg_purchase_price"
                      value={assetsDetails.user_asset_avg_purchase_price}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_avg_purchase_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 6) : part.slice(0, 2)).join('.'),
                        });
                      }} required autoComplete="off" />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Avg. buy Price (₹)*</label>
                  </div>
                  {simpleValidator.current.message(
                    "Avg. Purchase Price (₹)*",
                    assetsDetails.user_asset_avg_purchase_price,
                    "required",
                    {
                      messages: {
                        required: "Please add avg. buy price",
                      },
                    }
                  )}
                </div>

                <div className="col-md-5 mt-md-0 mt-2 custom-input">
                  <div className={`form-group ${assetsDetails.user_asset_investment_amount ? "inputData" : null} `}>
                    <input type="text" name="user_asset_investment_amount"
                      value={assetsDetails.user_asset_investment_amount}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_investment_amount: e.target.value,
                        });
                      }}
                      readOnly autoComplete="off" />
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

              <div className="row py-md-2">
                <div className="col-md-5 mt-md-0 mt-2 custom-input">
                  <div className={`form-group ${assetsDetails.user_asset_current_price ? "inputData" : null} `}>
                    <input type="Number" name="user_asset_current_price"
                      value={assetsDetails.user_asset_current_price}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_current_price: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                        });
                      }} required autoComplete="off" />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    <label for="name">Current Price (₹)*</label>
                  </div>
                  {simpleValidator.current.message(
                    "Current Price (₹)*",
                    assetsDetails.user_asset_current_price,
                    "required",
                    {
                      messages: {
                        required: "Please add current price",
                      },
                    }
                  )}
                </div>
                <div className="col-md-5 mt-md-0 mt-2 custom-input">
                  <div className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null} `}>
                    <span>
                      <input type="text" name="user_asset_current_amount"
                        value={assetsDetails.user_asset_current_amount}
                        onChange={(e) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_current_amount: e.target.value,
                          });
                        }}
                        readOnly autoComplete="off" />
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
                    <div className="col-md-8 mt-md-2 mt-3">
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
                            date of the SIP, if any
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-md-2 mt-2">
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
                            user_asset_maturity_date={assetsDetails?.asset_mf_end_date}
                            isGoalFilter={assetsDetails.asset_isrecurring == "Recurring" ? "Recurring" : "One Time"}
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
                        <a
                          href={process.env.PUBLIC_URL + "/datagathering/goals"}
                        >
                          <div className="previous-btn form-arrow d-flex align-items-center">
                            <FaArrowLeft />
                            <span className="hover-text">&nbsp;Previous</span>
                          </div>
                        </a>

                        {addForm && (
                          <button
                            onClick={(e) => handleAlternateSubmit(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Save & Add More
                          </button>
                        )}
                        {updateForm && (
                          <div>
                            <button
                              onClick={(e) => handleAlternateCancel(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleAlternateUpdate(e)}
                              className="default-btn gradient-btn save-btn"
                            >
                              Update
                            </button>
                          </div>
                        )}

                        <div
                          className="next-btn form-arrow d-flex align-items-center"
                          onClick={() => props.setTab("tab2")}
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
        )
      }
    </div>
  );
}

export default Alternate;
