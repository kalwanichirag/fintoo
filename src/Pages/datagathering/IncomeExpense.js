import React, { useState, useRef } from "react";
import { useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import QuizeRadio from "../../components/HTML/QuizRadio";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import moment from "moment";
import ReactDatePicker from "../../components/HTML/ReactDatePicker/ReactDatePicker";
import Switch from "react-switch";
// import Slider from "react-input-slider";
// import Slider from "rc-slider";
import FintooRadio2 from "../../components/FintooRadio2";
import { BsPencilFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import DatagatherLayout from "../../components/Layout/Datagather";
import Select from "react-select";
import { Row, Modal } from "react-bootstrap";
import Slider from "../../components/HTML/Slider";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { DATA_BELONGS_TO, imagePath } from "../../constants";
import {
  getParentUserId,
  getItemLocal,
  apiCall,
  loginRedirectGuest,
  indianRupeeFormat,
  formatPrice, setBackgroundDivImage, getParentFpLogId
} from "../../common_utilities";
import commonEncode from "../../commonEncode";
import SimpleReactValidator from "simple-react-validator";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import DGstyles from "./DG.module.css";
import { useDispatch } from "react-redux";
import FormRangeSlider from "../DMF/CommonDashboard/CommonDashboardComponents/FormRangeSlider";
import FintooLoader from '../../components/FintooLoader';
import customStyles from "../../components/CustomStyles";
import { ScrollToTop } from "./ScrollToTop"
import FintooCheckbox from "../../components/FintooCheckbox/FintooSubCheckbox";
import { UpdateIncomeDetails, addIncomeDetails, deleteIncomeDetails, getIncomeCategoryList, getIncomeDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/income";
import { fetchUserProfileDetails, getFamilyMember } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import { addExpenseDetails, deleteExpenseDetails, geExpenseCategoryList, getExpenseDetails, UpdateExpenseDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/expense";
import { CheckProfileStatus } from "../../FrappeIntegration-Services/services/master-api/masterApiService";
const IncomeExpense = () => {

  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
  function formatToDDMMYYYY(dateStr) {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  const dispatch = useDispatch();
  const numbers = [1, 2, 3];
  const expenseImageMap = {
    "Club Membership and Subscriptions": "/static/media/DG/income-expenses/expenses_club_membership.svg",
    "Vacation": "/static/media/DG/income-expenses/expenses_vacation.svg",
    "Education": "/static/media/DG/income-expenses/expenses_school_fees.svg",
    "Gifts and donations": "/static/media/DG/income-expenses/expenses_gifts.svg",
    "Hotel, Leisure and Entertainment": "/static/media/DG/income-expenses/expenses_hotel_entertainment.svg",
    "Household Expenses": "/static/media/DG/income-expenses/expenses_house_expense.svg",
    "House Rent": "/static/media/DG/income-expenses/expenses_house_rent.svg",
    "Medical": "/static/media/DG/income-expenses/expenses_medical.svg",
    "Post Retirement Expense": "/static/media/DG/income-expenses/expenses_post_retirement.svg",
    "Other Expenses": "/static/media/DG/income-expenses/expenses_other.svg"
  };



  const incomeImageMap = {
    "Interest Income": "/static/media/DG/income-expenses/income_business.svg",
    "Gifts": "/static/media/DG/income-expenses/expenses_gifts.svg",
    "Interest Income": "/static/media/DG/income-expenses/income_post_office_MIS.svg",
    "Pension": "/static/media/DG/income-expenses/income_pension.svg",
    "Rental": "/static/media/DG/income-expenses/income_rental.svg",
    "Salary & Bonus": "/static/media/DG/income-expenses/income_salary_bonus.svg",
    "Other Income": "/static/media/DG/income-expenses/expenses_other.svg",
    "Salary / Wages": "/static/media/DG/income-expenses/income_salary.svg",
    "Fee Received": "/static/media/DG/income-expenses/income_fee_received.svg",
    "Loan Received": "/static/media/DG/income-expenses/income_loan_received.svg",
    "Refund": "/static/media/DG/income-expenses/income_refund.svg",
    "Sale of Shares / Property": "/static/media/DG/income-expenses/income_shares_property.svg",
    "Sales of Other Assets": "/static/media/DG/income-expenses/income_other_assets.svg",
    "Self Transferred": "/static/media/DG/income-expenses/income_self_transfer.svg",
    "Miscellaneous": "/static/media/DG/income-expenses/income_business.svg",
    "Business Income": "/static/media/DG/income-expenses/income_business_income.svg",
    "Rental Income": "/static/media/DG/income-expenses/income_rental.svg",
  };


  const income_uuid = [
    "business",
    "gifts",
    "interest_income",
    "miscellaneous",
    "pension",
    "rental",
    "salary_and_bonus"
  ];

  const [income_options, setIncome_options] = useState([])
  const [expense_options, setExpense_options] = useState([])

  const FetchincomeCategory = async () => {
    try {
      const result = await getIncomeCategoryList();
  
      if (result.status_code === "200") {
        const data =
          typeof result.data === "string"
            ? JSON.parse(result.data)
            : result.data;
  
        const categoryList = data?.[0]?.category_list || [];
  
        const updatedList =
          categoryList
            ?.filter((item) => income_uuid.includes(item.income_cat_uuid)) 
            .map((item) => {
              let details = {};
              try {
                details = JSON.parse(item.income_cat_details || "{}");
              } catch {
                console.warn("Invalid details for:", item.income_cat_name);
              }
  
              const imagePathKey = incomeImageMap[item.income_cat_name];
  
              return {
                ...item,
                details,
                image: `${imagePath}${
                  imagePathKey ||
                  "/static/media/DG/income-expenses/income_business.svg"
                }`,
              };
            }) || [];
  
        setIncome_options(updatedList);
  
        // ✅ Set defaults from first filtered category
        if (updatedList.length > 0) {
          const first = updatedList[0];
          setIncomeCategoryId(first.income_id);
          setIncomeCatUUID(first.income_cat_uuid);
          setIncomeName(first.income_cat_name);
          handleCategoryClick(first, "income");
        }
      }
    } catch (error) {
      console.error("Error fetching income category:", error);
    }
  };


  const FetchexpenseCategory = async () => {
    try {
      const result = await geExpenseCategoryList();
  
      if (result.status_code === "200") {
        const data = typeof result.data === "string" ? JSON.parse(result.data) : result.data;
        const categoryList = data?.[0]?.category_list || [];
  
        // 🔍 Filter categories that have a matching image key (if applicable)
        const filteredCategoryList = categoryList?.filter((item) =>
          expenseImageMap.hasOwnProperty(item.expense_cat_name)
        );
  
        // 🧠 Map to include parsed details and image
        const updatedList =
          filteredCategoryList?.map((item) => {
            let details = {};
            try {
              // 🔹 Parse details JSON if present
              details = JSON.parse(item.expense_cat_details || "{}");
            } catch {
              console.warn("No image found for:", item.expense_cat_name);
            }
  
            const imagePathKey = expenseImageMap[item.expense_cat_name];
  
            return {
              ...item,
              details,
              image: `${imagePath}${
                imagePathKey ||
                "/static/media/DG/income-expenses/expenses_other.svg"
              }`,
            };
          }) || [];
  
        // ✅ Update state
        if (Array.isArray(updatedList)) {
          setExpense_options(updatedList);
  
          // ✅ Optionally set defaults (like you did for income)
          if (updatedList.length > 0) {
            const first = updatedList[0];
            setExpenseCategoryId(first.expense_id);
            setExpenseCatUUID(first.expense_cat_uuid);
            setExpenseName(first.expense_cat_name);
            handleCategoryClick(first, "expense");
          }
        } else {
          setExpense_options([]);
        }
      }
    } catch (e) {
      console.error("Error fetching expense category:", e);
    }
  };
  



  useEffect(() => {
    FetchincomeCategory();
    FetchexpenseCategory();
  }, [])

  const [tab, setTab] = useState("tab1");
  const [dependencyStatus, setDependencyStatus] = useState("");
  const [dob, setDob] = useState(null);
  const [isFixed, setIsFixed] = useState(false);
  const [addForm, setAddForm] = useState(true);
  const [updateForm, setUpdateForm] = useState(false);
  const [isWish, setIsWish] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [incomeAnnualIncrease, setIncomeAnnualIncrease] = useState(10);
  const [selectedOption, setSelectedOption] = useState("Business");
  const [incomeCatUUID, setIncomeCatUUID] = useState("");  
  const [expenseCatUUID, setExpenseCatUUID] = useState("");
  const [selectedOption1, setSelectedOption1] = useState("Other Expenses");
  const [incomeFrequencyChange, setIncomeFrequencyChange] = useState(0);
  const [expenseFrequencyChange, setExpenseFrequencyChange] = useState(0);
  const cntRef = useRef(null);
  const expenseRef = useRef(null)
  const [isRecurring, setIsRecurring] = useState("One Time");
  const [selectedEndAge, setselectedEndAge] = useState(0);
  const [sliderValue, setSliderValue] = useState(10);
  const [incomeData, setIncomeData] = useState([]);
  const fplogid = getParentFpLogId();
  const [incomeType, setIncomeType] = useState("1");
  const [incomeFrequency, setIncomeFrequency] = useState("Monthly");
  const [incomeCategoryId, setIncomeCategoryId] = useState("");
  const [incomeIsFixed, setIncomeIsFixed] = useState('Fixed');
  const [incomeForRetirement, setIncomeForRetirement] = useState(false);
  const [incomeAfterRetirement, setIncomeAfterRetirement] = useState(null);
  const [incomeStartDate, setIncomeStartDate] = useState(new Date());
  const [incomeConditionDate, setIncomeConditionDate] = useState(new Date());
  const [expenseConditionDate, setExpenseConditionDate] = useState(new Date());
  const [incomeEndDate, setIncomeEndDate] = useState(null);
  const [incFrequency, setIncFrequency] = useState(1);
  const [expFrequency, setExpFrequency] = useState(1);
  const [incomeName, setIncomeName] = useState("");

  const [familyData, setFamilyData] = useState([]);
  const [incomeForMember, setIncomeForMember] = useState("");
  const [retirementDate, setRetirementDate] = useState("");
  const [lifeExpectancyDate, setLifeExpectancyDate] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeFootnote, setIncomeFootnote] = useState("");
  const [incomeAmountError, setIncomeAmountError] = useState("");
  const [selectedIncomeId, setSelectedIncomeId] = useState("");
  const [deleteIncomeName, setDeleteIncomeName] = useState("");
  const [incomeId, setIncomeId] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeNameError, setIncomeNameError] = useState("");
  const [lifecycleStatus, setLifecycleStatus] = useState("");
  const [recurringTotal, setRecurringTotal] = useState("");
  const [incomeTypeError, setIncomeTypeError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [planDate, setPlanDate] = useState("");
  const simpleValidator = useRef(new SimpleReactValidator());
  const [, forceUpdate] = useState();
  const [show, setShow] = useState(false);
  const [recurFlag, setRecurFlag] = useState("");

  const [expenseFrequency, setExpenseFrequency] = useState("Monthly");
  const [isExpenseRecurring, setExpenseRecurring] = useState("One Time");
  // const [expenseType, setExpenseType] = useState("Fixed");
  const [expenseData, setExpenseData] = useState([]);
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [expenseIsFixed, setExpenseFixed] = useState("Fixed");
  const [expenseForRetirement, setExpenseForRetirement] = useState(false);
  const [expenseAfterRetirement, setExpenseAfterRetirement] = useState(null);
  const [expenseStartDate, setExpenseStartDate] = useState(new Date());
  const [expenseEndDate, setExpenseEndDate] = useState(null);
  const [expenseName, setExpenseName] = useState(
    "Other Expenses"
  );
  const [expenseForMember, setExpenseForMember] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseFootnote, setExpenseFootnote] = useState("");
  const [expenseAmountError, setExpenseAmountError] = useState("");
  const [selectedExpenseId, setSelectedExpenseId] = useState("");
  const [deleteExpenseName, setDeleteExpenseName] = useState("");
  const [expenseId, setExpenseId] = useState("");
  const [totalExpense, setTotalExpense] = useState(0);
  const [expenseNameError, setExpenseNameError] = useState("");
  const [expenseEndDateError, setExpenseEndDateError] = useState("");
  const [expenseShow, setExpenseShow] = useState(false);
  const [checkOnlyPostRetirement, setOnlyPostRetirement] = useState(false);
  const [expenseRecurringTotal, setExpenseRecurringTotal] = useState("");
  const [expenseInflationRate, setExpenseInflationRate] = useState(7);
  const [incomeRetirementPercent, setIncomeRetirementPercent] = useState(0);
  const [incomeFrequencyError, setIncomeFrequencyError] = useState("");
  const [expenseFrequencyError, setExpenseFrequencyError] = useState("");
  const [showIncomeView, setShowIncomeView] = useState(true);
  const [showExpenseView, setShowExpenseView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExpenseCategories, setSelectedExpenseCategories] = useState([]);
  const [deletetoggle, setDeleteToggle] = useState(false);
  const [deletetoggleexpense, setDeleteToggleexpense] = useState(false);
  const [recurringCheckboxCount, setRecurringCheckboxCount] = useState(false);
  const [recurringExpesneCheckboxCount, setRecurringExpenseCheckboxCount] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [parentFpUserId, setParentFpUserId] = useState("");
  const [selfData, setSelfData] = useState({});

  const scrollToRef = () => {
    cntRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToExpenseRef = () => {
    expenseRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const removefixheader = document.querySelector('.d-block .removefixheader');
      const FixdgsubHeader = document.querySelector('.FixdgHeader');
      const FixdgmainHeader = document.querySelector('.DGheaderFix');
      const scrollPosition = window.scrollY;

      if (removefixheader && FixdgsubHeader && FixdgmainHeader) {
        const removefixheaderRect = removefixheader.getBoundingClientRect(); { }
        const threshold = 70;
        if (scrollPosition > 50) {
          setScroll(true)
          FixdgsubHeader.classList.add("DGsubheaderFix");
          if (removefixheaderRect.top <= threshold) {
            FixdgmainHeader.classList.remove("DGmainHeaderFix");
          }
          else {
            FixdgmainHeader.classList.add("DGmainHeaderFix");
          }
        } else {
          setScroll(false);
          FixdgsubHeader.classList.remove("DGsubheaderFix");
          FixdgmainHeader.classList.remove("DGmainHeaderFix");
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);

    };
  }, []);

  const handleClose = (type, form_type) => {
    if (form_type === "income") {
      if (type === "yes") {
        deleteIncome();
      }
      setShow(false);
    } else {
      if (type === "yes") {
        deleteExpense();
        // deleteExpense(selectedExpenseId, deleteExpenseName);
      } else {
        setExpenseShow(false);
      }
      setShow(false);
    }
  };


  const handleShow = () => setShow(true);
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState("");


  useEffect(() => {
    document.body.classList.add("dg-layout");

    const interval = setInterval(() => {
      const bgIncomeExpense = document.getElementById("bg-incomeexpense");
      if (bgIncomeExpense) {
        bgIncomeExpense.style.background = `url(${imagePath}/static/media/DG/bg/income-expenses.svg) no-repeat right top`;
        clearInterval(interval);
        setBackgroundDivImage();
      }
    }, 50);

    if (sessionStorage.getItem("showIncomeToast") === "1") {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(
        'In Income & Expenses section in "Income" Do add Self/Spouse\'s Recurring Income'
      );
      sessionStorage.removeItem("showIncomeToast");
    }

    return () => {
      clearInterval(interval);
      document.body.classList.remove("dg-layout");
    };
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setCurrentUrl(location.pathname);
    }, 100);
  }, [location]);
  const handleExpenseDeletePopup = () => setExpenseShow(true);
  useEffect(() => {
    document.body.classList.add("dg-layout");
    return () => {
      document.body.classList.remove("rp-layout");
    };
  }, []);

  // useEffect(() => {
  //   getMemberList();
  // }, []);

  // useEffect(() => {
  //   setCurrentUrl(location.pathname);
  // }, [location]);

  // useEffect(() => {
  //   const addMonths = (date, months) => {
  //     date.setMonth(date.getMonth() + months);
  //   };
  //   const addYears = (date, years) => {
  //     date.setFullYear(date.getFullYear() + years);
  //   };
  //   const newDate = new Date(incomeStartDate);
  //   switch (Number(incomeFrequency)) {
  //     case 2:
  //       addMonths(newDate, 3);
  //       break;
  //     case 3:
  //       addMonths(newDate, 6);
  //       break;
  //     case 4:
  //       addYears(newDate, 1);
  //       break;
  //     case 1:
  //     default:
  //       addMonths(newDate, 1);
  //   }
  //   newDate.setDate(newDate.getDate() + 1);
  //   setIncomeConditionDate(newDate);


  // }, [incomeEndDate]);

  // useEffect(() => {
  //   const addMonths = (date, months) => {
  //     date.setMonth(date.getMonth() + months);
  //   };
  //   const addYears = (date, years) => {
  //     date.setFullYear(date.getFullYear() + years);
  //   };
  //   const newDate = new Date(incomeStartDate);
  //   switch (Number(incomeFrequency)) {
  //     case 2:
  //       addMonths(newDate, 3);
  //       break;
  //     case 3:
  //       addMonths(newDate, 6);
  //       break;
  //     case 4:
  //       addYears(newDate, 1);
  //       break;
  //     case 1:
  //     default:
  //       addMonths(newDate, 1);
  //   }
  //   newDate.setDate(newDate.getDate() + 1);
  //   setIncomeEndDate(newDate);
  // }, [incomeStartDate]);

  // useEffect(() => {
  //   const addMonths = (date, months) => {
  //     date.setMonth(date.getMonth() + months);
  //   };
  //   const addYears = (date, years) => {
  //     date.setFullYear(date.getFullYear() + years);
  //   };
  //   const newDate = new Date(expenseStartDate);
  //   switch (Number(expenseFrequency)) {
  //     case 2:
  //       addMonths(newDate, 3);
  //       break;
  //     case 3:
  //       addMonths(newDate, 6);
  //       break;
  //     case 4:
  //       addYears(newDate, 1);
  //       break;
  //     case 5:
  //       addYears(newDate, 2);
  //       break;
  //     case 6:
  //       addYears(newDate, 3);
  //       break;
  //     case 7:
  //       addYears(newDate, 4);
  //       break;
  //     case 8:
  //       addYears(newDate, 5);
  //       break;
  //     case 1:
  //     default:
  //       addMonths(newDate, 1);
  //   }
  //   newDate.setDate(newDate.getDate() + 1);
  //   setExpenseConditionDate(newDate);
  // }, [expenseEndDate]);

  // useEffect(() => {
  //   const addMonths = (date, months) => {
  //     date.setMonth(date.getMonth() + months);
  //   };
  //   const addYears = (date, years) => {
  //     date.setFullYear(date.getFullYear() + years);
  //   };
  //   const newDate = new Date(expenseStartDate);
  //   switch (Number(expenseFrequency)) {
  //     case 2:
  //       addMonths(newDate, 3);
  //       break;
  //     case 3:
  //       addMonths(newDate, 6);
  //       break;
  //     case 4:
  //       addYears(newDate, 1);
  //       break;
  //     case 5:
  //       addYears(newDate, 2);
  //       break;
  //     case 6:
  //       addYears(newDate, 3);
  //       break;
  //     case 7:
  //       addYears(newDate, 4);
  //       break;
  //     case 8:
  //       addYears(newDate, 5);
  //       break;
  //     case 1:
  //     default:
  //       addMonths(newDate, 1);
  //   }
  //   newDate.setDate(newDate.getDate() + 1);
  //   setExpenseEndDate(newDate);
  // }, [expenseStartDate]);

  const handleCategoryClick = (current_value, type) => {
    if (type === "income") {
      setIncomeName(current_value.income_cat_name);
      setIncomeCategoryId(current_value.income_id);
      setIncomeCatUUID(current_value.income_cat_uuid)
      setUpdateForm(false);
      setAddForm(true);
      setselectedEndAge(null);

      const { ror = 10, type: incomeTypeOptions, frequency } =
        current_value.details || {};

      // Reset fields with API defaults
      setIncomeAmount("");
      setIncomeAnnualIncrease(Number(ror) || 10);
      setIncomeEndDate(null);
      setIncomeStartDate(new Date());
      setIncomeAmountError("");
      setIncomeTypeError("");
      setIncomeNameError("");
      setEndDateError("");
      setIncomeFrequencyError("");

      // Frequency
      if (Array.isArray(frequency) && frequency.includes("recurring")) {
        setIsRecurring("Recurring");
        setIncomeFrequency("Monthly");
      } else {
        setIsRecurring("One Time");
        setIncomeFrequency("Monthly");
      }

      // Type
      if (Array.isArray(incomeTypeOptions) && incomeTypeOptions.includes("variable")) {
        setIncomeIsFixed("Variable");
        setIncomeType("Variable");
      } else {
        setIncomeIsFixed("Fixed");
        setIncomeType("1");
      }
    } else {
      // 🔵 EXPENSE LOGIC (Now Dynamic)
      setExpenseName(current_value.expense_cat_name);
      setExpenseCategoryId(current_value.expense_id);
      setExpenseCatUUID(current_value.expense_cat_uuid)
      setExpenseId("")
      setselectedEndAge(null);
      setUpdateForm(false);
      setAddForm(true);
      setExpenseForMember(parentFpUserId);
  
      // Extract dynamic details
      const {
        inflation = 7, // similar to ror
        type: expenseTypeOptions,
        frequency,
        start_date_type,
        end_date_type,
      } = current_value.details || {};
  
      // Reset errors & base fields
      setExpenseAmount("");
      setExpenseInflationRate(Number(inflation) || 7);
      setExpenseAmountError("");
      setExpenseEndDateError("");
      setExpenseNameError("");
      setExpenseFrequencyError("");
  
      // Set default start date
      let startDate = new Date();
      let endDate = null;
  
      // Optional dynamic date logic
      if (start_date_type === "retirement") startDate = retirementDate;
      if (end_date_type === "life_expectancy") endDate = lifeExpectancyDate;
  
      setExpenseStartDate(startDate);
      setExpenseEndDate(endDate);
  
      // Frequency (Recurring / One-Time)
      if (Array.isArray(frequency) && frequency.includes("recurring")) {
        setExpenseRecurring("Recurring");
        setExpenseFrequency("Monthly");
      } else {
        setExpenseRecurring("One Time");
        setExpenseFrequency("Monthly");
      }
  
      // Type (Fixed / Variable)
      if (Array.isArray(expenseTypeOptions) && expenseTypeOptions.includes("variable")) {
        setExpenseFixed("Variable");
      } else {
        setExpenseFixed("Fixed");
      }
    }
  };

  const setDate = (date, dateType, form_type) => {
    if (form_type == "income") {
      if (dateType == "startDate") {
        setIncomeStartDate(date);
      } else {
        setIncomeEndDate(date);
        setselectedEndAge(null);
        setIncomeAfterRetirement(null);
        let date1 = moment(incomeStartDate)
          .format("DD/MM/YYYY")
          .split("/")
          .reverse()
          .join("/");
        let date2 = moment(date)
          .format("DD/MM/YYYY")
          .split("/")
          .reverse()
          .join("/");

        var date3 = moment(
          moment(date1).set("month", moment(date1).month() + 1)
        ).format("YYYY/MM/DD");
        var startDate = moment(date1);
        var endDate = moment(date2);
        var monthLaterDate = moment(date3);

      }
    } else {
      if (dateType == "startDate") {
        setExpenseStartDate(date);
      } else {
        setExpenseEndDate(date);
        setselectedEndAge(null);
        setExpenseAfterRetirement(null);
        let date1 = moment(expenseStartDate)
          .format("DD/MM/YYYY")
          .split("/")
          .reverse()
          .join("/");
        let date2 = moment(date)
          .format("DD/MM/YYYY")
          .split("/")
          .reverse()
          .join("/");

        var date3 = moment(
          moment(date1).set("month", moment(date1).month() + 1)
        ).format("YYYY/MM/DD");
        var startDate = moment(date1);
        var endDate = moment(date2);
        var monthLaterDate = moment(date3);
      }
    }
  };

  const resetIncomeForm = () => {
    setIncomeAmount("");
    setIncomeAnnualIncrease(10);
    setIncomeCategoryId("");
    setIncomeCatUUID("");
    setIncomeEndDate("");
    setIncomeFrequency("Monthly");
    setIncomeIsFixed("Variable");
    setIsRecurring("Recurring");
    setIncomeName("Business");
    setSelectedOption("Business");
    setIncomeStartDate(new Date());
    setIncomeType("1");
    setIncomeAmountError("");
    setIncomeTypeError("");
    setIncomeNameError("");
    setEndDateError("");
    setselectedEndAge(null);
    setIncomeFrequencyError("");
    setIncomeFootnote("");
  };

  const resetExpenseForm = () => {
    setExpenseAmount("");
    setExpenseInflationRate(7);
    setExpenseCategoryId("");
    setExpenseCatUUID("");
    setExpenseEndDate("");
    setExpenseFrequency("Monthly");
    setExpenseFixed("Variable");
    setExpenseRecurring("Recurring");
    setExpenseName("Other Expenses");
    setSelectedOption1("Other Expenses");
    setExpenseStartDate(new Date());
    setExpenseAmountError("");
    setExpenseEndDateError("");
    setExpenseNameError("");
    setselectedEndAge(null);
    setExpenseFrequencyError("");
    setExpenseFootnote("");
  };

  const cancelFormData = (e, form_type) => {
    e.preventDefault();
    setUpdateForm(false);
    setAddForm(true);
    if (form_type == "income") {
      setIncomeAmount("");
      setIncomeAnnualIncrease(10);
      setIncomeCategoryId("");
      setIncomeCatUUID("")
      setIncomeEndDate("");
      setIncomeFrequency("Monthly");
      setIncomeIsFixed("Variable");
      setIsRecurring("Recurring");
      setIncomeName("Business");
      setSelectedOption("Business");
      setIncomeStartDate(new Date());
      setIncomeType("1");
      setIncomeAmountError("");
      setIncomeTypeError("");
      setIncomeNameError("");
      setEndDateError("");
      setselectedEndAge(null);
      setIncomeFrequencyError("");
      setIncomeFootnote("");
    } else {
      setExpenseAmount("");
      setExpenseInflationRate(7);
      setExpenseCategoryId("");
      setExpenseCatUUID("");
      setExpenseEndDate("");
      setExpenseFrequency("Monthly");
      setExpenseFixed("Variable");
      setExpenseRecurring("Recurring");
      setExpenseName("Other Expenses");
      setSelectedOption1("Other Expenses");
      setExpenseStartDate(new Date());
      setExpenseAmountError("");
      setExpenseEndDateError("");
      setExpenseNameError("");
      setselectedEndAge(null);
      setExpenseFrequencyError("");
      setExpenseFootnote("");
    }
  };
  const handleIncomeMemberEnddate = (member_data) => {
    let retirement_date = "";
    let life_expectancy_date = "";

    try {
      // Check if member is independent (not dependent)
      if (member_data['isdependent'] === false || member_data['isdependent'] === "0") {
        const dob = moment(member_data['dob'], "DD/MM/YYYY");
        if (dob.isValid()) {
          retirement_date = dob.clone().add(member_data['retirement_age'], "y").format("MM/DD/YYYY");
          life_expectancy_date = dob.clone().add(member_data['life_expectancy'], "y").format("MM/DD/YYYY");
        }
      } else {
        // Use parent's pre-calculated retirement and life expectancy dates
        retirement_date = selfData["retirement_date"];
        life_expectancy_date = selfData["life_expectancy_date"];
      }

      // Set dates to state
      setRetirementDate(retirement_date);
      setLifeExpectancyDate(life_expectancy_date);

      // Handle radio selection for retirement or life expectancy
      if (selectedEndAge === 1 || selectedEndAge === 2) {
        const startDate = moment(incomeStartDate, "DD/MM/YYYY");
        const endDate = moment(
          selectedEndAge === 1 ? retirement_date : life_expectancy_date,
          "MM/DD/YYYY"
        );

        if (!startDate.isValid() || !endDate.isValid()) {
          setEndDateError("Invalid start or end date");
          return;
        }

        if (startDate.isSameOrAfter(endDate)) {
          setEndDateError("End date should be greater than start date");
          return;
        }

        if (startDate.clone().add(1, 'month').isAfter(endDate)) {
          setEndDateError("End date should be at least one month greater than start date");
          return;
        }

        if (selectedEndAge === 1) {
          setIncomeAfterRetirement("Retirement");
          setIncomeEndDate(moment(retirement_date, "MM/DD/YYYY").toDate());
        } else if (selectedEndAge === 2) {
          setIncomeAfterRetirement("Life Expectancy");
          setIncomeEndDate(moment(life_expectancy_date, "MM/DD/YYYY").toDate());
        }
      }
    } catch (error) {
      console.error("handleIncomeMemberEnddate error:", error);
      setEndDateError("Unexpected error occurred while calculating dates.");
    }
  };


  const handleIncomeEndDate = (incomeEndDateType) => {

    setIncomeTypeError("");
    setEndDateError("");

    let endDate = "";
    let compareDate = "";

    if (incomeEndDateType == 1) {
      endDate = retirementDate;
      setIncomeAfterRetirement("Retirement");
    } else if (incomeEndDateType == 2) {
      endDate = lifeExpectancyDate;
      setIncomeAfterRetirement("Life Expectancy");
    }

    setIncomeEndDate(moment(endDate, "MM/DD/YYYY").toDate());

    let date1 = "";
    try {
      date1 = new Date(incomeStartDate.split("/").reverse().join("/"));
    } catch (err) {
      date1 = incomeStartDate;
    }

    try {
      compareDate = new Date(endDate.split("/").reverse().join("/"));
    } catch (err) {
      compareDate = endDate;
    }

    if (date1 > compareDate) {
      setEndDateError("End date should be greater than start date");
    }

    const date3 = new Date(compareDate);
    date3.setMonth(date3.getMonth() - 1);
    if (date1 > date3) {
      setEndDateError(
        "End date should be at least one month greater than start date"
      );
    }
  };


  const handleExpenseMemberEnddate_Old = (member_data) => {
    let retirement_date = ""
    let life_expectancy_date = ""
    if (member_data['isdependent'] == "0") {
      retirement_date = moment(member_data['dob'])
        .add(member_data['retirement_age'], "y")
        .format("MM/DD/YYYY");
      life_expectancy_date = moment(member_data['dob'])
        .add(member_data['life_expectancy'], "y")
        .format("MM/DD/YYYY");
    } else {
      // setRetirementDate(selfData["retirement_date"]);
      // setLifeExpectancyDate(selfData["life_expectancy_date"]);
      retirement_date = selfData["retirement_date"];
      life_expectancy_date = selfData["life_expectancy_date"]
    }
    setRetirementDate(retirement_date);
    setLifeExpectancyDate(life_expectancy_date);
    if (selectedEndAge == 1) {
      setExpenseAfterRetirement("Retirement");
      setExpenseEndDate(retirement_date);
      let date1 = "";
      let date2 = new Date(retirement_date.split("/").reverse().join("/"));
      try {
        date1 = new Date(expenseStartDate.split("/").reverse().join("/"));
      } catch (err) {
        date1 = expenseStartDate;
      }
      if (date1 > date2) {
        setEndDateError("End date should be greater than start date");
      }
      var date3 = date2.setMonth(date2.getMonth() + 1);
      if (date1 > date3) {
        setEndDateError(
          "End date should be atleast one month greater than start date"
        );
      }
    } else if (selectedEndAge == 2) {
      setExpenseAfterRetirement("Life Expectancy");
      setExpenseEndDate(life_expectancy_date);
      let date1 = "";
      let date2 = new Date(life_expectancy_date.split("/").reverse().join("/"));
      try {
        date1 = new Date(expenseStartDate.split("/").reverse().join("/"));
      } catch (err) {
        date1 = expenseStartDate;
      }
      if (date1 > date2) {
        setEndDateError("End date should be greater than start date");
      }
      var date3 = date2.setMonth(date2.getMonth() + 1);
      if (date1 > date3) {
        setEndDateError(
          "End date should be atleast one month greater than start date"
        );
      }
    }

  };

  const handleExpenseMemberEnddate = (member_data) => {

    let retirement_date = "";
    let life_expectancy_date = "";

    if (member_data['isdependent'] === false && member_data['retirement_age'] > 0 && member_data['life_expectancy'] > 0) {
      retirement_date = moment(member_data['dob'], "DD/MM/YYYY")
        .add(member_data['retirement_age'], "y")
        .format("MM/DD/YYYY");
      life_expectancy_date = moment(member_data['dob'], "DD/MM/YYYY")
        .add(member_data['life_expectancy'], "y")
        .format("MM/DD/YYYY");
    } else if (selfData["retirement_date"] && selfData["life_expectancy_date"]) {
      retirement_date = selfData["retirement_date"];
      life_expectancy_date = selfData["life_expectancy_date"];
    } else {
      console.error("Invalid retirement or life expectancy data.");
      setEndDateError("Invalid retirement or life expectancy data.");
      return;
    }

    setRetirementDate(retirement_date);
    setLifeExpectancyDate(life_expectancy_date);

    if (selectedEndAge === 1) {
      setExpenseAfterRetirement("Retirement");
      setExpenseEndDate(retirement_date);

      const date1 = moment(expenseStartDate, "DD/MM/YYYY");
      const date2 = moment(retirement_date, "MM/DD/YYYY");

      if (!date1.isValid() || !date2.isValid() || date1.isSameOrAfter(date2)) {
        setEndDateError("End date should be greater than start date");
        return;
      }

      if (date1.clone().add(1, "month").isAfter(date2)) {
        setEndDateError("End date should be at least one month greater than start date");
        return;
      }
    } else if (selectedEndAge === 2) {
      setExpenseAfterRetirement("Life Expectancy");
      setExpenseEndDate(life_expectancy_date);

      const date1 = moment(expenseStartDate, "DD/MM/YYYY");
      const date2 = moment(life_expectancy_date, "MM/DD/YYYY");

      if (!date1.isValid() || !date2.isValid() || date1.isSameOrAfter(date2)) {
        setEndDateError("End date should be greater than start date");
        return;
      }

      if (date1.clone().add(1, "month").isAfter(date2)) {
        setEndDateError("End date should be at least one month greater than start date");
        return;
      }
    }
  };



  const handleExpenseEndDate = (expenseEndDateType) => {
    setExpenseEndDateError("");

    if (expenseEndDateType == 1) {
      setExpenseAfterRetirement("Retirement");
      setExpenseEndDate(retirementDate);
      let date1 = "";
      let date2 = new Date(retirementDate.split("/").reverse().join("/"));
      try {
        date1 = new Date(expenseStartDate.split("/").reverse().join("/"));
      } catch (err) {
        date1 = expenseStartDate;
      }
      if (date1 > date2) {
        setEndDateError("End date should be greater than start date");
      }
      var date3 = date2.setMonth(date2.getMonth() + 1);
      if (date1 > date3) {
        setEndDateError(
          "End date should be atleast one month greater than start date"
        );
      }
    }
    if (expenseEndDateType == 2) {

      setExpenseAfterRetirement("Life Expectancy");
      setExpenseEndDate(lifeExpectancyDate);
      let date1 = "";
      let date2 = new Date(lifeExpectancyDate.split("/").reverse().join("/"));
      try {
        date1 = new Date(expenseStartDate.split("/").reverse().join("/"));
      } catch (err) {
        date1 = expenseStartDate;
      }
      if (date1 > date2) {
        setEndDateError("End date should be greater than start date");
      }
      var date3 = date2.setMonth(date2.getMonth() + 1);
      if (date1 > date3) {
        setEndDateError(
          "End date should be atleast one month greater than start date"
        );
      }
    }
  };
  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  // const handleIncomeType = (incometype) => {
  //   if (incometype == "2") {
  //     setIncomeType("2");
  //     setIncomeFrequency("4");
  //   } else {
  //     setIncomeType("1");

  //     setIncomeFrequency("Monthly");
  //   }
  // };

  useEffect(() => {
    if (incomeData) {
      let count = 0;
      incomeData.forEach(entry => {
        if (selectedCategories.includes(entry.id)) {
          if (entry.income_isRecurring === true) {
            count++;
          }
        }
      });
      setRecurringCheckboxCount(count)
    }
  }, [selectedCategories]);

  const deleteIncome = async () => {
    setIsLoading(true);

    if (!selectedCategories.length) return;

    const selectedIncomeItems = incomeData.filter(income =>
      selectedCategories.includes(income.name)
    );

    const incomeIds = selectedIncomeItems.map(income => income.name);
    const dataBelongsTo = selectedIncomeItems[0]?.user_income_belongs_to || DATA_BELONGS_TO;
    const userId = selectedIncomeItems[0]?.user_income_user_id;

    const payload = {
      user_id: userId,
      income_id: incomeIds,
      data_belongs_to: dataBelongsTo,
    };

    try {
      const decoded_res = await deleteIncomeDetails(payload);

      if (decoded_res && decoded_res.status_code === "200") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("Data Deleted Successfully");
        setIsDataLoading(true);
        setIncomeData([]);
        await getIncomeDetailsss();
        resetIncomeForm();
        setSelectedCategories([]);
        setShow(false);
      } else {
        toastr.error(decoded_res.data || "Something went wrong.");
        setShow(false);
      }
    } catch (error) {
      console.error("Delete Income Error:", error);
      toastr.error("Failed to delete income.");
      setShow(false);
    } finally {
      setIsLoading(false);
      setIsDataLoading(false);
    }
  };


  useEffect(() => {
    if (isRecurring == "One Time" && incomeId == "") {
      const currentDate = new Date();
      setIncomeStartDate(currentDate);
    }
  }, [isRecurring]);

  useEffect(() => {
    if (expenseId == "") {
      const currentDate = new Date(); 
      if (expenseCatUUID == "post_retirement_expense") {
        setExpenseStartDate(retirementDate);
      } else {
        setExpenseStartDate(currentDate);
      }
    }
  }, [expenseCatUUID,isExpenseRecurring]);

  const checkprofile = async () => {
    try {
      var res = await CheckProfileStatus(getParentUserId());
      if (res['error_code'] == '100') {
        dispatch({ type: "UPDATE_PROFILE", payload: res['data'] });
        const profile_completed_mapping = {
          17: 117.496,
          50: 70.4973,
          67: 46.9982,
          83: 23.4991,
          100: 0
        };

        const profile_completed = res['data'][13]['profile_completed'] === 66 ? 67 : res['data'][13]['profile_completed'];
        const sectionIdsToCheck = [1, 3, 5, 6, 7, 8];
        const allConditionsMet = sectionIdsToCheck.every((sectionId) => {
          const matchingEntry = res["data"].find(
            (entry) => entry.section_id === sectionId
          );
          return matchingEntry && matchingEntry.total > 0;
        });

        const sectionIdsToCheckk = [1, 3];
        const allConditionsMett = sectionIdsToCheckk.every((sectionId) => {
          const matchingEntryy = res["data"].find(
            (entry) => entry.section_id === sectionId
          );
          return matchingEntryy && matchingEntryy.total > 0;
        });

        let newNumber;
        if (allConditionsMet) {
          newNumber = "1";
        } else {
          newNumber = "0";
        }

        let newNumberr;
        if (allConditionsMett) {
          newNumberr = "1";
        } else {
          newNumberr = "0";
        }
        const sectionTextMap = {
          1: "About You",
          3: "About You",
          5: "Goals",
          6: "Income & Expenses",
          7: "Income & Expenses",
          8: "Assets & Liabilities",
        };

        const filteredData = res["data"].filter((item) =>
          [1, 3, 5, 6, 7, 8].includes(item.section_id)
        );

        const sectionsWithTotalZeroTextArray = filteredData
          .filter((item) => item.total === 0)
          .map((item) => sectionTextMap[item.section_id]);

        const uniqueSectionsWithTotalZeroTextArray = [
          ...new Set(sectionsWithTotalZeroTextArray),
        ];
        const sectionsWithTotalZeroText =
          uniqueSectionsWithTotalZeroTextArray.join(", ");

        if (
          uniqueSectionsWithTotalZeroTextArray.includes("About You") &&
          uniqueSectionsWithTotalZeroTextArray.includes("Income & Expenses") &&
          uniqueSectionsWithTotalZeroTextArray.includes("Assets & Liabilities")
        ) {
          sessionStorage.setItem('showAboutYouToast', '1')
          window.location.href = process.env.PUBLIC_URL + "/datagathering/about-you"

        } else if (uniqueSectionsWithTotalZeroTextArray.includes("About You")) {
          sessionStorage.setItem('showAboutYouToast', '1')
          window.location.href = process.env.PUBLIC_URL + "/datagathering/about-you"

        }
      }
    } catch (e) {
      console.error("eeee---->", e);
    }
  };

  useEffect(() => {
    if (expenseData) {
      let count = 0;
      expenseData.forEach(entry => {
        if (selectedExpenseCategories.includes(entry.name)) {
          if (entry.expense_cat_id !== "post_retirement_expense" && entry.user_expense_occurance === "Recurring") {
            count++;
          }
        }
      });
      setRecurringExpenseCheckboxCount(count)
    }
  }, [selectedExpenseCategories]);


  const deleteExpense = async (id, name) => {
    // if (id != "") {
    if (!selectedExpenseCategories.length) return;
    const selectedExpenseItems = expenseData.filter(expense =>
      selectedExpenseCategories.includes(expense.name)
    );

    const expenseIds = selectedExpenseItems.map(expense => expense.name);
    const dataBelongsTo = selectedExpenseItems[0]?.user_expense_belongs_to || DATA_BELONGS_TO;
    const userId = selectedExpenseItems[0]?.user_expense_user_id;

    const payload = {
      user_id: userId,
      expense_id: expenseIds,
      data_belongs_to: dataBelongsTo,
    };

    // var payload = {
    //   expense_id: selectedExpenseCategories,
    //   user_id: getParentUserId()
    // };
    // var payload = commonEncode.encrypt(JSON.stringify(payload));
    // var res = await apiCall(
    //   BASE_API_URL + "restapi/removeexpensesdata/",
    //   payload,
    //   false,
    //   false
    // );
    try {
      let decoded_res = await deleteExpenseDetails(payload);
      // let decoded_res = JSON.parse(commonEncode.decrypt(res));
      if (decoded_res) {
        if (decoded_res.status_code === "200") {
          toastr.options.positionClass = "toast-bottom-left";
          // toastr.success(name + " Data Deleted Successfully");
          toastr.success(" Data Deleted Successfully");
          // dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          setIsDataLoading(true);
          setExpenseData([]);
          await getExpenseDetailsss();
          // getExpenseData("", 0);
          resetExpenseForm();
          setSelectedExpenseCategories([]);
          setExpenseShow(false);
        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(decoded_res.data);
          setExpenseShow(false);
        }
        // }
      }
    } catch (error) {
      console.error("Delete Expense Error:", error);
      toastr.error("Failed to delete expense.");
      setExpenseShow(false);
    } finally {
      setIsLoading(false);
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    checkprofile();
    getFamilyMembers();
    getIncomeDetailsss();
    getExpenseDetailsss();
  }, [])

  // 

  const getIncomeDetailsss = async () => {
    setIsDataLoading(true);
    try {
      const res = await getIncomeDetails(user_data.user_id);
      if (res.status_code == "200") {
        if (res.data.length === 1) {
          setRecurFlag(res.data[0]["income_isRecurring"]);
        }
        setIncomeData(res.data);
        setLifecycleStatus(res.lifecycle_status);

        if (res.data.length > 0) {
          setTotalIncome(res.yearly_income.income);
        } else {
          setTotalIncome(0)
        }

        if (res.lifecycle_status === 2) {
          const recurringCount = res.data.filter((item) => item.income_isRecurring).length;
          setRecurringTotal(recurringCount);
        }
      } else if (res.status_code == "404") {
        setTotalIncome(0)
      }
    } catch (e) {
      console.error("getIncomeDetailsss error:", e);
    } finally {
      setIsDataLoading(false);
    }
  };

  const getExpenseDetailsss = async () => {
    setIsDataLoading(true);
    try {
      const res = await getExpenseDetails(user_data.user_id);
      if (res.status_code === 200) {
        if (res.data.length === 1) {
          setRecurFlag(res.data[0]["user_expense_occurance"] === "Recurring");
        }
        setExpenseData(res.data);
        setLifecycleStatus(res.lifecycle_status);

        if (res.data.length > 0) {
          setTotalExpense(res.yearly_income.expense);
        } else {
          setTotalExpense(0);
        }

        if (res.lifecycle_status === 2) {
          const recurringCount = res.data.filter((item) => item.user_expense_occurance === "Recurring").length;
          setRecurringTotal(recurringCount);
        }
      }
    } catch (e) {
      console.error("getExpenseDetailsss error:", e);
    } finally {
      setIsDataLoading(false);
    }
  };




  // const getMemberList = async () => {
  //   try {
  //     let url = '';
  // let url = CHECK_SESSION;
  //     let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

  //     let session_data = await apiCall(url, data, true, false);
  //     try {
  //       var retire_data = {
  //         fp_log_id: getParentFpLogId(),
  //         fp_user_id: getParentUserId(),
  //       }
  //       if (session_data) {
  //         var retirement_date = moment(session_data["data"]["user_details"]['dob'])
  //           .add(session_data["data"]["user_details"]['retirement_age'], "y")
  //           .format("MM/DD/YYYY");
  //         var life_expectancy_date = moment(session_data["data"]["user_details"]['dob'])
  //           .add(session_data["data"]["user_details"]['life_expectancy'], "y")
  //           .format("MM/DD/YYYY");

  //         setRetirementDate(retirement_date);
  //         setLifeExpectancyDate(life_expectancy_date);
  //         setSelfData({ 'retirement_date': retirement_date, 'life_expectancy_date': life_expectancy_date })
  //       }
  //       // }
  //     }
  //     catch (e) {
  //       // console.log(e);
  //     }

  //     // if (session_data.error_code == "100") {
  //     // setIsLoading(false)
  //     checkprofile(session_data);
  //     setPlanDate(session_data.data.plan_date);
  //     // if (fplogid) {

  //     setIsDataLoading(true);
  //     var decoded_res = await getIncomeDetails(user_data.user_id);
  //     await new Promise((resolve, reject) => setTimeout(resolve, 2000));
  //     setIsDataLoading(false);
  //     if (decoded_res.data.length == 1) {
  //       setRecurFlag(decoded_res.data[0]["income_isRecurring"]);
  //     }
  //     if (decoded_res["error_code"] == "100") {
  //       setIncomeData(decoded_res.data);
  //       var totalIncome = decoded_res.yearly_income.income;
  //       if (decoded_res.data.length > 0) {
  //         setTotalIncome(decoded_res.yearly_income.income);
  //       }
  //       setLifecycleStatus(decoded_res.lifecycle_status);
  //       if (decoded_res.lifecycle_status == 2) {
  //         const recurringCount = decoded_res.data.filter(
  //           (item) => item.income_isRecurring
  //         ).length;
  //         setRecurringTotal(recurringCount);
  //       }
  //     }
  //     var payload2 = {
  //       user_id: getParentUserId(),
  //       fp_log_id: getParentFpLogId(),
  //       expenses_forretirement: "0",
  //     };
  //     var payload2 = commonEncode.encrypt(JSON.stringify(payload2));

  //     var res2 = await apiCall(
  //       BASE_API_URL + "restapi/getexpensesdata/",
  //       payload2,
  //       false,
  //       false
  //     );
  //     let decoded_res2 = JSON.parse(commonEncode.decrypt(res2));
  //     if (decoded_res2["error_code"] == 100) {
  //       // setIsLoading(false);
  //       setExpenseData(decoded_res2.data);
  //       if (decoded_res2.data.length > 0) {
  //         setTotalExpense(decoded_res2.yearly_expense.expense);
  //       } else {
  //         setTotalExpense(0);
  //       }
  //       var totalExpense = decoded_res2.yearly_expense.expense;
  //       let incomeRetirementPercent =
  //         ((totalIncome - totalExpense) / totalIncome) * 100;
  //       setIncomeRetirementPercent(incomeRetirementPercent);
  //       setLifecycleStatus(decoded_res2.lifecycle_status);
  //       if (decoded_res2.lifecycle_status == 2) {
  //         const expense_recurringCount = decoded_res2.data.filter(
  //           (item) =>
  //             item.expenses_isRecurring &&
  //             item.expenses_category_id !== "121"
  //         ).length;
  //         setExpenseRecurringTotal(expense_recurringCount);
  //       }

  //       var expenses = decoded_res2.data;
  //       if (expenses.length == 1 && expenses[0]['expenses_category_id'] == "121") {
  //         setOnlyPostRetirement(true);
  //       }
  //     }
  //     // }
  //     // } else {
  //     // setIsLoading(false)

  //     // loginRedirectGuest();
  //     // }
  //   } catch (e) {
  //     // console.log("err", e);
  //   }
  // };



  const getFamilyMembers = async () => {
    try {
      let member_data = await getFamilyMember(user_data.user_id);
      let member_user_id = "";
      if (member_data.status_code == "200") {
        let member_array = [];
        let members = member_data["data"];

        members.map((member) => {
          const isSelf = member.relation_id === 1 || member.relation === "Self";

          if (isSelf) {
            // Self entry
            member_array.push({
              value: member.user_id,
              label: "Self",
              retirement_age: String(member.retirement_age),
              dob: member.dob,
              life_expectancy: String(member.life_expectancy_age),
              isdependent: member.is_dependent ? "1" : "0",
              name: member.user_name,
            });

            // Defaults
            setIncomeForMember(member.user_id);
            setExpenseForMember(member.user_id);
            member_user_id = member.user_id;
            setParentFpUserId(member.user_id);
            
            member_array.push({
              value: 0, // ⚡ Use a string so it’s unique and safe
              label: "Family",
              retirement_age: String(member.retirement_age),
              dob: member.dob,
              life_expectancy: String(member.life_expectancy_age),
              isdependent: member.is_dependent ? "1" : "0",
            });

            // Retirement & Life Expectancy Dates
            const hasValidDob =
              member.dob &&
              typeof member.dob === "string" &&
              member.dob.includes("/") &&
              member.retirement_age > 0 &&
              member.life_expectancy_age > 0;

            if (hasValidDob) {
              const dobMoment = moment(member.dob, "DD/MM/YYYY");

              const retirement_date = dobMoment
                .clone()
                .add(member.retirement_age, "years")
                .format("MM/DD/YYYY");

              const life_expectancy_date = dobMoment
                .clone()
                .add(member.life_expectancy_age, "years")
                .format("MM/DD/YYYY");

              setRetirementDate(retirement_date);
              setLifeExpectancyDate(life_expectancy_date);

              setSelfData({
                retirement_date,
                life_expectancy_date,
              });
            } else {
              setRetirementDate(null);
              setLifeExpectancyDate(null);
              setSelfData({
                retirement_date: null,
                life_expectancy: null,
              });
            }
          } else {
            // Other members
            member_user_id = member.user_id;
            member_array.push({
              value: member.user_id,
              label: member.user_name,
              retirement_age: String(member.retirement_age),
              dob: member.dob,
              life_expectancy: String(member.life_expectancy_age),
              isdependent: member.is_dependent ? "1" : "0",
            });
          }
        });

        // Always add "Family" entry
        
        setFamilyData(member_array);
        // setExpenseForMember(member_user_id);
      } else {
        setFamilyData([]);
      }
    } catch (error) {
      console.error("Error fetching family members", error);
    }
  };


  const resetIncomeFormField = () => {
    let member_data = familyData;
    for (let i = 0; i < member_data.length; i++) {
      if (member_data[i]['label'] == 'Self') {
        setIncomeForMember(member_data[i]['value']);

        return;
      }
    }

  };

  const frequencyChange = () => {
    if (selectedEndAge !== 1 && selectedEndAge !== 2) {
      // const newDate = new Date(incomeStartDate);
      var d1 = moment(incomeStartDate, "DD/MM/YYYY");
      var d2 = moment(incomeEndDate, "DD/MM/YYYY");
      if (incomeEndDate) {
        switch (Number(incomeFrequency)) {
          case 2:
            if (moment(d2).diff(d1, "months") < 3) {
              setIncomeEndDate(moment(incomeStartDate, "DD/MM/YYYY").add(3, 'month'));
              setIncFrequency(3)
            }
            else {
              setIncFrequency(3)
            }
            break;
          case 3:
            if (moment(d2).diff(d1, "months") < 6) {
              setIncomeEndDate(moment(incomeStartDate, "DD/MM/YYYY").add(6, 'month'));
              setIncFrequency(6)
            }
            else {
              setIncFrequency(6)
            }
            break;
          case 4:
            if (moment(d2).diff(d1, "year") < 1) {
              setIncomeEndDate(moment(incomeStartDate, "DD/MM/YYYY").add(1, 'year'));
              setIncFrequency(12)
            }
            else {
              setIncFrequency(12)
            }
            break;
          case 1:
          default:
            if (moment(d2).diff(d1, "months") < 1) {
              setIncomeEndDate(moment(incomeStartDate, "DD/MM/YYYY").add(1, 'month'));
              setIncFrequency(1)
            }
            else {
              setIncFrequency(1)
            }
            break;
        }
      } else {
        setIncomeEndDate(moment(incomeStartDate, "DD/MM/YYYY").add(1, 'month'));
      }
      // newDate.setDate(newDate.getDate() + 1);
      // setIncomeEndDate(newDate);
    }
  };

  const expFrequencyChange = () => {
    if (selectedEndAge !== 1 && selectedEndAge !== 2) {
      // const newDate = new Date(incomeStartDate);
      var d1 = moment(expenseStartDate, "DD/MM/YYYY");
      var d2 = moment(expenseEndDate, "DD/MM/YYYY");
      if (incomeEndDate) {
        switch (Number(expenseFrequency)) {
          case 2:
            if (moment(d2).diff(d1, "months") < 3) {
              setExpenseEndDate(moment(expenseStartDate, "DD/MM/YYYY").add(3, 'month'));
              setExpFrequency(3)
            }
            else {
              setExpFrequency(3)
            }
            break;
          case 3:
            if (moment(d2).diff(d1, "months") < 6) {
              setExpenseEndDate(moment(expenseStartDate, "DD/MM/YYYY").add(6, 'month'));
              setExpFrequency(6)
            }
            else {
              setExpFrequency(6)
            }
            break;
          case 4:
            if (moment(d2).diff(d1, "year") < 1) {
              setExpenseEndDate(moment(expenseStartDate, "DD/MM/YYYY").add(1, 'year'));
              setExpFrequency(12)
            }
            else {
              setExpFrequency(12)
            }
            break;
          case 5:
            if (moment(d2).diff(d1, "year") < 2) {
              setExpenseEndDate(moment(expenseStartDate, "DD/MM/YYYY").add(2, 'year'));
              setExpFrequency(24)
            }
            else {
              setExpFrequency(24)
            }
            break;
          case 6:
            if (moment(d2).diff(d1, "year") < 3) {
              setExpenseEndDate(moment(expenseStartDate, "DD/MM/YYYY").add(3, 'year'));
              setExpFrequency(36)
            }
            else {
              setExpFrequency(36)
            }
            break;
          case 7:
            if (moment(d2).diff(d1, "year") < 4) {
              setExpenseEndDate(moment(expenseStartDate, "DD/MM/YYYY").add(4, 'year'));
              setExpFrequency(48)
            }
            else {
              setExpFrequency(48)
            }
            break;
          case 8:
            if (moment(d2).diff(d1, "year") < 5) {
              setExpenseEndDate(moment(expenseStartDate, "DD/MM/YYYY").add(5, 'year'));
              setExpFrequency(60)
            }
            else {
              setExpFrequency(60)
            }
            break;
          case 1:
          default:
            if (moment(d2).diff(d1, "months") < 1) {
              setExpenseEndDate(moment(expenseStartDate, "DD/MM/YYYY").add(1, 'month'));
              setExpFrequency(1)
            }
            else {
              setExpFrequency(1)
            }
            break;
        }
      } else {
        setExpenseEndDate(moment(expenseStartDate, "DD/MM/YYYY").add(1, 'month'));
      }
      // newDate.setDate(newDate.getDate() + 1);
      // setIncomeEndDate(newDate);
    }
  };

  const addMonths = (date, months) => {
    date.setMonth(date.getMonth() + months);
  };

  const addYears = (date, years) => {
    date.setFullYear(date.getFullYear() + years);
  };

  useEffect(() => {
    frequencyChange();
  }, [incomeFrequencyChange, incomeEndDate]);

  useEffect(() => {
    expFrequencyChange();
  }, [expenseFrequencyChange, expenseEndDate]);

  const checkIncomeAmount = (incomeInput) => {
    const value = incomeInput.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.');
    setIncomeAmount(value);

    if (value) {
      if (parseInt(value) < 1) {
        setIncomeAmountError("Please enter net income value greater than 1.");
        scrollToRef();
      }
      else if (value.startsWith('0')) {
        setIncomeAmountError("Please enter net income value greater than 1.");
        scrollToRef();
      }
      else {

        if (/^\d+$/.test(value)) {
          setIncomeAmountError("");
        } else {
          setIncomeAmountError("Please enter valid net income value");
          scrollToRef();
        }
      }
    } else {
      setIncomeAmountError("Please enter net income value");
      scrollToRef();
    }
  };
  const checkExpenseAmount = (expenseInput) => {
    const value = expenseInput.target.value.replace(/[^0-9.]/g, '').split('.').map((part, i) => i === 0 ? part.slice(0, 9) : part.slice(0, 2)).join('.');
    setExpenseAmount(value);

    if (value) {
      if (parseInt(value) < 1) {
        setExpenseAmountError(
          "Please enter a value greater than or equal to 1."
        );
        scrollToExpenseRef();
      }
      else if (value.startsWith('0')) {
        setExpenseAmountError("Please enter net income value greater than 1.");
        scrollToRef();
      }
      else {
        if (/^[0-9]+\b$/.test(value)) {
          setExpenseAmountError("");
        } else {
          setExpenseAmountError("Please enter valid expense value");
          scrollToExpenseRef();
        }
      }
    } else {
      setExpenseAmountError("Please enter expense value");
      scrollToExpenseRef();
    }
  };

  const getIncomeData = async (id = "", check_first_save = 0) => {

    setIsDataLoading(true);

    try {
      const res = await getIncomeDetails(user_data.user_id);
      switch (res.status_code) {
        case "200":
          const incomeList = res.data || [];
          setIncomeData(incomeList);
          setLifecycleStatus(res.lifecycle_status);

          if (incomeList.length === 1) {
            setRecurFlag(incomeList[0].income_isRecurring);
          }

          if (incomeList.length > 0) {
            setTotalIncome(res.yearly_income.income);
          } else {
            setTotalIncome(0);
          }

          if (res.lifecycle_status === 2) {
            const recurringCount = incomeList.filter(item => item.income_isRecurring).length;
            setRecurringTotal(recurringCount);
          }

          if (id !== "") {
            const income = incomeList.find(item => item.name === id);
            if (income) {
              const formatDate = (dateStr) => {
                return dateStr?.substr(3, 2) + "/" + dateStr?.substr(0, 2) + "/" + dateStr?.substr(6, 4);
              };
              const startDate = formatDate(income.user_income_start_date);
              const endDate = formatDate(income.user_income_end_date) || startDate;

              setIncomeName(income.user_income_name);
              setIncomeAmount(income.user_income_amount);
              setIncomeCategoryId(income.income_cat_id);
              setIncomeCatUUID(income.income_cat_uuid)
              setSelectedOption(income.income_category_type);
              const [startDay, startMonth, startYear] = income.user_income_start_date.split('/');
              const correctedStartDate = new Date(`${startYear}-${startMonth}-${startDay}`);
              setIncomeStartDate(correctedStartDate);
              setIncomeEndDate(income.user_income_end_date);
              setIncomeForMember(income.user_income_for);
              setIncomeFrequency(income.user_income_freq);
              setIncomeIsFixed(income.user_income_type);
              setIsRecurring(income.user_income_occurance);
              setIncomeType(income.user_income_type);
              setIncomeFootnote(income.user_income_remarks || "");
              setIncomeAnnualIncrease(income.user_income_growth_rate);
              setIncomeAfterRetirement(income.user_income_valid_till)
              setIncomeId(id);

              if (income.user_income_occurance == "Recurring") {
                const retDate = moment(retirementDate).format("DD/MM/YYYY");
                const lifeExpDate = moment(lifeExpectancyDate).format("DD/MM/YYYY");

                if (income.user_income_valid_till == "Life Expectancy") {
                  setselectedEndAge(income.user_income_end_date === lifeExpDate ? 2 : null);
                  handleIncomeEndDate(2)
                } else if (income.user_income_valid_till == "Retirement") {
                  setselectedEndAge(income.user_income_end_date === retDate ? 1 : null);
                  handleIncomeEndDate(1)
                } else {
                  setselectedEndAge(null);
                }
              } else {
                setIncomeEndDate(null);
                setIncomeFrequency("Monthly");
                setselectedEndAge(null);
              }

              toastr.success(
                `You can now edit details for ${income.income_category_type} - ${income.user_income_name}`
              );
            }
          }

          if (
            check_first_save === 1 &&
            incomeList.length === 1 &&
            expenseData.length >= 1
          ) {
            localStorage.setItem("incomeExpenseCookie", 1);
          } else {
            localStorage.removeItem("incomeExpenseCookie");
          }

          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          break;
        case "404": setTotalIncome(0);
        case "400":
        case "422":
        case "500":
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(response.message);
          break;
      }
    }
    catch (error) {
      console.error("getIncomeData error:", error);
    } finally {
      setIsDataLoading(false);
    }
  };


  const getExpenseData = async (id, check_first_save = 0) => {
    if (id != "") {
      // var payload = {
      //   id: id,
      // };

      // var payload = commonEncode.encrypt(JSON.stringify(payload));
      // var res = await apiCall(
      //   BASE_API_URL + "restapi/getexpensesdata/",
      //   payload,
      //   false,
      //   false
      // );
      let decoded_res = await getExpenseDetails(user_data.user_id);
      // let decoded_res = JSON.parse(commonEncode.decrypt(res));
      if (decoded_res) {

        setIsLoading(false);
        let expenseList = decoded_res.data || [];
        var expense = expenseList.filter(item => item.name === id)[0];

        var category_name = expense_options.filter((exp) => {
          return exp.expense_id === expense.expense_cat_id;
        });
        // var category_name = expense_options.filter((exp) => {
        //   return exp.id == expenseCategoryId;
        // });

        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          "You can now edit details for " +
          expense.expense_category_type +
          " - " +
          expense.user_expense_name
        );

        // var expenseStartDateChanged =
        //   expense.user_expense_start_date.substr(3, 2) +
        //   "/" +
        //   expense.user_expense_start_date.substr(0, 2) +
        //   "/" +
        //   expense.user_expense_start_date.substr(6, 4);

        // var expenseEndDateChanged = expense.user_expense_end_date
        //   ? expense.user_expense_end_date.substr(3, 2) +
        //   "/" +
        //   expense.user_expense_end_date.substr(0, 2) +
        //   "/" +
        //   expense.user_expense_end_date.substr(6, 4)
        //   : expenseStartDateChanged;

        var cleanedExpenseName = expense.name;

        setExpenseName(expense.user_expense_name);
        setExpenseAmount(expense.user_expense_amount);
        setExpenseInflationRate(expense.user_expense_growth_rate);
        setExpenseCategoryId(expense.expense_cat_id);
        setExpenseCatUUID(expense.expense_cat_uuid);
        setSelectedOption1(expense.user_expense_name);
        const [startDay, startMonth, startYear] = expense.user_expense_start_date.split('/');
        const correctedStartDate = new Date(`${startYear}-${startMonth}-${startDay}`);
        setExpenseStartDate(correctedStartDate);
        const [endDay, endMonth, endYear] = expense.user_expense_end_date.split('/');
        const correctedEndDate = new Date(`${endYear}-${endMonth}-${endDay}`);
        setExpenseEndDate(correctedEndDate);
        setExpenseFootnote(expense.user_expense_remarks || "");
        setExpenseForMember(expense.user_expense_for);
        setExpenseFrequency(expense.user_expense_freq);
        setExpenseFixed(expense.user_expense_type);
        setExpenseRecurring(expense.user_expense_occurance);
        // setExpenseInflationRate(expense.user_expense_growth_rate);
        setExpenseAfterRetirement(expense.user_expense_valid_till);
        setExpenseId(id);
        if (expense.user_expense_occurance == "Recurring") {
          const retDate = moment(retirementDate).format("DD/MM/YYYY");
          const lifeExpDate = moment(lifeExpectancyDate).format("DD/MM/YYYY");

          if (expense.user_expense_valid_till == "Life Expectancy") {
            setselectedEndAge(expense.user_expense_end_date === lifeExpDate ? 2 : null);
            handleExpenseEndDate(2)
          } else if (expense.user_expense_valid_till == "Retirement") {
            setselectedEndAge(expense.user_expense_end_date === retDate ? 1 : null);
            handleExpenseEndDate(1)
          } else {
            setselectedEndAge(null);
          }
          // 
          // 
          // 

          // if (!expense.expenses_isAfterRetirement) {
          //   setselectedEndAge(null);
          // }
          // var retirementDateChanged =
          //   moment(retirementDate).format("DD/MM/YYYY");
          // var lifeExpectancyDateChanged =
          //   moment(lifeExpectancyDate).format("DD/MM/YYYY");
          // if (expense.expenses_isAfterRetirement == "1") {
          //   if (expense.user_expense_end_date == lifeExpectancyDateChanged) {
          //     setselectedEndAge(2);
          //   } else {
          //     setselectedEndAge(null);
          //   }
          // }
          // if (expense.expenses_isAfterRetirement == "0") {
          //   if (expense.user_expense_end_date == retirementDateChanged) {
          //     setselectedEndAge(1);
          //   } else {
          //     setselectedEndAge(null);
          //   }
          // }
          // setExpenseEndDate(expenseEndDateChanged);

          // setExpenseFrequency(
          //   expense.user_expense_freq != "0"
          //     ? expense.user_expense_freq
          //     : "1"
          // );
          // 
          // 
          // 

        } else {
          setExpenseEndDate(null);
          setselectedEndAge(null);
          setExpenseFrequency("Monthly");
        }
        setExpenseForMember(expense.user_expense_for);
        // setExpenseFrequency(expense.expenses_frequency);
        setExpenseFixed(expense.user_expense_type);
        // setUpdateForm(true)
        // setAddForm(false)

        setExpenseRecurring(expense.user_expense_occurance);

      }
    }
    else {
      // var payload = {
      //   user_id: getParentUserId(),
      //   // fp_log_id: fplogid,
      //   // expenses_forretirement: "0",
      // };
      // var payload = commonEncode.encrypt(JSON.stringify(payload));
      // var res = await apiCall(
      //   BASE_API_URL + "restapi/getexpensesdata/",
      //   payload,
      //   false,
      //   false
      // );
      let decoded_res = await getExpenseDetails(getParentUserId());
      // let decoded_res = JSON.parse(commonEncode.decrypt(res));
      if (decoded_res) {
        setIsLoading(false);
        setExpenseData(decoded_res.data);

        if (decoded_res.data.length > 0) {
          setTotalExpense(decoded_res.yearly_income?.expense || 0);
        } else {
          setTotalExpense(0);
        }
        var expenseLength = decoded_res.data.length;
        setLifecycleStatus(decoded_res.lifecycle_status);
        if (decoded_res.lifecycle_status == 2) {
          const expense_recurringCount = decoded_res.data.filter(
            (item) =>
              item.user_expense_occurance === "Recurring" && item.expense_cat_id !== "post_retirement_expense"
          ).length;
          setExpenseRecurringTotal(expense_recurringCount);
        }

        var expenses = decoded_res.data;

        if (expenses.length == 1 && expenses[0]['expense_cat_id'] == "post_retirement_expense") {
          setOnlyPostRetirement(true);
        }
        else {
          setOnlyPostRetirement(false);
        }
        if (
          check_first_save == 1 &&
          expenseLength == 1 &&
          incomeData.length >= 1
        ) {
          localStorage.setItem("incomeExpenseCookie", 1);
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        } else {
          localStorage.removeItem("incomeExpenseCookie");
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        }
      }
    }
  };

  const saveIncomeData = async (e) => {
    setUpdateForm(false);
    e.preventDefault();

    if (incomeName === "") {
      setIncomeNameError("Please enter income name");
      scrollToRef();
    }
    if (incomeAmount === "") {
      setIncomeAmountError("Please enter net income value");
      scrollToRef();
    }

    if (isRecurring === true) {
      if (!incomeEndDate) {
        setEndDateError("Please select end date");
        scrollToRef();
      }
      if (!incomeFrequency) {
        setIncomeFrequencyError("Please select frequency");
        scrollToRef();
      }
    }

    // Build payload
    const payload = {
      user_income_name: incomeName,
      user_income_user_id: user_data.user_id,
      user_income_occurance: isRecurring,
      user_income_type: incomeIsFixed,
      income_cat_id: incomeCategoryId,
      user_income_start_date: moment(incomeStartDate).format("DD/MM/YYYY"),
      user_income_for: incomeForMember,
      user_income_amount: String(incomeAmount),
      // user_income_cat_uuid : incomeCatUUID,
      data_belongs_to: DATA_BELONGS_TO,
    };

    if (isRecurring === "Recurring") {
      payload.user_income_growth_rate = String(incomeAnnualIncrease);
      payload.user_income_end_date = moment(incomeEndDate).format("DD/MM/YYYY");
      payload.user_income_freq = incomeFrequency;
      if (incomeAfterRetirement) {
        payload.user_income_valid_till =
          incomeAfterRetirement === "Retirement"
            ? "Retirement"
            : "Life Expectancy";
      }
    } else {
      payload.user_income_end_date = payload.user_income_start_date;
    }

    if (incomeFootnote) {
      payload.user_income_remarks = incomeFootnote;
    }

    setIsLoading(true);
    const decoded_res = await addIncomeDetails(payload);

    if (decoded_res.status_code === 200) {
      const category_name = income_options.find(
        (income) => income.income_id === incomeCategoryId
      );

      toastr.options.positionClass = "toast-bottom-left";
      toastr.success(
        "Data saved successfully for " +
        (category_name?.income_cat_name || "") +
        " - " +
        incomeName
      );

      setIsLoading(false);
      scrollToIncomeList();

      // 🔹 reset using API first category instead of static "Interest Income"
      if (income_options.length > 0) {
        const first = income_options[0];
        setIncomeName(first.income_cat_name);
        setSelectedOption(first.income_cat_name);
        setIncomeCategoryId(first.income_id);
        setIncomeCatUUID(first.income_cat_uuid)
        handleCategoryClick(first, "income");
      }

      setIncomeAmount("");
      setIncomeAnnualIncrease(10);
      setIncomeEndDate("");
      setIncomeFrequency("Monthly");
      setIncomeIsFixed("Variable");
      setIncomeStartDate(new Date());
      setIncomeType("1");
      setselectedEndAge(null);
      setIncomeFootnote("");
      setIncomeForMember(parentFpUserId);

      await getIncomeDetailsss();
    } else {
      setIsLoading(false);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error(decoded_res.message);
    }
  };
  useEffect(() => {
    if (!isExpenseRecurring) {
      setExpenseEndDateError("");
    }
  }, [isExpenseRecurring]);

  const saveExpenseData = async (e) => {
    setUpdateForm(false);
    e.preventDefault();
  
    // 🔸 Validation
    if (expenseName === "") {
      setExpenseNameError("Please enter expense name");
      scrollToExpenseRef();
      return;
    }
  
    if (expenseAmount === "") {
      setExpenseAmountError("Please enter expense value");
      scrollToExpenseRef();
      return;
    }
  
    if (isExpenseRecurring === "Recurring") {
      if (!expenseEndDate) {
        setExpenseEndDateError("Please select end date");
        scrollToExpenseRef();
        return;
      }
      if (!expenseFrequency) {
        setExpenseFrequencyError("Please select frequency");
        scrollToExpenseRef();
        return;
      }
    }
  
    // ✅ Build Payload
    const payload = {
      user_expense_name: expenseName,
      user_expense_user_id: user_data.user_id,
      user_expense_amount: String(expenseAmount),
      user_expense_for: expenseForMember == "0" || expenseForMember == "" || expenseForMember === 0  ? 0 : expenseForMember, // ✅ convert "0" to 0
      user_expense_context: expenseForMember == "0" || expenseForMember == "" || expenseForMember === 0 ? "Family" : "Individual",      user_expense_start_date: moment(expenseStartDate).format("DD/MM/YYYY"),
      expense_cat_id: expenseCategoryId,
      user_expense_type: expenseIsFixed,
      user_expense_occurance: isExpenseRecurring,
      user_expense_category: isWish ? "Mandatory" : "Wishful",
      data_belongs_to: DATA_BELONGS_TO,
    };
  
    // 🔹 Recurring-specific fields
    if (isExpenseRecurring === "Recurring") {
      payload.user_expense_growth_rate = String(expenseInflationRate);
      payload.user_expense_end_date = moment(expenseEndDate).format("DD/MM/YYYY");
      payload.user_expense_freq = expenseFrequency;
  
      if (expenseAfterRetirement) {
        payload.user_expense_valid_till =
          expenseAfterRetirement === "Retirement"
            ? "Retirement"
            : "Life Expectancy";
      }
    } else {
      // 🔹 One-time expense defaults
      payload.user_expense_growth_rate = String(expenseInflationRate);
      payload.user_expense_end_date = payload.user_expense_start_date;
      payload.user_expense_freq = "Monthly";
    }
  
    // 🔹 Optional remarks
    if (expenseFootnote) {
      payload.user_expense_remarks = expenseFootnote;
    }
  
    // 🧠 Final sanity check
    if (payload.user_expense_freq === "0") {
      payload.user_expense_end_date = payload.user_expense_start_date;
    }
  
    try {
      setIsLoading(true);
      const decoded_res = await addExpenseDetails(payload);
  
      if (decoded_res.status_code === "200") {
        setIsLoading(false);
  
        // ✅ Find category name for success message
        const category = expense_options.find(
          (exp) => exp.expense_id === expenseCategoryId
        );
        // const category = expense_options.find(
        //   (exp) => exp.expense_cat_id === expenseCategoryId
        // );
        
  
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          `Data saved successfully for ${
            category?.expense_cat_name || ""
          } - ${expenseName}`
        );
  
        scrollToExpenseList();
  
        // ✅ Reset form fields dynamically using first category
        if (expense_options.length > 0) {
          const first = expense_options[0];
          setExpenseName(first.expense_cat_name);
          setSelectedOption1(first.expense_cat_name);
          setExpenseCategoryId(first.expense_id);
          setExpenseCatUUID(first.expense_cat_uuid);
          handleCategoryClick(first, "expense");
        }
  
        // ✅ Reset fields to defaults
        setExpenseAmount("");
        setExpenseInflationRate(7);
        setExpenseEndDate("");
        setExpenseFrequency("Monthly");
        setExpenseFixed("Variable");
        setExpenseRecurring("Recurring");
        setExpenseStartDate(new Date());
        setselectedEndAge(null);
        setExpenseFootnote("");
        setExpenseForMember(parentFpUserId);
  
        // 🔄 Refresh list
        await getExpenseData("", 0);
      } else {
        setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(decoded_res.message || "Failed to save expense data");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error saving expense data:", error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong while saving expense data");
    }
  };
  
  const handleIncomeName = (incomeName) => {
    var isValid = true;
    if (incomeName == "") {
      isValid = false;
      scrollToRef();
      setIncomeNameError("Please enter income name");
    } else {
      isValid = true;

      if (incomeName.length < 3 || incomeName.length > 35) {
        isValid = false;
        setIncomeNameError("Name must be between 3-35 characters");
        scrollToRef();
      }

      if (!/^[a-zA-Z0-9\s&]+$/.test(incomeName)) {
        isValid = false;

        setIncomeNameError("Please enter valid income name");
        scrollToRef();
      }

      if (isValid) {
        setIncomeNameError("");
      }
    }
  };
  const handleExpenseName = (expenseName) => {
    const cleanedExpenseName = expenseName.replace(/[^a-zA-Z0-9\s]/g, '');
    var isValid = true;
    if (cleanedExpenseName == "") {
      isValid = false;
      setExpenseNameError("Please enter expense name");
      scrollToExpenseRef()
    } else {
      isValid = true;

      if (cleanedExpenseName.length < 3 || cleanedExpenseName.length > 35) {
        isValid = false;
        setExpenseNameError("Name must be between 3-35 characters");
        scrollToExpenseRef()
      }

      if (!/^[a-zA-Z0-9\s]+$/.test(cleanedExpenseName)) {
        isValid = false;

        setExpenseNameError("Please enter valid expense name");
        scrollToExpenseRef()
      }

      if (isValid) {
        setExpenseNameError("");
      }
    }
    setExpenseName(cleanedExpenseName);
  };
  const updateIncomeData = async (e) => {
    e.preventDefault();
    if (incomeName == "") {
      setIncomeNameError("Please enter income name");
      scrollToRef();
    }
    if (incomeAmount == "") {
      setIncomeAmountError("Please enter net income value");
      scrollToRef();
    }
    if (incomeCatUUID == "salary_and_bonus") {
      if (incomeType == "") {
        setIncomeTypeError("Please select income type");
        scrollToRef();
      }
    }
    if (isRecurring == true) {
      if (incomeEndDate == "" || !incomeEndDate) {
        setEndDateError("Please select end date");
        scrollToRef();
      }
      if (incomeFrequency == "" || !incomeFrequency) {
        setIncomeFrequencyError("Please select frequency");
        scrollToRef();
      }
    }


    if (incomeCatUUID == "salary_and_bonus") {
      if (
        incomeName != "" &&
        incomeAmount != "" &&
        incomeType != "" &&
        endDateError == "" &&
        incomeAmountError == "" &&
        incomeNameError == "" &&
        incomeTypeError == ""
      ) {
        // var incomeStartDateChanged=incomeStartDate.substr(3, 2)+"/"+incomeStartDate.substr(0, 2)+"/"+incomeStartDate.substr(6, 4)
        // var incomeEndDateChanged=incomeEndDate?incomeEndDate.substr(3, 2)+"/"+incomeEndDate.substr(0, 2)+"/"+incomeEndDate.substr(6, 4):incomeStartDateChanged
        var payload = {
          user_income_id: incomeId,
          user_income_name: incomeName,
          user_income_user_id: user_data.user_id,
          user_income_occurance: isRecurring,
          user_income_type: incomeIsFixed,
          income_cat_id: incomeCategoryId,
          user_income_start_date: moment(incomeStartDate).format("DD/MM/YYYY"),
          user_income_for: incomeForMember,
          user_income_amount: String(incomeAmount),
          data_belongs_to: DATA_BELONGS_TO
        };
        if (isRecurring == "Recurring") {
          payload.user_income_growth_rate = String(incomeAnnualIncrease);
          payload.user_income_end_date = incomeEndDate
          payload.user_income_freq = incomeFrequency;
          if (incomeAfterRetirement) {
            payload.user_income_valid_till = incomeAfterRetirement === "Retirement" ? "Retirement" : "Life Expectancy";
          }
        } else {
          payload.user_income_end_date = payload.user_income_start_date;

        }

        if (incomeFootnote) {
          payload.user_income_remarks = incomeFootnote;;
        }

        // var payload = commonEncode.encrypt(JSON.stringify(payload));
        var decoded_res = await UpdateIncomeDetails(payload)
        if (decoded_res.status_code == "200") {
          setIsLoading(true);
          var category_name = income_options.find(
            (income) => income.income_id == incomeCategoryId
          );
          toastr.options.positionClass = "toast-bottom-left";

          toastr.success(
            `Data updated successfully for ${category_name?.income_cat_name || ""} - ${incomeName}`
          );
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          scrollToIncomeList();
          getIncomeData("", 0);
          setIncomeAmount("");
          setIncomeAnnualIncrease(10);
          setUpdateForm(false);
          setAddForm(true);
          // setIncomeCategoryId("");

          setIncomeName("Business");
          setSelectedOption("Business");
          setIncomeEndDate("");
          setIncomeFrequency("Monthly");
          setIncomeIsFixed("Variable");
          setIsRecurring("Recurring");
          setIncomeStartDate(new Date());
          setselectedEndAge(null);
          setIncomeType("1");

          setIncomeForMember(parentFpUserId);
          setIncomeFootnote("");

        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(decoded_res.message);
        }
      }
    } else {
      if (
        incomeName != "" &&
        incomeAmount != "" &&
        endDateError == "" &&
        incomeNameError == "" &&
        incomeAmountError == ""
      ) {
        var payload = {
          user_income_id: incomeId,
          user_income_name: incomeName,
          user_income_user_id: user_data.user_id,
          user_income_occurance: isRecurring,
          user_income_type: incomeIsFixed,
          income_cat_id: incomeCategoryId,
          user_income_start_date: moment(incomeStartDate).format("DD/MM/YYYY"),
          // user_income_start_date: incomeStartDate,
          user_income_for: incomeForMember,
          user_income_amount: String(incomeAmount),
          data_belongs_to: DATA_BELONGS_TO
        };
        if (isRecurring == "Recurring") {
          payload.user_income_growth_rate = String(incomeAnnualIncrease);
          payload.user_income_end_date = moment(incomeEndDate).format("DD/MM/YYYY"),
            payload.user_income_freq = incomeFrequency;
          if (incomeAfterRetirement) {
            payload.user_income_valid_till = incomeAfterRetirement === "Retirement" ? "Retirement" : "Life Expectancy";
          }
        } else {
          payload.user_income_end_date = payload.user_income_start_date;

        }

        if (incomeFootnote) {
          payload.user_income_remarks = incomeFootnote;;
        }

        var decoded_res = await UpdateIncomeDetails(payload)
        if (decoded_res.status_code == "200") {
          // setIsLoading(true);
          var category_name = income_options.find(
            (income) => income.income_id == incomeCategoryId
          );
          toastr.options.positionClass = "toast-bottom-left";

          toastr.success(
            `Data updated successfully for ${category_name?.income_cat_name || ""} - ${incomeName}`
          );
          dispatch({ type: "RELOAD_SIDEBAR", payload: true });
          scrollToIncomeList();
          getIncomeDetailsss();
          setIsLoading(false)
          setIncomeAmount("");
          setIncomeAnnualIncrease(10);
          // setIncomeCategoryId("");
          setUpdateForm(false);
          setAddForm(true);

          setIncomeName("Business");
          setSelectedOption("Business");
          setIncomeEndDate("");
          setIncomeFrequency("Monthly");
          setIncomeIsFixed("Variable");
          setIsRecurring("Recurring");
          setIncomeStartDate(new Date());
          setIncomeType("1");
          setselectedEndAge(null);
          setIncomeFootnote("");
          setIncomeForMember(parentFpUserId);

        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(decoded_res.message);
          setIsLoading(false);
        }
      }
    }
  };

  const updateExpenseData = async (e) => {
    try {
      e.preventDefault();
  
      // 🔹 Basic Validation
      if (expenseName === "") {
        setExpenseNameError("Please enter expense name");
        scrollToExpenseRef();
        return;
      }
  
      if (expenseAmount === "") {
        setExpenseAmountError("Please enter expense value");
        scrollToExpenseRef();
        return;
      }
  
      if (isExpenseRecurring === "Recurring") {
        if (!expenseEndDate) {
          setExpenseEndDateError("Please select end date");
          scrollToExpenseRef();
          return;
        }
        if (!expenseFrequency) {
          setExpenseFrequencyError("Please select frequency");
          scrollToExpenseRef();
          return;
        }
      }
  
      // 🔄 Start Loader
      setIsLoading(true);
  
      // ✅ Build Payload
      const payload = {
        user_expense_id: expenseId,
        user_expense_name: expenseName,
        user_expense_user_id: user_data.user_id,
        user_expense_amount: String(expenseAmount),
        user_expense_for: expenseForMember == "0" ? 0 : expenseForMember, // ✅ convert "0" to 0
        user_expense_context: expenseForMember == "0" || expenseForMember === 0 ? "Family" : "Individual",        user_expense_start_date: moment(expenseStartDate).format("DD/MM/YYYY"),
        expense_cat_id: expenseCategoryId,
        user_expense_type: expenseIsFixed,
        user_expense_occurance: isExpenseRecurring,
        user_expense_category: isWish ? "Mandatory" : "Wishful",
        data_belongs_to: DATA_BELONGS_TO,
      };
  
      if (isExpenseRecurring === "Recurring") {
        payload.user_expense_growth_rate = String(expenseInflationRate);
        payload.user_expense_end_date = moment(expenseEndDate).format("DD/MM/YYYY");
        payload.user_expense_freq = expenseFrequency;
  
        if (expenseAfterRetirement) {
          payload.user_expense_valid_till =
            expenseAfterRetirement === "Retirement"
              ? "Retirement"
              : "Life Expectancy";
        }
      } else {
        payload.user_expense_growth_rate = String(expenseInflationRate);
        payload.user_expense_end_date = payload.user_expense_start_date;
        payload.user_expense_freq = "Monthly";
      }
  
      if (expenseFootnote) {
        payload.user_expense_remarks = expenseFootnote;
      }
  
      // 🧠 Final sanity
      if (payload.user_expense_freq === "0") {
        payload.user_expense_end_date = payload.user_expense_start_date;
      }
  
      // 🚀 Call Update API
      const decoded_res = await UpdateExpenseDetails(payload);
  
      // ✅ Response Handling
      if (decoded_res.status_code === "200") {
        setIsLoading(false);
  
        const category = expense_options.find(
          (exp) => exp.expense_id === expenseCategoryId
        );
  
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          `Data updated successfully for ${category?.expense_cat_name || ""} - ${expenseName}`
        );
  
        // 🔄 Refresh Sidebar & Expense List
        dispatch({ type: "RELOAD_SIDEBAR", payload: true });
        scrollToExpenseList();
        await getExpenseData("", 0);
  
        // 🧹 Reset Form — Dynamically
        if (expense_options.length > 0) {
          const first = expense_options[0];
          setExpenseName(first.expense_cat_name);
          setSelectedOption1(first.expense_cat_name);
          setExpenseCategoryId(first.expense_id);
          setExpenseCatUUID(first.expense_cat_uuid);
          handleCategoryClick(first, "expense");
        }
  
        // Default resets
        setExpenseAmount("");
        setExpenseInflationRate(7);
        setExpenseEndDate("");
        setExpenseFrequency("Monthly");
        setExpenseFixed("Variable");
        setExpenseRecurring("Recurring");
        setExpenseStartDate(new Date());
        setselectedEndAge(null);
        setExpenseFootnote("");
        setExpenseForMember(parentFpUserId);
        setUpdateForm(false);
        setAddForm(true);
      } else {
        setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(decoded_res.message || "Failed to update expense data");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating expense data:", error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong while updating expense data");
    }
  };
  
  const scrollToIncomeForm = () => {
    const { offsetTop } = cntRef.current;
    //
    window.scroll({ top: offsetTop - 50 });
  };

  const scrollToIncomeList = () => {
    const { offsetTop } = cntRef.current;
    window.scroll({ top: offsetTop - 1500 });
  };

  const scrollToExpenseForm = () => {
    const { offsetTop } = cntRef.current;
    window.scroll({ top: offsetTop + 1500 });
  };

  const scrollToExpenseList = () => {
    const { offsetTop } = cntRef.current;
    window.scroll({ top: offsetTop - 1500 });
  };

  const sortOptionsIncomeType = [
    { value: "1", label: "Salary" },
    { value: "2", label: "Bonus" },
  ];

  const sortOptions = [
    { value: "1", label: "Self" },
    { value: "2", label: "Family" },
    { value: "3", label: "Dipti Sharma" },
  ];
  const sortOptionsFrequency = [
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Half Yearly", label: "Half Yearly" },
    { value: "Yearly", label: "Yearly" },
  ];
  const sortOptionsVacationFrequency = [
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Half Yearly", label: "Half Yearly" },
    { value: "Yearly", label: "Yearly" },
    { value: "Once in 2 Years", label: "Once in 2 Years" },
    { value: "Once in 3 Years", label: "Once in 3 Years" },
    { value: "Once in 4 Years", label: "Once in 4 Years" },
    { value: "Once in 5 Years", label: "Once in 5 Years" },
  ];
  const sortOptionsEducation = [
    { value: "1", label: "  BSc / BCom / BA / BCA / BMS / BBA etc" },
    { value: "2", label: "Engineering" },
    { value: "3", label: "High School (Upto XIIth)" },
    { value: "4", label: "MSc / MCom / MA / MCA / MMS / MBA etc)" },
    { value: "5", label: "School (Upto Xth)" },
    { value: "6", label: "Other" },
    // { value: "3", label: "Half Yearly" },
  ];
  const sortOptionsGoalPriority = [
    { value: "1", label: "Very High" },
    { value: "2", label: "High" },
    { value: "6", label: "Medium" },
    // { value: "3", label: "Half Yearly" },
  ];
  const frequencylist = {
    0: "One Time",
    1: "Monthly",
    2: "Quarterly",
    3: "Half Yearly",
    4: "Yearly",
    5: "Once in 2 Years",
    6: "Once in 3 Years",
    7: "Once in 4 Years",
    8: "Once in 5 Years",
  };

  // const customStyles = {
  //   option: (base, { data, isDisabled, isFocused, isSelected }) => {
  //     return {
  //       ...base,
  //       backgroundColor: isFocused ? "#ffff" : "#042b62",
  //       color: isFocused ? "#042b62" : "#fff",
  //       cursor: "pointer",
  //     };
  //   },
  //   menuList: (base) => ({
  //     ...base,
  //     height: "100px",
  //     overflowY: "scroll",
  //     scrollBehavior: "smooth",
  //     "::-webkit-scrollbar": {
  //       width: "4px",
  //       height: "0px",
  //     },
  //     "::-webkit-scrollbar-track": {
  //       background: "#fff",
  //     },
  //     "::-webkit-scrollbar-thumb": {
  //       background: "#042b62",
  //     },
  //     "::-webkit-scrollbar-thumb:hover": {
  //       background: "#555",
  //     },
  //   }),
  // };

  useEffect(() => {
    setAddForm(true);
    setUpdateForm(false);
    setSelectedCategories([]);
    setSelectedExpenseCategories([]);
  }, [tab])
  //
  return (
    <DatagatherLayout>
      <FintooLoader isLoading={isLoading} />

      <div className="">
        <div className="background-div">
          <div
            className={`bg ${currentUrl.indexOf("datagathering/income-expenses") > -1
              ? "active"
              : ""
              }`}
            id="bg-incomeexpense"
          ></div>
        </div>
        <div className="white-box">
          <div className={`d-flex justify-content-md-center tab-box DGheaderFix`}
          >
            <div className="d-flex top-tab-menu income-expense-menu noselect">
              <div
                className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                onClick={() => setTab("tab1")}
              >
                <div className="tab-menu-title">Income</div>
              </div>
              <div
                className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                onClick={() => setTab("tab2")}
              >
                <div className="tab-menu-title">Expenses</div>
              </div>
            </div>
          </div>

          <div>
            <div className={` ${tab == "tab1" ? "d-block" : "d-none"}`}>
              <div className="row ">
                <div className={`col-md-2 ${DGstyles.moneyjarcontainer}`}>
                  <h5
                    className="accordion-heading"
                    style={{
                      marginBottom: "10px",
                      fontSize: "13.2px",
                      fontWeight: 700,
                    }}
                  >
                    Income Vs Expense
                  </h5>
                  <div
                    className="money-jar"
                    style={{
                      position: "relative",
                      width: "70px",
                      margin: "0 auto",
                    }}
                  >
                    <span
                      style={{
                        height: "100%",
                        transition: "0.6s ease all",
                        background: totalIncome == 0 ? "#fff" : "#042b62",
                        width: "100%",
                        display: "block",
                        position: "absolute",
                        bottom: "0px",
                      }}
                      id="income-jar"
                      className="income-jar"
                    ></span>
                    <img
                      style={{
                        position: "relative",
                        width: "70px",
                        display: "block",
                      }}
                      src={imagePath + "/static/media/DG/jar.svg"}
                      alt="Rupee"
                    />
                  </div>
                  <br></br>
                  <span
                    className="mb-2 total-amt text-center"
                    style={{ fontSize: "16px" }}
                  >
                    Total Income
                  </span>
                  <br></br>
                  <b>{indianRupeeFormat(totalIncome)}</b>
                  <div style={{ fontSize: "14px" }}>
                    <b>
                      (Income Till 31<sup>st</sup> Dec,{" "}
                      {moment().format("YYYY")})
                    </b>
                  </div>
                </div>
                <div className="col-md-10">
                  {/* ngIf: dataassets.length>=100 */}
                  <div className="inner-box">
                    <div className="shimmercard br hide" id="assets-shimmer">
                      <div className="wrapper">
                        <div className="comment br animate w80" />
                        <div className="comment br animate" />
                      </div>
                    </div>
                  </div>
                  {/* ngIf: dataassets.length > 0 */}
                  <div className="inner-box">
                    <div
                      style={{ height: scroll ? "58px" : null }}
                      className="d-flex align-items-center top-tab-menu justify-content-between FixdgHeader"
                    >
                      <div className="d-flex align-items-center">
                        {Array.isArray(incomeData) && incomeData.length >= 1 && (
                          <>
                            <FintooCheckbox
                              checked={
                                tab === "tab1" && selectedCategories.length === incomeData.length
                              }
                              onChange={() => {
                                if (selectedCategories.length === incomeData.length) {
                                  setSelectedCategories([]);
                                  setDeleteToggle(false);
                                } else {
                                  const allIds = incomeData.map((income) => income.name);
                                  setSelectedCategories(allIds);
                                  setDeleteToggle(true);
                                }
                              }}
                            />
                            <div>
                              <div className="total-amt">
                                <span style={{ fontWeight: "500" }}>ADDED INCOME</span>
                                <span className="info-hover-left-box ms-2">
                                  <span className="icon">
                                    <img
                                      alt="More information"
                                      // src={imagePath + '/static/media/more_information.svg'}
                                      src={imagePath + '/static/media/more_information.svg'}
                                    />
                                  </span>
                                  <span className="msg">
                                    <b>Note : </b>All the calculations related to your Income &
                                    Expense are done as per the calendar year. Ex: If you start
                                    your financial planning in the month of September, the gross
                                    inflow analysis for the first year will be calculated from
                                    September to December.
                                  </span>
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {selectedCategories.length > 0 && deletetoggle === true && (
                        <span
                          onClick={() => {
                            handleShow();
                            setUpdateForm(false);
                            setAddForm(true);
                          }}
                          className="opt-options-2 pointer"
                          style={{ marginRight: "2rem" }}
                        >
                          <MdDelete style={{ color: "#042b62", fontSize: "1.6rem" }} />
                        </span>
                      )}
                    </div>

                    {isDataLoading ? (
                      <div className="inner-container mt-4 pt-4">
                        <div className="shine w-25 mb-1" style={{ height: ".7rem" }}></div>
                        <div className="shine w-100" style={{ height: ".7rem" }}></div>
                      </div>
                    ) : (
                      tab === "tab1" &&
                      Array.isArray(incomeData) &&
                      incomeData.map((income, index) => {
                        const member = familyData.find(
                          (member) => member.value === income.user_income_for
                        );

                        const memberName = member
                          ? member.label === "Self"
                            ? member.name
                            : member.label
                          : "Family";


                        return (
                          <div key={income.name} className="d-flex align-items-center">
                            <FintooCheckbox
                              id={income.name}
                              checked={selectedCategories.includes(income.name)}
                              onChange={() => {
                                setSelectedCategories((prevSelected) => {
                                  if (prevSelected.includes(income.name)) {
                                    const updated = prevSelected.filter(
                                      (id) => id !== income.name
                                    );
                                    setDeleteToggle(updated.length > 0);
                                    return updated;
                                  } else {
                                    setDeleteToggle(true);
                                    return [...prevSelected, income.name];
                                  }
                                });
                              }}
                            />
                            <div className="inner-container mt-4 w-100">
                              <h4>
                                {income.income_category_type}
                                {income.user_income_name ? " - " + income.user_income_name : ""}
                              </h4>

                              <div className="row">
                                <div className="col-md-4">
                                  <div className="display-style">
                                    <span>Value ({income.user_income_freq})</span>
                                    <p
                                      className="invest-show"
                                      title={`${indianRupeeFormat(income.user_income_amount)}`}
                                    >
                                      {indianRupeeFormat(income.user_income_amount)}
                                    </p>
                                  </div>
                                </div>

                                <div className="col-md-3"></div>

                                <div className="col-md-3">
                                  <div className="display-style">
                                    <span>Member:</span>
                                    <p>{memberName}</p>
                                  </div>
                                </div>

                                <div className="col-md-2">
                                  <div className="opt-options">
                                    <span>
                                      <BsPencilFill
                                        onClick={() => {
                                          getIncomeData(income.name, 0);
                                          setUpdateForm(true);
                                          setAddForm(false);
                                          setIncomeId(income.name);
                                          scrollToIncomeForm();
                                        }}
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>


                  {/* end ngIf: dataassets.length > 0 */}
                </div>
              </div>
              {incomeData.length < 100 && (
                <div className="removefixheader">
                  <div className="col-md-10 col-12">
                    <div className="accordion mt-2">
                      <div className="accordion-panel active">
                        <div className="accordion-header d-flex justify-content-between">
                          <h4 className="accordion-heading">
                            <img
                              className="accordian-img"
                              src={imagePath + "/static/media/DG/income-expenses/income_add.svg"}
                              alt="Family details"
                            />
                            Add Income
                          </h4>
                          <div
                            onClick={() => setShowIncomeView(!showIncomeView)}
                            className={`${DGstyles.HideSHowicon} hideShowIconCustom`}
                          >
                            {showIncomeView == true ? <>-</> : <>+</>}
                          </div>
                        </div>
                        {showIncomeView && (
                          <div
                            className={`accordion-content  family ${DGstyles.bgincomeexpense}`}
                          >
                            <div className="row py-2">
                              <div className="col-10">
                                <span>
                                  <label className="">
                                    Nature Of Payment : ({selectedOption})
                                  </label>
                                  {/* end ngIf: categorydetail!=''  */}
                                </span>
                                <ul className="card-list">
                                  {
                                    //console.log("income_options", income_options)
                                  }
                                  {income_options.map((v, i) => (
                                    <li
                                      key={i}
                                      onClick={() => {
                                        setSelectedOption(v.income_cat_name);
                                        handleCategoryClick(v, "income");
                                        setIncomeFootnote("");
                                        setIncomeForMember(parentFpUserId);
                                        scrollToRef();
                                      }}
                                      className={`li-options ${selectedOption === v.income_cat_name ? "active" : ""
                                        }`}
                                    >
                                      <label className="LabelName">
                                        <img alt={v.income_cat_name} src={v.image} />
                                        {v.income_cat_name}
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div ref={cntRef}>
                              {
                                <form
                                  noValidate="novalidate"
                                  name="goldassetform"
                                >
                                  <div className="row d-flex align-items-center py-3">
                                    <div className="col-md-5 col-12 ">
                                      <div className="flex-grow-1 custom-input">
                                        <div className={`form-group mt-2 ${incomeName ? "inputData" : null}`} style={{ paddingTop: "15px" }}>
                                          <input type="text" id="income_Name" name="income_Name"
                                            value={incomeName}
                                            onChange={(e) => {
                                              setIncomeName(e.target.value);
                                              handleIncomeName(e.target.value);
                                            }}
                                            required autoComplete="off" />
                                          <span className="highlight"></span>
                                          <span className="bar"></span>
                                          <label htmlFor="name">Income Name*</label>
                                          <div className="error">
                                            {incomeNameError}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* {incomeCategoryId === "salary_and_bonus" && (
                                      <div className="col-md-5 col-12">
                                        <div className="material">
                                          <Form.Label>Income Type*</Form.Label>
                                          <Select
                                            classNamePrefix="sortSelect"
                                            isSearchable={false}
                                            styles={customStyles}
                                            onChange={(v) =>
                                              handleIncomeType(v.value)
                                            }
                                            value={sortOptionsIncomeType.filter(
                                              (v) => v.value == incomeType
                                            )}
                                            options={sortOptionsIncomeType}
                                          />
                                        </div>
                                        <div className="error">
                                          {incomeTypeError}
                                        </div>
                                      </div>
                                    )} */}
                                  </div>
                                  <div className="row  d-flex align-items-center">
                                    <div className="col-md-5 col-12  d-flex align-items-baseline">
                                      <div className="flex-grow-1 custom-input">
                                        <div className={`form-group  ${incomeAmount ? "inputData" : null}`} style={{ paddingTop: "17px" }}>
                                          <span> <input type="text" id="netincomevalue" name="netincomevalue"
                                            min="1"
                                            className=""
                                            maxLength="13"
                                            onChange={(e) => {
                                              checkIncomeAmount(e);
                                            }}
                                            onInput={maxLengthCheck}
                                            value={incomeAmount}
                                            required autoComplete="off" />
                                            <span className="highlight"></span>
                                            <span className="bar"></span>
                                            <label htmlFor="name">Net Income Value*</label></span>
                                          <span className="info-hover-box" style={{ top: '1.7rem' }}>
                                            <span className="icon">
                                              <img
                                                alt="More information"
                                                src={imagePath + '/static/media/more_information.svg'}
                                              />
                                            </span>
                                            <span className="msg">
                                              This is the Field where you need
                                              to add your Net Income from
                                              &nbsp;{incomeName}. The Frequency of the
                                              &nbsp;{incomeName} income you can add by
                                              selecting a recurring option.
                                            </span>
                                          </span>
                                        </div>

                                        {/* <p>{simpleValidator.current.message('incomeAmount', incomeAmount, ['required'], {messages: {required:'Please enter net income value'}})}</p> */}
                                        <div className="error">
                                          {incomeAmountError}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-5 col-12">
                                      <div className="material">
                                        <Form.Label>Income For*</Form.Label>
                                        {
                                          // console.log("familyData", familyData)
                                        }
                                        {familyData && incomeForMember !== undefined  && (
                                          <Select
                                            classNamePrefix="sortSelect"
                                            isSearchable={false}
                                            styles={customStyles}
                                            onChange={(v) => {
                                              setIncomeForMember(v.value);
                                              handleIncomeMemberEnddate(v);
                                            }
                                            }
                                            value={familyData.find(
                                              (v) => v.value == incomeForMember
                                            )}
                                            options={familyData.filter((v) => v.label !== "Family")}
                                            />
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row py-3">
                                    <div className="col-md-8 col-12">
                                      <div className="d-md-flex">
                                        <span className="">
                                          Is This Income Fixed Or Variable?*
                                        </span>
                                        <div className="d-flex ps-md-5 ms-md-2 SwitchElement">
                                          <div>Variable</div>
                                          <Switch
                                            onChange={() =>
                                              setIncomeIsFixed((prev) => (prev === "Fixed" ? "Variable" : "Fixed"))
                                            }
                                            // boxShadow='0 0 2px 3px #042b62'
                                            activeBoxShadow='0 0 2px 3px #042b62'
                                            checked={incomeIsFixed == "Fixed"}
                                            className="react-switch px-2 "
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            height={20}
                                            width={40}
                                            onColor="#042b62"
                                            offColor="#d8dae5"
                                          />
                                          <div>Fixed</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row pt-4">
                                    <div className="col-md-8 col-12">
                                      <div className="d-md-flex d-grid">
                                        <span className="">
                                          Is The Income One Time Or Recurring?*
                                        </span>
                                        <div className="d-flex ms-md-4">
                                          <span className="info-hover-box  ps-md-4">
                                            <span className="icon">
                                              <img
                                                alt="More information"
                                                src={imagePath + '/static/media/more_information.svg'}
                                              />
                                            </span>
                                            <span className="msg">
                                              Date when you are expecting to
                                              receive a lumpsum amount in the
                                              form of maturity, bonus, etc.
                                            </span>
                                          </span>
                                          <div className="d-flex ms-md-4 SwitchElement">
                                            <div className="ps-2 ps-md-3" style={{ whiteSpace: "nowrap" }}>
                                              One Time
                                            </div>

                                            <Switch
                                              onChange={() => {
                                                if (recurringTotal == 1 && recurFlag == true && addForm == false) {
                                                  scrollToIncomeList();
                                                  setUpdateForm(true);
                                                } else {
                                                  setIsRecurring((prev) => (prev === "Recurring" ? "One Time" : "Recurring"));
                                                }
                                              }}
                                              checked={isRecurring === "Recurring"}
                                              className="react-switch px-2"
                                              activeBoxShadow="0 0 2px 3px #042b62"
                                              uncheckedIcon={false}
                                              checkedIcon={false}
                                              height={20}
                                              width={40}
                                              onColor="#042b62"
                                              offColor="#d8dae5"
                                            />
                                            <div className="ps-2 ps-md-3" style={{ whiteSpace: "nowrap" }}>
                                              Recurring
                                            </div>
                                          </div>

                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {isRecurring !== "One Time" && (
                                    <>

                                      <div className="row py-3">
                                        <div className="col-md-5 col-12">

                                          <div className="material">
                                            <FloatingLabel
                                              controlId="floatingInput"
                                              label="Income Start Date*"
                                              className="mb-0 material"
                                              style={{
                                                borderBottom:
                                                  "1px solid #dadada",
                                                paddingTop: "19px",
                                              }}
                                            >

                                              <ReactDatePicker
                                                // setDate={(date)=>setDate(date,'startDate')}
                                                setDate={(date) => {
                                                  setIncomeStartDate(
                                                    date,
                                                    "startDate",
                                                    "income"
                                                  );
                                                }}
                                                select_date={incomeStartDate}
                                                maxDate={""}
                                                minDate={moment().toDate()}
                                                className="pt-2"
                                              />
                                            </FloatingLabel>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row py-2">
                                        <span className="">Upto*</span>
                                        <div className="col-md-5 col-12">
                                          {/* <p>11-{incomeEndDate} </p> */}
                                          <FloatingLabel
                                            controlId="floatingInput"
                                            label="End Date Of Annual Income"
                                            className="mb-0 material"
                                            style={{
                                              borderBottom: "1px solid #dadada",
                                              paddingTop: "19px",
                                            }}
                                          >
                                            <ReactDatePicker
                                              select_date={moment(incomeEndDate, "DD/MM/YYYY").toDate()}
                                              setDate={(enddate) =>
                                                setDate(enddate, "endDate", "income")
                                              }
                                              minDate={
                                                selectedEndAge === 0
                                                  ? moment(incomeStartDate, "DD/MM/YYYY").add(1, "month").toDate()
                                                  : moment(incomeConditionDate, "DD/MM/YYYY").toDate()
                                              }
                                              maxDate={null}
                                              className="pt-2"
                                            />
                                          </FloatingLabel>
                                          <p style={{ position: "relative" }} className="error">
                                            {endDateError}
                                          </p>

                                        </div>
                                        <div className="col-md-6 col-12">
                                          <div className="dark-label mt-md-4">
                                            <div
                                              className="d-md-flex d-grid "
                                              style={{ clear: "both" }}
                                            >
                                              <FintooRadio2
                                                checked={selectedEndAge == 1}
                                                onClick={() => {
                                                  setselectedEndAge(1);
                                                  handleIncomeEndDate(1);
                                                }}
                                                title="Upto Retirement Age"
                                              />
                                              <FintooRadio2
                                                checked={selectedEndAge == 2}
                                                className=""
                                                onClick={() => {
                                                  setselectedEndAge(2);
                                                  handleIncomeEndDate(2);
                                                }}
                                                title="Upto Life Expectancy Age"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row py-3">
                                        <div className="col-md-5 col-12">
                                          <div className="material ">
                                            <div>
                                              <Form.Label>
                                                Annual Growth Rate (%)* :
                                                {incomeAnnualIncrease}
                                              </Form.Label>
                                            </div>
                                            <div className={`${incomeAnnualIncrease < 2 && "sl-hide-left"} ${incomeAnnualIncrease > 28 && "sl-hide-right"}`}>
                                              <Slider
                                                // x={incomeAnnualIncrease}
                                                min={0}
                                                max={30}
                                                value={incomeAnnualIncrease}
                                                onChange={(x) => {
                                                  setIncomeAnnualIncrease(
                                                    Math.round(
                                                      (parseFloat(x) +
                                                        Number.EPSILON) *
                                                      100
                                                    ) / 100
                                                  );
                                                  // setSliderValue(x)
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row py-3">
                                        <div className="col-md-5 col-12">
                                          <div className="material">
                                            <Form.Label>Frequency* </Form.Label>
                                            <Select
                                              classNamePrefix="sortSelect"
                                              isSearchable={false}
                                              styles={customStyles}
                                              onChange={(selectedOption) => {
                                                setIncomeFrequency(selectedOption.label); // storing label
                                                setIncomeFrequencyChange((prevValue) => prevValue + 1);
                                              }}
                                              value={sortOptionsFrequency.find((f) => f.label === incomeFrequency)} // match by label
                                              options={sortOptionsFrequency}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  {isRecurring == "One Time" && (
                                    <>
                                      <div className="row py-3">
                                        <div className="col-md-5 col-12">
                                          <div className="material">

                                            <FloatingLabel
                                              controlId="floatingInput"
                                              label="Date of One-Time Income*"
                                              className="mb-0 material d-flex"
                                              style={{
                                                borderBottom:
                                                  "1px solid #dadada",
                                                paddingTop: "19px",
                                              }}
                                            >
                                              <ReactDatePicker
                                                // setDate={(incomeStartDate) =>
                                                //   setDate(
                                                //     incomeStartDate,
                                                //     "startDate",
                                                //     "income"
                                                //   )
                                                // }
                                                setDate={(date) => {
                                                  setIncomeStartDate(
                                                    date,
                                                    "startDate",
                                                    "income"
                                                  );
                                                }}
                                                select_date={incomeStartDate}
                                                 maxDate={
                                                  new Date(
                                                    new Date().getFullYear(),
                                                    11,
                                                    31
                                                  )
                                                }
                                                minDate={moment().toDate()}
                                                className="pt-2"
                                              />
                                              <span className="info-hover-box">
                                                <span className="icon">
                                                  <img
                                                    alt="More information"
                                                    src={imagePath + '/static/media/more_information.svg'}
                                                  />
                                                </span>
                                                <span className="msg">
                                                  In this section, you can add
                                                  your current year’s one-time
                                                  income.
                                                </span>
                                              </span>
                                            </FloatingLabel>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  <div className="row">
                                    <div className="col-md-9 col-12 custom-input">
                                      <div className={`form-group mt-1  ${expenseName ? "inputData" : null}`}>
                                        <input type="text" id="Remarks" name="Remarks" onChange={(e) =>
                                          setIncomeFootnote(e.target.value)
                                        } value={incomeFootnote} autoComplete="off" />
                                        <span className="highlight"></span>
                                        <span className="bar"></span>
                                        <label htmlFor="name">Remarks</label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row py-2">
                                    <div className=" text-center">
                                      <div>
                                        <div className="btn-container">
                                          <div className="d-flex justify-content-center">
                                            <Link
                                              to={
                                                process.env.PUBLIC_URL + "/datagathering/about-you"
                                              }
                                            >
                                              <div className="previous-btn form-arrow d-flex align-items-center">
                                                <FaArrowLeft />
                                                <span className="hover-text">
                                                  &nbsp;Previous
                                                </span>
                                              </div>
                                            </Link>
                                            {addForm && (
                                              <button
                                                onClick={(e) =>
                                                  saveIncomeData(e)
                                                }
                                                className="default-btn gradient-btn save-btn"
                                              >
                                                Save & Add More
                                              </button>
                                            )}
                                            {updateForm && (
                                              <div>
                                                <button
                                                  onClick={(e) =>
                                                    cancelFormData(e, "income")
                                                  }
                                                  className="default-btn gradient-btn save-btn"
                                                >
                                                  Cancel
                                                </button>
                                                <button
                                                  onClick={(e) =>
                                                    updateIncomeData(e)
                                                  }
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
                                                setTab("tab2")
                                              }
                                              }
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
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {incomeData.length >= 100 && updateForm == false && (
                <div className=" py-2">
                  <div className=" text-center">
                    <div>
                      <div className="btn-container">
                        <div
                          className="d-flex justify-content-center"
                          style={{ marginRight: "15%" }}
                        >
                          <Link
                            to={
                              process.env.PUBLIC_URL + "/datagathering/about-you"
                            }
                          >
                            <div className="previous-btn form-arrow d-flex align-items-center">
                              <FaArrowLeft />
                              <span className="hover-text">&nbsp;Previous</span>
                            </div>
                          </Link>

                          <div
                            className="next-btn form-arrow d-flex align-items-center"
                            onClick={() => {
                              ScrollToTop();
                              setTab("tab2")
                            }
                            }
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
              )}
            </div>

            <div className={` ${tab == "tab2" ? "d-block" : "d-none"}`}>
              <div className="row">
                <div className={`col-md-2 ${DGstyles.moneyjarcontainer}`}>
                  <h5
                    className="accordion-heading"
                    style={{
                      marginBottom: "10px",
                      fontSize: "13.2px",
                      fontWeight: 700,
                    }}
                  >
                    Income Vs Expense
                  </h5>
                  <div
                    className="money-jar"
                    style={{
                      position: "relative",
                      width: "70px",
                      margin: "0 auto",
                    }}
                  >
                    <span
                      style={{
                        height:
                          incomeRetirementPercent > 0
                            ? incomeRetirementPercent > 50
                              ? incomeRetirementPercent + "%"
                              : incomeRetirementPercent + "%"
                            : "100%",
                        background:
                          totalIncome - totalExpense > 0
                            ? "#042b62"
                            : totalIncome - totalExpense < 0
                              ? "#ff5245"
                              : "#fff",
                        transition: "0.6s ease all",
                        width: "100%",
                        display: "block",
                        position: "absolute",
                        bottom: "0px",
                      }}
                      id="expense-jar"
                      className="expense-jar"
                    ></span>
                    <img
                      style={{
                        position: "relative",
                        width: "70px",
                        display: "block",
                      }}
                      src={imagePath + "/static/media/DG/jar.svg"}
                      alt="Rupee"
                    />
                  </div>
                  <br></br>
                  <span
                    className="mb-2 total-amt text-center"
                    style={{ fontSize: "16px" }}
                  >
                    Total{" "}
                    {totalIncome - totalExpense < 0 ? " Deficit" : "Saving"}
                    <span className="info-hover-box ms-2">
                      <span className="icon">
                        <img
                          alt="More information"
                          src={imagePath + '/static/media/more_information.svg'}
                        />
                      </span>
                      <span className="msg">
                        The below Calculation indicated<br></br>Total Income -
                        Total Expense<br></br>= Total Saving / Deficit
                      </span>
                    </span>
                  </span>
                  <br></br>
                  <b style={{ fontSize: "16px" }}>
                    {formatPrice(totalIncome)} - {formatPrice(totalExpense)}
                  </b>
                  <br></br>={" "}
                  {totalIncome - totalExpense <= 0 && (
                    <span
                      className="error"
                      style={{ fontSize: "16px", fontWeight: "bold" }}
                    >
                      ({formatPrice(totalExpense - totalIncome)})
                    </span>
                  )}
                  {totalIncome - totalExpense > 0 && (
                    <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                      {formatPrice(totalIncome - totalExpense)}
                    </span>
                  )}
                  <div style={{ fontSize: "14px" }}>
                    <b>
                      (Saving Till 31<sup>st</sup> Dec,{" "}
                      {moment().format("YYYY")})
                    </b>
                  </div>
                </div>

                <div className="col-md-10">
                  {expenseData.length > 19 && (
                    <div>
                      <p
                        style={{
                          color: "#F0806D",
                          fontSize: "15px",
                          padding: "5px",
                        }}
                      >
                        You have reached maximum limit of 20 to add Expenses,
                        Please delete some records to add new expenses or can
                        edit the existing expenses.
                      </p>
                    </div>
                  )}

                  <div style={{
                    height: scroll ? "58px" : null
                  }} className={`d-flex align-items-center  top-tab-menu justify-content-between ${scroll ? "DGsubheaderFix" : null}`}>
                    <div className="d-flex align-items-center">
                      {
                        expenseData.length >= 1 &&
                        <FintooCheckbox
                          checked={tab == "tab2" && selectedExpenseCategories.length === expenseData.length}
                          onChange={() => {
                            if (tab == "tab2" && selectedExpenseCategories.length === expenseData.length) {
                              setSelectedExpenseCategories([]);
                              setDeleteToggleexpense(false);
                            } else {
                              const allIds = expenseData.map(income => income.name);
                              setSelectedExpenseCategories(allIds);
                              setDeleteToggleexpense(true);
                            }
                          }}
                        />
                      }
                      {expenseData.length >= 1 && (
                        <div className="total-amt">
                          <span
                            style={{
                              fontWeight: "500",
                            }}
                          >
                            {" "}
                            ADDED EXPENSES
                          </span>
                          <span className="info-hover-left-box ms-2">
                            <span className="icon">
                              <img
                                alt="More information"
                                src={imagePath + '/static/media/more_information.svg'}
                              />
                            </span>
                            <span className="msg">
                              <b>Note : </b>
                              All the calculations related to your Income & Expense
                              are done as per the calendar year. Ex: If you start
                              your financial planning in the month of September, the
                              gross outflow analysis for the first year will be
                              calculated from September to December.
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {
                      selectedExpenseCategories.length > 0 &&
                      deletetoggleexpense == true && (
                        <span
                          onClick={() => {
                            handleShow();
                            setUpdateForm(false);
                            setAddForm(true);
                          }}
                          className="opt-options-2 pointer"
                          style={{
                            marginRight: "2rem"
                          }}
                        >
                          <MdDelete style={{ color: "#042b62", fontSize: "1.6rem" }} />
                        </span>
                      )
                    }
                  </div>
                  {/* {expenseRecurringTotal == 1 && lifecycleStatus == 2 && (
                    <div className="mt-2">
                      <div style={{ color: "#F0806D", marginLeft: "30px" }}>
                        Note : In expense, there should be atleast one
                        self/spouse's recurring expense.
                      </div>
                    </div>
                  )} */}

                  {checkOnlyPostRetirement == true && (
                    <div className="mt-2">
                      <div style={{ color: "#F0806D", marginLeft: "30px" }}>
                        Note : Another expense from the following categories should be
                        included in addition to the Post Retirement Expense.
                      </div>
                    </div>
                  )}

                  <div className="inner-box ">
                    {tab === "tab2" && expenseData &&
                      expenseData.map((expense, index) => {
                        const member = familyData.find(
                          (member) => member.value == expense.user_expense_for
                        );

                        const expenseMemberName = member
                          ? member.label === "Self"
                            ? member.name
                            : member.label
                          : "Family";

                        return (
                          <div key={index} className="d-flex align-items-center">
                            <FintooCheckbox
                              id={expense.name}
                              checked={selectedExpenseCategories.includes(expense.name)}
                              title={expense.title}
                              onChange={() => {
                                setSelectedExpenseCategories((prevSelected) => {
                                  if (tab == "tab2" && prevSelected.includes(expense.name)) {
                                    const updatedSelection = prevSelected.filter((id) => id !== expense.name);
                                    setDeleteToggleexpense(updatedSelection.length > 0); // Check if any checkbox is still selected
                                    return updatedSelection;
                                  } else {
                                    setDeleteToggleexpense(true);
                                    return [...prevSelected, expense.name];
                                  }
                                });
                              }}
                            />

                            <div key={expense} className="inner-container w-100">
                              {/* ngIf: (dataassets.length==1 && log_current_status>1) */}
                              <h4>
                                {expense.expense_category_type}
                                {expense.user_expense_name ? " - " + expense.user_expense_name : ""}
                              </h4>
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="display-style">
                                    <span>
                                      Value ({expense.user_expense_freq}):
                                    </span>
                                    <p
                                      className="invest-show "
                                      title={`${indianRupeeFormat(
                                        expense.user_expense_amount
                                      )}`}
                                    >
                                      {indianRupeeFormat(expense.user_expense_amount)}
                                    </p>
                                  </div>
                                </div>
                                {/* <h2>{{asset_life_cycle_status}}</h2> */}
                                <div className="col-md-4">
                                  <div className="display-style">
                                    <span>Type:</span>
                                    <p>
                                      {expense.user_expense_type}
                                      {" "}
                                      {expense.user_expense_category}
                                    </p>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  <div className="display-style">
                                    <span>Member:</span>
                                    <p>{expenseMemberName}</p>
                                  </div>
                                </div>
                                <div className="col-md-2">
                                  {lifecycleStatus != 2 && (
                                    <div className="opt-options">
                                      <span>
                                        <BsPencilFill
                                          onClick={() => {
                                            getExpenseData(expense.name, 0);
                                            setUpdateForm(true);
                                            setAddForm(false);
                                            setExpenseId(expense.name);
                                            scrollToExpenseForm();
                                          }}
                                        />
                                      </span>
                                      {/* <span
                                      onClick={() => {
                                        handleExpenseDeletePopup();
                                        setUpdateForm(false);
                                        setAddForm(true);
                                        setSelectedExpenseId(expense.id);
                                        setDeleteExpenseName(
                                          expense.expenses_categoryId +
                                          " - " +
                                          expense.expense_name
                                        );
                                      }}
                                      className="opt-options-2"
                                    >
                                      <MdDelete />
                                    </span> */}
                                    </div>
                                  )}

                                  {/* {expenseData.length > 1 &&
                                  lifecycleStatus == 2 &&
                                  expense.expenses_isRecurring == "One Time" && (
                                    <div className="opt-options">
                                      <span
                                        onClick={() => {
                                          handleExpenseDeletePopup();
                                          setSelectedExpenseId(expense.id);
                                          setDeleteExpenseName(
                                            expense.expenses_categoryId +
                                            " - " +
                                            expense.expenses_name
                                          );
                                          setUpdateForm(false);
                                          setAddForm(true);
                                        }}
                                        className="opt-options-2"
                                      >
                                        <MdDelete />
                                      </span>
                                    </div>
                                  )} */}

                                  {/* {expenseRecurringTotal > 1 &&
                                  lifecycleStatus == 2 &&
                                  expense.expenses_isRecurring == true && (
                                    <div className="opt-options">
                                      <span
                                        onClick={() => {
                                          handleExpenseDeletePopup();
                                          setUpdateForm(false);
                                          setAddForm(true);
                                          setSelectedExpenseId(expense.id);
                                          setDeleteExpenseName(
                                            expense.expenses_categoryId +
                                            " - " +
                                            expense.expenses_name
                                          );
                                        }}
                                        className="opt-options-2"
                                      >
                                        <MdDelete />
                                      </span>
                                    </div>
                                  )} */}
                                  {lifecycleStatus == 2 && (
                                    <div className="opt-options">
                                      <span>
                                        <BsPencilFill
                                          onClick={() => {
                                            getExpenseData(expense.name, 0);
                                            setUpdateForm(true);
                                            setAddForm(false);
                                            setExpenseId(expense.name);
                                            scrollToExpenseForm();
                                          }}
                                        />
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {/* ngIf: dataassets.length == 1 && asset_life_cycle_status == 2 */}
                            </div>
                          </div>
                        );
                      })
                    }

                  </div>
                </div>
                {expenseData.length < 20 && (
                  <div className="removefixheader ">
                    <div className="col-md-10 col-12">
                      <div className="accordion mt-2">
                        <div className="accordion-panel active">
                          <div className="accordion-header d-flex justify-content-between">
                            <h3
                              className="accordion-heading"
                              style={{ paddingBottom: 0 }}
                            >
                              <img
                                tyle={{
                                  verticalAlign: "middle",
                                }}
                                className="accordian-img"
                                src={imagePath + "/static/media/DG/income-expenses/expense_add.svg"}
                                alt="expense add"
                              />
                              <span
                                style={{
                                  verticalAlign: "middle",
                                }}
                              >
                                {" "}
                                Your Expenses
                              </span>
                            </h3>
                            <div
                              onClick={() => setShowExpenseView(!showExpenseView)}
                              className={`${DGstyles.HideSHowicon} hideShowIconCustom`}
                            >
                              {showExpenseView == true ? <>-</> : <>+</>}
                            </div>
                          </div>
                          {showExpenseView && (
                            <div
                              className={`accordion-content  family ${DGstyles.bgincomeexpense}`}
                            >
                              <span>
                                <label className="">
                                  Category : ({selectedOption1})
                                </label>
                                {/* end ngIf: categorydetail!=''  */}
                              </span>

                              <div className="row py-2">
                                <div className="col-10">
                                  <ul className="card-list">
                                    {expense_options.map((v, i) => (
                                      <React.Fragment key={i}>
                                        <li
                                          onClick={() => {
                                            setSelectedOption1(v.expense_cat_name);
                                            handleCategoryClick(v, "expense");
                                            setExpenseFootnote("");
                                            setExpenseForMember(parentFpUserId);
                                            scrollToExpenseRef();
                                          }}
                                          className={`li-options ${selectedOption1 == v.expense_cat_name
                                            ? "active"
                                            : ""
                                            }`}
                                        >
                                          {/* <input type="radio" value="5" id="type-5" name="type" data-show=".recurring-group" // ref="Father" ng-model="family.relation_id" className="" > */}
                                          <label htmlFor="type-2">
                                            <img alt={v.expense_cat_name} src={v.image} />
                                            {v.expense_cat_name}
                                          </label>
                                        </li>
                                      </React.Fragment>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              {expenseCatUUID == "vacation" && (
                                <div>
                                  <p
                                    style={{
                                      color: "#F0806D",
                                      fontSize: "15px",
                                      padding: "5px",
                                      // position: "absolute", top: "41px"
                                    }}
                                  >
                                    If you already have the required amount to
                                    pay for your vacation, you must add it in
                                    the ‘Expenses’ section.<br></br>
                                    In case you wish to start saving for your
                                    vacation, add it in the ‘Goals’ section.
                                  </p>
                                </div>
                              )}
                              <div className="row py-2" ref={expenseRef}>
                                <div className="col-md-5 col-12 d-flex align-items-baseline custom-input">
                                  <div className={`form-group mt-1 w-100 ${expenseName ? "inputData" : null}`}>
                                    <input type="text" id="expenseName" name="expenseName" onChange={(e) => {
                                      setExpenseName(e.target.value);
                                      handleExpenseName(e.target.value);
                                    }}
                                      value={expenseName} required autoComplete="off" />
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label htmlFor="name">Expense Name*</label>
                                  </div>
                                  <div className="error">{expenseNameError}</div>
                                </div>
                                <div className="col-md-5 col-12  custom-input">
                                  <div className={`form-group mt-1 w-100 ${expenseAmount ? "inputData" : null}`}>
                                    <input type="text" id="expenseAmount" name="expenseAmount" min="1"
                                      maxLength="9"
                                      onChange={(e) => {
                                        checkExpenseAmount(e);
                                      }}
                                      onInput={maxLengthCheck}
                                      value={expenseAmount} required autoComplete="off" />
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label htmlFor="name">Expense Value*</label>
                                  </div>
                                  <div className="error">
                                    {expenseAmountError}
                                  </div>

                                </div>
                              </div>
                              <div className="row py-2">
                                <div className="col-md-5 col-12">
                                  <div className="material">
                                    <Form.Label>Expense For*</Form.Label>
                                    {familyData && expenseForMember !== undefined && (
                                      <Select
                                        classNamePrefix="sortSelect"
                                        isSearchable={false}
                                        styles={customStyles}
                                        options={familyData}
                                        value={familyData.find((v) => v.value == expenseForMember) || null}
                                        onChange={(v) => {
                                          setExpenseForMember(v.value);
                                          handleExpenseMemberEnddate(v);
                                        }}
                                      />
                                    )}

                                  </div>
                                </div>
                              </div>

                              <div className="row py-3">
                                <div className="col-md-8 col-12">
                                  <div className="d-md-flex">
                                    <span className="">
                                      Is This Expense Fixed Or Variable?*
                                    </span>
                                    <div className="d-flex ps-md-4 SwitchElement">
                                      <div>Variable</div>
                                      <Switch
                                        onChange={() =>
                                          setExpenseFixed((prev) => (prev === "Fixed" ? "Variable" : "Fixed"))
                                        }
                                        checked={expenseIsFixed == "Fixed"}
                                        className="react-switch px-2"
                                        activeBoxShadow='0 0 2px 3px #042b62'
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        height={20}
                                        width={40}
                                        onColor="#042b62"
                                        offColor="#d8dae5"
                                      />
                                      <div>Fixed</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row py-3">
                                <div className="col-md-8 col-12">
                                  <div className="d-md-flex">
                                    <span className="">
                                      Is This Expense Mandatory Or Wishful?*
                                    </span>
                                    <div className="d-flex ps-md-4 SwitchElement">
                                      <div>Wishful</div>
                                      <Switch
                                        onChange={() => setIsWish((v) => !v)}
                                        checked={isWish}
                                        className="react-switch px-2"
                                        activeBoxShadow='0 0 2px 3px #042b62'
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        height={20}
                                        width={40}
                                        onColor="#042b62"
                                        offColor="#d8dae5"
                                      />
                                      <div>Mandatory</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row py-3">
                                <div className="col-md-8 col-12">
                                  <div className="d-md-flex d-grid">
                                    <span className="">
                                      Is The Expense One Time Or Recurring?*
                                    </span>
                                    <div className="d-flex ms-md-4">
                                      <span className="info-hover-left-box ps-md-2">
                                        <span className="icon">
                                          <img
                                            alt="More information"
                                            src={imagePath + '/static/media/more_information.svg'}
                                          />
                                        </span>
                                        <span className="msg">
                                          Date when you are expecting to spend a
                                          lumpsum amount for gifting, medical
                                          expense, etc.
                                        </span>
                                      </span>
                                      <div
                                        style={{
                                          whiteSpace: "nowrap",
                                        }}
                                        className="ps-2 ps-md-3"
                                      >
                                        One Time
                                      </div>
                                      <Switch
                                        onChange={(v) => {
                                          if (
                                            expenseRecurringTotal == 1 &&
                                            v == false &&
                                            addForm == false
                                          ) {
                                            scrollToExpenseList();
                                            setUpdateForm(true);
                                            // setAddForm(true);
                                            // resetExpenseForm();
                                          } else {
                                            setExpenseRecurring((prev) => (prev === "Recurring" ? "One Time" : "Recurring"));

                                          }
                                        }}
                                        checked={isExpenseRecurring === "Recurring"}
                                        className="react-switch px-2"
                                        activeBoxShadow='0 0 2px 3px #042b62'
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

                              {isExpenseRecurring !== "One Time" && (
                                <>
                                  <div className="row pt-3">
                                    <div className="col-md-5 col-12">
                                      <div className="material ">
                                        <div className="d-flex justify-content-end">
                                          <Form.Label>
                                            Inflation Rate* :{" "}
                                            {expenseInflationRate}
                                          </Form.Label>
                                          <span
                                            className="info-hover-box"
                                            style={{ bottom: "38px" }}
                                          >
                                            <span className="icon">
                                              <img
                                                alt="More information"
                                                src={imagePath + '/static/media/more_information.svg'}
                                              />
                                            </span>
                                            <span className="msg">
                                              It refers to the yearly increase
                                              in the prices of goods and
                                              commodities.
                                              <br />
                                              Ex: The cost of 1 liter of milk
                                              was approx. Rs. 45 in 2010. In
                                              2021 it costs approx. Rs.60 and in
                                              2040 it may cost approx. Rs. 100.
                                            </span>
                                          </span>
                                        </div>
                                        <div className={`${expenseInflationRate < 2 && "sl-hide-left"} ${expenseInflationRate > 18 && "sl-hide-right"}`}>
                                          <Slider
                                            min={0}
                                            max={20}
                                            value={expenseInflationRate}
                                            onChange={(x) => {
                                              setExpenseInflationRate(
                                                Math.round(
                                                  (parseFloat(x) +
                                                    Number.EPSILON) *
                                                  100
                                                ) / 100
                                              );
                                              // setSliderValue(x)
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row py-3">
                                    <div className="col-md-5 col-12">
                                      <div className="material">
                                        <FloatingLabel
                                          controlId="floatingInput"
                                          label="Expense Start Date*"
                                          className="mb-0 material"
                                        >
                                          <div
                                            className="dt-conbx"
                                            style={{
                                              borderBottom: "1px solid #dadada",
                                              paddingTop: "19px",
                                            }}
                                          >
                                            <ReactDatePicker
                                              select_date={expenseStartDate}
                                              setDate={(date) => setDate(date, "startDate", "expense")}
                                              maxDate={expenseCatUUID === "post_retirement_expense" ? lifeExpectancyDate : ""}
                                              minDate={expenseCatUUID === "post_retirement_expense" ? retirementDate : moment().toDate()}
                                              className="pt-2"
                                            // readOnly={true}
                                            />
                                          </div>
                                        </FloatingLabel>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row py-2">
                                    <span className="">Upto*</span>
                                    <div className="col-md-5">
                                      <FloatingLabel
                                        controlId="floatingInput"
                                        label="End Date Of Annual Expense"
                                        className="mb-0 material"
                                      >
                                        <div
                                          className="dt-conbx"
                                          style={{
                                            borderBottom: "1px solid #dadada",
                                            paddingTop: "19px",
                                          }}
                                        >
                                          <ReactDatePicker
                                            select_date={expenseEndDate}
                                            setDate={(date) => {
                                              setDate(date, "endDate", "expense");
                                              if (date != "" || date) {
                                                setExpenseEndDateError("");
                                              }
                                            }}
                                            maxDate={expenseCatUUID !== "post_retirement_expense" ? "" : lifeExpectancyDate}
                                            minDate={
                                              expenseCatUUID !== "post_retirement_expense"
                                                ? expenseEndDate
                                                : new Date(
                                                  new Date(retirementDate).getFullYear(),
                                                  new Date(retirementDate).getMonth() + 1,
                                                  1
                                                )
                                            }
                                          />
                                        </div>
                                      </FloatingLabel>
                                      <div style={{ position: "relative" }} className="error">
                                        {expenseEndDateError}
                                      </div>
                                    </div>

                                    <div className="col-md-6 col-12">
                                      <div className="dark-label mt-md-4">
                                        {expenseCatUUID != "post_retirement_expense" && (
                                          <div
                                            className="d-md-flex"
                                            style={{ clear: "both" }}
                                          >
                                            <FintooRadio2
                                              checked={selectedEndAge == 1}
                                              onClick={() => {
                                                setselectedEndAge(1);
                                                handleExpenseEndDate(1);
                                              }}
                                              title="Upto Retirement Age"
                                            />
                                            <FintooRadio2
                                              checked={selectedEndAge == 2}
                                              onClick={() => {
                                                setselectedEndAge(2);
                                                handleExpenseEndDate(2);
                                              }}
                                              title="Upto Life Expectancy Age"
                                            />
                                          </div>
                                        )}
                                        {expenseCatUUID == "post_retirement_expense" && (
                                          <div
                                            className="d-md-flex"
                                            style={{ clear: "both" }}
                                          >
                                            <FintooRadio2
                                              checked={selectedEndAge == 2}
                                              onClick={() => {
                                                setselectedEndAge(2);
                                                handleExpenseEndDate(2);
                                              }}
                                              title="Upto Life Expectancy Age"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="row py-3">
                                    <div className="col-md-5 col-12">
                                      <div className="material">
                                        <Form.Label>Frequency* </Form.Label>
                                        {(expenseCatUUID == "vacation" ||
                                          expenseCatUUID == "other_expenses") && (
                                            <>
                                            <Select
                                              classNamePrefix="sortSelect"
                                              isSearchable={false}
                                              styles={customStyles}
                                              onChange={(selectedOption) => {
                                                setExpenseFrequency(selectedOption.value);
                                                setExpenseFrequencyChange((prevValue) => prevValue + 1);
                                              }}
                                              value={sortOptionsVacationFrequency.filter(
                                                (f) => f.value === expenseFrequency
                                              )}
                                              options={sortOptionsVacationFrequency}
                                            />
                                          </>
                                          )}
                                        {expenseCatUUID != "vacation" &&
                                          expenseCatUUID != "other_expenses" && (
                                            <>
                                            <Select
                                              classNamePrefix="sortSelect"
                                              isSearchable={false}
                                              styles={customStyles}
                                              onChange={(selectedOption) => {
                                                setExpenseFrequency(selectedOption.value);
                                                setExpenseFrequencyChange((prevValue) => prevValue + 1);
                                              }}
                                              value={sortOptionsVacationFrequency.filter(
                                                (f) => f.value === expenseFrequency
                                              )}
                                              options={sortOptionsVacationFrequency}
                                            />
                                          </>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {isExpenseRecurring == "One Time" && (
                                <>
                                  <div className="row py-3">
                                    <div className="col-md-5 col-12">
                                      <div className="material">
                                        {
                                          //console.log("expenseStartDate", expenseCatUUID)
                                        }
                                        <FloatingLabel
                                          controlId="floatingInput"
                                          label="Date of One-Time Expensess*"
                                          className="mb-0 material d-flex"
                                          style={{
                                            borderBottom: "1px solid #dadada",
                                            paddingTop: "19px",
                                          }}
                                        >
                                          <ReactDatePicker
                                            setDate={(date) => setDate(date, "startDate", "expense")}
                                            select_date={expenseStartDate}
                                            minDate={
                                              expenseCatUUID !== "post_retirement_expense"
                                                ? moment().toDate()
                                                : retirementDate
                                            }
                                            maxDate={
                                              expenseCatUUID !== "post_retirement_expense"
                                                ? moment().endOf("year").toDate()
                                                : lifeExpectancyDate
                                            }
                                          />

                                          <span className="info-hover-box">
                                            <span className="icon">
                                              <img
                                                alt="More information"
                                                src={imagePath + '/static/media/more_information.svg'}
                                              />
                                            </span>
                                            <span className="msg">
                                              In this section, you can add your
                                              current year’s one-time expense.
                                            </span>
                                          </span>
                                        </FloatingLabel>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              <div className="row">
                                <div className="col-md-9 col-12 custom-input">
                                  <div className={`form-group mt-1  ${expenseName ? "inputData" : null}`}>
                                    <input type="text" id="Remarks_1" name="Remarks"
                                      onChange={(e) =>
                                        setExpenseFootnote(e.target.value)
                                      }
                                      value={expenseFootnote} autoComplete="off" />
                                    <span className="highlight"></span>
                                    <span className="bar"></span>
                                    <label htmlFor="name">Remarks</label>
                                  </div>

                                </div>
                              </div>
                              <div className="row py-2">
                                <div className=" text-center">
                                  <div>
                                    <div className="btn-container">
                                      <div className="d-flex justify-content-center">
                                        <div
                                          className="previous-btn form-arrow d-flex align-items-center"
                                          onClick={() => {
                                            ScrollToTop();
                                            setTab("tab1")
                                          }
                                          }
                                        >
                                          <FaArrowLeft />
                                          <span className="hover-text">
                                            &nbsp;Previous
                                          </span>
                                        </div>
                                        {addForm && (
                                          <button
                                            onClick={(e) => saveExpenseData(e)}
                                            className="default-btn gradient-btn save-btn"
                                          >
                                            Save & Add More
                                          </button>
                                        )}
                                        {updateForm && (
                                          <div>
                                            <button
                                              onClick={(e) =>
                                                cancelFormData(e, "expense")
                                              }
                                              className="default-btn gradient-btn save-btn"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              onClick={(e) =>
                                                updateExpenseData(e)
                                              }
                                              className="default-btn gradient-btn save-btn"
                                            >
                                              Update
                                            </button>
                                          </div>
                                        )}

                                        <Link
                                          to={
                                            process.env.PUBLIC_URL +
                                            "/datagathering/goals"
                                          }
                                        >
                                          <div className="next-btn form-arrow d-flex align-items-center">
                                            <span
                                              className="hover-text"
                                              style={{ maxWidth: 100 }}
                                            >
                                              Continue&nbsp;
                                            </span>
                                            <FaArrowRight />
                                          </div>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {expenseData.length == 20 && updateForm && (
                  <div className=" ">
                    <div className="col-md-10 col-12">
                      <div className="accordion mt-2">
                        <div className="accordion-panel active">
                          <div className="accordion-header">
                            <h3
                              className="accordion-heading"
                              style={{ paddingBottom: 0 }}
                            >
                              <img
                                tyle={{
                                  verticalAlign: "middle",
                                }}
                                className="accordian-img"
                                src={imagePath + "/static/media/DG/income-expenses/expense_add.svg"}
                                alt="expense add"
                              />
                              <span
                                style={{
                                  verticalAlign: "middle",
                                }}
                              >
                                {" "}
                                Your Expenses
                              </span>
                            </h3>
                          </div>
                          <div
                            className={`accordion-content  family ${DGstyles.bgincomeexpense}`}
                          >
                            <span>
                              <label className="">
                                Category : ({selectedOption1})
                              </label>
                              {/* end ngIf: categorydetail!=''  */}
                            </span>

                            <div className="row py-2">
                              <div className="col-10">
                                <ul className="card-list">
                                  {expense_options.map((v, i) => (
                                    <React.Fragment key={i}>
                                      <li
                                        onClick={() => {
                                          setSelectedOption1(v.expense_cat_name);
                                          handleCategoryClick(v, "expense");
                                          setExpenseFootnote("");
                                          setExpenseForMember(parentFpUserId);
                                          scrollToExpenseRef();

                                        }}
                                        className={`li-options ${selectedOption1 == v.expense_cat_name
                                          ? "active"
                                          : ""
                                          }`}
                                      >
                                        {/* <input type="radio" value="5" id="type-5" name="type" data-show=".recurring-group" // ref="Father" ng-model="family.relation_id" className="" > */}
                                        <label htmlFor="type-2">
                                          <img alt={v.expense_cat_name} src={v.image} />
                                          {v.expense_cat_name}
                                        </label>
                                      </li>
                                    </React.Fragment>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            {expenseCatUUID == "vacation" && (
                              <div>
                                <div className="error">
                                  If you already have the required amount to pay
                                  for your vacation, you must add it in the
                                  ‘Expenses’ section.<br></br>
                                  In case you wish to start saving for your
                                  vacation, add it in the ‘Goals’ section.
                                </div>
                              </div>
                            )}
                            <div className="row py-3">
                              <div className="col-md-5 col-12 custom-input d-flex align-items-baseline">
                                <div className={`form-group mt-1 w-100 ${expenseName ? "inputData" : null}`}>
                                  <input type="text" id="expenseName_s" name="expenseName_s" onChange={(e) => {
                                    setExpenseName(e.target.value);
                                    handleExpenseName(e.target.value);
                                  }}
                                    value={expenseName} required autoComplete="off" />
                                  <span className="highlight"></span>
                                  <span className="bar"></span>
                                  <label htmlFor="name">Expense Name*</label>
                                </div>
                                <div className="error">{expenseNameError}</div>
                              </div>
                              <div className="col-md-5 col-12 custom-input d-flex align-items-baseline">
                                <div className={`form-group mt-1 w-100 ${expenseAmount ? "inputData" : null}`}>
                                  <input type="text" id="expenseAmount_s" name="expenseAmount"
                                    min="1"
                                    maxLength="9"
                                    onChange={(e) => {
                                      checkExpenseAmount(e);
                                    }}
                                    onInput={maxLengthCheck}
                                    value={expenseAmount} required autoComplete="off" />
                                  <span className="highlight"></span>
                                  <span className="bar"></span>
                                  <label htmlFor="name">Expense Value*</label>
                                </div>
                                <div className="error">{expenseAmountError}</div>
                              </div>
                            </div>
                            <div className="row py-3">
                              <div className="col-md-5 col-12">
                                <div className="material">
                                  <Form.Label>Expense For*</Form.Label>
                                  {familyData && expenseForMember !== undefined && (
                                    <Select
                                      classNamePrefix="sortSelect"
                                      isSearchable={false}
                                      styles={customStyles}
                                      options={familyData}
                                      value={familyData.find((v) => v.value == expenseForMember) || null}
                                      onChange={(v) => {
                                        setExpenseForMember(v.value);
                                        setGoalDetails({
                                          ...goaldetails,
                                          goal_for_member: e.value
                                        });
                                        handleExpenseMemberEnddate(v);
                                      }}
                                    />
                                  )}

                                </div>
                              </div>
                            </div>

                            <div className="row py-3">
                              <div className="col-md-8 col-12">
                                <div className="d-md-flex">
                                  <span className="">
                                    Is This Expense Fixed Or Variable?*
                                  </span>
                                  <div className="d-flex ps-md-4 SwitchElement">
                                    <div>Variable</div>
                                    <Switch
                                      onChange={() =>
                                        setExpenseFixed((prev) => (prev === "Fixed" ? "Variable" : "Fixed"))
                                      }
                                      checked={expenseIsFixed == "Fixed"}
                                      className="react-switch px-2"
                                      activeBoxShadow='0 0 2px 3px #042b62'
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={40}
                                      onColor="#042b62"
                                      offColor="#d8dae5"
                                    />
                                    <div>Fixed</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row py-3">
                              <div className="col-md-8 col-12">
                                <div className="d-md-flex">
                                  <span className="">
                                    Is This Expense Mandatory Or Wishful?*
                                  </span>
                                  <div className="d-flex ps-md-4 SwitchElement">
                                    <div>Wishful</div>
                                    <Switch
                                      onChange={() => setIsWish((v) => !v)}
                                      checked={isWish}
                                      className="react-switch px-2"
                                      activeBoxShadow='0 0 2px 3px #042b62'
                                      uncheckedIcon={false}
                                      checkedIcon={false}
                                      height={20}
                                      width={40}
                                      onColor="#042b62"
                                      offColor="#d8dae5"
                                    />
                                    <div>Mandatory</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row py-3">
                              <div className="col-md-8 col-12">
                                <div className="d-md-flex d-grid">
                                  <span className="">
                                    Is The Expense One Time Or Recurring?*
                                  </span>
                                  <div className="d-flex ms-md-4">
                                    <span className="info-hover-left-box ps-md-4">
                                      <span className="icon">
                                        <img
                                          alt="More information"
                                          src={imagePath + '/static/media/more_information.svg'}
                                        />
                                      </span>
                                      <span className="msg">
                                        Date when you are expecting to spend a
                                        lumpsum amount for gifting, medical
                                        expense, etc.
                                      </span>
                                    </span>
                                    <div
                                      style={{
                                        whiteSpace: "nowrap",
                                      }}
                                      className="ps-2 ps-md-0"
                                    >
                                      One Time
                                    </div>
                                    <Switch
                                      onChange={(v) => {
                                        if (
                                          expenseRecurringTotal == 1 &&
                                          v == false &&
                                          addForm == false
                                        ) {
                                          scrollToExpenseList();
                                          setUpdateForm(true);
                                          // setAddForm(true);
                                          // resetExpenseForm();
                                        } else {
                                          setExpenseRecurring((prev) => (prev === "Recurring" ? "One Time" : "Recurring"));
                                        }
                                      }}
                                      checked={isExpenseRecurring === "Recurring"}
                                      className="react-switch px-2"
                                      activeBoxShadow='0 0 2px 3px #042b62'
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
                            {isExpenseRecurring && (
                              <>
                                <div className="row py-3">
                                  <div className="col-md-5 col-12">
                                    <div className="material ">
                                      <div className="d-flex justify-content-end">
                                        <Form.Label>
                                          Inflation Rate* :{" "}
                                          {expenseInflationRate}
                                        </Form.Label>
                                        <span
                                          className="info-hover-box"
                                          style={{ bottom: "38px" }}
                                        >
                                          <span className="icon">
                                            <img
                                              alt="More information"
                                              src={imagePath + '/static/media/more_information.svg'}
                                            />
                                          </span>
                                          <span className="msg">
                                            It refers to the yearly increase in
                                            the prices of goods and commodities.
                                            <br />
                                            Ex: The cost of 1 liter of milk was
                                            approx. Rs. 45 in 2010. In 2021 it
                                            costs approx. Rs.60 and in 2040 it
                                            may cost approx. Rs. 100.
                                          </span>
                                        </span>
                                      </div>
                                      <Slider
                                        min={0}
                                        max={20}
                                        defaultValue={expenseInflationRate}
                                        onChange={(v) => {
                                          setSliderValue(v),
                                            setExpenseInflationRate(v);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="row py-3">
                                  <div className="col-md-5 col-12">
                                    <div className="material">
                                      <FloatingLabel
                                        controlId="floatingInput"
                                        label="Expense Start Date*"
                                        className="mb-0 material"
                                      >
                                        <div
                                          className="dt-conbx"
                                          style={{
                                            borderBottom: "1px solid #dadada",
                                            paddingTop: "19px",
                                          }}
                                        >
                                          <ReactDatePicker
                                            select_date={expenseStartDate}
                                            setDate={(date) => setDate(date, "startDate", "expense")}
                                            maxDate={expenseCatUUID === "post_retirement_expense" ? lifeExpectancyDate : ""}
                                            minDate={expenseCatUUID === "post_retirement_expense" ? retirementDate : moment().toDate()}
                                            className="pt-2"
                                          // readOnly={true}
                                          />
                                        </div>
                                      </FloatingLabel>
                                    </div>
                                  </div>
                                </div>
                                <div className="row py-2">
                                  <span className="">Upto*</span>
                                  <div className="col-md-5">
                                    <FloatingLabel
                                      controlId="floatingInput"
                                      label="End Date Of Annual Expense"
                                      className="mb-0 material"
                                    >
                                      <div
                                        className="dt-conbx"
                                        style={{
                                          borderBottom: "1px solid #dadada",
                                          paddingTop: "19px",
                                        }}
                                      >
                                        <ReactDatePicker
                                          select_date={expenseEndDate}
                                          setDate={(date) => setDate(date, "endDate", "expense")}
                                          maxDate={expenseCatUUID !== "post_retirement_expense" ? "" : lifeExpectancyDate}
                                          minDate={
                                            expenseCatUUID !== "post_retirement_expense"
                                              ? expenseEndDate
                                              : new Date(
                                                new Date(retirementDate).getFullYear(),
                                                new Date(retirementDate).getMonth() + 1,
                                                1
                                              )
                                          }
                                        />

                                      </div>
                                    </FloatingLabel>
                                    <div className="error">
                                      {expenseEndDateError}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-12">
                                    <div className="dark-label mt-md-4">
                                      {expenseCatUUID != "post_retirement_expense" && (
                                        <div
                                          className="d-md-flex"
                                          style={{ clear: "both" }}
                                        >
                                          <FintooRadio2
                                            checked={selectedEndAge == 1}
                                            onClick={() => {
                                              setselectedEndAge(1);
                                              handleExpenseEndDate(1);
                                            }}
                                            title="Upto Retirement Age"
                                          />
                                          <FintooRadio2
                                            checked={selectedEndAge == 2}
                                            onClick={() => {
                                              setselectedEndAge(2);
                                              handleExpenseEndDate(2);
                                            }}
                                            title="Upto Life Expectancy Age"
                                          />
                                        </div>
                                      )}
                                      {expenseCatUUID == "post_retirement_expense" && (
                                        <div
                                          className="d-md-flex"
                                          style={{ clear: "both" }}
                                        >
                                          <FintooRadio2
                                            checked={selectedEndAge == 2}
                                            onClick={() => {
                                              setselectedEndAge(2);
                                              handleExpenseEndDate(2);
                                            }}
                                            title="Upto Life Expectancy Age"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="row py-3">
                                  <div className="col-md-5 col-12">
                                    <div className="material">
                                      <Form.Label>Frequency*</Form.Label>
                                      {(expenseCatUUID == "vacation" ||
                                        expenseCatUUID == "other_expenses") && (
                                          <Select
                                            classNamePrefix="sortSelect"
                                            isSearchable={false}
                                            styles={customStyles}
                                            onChange={(selectedOption) => {
                                              setExpenseFrequency(
                                                selectedOption.value
                                              );
                                              setExpenseFrequencyChange(
                                                (prevValue) => prevValue + 1
                                              );
                                            }}
                                            value={sortOptionsVacationFrequency.filter(
                                              (f) => f.value === expenseFrequency
                                            )}
                                            options={sortOptionsVacationFrequency}
                                          />
                                        )}
                                      {expenseCatUUID != "vacation" &&
                                        expenseCatUUID != "other_expenses" && (
                                          <Select
                                            classNamePrefix="sortSelect"
                                            isSearchable={false}
                                            styles={customStyles}
                                            onChange={(selectedOption) => {
                                              setExpenseFrequency(
                                                selectedOption.value
                                              );
                                              setExpenseFrequencyChange(
                                                (prevValue) => prevValue + 1
                                              );
                                            }}
                                            value={sortOptionsFrequency.filter(
                                              (f) =>
                                                f.value === expenseFrequency
                                            )}
                                            options={sortOptionsFrequency}
                                          />
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {isExpenseRecurring == false && (
                              <>
                                <div className="row py-3">
                                  <div className="col-md-5 col-12">
                                    <div className="material">
                                      <FloatingLabel
                                        controlId="floatingInput"
                                        label="Date of One-Time Expense*"
                                        className="mb-0 material d-flex"
                                        style={{
                                          borderBottom: "1px solid #dadada",
                                          paddingTop: "19px",
                                        }}
                                      >
                                        {expenseCatUUID != "post_retirement_expense" && (
                                          <ReactDatePicker
                                            setDate={(expenseStartDate) =>
                                              setDate(
                                                expenseStartDate,
                                                "startDate",
                                                "expense"
                                              )
                                            }
                                            select_date={expenseStartDate}
                                            maxDate={
                                              new Date(
                                                new Date().getFullYear(),
                                                11,
                                                31
                                              )
                                            }
                                            minDate={
                                              new Date(
                                                new Date().getFullYear(),
                                                0,
                                                1
                                              )
                                            }
                                          />
                                        )}
                                        {expenseCatUUID == "post_retirement_expense" && (
                                          <div>
                                            <ReactDatePicker
                                              setDate={(expenseStartDate) =>
                                                setDate(
                                                  expenseStartDate,
                                                  "startDate",
                                                  "expense"
                                                )
                                              }
                                              select_date={retirementDate}
                                              minDate={retirementDate}
                                              maxDate={lifeExpectancyDate}
                                            />
                                          </div>
                                        )}

                                        <span className="info-hover-box">
                                          <span className="icon">
                                            <img
                                              alt="More information"
                                              src={imagePath + '/static/media/more_information.svg'}
                                            />
                                          </span>
                                          <span className="msg">
                                            In this section, you can add your
                                            current year’s one-time expense.
                                          </span>
                                        </span>
                                      </FloatingLabel>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}

                            <div className="row">
                              <div className="col-md-9 col-12">
                                <div className={`form-group mt-1  ${expenseName ? "inputData" : null}`}>
                                  <input type="text" id="Remarks_3" name="Remarks"
                                    onChange={(e) =>
                                      setExpenseFootnote(e.target.value)
                                    }
                                    value={expenseFootnote} autoComplete="off" />
                                  <span className="highlight"></span>
                                  <span className="bar"></span>
                                  <label htmlFor="name">Remarks</label>
                                </div>
                              </div>
                            </div>

                            <div className="row py-2">
                              <div className=" text-center">
                                <div>
                                  <div className="btn-container">
                                    <div className="d-flex justify-content-center">
                                      <div
                                        className="previous-btn form-arrow d-flex align-items-center"
                                        onClick={() => {
                                          ScrollToTop();
                                          setTab("tab1")
                                        }
                                        }
                                      >
                                        <FaArrowLeft />
                                        <span className="hover-text">
                                          &nbsp;Previous
                                        </span>
                                      </div>
                                      {addForm && (
                                        <button
                                          onClick={(e) => saveExpenseData(e)}
                                          className="default-btn gradient-btn save-btn"
                                        >
                                          Save & Add More
                                        </button>
                                      )}
                                      {updateForm && (
                                        <div>
                                          <button
                                            onClick={(e) =>
                                              cancelFormData(e, "expense")
                                            }
                                            className="default-btn gradient-btn save-btn"
                                          >
                                            Cancel
                                          </button>
                                          <button
                                            onClick={(e) =>
                                              updateExpenseData(e)
                                            }
                                            className="default-btn gradient-btn save-btn"
                                          >
                                            Update
                                          </button>
                                        </div>
                                      )}

                                      <Link
                                        to={
                                          process.env.PUBLIC_URL +
                                          "/datagathering/goals"
                                        }
                                      >
                                        <div className="next-btn form-arrow d-flex align-items-center">
                                          <span
                                            className="hover-text"
                                            style={{ maxWidth: 100 }}
                                          >
                                            Continue&nbsp;
                                          </span>
                                          <FaArrowRight />
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {expenseData.length >= 20 && updateForm == false && (
                  <div className=" py-2">
                    <div className=" text-center">
                      <div>
                        <div className="btn-container">
                          <div
                            className="d-flex justify-content-center"
                            style={{ marginRight: "15%" }}
                          >
                            <Link
                              to={
                                process.env.PUBLIC_URL + "/datagathering/about-you"
                              }
                            >
                              <div className="previous-btn form-arrow d-flex align-items-center">
                                <FaArrowLeft />
                                <span className="hover-text">
                                  &nbsp;Previous
                                </span>
                              </div>
                            </Link>

                            <div
                              className="next-btn form-arrow d-flex align-items-center"
                              onClick={() => {
                                ScrollToTop();
                                setTab("tab2")
                              }
                              }
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {tab === "tab1" ? (
        recurringTotal === recurringCheckboxCount && lifecycleStatus === 2 ? (
          <Modal className="popupmodal" centered show={show} onHide={handleClose}>
            <Modal.Header className="ModalHead">
              <div className="text-center">Alert</div>
            </Modal.Header>
            <div className=" p-5 d-grid place-items-center align-item-center">
              <div className=" HeaderModal">
                <div
                  style={{
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  As you have already generated the report there should be at least one self/spouse's recurring income.
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center pb-5">
              <button
                onClick={() => {
                  handleClose("no", "income");
                }}
                className="outline-btn m-2"
              >
                Ok
              </button>
            </div>
          </Modal>
        ) : (
          <Modal className="popupmodal" centered show={show} onHide={handleClose}>
            <Modal.Header className="ModalHead">
              <div className="text-center">Delete Confirmation</div>
            </Modal.Header>
            <div className="p-5 d-grid place-items-center align-item-center">
              <div className="HeaderModal">
                <div style={{ fontSize: "1rem", textAlign: "center" }}>
                  This will permanently erase the record and its associated information.
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center pb-5">
              <button
                onClick={() => {
                  handleClose("yes", "income");
                }}
                className="outline-btn m-2"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  handleClose("no", "income");
                }}
                className="outline-btn m-2"
              >
                No
              </button>
            </div>
          </Modal>
        )
      ) : (
        expenseData && expenseRecurringTotal === recurringExpesneCheckboxCount && lifecycleStatus === 2 ? (
          <Modal className="popupmodal" centered show={show} onHide={handleClose}>
            <Modal.Header className="ModalHead">
              <div className="text-center">Alert</div>
            </Modal.Header>
            <div className=" p-5 d-grid place-items-center align-item-center">
              <div className=" HeaderModal">
                <div
                  style={{
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  As you have already generated the report there should be at least one self/spouse's recurring expense.
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center pb-5">
              <button
                onClick={() => {
                  handleClose("no", "expense");
                }}
                className="outline-btn m-2"
              >
                Ok
              </button>
            </div>
          </Modal>
        ) : (
          <Modal className="popupmodal" centered show={show} onHide={handleClose}>
            <Modal.Header className="ModalHead">
              <div className="text-center">Delete Confirmation</div>
            </Modal.Header>
            <div className=" p-5 d-grid place-items-center align-item-center">
              <div className=" HeaderModal">
                <div
                  style={{
                    fontSize: "1rem",
                    textAlign: "center",
                  }}
                >
                  This will permanently erase the record and its associated information.
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center pb-5">
              <button
                onClick={() => {
                  handleClose("yes", "expense");
                }}
                className="outline-btn m-2"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  handleClose("no", "expense");
                }}
                className="outline-btn m-2"
              >
                No
              </button>
            </div>
          </Modal>
        )
      )}



      {/* <Modal
        className="popupmodal"
        centered
        show={expenseShow}
        onHide={handleClose}
      >
        <Modal.Header className="ModalHead">
          <div className="text-center">Delete Confirmation</div>
        </Modal.Header>
        <div className=" p-5 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              This will permanently erase the record and its associated
              information.
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button
            onClick={() => {
              handleClose("yes", "expense");
            }}
            className="outline-btn m-2"
          >
            Yes
          </button>
          <button
            onClick={() => {
              handleClose("no", "expense");
            }}
            className="outline-btn m-2"
          >
            No
          </button>
        </div>
      </Modal> */}
    </DatagatherLayout>
  );
};
export default IncomeExpense;
