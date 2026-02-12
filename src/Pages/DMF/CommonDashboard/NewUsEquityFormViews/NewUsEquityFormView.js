import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { Link, useSearchParams } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import FormRangeSlider from "../CommonDashboardComponents/FormRangeSlider";
import FintooDatePicker from "../../../../components/HTML/FintooDatePicker";
import FormSwitch from "../CommonDashboardComponents/formSwitch";
import SimpleReactValidator from "simple-react-validator";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import {
  fetchEncryptData,
  getUserId,
  apiCall,
  getFpUserDetailsId,
  getParentUserId,
  getItemLocal,
  fv,
  fetchData,
} from "../../../../common_utilities";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { MdHomeMax } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Switch from "react-switch";
import apiClient from "../../../../FrappeIntegration-Services/services/apiClient";
import {
  getOtherInvestments,
  GetUsEquityShares,
  saveUserAssetDetails,
  updateUserAssetDetails,
} from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { getAssetCategoryList } from "../../../../FrappeIntegration-Services/services/financial-planning-api/asset";
import { exchange_rate } from "../../../../constants";

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

const initialState = {
  usequityname: "",
  usmembername: "Self",
  assetcurrency: true,
  noofShares: "",
  purchaseDate: "",
  avgbuyPrice: 0,
  totalinvestedValue: 0,
  investedValue: "",
  currentPrice: "",
  currentValue: "",
  sipenddate: "",
  sipamount: "",
};

const defaultAssetDetails = {
  user_asset_name: "",
  asset_cat_id: "",
  user_asset_type_id: "",
  asset_type_name_uuid: "",
  user_asset_for: "",
  asset_sub_cat_id: "",
  user_asset_automated_linkage: 0,
  user_asset_user_id: "",
  user_asset_current_amount: "",
  user_asset_pincode: "",
  user_asset_property_type: "Self-Occupied",
  user_asset_ownership: "Free Hold",
  user_asset_allocation: "N",
  user_asset_installment_paid: "NA",
  user_asset_currency: "INR",
  user_asset_occurance: "One Time",
  user_asset_sip_amount: "",
  user_asset_current_price: "",
};

