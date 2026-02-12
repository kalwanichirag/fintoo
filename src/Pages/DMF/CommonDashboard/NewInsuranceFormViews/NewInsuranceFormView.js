import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import FormSwitch from "../CommonDashboardComponents/formSwitch";
import RecurringMaturityComponent from "./RecurringMaturityComponent";
import AddBonusComponent from "./AddBonusComponent";
import SimpleReactValidator from "simple-react-validator";
import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ADVISORY_GET_ULIP_DATA,
  DATA_BELONGS_TO,
  financialplanningInsuranceEndpoints,
} from "../../../../constants";
import {
  getParentUserId,
  loginRedirectGuest,
  getItemLocal,
  getUserId,
  getFpUserDetailsId,
} from "../../../../common_utilities";
import uuid from "react-uuid";
import moment from "moment";
import apiClient from "../../../../FrappeIntegration-Services/services/apiClient";
import {
  addInsuranceDetails,
  getInsuranceCategoryList,
  getInsuranceUlipList,
} from "../../../../FrappeIntegration-Services/services/financial-planning-api/insurance";

const numericRegex = new RegExp(/^\d*\.?\d*$/);

const policyInputs = {
  default: [
    "insurance_name",
    "insurance_policy_number",
    "insurance_premium_amount",
    "premiumPaymentFrequency",
    "insurance_sum_assured",
    "insurance_surrender_value",
    "dateOfPurchase",
    "premiumPaymentEndDate",
    "insurance_policyterm",
    "insurance_policyterm",
    "recurring_insurance",
    "addBonus",
    "maturityBonus",
  ],
  45: [
    "insurance_name",
    "insurance_policy_number",
    "insurance_premium_amount",
    "premiumPaymentFrequency",
    "insurance_sum_assured",
    "insurance_surrender_value",
    "dateOfPurchase",
    "premiumPaymentEndDate",
    "insurance_policyterm",
    "insurance_policyterm",
    "recurring_insurance",
    "addBonus",
    "maturityBonus",
  ],
  46: [
    "insurance_name",
    "insurance_policy_number",
    "insurance_premium_amount",
    "premiumPaymentFrequency",
    "insurance_sum_assured",
    "insurance_surrender_value",
    "dateOfPurchase",
    "premiumPaymentEndDate",
    "insurance_policyterm",
    "insurance_policyterm",
    "recurring_insurance",
    "addBonus",
    "maturityBonus",
  ],
  49: [
    "insurance_name",
    "insurance_policy_number",
    "insurance_premium_amount",
    "premiumPaymentFrequency",
    "insurance_sum_assured",
    "insurance_surrender_value",
    "dateOfPurchase",
    "premiumPaymentEndDate",
    "insurance_policyterm",
    "insurance_policyterm",
    "recurring_insurance",
    "addBonus",
    "maturityBonus",
  ],
  50: [
    "insurance_name",
    "insurance_policy_number",
    "insurance_premium_amount",
    "premiumPaymentFrequency",
    "insurance_sum_assured",
    "insurance_surrender_value",
    "dateOfPurchase",
    "premiumPaymentEndDate",
    "insurance_policyterm",
    "insurance_policyterm",
    "recurring_insurance",
    "addBonus",
    "maturityBonus",
  ],
  47: [
    "insurance_name",
    "insurance_policy_number",
    "typeOfGeneralInsurance",
    "insurance_premium_amount",
    "premiumPaymentFrequency",
    "insurance_sum_assured",
    "insurance_premium_topup",
    "dateOfPurchase",
    "premiumPaymentEndDate",
    "insurance_policyterm",
  ],
  43: [
    "insurance_name",
    "insurance_policy_number",
    "insurance_premium_amount",
    "premiumPaymentFrequency",
    "insurance_sum_assured",
    "insurance_maturity_amount",
    "dateOfPurchase",
    "premiumPaymentEndDate",
    "insurance_policyterm",
  ],
  44: [
    "ulip",
    "insurance_policy_number",
    "insurance_premium_amount",
    "premiumPaymentFrequency",
    "insurance_sum_assured",
    "dateOfPurchase",
    "premiumPaymentEndDate",
    "insurance_policyterm",
    "insurance_policyterm",
    "recurring_insurance",
    "addBonus",
    "insurance_maturity_amount",
  ],
  48: [
    "insurance_name",
    "insurance_policy_number",
    "mediclaimInsuranceFor",
    "insurance_premium_amount",
    "premiumPaymentFrequency",
    "insurance_sum_assured",
    "insurance_premium_topup",
    "dateOfPurchase",
    "premiumPaymentEndDate",
    "insurance_policyterm",
    "anyPreExistingDisease",
    "disease_name",
  ],
};

function isInputInPolicy(inputName, policyType) {
  // if string - direct lookup
  // if number convert to string and check includes
  if (typeof policyType == "string") {
    let lowercasePolicyType = policyType.toLowerCase();

    if (!policyType) {
      lowercasePolicyType = "default";
    }
    return policyInputs[lowercasePolicyType].includes(inputName);
  } else if (typeof policyType == "number") {
    return policyInputs[policyType + ""].includes(inputName);
  }
}

const options_type_of_general_insurance = [
  { value: "IM-1", label: "Travel Insurance" },
  { value: "IM-2", label: "Motor Insurance" },
  { value: "IM-3", label: "Marine Insurance" },
  { value: "IM-4", label: "Home Insurance" },
  { value: "IM-5", label: "Fire Insurance" },
  { value: "IM-6", label: "Property insurance" },
  { value: "IM-7", label: "Mobile insurance" },
  { value: "IM-8", label: "Cycle insurance" },
  { value: "IM-9", label: "Bite-size insurance" },
];

const options = [
  { value: "45", label: "Endowment" },
  { value: "47", label: "General Insurance" },
  { value: "46", label: "Guaranteed Income Plan" },
  { value: "48", label: "Mediclaim" },
  { value: "49", label: "Pension Plan" },
  { value: "43", label: "Term Plan" },
  { value: "44", label: "ULIP" },
  { value: "50", label: "Others" },
];

const options_premium_payment_frequency = [
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Half Yearly", label: "Half Yearly" },
  { value: "Yearly", label: "Yearly" },
  { value: "One Time", label: "One Time" },
];

// Function to get frequency options based on insurance category
const getFrequencyOptions = (selectedCategory) => {
  if (!selectedCategory) {
    return options_premium_payment_frequency;
  }

  // For Mediclaim and General Insurance, remove "One Time" option
  if (
    selectedCategory.insurance_cat_uuid === "mediclaim" ||
    selectedCategory.insurance_cat_uuid === "general"
  ) {
    return options_premium_payment_frequency.filter(
      (option) => option.value !== "One Time"
    );
  }

  // For all other categories, include all options including "One Time"
  return options_premium_payment_frequency;
};

// Predefined policy name options for different insurance categories
const options_policy_names = {
  43: [
    // Term Plan
    { value: "Term Plan", label: "Term Plan" },
    { value: "Life Insurance", label: "Life Insurance" },
    { value: "Pure Term", label: "Pure Term" },
    {
      value: "Term with Return of Premium",
      label: "Term with Return of Premium",
    },
    { value: "Others", label: "Others" },
  ],
  45: [
    // Endowment
    { value: "Endowment", label: "Endowment" },
    { value: "Money Back Policy", label: "Money Back Policy" },
    { value: "Whole Life", label: "Whole Life" },
    { value: "Traditional Plan", label: "Traditional Plan" },
    { value: "Others", label: "Others" },
  ],
  48: [
    // Mediclaim
    { value: "Mediclaim", label: "Mediclaim" },
    { value: "Health Insurance", label: "Health Insurance" },
    { value: "Family Floater", label: "Family Floater" },
    { value: "Critical Illness", label: "Critical Illness" },
    { value: "Personal Accident", label: "Personal Accident" },
    { value: "Others", label: "Others" },
  ],
  47: [
    // General Insurance
    { value: "General Insurance", label: "General Insurance" },
    { value: "Motor Insurance", label: "Motor Insurance" },
    { value: "Travel Insurance", label: "Travel Insurance" },
    { value: "Home Insurance", label: "Home Insurance" },
    { value: "Fire Insurance", label: "Fire Insurance" },
    { value: "Others", label: "Others" },
  ],
  46: [
    // Guaranteed Income Plan
    { value: "Guaranteed Income Plan", label: "Guaranteed Income Plan" },
    { value: "Pension Plan", label: "Pension Plan" },
    { value: "Annuity Plan", label: "Annuity Plan" },
    { value: "Retirement Plan", label: "Retirement Plan" },
    { value: "Others", label: "Others" },
  ],
  49: [
    // Pension Plan
    { value: "Pension Plan", label: "Pension Plan" },
    { value: "Retirement Plan", label: "Retirement Plan" },
    { value: "Annuity Plan", label: "Annuity Plan" },
    { value: "NPS", label: "NPS" },
    { value: "Others", label: "Others" },
  ],
  50: [
    // Others
    { value: "Others", label: "Others" },
    { value: "Custom Policy", label: "Custom Policy" },
  ],
};

const defaultInsuranceData = {
  bonus_amount: 1,
  insurance_for_member: "",
  insurance_category_id: "",
  insurance_paying_frequency: "",
  insurance_frequency: "",
  user_id: getParentUserId(),
  insurance_goal_id: "",
  insurance_rate_of_increase: "",
  insurance_name: "",
  insurance_category_name: "",
  insurance_ms_secid: "",
  insurance_premium_amount: "",
  insurance_bonus_amount: "",
  insurance_sum_assured: "",
  insurance_maturity_amount: "",
  insurance_surrender_value: "",
  insurance_payment_enddate: "",
  insurance_policy_enddate: "",
  insurance_end_date: "",
  insurance_bonus_date: "",
  insurance_recurring_amount: "",
  insurance_policyterm: "",
  insurance_policy_term: "",
  insurance_footnote: "",
  insurance_premium_topup: "",
  insurance_isRecurring: false,
  insurance_islinkable: true,
  insurance_hasPredisease: false,
  disease_name: "",
  insurance_policy_number: "",
  insurance_bonus: false,
  ulip_data: {},
  insurance_id: 0,
  id: 0,
  insurance_total_members: 0,
  insurance_type: "",
  insurance_start_date: "",
  insurance_purchase_date: "",
  insurance_source: "2",
  recurring_insurance: [],
  recurring_bonus_amount: [{ refId: uuid(), isValid: false }],
};

