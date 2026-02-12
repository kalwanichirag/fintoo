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
import { exchange_rate } from "../../../../constants";
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
  loginRedirectGuest,
} from "../../../../common_utilities";
import { useDispatch } from "react-redux";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { MdHomeMax } from "react-icons/md";
import Form from "react-bootstrap/Form";
import Switch from "react-switch";
import commonEncode from "../../../../commonEncode";
import axios from "axios";
import { EditIcon } from "evergreen-ui";
import { getFamilyMember } from "../../../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  getOtherInvestments,
  updateUserAssetDetails,
  saveUserAssetDetails,
} from "../../../../FrappeIntegration-Services/services/investment-api/investmentService";

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
  nameOfUnlistedEquity: "Unlisted / AIF Equity",
  aifmembername: "",
  purchaseDate: "",
  noofShares: "",
  avgbuyPrice: "",
  investedValue: "",
  currentPrice: "",
  currentValue: "",
};

const defaultAssetDetails = {
  asset_amount: "",
  asset_abreturn: "0",
  annual_growth_rate: "10",
  asset_broker_id: 0,
  asset_citytype: "0",
  user_asset_current_price: "",
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
  user_asset_for: 0,
  asset_mf_end_date: null,
  user_asset_name: "Unlisted / AIF Equity",
  asset_pan: null,
  asset_payout_type: "1",
  asset_pin_code: "",
  user_asset_avg_purchase_price: "",
  user_asset_purchase_date: null,
  asset_rental_amount: "",
  asset_rental_income: null,
  asset_ror: "0",
  asset_unique_code: "",
  user_asset_quantity: "",
  categorydetail: "Equity",
  created_datetime: moment().format("DD/MM/YYYY"),
  employee_contribution: "",
  employer_contribution: "",
  installment_ispaid: 1,
  membername1: "",
  stock_mf: null,
  stock_name: null,
  subcategorydetail: "",
  totalinvestedvalue: "",
  user_asset_current_amount: "",
  totalmaturtiyamount: "",
  updated_datetime: moment().format("DD/MM/YYYY"),
  user_id: 0,
  scheme_equityshare: {},
  linked_goals_id: [],
};

