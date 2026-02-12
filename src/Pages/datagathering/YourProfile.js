import { useState } from "react";
import { useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import PieChartOutflow from "../../Assets/Datagathering/Graph/PieChartOutflow";
import PieChartInflow from "../../Assets/Datagathering/Graph/PieChartInflow";
import TotalSavings from "../../Assets/Datagathering/Graph/TotalSavings";
import TotalSavingss from "../../Assets/Datagathering/Graph/TotalSavingss";
import TotalInvestable from "../../Assets/Datagathering/Graph/TotalInvestable";
import TotalInvestablee from "../../Assets/Datagathering/Graph/TotalInvestablee";
import Scorecard from "../../Assets/Datagathering/Graph/Scorecard";
import DatagatherReportLayout from "../../components/Layout/Datagather/Reports";
import { DATA_BELONGS_TO, imagePath, userManagementEndpoints } from "../../constants";
import apiClient from "../../FrappeIntegration-Services/services/apiClient";
import {
  getUserId,
  loginRedirectGuest,
  rsFilter,
  makePositive,
  formatPrice,
  setBackgroundDivImage,
} from "../../common_utilities";
import {
  get_score_card,
} from "../../FrappeIntegration-Services/services/financial-planning-api/rp_yourprofile.js";
import { Link } from "react-router-dom";
import Daughter from "../../Assets/Datagathering/FamilyIcons/daughter.svg";
import Son from "../../Assets/Datagathering/FamilyIcons/son.svg";
import Spouse from "../../Assets/Datagathering/FamilyIcons/spouse.svg";
import Mother from "../../Assets/Datagathering/FamilyIcons/mother.svg";
import Father from "../../Assets/Datagathering/FamilyIcons/father.svg";
import HUF from "../../Assets/Datagathering/FamilyIcons/HUF.svg";
import { ScrollToTop } from "./ScrollToTop"
import FintooLoader from "../../components/FintooLoader";
import * as toastr from "toastr";
import "toastr/build/toastr.css";

// Configure toastr once
toastr.options.positionClass = "toast-bottom-left";
import { GetAdvisoryRiskAppetite } from "../../FrappeIntegration-Services/services/financial-planning-api/dgreport.js";
import { calculateAge, formatApiValue } from "../../Utils/Date/DateFormat.js";
import { GETCASH_IN_OUT_FLOW, GETSURPLUSDATA } from "../../FrappeIntegration-Services/services/financial-planning-api/reports/your-profile.js";

const YourProfile = () => {
  const [tab, setTab] = useState("tab1");
  const [tab123, setTab123] = useState("tab5");
  const [tab1232, setTab1232] = useState("tab7");
  const [isOpen, setIsOpen] = useState(false);
  const [dob, setDob] = useState(null);
  const handleTrigger = () => setIsOpen(!isOpen);
  const [user_details, setUserDetails] = useState({});
  const [session, setSession] = useState("");
  const [earning_members, setEarningMembers] = useState([]);
  const [dependent_members, setDependentMembers] = useState([]);
  const [riskProfile, setRiskProfile] = useState("");
  const [riskProfileDesc, setRiskProfileDesc] = useState("");
  const [riskProfileImage, setRiskProfileImage] = useState("");
  const [riskIndicator, setRiskIndicator] = useState("");
  const [memberData, setMemberData] = useState([]);

  const [riskPyramid, setRiskPyramid] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aboutScreenMsg, setAboutScreenMsg] = useState("");
  const [scoreScreenMsg, setScoreScreenMsg] = useState("");
  const [savingMarks, setSavingMarks] = useState("");
  const [savingRatio, setSavingRatio] = useState("");
  const [savingData, setSavingData] = useState("");
  const [incomeExpenseData, setIncomeExpenseData] = useState([]);
  const [netLiquidData, setNetLiquidData] = useState([]);
  const [solvencyData, setSolvencyData] = useState([]);
  const [scoreData, setScoreData] = useState([]);
  const [scoreNameColor, setScoreNameColor] = useState("");

  const [totalGrossInflowData, setTotalGrossInflowData] = useState([]);
  const [totalGrossOutflowData, setTotalGrossOutflowData] = useState([]);
  const [totalSavingData, setTotalSavingData] = useState([]);
  const [surplusShortfallData, setSurplusShortfallData] = useState([]);
  const [investmentInsuranceData, setInvestmentInsuranceData] = useState([]);
  const [insuranceData, setInsuranceData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [rpDataIncome, setRpdataIncomeData] = useState([]);
  const [interestIncome, setInterestIncome] = useState([]);
  const [rpDataIncomeTotal, setRpdataIncomeDataTotal] = useState([]);
  const [mandatoryFixedData, setMandatoryFixedData] = useState([]);
  const [mandatoryVariableData, setMandatoryVariableData] = useState([]);
  const [wishfulFixedData, setWishfulFixedData] = useState([]);
  const [wishfulVariableData, setWishfulVariableData] = useState([]);
  const [grossOutflowTotal, setGrossOutflowTotal] = useState([]);
  const [grossInflowGraphData, setGrossInflowGraphData] = useState([]);
  const [grossOutflowGraphData, setGrossOutflowGraphData] = useState([]);
  const [currentTotalSavings, setCurrentTotalSavings] = useState([]);
  const [nextYearTotalSavings, setNextYearTotalSavings] = useState([]);

  const [currentTotalInvestable, setCurrentTotalInvestable] = useState([]);
  const [nextYearTotalInvestable, setNextYearTotalInvestable] = useState([]);
  const [inoutSectionData, setInoutSectionData] = useState("");
  const [outflowSectionData, setOutflowSectionData] = useState("");
  const [fintooNotes, setFintooNotes] = useState("");
  const [fintooNotes1, setFintooNotes1] = useState("");
  const [pSurplusSectionData, setPSurplusSectionData] = useState([]);
  useEffect(() => {
    document.body.classList.add("dg-layout");
    document.body.classList.add("rp-layout");

    const interval = setInterval(() => {
      const reportProfile = document.getElementById("report-bg-profile");
      if (reportProfile) {
        reportProfile.style.background = `url(${imagePath}/static/media/DG/reports/ill-your-profile.svg) no-repeat right top`;
        clearInterval(interval);

        // Call API or data fetch only after element is found (optional)
        getYourProfileDetails();

        setBackgroundDivImage();
      }
    }, 50);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("dg-layout");
      document.body.classList.remove("rp-layout");
    };
  }, []);


  const getYourProfileDetails = async () => {
    getScoreCardData();
    getrpinoutflow();
    getProfileData();
    getRiskAppetiteData();
    getsurplusdata();
  };


  const formatLocPrice = (value) => {
    let isNeg = 0;

    if (value < 0) {
      isNeg = 1;
    }

    let price = "";
    const v = Math.abs(value);

    if (v) {
      price = formatPrice(v);
      price = price.replace(/.00/, "");
      const new_p = isNeg ? formatNegative(price) : price;
      const amt = new_p.replace("₹ ", "₹");

      const new_val = amt
        .replace("K", " K")
        .replace("Cr.", " Cr")
        .replace("L", " Lac");
      return new_val;
    } else {
      let amt = formatPrice(v).replace(/.00/, "").replace("₹ ", "₹");
      return amt;
    }
  };

  const formatNegative = (v) => {
    const formattedValue = v.replace("₹ ", "₹ (");
    switch (true) {
      case formattedValue.indexOf("Cr.") > -1:
        return formattedValue.replace("Cr.", ")Cr.");
      case formattedValue.indexOf("L") > -1:
        return formattedValue.replace("L", ")L");
      case formattedValue.indexOf("K") > -1:
        return formattedValue.replace("K", ")K");
      default:
        return formattedValue + ")";
    }
  };

  const remove_tag = (text) => {
    return text.replace(/<\/?p[^>]*>/g, "");
  };

  const getProfileData = async () => {
    try {
      setIsLoading(true);
      setAboutScreenMsg("Let us start by reviewing the details that you have shared about yourself and your family as this lays the groundwork for your financial plan.");

      await getUserProfileData();
      await getFamilyMembersData();

    } catch (error) {
      console.error("Error in getProfileData:", error);
      toastr.error("Something went wrong while fetching profile details");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfileData = async () => {
    try {
      const user_id = getUserId();

      if (!user_id) {
        console.error("No user ID found for profile data");
        toastr.error("User ID not found. Please login again.");
        loginRedirectGuest();
        return;
      }

      const data = await apiClient(`${userManagementEndpoints.FETCH_USER_PROFILE_DETAILS}?user_id=${user_id}&data_belongs_to=${DATA_BELONGS_TO}`, {
        method: 'GET'
      });

      if (data.status_code == 200 && data.data) {

        const user_data = {
          first_name: formatApiValue(data.data.first_name || data.data.user_name),
          last_name: formatApiValue(data.data.last_name) || "-",
          pan_number: formatApiValue(data.data.user_pan || data.data.pan),
          age: data.data.user_dob ? calculateAge(data.data.user_dob) : "-",
          mobile_number: formatApiValue(data.data.mobile),
          retirement_age: formatApiValue(data.data.user_retirement_age),
          email_address: formatApiValue(data.data.email_address || data.data.user_email),
          life_expectancy: formatApiValue(data.data.user_life_expectancy),
          family_member: "-",
          num_of_dependents: "-",
        };

        setUserDetails(user_data);

      } else {
        console.error("User Profile API Error:", data.message || "Failed to fetch user profile");
        toastr.error(data.message || "Failed to fetch user profile");
        setUserDetails({});
      }

    } catch (error) {
      console.error("Error fetching user profile:", error);

      // Handle different types of errors
      if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        toastr.error("Network error: Unable to connect to the server. Please check your internet connection.");
      } else if (error.status === 401) {
        toastr.error("Authentication error: Please login again.");
        loginRedirectGuest();
      } else {
        toastr.error("Something went wrong while fetching user profile");
      }

      setUserDetails({});
    }
  };

  const getFamilyMembersData = async () => {
    try {
      const user_id = getUserId();

      if (!user_id) {
        console.error("No user ID found");
        toastr.error("User ID not found. Please login again.");
        loginRedirectGuest();
        return;
      }

      const data = await apiClient(`${userManagementEndpoints.GET_FAMILY_MEMBER}?user_id=${user_id}`, {
        method: 'GET'
      });

      if (data.status_code === "200" && data.data) {

        if (!Array.isArray(data.data)) {
          console.error("Invalid data structure - expected array");
          toastr.error("Invalid data structure received from API");
          setUserDetails({});
          setMemberData([]);
          return;
        }

        const familyMembersData = data.data.filter(member =>
          !(member.relation === "Self" && member.user_parent_id === null)
        );

        setUserDetails(prevUserDetails => ({
          ...prevUserDetails,
          family_member: familyMembersData.length > 0 ? familyMembersData.length : "-",
          num_of_dependents: data.data.filter(member => member.is_dependent === true).length || "-",
        }));

        const transformedMembers = familyMembersData.map(member => ({
          user_id: member.user_id,
          first_name: member.user_name ? member.user_name.split(' ')[0] : "-",
          last_name: member.user_name ? member.user_name.split(' ').slice(1).join(' ') || "" : "-",
          relation_name: formatApiValue(member.relation),
          relation_id: formatApiValue(member.relation_id),
          age: calculateAge(member.dob),
          gender: formatApiValue(member.gender),
          mobile_number: formatApiValue(member.mobile_number),
          pan_number: formatApiValue(member.pan),
          retirement_age: formatApiValue(member.retirement_age),
          life_expectancy: formatApiValue(member.life_expectancy_age),
          dob: formatApiValue(member.dob),
          occupation: formatApiValue(member.occupation),
          occupation_id: formatApiValue(member.occupation_id),
          is_minor: member.is_minor,
          isdependent: member.is_dependent ? "1" : "0",
        }));

        setMemberData(transformedMembers);
        getFamilyData(transformedMembers);

      } else {
        console.error("Family Members API Error:", data.message || "Failed to fetch family members");
        toastr.error(data.message || "Failed to fetch family members");
        setUserDetails({});
        setMemberData([]);
      }
    } catch (error) {
      console.error("Error fetching family members:", error);

      // Handle different types of errors
      if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        toastr.error("Network error: Unable to connect to the server. Please check your internet connection.");
      } else if (error.status === 401) {
        toastr.error("Authentication error: Please login again.");
        loginRedirectGuest();
      } else {
        toastr.error("Something went wrong while fetching family members");
      }

      setUserDetails({});
      setMemberData([]);
    }
  };

  const getFamilyData = (member_data) => {
    // Clear existing arrays and start fresh
    const earning_member_tmp = [];
    const dependent_members_tmp = [];

    member_data.forEach((member) => {
      if (member.isdependent == "1") {
        dependent_members_tmp.push(member);
      } else {
        earning_member_tmp.push(member);
      }
    });

    setEarningMembers(earning_member_tmp);
    setDependentMembers(dependent_members_tmp);
  };

  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');

  const getRiskAppetiteData = async () => {
    try {
      const payload = {
        user_id: user_data.user_id,
        data_belongs_to: DATA_BELONGS_TO

      }

      const decoded_res = await GetAdvisoryRiskAppetite(payload.user_id, payload.data_belongs_to);

      if (decoded_res.status_code == "200") {
        const res_data = decoded_res.data;

        const risk_profile = res_data.user_risk_appetite;
        const gender = res_data.user_gender?.toLowerCase();

        setRiskProfileDesc(res_data.risk_appetite_profile_description);
        setRiskProfile(risk_profile);

        // Optionally update description and image if still used
        const profileDescriptions = {
          "Highly Conservative": {
            indicator: "7%",
            image: "assets/img/reports/your-profile/05_pyramid_Highly_Conservative.png"
          },
          "Conservative": {
            indicator: "27%",
            image: "assets/img/reports/your-profile/04_pyramid_Conservative.png"
          },
          "Moderate": {
            indicator: "47%",
            image: "assets/img/reports/your-profile/03_pyramid_Moderate.png"
          },
          "Aggressive": {
            indicator: "67%",
            image: "assets/img/reports/your-profile/02_pyramid_Aggressive.png"
          },
          "Highly Aggressive": {
            indicator: "87%",
            image: "assets/img/reports/your-profile/01_pyramid_Highly_Aggressive.png"
          }
        };

        const profile = profileDescriptions[risk_profile];
        if (profile) {
          setRiskIndicator(profile.indicator);
          setRiskPyramid(profile.image);
        }


        // Optional gender-specific image logic if required
        if (gender === "male" || gender === "other") {
          setRiskProfileImage('avatar-05.svg' || '');
        } else if (gender === "female") {
          setRiskProfileImage('avatar-10.svg' || '');
        }

      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(decoded_res.message);

      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const currentYear = new Date().getFullYear();

  const getScoreCardData = async () => {
    try {
      const user_id = getUserId();
      if (!user_id) {
        console.error("No user ID found for score card data");
        return;
      }
      const decoded_res = await get_score_card(user_id);
      if (decoded_res.status_code == "200") {
        const temp_income_expense = {
          saving_ratio: decoded_res["data"]["ratio"]["saving_ratio"],
          saving_marks: decoded_res["data"]["marks"]["saving_marks"],
          saving_data: decoded_res["data"]["marks"]["saving_data"],
          ideal_saving_ratio: decoded_res["data"]["ideal_saving_ratio"],

          expense_ratio: decoded_res["data"]["ratio"]["expense_ratio"],
          expense_marks: decoded_res["data"]["marks"]["expense_mark"],
          expense_data: decoded_res["data"]["marks"]["expense_data"],
          ideal_expense_ratio: decoded_res["data"]["ideal_expense_ratio"],

          annual_income: decoded_res["data"]["annual_income"],
          annual_expense: decoded_res["data"]["annual_expense"],
        };

        setIncomeExpenseData(temp_income_expense);

        const temp_net_liquid_data = {
          networth_mark: decoded_res["data"]["marks"]["networth_mark"],
          networth_data: decoded_res["data"]["marks"]["networth_data"],
          networth_ratio: decoded_res["data"]["ratio"]["networth_ratio"],
          ideal_networth: decoded_res["data"]["ideal_networth"],

          total_asset: decoded_res["data"]["total_asset"],
          total_liability: decoded_res["data"]["total_liability"],
          total_liquid: decoded_res["data"]["total_liquid"],
          monthly_expense: decoded_res["data"]["monthly_expense"],

          liquidity_ratio: decoded_res["data"]["ratio"]["liquidity_ratio"],
          liquidity_mark: decoded_res["data"]["marks"]["liquidity_mark"],
          liquidity_data: decoded_res["data"]["marks"]["liquidity_data"],
          ideal_liquid_months: decoded_res["data"]["ideal_liquid_months"],
        };
        setNetLiquidData(temp_net_liquid_data);

        setScoreScreenMsg(decoded_res["data"]["screen_header"]);

        const saving_ratio = decoded_res["data"]["ratio"]["saving_ratio"];
        const saving_marks = decoded_res["data"]["marks"]["saving_marks"];
        setSavingRatio(saving_ratio);
        setSavingMarks(saving_marks);
        setSavingData(decoded_res["data"]["marks"]["saving_data"]);

        const tmp_solvency_data = {
          solvency_mark: decoded_res["data"]["marks"]["solvency_mark"],
          solvency_data: decoded_res["data"]["marks"]["solvency_data"],
          solvency_ratio: decoded_res["data"]["ratio"]["solvency_ratio"],
          ideal_solvency_ratio:
            100 - decoded_res["data"]["ratio"]["solvency_ratio"],
        };
        setSolvencyData(tmp_solvency_data);

        let tmp_score_data = {
          total_score: decoded_res["data"]["total_score"],
          total_score_name: decoded_res["data"]["total_score_name"],
          fintoo_saving_recomm: decoded_res["data"]["fintoo_saving_recomm"],
          fintoo_expense_recomm: decoded_res["data"]["fintoo_expense_recomm"],
          fintoo_liquid_recomm: decoded_res["data"]["fintoo_liquid_recomm"],
          fintoo_networth_recomm: decoded_res["data"]["fintoo_networth_recomm"],
          fintoo_solvency_recomm: decoded_res["data"]["fintoo_solvency_recomm"],
          total_score_desc: decoded_res["data"]["total_score_desc"],
        };

        let diff =
          temp_income_expense.ideal_saving_ratio -
          temp_income_expense.saving_ratio;
        let diff_exp =
          temp_income_expense.ideal_expense_ratio -
          temp_income_expense.expense_ratio;

        let income_current_ratio =
          temp_income_expense.saving_ratio >= 0
            ? temp_income_expense.saving_ratio
            : "(" +
            makePositive(
              temp_income_expense.saving_ratio
                ? temp_income_expense.saving_ratio
                : ""
            ) +
            ")";
        let income_diff_ratio =
          diff >= 0 ? diff : "(" + makePositive(diff) + ")";
        let expense_current_ratio =
          temp_income_expense.expense_ratio >= 0
            ? temp_income_expense.expense_ratio
            : "(" +
            makePositive(
              temp_income_expense.expense_ratio
                ? temp_income_expense.expense_ratio
                : ""
            ) +
            ")";
        var exp_diff_ratio =
          diff_exp >= 0 ? diff_exp : "(" + makePositive(diff_exp) + ")";

        tmp_score_data.fintoo_saving_recomm =
          tmp_score_data.fintoo_saving_recomm.replace(
            "current_ratio",
            income_current_ratio
          );
        tmp_score_data.fintoo_saving_recomm =
          tmp_score_data.fintoo_saving_recomm.replace(
            "ideal_ratio",
            temp_income_expense.ideal_saving_ratio
          );
        tmp_score_data.fintoo_saving_recomm =
          tmp_score_data.fintoo_saving_recomm.replace(
            "diff_ratio",
            income_diff_ratio
          );

        tmp_score_data.fintoo_expense_recomm =
          tmp_score_data.fintoo_expense_recomm.replace(
            "current_ratio",
            expense_current_ratio
          );
        tmp_score_data.fintoo_expense_recomm =
          tmp_score_data.fintoo_expense_recomm.replace(
            "ideal_ratio",
            temp_income_expense.ideal_expense_ratio
          );
        tmp_score_data.fintoo_expense_recomm =
          tmp_score_data.fintoo_expense_recomm.replace(
            /diff_ratio/g,
            exp_diff_ratio
          );

        tmp_score_data.fintoo_solvency_recomm =
          tmp_score_data.fintoo_solvency_recomm.replace(
            "solvency_ratio",
            tmp_solvency_data.ideal_solvency_ratio
          );

        if (decoded_res.data["total_score"] <= 20) {
          tmp_score_data.gauge_needle = "10";
        } else if (
          decoded_res.data["total_score"] > 20 &&
          decoded_res.data["total_score"] <= 40
        ) {
          tmp_score_data.gauge_needle = "30";
        } else if (
          decoded_res.data["total_score"] > 40 &&
          decoded_res.data["total_score"] <= 60
        ) {
          tmp_score_data.gauge_needle = "50";
        } else if (
          decoded_res.data["total_score"] > 60 &&
          decoded_res.data["total_score"] <= 80
        ) {
          tmp_score_data.gauge_needle = "70";
        } else if (decoded_res.data["total_score"] > 80) {
          tmp_score_data.gauge_needle = "90";
        }

        setScoreData(tmp_score_data);

        let score_color_dict = {
          "Not Good": "#f9411f",
          Average: "#f88221",
          Good: "#e1b624",
          "Very Good": "#4faa36",
          Excellent: "#588036",
        };

        setScoreNameColor(
          score_color_dict[decoded_res["data"]["total_score_name"]]
        );

      }
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  const getsurplusdata = async () => {
    try {
      const response = await GETSURPLUSDATA()
      let decoded_res = response;
      if (response.status_code == "200") {
        setPSurplusSectionData(decoded_res.data?.section_text || {});
        setTotalGrossInflowData(
          decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_inflow || {}
        );

        setTotalGrossOutflowData(
          decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_outflow || {}
        );

        setTotalSavingData(
          decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving || {}
        );
        setSurplusShortfallData(decoded_res["data"]["surplus_shortfall"]);
        setInvestmentInsuranceData(
          decoded_res["data"]["investment_insurance"][0]
        );
        setInsuranceData(
          decoded_res["data"]["investment_insurance"][0]["insurance"]
        );
        setAssetData(
          decoded_res["data"]["investment_insurance"][0]["assets"]
        );

        let type;
        if (decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.annual < 0) {
          type = "Deficit";
        } else {
          type = "Savings";
        }

        if (decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.nextyr_saving < 0) {
          type = "Deficit";
        } else {
          type = "Savings";
        }

        var total_saving_current_year = [];
        var setgraphdata = [];
        if (decoded_res) {
          setgraphdata = [
            {
              name: "Gross Inflow",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_inflow
            },
            {
              name: "Gross Outflow",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_outflow
            },
            {
              name: type,
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.annual,
            },
          ];
        } else {
          setgraphdata = [
            {
              name: "Gross Inflow",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_inflow
            },
            {
              name: "Gross Outflow",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_outflow
            },
            {
              name: type,
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.annual,
            },
          ];
        }
        setgraphdata.map((val) => {
          if (val["total"]) {
            total_saving_current_year.push({
              name: val["name"],
              y: val["total"],
            });
          }
        });
        setCurrentTotalSavings(total_saving_current_year);

        var total_saving_next_year = [];
        var setgraphdata = [];
        if (decoded_res) {
          setgraphdata = [
            {
              name: "Gross Inflow",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_inflow?.total_annual_next_year_income,
            },
            {
              name: "Gross Outflow",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_outflow?.total_nextyr_expense,
            },
            {
              name: type,
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.nextyr_saving,
            },
          ];
        } else {
          setgraphdata = [
            {
              name: "Gross Inflow",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_inflow?.total_annual_next_year_income,
            },
            {
              name: "Gross Outflow",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_gross_outflow?.total_nextyr_expense,
            },
            {
              name: type,
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.nextyr_saving,
            },
          ];
        }
        setgraphdata.map((val) => {
          if (val["total"]) {
            total_saving_next_year.push({ name: val["name"], y: val["total"] });
          }
        });
        setNextYearTotalSavings(total_saving_next_year);

        if (decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.annual < 0) {
          type = "Total Investable Shortfall";
        } else {
          type = "Total Investable Surplus";
        }

        var total_investable_current_year = [];
        var setgraphdata = [];
        if (decoded_res) {
          setgraphdata = [
            {
              name: "Total Savings",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.nextyr_saving,
            },
            {
              name: "Existing Insurance & Investment Commitment",
              total:
                decoded_res.data?.investment_insurance?.[0]?.total_nxtyearly,
            },
            {
              name: type,
              total:
                decoded_res.data?.surplus_shortfall?.next_yearly,
            },
          ];
        } else {
          setgraphdata = [
            {
              name: "Total Savings",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.nextyr_saving,
            },
            {
              name: "Existing Insurance & Investment Commitment",
              total:
                decoded_res.data?.investment_insurance?.[0]?.total_nxtyearly,
            },
            {
              name: type,
              total:
                decoded_res.data?.surplus_shortfall?.next_yearly,
            },
          ];
        }
        setgraphdata.map((val) => {
          if (val["total"]) {
            total_investable_current_year.push({
              name: val["name"],
              y: val["total"],
            });
          }
        });
        setNextYearTotalInvestable(total_investable_current_year);

        var total_investable_next_year = [];
        var setgraphdata = [];
        if (decoded_res) {
          setgraphdata = [
            {
              name: "Total Savings",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.annual,
            },
            {
              name: "Existing Insurance & Investment Commitment",
              total:
                decoded_res.data?.investment_insurance?.[0]?.total_yearly,
            },
            {
              name: type,
              total: decoded_res.data?.surplus_shortfall?.annual,
            },
          ];
        } else {
          setgraphdata = [
            {
              name: "Total Savings",
              total:
                decoded_res.data?.total_savings?.[0]?.total_savings?.total_saving?.annual,
            },
            {
              name: "Existing Insurance & Investment Commitment",
              total:
                decoded_res.data?.investment_insurance?.[0]?.total_yearly,
            },
            {
              name: type,
              total: decoded_res.data?.surplus_shortfall?.annual,
            },
          ];
        }
        setgraphdata.map((val) => {
          if (val["total"]) {
            total_investable_next_year.push({
              name: val["name"],
              y: val["total"],
            });
          }
        });
        setCurrentTotalInvestable(total_investable_next_year);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const getrpinoutflow = async () => {
    try {
      const response = await GETCASH_IN_OUT_FLOW()
      let decoded_res = response;
      if (response.status_code == "200") {
        setInoutSectionData(decoded_res.data[3].section_text['field0']);
        setOutflowSectionData(decoded_res.data[3].section_text['field1']);
        setFintooNotes(decoded_res.data[3].section_text['field5']);
        if (decoded_res.data[3].section_text['fintoo_recomm_text']) {
          setFintooNotes1(decoded_res.data[3].section_text['fintoo_recomm_text']['grossinout']);
        }
        else {
          setFintooNotes1("");
        }

        const filteredArray = decoded_res["data"][0]["rpdata_income"][
          "data"
        ].filter((v) => v.annual_income + v.annual_next_year_income > 0);
        setRpdataIncomeData(filteredArray);

        setInterestIncome(
          decoded_res["data"][0]["rpdata_income"]["interest_data"]
        );
        setRpdataIncomeDataTotal(
          decoded_res["data"][0]["rpdata_income"]["total"]
        );
        setMandatoryFixedData(
          decoded_res["data"][1]["rp_expense"]["mandatory_fixed"]["data"]
        );
        setMandatoryVariableData(
          decoded_res["data"][1]["rp_expense"]["mandatory_variable"]["data"]
        );
        setWishfulFixedData(
          decoded_res["data"][1]["rp_expense"]["wishful_fixed"]["data"]
        );
        setWishfulVariableData(
          decoded_res["data"][1]["rp_expense"]["wishful_variable"]["data"]
        );
        setGrossOutflowTotal(decoded_res["data"][1]["rp_expense"]);
        var gross_inflow_graph_data = [];
        var setgraphdata = [];
        if (decoded_res) {
          setgraphdata = [
            {
              name: "Variable Income",
              total:
                decoded_res["data"][0]["rpdata_income"]["income_type"][0][
                "graph_total"
                ],
              totoverall_piechart_income:
                decoded_res["data"][0]["rpdata_income"]["total"][
                "overall_piechart_income"
                ],
            },
            {
              name: "Fixed Income",
              total:
                decoded_res["data"][0]["rpdata_income"]["income_type"][1][
                "graph_total"
                ],
              totoverall_piechart_income:
                decoded_res["data"][0]["rpdata_income"]["total"][
                "overall_piechart_income"
                ],
            },
          ];
        } else {
          setgraphdata = [
            {
              name: "Variable Income",
              total:
                decoded_res["data"][0]["rpdata_income"]["income_type"][0][
                "graph_total"
                ],
            },
            {
              name: "Fixed Income",
              total:
                decoded_res["data"][0]["rpdata_income"]["income_type"][1][
                "graph_total"
                ],
            },
            {
              totoverall_piechart_income:
                decoded_res["data"][0]["rpdata_income"]["total"][
                "overall_piechart_income"
                ],
            },
          ];
        }
        setgraphdata.map((val) => {
          if (val["total"]) {
            gross_inflow_graph_data.push({
              name: val["name"],
              value: val["total"],
              total: val["totoverall_piechart_income"],
            });
          }
        });
        setGrossInflowGraphData(gross_inflow_graph_data);

        var gross_outflow_graph_data = [];
        var setgraphdata = [];
        if (decoded_res) {
          setgraphdata = [
            {
              name: "Mandatory Fixed",
              total:
                decoded_res["data"][1]["rp_expense"]["mandatory_fixed"]["total"][
                "avg_percent"
                ],
            },
            {
              name: "Mandatory Variable",
              total:
                decoded_res["data"][1]["rp_expense"]["mandatory_variable"][
                "total"
                ]["avg_percent"],
            },
            {
              name: "Wishful Fixed",
              total:
                decoded_res["data"][1]["rp_expense"]["wishful_fixed"]["total"][
                "avg_percent"
                ],
            },
            {
              name: "Wishful Variable",
              total:
                decoded_res["data"][1]["rp_expense"]["wishful_variable"]["total"][
                "avg_percent"
                ],
            },
          ];
        } else {
          setgraphdata = [
            {
              name: "Mandatory Fixed",
              total:
                decoded_res["data"][1]["rp_expense"]["mandatory_fixed"]["total"][
                "avg_percent"
                ],
            },
            {
              name: "Mandatory Variable",
              total:
                decoded_res["data"][1]["rp_expense"]["mandatory_variable"][
                "total"
                ]["avg_percent"],
            },
            {
              name: "Wishful Fixed",
              total:
                decoded_res["data"][1]["rp_expense"]["wishful_fixed"]["total"][
                "avg_percent"
                ],
            },
            {
              name: "Wishful Variable",
              total:
                decoded_res["data"][1]["rp_expense"]["wishful_variable"]["total"][
                "avg_percent"
                ],
            },
          ];
        }
        setgraphdata.map((val) => {
          if (val["total"]) {
            gross_outflow_graph_data.push({
              name: val["name"],
              value: val["total"],
            });
          }
        });
        setGrossOutflowGraphData(gross_outflow_graph_data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

 


  return (
    <DatagatherReportLayout>
      <FintooLoader isLoading={isLoading} />

      <div className="reports ">
        <div className="">
          <div className="background-div">
            <div class="bg active" id="report-bg-profile"></div>
          </div>
          <div className="white-box">
            <div className="d-flex justify-content-md-center tab-box">
              <div className="d-flex top-tab-menu noselect">
                <div
                  className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                  onClick={() => setTab("tab1")}
                >
                  <div className="tab-menu-title">ABOUT YOU</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                  onClick={() => setTab("tab2")}
                >
                  <div className="tab-menu-title">RISK APPETITE</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab3" ? "active" : ""}`}
                  onClick={() => setTab("tab3")}
                >
                  <div className="tab-menu-title">CASHFLOW</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab4" ? "active" : ""}`}
                  onClick={() => setTab("tab4")}
                >
                  <div className="tab-menu-title">SCORECARD</div>
                </div>
              </div>
            </div>

            <div>
              <div className={tab == "tab1" ? "d-block" : "d-none"}>
                <div className="tabs innerTabs subTabWrapper">
                  <ul
                    className="nav nav-buttons nav-secoandary d-inline-flex"
                    id="intro-appendix"
                  >
                    <li
                      className={`tab-menu-item ${tab123 == "tab5" ? "active" : ""
                        }`}
                    >
                      <a href onClick={() => setTab123("tab5")}>
                        About You
                      </a>
                    </li>

                    <li
                      className={`tab-menu-item ${tab123 == "tab6" ? "active" : ""
                        }`}
                    >
                      <a href onClick={() => setTab123("tab6")}>
                        About Your Family
                      </a>
                    </li>
                  </ul>
                  <div>
                    <div className={tab123 == "tab5" ? "d-block" : "d-none"}>
                      {Object.keys(user_details).length > 0 && (
                        <div>
                          <h4 className="rTitle __web-inspector-hide-shortcut__">
                            <img
                              alt=""
                              src={
                                imagePath +
                                "/static/media/DG/reports/your-profile/about-you.svg"
                              }
                            />
                            About You
                          </h4>
                          <div className="profileHolderBox" id="step1">
                            { }
                            <div className="" id="about-you-screen-msg">
                              <p class="mb-4 text-center">{aboutScreenMsg}</p>
                            </div>
                            <div className="row justify-content-center about-info">
                              <div className="col-md-4">
                                <ul className="about-you-list">
                                  <li>
                                    <div className="icon-box">
                                      <img
                                        alt=""
                                        src={
                                          imagePath +
                                          "/static/media/DG/reports/your-profile/name.svg"
                                        }
                                      />
                                      <div className="YourDataLabel">Name</div>
                                      { }
                                      <div className="">
                                        {user_details.first_name === "-" && user_details.last_name === "-"
                                          ? "-"
                                          : `${user_details.first_name !== "-" ? user_details.first_name : ""} ${user_details.last_name !== "-" ? user_details.last_name : ""}`.trim()
                                        }
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="icon-box">
                                      <img
                                        alt=""
                                        src={
                                          imagePath +
                                          "/static/media/DG/reports/your-profile/mobile-number.svg"
                                        }
                                      />
                                      <div className="YourDataLabel">
                                        Mobile Number
                                      </div>
                                      { }
                                      <div className="">
                                        {user_details.mobile_number}
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="icon-box">
                                      <img
                                        alt=""
                                        src={
                                          imagePath +
                                          "/static/media/DG/reports/your-profile/email.svg"
                                        }
                                      />
                                      <div className="YourDataLabel">
                                        Email Address
                                      </div>
                                      <div style={{ wordBreak: "break-all" }}>
                                        { }
                                        <a
                                          href="javascript:void(0)"
                                          className=""
                                        >
                                          {user_details.email_address}
                                        </a>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-md-4">
                                <ul className="about-you-list">
                                  <li>
                                    <div className="icon-box">
                                      <img
                                        alt=""
                                        src={
                                          imagePath +
                                          "/static/media/DG/reports/your-profile/pan-number.svg"
                                        }
                                      />
                                      <div className="YourDataLabel">PAN</div>
                                      { }
                                      <div className="">
                                        {user_details.pan_number}
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="icon-box">
                                      <img
                                        alt=""
                                        src={
                                          imagePath +
                                          "/static/media/DG/reports/your-profile/family.svg"
                                        }
                                      />
                                      <div className="YourDataLabel">
                                        Family Member
                                      </div>
                                      <div className="">
                                        {user_details.family_member}
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="icon-box">
                                      <img
                                        alt=""
                                        src={
                                          imagePath +
                                          "/static/media/DG/reports/your-profile/dependent.svg"
                                        }
                                      />
                                      <div className="YourDataLabel">
                                        No. of Dependents
                                      </div>
                                      { }
                                      <div className="">
                                        {user_details.num_of_dependents}
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-md-4">
                                <ul className="about-you-list">
                                  <li>
                                    <div className="icon-box">
                                      <img
                                        alt=""
                                        src={
                                          imagePath +
                                          "/static/media/DG/reports/your-profile/dob.svg"
                                        }
                                      />
                                      <div className="YourDataLabel">Age</div>
                                      { }
                                      <div className="">{user_details.age}</div>
                                    </div>
                                  </li>

                                  <li>
                                    <div className="icon-box">
                                      <img
                                        alt=""
                                        src={
                                          imagePath +
                                          "/static/media/DG/reports/your-profile/retirement-age.svg"
                                        }
                                      />
                                      <div className="YourDataLabel">
                                        Retirement Age
                                      </div>
                                      { }
                                      <div className="">
                                        {user_details.retirement_age}
                                      </div>
                                    </div>
                                  </li>

                                  <li>
                                    <div className="icon-box">
                                      <img
                                        alt=""
                                        src={
                                          imagePath +
                                          "/static/media/DG/reports/your-profile/life-expectency.svg"
                                        }
                                      />
                                      <div className="YourDataLabel">
                                        Life Expectancy
                                      </div>
                                      { }
                                      <div className="">
                                        {user_details.life_expectancy}
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            { }
                            { }
                          </div>
                        </div>
                      )}

                      {Object.keys(user_details).length == 0 && (
                        <div className="no-data-found text-center">
                          <div className="container">
                            <div className="row justify-content-center align-items-center">
                              <div className="col-md-10">
                                <img
                                  src={
                                    imagePath +
                                    "/static/media/DG/data-not-found.svg"
                                  }
                                  alt="Data not found"
                                ></img>

                                { }
                                <p>
                                  Since you missed to fill in the required
                                  information which is needed here, we are not
                                  able to show you this section. Kindly click on
                                  below button to provide all the necessary
                                  inputs. Providing all the information as asked
                                  will ensure more accurate financial planning
                                  report. Once you fill in the data, same will
                                  be reflected here.
                                </p>

                                <a
                                  href={
                                    process.env.PUBLIC_URL +
                                    "/datagathering/about-you"
                                  }
                                  target="_blank"
                                  className="link"
                                >
                                  Complete Profile
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="row py-2">
                        <div className=" text-center">
                          <div>
                            <div className="btn-container fixedBtn">
                              <div className="d-flex justify-content-center">
                                <Link
                                  to={process.env.PUBLIC_URL + "/report/intro/"}
                                >
                                  <div className="previous-btn form-arrow d-flex align-items-center">
                                    <FaArrowLeft />
                                    <span
                                      className="hover-text"
                                      style={{ maxWidth: 100 }}
                                    >
                                      &nbsp;Previous
                                    </span>
                                  </div>
                                </Link>
                                { }
                                { }
                                <div
                                  className="next-btn form-arrow d-flex align-items-center"
                                  onClick={() => {
                                    ScrollToTop();
                                    setTab123("tab6")
                                  }
                                  }
                                >
                                  <span
                                    className="hover-text"
                                    style={{ maxWidth: 100 }}
                                  >
                                    Next&nbsp;
                                  </span>
                                  <FaArrowRight />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={tab123 == "tab6" ? "d-block" : "d-none"}>
                      <div className="">
                        {memberData?.length > 0 && (
                          <>
                            <h4 className="rTitle">
                              <img
                                alt=""
                                src={
                                  imagePath +
                                  "/static/media/DG/reports/your-profile/about-your-family.svg"
                                }
                              />
                              About Your Family
                            </h4>
                            <div className="member-container">
                              <p className="rTitle">Members</p>

                              <div className="row">
                                {earning_members.map((member) => (
                                  <>
                                    { }
                                    <div className="col-md-4 ">
                                      <div className="memeber-box  earnings-memeber-box">
                                        <span className="relation ">
                                          <img
                                            className="pe-2"
                                            src={
                                              member.relation_name == "Spouse"
                                                ? Spouse
                                                : member.relation_name ==
                                                  "Daughter"
                                                  ? Daughter
                                                  : member.relation_name ==
                                                    "Father"
                                                    ? Father
                                                    : member.relation_name ==
                                                      "Mother"
                                                      ? Mother
                                                      : member.relation_name == "Son"
                                                        ? Son
                                                        : member.relation_name ==
                                                          "Hindu Undivided Family"
                                                          ? HUF
                                                          : ""
                                            }
                                            style={{
                                              height: "20px",
                                              width: "auto",
                                            }}
                                          />
                                          <span>{member.relation_name}</span>
                                        </span>
                                        <div
                                          className="pt-3 FamilyLabel"
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {member.first_name} {member.last_name}
                                        </div>
                                        <div
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                          className="pt-2"
                                        >
                                          {member.age}, {member.gender}
                                        </div>
                                        <hr />
                                        <ul className="about-you-list row aboutmember-earnings">
                                          {/* Only show Retirement Age and Life Expectancy for earning members (non-dependent) */}
                                          {member.isdependent === "0" && (
                                            <>
                                              <div className="comm-pad-cls col-md-6">
                                                <li>
                                                  <div className="icon-box">
                                                    <img
                                                      alt=""
                                                      src={
                                                        imagePath +
                                                        "/static/media/DG/reports/your-profile/retirement-age.svg"
                                                      }
                                                    />
                                                    <div>Retirement Age</div>
                                                    <div className="">
                                                      {member.retirement_age || member.retirement_age === 0 ? member.retirement_age : "-"}
                                                    </div>
                                                  </div>
                                                </li>
                                              </div>

                                              <div className="comm-pad-cls col-md-6">
                                                <li>
                                                  <div className="icon-box">
                                                    <img
                                                      alt=""
                                                      src={
                                                        imagePath +
                                                        "/static/media/DG/reports/your-profile/life-expectency.svg"
                                                      }
                                                    />
                                                    <div>Life Expectency</div>
                                                    <div className="">
                                                      {member.life_expectancy || member.life_expectancy === 0 ? member.life_expectancy : "-"}
                                                    </div>
                                                  </div>
                                                </li>
                                              </div>
                                            </>
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                    { }
                                  </>
                                ))}

                                {dependent_members.map((member) => (
                                  <>
                                    { }
                                    <div className="col-md-4 ">
                                      <div className="memeber-box dependent-member-box">
                                        <span className="relation ">
                                          <img
                                            className="pe-2"
                                            src={
                                              member.relation_name == "Spouse"
                                                ? Spouse
                                                : member.relation_name ==
                                                  "Daughter"
                                                  ? Daughter
                                                  : member.relation_name ==
                                                    "Father"
                                                    ? Father
                                                    : member.relation_name ==
                                                      "Mother"
                                                      ? Mother
                                                      : member.relation_name == "Son"
                                                        ? Son
                                                        : member.relation_name ==
                                                          "Hindu Undivided Family"
                                                          ? HUF
                                                          : ""
                                            }
                                            style={{
                                              height: "20px",
                                              width: "auto",
                                            }}
                                          />
                                          <span> {member.relation_name} </span>
                                        </span>
                                        <div
                                          className="pt-3 FamilyLabel"
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                        >
                                          {member.first_name} {member.last_name}
                                        </div>
                                        <div
                                          style={{
                                            textTransform: "capitalize",
                                          }}
                                          className="pt-2"
                                        >
                                          {member.age}, {member.gender}
                                        </div>
                                        <hr />
                                        {/* No retirement age or life expectancy for dependent members */}
                                      </div>
                                    </div>
                                    { }
                                  </>
                                ))}
                              </div>

                              <div className="row">
                                { }
                                { }
                                { }

                                { }
                                { }
                                { }
                                { }
                                { }
                                { }
                                { }
                                { }
                                { }
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {memberData?.length == 0 && (
                        <>
                          <div className="no-data-found text-center">
                            <div className="container">
                              <div className="row justify-content-center align-items-center">
                                <div className="col-md-10">
                                  <img
                                    src={
                                      imagePath +
                                      "/static/media/DG/data-not-found.svg"
                                    }
                                    alt="Data not found"
                                  ></img>

                                  { }
                                  <p>
                                    Since you missed to fill in the required
                                    information which is needed here, we are not
                                    able to show you this section. Kindly click
                                    on below button to provide all the necessary
                                    inputs. Providing all the information as
                                    asked will ensure more accurate financial
                                    planning report. Once you fill in the data,
                                    same will be reflected here.
                                  </p>

                                  <a
                                    href={
                                      process.env.PUBLIC_URL +
                                      "/datagathering/about-you"
                                    }
                                    target="_blank"
                                    className="link"
                                  >
                                    Complete Profile
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="row py-2">
                        <div className=" text-center">
                          <div>
                            <div className="btn-container fixedBtn">
                              <div className="d-flex justify-content-center">
                                <div
                                  className="previous-btn form-arrow d-flex align-items-center"
                                  onClick={() => {
                                    ScrollToTop();
                                    setTab123("tab5")
                                  }
                                  }
                                >
                                  <FaArrowLeft />
                                  <span className="hover-text">
                                    &nbsp;Previous
                                  </span>
                                </div>
                                { }
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
                                    Next&nbsp;
                                  </span>
                                  <FaArrowRight />
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
            </div>
            <div className={tab == "tab2" ? "d-block" : "d-none"}>
              <div className="riskAppetiteHolder ">
                { }
                <h4 className="rTitle ">
                  <img
                    alt=""
                    src={
                      imagePath +
                      "/static/media/DG/reports/your-profile/risk-appetite.svg"
                    }
                  />
                  Risk Appetite
                </h4>
                { }
                { }
                <div className="row ">
                  <div className="col-md-2">
                    <div
                      style={{
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <div className="rTitle text-center pb-3">Your Avatar</div>
                      <img
                        alt="risk avatar"
                        className="risk-avatar"
                        src={
                          imagePath +
                          "/static/media/DG/reports/" + riskProfileImage
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="riskAppetiteBox">
                      <span> Risk Profile :</span>
                      <span className="rTitle">
                        {" "}
                        { }
                        {riskProfile}
                      </span>
                      { }
                      <div className="risk-appetite-bar">
                        <ul className="risk-bar">
                          <li className="level1" />
                          <li className="level2" />
                          <li className="level3" />
                          <li className="level4" />
                          <li className="level5" />
                        </ul>
                        {/* <p>{riskIndicator}</p> */}
                        <span
                          className="risk-indicator"
                          // style={{ left: "27%" }}
                          style={{ left: riskIndicator }}
                        />
                      </div>
                      <div className="">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: riskProfileDesc ? riskProfileDesc : "",
                          }}
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="col-md-12 pyramid-cls mt-5">
                    <p>Investment Philosophy</p>
                    <img
                      className="InvestmentPhilosophy"
                      style={{ height: 350 }}
                      alt=""
                      src={"https://static.fintoo.in/static/" + riskPyramid}
                    />
                  </div>
                </div>
                { }
                { }
              </div>
              <div className="row py-2">
                <div className=" text-center">
                  <div>
                    <div className="btn-container fixedBtn">
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
                          <span className="hover-text">&nbsp;Previous</span>
                        </div>
                        { }
                        <div
                          className="next-btn form-arrow d-flex align-items-center"
                          onClick={() => {
                            ScrollToTop();
                            setTab("tab3")
                          }
                          }
                        >
                          <span
                            className="hover-text"
                            style={{ maxWidth: 100 }}
                          >
                            Next&nbsp;
                          </span>
                          <FaArrowRight />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={tab == "tab3" ? "d-block" : "d-none"}>
              <div className="">
                <div className="tabs innerTabs subTabWrapper ">
                  <ul
                    className="nav nav-buttons nav-seconadary d-inline-flex"
                    id="intro-appendix"
                  >
                    <li
                      className={`tab-menu-item ${tab1232 == "tab7" ? "active" : ""
                        }`}
                    >
                      <a href onClick={() => setTab1232("tab7")}>
                        Gross - Inflow &amp; Outflow
                      </a>
                    </li>
                    <li
                      className={`tab-menu-item ${tab1232 == "tab8" ? "active" : ""
                        }`}
                    >
                      <a href onClick={() => setTab1232("tab8")}>
                        Saving - Deficit
                      </a>
                    </li>
                  </ul>
                  { }
                  <div className={tab1232 == "tab7" ? "d-block" : "d-none"}>
                    { }
                    { }
                    <div className="bottom-padding">
                      <h4 className="rTitle">
                        <img
                          alt=""
                          src={
                            imagePath +
                            "/static/media/DG/reports/your-profile/gross-inflow.svg"
                          }
                        />
                        Gross Inflow
                      </h4>
                      <div className="rContent ">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: inoutSectionData ? inoutSectionData : "",
                          }}
                        ></p>
                      </div>
                      <div className="table-responsive rTable">
                        <table className="bgStyleTable">
                          <tbody className="borderRemove">
                            <tr>
                              <th>Category</th>
                              <th>Name of Holder</th>
                              <th>Income Name</th>
                              <th>Frequency</th>
                              <th>Monthly (₹)</th>
                              <th className="">
                                Yearly (₹) (till 31<sup>st</sup> Dec,{" "}
                                {currentYear})
                              </th>
                              {/* <th>Annual (₹) ({currentYear + 1})</th> */}
                            </tr>
                            { }
                            {rpDataIncome.map((inflow, index) => (
                              <tr key={index + 1} className="">
                                <td className="">{inflow.category_name}</td>
                                <td className="">
                                  {/* {inflow.first_name}{" "} */}
                                  {inflow.user_name
                                    ? inflow.user_name
                                    : "Family"}
                                </td>

                                <td className="">
                                  {inflow.user_income_name}
                                </td>
                                <td className="">
                                  {inflow.frequency}
                                </td>
                                <td className="">
                                  {rsFilter(inflow.monthly_income)}
                                </td>
                                <td className="">
                                  {rsFilter(inflow.annual_income)}
                                </td>

                              </tr>
                            ))}

                            {interestIncome.map((inflow, index) => (
                              <tr key={index + 1} className="">
                                <td className="">{inflow.category_name}</td>
                                <td className="">
                                  {/* {inflow.first_name}{" "} */}
                                  {inflow.user_name
                                    ? inflow.user_name
                                    : "Family"}
                                </td>

                                <td className="">
                                  {inflow.interest_name}
                                </td>
                                <td className="">
                                  {inflow.interest_frequency}
                                </td>
                                <td className="">
                                  {rsFilter(inflow.monthly_income)}
                                </td>
                                <td className="">
                                  {rsFilter(inflow.annual_income)}
                                </td>

                              </tr>
                            ))}
                            { }
                            <tr className="bold top-line total-value">
                              <td>Gross inflow</td>
                              <td className="" />
                              <td className="" />
                              <td className="" />
                              <td className="">
                                {rsFilter(
                                  rpDataIncomeTotal.total_monthly_income
                                )}
                              </td>
                              <td className="">
                                {rsFilter(
                                  rpDataIncomeTotal.total_annual_income
                                )}
                              </td>
                              {/* <td className="">
                                {rsFilter(
                                  rpDataIncomeTotal.total_annual_next_year_income
                                )}
                              </td> */}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      { }
                      <br />
                      <br />
                      <h4 className="rTitle">
                        <img
                          alt=""
                          src={
                            imagePath +
                            "/static/media/DG/reports/your-profile/gross-outflow.svg"
                          }
                        />
                        Gross Outflow
                      </h4>
                      <div className="rContent">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: outflowSectionData ? outflowSectionData : "",
                          }}
                        ></p>
                      </div>
                      { }
                      { }
                      <div className="">
                        <div className="table-responsive rTable">
                          <table className="bgStyleTable">
                            <tbody className="borderRemove">
                              <tr>
                                <th>Particular</th>
                                { }
                                <th>Name of Holder</th>
                                <th>Expense Name</th>
                                <th>Frequency</th>
                                <th>Monthly (₹)</th>
                                <th className="">
                                  YTD (₹) (till 31<sup>st</sup> Dec,{" "}
                                  {currentYear})
                                </th>
                                {/* <th className="">
                                  Annual (₹) ({currentYear + 1})
                                </th> */}
                              </tr>

                              {mandatoryFixedData?.length > 0 && (
                                <tr>
                                  <td>
                                    <strong> Mandatory Fixed </strong>
                                  </td>
                                  <td>
                                    { }
                                    {mandatoryFixedData.map(
                                      (mandatory_fixed) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {mandatory_fixed.user_name
                                                  ? mandatory_fixed.user_name
                                                  : "Family"} {" "}
                                                {/* {mandatory_fixed.last_name} */}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {mandatoryFixedData.map(
                                      (mandatory_fixed) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {mandatory_fixed.user_expense_name}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {mandatoryFixedData.map(
                                      (mandatory_fixed) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {mandatory_fixed.frequency}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {mandatoryFixedData.map(
                                      (mandatory_fixed) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {rsFilter(
                                                  mandatory_fixed.monthly_expense
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </td>

                                  <td>
                                    { }
                                    {mandatoryFixedData.map(
                                      (mandatory_fixed) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {rsFilter(
                                                  mandatory_fixed.annual_expense
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </td>

                                  {/* <td>
                                    { }
                                    {mandatoryFixedData.map(
                                      (mandatory_fixed) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {rsFilter(
                                                  mandatory_fixed.annual_next_year_expense
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </td> */}
                                </tr>
                              )}

                              {mandatoryVariableData?.length > 0 && (
                                <tr>
                                  <td>
                                    <strong> Mandatory Variable </strong>
                                  </td>
                                  <td>
                                    { }
                                    {mandatoryVariableData.map(
                                      (mandatory_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {mandatory_variable.user_name
                                                  ? mandatory_variable.user_name
                                                  : "Family"} {" "}
                                                {/* {mandatory_variable.last_name} */}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {mandatoryVariableData.map(
                                      (mandatory_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {
                                                  mandatory_variable.user_expense_name
                                                }
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {mandatoryVariableData.map(
                                      (mandatory_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {mandatory_variable.frequency}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {mandatoryVariableData.map(
                                      (mandatory_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {rsFilter(
                                                  mandatory_variable.monthly_expense
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </td>

                                  <td>
                                    { }
                                    {mandatoryVariableData.map(
                                      (mandatory_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {rsFilter(
                                                  mandatory_variable.annual_expense
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </td>

                                  {/* <td>
                                    { }
                                    {mandatoryVariableData.map(
                                      (mandatory_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {rsFilter(
                                                  mandatory_variable.annual_next_year_expense
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </td> */}
                                </tr>
                              )}

                              {wishfulFixedData?.length > 0 && (
                                <tr>
                                  <td>
                                    <strong> Wishful Fixed </strong>
                                  </td>
                                  <td>
                                    { }
                                    {wishfulFixedData.map((wishful_fixed) => (
                                      <table className="TBData">
                                        <tbody className="Boredernone">
                                          <tr>
                                            <td className="">
                                              {wishful_fixed.first_name
                                                ? wishful_fixed.first_name
                                                : "Family"} {" "}
                                              {wishful_fixed.last_name}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    ))}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {wishfulFixedData.map((wishful_fixed) => (
                                      <table className="TBData">
                                        <tbody className="Boredernone">
                                          <tr>
                                            <td className="">
                                              {wishful_fixed.expenses_name}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    ))}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {wishfulFixedData.map((wishful_fixed) => (
                                      <table className="TBData">
                                        <tbody className="Boredernone">
                                          <tr>
                                            <td className="">
                                              {wishful_fixed.frequency}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    ))}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {wishfulFixedData.map((wishful_fixed) => (
                                      <table className="TBData">
                                        <tbody className="Boredernone">
                                          <tr>
                                            <td className="">
                                              {rsFilter(
                                                wishful_fixed.monthly_expense
                                              )}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    ))}
                                  </td>

                                  <td>
                                    { }
                                    {wishfulFixedData.map((wishful_fixed) => (
                                      <table className="TBData">
                                        <tbody className="Boredernone">
                                          <tr>
                                            <td className="">
                                              {rsFilter(
                                                wishful_fixed.annual_expense
                                              )}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    ))}
                                  </td>

                                  {/* <td>
                                    { }
                                    {wishfulFixedData.map((wishful_fixed) => (
                                      <table className="TBData">
                                        <tbody className="Boredernone">
                                          <tr>
                                            <td className="">
                                              {rsFilter(
                                                wishful_fixed.annual_next_year_expense
                                              )}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    ))}
                                  </td> */}
                                </tr>
                              )}

                              {wishfulVariableData?.length > 0 && (
                                <tr>
                                  <td>
                                    <strong> Wishful Variable </strong>
                                  </td>
                                  <td>
                                    { }
                                    {wishfulVariableData.map(
                                      (wishful_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {wishful_variable.first_name
                                                  ? wishful_variable.first_name
                                                  : "Family"} {" "}
                                                {wishful_variable.last_name}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {wishfulVariableData.map(
                                      (wishful_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {wishful_variable.expenses_name}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {wishfulVariableData.map(
                                      (wishful_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {wishful_variable.frequency}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                    { }
                                  </td>

                                  <td>
                                    { }
                                    {wishfulVariableData.map(
                                      (wishful_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {rsFilter(
                                                  wishful_variable.monthly_expense
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </td>

                                  <td>
                                    { }
                                    {wishfulVariableData.map(
                                      (wishful_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {rsFilter(
                                                  wishful_variable.annual_expense
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </td>

                                  {/* <td>
                                    { }
                                    {wishfulVariableData.map(
                                      (wishful_variable) => (
                                        <table className="TBData">
                                          <tbody className="Boredernone">
                                            <tr>
                                              <td className="">
                                                {rsFilter(
                                                  wishful_variable.annual_next_year_expense
                                                )}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      )
                                    )}
                                  </td> */}
                                </tr>
                              )}

                              <tr className="bold top-line total-value">
                                <td colSpan={4}>Gross Outflow</td>
                                { }
                                <td className="">
                                  {grossOutflowTotal?.total_monthly_expense !== undefined
                                    ? rsFilter(grossOutflowTotal.total_monthly_expense)
                                    : ""}
                                  {/* {rsFilter(
                                    grossOutflowTotal["total_monthly_expense"]
                                  )} */}
                                </td>
                                <td className="">
                                  {rsFilter(
                                    grossOutflowTotal["total_annual_expense"]
                                  )}
                                </td>
                                {/* <td className="">
                                  {rsFilter(
                                    grossOutflowTotal[
                                    "total_annual_next_yr_expense"
                                    ]
                                  )}
                                </td> */}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <br />
                      <br />
                      <br />
                      <div className="rGraph row">
                        <div
                          id="grossinflow"
                          className="col-md-6"
                          data-highcharts-chart={0}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="text-center">
                            <h4>Gross Inflow</h4>
                          </div>

                          <div className="">
                            <PieChartInflow
                              grossInflowGraphData={grossInflowGraphData}
                            />
                          </div>
                        </div>
                        <div
                          id="outFlowGraph"
                          className="col-md-6"
                          data-highcharts-chart={1}
                        // style={{ overflow: "hidden" }}
                        >
                          <div className="text-center">
                            <h4>Gross Outflow</h4>
                          </div>
                          <div className="d-flex justify-content-center">
                            <PieChartOutflow
                              grossOutflowGraphData={grossOutflowGraphData}
                            />
                          </div>
                        </div>
                      </div>
                      <br />
                      <br />

                      <div className="container mt-2">
                        <div
                          className="notes_sec_div mt-md-5"
                          style={{ border: "none" }}
                        >
                          <div className="notes_head_div mt-md-3">
                            <i />
                            <span>Notes</span>
                          </div>
                          <div className="notes_text_div">
                            <ul>
                              <li
                                style={{
                                  backgroundImage: 'url("/image/?frontend=1&file=/web/static/media/Report/Next.svg")',
                                }}
                              >
                                {/* <p className="rContent " /> */}
                                <p className="rContent"
                                  dangerouslySetInnerHTML={{
                                    __html: fintooNotes ? fintooNotes : "",
                                  }}
                                ></p>
                                {/* <p /> */}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      { }
                    </div>
                    <div className="no-data-found text-center d-none">
                      <div className="container">
                        <div className="row justify-content-center align-items-center">
                          <div className="col-md-10">
                            <img
                              alt="Data not found"
                              src={
                                imagePath +
                                "/static/media/DG/data-not-found.svg"
                              }
                            />
                            { }
                            <p>
                              Since you missed to fill in the required
                              information which is needed here, we are not able
                              to show you this section. Kindly click on below
                              button to provide all the necessary inputs.
                              Providing all the information as asked will ensure
                              more accurate financial planning report. Once you
                              fill in the data, same will be reflected here.
                            </p>
                            <a
                              href="datagathering/income-expenses"
                              target="_blank"
                              className="link"
                            >
                              Complete Income-expenses
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 50 }}></div>
                    { }
                    <div className="row py-2">
                      <div className=" text-center">
                        <div>
                          <div className="btn-container fixedBtn">
                            <div className="d-flex justify-content-center">
                              <div
                                className="previous-btn form-arrow d-flex align-items-center"
                                onClick={() => {
                                  ScrollToTop();
                                  setTab("tab2")
                                }
                                }
                              >
                                <FaArrowLeft />
                                <span className="hover-text">
                                  &nbsp;Previous
                                </span>
                              </div>
                              { }
                              <div
                                className="next-btn form-arrow d-flex align-items-center"
                                onClick={() => {
                                  ScrollToTop();
                                  setTab1232("tab8")
                                }
                                }
                              >
                                <span
                                  className="hover-text"
                                  style={{ maxWidth: 100 }}
                                >
                                  Next&nbsp;
                                </span>
                                <FaArrowRight />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={tab1232 == "tab8" ? "d-block" : "d-none"}>
                    { }
                    <h4 className="rTitle">
                      <img
                        src={
                          imagePath +
                          "/static/media/DG/reports/icons/t_your_profile_total_saving.svg"
                        }
                      />
                      Total Savings / Deficit
                    </h4>
                    <div className="bottom-padding">
                      <div className="rContent ">

                        <p>
                          Gross inflow less gross outflow represents your current total savings. Having adequate savings is the first step to creating wealth. The table below indicates your monthly, as well as yearly saving potential.
                        </p>
                      </div>
                      { }
                      { }
                      <div className="table-responsive rTable">
                        <table className="bgStyleTable">
                          <tbody className="borderRemove">
                            <tr>
                              <th>Type</th>
                              <th>Monthly (₹)</th>
                              <th className="">
                                Yearly (₹) (till 31<sup>st</sup> Dec, {" "}
                                {currentYear})
                              </th>
                              {/* <th>Annual (₹) ({currentYear + 1})</th> */}
                            </tr>
                            <tr>
                              <td>Total Gross Inflow</td>
                              <td className="">
                                {/* {totalGrossInflowData?.total_monthly_income !== undefined
                                  ? rsFilter(totalGrossInflowData.total_monthly_income)
                                  : ""} */}
                                {rsFilter(totalGrossInflowData?.total_monthly_income ?? 0)}
                              </td>
                              <td className="">
                                {rsFilter(totalGrossInflowData?.total_annual_income ?? 0)}
                              </td>
                              {/* <td className="">
                                {rsFilter(totalGrossInflowData?.total_annual_next_year_income ?? 0)}
                              </td> */}
                            </tr>
                            <tr>
                              <td>Total Gross Outflow</td>
                              <td className="">
                                {rsFilter(totalGrossOutflowData?.total_monthly_expense ?? 0)}
                              </td>
                              <td className="">
                                {rsFilter(totalGrossOutflowData?.total_annual_expense ?? 0)}
                              </td>
                              {/* <td className="">
                                {rsFilter(totalGrossOutflowData?.total_nextyr_expense ?? 0)}
                              </td> */}
                            </tr>
                            <tr className="bold top-line total-value">
                              <td className="">Total Savings </td>

                              {/* {totalSavingData?.monthly === 0 && (
                                <td>{rsFilter(totalSavingData["monthly"])}</td>
                              )}
                              {totalSavingData?.monthly > 0 && (
                                <td>{rsFilter(totalSavingData["monthly"])}</td>
                              )}
                              {totalSavingData?.monthly < 0 && (
                                <td style={{ color: "red" }}>
                                  (
                                  {rsFilter(
                                    Math.abs(totalSavingData["monthly"])
                                  )}
                                  )
                                </td>
                              )} */}
                              <td style={{ color: totalSavingData?.monthly < 0 ? "red" : undefined }}>
                                {totalSavingData?.monthly < 0
                                  ? `(${rsFilter(Math.abs(totalSavingData.monthly))})`
                                  : rsFilter(totalSavingData?.monthly ?? 0)}
                              </td>

                              <td style={{ color: totalSavingData?.annual < 0 ? "red" : undefined }}>
                                {totalSavingData?.annual < 0
                                  ? `(${rsFilter(Math.abs(totalSavingData.annual))})`
                                  : rsFilter(totalSavingData?.annual ?? 0)}
                              </td>

                              {/* <td style={{ color: totalSavingData?.nextyr_saving < 0 ? "red" : undefined }}>
                                {totalSavingData?.nextyr_saving < 0
                                  ? `(${rsFilter(Math.abs(totalSavingData.nextyr_saving))})`
                                  : rsFilter(totalSavingData?.nextyr_saving ?? 0)}
                              </td> */}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="rGraph mt-2 p-md-4 pt-3">
                        <div className="d-md-flex justify-content-around">
                          <div className="mt-4">
                            <TotalSavings
                              currentTotalSavings={currentTotalSavings}
                            />
                          </div>

                          {/* <div className="mt-4">
                            <TotalSavingss
                              nextYearTotalSavings={nextYearTotalSavings}
                            />
                          </div> */}
                        </div>
                      </div>
                      {insuranceData?.length > 0 && (
                        <h4 className="rTitle">
                          <img
                            src={
                              imagePath +
                              "/static/media/DG/reports/your-profile/existing-insurance.svg"
                            }
                          />
                          Existing Insurance &amp; Investment Commitment{" "}
                        </h4>
                      )}
                      {insuranceData?.length > 0 && (
                        <div className="rContent ">
                          <p>This table summarises all of your existing as well as periodic commitments. It includes premium payments for various insurance policies and also lists your expenses towards existing investments like Systematic Investment Plans (SIPs), Public Provident Fund (PPF), and Employees' Provident Fund (EPF), and others.</p>
                        </div>
                      )}
                      {insuranceData?.length > 0 && (
                        <div className="table-responsive rTable">
                          <table
                            className="bgStyleTable"
                            style={{ fontSize: 13 }}
                          >
                            <tbody className="borderRemove">
                              <tr>
                                <th>Category</th>
                                <th>Scheme</th>
                                <th>Name of the Holder</th>
                                <th>Frequency</th>
                                <th>Committed Investment/Insurance (₹)</th>
                                <th>
                                  YTD (₹)
                                  { }
                                  <span
                                    style={{ fontSize: 12, paddingLeft: 5 }}
                                    className=""
                                  >
                                    (till 31<sup>st</sup> Dec, {currentYear})
                                  </span>
                                </th>
                                {/* <th>Annual (₹)({currentYear + 1})</th> */}
                              </tr>
                              {assetData.map((asset) => (
                                <tr className="">
                                  <td className="">
                                    {asset.category} - {asset.scheme}
                                  </td>
                                  <td className="">
                                    {asset.name}
                                  </td>
                                  <td className="">{asset.fullname}</td>
                                  <td className="">{asset.frequency}</td>
                                  <td className="">{asset.asset_amount}</td>
                                  <td className="">{asset.annualy}</td>
                                  {/* <td className="">
                                    {asset.nextyr_amount}
                                  </td> */}
                                </tr>
                              ))}
                              {insuranceData.map((insurance) => (
                                <tr className="">
                                  <td className="">
                                    {insurance.category} - {insurance.scheme}
                                  </td>
                                  <td className="">
                                    {insurance.insurance_name}
                                  </td>
                                  <td className="">{insurance.fullname}</td>
                                  <td className="">{insurance.frequency}</td>
                                  <td className="">{insurance.asset_amount}</td>
                                  <td className="">{insurance.annualy}</td>
                                  {/* <td className="">
                                    {insurance.yearly_nextyr}
                                  </td> */}
                                </tr>
                              ))}
                              <tr className="bold top-line total-value">
                                <td>Gross total</td>
                                <td />
                                <td />
                                <td />
                                <td className="">
                                  {rsFilter(
                                    investmentInsuranceData["total_monthly"]
                                  )}
                                </td>
                                <td className="">
                                  {rsFilter(
                                    investmentInsuranceData["total_yearly"]
                                  )}
                                </td>
                                {/* <td className="">
                                  {rsFilter(
                                    investmentInsuranceData["total_nxtyearly"]
                                  )}
                                </td> */}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                      <h4 className="rTitle mt-5">
                        <img
                          src={
                            imagePath +
                            "/static/media/DG/reports/your-profile/shortfall.svg"
                          }
                        />
                        Investable Surplus / Shortfall
                      </h4>
                      <div className="rContent ">
                        {/* <p
                          dangerouslySetInnerHTML={{
                            __html: pSurplusSectionData.field2 ? pSurplusSectionData.field2 : "",
                          }}
                        ></p> */}
                        <p>
                          Investible surplus is the money available for making fresh investments. It is that portion of your total savings that is left over after subtracting the amount earmarked for existing insurance and investment commitments.
                        </p>
                        <p>
                          If this number is negative, it means that your current commitments exceed your total savings and that you have an investible shortfall. In this case it's best that you revisit your budget and curb unnecessary expenses to amplify savings.
                        </p>
                      </div>
                      <div className="table-responsive rTable">
                        <table className="bgStyleTable">
                          <tbody className="borderRemove">
                            <tr>
                              <th>Type</th>
                              <th>Monthly (₹)</th>
                              <th>
                                YTD (₹)
                                { }
                                <span
                                  style={{ fontSize: 12, paddingLeft: 5 }}
                                  className=""
                                >
                                  (till 31<sup>st</sup> Dec, {currentYear})
                                </span>
                              </th>
                              {/* <th>Annual (₹)({currentYear + 1})</th> */}
                            </tr>
                            { }
                            <tr className="">
                              { }
                              {totalSavingData?.annual > 0 && (
                                <td>
                                  <span className=" plainclass">
                                    Saving ( A )
                                  </span>
                                </td>
                              )}
                              {totalSavingData?.annual < 0 && (
                                <td>
                                  <span className=" plainclass">
                                    Deficit ( A )
                                  </span>
                                </td>
                              )}

                              {/* {totalSavingData?.monthly === 0 && (
                                <td>{rsFilter(totalSavingData["monthly"])}</td>
                              )}
                              {totalSavingData?.monthly > 0 && (
                                <td>{rsFilter(totalSavingData["monthly"])}</td>
                              )}
                              {totalSavingData?.monthly < 0 && (
                                <td style={{ color: "red" }}>
                                  (
                                  {rsFilter(
                                    Math.abs(totalSavingData["monthly"])
                                  )}
                                  )
                                </td>
                              )} */}

                              <td style={{ color: totalSavingData?.monthly < 0 ? "red" : undefined }}>
                                {totalSavingData?.monthly < 0
                                  ? `(${rsFilter(Math.abs(totalSavingData.monthly))})`
                                  : rsFilter(totalSavingData?.monthly ?? 0)}
                              </td>

                              {/* {totalSavingData?.annual === 0 && (
                                <td>{rsFilter(totalSavingData["annual"])}</td>
                              )}
                              {totalSavingData?.annual > 0 && (
                                <td>{rsFilter(totalSavingData["annual"])}</td>
                              )}
                              {totalSavingData?.annual < 0 && (
                                <td style={{ color: "red" }}>
                                  (
                                  {rsFilter(
                                    Math.abs(totalSavingData["annual"])
                                  )}
                                  )
                                </td>
                              )} */}
                              <td style={{ color: totalSavingData?.annual < 0 ? "red" : undefined }}>
                                {totalSavingData?.annual < 0
                                  ? `(${rsFilter(Math.abs(totalSavingData.annual))})`
                                  : rsFilter(totalSavingData?.annual ?? 0)}
                              </td>

                              {/* {totalSavingData?.nextyr_saving === 0 && (
                                <td>
                                  {rsFilter(totalSavingData["nextyr_saving"])}
                                </td>
                              )}
                              {totalSavingData?.nextyr_saving > 0 && (
                                <td>
                                  {rsFilter(totalSavingData["nextyr_saving"])}
                                </td>
                              )}
                              {totalSavingData?.nextyr_saving < 0 && (
                                <td style={{ color: "red" }}>
                                  (
                                  {rsFilter(
                                    Math.abs(totalSavingData["nextyr_saving"])
                                  )}
                                  )
                                </td>
                              )} */}
                              {/* <td style={{ color: totalSavingData?.nextyr_saving < 0 ? "red" : undefined }}>
                                {totalSavingData?.nextyr_saving < 0
                                  ? `(${rsFilter(Math.abs(totalSavingData.nextyr_saving))})`
                                  : rsFilter(totalSavingData?.nextyr_saving ?? 0)}
                              </td> */}

                            </tr>
                            { }
                            <tr className="">
                              { }
                              <td>
                                <span className=" plainclass">
                                  Existing Insurance &amp; investment Commitment
                                  ( B )
                                </span>
                              </td>
                              <td className="">
                                {/* <span className=" plainclass">
                                  {rsFilter(
                                    investmentInsuranceData["total_monthly"]
                                  )}
                                </span> */}
                                <span className="plainclass">
                                  {rsFilter(investmentInsuranceData?.total_monthly ?? 0)}
                                </span>
                              </td>
                              { }
                              <td className="">
                                {/* <span className=" plainclass">
                                  {rsFilter(
                                    investmentInsuranceData["total_yearly"]
                                  )}
                                </span> */}
                                <span className="plainclass">
                                  {rsFilter(investmentInsuranceData?.total_yearly ?? 0)}
                                </span>

                              </td>
                              {/* <td className="">
                                <span className="plainclass">
                                  {rsFilter(investmentInsuranceData?.total_nxtyearly ?? 0)}
                                </span>

                              </td> */}
                            </tr>
                            { }
                            <tr className="">
                              { }
                              <td>
                                <span className=" boldclass">
                                  <b>Net Investable Surplus ( A - B )</b>
                                </span>
                              </td>

                              {surplusShortfallData["monthly"] === 0 && (
                                <td>
                                  {rsFilter(surplusShortfallData?.monthly ?? 0)}
                                </td>
                              )}
                              {surplusShortfallData["monthly"] > 0 && (
                                <td>
                                  {rsFilter(surplusShortfallData?.monthly ?? 0)}
                                </td>
                              )}
                              {surplusShortfallData["monthly"] < 0 && (
                                <td style={{ color: "red" }}>
                                  (
                                  {rsFilter(
                                    Math.abs(surplusShortfallData?.monthly ?? 0)
                                  )}
                                  )
                                </td>
                              )}

                              {surplusShortfallData["annual"] === 0 && (
                                <td>
                                  {rsFilter(surplusShortfallData?.annual ?? 0)}
                                </td>
                              )}
                              {surplusShortfallData["annual"] > 0 && (
                                <td>
                                  {rsFilter(surplusShortfallData?.annual ?? 0)}
                                </td>
                              )}
                              {surplusShortfallData["annual"] < 0 && (
                                <td style={{ color: "red" }}>
                                  (
                                  {rsFilter(
                                    Math.abs(surplusShortfallData?.annual ?? 0)
                                  )}
                                  )
                                </td>
                              )}

                              {/* <td style={{ color: surplusShortfallData?.next_yearly < 0 ? "red" : undefined }}>
                                {surplusShortfallData?.next_yearly < 0
                                  ? `(${rsFilter(Math.abs(surplusShortfallData?.next_yearly ?? 0))})`
                                  : rsFilter(surplusShortfallData?.next_yearly ?? 0)}
                              </td> */}

                            </tr>
                            { }
                          </tbody>
                        </table>
                      </div>
                      <div className="rGraph mt-1 p-md-4 pt-3">
                        <div className="d-md-flex justify-content-around">
                          <div className="mt-4">
                            <TotalInvestable
                              currentTotalInvestable={currentTotalInvestable}
                            />
                          </div>

                          {/* <div className="mt-4">
                            <TotalInvestablee
                              nextYearTotalInvestable={nextYearTotalInvestable}
                            />
                          </div> */}
                        </div>
                      </div>
                      {/* <div class="rContent" ng-bind-html="p_surplus_section_data['field3']"></div> */}
                    </div>
                    <div className="no-data-found text-center d-none">
                      <div className="container">
                        <div className="row justify-content-center align-items-center">
                          <div className="col-md-10">
                            <img
                              alt="Data not found"
                              src={
                                imagePath +
                                "/static/media/DG/data-not-found.svg"
                              }
                            />
                            { }
                            <p>
                              Since you missed to fill in the required
                              information which is needed here, we are not able
                              to show you this section. Kindly click on below
                              button to provide all the necessary inputs.
                              Providing all the information as asked will ensure
                              more accurate financial planning report. Once you
                              fill in the data, same will be reflected here.
                            </p>
                            <a
                              href="datagathering/income-expenses"
                              target="_blank"
                              className="link"
                            >
                              Complete Income Expenses
                            </a>
                          </div>
                        </div>
                      </div>
                      <div style={{ height: 50 }}></div>
                    </div>
                    <div className="row py-2">
                      <div className=" text-center">
                        <div>
                          <div className="btn-container fixedBtn">
                            <div className="d-flex justify-content-center">
                              <div
                                className="previous-btn form-arrow d-flex align-items-center"
                                onClick={() => {
                                  ScrollToTop();
                                  setTab1232("tab7")
                                }
                                }
                              >
                                <FaArrowLeft />
                                <span className="hover-text">
                                  &nbsp;Previous
                                </span>
                              </div>
                              { }
                              <div
                                className="next-btn form-arrow d-flex align-items-center"
                                onClick={() => {
                                  ScrollToTop();
                                  setTab("tab4")
                                }
                                }
                              >
                                <span
                                  className="hover-text"
                                  style={{ maxWidth: 100 }}
                                >
                                  Next&nbsp;
                                </span>
                                <FaArrowRight />
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
            <div className={tab == "tab4" ? "d-block" : "d-none"}>
              <div className="ProfileIncomeExpensesHolder profileScoreCard ">
                <div>
                  <h4 className="rTitle">
                    <img
                      alt=""
                      src={
                        imagePath +
                        "/static/media/DG/reports/icons/t_your_profile_gross_inflow.svg"
                      }
                    />
                    Your Scorecard
                  </h4>
                  <div style={{ fontSize: 14 }} className="">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: scoreScreenMsg ? scoreScreenMsg : "",
                      }}
                    ></p>
                  </div>
                  <div className="gridCalculation">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="gridCalBox">
                          <h4 className="rTitle">Saving ratio</h4>
                          <div className="scorebard-box">
                            <img src={imagePath + "/static/media/Images/scorecard.svg"} />
                            {/* <span className="">20/20</span> */}
                            <span className="">
                              {incomeExpenseData.saving_marks}/20
                            </span>
                          </div>
                          <div className="colorBgBand">
                            <div className="col-md-5">
                              <p className="fontsizeclass">
                                Savings / Total income{" "}
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-5">
                              {/* {" "} {incomeExpenseData?.annual_expense}
                              {incomeExpenseData?.annual_income} */}

                              <p className="fontsizeclass ">
                                {/* ₹14.48 Lac / ₹29.48 Lac */}
                                {formatLocPrice(
                                  incomeExpenseData?.annual_income -
                                  incomeExpenseData?.annual_expense
                                )}{" "}
                                /{" "}
                                {formatLocPrice(
                                  incomeExpenseData?.annual_income ?? 0
                                )}
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-2">
                              { }
                              { }
                              <p class="fontsizeclass" className=" ">
                                {/* 49% */}
                                {incomeExpenseData.saving_ratio < 0 && (
                                  <>
                                    (
                                    {makePositive(
                                      incomeExpenseData.saving_ratio
                                    )}
                                    )%
                                  </>
                                )}
                                {incomeExpenseData.saving_ratio >= 0 && (
                                  <>{incomeExpenseData.saving_ratio}%</>
                                )}
                              </p>
                              { }
                            </div>
                          </div>
                          <div className="scoreCardLabel">
                            Your Ideal Savings Should Be atleast {" "}
                            {incomeExpenseData.ideal_saving_ratio}% Of Your
                            Income.
                          </div>

                          <p
                            dangerouslySetInnerHTML={{
                              __html: incomeExpenseData.saving_data
                                ? incomeExpenseData.saving_data
                                : "",
                            }}
                          ></p>
                          <p />
                          { }
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="gridCalBox">
                          <h4 className="rTitle">Expense ratio</h4>
                          <div className="scorebard-box">
                            <img src={imagePath + "/static/media/Images/scorecard.svg"} />
                            <span className="">
                              {incomeExpenseData.expense_marks}/20
                            </span>
                          </div>
                          <div className="colorBgBand">
                            <div className="col-md-5">
                              <p className="fontsizeclass">
                                Expense / Total income{" "}
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-5">
                              <p className="fontsizeclass ">
                                {" "}
                                {/* ₹15 Lac / ₹29.48 Lac */}
                                {formatLocPrice(
                                  incomeExpenseData?.annual_expense ?? 0
                                )}{" "}
                                /{" "}
                                {formatLocPrice(
                                  incomeExpenseData?.annual_income ?? 0
                                )}
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-2">
                              { }
                              { }
                              <p className="fontsizeclass  ">
                                {/* 51% */}
                                {incomeExpenseData.expense_ratio < 0 && (
                                  <>
                                    (
                                    {makePositive(
                                      incomeExpenseData.expense_ratio
                                    )}
                                    )%
                                  </>
                                )}
                                {incomeExpenseData.expense_ratio >= 0 && (
                                  <>{incomeExpenseData.expense_ratio}%</>
                                )}
                              </p>
                              { }
                            </div>
                          </div>
                          <div className="scoreCardLabel">
                            Your Ideal Expenses Should not Be More Than {" "}
                            {incomeExpenseData.ideal_expense_ratio}% Of Your
                            Income.
                          </div>

                          <p
                            dangerouslySetInnerHTML={{
                              __html: incomeExpenseData.expense_data
                                ? incomeExpenseData.expense_data
                                : "",
                            }}
                          ></p>

                          <p />
                          { }
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="gridCalBox">
                          <h4 className="rTitle">Networth ratio</h4>
                          <div className="scorebard-box">
                            <img src={imagePath + "/static/media/Images/scorecard.svg"} />
                            <span className="">
                              {netLiquidData.networth_mark}/20
                            </span>
                          </div>
                          <div className="colorBgBand">
                            <div className="col-md-4">
                              <p className="fontsizeclass">
                                Total assets - Total liabilities
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-4">
                              <p className="fontsizeclass ">
                                {" "}
                                {/* ₹6.01 Cr - ₹85 Lac{" "} */}
                                {formatLocPrice(
                                  netLiquidData?.total_asset ?? 0
                                )}{" "}
                                -{" "}
                                {formatLocPrice(
                                  netLiquidData.total_liability ?? 0
                                )}
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-4">
                              {/* <p className="fontsizeclass ">₹5.16 Cr</p> */}
                              <p className="fontsizeclass ">
                                {formatLocPrice(
                                  netLiquidData?.networth_ratio ?? 0
                                )}
                              </p>
                            </div>
                          </div>
                          { }
                          <div className="scoreCardLabel">
                            {/* Your Ideal Networth should be ₹3.98 Cr */}
                            Your Ideal net worth should be atleast{" "}
                            {formatLocPrice(netLiquidData?.ideal_networth ?? 0)}
                          </div>

                          <p
                            dangerouslySetInnerHTML={{
                              __html: netLiquidData.networth_data
                                ? netLiquidData.networth_data
                                : "",
                            }}
                          ></p>
                          <p><p>
                            Your current networth is {""}{formatLocPrice(netLiquidData?.networth_ratio ?? 0)}
                          </p>
                          </p>
                          <p />

                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="gridCalBox">
                          <h4 className="rTitle">Liquidity ratio</h4>
                          <div className="scorebard-box">
                            <img src={imagePath + "/static/media/Images/scorecard.svg"} />
                            <span className="">
                              {netLiquidData.liquidity_mark}/20
                            </span>
                          </div>
                          <div className="colorBgBand">
                            <div className="col-md-5">
                              <p className="fontsizeclass">
                                Assets / Expenses required
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-4">
                              <p className="fontsizeclass ">
                                {" "}
                                {/* ₹7 Lac / ₹3 Lac{" "} */}
                                {formatLocPrice(
                                  netLiquidData?.total_liquid ?? 0
                                )}{" "}
                                /{" "}
                                {formatLocPrice(
                                  netLiquidData?.monthly_expense ?? 0
                                )}
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-3">
                              {netLiquidData.liquidity_ratio === undefined ? (
                                <p className="fontsizeclass ">
                                  {netLiquidData.liquidity_ratio}
                                </p>
                              ) : (
                                <p className="fontsizeclass ">
                                  {netLiquidData.liquidity_ratio} mth
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="scoreCardLabel">
                            Your ideal liquid fund should be equal to {netLiquidData.ideal_liquid_months} months of
                            expenses.
                          </div>

                          <p
                            dangerouslySetInnerHTML={{
                              __html: netLiquidData.liquidity_data
                                ? netLiquidData.liquidity_data
                                : "",
                            }}
                          ></p>

                          <p />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="gridCalBox">
                          <h4 className="rTitle">Solvency ratio</h4>
                          <div className="scorebard-box">
                            <img src={imagePath + "/static/media/Images/scorecard.svg"} />
                            <span className="">
                              {solvencyData.solvency_mark}/20
                            </span>
                          </div>
                          <div className="colorBgBand sizefont">
                            <div className="col-md-4">
                              <p className="fontsizeclass">
                                NetWorth / Total assets
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-4">
                              <p className="fontsizeclass ">
                                {/* {" "} */}
                                {/* ₹5.16 Cr / ₹6.01 Cr{" "} */}
                                {formatLocPrice(
                                  netLiquidData?.networth_ratio ?? 0
                                )}{" "}
                                /{" "}
                                {formatLocPrice(
                                  netLiquidData?.total_asset ?? 0
                                )}
                              </p>
                            </div>
                            <div>=</div>
                            <div className="col-md-4">
                              {solvencyData.solvency_ratio < 0 ? (
                                <p className="fontsizeclass ">
                                  ({makePositive(solvencyData.solvency_ratio)})%
                                </p>
                              ) : (
                                <p className="fontsizeclass ">
                                  {solvencyData.solvency_ratio}%
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="scoreCardLabel">
                            Your Ideal Solvency Ratio should not be less than
                            50%
                          </div>

                          <p
                            dangerouslySetInnerHTML={{
                              __html: solvencyData.solvency_data
                                ? solvencyData.solvency_data
                                : "",
                            }}
                          ></p>
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                  <br />
                  <br />
                  <br />
                  <div className="d-flex justify-content-center align-items-center">
                    <div
                      className="scorecard_title rectangle"
                      style={{ textAlign: "center !important" }}
                    >
                      <b>Overall Score</b>
                    </div>
                  </div>
                  <br />
                  <br />
                  <div className="row">
                    <div className="col-md-7">
                      { }
                      <h4
                        style={{ fontSize: 17, fontWeight: "700" }}
                        className="mt-5"
                      >
                        Your Scorecard is {scoreData.total_score} out of 100
                        which is{" "}
                        <b
                          // className="score_name_color "
                          style={{ color: scoreNameColor }}
                        >
                          {scoreData.total_score_name}
                        </b>
                        .
                      </h4>
                      <p
                        style={{ fontSize: 14 }}
                        dangerouslySetInnerHTML={{
                          __html: scoreData.total_score_desc
                            ? scoreData.total_score_desc
                            : "",
                        }}
                      ></p>
                    </div>
                    <div className="col-md-5">
                      <div className="row align-items-center">
                        <Scorecard
                          needle_pos={
                            scoreData.gauge_needle ? scoreData.gauge_needle : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 50, width: 100, clear: "both" }}>
                    &nbsp;
                  </div>
                  <div className="container" style={{ paddingTop: 25 }}>
                    <div className="recommen_sec_div">
                      <div className="rec_head_div">
                        <i />
                        <span>Fintoo Recommends</span>
                      </div>
                      <div
                        className="inner_text_div Recommandedtext"
                        style={{ fontWeight: "bold" }}
                      >
                        <ul>
                          <p>Saving Ratio</p>
                          <li>
                            <p className="rContent " />
                            {/* <p>
                                Your current saving ratio is 49% of your total
                                income. Your ideal saving ratio is 40%. As you
                                are saving more than the basic requirement, you
                                can either continue to save more or invest the
                                surplus for your future goals.
                              </p> */}
                            <p
                              dangerouslySetInnerHTML={{
                                __html: scoreData.fintoo_saving_recomm
                                  ? scoreData.fintoo_saving_recomm
                                  : "",
                              }}
                            ></p>
                            <p />
                          </li>
                        </ul>
                        <ul>
                          <p>Expense Ratio</p>
                          <li>
                            <p className="rContent " />
                            {/* <p>
                                Your expense ratio is 51% of your total income.
                                The ideal expense ratio is 60%. As your expenses
                                are lesser than the base limit, we recommend you
                                to maintain your lower expense ratio in the
                                future too. If you wish, you can invest the
                                surplus amount for your future goals.
                              </p> */}
                            <p
                              dangerouslySetInnerHTML={{
                                __html: scoreData.fintoo_expense_recomm
                                  ? scoreData.fintoo_expense_recomm
                                  : "",
                              }}
                            ></p>
                            <p />
                          </li>
                        </ul>
                        <ul>
                          <p>Net Worth Ratio</p>
                          <li>
                            <p className="rContent " />
                            {/* <p>
                                As your current net worth is more than the base
                                limit (baseline, ideal requirement) we recommend
                                you to maintain your current net worth in the
                                future too. As your net worth score is
                                excellent, it means that you are building your
                                assets through disciplined savings and smart
                                investments.
                              </p> */}
                            <p
                              dangerouslySetInnerHTML={{
                                __html: scoreData.fintoo_networth_recomm
                                  ? scoreData.fintoo_networth_recomm
                                  : "",
                              }}
                            ></p>
                            <p />
                          </li>
                        </ul>
                        <ul>
                          <p>Liquidity Ratio</p>
                          <li>
                            <p className="rContent " />
                            {/* <p>
                                Therefore, we recommend that you must build your
                                liquid assets to accommodate emergency
                                expenses.If you are two people earning in your
                                family, you must maintain an emergency corpus
                                worth at least 4 months of your expenses.
                              </p> */}
                            <p
                              dangerouslySetInnerHTML={{
                                __html: scoreData.fintoo_liquid_recomm
                                  ? scoreData.fintoo_liquid_recomm
                                  : "",
                              }}
                            ></p>
                            <p />
                          </li>
                        </ul>
                        <ul>
                          <p>Solvency Ratio</p>
                          <li>
                            <p className="rContent " />
                            {/* <p>
                                Way to go! The amount of your liabilities is 14%
                                which is fairly lower than the amount of your
                                assets. We are happy that you are maintaining a
                                healthy solvency ratio and we recommend you keep
                                maintaining it to achieve a financially stable
                                future. However, we would also recommend you to
                                go a step further and reduce your liabilities
                                even more to achieve an excellent solvency
                                ratio.
                              </p> */}
                            <p
                              dangerouslySetInnerHTML={{
                                __html: scoreData.fintoo_solvency_recomm
                                  ? scoreData.fintoo_solvency_recomm
                                  : "",
                              }}
                            ></p>
                            <p />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row py-2">
                  <div className=" text-center">
                    <div>
                      <div className="btn-container fixedBtn">
                        <div className="d-flex justify-content-center">
                          <div
                            className="previous-btn form-arrow d-flex align-items-center"
                            onClick={() => {
                              ScrollToTop();
                              setTab("tab3")
                            }
                            }
                          >
                            <FaArrowLeft />
                            <span className="hover-text">&nbsp;Previous</span>
                          </div>
                          { }
                          <Link
                            to={
                              process.env.PUBLIC_URL +
                              "/report/assets-liabilities"
                            }
                          >
                            <div className="next-btn form-arrow d-flex align-items-center">
                              <span
                                className="hover-text"
                                style={{ maxWidth: 100 }}
                              >
                                Next&nbsp;
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
    </DatagatherReportLayout>
  );
};
export default YourProfile;