const NewInsuranceFormView = () => {
  const [, forceUpdate] = useState();

  const [maturityToggle, setMaturityToggle] = useState(false);
  const [addBonusToggle, setAddBonusToggle] = useState(false);
  const [existingDiseaseToggle, setExistingDiseaseToggle] = useState(false);
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);
  const [showPolicyNumberError, setShowPolicyNumberError] = useState(false);
  const [showAllValidationErrors, setShowAllValidationErrors] = useState(false);

  // Store original data for toggles
  const [originalBonusData, setOriginalBonusData] = useState(null);
  const [originalRecurringData, setOriginalRecurringData] = useState(null);
  const dispatch = useDispatch();
  const [ulipFund, setUlipFund] = useState([]);
  const [insuranceCategories, setInsuranceCategories] = useState([]);
  const [selectedInsuranceCategory, setSelectedInsuranceCategory] =
    useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const simpleValidator = useRef(new SimpleReactValidator());

  //new state for advisory api integration
  const [insuranceData, setInsuranceData] = useState(defaultInsuranceData);

  const onInputChange = (e, isNumeric) => {
    const name = e.target.name;
    let value = e.target.value;
    if (isNumeric && !numericRegex.test(value) && value !== "") {
      return;
    }

    // Hide validation errors when user starts typing
    if (showAllValidationErrors) {
      setShowAllValidationErrors(false);
    }

    setInsuranceData({ ...insuranceData, [name]: value });
  };

  const onSumAssuredInputChange = (e, isNumber = false) => {
    let { name, value } = e.target;

    if (isNumber) {
      // Remove non-digit characters except commas
      value = value.replace(/[^0-9,]/g, "");

      // Remove commas for processing
      const cleanValue = removeCommasFromNumber(value);

      // Only strip leading zeros for non-policy number fields
      if (name !== "insurance_policy_number") {
        const processedValue = cleanValue.replace(/^0+/, ""); // Strip leading zeros
        // Format with commas for display
        value = formatNumberWithCommas(processedValue);
      } else {
        value = cleanValue;
      }
    }

    // Hide policy number error when user starts typing
    if (name === "insurance_policy_number") {
      setShowPolicyNumberError(false);
    }

    // Hide validation errors when user starts typing
    if (showAllValidationErrors) {
      setShowAllValidationErrors(false);
    }

    setInsuranceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onDateAndSelectInputChange = (name, value) => {
    // Hide validation errors when user starts interacting with fields
    if (showAllValidationErrors) {
      setShowAllValidationErrors(false);
    }

    if (name == "insurance_category_id") {
      setInsuranceData({
        ...insuranceData,
        insurance_category_id: value.value,
        insurance_name: value.label,
      });
    } else {
      setInsuranceData({ ...insuranceData, [name]: value });
    }
  };

  const resetState = () => {
    setInsuranceData((prev) => ({
      ...prev,
      insurance_paying_frequency: "1",
      insurance_frequency: "",
      insurance_rate_of_increase: "",
      insurance_premium_amount: "",
      insurance_bonus_amount: "",
      insurance_sum_assured: "",
      insurance_maturity_amount: "",
      insurance_surrender_value: "",
      insurance_payment_enddate: "",
      insurance_policy_enddate: "",
      insurance_end_date: "",
      insurance_bonus_date: "",
      insurance_recurring_amount: "",
      insurance_policyterm: "",
      insurance_policy_term: "",
      insurance_footnote: "",
      insurance_premium_topup: "",
      insurance_isRecurring: false,
      insurance_islinkable: true,
      insurance_hasPredisease: false,
      disease_name: "",
      insurance_policy_number: "",
      insurance_bonus: false,
      ulip_data: {},
      insurance_id: 0,
      insurance_total_members: 0,
      insurance_type: "",
      insurance_start_date: "",
      insurance_purchase_date: moment(new Date()).toDate(),
      insurance_source: "2",
      recurring_insurance: [],
      recurring_bonus_amount: defaultInsuranceData.recurring_bonus_amount,
    }));
    setAddBonusToggle(false);
    setMaturityToggle(false);
    setExistingDiseaseToggle(false);
  };

  const getSelectValueData = (selectOptions, value) => {
    if (!value || value === "") {
      return null;
    }
    return selectOptions.find((data) => data.value === value);
  };

  // Function to format number with commas
  const formatNumberWithCommas = (value) => {
    if (!value || value === "") return "";
    // Remove any existing commas and non-digit characters except decimal point
    const cleanValue = value.toString().replace(/[^\d.]/g, "");
    // Add commas for thousands
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Function to remove commas from number
  const removeCommasFromNumber = (value) => {
    if (!value) return "";
    return value.toString().replace(/,/g, "");
  };

  const validateForm = () => {
    // Set flag to show all validation errors
    setShowAllValidationErrors(true);

    let formSuccess = true;

    // Check if insurance category is selected
    if (!selectedInsuranceCategory) {
      formSuccess = false;
    }

    // Check if maturity amount is required and provided
    if (
      isInputInPolicy(
        "insurance_maturity_amount",
        getOldCategoryIdForValidation(selectedInsuranceCategory)
      )
    ) {
      if (
        !insuranceData.insurance_maturity_amount ||
        insuranceData.insurance_maturity_amount.trim() === ""
      ) {
        formSuccess = false;
      }
    }

    if (
      maturityToggle &&
      insuranceData.recurring_insurance.some((v) => v.isValid === false)
    ) {
      formSuccess = false;
    }

    if (addBonusToggle) {
      if (
        insuranceData.recurring_bonus_amount.some((v) => {
          const cleanAmount = removeCommasFromNumber(v.insurance_bonus_amount);
          return parseFloat(cleanAmount) <= 0 || v.isValid === false;
        })
      ) {
        formSuccess = false;
      }
    }

    // Manual check for Policy Number validation
    if (
      insuranceData.insurance_policy_number &&
      removeCommasFromNumber(insuranceData.insurance_policy_number).length < 6
    ) {
      formSuccess = false;
      setShowPolicyNumberError(true);
    } else {
      setShowPolicyNumberError(false);
    }

    // Check if all validator fields are valid
    const isValidatorValid = simpleValidator.current.allValid();

    if (formSuccess && isValidatorValid) {
      Addinsurance();
    } else {
      // Force show all validation messages and re-render
      simpleValidator.current.showMessages();
      forceUpdate(1);
    }
  };

  const getInsuranceTypeData = (insuranceTypeData, value, ulip_check) => {
    if (ulip_check) {
      return insuranceTypeData.find((data) => data.label === value);
    } else {
      return insuranceTypeData.find((data) => data.value === value);
    }
  };

  // Helper function to get policy name options for a category
  const getPolicyNameOptions = (selectedCategory) => {
    if (!selectedCategory) return [];

    // Map the insurance_cat_uuid to the old category ID for policy names
    const uuidToOldIdMapping = {
      endowment: "45",
      guaranteed_income_plan: "46",
      general: "47",
      mediclaim: "48",
      pension_plan: "49",
      term_plan: "43",
      ulip: "44",
      others: "50",
    };

    const categoryId =
      uuidToOldIdMapping[selectedCategory.insurance_cat_uuid] || "default";
    const baseOptions = options_policy_names[categoryId] || [];

    // In edit mode, if current policy name doesn't match any predefined option, add it as an option
    if (id && insuranceData.insurance_name) {
      const hasMatchingOption = baseOptions.some(
        (option) =>
          option.value.toLowerCase() ===
          insuranceData.insurance_name.toLowerCase()
      );

      if (!hasMatchingOption && insuranceData.insurance_name.trim() !== "") {
        // Add the current policy name as a temporary option
        return [
          ...baseOptions,
          {
            value: insuranceData.insurance_name,
            label: insuranceData.insurance_name,
          },
        ];
      }
    }

    return baseOptions;
  };

  // Helper function to check if category should show policy name dropdown
  const shouldShowPolicyNameDropdown = (selectedCategory) => {
    if (!selectedCategory) return false;

    // Map the insurance_cat_uuid to the old category ID for policy names
    const uuidToOldIdMapping = {
      endowment: "45",
      guaranteed_income_plan: "46",
      general: "47",
      mediclaim: "48",
      pension_plan: "49",
      term_plan: "43",
      ulip: "44",
      others: "50",
    };

    const categoryId =
      uuidToOldIdMapping[selectedCategory.insurance_cat_uuid] || "default";
    return (
      categoryId &&
      options_policy_names[categoryId] &&
      options_policy_names[categoryId].length > 0
    );
  };

  const getMemberAssetId = () => {
    let a = getItemLocal("member");
    let x = a.find((item) => item.id == getUserId());
    let member = getItemLocal("family") ? 0 : x.fp_user_details_id;
    setInsuranceData({ ...insuranceData, insurance_for_member: member });
  };

  // Fetch insurance categories from API
  const fetchInsuranceCategories = async () => {
    try {
      const response = await getInsuranceCategoryList();

      let categories = [];

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        // Use the data directly from the API response
        categories = response.data.data.map((category) => ({
          value: category.insurance_id,
          label:
            category.insurance_name === "General"
              ? "General Insurance"
              : category.insurance_name,
          id: category.insurance_id,
          insurance_cat_uuid: category.insurance_cat_uuid, // Store the UUID for later use
          original_name: category.insurance_name, // Store the original name for API payload
        }));
      } else if (response.data && response.data.message) {
        categories = response.data.message.map((category) => ({
          value: category.insurance_id,
          label:
            category.insurance_name === "General"
              ? "General Insurance"
              : category.insurance_name,
          id: category.insurance_id,
          insurance_cat_uuid: category.insurance_cat_uuid,
          original_name: category.insurance_name, // Store the original name for API payload
        }));
      } else if (response.data && Array.isArray(response.data)) {
        categories = response.data.map((category) => ({
          value: category.insurance_id,
          label:
            category.insurance_name === "General"
              ? "General Insurance"
              : category.insurance_name,
          id: category.insurance_id,
          insurance_cat_uuid: category.insurance_cat_uuid,
          original_name: category.insurance_name, // Store the original name for API payload
        }));
      } else if (response.message && Array.isArray(response.message)) {
        categories = response.message.map((category) => ({
          value: category.insurance_id,
          label:
            category.insurance_name === "General"
              ? "General Insurance"
              : category.insurance_name,
          id: category.insurance_id,
          insurance_cat_uuid: category.insurance_cat_uuid,
          original_name: category.insurance_name, // Store the original name for API payload
        }));
      }

      setInsuranceCategories(categories);
    } catch (error) {
      console.error("Error fetching insurance categories:", error);
    }
  };

  // Handle insurance category change
  const handleInsuranceCategoryChange = (selectedCategory) => {
    setIsCategoryChanging(true);
    setSelectedInsuranceCategory(selectedCategory);

    if (selectedCategory) {
      // Clear validation messages first to prevent showing errors during reset
      simpleValidator.current.purgeFields();

      // Reset form data when category changes (except for category-specific fields)
      const resetData = {
        ...defaultInsuranceData,
        insurance_category_id: selectedCategory.value,
        insurance_paying_frequency: "", // Clear frequency to show placeholder
        insurance_purchase_date: "", // Clear the date to allow user to select
        insurance_source: "2",
        // Reset bonus-related data
        recurring_bonus_amount: [{ refId: uuid(), isValid: false }],
      };

      // If switching to Mediclaim or General Insurance and current frequency is "One Time", clear it
      if (
        (selectedCategory.insurance_cat_uuid === "mediclaim" ||
          selectedCategory.insurance_cat_uuid === "general") &&
        insuranceData.insurance_paying_frequency === "One Time"
      ) {
        resetData.insurance_paying_frequency = "";
      }

      // Check if the selected category is ULIP
      const isUlipCategory =
        selectedCategory.insurance_cat_uuid === "ulip" ||
        selectedCategory.label.toLowerCase().includes("ulip");

      if (isUlipCategory) {
        // For ULIP, clear the policy name to allow user to select from dropdown
        resetData.insurance_name = "";
      } else {
        // For other categories, set the policy name to match the category name
        // For general insurance, use the original name "General" instead of "General Insurance"
        const insuranceName =
          selectedCategory.insurance_cat_uuid === "general"
            ? selectedCategory.original_name
            : selectedCategory.label;
        resetData.insurance_name = insuranceName;
      }

      // Reset form data
      setInsuranceData(resetData);

      // Reset toggles
      setMaturityToggle(false);
      setAddBonusToggle(false);
      setExistingDiseaseToggle(false);
      setShowPolicyNumberError(false);
      setShowAllValidationErrors(false);

      // Force re-render to ensure validation messages are cleared
      forceUpdate(1);
    }

    // Reset the category changing flag after a short delay
    setTimeout(() => {
      setIsCategoryChanging(false);
    }, 100);
  };

  useEffect(() => {
    // Don't interfere if we're in the middle of changing categories
    if (isCategoryChanging) return;

    // In edit mode, if there's existing recurring data, set the toggle to true
    if (
      id &&
      insuranceData?.recurring_insurance?.length > 0 &&
      !maturityToggle
    ) {
      setMaturityToggle(true);
      return;
    }

    // In add mode, only initialize if toggle is on and no existing data
    // Don't interfere with edit mode data loading
    if (id) return; // Skip this logic in edit mode

    if (insuranceData?.recurring_insurance.length > 0) return;
    if (maturityToggle) {
      setInsuranceData((prev) => ({
        ...prev,
        recurring_insurance: [{ refId: uuid(), isValid: false }],
      }));
    }
  }, [id, insuranceData?.recurring_insurance, isCategoryChanging]);

  // Removed the problematic useEffect for bonus toggle

  useEffect(() => {
    if (getParentUserId() == null) {
      loginRedirectGuest();
    } else {
      ulip();
    }

    // Always fetch insurance categories first
    fetchInsuranceCategories();
    getMemberAssetId();
  }, []);

  // Separate useEffect for edit mode - runs after categories are loaded
  useEffect(() => {
    if (id != undefined && insuranceCategories.length > 0) {
      fetchInsuranceData();
    }
  }, [id, insuranceCategories]);

  function getCategoryName(id) {
    const option = options.find((key) => key.value === id);
    return option ? option.label : "Label not found";
  }

  const Addinsurance = async () => {
    try {
      // Validate that insurance category is selected
      if (!selectedInsuranceCategory) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Please select an insurance category.",
            type: "error",
          },
        });
        return;
      }

      // Use the actual policy term value entered by user, fallback to date calculation if needed
      let policyTerm =
        insuranceData.insurance_policy_term ||
        (insuranceData.insurance_payment_enddate &&
        insuranceData.insurance_purchase_date
          ? moment(insuranceData.insurance_payment_enddate).diff(
              moment(insuranceData.insurance_purchase_date),
              "years"
            )
          : 0);

      // Get frequency label from options
      const frequencyLabel =
        options_premium_payment_frequency.find(
          (option) => option.value === insuranceData.insurance_paying_frequency
        )?.label || "Monthly";

      // Use the selected insurance category from the dropdown
      const insurance_cat_id = selectedInsuranceCategory?.value || "INSC-55"; // Default to Mediclaim if no category selected

      // Get the category UUID directly from the selected category
      const categoryUUID =
        selectedInsuranceCategory?.insurance_cat_uuid || "others";

      // Force Individual context to avoid API 400 error
      // Most insurance policies are Individual context
      const context = "Individual";
      const isFamily = false;

      // Create base payload with required fields
      let aw_req_data = {
        user_insurance_user_id: getParentUserId(),
        insurance_cat_uuid: categoryUUID,
        user_insurance_context: context,
        user_insurance_for:
          insuranceData.insurance_for_member || getParentUserId(),
        user_insurance_name: insuranceData.insurance_name || "",
        user_insurance_premium_amount:
          parseInt(
            removeCommasFromNumber(insuranceData.insurance_premium_amount)
          ) || 0,
        user_insurance_sum_assured:
          parseInt(
            removeCommasFromNumber(insuranceData.insurance_sum_assured)
          ) || 0,
        user_insurance_premium_freq: frequencyLabel,
        user_insurance_start_date: moment(
          insuranceData.insurance_purchase_date
        ).format("DD/MM/YYYY"),
        user_insurance_policy_term:
          parseInt(removeCommasFromNumber(policyTerm)) || 0,
        user_insurance_remarks:
          insuranceData.user_insurance_remarks ||
          (categoryUUID === "mediclaim" ||
          categoryUUID === "general" ||
          categoryUUID === "term_plan"
            ? ""
            : "Added via portfolio dashboard"),
        data_belongs_to: DATA_BELONGS_TO,
      };

      // Add fields that are not applicable to mediclaim, general insurance, and term plan
      if (
        categoryUUID !== "mediclaim" &&
        categoryUUID !== "general" &&
        categoryUUID !== "term_plan"
      ) {
        aw_req_data["user_insurance_maturity_amount"] = 0;
        aw_req_data["user_insurance_surrender_value"] = 0;
        aw_req_data["user_insurance_automated_linkage"] = "0";
        aw_req_data["user_insurance_occurance"] = "One Time";
        aw_req_data["user_insurance_goal_linkage_ids"] = [];
      }

      // Add policy number if provided
      if (
        insuranceData.insurance_policy_number &&
        insuranceData.insurance_policy_number.trim() !== ""
      ) {
        aw_req_data["user_insurance_policy_number"] =
          insuranceData.insurance_policy_number;
      }

      // Add end date if provided
      if (insuranceData.insurance_payment_enddate) {
        aw_req_data["user_insurance_end_date"] = moment(
          insuranceData.insurance_payment_enddate
        ).format("DD/MM/YYYY");
      }

      // Conditional logic based on insurance category (matching Insurance.js logic)

      // For General Insurance - add type_id
      if (categoryUUID === "general") {
        if (insuranceData.insurance_type) {
          aw_req_data["insurance_type_id"] = insuranceData.insurance_type;
        }
      }

      // For Mediclaim - handle context and member IDs
      if (categoryUUID === "mediclaim") {
        const allowedValuesMap = {
          Family: "Family",
          "Family Floater": "Family Floater",
          "Family Multi Individual": "Family Multi Individual",
        };

        aw_req_data["user_insurance_context"] =
          allowedValuesMap[insuranceData.insurance_for_member] || "Individual";

        if (
          insuranceData.insurance_for_member === "Family Multi Individual" ||
          insuranceData.insurance_for_member === "Family Floater"
        ) {
          aw_req_data["user_insurance_member_ids"] = insuranceData.members || [
            getParentUserId(),
          ];
        }
      }

      // For Term Plan - add maturity amount (always 0 as per expected payload)
      if (categoryUUID === "term_plan") {
        aw_req_data["user_insurance_maturity_amount"] =
          parseInt(
            removeCommasFromNumber(insuranceData.insurance_maturity_amount)
          ) || 0;
      }

      // For ULIP - add current fund value and ULIP sec ID
      if (categoryUUID === "ulip") {
        if (insuranceData.ulip_data && insuranceData.ulip_data.ms_secid) {
          aw_req_data["user_insurance_ulip_sec_id"] =
            insuranceData.ulip_data.ms_secid;
        }
        if (insuranceData.insurance_maturity_amount) {
          aw_req_data["user_insurance_current_fund_value"] =
            insuranceData.insurance_maturity_amount.toString();
        }
      }

      // For General Insurance or Mediclaim - add topup and inflation rate
      if (categoryUUID === "general" || categoryUUID === "mediclaim") {
        if (insuranceData.insurance_premium_topup) {
          aw_req_data["user_insurance_topup"] =
            parseInt(
              removeCommasFromNumber(insuranceData.insurance_premium_topup)
            ) || 0;
        } else {
          aw_req_data["user_insurance_topup"] = 0;
        }
        // Default inflation rate if not provided - use "7" as per expected payload
        aw_req_data["user_insurance_inflation_rate"] = "7";
      }

      // For categories that support surrender value, maturity amount, automated linkage, etc.
      const validCategories = [
        "guaranteed_income_plan",
        "endowment",
        "pension_plan",
        "ulip",
        "others",
      ];

      if (validCategories.includes(categoryUUID)) {
        // Update surrender value if provided
        if (
          insuranceData.insurance_surrender_value &&
          parseInt(
            removeCommasFromNumber(insuranceData.insurance_surrender_value)
          ) > 0
        ) {
          aw_req_data["user_insurance_surrender_value"] = parseInt(
            removeCommasFromNumber(insuranceData.insurance_surrender_value)
          );
        }

        // Update maturity amount if provided
        if (
          insuranceData.insurance_maturity_amount &&
          parseInt(
            removeCommasFromNumber(insuranceData.insurance_maturity_amount)
          ) > 0
        ) {
          aw_req_data["user_insurance_maturity_amount"] = parseInt(
            removeCommasFromNumber(insuranceData.insurance_maturity_amount)
          );
        }

        // Set occurrence based on maturity toggle
        aw_req_data["user_insurance_occurance"] = maturityToggle
          ? "Recurring"
          : "One Time";

        // Add recurring insurance details if maturity is recurring
        if (
          maturityToggle &&
          insuranceData.recurring_insurance &&
          insuranceData.recurring_insurance.length > 0
        ) {
          const insurance_details = insuranceData.recurring_insurance.map(
            (detail) => {
              // Transform the data to match the expected structure from Insurance.js
              const start_date = detail.insurance_start_date
                ? moment(detail.insurance_start_date).format("DD/MM/YYYY")
                : "";
              const end_date = detail.insurance_end_date
                ? moment(detail.insurance_end_date).format("DD/MM/YYYY")
                : "";
              const amount = (
                parseInt(detail.insurance_recurring_amount) || 0
              ).toString();

              // Map numeric frequency values back to string labels for submission
              const mapNumericToFrequencyLabel = (numericValue) => {
                const mapping = {
                  1: "Monthly",
                  2: "Quarterly",
                  3: "Half Yearly",
                  4: "Yearly",
                  6: "Once In 2 Years",
                  7: "Once In 3 Years",
                  8: "Once In 4 Years",
                  9: "Once In 5 Years",
                };
                return mapping[numericValue] || "Monthly";
              };

              return {
                start_date: start_date,
                end_date: end_date,
                amount: amount,
                frequency: mapNumericToFrequencyLabel(
                  detail.insurance_frequency
                ),
              };
            }
          );
          aw_req_data["user_insurance_details"] = insurance_details;
        }

        // Add bonus details if bonus toggle is on
        if (
          addBonusToggle &&
          insuranceData.recurring_bonus_amount &&
          insuranceData.recurring_bonus_amount.length > 0
        ) {
          const hasValidBonus = insuranceData.recurring_bonus_amount.some(
            (obj) =>
              obj.insurance_bonus_amount &&
              parseInt(removeCommasFromNumber(obj.insurance_bonus_amount)) > 0
          );
          if (hasValidBonus) {
            // Transform the bonus data to match the expected structure from Insurance.js
            const transformedBonusData =
              insuranceData.recurring_bonus_amount.map((bonus) => {
                // Format the date to dd/mm/yyyy as expected by the backend
                const date = new Date(bonus.insurance_bonus_date);
                const isValidDate = !isNaN(date);
                const bonus_date = isValidDate
                  ? date.toLocaleDateString("en-GB")
                  : bonus.insurance_bonus_date;

                return {
                  bonus_amount: removeCommasFromNumber(
                    bonus.insurance_bonus_amount
                  ),
                  bonus_date: bonus_date,
                };
              });
            aw_req_data["user_insurance_bonus_details"] = transformedBonusData;
          }
        }
      }

      // Add disease information for Mediclaim in remarks
      if (
        categoryUUID === "mediclaim" &&
        insuranceData.disease_name &&
        insuranceData.disease_name.trim() !== ""
      ) {
        aw_req_data[
          "user_insurance_remarks"
        ] = `Pre-existing disease: ${insuranceData.disease_name}`;
      }

      let res;
      // Check if we're editing or adding new insurance
      if (id != undefined) {
        // Update existing insurance using new API
        const updatePayload = {
          user_insurance_id: insuranceData.original_record?.name || atob(id),
          user_insurance_user_id: getParentUserId(),
          insurance_cat_uuid:
            selectedInsuranceCategory?.insurance_cat_uuid || "others",
          user_insurance_context: context,
          user_insurance_for:
            insuranceData.original_record?.user_insurance_for ||
            getParentUserId(),
          user_insurance_name: insuranceData.insurance_name || "",
          user_insurance_premium_amount:
            parseInt(
              removeCommasFromNumber(insuranceData.insurance_premium_amount)
            ) || 0,
          user_insurance_sum_assured:
            parseInt(
              removeCommasFromNumber(insuranceData.insurance_sum_assured)
            ) || 0,
          user_insurance_premium_freq: frequencyLabel,
          user_insurance_start_date: moment(
            insuranceData.insurance_purchase_date
          ).format("DD/MM/YYYY"),
          user_insurance_policy_term: parseInt(policyTerm) || 0,
          user_insurance_policy_number:
            insuranceData.insurance_policy_number || "",
          user_insurance_remarks:
            insuranceData.user_insurance_remarks ||
            (categoryUUID === "mediclaim" ||
            categoryUUID === "general" ||
            categoryUUID === "term_plan"
              ? ""
              : "Updated via portfolio dashboard"),
          data_belongs_to: DATA_BELONGS_TO,
        };

        // Add fields that are not applicable to mediclaim, general insurance, and term plan
        if (
          categoryUUID !== "mediclaim" &&
          categoryUUID !== "general" &&
          categoryUUID !== "term_plan"
        ) {
          updatePayload["user_insurance_maturity_amount"] = 0;
          updatePayload["user_insurance_surrender_value"] = 0;
          updatePayload["user_insurance_automated_linkage"] = "0";
          updatePayload["user_insurance_occurance"] = "One Time";
          updatePayload["user_insurance_goal_linkage_ids"] = [];
        }

        // Add conditional fields for update as well
        if (categoryUUID === "general" && insuranceData.insurance_type) {
          updatePayload["insurance_type_id"] = insuranceData.insurance_type;
        }

        if (categoryUUID === "term_plan") {
          updatePayload["user_insurance_maturity_amount"] = 0;
        }

        if (
          categoryUUID === "ulip" &&
          insuranceData.ulip_data &&
          insuranceData.ulip_data.ms_secid
        ) {
          updatePayload["user_insurance_ulip_sec_id"] =
            insuranceData.ulip_data.ms_secid;
        }

        // For General Insurance or Mediclaim - add topup and inflation rate
        if (categoryUUID === "general" || categoryUUID === "mediclaim") {
          if (insuranceData.insurance_premium_topup) {
            updatePayload["user_insurance_topup"] =
              parseInt(
                removeCommasFromNumber(insuranceData.insurance_premium_topup)
              ) || 0;
          } else {
            updatePayload["user_insurance_topup"] = 0;
          }
          // Default inflation rate if not provided - use "7" as per expected payload
          updatePayload["user_insurance_inflation_rate"] = "7";
        }

        if (validCategories.includes(categoryUUID)) {
          if (
            insuranceData.insurance_surrender_value &&
            parseInt(
              removeCommasFromNumber(insuranceData.insurance_surrender_value)
            ) > 0
          ) {
            updatePayload["user_insurance_surrender_value"] = parseInt(
              removeCommasFromNumber(insuranceData.insurance_surrender_value)
            );
          }
          if (
            insuranceData.insurance_maturity_amount &&
            parseInt(
              removeCommasFromNumber(insuranceData.insurance_maturity_amount)
            ) > 0
          ) {
            updatePayload["user_insurance_maturity_amount"] = parseInt(
              removeCommasFromNumber(insuranceData.insurance_maturity_amount)
            );
          }
          updatePayload["user_insurance_occurance"] = maturityToggle
            ? "Recurring"
            : "One Time";

          // Add recurring insurance details if maturity is recurring
          if (
            maturityToggle &&
            insuranceData.recurring_insurance &&
            insuranceData.recurring_insurance.length > 0
          ) {
            const insurance_details = insuranceData.recurring_insurance.map(
              (detail) => {
                // Transform the data to match the expected structure from Insurance.js
                const start_date = detail.insurance_start_date
                  ? moment(detail.insurance_start_date).format("DD/MM/YYYY")
                  : "";
                const end_date = detail.insurance_end_date
                  ? moment(detail.insurance_end_date).format("DD/MM/YYYY")
                  : "";
                const amount = (
                  parseInt(detail.insurance_recurring_amount) || 0
                ).toString();

                // Use the correct frequency options that match backend expectations
                const frequencyOptions = [
                  { value: "1", label: "Monthly" },
                  { value: "2", label: "Quarterly" },
                  { value: "3", label: "Half Yearly" },
                  { value: "4", label: "Yearly" },
                  { value: "6", label: "Once In 2 Years" },
                  { value: "7", label: "Once In 3 Years" },
                  { value: "8", label: "Once In 4 Years" },
                  { value: "9", label: "Once In 5 Years" },
                ];

                const match = frequencyOptions.find(
                  (opt) => opt.value === detail.insurance_frequency
                );

                return {
                  start_date: start_date,
                  end_date: end_date,
                  amount: amount,
                  frequency: match ? match.label : "Monthly",
                };
              }
            );
            updatePayload["user_insurance_details"] = insurance_details;
          }

          // Add bonus details if bonus toggle is on
          if (
            addBonusToggle &&
            insuranceData.recurring_bonus_amount &&
            insuranceData.recurring_bonus_amount.length > 0
          ) {
            const hasValidBonus = insuranceData.recurring_bonus_amount.some(
              (obj) =>
                obj.insurance_bonus_amount &&
                parseInt(removeCommasFromNumber(obj.insurance_bonus_amount)) > 0
            );
            if (hasValidBonus) {
              // Transform the bonus data to match the expected structure from Insurance.js
              const transformedBonusData =
                insuranceData.recurring_bonus_amount.map((bonus) => {
                  // Format the date to dd/mm/yyyy as expected by the backend
                  const date = new Date(bonus.insurance_bonus_date);
                  const isValidDate = !isNaN(date);
                  const bonus_date = isValidDate
                    ? date.toLocaleDateString("en-GB")
                    : bonus.insurance_bonus_date;

                  return {
                    bonus_amount: removeCommasFromNumber(
                      bonus.insurance_bonus_amount
                    ),
                    bonus_date: bonus_date,
                  };
                });
              updatePayload["user_insurance_bonus_details"] =
                transformedBonusData;
            }
          }
        }

        // Add disease information for Mediclaim in remarks
        if (
          insuranceData.disease_name &&
          insuranceData.disease_name.trim() !== ""
        ) {
          updatePayload.user_insurance_remarks = `Pre-existing disease: ${insuranceData.disease_name}`;
        }

        // Add optional fields if they have values
        if (insuranceData.insurance_payment_enddate) {
          updatePayload.user_insurance_end_date = moment(
            insuranceData.insurance_payment_enddate
          ).format("DD/MM/YYYY");
        }

        res = await apiClient(
          financialplanningInsuranceEndpoints.UPDATE_USER_INSURANCE_DETAILS,
          {
            method: "POST",
            body: JSON.stringify(updatePayload),
          }
        );
      } else {
        // Add new insurance
        res = await addInsuranceDetails(aw_req_data);
      }

      if (
        res.status_code == "200" ||
        res.error_code == "100" ||
        res.status_code === 200
      ) {
        // Trigger dashboard data refresh
        dispatch({
          type: "OTHERINVESTMENT_UPDATE",
          payload: true,
        });

        if (id != undefined) {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Insurance Updated Successfully!",
              type: "success",
            },
          });
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: {
              message: "Insurance Added Successfully!",
              type: "success",
            },
          });
        }
        setTimeout(() => {
          navigate(
            process.env.PUBLIC_URL +
              "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=2"
          );
        }, 2000);
      } else {
        // Show specific API error message to user
        let errorMessage = "Failed to save insurance. Please try again.";

        if (
          res.message &&
          typeof res.message === "object" &&
          res.message.message
        ) {
          // Handle nested message structure: { message: { message: "error text" } }
          errorMessage = res.message.message;
        } else if (res.message && typeof res.message === "string") {
          errorMessage = res.message;
        } else if (res.data && res.data.message) {
          errorMessage = res.data.message;
        } else if (res.error_message) {
          errorMessage = res.error_message;
        }

        dispatch({
          type: "RENDER_TOAST",
          payload: { message: errorMessage, type: "error" },
        });
      }
    } catch (e) {
      console.error("Error adding insurance:", e);

      // Extract error message from API response if available
      let errorMessage =
        "Something went wrong while adding insurance. Please try again.";

      if (e.response && e.response.data) {
        if (
          e.response.data.message &&
          typeof e.response.data.message === "object" &&
          e.response.data.message.message
        ) {
          // Handle nested message structure: { message: { message: "error text" } }
          errorMessage = e.response.data.message.message;
        } else if (
          e.response.data.message &&
          typeof e.response.data.message === "string"
        ) {
          errorMessage = e.response.data.message;
        } else if (e.response.data.error) {
          errorMessage = e.response.data.error;
        }
      } else if (e.message) {
        errorMessage = e.message;
      }

      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: errorMessage,
          type: "error",
        },
      });
    }
  };

  const ulip = async () => {
    try {
      // Use the getInsuranceUlipList API instead of ADVISORY_GET_ULIP_DATA
      const response = await getInsuranceUlipList();

      if (
        response.status_code === "200" &&
        response.data &&
        Array.isArray(response.data)
      ) {
        const ulip_array = response.data.map((ulip) => ({
          value: ulip.insurance_ulip_sec_id,
          label: ulip.insurance_ulip_name,
        }));
        setUlipFund(ulip_array);
      } else if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        const ulip_array = response.data.data.map((ulip) => ({
          value: ulip.insurance_ulip_sec_id || ulip.ulip_id || ulip.id,
          label:
            ulip.insurance_ulip_name || ulip.ulip_name || ulip.name || "ULIP",
        }));
        setUlipFund(ulip_array);
      } else if (response.data && Array.isArray(response.data)) {
        const ulip_array = response.data.map((ulip) => ({
          value: ulip.insurance_ulip_sec_id || ulip.ulip_id || ulip.id,
          label:
            ulip.insurance_ulip_name || ulip.ulip_name || ulip.name || "ULIP",
        }));
        setUlipFund(ulip_array);
      } else {
        setUlipFund([]);
      }
    } catch (e) {
      console.error("Error fetching ULIP data:", e);
      setUlipFund([]);
    }
  };

  const fetchInsuranceData = async () => {
    try {
      const user_id = getParentUserId();
      const queryParams = new URLSearchParams();
      queryParams.append("user_id", user_id);
      const url = `${
        financialplanningInsuranceEndpoints.GET_USER_INSURANCE_DETAILS
      }?${queryParams.toString()}`;

      const response = await apiClient(url, {
        method: "GET",
      });

      if (response.status_code === 200 || response.status_code === "200") {
        const insuranceDataArray = response.data || [];
        var insuranceId = atob(id);

        // Find the specific insurance record by name (which is the ID)
        const insuranceRecord = insuranceDataArray.find(
          (insurance) => insurance.name === insuranceId
        );

        if (insuranceRecord) {
          // Map API response to form fields
          const mappedData = {
            insurance_category_id: insuranceRecord.insurance_cat_id || "",
            insurance_name: insuranceRecord.user_insurance_name || "",
            insurance_policy_number:
              insuranceRecord.user_insurance_policy_number || "",
            insurance_premium_amount: formatNumberWithCommas(
              insuranceRecord.user_insurance_premium_amount?.toString() || ""
            ),
            insurance_paying_frequency: mapFrequencyToFormValue(
              insuranceRecord.user_insurance_premium_freq
            ),
            insurance_sum_assured: formatNumberWithCommas(
              insuranceRecord.user_insurance_sum_assured?.toString() || ""
            ),
            insurance_surrender_value: formatNumberWithCommas(
              insuranceRecord.user_insurance_surrender_value?.toString() || ""
            ),
            insurance_purchase_date: parseApiDate(
              insuranceRecord.user_insurance_start_date
            ),
            insurance_payment_enddate: parseApiDate(
              insuranceRecord.user_insurance_end_date
            ),
            insurance_policy_term:
              insuranceRecord.user_insurance_policy_term?.toString() || "",
            insurance_maturity_amount: formatNumberWithCommas(
              insuranceRecord.user_insurance_maturity_amount?.toString() || ""
            ),
            user_insurance_remarks:
              insuranceRecord.user_insurance_remarks || "",
            insurance_for_member: getParentUserId(),
            user_id: getParentUserId(),
            // Handle disease information from remarks for Mediclaim
            disease_name: extractDiseaseFromRemarks(
              insuranceRecord.user_insurance_remarks
            ),
            // Store original record for update API
            original_record: insuranceRecord,
            // Handle ULIP-specific data
            insurance_ms_secid:
              insuranceRecord.user_insurance_ulip_sec_id || "",
            ulip_data: insuranceRecord.user_insurance_ulip_sec_id
              ? {
                  share_name: insuranceRecord.user_insurance_name,
                  ms_secid: insuranceRecord.user_insurance_ulip_sec_id,
                }
              : {},
            // Handle General Insurance type
            insurance_type: insuranceRecord.insurance_type_id
              ? insuranceRecord.insurance_type_id.toString()
              : "",
          };

          // Handle recurring insurance data if it exists
          // Check multiple possible field names for recurring data
          let recurringDetails =
            insuranceRecord.user_insurance_details ||
            insuranceRecord.user_insurance_recurring_details ||
            insuranceRecord.recurring_details ||
            insuranceRecord.recurring_insurance_details ||
            insuranceRecord.maturity_details ||
            insuranceRecord.user_insurance_maturity_details ||
            insuranceRecord.insurance_recurring_details;

          // Parse recurring details if it's a JSON string
          if (recurringDetails && typeof recurringDetails === "string") {
            try {
              recurringDetails = JSON.parse(recurringDetails);
            } catch (error) {
              console.error("Error parsing recurring details JSON:", error);
              recurringDetails = null;
            }
          }

          if (
            recurringDetails &&
            Array.isArray(recurringDetails) &&
            recurringDetails.length > 0
          ) {
            const recurringData = recurringDetails.map((detail) => {
              const originalFrequency =
                detail.frequency ||
                detail.insurance_frequency ||
                detail.maturity_frequency;

              // If the frequency is already a numeric string (1, 2, 3, etc.), use it directly
              // Otherwise, map it using the mapping function
              const mappedFrequency =
                originalFrequency &&
                /^[1-9]$/.test(originalFrequency.toString())
                  ? originalFrequency.toString()
                  : mapFrequencyToNumericValue(originalFrequency);

              return {
                refId: uuid(),
                insurance_start_date: parseApiDate(
                  detail.start_date ||
                    detail.insurance_start_date ||
                    detail.maturity_start_date
                ),
                insurance_end_date: parseApiDate(
                  detail.end_date ||
                    detail.insurance_end_date ||
                    detail.maturity_end_date
                ),
                insurance_recurring_amount: formatNumberWithCommas(
                  (
                    detail.amount ||
                    detail.insurance_recurring_amount ||
                    detail.maturity_amount
                  )?.toString() || ""
                ),
                insurance_frequency: mappedFrequency,
                isValid: true,
              };
            });
            mappedData.recurring_insurance = recurringData;
            setMaturityToggle(true);
          }

          // Handle bonus data if it exists
          // Check multiple possible field names for bonus data
          let bonusDetails =
            insuranceRecord.user_insurance_bonus_details ||
            insuranceRecord.bonus_details ||
            insuranceRecord.bonus_insurance_details ||
            insuranceRecord.add_bonus_details ||
            insuranceRecord.user_insurance_add_bonus_details ||
            insuranceRecord.insurance_bonus_details;

          // Parse bonus details if it's a JSON string
          if (bonusDetails && typeof bonusDetails === "string") {
            try {
              bonusDetails = JSON.parse(bonusDetails);
            } catch (error) {
              console.error("Error parsing bonus details JSON:", error);
              bonusDetails = null;
            }
          }

          if (
            bonusDetails &&
            Array.isArray(bonusDetails) &&
            bonusDetails.length > 0
          ) {
            const bonusData = bonusDetails.map((detail) => ({
              refId: uuid(),
              insurance_bonus_amount: formatNumberWithCommas(
                (
                  detail.amount ||
                  detail.insurance_bonus_amount ||
                  detail.bonus_amount
                )?.toString() || ""
              ),
              insurance_bonus_date: parseApiDate(
                detail.date || detail.insurance_bonus_date || detail.bonus_date
              ),
              isValid: true,
            }));

            mappedData.recurring_bonus_amount = bonusData;
            setAddBonusToggle(true);
          }

          // Set form data and selected category
          setInsuranceData((prev) => ({
            ...prev,
            ...mappedData,
          }));

          // Set selected insurance category for dropdown
          // Try to find category by UUID first (most reliable)
          let categoryOption = null;

          if (insuranceRecord.insurance_cat_uuid) {
            categoryOption = insuranceCategories.find(
              (cat) =>
                cat.insurance_cat_uuid === insuranceRecord.insurance_cat_uuid
            );
          }

          // If not found by UUID, try to find by ID
          if (!categoryOption && insuranceRecord.insurance_cat_id) {
            categoryOption = insuranceCategories.find(
              (cat) =>
                cat.value === insuranceRecord.insurance_cat_id ||
                cat.id === insuranceRecord.insurance_cat_id
            );
          }

          // If still not found, try to find by name
          if (!categoryOption && insuranceRecord.insurance_cat_name) {
            categoryOption = insuranceCategories.find(
              (cat) =>
                cat.label === insuranceRecord.insurance_cat_name ||
                cat.label.toLowerCase() ===
                  insuranceRecord.insurance_cat_name.toLowerCase()
            );
          }

          // For edit mode, set the correct category
          if (categoryOption) {
            // Use the actual category option (e.g., "ULIP") instead of the policy name
            setSelectedInsuranceCategory(categoryOption);
          } else {
            // Fallback: create a category option with the policy name and proper UUID
            const categoryOptionWithPolicyName = {
              value: insuranceRecord.insurance_cat_id || "custom",
              label: insuranceRecord.user_insurance_name,
              insurance_cat_uuid:
                insuranceRecord.insurance_cat_uuid || "others",
              isCustom: true,
            };
            setSelectedInsuranceCategory(categoryOptionWithPolicyName);
          }

          // Handle special switches/toggles based on data
          if (
            insuranceRecord.user_insurance_remarks &&
            insuranceRecord.user_insurance_remarks.includes(
              "Pre-existing disease"
            )
          ) {
            setExistingDiseaseToggle(true);
          }
        } else {
          dispatch({
            type: "RENDER_TOAST",
            payload: { message: "Insurance record not found.", type: "error" },
          });
        }
      } else {
        setInsuranceData(defaultInsuranceData);
      }
    } catch (e) {
      console.error("Error in fetchInsuranceData:", e);
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: "Error fetching insurance data. Please try again.",
          type: "error",
        },
      });
    }
  };

  // Helper function to map frequency to form value (for main form - uses string values)
  const mapFrequencyToFormValue = (frequency) => {
    const mapping = {
      // Numeric to string mapping
      1: "Monthly",
      2: "Quarterly",
      3: "Half Yearly",
      4: "Yearly",
      6: "Once In 2yr",
      7: "Once In 3yr",
      8: "Once In 4yr",
      9: "Once In 5yr",
      // String format variations
      "Once in 2 Years": "Once In 2yr",
      "Once in 3 Years": "Once In 3yr",
      "Once in 4 Years": "Once In 4yr",
      "Once in 5 Years": "Once In 5yr",
    };
    return mapping[frequency] || frequency || "Monthly";
  };

  // Helper function to map frequency to numeric value (for recurring form - uses numeric values)
  const mapFrequencyToNumericValue = (frequency) => {
    const mapping = {
      // String to numeric mapping
      Monthly: "1",
      Quarterly: "2",
      "Half Yearly": "3",
      Yearly: "4",
      "Once In 2yr": "6",
      "Once In 3yr": "7",
      "Once In 4yr": "8",
      "Once In 5yr": "9",
      // Handle variations with spacing
      "Once in 2 Years": "6",
      "Once in 3 Years": "7",
      "Once in 4 Years": "8",
      "Once in 5 Years": "9",
    };

    // If already numeric, return as string
    if (/^[1-9]$/.test(frequency?.toString())) {
      return frequency.toString();
    }

    // Try exact match
    let result = mapping[frequency];

    // If no exact match, try case-insensitive match
    if (!result && typeof frequency === "string") {
      const normalizedFrequency = frequency.trim();
      for (const [key, value] of Object.entries(mapping)) {
        if (key.toLowerCase() === normalizedFrequency.toLowerCase()) {
          result = value;
          break;
        }
      }
    }

    return result || "1"; // Default to Monthly
  };

  // Helper function to parse API date format (DD/MM/YYYY) to form format
  const parseApiDate = (dateStr) => {
    if (!dateStr || dateStr === "null" || dateStr === "undefined") return "";

    try {
      // Try DD/MM/YYYY format first
      if (dateStr.includes("/")) {
        const [day, month, year] = dateStr.split("/");
        const date = new Date(`${year}-${month}-${day}`);
        return date;
      }

      // Try YYYY-MM-DD format
      if (dateStr.includes("-")) {
        const date = new Date(dateStr);
        return date;
      }

      // Try ISO string format
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }

      return "";
    } catch (e) {
      console.error("Error parsing date:", dateStr, e);
      return "";
    }
  };

  // Helper function to extract disease name from remarks
  const extractDiseaseFromRemarks = (remarks) => {
    if (!remarks) return "";
    const match = remarks.match(/Pre-existing disease:\s*(.+)$/);
    return match ? match[1].trim() : "";
  };

  // Helper function to map new category UUIDs to old category IDs for form validation
  const getOldCategoryIdForValidation = (selectedCategory) => {
    if (!selectedCategory) return "default";

    // If we have the insurance_cat_uuid, map it directly
    if (selectedCategory.insurance_cat_uuid) {
      const uuidToOldIdMapping = {
        endowment: "45",
        guaranteed_income_plan: "46",
        general: "47",
        mediclaim: "48",
        pension_plan: "49",
        term_plan: "43",
        ulip: "44",
        others: "50",
      };
      return (
        uuidToOldIdMapping[selectedCategory.insurance_cat_uuid] || "default"
      );
    }

    // Fallback to label-based mapping for backward compatibility
    const categoryMapping = {
      Endowment: "45",
      "Guaranteed Income Plan": "46",
      "General Insurance": "47",
      Mediclaim: "48",
      "Pension Plan": "49",
      "Term Plan": "43",
      ULIP: "44",
      Others: "50",
    };

    return categoryMapping[selectedCategory.label] || "default";
  };

  // Calculate policy term based on start and end dates
  const calculatePolicyTerm = (startDate, endDate) => {
    if (!startDate || !endDate) return "";

    try {
      const start = moment(startDate);
      const end = moment(endDate);

      if (!start.isValid() || !end.isValid()) return "";

      // Ensure end date is after start date
      if (end.isSameOrBefore(start)) {
        return "";
      }

      const years = end.diff(start, "years", true);
      const roundedYears = Math.ceil(years);

      // Ensure minimum 1 year and maximum 100 years
      if (roundedYears < 1) return "1";
      if (roundedYears > 100) return "100";

      return roundedYears.toString();
    } catch (error) {
      console.error("Error calculating policy term:", error);
      return "";
    }
  };

  // Auto-calculate policy term when dates change
  useEffect(() => {
    if (
      insuranceData.insurance_purchase_date &&
      insuranceData.insurance_payment_enddate
    ) {
      const calculatedTerm = calculatePolicyTerm(
        insuranceData.insurance_purchase_date,
        insuranceData.insurance_payment_enddate
      );

      if (
        calculatedTerm &&
        calculatedTerm !== insuranceData.insurance_policy_term
      ) {
        setInsuranceData((prev) => ({
          ...prev,
          insurance_policy_term: calculatedTerm,
        }));
      }
    } else if (
      !insuranceData.insurance_purchase_date ||
      !insuranceData.insurance_payment_enddate
    ) {
      // Clear policy term if dates are not both set
      if (insuranceData.insurance_policy_term) {
        setInsuranceData((prev) => ({
          ...prev,
          insurance_policy_term: "",
        }));
      }
    }
  }, [
    insuranceData.insurance_purchase_date,
    insuranceData.insurance_payment_enddate,
  ]);

  simpleValidator.current.purgeFields();
  // For Select Style
  const customStyles = {
    option: (base, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...base,
        backgroundColor: "#ffff",
        color: isFocused ? "#042b62" : isSelected ? "#042b62" : "gray",
        cursor: "pointer",
      };
    },
    control: (base, { isDisabled }) => ({
      ...base,
      backgroundColor: isDisabled ? "#f5f5f5" : "#fff",
      cursor: isDisabled ? "not-allowed" : "default",
      opacity: isDisabled ? 0.7 : 1,
    }),
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

  return (
    <>
      <div className="px-0 px-md-4 assetForm">
        <div
          className="p-3"
          style={{ border: "1px solid #d8d8d8", borderRadius: 10 }}
        >
          <div className="d-flex">
            <Link
              to={
                process.env.PUBLIC_URL +
                "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=2"
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
              {id != undefined ? "Edit Your Insurance" : "Add Your Insurance"}
              {/* Add Your Insurance */}
            </h3>
          </div>
          <hr style={{ color: "#afafaf" }} />
          <div className="row">
            <div className="col-12 col-md-11 col-lg-8 m-auto">
              <p className="text-center">
                Enter Your Details To {id != undefined ? "Edit " : "Add "}{" "}
                Existing Insurance
              </p>
              <br />
              <br />
              <div>
                <div className="my-md-4">
                  <div className="">
                    <span className="lbl-newbond">
                      Select Insurance Category *
                    </span>
                    <br />

                    <Select
                      className="fnto-dropdown-react"
                      classNamePrefix="sortSelect"
                      styles={customStyles}
                      isSearchable={false}
                      options={insuranceCategories}
                      value={selectedInsuranceCategory}
                      name="insuranceCategory"
                      placeholder="Select Insurance Category"
                      onChange={
                        id != undefined
                          ? undefined
                          : handleInsuranceCategoryChange
                      }
                      isDisabled={id != undefined}
                    />
                    {(showAllValidationErrors ||
                      simpleValidator.current.message(
                        "Insurance Category",
                        selectedInsuranceCategory,
                        "required"
                      )) &&
                      !selectedInsuranceCategory && (
                        <div
                          className="text-danger"
                          style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}
                        >
                          The insurance category field is required.
                        </div>
                      )}
                  </div>
                </div>

                <div>
                  <div
                    className="row"
                    style={{ display: "flex", flexWrap: "wrap" }}
                  >
                    {isInputInPolicy(
                      "insurance_name",
                      getOldCategoryIdForValidation(selectedInsuranceCategory)
                    ) &&
                      selectedInsuranceCategory?.insurance_cat_uuid !==
                        "ulip" && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Insurance Policy Name *
                              </span>
                              <br />
                              <input
                                autoComplete="off"
                                placeholder="Enter Insurance Policy Name"
                                className={` w-100 fntoo-textbox-react inputPlaceholder`}
                                type="text"
                                maxLength={35}
                                name="insurance_name"
                                value={insuranceData.insurance_name}
                                onChange={(e) => onInputChange(e)}
                              />
                              {(showAllValidationErrors ||
                                simpleValidator.current.message(
                                  "Insurance Policy Name",
                                  insuranceData.insurance_name,
                                  "required"
                                )) &&
                                !insuranceData.insurance_name && (
                                  <div
                                    className="text-danger"
                                    style={{
                                      fontSize: "0.875rem",
                                      marginTop: "0.25rem",
                                    }}
                                  >
                                    The insurance policy name field is required.
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                    {isInputInPolicy(
                      "ulip",
                      getOldCategoryIdForValidation(selectedInsuranceCategory)
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">ULIP *</span>
                            <br />
                            <Select
                              className="fnto-dropdown-react"
                              classNamePrefix="sortSelect"
                              styles={customStyles}
                              isSearchable={true}
                              options={ulipFund}
                              name="ulip"
                              value={getInsuranceTypeData(
                                ulipFund,
                                insuranceData.insurance_name,
                                true
                              )}
                              onChange={(e) => {
                                setInsuranceData({
                                  ...insuranceData,
                                  insurance_name: e.label,
                                  insurance_ms_secid: e.value,
                                  ulip_data: {
                                    share_name: e.label,
                                    ms_secid: e.value,
                                  },
                                });
                              }}
                            />
                            {simpleValidator.current.message(
                              "ULIP",
                              insuranceData.insurance_name,
                              "required",
                              {
                                messages: {
                                  required: "The ULIP field is required",
                                },
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">Policy Number *</span>
                          <br />
                          <input
                            autoComplete="off"
                            placeholder="Enter Policy Number (6-12 digits only)"
                            className={` w-100 fntoo-textbox-react inputPlaceholder`}
                            type="text"
                            name="insurance_policy_number"
                            maxLength={12}
                            value={insuranceData.insurance_policy_number}
                            onChange={(e) => onSumAssuredInputChange(e, true)}
                          />
                          {showPolicyNumberError && (
                            <div
                              className="text-danger"
                              style={{
                                fontSize: "0.875rem",
                                marginTop: "0.25rem",
                              }}
                            >
                              The policy number must be at least 6 characters.
                            </div>
                          )}
                          {!showPolicyNumberError &&
                            simpleValidator.current.message(
                              "Policy Number",
                              insuranceData.insurance_policy_number,
                              "required|numeric|min:6|max:12",
                              {
                                messages: {
                                  min: "The policy number must be at least 6 characters.",
                                },
                              }
                            )}
                        </div>
                      </div>
                    </div>
                    {isInputInPolicy(
                      "typeOfGeneralInsurance",
                      getOldCategoryIdForValidation(selectedInsuranceCategory)
                    ) && (
                      <div className="col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">
                              Type Of General Insurance *
                            </span>
                            <br />

                            <Select
                              className="fnto-dropdown-react"
                              classNamePrefix="sortSelect"
                              styles={customStyles}
                              isSearchable={false}
                              options={options_type_of_general_insurance}
                              name="typeOfGeneralInsurance"
                              value={getInsuranceTypeData(
                                options_type_of_general_insurance,
                                insuranceData.insurance_type
                              )}
                              onChange={(e) =>
                                onDateAndSelectInputChange(
                                  "insurance_type",
                                  e.value
                                )
                              }
                            />
                            {simpleValidator.current.message(
                              "Type Of General Insurance",
                              insuranceData.insurance_type,
                              "required"
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">Premium Amount *</span>
                          <br />
                          <input
                            autoComplete="off"
                            placeholder="Enter Premium Amount"
                            className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                            type="text"
                            name="insurance_premium_amount"
                            maxLength={11}
                            value={insuranceData.insurance_premium_amount}
                            onChange={(e) => onSumAssuredInputChange(e, true)}
                          />
                          {(showAllValidationErrors ||
                            simpleValidator.current.message(
                              "Premium Amount",
                              removeCommasFromNumber(
                                insuranceData.insurance_premium_amount
                              ),
                              "required|numeric|min:1,num"
                            )) &&
                            !insuranceData.insurance_premium_amount && (
                              <div
                                className="text-danger"
                                style={{
                                  fontSize: "0.875rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                The premium amount field is required.
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">
                            Premium Payment Frequency *
                          </span>
                          <br />
                          <Select
                            className="fnto-dropdown-react"
                            classNamePrefix="sortSelect"
                            styles={customStyles}
                            isSearchable={false}
                            options={getFrequencyOptions(
                              selectedInsuranceCategory
                            )}
                            name="premiumPaymentFrequency"
                            value={getSelectValueData(
                              getFrequencyOptions(selectedInsuranceCategory),
                              insuranceData.insurance_paying_frequency
                            )}
                            onChange={(e) =>
                              onDateAndSelectInputChange(
                                "insurance_paying_frequency",
                                e.value
                              )
                            }
                            placeholder="Select Premium Payment Frequency"
                          />
                          {(showAllValidationErrors ||
                            simpleValidator.current.message(
                              "Premium Payment Frequency",
                              insuranceData.insurance_paying_frequency,
                              "required"
                            )) &&
                            !insuranceData.insurance_paying_frequency && (
                              <div
                                className="text-danger"
                                style={{
                                  fontSize: "0.875rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                The premium payment frequency field is required.
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">Sum Assured *</span>
                          <br />
                          <input
                            autoComplete="off"
                            placeholder="Enter Sum Assured"
                            className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                            type="text"
                            maxLength={11}
                            name="insurance_sum_assured"
                            value={insuranceData.insurance_sum_assured}
                            onChange={(e) => onSumAssuredInputChange(e, true)}
                          />
                          {(showAllValidationErrors ||
                            simpleValidator.current.message(
                              "Sum Assured",
                              removeCommasFromNumber(
                                insuranceData.insurance_sum_assured
                              ),
                              "required|numeric|min:1,num"
                            )) &&
                            !insuranceData.insurance_sum_assured && (
                              <div
                                className="text-danger"
                                style={{
                                  fontSize: "0.875rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                The sum assured field is required.
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    {isInputInPolicy(
                      "insurance_surrender_value",
                      getOldCategoryIdForValidation(selectedInsuranceCategory)
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">Surrender Value</span>
                            <br />
                            <input
                              autoComplete="off"
                              placeholder="Enter Surrender Value"
                              className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                              type="text"
                              maxLength={11}
                              name="insurance_surrender_value"
                              value={insuranceData.insurance_surrender_value}
                              onChange={(e) => onSumAssuredInputChange(e, true)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {isInputInPolicy(
                      "insurance_premium_topup",
                      getOldCategoryIdForValidation(selectedInsuranceCategory)
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">Top Up</span>
                            <br />
                            <input
                              autoComplete="off"
                              placeholder="Enter Top Up"
                              className={` w-100 fntoo-textbox-react inputPlaceholder`}
                              type="text"
                              maxLength={11}
                              name="insurance_premium_topup"
                              value={insuranceData.insurance_premium_topup}
                              onChange={(e) => onInputChange(e, true)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {isInputInPolicy(
                      "insurance_maturity_amount",
                      getOldCategoryIdForValidation(selectedInsuranceCategory)
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">
                              Insurance Maturity Amount (if any) *
                            </span>
                            <br />
                            <input
                              autoComplete="off"
                              placeholder="Enter Insurance Maturity Amount"
                              className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                              type="text"
                              name="insurance_maturity_amount"
                              maxLength={11}
                              value={insuranceData.insurance_maturity_amount}
                              onChange={(e) => onSumAssuredInputChange(e, true)}
                            />
                            {(showAllValidationErrors ||
                              simpleValidator.current.message(
                                "Insurance Maturity Amount",
                                removeCommasFromNumber(
                                  insuranceData.insurance_maturity_amount
                                ),
                                "required|numeric|min:1,num"
                              )) &&
                              !insuranceData.insurance_maturity_amount && (
                                <div
                                  className="text-danger"
                                  style={{
                                    fontSize: "0.875rem",
                                    marginTop: "0.25rem",
                                  }}
                                >
                                  The insurance maturity amount field is
                                  required.
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">
                            Date of Purchase *
                          </span>
                          <br />
                          <div className="bonds-datepicker">
                            <FintooDatePicker
                              dateFormat="dd/MM/yyyy"
                              autoComplete="off"
                              maxDate={new Date()}
                              selected={
                                insuranceData.insurance_purchase_date === ""
                                  ? ""
                                  : new Date(
                                      insuranceData.insurance_purchase_date
                                    )
                              }
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              customClass="datePickerDMF"
                              name="dateOfPurchase"
                              onChange={(e) =>
                                onDateAndSelectInputChange(
                                  "insurance_purchase_date",
                                  formatDatefun(e)
                                )
                              }
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>
                          {(showAllValidationErrors ||
                            simpleValidator.current.message(
                              "Date of Purchase",
                              insuranceData.insurance_purchase_date,
                              "required"
                            )) &&
                            !insuranceData.insurance_purchase_date && (
                              <div
                                className="text-danger"
                                style={{
                                  fontSize: "0.875rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                The date of purchase field is required.
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">
                            Premium Payment End Date *
                          </span>
                          <br />
                          <div className="bonds-datepicker">
                            <FintooDatePicker
                              minDate={
                                insuranceData.insurance_purchase_date
                                  ? moment(
                                      insuranceData.insurance_purchase_date
                                    )
                                      .add(1, "y")
                                      .toDate()
                                  : new Date()
                              }
                              dateFormat="dd/MM/yyyy"
                              selected={
                                insuranceData.insurance_payment_enddate === ""
                                  ? ""
                                  : new Date(
                                      insuranceData.insurance_payment_enddate
                                    )
                              }
                              showMonthDropdown
                              showYearDropdown
                              autoComplete="off"
                              dropdownMode="select"
                              customClass="datePickerDMF"
                              name="premiumPaymentEndDate"
                              onChange={(e) =>
                                onDateAndSelectInputChange(
                                  "insurance_payment_enddate",
                                  formatDatefun(e)
                                )
                              }
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>
                          {(showAllValidationErrors ||
                            simpleValidator.current.message(
                              "Premium Payment End Date",
                              insuranceData.insurance_payment_enddate,
                              "required"
                            )) &&
                            !insuranceData.insurance_payment_enddate && (
                              <div
                                className="text-danger"
                                style={{
                                  fontSize: "0.875rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                The premium payment end date field is required.
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">
                            Policy Term (Years) *
                          </span>
                          <br />
                          <input
                            placeholder="Auto-calculated from start and end dates"
                            autoComplete="off"
                            className={` w-100 fntoo-textbox-react inputPlaceholder`}
                            type="text"
                            maxLength={3}
                            name="insurance_policy_term"
                            value={insuranceData.insurance_policy_term || ""}
                            onChange={(e) => onInputChange(e, true)}
                            readOnly={
                              insuranceData.insurance_purchase_date &&
                              insuranceData.insurance_payment_enddate
                            }
                            style={{
                              backgroundColor:
                                insuranceData.insurance_purchase_date &&
                                insuranceData.insurance_payment_enddate
                                  ? "#f5f5f5"
                                  : "white",
                              cursor:
                                insuranceData.insurance_purchase_date &&
                                insuranceData.insurance_payment_enddate
                                  ? "not-allowed"
                                  : "text",
                            }}
                          />
                          {(showAllValidationErrors ||
                            simpleValidator.current.message(
                              "Policy Term (Years)",
                              insuranceData.insurance_policy_term,
                              "required|numeric|min:1,num"
                            )) &&
                            !insuranceData.insurance_policy_term && (
                              <div
                                className="text-danger"
                                style={{
                                  fontSize: "0.875rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                The policy term field is required.
                              </div>
                            )}
                          {insuranceData.insurance_purchase_date &&
                            insuranceData.insurance_payment_enddate && (
                              <small className="text-muted d-block mt-1">
                                <i className="fas fa-info-circle me-1"></i>
                                Auto-calculated from start and end dates
                              </small>
                            )}
                          {(!insuranceData.insurance_purchase_date ||
                            !insuranceData.insurance_payment_enddate) && (
                            <small className="text-muted d-block mt-1">
                              <i className="fas fa-info-circle me-1"></i>
                              Policy term will be auto-calculated when both
                              start and end dates are selected
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                    {isInputInPolicy(
                      "recurring_insurance",
                      getOldCategoryIdForValidation(selectedInsuranceCategory)
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">
                              Is Maturity One Time Or Recurring ? *
                            </span>
                            <br />
                            <div className="bonds-datepicker">
                              <div className="insurance-switch-container">
                                <span>One Time&nbsp;&nbsp;</span>{" "}
                                <FormSwitch
                                  switchValue={maturityToggle}
                                  onSwitchToggle={() => {
                                    const newValue = !maturityToggle;
                                    setMaturityToggle(newValue);

                                    if (!newValue) {
                                      // If turning off recurring, store original data and clear current data
                                      setOriginalRecurringData(
                                        insuranceData.recurring_insurance
                                      );
                                      setInsuranceData((prev) => ({
                                        ...prev,
                                        recurring_insurance: [],
                                      }));
                                    } else {
                                      // If turning on recurring, restore original data if available
                                      if (
                                        originalRecurringData &&
                                        originalRecurringData.length > 0
                                      ) {
                                        setInsuranceData((prev) => ({
                                          ...prev,
                                          recurring_insurance:
                                            originalRecurringData,
                                        }));
                                      } else {
                                        setInsuranceData((prev) => ({
                                          ...prev,
                                          recurring_insurance: [
                                            { refId: uuid(), isValid: false },
                                          ],
                                        }));
                                      }
                                    }

                                    // Force re-render to ensure switch updates
                                    forceUpdate(1);
                                  }}
                                />{" "}
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;Recurring</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {isInputInPolicy(
                      "anyPreExistingDisease",
                      getOldCategoryIdForValidation(selectedInsuranceCategory)
                    ) && (
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">
                              Any Pre Existing Disease ? *
                            </span>
                            <br />
                            <div className="bonds-datepicker">
                              <div className="insurance-switch-container">
                                <span>No&nbsp;&nbsp;</span>{" "}
                                <FormSwitch
                                  switchValue={existingDiseaseToggle}
                                  onSwitchToggle={() =>
                                    setExistingDiseaseToggle(
                                      (previous) => !previous
                                    )
                                  }
                                />{" "}
                                <span>&nbsp;&nbsp;&nbsp;&nbsp;Yes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {existingDiseaseToggle &&
                      isInputInPolicy(
                        "disease_name",
                        getOldCategoryIdForValidation(selectedInsuranceCategory)
                      ) && (
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Name Of The Disease *
                              </span>
                              <br />
                              <input
                                autoComplete="off"
                                placeholder="Enter Name Of The Disease"
                                className={` w-100 fntoo-textbox-react inputPlaceholder`}
                                type="text"
                                maxLength={35}
                                name="disease_name"
                                value={insuranceData.disease_name}
                                onChange={(e) => {
                                  // Only allow alphabetic characters and spaces
                                  const value = e.target.value.replace(
                                    /[^A-Za-z\s]/g,
                                    ""
                                  );
                                  setInsuranceData({
                                    ...insuranceData,
                                    disease_name: value,
                                  });
                                }}
                              />
                              {simpleValidator.current.message(
                                "Name Of The Disease",
                                insuranceData.disease_name,
                                "required"
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
                {maturityToggle &&
                  "recurring_insurance" in insuranceData &&
                  insuranceData.recurring_insurance.length >= 0 &&
                  isInputInPolicy(
                    "recurring_insurance",
                    getOldCategoryIdForValidation(selectedInsuranceCategory)
                  ) &&
                  (() => {
                    return (
                      <RecurringMaturityComponent
                        data={insuranceData.recurring_insurance}
                        setToggle={() =>
                          setMaturityToggle((previous) => !previous)
                        }
                        onAdd={() => {
                          setInsuranceData((prev) => ({
                            ...prev,
                            recurring_insurance: [
                              ...prev.recurring_insurance,
                              { refId: uuid(), isValid: false },
                            ],
                          }));
                        }}
                        onUpdate={(newData) => {
                          setInsuranceData((prev) => ({
                            ...prev,
                            recurring_insurance: [...newData],
                          }));
                        }}
                      />
                    );
                  })()}
                <div
                  className="row"
                  style={{ display: "flex", flexWrap: "wrap" }}
                >
                  {isInputInPolicy(
                    "addBonus",
                    getOldCategoryIdForValidation(selectedInsuranceCategory)
                  ) && (
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">Add Bonus</span>
                          <br />
                          <div className="bonds-datepicker">
                            <div className="insurance-switch-container">
                              <span>No&nbsp;&nbsp;</span>{" "}
                              <FormSwitch
                                key={`bonus-toggle-${addBonusToggle}`}
                                switchValue={addBonusToggle}
                                onSwitchToggle={() => {
                                  const newValue = !addBonusToggle;
                                  setAddBonusToggle(newValue);

                                  if (!newValue) {
                                    // If turning off bonus, store original data and clear current data
                                    setOriginalBonusData(
                                      insuranceData.recurring_bonus_amount
                                    );
                                    setInsuranceData((prev) => ({
                                      ...prev,
                                      recurring_bonus_amount: [
                                        { refId: uuid(), isValid: false },
                                      ],
                                    }));
                                  } else {
                                    // If turning on bonus, restore original data if available
                                    if (
                                      originalBonusData &&
                                      originalBonusData.length > 0
                                    ) {
                                      setInsuranceData((prev) => ({
                                        ...prev,
                                        recurring_bonus_amount:
                                          originalBonusData,
                                      }));
                                    } else {
                                      setInsuranceData((prev) => ({
                                        ...prev,
                                        recurring_bonus_amount: [
                                          { refId: uuid(), isValid: false },
                                        ],
                                      }));
                                    }
                                  }

                                  // Force re-render to ensure switch updates
                                  forceUpdate(1);
                                }}
                              />{" "}
                              <span>&nbsp;&nbsp;&nbsp;&nbsp;Yes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {addBonusToggle &&
                    "recurring_bonus_amount" in insuranceData &&
                    insuranceData.recurring_bonus_amount.length >= 0 &&
                    isInputInPolicy(
                      "addBonus",
                      getOldCategoryIdForValidation(selectedInsuranceCategory)
                    ) &&
                    (() => {
                      return (
                        <AddBonusComponent
                          bonousData={insuranceData.recurring_bonus_amount}
                          setToggle={() =>
                            setAddBonusToggle((previous) => !previous)
                          }
                          onAdd={() => {
                            setInsuranceData((prev) => ({
                              ...prev,
                              recurring_bonus_amount: [
                                ...prev.recurring_bonus_amount,
                                { refId: uuid(), isValid: false },
                              ],
                            }));
                          }}
                          onUpdate={(newData) => {
                            setInsuranceData((prev) => ({
                              ...prev,
                              recurring_bonus_amount: [...newData],
                            }));
                          }}
                        />
                      );
                    })()}
                  {isInputInPolicy(
                    "insurance_maturity_amount",
                    getOldCategoryIdForValidation(selectedInsuranceCategory)
                  ) && (
                    <div className="col-md-6 col-12">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">Maturity Bonus *</span>
                          <br />
                          <input
                            autoComplete="off"
                            placeholder="Enter Maturity Bonus"
                            className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                            type="text"
                            name="insurance_maturity_amount"
                            maxLength={11}
                            value={insuranceData.insurance_maturity_amount}
                            onChange={(e) => onSumAssuredInputChange(e, true)}
                          />
                          {(showAllValidationErrors ||
                            simpleValidator.current.message(
                              "Maturity Bonus",
                              removeCommasFromNumber(
                                insuranceData.insurance_maturity_amount
                              ),
                              "required|numeric|min:1,num"
                            )) &&
                            !insuranceData.insurance_maturity_amount && (
                              <div
                                className="text-danger"
                                style={{
                                  fontSize: "0.875rem",
                                  marginTop: "0.25rem",
                                }}
                              >
                                The maturity bonus field is required.
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <br />
                <div className="my-md-4">
                  <button
                    type="submit"
                    className="d-block m-auto btn btn-primary"
                    onClick={() => validateForm()}
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
export default NewInsuranceFormView;
