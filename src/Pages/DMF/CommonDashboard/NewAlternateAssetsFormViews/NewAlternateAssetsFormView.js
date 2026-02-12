import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import { getParentUserId, getUserId } from "../../../../common_utilities";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormSwitch from "../CommonDashboardComponents/formSwitch";
import moment from "moment";
import FintooLoader from "../../../../components/FintooLoader";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  getOtherInvestments,
  saveUserAssetDetails,
  updateUserAssetDetails,
} from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { getAssetCategoryList } from "../../../../FrappeIntegration-Services/services/financial-planning-api/asset";

const numericRegex = new RegExp(/^\d*\.?\d*$/);

const alternateAssetsInputs = {
  default: ["dateOfPurchase", "currentMarketPrice"],

  currency: [
    "oneTimeOrRecurring",
    "numberOfCoins",
    "averagePurchasePrice",
    "investedAmount",
    "currentPrice",
    "currentValue",
    "SIPStartDate",
    "SIPAmount",
    "totalInvestedAmount",
    "SIPEndDate",
  ],
  private_equity: [
    "numberOfCoins",
    "averagePurchasePrice",
    "investedAmount",
    "currentPrice",
    "currentValue",
    "totalInvestedAmount",
  ],
};

const options_alternate_type = [
  { value: "currency", label: "Currency" },
  { value: "private_equity", label: "Private Equity" },
];

const initialValues = {
  alternateType: "",
  alternateMemberName: "",
  oneTimeOrRecurring: false,
  dateOfPurchase: "",
  numberOfUnits: "",
  averagePurchasePrice: "",
  investedAmount: "",
  currentPrice: "",
  currentValue: "",
  SIPStartDate: "",
  SIPAmount: "",
  totalInvestedAmount: "",
  SIPEndDate: "",
  expectedReturns: "",
  cryptoSelect: {},
  numberOfCoins: "",
  currentMarketPrice: "",
  asset_source: "2",
};

function isInputInPolicy(inputName, policyType) {
  const isForeign = options_alternate_type.filter(
    (data) => data.value === policyType
  );

  if (!policyType) policyType = "default";
  if (isForeign.length === 0) policyType = "default";

  return alternateAssetsInputs[policyType].includes(inputName);
}

const formatWithCommas = (value) => {
  if (value === "" || value === null || isNaN(value)) return "";
  return Number(value).toLocaleString("en-IN");
};

// Helper function to remove commas from formatted number
const removeCommas = (value) => {
  return String(value).replace(/,/g, "");
};

function checkInputForRecurring(
  policyType,
  visibleOnRecurring,
  visibleOnRecurringValue
) {
  if (policyType === "Crypto Currency") return true;
  if (visibleOnRecurring) return visibleOnRecurringValue;
  return !visibleOnRecurringValue;
}

