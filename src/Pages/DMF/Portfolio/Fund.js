import moment from "moment";
import { useState, useEffect, useRef } from "react";
import PortfolioLayout from "../../../components/Layout/Portfolio";
import { Link } from "react-router-dom";
import axios from "axios";
import commonEncode from "../../../commonEncode";
import {
  CheckSession,
  capitalize,
  fetchEncryptData,
  getItemLocal,
  getUserId,
  indianRupeeFormat,
  isUnderMaintenance,
  maskBankAccNo,
  errorAlert,
  setItemLocal,
} from "../../../common_utilities";
import { useDispatch } from "react-redux";
import {
  FaEllipsisV,
  FaUserAlt,
  FaLongArrowAltUp,
  FaCalendarAlt,
  FaRegCalendarAlt,
  FaChevronRight,
  FaAngleDown,
  FaAngleRight,
  FaStar,
} from "react-icons/fa";

import Modal from "react-bootstrap/Modal";
import FintooLongDropdown from "../../../components/HTML/FintooLongDropdown";
import Switch from "react-switch";

import FintooDatePicker from "../../../components/HTML/FintooDatePicker";
import { ReactComponent as PiggybankIcon } from "../../../Assets/Images/tranx-888.svg";
import { ReactComponent as DownArrow } from "../../../Assets/Images/down-arr-98.svg";

import Table from "react-bootstrap/Table";
import FintooBackButton from "../../../components/HTML/FintooBackButton";
import PortfolioOtpModal from "../../../components/Portfolio/OtpModal";
import FintooLongDropdownSecond from "../../../components/HTML/FintooLongDropdown/second";
import { useNavigate } from "react-router-dom";
import {
  CrmAPIEndPoints,
  DATA_BELONGS_TO
} from "../../../constants";
import Swal from "sweetalert2";
import style from "./style.module.css";
import Select from "react-select";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FcNext } from "react-icons/fc";
const SIPTenure = [
  { value: "One Year", label: "1 Year" },
  { value: "Two Year", label: "2 Year" },
  { value: "Three Year", label: "3 Year" },
  { value: "Four Year", label: "4 Year" },
  { value: "Five Year", label: "5 Year" },
];
const SIPMandate = [
  { value: "HDFCXXXXX234", label: "HDFC XXXXX234" },
  { value: "SBIXXXXX234", label: "SBI XXXXX234" },
];

import { Modal as ReactModal } from "react-responsive-modal";
import StopSipReason from "../../../components/StopSipReason";
import StopSipSelectionModal from "../../../components/Portfolio/StopSipSelectionModal";
import FintooButton from "../../../components/HTML/FintooButton";
import SimpleReactValidator from 'simple-react-validator';
import { getMfSummaryPortfolio, getMfDetailedPortfolio, PlaceOrder, MaintenanceStatus, AddToCartDetails, AddTransaction, GetSchemeList, DeleteCart, AddSwitchToCartDetails, AddSwitchTransaction } from "../../../FrappeIntegration-Services/services/investment-api/investmentService";
import { fetchUserMfProfileStatus, getUserBankDetails, XsiporderEntry } from "../../../FrappeIntegration-Services/services/master-api/masterApiService";
import { FintooLogoLoader } from "../../../components/FintooInlineLoader";