const NewUsEquityFormView = () => {
  const [, forceUpdate] = useState(1);
  const [formData, setFormData] = useState(initialState);
  const [assetsDetails, setAssetsDetails] = useState(defaultAssetDetails);
  const [addForm, setAddForm] = useState(true);
  const [updateForm, setUpdateForm] = useState(false);
  const [assetEditId, setAssetEditId] = useState("");

  const [activeIndex, setActiveIndex] = useState(1);
  const [sliderValue, setSliderValue] = useState("Yearly");
  const [maturityCalculation, setMaturityCalculation] = useState("");

  const [activeIndex2, setActiveIndex2] = useState(4);
  const [isRecurring, setIsRecurring] = useState(false);

  const [interestRate, setInterestRate] = useState(0);
  const [rateOfReturn, setRateOfReturn] = useState(8.1);
  const [growthRate, setGrowthRate] = useState(10);
  const [yearsOfService, setYearsOfService] = useState("5");
  const [allBank, setAllBank] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [session, setSession] = useState([]);
  const [USEquity, setUSEquity] = useState([]);
  const [familyData, setFamilyData] = useState([]);
  const [usEquityDetails, setUsEquityDetails] = useState({
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
  const [selectedOption, setSelectedOption] = useState(null);

  // ---------------------------------------------------- EPF states ----------------------------------------------------
  const [showEPFForm, setShowEPFForm] = useState(false);
  const [showUANModal, setShowUANModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [assetForMember, setAssetForMember] = useState("");

  // --------------------------------------------------------------------------------------------------------------------

  const simpleValidator = useRef(new SimpleReactValidator());

  useEffect(() => {
    getUSEquityData();
    getUSEquityData();
    // checksession();
    getFamilyMembers();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let asset_id = urlParams.get("id");
    if (asset_id) {
      setUpdateForm(true);
      setAddForm(false);
      setAssetEditId(asset_id);
      editUSData(asset_id);
    }
  }, []);

  const getUSEquityData = async () => {
    try {
      const resp = await GetUsEquityShares();

      if (resp["status_code"] == 200) {
        setUSEquity(resp.data);
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const usEquityData = USEquity.map((index, value) => {
    return {
      label: index.us_equity_name,
      value: index.us_equity_price,
    };
  });

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

            // if (assetSubCategoryIds.includes(assetsDetails.asset_sub_category_id)) {
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
              value: 0,
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
        if (member_array.length > 0) {
          const selfMember = member_array.find((m) => m.label === "Self");
          if (selfMember) {
            setFormData((prev) => ({
              ...prev,
              usmembername: selfMember.value,
            }));
          }
        }
      } else {
        setFamilyData([]);
        setMemberData([]);
      }
    } catch (error) {
      setFamilyData([]);
      setMemberData([]);
    }
  };

  const formatDatefun = (date) => {
    // return moment(date).format("YYYY/MM/DD");

    return moment(date).toDate();
  };

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

  const editUSData = async (id) => {
    try {
      let payload_data = getItemLocal("family")
        ? { user_id: getParentUserId(), grouped_data: true }
        : {
            user_id: getParentUserId(),
            user_asset_for: getParentUserId(),
            grouped_data: true,
          };

      let baseUrl = "";
      let separator = baseUrl.includes("?") ? "&" : "?";
      let queryString = new URLSearchParams(payload_data).toString();
      let finalUrl = `${baseUrl}${separator}${queryString}`;

      var payload = {
        user_id: getUserId(),
        user_asset_id: id,
      };
      const editUSEquityData = await getOtherInvestments(payload);

      if (editUSEquityData.status_code == "200") {
        const urlParams = new URLSearchParams(window.location.search);

        const selectedEquityAsset = editUSEquityData?.data?.listing?.find(
          (item) => item?.name === urlParams.get("id")
        );

        if (selectedEquityAsset) {
          if (selectedEquityAsset.user_asset_occurance == "Recurring") {
            setIsRecurring(true);
          } else if (selectedEquityAsset.user_asset_occurance == "One Time") {
            setIsRecurring(false);
          }
          setFormData({
            ...formData,
            usequityname: selectedEquityAsset.user_asset_name,
            usmembername: selectedEquityAsset.user_asset_for,
            // investedValue: selectedEquityAsset.user_asset_investment_amount,
            avgbuyPrice: selectedEquityAsset.user_asset_avg_purchase_price,
            assetcurrency:
              selectedEquityAsset.user_asset_currency === "INR" ? true : false,
            purchaseDate: parseDate(
              selectedEquityAsset.user_asset_purchase_date
            ),
            sipenddate: parseDate(selectedEquityAsset.user_asset_end_date),
            sipamount: selectedEquityAsset.user_asset_sip_amount,
            noofShares: selectedEquityAsset.user_asset_quantity,
            currentPrice: selectedEquityAsset.user_asset_current_price,
            totalinvestedValue:
              selectedEquityAsset.user_asset_investment_amount,
          });
        }
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong hello");
    }
  };

  const options = [
    { value: "Fixed Deposit", label: "Fixed Deposit" },
    { value: "Recurring Deposit", label: "Recurring Deposit" },
    { value: "Bonds", label: "Bonds" },
    { value: "Debentures", label: "Debentures" },
    { value: "Gratuity", label: "Gratuity" },
    { value: "EPF", label: "EPF" },
    { value: "Others", label: "Others" },
  ];

  const optionSubCategory = {
    "Fixed Deposit": 75,
    Bonds: 79,
    Debentures: 80,
    Others: 87,
    Gratuity: 82,
    "Recurring Deposit": 120,
    EPF: 117,
  };
  const numericRegex = /^[0-9]*\.?[0-9]*$/;
  const onInputChange = (e, isNumeric) => {
    const name = e.target.name;
    let value = e.target.value;

    // Remove commas for validation and storage
    const cleanValue = removeCommas(value);

    if (isNumeric && !numericRegex.test(cleanValue) && cleanValue !== "") {
      return;
    }
    if (
      (name === "sipamount" ||
        name === "avgbuyPrice" ||
        name === "noofShares") &&
      cleanValue.length > 0.1 &&
      cleanValue[0] === "0.1"
    ) {
      return;
    }

    setFormData({ ...formData, [name]: cleanValue });
  };

  const onPurchaseInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.replace(/[^0-9]/, ""),
    });
  };

  const onDateAndSelectInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleUSEquitySelection = (selectedOption) => {
    setFormData({
      ...formData,
      usequityname: selectedOption.label,
      currentPrice: parseFloat(selectedOption.value).toFixed(2),
    });
  };

  const handleUSEquityMember = (selectedOption) => {
    setFormData({
      ...formData,
      usmembername: selectedOption.value,
    });
  };

  const validateForm = () => {
    if (simpleValidator.current.allValid()) {
      if (formData.avgbuyPrice === "0" || formData.avgbuyPrice === "") {
        toastr.error("Avg Buy Price must be greater than 0");
        return;
      }
      addAssets();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate((v) => ++v);
    }
  };

  const updateUSEquity = () => {
    if (simpleValidator.current.allValid()) {
      if (formData.avgbuyPrice === "0" || formData.avgbuyPrice === "") {
        toastr.error("Avg Buy Price must be greater than 0");
        return;
      }
      updateUSEquityData();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate((v) => ++v);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const asset_category = await getAssetCategoryList();

        const categoryList = asset_category?.data?.[0]?.category_list || [];

        const equityCategory = categoryList.find(
          (cat) => cat.asset_name === "Equity"
        );

        if (equityCategory) {
          for (const sub of equityCategory.subcategories) {
            const type = sub.asset_types.find(
              (t) => t.asset_type_name === "US Equity"
            );

            if (type) {
              const details = {
                asset_id: equityCategory.asset_id,
                asset_name: equityCategory.asset_name,
                asset_name_uuid: equityCategory.asset_name_uuid,

                asset_sub_id: sub.asset_sub_id,
                asset_sub_name: sub.asset_sub_name,
                asset_sub_name_uuid: sub.asset_sub_name_uuid,

                asset_type_id: type.asset_type_id,
                asset_type_name: type.asset_type_name,
                asset_type_name_uuid: type.asset_type_name_uuid,
              };

              setUsEquityDetails(details);
              break;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const addAssets = async () => {
    // e.preventDefault();

    try {
      let usequityData = assetsDetails;

      usequityData["asset_type_name_uuid"] =
        usEquityDetails.asset_type_name_uuid;
      usequityData["user_asset_for"] = formData.usmembername;
      usequityData["asset_sub_cat_id"] = usEquityDetails.asset_sub_id;
      usequityData["user_asset_user_id"] = getUserId();
      usequityData["user_asset_investment_amount"] = isRecurring
        ? formData.totalinvestedValue
        : formData.investedValue;
      usequityData["user_asset_current_amount"] = formData.currentValue;
      usequityData["user_asset_name"] = formData.usequityname;
      usequityData["asset_cat_id"] = usEquityDetails.asset_id;
      usequityData["user_asset_type_id"] = usEquityDetails.asset_type_id;

      usequityData["user_asset_currency"] = formData.assetcurrency
        ? "INR"
        : "Dollar";

      usequityData["user_asset_purchase_date"] = formData?.purchaseDate
        ? new Date(formData.purchaseDate).toLocaleDateString("en-GB")
        : "";

      usequityData["user_asset_end_date"] = formData?.sipenddate
        ? new Date(formData.sipenddate).toLocaleDateString("en-GB")
        : "";
      usequityData["user_asset_sip_amount"] = formData?.sipamount
        ? formData.sipamount
        : "";
      usequityData["user_asset_quantity"] = formData?.noofShares
        ? formData.noofShares
        : "";
      usequityData["user_asset_current_price"] = formData?.currentPrice
        ? formData.currentPrice
        : "";
      usequityData["asset_name_uuid"] = "equity";
      usequityData["asset_sub_name_uuid"] = "equity_others";
      usequityData["user_asset_occurance"] = isRecurring
        ? "Recurring"
        : "One Time";
      usequityData["user_asset_avg_purchase_price"] = formData.avgbuyPrice;

      const response = await saveUserAssetDetails(usequityData);

      if (response.status_code == "200") {
        navigate(
          process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=11"
        );

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `US Equity added Successfully!`,
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `US Equity not added, Something went wrong!`,
            type: "error",
          },
        });
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  function formatDateToDDMMYYYY(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const updateUSEquityData = async () => {
    try {
      const usequityData = { ...assetsDetails };

      usequityData["asset_id"] = assetEditId;
      usequityData["asset_type_name_uuid"] =
        usEquityDetails.asset_type_name_uuid;
      usequityData["user_asset_for"] = formData.usmembername;
      usequityData["asset_sub_cat_id"] = usEquityDetails.asset_sub_id;
      usequityData["user_asset_user_id"] = getParentUserId();
      usequityData["user_asset_investment_amount"] = isRecurring
        ? formData.totalinvestedValue
        : formData.investedValue;
      usequityData["user_asset_current_amount"] = formData.currentValue;
      usequityData["user_asset_name"] = formData.usequityname;
      usequityData["asset_cat_id"] = usEquityDetails.asset_id;
      usequityData["user_asset_type_id"] = usEquityDetails.asset_type_id;
      usequityData["user_asset_currency"] = formData.assetcurrency
        ? "INR"
        : "Dollar";
      usequityData["user_asset_purchase_date"] = formData.purchaseDate
        ? formatDateToDDMMYYYY(formData.purchaseDate)
        : null;
      usequityData["user_asset_end_date"] = formData.sipenddate
        ? new Date(formData.sipenddate).toLocaleDateString("en-GB")
        : null;
      usequityData["user_asset_sip_amount"] = formData.sipamount || "";
      usequityData["user_asset_quantity"] = formData.noofShares || "";
      usequityData["user_asset_current_price"] = formData.currentPrice || "";
      usequityData["asset_name_uuid"] = usEquityDetails.asset_name_uuid;
      usequityData["asset_sub_name_uuid"] = usEquityDetails.asset_sub_name_uuid;
      usequityData["user_asset_occurance"] = isRecurring
        ? "Recurring"
        : "One Time";
      usequityData["user_asset_avg_purchase_price"] = formData.avgbuyPrice;

      const addassetData = await updateUserAssetDetails(usequityData);

      if (addassetData["status_code"] == "200") {
        navigate(
          process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=11"
        );

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "US Equity updated Successfully!",
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "US Equity not updated, Something went wrong!",
            type: "error",
          },
        });
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const showSubmit = () => {
    if (formData.typeOfAsset === "EPF") {
      return showEPFForm;
    } else {
      return true;
    }
  };

  const handleCurrenySelection = (selectedOption) => {
    const avgBuyPrice = parseFloat(formData.avgbuyPrice) || 0;
    const currentPrice = parseFloat(formData.currentPrice) || 0;
    if (selectedOption == true) {
      setFormData({
        ...formData,
        assetcurrency: selectedOption,
        avgbuyPrice: avgBuyPrice ? avgBuyPrice * exchange_rate : "",
        currentPrice: currentPrice ? currentPrice * exchange_rate : "",
      });
    } else {
      setFormData({
        ...formData,
        assetcurrency: selectedOption,
        avgbuyPrice: avgBuyPrice ? avgBuyPrice / exchange_rate : "",
        currentPrice: currentPrice ? currentPrice / exchange_rate : "",
      });
    }
  };

  useEffect(() => {
    if (isRecurring) {
      const total_inv_val = formData.noofShares * formData.sipamount;
      const cur_val = formData.noofShares * formData.currentPrice;
      setFormData({
        ...formData,
        investedValue: 0,
        currentValue: cur_val,
        avgbuyPrice: 0,
        totalinvestedValue: total_inv_val || 0,
      });
    } else {
      formData.avgbuyPrice =
        formData.avgbuyPrice != "NaN" ? formData.avgbuyPrice : 0;
      const inv_val = formData.noofShares * formData.avgbuyPrice;
      const cur_val = formData.noofShares * formData.currentPrice;
      setFormData({
        ...formData,
        investedValue: inv_val,
        currentValue: cur_val,
        sipamount: 0,
        totalinvestedValue: 0,
      });
    }
  }, [
    formData.noofShares,
    formData.avgbuyPrice,
    formData.currentPrice,
    formData.sipamount,
    isRecurring,
  ]);

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
    if (usEquityData.length > 0 && formData.usequityname) {
      const match = usEquityData.find(
        (item) => item.label == formData.usequityname
      );
      setSelectedOption(match || null);
    }
  }, [USEquity, formData]);

  useEffect(() => {
    if (
      formData.recurring &&
      (formData.avgbuyPrice === "0" || formData.avgbuyPrice === "")
    ) {
      toastr.error(
        "Avg Buy Price must be greater than 0 when Recurring is selected"
      );
    }
  }, [formData.recurring, formData.avgbuyPrice]);

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
                "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=11"
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
                Add Your US Equity
              </h3>
            )}

            {updateForm && (
              <h3
                className="text-center pb-0 mb-0 ps-2"
                style={{
                  flexGrow: 1,
                }}
              >
                Edit Your US Equity
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
                    <span className="lbl-newbond">
                      Select Your US Equity Shares Name *
                    </span>
                    <br />
                    <Select
                      className={`${
                        updateForm === true ? "disabled" : ""
                      } fnto-dropdown-react`}
                      classNamePrefix="sortSelect"
                      isSearchable={true}
                      styles={customStyles}
                      options={usEquityData}
                      name="usEquityName"
                      onChange={handleUSEquitySelection}
                      value={selectedOption}
                    />
                    {simpleValidator.current.message(
                      "usEquityName",
                      formData.usequityname,
                      "required"
                    )}
                  </div>
                </div>

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
                      name="usMemberName"
                      onChange={handleUSEquityMember}
                      value={familyData.find(
                        (v) => v.value == formData.usmembername
                      )}
                    />

                    {simpleValidator.current.message(
                      "usMemberName",
                      formData.usmembername,
                      "required"
                    )}
                  </div>
                </div>

                <div
                  className="row"
                  style={{ display: "flex", flexWrap: "wrap" }}
                >
                  <div className="row py-md-2">
                    <div className="col-md-6">
                      <div className="d-grid">
                        <Form.Label className=" ">Select Currency:</Form.Label>
                        <div className="d-flex mt-md-3">
                          <div>$</div>
                          <Switch
                            onChange={(v) => {
                              handleCurrenySelection(v);
                            }}
                            checked={formData.assetcurrency}
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
                    <div className="col-md-6 col-12 mt-md-0 mt-3">
                      <div className="">
                        <div className="">
                          <span className="lbl-newbond">
                            Is The Equity One Time Or Recurring ? *
                          </span>
                          <br />
                          <div className="bonds-datepicker">
                            <div className="insurance-switch-container">
                              <span>One Time&nbsp;&nbsp;</span>{" "}
                              <FormSwitch
                                switchValue={isRecurring}
                                onSwitchToggle={() =>
                                  setIsRecurring((previous) => !previous)
                                }
                              />{" "}
                              <span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Recurring
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-12  mt-3 ">
                    <div className="my-md-4">
                      <div className="">
                        {isRecurring == false ? (
                          <>
                            <span className="lbl-newbond">Purchase Date *</span>
                            <div className="bonds-datepicker">
                              <FintooDatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={
                                  formData.purchaseDate === ""
                                    ? ""
                                    : formData.purchaseDate
                                  // : formData.purchaseDate
                                }
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                name="purchaseDate"
                                customClass="datePickerDMF"
                                maxDate={new Date()}
                                onChange={(e) =>
                                  onDateAndSelectInputChange(
                                    "purchaseDate",
                                    formatDatefun(e)
                                  )
                                }
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                              />
                            </div>
                            {simpleValidator.current.message(
                              "purchaseDate",
                              formData.purchaseDate,
                              "required"
                            )}
                          </>
                        ) : (
                          <>
                            <span className="lbl-newbond">
                              SIP Start Date *
                            </span>
                            <div className="bonds-datepicker">
                              <FintooDatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={
                                  formData.purchaseDate === ""
                                    ? ""
                                    : formData.purchaseDate
                                  // : formData.purchaseDate
                                }
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                name="purchaseDate"
                                customClass="datePickerDMF"
                                maxDate={new Date()}
                                onChange={(e) =>
                                  onDateAndSelectInputChange(
                                    "purchaseDate",
                                    formatDatefun(e)
                                  )
                                }
                                onKeyDown={(e) => {
                                  e.preventDefault();
                                }}
                              />
                            </div>
                            {simpleValidator.current.message(
                              "purchaseDate",
                              formData.purchaseDate,
                              "required"
                            )}
                          </>
                        )}
                        <br />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-12  mt-3">
                    <div className="my-md-4">
                      <div className="">
                        <span className="lbl-newbond">No. Of Shares *</span>
                        <br />
                        <input
                          placeholder="Enter No. Of Shares"
                          className={` w-100 fntoo-textbox-react inputPlaceholder`}
                          type="text"
                          value={formatNumberWithCommas(formData.noofShares)}
                          maxLength={12}
                          name="noofShares"
                          onChange={(e) => onInputChange(e, true)}
                        />
                        {simpleValidator.current.message(
                          "no. of Shares",
                          formData.noofShares,
                          "required|numeric"
                        )}
                      </div>
                    </div>
                  </div>
                  {isRecurring == false ? (
                    <>
                      <div className="col-md-6 col-12  mt-3">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">Avg Buy Price *</span>
                            <br />
                            <input
                              placeholder="Enter Avg Buy Price"
                              className={`w-100 fntoo-textbox-react ${
                                formData.assetcurrency === true
                                  ? "Rupee-icon"
                                  : "Doller-icon"
                              } inputPlaceholder`}
                              type="text"
                              value={formData.avgbuyPrice}
                              maxLength={9}
                              name="avgbuyPrice"
                              onChange={(e) => onInputChange(e, true)}
                              onBlur={() =>
                                setFormData({
                                  ...formData,
                                  avgbuyPrice: parseFloat(
                                    formData.avgbuyPrice
                                  ).toFixed(2),
                                })
                              }
                            />
                            {simpleValidator.current.message(
                              "Avg buy Price",
                              formData.avgbuyPrice,
                              "required|numeric|min:0.1,num"
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="col-md-6 col-12  mt-3">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">SIP Amount *</span>
                          <br />
                          <input
                            placeholder="Enter SIP Amount"
                            className={`w-100 fntoo-textbox-react ${
                              formData.assetcurrency
                                ? "Rupee-icon"
                                : "Doller-icon"
                            } inputPlaceholder`}
                            type="text"
                            value={formatNumberWithCommas(formData.sipamount)}
                            maxLength={15}
                            name="sipamount"
                            onChange={(e) => onInputChange(e, true)}
                          />
                          {simpleValidator.current.message(
                            "SIP Amount",
                            formData.sipamount,
                            "required|numeric|min:1,num"
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {isRecurring == false ? (
                    <>
                      {" "}
                      <div className="col-md-6 col-12  mt-3">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">Invested Value</span>
                            <br />
                            <input
                              placeholder="Enter Invested Value"
                              className={`w-100 fntoo-textbox-react ${
                                formData.assetcurrency
                                  ? "Rupee-icon"
                                  : "Doller-icon"
                              } inputPlaceholder disabled`}
                              type="text"
                              maxLength={15}
                              value={formatNumberWithCommas(
                                formData.investedValue
                              )}
                              name="investedValue"
                              onChange={(e) => onInputChange(e, true)}
                            />
                            {simpleValidator.current.message(
                              "investedValue",
                              formData.investedValue,
                              "required|numeric|min:1,num"
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-6 col-12  mt-3">
                        <div className="my-md-4">
                          <div className="">
                            <span className="lbl-newbond">
                              Total Invested Value
                            </span>
                            <br />
                            <input
                              placeholder="Enter Total Invested Value"
                              className={`w-100 fntoo-textbox-react ${
                                formData.assetcurrency
                                  ? "Rupee-icon"
                                  : "Doller-icon"
                              } inputPlaceholder disabled`}
                              type="text"
                              maxLength={15}
                              value={formatNumberWithCommas(
                                formData.totalinvestedValue
                              )}
                              name="totalinvestedValue"
                              onChange={(e) => onInputChange(e, true)}
                            />
                            {simpleValidator.current.message(
                              "totalInvestedValue",
                              formData.totalinvestedValue,
                              "required|numeric|min:1,num"
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-md-6 col-12  mt-3">
                    <div className="my-md-4">
                      <div className="">
                        <span className="lbl-newbond">Current Price *</span>
                        <br />
                        <input
                          placeholder="Enter Current Price"
                          className={`w-100 fntoo-textbox-react ${
                            formData.assetcurrency
                              ? "Rupee-icon"
                              : "Doller-icon"
                          } disabled inputPlaceholder`}
                          type="text"
                          value={formData.currentPrice}
                          name="currentPrice"
                          maxLength={9}
                          onChange={(e) => onInputChange(e, true)}
                        />
                        {simpleValidator.current.message(
                          "currentPrice",
                          formData.currentPrice,
                          "required|numeric"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12  mt-3">
                    <div className="my-md-4">
                      <div className="">
                        <span className="lbl-newbond">Current Value *</span>
                        <br />
                        <input
                          placeholder="Enter Current Value"
                          className={`w-100 fntoo-textbox-react ${
                            formData.assetcurrency
                              ? "Rupee-icon"
                              : "Doller-icon"
                          } inputPlaceholder disabled`}
                          type="text"
                          value={formatNumberWithCommas(formData.currentValue)}
                          maxLength={15}
                          name="currentValue"
                          onChange={(e) => onInputChange(e, true)}
                        />
                        {simpleValidator.current.message(
                          "currentValue",
                          formData.currentValue,
                          "required|numeric"
                        )}
                      </div>
                    </div>
                  </div>
                  {isRecurring == true ? (
                    <div className="col-md-6 col-12  mt-3 ">
                      <div className="my-md-4">
                        <div className="">
                          <span className="lbl-newbond">SIP End Date *</span>
                          <br />
                          <div className="bonds-datepicker">
                            <FintooDatePicker
                              dateFormat="dd/MM/yyyy"
                              selected={
                                formData.sipenddate === ""
                                  ? ""
                                  : formData.sipenddate
                              }
                              minDate={moment().toDate()}
                              maxDate={""}
                              // minDate={formData?.purchaseDate != "" ? moment(formData?.purchaseDate).add(1, 'years').toDate() : moment().add(1,'days').toDate()}
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              name="sipenddate"
                              customClass="datePickerDMF"
                              onChange={(e) =>
                                onDateAndSelectInputChange(
                                  "sipenddate",
                                  formatDatefun(e)
                                )
                              }
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                            />
                          </div>
                          {simpleValidator.current.message(
                            "SIP End Date",
                            formData.sipenddate,
                            "required"
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

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
                    <button
                      type="submit"
                      className="d-block m-auto btn btn-primary"
                      onClick={() => updateUSEquity()}
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
export default NewUsEquityFormView;