const NewAlternateAssetsFormView = () => {
  const [, forceUpdate] = useState();
  const [formData, setFormData] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [familyData, setFamilyData] = useState([]);
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState([]);
  const [assetForMember, setAssetForMember] = useState("");
  const [assetsDetails, setAssetsDetails] = useState(initialValues);
  const [assetEditId, setAssetEditId] = useState("");
  const [isLoadingFamilyData, setIsLoadingFamilyData] = useState(true);
  const [alternateAssetDetails, setAlternateAssetDetails] = useState({
    asset_id: null,
    asset_name: null,
    asset_name_uuid: null,

    asset_sub_id: null,
    asset_sub_name: null,
    asset_sub_name_uuid: null,

    asset_type_id: null,
    asset_type_name: null,
    asset_type_name_uuid: null,
  });
  const [addForm, setAddForm] = useState(true);
  const [updateForm, setUpdateForm] = useState(false);

  useEffect(() => {
    getFamilyMembers();
    const urlParams = new URLSearchParams(window.location.search);
    let asset_id = urlParams.get("id");
    if (asset_id) {
      setUpdateForm(true);
      setAddForm(false);
      setAssetEditId(asset_id);
      fetchAlternateAssetData(asset_id);
    }
  }, []);

  const simpleValidator = useRef(new SimpleReactValidator());

  const getAlternateFromValue = (insuranceTypeData, value) => {
    return insuranceTypeData.find((data) => data.value === value);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const asset_category = await getAssetCategoryList();

        const categoryList = asset_category?.data?.[0]?.category_list || [];

        const equityCategory = categoryList.find(
          (cat) => cat.asset_name === "Alternate"
        );

        if (equityCategory) {
          const alternateAssetDataDict = {};

          for (const sub of equityCategory.subcategories) {
            if (sub.asset_sub_name !== "AIF") {
              alternateAssetDataDict[sub.asset_sub_name_uuid] = {
                asset_id: equityCategory.asset_id,
                asset_name: equityCategory.asset_name,
                asset_name_uuid: equityCategory.asset_name_uuid,

                asset_sub_id: sub.asset_sub_id,
                asset_sub_name: sub.asset_sub_name,
                asset_sub_name_uuid: sub.asset_sub_name_uuid,

                asset_type_id: "",
                asset_type_name: "",
                asset_type_name_uuid: "",
              };
              setAlternateAssetDetails(alternateAssetDataDict);
            }
            // break;
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const parseDate = (dateStr) => {
    try {
      if (!dateStr || typeof dateStr !== "string") return null;
      const [day, month, year] = dateStr.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      if (isNaN(date)) throw new Error("Invalid date");
      return date;
    } catch (e) {
      return null;
    }
  };

  const updateAlternateAsset = () => {
    if (simpleValidator.current.allValid()) {
      updateAlternateAssetData();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate((v) => ++v);
    }
  };

  const updateAlternateAssetData = async () => {
    let alternateAssetData = assetsDetails;

    let alternateAssetTypeKey = formData.alternateType;
    let assetInfo = alternateAssetDetails[alternateAssetTypeKey];
    alternateAssetData["asset_id"] = assetEditId;
    alternateAssetData["asset_cat_id"] = assetInfo.asset_id;
    alternateAssetData["asset_name_uuid"] = assetInfo.asset_name_uuid;
    alternateAssetData["asset_sub_cat_id"] = assetInfo.asset_sub_id;
    alternateAssetData["asset_sub_name_uuid"] = assetInfo.asset_sub_name_uuid;
    alternateAssetData["user_asset_for"] = formData.alternateMemberName;
    alternateAssetData["user_asset_user_id"] = getUserId();
    alternateAssetData["user_asset_occurance"] = formData.oneTimeOrRecurring
      ? "Recurring"
      : "One Time";
    alternateAssetData["user_asset_quantity"] = formData.numberOfCoins;
    alternateAssetData["user_asset_avg_purchase_price"] =
      formData.averagePurchasePrice;
    alternateAssetData["user_asset_investment_amount"] =
      formData.totalInvestedAmount;
    alternateAssetData["user_asset_current_price"] = formData.currentPrice;
    alternateAssetData["user_asset_current_amount"] = formData.currentValue;
    alternateAssetData["user_asset_automated_linkage"] = 0;
    alternateAssetData["user_asset_name"] = formData.alternateType;
    alternateAssetData["user_asset_sip_amount"] = formData.SIPAmount;
    alternateAssetData["user_asset_context"] =
      formData.alternateMemberName == "0" ? "Family" : "Individual";
    alternateAssetData["user_asset_purchase_date"] = formData?.SIPStartDate
      ? new Date(formData.SIPStartDate).toLocaleDateString("en-GB")
      : "";
    alternateAssetData["user_asset_end_date"] = formData?.SIPEndDate
      ? new Date(formData.SIPEndDate).toLocaleDateString("en-GB")
      : "";

    const resp = await updateUserAssetDetails(alternateAssetData);

    if (resp.status_code == 200) {
      navigate(
        process.env.PUBLIC_URL +
          "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=6"
      );
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Data updated successfully!",
          type: "success",
          autoClose: 3000,
        },
      });
    } else {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Something went wrong, try again later.",
          type: "error",
          autoClose: 3000,
        },
      });
    }
  };

  const fetchAlternateAssetData = async (id) => {
    try {
      const payload_data = { user_id: getUserId(), user_asset_id: id };
      const res = await getOtherInvestments(payload_data);

      if (res?.status_code === "200") {
        const selectedAsset = res?.data?.listing?.[0];
        if (selectedAsset) {
          const memberPrefill =
            selectedAsset.user_asset_for != null
              ? String(selectedAsset.user_asset_for)
              : "0";

          setFormData((prev) => ({
            ...prev,
            alternateType: selectedAsset.asset_sub_name_uuid,
            alternateMemberName: memberPrefill,
            oneTimeOrRecurring:
              selectedAsset.user_asset_occurance === "Recurring",
            numberOfCoins: selectedAsset.user_asset_quantity || "",
            averagePurchasePrice:
              selectedAsset.user_asset_avg_purchase_price || "",
            totalInvestedAmount:
              selectedAsset.user_asset_investment_amount || "",
            investedAmount: selectedAsset.user_asset_investment_amount || "",
            currentPrice: selectedAsset.user_asset_current_price || "",
            currentValue: selectedAsset.user_asset_current_amount || "",
            SIPStartDate: selectedAsset?.user_asset_purchase_date
              ? parseDate(selectedAsset.user_asset_purchase_date)
              : null,
            SIPEndDate: selectedAsset?.user_asset_end_date
              ? parseDate(selectedAsset.user_asset_end_date)
              : null,
            SIPAmount: selectedAsset.user_asset_sip_amount || "",
          }));
        }
      }
    } catch (e) {
      console.error("Error in fetchAlternateAssetData:", e);
    }
  };

  const getFamilyMembers = async () => {
    try {
      setIsLoadingFamilyData(true);

      const member_data = await getFamilyMember(getParentUserId());

      if (
        member_data &&
        (member_data.status_code === 200 ||
          member_data.status_code === "200") &&
        member_data.data
      ) {
        const members = member_data.data;
        const member_array = [];

        let isSelfAdded = false;

        // Ensure members is an array
        if (Array.isArray(members)) {
          members.forEach((member, index) => {
            if (member.relation === "Self" && !isSelfAdded) {
              const selfObj = {
                value: member.user_id,
                label: "Self",
                retirement_age: member.retirement_age,
                dob: member.dob,
                life_expectancy: member.life_expectancy_age,
                isdependent: member.is_dependent,
              };
              member_array.push(selfObj);

              // Add Family (using same self data)
              const familyObj = {
                value: 0,
                label: "Family",
                retirement_age: member.retirement_age,
                dob: member.dob,
                life_expectancy: member.life_expectancy_age,
                isdependent: member.is_dependent,
              };
              member_array.push(familyObj);
              setFormData((prevFormData) => ({
                ...prevFormData,
                goldMemberName: member.user_id,
              }));

              isSelfAdded = true;
            } else if (member.relation !== "Self") {
              // Other member - handle null user_name
              const otherObj = {
                value: member.user_id,
                label:
                  member.user_name || member.user_email || "Unknown Member",
                retirement_age: member.retirement_age,
                dob: member.dob,
                life_expectancy: member.life_expectancy_age,
                isdependent: member.is_dependent,
              };
              member_array.push(otherObj);
            }
          });
        } else {
          console.error("Members data is not an array:", members);
        }

        // Ensure we have at least some options
        if (member_array.length === 0) {
          const fallbackOptions = [
            {
              value: "self",
              label: "Self",
              retirement_age: null,
              dob: null,
              life_expectancy: null,
              isdependent: false,
            },
            {
              value: 0,
              label: "Family",
              retirement_age: null,
              dob: null,
              life_expectancy: null,
              isdependent: false,
            },
          ];
          setFamilyData(fallbackOptions);
          setFormData((prevFormData) => ({
            ...prevFormData,
            goldMemberName: "self",
          }));
        } else {
          setFamilyData(member_array);
        }
      } else {
        setFamilyData([]);
      }
    } catch (error) {
      // Set fallback options if API fails
      const fallbackOptions = [
        {
          value: "self",
          label: "Self",
          retirement_age: null,
          dob: null,
          life_expectancy: null,
          isdependent: false,
        },
        {
          value: 0,
          label: "Family",
          retirement_age: null,
          dob: null,
          life_expectancy: null,
          isdependent: false,
        },
      ];
      setFamilyData(fallbackOptions);
      setFormData((prevFormData) => ({
        ...prevFormData,
        goldMemberName: "self",
      }));
    } finally {
      setIsLoadingFamilyData(false);
    }
  };

  const handleAlternateMember = (selectedOption) => {
    setFormData({
      ...formData,
      alternateMemberName: selectedOption.value,
    });
  };

  const saveAsset = async () => {
    try {
      let alternateAssetData = assetsDetails;
      let alternateAssetTypeKey = formData.alternateType;
      let assetInfo = alternateAssetDetails[alternateAssetTypeKey];

      alternateAssetData["asset_cat_id"] = assetInfo.asset_id;
      alternateAssetData["asset_name_uuid"] = assetInfo.asset_name_uuid;
      alternateAssetData["asset_sub_cat_id"] = assetInfo.asset_sub_id;
      alternateAssetData["asset_sub_name_uuid"] = assetInfo.asset_sub_name_uuid;
      alternateAssetData["user_asset_for"] = formData.alternateMemberName;
      alternateAssetData["user_asset_user_id"] = getUserId();
      alternateAssetData["user_asset_occurance"] = formData.oneTimeOrRecurring
        ? "Recurring"
        : "One Time";
      alternateAssetData["user_asset_quantity"] = formData.numberOfCoins;
      alternateAssetData["user_asset_avg_purchase_price"] =
        formData.averagePurchasePrice;
      alternateAssetData["user_asset_investment_amount"] =
        formData.totalInvestedAmount;
      alternateAssetData["user_asset_current_price"] = formData.currentPrice;
      alternateAssetData["user_asset_current_amount"] = formData.currentValue;
      alternateAssetData["user_asset_automated_linkage"] = 0;
      alternateAssetData["user_asset_name"] = formData.alternateType;
      alternateAssetData["user_asset_sip_amount"] = formData.SIPAmount;
      alternateAssetData["user_asset_context"] =
        formData.alternateMemberName == "0" ? "Family" : "Individual";
      alternateAssetData["user_asset_purchase_date"] = formData?.SIPStartDate
        ? new Date(formData.SIPStartDate).toLocaleDateString("en-GB")
        : "";
      alternateAssetData["user_asset_end_date"] = formData?.SIPEndDate
        ? new Date(formData.SIPEndDate).toLocaleDateString("en-GB")
        : "";

      const response = await saveUserAssetDetails(alternateAssetData);

      if (response.status_code == "200") {
        navigate(
          process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=6"
        );

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Alternate asset added Successfully!`,
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Alternate asset not added, Something went wrong!`,
            type: "error",
          },
        });
      }
    } catch (err) {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Something went wrong, try again later.",
          type: "error",
          autoClose: 3000,
        },
      });
    }
  };

  const onInputChange = (e, isNumeric) => {
    const name = e.target.name;
    let value = e.target.value;

    // Remove commas for validation and storage
    const cleanValue = removeCommas(value);

    if (isNumeric && !numericRegex.test(cleanValue) && cleanValue !== "") {
      return;
    }

    setFormData({ ...formData, [name]: cleanValue });
  };

  const getNumericValue = (val) =>
    val != null ? val.toString().replace(/,/g, "") : "";

  const onDateAndSelectInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    simpleValidator.current.showMessages();
    forceUpdate(1);

    if (simpleValidator.current.allValid()) {
      saveAsset();
    }
  };

  function resetState(type) {
    if (type != 119) {
      setFormData((prev) => ({
        ...prev,
        dateOfPurchase: "",
        currentMarketPrice: "",
        currentPrice: "",
        averagePurchasePrice: "",
        investedAmount: "",
        currentValue: "",
        expectedReturns: "",
        totalInvestedAmount: "",
        numberOfCoins: "",
        numberOfUnits: "",
        oneTimeOrRecurring: false,
        SIPAmount: "",
        SIPEndDate: "",
        SIPStartDate: "",
        cryptoSelect: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        dateOfPurchase: "",
        currentMarketPrice: "",
        currentPrice: "",
        averagePurchasePrice: "",
        investedAmount: "",
        cryptoSelect: "",
        currentValue: "",
        expectedReturns: 20,
        totalInvestedAmount: "",
        numberOfCoins: "",
        numberOfUnits: "",
        oneTimeOrRecurring: false,
        SIPAmount: "",
        SIPEndDate: "",
        SIPStartDate: "",
      }));
    }
  }

  useEffect(() => {
    simpleValidator.current.hideMessages();
    forceUpdate(4);
  }, [formData.alternateType]);

  useEffect(() => {
    const coins = parseFloat(formData.numberOfCoins || 0);
    const avgPrice = parseFloat(formData.averagePurchasePrice || 0);
    const currPrice = parseFloat(formData.currentPrice || 0);

    const invested = coins && avgPrice ? coins * avgPrice : "";
    const currentVal = coins && currPrice ? coins * currPrice : "";

    setFormData((prev) => ({
      ...prev,
      investedAmount: invested !== "" ? invested : prev.investedAmount,
      totalInvestedAmount:
        invested !== "" ? invested : prev.totalInvestedAmount,
      currentValue: currentVal !== "" ? currentVal : prev.currentValue,
    }));
  }, [
    formData.numberOfCoins,
    formData.averagePurchasePrice,
    formData.currentPrice,
  ]);

  simpleValidator.current.purgeFields();

  const customStyles = {
    option: (base, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: "#ffff",
        color: isFocused ? "#042b62" : isSelected ? "#042b62" : "gray",
        cursor: "pointer",
      };
    },
    menuList: (base) => ({
      ...base,
      overflowY: "scroll",
      scrollBehavior: "smooth",
      "::-webkit-scrollbar": {
        width: "4px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "#fff",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#042b62",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    }),
  };

  useEffect(() => {
    if (!formData.oneTimeOrRecurring) {
      const invested = Math.round(
        formData.numberOfCoins * 1 * (formData.averagePurchasePrice * 1)
      );
      setFormData((prev) => ({
        ...prev,
        investedAmount: invested,
        totalInvestedAmount: invested,
      }));
    }
  }, [
    formData.numberOfCoins,
    formData.averagePurchasePrice,
    formData.oneTimeOrRecurring,
  ]);

  useEffect(() => {
    const currentValue = Math.round(
      formData.currentPrice * 1 * (formData.numberOfCoins * 1)
    );
    setFormData((prev) => ({
      ...prev,
      currentValue,
    }));
  }, [formData.currentPrice, formData.numberOfCoins]);

  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <div className="px-0 px-md-4 assetForm">
        <div
          className="p-3"
          style={{ border: "1px solid #d8d8d8", borderRadius: 10 }}
        >
          {updateForm ? (
            <div className="d-flex">
              <a
                href={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard?assetTabNumber=6`}
              >
                <img
                  style={{
                    transform: "rotate(180deg)",
                  }}
                  width={20}
                  height={20}
                  src={
                    process.env.PUBLIC_URL + "/static/media/icons/chevron.svg"
                  }
                />
              </a>
              <h3
                className="text-center pb-0 mb-0 ps-2"
                style={{
                  flexGrow: 1,
                }}
              >
                Edit Your Alternate Assets
              </h3>
            </div>
          ) : (
            <div className="d-flex">
              <a
                href={`${process.env.PUBLIC_URL}/direct-mutual-fund/portfolio/dashboard?assetTabNumber=6`}
              >
                <img
                  style={{
                    transform: "rotate(180deg)",
                  }}
                  width={20}
                  height={20}
                  src={
                    process.env.PUBLIC_URL + "/static/media/icons/chevron.svg"
                  }
                />
              </a>
              <h3
                className="text-center pb-0 mb-0 ps-2"
                style={{
                  flexGrow: 1,
                }}
              >
                Add Your Alternate Assets
              </h3>
            </div>
          )}

          <hr style={{ color: "#afafaf" }} />
          <div className="row">
            <div className="col-12 col-md-11 col-lg-8 m-auto">
              {addForm && (
                <p className="text-center">
                  Enter Your Details To Add Alternate Assets
                </p>
              )}

              {updateForm && (
                <p className="text-center">
                  Enter Your Details To Edit Alternate Assets
                </p>
              )}
              <br />
              <br />
              <div>
                <div className="my-md-4">
                  <div>
                    <span className="lbl-newbond">Select Alternate Type *</span>
                    <br />

                    <Select
                      className="fnto-dropdown-react"
                      classNamePrefix="sortSelect"
                      styles={customStyles}
                      isSearchable={false}
                      options={options_alternate_type}
                      value={getAlternateFromValue(
                        options_alternate_type,
                        formData?.alternateType
                      )}
                      name="alternateType"
                      onChange={(e) => {
                        onDateAndSelectInputChange("alternateType", e.value);
                        resetState(e.value);
                      }}
                    />
                    {simpleValidator.current.message(
                      "alternateType",
                      formData.alternateType,
                      "required"
                    )}
                  </div>
                </div>
                <div className="my-md-4">
                  <span className="lbl-newbond">
                    Who Is This Investment For*
                  </span>
                  <br />
                  <Select
                    className="fnto-dropdown-react"
                    classNamePrefix="sortSelect"
                    styles={customStyles}
                    isSearchable={false}
                    options={familyData}
                    value={
                      familyData.find(
                        (opt) =>
                          String(opt.value) ===
                          String(formData?.alternateMemberName)
                      ) || null
                    }
                    onChange={(selected) => {
                      const selectedValue =
                        selected && selected.value !== undefined
                          ? String(selected.value)
                          : null;

                      setFormData((prev) => ({
                        ...prev,
                        alternateMemberName: selectedValue,
                      }));
                      setAssetForMember(selectedValue);
                      setAssetsDetails((prev) => ({
                        ...prev,
                        asset_member_id: selectedValue,
                      }));
                    }}
                  />
                  {simpleValidator.current.message(
                    "alternateMemberName",
                    formData.alternateMemberName,
                    "required"
                  )}
                </div>
                <div>
                  <div
                    className="row"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    {isInputInPolicy(
                      "oneTimeOrRecurring",
                      formData.alternateType
                    ) && (
                      <div className="col-md-6 col-12">
                        <span
                          className="lbl-newbond insurance-switch-container"
                          style={{ color: "#b3b3b3" }}
                        >
                          One Time Or Recurring? *
                        </span>
                      </div>
                    )}
                    {isInputInPolicy(
                      "oneTimeOrRecurring",
                      formData.alternateType
                    ) && (
                      <div className="col-md-6 col-12">
                        <span className="lbl-newbond">
                          <div className="insurance-switch-container">
                            <span>One Time&nbsp;&nbsp;</span>
                            <FormSwitch
                              switchValue={formData.oneTimeOrRecurring}
                              onSwitchToggle={() =>
                                setFormData({
                                  ...formData,
                                  oneTimeOrRecurring:
                                    !formData.oneTimeOrRecurring,
                                  SIPEndDate: "",
                                  SIPStartDate: "",
                                  SIPAmount: "",
                                  totalInvestedAmount: "",
                                  numberOfCoins: "",
                                  currentPrice: "",
                                  currentValue: "",
                                  SIPEndDate: "",
                                  averagePurchasePrice: "",
                                  totalInvestedAmount: "",
                                })
                              }
                            />{" "}
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;Recurring</span>
                          </div>
                        </span>
                      </div>
                    )}

                    {isInputInPolicy("SIPStartDate", formData.alternateType) &&
                      checkInputForRecurring(
                        formData.alternateType,
                        true,
                        formData.oneTimeOrRecurring
                      ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div>
                              <span className="lbl-newbond">
                                SIP Start Date *
                              </span>
                              <br />
                            </div>
                            <div className="bonds-datepicker">
                              <FintooDatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={
                                  formData.SIPStartDate === ""
                                    ? ""
                                    : new Date(formData.SIPStartDate)
                                }
                                autoComplete="off"
                                showMonthDropdown
                                showYearDropdown
                                maxDate={new Date()}
                                dropdownMode="select"
                                customClass="datePickerDMF"
                                name="SIPStartDate"
                                onChange={(e) =>
                                  onDateAndSelectInputChange(
                                    "SIPStartDate",
                                    formatDatefun(e)
                                  )
                                }
                                onKeyDown={(e) => e.preventDefault()}
                              />
                            </div>

                            {formData.oneTimeOrRecurring
                              ? simpleValidator.current.message(
                                  "SIPStartDate",
                                  formData.SIPStartDate,
                                  "required",
                                  {
                                    messages: {
                                      required:
                                        "The SIP start date field is required.",
                                    },
                                  }
                                )
                              : ""}
                          </div>
                        </div>
                      )}

                    {isInputInPolicy("SIPAmount", formData.alternateType) &&
                      checkInputForRecurring(
                        formData.alternateType,
                        true,
                        formData.oneTimeOrRecurring
                      ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div>
                              <span className="lbl-newbond">SIP Amount *</span>
                              <br />
                            </div>
                            <input
                              placeholder="Enter SIP Amount"
                              className={` w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                              type="text"
                              value={
                                formData.SIPAmount
                                  ? formatWithCommas(formData.SIPAmount)
                                  : ""
                              }
                              onChange={(e) =>
                                onInputChange(
                                  {
                                    target: {
                                      name: "SIPAmount",
                                      value: e.target.value.replace(/,/g, ""),
                                    },
                                  },
                                  true
                                )
                              }
                            />
                            {simpleValidator.current.message(
                              "SIPAmount",
                              formData.SIPAmount,
                              "required|numeric",
                              {
                                messages: {
                                  required: "The SIP amount field is required.",
                                  numeric: "The SIP amount must be a number.",
                                },
                              }
                            )}
                          </div>
                        </div>
                      )}
                    {isInputInPolicy(
                      "totalInvestedAmount",
                      formData.alternateType
                    ) &&
                      checkInputForRecurring(
                        formData.alternateType,
                        true,
                        formData.oneTimeOrRecurring
                      ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div>
                              <span className="lbl-newbond">
                                Total Invested Amount *
                              </span>
                              <br />
                            </div>
                            <input
                              placeholder="Enter Invested Amount"
                              className="w-100 fntoo-textbox-react inputPlaceholder Rupee-icon"
                              type="text"
                              value={
                                formData.totalInvestedAmount != null
                                  ? formatWithCommas(
                                      formData.totalInvestedAmount
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                onInputChange(
                                  {
                                    target: {
                                      name: "totalInvestedAmount",
                                      value: e.target.value.replace(/,/g, ""),
                                    },
                                  },
                                  true
                                )
                              }
                            />
                            {simpleValidator.current.message(
                              "totalInvestedAmount",
                              getNumericValue(formData.totalInvestedAmount),
                              "required|numeric",
                              {
                                messages: {
                                  required:
                                    "The total invested amount field is required.",
                                  numeric: "Must be a number",
                                },
                              }
                            )}
                          </div>
                        </div>
                      )}

                    {isInputInPolicy(
                      "numberOfUnits",
                      formData.alternateType
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Number Of Units *
                            </span>
                            <br />
                          </div>
                          <input
                            placeholder="Enter Number Of Units"
                            className={` w-100 fntoo-textbox-react inputPlaceholder`}
                            type="text"
                            autoComplete="off"
                            name="numberOfUnits"
                            value={
                              formData.numberOfUnits
                                ? formatWithCommas(formData.numberOfUnits)
                                : ""
                            }
                            onChange={(e) => onInputChange(e, true)}
                          />
                          {simpleValidator.current.message(
                            "numberOfUnits",
                            formData.numberOfUnits,
                            "required|numeric"
                          )}
                        </div>
                      </div>
                    )}

                    {isInputInPolicy(
                      "currentMarketPrice",
                      formData.alternateType
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Current Market Price *
                            </span>
                            <br />
                          </div>
                          <input
                            placeholder="Enter Current Market Price"
                            className={` w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                            type="text"
                            name="currentMarketPrice"
                            autoComplete="off"
                            value={
                              formData.currentMarketPrice
                                ? formatWithCommas(formData.currentMarketPrice)
                                : ""
                            }
                            onChange={(e) => onInputChange(e, true)}
                          />
                          {simpleValidator.current.message(
                            "currentMarketPrice",
                            formData.currentMarketPrice,
                            "required|numeric"
                          )}
                        </div>
                      </div>
                    )}

                    {isInputInPolicy(
                      "numberOfCoins",
                      formData.alternateType
                    ) && (
                      <div
                        className={`${
                          formData.alternateType == "Currency" &&
                          formData.oneTimeOrRecurring
                            ? "col-md-6"
                            : "col-md-12"
                        } 'col-12'`}
                      >
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              {formData?.alternateType == "currency"
                                ? "No. of Units *"
                                : "No. of Shares *"}
                            </span>
                            <br />
                          </div>
                          <input
                            placeholder={
                              formData?.alternateType == "currency"
                                ? "Enter Number Of units"
                                : "Enter Number Of Shares"
                            }
                            className={` w-100 fntoo-textbox-react inputPlaceholder`}
                            type="text"
                            name="numberOfCoins"
                            autoComplete="off"
                            value={
                              formData.numberOfCoins
                                ? formatWithCommas(formData.numberOfCoins)
                                : ""
                            }
                            onChange={(e) => onInputChange(e, true)}
                          />
                          {simpleValidator.current.message(
                            "numberOfCoins",
                            formData.numberOfCoins,
                            "required|numeric"
                          )}
                        </div>
                      </div>
                    )}

                    {isInputInPolicy(
                      "averagePurchasePrice",
                      formData.alternateType
                    ) &&
                      checkInputForRecurring(
                        formData.alternateType,
                        false,
                        formData.oneTimeOrRecurring
                      ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div>
                              <span className="lbl-newbond">
                                Average Purchase Price *
                              </span>
                              <br />
                            </div>
                            <input
                              placeholder="Enter Purchase Price"
                              className={` w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                              type="text"
                              value={
                                formData.averagePurchasePrice
                                  ? formatWithCommas(
                                      formData.averagePurchasePrice
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                onInputChange(
                                  {
                                    target: {
                                      name: "averagePurchasePrice",
                                      value: e.target.value.replace(/,/g, ""),
                                    },
                                  },
                                  true
                                )
                              }
                            />
                            {simpleValidator.current.message(
                              "averagePurchasePrice",
                              formData.averagePurchasePrice,
                              "required|numeric"
                            )}
                          </div>
                        </div>
                      )}

                    {isInputInPolicy(
                      "investedAmount",
                      formData.alternateType
                    ) &&
                      checkInputForRecurring(
                        formData.alternateType,
                        false,
                        formData.oneTimeOrRecurring
                      ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div>
                              <span className="lbl-newbond">
                                Invested Amount
                              </span>
                              <br />
                            </div>
                            <input
                              value={
                                formData.investedAmount
                                  ? formatWithCommas(formData.investedAmount)
                                  : ""
                              }
                              className="w-100 fntoo-textbox-react inputPlaceholder Rupee-icon"
                              disabled
                            />
                          </div>
                        </div>
                      )}

                    {isInputInPolicy(
                      "currentPrice",
                      formData.alternateType
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">Current Price *</span>
                            <br />
                          </div>
                          <input
                            placeholder="Enter Current Price"
                            className={` w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                            type="text"
                            value={
                              formData.currentPrice
                                ? formatWithCommas(formData.currentPrice)
                                : ""
                            }
                            onChange={(e) =>
                              onInputChange(
                                {
                                  target: {
                                    name: "currentPrice",
                                    value: e.target.value.replace(/,/g, ""),
                                  },
                                },
                                true
                              )
                            }
                          />
                          {simpleValidator.current.message(
                            "currentPrice",
                            formData.currentPrice,
                            "required|numeric"
                          )}
                        </div>
                      </div>
                    )}

                    {isInputInPolicy(
                      "currentValue",
                      formData.alternateType
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">Current Value</span>
                            <br />
                          </div>
                          <input
                            value={
                              formData.currentValue
                                ? formatWithCommas(formData.currentValue)
                                : ""
                            }
                            className="w-100 fntoo-textbox-react inputPlaceholder Rupee-icon"
                            disabled
                          />
                        </div>
                      </div>
                    )}

                    {isInputInPolicy("SIPEndDate", formData.alternateType) &&
                      checkInputForRecurring(
                        formData.alternateType,
                        true,
                        formData.oneTimeOrRecurring
                      ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div>
                              <span className="lbl-newbond">
                                SIP End Date *
                              </span>
                              <br />
                            </div>
                            <div className="bonds-datepicker">
                              <FintooDatePicker
                                autoComplete="off"
                                dateFormat="dd/MM/yyyy"
                                selected={
                                  formData.SIPEndDate === ""
                                    ? ""
                                    : new Date(formData.SIPEndDate)
                                }
                                minDate={
                                  formData?.SIPStartDate != ""
                                    ? moment(formData.SIPStartDate)
                                        .add(1, "years")
                                        .toDate()
                                    : moment().add(1, "days").toDate()
                                }
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                customClass="datePickerDMF"
                                name="SIPEndDate"
                                onChange={(e) =>
                                  onDateAndSelectInputChange(
                                    "SIPEndDate",
                                    formatDatefun(e)
                                  )
                                }
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                              />
                            </div>
                            {formData.oneTimeOrRecurring
                              ? simpleValidator.current.message(
                                  "SIPEndDate",
                                  formData.SIPEndDate,
                                  "required",
                                  {
                                    messages: {
                                      required:
                                        "The SIP end date field is required.",
                                    },
                                  }
                                )
                              : ""}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <br />
                <div className="my-md-4">
                  {addForm && (
                    <div className="my-md-4">
                      <button
                        type="submit"
                        className="d-block m-auto btn btn-primary"
                        onClick={() => validateForm()}
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {updateForm && (
                    <div>
                      <button
                        type="submit"
                        className="d-block m-auto btn btn-primary"
                        onClick={() => updateAlternateAsset()}
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NewAlternateAssetsFormView;
