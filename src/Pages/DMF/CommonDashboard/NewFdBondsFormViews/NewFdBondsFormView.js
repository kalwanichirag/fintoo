import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Link, useSearchParams } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import FormRangeSlider from "../CommonDashboardComponents/FormRangeSlider";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import FormSwitch from "../CommonDashboardComponents/formSwitch";
import SimpleReactValidator from "simple-react-validator";
// import { formatDatefun } from "../../../../Utils/Date/DateFormat";
import OTPInput from "otp-input-react";
import { DATA_BELONGS_TO } from "../../../../constants";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import {
  getUserId,
  getFpUserDetailsId,
  getParentUserId,
  getItemLocal,
  fv,
} from "../../../../common_utilities";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { MdHomeMax } from "react-icons/md";
import LinkEPF from "./LinkEPF";
import { GetBankList } from "../../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  getAssetCategoryList,
  addAssetDetails,
  getAssetDetails,
  UpdateAssetDetails,
  deleteAssetDetails,
} from "../../../../FrappeIntegration-Services/services/financial-planning-api/asset";
import { getInsuranceDetails } from "../../../../FrappeIntegration-Services/services/financial-planning-api/insurance";
import { getOtherInvestments, updateUserAssetDetails } from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";
import FintooLoader from "../../../../components/FintooLoader";

const numericRegex = new RegExp(/^\d*\.?\d*$/);

const initialState = {
  typeOfAsset: "",
  bankInstituteName: "",
  fdMemberName: "",
  purchaseDate: "",
  purchaseAmount: "",
  interestRate: "",
  payoutType: "",
  maturityDate: "",
  maturityAmount: "",
  asset_sub_cat_id: "",
};

const defaultAssetDetails = {
  asset_amount: "",
  asset_abreturn: "0",
  annual_growth_rate: "10",
  asset_broker_id: 0,
  asset_category_id: 0,
  asset_citytype: "0",
  asset_current_unit_price: "",
  asset_currency: false,
  user_asset_source: "Manual",
  asset_epf_ismanual: "1",
  asset_folio_number: null,
  asset_footnote: null,
  asset_frequency: "1",
  asset_goal_link_id: 0,
  asset_goalname: null,
  asset_gold_karat: 0,
  asset_isActive: "1",
  asset_ismortgage: "0",
  asset_isperpetual: "3",
  asset_isallocation: false,
  asset_iselss: "1",
  asset_islinkable: true,
  asset_isrecurring: false,
  asset_isrented: "1",
  asset_maturity_amt: 0,
  asset_maturity_date: null,
  asset_member_id: 0,
  asset_mf_end_date: null,
  asset_name: "Art Investment",
  asset_pan: null,
  asset_payout_type: "1",
  asset_pin_code: "",
  asset_purchase_amount: "",
  asset_purchase_date: null,
  asset_rental_amount: "",
  asset_rental_income: null,
  asset_ror: "0",
  asset_sub_cat_id: 64,
  asset_unique_code: "",
  asset_units: 0,
  categorydetail: "Debt",
  created_datetime: moment().format("DD/MM/YYYY"),
  employee_contribution: "",
  employer_contribution: "",
  installment_ispaid: 1,
  membername1: "",
  stock_mf: null,
  stock_name: null,
  subcategorydetail: "",
  totalinvestedvalue: "",
  totalpurchasevalue: "",
  totalmaturtiyamount: "",
  updated_datetime: moment().format("DD/MM/YYYY"),
  user_id: 0,
  scheme_equityshare: {},
  linked_goals_id: [],
};