const NewUnlisted_Aif_EquityFormView = () => {
  const user_data = JSON.parse(localStorage.getItem("user_data") || "{}");
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
  const [isInstallmentPaid, setIsInstallmentPaid] = useState(true);

  const [interestRate, setInterestRate] = useState(0);
  const [rateOfReturn, setRateOfReturn] = useState(8.1);
  const [growthRate, setGrowthRate] = useState(10);
  const [yearsOfService, setYearsOfService] = useState("5");
  const [allBank, setAllBank] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [session, setSession] = useState([]);
  const [familyData, setFamilyData] = useState([]);
  const [memberData, setMemberData] = useState([]);

  // ---------------------------------------------------- EPF states ----------------------------------------------------
  const [showEPFForm, setShowEPFForm] = useState(false);
  const [showUANModal, setShowUANModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isManual, setIsManual] = useState(false);

  const [assetForMember, setAssetForMember] = useState("");
  const [assetName, setAssetName] = useState("");

  // --------------------------------------------------------------------------------------------------------------------

  const simpleValidator = useRef(new SimpleReactValidator());

  useEffect(() => {
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
      editAIFData(asset_id);
    }
  }, []);

  const checksession = async () => {
    try {
      let url = "";
      // let url = CHECK_SESSION;
      let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };
      let session_data = await apiCall(url, data, true, false);

      if (session_data.error_code == "100") {
        setSession(session_data);
      } else {
        loginRedirectGuest();
      }
    } catch (error) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something Went Wrong1");
    }
  };

  const getFamilyMembers = async () => {
    try {
      const member_data = await getFamilyMember(getUserId());

      if (member_data.status_code === "200") {
        let member_array = [];
        let filter_member = [];
        const members = member_data.data;

        let defaultMemberSet = false;

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

          // Add Family option once
          if (!defaultMemberSet && isSelf && !parentId) {
            defaultMemberSet = true;

            // Set asset for member and form data safely
            setAssetForMember(memberId);
            setAssetsDetails((prev) => ({
              ...prev,
              asset_member_id: memberId,
            }));

            setFormData((prev) => ({
              ...prev,
              aifmembername: memberId,
            }));

            // Add Family option
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
      } else {
        setFamilyData([]);
        setMemberData([]);
      }
    } catch (error) {
      console.error("Error fetching family members", error);
      setFamilyData([]);
      setMemberData([]);
    }
  };

  const formatDatefun = (date) => {
    // return moment(date).format("YYYY/MM/DD");

    return moment(date).toDate();
  };

  const parseDate = (dateStr) => {
    try {
      if (!dateStr || typeof dateStr !== "string") return null;
      const [day, month, year] = dateStr.split("/");
      const date = new Date(`${year}-${month}-${day}`);
      if (isNaN(date)) throw new Error("Invalid date");
      return date;
    } catch (e) {
      console.warn("parseDate failed for:", dateStr);
      return null;
    }
  };

  const handleAIFEquityMember = (selectedOption) => {
    setFormData({
      ...formData,
      aifmembername: selectedOption.value,
    });
  };

  const handleEquityType = (selectedOption) => {
    setFormData({
      ...formData,
      asset_type: selectedOption.value,
    });
  };
  const editAIFData = async (id) => {
    try {
      let payload_data = {
        user_id: getParentUserId(),
        user_asset_id: id,
      };

      const editAIFapi = await getOtherInvestments(payload_data);

      if (editAIFapi?.status_code === "200") {
        const urlParams = new URLSearchParams(window.location.search);

        const selectedAsset = editAIFapi?.data?.listing?.find(
          (item) => item?.name === urlParams.get("id")
        );

        if (selectedAsset) {
          var asset_type = "";
          if (selectedAsset.asset_sub_name_uuid === "equity_others") {
            asset_type = "unlisted";
          } else if (selectedAsset.asset_sub_name_uuid === "aif") {
            asset_type = "aif";
          }
          console.log("selectedAsset", selectedAsset);
          setFormData({
            ...formData,
            usequityname: selectedAsset.user_asset_name,
            aifmembername: selectedAsset.user_asset_for,
            investedValue: selectedAsset.total_invested_amount,
            avgbuyPrice: selectedAsset.user_asset_avg_purchase_price,
            assetcurrency: selectedAsset.user_asset_currency === "INR",
            purchaseDate: parseDate(selectedAsset.user_asset_purchase_date),
            sipenddate: parseDate(selectedAsset.user_asset_end_date),
            sipamount: selectedAsset.user_asset_sip_amount,
            noofShares: selectedAsset.user_asset_quantity,
            currentPrice: selectedAsset.user_asset_current_price,
            asset_name_uuid: selectedAsset.asset_name_uuid,
            asset_sub_name_uuid: selectedAsset.asset_sub_name_uuid,
            user_asset_automated_linkage:
              selectedAsset.user_asset_automated_linkage,
            asset_type: asset_type,
          });
        }
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
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
      (name === "currentPrice" ||
        name === "avgbuyPrice" ||
        name === "noofShares") &&
      cleanValue.length > 0 &&
      cleanValue[0] === "0"
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

  const validateForm = () => {
    if (simpleValidator.current.allValid()) {
      // addFdBond();
      addAssets();
      // setFormData({ ...initialState });
      // setInterestRate(0);
      // simpleValidator.current.hideMessages();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate((v) => ++v);
    }
  };

  const updateAIF = () => {
    if (simpleValidator.current.allValid()) {
      updateAIFequity();
    } else {
      simpleValidator.current.showMessages();
      forceUpdate((v) => ++v);
    }
  };

  const addAssets = async () => {
    try {
      let aifData = assetsDetails;

      var asset_type_name_uuid = "";
      var asset_name_uuid = "";
      var asset_sub_name_uuid = "";

      if (formData.asset_type === "unlisted") {
        asset_type_name_uuid = "unlisted";
        asset_sub_name_uuid = "equity_others";
        asset_name_uuid = "equity";
      } else if (formData.asset_type === "aif") {
        asset_sub_name_uuid = "aif";
        asset_name_uuid = "alternate";
      }

      aifData["user_asset_user_id"] = getUserId();
      aifData["user_asset_for"] = formData.aifmembername;
      aifData["user_asset_name"] = formData.asset_name;
      aifData["user_asset_purchase_date"] = formData.purchaseDate
        ? moment(formData.purchaseDate).format("DD/MM/YYYY")
        : "";
      aifData["user_asset_quantity"] = formData.noofShares;
      aifData["user_asset_avg_purchase_price"] = formData.avgbuyPrice;
      aifData["user_asset_current_price"] = formData.currentPrice;
      aifData["user_asset_investment_amount"] = formData.investedValue;
      aifData["user_asset_current_amount"] = formData.currentValue;
      aifData["asset_sub_category_id"] =
        formData.asset_type == "aif" ? "ASC-25" : "ASC-17";
      aifData["user_asset_type_id"] = "";
      aifData["asset_type_name_uuid"] = asset_type_name_uuid;
      aifData["asset_name_uuid"] = asset_name_uuid;
      aifData["asset_sub_name_uuid"] = asset_sub_name_uuid;
      aifData["user_asset_automated_linkage"] = 0;

      var addAssetResponse = await saveUserAssetDetails(aifData);

      if (addAssetResponse["status_code"] == "200") {
        navigate(
          process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=10"
        );

        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Unlisted / AIF Equity added Successfully!`,
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Unlisted / AIF Equity not added, Something went wrong!`,
            type: "error",
          },
        });
      }
    } catch (err) {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const updateAIFequity = async () => {
    try {
      let aifData = assetsDetails;
      aifData["asset_id"] = assetEditId;
      aifData["user_asset_user_id"] = user_data.user_id;
      aifData["user_asset_for"] = formData.aifmembername;
      aifData["subcategorydetail"] = "Unlisted / AIF Equity";

      aifData["user_asset_name"] = formData.nameOfUnlistedEquity;
      aifData["user_asset_purchase_date"] = formData.purchaseDate
        ? moment(formData.purchaseDate).format("DD/MM/YYYY")
        : "";
      aifData["user_asset_quantity"] = formData.noofShares;
      aifData["user_asset_avg_purchase_price"] = formData.avgbuyPrice;
      aifData["user_asset_current_price"] = formData.currentPrice;
      aifData["user_asset_investment_amount"] = formData.investedValue;
      aifData["user_asset_current_amount"] = formData.currentValue;
      aifData["user_asset_type_id"] = formData.user_asset_type_id;
      aifData["asset_type_name_uuid"] = formData.asset_type_name_uuid;
      aifData["categorydetail"] = "Equity";
      aifData["asset_cat_id"] = formData.asset_cat_id;
      aifData["user_asset_automated_linkage"] =
        formData.user_asset_automated_linkage;
      aifData["asset_sub_cat_id"] = formData.asset_sub_category_id;
      aifData["asset_name_uuid"] = formData.asset_name_uuid;
      aifData["asset_sub_name_uuid"] = formData.asset_sub_name_uuid;

      const response = await updateUserAssetDetails(aifData);
      // return response;
      if (response?.status_code == "200") {
        navigate(
          process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=10"
        );
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Unlisted / AIF Equity updated Successfully!`,
            type: "success",
          },
        });
      } else {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: `Unlisted / AIF Equity not updated, Something went wrong!`,
            type: "error",
          },
        });
      }
    } catch (err) {
      // setIsLoading(false);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  useEffect(() => {
    const inv_val = formData.noofShares * formData.avgbuyPrice;
    const cur_val = formData.noofShares * formData.currentPrice;
    setFormData({ ...formData, investedValue: inv_val, currentValue: cur_val });
  }, [formData.noofShares, formData.avgbuyPrice, formData.currentPrice]);
  simpleValidator.current.purgeFields();

  const showSubmit = () => {
    if (formData.typeOfAsset === "EPF") {
      return showEPFForm;
    } else {
      return true;
    }
  };

  const options = [
    { value: "unlisted", label: "Unlisted Equity" },
    { value: "aif", label: "AIF Equity" },
  ];
  const optionSubCategory = {
    "Fixed Deposit": 75,
    Bonds: 79,
    Debentures: 80,
    Others: 87,
    Gratuity: 82,
    "Recurring Deposit": 120,
    // EPF: 117,
  };
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
                "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=10"
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
                Add Your Unlisted/AIF Equity
              </h3>
            )}

            {updateForm && (
              <h3
                className="text-center pb-0 mb-0 ps-2"
                style={{
                  flexGrow: 1,
                }}
              >
                Edit Your Unlisted/AIF Equity
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
                    <span className="lbl-newbond">Equity Name *</span>
                    <br />
                    {/* <input
                      placeholder="Enter Name Of Unlisted Equity"
                      className={` w-100 fntoo-textbox-react inputPlaceholder`}
                      type="text"
                      name="nameOfUnlistedEquity"
                      value={formData.nameOfUnlistedEquity}
                      onChange={(e) => onInputChange(e)}
                    /> */}
                    <Select
                      className={`${
                        updateForm === true ? "disabled" : ""
                      } fnto-dropdown-react`}
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={options}
                      name="typeOfAsset"
                      onChange={(selectedOption) =>
                        setFormData({
                          ...formData,
                          asset_type: selectedOption.value,
                          asset_name: selectedOption.label,
                        })
                      }
                      value={
                        options.find((v) => {
                          return v.value === formData.asset_type;
                        }) || null
                      }
                    />
                    {simpleValidator.current.message(
                      "nameOfUnlistedEquity",
                      formData.nameOfUnlistedEquity,
                      "required"
                    )}
                  </div>
                </div>
                <div className="my-md-4">
                  <div className="">
                    <span className="lbl-newbond">
                      Who Is This Investment For? *
                    </span>
                    <br />
                    <Select
                      className={`fnto-dropdown-react`}
                      classNamePrefix="sortSelect"
                      isSearchable={false}
                      styles={customStyles}
                      options={familyData}
                      name="aifMemberName"
                      onChange={handleAIFEquityMember}
                      value={familyData.find(
                        (v) => v.value == formData.aifmembername
                      )}
                    />
                    {simpleValidator.current.message(
                      "aifMemberName",
                      formData.aifmembername,
                      "required"
                    )}
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "flex", flexWrap: "wrap" }}
                >
                  <div className="col-md-6 col-12  mt-3 ">
                    <div className="my-md-4">
                      <div className="">
                        <span className="lbl-newbond">Purchase Date *</span>
                        <br />
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
                          name="noofShares"
                          maxLength={12}
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
                  <div className="col-md-6 col-12  mt-3">
                    <div className="my-md-4">
                      <div className="">
                        <span className="lbl-newbond">Avg Buy Price *</span>
                        <br />
                        <input
                          placeholder="Enter Avg Buy Price"
                          className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                          type="text"
                          value={formatNumberWithCommas(formData.avgbuyPrice)}
                          name="avgbuyPrice"
                          maxLength={12}
                          onChange={(e) => onInputChange(e, true)}
                        />
                        {simpleValidator.current.message(
                          "Avg buy Price",
                          formData.avgbuyPrice,
                          "required|numeric"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12  mt-3">
                    <div className="my-md-4">
                      <div className="">
                        <span className="lbl-newbond">Invested Value *</span>
                        <br />
                        <input
                          placeholder="Enter Invested Value"
                          className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder disabled`}
                          type="text"
                          value={formatNumberWithCommas(formData.investedValue)}
                          maxLength={15}
                          name="investedValue"
                        />
                        {simpleValidator.current.message(
                          "investedValue",
                          formData.investedValue,
                          "required|numeric"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-12  mt-3">
                    <div className="my-md-4">
                      <div className="">
                        <span className="lbl-newbond">Current Price *</span>
                        <br />
                        <input
                          placeholder="Enter Current Price"
                          className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder`}
                          type="text"
                          value={formatNumberWithCommas(formData.currentPrice)}
                          name="currentPrice"
                          maxLength={12}
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
                          className={` w-100 fntoo-textbox-react Rupee-icon inputPlaceholder disabled`}
                          type="text"
                          maxLength={15}
                          value={formatNumberWithCommas(formData.currentValue)}
                          name="currentValue"
                        />
                        {simpleValidator.current.message(
                          "currentValue",
                          formData.currentValue,
                          "required|numeric"
                        )}
                      </div>
                    </div>
                  </div>
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
                      onClick={() => updateAIF()}
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
export default NewUnlisted_Aif_EquityFormView;
