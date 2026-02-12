import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import FintooLoader from "../../components/FintooLoader";
import DatagatherReportLayout from "../../components/Layout/Datagather/Reports";
import RetirementInfo from "./RetirementPlanningReport/RetirementInfo";
import RetirementCorpusPage from "./RetirementPlanningReport/RetirementCorpusPage";
import RetirementCashflow from "./RetirementPlanningReport/RetirementCashflow";
import { ScrollToTop } from "./ScrollToTop";
import { ADVISORY_GET_RETIREMENT_INFO_API, imagePath } from "../../constants";
import { setBackgroundDivImage } from "../../common_utilities";
import apiClient from "../../FrappeIntegration-Services/services/apiClient";
import Cookies from 'js-cookie';
import { GetRecommendationRetirementCashflow, GetRetirementCashflow } from "../../FrappeIntegration-Services/services/financial-planning-api/reports/retirement-planning";

const RetirementPlanning = () => {
  // Keep original tab state management
  const [tab, setTab] = useState("tab1");
  const [secondtab, setSecondtab] = useState("tab4");
  const [isLoading, setIsLoading] = useState(true);

  // Only retirement info data for now
  const [retirementInfoData, setRetirementInfoData] = useState({});

  // Placeholder states for other tabs (other developers will implement these)
  const [retirementGoalData, setRetirementGoalData] = useState([]);
  const [retirementCashflowData, setRetirementCashflowData] = useState(null);
  const [recommendRetCashflowData, setRecommendRetCashflowData] = useState(null);
  const [screenHeader, setScreenHeader] = useState({});

  // Helper function to extract user ID from various data sources
  const extractUserId = (userData, sessionData) => {

    // Try different possible locations for user ID
    const possibleIds = [
      userData?.user_id,
      userData?.id,
      userData?.user?.id,
      userData?.data?.id,
      sessionData?.data?.id,
      sessionData?.data?.user_id,
      sessionData?.user_id,
      sessionData?.id
    ];

    for (const id of possibleIds) {
      if (id) {
        return id;
      }
    }
    return null;
  };

  useEffect(() => {
    document.body.classList.add("dg-layout");
    document.body.classList.add("rp-layout");
  
    const interval = setInterval(() => {
      const bgRetirement = document.getElementById("report-bg-retirement");
      if (bgRetirement) {
        bgRetirement.style.background = `url(${imagePath}/static/media/DG/reports/ill-retirment-planning.svg) no-repeat right top`;
        clearInterval(interval);
        setBackgroundDivImage();
      }
    }, 50);
  
    // Load only retirement info data for now
    loadRetirementInfo();
    getMemberList();
  
    // Safety timeout to prevent infinite loading (10 seconds)
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
  
    return () => {
      clearInterval(interval);
      clearTimeout(loadingTimeout);
      document.body.classList.remove("dg-layout");
      document.body.classList.remove("rp-layout");
    };
  }, []);
  
  const getAgeFromDob = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const loadRetirementInfo = async () => {
    try {

      // Get user data from storage
      const userDataFromCookies = Cookies.get('user_data');
      const userDataFromLocalStorage = localStorage.getItem('user_data');

      let userData = {};
      if (userDataFromCookies) {
        try {
          userData = JSON.parse(userDataFromCookies);
        } catch (e) {
          // console.warn('Failed to parse user_data from cookies:', e);
        }
      } else if (userDataFromLocalStorage) {
        try {
          userData = JSON.parse(userDataFromLocalStorage);
        } catch (e) {
          // console.warn('Failed to parse user_data from localStorage:', e);
        }
      }

      // Extract user ID
      const userId = extractUserId(userData, null);

      if (!userId) {
        // console.error('❌ No user ID found');
        setRetirementInfoData({});
        return;
      }

      // Call API
      const apiUrl = `${ADVISORY_GET_RETIREMENT_INFO_API}?user_id=${userId}`;

      const response = await apiClient(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status_code === "200" && response.data) {

        let data = response.data;
        const retirementYear = new Date(data.retirement_date).getFullYear();
        const lifeExpectancyYear = new Date(data.life_expectancy_date).getFullYear();
        const currentYear = new Date().getFullYear();
        // const currentAge = userData.age || 30;

        const currentAge = getAgeFromDob(userData.user_dob);

        let tempRetirementInfoData = { ...data};

        if (response["data"]["postretlife"]) {
          tempRetirementInfoData={
            ...tempRetirementInfoData,
            retirement_age: currentAge + (retirementYear - currentYear),
            life_expectancy: currentAge + (lifeExpectancyYear - currentYear),
            screenheader_post_ret_life: "As you can only work for a finite number of years, it's important to create sources of income for when you retire because you will still incur expenses. Retirement planning is crucial in securing your financial future.",
            postretlife: response["data"]["postretlife"]
          }
        }

        if (response["data"]["lifetime_expense"]) {
          tempRetirementInfoData={
            ...tempRetirementInfoData,
            screenheader_lifetime_exp: "These are the expenses that you will incur throughout your retirement period. It's important to account for these recurring expenses in your retirement planning.",
            lifetime_expense: response["data"]["lifetime_expense"]
          }
        }

        if (response["data"]["limited_expense"]) {
          tempRetirementInfoData={
            ...tempRetirementInfoData,
            screenheader_limited_exp: "These are expenses that you will incur for a limited period during your retirement. Planning for these time-bound expenses is crucial for accurate retirement planning.",
            limited_expense: response["data"]["limited_expense"]
          }
        }

        if (response["data"]["all_income"]) {
          tempRetirementInfoData={
            ...tempRetirementInfoData,
            screenheader_annual_income: response["screenheader_annual_income"],
            income: response["data"]["all_income"]
          }
        }

        if (response["data"]["all_income"]) {
          const updatedIncome = [];
        
          let combinedIncome = [...tempRetirementInfoData.all_income, ...updatedIncome];
        
          if (response["data"].onetime_insurance && response["data"].recurring_insurance) {
            combinedIncome = [...combinedIncome, ...response["data"].onetime_insurance, ...response["data"].recurring_insurance];
          } else if (response["data"].onetime_insurance) {
            combinedIncome = [...combinedIncome, ...response["data"].onetime_insurance];
          } else if (response["data"].recurring_insurance) {
            combinedIncome = [...combinedIncome, ...response["data"].recurring_insurance];
          }
        
          tempRetirementInfoData = {
            ...tempRetirementInfoData,
            screenheader_annual_income: "Although you won't earn a salary once you retire, through smart retirement planning you can create varied sources of income that will help you maintain your current standard of living.",
            income: combinedIncome
          };
        }      
        setRetirementInfoData({...tempRetirementInfoData})
        
      } else {
        setRetirementInfoData({});
      }
    } catch (error) {
      setRetirementInfoData({});
    } finally {
      setIsLoading(false);
    }
  };


  const getMemberList = async () => {
    try {
      // let url = '';
      // let url = CHECK_SESSION;
      // let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

      // let session_data = await apiCall(url, data, true, false);
      if (false) {
        // if (session_data.error_code == "102") {
        loginRedirectGuest();
      } else {
        // retirementInfoAPI(session_data);
        // retirementCorpusAPI(session_data);
        // retirementGoalRecommendationAPI(session_data);
        retirementCashflowAPI();
        recommendRetireCashflowAPI();
      }
    } catch (e) {
      // console.log("err", e);
    }
  };

  const retirementCashflowAPI = async () => {
    try {
      const response = await GetRetirementCashflow();

      if (response?.status_code !== "200") return;

      const data = response?.data || {};
      const cashflow = { ...data };

      // Attach meta and default titles
      cashflow.isRetirementData = data?.is_retirementdata || 0;
      cashflow.screenHeader = response?.screen_header || "";
      cashflow.title = "Post Retirement Cashflow (Based On Accumulation From Existing Investments)";

      // Handle yearly income (Lifetime)
      if (Array.isArray(data.lifetime_income) && Array.isArray(data.lifetime_insurance)) {
        cashflow.yearlyLifetimeInc = calculateYearlyIncome(data.lifetime_income, data.lifetime_insurance);
      } else if (Array.isArray(data.lifetime_income)) {
        cashflow.yearlyLifetimeInc = data.lifetime_income;
      } else if (Array.isArray(data.lifetime_insurance)) {
        cashflow.yearlyLifetimeInc = data.lifetime_insurance;
      }

      // Handle yearly income (Limited)
      if (Array.isArray(data.limited_income) && Array.isArray(data.limited_insurance)) {
        cashflow.yearlyLimitedInc = calculateYearlyIncome(data.limited_income, data.limited_insurance);
      } else if (Array.isArray(data.limited_income)) {
        cashflow.yearlyLimitedInc = data.limited_income;
      } else if (Array.isArray(data.limited_insurance)) {
        cashflow.yearlyLimitedInc = data.limited_insurance;
      }

      // Compute formula output
      cashflow.formula = calculateFormula(data);

      // Clip data up to first negative closing balance
      let cutoffIndex = data.closing_balance?.findIndex(obj => {
        const val = Object.values(obj)[0];
        return typeof val === "number" && val < 0;
      });

      if (cutoffIndex === -1) {
        cutoffIndex = (data.closing_balance || []).length; // No negative values
      } else {
        cutoffIndex += 1; // Include the negative year
      }

      cashflow.opening_balance = (data.opening_balance || []).slice(0, cutoffIndex);
      cashflow.closing_balance = (data.closing_balance || []).slice(0, cutoffIndex);

      // Final state update
      setRetirementCashflowData({ ...cashflow });
    } catch (err) {
      // console.error("Retirement Cashflow API error:", err);
    }
  };

  const recommendRetireCashflowAPI = async () => {
    let response = await GetRecommendationRetirementCashflow();

    setIsLoading(false);

    if (response.status_code === "200") {
      let data = response?.data;

      let tempRecommendedRetireData = {
        ...data,
        isRetirementData: data?.is_retirementdata,
        title: "Post Retirement Cashflow",
      };

      // Parse yearly lifetime income
      if (
        data?.lifetime_income?.length > 0 ||
        data?.lifetime_insurance?.length > 0
      ) {
        tempRecommendedRetireData.yearlyLifetimeInc = calculateYearlyIncome(
          data.lifetime_income,
          data.lifetime_insurance || []
        );
      }

      // Parse yearly limited income
      if (
        data?.limited_income?.length > 0 ||
        data?.limited_insurance?.length > 0
      ) {
        tempRecommendedRetireData.yearlyLimitedInc = calculateYearlyIncome(
          data.limited_income,
          data.limited_insurance || []
        );
      }

      // Add full formula (including expense, corpus, etc.)
      tempRecommendedRetireData.formula = calculateFormula({
        ...data,
        yearly_lifetime_inc: tempRecommendedRetireData.yearlyLifetimeInc,
        limited_inc: tempRecommendedRetireData.yearlyLimitedInc,
        limited_exp: data?.limited_expense || [],
      });
      setRecommendRetCashflowData(tempRecommendedRetireData);
    }
  };

  const calculateYearlyIncome = (list1, list2) => {
    const yearly_income_result = {};
    for (let item of [...list1, ...list2]) {
      for (let [key, value] of Object.entries(item)) {
        yearly_income_result[key] = (yearly_income_result[key] || 0) + value;
      }
    }
    return Object.entries(yearly_income_result).map(([key, value]) => ({
      [key]: value,
    }));
  };

  const calculateFormula = (data) => {
    const limited_exp =
      data?.limited_exp?.length > 0 ? data.limited_exp : 0;
    const yearly_lifetime_inc =
      data?.yearly_lifetime_inc?.length > 0 ? data.yearly_lifetime_inc : 0;
    const limited_inc =
      data?.limited_inc?.length > 0 ? data.limited_inc : 0;

    if (limited_exp && yearly_lifetime_inc && limited_inc) {
      return "(B+C)-(D+E)";
    } else if (limited_exp && yearly_lifetime_inc) {
      return "(B)-(D+E)";
    } else if (yearly_lifetime_inc && limited_inc) {
      return "(B+C)-(D)";
    } else if (limited_inc) {
      return "(C)-(D)";
    } else if (yearly_lifetime_inc) {
      return "(B)-(D)";
    } else if (limited_exp && limited_inc) {
      return "(D+E)";
    } else if (limited_exp) {
      return "(D+E)";
    } else {
      return "(D)";
    }
  };


  return (
    <DatagatherReportLayout>
      <FintooLoader isLoading={isLoading} />
      <div className="reports ">
        <div className="">
          <div className="background-div">
            <div className="bg active" id="report-bg-retirement"></div>
          </div>
          <div className="white-box">
            <div className="d-flex justify-content-md-center tab-box">
              <div className="d-flex top-tab-menu noselect">
                <div
                  className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                  onClick={() => setTab("tab1")}
                >
                  <div className="tab-menu-title">INTRODUCTION</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                  onClick={() => setTab("tab2")}
                >
                  <div className="tab-menu-title">RETIREMENT CORPUS</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab3" ? "active" : ""}`}
                  onClick={() => setTab("tab3")}
                >
                  <div className="tab-menu-title">CASHFLOW</div>
                </div>
              </div>
            </div>

            <div>
              {/* TAB 1 - INTRODUCTION (Only this has API integration) */}
              <div className={tab == "tab1" ? "d-block" : "d-none"}>
                <div>
                  <RetirementInfo data={retirementInfoData} />
                </div>
                <div>
                  <div className="row py-2">
                    <div className=" text-center">
                      <div>
                        <div className="btn-container fixedBtn">
                          <div className="d-flex justify-content-center">
                            <Link
                              to={
                                process.env.PUBLIC_URL +
                                "/report/cash-flow-management"
                              }
                            >
                              <div className="previous-btn form-arrow d-flex align-items-center">
                                <FaArrowLeft />
                                <span
                                  className="hover-text"
                                  style={{ maxWidth: 100 }}
                                >
                                  Previous&nbsp;
                                </span>
                              </div>
                            </Link>
                            <div
                              className="next-btn form-arrow d-flex align-items-center"
                              onClick={() => {
                                ScrollToTop();
                                setTab("tab2");
                              }}
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

              {/* TAB 2 - RETIREMENT CORPUS (Placeholder for other developer) */}
              <div className={tab == "tab2" ? "d-block" : "d-none"}>
                <div>
                  <RetirementCorpusPage
                    data={retirementGoalData}
                    screen_header={screenHeader}
                  />
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
                              setTab("tab1");
                            }}
                          >
                            <FaArrowLeft />
                            <span className="hover-text">&nbsp;Previous</span>
                          </div>
                          <div
                            className="next-btn form-arrow d-flex align-items-center"
                            onClick={() => {
                              ScrollToTop();
                              setTab("tab3");
                            }}
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

              {/* TAB 3 - CASHFLOW (Placeholder for other developer) */}
              <div className={tab == "tab3" ? "d-block" : "d-none"}>
                <div className="d-flex justify-content-md-center tab-box">
                  <ul
                    className=" nav-buttons nav-secoandary d-inline-flex"
                    id="intro-appendix"
                  >
                    <li
                      className={`tab-menu-item ${secondtab == "tab4" ? "active" : ""
                        }`}
                    >
                      <a href="#" onClick={() => setSecondtab("tab4")}>
                        Actual Cashflow
                      </a>
                    </li>
                    <li
                      className={`tab-menu-item ${secondtab == "tab5" ? "active" : ""
                        }`}
                    >
                      <a href="#" onClick={() => setSecondtab("tab5")}>
                        Fintoo Recommends Cashflow
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className={secondtab == "tab4" ? "d-block" : "d-none"}>
                    <RetirementCashflow
                      data={retirementCashflowData}
                      type={"Actual Cashflow"}
                    />
                    <div className="row py-2">
                      <div className=" text-center">
                        <div>
                          <div className="btn-container fixedBtn">
                            <div className="d-flex justify-content-center">
                              <div
                                className="previous-btn form-arrow d-flex align-items-center"
                                onClick={() => {
                                  ScrollToTop();
                                  setTab("tab2");
                                }}
                              >
                                <FaArrowLeft />
                                <span className="hover-text">
                                  &nbsp;Previous
                                </span>
                              </div>
                              <div
                                className="next-btn form-arrow d-flex align-items-center"
                                onClick={() => {
                                  ScrollToTop();
                                  setSecondtab("tab5");
                                }}
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
                  <div className={secondtab == "tab5" ? "d-block" : "d-none"}>
                    <RetirementCashflow
                      data={recommendRetCashflowData}
                      type={"Recommends Cashflow"}
                    />
                    <div className="row py-2">
                      <div className=" text-center">
                        <div>
                          <div className="btn-container fixedBtn">
                            <div className="d-flex justify-content-center">
                              <div
                                className="previous-btn form-arrow d-flex align-items-center"
                                onClick={() => {
                                  ScrollToTop();
                                  setSecondtab("tab4");
                                }}
                              >
                                <FaArrowLeft />
                                <span className="hover-text">
                                  &nbsp;Previous
                                </span>
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
        </div>
      </div>
    </DatagatherReportLayout>
  );
};

export default RetirementPlanning;
