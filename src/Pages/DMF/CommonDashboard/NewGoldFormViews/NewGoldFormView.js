import Select from "react-select";
import { useEffect, useRef, useState } from "react";
import SimpleReactValidator from "simple-react-validator";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { createPortal } from "react-dom";
import style from "./goldForm.module.css";
import {
  ADVISORY_ADD_ASSETS_API,
  ADVISORY_UPDATE_ASSETS_API,
  DATA_BELONGS_TO,
  financialplanningAssetEndpoints,
  userManagementEndpoints,
} from "../../../../constants";
import moment from "moment";
import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  fetchEncryptData,
  getParentUserId,
} from "../../../../common_utilities";
import apiClient from "../../../../FrappeIntegration-Services/services/apiClient";
import { getOtherInvestments } from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";

const numericRegex = new RegExp(/^\d*\.?\d*$/);

// Helper function to format number with commas
const formatNumberWithCommas = (value) => {
  if (!value || value === "" || value === "0") return value;
  const num = String(value).replace(/,/g, "");
  if (isNaN(num)) return value;
  return Number(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

// Helper function to remove commas from formatted number
const removeCommas = (value) => {
  return String(value).replace(/,/g, "");
};

const goldAssetsInputs = {
  default: [
    "numberOfUnits",
    "purchasePrice",
    "investedAmount",
    "currentPrice",
    "currentValue",
  ],
  "Gold ETF": [
    "numberOfUnits",
    "purchasePrice",
    "investedAmount",
    "currentPrice",
    "currentValue",
  ],
  "Gold ETF/MF": [
    "numberOfUnits",
    "purchasePrice",
    "investedAmount",
    "currentPrice",
    "currentValue",
  ],
  "Physical Gold": [
    "dateOfPurchase",
    "numberOfGms",
    "currentPrice",
    "currentValue",
  ],
  "Sovereign Gold Bonds": [
    "numberOfGms",
    "purchasePrice",
    "investedAmount",
    "currentPrice",
    "currentValue",
  ],
  Others: [
    "dateOfPurchase",
    "numberOfGms",
    "totalInvestedValue",
    "currentPrice",
    "currentValue",
  ],
};

function isInputInPolicy(inputName, policyType) {
  if (!policyType || policyType === "" || !goldAssetsInputs[policyType]) {
    policyType = "default";
  }

  // Handle the case where API returns "Gold ETF/MF" but form expects "Gold ETF"
  if (policyType === "Gold ETF/MF") {
    policyType = "Gold ETF";
  }

  return goldAssetsInputs[policyType].includes(inputName);
}

const initialValues = {
  goldType: "",
  userAssetName: "",
  goldMemberName: "",
  numberOfUnits: "",
  purchasePrice: "",
  investedAmount: "",
  currentPrice: "",
  currentValue: "",
  dateOfPurchase: "", // You can use an appropriate date format (e.g., 'YYYY-MM-DD')
  numberOfGms: "",
  totalInvestedValue: "",
};

const options_gold_type = [
  { value: "Gold ETF", label: "Gold ETF" },
  { value: "Physical Gold", label: "Physical Gold" },
  { value: "Sovereign Gold Bonds", label: "Sovereign Gold Bonds" },
  { value: "Others", label: "Others" },
];

const NewGoldFormView = () => {
  const [, forceUpdate] = useState();
  const [investedamount, setInvestedAmount] = useState("");
  const [currentvalue, setCurrentValue] = useState("");
  const [formData, setFormData] = useState(initialValues);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const simpleValidator = useRef(new SimpleReactValidator());
  const { id } = useParams();
  const dispatch = useDispatch();
  const [familyData, setFamilyData] = useState([]);
  const [isLoadingFamilyData, setIsLoadingFamilyData] = useState(true);

  const [goldDetails, setGoldDetails] = useState({
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
  const [assetCategories, setAssetCategories] = useState(null);

  const onInputChange = (e, isNumeric) => {
    const name = e.target.name;
    let value = e.target.value;

    // Remove commas for validation and storage
    const cleanValue = removeCommas(value);

    if (isNumeric && !numericRegex.test(cleanValue) && cleanValue !== "") {
      return;
    }

    // Allow 0 to be entered but it will be validated later
    setFormData({ ...formData, [name]: cleanValue });
  };

  const onDateAndSelectInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    simpleValidator.current.showMessages();
    forceUpdate(1);

    // Custom validation for numeric fields to ensure they are greater than 0
    let hasValidationErrors = false;

    // Check numeric fields based on gold type
    if (formData.goldType === "Gold ETF") {
      if (formData.numberOfUnits && Number(formData.numberOfUnits) <= 0) {
        simpleValidator.current.showMessageFor("numberOfUnits");
        hasValidationErrors = true;
      }
      if (formData.purchasePrice && Number(formData.purchasePrice) <= 0) {
        simpleValidator.current.showMessageFor("purchasePrice");
        hasValidationErrors = true;
      }
      if (formData.currentPrice && Number(formData.currentPrice) <= 0) {
        simpleValidator.current.showMessageFor("currentPrice");
        hasValidationErrors = true;
      }
    }

    if (formData.goldType === "Physical Gold") {
      if (formData.numberOfGms && Number(formData.numberOfGms) <= 0) {
        simpleValidator.current.showMessageFor("numberOfGms");
        hasValidationErrors = true;
      }
      if (formData.currentPrice && Number(formData.currentPrice) <= 0) {
        simpleValidator.current.showMessageFor("currentPrice");
        hasValidationErrors = true;
      }
    }

    if (formData.goldType === "Sovereign Gold Bonds") {
      if (formData.numberOfGms && Number(formData.numberOfGms) <= 0) {
        simpleValidator.current.showMessageFor("numberOfGms");
        hasValidationErrors = true;
      }
      if (formData.purchasePrice && Number(formData.purchasePrice) <= 0) {
        simpleValidator.current.showMessageFor("purchasePrice");
        hasValidationErrors = true;
      }
      if (formData.currentPrice && Number(formData.currentPrice) <= 0) {
        simpleValidator.current.showMessageFor("currentPrice");
        hasValidationErrors = true;
      }
    }

    if (formData.goldType === "Others") {
      if (!formData.userAssetName?.trim()) {
        simpleValidator.current.showMessageFor("userAssetName");
        hasValidationErrors = true;
      }
      if (formData.numberOfGms && Number(formData.numberOfGms) <= 0) {
        simpleValidator.current.showMessageFor("numberOfGms");
        hasValidationErrors = true;
      }
      if (
        formData.totalInvestedValue &&
        Number(formData.totalInvestedValue) <= 0
      ) {
        simpleValidator.current.showMessageFor("totalInvestedValue");
        hasValidationErrors = true;
      }
      if (formData.currentPrice && Number(formData.currentPrice) <= 0) {
        simpleValidator.current.showMessageFor("currentPrice");
        hasValidationErrors = true;
      }
    }

    // No validation needed for auto-calculated fields - they always show meaningful values

    const isValid = simpleValidator.current.allValid() && !hasValidationErrors;

    if (isValid == true) {
      addgold();
    } else {
      // Show specific error message for 0 values
      if (hasValidationErrors) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Please ensure all numeric values are greater than 0",
            type: "error",
          },
        });
      }
    }
  };

  const getGoldTypeData = (insuranceTypeData, label) => {
    // Handle the case where API returns "Gold ETF/MF" but form expects "Gold ETF"
    if (label === "Gold ETF/MF") {
      label = "Gold ETF";
    }
    return insuranceTypeData.find((data) => data.label === label);
  };

  // Helper function to check if a numeric value is valid (greater than 0)
  const isValueValid = (value) => {
    return value && Number(value) > 0;
  };

  useEffect(() => {
    getFamilyMembers();
  }, []);

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

  useEffect(() => {

    // Calculate invested amount when we have units and purchase price
    if (formData?.goldType) {
      let shouldCalculateInvested = false;
      let shouldCalculateCurrent = false;

      // Check conditions for calculating invested amount
      if (
        formData?.goldType === "Gold ETF" &&
        formData?.numberOfUnits &&
        formData?.purchasePrice
      ) {
        shouldCalculateInvested = true;
      }
      if (
        formData?.goldType === "Sovereign Gold Bonds" &&
        formData?.numberOfGms &&
        formData?.purchasePrice
      ) {
        shouldCalculateInvested = true;
      }
      if (formData?.goldType === "Physical Gold" && formData?.currentPrice) {
        shouldCalculateCurrent = true;
      }
      if (
        formData?.goldType === "Others" &&
        formData?.currentPrice &&
        formData?.totalInvestedValue
      ) {
        shouldCalculateCurrent = true;
      }

      // Calculate current value when we have current price and units
      if (
        formData?.currentPrice &&
        ((formData?.goldType === "Gold ETF" && formData?.numberOfUnits) ||
          (formData?.goldType === "Sovereign Gold Bonds" &&
            formData?.numberOfGms) ||
          (formData?.goldType === "Physical Gold" && formData?.numberOfGms) ||
          (formData?.goldType === "Others" && formData?.numberOfGms))
      ) {
        shouldCalculateCurrent = true;
      }

      if (shouldCalculateInvested || shouldCalculateCurrent) {
        reqdata();
      } else {
        console.log("Not calling reqdata() - conditions not met");
        // Only reset calculated values when required fields are missing AND we're not in edit mode
        // In edit mode, we want to preserve the existing values from the API
        if (!id) {
          setInvestedAmount("");
          setCurrentValue("");
        } else {
          console.log("Preserving calculated values (in edit mode)");
        }
      }
    } else {
      console.log("No gold type selected, skipping calculations");
    }
  }, [
    formData?.purchasePrice,
    formData?.goldType,
    formData?.numberOfGms,
    formData?.currentPrice,
    formData?.karat,
    formData?.numberOfUnits,
    formData?.totalInvestedValue,
    id,
  ]);

  useEffect(() => {
    if (id != undefined) {
      const decodedId = atob(id);
      fetchAssetData(decodedId);
    } else {
      console.log("Not in edit mode, skipping asset data fetch");
    }
  }, [id]);

  // Debug useEffect to log form data changes
  useEffect(() => {
  }, [formData, investedamount, currentvalue]);

  // Debug useEffect to log gold details changes
  useEffect(() => {
  }, [goldDetails]);

  const handleGoldMember = (selectedOption) => {
    setFormData({
      ...formData,
      goldMemberName: selectedOption.value,
    });
  };

  const fetchAssetData = async (assetId) => {
    try {
      // Use the service function to fetch asset details
      const response = await getOtherInvestments({
        user_id: getParentUserId(),
      });

      // Try different possible structures for the assets array
      let allAssets = [];
      if (Array.isArray(response.data?.data?.listing)) {
        allAssets = response.data.data.listing;
      } else if (Array.isArray(response.data?.listing)) {
        allAssets = response.data.listing;
      } else if (Array.isArray(response.data)) {
        allAssets = response.data;
      } else if (Array.isArray(response.data?.data)) {
        allAssets = response.data.data;
      }

      // Find the specific asset by its ID (try multiple possible fields)
      const assetDetails = allAssets.find(
        (item) =>
          item.name === assetId ||
          item.id === assetId ||
          item.asset_id === assetId
      );

      if (assetDetails) {

        // Map the API asset name to the form gold type
        const mapAssetNameToGoldType = (assetName) => {
          if (assetName === "Gold ETF/MF") return "Gold ETF";
          if (assetName === "Physical Gold") return "Physical Gold";
          if (assetName === "Sovereign Gold Bonds")
            return "Sovereign Gold Bonds";
          if (assetName === "Others") return "Others";
          return "Others";
        };

        const goldType = mapAssetNameToGoldType(assetDetails.user_asset_name);

        // Calculate invested amount from available data
        const investedAmount =
          assetDetails.user_asset_investment_amount ||
          assetDetails.user_asset_avg_purchase_price *
            assetDetails.user_asset_quantity ||
          0;

        // Convert date format from API (DD/MM/YYYY) to form format (YYYY-MM-DD for date picker)
        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          try {
            return moment(dateStr, "DD/MM/YYYY").isValid()
              ? moment(dateStr, "DD/MM/YYYY").format("YYYY-MM-DD")
              : "";
          } catch {
            return "";
          }
        };

        // For "Others" category, use user_asset_investment_amount directly as totalInvestedValue
        const totalInvestedValue =
          goldType === "Others"
            ? assetDetails.user_asset_investment_amount
            : investedAmount;

        // Map the new API response fields to form data
        setFormData((prevFormData) => ({
          ...prevFormData,
          goldType: goldType,
          userAssetName:
            goldType === "Others" &&
            assetDetails.user_asset_name !== "Others" &&
            assetDetails.user_asset_name
              ? assetDetails.user_asset_name
              : "",
          numberOfUnits: assetDetails.user_asset_quantity || "",
          numberOfGms: assetDetails.user_asset_quantity || "",
          // For Others category, don't set purchasePrice since it's not collected
          purchasePrice:
            goldType === "Others"
              ? ""
              : assetDetails.user_asset_avg_purchase_price || "",
          currentValue: assetDetails.user_asset_current_amount || "",
          currentPrice: assetDetails.user_asset_current_price || "",
          dateOfPurchase: formatDate(assetDetails.user_asset_purchase_date),
          totalInvestedValue: totalInvestedValue,
          goldMemberName: assetDetails.user_asset_for || "",
        }));

        // Set investedAmount for all categories except Others (which uses totalInvestedValue directly)
        // Physical Gold should also use user_asset_investment_amount for consistency in table display
        if (goldType !== "Others") {
          setInvestedAmount(investedAmount);
        }
        setCurrentValue(assetDetails.user_asset_current_amount || 0);
      }
    } catch (error) {
      console.error("Error fetching asset data:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient(
          financialplanningAssetEndpoints.GET_USER_ASSET_CATEGORIES,
          { method: "GET" }
        );
        setAssetCategories(response);
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Set a fallback structure to prevent null values
        setAssetCategories({
          data: [
            {
              category_list: [
                {
                  asset_name: "Commodity",
                  asset_id: 1,
                  asset_name_uuid: "commodity-uuid",
                  subcategories: [
                    {
                      asset_sub_name: "Gold ETF/MF",
                      asset_sub_id: 1,
                      asset_sub_name_uuid: "gold-etf-uuid",
                    },
                    {
                      asset_sub_name: "Physical Gold",
                      asset_sub_id: 2,
                      asset_sub_name_uuid: "physical-gold-uuid",
                    },
                    {
                      asset_sub_name: "Sovereign Gold Bonds",
                      asset_sub_id: 3,
                      asset_sub_name_uuid: "sovereign-gold-bonds-uuid",
                    },
                    {
                      asset_sub_name: "Others",
                      asset_sub_id: 4,
                      asset_sub_name_uuid: "others-uuid",
                    },
                  ],
                },
              ],
            },
          ],
        });
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {

    if (!formData.goldType || !assetCategories) return;

    const categories = assetCategories?.data?.[0]?.category_list || [];
    let found = null;

    // Find the Commodity category
    const commodityCategory = categories.find(
      (cat) => cat.asset_name === "Commodity"
    );

    if (commodityCategory) {
      // Map gold types to their corresponding subcategory names in the API
      const goldTypeMapping = {
        "Gold ETF": "Gold ETF/MF",
        "Physical Gold": "Physical Gold",
        "Sovereign Gold Bonds": "Sovereign Gold Bonds",
        Others: "Others",
      };

      const mappedSubcategoryName = goldTypeMapping[formData.goldType];

      if (mappedSubcategoryName) {
        const subcategory = commodityCategory.subcategories.find(
          (sub) => sub.asset_sub_name === mappedSubcategoryName
        );

        if (subcategory) {
          // For gold assets, we only set category and subcategory details
          // We don't set asset type details since gold assets don't have specific asset types
          found = {
            asset_id: commodityCategory.asset_id,
            asset_name: commodityCategory.asset_name,
            asset_name_uuid: commodityCategory.asset_name_uuid,

            asset_sub_id: subcategory.asset_sub_id,
            asset_sub_name: subcategory.asset_sub_name,
            asset_sub_name_uuid: subcategory.asset_sub_name_uuid,

            // For gold assets, we don't set asset type details
            asset_type_id: null,
            asset_type_name: null,
            asset_type_name_uuid: null,
          };
        }
      }

      // If we still haven't found a subcategory, try to find it directly by the form gold type
      if (!found && formData.goldType) {
        const directSubcategory = commodityCategory.subcategories.find(
          (sub) => sub.asset_sub_name === formData.goldType
        );

        if (directSubcategory) {
          found = {
            asset_id: commodityCategory.asset_id,
            asset_name: commodityCategory.asset_name,
            asset_name_uuid: commodityCategory.asset_name_uuid,

            asset_sub_id: directSubcategory.asset_sub_id,
            asset_sub_name: directSubcategory.asset_sub_name,
            asset_sub_name_uuid: directSubcategory.asset_sub_name_uuid,

            // For gold assets, we don't set asset type details
            asset_type_id: null,
            asset_type_name: null,
            asset_type_name_uuid: null,
          };
        }
      }
    }

    if (found) {
      setGoldDetails(found);
    } else {
      // Set fallback values instead of null to prevent API issues
      const fallbackValues = {
        asset_id: 1,
        asset_name: "Commodity",
        asset_name_uuid: "commodity-uuid",

        asset_sub_id:
          formData.goldType === "Gold ETF"
            ? 1
            : formData.goldType === "Physical Gold"
            ? 2
            : formData.goldType === "Sovereign Gold Bonds"
            ? 3
            : 4,
        asset_sub_name: formData.goldType,
        asset_sub_name_uuid:
          formData.goldType === "Gold ETF"
            ? "gold-etf-uuid"
            : formData.goldType === "Physical Gold"
            ? "physical-gold-uuid"
            : formData.goldType === "Sovereign Gold Bonds"
            ? "sovereign-gold-bonds-uuid"
            : "others-uuid",

        asset_type_id: null,
        asset_type_name: null,
        asset_type_name_uuid: null,
      };
      console.log("Setting fallback gold details:", fallbackValues);
      setGoldDetails(fallbackValues);
    }
  }, [formData.goldType, assetCategories]);

  const reqdata = async () => {
    try {
      // Only validate fields that are currently being used for calculations
      const validateNumericField = (value, fieldName) => {
        if (value && Number(value) <= 0) {
          throw new Error(`${fieldName} must be greater than 0`);
        }
      };

      // Validate fields based on what we're calculating
      if (formData.goldType === "Gold ETF") {
        if (formData.purchasePrice && formData.numberOfUnits) {
          validateNumericField(formData.purchasePrice, "Purchase Price");
        }
        if (formData.currentPrice && formData.numberOfUnits) {
          validateNumericField(formData.currentPrice, "Current Price");
        }
      }

      if (formData.goldType === "Physical Gold") {
        if (formData.currentPrice && formData.numberOfGms) {
          validateNumericField(formData.currentPrice, "Current Price");
        }
      }

      if (formData.goldType === "Sovereign Gold Bonds") {
        if (formData.purchasePrice && formData.numberOfGms) {
          validateNumericField(formData.purchasePrice, "Purchase Price");
        }
        if (formData.currentPrice && formData.numberOfGms) {
          validateNumericField(formData.currentPrice, "Current Price");
        }
      }

      if (formData.goldType === "Others") {
        if (formData.totalInvestedValue) {
          validateNumericField(
            formData.totalInvestedValue,
            "Total Invested Value"
          );
        }
        if (formData.currentPrice && formData.numberOfGms) {
          validateNumericField(formData.currentPrice, "Current Price");
        }
      }

      // Build the new API body format
      let goldformData = {
        user_asset_name:
          formData.goldType === "Others"
            ? formData.userAssetName.trim()
            : goldDetails.asset_sub_name || formData.goldType,
        asset_cat_id: goldDetails.asset_id,
        asset_name_uuid: goldDetails.asset_name_uuid, // Required by API
        asset_sub_cat_id: goldDetails.asset_sub_id,
        asset_sub_name_uuid: goldDetails.asset_sub_name_uuid, // Adding for completeness
        user_asset_for: formData.goldMemberName,
        user_asset_automated_linkage: 0,
        user_asset_user_id: getParentUserId(),
        user_asset_currency: "INR",
        user_asset_allocation: "N",
        user_asset_installment_paid: "NA", // Required field for gold assets
        user_asset_occurance: "One Time", // Adding this as it might be required too

        // Required fields for all assets (both new and edit)
        user_asset_context: "Individual",
        user_asset_source: "Manual",
        data_belongs_to: DATA_BELONGS_TO,
        user_asset_recommended: "N",
      };

      // For gold assets, we don't set asset_type_name_uuid and user_asset_type_id
      // since gold assets don't have specific asset types in the API
      // Only set these if they are not null and not the same as subcategory
      if (
        goldDetails.asset_type_id &&
        goldDetails.asset_type_id !== goldDetails.asset_sub_id
      ) {
        goldformData.user_asset_type_id = goldDetails.asset_type_id;
      }

      if (
        goldDetails.asset_type_name_uuid &&
        goldDetails.asset_type_name_uuid !== goldDetails.asset_sub_name_uuid
      ) {
        goldformData.asset_type_name_uuid = goldDetails.asset_type_name_uuid;
      }

      // Set purchase date in DD/MM/YYYY format as expected by API
      goldformData["user_asset_purchase_date"] =
        formData.dateOfPurchase === "" || formData.dateOfPurchase === null
          ? moment().format("DD/MM/YYYY")
          : moment(formData.dateOfPurchase).format("DD/MM/YYYY");

      // Get asset units for reference
      const asset_units = formData.numberOfGms || formData.numberOfUnits || 0;

      // Set gold-specific fields based on gold type
      if (formData.goldType === "Sovereign Gold Bonds") {
        goldformData["user_asset_quantity"] = formData.numberOfGms;
        goldformData["user_asset_avg_purchase_price"] = formData.purchasePrice;
        goldformData["user_asset_current_price"] = formData.currentPrice;

        // Calculate invested amount when we have units and purchase price
        if (formData.numberOfGms && formData.purchasePrice) {
          const totalInvestedAmount =
            Number(formData.numberOfGms) * Number(formData.purchasePrice);
          goldformData["user_asset_investment_amount"] = totalInvestedAmount;
          setInvestedAmount(totalInvestedAmount);
        }

        // Calculate current value when we have current price and units
        if (formData.currentPrice && formData.numberOfGms) {
          const totalCurrentAmount =
            Number(formData.numberOfGms) * Number(formData.currentPrice);
          goldformData["user_asset_current_amount"] = totalCurrentAmount;
          setCurrentValue(totalCurrentAmount);
        }
      }

      if (formData.goldType === "Gold ETF") {
        goldformData["user_asset_quantity"] = formData.numberOfUnits;
        goldformData["user_asset_avg_purchase_price"] = formData.purchasePrice;
        goldformData["user_asset_current_price"] = formData.currentPrice;

        // Calculate invested amount when we have units and purchase price
        if (formData.numberOfUnits && formData.purchasePrice) {
          const totalInvestedAmount =
            Number(formData.numberOfUnits) * Number(formData.purchasePrice);
          goldformData["user_asset_investment_amount"] = totalInvestedAmount;
          setInvestedAmount(totalInvestedAmount);
        } else {
          console.log(
            "Cannot calculate invested amount - missing units or purchase price"
          );
        }

        // Calculate current value when we have current price and units
        if (formData.currentPrice && formData.numberOfUnits) {
          const totalCurrentAmount =
            Number(formData.numberOfUnits) * Number(formData.currentPrice);
          goldformData["user_asset_current_amount"] = totalCurrentAmount;
          setCurrentValue(totalCurrentAmount);
        } else {
          console.log(
            "Cannot calculate current value - missing current price or units"
          );
        }
      }

      if (formData.goldType === "Physical Gold") {
        goldformData["user_asset_quantity"] = formData.numberOfGms;
        goldformData["user_asset_current_price"] = formData.currentPrice;

        // Calculate current value when we have current price and units
        if (formData.currentPrice && formData.numberOfGms) {
          const totalCurrentAmount =
            Number(formData.numberOfGms) * Number(formData.currentPrice);
          goldformData["user_asset_current_amount"] = totalCurrentAmount;
          setCurrentValue(totalCurrentAmount);
        }
        // Note: Physical Gold doesn't collect purchase price, so no invested amount to calculate
      }

      if (formData.goldType === "Others") {
        goldformData["user_asset_quantity"] = formData.numberOfGms;
        goldformData["user_asset_current_price"] = formData.currentPrice;

        // For Others category, use the manually entered total invested value
        if (formData.totalInvestedValue) {
          const totalInvestedValue = Number(formData.totalInvestedValue);
          goldformData["user_asset_investment_amount"] = totalInvestedValue;
          // Set avg purchase price to 0 since we don't collect purchase price per gram for Others
          goldformData["user_asset_avg_purchase_price"] = 0;
        }

        // Calculate current value when we have current price and units
        if (formData.currentPrice && formData.numberOfGms) {
          const totalCurrentAmount =
            Number(formData.numberOfGms) * Number(formData.currentPrice);
          goldformData["user_asset_current_amount"] = totalCurrentAmount;
          setCurrentValue(totalCurrentAmount);
        }
      }

      // For edit mode, include asset_id for PUT API
      if (id !== undefined) {
        goldformData["asset_id"] = atob(id);
      }

      return goldformData;
    } catch (e) {
      console.error("Error in reqdata:", e);
      return null;
    }
  };

  const addgold = async () => {
    try {
      let response;
      let goldAssetData = await reqdata();

      if (!goldAssetData) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Error processing form data. Please try again.",
            type: "error",
          },
        });
        return;
      }

      // reqdata will always return data now, even if units are 0

      if (id !== undefined) {
        // Update existing gold asset using PUT method
        response = await apiClient(ADVISORY_UPDATE_ASSETS_API, {
          method: "PUT",
          body: JSON.stringify(goldAssetData),
        });
      } else {
        // Add new gold asset
        response = await apiClient(ADVISORY_ADD_ASSETS_API, {
          method: "POST",
          body: JSON.stringify(goldAssetData),
        });
      }

      if (
        response &&
        (response.status_code === 200 || response.status_code === "200")
      ) {
        if (id !== undefined) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Gold Asset Updated Successfully!",
              type: "success",
            },
          });
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Gold Asset Added Successfully!",
              type: "success",
            },
          });
        }

        // Navigate back to portfolio dashboard with refresh parameter
        navigate(
          process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard/?assetTabNumber=7&refresh=true"
        );
      } else {
        // Handle API error response
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message:
              response?.message ||
              "Failed to save gold asset. Please try again.",
            type: "error",
          },
        });
      }
    } catch (error) {
      console.error("Error saving gold asset:", error);

      // Check if it's a validation error
      if (error.message && error.message.includes("must be greater than 0")) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: error.message,
            type: "error",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message:
              "An error occurred while saving the gold asset. Please try again.",
            type: "error",
          },
        });
      }
    }
  };

  const emptystates = () => {
    setFormData((prevformData) => ({
      ...prevformData,
      userAssetName: "",
      purchasePrice: "",
      numberOfGms: "",
      currentPrice: "",
      dateOfPurchase: "",
      numberOfUnits: "",
      // Don't reset totalInvestedValue for Others category since it's the primary input
      totalInvestedValue:
        prevformData.goldType === "Others"
          ? prevformData.totalInvestedValue
          : "",
    }));
    // Only reset calculated values when gold type changes AND we're not in edit mode
    // In edit mode, we want to preserve the existing values from the API
    if (!id) {
      setInvestedAmount("");
      setCurrentValue("");
    }
  };

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
  simpleValidator.current.purgeFields();

  return (
    <>
      {showInfo &&
        createPortal(
          <div className={`${style.popupBackdrop}`}></div>,
          document.body
        )}
      <div className="px-0 px-md-4 assetForm">
        <div
          className="p-3"
          style={{ border: "1px solid #d8d8d8", borderRadius: 10 }}
        >
          <div className="d-flex">
            <Link
              to={
                process.env.PUBLIC_URL +
                "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=7"
              }
            >
              {" "}
              <img
                style={{
                  transform: "rotate(180deg)",
                }}
                width={20}
                height={20}
                src={process.env.PUBLIC_URL + "/static/media/icons/chevron.svg"}
              />
            </Link>
            <h3
              className="text-center pb-0 mb-0 ps-2"
              style={{
                flexGrow: 1,
              }}
            >
              {id ? "Edit Your Gold Asset" : "Add Your Gold Assets"}
            </h3>
          </div>
          <hr style={{ color: "#afafaf" }} />
          <div className="row">
            <div className="col-12 col-md-11 col-lg-8 m-auto">
              <p className="text-center">
                {id
                  ? "Enter Your Details"
                  : "Enter Your Details To Add Existing Gold Assets"}
              </p>
              <br />
              <br />
              <div>
                <div className="my-md-4">
                  <div>
                    <span className="lbl-newbond">Select Gold Type *</span>
                    <br />
                    <Select
                      className="fnto-dropdown-react"
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      options={options_gold_type}
                      value={getGoldTypeData(
                        options_gold_type,
                        formData.goldType
                      )}
                      name="goldType"
                      onChange={(e) => {
                        onDateAndSelectInputChange("goldType", e.label),
                          emptystates();
                      }}
                    />
                    {simpleValidator.current.message(
                      "goldType",
                      formData.goldType,
                      "required"
                    )}
                  </div>
                </div>
                {formData.goldType === "Others" && (
                  <div className="my-md-4">
                    <div>
                      <span className="lbl-newbond">
                        Enter Other Investment Name *
                      </span>
                      <br />
                      <input
                        placeholder="Enter investment name"
                        className="w-100 fntoo-textbox-react"
                        type="text"
                        name="userAssetName"
                        value={formData.userAssetName}
                        onChange={(e) => onInputChange(e, false)}
                      />
                      {simpleValidator.current.message(
                        "userAssetName",
                        formData.userAssetName,
                        "required"
                      )}
                    </div>
                  </div>
                )}
                <div className="my-md-4">
                  <div className="">
                    <span className="lbl-newbond">
                      Who Is This Investment For*
                    </span>
                    <br />
                    <Select
                      className={`fnto-dropdown-react`}
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={familyData}
                      name="goldMemberName"
                      onChange={handleGoldMember}
                      value={
                        familyData.find(
                          (v) => v.value == formData.goldMemberName
                        ) || null
                      }
                      isLoading={isLoadingFamilyData}
                      placeholder={
                        isLoadingFamilyData ? "Loading..." : "Select member"
                      }
                      noOptionsMessage={() => "No family members found"}
                    />

                    {simpleValidator.current.message(
                      "goldMemberName",
                      formData.goldMemberName,
                      "required"
                    )}
                  </div>
                </div>
                <div>
                  <div
                    className="row"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    {isInputInPolicy("numberOfUnits", formData.goldType) && (
                      <div className="col-md-12 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Number Of Units *
                            </span>
                            <br />
                            <span style={{ position: "relative" }}>
                              <input
                                placeholder="Enter Number Of Units"
                                className={` w-100 fntoo-textbox-react`}
                                type="text"
                                name="numberOfUnits"
                                value={formatNumberWithCommas(
                                  formData.numberOfUnits
                                )}
                                onChange={(e) => onInputChange(e, true)}
                              />
                              <span
                                className={`${style.infoIcon}`}
                                style={{ zIndex: showInfo ? "100" : "0" }}
                                onMouseEnter={() => setShowInfo(true)}
                                onMouseLeave={() => setShowInfo(false)}
                              >
                                <AiOutlineInfoCircle />
                              </span>
                              {simpleValidator.current.message(
                                "numberOfUnits",
                                formData.numberOfUnits,
                                "required"
                              )}
                              {formData.numberOfUnits &&
                                Number(formData.numberOfUnits) <= 0 && (
                                  <div className="text-danger small">
                                    Value must be greater than 0
                                  </div>
                                )}
                            </span>
                            {showInfo && (
                              <div className={`${style.popupElem}`}>
                                <b>Note:</b>
                                <br />
                                We are taking the units to calculate the exact
                                value and return for your investment according
                                to current market price.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {isInputInPolicy("dateOfPurchase", formData.goldType) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Date Of Purchase
                            </span>
                            <br />
                            <div className="bonds-datepicker">
                              <FintooDatePicker
                                dateFormat="yyyy/MM/dd"
                                selected={
                                  formData.dateOfPurchase === ""
                                    ? ""
                                    : new Date(formData.dateOfPurchase)
                                }
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                name="dateOfPurchase"
                                maxDate={new Date()}
                                customClass="datePickerDMF"
                                onChange={(e) =>
                                  onDateAndSelectInputChange(
                                    "dateOfPurchase",
                                    formatDatefun(e)
                                  )
                                }
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                              />
                            </div>

                            {/* {simpleValidator.current.message('purchasePrice', formData.dateOfPurchase, 'required')} */}
                          </div>
                        </div>
                      </div>
                    )}

                    {isInputInPolicy("numberOfGms", formData.goldType) && (
                      <div
                        className={`col-md-${
                          formData.goldType === "Physical Gold" ||
                          formData.goldType === "Others"
                            ? "6"
                            : "12"
                        } col-12`}
                      >
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">Number Of Gms *</span>
                            <br />
                            <input
                              placeholder="Enter Number Of Gms"
                              className={` w-100 fntoo-textbox-react ${style.rupeeIcon}`}
                              type="text"
                              name="numberOfGms"
                              value={formatNumberWithCommas(
                                formData.numberOfGms
                              )}
                              onChange={(e) => onInputChange(e, true)}
                              autoComplete="off"
                            />
                            {simpleValidator.current.message(
                              "numberOfGms",
                              formData.numberOfGms,
                              "required|numeric"
                            )}
                            {formData.numberOfGms &&
                              Number(formData.numberOfGms) <= 0 && (
                                <div className="text-danger small">
                                  Value must be greater than 0
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                    {isInputInPolicy(
                      "totalInvestedValue",
                      formData.goldType
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Total Invested Value *
                            </span>
                            <br />
                            <input
                              placeholder="Enter Total Invested Value"
                              className={` w-100 fntoo-textbox-react ${style.rupeeIcon}`}
                              type="text"
                              name="totalInvestedValue"
                              value={formatNumberWithCommas(
                                formData.goldType === "Others"
                                  ? formData.totalInvestedValue
                                  : investedamount
                                  ? investedamount
                                  : formData.totalInvestedValue
                              )}
                              onChange={(e) => onInputChange(e, true)}
                              autoComplete="off"
                            />
                            {formData.goldType === "Others"
                              ? simpleValidator.current.message(
                                  "totalInvestedValue",
                                  formData.totalInvestedValue,
                                  "required|numeric"
                                )
                              : investedamount
                              ? ""
                              : simpleValidator.current.message(
                                  "totalInvestedValue",
                                  formData.totalInvestedValue,
                                  "required|numeric"
                                )}
                            {formData.totalInvestedValue &&
                              Number(formData.totalInvestedValue) <= 0 && (
                                <div className="text-danger small">
                                  Value must be greater than 0
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                    {isInputInPolicy("purchasePrice", formData.goldType) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Purchase Price (Per Gm) *
                            </span>
                            <br />
                            <input
                              placeholder="Enter Purchase Price"
                              className={` w-100 fntoo-textbox-react ${style.rupeeIcon}`}
                              type="text"
                              name="purchasePrice"
                              value={formatNumberWithCommas(
                                formData.purchasePrice
                              )}
                              onChange={(e) => onInputChange(e, true)}
                              autoComplete="off"
                            />
                            {simpleValidator.current.message(
                              "purchasePrice",
                              formData.purchasePrice,
                              "required|numeric"
                            )}
                            {formData.purchasePrice &&
                              Number(formData.purchasePrice) <= 0 && (
                                <div className="text-danger small">
                                  Value must be greater than 0
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                    {isInputInPolicy("investedAmount", formData.goldType) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">Invested Amount</span>
                            <br />
                            <input
                              placeholder="0"
                              className={` w-100 fntoo-textbox-react ${style.rupeeIcon}`}
                              type="text"
                              name="investedAmount"
                              // value={formData.investedAmount}
                              value={formatNumberWithCommas(investedamount)}
                              onChange={(e) => onInputChange(e, true)}
                              autoComplete="off"
                            />
                          </div>
                          {simpleValidator.current.message(
                            "purchaseValue",
                            formData.investedAmount,
                            "numeric"
                          )}
                        </div>
                      </div>
                    )}

                    {isInputInPolicy("currentPrice", formData.goldType) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Current Price (Per Gm) *
                            </span>
                            <br />
                            <input
                              placeholder="Enter Current Price"
                              className={` w-100 fntoo-textbox-react ${style.rupeeIcon}`}
                              type="text"
                              name="currentPrice"
                              value={formatNumberWithCommas(
                                formData.currentPrice
                              )}
                              onChange={(e) => onInputChange(e, true)}
                              autoComplete="off"
                            />
                          </div>
                          {simpleValidator.current.message(
                            "currentPrice",
                            formData.currentPrice,
                            "required|numeric"
                          )}
                          {formData.currentPrice &&
                            Number(formData.currentPrice) <= 0 && (
                              <div className="text-danger small">
                                Value must be greater than 0
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    {isInputInPolicy("currentValue", formData.goldType) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">Current Value</span>
                            <br />
                            <input
                              placeholder="0"
                              className={` w-100 fntoo-textbox-react ${style.rupeeIcon}`}
                              type="text"
                              name="currentValue"
                              value={formatNumberWithCommas(currentvalue)}
                              onChange={(e) => onInputChange(e, true)}
                              autoComplete="off"
                            />
                          </div>
                          {simpleValidator.current.message(
                            "pincode",
                            formData.currentValue,
                            "numeric"
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <br />
                <div className="my-md-4">
                  <button
                    type="submit"
                    className="d-block m-auto btn btn-primary"
                    onClick={() => {
                      validateForm();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NewGoldFormView;
