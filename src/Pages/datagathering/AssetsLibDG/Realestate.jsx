import React, { useEffect, useRef, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import ReactDatePicker from "../../../components/HTML/ReactDatePicker/ReactDatePicker";
import FintooRadio2 from "../../../components/FintooRadio2";
import Switch from "react-switch";
import moment from "moment";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import GoalsDropdown from "../../../components/GoalsDropdown/GoalDropdown";
import customStyles from "../../../components/CustomStyles";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import { useDispatch } from "react-redux";
import { apiCall } from "../../../common_utilities";
import { ADVISORY_MULTIPLE_ASSETS_LINKAGE_API, imagePath } from "../../../constants";
import { ScrollToTop } from "../ScrollToTop"
import { saveUserAssetDetails } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
function Realestate(props) {

  const setAssetsDetails = props.setAssetsDetails;
  const assetsDetails = props.assetsDetails;
  const familyData = props.familyData;
  const goalData = props.goalData;
  const setDate = props.setDate;
  const rentalincomeData = props.rentalincomeData;
  const addForm = props.addForm;
  const updateForm = props.updateForm;
  const addAssetsSubmit = props.addAssetsSubmit;
  const cancelAssetForm = props.cancelAssetForm;
  const updateAssetsSubmit = props.updateAssetsSubmit;
  const assetForMember = props.assetForMember;
  const session = props.session;
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
  const [familySortedData, setFamilySortedData] = useState([]);
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
  const data = props.filteredAssetsData.select_subclass;
  const [subClass, setSubClass] = useState("");
  const [investmentFrom, setInvestmentFrom] = useState("");
  const dispatch = useDispatch();

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
    if ('multi_linkage_goal_data' in assetsDetails && Array.isArray(assetsDetails.multi_linkage_goal_data) && assetsDetails.multi_linkage_goal_data.length > 0) {
      setMultipleTotalInvestedValue(assetsDetails['multi_linkage_goal_data'][0]['totalinvestedvalue'])
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


  useEffect(() => {
      setMultipleTotalInvestedValue(0);
      setMultipleTotalCurrentValue(0);
      setMultipleTotalAssetValueLinked(0);
      setMultipleTotalAssetValueForLinkages(0);
      setMultipleTotalRecurringInvestment(0);
    
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
  const dynamicLabelsToRemove = [
    "Agricultural Land",
    "Commercial",
    "Land",
    "Residential Premises",
    "Under Construction Property",
    "Others",
  ];
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
  //         // if (_records[i].value == 62 &&_records[i].asset_recurring == '1' || _records[i].asset_recurring == true) {
  //         //   totalRecurringInvestment = totalRecurringInvestment + Number(_records[i].user_asset_investment_amount)
  //         // }
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
  const simpleValidator = useRef(
    new SimpleReactValidator({
      validators: {
        pincode: {
          // name the rule
          message: "Please enter valid :attribute",
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(val, /^[1-9][0-9]{5}$/i);
          },
        },
      },
    })
  );
  const [, forceUpdate] = useState();
  const [, setForceUpdate] = useState(0);
  const assetEditId = props.assetEditId;

  const handleRealEstateSubmit = async (e) => {
    e.preventDefault();

    var isFormValid = simpleValidator.current.allValid();
    simpleValidator.current.showMessages();
    setForceUpdate((v) => ++v);

    if (isFormValid) {
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



  const handleRealEstateUpdate = async (e) => {
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

  const handleRealEstateCancel = async (e) => {
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
  }, [assetsDetails?.asset_sub_category_id]);

  // {
  //   title: "Real Estate",
  //   id: 39,
  //   child: [
  //     { title: "Agricultural Land", id: 53 },
  //     { title: "Under Construction Property", id: 55 },
  //     { title: "Commercial", id: 52 },
  //     { title: "Land", id: 56 },
  //     { title: "Residential Premises", id: 51 },
  //     { title: "Others", id: 59 },
  //   ],
  // },

  return (
    <div>

      {/* Others missing */}
      {/* Share Name Dropdown */}
      {/* Rental Yield */}
      {/* Equity Share Like */}



      {(assetsDetails.asset_type_name_uuid == "agriculture_land" ||
        assetsDetails.asset_type_name_uuid == 'land' ||
        assetsDetails.asset_sub_name_uuid == 'reits' ||
        assetsDetails.asset_sub_name_uuid == 'commercial' ||
        assetsDetails.asset_sub_name_uuid == 'residential_premises')

        && (
          <form noValidate="novalidate" name="goldassetform">
            <div className="row  d-flex align-items-center">
              <div className="col-md-5 custom-input">
                <div
                  className={`form-group ${assetsDetails.user_asset_name ? "inputData" : null
                    } `}
                  style={{ paddingTop: "19px" }}
                >
                  <input
                    type="text"
                    id="asset_name_Real_estate"
                    name="asset_name"
                    maxLength={35}
                    value={assetsDetails.user_asset_name}
                    onChange={(e) => {
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_name: e.target.value,
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
              <div className="col-md-5 ">
                <div className="material mb-3 form-floating">
                  <Form.Label className="mb-0">Date of Purchase</Form.Label>
                  <div
                    className="dt-conbx"
                    style={{
                      borderBottom: "1px solid #dadada",
                      paddingTop: "15px",
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

              <div className="col-md-5  custom-input">
                <div
                  className={`form-group 
                ${assetsDetails.user_asset_avg_purchase_price == 0
                      ? "inputData"
                      : assetsDetails.user_asset_avg_purchase_price
                        ? "inputData"
                        : null
                    } 
                  `}
                  style={{ paddingTop: "19px" }}>
                  <input
                    type="text"
                    name="user_asset_investment_amount"
                    maxLength={35}
                    value={assetsDetails.user_asset_investment_amount}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, '');
                      setAssetsDetails({
                        ...assetsDetails,
                        user_asset_investment_amount: e.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.'),
                      });
                    }}
                    autoComplete="off"
                  />
                  <span class="highlight"></span>
                  <span class="bar"></span>
                  <label for="name">Purchase Amount (₹)</label>
                </div>
              </div>
            </div>
            {/* "total_invested_amount": 110.0,
                "total_current_amount": 11110.0, */}
            <div className="row py-md-2">
              <div className="col-md-5 custom-input">
                <div
                  className={`form-group ${assetsDetails.user_asset_current_amount ? "inputData" : null
                    } `}
                >
                  <input
                    type="number"
                    id="user_asset_current_amount"
                    name="user_asset_current_amount"
                    maxLength={35}
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
                  <label for="name">Current Market Value*</label>
                </div>
                {simpleValidator.current.message(
                  "Current Balance",
                  assetsDetails.user_asset_current_amount,
                  "required",
                  { messages: { required: "Please add asset value" } }
                )}
              </div>
              <div className="col-md-5 custom-input">
                <div
                  className={`form-group ${assetsDetails.user_asset_pincode ? "inputData" : null
                    } `}
                >
                  <span>
                    <input
                      type="number"
                      id="Pincode_Real_estate"
                      name="user_asset_pincode"
                      maxLength={35}
                      value={assetsDetails.user_asset_pincode}
                      onChange={(e) => {
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_pincode: e.target.value.slice(0, 6),
                        });
                      }}
                      autoComplete="off"
                    />
                    <span class="highlight"></span>
                    <span class="bar"></span>
                    {/* <label for="name">Pincode*</label> */}
                    <label for="name">Pincode</label>
                  </span>
                  <span className="info-hover-box">
                    <span className="icon">
                      <img
                        alt="More information"
                        src={imagePath + '/static/media/more_information.svg'}
                      />
                    </span>
                    <span className="msg">Ex: 400097</span>
                  </span>
                </div>
                {/* {simpleValidator.current.message(
                "pincode",
                assetsDetails.user_asset_pincode,
                "required|pincode",
                { messages: { required: "Please enter pincode" } }
              )} */}
                {(assetsDetails.user_asset_pincode || "").length >= 1 &&
                  (assetsDetails.user_asset_pincode || "").length <= 6 &&
                  simpleValidator.current.message(
                    "pincode",
                    assetsDetails.user_asset_pincode,
                    "pincode",
                    { messages: { pincode: "Please enter a valid pincode" } }
                  )}
              </div>
            </div>
            <div className="row py-md-2 mt-1">
              <div className="col-md-5 ">
                <div className="dark-label">
                  <Form.Label>Residential premises type?*</Form.Label>
                  <div className="d-flex pt-4 " style={{ clear: "both" }}>
                    <FintooRadio2
                      checked={assetsDetails.user_asset_property_type == "Rented"}
                      onClick={(v) =>
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_property_type: "Rented",
                        })
                      }
                      title="Rented"
                    />

                    <FintooRadio2
                      checked={assetsDetails.user_asset_property_type == "Self-Occupied"}
                      onClick={(v) =>
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_property_type: "Self-Occupied",
                        })
                      }
                      title="Self Occupied"
                    />
                  </div>
                </div>

              </div>
              <div className="col-md-5">
                <div className="dark-label">
                  <Form.Label>Mortgage or Freehold?*</Form.Label>
                  <div className="d-flex pt-4" style={{ clear: "both" }}>
                    <FintooRadio2
                      checked={assetsDetails.user_asset_ownership === "Free Hold"}
                      onClick={() =>
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_ownership: "Free Hold",
                        })
                      }
                      title="Free Hold"
                    />
                    <FintooRadio2
                      checked={assetsDetails.user_asset_ownership === "Mortgage"}
                      onClick={() =>
                        setAssetsDetails({
                          ...assetsDetails,
                          user_asset_ownership: "Mortgage",
                        })
                      }
                      title="Mortgage"
                    />
                  </div>
                    
                </div>
              </div>


            </div>

            <div className="row py-md-2">
              {assetsDetails.user_asset_property_type == "Rented" &&
                rentalincomeData.length > 0 && (
                  <div className="col-md-5 ">
                    <Form.Label>Rental Income*</Form.Label>
                    <Select
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={rentalincomeData}
                      onChange={(e) =>
                        setAssetsDetails({
                          ...assetsDetails,
                          asset_rental_income: e.value,
                        })
                      }
                      value={rentalincomeData.filter(
                        (v) => v.value == assetsDetails.asset_rental_income
                      )}
                    />
                    {simpleValidator.current.message(
                      "select",
                      assetsDetails.asset_rental_income,
                      "required",
                      { messages: { required: "Please add rental income" } }
                    )}
                  </div>
                )}
              {assetsDetails.user_asset_property_type == "Rented" && (
                <div className="col-md-5 ">
                  <div className="dark-label">
                    <Form.Label>City Type?*</Form.Label>
                    <div className="d-flex pt-4" style={{ clear: "both" }}>
                      <FintooRadio2
                        checked={assetsDetails.user_asset_city_type == "Tier 1"}
                        onClick={(v) =>
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_city_type: "Tier 1",
                          })
                        }
                        title="Tier 1"
                      />
                      <FintooRadio2
                        checked={assetsDetails.user_asset_city_type == "Tier 2"}
                        onClick={(v) =>
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_city_type: "Tier 2",
                          })
                        }
                        title="Tier 2"
                      />
                      <FintooRadio2
                        checked={assetsDetails.user_asset_city_type == "Tier 3"}
                        onClick={(v) =>
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_city_type: "Tier 3",
                          })
                        }
                        title="Tier 3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: `${assetsDetails.user_asset_property_type == "Rented" ? "1rem" : "0"
                  }`,
              }}
              className="row py-md-2"
            >
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
                      checked={assetsDetails.user_asset_automated_linkage}
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

            {assetsDetails.user_asset_property_type == "Rented" && (
              <div className="row py-md-2">
                <div className="col-md-8">
                  <div className="d-flex">
                    <Form.Label className=" ">
                      Consider This Asset In Asset Allocation*
                    </Form.Label>
                    <span className="info-hover-left-box ps-md-3">
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
                    <div className="d-flex ms-4">
                      <div>No</div>
                      <Switch
                        onChange={(v) => {
                          setAssetsDetails({
                            ...assetsDetails,
                            user_asset_allocation: v ? 'Y' : 'N',
                          });
                        }}
                        checked={assetsDetails.user_asset_allocation === 'Y'}
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
            )}

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
                          isGoalFilter={
                            assetsDetails.asset_isrecurring == "Recurring" ? "Recurring" : "One Time"
                          }
                          isAssetRecurring={
                            assetsDetails.asset_isrecurring == "Recurring" ? "Recurring" : "One Time"
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

                      {props.addForm && (
                        <button
                          onClick={(e) => handleRealEstateSubmit(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Save & Add More
                        </button>
                      )}
                      {props.updateForm && (
                        <div>
                          <button
                            onClick={(e) => handleRealEstateCancel(e)}
                            className="default-btn gradient-btn save-btn"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => handleRealEstateUpdate(e)}
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

    </div>
  );
}

export default Realestate;
