import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DatagatherReportLayout from "../../components/Layout/Datagather/Reports";
import Carousel, { consts } from "react-elastic-carousel";
import Item from "./Item";
import { ReactComponent as LeftArrow } from "../../Assets/Datagathering/arrow-prev.svg";
import { ReactComponent as NextArrow } from "../../Assets/Datagathering/arrow-next.svg";
import GoalaasetMap from "../../Assets/Datagathering/Graph/GoalaasetMap";
import { Link } from "react-router-dom";
import { imagePath, ADVISORY_GET_GOAL_SUMMARY, ADVISORY_GET_ASSET_GOAL_MAPPING, financialplanninggoalEndpoints, ADVISORY_GET_GOAL_ASSET_MAPPING } from "../../constants";
import {
  getParentUserId, getItemLocal, loginRedirectGuest, numberFormat, toPascalCase, generateSortFn,
  fetchEncryptData, getUserId,
  setBackgroundDivImage
} from "../../common_utilities";
import FintooLoader from '../../components/FintooLoader';
import { ScrollToTop } from "./ScrollToTop";
import { useOnHoverOutside } from "./useOnHoverOutside";
import Whatifanalysis from "./DGReport/whatifanalysis";
import { GetFinalGoalRecommendation } from "../../FrappeIntegration-Services/services/financial-planning-api/reports/goal-analysis";
import apiClient from "../../FrappeIntegration-Services/services/apiClient";
import Cookies from 'js-cookie';
import toastr from 'toastr';

