import React, { useEffect, useState, useRef } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { FaArrowLeft, FaArrowRight, FaCommentsDollar } from "react-icons/fa";
import QuizeRadio from "../../components/HTML/QuizRadio";
import { GrEdit } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import { BsPencilFill } from "react-icons/bs";
import { Row, Modal } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import Switch from "react-switch";
import Select from "react-select";
import DatagatherLayout from "../../components/Layout/Datagather";
// import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import FintooRadio2 from "../../components/FintooRadio2";
import ReactDatePicker from "../../components/HTML/ReactDatePicker/ReactDatePicker";
import Slider from "../../components/HTML/Slider";
import { Link, useLocation } from "react-router-dom";
import { useOnHoverOutside } from "./useOnHoverOutside";
import {
  apiCall,
  getItemLocal,
  getParentUserId,
  loginRedirectGuest,
  setBackgroundDivImage, alphanumeric_custom,
  customspacing,
  special_start,
  getParentFpLogId
} from "../../common_utilities";
import {
  DATA_BELONGS_TO,
  STATIC_URL,
  imagePath
} from "../../constants";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import DGstyles from "./DG.module.css";
import FintooLoader from "../../components/FintooLoader";
import customStyles from "../../components/CustomStyles";
import { useDispatch } from "react-redux";
import commonEncode from "../../commonEncode";
import { ScrollToTop } from "./ScrollToTop"
import FintooCheckbox from "../../components/FintooCheckbox/FintooSubCheckbox";
import { addGoalDetails, deleteGoalDetails, getGoalCategoryList, getGoalDetails, getGoalDetailsByGoalId, UpdateGoalDetails } from "../../FrappeIntegration-Services/services/financial-planning-api/goal";
import { getFamilyMember } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import Cookies from "js-cookie"