const NewFdBondsFormView = () => {
  const [, forceUpdate] = useState(1);
  const [formData, setFormData] = useState(initialState);
  const [assetsDetails, setAssetsDetails] = useState(defaultAssetDetails);
  const [addForm, setAddForm] = useState(true);
  const [updateForm, setUpdateForm] = useState(false);
  const [assetEditId, setAssetEditId] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [activeIndex, setActiveIndex] = useState(1);
  const [sliderValue, setSliderValue] = useState("Yearly");
  const [maturityCalculation, setMaturityCalculation] = useState(0);

  const [activeIndex2, setActiveIndex2] = useState(4);
  const [isInstallmentPaid, setIsInstallmentPaid] = useState(true);

  const [interestRate, setInterestRate] = useState(0);
  const [rateOfReturn, setRateOfReturn] = useState(8.1);
  const [growthRate, setGrowthRate] = useState(10);
  const [yearsOfService, setYearsOfService] = useState("5");
  const [allBank, setAllBank] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [session, setSession] = useState([]);
  const [modalType, setModalType] = useState(0);
  const [usEquityDetails, setUsEquityDetails] = useState([]);
  const [assetForMember, setAssetForMember] = useState("");
  const [categories, setCategories] = useState([]);

  // ---------------------------------------------------- EPF states ----------------------------------------------------
  const [showEPFForm, setShowEPFForm] = useState(false);
  const [showUANModal, setShowUANModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isManual, setIsManual] = useState(false);

  // --------------------------------------------------------------------------------------------------------------------
  const [familyData, setFamilyData] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const simpleValidator = useRef(new SimpleReactValidator());
  const [fdBondPayload, setFdBondPayload] = useState("");
  const [assetDetails, setAssetDetails] = useState({});
  const { id } = useParams();
  const [isApiReady, setIsApiReady] = useState(false);
  const [userAssetDetails, setUserAssetDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // // checksession();
    getFamilyMembers();
    // userDetails();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let asset_id = urlParams.get("id");
    if (asset_id) {
      setUpdateForm(true);
      setAddForm(false);
      setAssetEditId(asset_id);
      editFdData(asset_id);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle case where family data loads after form data is set
  useEffect(() => {
    if (
      formData.fdMemberName !== "" &&
      formData.fdMemberName !== null &&
      formData.fdMemberName !== undefined &&
      familyData.length > 0
    ) {
      const foundMember = familyData.find(
        (v) => v.value == formData.fdMemberName
      );
      if (!foundMember) {
      }
    }
  }, [formData.fdMemberName, familyData]);


  useEffect(() => {
      const fetchCategories = async () => {
        try {
  
          const asset_category = await getAssetCategoryList();
  
          const categoryList = asset_category?.data?.[0]?.category_list || [];
  
          const debtCategory = categoryList.find(
            (cat) => cat.asset_name === "Debt"
          );
          let fdBondPayloadData = {
            "AssetCategoryUuid": debtCategory.asset_name_uuid,
            "AssetSubCategories": []
          };
  
          if (debtCategory) {
  
            const allowedUUIDs = ["liquid", "debt_others", "bonds", "debt_mf"];

            const assetSubCategories = debtCategory.subcategories
              .filter(sub => allowedUUIDs.includes(sub.asset_sub_name_uuid))
              .map(sub => ({
                AssetSubNameUuid: sub.asset_sub_name_uuid,
                AssetTypes: sub.asset_types || []
              }));
          
            setFdBondPayload(prev => ({
              ...prev,
              AssetSubCategories: assetSubCategories
            }));

            for (const sub of debtCategory.subcategories) {
              if (sub.asset_sub_name_uuid === "liquid" || sub.asset_sub_name_uuid === "debt_others" || sub.asset_sub_name_uuid === "bonds" || sub.asset_sub_name_uuid === "debt_mf") {
                fdBondPayloadData.AssetSubCategories.push(
                  {"AssetSubNameUuid": sub.asset_sub_name_uuid, "AssetTypes": sub.asset_types, "AssetSubNameId": sub.asset_sub_id}
                )
                sub.asset_types?.map((item) => {
                  if (fdBondPayloadData.AssetSubCategories.AssetSubNameUuid == sub.asset_sub_name_uuid){
                    fdBondPayloadData.AssetSubCategories.AssetTypes.push(item);
                  }
                });
              }
            }
            setFdBondPayload(fdBondPayloadData);
  
          }
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      };
  
      fetchCategories();
  }, []);


  const formatDatefun = (date) => {
    // return moment(date).format("YYYY/MM/DD");

    return moment(date).toDate();
  };
  _;

  function editMaturityAmount({
    asset_ror,
    asset_purchase_date,
    asset_purchase_amount,
    asset_maturity_date,
  }) {
    // Convert dates to Date objects
    const purchaseDate = new Date(asset_purchase_date);
    const maturityDate = new Date(asset_maturity_date);

    const years =
      (maturityDate - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25);

    const rate = asset_ror / 100;

    const purchaseAmount = parseFloat(asset_purchase_amount);

    const maturityAmount = purchaseAmount * Math.pow(1 + rate, years);

    return maturityAmount.toFixed(2);
  }

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

  const editFdData = async (id) => {
    try {
      
      var payload = {
        user_id: getUserId(),
        user_asset_id: id
      }

      var response = await getOtherInvestments(payload);

      if (response?.status_code == "200") {
        
        setUserAssetDetails(response.data.listing[0]);
        setIsApiReady(true);
        
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Failed to fetch FD/Bonds data");
        return;
      }
      
    } catch (err) {
      console.error("Error in editFdData:", err);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        "Failed to load asset details. Please check your connection and try again."
      );
    }
  };

  const options = [
    { value: "fixed_deposit", label: "Fixed Deposit" },
    { value: "private_bonds", label: "Private Bonds" },
    { value: "public_bonds", label: "Public Bonds" },
    { value: "debentures", label: "Debentures" },
    { value: "gratuity", label: "Gratuity" },
    { value: "rd", label: "Recurring Deposit" },
  ];

  const optionSubCategory = {
    "Fixed Deposit": 75,
    "Private Bonds": 79,
    "Public Bonds": 79,
    Debentures: 80,
    EPF: 117,
    NPS: 15, // Changed from 118 to 15 to match API response
    Gratuity: 82,
    "Recurring Deposit": 120,
    Others: 87,
  };

  function getSelectedAssetObject(selectedName) {
    for (let sub of categories.subcategories) {
      // Case 1: check asset types first (so "Land" resolves to type, not subcategory)
      for (let type of sub.asset_types) {
        if (type.asset_type_name === selectedName) {
          return {
            asset_id: categories.asset_id,
            asset_name: categories.asset_name,
            asset_name_uuid: categories.asset_name_uuid,
            asset_sub_id: sub.asset_sub_id,
            asset_sub_name: sub.asset_sub_name,
            asset_sub_name_uuid: sub.asset_sub_name_uuid,
            asset_type_id: type.asset_type_id,
            asset_type_name_uuid: type.asset_type_name_uuid,
            asset_type_name: type.asset_type_name,
          };
        }
      }

      // Case 2: check subcategory (only if no type matched)
      if (sub.asset_sub_name === selectedName) {
        return {
          asset_id: categories.asset_id,
          asset_name: categories.asset_name,
          asset_name_uuid: categories.asset_name_uuid,
          asset_sub_id: sub.asset_sub_id,
          asset_sub_name: sub.asset_sub_name,
          asset_sub_name_uuid: sub.asset_sub_name_uuid,
          asset_type_id: "",
          asset_type_name_uuid: "",
          asset_type_name: "",
        };
      }
    }

    // If nothing matches, return everything empty
    return {
      asset_id: "",
      asset_name: "",
      asset_name_uuid: "",
      asset_sub_id: "",
      asset_sub_name: "",
      asset_sub_name_uuid: "",
      asset_type_id: "",
      asset_type_name_uuid: "",
      asset_type_name: "",
    };
  }

  const Purchaseoptions = [
    { value: "Cumulative", label: "Cumulative" },
    { value: "Non-Cumulative", label: "Non-Cumulative" },
  ];

  // const handleClick = (index, value) => {
  //   setActiveIndex(index);
  //   setSliderValue(value);
  // };

  const handleClick2 = (index, value) => {
    setActiveIndex2(index);
    setSliderValue(value);
  };

  const onInputChange = (e, isNumeric) => {
    const name = e.target.name;
    let value = e.target.value.replace(/,/g, ""); // remove commas before validating

    if (isNumeric && !numericRegex.test(value) && value !== "") {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };


  const onDateAndSelectInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (simpleValidator.current.allValid()) {
      addAssets();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate((v) => ++v);
    }
  };

  const validateUpdateForm = () => {
    if (simpleValidator.current.allValid()) {
      UpdateFdBondAsset();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate((v) => ++v);
    }
  };


  const getFamilyMembers = async () => {
    try {
      const member_data = await getFamilyMember(getUserId());

      if (member_data.status_code === "200") {
        let member_array = [];
        let filter_member = [];

        const members = member_data["data"];

        members.forEach((member) => {
          const isSelf = member.relation_id === 1 || member.relation === "Self";
          const memberId = member.user_id;
          const parentId = member.user_parent_id;

          const label = isSelf ? "Self" : member.user_name ?? member.user_email;

          const commonData = {
            value: memberId,
            label,
            dob: member.dob,
            life_expectancy: member.life_expectancy_age,
            isdependent: member.is_dependent,
          };

          member_array.push(commonData);
          filter_member.push({ value: memberId, label });

          if (isSelf && !parentId) {
            setAssetForMember(memberId);
            setAssetsDetails((prev) => ({
              ...prev,
              asset_member_id: memberId,
            }));
            setFormData({
              ...formData,
              aifmembername: memberId,
            });

            const assetSubCategoryIds = [
              "UCAT-5",
              "ASC-30",
              "ASC-10",
              "ASC-16",
              "ASC-11",
              "ASC-12",
              "ATM-4",
              "ATM-6",
              "ASC-25",
              "ASC-17",
              "ATM-40",
              "ASC-31",
              "ASC-27",
              "ASC-21",
              "ASC-13",
              "ASC-29",
              "ATM-24",
              "ASC-28",
              "ATM-23",
            ];

            // if (assetSubCategoryIds.includes(assetsDetails.asset_sub_cat_id)) {
            //   member_array.push({
            //     value: 0,
            //     label: "Family",
            //     retirement_age: member.retirement_age,
            //     dob: member.dob,
            //     life_expectancy: member.life_expectancy_age,
            //     isdependent: member.is_dependent,
            //   });
            // }
            member_array.push({
              value: "0",
              label: "Family",
              retirement_age: member.retirement_age,
              dob: member.dob,
              life_expectancy: member.life_expectancy_age,
              isdependent: member.is_dependent,
            });
            filter_member.push({ value: 0, label: "Family" });
          }
        });

        setFamilyData(member_array);
        setMemberData(filter_member);

        // Set default member selection (only if not in edit mode and not in add mode)
        // Commented out to show placeholder instead of default value
        // if (member_array.length > 0 && !formData.fdMemberName && !updateForm) {
        //   const defaultMember =
        //     member_array.find(
        //       (v) =>
        //         v.value ==
        //         (getItemLocal("family") ? getParentUserId() : getUserId())
        //     ) || member_array[0];

        //   if (defaultMember) {
        //     setFormData((prev) => ({
        //       ...prev,
        //       fdMemberName: defaultMember.value,
        //     }));
        //   }
        // }
      } else {
        setFamilyData([]);
        setMemberData([]);
      }
    } catch (error) {
      setFamilyData([]);
      setMemberData([]);
    }
  };

  const getAssetDetails = (assetData, selectedAssetTypeUuid) => {
    for (const sub of assetData.AssetSubCategories) {
      const foundType = sub.AssetTypes.find(
        (t) => t.asset_type_name_uuid === selectedAssetTypeUuid
      );
      if (foundType) {
        return {
          assetCategoryUuid: assetData.AssetCategoryUuid,
          assetSubNameUuid: sub.AssetSubNameUuid
        };
      }
    }
    // Return null if not found
    return null;
  };

  const addAssets = async () => {
    try {

      var payload = {}
      var assetData = getAssetDetails(fdBondPayload, formData.typeOfAsset);

      payload["asset_name_uuid"] = assetData.assetCategoryUuid;
      payload["asset_sub_name_uuid"] = assetData.assetSubNameUuid;
      payload["asset_type_name_uuid"] = formData.typeOfAsset;
      payload["user_asset_for"] = formData.fdMemberName;
      payload["user_asset_user_id"] = getUserId();
      payload["user_asset_current_amount"] = "";
      payload["user_asset_investment_amount"] = formData.purchaseAmount;
      payload["user_asset_ror"] = interestRate;
      payload["user_asset_maturity_date"] = formData?.maturityDate
        ? new Date(formData.maturityDate).toLocaleDateString("en-GB")
        : '';
      payload["user_asset_maturity_amount"] = formData.maturityAmount;
      payload["user_asset_automated_linkage"] = 0;
      payload["user_asset_name"] = formData.bankInstituteName;
      payload["user_asset_purchase_date"] = formData?.purchaseDate
        ? new Date(formData.purchaseDate).toLocaleDateString("en-GB")
        : '';
      payload["user_asset_payout_type"] = formData.payoutType;
      payload["user_asset_maturity_amount"] = maturityCalculation

      let resp = await addAssetDetails(payload);

      if (resp["status_code"] == "200") {
        navigate(
          process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=3"
        );

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `${formData.typeOfAsset} added Successfully!`,
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `${formData.typeOfAsset} not added, Something went wrong!`,
            type: "error",
          },
        });
      }
    } catch (err) {
      // setIsLoading(false);
      console.log(err);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const UpdateFdBondAsset = async () => {
      try {
  
        const assetData = fdBondPayload;

        const selectedAssetValue = formData.typeOfAsset;
        let assetSubNameUuid = "";
        let assetTypeId = "";

        let matchedSub = null;
        let matchedType = null;

        for (const sub of assetData.AssetSubCategories) {
          const type = sub.AssetTypes.find(
            (t) => t.asset_type_name_uuid === selectedAssetValue
          );

          if (type) {
            matchedSub = sub;
            matchedType = type;
            break;
          }
        }

        if (matchedSub && matchedType) {

          assetSubNameUuid = matchedSub.AssetSubNameId;
          assetTypeId = matchedType.asset_type_id;
        }

        var payload = {};
  
        payload["asset_id"] = assetEditId;
        payload["asset_name_uuid"] = assetData.AssetCategoryUuid;
        payload["asset_sub_cat_id"] = assetSubNameUuid;
        payload["user_asset_type_id"] = assetTypeId;
        payload["user_asset_for"] = formData.fdMemberName;
        payload["user_asset_user_id"] = getUserId();
        payload["user_asset_ror"] = interestRate;
        payload["user_asset_maturity_date"] = formData?.maturityDate
        ? new Date(formData.maturityDate).toISOString().split("T")[0]
        : '';
        payload["user_asset_maturity_amount"] = maturityCalculation;
        payload["user_asset_automated_linkage"] = 0;
        payload["user_asset_name"] = formData.bankInstituteName;
        payload["user_asset_payout_type"] = formData.payoutType;
        payload["user_asset_purchase_date"] = formData?.purchaseDate
        ? new Date(formData.purchaseDate).toISOString().split("T")[0]
        : '';
        payload["user_asset_investment_amount"] = formData.purchaseAmount  
        var response = await updateUserAssetDetails(payload);
  
        if (response["status_code"] == "200") {
          if (id != undefined) {
            dispatch({
              type: "RENDER_TOAST",
              payload: {
                message: "FD/bond asset Updated Successfully!",
                type: "success",
              },
            });
          } else {
            dispatch({
              type: "RENDER_TOAST",
              payload: {
                message: "FD/bond asset Added Successfully!",
                type: "success",
              },
            });
          }
  
          navigate(
            process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=3"
          );
        }
      } catch (e) {
        console.log(e, ">>>>>>>>>");
      }
    };

  const getGoldTypeData = (goldTypeData, label) => {
    return label ? goldTypeData.find((data) => data.label === label) : "";
  };

  const showEPFInputs = () => {
    if (formData.typeOfAsset != "Gratuity") {
      if (formData.typeOfAsset === "EPF") {
        return showEPFForm;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const showSubmit = () => {
    if (formData.typeOfAsset === "EPF") {
      return showEPFForm;
    } else {
      return true;
    }
  };

  const handleFDMember = (selectedOption) => {
    setFormData({
      ...formData,
      fdMemberName: selectedOption.value,
    });
  };

  useEffect(() => {
    getBanks();
    if (formData.typeOfAsset != "EPF") {
      setShowEPFForm(false);
      setShowUANModal(false);
      setShowOTPModal(false);
      setIsManual(false);
    }
  }, [formData.typeOfAsset]);
  
  const investDate = moment(formData.purchaseDate, "DD/MM/YYYY");
  const maturityDate = moment(formData.maturityDate, "DD/MM/YYYY");
  const tenure =
    maturityDate.diff(investDate, "years") < 1
      ? 1
      : maturityDate.diff(investDate, "years");

  useEffect(() => {
    // Maturity calculation based on asset type
    // For RD, we can calculate even without maturity date using a default period
    if (
      formData?.maturityDate ||
      formData.typeOfAsset === "Recurring Deposit"
    ) {
      const maturityDate = formData?.maturityDate
        ? moment(formData.maturityDate)
        : moment().add(1, "year"); // Default to 1 year if no maturity date set

      // For RD, use current date as reference point since we're calculating from today
      const purchaseDate =
        formData.typeOfAsset === "Recurring Deposit"
          ? moment()
          : formData.purchaseDate
          ? moment(formData.purchaseDate)
          : moment();
      const years = maturityDate.diff(purchaseDate, "years", true);

      if (years > 0) {
        let maturityAmount = 0;

        if (formData.typeOfAsset === "Recurring Deposit") {
          // Future Value calculation for Recurring Deposit
          const currentBalance =
            parseFloat(formData.accountBalanceAsOnToday) || 0;
          const installmentAmount = parseFloat(formData.installmentAmount) || 0;
          const rate = rateOfReturn / 100; // Use rateOfReturn for Recurring Deposit

          if (rateOfReturn > 0) {
            // Determine payment frequency based on activeIndex2
            let paymentFrequency = 1; // Default to yearly
            switch (activeIndex2) {
              case 1: // Monthly
                paymentFrequency = 12;
                break;
              case 2: // Quarterly
                paymentFrequency = 4;
                break;
              case 3: // Half Yearly
                paymentFrequency = 2;
                break;
              case 4: // Yearly
                paymentFrequency = 1;
                break;
              default:
                paymentFrequency = 1;
            }

            // Future value of current balance
            const currentBalanceFV = currentBalance * Math.pow(1 + rate, years);

            // Future value of future installments (annuity)
            if (installmentAmount > 0) {
              const ratePerPeriod = rate / paymentFrequency;
              const totalPeriods = years * paymentFrequency;

              if (ratePerPeriod > 0) {
                // FVA = P * [((1 + r/n)^(nt) - 1) / (r/n)]
                // Where: P = installment amount, r = annual rate, n = payment frequency, t = years
                const futureInstallmentsFV =
                  installmentAmount *
                  ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) /
                    ratePerPeriod);
                maturityAmount = currentBalanceFV + futureInstallmentsFV;
              } else {
                // If rate is 0, it's just current balance + installment amount * number of periods
                maturityAmount =
                  currentBalance + installmentAmount * totalPeriods;
              }
            } else {
              maturityAmount = currentBalanceFV;
            }
          } else {
            // If no rate, calculate simple future value without interest
            if (currentBalance > 0) {
              maturityAmount = currentBalance;
            }
            if (installmentAmount > 0) {
              // Determine payment frequency based on activeIndex2
              let paymentFrequency = 1;
              switch (activeIndex2) {
                case 1:
                  paymentFrequency = 12;
                  break;
                case 2:
                  paymentFrequency = 4;
                  break;
                case 3:
                  paymentFrequency = 2;
                  break;
                case 4:
                  paymentFrequency = 1;
                  break;
                default:
                  paymentFrequency = 1;
              }
              const totalPeriods = years * paymentFrequency;
              maturityAmount += installmentAmount * totalPeriods;
            }
          }

        } else if (formData.typeOfAsset === "EPF") {
          // EPF calculation: Current balance + Future value of monthly contributions
          const currentBalance = parseFloat(formData.currentEPFBalance) || 0;
          const employeeContribution =
            parseFloat(formData.employeesMonthlyContribution) || 0;
          const employerContribution =
            parseFloat(formData.employerMonthlyContribution) || 0;
          const monthlyContribution =
            employeeContribution + employerContribution;
          const rate = rateOfReturn / 100; // Use rateOfReturn for EPF

          if (currentBalance > 0 || monthlyContribution > 0) {
            // Future value of current balance
            const currentBalanceFV = currentBalance * Math.pow(1 + rate, years);

            // Future value of monthly contributions (annuity)
            if (monthlyContribution > 0 && rateOfReturn > 0) {
              const monthlyRate = rate / 12; // Monthly compounding
              const totalMonths = years * 12;

              if (monthlyRate > 0) {
                // FVA = P * [((1 + r)^n - 1) / r] for monthly contributions
                const monthlyContributionsFV =
                  monthlyContribution *
                  ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
                maturityAmount = currentBalanceFV + monthlyContributionsFV;
              } else {
                // If rate is 0, it's just current balance + monthly contributions * months
                maturityAmount =
                  currentBalance + monthlyContribution * totalMonths;
              }
            } else {
              maturityAmount = currentBalanceFV;
            }
          }
        } else {
          // Regular Future Value calculation for other asset types
          const purchaseAmount = parseFloat(formData.purchaseAmount) || 0;
          const rate = interestRate / 100; // Use interestRate for other asset types

          if (purchaseAmount > 0 && interestRate > 0) {
            maturityAmount = fv(rate, years, 0, purchaseAmount);
          }
        }
        setMaturityCalculation(Number(maturityAmount.toFixed(2)));
      } else {
        // setMaturityCalculation(0);
      }
    } else {
      // setMaturityCalculation(0);
    }
  }, [
    formData?.purchaseAmount,
    formData?.installmentAmount,
    formData?.accountBalanceAsOnToday,
    formData?.currentEPFBalance,
    formData?.employeesMonthlyContribution,
    formData?.employerMonthlyContribution,
    interestRate,
    rateOfReturn,
    formData?.maturityDate,
    formData?.purchaseDate,
    formData?.typeOfAsset,
    activeIndex2,
  ]);

  // Handle payout type changes to set appropriate default frequency
  useEffect(() => {
    // Don't override activeIndex2 if we're in edit mode (updateForm is true)
    if (updateForm) {
      return;
    }

    if (formData.payoutType === "2") {
      // Non-Cumulative - set to Monthly if not already set
      if (activeIndex2 === 4) {
        setActiveIndex2(1);
      }
    } else if (formData.payoutType === "1") {
      // Cumulative - set to Yearly if not already set
      if (activeIndex2 === 1) {
        setActiveIndex2(4);
      }
    }
  }, [formData.payoutType, updateForm]);

  // Handle RD asset type to set default frequency to Monthly
  useEffect(() => {
    // Don't override activeIndex2 if we're in edit mode (updateForm is true)
    if (updateForm) {
      return;
    }

    if (formData.typeOfAsset === "Recurring Deposit") {
      // For RD, default to Monthly frequency
      setActiveIndex2(1);
    }
  }, [formData.typeOfAsset, updateForm]);

  // Calculate gratuity amount based on monthly salary and years of service
  useEffect(() => {
    if (formData.typeOfAsset === "Gratuity") {
      const monthlySalary = parseFloat(formData.monthlySalary) || 0;
      const yearsOfServiceNum = parseFloat(yearsOfService) || 0;

      let gratuityAmount = 0;

      if (monthlySalary > 0 && yearsOfServiceNum >= 5) {
        // Gratuity calculation: (15 * monthly salary * years of service) / 26
        // This is the standard gratuity formula in India
        gratuityAmount = (15 * monthlySalary * yearsOfServiceNum) / 26;
      }

      setFormData((prev) => ({
        ...prev,
        gratuityAmount: gratuityAmount.toFixed(2),
      }));

      // Also update maturity calculation for gratuity
      setMaturityCalculation(Number(gratuityAmount.toFixed(2)));
    }
  }, [formData.monthlySalary, yearsOfService, formData.typeOfAsset]);

  const calculateMaturityAmount = async () => {
    try {
      const payload = {
        url: ADVISORY_CALCULATE_EPF_MATURITY_AMOUNT,
        data: {
          user_id: session["data"]["id"],
          fp_log_id: session["data"]["fp_log_id"],
          fp_user_id: await getFpUserDetailsId(),
          asset_current_unit_price: parseFloat(
            formData.currentEPFBalance
          ).toFixed(2),
          asset_ror: rateOfReturn,
          employee_monthly_contrib:
            formData.employeesMonthlyContribution != ""
              ? parseFloat(formData.employeesMonthlyContribution)
              : 0,
          employer_monthly_contrib:
            formData.employerMonthlyContribution != ""
              ? parseFloat(formData.employerMonthlyContribution)
              : 0,
          annual_growth_rate: growthRate,
          asset_maturity_date: moment(formData?.maturityDate).format(
            "DD/MM/YYYY"
          ),
        },
        method: "post",
      };

      const res = await fetchEncryptData(payload);
      if (res["error_code"] == "100") {
        var calculatematuarityamount = Math.round(JSON.parse(res["data"], 2));

        if (calculatematuarityamount != 0) {
          setMaturityCalculation(calculatematuarityamount);
          // setFormData((prev) => ({
          //   ...prev,
          //   asset_maturity_amt: calculatematuarityamount,
          //   totalmaturityamount: calculatematuarityamount,
          // }));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getBanks = async () => {
    try {
      const bankResp = await GetBankList();

      setAllBank(bankResp.data);

    } catch (e) {
      console.log(e);
    }
  };

  simpleValidator.current.purgeFields();

  // Select Options Styles
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
  
    if (isApiReady &&
    userAssetDetails &&
    typeof userAssetDetails === "object" && Object.keys(userAssetDetails).length > 0) {
      
      var userAssetFor = ""
      if (typeof userAssetDetails.user_asset_for === "string") {
        userAssetFor = userAssetDetails.user_asset_for;
      } else {
        userAssetFor = "0";
      }
         
      setTimeout(() => {
        setInterestRate(userAssetDetails.user_asset_ror);
        setMaturityCalculation(userAssetDetails.user_asset_maturity_amount);
        setFormData({
          typeOfAsset: userAssetDetails.asset_type_name_uuid || "",
          fdMemberName: userAssetFor,
          bankInstituteName: userAssetDetails.user_asset_name || "",
          purchaseDate: parseDate(userAssetDetails.user_asset_purchase_date),
          purchaseAmount: userAssetDetails.user_asset_investment_amount || "",
          payoutType: userAssetDetails.user_asset_payout_type || "",
          maturityDate: parseDate(userAssetDetails.user_asset_maturity_date),
        });
        setIsLoading(false);
      }, 2000);

      setIsApiReady(false);
    }
  }, [isApiReady, userAssetDetails]);

  function formatWithIndianCommas(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return "";
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(Number(amount));
  }

  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <div className="px-0 px-md-4 assetForm">
        <div
          className="p-3"
          style={{ border: "1px solid #d8d8d8", borderRadius: 10 }}
        >
          <div className="d-flex">
            <Link
              to={
                process.env.PUBLIC_URL +
                "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=3"
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

            {addForm && (
              <h3
                className="text-center pb-0 mb-0 ps-2"
                style={{
                  flexGrow: 1,
                }}
              >
                Add Your FD & Bonds
              </h3>
            )}

            {updateForm && (
              <h3
                className="text-center pb-0 mb-0 ps-2"
                style={{
                  flexGrow: 1,
                }}
              >
                Edit Your FD & Bonds
              </h3>
            )}
          </div>
          <hr style={{ color: "#afafaf" }} />
          <div className="row">
            <div className="col-12 col-md-11 col-lg-8 m-auto">
              {addForm && (
                <p className="text-center">
                  Enter Your Details To Add Existing Assets
                </p>
              )}

              {updateForm && (
                <p className="text-center">
                  Enter Your Details To Edit Existing Assets
                </p>
              )}

              <br />
              <br />
              <div>
                <div className="my-md-4">
                  <div className="">
                    <span className="lbl-newbond">Select Type Of Asset *</span>
                    <br />
                    <Select
                      className="fnto-dropdown-react"
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={options}
                      name="typeOfAsset"
                      value={options.find(opt => opt.value === formData.typeOfAsset)}
                      onChange={(e) => {
                        // onDateAndSelectInputChang    e("typeOfAsset", e.label);
                        setFormData({
                          ...formData,
                          typeOfAsset: e.value,
                          bankInstituteName: "",
                          purchaseDate: "",
                          purchaseAmount: "",
                          payoutType: "",
                          maturityDate: "",
                          assetTypeUuid: e.value,
                          asset_sub_cat_id: optionSubCategory[e.label] || "",
                          fdMemberName: "", // Reset member selection
                        });
                        setInterestRate(0);
                        setMaturityCalculation(0);
                        setActiveIndex(1);
                        // Set default frequency based on asset type
                        if (e.label === "Recurring Deposit") {
                          setActiveIndex2(1); // Monthly for RD
                        } else {
                          setActiveIndex2(4); // Yearly for other types
                        }
                        setYearsOfService("5"); // Reset years of service to default
                        setIsInstallmentPaid(true); // Reset installment paid status

                        let x = optionSubCategory[e.label];
                        let ror = 0;
                        switch (x) {
                          // case 82:
                          //   growth_rate = "5";
                          //   break;
                          // case 81:
                          // case 85:
                          // case 86:
                          case 75:
                          case 79:
                          case 80:
                          case 87:
                            ror = 0;
                            break;
                          case 120:
                            ror = 6.8;
                            break;
                          case 117:
                            ror = 8.1;
                            break;
                          default:
                            ror = 0;
                            break;
                        }

                        if (x == 75 || x == 79 || x == 80 || x == 87) {
                          setInterestRate(ror);
                        }
                        if (x == 120 || x == 117) {
                          setRateOfReturn(ror);
                        }
                      }}
                    />
                    {simpleValidator.current.message(
                      "typeOfAsset",
                      formData.typeOfAsset,
                      "required"
                    )}
                  </div>
                </div>

                <div
                  className="row"
                  style={{ display: "flex", flexWrap: "wrap" }}
                >
                  {formData.typeOfAsset === "EPF" && !assetEditId && (
                    <>
                      <div>
                        <br />
                        <div className="d-flex justify-content-center gap-3 ">
                          <div className="my-md-4">
                            <button
                              style={{ padding: "0.5rem 0.8rem" }}
                              className={`d-block m-auto btn fecthBtn ${
                                isManual ? "btn-primary" : "btn-outline-primary"
                              }`}
                              onClick={() => {
                                setIsManual(true);
                                setShowEPFForm(true);
                              }}
                            >
                              Manual Entry
                            </button>
                          </div>
                          <div className="my-md-4">
                            <button
                              style={{ padding: "0.5rem 0.8rem" }}
                              className={`d-block m-auto btn fecthBtn ${
                                isManual ? "btn-outline-primary" : "btn-primary"
                              }`}
                              onClick={() => {
                                setShowUANModal(true);
                                setModalType(0);
                              }}
                            >
                              Fetch Details
                            </button>
                          </div>
                        </div>
                        <br />
                      </div>
                      {!showEPFForm ? (
                        <>
                          <div>
                            <h3
                              className="pb-0 mb-0"
                              style={{
                                flexGrow: 1,
                              }}
                            >
                              STEPS TO AUTO ACCESS AND GET YOUR EPF DETAILS
                            </h3>
                            <br />
                            <div>
                              <div
                                className="d-flex gap-2"
                                style={{
                                  fontWeight: "normal",
                                  fontSize: "1.2rem",
                                }}
                              >
                                <span>&#9642;</span>{" "}
                                <span>
                                  Please make sure you have your UAN [ Universal
                                  Account Number ] handy. You can find this
                                  number in your salary slip.
                                </span>
                              </div>
                              <div
                                className="d-flex gap-2"
                                style={{
                                  fontWeight: "normal",
                                  fontSize: "1.2rem",
                                }}
                              >
                                <span>&#9642;</span>{" "}
                                <span>
                                  Once yoy click Fetch Details button you will
                                  be shown popup where you have to enter you
                                  UAN.
                                </span>
                              </div>
                              <div
                                className="d-flex gap-2"
                                style={{
                                  fontWeight: "normal",
                                  fontSize: "1.2rem",
                                }}
                              >
                                <span>&#9642;</span>{" "}
                                <span>
                                  Once you submit, you will be asked to provide
                                  an OTP.
                                </span>
                              </div>
                              <div
                                className="d-flex gap-2"
                                style={{
                                  fontWeight: "normal",
                                  fontSize: "1.2rem",
                                }}
                              >
                                <span>&#9642;</span>{" "}
                                <span>
                                  Once successful OTP verification, your EPF
                                  details will be fetched.
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                      {/* {showUANModal && ( */}
                      <>
                        <LinkEPF
                          setShowOTPModal={setShowOTPModal}
                          customStyles={customStyles}
                          modalType={modalType}
                          setModalType={setModalType}
                          showUANModal={showUANModal}
                          setShowUANModal={setShowUANModal}
                          session={session}
                        />
                        {/* <Modal
                            classNames={{
                              modal: "Modalpopup2",
                            }}
                            open={showUANModal}
                            showCloseIcon={false}
                            onClose={() => () => {}}
                            center
                            animationDuration={0}
                          >
                            <div
                              className=""
                              style={{ padding: "0 !important" }}
                            >
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
                                    <span className="lbl-newbond">
                                      Enter UAN *
                                    </span>
                                    <br />
                                    <input
                                      className={`w-100 fntoo-textbox-react inputPlaceholder`}
                                      type="text"
                                      name="uan"
                                      value={formData.uan}
                                      onChange={(e) => onInputChange(e, true)}
                                    />
                                    {simpleValidator.current.message(
                                      "uan",
                                      formData.uan,
                                      "required"
                                    )}
                                  </div>
                                </div>
                                <br />
                                <div className="ButtonBx">
                                  <button
                                    className="ReNew"
                                    onClick={() => {
                                      simpleValidator.current.showMessages();
                                      forceUpdate();

                                      if (simpleValidator.current.allValid()) {
                                        setShowOTPModal(true);
                                        setShowUANModal(false);
                                        setIsManual(false);
                                      }
                                    }}
                                  >
                                    Send OTP
                                  </button>
                                </div>
                                <br />
                              </div>
                            </div>
                          </Modal> */}
                        {/* -------------------------------------------------------------------------------------- */}
                        {/* <Modal
                            classNames={{
                              modal: "Modalpopup",
                            }}
                            open={showOTPModal}
                            showCloseIcon={true}
                            onClose={() => setShowOTPModal(false)}
                            center
                            animationDuration={0}
                          >
                            <div
                              className=""
                              style={{ padding: "0 !important" }}
                            >
                              <h2 className="HeaderText text-center">
                                Please Enter OTP
                              </h2>

                              <div>
                                <br />
                                <p>
                                  We have sent you and OTP on your mobile number
                                  +91 916*****20
                                </p>
                                <div className="my-md-4">
                                  <div className="px-5">
                                    <OTPInput
                                      value={otpInput}
                                      onChange={setOtpInput}
                                      autoFocus
                                      className="link-holdings-otp w-100"
                                      style={{
                                        border: "none",
                                      }}
                                      OTPLength={6}
                                      otpType="number"
                                      disabled={false}
                                    />
                                  </div>
                                </div>
                                <br />
                                <div className="ButtonBx">
                                  <button
                                    className="ReNew"
                                    onClick={() => {
                                      setShowEPFForm(true);
                                      setShowOTPModal(false);
                                    }}
                                  >
                                    Submit
                                  </button>
                                </div>
                                <br />
                              </div>
                            </div>
                          </Modal> */}
                      </>
                      {/* )} */}
                    </>
                  )}

                  {formData.typeOfAsset === "EPF" && showEPFForm && (
                    // {showEPFForm && (
                    <>
                      <div className="col-md-12 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Current EPF balance *
                            </span>
                            <br />
                            <input
                              placeholder="Enter Current EPF balance"
                              className={`w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                              type="Number"
                              maxLength={9}
                              name="currentEPFBalance"
                              value={formData.currentEPFBalance}
                              onChange={(e) => onInputChange(e, true)}
                              onInput={(e) => {
                                if (e.target.value.length > 10) {
                                  e.target.value = e.target.value
                                    .replace(/[^0-9.]/g, "")
                                    .split(".")
                                    .map((part, i) =>
                                      i === 0
                                        ? part.slice(0, 9)
                                        : part.slice(0, 2)
                                    )
                                    .join(".");
                                }
                              }}
                            />
                            {simpleValidator.current.message(
                              "currentEPFBalance",
                              formData.currentEPFBalance,
                              "required|numeric"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Employees Monthly Contribution *
                            </span>
                            <br />
                            <input
                              placeholder="Enter Employees Monthly Contribution"
                              className={`w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                              type="Number"
                              maxLength={9}
                              value={formData.employeesMonthlyContribution}
                              name="employeesMonthlyContribution"
                              onChange={(e) => onInputChange(e, true)}
                              onInput={(e) => {
                                if (e.target.value.length > 10) {
                                  e.target.value = e.target.value
                                    .replace(/[^0-9.]/g, "")
                                    .split(".")
                                    .map((part, i) =>
                                      i === 0
                                        ? part.slice(0, 9)
                                        : part.slice(0, 2)
                                    )
                                    .join(".");
                                }
                              }}
                            />
                            {simpleValidator.current.message(
                              "employeesMonthlyContribution",
                              formData.employeesMonthlyContribution,
                              "required|numeric"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Employer Monthly Contribution *
                            </span>
                            <br />
                            <input
                              placeholder="Enter Employer Monthly Contribution"
                              className={` w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                              type="Number"
                              maxLength={9}
                              value={formData.employerMonthlyContribution}
                              name="employerMonthlyContribution"
                              onChange={(e) => onInputChange(e, true)}
                              onInput={(e) => {
                                if (e.target.value.length > 10) {
                                  e.target.value = e.target.value
                                    .replace(/[^0-9.]/g, "")
                                    .split(".")
                                    .map((part, i) =>
                                      i === 0
                                        ? part.slice(0, 9)
                                        : part.slice(0, 2)
                                    )
                                    .join(".");
                                }
                              }}
                            />
                            {simpleValidator.current.message(
                              "employerMonthlyContribution",
                              formData.employerMonthlyContribution,
                              "required|numeric"
                            )}
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Retirement Age *
                            </span>
                            <br />
                            <input
                              placeholder="Enter Retirement Age"
                              className={` w-100 fntoo-textbox-react inputPlaceholder`}
                              type="Number"
                              maxLength={3}
                              value={formData.retirementAge}
                              name="retirementAge"
                              onChange={(e) => onInputChange(e, true)}
                            />
                            {simpleValidator.current.message(
                              "retirementAge",
                              formData.retirementAge,
                              "required|numeric"
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Life Expentancy *
                            </span>
                            <br />
                            <input
                              placeholder="Enter Life Expentancy"
                              className={` w-100 fntoo-textbox-react inputPlaceholder`}
                              type="Number"
                              maxLength={3}
                              value={formData.lifeExpentancy}
                              name="lifeExpentancy"
                              onChange={(e) => onInputChange(e, true)}
                            />
                            {simpleValidator.current.message(
                              "lifeExpentancy",
                              formData.lifeExpentancy,
                              "required|numeric"
                            )}
                          </div>
                        </div>
                      </div> */}
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Rate Of Return (%) *
                            </span>
                            <br />
                            <FormRangeSlider
                              x={rateOfReturn}
                              min={0}
                              max={20}
                              step={0.05}
                              onChange={(x) => {
                                setRateOfReturn(
                                  Math.round(
                                    (parseFloat(x) + Number.EPSILON) * 100
                                  ) / 100
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="my-md-4">
                          <div>
                            <span className="lbl-newbond">
                              Growth Rate In EPF Contribution (%) *
                            </span>
                            <br />
                            <FormRangeSlider
                              x={growthRate}
                              min={0}
                              max={50}
                              // step={0.05}
                              onChange={(x) => {
                                // setGrowthRate(
                                //   Math.round(
                                //     (parseFloat(x) + Number.EPSILON) * 100
                                //   ) / 100
                                // );
                                if (x != 0) {
                                  setGrowthRate(x);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                    // )}
                  )}
                  {
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
                          name="fdMemberName"
                          placeholder="Select member"
                          onChange={handleFDMember}
                          value={familyData.find(
                            (opt) => opt.value === formData.fdMemberName
                          )}
                        />

                        {simpleValidator.current.message(
                          "fdMemberName",
                          formData.fdMemberName,
                          "required"
                        )}
                      </div>
                    </div>
                  }
                  <>
                    {formData.typeOfAsset != "EPF" &&
                      formData.typeOfAsset != "Recurring Deposit" && (
                        <>
                          <div className="col-md-12 col-12">
                            <div className="my-md-4">
                              <div>
                                <span className="lbl-newbond">
                                  Select Bank/Institute Name *
                                </span>
                                <br />
                                <Select
                                  className="fnto-dropdown-react"
                                  styles={customStyles}
                                  classNamePrefix="sortSelect"
                                  isSearchable={true}
                                  placeholder="Select bank/institute name"
                                  options={
                                    Array.isArray(allBank)
                                      ? allBank.map((v) => ({
                                          label: v.bank_name,
                                          value: v.bank_name,
                                        }))
                                      : []
                                  }
                                  value={
                                    formData.bankInstituteName
                                      ? {
                                          label: formData.bankInstituteName,
                                          value: formData.bankInstituteName,
                                        }
                                      : null
                                  }
                                  name="bankInstituteName"
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      bankInstituteName: e.value,
                                    })
                                  }
                                />

                                {simpleValidator.current.message(
                                  "bankInstituteName",
                                  formData.bankInstituteName,
                                  "required"
                                )}
                              </div>
                            </div>
                          </div>

                          {/* <div className="col-md-12 col-12">
                                                    <div className="my-md-4">
                                                        <div className="">
                                                            <span className="lbl-newbond">
                                                                Bank/Institute Name *
                                                            </span>
                                                            <br />
                                                            <input
                                                                placeholder="Enter Bank/Institute Name"
                                                                className={` w-100 fntoo-textbox-react Rupee-icon`}
                                                                type="text"
                                                                value={formData.bankInstituteOtherName}
                                                                name='bankInstituteOtherName'
                                                                onChange={onInputChange}
                                                            />
                                                            {simpleValidator.current.message('bankInstituteOtherName', formData.bankInstituteOtherName, 'required')}
                                                        </div>
                                                    </div>
                                                </div> */}
                        </>
                      )}

                    {formData.typeOfAsset != "Gratuity" &&
                      formData.typeOfAsset != "EPF" && (
                        <>
                          {formData.typeOfAsset != "Recurring Deposit" ? (
                            <>
                              <div className="col-md-6 col-12">
                                <div className="my-md-4">
                                  <div className="">
                                    <span className="lbl-newbond">
                                      Purchase Date *
                                    </span>
                                    <br />
                                    <div className="bonds-datepicker">
                                      <FintooDatePicker
                                        dateFormat="dd/MM/yyyy"
                                        selected={formData.purchaseDate || null}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        name="purchaseDate"
                                        customClass="datePickerDMF"
                                        maxDate={new Date()}
                                        onChange={(date) =>
                                          onDateAndSelectInputChange(
                                            "purchaseDate",
                                            date
                                          )
                                        }
                                        onKeyDown={(e) => e.preventDefault()}
                                      />
                                    </div>
                                    {simpleValidator.current.message(
                                      "purchaseDate",
                                      formData.purchaseDate,
                                      "required"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 col-12">
                                <div className="my-md-4">
                                  <div className="">
                                    <span className="lbl-newbond">
                                      Purchase Amount *
                                    </span>
                                    <br />
                                    <input
                                      placeholder="Purchase Amount"
                                      className={`w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                                      type="text"
                                      value={formatWithIndianCommas(formData.purchaseAmount)}
                                      name="purchaseAmount"
                                      autoComplete="off"
                                      onChange={(e) => onInputChange(e, true)}
                                    />
                                    {simpleValidator.current.message(
                                      "purchaseAmount",
                                      formData.purchaseAmount,
                                      "required|numeric"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 col-12">
                                <div className="my-md-4">
                                  <div>
                                    <span className="lbl-newbond">
                                      Interest Rate (%) *
                                    </span>
                                    <p
                                      className="mb-0"
                                      style={{ height: "8px" }}
                                    >
                                      &nbsp;
                                    </p>
                                    <FormRangeSlider
                                      x={interestRate}
                                      min={0}
                                      max={20}
                                      step={0.1}
                                      onChange={(x) => {
                                        setInterestRate(
                                          Math.round(x * 100) / 100
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                                {simpleValidator.current.message(
                                  "interestRate",
                                  interestRate,
                                  "required|numeric"
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="col-md-6 col-12">
                                <div className="my-md-4">
                                  <div className="">
                                    <span className="lbl-newbond">
                                      Account Balance As On Today *
                                    </span>
                                    <br />
                                    <input
                                      placeholder="Enter Account Balance As On Today"
                                      className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                                      type="text"
                                      maxLength={9}
                                      value={formData.accountBalanceAsOnToday}
                                      name="accountBalanceAsOnToday"
                                      onChange={(e) => onInputChange(e, true)}
                                    />
                                    {simpleValidator.current.message(
                                      "accountBalanceAsOnToday",
                                      formData.accountBalanceAsOnToday,
                                      "required|numeric"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 col-12">
                                <div className="my-md-4">
                                  <div className="">
                                    <span className="lbl-newbond">
                                      Installment Amount *
                                    </span>
                                    <br />
                                    <input
                                      placeholder="Enter Installment Amount"
                                      className={` w-100 fntoo-textbox-react inputPlaceholder Rupee-icon`}
                                      type="text"
                                      maxLength={9}
                                      value={formData.installmentAmount}
                                      name="installmentAmount"
                                      onChange={(e) => onInputChange(e, true)}
                                    />
                                    {simpleValidator.current.message(
                                      "installmentAmount",
                                      formData.installmentAmount,
                                      "required|numeric"
                                    )}
                                    <>
                                      <div className="fnto-bonds-tags">
                                        <div
                                          className={
                                            activeIndex2 === 1 ? "active" : ""
                                          }
                                          onClick={() =>
                                            handleClick2(1, "Monthly")
                                          }
                                        >
                                          <p>Monthly</p>
                                        </div>
                                        <div
                                          className={
                                            activeIndex2 === 2 ? "active" : ""
                                          }
                                          onClick={() =>
                                            handleClick2(2, "Quarterly")
                                          }
                                        >
                                          <p>Quarterly</p>
                                        </div>
                                        <div
                                          className={
                                            activeIndex2 === 3 ? "active" : ""
                                          }
                                          onClick={() =>
                                            handleClick2(3, "Half Yearly")
                                          }
                                        >
                                          <p>Half Yearly</p>
                                        </div>
                                        <div
                                          className={
                                            activeIndex2 === 4 ? "active" : ""
                                          }
                                          onClick={() =>
                                            handleClick2(4, "Yearly")
                                          }
                                        >
                                          <p>Yearly</p>
                                        </div>
                                      </div>
                                    </>
                                  </div>
                                </div>
                              </div>

                              {(formData.asset_sub_cat_id == 120 ||
                                formData.typeOfAsset ===
                                  "Recurring Deposit") && (
                                <>
                                  <div className="col-md-6 col-12">
                                    <div className="my-md-4">
                                      <div className="">
                                        <span className="lbl-newbond">
                                          Installment for the year is Paid or
                                          not*
                                        </span>
                                        <br />
                                        <div className="bonds-datepicker">
                                          <div className="insurance-switch-container">
                                            <span>No&nbsp;&nbsp;</span>{" "}
                                            <FormSwitch
                                              switchValue={isInstallmentPaid}
                                              onSwitchToggle={() =>
                                                setIsInstallmentPaid(
                                                  (previous) => !previous
                                                )
                                              }
                                            />{" "}
                                            <span>
                                              &nbsp;&nbsp;&nbsp;&nbsp;Yes
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-12">
                                    <div className="my-md-4">
                                      <div className="">
                                        <span className="lbl-newbond">
                                          Rate Of Return (%) *
                                        </span>
                                        <br />
                                        <br />
                                        <FormRangeSlider
                                          x={
                                            rateOfReturn == 0 ? 0 : rateOfReturn
                                          }
                                          min={0}
                                          max={20}
                                          step={0.05}
                                          onChange={(x) => {
                                            setRateOfReturn(
                                              Math.round(
                                                (parseFloat(x) +
                                                  Number.EPSILON) *
                                                  100
                                              ) / 100
                                            );
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          )}

                          {formData.typeOfAsset != "Recurring Deposit" && (
                            <div className="col-md-6 col-12">
                              <div className="my-md-4">
                                <div className="">
                                  <span className="lbl-newbond">
                                    Payout Type *
                                  </span>
                                  <br />
                                  <Select
                                    className="fnto-dropdown-react"
                                    classNamePrefix="sortSelect"
                                    isSearchable={false}
                                    styles={customStyles}
                                    options={Purchaseoptions}
                                    placeholder="Select payout type"
                                    value={Purchaseoptions.find(opt => opt.value === formData.payoutType)} // <-- full object
                                    name="payoutType"
                                    onChange={(e) => {
                                      onDateAndSelectInputChange("payoutType", e.value);

                                      // Set default frequency based on payout type
                                      setActiveIndex2(e.value === "2" ? 1 : 4);
                                    }}
                                  />

                                  {simpleValidator.current.message(
                                    "payoutType",
                                    formData.payoutType,
                                    "required"
                                  )}

                                  {formData.payoutType == "2" && (
                                    <>
                                      <div className="fnto-bonds-tags">
                                        <div
                                          className={
                                            activeIndex2 === 1 ? "active" : ""
                                          }
                                          onClick={() =>
                                            handleClick2(1, "Monthly")
                                          }
                                        >
                                          <p>Monthly</p>
                                        </div>
                                        <div
                                          className={
                                            activeIndex2 === 2 ? "active" : ""
                                          }
                                          onClick={() =>
                                            handleClick2(2, "Quarterly")
                                          }
                                        >
                                          <p>Quarterly</p>
                                        </div>
                                        <div
                                          className={
                                            activeIndex2 === 3 ? "active" : ""
                                          }
                                          onClick={() =>
                                            handleClick2(3, "Half Yearly")
                                          }
                                        >
                                          <p>Half Yearly</p>
                                        </div>
                                        <div
                                          className={
                                            activeIndex2 === 4 ? "active" : ""
                                          }
                                          onClick={() =>
                                            handleClick2(4, "Yearly")
                                          }
                                        >
                                          <p>Yearly</p>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                    {showEPFInputs() && (
                      <>
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Maturity Date *
                              </span>
                              <br />
                              <div className="bonds-datepicker">
                                <FintooDatePicker
                                  dateFormat="dd/MM/yyyy"
                                  selected={
                                    formData.maturityDate === ""
                                      ? ""
                                      : formData.maturityDate
                                  }
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  name="maturityDate"
                                  customClass="datePickerDMF"
                                  // minDate={moment(formData.purchaseDate).toDate()}
                                  // minDate={new Date(new Date(formData.purchaseDate).getFullYear(),
                                  //   new Date(formData.purchaseDate).getMonth() + 1,
                                  //   1
                                  //   )}
                                  minDate={new Date()}
                                  // refDate.setMonth(refDate.getMonth() + 6)}
                                  // disabled={
                                  //   formData.asset_sub_cat_id != 120 &&
                                  //     formData.asset_sub_cat_id != 117
                                  //     ? formData.purchaseDate = ""
                                  //     : null
                                  // }
                                  onChange={(e) =>
                                    onDateAndSelectInputChange(
                                      "maturityDate",
                                      formatDatefun(e)
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    e.preventDefault();
                                  }}
                                />
                              </div>
                              {simpleValidator.current.message(
                                "maturityDate",
                                formData.maturityDate,
                                "required"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-12">
                          <div className="my-md-4">
                            <div className="">
                              <span className="lbl-newbond">
                                Maturity Amount *
                              </span>
                              <br />
                              <input
                                placeholder="Maturity Amount"
                                className="w-100 fntoo-textbox-react inputPlaceholder Rupee-icon disabled"
                                type="text"
                                value={
                                  maturityCalculation !== "" && maturityCalculation !== null && maturityCalculation !== undefined
                                    ? formatWithIndianCommas(Math.ceil(maturityCalculation))
                                    : ""
                                }
                                name="maturityAmount"
                                onChange={onInputChange}
                              />

                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {formData.typeOfAsset == "Gratuity" &&
                      formData.typeOfAsset != "EPF" && (
                        <>
                          <div className="col-md-6 col-12">
                            <div className="my-md-4">
                              <div className="">
                                <span className="lbl-newbond">
                                  Monthly Salary (Basic + DA) *
                                </span>
                                <br />
                                <input
                                  placeholder="Monthly Salary"
                                  className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                                  type="text"
                                  maxLength={9}
                                  value={formData.monthlySalary}
                                  name="monthlySalary"
                                  onChange={(e) => onInputChange(e, true)}
                                />
                                {simpleValidator.current.message(
                                  "monthlySalary",
                                  formData.monthlySalary,
                                  "required|numeric"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="my-md-4">
                              <div className="">
                                <span className="lbl-newbond">
                                  No. Of Years Of Service (Min 5) *
                                </span>
                                <br />
                                <FormRangeSlider
                                  x={yearsOfService}
                                  min={5}
                                  max={50}
                                  step={1}
                                  onChange={(x) => {
                                    setYearsOfService(x);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="my-md-4">
                              <div className="">
                                <span className="lbl-newbond">
                                  Gratuity Amount *
                                </span>
                                <br />
                                <input
                                  placeholder="Gratuity Amount"
                                  className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder disabled`}
                                  type="text"
                                  value={formData.gratuityAmount}
                                  name="gratuityAmount"
                                  onChange={(e) => onInputChange(e, true)}
                                  disabled
                                />
                                {simpleValidator.current.message(
                                  "gratuityAmount",
                                  formData.gratuityAmount,
                                  "required|numeric"
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                  </>
                </div>

                {/* {showSubmit() && (
                  <div className="my-md-4">
                    <button
                      type="submit"
                      className="d-block m-auto btn btn-primary"
                      onClick={() => validateForm()}
                    >
                      Save
                    </button>
                  </div>
                )} */}

                {showSubmit() && addForm && (
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

                {showSubmit() && updateForm && (
                  <div>
                    {/* <button
                          onClick={(e) => handleDebtCancel(e)}
                          className="default-btn gradient-btn save-btn"
                        >
                          Cancel
                      </button> */}
                    {/* <button
                          onClick={(e) => handleDebtUpdate(e)}
                          className="default-btn gradient-btn save-btn"
                                >
                                  Update
                      </button> */}
                    <button
                      type="submit"
                      className="d-block m-auto btn btn-primary"
                      onClick={() => validateUpdateForm()}
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
    </>
  );
};
export default NewFdBondsFormView;