const Goalanalysis = () => {
  const [tab, setTab] = useState("tab1");
  const [first, setFirst] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);
  const [totalAmt, setTotalAmount] = useState({ "totalPresentAmt": '', "totalFutureAmt": '', "totalCumulativeAmt": '', "totalGoalAmt": '', "totalAssetAmt": '', "totalDiffAmt": '' })
  const [screenNoteData, setScreenNoteData] = useState({ "goalScreenData": '', "goalAssetScreenData": '', "goalAssetScreenData1": '', "assetGoalScreenData": '', "assetGoalNoteData": '', "totalAssetAmt": '', "totalDiffAmt": '', "sectionHeader": '' })
  const [investmentData, setInvestmentData] = useState({ "fintooNewInvestment": '', "fintooRecInvestment": '' })
  const [goalAPIData, setGoalAPIData] = useState({ "goalData": [], "goalAssetData": [], "assetGoalData": [], "goalAssetMappingData": [], "nonlinkableUnlinkedAsset": [], "unlinkedInsuranceData": [], "unlinkedAssetsData": [] });
  const [isLoading, setIsLoading] = useState(false);
  const [xCategories, setXcategories] = useState([]);
  const session_data = useRef('');
  const [isMenuDropDownOpen, setMenuDropDownOpen] = useState(false);
  const [goalAnalysisData, SetGoalAnalysisiData] = useState([]);
  const [totalgoals, SetTotalGoals] = useState([]);
  const [unachievableGoalrecoom, setUnachievableGoalrecoom] = useState([]);
  const dropdownRef = useRef(null);

  const goalImagesData1 = {
    'education': 'goal-education1.svg',
    'marriage': 'goal-marriage1.svg',
    'vehicle': 'goal-vehicle1.svg',
    'property': 'goal-property1.svg',
    'vacation': 'goal-vacation1.svg',
    'emergency': 'goal-emergency1.svg',
    'others': 'goal-others1.svg'
  }

  const goalImagesData2 = {
    'education': 'goal-education2.svg',
    'marriage': 'goal-marriage2.svg',
    'vehicle': 'goal-vehicle2.svg',
    'property': 'goal-property2.svg',
    'vacation': 'goal-vacation2.svg',
    'emergency': 'goal-emergency2.svg',
    'others': 'goal-others1.svg'
  }

  let yCategories = []
  let colorArray = []

  useEffect(() => {
    document.body.classList.add("dg-layout");
    document.body.classList.add("rp-layout");

    // Call the API functions directly
    goalSummaryAPI();
    goalanalysisAPI();
    goalAssetMappingAPI();
    assetGoalMappingAPI();
    unlinkedAssetAPI();
    goalAsesetMappingAnalysisAPI();


    const interval = setInterval(() => {
      const reportBgGoal = document.getElementById("report-bg-goal");
      if (reportBgGoal) {
        reportBgGoal.style.background = `url(${imagePath}/static/assets/img/reports/ill-goal-analysis.svg) no-repeat right top`;
        clearInterval(interval);
        setBackgroundDivImage();
      }
    }, 50);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("dg-layout");
      document.body.classList.remove("rp-layout");
    };
  }, []);



  const setYcategories = (ycat) => {
    if (ycat) {
      ycat.forEach(y => {
        yCategories.push(y)
      })
    }
  }
  const setColorArray = (ycolor) => {
    if (ycolor) {
      ycolor.forEach(y => {
        colorArray.push(y)
      })
    }
  }
  const getYCategories = (goalId) => {
    var yCategoriesArray = []
    var yCategoriesNewArray = []
    if (yCategories.length > 0) {

      yCategoriesArray = yCategories.filter(category => {
        return category.id == goalId
      })

    }
    yCategoriesArray.forEach(category => {
      yCategoriesNewArray.push({ "name": category['name'], "data": category['data'] })
    })
    return yCategoriesNewArray

  }
  const getColorArray = (goalId) => {
    var colors = []
    var newColorArray = []

    if (colorArray.length > 0) {
      colors = colorArray.filter(category => {
        return category.id == goalId
      })
    }

    colors.forEach(color => {
      newColorArray.push(color['color'])
    })
    return newColorArray

  }
  const goalSummaryAPI = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID found for goal summary data');
        toastr.error("User ID not found. Please login again.");
        loginRedirectGuest();
        return;
      }

      const response = await apiClient(`${ADVISORY_GET_GOAL_SUMMARY}?user_id=${userId}`, {
        method: 'GET'
      });

      if (response && response["status_code"] === "200") {
        // Set default screen data since the new API doesn't provide screen data
        setScreenNoteData(data => ({
          ...data,
          goalScreenData: "Fintoo's financial planners assist you in setting and prioritizing your financial goals. These goals can range from children's education, supporting elderly parents, and debt repayment to improving lifestyle, building retirement wealth, or saving for weddings. Our experts determine the best strategy for timely achievement through successful investing."
        }));

        // Extract goals from the API response
        const goals = response.data?.preRetirementGoals || [];

        setGoalAPIData(data => ({
          ...data,
          goalData: goals
        }));

        // Calculate totals
        let totalPresentAmt = 0;
        let totalFutureAmt = 0;
        let totalCumulativepvAmt = 0;

        goals.forEach(goal => {
          totalPresentAmt += goal.present_value || 0;
          totalFutureAmt += goal.future_value || 0;
          totalCumulativepvAmt += goal.cumulative_present_value || 0;
        });

        setTotalAmount((amt) => ({
          ...amt,
          totalPresentAmt: totalPresentAmt,
          totalFutureAmt: totalFutureAmt,
          totalCumulativeAmt: totalCumulativepvAmt
        }));

      } else {
        console.error('Goal Summary API Error:', response?.message || 'Failed to fetch goal summary');
        toastr.error(response?.message || 'Failed to fetch goal summary');
        setGoalAPIData(data => ({
          ...data,
          goalData: []
        }));
        setTotalAmount((amt) => ({
          ...amt,
          totalPresentAmt: 0,
          totalFutureAmt: 0,
          totalCumulativeAmt: 0
        }));
      }

    } catch (error) {
      console.error('Error fetching goal summary:', error);

      if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        toastr.error("Network error: Unable to connect to the server. Please check your internet connection.");
      } else if (error.status === 401) {
        toastr.error("Authentication error: Please login again.");
        loginRedirectGuest();
      } else {
        toastr.error("Something went wrong while fetching goal summary");
      }

      setGoalAPIData(data => ({
        ...data,
        goalData: []
      }));
      setTotalAmount((amt) => ({
        ...amt,
        totalPresentAmt: 0,
        totalFutureAmt: 0,
        totalCumulativeAmt: 0
      }));
    }
  }
  const goalanalysisAPI = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID found for goal analysis data');
        return;
      }

      // This API might need a different endpoint or approach
      // For now, we'll skip it since it's not critical for the main functionality

    } catch (error) {
      console.error('Error in goal analysis API:', error);
    }
  }


  const closeHoverMenu = () => {
    setMenuDropDownOpen(false);
  };

  useOnHoverOutside(dropdownRef, closeHoverMenu);

  const sortByGoal = (type) => {
    let goalsOldData = goalAPIData.goalData;

    let topGoals = [];
    let otherGoals = [];

    if (type === "goal_priority") {
      topGoals = goalsOldData.filter(item => item.goal_cat_id === "GCAT-96" || item.goal_cat_id === "GCAT-124");
      otherGoals = goalsOldData.filter(item => item.goal_cat_id !== "GCAT-96" && item.goal_cat_id !== "GCAT-124");
      goalsOldData = otherGoals;
    }

    let goalsSortedData = [...goalsOldData].sort((a, b) => {
      if (type === "isCritical_sort") {
        // Sort by critical status - Critical goals first
        if (a.goal_isCritical === 'Critical' && b.goal_isCritical !== 'Critical') return -1;
        if (a.goal_isCritical !== 'Critical' && b.goal_isCritical === 'Critical') return 1;
        return 0;
      } else if (type === "goal_priority") {
        // Sort by priority - you can add custom priority logic here
        // For now, just maintain the order
        return 0;
      } else if (type === "goalendadate") {
        let date_a = "";
        let date_b = "";

        if (a.goal_cat_id === "GCAT-96" || a.goal_cat_id === "GCAT-124") {
          date_a = a.user_goal_end_date;
        } else {
          date_a = a.user_goal_start_date;
        }

        if (b.goal_cat_id === "GCAT-96" || b.goal_cat_id === "GCAT-124") {
          date_b = b.user_goal_end_date;
        } else {
          date_b = b.user_goal_start_date;
        }

        // Handle null/undefined dates
        if (!date_a || date_a === "None") date_a = "9999-12-31";
        if (!date_b || date_b === "None") date_b = "9999-12-31";

        return new Date(date_a) - new Date(date_b);
      }
      return 0;
    });

    if (type === "goal_priority") {
      goalsSortedData = [...topGoals, ...goalsSortedData];
    }

    setGoalAPIData(data => ({
      ...data,
      goalData: goalsSortedData
    }))
    setMenuDropDownOpen(false);
  };

  const goalAssetMappingAPI = async () => {
    setIsLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID found for goal asset mapping data');
        toastr.error("User ID not found. Please login again.");
        loginRedirectGuest();
        setIsLoading(false);
        return;
      }

      const response = await apiClient(`${ADVISORY_GET_GOAL_ASSET_MAPPING}?user_id=${userId}`, {
        method: 'GET'
      });
      if (response && response.status_code === "200") {
        // Handle screen header data if available
        if (response['data'][0]['screen_header'] && response['data'][0]['screen_header'].length > 0) {
          setScreenNoteData(data => ({
            ...data,
            goalAssetScreenData: response['data'][0]['screen_header'] || "In the table below you can view the goal amount, which is the amount of finance that is required to achieve your goal after taking into consideration the probable rate of inflation. We have also linked some of your assets and investments to this goal that will help you achieve it. This exercise is known as asset mapping for your goals. The most important takeaway of this table is that you can see whether your goal will be fully or partially achieved post asset mapping.",
            // goalAssetScreenData1: response.screenheader[0].field1 || "Goals with linked assets help you track progress towards achieving your financial objectives."
          }));
        } else {
          // Set default screen data if screenheader not available
          setScreenNoteData(data => ({
            ...data,
            goalAssetScreenData: "In the table below you can view the goal amount, which is the amount of finance that is required to achieve your goal after taking into consideration the probable rate of inflation. We have also linked some of your assets and investments to this goal that will help you achieve it. This exercise is known as asset mapping for your goals. The most important takeaway of this table is that you can see whether your goal will be fully or partially achieved post asset mapping.",
            goalAssetScreenData1: "Goals with linked assets help you track progress towards achieving your financial objectives."
          }));
        }

        let allGoals = [];

        var goalAsset = response['data'][0]['goal_to_assets']
        var goalassetdatanew = []
        var totalGoalAmt = 0
        var totalDiff = 0
        var totalAssetAmt = 0
        for (var i in goalAsset) {
          goalassetdatanew.push({ "name": goalAsset[i]['goal_details']['goal_name'], "data": goalAsset[i]["goal_details"], "assets": goalAsset[i]['linked_assets'], "surplusshortfall": goalAsset[i]["goal_details"]["balance_to_achieve"], "goal_priority": goalAsset[i]['goal_details']["goal_priority"], "user_goal_end_date": goalAsset[i]["goal_details"]["user_goal_end_date"], "category": goalAsset[i]["goal_details"]["category"] })

          var goalVal = goalAsset[i]['goal_details']['goal_future_value'];
          var goalAssetDiff = goalAsset[i]['goal_details']['balance_to_achieve'];
          totalGoalAmt = totalGoalAmt + goalVal;
          totalDiff = totalDiff + goalAssetDiff;
          if (goalAsset[i]["linked_assets"].length > 0) {
            goalAsset[i]["linked_assets"].forEach(asset => {
              var assetVal = asset['asset_future_value'];
              totalAssetAmt = totalAssetAmt + assetVal
            });
          }

        }
        goalassetdatanew.sort(generateSortFn([{ name: 'category' }, { name: 'goal_priority' }, { name: 'user_goal_end_date' }]));
        setGoalAPIData(data => ({
          ...data,
          goalAssetData: goalassetdatanew
        }))
        setTotalAmount((amt) => ({
          ...amt,
          totalGoalAmt: totalGoalAmt,
          totalAssetAmt: totalAssetAmt,
          totalDiffAmt: totalDiff
        }));



      }
      else {
        setGoalAPIData(data => ({
          ...data,
          goalAssetData: []
        }))
        setTotalAmount((amt) => ({
          ...amt,
          totalGoalAmt: 0,
          totalAssetAmt: 0,
          totalDiffAmt: 0
        }));
      }
    } catch (error) {
      console.error('Error fetching goal asset mapping:', error);

      if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        toastr.error("Network error: Unable to connect to the server. Please check your internet connection.");
      } else if (error.status === 401) {
        toastr.error("Authentication error: Please login again.");
        loginRedirectGuest();
      } else {
        toastr.error("Something went wrong while fetching goal asset mapping");
      }

      setGoalAPIData(data => ({
        ...data,
        goalAssetData: []
      }));
      setTotalAmount((amt) => ({
        ...amt,
        totalGoalAmt: 0,
        totalAssetAmt: 0,
        totalDiffAmt: 0
      }));
    } finally {
      setIsLoading(false);
    }
  }


  // Helper function to format goal year display
  const getGoalYearDisplay = (goal) => {
    if (goal.goal_isRecurring === 'Recurring') {
      const startYear = goal.user_goal_start_date?.split('-')[0] || '';
      const endYear = goal.user_goal_end_date?.split('-')[0] || '';
      return `${startYear} - ${endYear}`;
    } else if (goal.user_goal_start_date && goal.user_goal_start_date !== "None" && goal.user_goal_start_date !== null) {
      return goal.user_goal_start_date.split('-')[0];
    } else {
      return goal.user_goal_end_date?.split('-')[0] || '';
    }
  };

  const assetGoalMappingAPI = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID found for asset goal mapping data');
        return;
      }

      // Use the same API as goalAssetMappingAPI but set data to assetGoalData
      const response = await apiClient(`${ADVISORY_GET_ASSET_GOAL_MAPPING}?user_id=${userId}`, {
        method: 'GET'
      });

      if (response && response.status_code === "200") {
        // Set the asset goal data from the response
        setGoalAPIData(data => ({
          ...data,
          assetGoalData: response.data || []
        }));
      } else {
        console.error('Asset Goal Mapping API Error:', response?.message || 'Failed to fetch asset goal mapping');
        setGoalAPIData(data => ({
          ...data,
          assetGoalData: []
        }));
      }

    } catch (error) {
      console.error('Error in asset goal mapping API:', error);
      setGoalAPIData(data => ({
        ...data,
        assetGoalData: []
      }));
    }
  }
  const unlinkedAssetAPI = async () => {
    try {
      const userId = getUserId();
      if (!userId) {
        console.error('No user ID found for unlinked asset data');
        return;
      }

      // This API might need a different endpoint or approach
      // For now, we'll skip it since it's not critical for the main functionality

    } catch (error) {
      console.error('Error in unlinked asset API:', error);
    }
  }


  const [items, setItems] = useState([1, 2, 3, 4, 5, 6]);
  const renderArrows = ({ type, onClick, isEdge }) => {
    const pointer = type === consts.PREV ? <LeftArrow width={40} height={40} /> : <NextArrow width={40} height={40} />;
    return (
      <button
        onClick={onClick}
        disabled={isEdge}
        className="btnNextPrev"

        style={{
          zIndex: 1010,
          // width: 55,
          fill: "black",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .8s ease-in-out !default",
          position: "fixed",
          top: "80%",
          ...(type === "PREV" ? { left: "230px" } : { right: "15px" })
        }}

      >
        {pointer}
      </button>
    );
  };
  const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 1, itemsToScroll: 1 },
    { width: 768, itemsToShow: 1 },
    { width: 1200, itemsToShow: 1 },
  ];
  const priority_set = { "1": "Very High", "2": "High", "3": "Medium", "4": "Low", "5": "Very Low" };

  const onPrevStart = (prevItemObject, nextItemObject) => {
    if (nextItemObject?.index === 0) {
      setFirst(true);
    }
  };

  const onNextStart = (prevItemObject, nextItemObject) => {
    if (nextItemObject?.index !== 0) {
      setFirst(false);
    }
  };
  useEffect(() => {
    adjustHeight();
  }, [activeIndex]);

  useEffect(() => {
    if (tab === "tab4") {
      setTimeout(() => {
        adjustHeight();
      }, 1000);
    }
  }, [tab]);

  const adjustHeight = () => {
    if (document.querySelector(
      ".rec-carousel-item-" + (activeIndex - 1) + " .rec-item-wrapper"
    )) {
      var height = document.querySelector(
        ".rec-carousel-item-" + (activeIndex - 1) + " .rec-item-wrapper"
      ).offsetHeight;
      document.querySelector(".rec-carousel").style.height = "" + height + "px";
    }

  };
  const goalAsesetMappingAnalysisAPI = async () => {
    // part 1
    let response = await GetFinalGoalRecommendation();
    if (response) {
      setIsLoading(false);

      if (response.status_code == "200") {
        setInvestmentData(data => ({
          ...data,
          fintooNewInvestment: response['data']['section_text'] ? response['data']['section_text']['42'][0]['field3'] : '',
          fintooRecInvestment: response['data']['section_text'] ? response['data']['section_text']['42'][0]['field2'] : ''
        }));

        var goalAchieved = response['data']['goal_achieved']
        // var assetcatlist = [];
        var goalAssetMappingAnalysis = [];

        // var notesData = response['data']['notes_data'];
        // var rateAssumptions = response['data']['rate_assumptions'];
        var a = [];
        var goalsId = []

        if (goalAchieved) {

          goalAchieved.forEach(function (divss) {

            if (divss['goal_cat_uuid'] != "retirement" && divss['goal_cat_uuid'] != "contingency") { // if condition for retirement goal removal

              var id = divss['goal_id'];
              var goalFutureValue = divss['future_value'];
              var assetsLinkedByYouText = ''
              var assetsLinkedByFintooText = '';
              var assetsRecomByFintooText = '';
              var totalAssetsLinkedByYou = 0;
              var totalAssetsLinkedByFintoo = 0;
              var totalAssetsRecomByFintoo = 0;
              var totinvtypalAssetsLinkedByYou = 0;
              var goalLoanAmount = 0;
              var goalLoanName = "";

              if (divss["goal_partial_loan"] == "1") {
                goalLoanName = divss['name'] + " Loan";
                goalLoanAmount += (divss['future_value'] * divss["goal_loan_percentage"] / 100);
              }


              var yCategoris = [{ "id": id, "name": ["Goal Amount"], "data": [0, Math.floor(goalFutureValue)] }]

              if (divss['linked_goal_assets']) {
                divss['linked_goal_assets'].forEach(function (assetsss) {
                  switch (assetsss['investment_type']) {
                    case 0:
                      assetsLinkedByYouText = 'Assets Linked by You';
                      totalAssetsLinkedByYou = totalAssetsLinkedByYou + assetsss['asset_future_value'];
                      break;
                    case 1:
                      assetsLinkedByYouText = 'Assets Linked by You';
                      totalAssetsLinkedByYou = totalAssetsLinkedByYou + assetsss['asset_future_value'];
                      break;
                    case 2:
                      assetsLinkedByFintooText = 'Assets Linked by Fintoo';
                      totalAssetsLinkedByFintoo = totalAssetsLinkedByFintoo + assetsss['asset_data']['asset_future_value'];
                      break;
                    case 3:
                      if (assetsss['pv'] && assetsss['fv']) {
                        assetsRecomByFintooText = 'Assets Recommended by Fintoo';
                        totalAssetsRecomByFintoo = totalAssetsRecomByFintoo + assetsss['fv'];
                        break;
                      }
                    case 4:
                      assetsLinkedByFintooText = 'Assets Linked by Fintoo';
                      if (assetsss['asset_future_value']) {
                        totalAssetsLinkedByFintoo = totalAssetsLinkedByFintoo + assetsss['asset_future_value'];
                      }
                      break;
                    case 5:
                      if (assetsss['asset_future_value']) {
                        totalAssetsLinkedByFintoo = totalAssetsLinkedByFintoo + assetsss['asset_future_value'];
                      }
                      assetsLinkedByFintooText = 'Assets Linked by Fintoo';
                      break;
                  }


                });
              }
              var colorArr = [{ "id": id, "color": "#9ac449" }]
              if (assetsRecomByFintooText != '') {
                yCategoris.push({ "id": id, "name": ["Assets Recommended by Fintoo"], "data": [Math.floor(totalAssetsRecomByFintoo), 0] });
                colorArr.push({ "id": id, "color": "#042b62" })


              }

              if (goalLoanAmount != 0) {
                yCategoris.push({ "id": id, "name": [goalLoanName], "data": [Math.floor(goalLoanAmount), 0] });
                colorArr.push({ "id": id, "color": "#6610f2" })
              }

              if (assetsLinkedByFintooText != '') {
                yCategoris.push({ "id": id, "name": ["Assets Linked by Fintoo"], "data": [Math.floor(totalAssetsLinkedByFintoo), 0] });
                colorArr.push({ "id": id, "color": "#e1b624" })


              }

              if (assetsLinkedByYouText != '') {
                yCategoris.push({ "id": id, "name": ["Assets Linked by You"], "data": [Math.floor(totalAssetsLinkedByYou), 0] });
                colorArr.push({ "id": id, "color": "#f88221" })

              }

            }
            var xCategories = ['Assets Link', 'Goal Amount'];
            setXcategories(xCategories)
            setColorArray(colorArr)
            setYcategories(yCategoris)

          });
        }




        if (goalAchieved) {
          goalAchieved.forEach(function (divs) {
            var xMembers = [];
            var actualFlag = 0;
            var recomFlag = 0;
            var xSubcats = {};
            var yAxisFinalArray = [];
            if (divs.user_goal_start_date != null) {
              var gStartDate = new Date(divs.user_goal_start_date)
              var today = new Date()
              if (gStartDate < today) {
                var tday = today.getDate();
                var tmonth = today.getMonth() + 1; // Adding 1 since months are zero-based
                var tyear = today.getFullYear();
                if (tday < 10) {
                  tday = "0" + tday;
                }

                if (tmonth < 10) {
                  tmonth = "0" + tmonth;
                }
                divs.user_goal_start_date = tyear + "-" + tmonth + "-" + tday
              }
            }

            //  goal asset mapping analysis

            if (divs['goal_cat_uuid'] != "retirement" && divs['goal_cat_uuid'] != "contingency") {
              goalsId.push(divs['goal_id'])
              var linkedAssetsByYou = [];
              var linkedAssetsByFintoo = [];
              var newInvestmentByFintoo = [];
              var grossTotalFintoo = 0;
              var grossTotalNewinvest = 0;
              var grossTotalYou = 0;
              var totalGoalValueYou = divs['future_value'];;
              var totalM = 0;
              var totalMM = 0;
              var assetsNotes = [];
              var pvList = [];
              var goalPartialObj = {}
              if (divs["goal_partial_loan"] == "1") {
                goalPartialObj.asset_name = divs['name'] + " Loan";
                goalPartialObj.member = divs['member'];
                goalPartialObj.category = '';
                goalPartialObj.asset_future_value = (divs['future_value'] * divs["goal_loan_percentage"] / 100);
                grossTotalYou += (divs['future_value'] * divs["goal_loan_percentage"] / 100);
                linkedAssetsByYou.push(goalPartialObj);
              }
              if (divs['linked_goal_assets'] != undefined) {
                divs['linked_goal_assets'].forEach(function (assetss) {
                  var newObj = {};
                  switch (assetss['investment_type']) {
                    case 0:
                      newObj.goal_id = divs['goal_id']
                      newObj.asset_name = assetss['name'];
                      newObj.member = assetss['member'];
                      newObj.asset_id = assetss['asset_id'];
                      newObj.category = assetss['category'];
                      if (assetss['asset_future_value']) {
                        newObj.asset_future_value = assetss['asset_future_value'];
                        grossTotalYou += assetss['asset_future_value'];
                      }
                      linkedAssetsByYou.push(newObj);
                      // if (!assetcatlist.includes("" + assetss['asset_category_id'])) {
                      //   assetcatlist.push("" + assetss['asset_category_id']);
                      // }
                      // if (notesData[assetss['asset_category_id']]) {
                      //   var notesStr = notesData[assetss['asset_category_id']];
                      //   var rateAssume = rateAssumptions[assetss['asset_category_id']];
                      //   var finalNotesStr = notesStr.replace("equity_rate", rateAssume);
                      //   assetsNotes.push(finalNotesStr);
                      // }
                      break
                    case 1:
                      newObj.goal_id = divs['goal_id']
                      newObj.asset_name = assetss['name'];
                      newObj.asset_id = assetss['asset_id'];
                      newObj.member = assetss['member'];
                      newObj.category = assetss['category'];
                      if (assetss['asset_future_value']) {
                        newObj.asset_future_value = assetss['asset_future_value'];
                        grossTotalYou += assetss['asset_future_value'];
                      }
                      linkedAssetsByYou.push(newObj);
                      // if (notesData[assetss['asset_category_id']]) {
                      //   var notesStr = notesData[assetss['asset_category_id']];
                      //   var rateAssume = rateAssumptions[assetss['asset_category_id']];
                      //   var finalNotesStr = notesStr.replace("equity_rate", rateAssume);
                      //   assetsNotes.push(finalNotesStr);
                      // }
                      break
                    case 2:
                      newObj.goal_id = divs['goal_id']
                      newObj.asset_name = assetss['asset_data']['name'];
                      newObj.member = assetss['asset_data']['member'];
                      newObj.asset_id = assetss['asset_data']['asset_id'];
                      newObj.category = assetss['asset_data']['category'];
                      newObj.asset_future_value = assetss['oa_goal_fv'];
                      grossTotalFintoo += assetss['oa_goal_fv'];
                      linkedAssetsByFintoo.push(newObj);

                      // if (!assetcatlist.includes("107")) {
                      //   assetcatlist.push("107");
                      // }
                      // var finalNotesStr = notesData['107'];
                      // assetsNotes.push(finalNotesStr);
                      break
                    case 3:
                      if ('pv' in assetss) {
                        totalMM += assetss['pv'];
                        pvList.push(assetss['pv']);
                      }
                      if ('pmt' in assetss) {
                        grossTotalNewinvest += assetss['fv'];
                        totalM += assetss['pmt'];
                        newInvestmentByFintoo.push(assetss);
                      }
                      break
                    case 4:
                      newObj.goal_id = divs['goal_id']
                      newObj.asset_name = assetss['name'];
                      newObj.member = assetss['member'];
                      newObj.asset_id = assetss['asset_id'];
                      newObj.category = assetss['category'];
                      if (assetss['asset_future_value']) {
                        newObj.asset_future_value = assetss['asset_future_value'];
                        grossTotalFintoo += assetss['asset_future_value'];
                      }
                      linkedAssetsByFintoo.push(newObj);
                      // if (!assetcatlist.includes("" + assetss['asset_category_id'])) {
                      //   assetcatlist.push("" + assetss['asset_category_id']);
                      // }
                      // if (notesData[assetss['asset_category_id']]) {
                      //   var notesStr = notesData[assetss['asset_category_id']];
                      //   var rateAssume = rateAssumptions[assetss['asset_category_id']];
                      //   var finalNotesStr = notesStr.replace("equity_rate", rateAssume);
                      //   assetsNotes.push(finalNotesStr);
                      // }
                      break
                    case 5:
                      newObj.goal_id = divs['goal_id']
                      newObj.asset_name = assetss['name'];
                      newObj.member = assetss['member'];
                      newObj.asset_id = assetss['asset_id'];
                      newObj.category = assetss['category'];
                      if (assetss['asset_future_value']) {
                        newObj.asset_future_value = assetss['asset_future_value'];
                        grossTotalFintoo += assetss['asset_future_value'];
                      }

                      linkedAssetsByFintoo.push(newObj);
                      // if (notesData[assetss['asset_category_id']]) {
                      //   var notesStr = notesData[assetss['asset_category_id']];
                      //   var rateAssume = rateAssumptions[assetss['asset_category_id']];
                      //   var finalNotesStr = notesStr.replace("equity_rate", rateAssume);
                      //   assetsNotes.push(finalNotesStr);
                      // }
                      break

                  }


                });
              }

              var test = linkedAssetsByFintoo
              if (typeof test !== "undefined" && test != "") {
                a.push(test);
              }

              var img1 = goalImagesData1[divs['goal_cat_uuid']];
              var img2 = goalImagesData2[divs['goal_cat_uuid']];
              var surplusshortfall = 0;
              var diffAfterLinkange = 0;

              var dissurplusshortfall = 0;
              if (grossTotalYou > totalGoalValueYou) {
                surplusshortfall = grossTotalYou - totalGoalValueYou;
                dissurplusshortfall = surplusshortfall
              } else {
                surplusshortfall = totalGoalValueYou - grossTotalYou;
                dissurplusshortfall = surplusshortfall
                if (surplusshortfall != 0) {
                  surplusshortfall = "-" + surplusshortfall;
                }
              }

              diffAfterLinkange = (grossTotalYou + grossTotalFintoo) - totalGoalValueYou;


              if (assetsNotes) {
                var assetsNotess = [...new Set(assetsNotes)]
              } else {
                var assetsNotes = [];
              }

              var surpluss = []
              if (divs['surplus_usedIn']) {
                divs['surplus_usedIn'].forEach(element => {
                  surpluss.push(element['goal_name'])
                });
              }

              var goalNewObj = { 'goal_id': divs['goal_id'], 'goal_isRecurring': divs['goal_isRecurring'], 'goal_name': divs['name'], 'user_name': divs['member_name'], 'surplus_usedIn': surpluss.join(", "), 'goal_presend_value': divs['present_value'], 'goal_future_value': divs['future_value'], 'user_goal_start_date': divs['user_goal_start_date'], 'user_goal_end_date': divs['user_goal_end_date'], 'goal_inflation': divs['goal_inflation'], 'total_asset_value_by_you': grossTotalYou, 'surplusshortfall': surplusshortfall, 'dissurplusshortfall': dissurplusshortfall, 'total_asset_value_by_fintoo': grossTotalFintoo, 'img1': img1, 'img2': img2, 'total_m': totalM, 'total_mm': totalMM, 'total_y': grossTotalNewinvest, 'linked_assets_by_you': linkedAssetsByYou, 'linked_assets_by_fintoo': linkedAssetsByFintoo, 'new_investment_by_fintoo': newInvestmentByFintoo, 'assets_notes': assetsNotess, 'pv_list': pvList, "diff_afterlinkange": diffAfterLinkange }

              goalAssetMappingAnalysis.push(goalNewObj);

            }

            if (divs['goaltype'] == 'preRetirementGoals') {
              if (divs['linked_goal_assets']) {
                if (divs['linked_goal_assets'].length > 0) {

                  divs['linked_goal_assets'].forEach(function (assets) {

                    if ((assets['investment_type'] == '0' || assets['investment_type'] == '1') && actualFlag == 0) {
                      xMembers[0] = 'Existing Asset Link';
                      actualFlag = 1;

                    } else if ((assets['investment_type'] != '1' && assets['investment_type'] != '0') && recomFlag == 0) {
                      xMembers[1] = 'Recommended amount';
                      recomFlag = 1;

                    }
                    if (assets['investment_type'] == '0' || assets['investment_type'] == '1') {
                      xSubcats[0] = '0';
                    } else {
                      xSubcats[assets['investment_type']] = assets['investment_type'];
                    }

                  });

                  if (recomFlag == '1' && actualFlag == '0') { //if no user added assets then by added by default
                    xMembers[0] = 'Existing Asset Link';
                    xSubcats[1] = 1;
                  }
                  // var xSubcatsarr = $.map(xSubcats, function (value, index) {
                  //     return [value];
                  // });
                  var xSubcatsarr = Object.keys(xSubcats)

                  xSubcatsarr.forEach(function (val, index) {
                    var datato = new Array(xMembers.length).fill(0);
                    if (val == '0' || val == '1') {
                      var indexnew = 'Asset linked by user';
                    } else if (val == '2') {
                      var indexnew = 'Overachieved goals linkage';
                    } else if (val == '4') {
                      var indexnew = 'Unlinked assets linkage';
                    } else if (val == '3') {
                      var indexnew = 'New investments';
                    }
                    yAxisFinalArray[index] = { 'name': indexnew, 'data': datato };

                  });




                  divs['linked_goal_assets'].forEach(function (assets) {
                    if (assets['investment_type']) {
                      assets['investment_type'] = assets['investment_type'].toString()
                      if (assets['investment_type'] == '0' || assets['investment_type'] == '1') {

                        var getMemberInndex_1 = xMembers.indexOf('Recommended amount');
                        var getMemberInndex = xMembers.indexOf('Existing Asset Link');
                        var getInndexY = xSubcatsarr.indexOf('0');
                        yAxisFinalArray[getInndexY]['data'][getMemberInndex] = yAxisFinalArray[getInndexY]['data'][getMemberInndex] + parseFloat(assets['asset_future_value']);
                        yAxisFinalArray[getInndexY]['data'][getMemberInndex] = parseFloat(yAxisFinalArray[getInndexY]['data'][getMemberInndex].toFixed(2));
                        if (getMemberInndex_1) {
                          yAxisFinalArray[getInndexY]['data'][getMemberInndex_1] = yAxisFinalArray[getInndexY]['data'][getMemberInndex_1] + parseFloat(assets['asset_future_value']);
                          yAxisFinalArray[getInndexY]['data'][getMemberInndex_1] = parseFloat(yAxisFinalArray[getInndexY]['data'][getMemberInndex_1].toFixed(2));
                        }
                      } else if (assets['investment_type'] == '2') {
                        var getMemberInndex = xMembers.indexOf('Recommended amount');
                        var getInndexY = xSubcatsarr.indexOf(assets['investment_type']);

                        yAxisFinalArray[getInndexY]['data'][getMemberInndex] = yAxisFinalArray[getInndexY]['data'][getMemberInndex] + parseFloat(assets['oa_goal_fv']);

                        yAxisFinalArray[getInndexY]['data'][getMemberInndex] = parseFloat(yAxisFinalArray[getInndexY]['data'][getMemberInndex].toFixed(2));
                      } else if (assets['investment_type'] == '4') {
                        var getMemberInndex = xMembers.indexOf('Recommended amount');
                        var getInndexY = xSubcatsarr.indexOf(assets['investment_type']);

                        yAxisFinalArray[getInndexY]['data'][getMemberInndex] = yAxisFinalArray[getInndexY]['data'][getMemberInndex] + parseFloat(assets['asset_future_value']);

                        yAxisFinalArray[getInndexY]['data'][getMemberInndex] = parseFloat(yAxisFinalArray[getInndexY]['data'][getMemberInndex].toFixed(2));

                      } else if (assets['investment_type'] == '3' && typeof (assets['pmt']) !== 'undefined') {
                        var getMemberInndex = xMembers.indexOf('Recommended amount');
                        var getInndexY = xSubcatsarr.indexOf(assets['investment_type']);
                        yAxisFinalArray[getInndexY]['data'][getMemberInndex] = yAxisFinalArray[getInndexY]['data'][getMemberInndex] + parseFloat(assets['fv']);

                        yAxisFinalArray[getInndexY]['data'][getMemberInndex] = parseFloat(yAxisFinalArray[getInndexY]['data'][getMemberInndex].toFixed(2));
                      }
                    }
                  });
                }
              }


              if (yAxisFinalArray.length > 0) {
                var r = yAxisFinalArray.filter(value => value['data'].every(e => e == 0));
                yAxisFinalArray = yAxisFinalArray.filter(val => !r.includes(val));

              }


            }
            if (yCategories) {
              if (yCategories.length > 0) {
                goalAssetMappingAnalysis.forEach(goal => {
                  goal['y_categories'] = getYCategories(goal.goal_id)
                  goal['colorArr'] = getColorArray(goal.goal_id)
                })
                setGoalAPIData(data => ({
                  ...data,
                  goalAssetMappingData: goalAssetMappingAnalysis
                }))

              }
            }
            // setGoalAPIData(data=>({
            //   ...data,
            //   goalAssetMappingData:goalAssetMappingAnalysis
            // }))



          });
        }
      }
      else {
        setIsLoading(false)
        setInvestmentData(data => ({
          ...data,
          fintooNewInvestment: '',
          fintooRecInvestment: ''
        }))
      }
    }
  };

  return (
    <DatagatherReportLayout>
      <FintooLoader isLoading={isLoading} />

      <div className="reports ">
        <div className="">
          <div className="background-div">
            <div className="bg active" id="report-bg-goal"></div>
          </div>
          <div className="white-box">
            <div className="d-flex justify-content-md-center tab-box">
              <div className="d-flex top-tab-menu noselect">
                <div
                  className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                  onClick={() => setTab("tab1")}
                >
                  <div className="tab-menu-title">GOAL ANALYSIS</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                  onClick={() => setTab("tab2")}
                >
                  <div className="tab-menu-title">GOAL ASSET MAPPING</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab3" ? "active" : ""}`}
                  onClick={() => setTab("tab3")}
                >
                  <div className="tab-menu-title">ASSET GOAL MAPPING</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab4" ? "active" : ""}`}
                  onClick={() => setTab("tab4")}
                >
                  <div className="tab-menu-title">
                    GOAL ASSET MAPPING ANALYSIS
                  </div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab5" ? "active" : ""}`}
                  onClick={() => setTab("tab5")}
                >
                  <div className="tab-menu-title">WHAT IF ANALYSIS</div>
                </div>
              </div>
            </div>

            <div>

              <div className={tab == "tab1" ? "d-block" : "d-none"}>
                <div
                  className="goalSummaryHolder "
                >
                  {goalAPIData.goalData.length > 0 ? (
                    <div className="">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 className="rTitle" style={{ marginTop: 20 }}>
                            <img
                              alt="goal analysis"
                              className="title-icon"
                              src={imagePath + "/static/media/DG/reports/goal-analysis/goal-analysis.svg"}
                            />
                            Goal Analysis
                          </h4>
                        </div>

                        <div className="sorting d-inline-block" ref={dropdownRef}>
                          <a
                            className="color-blue font-bold sort-by" style={{ textTransform: "uppercase" }}
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
                      </div>

                      <div
                        className="rContent "

                      >
                        <p dangerouslySetInnerHTML={{ __html: screenNoteData.goalScreenData ? screenNoteData.goalScreenData : '' }}></p>
                      </div>
                      <h4 className="rTitle">Summary</h4>
                      <div className="table-responsive rTable">
                        <table className="bgStyleTable">
                          <tbody>
                            <tr className="color">
                              <td>Goal name</td>
                              <td>Category</td>
                              <td>Priority</td>
                              <td>Frequency</td>
                              <td>Goal Year</td>
                              <td>Present Value (₹)</td>
                              <td>Cumulative Present Value</td>
                              <td>Future Value (₹)</td>
                              <td>Inflation (%)</td>
                            </tr>
                            {goalAPIData.goalData.map(goal => (
                              <tr key={goal.goal_id} className="">
                                <td style={{ backgroundColor: goal.goal_isCritical === 'Critical' ? '#FFD3CD' : '#ccd5e0' }} className="">{toPascalCase(goal.name)}</td>
                                <td style={{ backgroundColor: goal.goal_isCritical === 'Critical' ? '#FFD3CD' : '#ccd5e0' }} className="">{goal.goal_cat_name}</td>
                                <td style={{ backgroundColor: goal.goal_isCritical === 'Critical' ? '#FFD3CD' : '#ccd5e0' }} className="">{goal.goal_isCritical === 'Critical' ? 'Very High' : 'Medium'}</td>
                                <td style={{ backgroundColor: goal.goal_isCritical === 'Critical' ? '#FFD3CD' : '#ccd5e0' }} className="">{goal.goal_isRecurring || 'One-time'}</td>
                                <td
                                  style={{ backgroundColor: goal.goal_isCritical === 'Critical' ? '#FFD3CD' : '#ccd5e0' }}
                                >
                                  {getGoalYearDisplay(goal)}
                                </td>

                                <td style={{ backgroundColor: goal.goal_isCritical === 'Critical' ? '#FFD3CD' : '#ccd5e0' }} className=""> {numberFormat(goal.present_value, 0)}</td>
                                <td style={{ backgroundColor: goal.goal_isCritical === 'Critical' ? '#FFD3CD' : '#ccd5e0' }} className="">{numberFormat(goal.cumulative_present_value, 0)}</td>
                                <td style={{ backgroundColor: goal.goal_isCritical === 'Critical' ? '#FFD3CD' : '#ccd5e0' }} className="">{numberFormat(goal.future_value, 0)}</td>
                                <td style={{ backgroundColor: goal.goal_isCritical === 'Critical' ? '#FFD3CD' : '#ccd5e0' }} className="">{numberFormat(goal.goal_inflation, 0)}</td>
                              </tr>
                            ))}

                            <tr className="bold top-line total-value">
                              <td colSpan={5}>Total Goal Amount</td>
                              <td className="">{totalAmt.totalPresentAmt ? numberFormat(totalAmt.totalPresentAmt, 0) : ''}</td>
                              <td className="">{totalAmt.totalCumulativeAmt ? numberFormat(totalAmt.totalCumulativeAmt, 0) : ''}</td>
                              <td className="">{totalAmt.totalFutureAmt ? numberFormat(totalAmt.totalFutureAmt, 0) : ''}</td>
                              <td></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingLeft: ".5em",
                          }}
                        >
                          <span
                            className="dot"
                            style={{ backgroundColor: "#ffd3cd" }}
                          />
                          <b
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              paddingLeft: ".5em",
                            }}
                          >
                            Critical
                          </b>
                          <span
                            className="dot"
                            style={{
                              backgroundColor: "#ccd5e0",
                              marginLeft: "1em",
                            }}
                          />
                          &nbsp;
                          <b
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              paddingLeft: ".5em",
                            }}
                          >
                            Non Critical
                          </b>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="no-data-found text-center">
                      <div className="container">
                        <div className="row justify-content-center align-items-center">
                          <div className="col-md-10">
                            <img
                              alt="Data not found"
                              src={imagePath + "/static/media/DG/data-not-found.svg"}
                            />
                            <p>
                              Since you missed to fill in the required information
                              which is needed here, we are not able to show you
                              this section. Kindly click on below button to
                              provide all the necessary inputs. Providing all the
                              information as asked will ensure more accurate
                              financial planning report. Once you fill in the
                              data, same will be reflected here.
                            </p>
                            <a
                              href={process.env.PUBLIC_URL + "/datagathering/goals"}
                              target="_blank"
                              className="link"
                            >
                              Complete Goals
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="row py-2">
                    <div className=" text-center">
                      <div>
                        <div className="btn-container">
                          <div className="d-flex justify-content-center">
                            <Link
                              to={
                                process.env.PUBLIC_URL +
                                "/report/assets-liabilities"
                              }
                            >
                              <div className="previous-btn form-arrow d-flex align-items-center">
                                <span
                                  className="hover-text"
                                  style={{ maxWidth: 100 }}
                                >
                                  Previous&nbsp;
                                </span>
                                <FaArrowLeft />
                              </div>
                            </Link>
                            {/* <button className="default-btn gradient-btn save-btn">
                                  Save & Add More
                                </button> */}
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
              <div className={tab == "tab2" ? "d-block" : "d-none"}>
                <div style={{ marginTop: 15 }} className="">
                  {/* Goal Asset Mapping content */}
                  {goalAPIData.goalAssetData && goalAPIData.goalAssetData.length > 0 && (
                    <>
                      <h4 className="rTitle " style={{ marginTop: 20 }}>
                        <img
                          className="title-icon"
                          src={imagePath + "/static/media/DG/reports/goal-analysis/goal-analysis.svg"}
                        />
                        Goal Asset Mapping
                      </h4>
                      <div className="rContent  ">
                        <p dangerouslySetInnerHTML={{ __html: screenNoteData.goalAssetScreenData ? screenNoteData.goalAssetScreenData : '' }}></p>
                      </div>
                      <div
                        className="table-responsive rTable "
                      >
                        <table className="bgStyleTable">
                          <tbody className="RemoveBorderRight">
                            <tr className="color">
                              <td>Goal Name</td>
                              <td>Goal Value (₹)</td>
                              <td>Linked Asset Name</td>
                              <td>Linked Asset Future Value (₹)</td>
                              <td>Surplus / (Shortfall) (₹)</td>
                            </tr>
                            {goalAPIData.goalAssetData.map((goal, index) => {
                              const totalAssetValue = goal.assets.reduce((sum, asset) => sum + asset.asset_future_value, 0);
                              const renderSurplusShortfall = (value) => value >= 0 ? numberFormat(value, 0) : <span style={{ color: "red" }}>({numberFormat(Math.abs(value), 0)})</span>;

                              return (
                                <tr key={goal.goal_id || index}>
                                  <td>{goal.data.goal_for} - {toPascalCase(goal.name)}</td>
                                  <td>{numberFormat(goal.data.goal_future_value, 0)}</td>
                                  <td>
                                    {goal.assets.length > 0 ? (
                                      goal.assets.map((asset, i) => (
                                        <div key={i} style={{ marginBottom: i < goal.assets.length - 1 ? '2px' : '0' }}>
                                          {asset.asset_name} / {asset.member_name}
                                        </div>
                                      ))
                                    ) : <span>No Assets Linked</span>}
                                  </td>
                                  <td>{goal.assets.length > 0 ? numberFormat(totalAssetValue, 0) : '0'}</td>
                                  <td>{renderSurplusShortfall(goal.surplusshortfall)}</td>
                                </tr>
                              );
                            })}
                            <tr className="bold top-line total-value">
                              <td>Total</td>
                              <td>{numberFormat(totalAmt.totalGoalAmt, 0)}</td>
                              <td></td>
                              <td>{numberFormat(totalAmt.totalAssetAmt, 0)}</td>
                              <td>{totalAmt.totalDiffAmt >= 0 ? numberFormat(totalAmt.totalDiffAmt, 0) : <span style={{ color: "red" }}>({numberFormat(Math.abs(totalAmt.totalDiffAmt), 0)})</span>}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  

                  {goalAPIData.goalAssetData.length == 0 &&
                    <div
                      className="no-data-found text-center "
                    >
                      <div className="container">
                        <div className="row justify-content-center align-items-center">
                          <div className="col-md-10">
                            <img
                              alt="Data not found"
                              src={imagePath + "/static/media/DG/data-not-found.svg"}
                            />

                            <p>
                              Since you missed to fill in the required information
                              which is needed here, we are not able to show you
                              this section. Kindly click on below button to
                              provide all the necessary inputs. Providing all the
                              information as asked will ensure more accurate
                              financial planning report. Once you fill in the
                              data, same will be reflected here.
                            </p>
                            <a
                              href={process.env.PUBLIC_URL + "/datagathering/goals"}
                              target="_blank"
                              className="link"
                            >
                              Complete Goals
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  
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
                              <span className="hover-text">&nbsp;Previous</span>
                            </div>
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
              </div>
              <div className={tab == "tab3" ? "d-block" : "d-none"}>
                <div style={{ marginTop: 15 }} className="">
                  {/* ngIf: assetgoaldata.length > 0 */}
                  {goalAPIData.assetGoalData && goalAPIData.assetGoalData.length > 0 && (
                    <>
                      <h4 className="rTitle " style={{ marginTop: 20 }}>
                        <img
                          className="title-icon"
                          src={imagePath + "/static/media/DG/reports/goal-analysis/goal-analysis.svg"}
                        />
                        Asset Goal Mapping
                      </h4>
                      <div className="rContent  ">
                        <p dangerouslySetInnerHTML={{ __html: screenNoteData.goalAssetScreenData ? screenNoteData.goalAssetScreenData : '' }}></p>

                      </div>
                      <div
                        className="table-responsive rTable "
                      >
                        <table className="bgStyleTable">
                          <tbody className="RemoveBorderRight">
                            <tr className="color">
                              <td>Name of Assets</td>
                              <td>Category</td>
                              <td>Sub-Category</td>
                              <td>Name of the Holder</td>
                              <td>Linked / Unlinked</td>
                              <td>Current Value / Maturity Value (₹)</td>
                              <td>Goal Name</td>
                            </tr>{" "}
                            {goalAPIData.assetGoalData && goalAPIData.assetGoalData.length > 0 ? (
                              goalAPIData.assetGoalData.map(asset => (
                                <tr className="" key={asset.asset_name}>
                                  <td>{asset.asset_name}</td>
                                  <td>{asset.category_name}</td>
                                  <td>{asset.sub_category_name}</td>
                                  <td>{toPascalCase(asset.name_holder)}</td>
                                  <td style={{ textTransform: "capitalize" }}>{asset.linked_unlinked}</td>
                                  <td className="">{numberFormat(asset.maturity_value, 0)}</td>
                                  <td>
                                    <table>
                                      {asset.goal_name.length > 0 &&
                                        asset.goal_name.map(goal => (
                                          <tr key={goal}>
                                            <td className="child">{toPascalCase(goal)}</td>
                                          </tr>
                                        ))}
                                    </table>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>Data not available</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}


                  {goalAPIData.nonlinkableUnlinkedAsset != '' && <>
                    <h4 className="rTitle  mt-5">
                      <img

                        className="title-icon"
                        //  src={imagePath + "/static/media/DG/reports/goal-analysis/unlink-asset.svg"
                        src={imagePath + "/static/media/DG/reports/goal-analysis/unlink-asset.svg"}
                      />
                      Unlink Assets (Non-Linkable)
                    </h4>
                    <div className="rContent  ">
                      <p dangerouslySetInnerHTML={{ __html: screenNoteData.sectionHeader ? screenNoteData.sectionHeader : '' }}></p>
                    </div>
                    <h4 className="rTitle mt-5">
                      Summary Reports of Your Unlinked Assets (Non-Linkable)
                    </h4>
                  </>
                  }
                  {goalAPIData.nonlinkableUnlinkedAsset.length > 0 &&
                    <div className="table-responsive rTable ">
                      <table className="bgStyleTable">
                        <tbody>
                          <tr className="color">
                            <td>Owner</td>
                            <td>Category</td>
                            <td>Sub-Category</td>
                            <td>Asset Name</td>
                            <td>Current Value / Maturity Amount (₹)</td>
                          </tr>
                          {goalAPIData.nonlinkableUnlinkedAsset.map(asset => (
                            <tr
                              className=""
                            >
                              <td className="">{toPascalCase(asset.member)}</td>
                              <td className="">{asset.category == '' ? 'Insurance' : asset.category}</td>
                              <td className="">{asset.subcategory}</td>
                              <td className="">{asset.name}</td>
                              <td className="">{numberFormat(asset.cv, 0)}</td>
                            </tr>
                          ))}

                          {goalAPIData.nonlinkableUnlinkedAsset.length == 0 &&
                            <td colspan="5" style={{ textAlign: "center" }}>You don't have any unlinked assets(non-linkable).</td>

                          }
                        </tbody>
                      </table>
                    </div>
                  }
                  {goalAPIData.nonlinkableUnlinkedAsset.length == 0 && goalAPIData.goalAssetData.length == 0 &&
                    <div
                      className="no-data-found text-center "
                    >
                      <div className="container">
                        <div className="row justify-content-center align-items-center">
                          <div className="col-md-10">
                            <img
                              alt="Data not found"
                              src={imagePath + "/static/assets/img/data-not-found.svg"}
                            />

                            <p>
                              Since you missed to fill in the required information
                              which is needed here, we are not able to show you
                              this section. Kindly click on below button to
                              provide all the necessary inputs. Providing all the
                              information as asked will ensure more accurate
                              financial planning report. Once you fill in the
                              data, same will be reflected here.
                            </p>
                            <a
                              href={
                                process.env.PUBLIC_URL + "/datagathering/goals"
                              }
                              target="_blank"
                              className="link"
                            >
                              Complete Goals
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  <div style={{ paddingBottom: "5%", clear: "both" }} />
                  <div className="container mt-7">
                    <div className="notes_sec_div mt-6">
                      <div className="notes_head_div">
                        <i />
                        <span>Notes</span>
                      </div>
                      <br></br>
                      <div className="hidebglist" dangerouslySetInnerHTML={{ __html: screenNoteData.goalScreenData ? screenNoteData.goalScreenData : '' }}></div>
                      {/* dangerouslySetInnerHTML={{ __html: screenNoteData.assetGoalNoteData ? screenNoteData.assetGoalNoteData : '' }}>
                      </div> */}


                    </div>
                  </div>
                  <div className="row py-2">
                    <div className=" text-center">
                      <div>
                        <div className="btn-container">
                          <div className="d-flex justify-content-center">
                            <div
                              className="previous-btn form-arrow d-flex align-items-center"
                              onClick={() => setTab("tab2")}
                            >
                              <FaArrowLeft />
                              <span className="hover-text">&nbsp;Previous</span>
                            </div>
                            <div
                              className="next-btn form-arrow d-flex align-items-center"
                              onClick={() => setTab("tab4")}
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
              <div className={tab == "tab4" ? "d-block" : "d-none"}>
                <div
                  className="asset-mapping "
                  style={{ marginTop: 15 }}
                >
                  {
                    //console.log("investmentData", investmentData)
                  }
                  {goalAPIData.goalAssetMappingData && goalAPIData.goalAssetMappingData.length > 0 ? (
                    <div
                      className=""
                    >
                      <div className="step-progress" style={{ float: "none" }}>
                        <svg
                          data-name="Layer 1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 50 50"
                        >
                          <circle
                            className="cls-1"
                            cx={25}
                            cy={25}
                            r="22.44"
                            fill="none"
                            stroke="#042b62"
                            strokeWidth={1}
                            style={{ opacity: "0.1" }}
                          />
                          <circle
                            id="svgBar"
                            className="cls-1"
                            cx={25}
                            cy={25}
                            r="22.44"
                            fill="transparent"
                            stroke="#042b62"
                            strokeWidth={2}
                            strokeDasharray={141}
                            strokeDashoffset={0}
                          />
                        </svg>
                        <span className="value ">
                          <span id="svgStepValues">{activeIndex}</span>/{goalAPIData.goalAssetMappingData ? goalAPIData.goalAssetMappingData.length : 1}
                        </span>
                      </div>
                      <div className="row justify-content-center">
                        <div className="col-md-11">
                          <h4 className="rTitle">
                            <img
                              className="title-icon"
                              src={imagePath + "/static/media/DG/reports/goal-analysis/asset-mapping.svg"}
                            />
                            Goal Asset Mapping Analysis
                          </h4>
                          <div className="rContent" >
                            <p dangerouslySetInnerHTML={{ __html: screenNoteData.goalAssetScreenData1 ? screenNoteData.goalAssetScreenData1 : '' }}></p>
                          </div>
                        </div>
                      </div>
                      <div className="invertment-goal-mapping">
                        <Carousel
                          breakPoints={breakPoints}
                          renderArrow={renderArrows}
                          onPrevStart={onPrevStart}
                          onNextStart={onNextStart}
                          onChange={(v, i) => {
                            setActiveIndex(++i);
                          }}
                        >
                          {goalAPIData.goalAssetMappingData?.length > 0 && goalAPIData.goalAssetMappingData.map((goal, index) => (

                            <Item key={index}>
                              <div
                                className="owl-item active"
                              // style={{ width: "1007.09px" }}

                              >
                                {
                                  //console.log("goalAssetMappingData", goal)
                                }
                                <div
                                  owl-carousel-item=""
                                  id={index}
                                  className="item "
                                >
                                  <div className="row" style={{ margin: 0 }}>
                                    <div className="col-md-5">
                                      <div className="row goal-name-cls" style={{ top: goal.img1 == 'goal-property1.svg' ? '1rem' : goal.img1 == 'goal-vehicle1.svg' ? '8rem' : goal.img1 == 'goal-others1.svg' ? '7rem' : goal.img1 == 'goal-marriage1.svg' ? '5.5rem' : goal.img1 == 'goal-education1.svg' ? '5rem' : '3.5rem' }}>
                                        <div className="col-md-2 circle-cls">
                                          <img
                                            style={{
                                              width: "90px",
                                              zIndex: 999,
                                              position: "absolute",
                                            }}
                                            className=""
                                            src={imagePath + "/static/media/DG/reports/goal-analysis/" + goal.img1}
                                          />
                                        </div>
                                        <div className="col-md-8 goal-text-cls" style={{ marginLeft: goalAPIData.goalAssetMappingData.length == 1 ? "4rem" : "" }}>
                                          <div className="">
                                            {goal.goal_name}
                                          </div>
                                          <div style={{ fontSize: 18 }}>
                                            <b className="">
                                              {toPascalCase(goal.user_name)}
                                            </b>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="col-md-4" />
                                    <div className="col-md-3">
                                      <img
                                        style={{ width: 175 }}
                                        className=""
                                        src={"/static/media/DG/reports/goal-analysis/" + goal.img2}
                                      />
                                    </div>
                                  </div>
                                  <div className="row goal-bar">
                                    {/* <h4 class="col-12" style="text-transform: capitalize;">{{ data.name }} {{ data.data.goal_for ? ' - '+data.data.goal_for : '' }}</h4> */}
                                    <div className="col-md col-12 text-600 text-center border-right-cls">
                                      <div className="white-cls" style={{}}>
                                        Present Value
                                      </div>
                                      <div>
                                        <img
                                          style={{}}
                                          className="wid-img-cls"
                                          src={imagePath + "/static/media/DG/reports/goal-analysis/rupee.svg"}

                                        />
                                        <b className="white-cls ps-2">{numberFormat(goal.goal_presend_value, 0)}</b>
                                      </div>
                                    </div>
                                    <div className="col-md text-600 text-center col-12 border-right-cls">
                                      <div className="white-cls" style={{}}>
                                        Goal Future Value
                                      </div>
                                      <div>
                                        <img
                                          style={{}}

                                          className="wid-img-cls"
                                          src={imagePath + "/static/media/DG/reports/goal-analysis/rupee.svg"}
                                        />
                                        <b className="white-cls ps-2">{numberFormat(goal.goal_future_value, 0)}</b>
                                      </div>
                                    </div>
                                    <div className="col-md text-600 text-center col-12 border-right-cls">
                                      <div className="white-cls" style={{}}>
                                        Goal Year
                                      </div>
                                      <div>
                                        <img
                                          style={{}}

                                          className="wid-img-cls"
                                          src={imagePath + "/static/media/DG/reports/goal-analysis/calandar.svg"}
                                        />
                                        {goal.goal_isRecurring == 'Recurring' &&
                                          <>
                                            <b className="white-cls ps-2">{goal.user_goal_start_date.split('-')[0]}</b><strong className="white-cls"> -</strong><b className="white-cls ps-2">{goal.user_goal_end_date.split('-')[0]}</b>
                                          </>
                                        }

                                        {goal.goal_isRecurring !== 'Recurring' &&
                                          <>
                                            <b className="white-cls ps-2">{(goal.user_goal_start_date != "None" && goal.user_goal_start_date != null) ? goal.user_goal_start_date.split("-").reverse().join("-") : goal.user_goal_end_date.split("-").reverse().join("-")}</b>
                                          </>
                                        }
                                      </div>
                                    </div>
                                    <div
                                      className="col-md text-600 text-center col-12 align-center-cls"
                                      style={{ width: "10%" }}
                                    >
                                      <div className="white-cls " style={{}}>
                                        Inflation
                                      </div>
                                      <div>
                                        <img
                                          style={{}}
                                          className="wid-img-cls"
                                          src={imagePath + "/static/media/DG/reports/goal-analysis/graph.svg"}
                                        />
                                        <b className="white-cls ps-2">{goal.goal_inflation} %</b>
                                      </div>
                                    </div>
                                  </div>
                                  {goal.linked_assets_by_you?.length >= 0 &&
                                    <>
                                      <div className="row">
                                        <div className="col-md-5" style={{}}>
                                          <img
                                            style={{ width: 50, float: "right" }}

                                            className="linked-img-cls"
                                            src={imagePath + "/static/media/DG/reports/goal-analysis/Linked_Assets.svg"}
                                          />
                                        </div>
                                        <div
                                          className="col-md-6"
                                          style={{ padding: 0 }}
                                        >
                                          <h2
                                            className="smaller-Header"
                                            style={{ marginTop: 0 }}
                                          >
                                            Linked Assets by You
                                          </h2>
                                        </div>
                                      </div>
                                      <p className="mt-2">
                                        The below table highlights the assets manually
                                        linked by you with your desired financial goals.
                                      </p>
                                      <div className="container">
                                        <table
                                          className="bgStyleTable splitForPrint"
                                          style={{
                                            tableLayout: "fixed",
                                            marginTop: 20,
                                            textAlign: "center"
                                          }}
                                        >
                                          <thead>
                                            <tr className="color">
                                              <td>Linked Assets</td>
                                              <td>Linked Assets Future Value (₹)</td>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {goal.linked_assets_by_you?.length > 0 &&
                                              goal.linked_assets_by_you.map((asset, index) => (
                                                <tr className="top-line " key={index}>
                                                  {asset.category != '' ?
                                                    <td className="">
                                                      {asset.asset_name} | {asset.category} | {asset.member}
                                                    </td> :
                                                    <td className="">
                                                      {asset.asset_name}  | {asset.member}
                                                    </td>
                                                  }
                                                  <td className="">{numberFormat(asset.asset_future_value, 0)}</td>
                                                </tr>
                                              ))
                                            }
                                            {
                                              goal.linked_assets_by_you?.length == 0 &&
                                              <tr>
                                                <td style={{ textAlign: "center" }} colspan="2">No Asset Linked</td>
                                              </tr>
                                            }
                                            {
                                              goal.linked_assets_by_you?.length > 0 &&
                                              <tr className="top-line ">
                                                <td>Gross Total</td>
                                                <td>{numberFormat(goal.total_asset_value_by_you, 0)}</td>
                                              </tr>
                                            }
                                            <tr className="bold top-line">
                                              <td>{goal.surplusshortfall > 0 ? 'Surplus' : '(Shortfall)'} ( Gross Total - Goal Future Value )</td>
                                              {goal.surplusshortfall > 0 &&
                                                <td>{numberFormat(goal.dissurplusshortfall, 0)}</td>
                                              }
                                              {goal.surplusshortfall < 0 &&
                                                <td className="goal-asset-red-class">({numberFormat(goal.dissurplusshortfall, 0)})</td>
                                              }
                                            </tr>
                                            <tr className="top-line">
                                            </tr>
                                          </tbody>
                                          <tfoot>
                                            <tr>
                                              <td style={{ padding: 0 }} colSpan={2} />
                                            </tr>
                                          </tfoot>
                                        </table>
                                      </div>
                                    </>
                                  }
                                  {
                                    (goal.total_asset_value_by_fintoo != 0 || goal.total_y != 0) &&
                                    <div
                                      className="container "
                                      style={{ marginTop: "80px" }}
                                    >
                                      <div className="recommen_sec_div">
                                        <div
                                          className="rec_head_div"
                                          style={{ left: "36%" }}
                                        >
                                          <i />
                                          <span>Fintoo Recommends</span>
                                        </div>
                                        <div className="inner_text_div">
                                          {goal.total_asset_value_by_fintoo != 0 &&
                                            <p dangerouslySetInnerHTML={{ __html: investmentData.fintooRecInvestment ? investmentData.fintooRecInvestment : '' }}></p>
                                          }
                                        </div>
                                        {goal.total_asset_value_by_fintoo != 0 &&
                                          <div
                                            className="table_div "
                                          >
                                            <table className="bgStyleTable splitForPrint">
                                              <thead>
                                                <tr>
                                                  <th style={{ borderRight: "none" }}>
                                                    Assets Linked by Fintoo
                                                  </th>
                                                  <th>Future Value of Assets (₹)</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {goal.linked_assets_by_fintoo.length > 0 && goal.linked_assets_by_fintoo.map(asset => (
                                                  <tr className="top-line " >
                                                    <td style={{ fontWeight: "700" }}>{asset.category} | {asset.asset_name} | {asset.member}</td>
                                                    <td style={{ fontWeight: "700" }}>{numberFormat(asset.asset_future_value, 0)}</td>
                                                  </tr>
                                                ))}

                                                <tr className="top-line">
                                                  <td className="total_td" style={{ fontWeight: "700" }}>
                                                    Gross Total (₹)
                                                  </td>
                                                  <td className="total_td " style={{ fontWeight: "700" }}>
                                                    {numberFormat(goal.total_asset_value_by_fintoo, 0)}
                                                  </td>
                                                </tr>
                                                {goal.diff_afterlinkange != 0 &&
                                                  <tr
                                                    className="bold top-line "
                                                  >
                                                    <td className="">
                                                      {goal.diff_afterlinkange > 0 ? 'Surplus' : '(Shortfall)'}
                                                      ( Gross Total - Goal Future
                                                      Value )
                                                    </td>
                                                    {goal.diff_afterlinkange > 0 &&
                                                      <td className="">
                                                        {numberFormat(goal.diff_afterlinkange, 0)}
                                                      </td>
                                                    }
                                                    {goal.diff_afterlinkange == 0 &&
                                                      <td className="">
                                                        {numberFormat(goal.diff_afterlinkange, 0)}
                                                      </td>
                                                    }
                                                    {goal.diff_afterlinkange < 0 &&
                                                      <td className="goal-asset-red-class">
                                                        ({numberFormat(Math.abs(goal.diff_afterlinkange), 0)})
                                                      </td>
                                                    }

                                                  </tr>
                                                }


                                              </tbody>
                                            </table>
                                          </div>
                                        }
                                        {goal.diff_afterlinkange < 0 &&
                                          <div style={{ height: 30, width: 100 }}>
                                            &nbsp;
                                          </div>
                                        }

                                        {goal.diff_afterlinkange < 0 && investmentData.fintooNewInvestment != 0 &&
                                          <h4 className="rTitle text-center" >
                                            <img
                                             src={imagePath + "/static/media/Images/assets/img/reports/goal-analysis/additional-investment.svg"}
                                  
                                              alt=""></img>Addition Investment for the Goal</h4>
                                        }
                                        {goal.diff_afterlinkange < 0 && goal.total_y != 0 &&
                                          <p dangerouslySetInnerHTML={{ __html: investmentData.fintooNewInvestment ? investmentData.fintooNewInvestment : '' }}></p>
                                        }
                                        {goal.diff_afterlinkange < 0 && goal.total_y &&
                                          <>
                                            <div style={{ height: 30, width: 100 }}>
                                              &nbsp;
                                            </div>
                                            <table className="bgStyleTable">
                                              <thead>
                                                <tr>
                                                  <th colspan="6" className="text-center">Monthly Investment OR Lumpsum Investment</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                <tr className="outline">
                                                  <td>Asset Type</td>
                                                  <td>Allocation</td>
                                                  <td>Return Percentage</td>
                                                  <td>Monthly Investment (₹)</td>
                                                  <td>Lumpsum Investment (₹)</td>
                                                  <td>Future Value (₹)</td>
                                                </tr>
                                                {goal.new_investment_by_fintoo.length > 0 &&
                                                  goal.new_investment_by_fintoo.map((invest, index) => (
                                                    <tr className="top-line" >
                                                      <td style={{ fontSize: "15px", fontWeight: "700" }}>{invest.name}</td>
                                                      <td style={{ fontSize: "15px", fontWeight: "700" }}>{invest.allocation_per}%</td>
                                                      <td style={{ fontSize: "15px", fontWeight: "700" }}>{invest.return_rate}%</td>
                                                      <td style={{ fontSize: "15px", fontWeight: "700" }}>{numberFormat(invest.pmt, 0)}</td>
                                                      <td style={{ fontSize: "15px", fontWeight: "700" }}>{numberFormat(goal.pv_list?.[index] || 0, 0)}</td>
                                                      <td style={{ fontSize: "15px", fontWeight: "700" }}>{numberFormat(invest.fv, 0)}</td>
                                                    </tr>
                                                  ))
                                                }
                                                <tr className="bold top-line total-value">
                                                  <td style={{ fontSize: "15px", fontWeight: "700" }} colspan="3">Total</td>
                                                  <td style={{ fontSize: "15px", fontWeight: "700" }}>{numberFormat(goal.total_m, 0)}</td>
                                                  <td style={{ fontSize: "15px", fontWeight: "700" }}>{numberFormat(goal.total_mm, 0)}</td>
                                                  <td style={{ fontSize: "15px", fontWeight: "700" }}>{numberFormat(goal.total_y, 0)}</td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </>
                                        }
                                      </div>
                                    </div>
                                  }
                                  <div style={{ height: 30, width: 100 }}>
                                    &nbsp;
                                  </div>
                                  <div className="rGraph row justify-content-center">
                                    <div
                                      id={"RecommgoalAssetMapping_" + goal.goal_id}
                                      className="col-md-8 chart"
                                      style={{
                                        overflow: "hidden",
                                        backgroundColor: "#fff",
                                        padding: "10px",
                                      }}
                                    >
                                      {goal.y_categories && goal.y_categories?.length > 0 &&
                                        <GoalaasetMap id={goal.goal_id} colorArr={goal.colorArr} x_categories={xCategories} y_categories={goal.y_categories} activeIndex={activeIndex} />
                                      }
                                    </div>
                                  </div>
                                  {goal.assets_notes.length > 0 &&
                                    <div
                                      className="container"
                                      style={{
                                        marginTop: "4rem",
                                      }}
                                    >
                                      <div className="notes_sec_div mt-5">
                                        <div className="notes_head_div">
                                          <i
                                            style={{
                                              top: "-11px !important",
                                              left: "-5px !important",
                                            }}

                                          />
                                          <span>Notes</span>
                                        </div>
                                        <div className="notes_text_div">
                                          {goal.assets_notes.map(note => (
                                            <ul className="" >
                                              <li>
                                                <p dangerouslySetInnerHTML={{ __html: note ? note : '' }}></p>
                                              </li>
                                            </ul>
                                          ))}

                                        </div>
                                      </div>
                                    </div>
                                  }
                                </div>
                              </div>
                            </Item>
                          ))}
                        </Carousel>
                      </div>
                    </div>
                  ) : (

                    <div
                      className="no-data-found text-center"
                    >
                      <div className="container">
                        <div className="row justify-content-center align-items-center">
                          <div className="col-md-10">
                            <img

                              alt="Data not found"
                              src={imagePath + "/static/media/DG/data-not-found.svg"}
                            />

                            <p>
                              Since you missed to fill in the required information
                              which is needed here, we are not able to show you
                              this section. Kindly click on below button to
                              provide all the necessary inputs. Providing all the
                              information as asked will ensure more accurate
                              financial planning report. Once you fill in the
                              data, same will be reflected here.
                            </p>
                            <a
                              href={process.env.PUBLIC_URL + "/datagathering/goals"}
                              target="_blank"
                              className="link"
                            >
                              Complete Goals
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  }
                  <div className="row py-2">
                    <div className=" text-center">
                      <div>
                        <div className="btn-container">
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
                            <div
                              className="next-btn form-arrow d-flex align-items-center"
                              onClick={() => {
                                ScrollToTop();
                                setTab("tab5")
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
              <div className={tab == "tab5" ? "d-block" : "d-none"}>
                {/* <div className="">
                  <Whatifanalysis unachievableGoalrecoom={unachievableGoalrecoom} totalgoals={totalgoals} />
                </div> */}
                <div className="analysis-section text-center ">
                  <div className="container">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-10">
                        <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/coming-soon.svg"} alt="comming-soon" />
                      </div>
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
                              setTab("tab4")
                            }
                            }
                          >
                            <FaArrowLeft />
                            <span className="hover-text">&nbsp;Previous</span>
                          </div>
                          <Link
                            to={
                              process.env.PUBLIC_URL + "/report/risk-management"
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
export default Goalanalysis;