const Goals = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState("tab1");
  const [selectedOption, setSelectedOption] = useState("education");
  const [sessiondata, setSessionData] = useState({});
  const [fplogid, setFpLogId] = useState("");
  const [goaldata, setGoalData] = useState([]);
  const [memberdata, setMemberData] = useState([]);
  const [familydata, setFamilyData] = useState([]);
  const [retirmentdate, setRetirmentDate] = useState("");
  const [showRadioButton, setshowRadioButton] = useState(true);
  const [lifeexpectancydate, setLifeExpentancyDate] = useState("");
  const [memberAge, setMemberAge] = useState(0);
  const [memberDob, setMemberDob] = useState("");
  const [goalid, setGoalId] = useState(0);
  const [rordata, setRORData] = useState([]);
  const [goalname, setGoalName] = useState("");
  const [editflag, setEditFlag] = useState(false);
  const [goalcategorytype, setCategoryType] = useState("");
  const dropdownRef = useRef(null);
  const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false);
  const [showview, setShowView] = useState(true);
  const location = useLocation();
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [oldMember, setOldMember] = useState({});
  const [deletetoggle, setDeleteToggle] = useState(false);
  const [deletetogglegoal, setDeleteTogglegoal] = useState(false);
  const [selectedgoalCategories, setSelectedgoalCategories] = useState([]);
  const [selfData, setSelfData] = useState({});
  const [scroll, setScroll] = useState(false);
  const [options, setOptions] = useState([]);
  const [sortOptionsEducation, setSortOptionsEducation] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const removefixheader = document.querySelector('.removefixheader');
      const FixdgsubHeader = document.querySelector('.FixdgHeader');
      const scrollPosition = window.scrollY;
      if (removefixheader && FixdgsubHeader) {
        const removefixheaderRect = removefixheader.getBoundingClientRect();
        if (scrollPosition > 50) {
          setScroll(true)
          FixdgsubHeader.classList.add("DGsubheaderFix")
        } else {
          setScroll(false);
          FixdgsubHeader.classList.remove("DGsubheaderFix")

        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);

    };
  }, []);
  useEffect(() => {

    document.body.classList.add("dg-layout");

    const interval = setInterval(() => {
      const bgGoals = document.getElementById("bg-goals");
      if (bgGoals) {
        bgGoals.style.background = `url(${imagePath}/static/media/DG/goals.svg) no-repeat right top`;
        clearInterval(interval);
        setBackgroundDivImage();
      }
    }, 50);

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
  const closeHoverMenu = () => {
    setMenuDropDownOpen(false);
  };
  useOnHoverOutside(dropdownRef, closeHoverMenu);
  // const defaultGoalDetails = {
  //   user_goal_name: "Education",
  //   // goal_category_type: "Education",
  //   goal_cat_id: "education",
  //   user_goal_amount: "",
  //   user_goal_user_id: 0,
  //   // fp_log_id: 0,
  //   // user_goal_end_date: moment().format("DD/MM/YYYY"),
  //   user_goal_for: getParentUserId(),
  //   user_goal_context: "Individual",
  //   user_goal_freq: "Monthly",
  //   user_goal_growth_rate: 10,
  //   user_goal_interest_rate: 0,
  //   goal_isAfterRetirement: "0",
  //   user_goal_type: "Critical",
  //   user_goal_funded_by: "Self",
  //   user_goal_valid_till: null,
  //   // goal_isCritical: false,
  //   user_goal_occurance: "One Time",
  //   user_goal_loan_percentage: 0,
  //   goal_partial_loan: false,
  //   user_goal_priority: "High",
  //   user_goal_start_date: moment().format("DD/MM/YYYY"),
  //   // user_goal_end_date: moment().format("DD/MM/YYYY"),
  //   user_goal_end_date: moment(retirmentdate, "MM/DD/YYYY").isValid()
  //   ? moment(retirmentdate, "MM/DD/YYYY").format("DD/MM/YYYY")
  //   : "",
  //   user_goal_edu_cat_id: "ECAT-1",
  //   user_goal_loan_tenure: 0,
  //   user_goal_user_age: "",
  //   user_goal_user_dob: "",
  //   // memberDOB: null,
  //   user_goal_remarks: "",
  //   data_belongs_to: DATA_BELONGS_TO,
  //   goal_for_member: getParentUserId(),
  // };

  // ✅ helper to create default goal details dynamically
  const getDefaultGoalDetails = (goalCategories, goalName = "Education") => {
    const matchedCategory = goalCategories.find(
      (cat) => cat.goal_name.toLowerCase() === goalName.toLowerCase()
    );

    return {
      user_goal_name: goalName,
      goal_cat_id: matchedCategory ? matchedCategory.goal_id : null,
      goal_name_uuid: matchedCategory ? matchedCategory.goal_name_uuid : null,
      goal_category_type: matchedCategory ? matchedCategory.goal_name : null,
      user_goal_amount: "",
      user_goal_user_id: getParentUserId(),
      user_goal_for: getParentUserId(),
      user_goal_context: "Individual",
      user_goal_freq: "Yearly",
      user_goal_growth_rate: 10.0,
      user_goal_interest_rate: 0,
      goal_isAfterRetirement: null,
      user_goal_type: "Critical",
      user_goal_funded_by: "Self",
      user_goal_valid_till: null,
      user_goal_occurance: "One Time",
      user_goal_loan_percentage: 0,
      goal_partial_loan: false,
      user_goal_priority: "High",
      user_goal_start_date: moment().format("DD/MM/YYYY"),   // ✅ Always current date
      // user_goal_end_date: moment().add(3, 'years').format("DD/MM/YYYY"), // ✅ Default to 3 years later
      user_goal_end_date: "",
      user_goal_edu_cat_id: "ECAT-1",
      goal_edu_cat_id: "ECAT-1",
      user_goal_loan_tenure: 0,
      user_goal_user_age: "",
      // user_goal_user_dob: "",
      user_goal_remarks: "",
      data_belongs_to: DATA_BELONGS_TO,
      goal_for_member: getParentUserId(),
    };
  };
  const [goaldetails, setGoalDetails] = useState({});  // start empty
  const [goalCategories, setGoalCategories] = useState([]);

  const defaultHandleError = {
    goalName: "",
    goalCurrentValue: "",
    goalEduType: "",
    goalStartDate: "",
    goalEndDate: "",
    goalFrequency: "",
  };
  const [handlerror, setHandleError] = useState(defaultHandleError);
  const userid = getParentUserId();
  const fpLogId = getParentFpLogId();
  const cntRef = useRef(null);
  const scrollToGoalRef = () => {
    cntRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  const [show, setShow] = useState(false);
  const [counter, setCounter] = useState(0);
  const [editEducation, setEditEducation] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const calculateAge = (dob, refDate = moment()) => {
    if (!dob || !moment(dob, "DD/MM/YYYY").isValid()) return '';
    const birthDate = moment(dob, "DD/MM/YYYY");
    return refDate.diff(birthDate, "years");
  };

  // 2. Utility to robustly get DOB from goaldetails or fallback to familydata
  const getMemberDOB = (goalDetails, familydata, memberdata) => {
    if (goalDetails.user_goal_user_dob && moment(goalDetails.user_goal_user_dob, "DD/MM/YYYY").isValid()) {
      return goalDetails.user_goal_user_dob;
    }
    // Try to get currently selected member's id
    const memberId = goalDetails.user_goal_for || memberdata?.[0]?.value || '';
    const member = familydata.find(
      m => m.user_id === memberId || m.value === memberId
    );
    if (member && member.dob && moment(member.dob, "DD/MM/YYYY").isValid()) {
      return member.dob;
    }
    return "";
  };


  useEffect(() => {
    if (goaldetails.goal_category_type?.toLowerCase() === "marriage") {
      setGoalDetails(prev => ({
        ...prev,
        user_goal_occurance: "One Time",
        user_goal_freq: "One Time",
      }));
    }
  }, [goaldetails]);



  useEffect(() => {
    document.body.classList.add("dg-layout");
    return () => {
      document.body.classList.remove("rp-layout");
    };
  }, []);

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
  }, []);
  useEffect(() => {
    // setIsLoading(true);
    getSessionData();
    getDefaultROR();
  }, []);

  const getDefaultROR = async () => {
    try {
      let url = '';
      let ror_data = await apiCall(url, "", true, false);
      if (ror_data["error_code"] == "100") {
        setRORData(ror_data["data"]["ror_data"]["5"]);
      } else {
        setRORData([]);
      }
    } catch { }
  };
  const scrollToGoalForm = () => {
    const { offsetTop } = cntRef.current;
    window.scroll({ top: offsetTop - 50 });
  };

  const handleLocalStorageGoalsData = (id = undefined, update = "0") => {
    let member_name = "";
    let member_id = "";

    if (id != undefined) {
      var details = getGoalDetailsById(id);
      member_name = details['member_name'];
      member_id = details['member_id'];
    }
    else {
      member_name = goaldetails["goalforname"];
      member_id = goaldetails["goal_for_member"];
    }
    let member_goals = JSON.parse(localStorage.getItem('memberGoals'));


    let member = ""
    if (member_name == "Family") {
      member = "all"
    }
    else {
      if (member_id != undefined) {
        member = member_id.toString();
      }
    }
    if (member_goals != null) {
      if (member in member_goals) {
        member_goals[member] = undefined
      }
      if (member != "all") {
        member_goals["all"] = undefined
      }
      if (update == "1") {
        let old_member = oldMember['member'];
        let old_member_id = oldMember['member_id'];
        if (old_member != "Family" && old_member_id?.toString() != member && old_member_id in member_goals) {
          member_goals[old_member_id] = undefined
        }
      }
      localStorage.setItem('memberGoals', JSON.stringify(member_goals))
    }
  };

  const scrollToGoalList = () => {
    const { offsetTop } = cntRef.current;
    window.scroll({ top: offsetTop - 1500 });
  };


  // const getFamilyMembers = async () => {
  //   try {
  //     const data_belongs_to = DATA_BELONGS_TO;
  //     let member_data = await getFamilyMember(user_data.user_id);

  //     if (member_data.status_code == "200") {
  //       var member_array = [];
  //       var members = member_data["data"];

  //       members.map((member) => {
  //         const isSelf =
  //           member.relation_id === 1 || member.relation === "Self";
  //         if (isSelf) {
  //           setIncomeForMember(member.user_id);
  //           setExpenseForMember(member.user_id);
  //           setParentFpUserId(member.user_id);

  //           const hasValidDob =
  //             member.dob &&
  //             typeof member.dob === "string" &&
  //             member.dob.includes("/") &&
  //             member.retirement_age > 0 &&
  //             member.life_expectancy_age > 0;

  //           if (hasValidDob && member.retirement_age > 0 && member.life_expectancy_age > 0) {
  //             const dobMoment = moment(member.dob, "DD/MM/YYYY");

  //             const retirement_date = dobMoment
  //               .clone()
  //               .add(member.retirement_age, "years")
  //               .format("MM/DD/YYYY");

  //             const life_expectancy_date = dobMoment
  //               .clone()
  //               .add(member.life_expectancy_age, "years")
  //               .format("MM/DD/YYYY");

  //             setRetirementDate(retirement_date);
  //             setLifeExpectancyDate(life_expectancy_date);

  //             setSelfData({
  //               retirement_date,
  //               life_expectancy_date,
  //             });
  //           } else {
  //             setRetirementDate(null);
  //             setLifeExpectancyDate(null);
  //             setSelfData({
  //               retirement_date: null,
  //               life_expectancy_date: null,
  //             });
  //           }

  //           member_array.push({
  //             value: member.user_id,
  //             label: "Self",
  //             retirement_age: member.retirement_age,
  //             dob: member.dob,
  //             life_expectancy: member.life_expectancy_age,
  //             isdependent: member.is_dependent,
  //           });
  //         } else {
  //           member_array.push({
  //             value: member.user_id,
  //             label: member.user_name,
  //             retirement_age: member.retirement_age,
  //             dob: member.dob,
  //             life_expectancy: member.life_expectancy_age,
  //             isdependent: member.is_dependent,
  //           });
  //         }
  //       });

  //       setFamilyData(member_array);
  //     } else {
  //       setFamilyData([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching family members", error);
  //   }
  // };

  const getMemberList = async () => {
    try {
      let data = {
        user_id: userid,
        data_belongs_to: DATA_BELONGS_TO,
      };
      let member_data = await getFamilyMember(userid);
      if (member_data.status_code == 200) {
        var member_array = [];
        var members = member_data["data"];
        setFamilyData(members);
        members.map((member) => {
          if (member.user_parent_id == "0" || member.user_parent_id == null || member.user_parent_id == "") {
            // setIncomeForMember(member.fp_user_id)
            // var goal_for_member = member.user_id;
            member_array.push({ value: member.user_id, label: "Self", retirement_age: String(member.retirement_age), dob: member.dob, life_expectancy: String(member.life_expectancy_age), isdependent: member.is_dependent ? "1" : "0" });

            setGoalDetails({
              ...goaldetails,
              user_goal_for: member.user_id,
            });

            // member_array.push({ value: 0, label: "Family" });

          } else {
            member_array.push({ value: member.user_id, label: member.user_name, retirement_age: String(member.retirement_age), dob: member.dob, life_expectancy: String(member.life_expectancy_age), isdependent: member.is_dependent ? "1" : "0" });
          }
        });
        member_array.push({ value: 0, label: "Family", retirement_age: "0", dob: "0", life_expectancy: "0", isdependent: "1" });


        if (member_array.length > 0) {
          setMemberData(member_array);
        } else {
          setMemberData([]);
        }
        return member_array;
      } else {
        setMemberData([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching member list", error);
      return [];
    }
  };

  const goalImageMap = {
    "Education": "/static/media/DG/goal/goal-education.svg",
    "Emergency": "/static/media/DG/goal/goal-emergency.svg",
    "Marriage": "/static/media/DG/goal/goal-marriage.svg",
    "Property": "/static/media/DG/goal/goal-property.svg",
    "Vacation": "/static/media/DG/goal/goal-vacation.svg",
    "Vehicle": "/static/media/DG/goal/goal-vehicle.svg",
    "Others": "/static/media/DG/goal/goal-others.svg"
  };



  useEffect(() => {
    const fetchGoalCategories = async () => {
      try {
        const result = await getGoalCategoryList();

        if (result.status_code === "200") {
          const updatedList = result.data.map((item) => {
            const imagePathKey = goalImageMap[item.goal_name];
            return {
              ...item,
              image: `${imagePath}${imagePathKey || "/static/media/DG/goal/goal-others.svg"
                }`,
            };
          });

          setGoalCategories(result.data); // this will trigger the next useEffect

          const formattedEducationCategories = result.education_categories.map((item) => ({
            value: item.edu_id,
            label: item.education_name,
          }));

          setSortOptionsEducation(formattedEducationCategories);
          setOptions(updatedList);
        }
      } catch (e) {
        console.error("Error fetching goal categories:", e);
      }
    };

    fetchGoalCategories();
  }, []);



  // useEffect(() => {
  //   if (goalCategories.length > 0) {
  //     const defaults = getDefaultGoalDetails(goalCategories, "Education");
  //     setGoalDetails(defaults);
  //     setSelectedOption(defaults.goal_name_uuid);
  //     setEditFlag(false);
  //   }
  // }, [goalCategories]);

  // ✅ Wait until both categories and members are loaded
  // useEffect(() => {
  //   if (goalCategories.length > 0 && memberdata.length > 0) {
  //     const defaults = getDefaultGoalDetails(goalCategories, "Education");
  //     setGoalDetails({
  //       ...defaults,
  //       user_goal_for: memberdata[0].value,  // set "Who is this goal for?" default
  //       goal_edu_cat_id: sortOptionsEducation?.[0]?.value || "ECAT-1", // fallback
  //     });
  //     setSelectedOption(defaults.goal_name_uuid);
  //     setEditFlag(false);
  //   }
  // }, [goalCategories, memberdata, sortOptionsEducation]);


  // ✅ Wait until both categories, members, and education options are loaded
  useEffect(() => {
    if (goalCategories.length > 0 && memberdata.length > 0) {
      // Pick default member (Self)
      const defaultMember = memberdata[0];
      const memberDob = defaultMember?.dob || "";
      const memberAge = memberDob && moment(memberDob, "DD/MM/YYYY").isValid()
        ? calculateAge(memberDob)
        : "";

      // Build defaults
      const defaults = getDefaultGoalDetails(goalCategories, "Education");

      setGoalDetails({
        ...defaults,
        user_goal_for: defaultMember.value,                       // ✅ "Who is this goal for?"
        user_goal_user_dob: memberDob,                            // ✅ DOB
        user_goal_user_age: memberAge,                            // ✅ Age
        goal_edu_cat_id: sortOptionsEducation?.[0]?.value || "ECAT-1", // ✅ Education default
      });

      setSelectedOption(defaults.goal_name_uuid);
      setEditFlag(false);
    }
  }, [goalCategories, memberdata, sortOptionsEducation]);

  const sortOptionsPayment1 = [
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Half Yearly", label: "Half Yearly" },
    { value: "Yearly", label: "Yearly" },
  ];
  const sortOptionsPayment2 = [
    { value: "Half Yearly", label: "Half Yearly" },
    { value: "Yearly", label: "Yearly" },
    { value: "Once In 2 Years", label: "Once In 2 Years" },
    { value: "Once In 3 Years", label: "Once In 3 Years" },
    { value: "Once In 4 Years", label: "Once In 4 Years" },
    { value: "Once In 5 Years", label: "Once In 5 Years" },
  ];
  let sortOptionsPayment = [];

  // const sortOptionsEducation = [
  //   { value: "1", label: "  BSc / BCom / BA / BCA / BMS / BBA etc" },
  //   { value: "2", label: "Engineering" },
  //   { value: "3", label: "High School (Upto XIIth)" },
  //   { value: "4", label: "MSc / MCom / MA / MCA / MMS / MBA etc)" },
  //   { value: "5", label: "School (Upto Xth)" },
  //   { value: "6", label: "Other" },
  //   // { value: "3", label: "Half Yearly" },
  // ];
  const sortOptionsGoalPriority = [
    { value: "Very High", label: "Very High" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
    { value: "Very Low", label: "Very Low" },
    // { value: "3", label: "Half Yearly" },
  ];

  const frequencylist = {
    "One Time": "One Time",
    "Monthly": "Monthly",
    "Quarterly": "Quarterly",
    "Half Yearly": "Half Yearly",
    "Yearly": "Yearly",
    "Once In 2 Years": "Once In 2 Years",
    "Once In 3 Years": "Once In 3 Years",
    "Once In 4 Years": "Once In 4 Years",
    "Once In 5 Years": "Once In 5 Years",
  };
  const vacationfreqlist = {
    "One Time": "One Time",
    "Half Yearly": "Half Yearly",
    "Yearly": "Yearly",
    "Once In 2 Years": "Once In 2 Years",
    "Once In 3 Years": "Once In 3 Years",
    "Once In 4 Years": "Once In 4 Years",
    "Once In 5 Years": "Once In 5 Years",
  };
  const priority_set = {
    "Very High": "Very High",
    "High": "High",
    "Medium": "Medium",
    "Low": "Low",
    "Very Low": "Very Low",
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


  const Tokendata = Cookies.get("token") || null;

  const getSessionData = async () => {
    try {
      if (Tokendata) {
        let memberList = await getMemberList();
        setSessionData(memberList["data"]);
        getGoalsList();
        setFpLogId(fpLogId);

        if (memberList) {
          const defaultMember = memberList[0];
          const user_id = defaultMember["value"];
          const dob = defaultMember["dob"];
          const age = calculateAge(dob);
          const retirement_age = parseInt(defaultMember["retirement_age"], 10);
          const life_expectancy = parseInt(defaultMember["life_expectancy"], 10);

          let retirement_date = "";
          let life_expectancy_date = "";

          if (dob && moment(dob, "DD/MM/YYYY").isValid()) {
            const dobMoment = moment(dob, "DD/MM/YYYY");
            retirement_date = dobMoment.clone().add(retirement_age, "years").format("MM/DD/YYYY");
            life_expectancy_date = dobMoment.clone().add(life_expectancy, "years").format("MM/DD/YYYY");
          }

          setRetirmentDate(retirement_date);
          setLifeExpentancyDate(life_expectancy_date);
          setSelfData({ retirement_date, life_expectancy_date });
          setMemberAge(age);
          setGoalDetails({
            ...goaldetails,
            user_goal_user_id: user_id,
            user_goal_user_dob: dob,
            user_goal_user_age: age,
            user_goal_start_date: moment().format("DD/MM/YYYY"),
            user_goal_end_date: moment().format("DD/MM/YYYY"),
          });
        }
      } else {
        loginRedirectGuest();
      }
    } catch (error) {
      // console.log(error);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something Went Wrong");
    }
  };

  const checkprofile = async (sessionData) => {
    try {
      let api_data = {
        user_id: sessionData['data']["id"],
        fp_log_id: sessionData['data']['user_details']["fp_log_id"],
        web: 1,
      };
      var payload_data = commonEncode.encrypt(JSON.stringify(api_data));
      var res = await apiCall(
        '',
        payload_data,
        false,
        false
      );
      let decoded_res = JSON.parse(commonEncode.decrypt(res));
      if (decoded_res['error_code'] == '100') {
        dispatch({ type: "UPDATE_PROFILE", payload: decoded_res['data'] });
        const profile_completed_mapping = {
          17: 117.496,
          50: 70.4973,
          67: 46.9982,
          83: 23.4991,
          100: 0
        };

        const profile_completed = decoded_res['data'][13]['profile_completed'] === 66 ? 67 : decoded_res['data'][13]['profile_completed'];
        const sectionIdsToCheck = [1, 3, 5, 6, 7, 8];
        const allConditionsMet = sectionIdsToCheck.every((sectionId) => {
          const matchingEntry = decoded_res["data"].find(
            (entry) => entry.section_id === sectionId
          );
          return matchingEntry && matchingEntry.total > 0;
        });

        const sectionIdsToCheckk = [1, 3];
        const allConditionsMett = sectionIdsToCheckk.every((sectionId) => {
          const matchingEntryy = decoded_res["data"].find(
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

        const filteredData = decoded_res["data"].filter((item) =>
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

  const getGoalDetailsById = (id) => {
    let goals = JSON.parse(localStorage.getItem('goalData'));
    // return member_id
    for (let i = 0; i < goals.length; i++) {
      if (goals[i]["id"] == id) {
        return { member_name: goals[i]["goalforname"], member_id: goals[i]["goal_for_member"] }
      }
    }
    return {}
  }

  const getGoalsList = async () => {
    try {
      let goal_data = await getGoalDetails(userid);
      localStorage.setItem('goalData', JSON.stringify(goal_data["data"]));

      if (goal_data["status_code"] == "200") {
        // setIsLoading(false);
        setIsDataLoading(false);
        goal_data["data"].map((data) => {
          if (data["user_goal_growth_rate"] != null) {
            data["user_goal_growth_rate"] = parseInt(data["user_goal_growth_rate"]);
          }
          if (data["user_goal_start_date"] != null) {

            var g_start_date = new Date(data["user_goal_start_date"]);
            var today = new Date();
            if (g_start_date < today) {
              var tday = today.getDate();
              var tmonth = today.getMonth() + 1; // Adding 1 since months are zero-based
              var tyear = today.getFullYear();
              if (tday < 10) {
                tday = "0" + tday;
              }

              if (tmonth < 10) {
                tmonth = "0" + tmonth;
              }
              data["user_goal_start_date"] = tday + "/" + tmonth + "/" + tyear;
            } else {
              // data['goalenddate'] = data[];
            }
          }
        });
        // if (goal_data["goal_cat_id"] == "education") {
        //   setEditEducation(false);
        // }

        // ✅ dynamically check for education goal
        const eduGoal = goal_data["data"].find(
          (goal) => goal.goal_name_uuid === "education"
        );

        if (eduGoal) {
          setEditEducation(false);
        }

        setGoalData(goal_data["data"]);
      } else {
        setGoalData([]);
        setIsDataLoading(false);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      toastr.error("Something Went Wrong", {
        position: "bottom-left",
      });
    }
  };
  //

  const handleSubmit = async (e, mode) => {
    e.preventDefault();
    if (goaldetails.goal_edu_cat_id) {
      goaldetails.user_goal_edu_cat_id = goaldetails.goal_edu_cat_id;
    }

    if (!goaldetails.user_goal_user_id) {
      const user_id = getParentUserId();

      setGoalDetails({
        ...goaldetails,
        user_goal_user_id: user_id,
      });
    }

    if (!goaldetails.user_goal_name || goaldetails.user_goal_name.length < 3 || goaldetails.user_goal_name.length > 35) {
      handleGoalName(goaldetails.user_goal_name || "");
    }

    const rawAmount = goaldetails.user_goal_amount;
    const amount = rawAmount && !isNaN(rawAmount) ? parseInt(rawAmount, 10) : 0;

    if (!goaldetails.user_goal_amount || Number.isNaN(amount) || amount < 1) {
      handleGoalValue(goaldetails.user_goal_amount || "");
    }

    // if (!goaldetails.user_goal_amount || parseInt(goaldetails.user_goal_amount, 10) < 1) {
    //   handleGoalValue(goaldetails.user_goal_amount || "");
    // }

    if (goaldetails.goal_name_uuid === "education" && !goaldetails.goal_edu_cat_id) {
      handleEdu("");
    }
    if (
      goaldetails.user_goal_occurance === "Recurring" &&
      !goaldetails.user_goal_start_date) {
      handleStartDate("");
    }


    if (
      goaldetails.user_goal_occurance === "Recurring" &&
      !goaldetails.user_goal_end_date
    ) {
      handleEndDate("");
    }

    if (!goaldetails.user_goal_freq || goaldetails.user_goal_freq === "0") {
      handleGoalFrq("");
    }

    if (typeof goaldetails.user_goal_growth_rate === "string") {
      goaldetails.user_goal_growth_rate = parseInt(goaldetails.user_goal_growth_rate, 10);
    }

    const isValidGoalDetails = () => {
      const isNameValid = goaldetails.user_goal_name && goaldetails.user_goal_name.length >= 3 && goaldetails.user_goal_name.length <= 35;
      const isAmountValid = goaldetails.user_goal_amount && parseInt(goaldetails.user_goal_amount, 10) > 0;
      // const isStartDateValid = !goaldetails.user_goal_start_date;
      const isRecurring = goaldetails.user_goal_occurance === "Recurring";
      const isEndDateValid = !isRecurring || !!goaldetails.user_goal_end_date;
      const isFrequencyValid = !isRecurring || (goaldetails.user_goal_freq && goaldetails.user_goal_freq !== "0");

      if (goaldetails.goal_name_uuid === "education") {
        return isNameValid && isAmountValid && isEndDateValid && isFrequencyValid && (!!goaldetails.goal_edu_cat_id || !!goaldetails.user_goal_edu_cat_id);
      }

      return isNameValid && isAmountValid && isEndDateValid && isFrequencyValid;
    };

    if (isValidGoalDetails()) {
      if (mode === "update") {
        UpdateGoal(e);
      } else {
        addGoal(e);
      }
    }
  };

  const addGoal = async (e) => {
    e.preventDefault();
    try {
      let payload = Object.fromEntries(
        Object.entries(goaldetails).filter(
          ([_, value]) => value !== null && value !== ""
        )
      );

      // explicitly include dynamic IDs
      payload.goal_cat_id = goaldetails.goal_cat_id;
      payload.goal_name_uuid = goaldetails.goal_name_uuid;

      // Ensure `goal_isAfterRetirement` and `user_goal_end_date` are set correctly
      if (goaldetails.goal_isAfterRetirement === "0") {
        payload.user_goal_valid_till = "Retirement";
        payload.user_goal_end_date = moment(retirmentdate, "MM/DD/YYYY").isValid()
          ? moment(retirmentdate, "MM/DD/YYYY").format("DD/MM/YYYY")
          : "";
      } else if (goaldetails.goal_isAfterRetirement === "1") {
        payload.user_goal_valid_till = "Life Expectancy";
        payload.user_goal_end_date = moment(lifeexpectancydate, "MM/DD/YYYY").isValid()
          ? moment(lifeexpectancydate, "MM/DD/YYYY").format("DD/MM/YYYY")
          : "";
      } else {
        payload.user_goal_valid_till = null;
        // payload.user_goal_end_date = goaldetails.user_goal_start_date;
      }
      if (goaldetails.user_goal_occurance === "One Time") {
        payload.user_goal_valid_till = null;
        payload.user_goal_freq = "One Time";
        payload.user_goal_end_date = "";
      }

      if (goaldetails.user_goal_occurance === "One Time" && payload.user_goal_end_date == "") {
        payload.user_goal_end_date = payload.user_goal_start_date;
      }

      payload.user_id = goaldetails.user_goal_user_id;

      setIsLoading(true);
      setIsDataLoading(true);

      // Fix: use user_goal_occurance instead of goal_isRecurring

      let addgoalData = await addGoalDetails(payload);
      getGoalsList();

      if (addgoalData["status_code"] === "200") {
        const getUserdobyear = new Date(
          goaldetails.user_goal_user_dob || "01/01/2000"
        ).getFullYear();
        const getCurrentyear = new Date().getFullYear();
        const member_age = getCurrentyear - getUserdobyear;

        scrollToGoalList();
        setSelectedOption(goaldetails.goal_name_uuid);

        getGoalsList();
        setHandleError({
          ...handlerror,
          goalName: "",
          goalEduType: "",
          goalFrequency: "",
          goalCurrentValue: "",
          goalStartDate: "",
          goalEndDate: "",
        });

        setIsLoading(false);
        setIsDataLoading(false);
        setEditFlag(false);

        const savetext = goaldetails.id ? " updated " : " saved ";
        const msg = goaldetails.user_goal_name ? " - " + goaldetails.user_goal_name : "";

        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          "Data" + savetext + "successfully for " + goaldetails.user_goal_name + msg
        );

        // Reset details with fresh defaults
        const newDefaults = getDefaultGoalDetails(goalCategories, goaldetails.user_goal_name);

        setGoalDetails({
          ...newDefaults,
          user_goal_user_id: goaldetails.user_goal_user_id,
          user_goal_user_age: member_age,
          user_goal_for: memberdata["0"].value,
          user_goal_user_dob: goaldetails.user_goal_user_dob || "01/01/2000",
        });
      } else {
        setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      // console.log(err);
      setIsLoading(false);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };


  const UpdateGoal = async (e) => {
    e.preventDefault();
    try {
      let payload = Object.fromEntries(
        Object.entries(goaldetails).filter(
          ([_, value]) => value !== null && value !== ""
        )
      );

      if (goaldetails.goal_isAfterRetirement === "0") {
        payload.user_goal_valid_till = "Retirement";
        payload.user_goal_end_date = moment(retirmentdate, "MM/DD/YYYY").isValid()
          ? moment(retirmentdate, "MM/DD/YYYY").format("DD/MM/YYYY")
          : "";
      } else if (goaldetails.goal_isAfterRetirement === "1") {
        payload.user_goal_valid_till = "Life Expectancy";
        payload.user_goal_end_date = moment(lifeexpectancydate, "MM/DD/YYYY").isValid()
          ? moment(lifeexpectancydate, "MM/DD/YYYY").format("DD/MM/YYYY")
          : "";
      } else {
        payload.user_goal_valid_till = null;
        // payload.user_goal_end_date = goaldetails.user_goal_start_date;
      }

      if (goaldetails.user_goal_occurance === "One Time" && payload.user_goal_end_date == "") {
        payload.user_goal_valid_till = null;
        payload.user_goal_end_date = goaldetails.user_goal_start_date;
        payload.user_goal_start_date = "";
        payload.user_goal_freq = "";
      }



      payload.user_goal_id = goaldetails.name;

      setIsLoading(true);
      setIsDataLoading(true)
      let addgoalData = await UpdateGoalDetails(payload);
      getGoalsList();

      if (addgoalData["status_code"] == "200") {
        var getUserdobyear = new Date(
          goaldetails.user_goal_user_dob ? goaldetails.user_goal_user_dob : "01/01/2000" // Default date if dob is not provided
        ).getFullYear();
        var getCurrentyear = new Date().getFullYear();
        var member_age = getCurrentyear - getUserdobyear;
        setIsDataLoading(true);
        scrollToGoalList();
        setSelectedOption(goaldetails.goal_name_uuid);
        getGoalsList();
        setHandleError({
          ...handlerror,
          goalName: "",
          goalEduType: "",
          goalFrequency: "",
          goalCurrentValue: "",
          goalStartDate: "",
          goalEndDate: "",
        });
        setIsLoading(false);
        // await new Promise((resolve, reject)=> setTimeout(resolve, 5000));
        setIsDataLoading(false);
        setEditFlag(false);
        var savetext = goaldetails.id ? " updated " : " saved ";
        var msg = goaldetails.goal_name ? " - " + goaldetails.goal_name : "";
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(
          "Data" + savetext + "successfully for " + goaldetails.goal_name + msg
        );
        const newDefaults = getDefaultGoalDetails(goalCategories, goaldetails.user_goal_name);

        setGoalDetails({
          ...newDefaults,
          user_goal_user_id: goaldetails.user_goal_user_id,
          user_goal_user_age: member_age,
          user_goal_for: memberdata["0"].value,
          user_goal_user_dob: goaldetails.user_goal_user_dob || "01/01/2000",
        });
      } else {
        setIsLoading(false);
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch (err) {
      // console.log(err);
      setIsLoading(false);
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const editGoal = async (data) => {
    try {

      const editgoalData = goaldata.find(goal => goal.name === data.name);
      setIsLoading(true);

      if (editgoalData) {
        if (editgoalData["user_goal_remarks"] == null) {
          editgoalData["user_goal_remarks"] = ""
        }
        setIsLoading(false);
        const goalData = { ...editgoalData };

        if (goalData["goal_name_uuid"] === "education") {
          setEditEducation(false);
        }

        setGoalDetails(goalData);

        setOldMember({
          member: goalData.user_goal_for,   // or map to display name if needed
          member_id: goalData.user_goal_for
        });
        scrollToGoalForm();

        setSelectedOption(goalData["goal_name_uuid"]);
        setEditFlag(false);
        setHandleError({
          ...handlerror,
          goalName: "",
          goalEduType: "",
          goalFrequency: "",
          goalCurrentValue: "",
          goalStartDate: "",
          goalEndDate: "",
        });
        // Notification
        const msg = goalData.user_goal_name ? " - " + goalData.user_goal_name : "";
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success("You can now edit details for " + goalData.goal_category_type + msg);
      } else {
        setIsLoading(false);

        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch {
      setIsLoading(false);

      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };

  const deleteGoal = async () => {
    const filteredData = goaldata.filter(item => ["retirement", "contingency"].includes(item.goal_name_uuid));
    const ids = filteredData.map(item => item.name);
    const selected_ids = selectedgoalCategories.filter(id => !ids.includes(id));
    try {
      let data = {
        goal_id: selected_ids,
        data_belongs_to: DATA_BELONGS_TO
      };
      let deletegoalData = await deleteGoalDetails(data)
      if (deletegoalData["status_code"] == "200") {
        setShow(false);
        getGoalsList();
        var msg = goalname ? " - " + goalname : "";
        toastr.options.positionClass = "toast-bottom-left";
        // toastr.success(goalcategorytype + msg + " Data Deleted Successfully");
        toastr.success(" Data Deleted Successfully");
        // ✅ Reset dynamically using goalCategories + helper
        const newDefaults = getDefaultGoalDetails(goalCategories, "education"); // fallback to education
        setGoalDetails({
          ...newDefaults,
          user_goal_for: memberdata["0"].value,
        });
        // setGoalDetails(defaultGoalDetails);
        // setGoalDetails({
        //   ...defaultGoalDetails,
        //   user_goal_for: memberdata["0"].value,
        // });
        setSelectedgoalCategories([])
        setHandleError({
          ...handlerror,
          goalName: "",
          goalEduType: "",
          goalFrequency: "",
          goalCurrentValue: "",
          goalStartDate: "",
          goalEndDate: "",
        });
        setSelectedOption("education");
        setEditFlag(false);
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Something went wrong");
      }
    } catch {
      toastr.options.positionClass = "toast-bottom-left";
      toastr.error("Something went wrong");
    }
  };
  const handleGoalName = (name) => {
    if (name == "") {
      setHandleError({ ...handlerror, goalName: "Please enter goal name" });
      scrollToGoalRef();
    } else {
      if (name.length < 3 || name.length > 35) {
        setHandleError({
          ...handlerror,
          goalName: "Name must be between 3-35 characters",
        });
        scrollToGoalRef();
      } else if (!special_start(name)) {
        setHandleError({
          ...handlerror,
          goalName: "Special characters not allowed",
        });
        scrollToGoalRef();
      } else if (!alphanumeric_custom(name)) {
        setHandleError({
          ...handlerror,
          goalName: "Special characters not allowed",
        });
      } else if (!customspacing(name)) {
        setHandleError({
          ...handlerror,
          goalName: "No white spaces are allowed at beginning/end",
        });
        scrollToGoalRef();
      } else {
        setHandleError({ ...handlerror, goalName: "" });
      }
    }
  };

  const handleGoalValue = (currentvalue) => {
    scrollToGoalRef();
    if (currentvalue == "") {
      setHandleError({ ...handlerror, goalCurrentValue: "Please enter goal current value" })
      scrollToGoalRef();
    } else if (currentvalue.length > 10) {
      setHandleError({ ...handlerror, goalCurrentValue: "Please enter less than 10 digits" })
      scrollToGoalRef();
    } else if (!/^\d+$/.test(currentvalue) || /^0\d+/.test(currentvalue) || parseInt(currentvalue, 10) < 1) {
      scrollToGoalRef();
      setHandleError({ ...handlerror, goalCurrentValue: "Please enter a value greater than or equal to 1" })
    } else {
      // handlerror.goalCurrentValue = "";
      setHandleError({ ...handlerror, goalCurrentValue: "" })
    }
  };

  const handleEdu = (type) => {
    if (type == "") {
      handlerror.goalEduType = "Please select education type";
      setHandleError({
        ...handlerror,
        goalEduType: "Please select education type",
      });
      scrollToGoalRef();
    } else {
      setHandleError({ ...handlerror, goalEduType: "" });
    }
  };
  const handleStartDate = (startdate) => {
    if (startdate == "") {
      setHandleError({
        ...handlerror,
        goalStartDate: "Please select start date",
      });
      scrollToGoalRef();
    } else {
      setHandleError({ ...handlerror, goalStartDate: "" });
    }
  };
  const handleEndDate = (enddate) => {
    if (enddate == "") {
      setHandleError({ ...handlerror, goalEndDate: "Please select goal upto retirement/life expectancy age" });
      scrollToGoalRef();
    } else {
      setHandleError({ ...handlerror, goalEndDate: "" });
    }
  };

  const handleGoalFrq = (goalFrq) => {
    if (goalFrq == "") {
      setHandleError({
        ...handlerror,
        goalFrequency: "Please select goal frequency",
      });
      scrollToGoalRef();
    } else {
      setHandleError({ ...handlerror, goalFrequency: "" });
    }
  };

  // const handleDate = (isFrq) => {
  //   if (isFrq == true) {
  //     goaldetails.goal_isAfterRetirement = null;
  //     goaldetails.user_goal_start_date = moment().format("DD/MM/YYYY");
  //     goaldetails.user_goal_end_date = "";
  //   } else {
  //     goaldetails.user_goal_start_date = moment().format("DD/MM/YYYY");
  //     goaldetails.user_goal_end_date = moment().format("DD/MM/YYYY");
  //   }
  // };

  // const handleGoalMemberEnddate = (member_data) => {
  //   let retirement_date = "";
  //   let life_expectancy_date = "";

  //   if (member_data['isdependent'] === "0") {
  //     const dob = moment(member_data['dob'], "DD/MM/YYYY");

  //     retirement_date = dob
  //       .clone()
  //       .add(parseInt(member_data['retirement_age'], 10), "years")
  //       .format("MM/DD/YYYY");

  //     life_expectancy_date = dob
  //       .clone()
  //       .add(parseInt(member_data['life_expectancy'], 10), "years")
  //       .format("MM/DD/YYYY");
  //   } else {
  //     retirement_date = selfData["retirement_date"];
  //     life_expectancy_date = selfData["life_expectancy_date"];
  //   }

  //   if (member_data['label'] === "Family") {
  //     retirement_date = selfData["retirement_date"];
  //     life_expectancy_date = selfData["life_expectancy_date"];
  //   }

  //   setRetirmentDate(retirement_date);
  //   setLifeExpentancyDate(life_expectancy_date);

  //   let updatedGoalDetails = {
  //     ...goaldetails,
  //     user_goal_for: member_data.value,
  //     user_goal_context: member_data.label === "Family" ? "Family" : "Individual",
  //   };

  //   // Ensure goal_isAfterRetirement is not null
  //   if (goaldetails.user_goal_valid_till === "Retirement") {
  //     updatedGoalDetails.goal_isAfterRetirement = "0"; // Default to "Upto Retirement Age"
  //   } else if (goaldetails.user_goal_valid_till === "Life Expectancy") {
  //     updatedGoalDetails.goal_isAfterRetirement = "1"; // Upto Life Expectancy Age
  //   } else {
  //     updatedGoalDetails.goal_isAfterRetirement = null; // Default or no selection
  //   }

  //   // Retain or set the start date
  //   if (goaldetails.user_goal_start_date) {
  //     updatedGoalDetails.user_goal_start_date = moment(
  //       goaldetails.user_goal_start_date,
  //       "DD/MM/YYYY"
  //     ).isValid()
  //       ? moment(goaldetails.user_goal_start_date, "DD/MM/YYYY").format("DD/MM/YYYY")
  //       : moment().format("DD/MM/YYYY"); // Default to today's date if invalid
  //   } else {
  //     updatedGoalDetails.user_goal_start_date = moment().format("DD/MM/YYYY");
  //   }

  //   // Handle recurring goals and set the end date
  //   if (goaldetails.user_goal_occurance === "Recurring") {
  //     let goal_end_date = "";

  //     if (goaldetails.goal_isAfterRetirement === "0") {
  //       goal_end_date = moment(retirement_date, "MM/DD/YYYY").isValid()
  //         ? moment(retirement_date, "MM/DD/YYYY").format("DD/MM/YYYY")
  //         : ""; // Ensure the retirement date is valid
  //     } else if (goaldetails.goal_isAfterRetirement === "1") {
  //       goal_end_date = moment(life_expectancy_date, "MM/DD/YYYY").isValid()
  //         ? moment(life_expectancy_date, "MM/DD/YYYY").format("DD/MM/YYYY")
  //         : ""; // Ensure the life expectancy date is valid
  //     }

  //     updatedGoalDetails.user_goal_end_date = goal_end_date;
  //   }

  //   setGoalDetails(updatedGoalDetails);
  // };
  const handleGoalMemberEnddate = (member_data) => {
    let retirement_date = "";
    let life_expectancy_date = "";

    if (member_data['isdependent'] === false || member_data['isdependent'] === "0") {
      const dob = moment(member_data['dob'], "DD/MM/YYYY");

      if (dob.isValid()) {
        retirement_date = dob
          .clone()
          .add(parseInt(member_data['retirement_age'], 10), "years")
          .format("MM/DD/YYYY");

        life_expectancy_date = dob
          .clone()
          .add(parseInt(member_data['life_expectancy'], 10), "years")
          .format("MM/DD/YYYY");
      } else {
        console.error("Invalid DOB for member:", member_data);
      }
      setshowRadioButton(true);
    } else {
      retirement_date = selfData["retirement_date"];
      life_expectancy_date = selfData["life_expectancy_date"];
      setshowRadioButton(false);
    }

    if (member_data['label'] === "Family") {
      retirement_date = selfData["retirement_date"];
      life_expectancy_date = selfData["life_expectancy_date"];
      setshowRadioButton(false);
    }

    setRetirmentDate(retirement_date);
    setLifeExpentancyDate(life_expectancy_date);

    let updatedGoalDetails = {
      ...goaldetails,
      user_goal_for: member_data.value,
      user_goal_context: member_data.label === "Family" ? "Family" : "Individual",
      user_goal_user_age: calculateAge(moment(member_data['dob'], "DD/MM/YYYY")) || goaldetails.user_goal_user_age,
    };

    // Ensure goal_isAfterRetirement is not null
    if (goaldetails.user_goal_valid_till === "Retirement") {
      updatedGoalDetails.goal_isAfterRetirement = "0"; // Upto Retirement Age
    } else if (goaldetails.user_goal_valid_till === "Life Expectancy") {
      updatedGoalDetails.goal_isAfterRetirement = "1"; // Upto Life Expectancy Age
    } else {
      updatedGoalDetails.goal_isAfterRetirement = null;
      // payload.user_goal_end_date = goaldetails.user_goal_start_date;
    }

    if (goaldetails.user_goal_occurance === "One Time") {
      updatedGoalDetails.goal_isAfterRetirement = null;
      // updatedGoalDetails.user_goal_end_date = updatedGoalDetails.user_goal_start_date;
      updatedGoalDetails.user_goal_start_date = "";
      updatedGoalDetails.user_goal_valid_till = null;
    }

    // Retain or set the start date
    if (goaldetails.user_goal_start_date) {
      updatedGoalDetails.user_goal_start_date = moment(
        goaldetails.user_goal_start_date,
        "DD/MM/YYYY"
      ).isValid()
        ? moment(goaldetails.user_goal_start_date, "DD/MM/YYYY").format("DD/MM/YYYY")
        : moment().format("DD/MM/YYYY"); // Default to today's date if invalid
    } else {
      updatedGoalDetails.user_goal_start_date = moment().format("DD/MM/YYYY");
    }

    // Handle recurring goals and set the end date
    if (goaldetails.user_goal_occurance === "Recurring") {

      if (updatedGoalDetails.goal_isAfterRetirement === "0") {
        var goal_end_date = moment(retirement_date, "MM/DD/YYYY").isValid()
          ? moment(retirement_date, "MM/DD/YYYY").format("DD/MM/YYYY")
          : ""; // Ensure the retirement date is valid
        updatedGoalDetails.user_goal_end_date = goal_end_date;
      } else if (updatedGoalDetails.goal_isAfterRetirement === "1") {
        var goal_end_date = moment(life_expectancy_date, "MM/DD/YYYY").isValid()
          ? moment(life_expectancy_date, "MM/DD/YYYY").format("DD/MM/YYYY")
          : ""; // Ensure the life expectancy date is valid
        updatedGoalDetails.user_goal_end_date = goal_end_date;
      }
    }

    setGoalDetails(updatedGoalDetails);
  };

  const handleIsRetirement = () => {
    let goal_end_date = "";
   
    if (goaldetails.goal_isAfterRetirement === "0") {
      goal_end_date = moment(retirmentdate, "MM/DD/YYYY").isValid()
        ? moment(retirmentdate, "MM/DD/YYYY").format("DD/MM/YYYY")
        : ""; // Ensure the retirement date is valid
    } else if (goaldetails.goal_isAfterRetirement === "1") {
      goal_end_date = moment(lifeexpectancydate, "MM/DD/YYYY").isValid()
        ? moment(lifeexpectancydate, "MM/DD/YYYY").format("DD/MM/YYYY")
        : ""; // Ensure the life expectancy date is valid
    }

    setGoalDetails({ ...goaldetails, user_goal_end_date: goal_end_date });
  };

  const handlePatialLoan = (isPartialLoan) => {
    if (isPartialLoan == true) {
      goaldetails.user_goal_loan_percentage = 0;
      goaldetails.user_goal_loan_tenure = 1;
      goaldetails.user_goal_interest_rate = 0;
      // setGoalDetails({...goaldetails,goal_loan_amount:"22",goal_tenure:goal_tenure,goal_interest_rate:goal_interest_rate})
    }
  };

  const handleEdutype = () => {
    if (goaldetails.user_goal_edu_cat_id != "" && editEducation == true) {
      if (goaldetails.user_goal_edu_cat_id == "ECAT-1" || goaldetails.goal_edu_cat_id == "ECAT-1" || goaldetails.user_goal_edu_cat_id == "ECAT-2" || goaldetails.goal_edu_cat_id == "ECAT-2") {
        familydata.map((v) => {
          if (
            v.user_id == goaldetails.user_goal_for &&
            goaldetails.user_goal_for != 0
          ) {
            var goalmemberDOB = v.dob;
            var dob = moment(goalmemberDOB, "DD/MM/YYYY").toDate();
            var memberDOB = dob;
            var ageInMs = Date.now() - dob.getTime();
            var ageInDate = new Date(ageInMs);
            var age = Math.abs(ageInDate.getUTCFullYear() - 1970);
            if (age > 17) {
              var member_age = age;
            } else {
              var member_age = 17;
            }

            if (v.parent_user_id == 0 || v.parent_user_id == null || v.is_dependent == false) {
              setshowRadioButton(true);
              var goal_startdate = moment().format("DD/MM/YYYY");
              var goal_enddate = moment(goal_startdate, "DD/MM/YYYY").format(
                "DD/MM/YYYY"
              );
              var goal_end_date = moment(goal_startdate, "DD/MM/YYYY")
                .add(3, "years")
                .format("DD/MM/YYYY");
              var goal_isRecurring = "Recurring";
              setGoalDetails({
                ...goaldetails,
                user_goal_user_age: member_age,
                user_goal_user_dob: moment(memberDOB).format("DD/MM/YYYY"),
                user_goal_occurance: goal_isRecurring,
                user_goal_start_date: goal_startdate,
                user_goal_end_date: goal_end_date,
                goal_isAfterRetirement: null
              });
            } else {
              // setshowRadioButton(false);
              if (age > 17) {
                var goal_startdate = moment().format("DD/MM/YYYY");
                var goal_enddate = moment(goal_startdate, "DD/MM/YYYY")
                  .add(3, "years")
                  .format("DD/MM/YYYY");
              } else {
                var member_dob = v.dob;
                var dob = new Date(member_dob);
                // var goal_startdate = dob;
                var goal_startdate = moment(dob, "DD/MM/YYYY")
                  .add(member_age, "years")
                  .format("DD/MM/YYYY");
                var goal_enddate = new Date(goal_startdate);
              }
              var goal_enddate = moment(goal_startdate, "DD/MM/YYYY")
                .add(3, "years")
                .format("DD/MM/YYYY");
              // goal_enddate.setFullYear(goal_startdate.getFullYear() + 3);
              var goal_isRecurring = "Recurring";
              setGoalDetails({
                ...goaldetails,
                user_goal_occurance: goal_isRecurring,
                user_goal_user_age: member_age,
                user_goal_user_dob: moment(memberDOB).format("DD/MM/YYYY"),
                user_goal_start_date: goal_startdate,
                user_goal_end_date: goal_enddate,
              });
            }
          }
        });
      } else if (goaldetails.user_goal_edu_cat_id == "ECAT-3" || goaldetails.goal_edu_cat_id == "ECAT-3") {
        familydata.map((v) => {
          if (
            v.user_id == goaldetails.user_goal_for &&
            goaldetails.user_goal_for != 0
          ) {
            var goalmemberDOB = v.dob;
            var dob = moment(goalmemberDOB, "DD/MM/YYYY").toDate();
            var memberDOB = dob;
            var ageInMs = Date.now() - dob.getTime();
            var ageInDate = new Date(ageInMs);
            var age = Math.abs(ageInDate.getUTCFullYear() - 1970);
            if (age > 16) {
              var member_age = age;
            } else {
              var member_age = 16;
            }
            if (v.parent_user_id == 0 || v.parent_user_id == null || v.is_dependent == false) {
              setshowRadioButton(true);
              var goal_enddate = new Date();
              var goal_isRecurring = "One Time";
              setGoalDetails({
                ...goaldetails,
                user_goal_user_age: member_age,
                user_goal_user_dob: moment(memberDOB).format("DD/MM/YYYY"),
                user_goal_occurance: goal_isRecurring,
                user_goal_start_date: moment(goal_enddate).format("DD/MM/YYYY"),
                goal_isAfterRetirement: null,
                user_goal_valid_till: null,
                user_goal_end_date: "",
              });
            } else {
              // setshowRadioButton(false);
              if (age > 16) {
                var goal_enddate = new Date();
              } else {
                var member_dob = v.dob;
                var dob = new Date(member_dob);
                var goal_enddate = dob;
                var goal_enddate = moment(dob, "DD/MM/YYYY")
                  .add(member_age, "years")
                  .format("DD/MM/YYYY");
                // goal_enddate.setFullYear(
                //   dob.getFullYear() + member_age
                // );
              }
              var goal_isRecurring = "One Time";
              setGoalDetails({
                ...goaldetails,
                user_goal_user_age: member_age,
                user_goal_user_dob: moment(memberDOB).format("DD/MM/YYYY"),
                user_goal_occurance: goal_isRecurring,
                user_goal_start_date: goal_enddate,
                user_goal_end_date: moment().format("DD/MM/YYYY"),
                user_goal_valid_till: null,
                // user_goal_end_date: moment().format("DD/MM/YYYY"),
              });
            }
          }
        });
      } else if (goaldetails.user_goal_edu_cat_id == "ECAT-4") {
        familydata.map((v) => {
          if (
            v.user_id == goaldetails.user_goal_for &&
            goaldetails.user_goal_for != 0
          ) {
            var goalmemberDOB = v.dob;
            var dob = moment(goalmemberDOB, "DD/MM/YYYY").toDate();
            var memberDOB = dob;
            var ageInMs = Date.now() - dob.getTime();
            var ageInDate = new Date(ageInMs);
            var age = Math.abs(ageInDate.getUTCFullYear() - 1970);

            if (age > 21) {
              var member_age = age;
            } else {
              var member_age = 21;
            }
            if (v.parent_user_id == 0 || v.parent_user_id == null || v.is_dependent == false) {
              setshowRadioButton(true);
              var goal_startdate = moment().format("DD/MM/YYYY");
              var goal_enddate = moment(goal_startdate, "DD/MM/YYYY")
                .add(1, "years")
                .format("DD/MM/YYYY");
              var goal_isRecurring = "Recurring";
              setGoalDetails({
                ...goaldetails,
                user_goal_user_age: member_age,
                user_goal_user_dob: moment(memberDOB).format("DD/MM/YYYY"),
                user_goal_occurance: goal_isRecurring,
                user_goal_start_date: moment(goal_startdate, "DD/MM/YYYY").format(
                  "DD/MM/YYYY"
                ),
                user_goal_end_date: moment(goal_enddate, "DD/MM/YYYY").format(
                  "DD/MM/YYYY"
                ),
                goal_isAfterRetirement: null
              });
            } else {
              // setshowRadioButton(false);
              if (age > 21) {
                var goal_startdate = moment().format("DD/MM/YYYY");
                var goal_enddate = moment(goal_startdate, "DD/MM/YYYY")
                  .add(1, "years")
                  .format("DD/MM/YYYY");
              } else {
                var member_dob = v.dob;
                var dob = new Date(member_dob);
                var goal_startdate = moment(dob, "DD/MM/YYYY")
                  .add(member_age, "years")
                  .format("DD/MM/YYYY");

                var goal_enddate = moment(goal_startdate, "DD/MM/YYYY")
                  .add(1, "years")
                  .format("DD/MM/YYYY");
              }
              var goal_isRecurring = "Recurring";
              setGoalDetails({
                ...goaldetails,
                user_goal_user_age: member_age,
                user_goal_user_dob: moment(memberDOB).format("DD/MM/YYYY"),
                user_goal_occurance: goal_isRecurring,
                user_goal_start_date: goal_startdate,
                user_goal_end_date: goal_enddate,
              });
            }
          }
        });
      } else if (goaldetails.user_goal_edu_cat_id == "ECAT-5") {
        familydata.map((v) => {
          if (
            v.user_id == goaldetails.user_goal_for &&
            goaldetails.user_goal_for != 0
          ) {
            var goalmemberDOB = v.dob;
            var dob = moment(goalmemberDOB, "DD/MM/YYYY").toDate();
            var memberDOB = dob;
            var ageInMs = Date.now() - dob.getTime();
            var ageInDate = new Date(ageInMs);
            var age = Math.abs(ageInDate.getUTCFullYear() - 1970);

            if (age > 14) {
              var member_age = age;
            } else {
              var member_age = 14;
            }
            if (v.parent_user_id == 0 || v.parent_user_id == null || v.is_dependent == false) {
              setshowRadioButton(true);
              var goal_enddate = new Date();
              var goal_isRecurring = "One Time";
              setGoalDetails({
                ...goaldetails,
                user_goal_user_age: member_age,
                user_goal_user_dob: moment(memberDOB).format("DD/MM/YYYY"),
                user_goal_occurance: goal_isRecurring,
                user_goal_start_date: moment(goal_enddate).format("DD/MM/YYYY"),
                user_goal_end_date: "",
                user_goal_valid_till: null,
                goal_isAfterRetirement: null
              });
            } else {
              // setshowRadioButton(false);
              if (age > 14) {
                var goal_enddate = moment().format("DD/MM/YYYY");
              } else {
                var member_dob = v.dob;
                var dob = new Date(member_dob);
                var goal_enddate = dob;
                var goal_enddate = moment(dob, "DD/MM/YYYY")
                  .add(member_age, "years")
                  .format("DD/MM/YYYY");
              }
              var goal_isRecurring = "One Time";
              setGoalDetails({
                ...goaldetails,
                user_goal_user_age: member_age,
                user_goal_user_dob: moment(memberDOB, "DD/MM/YYYY").toDate(),
                user_goal_occurance: goal_isRecurring,
                user_goal_start_date: goal_enddate,
                user_goal_end_date: moment().format("DD/MM/YYYY"),
                user_goal_valid_till: null,
              });
            }
          }
        });
      } else {
        familydata.map((v) => {
          if (
            v.user_id == goaldetails.user_goal_for &&
            goaldetails.user_goal_for != 0
          ) {
            if (v.parent_user_id == 0 || v.isdependent == "0") {
              setshowRadioButton(true);
            } else {
              setshowRadioButton(false);

            }
            var goalmemberDOB = v.dob;
            var dob = moment(goalmemberDOB, "DD/MM/YYYY").toDate();
            var memberDOB = dob;
            var ageInMs = Date.now() - dob.getTime();
            var ageInDate = new Date(ageInMs);
            var age = Math.abs(ageInDate.getUTCFullYear() - 1970);

            var goal_enddate = moment().format("DD/MM/YYYY");
            var member_age = age;
            var goal_isRecurring = "One Time";
            setGoalDetails({
              ...goaldetails,
              user_goal_user_age: member_age,
              user_goal_user_dob: moment(memberDOB).format("DD/MM/YYYY"),
              user_goal_occurance: goal_isRecurring,
              user_goal_start_date: goal_enddate,
              user_goal_end_date: moment().format("DD/MM/YYYY"),
              user_goal_valid_till: null,
            });
          }
        });
      }
    } else {
      setEditEducation(true);
      var memberdob = new Date();
      familydata.map((v) => {
        if (goaldetails.user_goal_for != 0) {
          if (v.user_id == goaldetails.user_goal_for) {
            memberdob = new Date(v.dob);
          }
        } else {
          memberdob = goaldetails.user_goal_user_dob;
        }
      });
      var getmemberdobyear = new Date(memberdob).getFullYear();
      var getCurrentyear = new Date().getFullYear();

      var member_age = getCurrentyear - getmemberdobyear;
      if (goaldetails.name != "" && !goaldetails.name) {
        setGoalDetails({
          ...goaldetails,
          user_goal_user_age: member_age,
        });
      }
    }
    if (
      retirmentdate != goaldetails.user_goal_end_date ||
      lifeexpectancydate != goaldetails.user_goal_end_date
    ) {
      goaldetails.goal_isAfterRetirement = null;
    }
  };

  // const setDate = (date, dateType) => {
  //   if (dateType == "startDate") {
  //     if (goaldetails.goal_cat_id == "education") {
  //       const updatedStartDate = moment(date, "DD/MM/YYYY");
  //       if (goaldetails.user_goal_user_dob) {
  //         var dateString = goaldetails.user_goal_user_dob;
  //         var dateParts = dateString.split("/");
  //         var day = parseInt(dateParts[0], 10);
  //         var month = parseInt(dateParts[1], 10) - 1; // Subtract 1 since months are 0-based (0 = January)
  //         var year = parseInt(dateParts[2], 10);
  //         var memberDOB = new Date(year, month, day);
  //         var ageDifMs = updatedStartDate - memberDOB.getTime();
  //       } else {
  //         var userDOB = goaldetails.user_goal_user_dob;
  //         userDOB = new Date(userDOB);
  //         var ageDifMs = updatedStartDate - userDOB.getTime();
  //       }
  //       var ageDate = new Date(ageDifMs);

  //       var age = ageDate.getUTCFullYear() - 1970;
  //       if (
  //         goaldetails.user_goal_edu_cat_id == "ECAT-1" ||
  //         goaldetails.user_goal_edu_cat_id == "ECAT-2"
  //       ) {
  //         const updatedEndDate = updatedStartDate.clone().add(3, "years");
  //         setGoalDetails({
  //           ...goaldetails,
  //           user_goal_start_date: updatedStartDate.format("DD/MM/YYYY"),
  //           user_goal_end_date: moment(updatedEndDate).format("DD/MM/YYYY"),
  //           user_goal_user_age: age,
  //         });
  //       }
  //       if (goaldetails.user_goal_edu_cat_id == "ECAT-4") {
  //         const updatedEndDate = updatedStartDate.clone().add(1, "years");
  //         setGoalDetails({
  //           ...goaldetails,
  //           user_goal_start_date: updatedStartDate.format("DD/MM/YYYY"),
  //           user_goal_end_date: moment(updatedEndDate).format("DD/MM/YYYY"),
  //           user_goal_user_age: age,
  //         });
  //       }
  //     } else {
  //       setGoalDetails({
  //         ...goaldetails,
  //         user_goal_start_date: moment(date).format("DD/MM/YYYY"),
  //         user_goal_end_date: moment(date).format("DD/MM/YYYY"),

  //       });
  //     }
  //   } else {
  //     // goaldetails.user_goal_end_date = moment(date).format("DD/MM/YYYY");
  //     if (retirmentdate != date || lifeexpectancydate != date) {
  //       goaldetails.goal_isAfterRetirement = null;
  //     }
  //     setGoalDetails({
  //       ...goaldetails,
  //       user_goal_end_date: moment(date).format("DD/MM/YYYY"),
  //     });
  //   }
  // };

  const setDate = (date, dateType) => {
    // ✅ Helper: get DOB (from state first, else familydata)
    const getMemberDOB = () => {
      if (
        goaldetails.user_goal_user_dob &&
        moment(goaldetails.user_goal_user_dob, "DD/MM/YYYY").isValid()
      ) {
        return goaldetails.user_goal_user_dob;
      }
      const member = familydata.find(
        m => m.user_id === goaldetails.user_goal_for || m.value === goaldetails.user_goal_for
      );
      if (member && member.dob && moment(member.dob, "DD/MM/YYYY").isValid()) {
        return member.dob;
      }
      return null;
    };

    if (dateType === "startDate") {
      const updatedStartDate = moment(date, "DD/MM/YYYY");
      let updates = {
        ...goaldetails,
        user_goal_start_date: updatedStartDate.format("DD/MM/YYYY"),
      };

      if (goaldetails.goal_name_uuid === "education") {
        const dob = getMemberDOB();
        let age = "";
        if (dob) {
          age = calculateAge(dob, updatedStartDate);
        }

        // ✅ education-specific end date logic
        if (
          goaldetails.user_goal_edu_cat_id === "ECAT-1" ||
          goaldetails.user_goal_edu_cat_id === "ECAT-2"
        ) {
          const updatedEndDate = updatedStartDate.clone().add(3, "years");
          updates = {
            ...updates,
            user_goal_end_date: updatedEndDate.format("DD/MM/YYYY"),
            user_goal_user_age: age,
          };
        } else if (goaldetails.user_goal_edu_cat_id === "ECAT-4") {
          const updatedEndDate = updatedStartDate.clone().add(1, "years");
          updates = {
            ...updates,
            user_goal_end_date: updatedEndDate.format("DD/MM/YYYY"),
            user_goal_user_age: age,
          };
        } else {
          updates.user_goal_user_age = age;
        }
      } else {
        // ✅ For non-education, keep end date same as start only if empty
        if (!goaldetails.user_goal_end_date) {
          updates.user_goal_end_date = updatedStartDate.format("DD/MM/YYYY");
        }
      }

      setGoalDetails(updates);
    } else {
      // const updatedEndDate = moment(date, "DD/MM/YYYY").format("DD/MM/YYYY");
      // let updates = {
      //   ...goaldetails,
      //   user_goal_end_date: updatedEndDate,
      // };
      // const retirementDateFormatted = moment(retirmentdate, ["DD/MM/YYYY", "MM/DD/YYYY"]).format("DD/MM/YYYY");
      // const lifeExpectancyDateFormatted = moment(lifeexpectancydate, ["DD/MM/YYYY", "MM/DD/YYYY"]).format("DD/MM/YYYY");
      const updatedEndDate = moment(date).format("DD/MM/YYYY");; // standardized
      let updates = {
        ...goaldetails,
        user_goal_end_date: updatedEndDate,
      };

      const retirementDateFormatted = moment(retirmentdate).format("DD/MM/YYYY");
      const lifeExpectancyDateFormatted = moment(lifeexpectancydate).format("DD/MM/YYYY");

      // ✅ don’t mutate state directly
      if (updatedEndDate !== retirementDateFormatted && updatedEndDate !== lifeExpectancyDateFormatted) {
        updates.goal_isAfterRetirement = null;
      }

      setGoalDetails(updates);
    }
  };


  const cancelGoalForm = (e) => {
    e.preventDefault();

    // ✅ Use dynamic default based on goalCategories
    const newDefaults = getDefaultGoalDetails(goalCategories, "education"); // fallback to Education
    setGoalDetails({
      ...newDefaults,
      user_goal_user_id: getParentUserId(),
    });
   
    setSelectedOption(newDefaults.goal_name_uuid);
    setHandleError({ ...defaultHandleError });
    setEditFlag(false);
  };

  // const sortByGoal = (type) => {
  //   const goalsData = [...goaldata].sort((a, b) => {
  //     const moveToEnd = ["retirement", "contingency"];
  //     if (moveToEnd.includes(a.goal_name_uuid)) return 1;
  //     if (moveToEnd.includes(b.goal_name_uuid)) return -1;

  //     if (type === "isCritical_sort") {
  //       return (b.goal_isCritical === true) - (a.goal_isCritical === true);
  //     } else if (type === "goal_priority") {

  //       const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  //       return (priorityOrder[a.user_goal_priority] || 99) - (priorityOrder[b.user_goal_priority] || 99);
  //     } else if (type === "goalendadate") {
  //         const parseDate = (d) => new Date(d.split("/").reverse().join("-"));
  //         return parseDate(a.user_goal_start_date) - parseDate(b.user_goal_start_date);
  //     }
  //     //   return (
  //     //     new Date(a.user_goal_start_date.split("/").reverse().join("-")) -
  //     //     new Date(b.user_goal_start_date.split("/").reverse().join("-"))
  //     //   );
  //     // }
  //     return 0;
  //   });
  //   setGoalData(goalsData);
  //   setMenuDropDownOpen(false);
  // };

  const sortByGoal = (type) => {
    const goalsData = [...goaldata].sort((a, b) => {
      const moveToEnd = ["retirement", "contingency"];

      // Move specific goals to end
      if (moveToEnd.includes(a.goal_name_uuid) && !moveToEnd.includes(b.goal_name_uuid)) return 1;
      if (!moveToEnd.includes(a.goal_name_uuid) && moveToEnd.includes(b.goal_name_uuid)) return -1;

      // Sort by critical flag
      if (type === "isCritical_sort") {
        return Number(b.goal_isCritical) - Number(a.goal_isCritical);
      }

      // Sort by priority
      if (type === "goal_priority") {
        const priorityOrder = {
          "Very High": 1,
          "High": 2,
          "Medium": 3,
          "Low": 4,
        };
        const aPriority = priorityOrder[a.user_goal_priority] || 99;
        const bPriority = priorityOrder[b.user_goal_priority] || 99;
        return aPriority - bPriority;
      }

      if (type === "goalendadate") {

        const parseDate = (d) => new Date(d.split("/").reverse().join("-"));

        const getDate = (item) => {
          // If goal occurrence is "One Time", use end date, else use start date
          if (item.user_goal_occurance === "One Time") {
            return parseDate(item.user_goal_end_date);
          } else {
            return parseDate(item.user_goal_start_date);
          }
        };

        return getDate(a) - getDate(b);
      }
      return 0; // default: no sorting  
    });

    setGoalData(goalsData);
    setMenuDropDownOpen(false);
  };



  // useEffect(() => {
  //   if (goaldetails.goal_for_member == "") {
  //     getMemberList();
  //   }
  // }, []);

  useEffect(() => {
    if (goaldetails.goal_isAfterRetirement != null) {
      handleIsRetirement();
    }
  }, [goaldetails.goal_isAfterRetirement]);
  useEffect(() => {
    if (goaldetails.goal_name_uuid === "education") {
      // setEditEducation(true);
      handleEdutype();
    }
    // handleDate();
    // }, [goaldetails.user_goal_edu_cat_id, goaldetails.user_goal_for]);
  }, [goaldetails.user_goal_edu_cat_id, goaldetails.user_goal_for]);

  useEffect(() => {
    if (goaldetails.user_goal_valid_till === "Retirement") {
      setGoalDetails((prevDetails) => ({
        ...prevDetails,
        goal_isAfterRetirement: "0",
      }));
    } else if (goaldetails.user_goal_valid_till === "Life Expectancy") {
      setGoalDetails((prevDetails) => ({
        ...prevDetails,
        goal_isAfterRetirement: "1",
      }));
    } else {
      setGoalDetails((prevDetails) => ({
        ...prevDetails,
        goal_isAfterRetirement: null,
      }));
    }
  }, [goaldetails.user_goal_valid_till]);


  // useEffect(() => {
  //   if (goaldetails.user_goal_for) {
  //     const selectedMember = memberdata.find(
  //       (member) => member.value === goaldetails.user_goal_for
  //     );

  //     if (selectedMember) {
  //       if (selectedMember.isdependent === "0" || selectedMember.isdependent === false) {
  //         setshowRadioButton(true); // Show radio buttons for non-dependent members
  //       } else {
  //         setshowRadioButton(false); // Hide radio buttons for dependent members
  //       }
  //     }
  //   }
  // }, [goaldetails.user_goal_for, memberdata]);

  if (
    goaldetails &&
    ["vehicle", "vacation", "others"].includes(goaldetails.goal_name_uuid)
  ) {
    sortOptionsPayment = sortOptionsPayment2;
  } else {
    sortOptionsPayment = sortOptionsPayment1;
  }

  const [showPopup, setShowPopup] = useState(false);

  const handlePopupContinue = () => {
    setShowPopup(true);
  }

  const handlePopupClose = () => {
    setShowPopup(false); // Close the popup
  };

  const renderDatePicker = () => {
    return (
      <div className="dark-label">
        <Form.Label>Goal End Date*</Form.Label>
        <div className="dt-conbx" style={{ borderBottom: "1px solid #dadada" }}>

          <ReactDatePicker
            select_date={moment(goaldetails.user_goal_end_date, "DD/MM/YYYY")}
            setDate={(date) => {
              setDate(date, "endDate");
              handleEndDate(date);
            }}
            minDate={
              moment(goaldetails.user_goal_start_date, "DD/MM/YYYY").add(
                getMinDateValue(),
                'months'
              )
            }
            maxDate={""}
            className="pt-4"
          />
        </div>
        <div style={{ bottom: "-21px" }} className="error">{handlerror.goalEndDate}</div>
      </div>
    );
  };

  const getMinDateValue = () => {
    let frequencyMonths;
    if (
      goaldetails &&
      ["vehicle", "vacation", "others"].includes(goaldetails.goal_name_uuid)
    ) {
      switch (goaldetails.user_goal_freq) {
        case freqCodeMap["6"]:
          frequencyMonths = 60;
          break;
        case freqCodeMap["5"]:
          frequencyMonths = 48;
          break;
        case freqCodeMap["4"]:
          frequencyMonths = 36;
          break;
        case freqCodeMap["3"]:
          frequencyMonths = 24;
          break;
        case freqCodeMap["2"]:
          frequencyMonths = 12;
          break;
        case freqCodeMap["1"]:
        default:
          frequencyMonths = 6;
          break;
      }
    } else {
      switch (goaldetails.user_goal_freq) {
        case freqCodeMap["4"]:
          frequencyMonths = 12;
          break;
        case freqCodeMap["3"]:
          frequencyMonths = 6;
          break;
        case freqCodeMap["2"]:
          frequencyMonths = 3;
          break;
        case freqCodeMap["1"]:
        default:
          frequencyMonths = 1;
          break;
      }
    }

    const minDate = moment(goaldetails.user_goal_start_date, "DD/MM/YYYY")
      .add(frequencyMonths, "months");

    const endDate = moment(goaldetails.user_goal_end_date, "DD/MM/YYYY").toDate();

    if (endDate < minDate) {
      setGoalDetails({
        ...goaldetails,
        user_goal_end_date: minDate,
      });
      handleEndDate(minDate);
    }
    return frequencyMonths;
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    const ageRegex = /^[1-9][0-9]*$/;

    if (value === '') {
      setError('Please enter age');
      setGoalDetails({ ...goaldetails, user_goal_user_age: '' });
    } else if (ageRegex.test(value) && parseInt(value, 10) < 100) {
      setError('');
      setGoalDetails({ ...goaldetails, user_goal_user_age: value });
    } else {
      setError('Age must be less than 100');
    }
  };

  const freqCodeMap = {
    "1": "One Time",
    "2": "Monthly",
    "3": "Quarterly",
    "4": "Half Yearly",
    "5": "Yearly",
    "6": "Once In 2 Years",
    "7": "Once In 3 Years",
    "8": "Once In 4 Years",
    "9": "Once In 5 Years",
  };


  return (
    <DatagatherLayout>
      <FintooLoader isLoading={isLoading} />

      <div className="">
        <div className="background-div">
          <div
            className={`bg ${currentUrl.indexOf("datagathering/goals") > -1 ? "active" : ""
              }`}
            id="bg-goals"
          ></div>
        </div>
        <div className="white-box">
          <div>
            <div className={` ${tab == "tab1" ? "d-block" : "d-none"}`}>
              <div className="row">
                <div className="col-md-10 col-12">
                  <div style={{
                    height: scroll ? "58px" : null,
                    top: scroll ? "0px" : null,
                    padding: scroll ? "0 2rem" : null,
                  }} className={`d-flex align-items-center  top-tab-menu justify-content-between FixdgHeader`}>
                    <div className="d-flex align-items-center">
                      {goaldata && goaldata.length > 2 && (
                        <FintooCheckbox
                          checked={selectedgoalCategories.length === goaldata.length}
                          onChange={() => {
                            if (selectedgoalCategories.length === goaldata.length) {
                              setSelectedgoalCategories([]);
                              setDeleteTogglegoal(false);
                            } else {
                              const allIds = goaldata.map(goal => goal.name);
                              setSelectedgoalCategories(allIds);
                              setDeleteTogglegoal(true);
                            }
                          }}
                        />
                      )}
                      <div
                        className="total-amt"
                        style={{
                          fontSize: "1.1rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "500",
                          }}
                        >
                          {" "}
                          ADDED GOALS
                        </span>
                      </div>
                    </div>
                    <div>
                      {
                        selectedgoalCategories.length > 0 &&
                        deletetogglegoal == true && (
                          <span
                            onClick={() => {
                              handleShow();
                              // setGoalId(i.name);
                              // setGoalName(i.user_goal_name);
                              // setCategoryType(i.goal_category_type);
                            }}
                            style={{
                              marginRight: "2rem",
                              cursor: "pointer"
                            }}
                            className="opt-options-2 pointer"
                          >
                            <MdDelete style={{ color: "#042b62", fontSize: "1.6rem" }} />
                          </span>
                        )
                      }
                      {
                        deletetogglegoal ? null :
                          <div className="sorting d-inline-block" ref={dropdownRef}>
                            <a
                              className="color-blue font-bold sort-by"
                              onMouseOver={() => setMenuDropDownOpen(true)}
                            >
                              Sort By{" "}
                              <img
                                alt=""
                                src={imagePath + '/static/media/DG/assets-liabilities/sort.svg'}

                              />
                            </a>
                            {isMenuDropDownOpen && (
                              <ul className="sort-menu" id="goal-sort">
                                <li>
                                  <div onClick={() => sortByGoal("isCritical_sort")}>
                                    By Critical
                                  </div>
                                </li>
                                <li>
                                  <div onClick={() => sortByGoal("goal_priority")}>
                                    By Priority
                                  </div>
                                </li>
                                <li>
                                  <div onClick={() => sortByGoal("goalendadate")}>
                                    By Date
                                  </div>
                                </li>
                              </ul>
                            )}
                          </div>
                      }
                    </div>
                  </div>
                  <div className={goaldata == true ? "inner-box" : "inner-box"}>
                    {isDataLoading && (<div>
                      <div className=" inner-container mt-4 pt-4">
                        <div className="shine w-25 mb-1" style={{ height: '.7rem' }}></div>
                        <div className="shine w-100" style={{ height: '.7rem' }}></div>
                      </div>
                      <div className=" inner-container mt-4 pt-4">
                        <div className="shine w-25 mb-1" style={{ height: '.7rem' }}></div>
                        <div className="shine w-100" style={{ height: '.7rem' }}></div>
                      </div>
                    </div>)}
                    {goaldata &&
                      goaldata.map((i, index) => (
                        <div className="d-flex align-items-center" key={index}>
                          {
                            i.goal_name_uuid == "retirement" || i.goal_name_uuid == "contingency" ?
                              null :
                              <FintooCheckbox
                                id={i.name}
                                checked={selectedgoalCategories.includes(i.name)}
                                title={i.title}
                                onChange={() => {
                                  setSelectedgoalCategories((prevSelected) => {
                                    if (prevSelected.includes(i.name)) {
                                      const updatedSelection = prevSelected.filter((id) => id !== i.name);
                                      setDeleteTogglegoal(updatedSelection.length > 0); // Check if any checkbox is still selected
                                      return updatedSelection;
                                    } else {
                                      setDeleteTogglegoal(true);
                                      return [...prevSelected, i.name];
                                    }
                                  });
                                }}
                              />
                          }
                          <div style={{
                            marginLeft: i.goal_name_uuid == "retirement" || i.goal_name_uuid == "contingency" ? "2rem" : "0"
                          }} key={i.name} className={`inner-container mt-4 w-100`}>
                            {
                              isDataLoading == false && (
                                <h4 className="">
                                  {i.goal_category_type}
                                  {i.user_goal_name == null || i.user_goal_name == ""
                                    ? ""
                                    : " - " + i.user_goal_name}
                                </h4>
                              )
                            }
                            {
                              isDataLoading == false && (
                                <div className="row ">
                                  {(i.goal_name_uuid !== "contingency" && i.goal_name_uuid !== "retirement") && (
                                    <div className="col-md-4">
                                      <div className="display-style">
                                        {/* <span>
                                          Value{" "}
                                          {i.goal_name_uuid != "vacation" &&
                                            i.goal_name_uuid != "others" &&
                                            i.goal_name_uuid != "vehicle"
                                            ? "(" + frequencylist[i.user_goal_freq] + ")"
                                            : "(" + vacationfreqlist[i.user_goal_freq] + ")"}
                                        </span> */}
                                        <span>
                                          Value{" "}
                                          {i.user_goal_freq === null || i.user_goal_freq === "" ? (
                                            "(One Time)"
                                          ) : (
                                            i.goal_name_uuid !== "vacation" &&
                                              i.goal_name_uuid !== "others" &&
                                              i.goal_name_uuid !== "vehicle"
                                              ? `(${frequencylist[i.user_goal_freq]})`
                                              : `(${vacationfreqlist[i.user_goal_freq]})`
                                          )}
                                        </span>


                                        <p className="">₹{i.user_goal_amount}</p>
                                      </div>
                                    </div>
                                  )}
                                  <div className="col-md-2">
                                    <div className="display-style">
                                      <span>Year:</span>
                                      {i.user_goal_occurance === "Recurring" ? (
                                        <p className="">
                                          {moment(i.user_goal_start_date, "DD/MM/YYYY").format("YYYY")}
                                        </p>
                                      ) : (
                                        !(
                                          i.goal_name_uuid == "retirement" ||
                                          i.goal_name_uuid == "contingency"
                                        ) ?
                                          (
                                            <p className="">
                                              {moment(i.user_goal_end_date, "DD/MM/YYYY").format("YYYY")}
                                            </p>
                                          ) :
                                          (
                                            <p className="">
                                              {moment(i.user_goal_end_date, "DD/MM/YYYY").format("YYYY")}
                                            </p>
                                          )
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-md-4">
                                    <div className="display-style">
                                      <span>Priority:</span>
                                      <p className="">
                                        {(i.goal_name_uuid !== "contingency" && i.goal_name_uuid !== "retirement") &&
                                          priority_set[i.user_goal_priority] + " /"}
                                      </p>
                                      &nbsp;
                                      <p>{i.user_goal_type === "Critical" ? "Critical" : "Non-critical"}</p>
                                    </div>
                                  </div>
                                  {!(
                                    i.goal_name_uuid == "retirement" ||
                                    i.goal_name_uuid == "contingency"
                                  ) && (
                                      <div className="col-md-2">
                                        <div className="opt-options float-md-right">
                                          <span>
                                            <BsPencilFill
                                              onClick={() => {
                                                editGoal(i), setEditFlag(true);
                                              }}
                                            />
                                          </span>

                                          {/* <span
                                          onClick={() => {
                                            handleShow();
                                            setGoalId(i.name);
                                            setGoalName(i.user_goal_name);
                                            setCategoryType(i.goal_category_type);
                                          }}
                                          className="opt-options-2"
                                        >
                                          <MdDelete />
                                        </span> */}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              )
                            }
                            {i.goal_name_uuid == "retirement" && (
                              <div>
                                <br />
                                <p>
                                  Note : The retirement goal is added
                                  automatically as per the default goal, based on
                                  the retirement age provided in the about you
                                  section. As it is recommended by our financial
                                  experts, it is not editable.
                                </p>
                              </div>
                            )}
                            {i.goal_name_uuid == "contingency" && (
                              <div>
                                <br />
                                <p>
                                  Note : The Contingency Goal is added
                                  automatically as per default goal, based on the
                                  Liquidity Ratio. As it is recommended by our
                                  Financial Experts, It is not editable.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                      ))}
                  </div>

                </div>
                <div className="removefixheader col-md-10 col-12">
                  <div className="accordion mt-4">
                    <div className="accordion-panel active">
                      <div className="accordion-header d-flex justify-content-between">
                        <h4 className="accordion-heading">
                          <img
                            className="accordian-img"
                            src={
                              imagePath +
                              "/static/media/DG/goal/goal-top.svg"
                            }
                            alt="Goal"
                          />
                          Goal Form
                        </h4>
                        <div
                          onClick={() => setShowView(!showview)}
                          className={`${DGstyles.HideSHowicon} hideShowIconCustom`}
                        >
                          {showview == true ? <>-</> : <>+</>}
                        </div>
                      </div>
                      {showview && (
                        <div
                          className={`accordion-content  family ${DGstyles.bgGoals}`}
                        >
                          <div className="row py-2">
                            <span>
                              <label className="">
                                Nature Of Goal : (
                                {selectedOption
                                  ? selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)
                                  : ""}
                                )
                              </label>
                              {/* end ngIf: categorydetail!=''  */}
                            </span>
                            <div className="col-10">
                              <ul className="card-list">
                                {options.map((v) => {
                                  const inputId = `goal-radio-${v.goal_id}`;
                                  return (
                                    <li
                                      key={v.goal_id}
                                      onClick={() => {
                                        setCounter((prev) => prev + 1);

                                        // Helper: get DOB from goaldetails or from familydata fallback
                                        let memberDob = goaldetails.user_goal_user_dob;
                                        if (!memberDob || !moment(memberDob, "DD/MM/YYYY").isValid()) {
                                          // Lookup the member's DOB from familydata
                                          const member = familydata.find(
                                            m =>
                                              m.user_id === (goaldetails.user_goal_for || memberdata?.[0]?.value) ||
                                              m.value === (goaldetails.user_goal_for || memberdata?.[0]?.value)
                                          );
                                          if (member && member.dob && moment(member.dob, "DD/MM/YYYY").isValid()) {
                                            memberDob = member.dob;
                                          }
                                        }

                                        // Calculate age
                                        const member_age = calculateAge(memberDob);

                                        setMemberAge(member_age);
                                        setHandleError({ ...defaultHandleError });
                                        const newDefaults = getDefaultGoalDetails(goalCategories, v.goal_name_uuid);
                                        setGoalDetails({
                                          ...newDefaults,
                                          goal_cat_id: v.goal_id,
                                          user_goal_name: v.goal_name,
                                          goal_category_type: v.goal_name,
                                          goal_name_uuid: v.goal_name_uuid,
                                          user_goal_user_id: getParentUserId(),
                                          user_goal_type: goaldetails.user_goal_type,
                                          user_goal_priority: "High",
                                          user_goal_freq: freqCodeMap["4"],
                                          user_goal_growth_rate: 10,
                                          user_goal_funded_by: "Self",
                                          user_goal_user_age: member_age,
                                          user_goal_for: memberdata?.[0]?.value || "",
                                          user_goal_user_dob: memberDob || "", // set dob for future reference
                                        });
                                        setSelectedOption(v.goal_name_uuid);
                                        setEditFlag(false);
                                        setshowRadioButton(true);
                                        scrollToGoalRef();

                                      }}
                                      className={`li-options ${selectedOption === v.goal_name_uuid ? "active" : ""}`}
                                    >
                                      <input
                                        type="radio"
                                        id="radio"
                                        value={v.goal_id}
                                        name="type"
                                        data-show=".recurring-group"
                                      />
                                      <label htmlFor="type-2">
                                        <img alt={v.goal_name} src={v.image} />
                                        {v.goal_name}
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>

                          <div ref={cntRef}>
                            <form
                              noValidate="novalidate"
                              className="floatinfo"
                              name="goldassetform"
                            >
                              <div className="row d-flex align-items-center py-2">
                                <div className="col-md-5 col-12 custom-input " style={{ paddingTop: "19px" }}>
                                  <div className={`form-group w-100 ${goaldetails.user_goal_name ? "inputData" : null}`} >
                                    <span>
                                      <input type="text" name="goal_name" value={goaldetails.user_goal_name}
                                        maxLength={35}
                                        id="goal_name"
                                        onChange={(e) => {
                                          setGoalDetails({
                                            ...goaldetails,
                                            user_goal_name: e.target.value,
                                          });
                                          handleGoalName(e.target.value);
                                        }}
                                        autoComplete="off" />
                                      <span className="highlight"></span>
                                      <span className="bar"></span>
                                      <label htmlFor="name">Goal Name*</label>
                                    </span>
                                    <span className="info-hover-box">
                                      <span className="icon">
                                        <img
                                          alt="More information"
                                          src={imagePath + '/static/media/more_information.svg'}
                                        />
                                      </span>
                                      <span className="msg">
                                        Ex: Swati's higher education, Ajay's
                                        business investment or anything which
                                        you can relate to.
                                      </span>
                                    </span>
                                  </div>
                                  <div className="error">
                                    {handlerror.goalName}
                                  </div>
                                </div>
                                <div className="col-md-5 col-12 ">
                                  <div className="material">
                                    <Form.Label>
                                      Who Is This Goal For?*
                                    </Form.Label>
                                    <Select
                                      classNamePrefix="sortSelect"
                                      isSearchable={false}
                                      styles={customStyles}
                                      options={memberdata}
                                      value={memberdata.filter(
                                        (e) => e.value == goaldetails.user_goal_for
                                      )}
                                      onChange={(e) => {
                                        setGoalDetails({
                                          ...goaldetails,
                                          goal_for_member: e.value
                                        });
                                        handleGoalMemberEnddate(e);
                                      }
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row d-flex align-items-center">
                                <div className={`col-md-5 col-12 custom-input`} style={{ paddingTop: "19px" }}>
                                  <div className={`form-group w-100 ${goaldetails.user_goal_amount ? "inputData" : null}`} >
                                    <span>
                                      <input type="number" name="user_goal_amount" value={goaldetails.user_goal_amount}
                                        minLength={1}
                                        id="user_goal_amount"
                                        maxLength={11}
                                        onChange={(e) => {
                                          const inputValue = e.target.value;
                                          if (inputValue.length <= 9 && /^\d*$/.test(inputValue)) {
                                            setGoalDetails({
                                              ...goaldetails,
                                              user_goal_amount: inputValue,
                                            });
                                            handleGoalValue(inputValue);
                                          }
                                        }}
                                        autoComplete="off" />
                                      <span className="highlight"></span>
                                      <span className="bar"></span>
                                      <label htmlFor="name">What is the present cost of the goal?(₹)*</label>
                                    </span>
                                    <span className="info-hover-box">
                                      <span className="icon">
                                        <img
                                          alt="More information"
                                          src={imagePath + '/static/media/more_information.svg'}
                                        />
                                      </span>
                                      <span className="msg">
                                        If you were to spend for this goal today,
                                        how much amount is required in today's
                                        terms. Do not consider inflated value.
                                      </span>
                                    </span>
                                  </div>
                                  <div className="error">
                                    {handlerror.goalCurrentValue}
                                  </div>
                                </div>
                                {goaldetails &&
                                  goaldetails.goal_name_uuid == "education" ? (
                                  <div className="col-md-5 col-12 pt-1" style={{ position: "relative" }}>
                                    <div className="material">
                                      <Form.Label>
                                        Type Of Education*
                                      </Form.Label>

                                      <Select
                                        classNamePrefix="sortSelect"
                                        isSearchable={false}
                                        styles={customStyles}
                                        onChange={(v) => {
                                          setGoalDetails({
                                            ...goaldetails,
                                            user_goal_edu_cat_id: v.value,
                                            goal_edu_cat_id: v.value,
                                            // goal_isAfterRetirement: "",
                                            // goal_end_date: ""
                                          });
                                          handleEdu(v.value);
                                          // handleEdutype()
                                        }}
                                        value={sortOptionsEducation.filter(
                                          (v) =>
                                            v.value == (goaldetails?.user_goal_edu_cat_id || goaldetails?.goal_edu_cat_id)
                                        )}
                                        options={sortOptionsEducation}
                                      />



                                      {/* <Select
                                        classNamePrefix="sortSelect"
                                        isSearchable={false} // or true if you want search
                                        styles={customStyles}
                                        onChange={(v) => {
                                          setGoalDetails({
                                            ...goaldetails,
                                            user_goal_edu_cat_id: v.value,
                                            goal_edu_cat_id: v.value,
                                          });
                                          handleEdu(v.value);
                                          // handleEdutype(v.value); // pass value if needed
                                        }}
                                        value={sortOptionsEducation.find(
                                          (v) =>
                                            v.value === (goaldetails?.user_goal_edu_cat_id || goaldetails?.goal_edu_cat_id)
                                        )}
                                        options={sortOptionsEducation}
                                      /> */}

                                    </div>
                                    <div style={{ position: "absolute", bottom: "-16px" }} className="error">
                                      {handlerror.goalEduType}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="col-md-5 col-12">
                                    <div className="material">
                                      <Form.Label>Goal Priority*</Form.Label>
                                      <Select
                                        classNamePrefix="sortSelect"
                                        isSearchable={false}
                                        styles={customStyles}
                                        onChange={(p) =>
                                          setGoalDetails({
                                            ...goaldetails,
                                            user_goal_priority: p.value,
                                          })
                                        }
                                        value={sortOptionsGoalPriority.filter(
                                          (v) =>
                                            v.value == goaldetails.user_goal_priority
                                        )}
                                        options={sortOptionsGoalPriority}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                              {goaldetails &&
                                goaldetails.goal_name_uuid == "education" && (
                                  <div className="row mt-2 py-3">
                                    <div className="col-md-5 col-12  mt-2">
                                      <div className="material">
                                        <Form.Label>Goal Priority*</Form.Label>
                                        <Select
                                          classNamePrefix="sortSelect"
                                          isSearchable={false}
                                          styles={customStyles}
                                          onChange={(p) =>
                                            setGoalDetails({
                                              ...goaldetails,
                                              user_goal_priority: p.value,
                                            })
                                          }
                                          value={sortOptionsGoalPriority.filter(
                                            (v) =>
                                              v.value ==
                                              goaldetails.user_goal_priority
                                          )}
                                          options={sortOptionsGoalPriority}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              <div className="row py-3 mt-3">
                                <div className="col-md-5 col-12 ">
                                  <div className="material">
                                    <div className=" d-flex justify-content-between">
                                      <div>
                                        <Form.Label>
                                          Goal inflation rate(%)* :{" "}
                                          {Number(goaldetails.user_goal_growth_rate)}
                                        </Form.Label>
                                      </div>
                                      <div>
                                        <span
                                          className="info-hover-box"
                                          style={{
                                            top: "-22px",
                                          }}
                                        >
                                          <span className="icon">
                                            <img
                                              alt="More information"
                                              src={imagePath + '/static/media/more_information.svg'}
                                            />
                                          </span>
                                          <span className="msg">
                                            Inflation is the rate of increase in
                                            prices over a given period. The rate
                                            of inflation mentioned here is
                                            assumed on the basis of the average
                                            inflation rate of the past 10 years.
                                            If you wish, you can also change it
                                            as per your requirement.
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      className={`${goaldetails.user_goal_growth_rate < 2 &&
                                        "sl-hide-left"
                                        } ${goaldetails.user_goal_growth_rate > 18 &&
                                        "sl-hide-right"
                                        }`}
                                    >
                                      <Slider
                                        min={0}
                                        max={20}
                                        value={goaldetails.user_goal_growth_rate}
                                        onChange={(v) =>
                                          setGoalDetails({
                                            ...goaldetails,
                                            user_goal_growth_rate:
                                              Math.round(
                                                (parseFloat(v) +
                                                  Number.EPSILON) *
                                                100
                                              ) / 100,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="row py-3">
                                <div className="col-md-8 col-12">
                                  <div className="d-md-flex d-grid">
                                    <Form.Label className="">
                                      Is This goal critical or not?*
                                    </Form.Label>
                                    <div className="d-flex ps-md-5">
                                      <div className="d-flex ms-md-5">
                                        Non-critical
                                      </div>
                                      <Switch
                                        onChange={(e) =>
                                          setGoalDetails({
                                            ...goaldetails,
                                            user_goal_type: e ? "Critical" : "Non-critical"
                                          })
                                        }
                                        checked={goaldetails.user_goal_type === "Critical"}
                                        className="react-switch px-2"
                                        activeBoxShadow="0 0 2px 3px #042b62"
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        height={20}
                                        width={40}
                                        onColor="#042b62"
                                        offColor="#d8dae5"
                                      />
                                      <div>Critical</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {goaldetails.goal_name_uuid != "emergency" && (
                                <div className="row py-3">
                                  <div className="col-md-8 col-12">
                                    <div className="d-md-flex d-grid">
                                      <Form.Label className=" ">
                                        Will The Goal Amount Be Funded By ?*
                                      </Form.Label>
                                      <div className="d-flex ps-md-5">
                                        <div>Self</div>
                                        <Switch
                                          onChange={(e) => {
                                            handlePatialLoan(e);
                                            setGoalDetails({
                                              ...goaldetails,
                                              user_goal_funded_by: e ? "Loan" : "Self",
                                            });
                                          }}
                                          checked={
                                            goaldetails.user_goal_funded_by === "Loan"
                                          }
                                          className="react-switch px-2"
                                          activeBoxShadow="0 0 2px 3px #042b62"
                                          uncheckedIcon={false}
                                          checkedIcon={false}
                                          height={20}
                                          width={40}
                                          onColor="#042b62"
                                          offColor="#d8dae5"
                                        />
                                        <div>Loan</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {goaldetails &&
                                goaldetails.user_goal_funded_by === "Loan" &&
                                goaldetails.goal_name_uuid != "emergency" && (
                                  <>
                                    <div className="row py-3">
                                      <div className="col-md-5 col-12 ">
                                        <div className="material">
                                          <div className="d-flex justify-content-between">
                                            <div>
                                              <Form.Label>
                                                Loan Percentage(%)* :{" "}
                                                {Number(
                                                  goaldetails.user_goal_loan_percentage
                                                )}
                                              </Form.Label>
                                            </div>
                                          </div>
                                          <div
                                            className={`${goaldetails.user_goal_loan_percentage <
                                              5 && "sl-hide-left"
                                              } ${goaldetails.user_goal_loan_percentage >
                                              95 && "sl-hide-right"
                                              }`}
                                          >
                                            <Slider
                                              min={0}
                                              max={100}
                                              value={
                                                goaldetails.user_goal_loan_percentage
                                              }
                                              onChange={(v) =>
                                                setGoalDetails({
                                                  ...goaldetails,
                                                  user_goal_loan_percentage:
                                                    Math.round(
                                                      (parseFloat(v) +
                                                        Number.EPSILON) *
                                                      100
                                                    ) / 100,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-md-5 col-12 ">
                                        <div className="material">
                                          <div className=" d-flex justify-content-between">
                                            <div>
                                              <Form.Label>
                                                Loan Tenure* :{" "}
                                                {goaldetails.user_goal_loan_tenure}
                                              </Form.Label>
                                            </div>
                                          </div>
                                          <div
                                            className={`${goaldetails.user_goal_loan_tenure < 3 &&
                                              "sl-hide-left"
                                              } ${goaldetails.user_goal_loan_tenure > 27 &&
                                              "sl-hide-right"
                                              }`}
                                          >
                                            <Slider
                                              min={1}
                                              max={30}
                                              value={
                                                goaldetails.user_goal_loan_tenure
                                              }
                                              onChange={(v) =>
                                                setGoalDetails({
                                                  ...goaldetails,
                                                  user_goal_loan_tenure: v,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row py-3">
                                      <div className="col-md-5 col-12 ">
                                        <div className="material">
                                          <div className=" d-flex justify-content-between">
                                            <div>
                                              <Form.Label>
                                                Interest Rate(%)* :{" "}
                                                {parseFloat(goaldetails.user_goal_interest_rate, 1)}
                                              </Form.Label>
                                            </div>
                                          </div>
                                          <div
                                            className={`${goaldetails.user_goal_interest_rate <
                                              2 && "sl-hide-left"
                                              } ${goaldetails.user_goal_interest_rate >
                                              18 && "sl-hide-right"
                                              }`}
                                          >
                                            <Slider
                                              min={0}
                                              max={20}
                                              step={0.1}
                                              value={
                                                goaldetails.user_goal_interest_rate
                                              }
                                              onChange={(v) =>
                                                setGoalDetails({
                                                  ...goaldetails,
                                                  user_goal_interest_rate:
                                                    Math.round(
                                                      (parseFloat(v) +
                                                        Number.EPSILON) *
                                                      100
                                                    ) / 100,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              {goaldetails &&
                                goaldetails.goal_name_uuid != "marriage" && (
                                  <div className="row py-3">
                                    <div className="col-md-8 col-12">
                                      <div className="d-md-flex d-grid">
                                        <Form.Label className="">
                                          Is the goal one time or recurring?*
                                        </Form.Label>
                                        <div className="d-flex ps-md-4">
                                          <div>One Time</div>
                                          <Switch
                                            onChange={(e) => {
                                              handlePatialLoan(e);
                                              setGoalDetails({
                                                ...goaldetails,
                                                user_goal_occurance: e ? "Recurring" : "One Time",
                                                // user_goal_end_date: e ? goaldetails.user_goal_end_date : goaldetails.user_goal_start_date,
                                                // goal_isAfterRetirement: e ? null : goaldetails.goal_isAfterRetirement,
                                              });
                                            }}

                                            checked={
                                              goaldetails.user_goal_occurance === "Recurring"
                                            }
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
                                )}

                              {goaldetails &&
                                goaldetails.user_goal_occurance === "Recurring" && (
                                  <>
                                    <div className="row d-flex align-items-center py-2">
                                      <div className="col-md-5 col-12 ">
                                        <div
                                          className="dark-label"
                                          style={{
                                            marginTop: "0px",
                                          }}
                                        >
                                          <Form.Label>
                                            Goal Start Date*
                                          </Form.Label>
                                          <div
                                            className="dt-conbx"
                                            style={{
                                              borderBottom: "1px solid #dadada",
                                              // paddingTop: "1rem",
                                            }}
                                          >
                                            <ReactDatePicker
                                              select_date={
                                                moment(goaldetails.user_goal_start_date, "DD/MM/YYYY").toDate()

                                              }
                                              setDate={(date) => {
                                                setDate(date, "startDate");
                                                handleStartDate(date);
                                              }}
                                              minDate={new Date()}
                                              maxDate={""}
                                              className="pt-4"
                                            />
                                          </div>
                                          <div className="error">
                                            {handlerror.goalStartDate}
                                          </div>
                                        </div>
                                      </div>
                                      {goaldetails &&
                                        goaldetails.goal_name_uuid == "education" && (
                                          <div className="col-md-5 col-12 custom-input">
                                            <div className={`form-group mt-2 w-100  ${(goaldetails.user_goal_user_age || goaldetails.user_goal_user_age === 0 || goaldetails.user_goal_user_age === '0') ? "inputData" : ""}`} style={{ paddingTop: '15px' }}>
                                              <input type="text" name="member_age" id="member_age" value={goaldetails.user_goal_user_age}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  const ageRegex = /^[1-9][0-9]*$/;
                                                  if (value === '' || ageRegex.test(value)) {
                                                    setGoalDetails({ ...goaldetails, user_goal_user_age: value });
                                                  }
                                                }} required
                                                autoComplete="off" />
                                              <span className="highlight"></span>
                                              <span className="bar"></span>
                                              <label htmlFor="name">Age*</label>
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                    <div className="row mt-1">
                                      {/* <Form.Label>Upto*</Form.Label> */}
                                      {/* <p>{goaldetails.user_goal_freq}</p> */}
                                      <div className="col-md-5 col-12">
                                        {goaldetails.user_goal_freq && (
                                          <>{renderDatePicker()}</>
                                        )}
                                      </div>
                                      {showRadioButton &&
                                        showRadioButton == true && (
                                          <>
                                            <div className="col-md-6 col-12 d-flex align-items-center">
                                              <div className="dark-label">
                                                <div
                                                  className="d-md-flex d-grid"
                                                  style={{ clear: "both" }}
                                                >
                                                  <FintooRadio2
                                                    checked={
                                                      goaldetails.goal_isAfterRetirement ==
                                                      "0"
                                                    }
                                                    onClick={(e) => {
                                                      setGoalDetails({
                                                        ...goaldetails,
                                                        goal_isAfterRetirement:
                                                          "0",
                                                      });
                                                      handleEndDate("0");
                                                      // handleIsRetirement();
                                                    }}
                                                    title="Upto Retirement Age"
                                                  />
                                                  <FintooRadio2
                                                    checked={
                                                      goaldetails.goal_isAfterRetirement ==
                                                      "1"
                                                    }
                                                    onClick={() => {
                                                      setGoalDetails({
                                                        ...goaldetails,
                                                        goal_isAfterRetirement:
                                                          "1",
                                                      });
                                                      handleEndDate("1");
                                                      // handleIsRetirement();
                                                    }}
                                                    title="Upto Life Expectancy Age"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </>
                                        )}
                                    </div>
                                    <div className="row py-3 mt-4">
                                      <div className="col-md-5 col-12 ">
                                        <div className="material">
                                          {/* <p>{goaldetails.user_goal_freq}</p> */}
                                          {/* <div>
                                            {sortOptionsPayment.map(opt => (
                                              <p key={opt.value}>{opt.label}</p>
                                            ))}
                                          </div> */}
                                          <Form.Label>Frequency*</Form.Label>
                                          <Select
                                            classNamePrefix="sortSelect"
                                            isSearchable={false}
                                            styles={customStyles}
                                            onChange={(v) => {
                                              setGoalDetails({
                                                ...goaldetails,
                                                user_goal_freq: v.value,
                                              });
                                              handleGoalFrq(v.value);
                                            }}
                                            value={sortOptionsPayment.filter(
                                              (v) =>
                                                v.value == goaldetails.user_goal_freq
                                            )}
                                            options={sortOptionsPayment}
                                          />
                                          <div style={{ position: "relative" }} className="error">
                                            {handlerror.goalFrequency}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}

                              {goaldetails &&
                                goaldetails.user_goal_occurance === "One Time" && (
                                  <div className="row py-1 d-flex align-items-center">
                                    <div className="col-md-5 col-12 ">
                                      <div
                                        className="dark-label"

                                      >
                                        <Form.Label>Goal Date*</Form.Label>
                                        <div
                                          className="dt-conbx"
                                          style={{
                                            borderBottom: "1px solid #dadada",
                                            // paddingTop: "1rem",
                                          }}
                                        >
                                          <ReactDatePicker
                                            select_date={
                                              goaldetails.user_goal_start_date &&
                                                moment(goaldetails.user_goal_start_date, "DD/MM/YYYY").isValid()
                                                ? moment(goaldetails.user_goal_start_date, "DD/MM/YYYY").toDate()
                                                : null
                                            }
                                            setDate={(date) => {
                                              setDate(date, "startDate");
                                              handleStartDate(date);
                                            }}
                                            minDate={new Date()}
                                            maxDate={""}
                                            className="pt-4"
                                          />
                                        </div>
                                        <div className="error">
                                          {handlerror.goalStartDate}
                                        </div>
                                      </div>
                                    </div>
                                    {goaldetails &&
                                      goaldetails.goal_name_uuid == "education" && (
                                        <div className="col-md-5 col-12 custom-input" style={{ paddingTop: "15px" }} >
                                          <div className={`form-group mt-2 w-100 ${(goaldetails.user_goal_user_age || goaldetails.user_goal_user_age === 0 || goaldetails.user_goal_user_age === '0') ? "inputData" : ""}`}>
                                            {/* <input type="text" name="member_age" id="member_age_s" value={goaldetails.user_goal_user_age}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                const ageRegex = /^[1-9][0-9]*$/;
                                                if (value === '' || ageRegex.test(value)) {
                                                  setGoalDetails({ ...goaldetails, user_goal_user_age: value });
                                                }
                                              }} required
                                              autoComplete="off" /> */}
                                            <input type="text" name="member_age" id="member_age" value={goaldetails.user_goal_user_age}
                                              onChange={(e) => {
                                                setGoalDetails({
                                                  ...goaldetails,
                                                  user_goal_user_age:
                                                    e.target.value,
                                                });
                                              }} required
                                              autoComplete="off" />
                                            <span className="highlight"></span>
                                            <span className="bar"></span>
                                            <label htmlFor="name">Age*</label>
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                )}
                              <div className="row">
                                <div className="col-md-10 col-12 custom-input mt-2">
                                  <div className={`form-group mt-2 ${goaldetails.user_goal_remarks ? "inputData" : ""}`} >
                                    <input type="text" name="S_Remarks" id="S_Remarks" value={goaldetails.user_goal_remarks}
                                      onChange={(e) => {
                                        setGoalDetails({
                                          ...goaldetails,
                                          user_goal_remarks: e.target.value,
                                        });
                                      }} autoComplete="off" />
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
                                            process.env.PUBLIC_URL +
                                            "/datagathering/income-expenses"
                                          }
                                        >
                                          <div className="previous-btn form-arrow d-flex align-items-center">
                                            <FaArrowLeft />
                                            <span className="hover-text">
                                              &nbsp;Previous
                                            </span>
                                          </div>
                                        </Link>
                                        {editflag == true ? (
                                          <>
                                            <button
                                              className="default-btn gradient-btn save-btn"
                                              onClick={(e) => cancelGoalForm(e)}
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              className="default-btn gradient-btn save-btn"
                                              onClick={(e) => {
                                                handleSubmit(e, "update");
                                                handleLocalStorageGoalsData(undefined, "1");
                                              }
                                              }
                                            >
                                              Update
                                            </button>
                                          </>
                                        ) : (
                                          <button
                                            className="default-btn gradient-btn save-btn"
                                            onClick={(e) => {
                                              handleSubmit(e);
                                              handleLocalStorageGoalsData(undefined, "0");
                                            }
                                            }
                                          >
                                            Save & Add More
                                          </button>
                                        )}

                                        {editflag == 1 ? (
                                          // Render the "Continue" button without <Link> when editflag is 1
                                          <div
                                            className="next-btn form-arrow d-flex align-items-center"
                                            onClick={() => setShowPopup(true)} // Show the popup when clicking
                                          >
                                            <span className="hover-text" style={{ maxWidth: 100 }}>
                                              Continue&nbsp;
                                            </span>
                                            <FaArrowRight />
                                          </div>
                                        ) : (
                                          <Link
                                            to={process.env.PUBLIC_URL + "/datagathering/assets-liabilities"}
                                          >
                                            <div className="next-btn form-arrow d-flex align-items-center">
                                              <span className="hover-text" style={{ maxWidth: 100 }}>
                                                Continue&nbsp;
                                              </span>
                                              <FaArrowRight />
                                            </div>
                                          </Link>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              This will permanently erase the record and its associated
              information.
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button onClick={() => { deleteGoal(); handleLocalStorageGoalsData(goalid, "0"); }} className="outline-btn m-2">
            Yes
          </button>
          <button onClick={handleClose} className="outline-btn m-2">
            No
          </button>
        </div>
      </Modal>
      <Modal className="popupmodal" centered show={showPopup} onHide={handlePopupClose}>
        <Modal.Header className="ModalHead">
          <div className="text-center">Information</div>
        </Modal.Header>
        <div className=" p-5 d-grid place-items-center align-item-center">
          <div className=" HeaderModal">
            <div
              style={{
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              It seems you have unsaved changes. Do you still want to continue to the next section?<br />We might not be able to save the changes if you go ahead.
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center pb-5">
          <button onClick={() => window.location.href = process.env.PUBLIC_URL + "/datagathering/assets-liabilities"} className="outline-btn m-2">
            Yes
          </button>
          <button onClick={handlePopupClose} className="outline-btn m-2">
            No
          </button>
        </div>
      </Modal>
      {/* <ToastContainer toastStyle={{ backgroundColor: "red" }}/> */}
    </DatagatherLayout>
  );
};
export default Goals;