const PortfolioFund = (props) => {
  const navigate = useNavigate();

  const [disable, setDisable] = useState(false);
  const [lockInPeriod, setLockinPeriod] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);
  const [redeemAll, setRedeemAll] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [openModalByName, setOpenModalByName] = useState("");
  const [openBottomModalByName, setOpenBottomModalByName] = useState("");
  const [showFintooTip, setShowFintooTip] = useState(false);
  const [returnsType, setReturnsType] = useState("xirr");

  const [detailedMfPotfolio, setDetailedMfPotfolio] = useState({});
  const [userMandateList, setUserMandateList] = useState([]);
  const [fundDetails, setFundDetails] = useState([]);
  const [fundInnerTransactions, setFundInnerTransactions] = useState([]);
  const [validatorFlags, setValidatorFlags] = useState([]);
  const [summaryPortfolio, setSummaryPortfolio] = useState([]);
  const [getAmcCode, setAmcCode] = useState([{}]);
  const [getStpAmcCode, setStpAmcCode] = useState([{}]);
  const [folioNumber, setFolioNumber] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [units, setUnits] = useState("");
  const [currentNav, setCurrentNav] = useState("");
  const [schemeCode, setSchemeCode] = useState("");
  const [getuserbank, setUserBanks] = useState("");
  const [getprimarybank, setPrimaryBank] = useState("");
  const [schemedetails, setSchemeDetails] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [allUnits, setAllUnits] = useState(false);
  const [currAmount, setCurrAmount] = useState("");
  const [primaryBankId, setPrimaryBankId] = useState("");

  const [validUnits, setValidUnits] = useState(true);
  const [validAmount, setValidAmount] = useState(true);
  const [defaultValuesUnits, setDefaultValuesUnits] = useState(true);
  const [defaultValuesAmount, setDefaultValuesAmount] = useState(true);
  const [exitLoad, setExitLoad] = useState(0);
  const [approxAmount, setApproxAmount] = useState(0);
  const [unlockedUnits, setUnlockedUnits] = useState("");
  const [unlockedAmount, setUnlockedAmount] = useState("");
  const [btnClick, setBtnClick] = useState(true);
  const [elssText, setElssText] = useState("");
  const [switchText, setSwitchText] = useState("");
  const cartIdRef = useRef(null);
  const cartId = useRef(null);
  const transactionIdRef = useRef(null);
  const transactionId = useRef(null);
  const dispatch = useDispatch();
  const [sipDate, setSipDate] = useState();
  const [stopSipLogic, setStopSipLogic] = useState();
  const [schemeCodeData, setSchemeCodeData] = useState("");
  const [stpUnits, setStpUnits] = useState("");
  const [validSwpAmount, setValidSwpAmount] = useState(false);
  const [validStartSwpDate, setValidStartSwpDate] = useState(false);
  const [validEndSwpDate, setValidEndDate] = useState(false);
  const [elssCheck, setElssCheck] = useState("");
  const [withdrawalPlanBtn, setWithdrawalPlanBtn] = useState(false);
  const [swpAmount, setSwpAmount] = useState("");
  const [startDateSwp, setStartDateSwp] = useState("");
  const [endDateSwp, setEndDateSwp] = useState("");
  const [swpErrorText, setSwpErrorText] = useState("");
  const [swpUnits, setSwpUnits] = useState("");
  const [swpCartId, setSwpCartId] = useState("");
  const [swpTrxId, setSwpTrxId] = useState("");
  const [holidayList, setHolidayList] = useState([]);
  const [stpHolidayList, setStpHolidayList] = useState([]);
  const [minInvestStp, setMinInvestStp] = useState("");
  const [stpMultiAmt, setStpMultiAmt] = useState("");
  const [today, setToday] = useState(moment());
  const simpleValidator = useRef(new SimpleReactValidator());
  const [isOpen, setIsOpen] = useState(false);
  const [allRedeemKey, setAllRedeemKey] = useState("N"); //in case of redeem all set the allRedeemKey as 'Y'
  const [noOfInstallment, setNoOfInstallment] = useState("");
  const [minInstallmentText, setMinInstallmentText] = useState("");
  const [stpTransactionId, setStpTransactionId] = useState(null);
  const [monthlyRecurringStpAmount, setMonthlyRecurringStpAmount] = useState(0);
  const [currentSWPAmount, setCurrentSWPAmount] = useState(0);
  const [profilePercentage, setProfilePercentage] = useState(false);
  const [memberData, setMemberData] = useState(false);

  const [investMoreBtnDisable, setinvestMoreBtnDisable] = useState("opt-buttons");
  const [investMoreBtnLinkDisable, setinvestMoreBtnLinkDisable] = useState("custom-buttons");

  const [operationsBtnsDisable, setOperationsBtnsDisable] = useState(false);

  const [operationsBtnMsg, setOperationsBtnMsg] = useState("d-none");

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const [amount, setAmount] = useState("");
  // const [profilestate ,setprofilestate] = useState('')
  // setprofilestate(getItemLocal('profile')
  var profile = getItemLocal("profile");

  const userProfileStatus = async () => {
    try {
      const profile_data = await fetchUserMfProfileStatus(getUserId(), DATA_BELONGS_TO);
      setProfilePercentage(profile_data?.user_profile_progress?.profile_status);
    } catch (error) {
      console.log("Error while fetching user profile status: ", error);
    }
  }

  const [tomorrow, setTomorrow] = useState(
    moment().clone().add(1, "day").toString()
  );
  const [marketDateTime] = useState(
    moment.duration(moment().format("H:m")).asHours() > 15.3
      ? moment().add(1, "day").toDate()
      : moment().toDate()
  );

  // const [startDateStp, setStartDateStp] = useState(
  //   moment.duration(moment().format("H:m")).asHours() > 15.3
  //     ? moment().add(1, "day").toDate()
  //     : moment().toDate()
  // );

  const [startDateStp, setStartDateStp] = useState("");

  const [endDateStp, setEndDateStp] = useState(
    moment.duration(moment().format("H:m")).asHours() > 15.3
      ? moment().add(1, "day").add(1, "month").toDate()
      : moment().add(1, "month").toDate()
  );
  const [tabSelection, setTabSelection] = useState("Transaction");
  const [sipOTP, setSIPOTP] = useState("");

  const [stopReason, setStopReason] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  const fetchHolidayList = async () => {
    // try {
    //   var data = { dmf: "1" };
    //   var payload = {
    //     method: "post",
    //     url: GET_HOLIDAYS,
    //     data: data,
    //   };
    //   var res = await axios(payload);
    //   if (res.data.error_code == "100") {
    //     const convertedDates = res.data.data.map((date) =>
    //       moment(date).valueOf()
    //     );
    //     setHolidayList(convertedDates);
    //   } else {
    //     throw "Something went wrong";
    //   }
    // } catch (e) {
    //   console.log("Error - ", e);
    // }
  };
  const [, forceUpdate] = useState();
  useEffect(() => {
    fetchHolidayList();
    getUserMandateList();

    const stored = localStorage.getItem("allMemberUser");

    if (!stored) return;

    try {
      const member_data = JSON.parse(commonEncode.decrypt(stored));

      if (Array.isArray(member_data) && member_data.length > 0) {
        setMemberData(member_data);
      }
    } catch (err) {
      console.error("Failed to parse member data", err);
    }

  }, []);

  const checkWeekday = (date) => {
    return moment(date).isoWeekday() < 6;
  };

  // var sipDate;
  const sipDateLogic = () => {
    let x = moment(fundDetails?.cart_sip_start_date);
    let dd = x.get("date");
    let y = moment();
    let new_date = y.date(dd);
    let today = moment();
    let diff = new_date.diff(today, "days");
    if (diff < 0) {
      new_date.add(1, "month");
      diff = new_date.diff(today, "days");
    }

    if (diff < 9) {
      setStopSipLogic(false);
    } else {
      setStopSipLogic(true);
    }

    setSipDate(new_date);
  };

  const failAlert = () => {
    Swal.fire({
      title: "",
      text: "Your SIP installment is due within the next 9 days. Please try placing the cancel request later.",
      icon: "error",
    });
  };

  useEffect(() => {
    sipDateLogic();
  }, [fundDetails]);

  useEffect(() => {
    fetchPortfolioSummary();
    fetchschemecode();
    getUserBank();
    onLoadInIt();
    userProfileStatus();
    // // checksession();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    // return () => {
    //   localStorage.removeItem("detailsData");
    // };
  }, []);

  const schemeDetailsApi = async () => {
    try {
      var urldata = { scheme_code: schemeCodeData };

      // var config = {
      //   method: "post",
      //   url: DMF_BASE_URL + "api/scheme/getschemedetail",
      //   data: urldata,
      // };
      // var x = await fetchEncryptData(config);
    } catch (e) {
      console.log(e);
    }
  };

  const onLoadInIt = async () => {
    try {

      var detailsData = JSON.parse(localStorage.getItem("detailsData"));

      // let r = await fetchEncryptData({
      //   url: DMF_ALL_TRANSACTIONS_API_URL,
      //   data: {
      //     "user_id": "" + getUserId(),
      //     "is_direct": IS_DIRECT
      //   },
      //   method: "post"
      // });
      // let tempAvailableUnits = 0;
      // r.data.forEach(v => {
      //   if (v.transaction_folio_no == detailsData["folio_no"]) {
      //   }
      // });

      // var config = {
      //   method: "post",
      //   url: DMF_DETAILED_PF_API_URL,
      //   data: detailsData,
      // };

      // var res = await fetchEncryptData(config);

      var mfSummaryPortfolioData = await getMfDetailedPortfolio(detailsData);

      var res = mfSummaryPortfolioData;

      // var minInstallmentText = res.data?.fund_details[0]?.astp_min_installment_number;
      // setMinInstallmentText(minInstallmentText ? Number(minInstallmentText) : "");
      setDetailedMfPotfolio(res.data);
      setFundDetails(res.data.fund_list);
      setSchemeCodeData(res.data.fund_list[0]["scheme_code"]);
      setNoOfInstallment(minInstallmentText);

      if (res.data.fund_list[0].lock_period > 0) {
        if (
          res.data.fund_list[0].lock_period > 0 &&
          res.data.fund_list[0].unlocked_units > 0
        ) {
          setUnlockedUnits(res.data.fund_list[0].unlocked_units);
          setUnlockedAmount(res.data.fund_list[0].unlocked_amount);
        } else {
          setUnlockedAmount(0);
          setUnlockedUnits(0);
        }
      } else {
        setUnlockedUnits(res.data.fund_list[0].units);
        setUnlockedAmount(res.data.fund_list[0].curr_val);
      }
      setValidatorFlags(res.data.fund_list[0].validfor_flags);
      setFundInnerTransactions(res.data.fund_list[0].fund_inner_transactions);
      setLockinPeriod(res.data.fund_list[0].lock_period);
      getPrimaryBank();
    } catch (e) {
      navigate(
        process.env.PUBLIC_URL + "/direct-mutual-fund/portfolio/dashboard"
      );
    }
  };

  useEffect(() => {
    if (schemeCodeData) {
      schemeDetailsApi();
    }
  }, [schemeCodeData]);

  const fetchPortfolioSummary = async () => {
    try {
      var detailsData = JSON.parse(localStorage.getItem("detailsData"));
      var details = detailsData.pan;
      var payload = { pan: details };
      var res = await getMfSummaryPortfolio(payload);

      setSummaryPortfolio(res.data);
    } catch (e) { }
  };

  const fetchschemecode = async () => {
    try {
      var detailsData = JSON.parse(localStorage.getItem("detailsData"));
      var details = detailsData.amc_code;
      var payload = {
        amc_code: details
      };

      var res = await GetSchemeList(payload);
      setAmcCode(res.data);
      setStpAmcCode(res.stp_data);
    } catch (e) { }
  };

  const addCart = async () => {

    var schemeCode = selectedScheme.scheme_code;
    var amount = currAmount.toString();
    const today = new Date();

    const cart_sip_date = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    try {
      if (!redeemAll) {

        var add_to_cart_payload = {
          cart_scheme_code: schemeCode,
          user_id: getUserId(),
          cart_purchase_type: "R",
          transaction_type: "R",
          data_belongs_to: DATA_BELONGS_TO,
          cart_sip_start_date: cart_sip_date
        }
        if (detailedMfPotfolio?.requestType == 'unit') {
          add_to_cart_payload.cart_units = units;
        } else {
          add_to_cart_payload.cart_amount = currAmount;
        }
      } else {

        var add_to_cart_payload = {
          cart_scheme_code: schemeCode,
          cart_amount: currentValue,
          cart_units: allUnits,
          user_id: getUserId(),
          cart_purchase_type: "R",
          transaction_type: "R",
          cart_sip_start_date: cart_sip_date,
          data_belongs_to: DATA_BELONGS_TO,
        }
      }

      var response = await AddToCartDetails(add_to_cart_payload);

      if (response.status_code == 200) {
        
        cartId.current = response.data[0]?.cart_id;
        setStepCount(1);
        setValidAmount(true);
        setValidUnits(true);
        addTransaction();
      } else {
        setStepCount(1);
        await deleteCartAPI();
        // addCart();
      }
    } catch (e) {
      console.log("Error adding to cart: ", e);
    }
  };

  const getPrimaryBank = async () => {
    var user_id = getUserId();
    try {
      var urldata = { user_id: user_id.toString() };
      var data = urldata;
      var config = {
        method: "post",
        url: DMF_GET_PRIMARY_BANK_API_URL,
        data: data,
      };
      var res = await fetchEncryptData(config);
      setPrimaryBankId(res.data[0].bank_id);
    } catch (e) { }
  };

  const addTransaction = async () => {
    var schemeCode = selectedScheme.scheme_code;
    var amount = currAmount.toString();
    var units = units;
    var folio_number = folioNumber;
    var cart_id = cartId.current;

    try {
      var payload = {
        cart_id: cart_id,
        bank_id: primaryBankId.toString(),
        // cart_scheme_code: schemeCode,
        // cart_amount: amount,
        units: units,
        transaction_type: "R",
        data_belongs_to: DATA_BELONGS_TO,
        user_id: getUserId(),
        folio_no: folio_number,
      };

      var add_transaction_response = await AddTransaction(payload);

      if (add_transaction_response.status_code == 200){
        transactionId.current = add_transaction_response.transaction_id;
      }

    } catch (e) { }
  };

  const deleteCartAPI = async () => {
    var cart_id = cartId?.current;
    
    var payload = {
      from_cart_id: "" + cart_id,
      user_id: "" + getUserId(),
    };

    const response = await DeleteCart(payload);
  };

  const deleteCartSWPAPI = async () => {

    var cart_id = cartId.current;
    var payload = {
      method: "post",
      url: DMF_CART_DELETE_API_URL,
      data: {
        cart_id: cart_id.toString(),
      },
    };
    var res = await fetchEncryptData(payload);
  };

  const addToCart = async () => {
    try {
      var toschemecode = schemedetails.scheme_code;
      var schemeCode = selectedScheme.scheme_code;
      var amount = currAmount;
      // var units = units;

      if (redeemAll == true) {
        var payload = {
          from_data: {
            cart_scheme_code: schemeCode,
            cart_amount: 0,
            cart_units: 0,
            user_id: getUserId(),
            cart_purchase_type: "SO",
            transaction_type: "SWITCH",
            data_belongs_to: DATA_BELONGS_TO,
            switch_all: "Y",
          },
          to_data: {
            cart_scheme_code: toschemecode,
            cart_amount: 0,
            cart_units: 0,
            user_id: getUserId(),
            cart_purchase_type: "SI",
            transaction_type: "SWITCH",
            data_belongs_to: DATA_BELONGS_TO,
          },
        };
      } else {
        var payload = {
          from_data: {
            cart_scheme_code: schemeCode,
            cart_amount: amount,
            cart_units: units,
            user_id: getUserId(),
            cart_purchase_type: "SO",
            transaction_type: "SWITCH",
            data_belongs_to: DATA_BELONGS_TO,
            switch_all: "N",
          },
          to_data: {
            cart_scheme_code: toschemecode,
            cart_amount: amount,
            cart_units: units,
            user_id: getUserId(),
            cart_purchase_type: "SI",
            transaction_type: "SWITCH",
            data_belongs_to: DATA_BELONGS_TO,
          },
        };
      }
      var response = await AddSwitchToCartDetails(payload);
      
      if (response.status_code * 1 === 200) {
        fundDetails["cartIdRef"] = response?.data
        cartIdRef.current = {
          cart_id_from: response?.data?.cart_id_from,
          cart_id_to: response?.data?.cart_id_to
        };
        
        addtoTransaction();
      }
    } catch (e) {
      console.log("SWITCH Error adding to cart: ", e);
    }
  };

  const getUserBank = async () => {
    var user_id = getUserId();
    try {
      var payload = {
        user_id: user_id
      }

      var get_user_bank_response = await getUserBankDetails(payload);

      setUserBanks(get_user_bank_response.data);
    } catch (e) { }
  };

  const getExitLoad = async () => {
    let today_date = moment(new Date()).format("YYYY-MM-DD");
    try {
      var payload = {
        method: "post",
        url: DMF_GETEXITLOAD_API_URL,
        data: {
          scheme_code: fundDetails.scheme_code,
          invested_date: fundDetails.inv_since,
          exit_load_date: today_date,
          redeem_amount: currAmount,
          invested_amount: fundDetails.inv,
          redeem_unit: units,
          unit: fundDetails.units,
          curr_nav: fundDetails.curr_nav,
          exit_load_unit:
            fundDetails.exit_load_unit == undefined
              ? 0
              : fundDetails.exit_load_unit,
          exit_free_unit:
            fundDetails.exit_free_unit == undefined
              ? "0"
              : fundDetails.exit_free_unit,
        },
      };

      var res = await fetchEncryptData(payload);
      if (res.error_code == "100") {
        setExitLoad(res.data.exitLoad);
        setApproxAmount(res.data.redeemAmount);
      } else if (res.error_code == "102") {
        setExitLoad(0);
        setApproxAmount(currAmount);
      }
    } catch (e) { }
  };

  useEffect(() => {
    if (lockInPeriod == 0) {
      getExitLoad();
    }
    //  else if (lockInPeriod > 0 && unlockedUnits > 0) {
    //   getExitLoad();
    // }
    else {
      setExitLoad(0);
      setApproxAmount(currAmount);
    }
  }, [showFintooTip === true, currAmount]);

  const addtoTransaction = async () => {
    var cart_id_from = cartIdRef.current.cart_id_from.toString();
    var cart_id_to = cartIdRef.current.cart_id_to.toString();
    var bankid = getprimarybank.bank_id;
    var folio_number = folioNumber;
    try {
      var payload = {
        from_data: {
          transaction_bank_id: bankid,
          transaction_user_id: getUserId(),
          transaction_cart_id: cart_id_from,
          transaction_folio_no: folio_number,
          trxn_type: "SO",
          data_belongs_to: DATA_BELONGS_TO,
          device_track: "Web"
        },
        to_data: {
          transaction_bank_id: bankid,
          transaction_user_id: getUserId(),
          transaction_cart_id: cart_id_to,
          trxn_type: "SI",
          data_belongs_to: DATA_BELONGS_TO,
          device_track: "Web"
        }
      };
      var response = await AddSwitchTransaction(payload);
      if (response.status_code * 1 === 200) {
        transactionIdRef.current = response.data;
        transactionId.current = response.data?.from_transaction_id
      }
    } catch (e) {
      console.log("SWITCH Error Transaction: ", e);
    }
  };

  const deleteCart = async () => {
    var cart_id_from = "" + cartIdRef.current.cart_id_from;
    var cart_id_to = "" + cartIdRef.current.cart_id_to;
    try {
      var payload = {
        method: "post",
        url: DMF_DELETE_SWP_STP_FROM_CART,
        data: {
          from_data: [
            {
              cart_id: cart_id_from,
            },
          ],
          to_data: [
            {
              cart_id: cart_id_to,
            },
          ],
        },
      };
      var res = await fetchEncryptData(payload);
    } catch (e) { }
  };

  const handleError = () => {
    if (schemedetails.scheme_code == undefined) {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Please Select Switch To Fund.", type: "error" },
      });
    } else if (currAmount == "") {
      dispatch({
        type: "RENDER_TOAST",
        payload: { message: "Please Enter Amount and Units.", type: "error" },
      });
    } else if (!redeemAll) {
      if (currAmount < schemedetails.lumpsum_minimum_amount) {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Amount entered is less than the Minimum Switch amount.",
            type: "error",
          },
        });
      } else {
        setStepCount(1);
        addToCart();
      }
    } else if (elssCheck) {
      if (elssText != "") {
        dispatch({
          type: "RENDER_TOAST",
          payload: {
            message: "Amount entered is not a multiple of 500.",
            type: "error",
          },
        });
      }
    } else {
      setStepCount(1);
      addToCart();
    }
  };

  const handleSwitchFromFund = (v) => {
    var getarray = detailedMfPotfolio.fund_list.find((obj) => {
      return obj.scheme_code === v;
    });

    setSelectedScheme(getarray);
    setFolioNumber(getarray.folio_no);
    setCurrentValue(getarray.curr_val);
    setAllUnits(getarray.units);
    setCurrentNav(getarray.curr_nav);
    setSchemeCode(getarray.scheme);
    localStorage.setItem("switch_from", getarray.scheme);

  };

  const handleSubmit = () => {
    if (currAmount != "" && units != "") {
      setBtnClick(true);
    } else {
      setBtnClick(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [currAmount, units]);

  const handlePrimaryBank = () => {
    var getarray1 = getuserbank.find((obj) => {
      return obj.bank_is_primary == 1;
    });

    setPrimaryBank(getarray1);
    setPrimaryBankId(getarray1.name);
  };

  const handleSwitchTofund = async (v) => {
    var getarray2 = getAmcCode.find((obj) => {
      localStorage.setItem("switch_to", v);
      return obj.scheme_name === v;
    });
    setSchemeDetails(getarray2);

    // new code
    if (openModalByName == "stp") {
      var stpMinInvestData = {
        scheme_code: getarray2.scheme_code,
        data_belongs_to: DATA_BELONGS_TO,
      };

      var stpMinInvest = {
        method: "POST",
        data: stpMinInvestData,
        url: DMF_MIN_INVESTMENT_STP_API_URL,
      };

      var stpInvRes = await fetchEncryptData(stpMinInvest);
      setMinInvestStp(stpInvRes.data);
      var stp_unit =
        parseFloat(fundDetails.curr_val) / parseFloat(getarray2.nav);
      setStpUnits(stp_unit.toFixed(3));
    }
  };

  const handleStpTofund = async (v) => {
    var getarray2 = getStpAmcCode.find((obj) => {
      localStorage.setItem("switch_to", v);
      return obj.scheme_name === v;
    });
    setSchemeDetails(getarray2);

    const fullCalendar = [...Array(31).keys()].map(i => i + 1);
    const availableDates = getarray2.stp_dates.split('|').map(num => parseInt(num, 10));
    const missingDates = fullCalendar.filter(date => !availableDates.includes(date));

    const currentYear = moment().year();
    let stpConvertedDates = [];
    for (let month = 0; month < 13; month++) {
      const monthDates = missingDates.map((day) =>
        moment().year(currentYear).month(month).date(day).valueOf()
      );
      stpConvertedDates = stpConvertedDates.concat(monthDates);
    }

    setStpHolidayList(stpConvertedDates);
    setMinInvestStp(getarray2.astp_in_min_installment_amt);
    setStpMultiAmt(getarray2.astp_multi_amt);

  };

  useEffect(() => {
    if (!manualOverride && Number(currAmount) > 0 && Number(currentValue) > 0) {
      localStorage.setItem('amount', currAmount);
      if (currentValue == currAmount) {
        setRedeemAll(true);
        setAllRedeemKey('Y');
      } else {
        setRedeemAll(false);
        setAllRedeemKey('N');
      }
    }
  }, [currentValue, currAmount]);


  const handleSwitchToggle = () => {
    const newValue = !redeemAll;

    setRedeemAll(newValue);
    setManualOverride(true);
    setAllRedeemKey(newValue ? 'Y' : 'N');
  };


  const handleAmountChange = (e) => {
    var txt = e.target.value;
    setDetailedMfPotfolio(prev => ({ ...prev, requestType: 'amount' }));
    if (txt.length > 1 && txt.charAt(0) == 0 && txt.charAt(1) == 0) {
      txt = txt.replace(/^0+/, "0");
      setSwpAmount(txt);
    }
    if (
      !isNaN(Number(txt)) === true &&
      (txt.indexOf(".") === -1 ||
        (txt.indexOf(".") > -1 && txt.split(".")[1].length < 3))
    ) {
      if (openModalByName == "redeem" || openModalByName == "switch") {
        setBtnClick(true);
        setValidAmount(true);
        setValidUnits(true);
      }

      if (openModalByName == "swp") {
        setCurrentSWPAmount(txt)
        setValidSwpAmount(true);
        const swpAmount = Number(txt);
        if (swpAmount < fundDetails.min_redemption_amt) {
          setWithdrawalPlanBtn(false);
          setValidSwpAmount(false);
          setSwpErrorText(
            "Minimum amount: ₹ " + fundDetails.min_redemption_amt
          );
        } else {
          setWithdrawalPlanBtn(true);
          setValidSwpAmount(true);
          setSwpErrorText("");
        }
      }

      if (txt < schemedetails.lumsump_minimum_amount && openModalByName != "stp") {
        if (openModalByName == "redeem" || openModalByName == "switch") {
          setCurrAmount(txt);
          setSwitchText(
            "Minimum amount: ₹ " + schemedetails.lumsump_minimum_amount
          );
          setValidAmount(false);
        }

        if (openModalByName == "swp") {
          if (txt <= fundDetails.curr_val) {
            setValidSwpAmount(true);
            setSwpErrorText("");
            setSwpAmount(txt);
          } else {
            setSwpErrorText("Maximum amount: ₹ " + fundDetails.curr_val);
            setValidSwpAmount(false);
          }
        }
      } else {
        if (openModalByName == "redeem" || openModalByName == "switch") {
          setCurrAmount(txt);
          setSwitchText("");
          // setValidAmount(true);
          if (openModalByName == "switch") {
            if (elssCheck) {
              if ((txt * 1) % 500 !== 0) {
                setSwitchText("");
                setElssText("Amount should be a multiple of 500.");
                setValidAmount(false);
                return;
              } else {
                setElssText("");
                setValidAmount(true);
              }
            }
          }
        }

        if (openModalByName == "swp") {
          setValidSwpAmount(true);
          setSwpUnits(
            Math.round(
              (parseFloat((txt / fundDetails.curr_nav) * 1) + Number.EPSILON) *
              1000
            ) / 1000
          );
        }
        if (openModalByName == "stp") {
          if (parseFloat(txt) < parseFloat(minInvestStp)) {
            setSwpErrorText("Min. amount: ₹ " + minInvestStp);
          } else if (parseFloat(txt) > fundDetails.curr_val) {
            setSwpErrorText("Available amount for STP: ₹ " + fundDetails.curr_val)
          } else {
            setSwpErrorText("");
            setStpUnits(
              Math.round((parseFloat(txt / fundDetails.curr_nav) + Number.EPSILON) * 1000) /
              1000
            )
          }

          setMonthlyRecurringStpAmount(
            Number(txt) > 0 && Number(noOfInstallment) > 0 ?
              (Number(txt) / Number(noOfInstallment)
              ).toFixed(3) : 0);

          // if (elssCheck) {
          //   if ((txt * 1) % stpMultiAmt !== 0) {
          //     setSwitchText("");
          //     setElssText("Amount should be a multiple of " + stpMultiAmt + ".");
          //     setValidAmount(false);
          //     return;
          //   } else {
          //     setElssText("");
          //     setValidAmount(true);
          //   }
          // }
          setCurrAmount(txt);
          setSwitchText(
            "Minimum amount: ₹ " + schemedetails.lumsump_minimum_amount
          );
          setValidAmount(false);
        }
      }

      if (txt > unlockedAmount) {
        if (
          openModalByName == "redeem" ||
          openModalByName == "switch" ||
          openModalByName == "stp"
        ) {
          setDefaultValuesAmount(false);
          setCurrAmount(currAmount);
          setUnits(units);
          setShowFintooTip(false);
          setBtnClick(false);
        }

        if (openModalByName == "swp") {
          setValidSwpAmount(false);
        }
      } else {
        if (
          openModalByName == "redeem" ||
          openModalByName == "switch" ||
          openModalByName == "stp"
        ) {
          setDefaultValuesAmount(true);
          setCurrAmount(txt);
          setUnits(
            Math.round((parseFloat(txt / currentNav) + Number.EPSILON) * 1000) /
            1000
          );
          setShowFintooTip(true);
          setBtnClick(true);
        }

        if (openModalByName == "swp") {
          setValidSwpAmount(true);
          setSwpAmount(txt);

          localStorage.setItem("amount", txt);

          setSwpUnits(
            Math.round(
              (parseFloat((txt / fundDetails.curr_nav) * 1) + Number.EPSILON) *
              1000
            ) / 1000
          );
        }
      }
      if (txt == "" || txt == 0) {
        if (openModalByName == "redeem" || openModalByName == "switch") {
          setShowFintooTip(false);
          setValidAmount(false);
        }

        if (openModalByName == "swp" || openModalByName == "stp") {
          setValidSwpAmount(false);
        }
      }
    }
  };

  const ValidateSwpButton = () => {
    if (validStartSwpDate && validEndSwpDate && validSwpAmount && (Number(currentSWPAmount) > Number(fundDetails.min_redemption_amt))) {
      setWithdrawalPlanBtn(true);
    }
  };

  const addCartSWP = async () => {
    var schemeCode = fundDetails.scheme_code;
    var amount = swpAmount.toString();
    try {
      var payload = {
        method: "post",
        url: DMF_ADD_TO_STPSWP_CART_NEW_API_URL,

        data: {
          cart_scheme_code: schemeCode,
          cart_amount: amount,
          units: swpUnits.toString(),
          user_id: getUserId(),
          cart_purchase_type: "7",
          cart_folio_no: fundDetails.folio_no,
          data_belongs_to: DATA_BELONGS_TO,
          perpetual_check: "N",
          start_date: moment(startDateSwp).format("YYYY-MM-DD"),
          end_date: moment(endDateSwp).format("YYYY-MM-DD"),
        },
      };

      var res = await fetchEncryptData(payload);
      let error_code = res.error_code;
      cartId.current = res.data.cart_id;
      if (error_code == "100") {
        setStepCount(1);
      } else {
        await deleteCartSWPAPI();
        addCartSWP();
      }
    } catch (e) {
      console.error("error - ", e);
    }
  };

  const addTransactionSwp = async () => {

    var schemeCode = fundDetails.scheme_code;
    var folio_number = fundDetails.folio_no;
    var cart_id = cartId.current.toString();

    try {
      var payload = {
        method: "post",
        url: DMF_ADD_TRANSACTION_API_URL,
        data: {
          transaction_cart_id: cart_id,
          transaction_bank_id: primaryBankId.toString(),
          cart_scheme_code: schemeCode,
          trxn_type: "RU",
          data_belongs_to: DATA_BELONGS_TO,
          transaction_user_id: getUserId(),
          transaction_folio_no: folio_number,
          device_track: "web"
        },
      };
      var res = await fetchEncryptData(payload);
      transactionId.current = res.data.transaction_id;

      if (res.error_code == "100") {
        setSwpTrxId(res.data);
        setStepCount(2);
      } else {
        console.error("error - ", res);
      }
    } catch (e) {
      console.error("error", e);
    }
  };

  useEffect(() => {
    ValidateSwpButton();
  }, [
    validStartSwpDate,
    validEndSwpDate,
    validSwpAmount,
    startDateSwp,
    endDateSwp,
    swpAmount,
  ]);

  const handleStartChange = (v) => {
    if (openModalByName === "swp") {
      setStartDateSwp(v);
      setValidStartSwpDate(true);
    }
    if (openModalByName === "stp") {

      setStartDateStp(moment(v).toDate());
    }
  };

  const handleEndChange = (v) => {
    if (openModalByName === "swp") {
      setEndDateSwp(v);
      setValidEndDate(true);
    }
    if (openModalByName === "stp") {
      setEndDateStp(moment(v).toDate());
    }
  };


  const handleUnitChange = (e) => {
    var txt = e.target.value;
    setDetailedMfPotfolio(prev => ({ ...prev, requestType: 'unit' }));
    if (txt.length > 1 && txt.charAt(0) == 0 && txt.charAt(1) == 0) {
      txt = txt.replace(/^0+/, "0");
    }
    if (
      !isNaN(Number(txt)) === true &&
      (txt.indexOf(".") === -1 ||
        (txt.indexOf(".") > -1 && txt.split(".")[1].length <= 3))
    ) {
      setValidUnits(true);
      setValidAmount(true);
      setBtnClick(true);
      if (txt > unlockedUnits) {
        setDefaultValuesUnits(false);
        setCurrAmount(currAmount);
        setUnits(units);
        setShowFintooTip(false);
        setBtnClick(false);
      } else {
        setDefaultValuesUnits(true);
        setUnits(txt);
        setCurrAmount(
          Math.round((parseFloat(txt * currentNav) + Number.EPSILON) * 100) /
          100
        );
        setShowFintooTip(true);
        setBtnClick(true);
      }
      if (txt == "" || txt == 0) {
        setShowFintooTip(false);
        setValidUnits(false);
      }
    }
  };

  const switchLogic = async () => {
    if (redeemAll == true) {
      setCurrAmount(unlockedAmount);
      setUnits(unlockedUnits);
      setShowFintooTip(true);
      setSwitchText("");
    } else {
      setShowFintooTip(false);
      setDefaultValuesAmount(true);
      setDefaultValuesUnits(true);
      setCurrAmount("");
      setUnits("");
      setValidAmount(true);
      setValidUnits(true);
    }
  };

  useEffect(() => {
    switchLogic();
  }, [redeemAll]);

  const myFunc = () => {
    if (
      "redemption_flag" in validatorFlags == false ||
      "swp_flag" in validatorFlags == false ||
      validatorFlags.redemption_flag == "N" ||
      validatorFlags.swp_flag == "N"
    ) {
      setDisable("custom-buttons disabled");
    } else {
      if (lockInPeriod > 0) {
        if (lockInPeriod > 0 && unlockedUnits > 0) {
          setDisable("custom-buttons");
        } else {
          setDisable("custom-buttons disabled");
        }
      } else {
        setDisable("custom-buttons");
      }
    }
  };

  useEffect(() => {
    myFunc();
  }, [fundDetails]);

  var stpStartDate = moment(startDateStp).format("YYYY-MM-DD");
  var stpEndDate = moment(endDateStp).format("YYYY-MM-DD");

  const handleChange = () => {
    if (profilePercentage === 100) {
      window.location.href = `/direct-mutual-fund/MutualFund/${fundDetails[0].scheme_code}?folio_no=${folio_no_append}`;
    } else {
      openModal();
    }
  };

  const redirect = () => {
    window.location.href =
      process.env.PUBLIC_URL + "/direct-mutual-fund/profile/dashboard";
  };

  // const linkUrl =
  //   profile.data.profile_status === 100
  //     ? `/web/direct-mutual-fund/MutualFund/${fundDetails.slug}?folio_no=${folio_no_append}`
  //     : null;

  function swpDates() {
    var today = moment();
    if (moment.duration(today.clone().format("HH:mm")).asHours() > 15) {
      today.add(1, "day");
    }
    if (today.day() == 6) {
      today.add(2, "days");
    }
    if (today.day() == 0) {
      today.add(1, "day");
    }
    setToday(today.toString());
    setTomorrow(today.clone().add(1, "day").toString());
  }

  const checkIsRegular = () => {
    try {
      return fundInnerTransactions[0]["fund_registrar"];
    } catch {
      return "";
    }
  };

  useEffect(() => {
    try {
      const checkIfAnySIPChecked = detailedMfPotfolio?.sip_stp_swp_data?.moreSIP.filter((v) => Boolean(v.checked));

      if (checkIfAnySIPChecked.length) {
        setOpenModalByName("stop");
        setStepCount(0);
      } else {

      }
    } catch {
      // dont do anything
    }

    try {
      const checkIfEditChecked = detailedMfPotfolio?.sip_stp_swp_data?.moreSIP.filter((v) =>
        Boolean(v.editsipchecked)
      );

      if (checkIfEditChecked.length) {
        // setDetailedMfPotfolio((prev) => ({
        //   ...prev,
        //   editSipNewData: {
        //     amount: checkIfEditChecked[0]["cart_amount"],
        //     sipDate: moment(checkIfEditChecked[0]["sip_start_date"], "YYYY-MM-DD").toDate(),
        //   },
        // }));
        setOpenModalByName("Edit_SIP");
        setStepCount(0);
      }
    } catch { }
  }, [detailedMfPotfolio?.sip_stp_swp_data?.moreSIP]);

  const onCloseSipModal = () => {
    setOpenModalByName("");
    setStepCount(0);
    setDetailedMfPotfolio((prev) => ({
      ...prev,
      sip_stp_swp_data: {
        ...prev.sip_stp_swp_data,
        moreSIP: prev.sip_stp_swp_data.moreSIP.map((x) => ({
          ...x,
          checked: false,
        })),
      },
    }));
  };

  const onCloseEditSipModal = () => {
    setOpenModalByName("");
    setStepCount(0);
    let ___a = detailedMfPotfolio;
    delete ___a.editSipNewData;
    ___a.sip_stp_swp_data.moreSIP = ___a.sip_stp_swp_data.moreSIP.map((x) => ({
      ...x,
      editsipchecked: false,
    }));
    setDetailedMfPotfolio({ ...___a });
  };
  var folio_no_append = btoa(fundDetails.folio_no);
  const getUserMandateList = async () => {
    try {

      var payload = {
        method: "post",
        url: DMF__USER_MANDATELIST_API_URL,
        data: { user_id: getUserId(), data_belongs_to: DATA_BELONGS_TO },
      };
      var res = await fetchEncryptData(payload);

      setUserMandateList(res.data.map((v) => ({ label: `${v.bank_name} ${maskBankAccNo(v.bank_acc_no)}`, value: v.mandate_id, bank_id: v.bank_id })));
    } catch (e) { }
  };

  const cancelSip = async () => {
    try {
      let transactionId = "";
      for (const x of detailedMfPotfolio?.sip_stp_swp_data?.moreSIP) {
        if (Boolean(x.editsipchecked)) {
          transactionId = '' + x.transaction_id;
          break;
        }
      }
      if (!transactionId) {
        throw "Unable to get transactionId";
      }
      // return;
      var payload = {
        user_id: getUserId(),
        trxn_id: transactionId,
        trans_code: "CXL",
        reason_code: "10",
        data_belongs_to: DATA_BELONGS_TO,
      };
      var res = await XsiporderEntry(payload)
      // var res = await fetchEncryptData(payload);
      if (res.status_code * 1 === 200) {
        // stopsipmail();
        // navigate(process.env.PUBLIC_URL + "/mutual-fund/PaymentSucess?a=StopSIP");
        payload = {
          url: CART_ADD_URL,
          data: {
            cart_scheme_code: detailedMfPotfolio.fund_details[0].scheme_code,
            cart_folio_no: detailedMfPotfolio.fund_details[0].folio_no,
            cart_amount: '' + detailedMfPotfolio.editSipNewData.amount,
            cart_tenure: '' + detailedMfPotfolio.editSipNewData.tenure,
            cart_sip_start_date: moment(detailedMfPotfolio.editSipNewData.sipDate).format('YYYY-MM-DD'),
            user_id: getUserId(),
            cart_purchase_type: "2",
            data_belongs_to: DATA_BELONGS_TO
          },
          method: 'post'
        }

        // res = await fetchEncryptData(payload);
        payload = {
          user_id: getUserId(),
          bank_id: '' + detailedMfPotfolio.editSipNewData.selectedMandate.bank_id,
          mandate_id: '' + detailedMfPotfolio.editSipNewData.selectedMandate.value,
          mandate_type: "N",
          payment_mode: "mandate",
          data_belongs_to: DATA_BELONGS_TO,
        };
        res = await PlaceOrder(payload);

      } else {
        navigate(process.env.PUBLIC_URL + "/direct-mutual-fund/PaymentFailed?a=StopSIP");
      }
    } catch (e) {
      console.log("catch :", e);
    }
  }

  const renderFundName = () => {
    try {
      return detailedMfPotfolio.fund_details[0].scheme;
    } catch {
      return "-";
    }
  }

  const handleAmountChanges = (e) => {
    let newValue = e.target.value;
    newValue = newValue.replace(/[^\d.]/g, "");
    setAmount(newValue);
  };

  const checkMaintenanceStatus = async (type) => {
    try {
      var config = {
        method: "get",
        url: CrmAPIEndPoints.MAINTENANCE_DETAILS
      };
      const maintenance_status = await axios(config);

      const dataArray = Array.isArray(maintenance_status?.data)
        ? maintenance_status.data
        : Array.isArray(maintenance_status?.data?.data)
          ? maintenance_status.data.data
          : [];

      const activeItem =
          dataArray.find(
            (item) =>
              item?.maintenance_for === type && Number(item?.is_active) === 1
          ) || {};

        return activeItem;
    } catch (e) {
      console.error("Error fetching maintenance status:", e);
      throw e; // Rethrow to indicate failure
    }
  };

  const handleInstallmentChange = (e) => {
    var installmentCount = e.target.value;
    if (!isNaN(installmentCount) && installmentCount.length <= schemedetails.astp_max_installment_number.length && Number(installmentCount) >= 0) {
      setNoOfInstallment(installmentCount ? Number(installmentCount) : "");
      setMonthlyRecurringStpAmount(
        Number(installmentCount) > 0 && Number(currAmount) > 0
          ? (Number(currAmount) / Number(installmentCount)).toFixed(3)
          : 0
      );
    }
  };


  const addStptoTransaction = async () => {
    var cart_id_from = cartIdRef.current.cart_id_from.toString();
    var cart_id_to = cartIdRef.current.cart_id_to.toString();
    var bankid = primaryBankId;
    var folio_number = fundDetails.folio_no;
    try {
      var payload = {
        method: "post",
        url: DMF_ADD_TO_SWP_STP_TRANSACTION_API_URL,
        data: {
          from_data: [
            {
              transaction_bank_id: bankid,
              transaction_user_id: getUserId(),
              transaction_cart_id: cart_id_from,
              transaction_folio_no: folio_number,
              trxn_type: "SOU",
              is_direct: "1",
              device_track: "web"
            },
          ],
          to_data: [
            {
              transaction_bank_id: bankid,
              transaction_user_id: getUserId(),
              transaction_cart_id: cart_id_to,
              // transaction_folio_no: folio_number, Enquire with monika and shiva
              trxn_type: "SIU",
              is_direct: "1",
              device_track: "web"
            },
          ],
        },
      };
      var res = await fetchEncryptData(payload);
      setStpTransactionId(res.data.transaction_id);
      transactionIdRef.current = res.data.transaction_id;
    } catch (e) { }
  };

  const addStpToCart = async () => {
    try {
      var toschemecode = schemedetails.scheme_code;
      var schemeCode = fundDetails.scheme_code;
      var amount = currAmount;
      localStorage.setItem("amount", amount);
      // var units = units;

      var payload = {
        method: "post",
        url: DMF_ADD_TO_STPSWP_CART_API_URL,
        data: {
          from_data: [
            {
              cart_scheme_code: schemeCode,
              cart_amount: amount,
              cart_units: "0",
              user_id: getUserId(),
              cart_purchase_type: "9",
              is_direct: "1",
              cart_sip_start_date: stpStartDate,
              no_of_installments: noOfInstallment
            },
          ],
          to_data: [
            {
              cart_scheme_code: toschemecode,
              cart_amount: amount,
              cart_units: "0",
              user_id: getUserId(),
              cart_purchase_type: "8",
              is_direct: "1",
              cart_sip_start_date: stpStartDate,
            },
          ],
        },
      };

      var res = await fetchEncryptData(payload);
      cartIdRef.current = res.data[0];
      if (res.error_code * 1 === 100) {
        addStptoTransaction();
      }
    } catch (e) { }
  };

  const handleTransferFund = () => {
    const selectedDate = new Date(startDateStp);
    const day = selectedDate.getDate();

    var minimumAmount = schemedetails.lumsump_minimum_amount;
    var minimumInstallmentCount = schemedetails.astp_min_installment_number;
    var maximumInstallmentCount = schemedetails.astp_max_installment_number;
    var stpAllowedDates = schemedetails.stp_dates?.split('|').map(num => parseInt(num, 10)) ?? [];
    var error_message = "";
    if (schemedetails == "") {
      error_message = "Please select scheme.";
    } else if (currAmount == "") {
      error_message = "Please enter amount.";
    } else if (Number(currAmount) < Number(minimumAmount)) {
      error_message = "The minimum amount to start an STP for this fund is " + minimumAmount;
    } else if (!stpAllowedDates.includes(day)) {
      error_message = "Selected date is not allowed for STP";
    } else if (noOfInstallment < minimumInstallmentCount) {
      error_message = "Minimum number of installment should be " + minimumInstallmentCount;
    } else if (noOfInstallment > maximumInstallmentCount) {
      error_message = "Maximum number of installment should be " + maximumInstallmentCount;
    }

    if (error_message != "") {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: error_message,
          type: "error",
          autoClose: 3000,
        },
      });
      return;
    } else {
      setStepCount(1);
    }
  }

  const handleSWPTransaction = () => {
    var error_message = "";
    if (Number(currentSWPAmount) < Number(fundDetails.min_redemption_amt)) {
      error_message = "The minimum amount to start an SWP for this fund is " + fundDetails.min_redemption_amt;
      setValidSwpAmount(false);
    }

    if (error_message != "") {
      dispatch({
        type: "RENDER_TOAST",
        payload: {
          message: error_message,
          type: "error",
          autoClose: 3000,
        },
      });
      return;
    } else {
      setStepCount(1);
      addCartSWP();
    }
  }

  const setBtnState = () => {
    if (!Array.isArray(memberData) || memberData.length === 0) return;
    if (!Array.isArray(fundDetails) || fundDetails.length === 0) return;

    const investorName = fundDetails[0]?.investor_name
      ?.toLowerCase()
      .trim();

    const isMinorInvestor =
      investorName && investorName.length > 0
        ? Boolean(
          memberData.find(
            (val) =>
              val?.name?.toLowerCase().trim() === investorName &&
              Number(val?.user_age) < 18
          )
        )
        : false;

    const isEcas = checkIsRegular() === "ecas";

    const isFamilyAccount =
      getItemLocal("family") === true ||
      getItemLocal("family") === "true";

    const shouldDisableButtons =
      isEcas || isMinorInvestor || isFamilyAccount;

    if (!shouldDisableButtons) return;

    // Disable buttons
    setinvestMoreBtnDisable("opt-buttons disabled");
    setinvestMoreBtnLinkDisable("custom-buttons disabled");
    setOperationsBtnsDisable(true);

    // Show message ONLY for minor
    if (isMinorInvestor) {
      setOperationsBtnMsg(
        "Online operations for minor accounts are currently unavailable. Kindly reach out to our support team for further assistance."
      );
    } else {
      // family / eCAS → no message
      setOperationsBtnMsg("");
    }
  };

  useEffect(() => {
    setBtnState();
  }, [memberData, fundDetails]);

  return (
    <PortfolioLayout>
      <div className="pt-4 ps-1 d-flex justify-content-between">
        {/* <div className={'d-flex align-items-center ',style={fontSize: '1.2rem', textAlign: 'right' }}></div> */}

        <Link
          className={"d-flex align-items-center " + style["back-bt"]}
          to={
            process.env.PUBLIC_URL +
            "/direct-mutual-fund/portfolio/dashboard?assetTabNumber=1"
          }
          style={{
            paddingRight: 20,
          }}
        >
          <img
            style={{
              transform: "rotate(180deg)",
            }}
            width={20}
            height={20}
            src={process.env.REACT_APP_STATIC_URL + "/media/icons/chevron.svg"}
          />
          <p className="ps-2 mb-0" style={{ fontSize: "1.2rem" }}>
            Back
          </p>
        </Link>
        <p
          className="mb-0"
          style={{
            fontSize: "1.2rem",
            textAlign: "right",
            transform: "translateX(-0.4cm)",
          }}
        >
          {summaryPortfolio && fundDetails?.length > 0 && (
            <b>{"Investor: " + fundDetails[0].investor_name}</b>
          )}

        </p>
      </div>
      {/* <div className="ps-2 mb-0" style={{fontSize: '1.2rem',alignItems: 'left', textAlign: 'right' }}><p>{"Investment for:"+" "+ fundDetails.name}</p></div> */}
      <div className="Border m-1">
        <div className="row m-1">
          <div className="col-12 col-md-8">
            <div className="d-flex">
              {fundDetails?.[0]?.amc_code && (
                <div className="fund-logo">
                  {isLoading && <FintooLogoLoader isLoading={true} />}
                  <img
                    src={`${process.env.REACT_APP_STATIC_URL}/media/companyicons/${fundDetails[0].amc_code}.png`}
                    style={{ display: isLoading ? "none" : "block" }}
                    onLoad={() => setIsLoading(false)}
                    onError={(e) => {
                      setIsLoading(false);
                      e.target.src = `${process.env.PUBLIC_URL}/static/media/companyicons/amc_icon.png`;
                    }}
                    alt="AMC Logo"
                  />
                </div>
              )}
              <div>
                <div className="fund-name h5 pb-0 pb-md-3">

                  {fundDetails.length > 0 && fundDetails[0] ? (
                    fundDetails[0].scheme_type === "regular" ? (
                      fundDetails[0].scheme
                    ) : (
                      <Link to={`/direct-mutual-fund/MutualFund/${fundDetails[0].scheme_code}`}>
                        {fundDetails[0].scheme}
                      </Link>
                    )
                  ) : (null)}

                </div>
                <div className="d-none d-md-flex fd-small-dt">
                  <p>{fundDetails.length > 0 && fundDetails[0] ? (
                    fundDetails[0].fintoo_fund_type
                  ) : null}</p>
                  <p>
                    {fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].scheme_risk_value) : null} {fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].fintoo_fund_type) : null}
                  </p>
                  <p className="bottom-starrating-container">
                    <p>
                      Star Rating :{fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].star_rating) : null}
                      <FaStar style={{ color: "#FFBF00" }} />
                    </p>
                  </p>
                  <p>Folio No.: {fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].folio_no) : null}</p>
                  <p>NAV: {fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].curr_nav) : null}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 d-md-block">
            <div
              className={investMoreBtnDisable}
            >
              <Link
                className={investMoreBtnLinkDisable}
                // to={`/web/direct-mutual-fund/MutualFund/${fundDetails.slug}?folio_no=${folio_no_append}`}
                onClick={() => handleChange()}
              // to={profile.data.profile_status === 100 ? `/web/direct-mutual-fund/MutualFund/${fundDetails.slug}?folio_no=${folio_no_append}` : openModal()}
              >
                <strong>Invest More</strong>
              </Link>
              {(detailedMfPotfolio?.fund_list ?? []).length > 0 ? (
                <div className={disable}>
                  <div>
                    <strong>Redeem</strong>
                  </div>
                  <div className="redeem-box-fn abs-22">
                    <div className=" fn-btn-redeem">
                      <div
                        onClick={async () => {
                          const isMaintenanceDown = await checkMaintenanceStatus('maintenance');
                          if (Object.keys(isMaintenanceDown).length > 0) {
                            Swal.fire(isMaintenanceDown.description);
                          } else {
                            if (profilePercentage === 100) {
                              setOpenModalByName("redeem");
                              setStepCount(0);
                              setValidAmount(true);
                              setValidUnits(true);
                              setDefaultValuesAmount(true);
                              setDefaultValuesUnits(true);
                              setBtnClick(false);
                              handlePrimaryBank();
                            } else {
                              openModal();
                            }
                          }
                        }}
                        className={
                          "redemption_flag" in validatorFlags === false ||
                            validatorFlags.redemption_flag === "N" || operationsBtnsDisable
                            ? "disabled"
                            : ""
                        }
                      >
                        Redeem
                      </div>


                      <div
                        onClick={async () => {
                          const isMaintenanceDown = await checkMaintenanceStatus('maintenance');
                          if (Object.keys(isMaintenanceDown).length > 0) {
                            Swal.fire(isMaintenanceDown.description);
                          } else {
                            if (profilePercentage === 100) {
                              setOpenModalByName("swp");
                              setStepCount(0);
                              swpDates();
                            } else {
                              openModal();
                            }
                          }
                        }}
                        className={
                          "swp_flag" in validatorFlags === false ||
                            validatorFlags.swp_flag === "N" || operationsBtnsDisable
                            ? "disabled"
                            : ""
                        }
                      >
                        SWP
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="custom-buttons">
                  <div>Loading...</div>
                </div>
              )}

              {(detailedMfPotfolio?.fund_list ?? []).length > 0 ? (
                <div className={disable}>
                  <div>
                    <strong>Switch</strong>
                  </div>
                  <div className="redeem-box-fn">
                    <div className=" fn-btn-redeem">
                      <div
                        onClick={async () => {
                          if (profilePercentage === 100) {
                            setOpenModalByName("switch");
                            setStepCount(0);
                            handlePrimaryBank();
                          } else {
                            const isMaintenanceDown = await checkMaintenanceStatus('maintenance');
                            if (Object.keys(isMaintenanceDown).length > 0) {
                              Swal.fire(isMaintenanceDown.description);
                            } else {
                              if (profilePercentage === 100) {
                                setOpenModalByName("switch");
                                setStepCount(0);
                                swpDates();
                              } else {
                                openModal();
                              }
                            }
                          }
                        }}
                        className={
                          "switch_flag" in validatorFlags === false ||
                            (validatorFlags.switch_flag === "N" &&
                              validatorFlags.redemption_flag === "N") || operationsBtnsDisable
                            ? "disabled"
                            : ""
                        }
                        // className={getUserId() === "e2hjij2gef" ? "" : "disabled"}
                      >
                        Switch
                      </div>
                      <div
                        onClick={async () => {
                          const isMaintenanceDown = await checkMaintenanceStatus('maintenance');
                          if (Object.keys(isMaintenanceDown).length > 0) {
                            Swal.fire(isMaintenanceDown.description);
                          } else {
                            localStorage.removeItem("switch_to");
                            if (profile.data.profile_status === 100) {
                              setOpenModalByName("stp");
                              setStepCount(0);
                            } else {
                              openModal();
                            }
                          }
                        }}
                        className={
                          "stp_flag" in validatorFlags === false ||
                            validatorFlags.stp_flag === "N" || operationsBtnsDisable
                            ? "disabled"
                            : ""
                        }
                      >
                        STP
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="custom-buttons">
                  <div>Loading...</div>
                </div>
              )}

              <div className="position-relative pointer bx-stopsip-18">
                <FaEllipsisV color={"grey"} />
                <div className="position-absolute bx-stopsip">
                  <div className="in-bx-stopsip">
                    <div
                      onClick={async () => {
                        const isMaintenanceDown = await checkMaintenanceStatus('maintenance');
                        if (Object.keys(isMaintenanceDown).length > 0) {
                          Swal.fire(isMaintenanceDown.description);
                        } else {
                          if (stopSipLogic) {
                            setOpenModalByName("stop");
                          } else {
                            failAlert();
                          }
                          setStepCount(0);
                        }
                      }}
                      className={
                        fundDetails.inv_type === "SIP" && fundDetails.sip_status === "Active"
                          ? ""
                          : "disabled"
                      }
                    >
                      <div>Stop SIP</div>
                    </div>

                    <div
                      onClick={() => {
                        setOpenModalByName("stop_stp");
                        setStepCount(0);
                      }}
                    >
                      <div>Stop STP</div>
                    </div>
                    <div
                      onClick={() => {
                        setOpenModalByName("stop_swp");
                        setStepCount(0);
                      }}
                    >
                      <div>Stop SWP</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {operationsBtnMsg && (
              <p style={{ color: "red" }}>
                {operationsBtnMsg}
              </p>
            )}
          </div>
          <div className="d-block d-md-none mobile-bottom-btns">
            <div className="bottom-buttons-list">
              <div>
                <button
                  onClick={() => {
                    setOpenModalByName("invest");
                    setStepCount(0);
                  }}
                >
                  Invest
                </button>
              </div>
              <div>
                <button onClick={() => setOpenBottomModalByName("redeem")}>
                  Redeem
                </button>
              </div>
              <div>
                <button onClick={() => setOpenBottomModalByName("switch")}>
                  Switch
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setOpenModalByName("stop");
                    setStepCount(0);
                  }}
                >
                  Stop SIP
                </button>
              </div>
            </div>
          </div>
        </div>

        <Modal
          show={openBottomModalByName.length > 0}
          className="bottom-modal"
          onHide={() => setOpenBottomModalByName("")}
        >
          <Modal.Body className="noselect">
            <div className="py-3"></div>
            {openBottomModalByName == "redeem" && (
              <>
                <div
                  className="py-3 px-3 d-flex align-items-center"
                  onClick={() => {
                    setOpenModalByName("redeem");
                    setStepCount(0);
                  }}
                >
                  <div>
                    <PiggybankIcon
                      fill="#042b62"
                      width={"40px"}
                      height={"40px"}
                      className="pe-2"
                    />
                  </div>
                  <div>
                    <strong>Redeem</strong>
                  </div>
                </div>
                <div
                  className="py-3 px-3 d-flex align-items-center"
                  onClick={() => {
                    setOpenModalByName("swp");
                    setStepCount(0);
                  }}
                >
                  <div>
                    <PiggybankIcon
                      fill="#042b62"
                      width={"40px"}
                      height={"40px"}
                      className="pe-2"
                    />
                  </div>
                  <div>
                    <strong>SWP</strong>
                  </div>
                </div>
              </>
            )}
            {openBottomModalByName == "switch" && (
              <>
                <div
                  className="py-3 px-3 d-flex align-items-center"
                  onClick={() => {
                    setOpenModalByName("switch");
                    setStepCount(0);
                  }}
                >
                  <div>
                    <PiggybankIcon
                      fill="#042b62"
                      width={"40px"}
                      height={"40px"}
                      className="pe-2"
                    />
                  </div>
                  <div>
                    <strong>Switch </strong>
                  </div>
                </div>
                <div
                  className="py-3 px-3 d-flex align-items-center"
                  onClick={() => {
                    setOpenModalByName("stp");
                    setStepCount(0);
                  }}
                >
                  <div>
                    <PiggybankIcon
                      fill="#042b62"
                      width={"40px"}
                      height={"40px"}
                      className="pe-2"
                    />
                  </div>
                  <div>
                    <strong>STP</strong>
                  </div>
                </div>
              </>
            )}
            {openBottomModalByName == "invest" && (
              <>
                <div className="d-flex">
                  <div className="w-50 text-center">SIP</div>
                  <div className="w-50 text-center">Lumpsum</div>
                </div>
                <div className="d-flex py-4">
                  <div className="pe-2">₹</div>
                  <div className="flex-grow-1">
                    <input className="bottom-border-input w-100" />
                  </div>
                </div>
                <div className="d-flex blue-btn-box">
                  <div
                    className="blue-btn-box switch-fund-btn w-50 text-center py-2 active"
                    onClick={() => {
                      setStepCount(1);
                    }}
                  >
                    Invest Now
                  </div>
                  <div
                    className="blue-btn-box switch-fund-btn w-50 text-center py-2"
                    onClick={() => {
                      setStepCount(1);
                    }}
                  >
                    Add to cart
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>

        {/* <hr className="fund-dt-sep mt-2 mt-md-4 ps-2 ps-md-4" /> */}

        <div className="d-none d-md-block mt-4">
          <div className="row  m-1">
            <div className="col-8">
              <div className="cntResults ps-4">
                <div className="cntRItems">
                  <div className="borderSpace">Invested</div>
                  <div className={`borderSpace borderText`}>
                    {fundDetails.length > 0 && fundDetails[0] ? (indianRupeeFormat(fundDetails[0].inv)) : null}
                  </div>
                </div>
                <div className="cntRItems">
                  <div className="borderSpace">AVG NAV</div>
                  <div className={`borderSpace borderText`}>
                    {fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].avg_nav) : null}
                  </div>
                </div>
                <div className="cntRItems">
                  <div className="borderSpace">Units</div>
                  <div className={`borderSpace borderText`}>
                    {fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].units) : null}
                  </div>
                </div>
                <div className="cntRItems">
                  <div className="borderSpace">Current Value</div>
                  <div className={`borderSpace borderText`}>
                    {fundDetails.length > 0 && fundDetails[0] ? (indianRupeeFormat(fundDetails[0].curr_val)) : null}
                  </div>
                </div>
                <div className="cntRItems">
                  <div className="borderSpace">Returns</div>
                  <div className={`borderSpace borderText`}>
                    {fundDetails.length > 0 && fundDetails[0] ? (indianRupeeFormat(fundDetails[0].gain_loss)) : null}
                  </div>
                </div>
                <div
                  className="cntRItems pointer"
                  onClick={() => {
                    setReturnsType((v) => (v == "xirr" ? "absolute" : "xirr"));
                  }}
                >
                  <div className="borderSpace align-items-center d-flex">
                    <div className="pe-2 returns-txt">
                      {returnsType == "xirr" ? "XIRR" : "Absolute"}&nbsp;%
                    </div>
                    <DownArrow width={"12px"} height={"12px"} />
                  </div>
                  <div className={`borderSpace borderText`}>
                    {returnsType == "xirr" && (
                      <p
                        className={`valueBoxPercentage ${(fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].xirr_percentage) : 0) * 1 < 0 ? "red" : "green"}`}
                      >
                        <span>{fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].xirr_percentage) : null}</span>
                        <FaLongArrowAltUp />
                      </p>
                    )}
                    {/* {fundDetails.xirr_percentage * 1 > 0 ? "+" : "-"} */}
                    {returnsType == "absolute" && (
                      <p
                        className={`valueBoxPercentage ${(fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].abs_return_percentage) : null) * 1 < 0
                          ? "red"
                          : "green"
                          }`}
                      >
                        <span>{fundDetails.length > 0 && fundDetails[0] ? (fundDetails[0].abs_return_percentage) : null}</span>
                        <FaLongArrowAltUp />
                      </p>
                    )}
                    {/* {fundDetails.xirr_percentage * 1 > 0 ? "+" : "-"} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-block d-md-none mt-4">
          <div className="row ">
            <div className="col-4 p-3">
              <div className="borderSpace">Invested</div>
              <div className={`borderSpace borderText`}>
                <strong>
                  {fundDetails.length > 0 && fundDetails[0] ? (indianRupeeFormat(fundDetails[0].inv)) : null}
                </strong>
              </div>
            </div>
            <div className="col-4 p-3">
              <div className="borderSpace">AVG NAV</div>
              <div className={`borderSpace borderText`}>
                <strong>{fundDetails.length > 0 && fundDetails[0] ? fundDetails[0].avg_nav : null}</strong>
              </div>
            </div>
            <div className="col-4 p-3">
              <div className="borderSpace">Units</div>
              <div className={`borderSpace borderText`}>
                <strong>{fundDetails.length > 0 && fundDetails[0] ? fundDetails[0].units : null}</strong>
              </div>
            </div>
            <div className="col-4 p-3">
              <div className="borderSpace">Current</div>
              <div className={`borderSpace borderText`}>
                <strong>
                  {fundDetails.length > 0 && fundDetails[0] ? indianRupeeFormat(fundDetails[0].curr_val) : null}
                </strong>
              </div>
            </div>
            <div className="col-4 p-3">
              <div className="borderSpace">Returns</div>
              <div className={`borderSpace borderText`}>
                <strong>
                  {fundDetails.length > 0 && fundDetails[0] ? indianRupeeFormat(fundDetails[0].gain_loss) : null}
                </strong>
              </div>
            </div>
            <div
              className="col-4 p-3"
              onClick={() => {
                setReturnsType((v) => (v == "xirr" ? "absolute" : "xirr"));
              }}
            >
              <div className="borderSpace align-items-center d-flex">
                <div className="pe-2 returns-txt">
                  {returnsType == "xirr" ? "XIRR" : "Absolute"}&nbsp;%
                </div>
                <DownArrow width={"12px"} height={"12px"} />
              </div>
              <div className={`borderSpace borderText`}>
                {returnsType == "xirr" && (
                  <p className="valueBoxPercentage red">
                    <span>-18.92%</span>
                    <FaLongArrowAltUp />
                  </p>
                )}
                {returnsType == "absolute" && (
                  <p className="valueBoxPercentage green">
                    <span>+78.77%</span>
                    <FaLongArrowAltUp />
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p style={{ height: ".5rem" }}></p>

      <div className="row">
        <div className={`col-12`}>
          <div className="insideTabBox">
            <div className="insideTab">
              <div
                onClick={() => {
                  setTabSelection("Transaction");
                }}
                className={`pointer ${tabSelection == "Transaction" ? "active" : ""
                  }`}
              >
                <p className="d-flex align-items-center">
                  <span>
                    {tabSelection == "Transaction" ? (
                      <>
                        <img
                          className="img-fluid SucessImg"
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/piggy_bank_White.png"
                          }
                          alt="Transaction"
                          srcset=""
                          width={30}
                        />
                      </>
                    ) : (
                      <>
                        <img
                          className="img-fluid SucessImg"
                          src={
                            process.env.REACT_APP_STATIC_URL +
                            "media/DMF/piggy_bank.svg"
                          }
                          alt="Transaction"
                          srcset=""
                          width={30}
                        />
                      </>
                    )}
                  </span>
                  <span className="ps-2">
                    <strong>Transaction</strong>
                  </span>
                </p>
              </div>
              {fundInnerTransactions.filter((v) => v.inv_type === "SIP")
                .length > 0 && (
                  <div
                    onClick={() => {
                      setTabSelection("SIP_Info");
                    }}
                    className={`pointer ${tabSelection == "SIP_Info" ? "active" : ""}`}
                  >
                    <p className="d-flex align-items-center">
                      <span>
                        {tabSelection == "SIP_Info" ? (
                          <>
                            <img
                              className="img-fluid SucessImg"
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "media/DMF/SIP_Info_White.png"
                              }
                              alt="SIP Info"
                              srcset=""
                              width={30}
                            />
                          </>
                        ) : (
                          <>
                            <img
                              className="img-fluid SucessImg"
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "media/DMF/SIP_Info.svg"
                              }
                              alt="SIP Info"
                              srcset=""
                              width={30}
                            />
                          </>
                        )}
                      </span>
                      <span className="ps-2">
                        <strong>SIP Info</strong>
                      </span>
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="insideTabContent">
            <div className="ptTableBx p-2 p-md-4">
              {tabSelection == "Transaction" && (
                <div>
                  <Table responsive className="trx-tbl8">
                    <thead>
                      <tr>
                        <th scope="col" className="eq-24">
                          Date
                        </th>
                        <th scope="col" className="eq-23">
                          Amount
                        </th>
                        <th scope="col" className="eq-23">
                          AVG NAV
                        </th>
                        <th scope="col" className="eq-23">
                          Transaction Type
                        </th>
                        <th scope="col" className="">
                          Units
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fundInnerTransactions.map((item) => (
                        <tr key={item}>
                          <td scope="row" data-label="Date">
                            {moment(item.trad_date).format("DD-MM-YYYY")}
                          </td>
                          <td scope="row" data-label="Amount">
                            {indianRupeeFormat(item.inv)}
                          </td>
                          <td scope="row" data-label="AVG NAV">
                            {item.pur_price}
                          </td>
                          <td scope="row" data-label="Transaction Type">
                            {item.inv_type}
                          </td>
                          <td scope="row" data-label="Units">
                            {item.units}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              {tabSelection == "SIP_Info" && (
                <div>
                  <StopSipSelectionModal
                    detailedMfPotfolio={detailedMfPotfolio}
                    setDetailedMfPotfolio={setDetailedMfPotfolio}
                    setOpenModalByName={setOpenModalByName}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        backdrop="static"
        show={openModalByName == "invest"}
        className="white-modal fn-redeem-modal"
        onHide={() => {
          setOpenModalByName("");
        }}
      >
        <>
          <Modal.Header className="py-3">
            <FintooBackButton
              onClick={() => {
                setOpenModalByName("");
                setStepCount(0);
              }}
            />
            <div className="modal-title">Invest</div>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div>
                <div className="py-3 px-md-4 grey-color">
                  <div className="d-flex">
                    <div className="w-100 pe-2">
                      <div>Amount</div>
                      <div className="d-flex">
                        <div className="pe-2">₹</div>
                        <div className="flex-grow-1">
                          <input className="bottom-border-input w-100" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 d-flex text-center white-modal-btn-box mobile-bottom-button">
                  <div
                    className="w-50 cancel"
                    onClick={() => setOpenModalByName("")}
                  >
                    Cancel
                  </div>
                  <div className="w-50 yes" onClick={() => alert("Invest")}>
                    Proceed
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        </>
      </Modal>

      <Modal
        backdrop="static"
        show={openModalByName == "switch"}
        className="white-modal fn-redeem-modal"
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);
          setElssText("");
          setSwitchText("");
          setCurrAmount("");
          setUnits("");
        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setOpenModalByName("");
                  setStepCount(0);
                  setCurrAmount("");
                  setUnits("");
                  setManualOverride(false);
                  setRedeemAll(false)
                  setAllRedeemKey('N')
                }}
              />
              <div className="modal-title">Switch Funds</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item grey-color border-top-0">
                        <FintooLongDropdownSecond
                          label="Switch From "
                          defaultValue={fundDetails?.[0]?.scheme_code}
                          value={detailedMfPotfolio}
                          onChange={(v) => handleSwitchFromFund(v)}
                        />
                      </div>

                      <div className="modal-whitepopup-box-item grey-color">
                        <div className="px-md-4">
                          <div className="d-flex">
                            <div className="w-33">
                              <div>Folio</div>
                              <div>
                                <strong>{folioNumber}</strong>
                              </div>
                            </div>
                            <div className="w-33">
                              <div>Value</div>
                              <div>
                                <strong>₹ {currentValue}</strong>
                              </div>
                            </div>
                            <div className="w-33">
                              <div>Units</div>
                              <div>
                                <strong>{allUnits}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-whitepopup-box-item grey-color">
                        {getAmcCode.length > 1 ? (
                          <FintooLongDropdown
                            label="Switch To"
                            value={getAmcCode}
                            onChange={(v) => handleSwitchTofund(v)}
                            isElss={(x) => setElssCheck(x)}
                          />
                        ) : (
                          <div className="px-md-4 ">
                            <div>Switch To</div>
                            <div
                              style={{ height: "2rem" }}
                              className="w-100 shine"
                            ></div>
                          </div>
                        )}
                      </div>

                      <div className="py-3 px-md-4 grey-color modal-whitepopup-box-item">
                        <div className="d-flex">
                          <div className="w-50 pe-2">
                            <div>Amount </div>
                            <div className="d-flex">
                              <div className=" rs-beside-textbox">₹</div>
                              <input
                                type="text"
                                disabled={redeemAll}
                                value={currAmount}
                                className="bottom-border-input w-100"
                                // onChange = {(e)=>setTotalAmount(e.key.value)}
                                onChange={(e) => handleAmountChange(e)}
                                step="any"
                              />
                            </div>

                            {validAmount ? (
                              <> </>
                            ) : (
                              <p className="red-color">
                                {" "}
                                {switchText + elssText}{" "}
                              </p>
                            )}

                            {defaultValuesAmount ? (
                              <> </>
                            ) : (
                              <p className="red-color">
                                Available amount for switch: ₹{unlockedAmount}
                              </p>
                            )}
                          </div>
                          <div className={`w-50 ps-2`}>
                            <div>Units</div>
                            <div className="d-flex">
                              <div className=" rs-beside-textbox">
                                <img
                                  width={"17px"}
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "media/DMF/graph_887.png"
                                  }
                                />
                              </div>
                              <input
                                type="text"
                                disabled={redeemAll}
                                value={units}
                                className="bottom-border-input w-100"
                                // onChange={(e) => setTotalUnits(e.target.value)}
                                onChange={(e) => handleUnitChange(e)}
                              />
                            </div>
                            <p className="red-color">
                              Available units for switch: {unlockedUnits}
                            </p>
                            {defaultValuesUnits ? (
                              <> </>
                            ) : (
                              <p className="red-color">
                                Available units for switch: {unlockedUnits}
                              </p>
                            )}
                            {validUnits ? (
                              <> </>
                            ) : (
                              <p className="red-color"> Invalid Units </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grey-color py-4 px-md-4">
                        <div className="d-flex align-items-end justify-content-between">
                          <div className="d-flex align-items-center">
                            <div>Switch All Units?</div>
                            <div className="d-flex align-items-center ps-3">
                              <Switch
                                onChange={handleSwitchToggle}
                                checked={redeemAll}
                                className="react-switch"
                                onColor="#C8C8C8"
                                offColor="#C8C8C8"
                                height={20}
                                width={55}
                                uncheckedIcon={
                                  <div className="switch-lbl">No</div>
                                }
                                checkedIcon={
                                  <div className="switch-lbl">
                                    &nbsp;&nbsp;Yes
                                  </div>
                                }
                              />
                            </div>
                          </div>

                          <div
                            className="pointer align-items-end d-flex fn-tip-box"
                            onClick={() => setShowFintooTip((v) => !v)}
                          >
                            <img
                              width="40px"
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "media/DMF/idea-8.png"
                              }
                            />
                            <div className="d-flex align-items-center">
                              <div className="fn-fintootip">Fintoo Tip</div>
                              {showFintooTip && <FaAngleDown />}
                              {showFintooTip == false && <FaAngleRight />}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`py-4 px-4 mx-1 my-5 my-lg-2 gain-tip-here ${showFintooTip ? "" : "d-none"
                          }`}
                      >
                        <p className="m-0 h5">
                          <strong>Exit Load</strong>
                        </p>
                        <p>
                          If an exit load is applicable to the fund, it will be reflected in the redemption amount.
                          {/* The exit load applicable on this switch will be - Rs.{" "}
                          {exitLoad} and you will switch approximately - Rs.{" "}
                          {approxAmount} as per today. */}
                          {/* {exitLoadData
                          ? exitLoadData
                              .replace("0.0000%", "Nil")
                              .replace("after 0 Years", "")
                              .replace("after 0 Days", "")
                          : "-"} */}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <div
                      className="switch-fund-btn mobile-bottom-button"
                      onClick={() => {
                        // setStepCount(1);
                        handleError();
                      }}
                    >
                      Switch Fund
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 1 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setOpenModalByName("");
                  setStepCount(0);
                  deleteCart();
                  setSchemeDetails("");
                  setCurrAmount("");
                  setUnits("");
                  setManualOverride(false);
                  setRedeemAll(false)
                  setAllRedeemKey('N')
                }}
              />
              <div className="modal-title">Confirm Switch</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  <div className="modal-whitepopup-box-item grey-color border-top-0">
                    <div className="px-md-4">
                      <div class="">Switch From</div>
                      <div>
                        <p className="lbl-title">
                          <strong>{schemeCode}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-whitepopup-box-item grey-color">
                    <div className="px-md-4">
                      <div className="d-flex">
                        <div className="w-33">
                          <div>Folio</div>
                          <div>{folioNumber}</div>
                        </div>
                        <div className="w-33">
                          <div>Value</div>
                          <div>₹ {currAmount}</div>
                        </div>
                        <div className="w-33">
                          <div>Units</div>
                          <div>{units}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-md-4 grey-color modal-whitepopup-box-item">
                    <div>Switch To</div>
                    <div className="textfont">
                      <strong>{schemedetails.scheme_name}</strong>
                    </div>
                  </div>

                  <div className="px-md-4 grey-color modal-whitepopup-box-item">
                    <div className="d-flex">
                      <div className="w-50 pe-2">
                        <div>Amount</div>
                        <div className="d-flex">
                          <div className="pe-2">₹</div>
                          <div className="flex-grow-1">{currAmount}</div>
                        </div>
                      </div>
                      <div
                        className={`w-50 ps-2 ${redeemAll ? "invisible" : ""}`}
                      >
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            Switch orders once placed cannot be cancelled or
                            modified.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'red', fontSize: "1.3rem" }}>{allRedeemKey == 'Y' && <>Are you sure you want to switch <b>all your units?</b> </>} </p>
                  <div className="pt-4 d-flex text-center white-modal-btn-box mobile-bottom-button">
                    <div
                      className="w-50 cancel"
                      onClick={() => setStepCount(0)}
                    >
                      Cancel
                    </div>
                    <div
                      className="w-50 yes"
                      onClick={() => {
                        setStepCount(2);
                        // switchFund();
                      }}
                    >
                      Yes Proceed
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 2 && (
          <PortfolioOtpModal
            detailedMfPotfolio={detailedMfPotfolio}
            transaction_id={transactionId}
            transaction_id_ref={transactionIdRef}
            onBack={() => setStepCount(0)}
            onSubmit={() => {
              setOpenModalByName("");
              setStepCount(0);
            }}
            label={"Switch Fund"}
            value={[fundDetails]}
          />
        )}
      </Modal>

      <Modal
        backdrop="static"
        show={openModalByName == "redeem"}
        className="white-modal fn-redeem-modal"
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);
        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setOpenModalByName("");
                  setStepCount(0);
                  setManualOverride(false);
                  setRedeemAll(false)
                  setAllRedeemKey('N')
                  setShowFintooTip(false);
                  setCurrAmount("");
                  setUnits("");
                }}
              />
              <div className="modal-title">Redeem Fund</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item grey-color border-top-0">
                        <FintooLongDropdownSecond
                          label="Redeem Fund"
                          defaultValue={fundDetails?.[0]?.scheme_code || ""}
                          value={summaryPortfolio}
                          onChange={(v) => handleSwitchFromFund(v)}
                        />
                      </div>

                      <div className="modal-whitepopup-box-item grey-color">
                        <div className="px-md-4">
                          <div className="d-flex rw-8-f">
                            <div className="w-33 cl-8-f">
                              <div>Folio</div>
                              <div>
                                <strong>{folioNumber}</strong>
                              </div>
                            </div>
                            <div className="w-33 cl-8-f">
                              <div>Value</div>
                              <div>
                                <strong>₹ {currentValue}</strong>
                              </div>
                            </div>
                            <div className="w-33 cl-8-f">
                              <div>Units</div>
                              <div>
                                <strong>{allUnits}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-4 px-md-4 grey-color">
                        <div className="d-flex">
                          <div className="w-50 pe-2">
                            <div>Amount </div>
                            <div className="d-flex">
                              <div className=" rs-beside-textbox">₹</div>
                              <input
                                type="text"
                                disabled={redeemAll}
                                value={currAmount}
                                className="bottom-border-input w-100"
                                // onChange = {(e)=>setTotalAmount(e.key.value)}
                                onChange={(e) => handleAmountChange(e)}
                                step="any"
                              />
                            </div>
                            {validAmount ? (
                              <> </>
                            ) : (
                              <p className="red-color"> Invalid Amount </p>
                            )}

                            {defaultValuesAmount ? (
                              <> </>
                            ) : (
                              <p className="red-color">
                                Available amount for redemption: ₹
                                {unlockedAmount}
                              </p>
                            )}
                          </div>
                          <div className={`w-50 ps-2`}>
                            <div>Units</div>
                            <div className="d-flex">
                              <div className=" rs-beside-textbox">
                                <img
                                  src={
                                    process.env.REACT_APP_STATIC_URL +
                                    "media/DMF/graph_887.png"
                                  }
                                  width={"17px"}
                                />
                              </div>
                              <input
                                type="text"
                                disabled={redeemAll}
                                value={units}
                                className="bottom-border-input w-100"
                                // onChange={(e) => setTotalUnits(e.target.value)}
                                onChange={(e) => handleUnitChange(e)}

                              // value ={totalunits}
                              />
                            </div>
                            {defaultValuesUnits ? (
                              <> </>
                            ) : (
                              <p className="red-color">
                                Available units for redemption: {unlockedUnits}
                              </p>
                            )}
                            {validUnits ? (
                              <> </>
                            ) : (
                              <p className="red-color"> Invalid Units </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grey-color py-4 px-md-4">
                        <div className="d-flex align-items-end justify-content-between">
                          <div className="align-items-center d-flex">
                            <div>Redeem All Units?</div>
                            <div className="d-flex align-items-center ps-3">
                              <Switch
                                onChange={handleSwitchToggle}
                                checked={redeemAll}
                                className="react-switch"
                                onColor="#C8C8C8"
                                offColor="#C8C8C8"
                                height={20}
                                width={55}
                                uncheckedIcon={
                                  <div className="switch-lbl">No</div>
                                }
                                checkedIcon={
                                  <div className="switch-lbl">
                                    &nbsp;&nbsp;Yes
                                  </div>
                                }
                              />
                            </div>
                          </div>
                          <div
                            className="pointer align-items-end d-flex fn-tip-box"
                            onClick={() => setShowFintooTip((v) => !v)}
                          >
                            <img
                              width="40px"
                              src={
                                process.env.REACT_APP_STATIC_URL +
                                "media/DMF/idea-8.png"
                              }
                            />
                            <div className="d-flex align-items-center">
                              <div className="fn-fintootip">Fintoo Tip</div>
                              {showFintooTip && <FaAngleDown />}
                              {showFintooTip == false && <FaAngleRight />}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`py-4 px-4 mx-1 my-2 gain-tip-here ${showFintooTip ? "" : "d-none"
                          }`}
                      >
                        <p className="m-0 h5">
                          <strong>Exit Load</strong>
                        </p>
                        <p className="m-0">
                          If an exit load is applicable to the fund, it will be reflected in the redemption amount.
                          {/* The exit load applicable on this redeem will be - Rs.{" "}
                          {exitLoad} and you will receive approximately - Rs.{" "}
                          {approxAmount} as per today. */}
                          {/* {exitLoadData
                        ? exitLoadData
                            .replace("0.0000%", "Nil")
                            .replace("after 0 Years", "")
                            .replace("after 0 Days", "")
                        : "-"} */}
                        </p>
                      </div>
                    </>
                  )}

                  <div
                    className={
                      btnClick
                        ? "mt-3 switch-fund-btn mobile-bottom-button"
                        : "mt-3 switch-fund-btn mobile-bottom-button disabled"
                    }
                    onClick={() => {
                      addCart();
                    }}
                  >
                    Redeem Fund
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 1 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setStepCount(0);
                  deleteCartAPI();
                }}
              />
              <Modal.Title>Confirm Redemption</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  <div className="modal-whitepopup-box-item grey-color border-top-0">
                    <div className="px-md-4">
                      <div class="">Redeem Fund</div>
                      <div>
                        <p className="lbl-title">
                          <strong>{schemeCode}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-whitepopup-box-item grey-color">
                    <div className="px-md-4">
                      <div className="d-flex rw-8-f">
                        <div className="w-33 cl-8-f">
                          <div>Folio</div>
                          <div>
                            <strong>{folioNumber}</strong>
                          </div>
                        </div>
                        <div className="w-33 cl-8-f">
                          <div>Value</div>
                          <div>
                            <strong>₹ {currAmount}</strong>
                          </div>
                        </div>
                        <div className="w-33 cl-8-f">
                          <div>Units</div>
                          <div>
                            <strong>{units}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'red', fontSize: "1.3rem" }}>{allRedeemKey == 'Y' && <>Are you sure you want to redeem <b>all your units?</b> </>} </p>
                  <div className="d-flex text-center white-modal-btn-box mobile-bottom-button">
                    <div
                      className="w-50 cancel"
                      onClick={() => {
                        setStepCount(0);
                        deleteCartAPI();
                      }}
                    >
                      Cancel
                    </div>
                    <div
                      className="w-50 yes"
                      onClick={() => {
                        setStepCount(2);
                      }}
                    >
                      Yes Proceed
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 2 && (
          <PortfolioOtpModal
            detailedMfPotfolio={detailedMfPotfolio}
            value={[selectedScheme, transactionId, cartId]}
            label={"Redeem Fund"}
            transaction_id={transactionId}
            allRedeemKey={allRedeemKey}
            // cart_id={cartId.current.cart_id}
            onBack={() => setStepCount(1)}
            onSubmit={() => {
              setOpenModalByName("");
              setStepCount(0);
            }}
          />
        )}
      </Modal>

      <Modal
        backdrop="static"
        show={openModalByName == "swp"}
        className="white-modal fn-redeem-modal"
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);
        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setOpenModalByName("");
                  setStepCount(0);
                  setWithdrawalPlanBtn(false);
                  setStartDateSwp("");
                  setEndDateSwp("");
                  setSwpAmount("");
                  setCurrAmount("");
                  setUnits("");
                }}
              />
              <div className="modal-title">SWP</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item grey-color border-top-0">
                        {/* <FintooLongDropdown
                      label="Withdraw From"
                      value={fundDetails.scheme_code}
                      onChange={(v) => handleSwitchTofund(v)}
                    /> */}
                        <FintooLongDropdownSecond
                          label="Withdraw From"
                          defaultValue={fundDetails.scheme_code}
                          value={summaryPortfolio}
                          onChange={(v) => handleSwitchFromFund(v)}
                        />
                      </div>

                      <div className="modal-whitepopup-box-item grey-color px-md-4">
                        <div className="row">
                          <div className="col-12 col-md-6 pe-2 mb-4 mb-md-0">
                            <div>Folio</div>
                            <div>
                              <strong className="folio-swp">
                                {fundDetails.folio_no}
                              </strong>
                            </div>
                          </div>
                          <div className="col-12 col-md-6 pe-2">
                            <div>Current Amount</div>
                            <div>
                              <strong className="curr-amount-swp">
                                ₹ {fundDetails.curr_val}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="py-3 px-md-4 grey-color">
                        <div className="row">
                          <div className="col-12 col-md-6 pe-2 mb-4 mb-md-0">
                            <div>Frequency</div>
                            <div
                              style={{
                                borderBottom: "1px solid #d1d1d1",
                                height: "2.25rem",
                              }}
                            >
                              <strong>Monthly</strong>
                            </div>
                          </div>
                          <div
                            className={`col-12 col-md-6 pe-2 ${redeemAll ? "invisible" : ""
                              }`}
                          >
                            <div>Set Amount</div>
                            <div className="d-flex">
                              <div className="rs-beside-textbox">₹</div>
                              <input
                                type="text"
                                className="bottom-border-input w-100"
                                maxLength={9}
                                onChange={(e) => handleAmountChange(e)}
                                value={swpAmount}
                              />
                            </div>
                            <p className="red-color">{swpErrorText}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-3 px-md-4 grey-color">
                        <div className="row">
                          <div className="col-12 col-md-6 pe-2 mb-4 mb-md-0">
                            <div>Start Date</div>
                            <div className="full-width-datepicker">
                              <FintooDatePicker
                                minDate={new Date()}
                                selected={startDateSwp}
                                onChange={(date) => handleStartChange(date)}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                holidayDates={holidayList}
                                filterDate={checkWeekday}
                                excludeDates={holidayList}
                              />
                            </div>
                          </div>
                          <div
                            className={`col-12 col-md-6 pe-2 ps-2 mb-5 mb-md-0 ${redeemAll ? "invisible" : ""
                              }`}
                          >
                            <div>End Date</div>
                            <div className="full-width-datepicker">
                              <FintooDatePicker
                                minDate={
                                  startDateSwp === ""
                                    ? new Date(+new Date() + 86400000)
                                    : new Date(
                                      +new Date(startDateSwp) + 86400000
                                    )
                                }
                                selected={endDateSwp}
                                onChange={(date) => handleEndChange(date)}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                calType="swp"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <div
                      className={
                        withdrawalPlanBtn
                          ? "mobile-bottom-button switch-fund-btn"
                          : "mobile-bottom-button switch-fund-btn disabled"
                      }
                      onClick={() => {
                        handleSWPTransaction();
                      }}
                    >
                      Withdrawal Plan
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 1 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setStepCount(0);
                  deleteCartAPI();
                }}
              />
              <div className="modal-title">Confirm SWP</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  <div className="modal-whitepopup-box-item grey-color border-top-0">
                    <div className="px-md-4">
                      <div class="">Withdraw From</div>
                      <div>
                        <p className="lbl-title">
                          <strong>{fundDetails.scheme}</strong>
                        </p>
                        {localStorage.setItem(
                          "switch_from",
                          fundDetails.scheme
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-whitepopup-box-item grey-color">
                    <div className="px-md-4">
                      <div className="d-flex rw-8-f">
                        <div className="w-33 cl-8-f">
                          <div>Folio</div>
                          <div>
                            <strong>{fundDetails.folio_no}</strong>
                          </div>
                        </div>
                        <div className="w-33 cl-8-f">
                          <div>Value</div>
                          <div>
                            <strong>₹ {swpAmount}</strong>
                          </div>
                        </div>
                        <div className="w-33 cl-8-f">
                          <div>Units</div>
                          <div>
                            <strong>{swpUnits}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-whitepopup-box-item py-3 px-md-4 grey-color">
                    <div className="d-flex">
                      <div className="w-50 pe-2">
                        <div>Start Date</div>
                        <div className="d-flex align-items-center">
                          <FaRegCalendarAlt fontSize={"1.2rem"} />
                          <strong className="ps-2">
                            {moment(startDateSwp).format("DD-MM-YYYY")}
                          </strong>
                        </div>
                      </div>
                      <div
                        className={`w-50 ps-2 ${redeemAll ? "invisible" : ""}`}
                      >
                        <div>End Date</div>
                        <div className="d-flex align-items-center">
                          <FaRegCalendarAlt fontSize={"1.2rem"} />
                          <strong className="ps-2">
                            {moment(endDateSwp).format("DD-MM-YYYY")}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex text-center white-modal-btn-box pt-4 mobile-bottom-button">
                    <div
                      className="w-50 cancel"
                      onClick={() => setStepCount(0)}
                    >
                      Cancel
                    </div>
                    <div
                      className="w-50 yes"
                      onClick={() => addTransactionSwp()}
                    >
                      Yes Proceed
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 2 && (
          <PortfolioOtpModal
            value={[selectedScheme, transactionId, cartId]}
            label={"Confirm SWP"}
            transaction_id={swpTrxId}
            cart_id={swpCartId}
            onBack={() => setStepCount(1)}
            onSubmit={() => {
              setOpenModalByName("");
              setStepCount(0);
            }}
          />
        )}
      </Modal>

      <Modal
        backdrop="static"
        show={openModalByName == "stp"}
        className="white-modal fn-redeem-modal"
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);
        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setOpenModalByName("");
                  setStepCount(0);
                  setCurrAmount("");
                  setUnits("");
                  setNoOfInstallment("");
                  setStartDateStp("");
                  setSchemeDetails("");
                }}
              />
              <div className="modal-title">STP (Systematic Transfer Plan)</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item grey-color border-top-0">
                        <strong>{fundDetails.scheme}</strong>
                      </div>

                      <div className="modal-whitepopup-box-item grey-color">
                        <FintooLongDropdown
                          label="Transfer To"
                          text="Select Fund"
                          value={getStpAmcCode}
                          onChange={(v) => handleStpTofund(v)}
                          isElss={(x) => setElssCheck(x)}
                          transaction_type="stp"
                        />
                      </div>
                      <div className="modal-whitepopup-box-item px-md-4 grey-color">
                        <div className="row">
                          <div className="col-12 col-md-6 pe-2 mb-4 mb-md-0">
                            <div>Folio</div>
                            <div>
                              <strong>{fundDetails.folio_no}</strong>
                            </div>
                          </div>
                          <div className="col-12 col-lg-6 pe-2">
                            <div>Fund Value</div>
                            <div className="">
                              <div className="w-100 ">
                                <strong>₹ {fundDetails.curr_val}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-whitepopup-box-item px-md-4 grey-color">
                        <div className="row">
                          <div className="col-12 col-md-6 pe-2 mb-4 mb-md-0">
                            <div>Frequency</div>
                            <div
                              style={{
                                borderBottom: "1px solid #d1d1d1",
                                height: "2.25rem",
                              }}
                            >
                              <strong>Monthly</strong>
                            </div>
                          </div>
                          <div
                            className={`col-12 col-md-6 pe-2 mb-4 mb-md-0 ps-2 ${redeemAll ? "invisible" : ""
                              }`}
                          >
                            <div>Set Monthly STP Amount</div>
                            <div className="d-flex">
                              <div className="  rs-beside-textbox">₹</div>
                              <input
                                type="text"
                                disabled={schemedetails === ""}
                                value={currAmount}
                                className="bottom-border-input w-100"
                                // onChange = {(e)=>setTotalAmount(e.key.value)}
                                onChange={(e) => handleAmountChange(e)}
                                step="any"
                              />
                            </div>
                            <p className="red-color">{swpErrorText}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-4 px-md-4 grey-color">
                        <div className="row">
                          <div className="stp-date-picker col-12 col-md-6 pe-2 mb-4 mb-md-0">
                            <div>Start Date</div>
                            <div>
                              <FintooDatePicker
                                minDate={marketDateTime}
                                maxDate={moment().add(2, "months").toDate()}
                                selected={startDateStp}
                                onChange={(date) =>
                                  handleStartChange(date)}
                                showMonthDropdown={false}
                                showYearDropdown={false}
                                filterDate={checkWeekday}
                                excludeDates={stpHolidayList}
                                dropdownMode="select"
                              />
                            </div>
                          </div>
                          {/* <div
                            className={`col-12 col-md-6 pe-2 mb-4 mb-md-0 ps-2 ${
                              redeemAll ? "invisible" : ""
                            }`}
                          >
                            <div>End Date</div>
                            <div className="full-width-datepicker">
                              <FintooDatePicker
                                minDate={moment(startDateStp)
                                  .add(1, "month")
                                  .toDate()}
                                selected={endDateStp}
                                onChange={(date) => handleEndChange(date)}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            </div>
                          </div> */}
                          <div
                            className={`col-12 col-md-6 pe-2 mb-4 mb-md-0 ps-2 ${redeemAll ? "invisible" : ""
                              }`}
                          >
                            <div>No. Of Installments</div>
                            <div className="d-flex">
                              <input
                                type="text"
                                disabled={schemedetails === ""}
                                value={noOfInstallment}
                                className="bottom-border-input w-100"
                                onChange={handleInstallmentChange}
                                step="any"
                              />
                            </div>
                            <p className="red-color">Minimum {minInstallmentText} Installments Required</p>
                          </div>
                        </div>
                        <div className="row pt-3">
                          <p className="mb-0">Monthly Recurring STP amount: ₹ {monthlyRecurringStpAmount}/-</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    <div
                      className="switch-fund-btn mobile-bottom-button"
                      onClick={() => {
                        handleTransferFund();
                      }}
                    >
                      Transfer Fund
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 1 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setStepCount(0);
                }}
              />
              <div className="modal-title">Confirm STP</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  <div className="modal-whitepopup-box-item grey-color border-top-0">
                    <div className="px-md-4">
                      <div class="">Transfer From</div>
                      <div>
                        <p className="lbl-title">
                          <strong>{fundDetails.scheme}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-whitepopup-box-item grey-color ">
                    <div className="px-md-4">
                      <div class="">Transfer To</div>
                      <div>
                        <p className="lbl-title">
                          <strong>{schemedetails.scheme_name}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-whitepopup-box-item grey-color">
                    <div className="px-md-4">
                      <div className="d-flex rw-8-f">
                        <div className="w-33 cl-8-f">
                          <div>Folio</div>
                          <div>
                            <strong>{fundDetails.folio_no}</strong>
                          </div>
                        </div>
                        <div className="w-33 cl-8-f">
                          <div>Value</div>
                          <div>
                            <strong>₹ {currAmount}</strong>
                          </div>
                        </div>
                        <div className="w-33 cl-8-f">
                          <div>Units</div>
                          <div>
                            <strong>{stpUnits}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="row pt-4">
                        <p className="mb-0">
                          Monthly Recurring STP amount: <strong>₹ {monthlyRecurringStpAmount}/-</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex text-center white-modal-btn-box pt-2 mobile-bottom-button">
                    <div
                      className="w-50 cancel"
                      onClick={() => setStepCount(0)}
                    >
                      Cancel
                    </div>
                    <div className="w-50 yes" onClick={() => {
                      setStepCount(2)
                      addStpToCart();
                    }}>
                      Yes Proceed
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 2 && (
          <PortfolioOtpModal
            value={[
              { folio_no: fundDetails.folio_no, scheme: fundDetails.scheme, cartIdRef: cartIdRef.current },
            ]}
            label={"Confirm STP"}
            stpTransactionId={stpTransactionId}
            onBack={() => setStepCount(1)}
            onSubmit={() => {
              setOpenModalByName("");
              setStepCount(0);
            }}
          />
        )}
      </Modal>

      <Modal
        backdrop="static"
        show={openModalByName == "stop"}
        className="white-modal fn-redeem-modal"
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);

        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setOpenModalByName("");
                  setStepCount(0);
                  setDetailedMfPotfolio(prev => ({
                    ...prev,
                    sip_stp_swp_data: {
                      ...prev.sip_stp_swp_data,
                      moreSIP: (prev?.sip_stp_swp_data?.moreSIP || []).map(x => ({ ...x, checked: false }))
                    }
                  }));
                }}
              />
              <div className="modal-title">Stop this SIP</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item px-md-4 grey-color border-top-0">
                        <div>Fund Name</div>
                        <div className="textfont">
                          <strong>{fundDetails?.[0]?.scheme}</strong>
                        </div>
                      </div>

                      <div className="modal-whitepopup-box-item px-md-4 grey-color">
                        <div className="d-flex">
                          <div className="w-50 pe-2">
                            <div>Amount</div>
                            <div>
                              <strong>{indianRupeeFormat(fundDetails?.[0]?.inv)}</strong>
                            </div>
                          </div>
                          <div
                            className={`w-50 ps-2 ${redeemAll ? "invisible" : ""
                              }`}
                          >
                            <div>SIP Date</div>
                            <div className="d-flex">
                              <img
                                width={"20px"}
                                height={"20px"}
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/DMF/calendar-336.png"
                                }
                              />
                              <div className="ps-2">
                                <strong>
                                  {moment(sipDate).format("DD-MM-YYYY")}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div
                          className="switch-fund-btn mobile-bottom-button"
                          onClick={() => {
                            setStepCount(1);
                          }}
                        >
                          Confirm
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 1 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setStepCount(0);
                }}
              />
              <div className="modal-title">Please share reason for stopping SIP.</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div className="modal-whitepopup-box-item px-md-4">
                  <p className={`text-center ${style["stop-msg"]}`}>Hello {(fundDetails?.name?.toLowerCase())}, please tell us why you want to stop this SIP? Please choose an option from below.</p>
                  <StopSipReason
                    onSubmit={(v) => {
                      setStopReason({ ...v });
                      setStepCount(2);
                    }}
                  />
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 2 && (
          <PortfolioOtpModal
            detailedMfPotfolio={detailedMfPotfolio}
            onBack={() => setStepCount(1)}
            onSubmit={() => {
              setOpenModalByName("");
              setStepCount(0);
            }}
            label={"Stop SIP"}
            value={[fundDetails]}
            reason={stopReason}
          />
        )}
      </Modal>

      <Modal
        backdrop="static"
        show={openModalByName == "stop_swp"}
        className="white-modal fn-redeem-modal"
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);
        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setOpenModalByName("");
                  setStepCount(0);
                }}
              />
              <div className="modal-title">Stop this SWP</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item px-md-4 grey-color border-top-0">
                        <div>Fund Name</div>
                        <div className="textfont">
                          <strong>
                            Canara Rob Conservative Hybrid Fund - Reg(G)
                          </strong>
                        </div>
                      </div>

                      <div className="modal-whitepopup-box-item px-md-4 grey-color">
                        <div className="d-flex">
                          <div className="w-50 pe-2">
                            <div>Amount</div>
                            <div>
                              <strong>10,000</strong>
                            </div>
                          </div>
                          <div
                            className={`w-50 ps-2 ${redeemAll ? "invisible" : ""
                              }`}
                          >
                            <div>SIP Date</div>
                            <div className="d-flex">
                              <img
                                width={"20px"}
                                height={"20px"}
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/DMF/calendar-336.png"
                                }
                              />
                              <div className="ps-2">
                                <strong>10-10-2022</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div
                          className="switch-fund-btn mobile-bottom-button"
                          onClick={() => {
                            setStepCount(1);
                          }}
                        >
                          Confirm
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 1 && (
          <PortfolioOtpModal
            onBack={() => setStepCount(0)}
            onSubmit={() => {
              setOpenModalByName("");
              setStepCount(0);
            }}
          />
        )}
      </Modal>

      <Modal
        backdrop="static"
        show={openModalByName == "stop_stp"}
        className="white-modal fn-redeem-modal"
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);
        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setOpenModalByName("");
                  setStepCount(0);
                }}
              />
              <div className="modal-title">Stop this SWP</div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item px-md-4 grey-color border-top-0">
                        <div>Fund Name</div>
                        <div className="textfont">
                          <strong>
                            Canara Rob Conservative Hybrid Fund - Reg(G)
                          </strong>
                        </div>
                      </div>

                      <div className="modal-whitepopup-box-item px-md-4 grey-color">
                        <div className="d-flex">
                          <div className="w-50 pe-2">
                            <div>Amount</div>
                            <div>
                              <strong>10,000</strong>
                            </div>
                          </div>
                          <div
                            className={`w-50 ps-2 ${redeemAll ? "invisible" : ""
                              }`}
                          >
                            <div>SIP Date</div>
                            <div className="d-flex">
                              <img
                                width={"20px"}
                                height={"20px"}
                                src={
                                  process.env.REACT_APP_STATIC_URL +
                                  "media/DMF/calendar-336.png"
                                }
                              />
                              <div className="ps-2">
                                <strong>10-10-2022</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div
                          className="switch-fund-btn mobile-bottom-button"
                          onClick={() => {
                            setStepCount(1);
                          }}
                        >
                          Confirm
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 1 && (
          <PortfolioOtpModal
            onBack={() => setStepCount(0)}
            onSubmit={() => {
              setOpenModalByName("");
              setStepCount(0);
            }}
          />
        )}
      </Modal>

      {/* For SIP Edit INFO */}
      <Modal
        backdrop="static"
        show={openModalByName == "Edit_SIP"}
        className={`white-modal Sip_Modal fn-redeem-modal ${stepCount == 3 ? "SIPSuccess" : null
          }`}
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);
          onCloseEditSipModal();
        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3">
              <FintooBackButton
                onClick={() => {
                  setOpenModalByName("");
                  setStepCount(0);
                  onCloseEditSipModal();
                }}
              />
              <div className="modal-title">Edit Date & Amount</div>
              {/* <div className={`${style.SIPCloseicon}`}>
                <IoIosCloseCircleOutline
                  onClick={() => {
                    setOpenModalByName("");
                    setStepCount(0);
                  }}
                />
              </div> */}
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item px-md-4 grey-color border-top-0">
                        <div>Fund Name</div>
                        <div className="textfont">
                          <strong>
                            {renderFundName()}
                          </strong>
                        </div>
                      </div>

                      <div className="modal-whitepopup-box-item px-md-4 grey-color">
                        <div className="d-flex">
                          <div className={`w-50 ps-2 `}>
                            <div>New Amount</div>
                            <div className="d-flex">
                              <div className="rs-beside-textbox">₹</div>
                              <input
                                type="text"
                                className="bottom-border-input w-100"
                                maxLength={9}
                                onChange={(e) => {
                                  setDetailedMfPotfolio((prev) => ({
                                    ...prev,
                                    editSipNewData: {
                                      ...prev.editSipNewData,
                                      amount: e.target.value,
                                    },
                                  }));
                                }}
                                value={detailedMfPotfolio?.editSipNewData?.amount}
                              />
                            </div>
                            {simpleValidator.current.message('amount', detailedMfPotfolio?.editSipNewData?.amount, 'required')}
                          </div>
                          <div className="w-50 ms-5 pe-2">
                            <div>New SIP Date</div>
                            <div className="SIP-datepicker">
                              <FintooDatePicker
                                minDate={moment().add(10, "days").toDate()}
                                selected={detailedMfPotfolio?.editSipNewData?.sipDate ? moment(
                                  detailedMfPotfolio?.editSipNewData?.sipDate
                                ).toDate() : moment().add(10, "days").toDate()}
                                onChange={(date) => {
                                  setDetailedMfPotfolio((prev) => ({
                                    ...prev,
                                    editSipNewData: {
                                      ...prev.editSipNewData,
                                      sipDate: moment(date).toDate(),
                                    },
                                  }));
                                }}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex mt-5">
                          <div className={`w-50 ps-2`}>
                            <span className="lbl-newbond">
                              SIP Tenure (years)
                            </span>
                            <div>
                              <input
                                type="text"
                                className="bottom-border-input w-100"
                                maxLength={9}
                                onChange={(e) => {
                                  setDetailedMfPotfolio((prev) => ({
                                    ...prev,
                                    editSipNewData: {
                                      ...prev.editSipNewData,
                                      tenure: e.target.value,
                                    },
                                  }));
                                }}
                                value={detailedMfPotfolio?.editSipNewData?.tenure}
                              />
                            </div>
                            {simpleValidator.current.message('tenure', detailedMfPotfolio?.editSipNewData?.tenure, 'required')}
                          </div>
                          <div className={`w-50 ms-5 ps-2 `}>
                            <span className="lbl-newbond">SIP Manadate</span>
                            <br />
                            {userMandateList.length > 0 ? <Select
                              className="fnto-dropdown-react"
                              classNamePrefix=" sortSelect"
                              isSearchable={false}
                              options={userMandateList}
                              name="SIPMandate"
                              onChange={(v) => {
                                // setSelectedMandate({...v});
                                setDetailedMfPotfolio((prev) => ({
                                  ...prev,
                                  editSipNewData: {
                                    ...prev.editSipNewData,
                                    selectedMandate: v,
                                  },
                                }));
                              }}
                            /> : <FintooButton onClick={() => {
                              navigate(process.env.PUBLIC_URL + "/mutual-fund/profile/dashboard/bankaccount");
                            }} title={" Add mandate "} />}
                            <br />
                            {simpleValidator.current.message('tenure', detailedMfPotfolio?.editSipNewData?.selectedMandate?.value, 'required')}
                          </div>
                        </div>
                        <div
                          className={`mt-4 text-center ${style.EditSiptext}`}
                        >
                          You're modifying your SIP Investment in <br />
                          <span className={`${style.TextBold}`}>
                            {renderFundName()}
                          </span>{" "}
                          which is deducted on{" "}
                          <span className={`${style.TextBold}`}>
                            {moment(
                              detailedMfPotfolio?.editSipNewData?.sipDate
                            ).format("Do")} of every month{" "}
                          </span>
                          for amount{" "}
                          <span className={`${style.TextBold}`}>{'editSipNewData' in detailedMfPotfolio && indianRupeeFormat(detailedMfPotfolio?.editSipNewData?.amount)}</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div
                          className="switch-fund-btn mobile-bottom-button"
                          onClick={() => {
                            if (simpleValidator.current.allValid()) {
                              setStepCount(1);
                            } else {
                              simpleValidator.current.showMessages();
                              forceUpdate(1);
                            }
                          }}
                        >
                          Save Changes
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 1 && (
          <>
            <Modal.Header className="py-3">
              <div className="modal-title">Confirm New SIP Details</div>
              <div className={`${style.SIPCloseicon}`}>
                <IoIosCloseCircleOutline
                  onClick={() => {
                    setOpenModalByName("");
                    setStepCount(0);
                  }}
                />
              </div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item px-md-4 grey-color border-top-0">
                        <div>Fund Name</div>
                        <div className="textfont">
                          <strong>
                            {renderFundName()}
                          </strong>
                        </div>
                      </div>

                      <div className="modal-whitepopup-box-item px-md-4 grey-color">
                        <div className="d-flex">
                          <div className={`w-50 ps-2 `}>
                            <div>New Amount</div>
                            <div className="d-flex">
                              <div>
                                {indianRupeeFormat(
                                  Number(
                                    detailedMfPotfolio?.editSipNewData?.amount
                                  )
                                )}
                              </div>
                            </div>
                            <p className="red-color">{swpErrorText}</p>
                          </div>
                          <div className="w-50 ms-5 pe-2">
                            <div>New SIP Date</div>
                            <div className="SIP-datepicker">
                              {moment(
                                detailedMfPotfolio?.editSipNewData?.sipDate
                              ).format("DD/MM/YYYY")}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex mt-5">
                          <div className={`w-50 ps-2`}>
                            <span className="lbl-newbond">SIP Tenure</span>
                            <br />
                            <div>
                              {detailedMfPotfolio?.editSipNewData?.tenure}
                            </div>
                          </div>
                          <div className={`w-50 ms-5 ps-2 `}>
                            <span className="lbl-newbond">SIP Manadate</span>
                            <br />
                            <span className="lbl-newbond">SIP Manadate</span>
                            <br />
                            {detailedMfPotfolio?.editSipNewData?.selectedMandate.label}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <div
                          className="switch-fund-btn mobile-bottom-button"
                          onClick={() => {
                            setStepCount(2);
                          }}
                        >
                          Continue
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
          </>
        )}
        {stepCount == 2 && (
          <div>
            <PortfolioOtpModal
              onBack={() => {
                setOpenModalByName("");
                setStepCount(0);
              }}
              onSubmit={() => {
                // setOpenModalByName("");
                // setStepCount(3);
                cancelSip();
              }}
              label={"Fund Name"}
              value={[fundDetails]}
              isActive={true}
            />
          </div>
        )}
        {stepCount == 3 && (
          <div className={`${style.successfullmsg}`}>
            <div className={`${style.successheader}`}>
              Changes Requested Successfully
            </div>
            <div className={`${style.successimg}`}>
              <img
                className="img-fluid SucessImg"
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/DMF/payment_success.svg"
                }
                alt="SuccessPayment"
                srcset=""
              />
            </div>
            <div className={`${style.successDesc}`}>
              Your request have been accepted and it is expected to be processed
              by 5th January. Your existing SIP will be stopped, and a new SIP
              will resume as per your change request.
            </div>
            <div className={`${style.successBtn}`}>
              <button
                onClick={() => {
                  setOpenModalByName("");
                  // setStepCount(0);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* For SKIP SIP INFO */}
      <Modal
        backdrop="static"
        show={openModalByName == "Skip_SIP"}
        className={`white-modal Sip_Modal fn-redeem-modal ${stepCount == 3 ? "SIPSuccess" : null
          } `}
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);
        }}
      >
        {stepCount == 0 && (
          <>
            <Modal.Header className="py-3">
              <div className="modal-title">Skip SIP Installment</div>
              <div className={`${style.SIPCloseicon}`}>
                <IoIosCloseCircleOutline
                  onClick={() => {
                    setOpenModalByName("");
                    setStepCount(0);
                  }}
                />
              </div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  {isUnderMaintenance() ? (
                    <>
                      <div className="px-3">
                        <br />
                        <br />
                        {isUnderMaintenance(true)["html"]}
                        <br />
                        <br />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="modal-whitepopup-box-item px-md-4 grey-color border-top-0">
                        <div>Fund Name</div>
                        <div className="textfont">
                          <strong>
                            Canara Rob Conservative Hybrid Fund - Reg(G)
                          </strong>
                        </div>
                      </div>

                      <div className="modal-whitepopup-box-item px-md-4 grey-color">
                        <div className="d-flex">
                          <div className="w-50 ps-2">
                            <div>Skip Installment For</div>
                            <div className="SIP-datepicker">
                              <FintooDatePicker
                                minDate={moment(startDateStp)
                                  .add(1, "month")
                                  .toDate()}
                                selected={endDateStp}
                                onChange={(date) => handleEndChange(date)}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                              />
                            </div>
                          </div>
                          <div className={`w-50  pe-2 ms-5`}>
                            <div>Next SIP Date</div>
                            <div className="d-flex">
                              <div className={`${style.Nextsipdate}`}>
                                28th February
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`mt-4 text-center ${style.EditSiptext}`}
                        >
                          Your SIP installment on 28th January would be skipped.
                          Your SIP will resume again from 28th February.
                        </div>
                      </div>

                      <div className="pt-4">
                        <div
                          className="switch-fund-btn mobile-bottom-button"
                          onClick={() => {
                            setStepCount(1);
                          }}
                        >
                          Save Changes
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Modal.Body>
          </>
        )}

        {stepCount == 1 && (
          <div>
            <PortfolioOtpModal
              onBack={() => {
                setOpenModalByName("");
                setStepCount(0);
              }}
              onSubmit={() => {
                setOpenModalByName("");
                setStepCount(2);
              }}
              label={"Fund Name"}
              value={[fundDetails]}
              isActive={true}
            />
          </div>
        )}
        {stepCount == 2 && (
          <div className={`${style.successfullmsg}`}>
            <div className={`${style.successheader}`}>
              SIP Installment Skipped Successfully
            </div>
            <div className={`${style.successimg}`}>
              <img
                className="img-fluid SucessImg"
                src={
                  process.env.REACT_APP_STATIC_URL +
                  "media/DMF/payment_success.svg"
                }
                alt="SuccessPayment"
                srcset=""
              />
            </div>
            <div className={`${style.successDesc}`}>
              Your request have been accepted and it is expected to be processed
              by 5th January. Your SIP will be skipped for 1 month and will be
              resumed once skipped period ended.
            </div>
            <div className={`${style.successBtn}`}>
              <button
                onClick={() => {
                  setOpenModalByName("");
                  // setStepCount(0);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* For Restricated EDIT & SKIP SIP */}
      <Modal
        show={openModalByName == "Restricated_Edit_SIP"}
        centered
        // className={`white-modal Sip_Modal fn-redeem-modal ${stepCount == 3 ? "SIPSuccess" : null} `}
        onHide={() => {
          setOpenModalByName("");
          setStepCount(0);
        }}
      >
        <div className={`${style.Restricated_Edit_SIP_modal}`}>
          <div className={`${style.Restricated_Edit_SIP_modal_Header}`}>
            You're Restricated to Edit SIP
          </div>
          <div className={`${style.successimg}`}>
            <img
              className="img-fluid SucessImg"
              src={
                process.env.REACT_APP_STATIC_URL + "media/DMF/Date_Cancel.png"
              }
              alt="SuccessPayment"
              srcset=""
            />
          </div>
          <div className={`${style.Restricated_Edit_SIP_modal_Decs}`}>
            You cannot Edit SIP <br />
            as the next installment is already queued
            <br />
            Please request the modification after 28th January
            <br />
          </div>
          <div className={` mt-4 ${style.successBtn}`}>
            <button
              style={{ padding: " .5rem 4rem" }}
              onClick={() => {
                setOpenModalByName("");
                // setStepCount(0);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </Modal>

      {/* For Manage SIP mobile View */}
      <Modal
        show={openBottomModalByName.length > 0}
        className="bottom-modal"
        onHide={() => setOpenBottomModalByName("")}
      >
        <Modal.Body className="noselect">
          <div className=""></div>
          {openBottomModalByName == "manage_SIP" && (
            <>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <div className={`${style.manageSiptext}`}>Manage SIP</div>
                <div className={`${style.SIPCloseicon}`}>
                  <IoIosCloseCircleOutline
                    style={{
                      fontSize: "1.5rem",
                      marginRight: "1rem",
                      position: "static",
                    }}
                    onClick={() => {
                      setOpenBottomModalByName("");
                      setStepCount(0);
                      setOpenModalByName("");
                    }}
                  />
                </div>
              </div>
              <div
                className="py-1 d-flex justify-content-between align-items-center"
                onClick={() => {
                  setOpenModalByName("Edit_SIP");
                  setOpenBottomModalByName("");
                  setStepCount(0);
                }}
              >
                <div>
                  <strong>Edit SIP</strong>
                </div>
                <div
                  style={{ position: "static" }}
                  className={`${style.SIPCloseicon}`}
                >
                  <FcNext style={{ fontSize: "1.2rem" }} />
                </div>
              </div>
              <div
                onClick={() => {
                  setOpenModalByName("Skip_SIP");
                  setOpenBottomModalByName("");
                  setStepCount(0);
                }}
                className="py-1  d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>Skip SIP</strong>
                </div>
                <div
                  style={{ position: "static" }}
                  className={`${style.SIPCloseicon}`}
                >
                  <FcNext style={{ fontSize: "1.2rem" }} />
                </div>
              </div>
              <div
                onClick={() => {
                  setOpenModalByName("stop");
                  setOpenBottomModalByName("");
                  setStepCount(0);
                }}
                className="py-1  d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>Stop SIP</strong>
                </div>
                <div
                  style={{ position: "static" }}
                  className={`${style.SIPCloseicon}`}
                >
                  <FcNext style={{ fontSize: "1.2rem" }} />
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
      <ReactModal
        classNames={{
          modal: "ModalpopupContentWidth",
        }}
        open={isOpen}
        showCloseIcon={false}
        center
        animationDuration={0}
        closeOnOverlayClick={false}
        large
      >
        <div className="text-center">
          <h3 className="HeaderText">Attention !</h3>
          <div className="">
            <div
              className="PopupImg"
              style={{ width: "40%", margin: "0 auto" }}
            >
              <img
                style={{ width: "100%" }}
                src={
                  process.env.PUBLIC_URL + "/static/media/DMF/SelectingTeam.svg"
                }
              />
            </div>
            <div className="p-2">
              <p
                className="PopupContent"
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "normal",
                  padding: "0 1rem",
                  width: "90%",
                  margin: "0 auto",
                }}
              >
                Oops! It seems like your profile is incomplete. Before
                proceeding with any transactions , please make sure to complete
                your profile.
              </p>
            </div>
            <div
              className="ButtonBx aadharPopUpFooter"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button
                className="ReNew"
                onClick={() => {
                  closeModal();
                  redirect();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    </PortfolioLayout>
  );
};
export default PortfolioFund;
