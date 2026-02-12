import { useState } from "react";
import { useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DatagatherReportLayout from "../../components/Layout/Datagather/Reports";
import FintooLoader from "../../components/FintooLoader";
import {
  ADVISORY_GET_CASHINFLOW_DATA,
  ADVISORY_GET_CASHOUTFLOW_DATA,
  ADVISORY_NET_SURPLUS_SHORTFALL_DATA,
  ADVISORY_GET_CASHFLOW_RECOMMENDATION_DATA,
  CHECK_SESSION,
  imagePath,
  userManagementEndpoints,
} from "../../constants";
import {
  getParentUserId,
  getItemLocal,
  apiCall,
  loginRedirectGuest,
  fetchEncryptData, setBackgroundDivImage
} from "../../common_utilities";
import { Link } from "react-router-dom";
import NetSurplusShortfall from "./CashflowAnalysisReport/NetSurplusShortfall";
import Inflow from "./CashflowAnalysisReport/Inflow";
import Outflow from "./CashflowAnalysisReport/Outflow";
import CashflowRecommendation from "./CashflowAnalysisReport/CashflowRecommendation";
import { ScrollToTop } from "./ScrollToTop"
import { cashFlowRecommendation, GetCashInFlow, GetCashOutFlow, GetCashSurplusShortfall } from "../../FrappeIntegration-Services/services/financial-planning-api/reports/cashflow-analysis";
import Cookies from 'js-cookie';

const CashinFlow = () => {
  const [tab, setTab] = useState("tab1");
  const [surplusShortfallData, setSurplusShortfallData] = useState(null);
  const [cashinflowData, setCashInflowData] = useState([]);
  const [cashoutflowData, setCashOutflowData] = useState([]);
  const [recommendationData, setRecommendationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get('token')

  const user_id = JSON.parse(localStorage.getItem('user_data'))?.user_id;

  useEffect(() => {
    document.body.classList.add("dg-layout");
    document.body.classList.add("rp-layout");
  
    const interval = setInterval(() => {
      const reportBgCash = document.getElementById("report-bg-cash");
      if (reportBgCash) {
        reportBgCash.style.background = `url(${imagePath}/static/assets/img/reports/ill-cashflow.svg) no-repeat right top`;
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
  

  const netSurplusShortfallAPI = async () => {
    try {
      const response = await GetCashSurplusShortfall();
      const responseGetCashInFlow = await GetCashInFlow();
      const responseGetCashOutFlow = await GetCashOutFlow();

      if (response.status_code === 200 && response.success &&
        responseGetCashOutFlow.status_code === 200 && responseGetCashOutFlow.success &&
        responseGetCashInFlow.status_code === 200 && responseGetCashInFlow.success) {
        const data = response.data || {};
        let tempSurplusShortfallData = { ...data };

        // Defensive fallback
        const cashflowInvestments = data.cashflowinvestments || {};
        const investmentKeys = Object.keys(cashflowInvestments);

        // Add colspan for dynamic columns in UI
        tempSurplusShortfallData.surplusShortfallColspan = investmentKeys.length + 1;

        // Ensure gross investment data is attached
        tempSurplusShortfallData.gross_investment = data.gross_investment || {};

        // Optional section text
        if (data.section_text) {
          tempSurplusShortfallData.section_text = data.section_text;
        }

        // Optional inflow/outflow arrays
        tempSurplusShortfallData.income = responseGetCashInFlow?.data?.[0]?.total_gross_income;
        tempSurplusShortfallData.expense = responseGetCashOutFlow?.data?.[0]?.total_gross_expense;

        // Age mapping by year
        tempSurplusShortfallData.cashflowyear = responseGetCashOutFlow?.data?.[0]?.cashflow_year;

        // Final update
        setSurplusShortfallData(tempSurplusShortfallData);
      } else {
        // console.warn("Unexpected response:", response);
      }
    } catch (error) {
      // console.error("netSurplusShortfallAPI error:", error);
    }
  };

  const cashInflowAPI = () => {
    setIsLoading(true); // Start loader

    const userId = getParentUserId();
    const url = `${userManagementEndpoints.CASH_IN_FLOW}?user_id=${userId}`;
    const token = Cookies.get('token');

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${token}`
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {

        if (data && data.success && data.status_code === 200) {
          const responseData = data.data[0];

          let tempCashinflowData = { ...responseData };

          // Process cashflow year data
          let cashinflowyear_set = responseData.cashflowyear;
          let cashinflow_year_list = [];
          Object.keys(cashinflowyear_set).map((k, v) => {
            cashinflow_year_list.push({ year: k, age: cashinflowyear_set[k] });
          });
          tempCashinflowData = {
            ...tempCashinflowData,
            cashflowyear: cashinflow_year_list,
          };

          // Process income categories
          let total_category_income = responseData.total_category_income;
          let inflow_final_array = [];
          Object.keys(total_category_income).map((key, index) => {
            if (total_category_income[key].length > 0) {
              var newkey;
              switch (key) {
                case "post_office_mis":
                  newkey = "Interest Income";
                  break;
                case "salary_and_wages":
                  newkey = "Salary & Wages";
                  break;
                case "business":
                  newkey = "Business";
                  break;
                case "pension":
                  newkey = "Pension";
                  break;
                case "rental":
                  newkey = "Rental";
                  break;
                case "gifts":
                  newkey = "Gifts";
                  break;
                case "others":
                  newkey = "Others";
                  break;
                case "ULIP":
                  newkey = "ULIP";
                  break;
                case "endowment":
                  newkey = "Endowment";
                  break;
                case "guaranted_income_plan":
                  newkey = "Guaranteed Income Plan";
                  break;
                case "pension_plan":
                  newkey = "Pension Plan";
                  break;
                case "interest_income":
                  newkey = "Interest Income";
                  break;
                case "sale_of_other_assets":
                  newkey = "Sale of Other Assets";
                  break;
                case "rental_income":
                  newkey = "Rental Income";
                  break;
                case "soverign_gold_bonds":
                  newkey = "Sovereign Gold Bonds";
                  break;
                case "debentures":
                  newkey = "Debentures";
                  break;
                case "fixed_deposit":
                  newkey = "Fixed Deposit";
                  break;
                case "post_office_scheme":
                  newkey = "Post Office Scheme";
                  break;
                case "debt_others":
                  newkey = "Debt Others";
                  break;
                default:
                  newkey = key;
              }
              var newdict = { name: newkey, data: total_category_income[key] };
              inflow_final_array.push(newdict);
            }
          });

          // Update with processed data
          tempCashinflowData = {
            ...tempCashinflowData,
            colSpan: 1 + inflow_final_array.length,
            inflowFinalArray: inflow_final_array,
          };

          setCashInflowData({ ...tempCashinflowData });
        } else {
          // console.log('Unexpected API response structure or status:', data);
        }

        setIsLoading(false); // End loader
      })
      .catch(error => {
        // console.error('Error in cashInflowAPI:', error);
        setIsLoading(false);
      });
  };

  const cashOutflowAPI = async () => {

    let config = {
      method: "GET",
      url: `${ADVISORY_GET_CASHOUTFLOW_DATA}?user_id=${user_id}`,
      headers: {
        Authorization: `token ${token}`
      }
    };

    var response = await fetchEncryptData(config);
    if (response["status_code"] === 200) {
      let data = response["data"][0];
      let tempCashoutflowData = { ...data };
      let outflow_expense_data = response["data"][0]["Expenses"];

      const years = Object.keys(data.cashflow_year);

      let y_axis_final_array = [];
      Object.keys(outflow_expense_data).map((key, index) => {
        var newkey = key;
        if (outflow_expense_data[key] && outflow_expense_data[key]["total"]) {
          switch (key) {
            case "mandatory_fixed":
              newkey = "Mandatory Fixed";
              break;
            case "mandatory_variable":
              newkey = "Mandatory Variable";
              break;
            case "wishful_variable":
              newkey = "Wishful Variable";
              break;
            case "wishful_fixed":
              newkey = "Wishful Fixed";
              break;
            default:
              break;
          }

          const orderedData = years.map(year => outflow_expense_data[key]["total"][year] || 0);

          var newdict = {
            name: newkey,
            data: orderedData,
          };
          y_axis_final_array.push(newdict);
        }
      });

      tempCashoutflowData = {
        ...tempCashoutflowData,
        colSpan: 1 + Object.keys(outflow_expense_data).filter(key => outflow_expense_data[key] && outflow_expense_data[key].total).length,
        y_axis_final_array: y_axis_final_array,
        cashflowyear: data.cashflow_year,
        section_text: "Cash outflow represents your expenses over time."
      };
      setCashOutflowData({ ...tempCashoutflowData });
    }
  };

  const recommendationAPI = async() => {
    try{
      // setIsLoading(false); // Start loader

      const userId = getParentUserId();
      const data = await cashFlowRecommendation(userId, token);

      if (data && data.status_code === "200") {
        const responseData = data.data;
        setRecommendationData(responseData)
        // setRecommendationData({
        //   total_surplus: responseData.total_surplus || {},
        //   surplus: responseData.surplus || [],
        //   total_inflow: responseData.total_inflow || 0,
        //   total_outflow: responseData.total_outflow || 0,
        //   opening_balance: responseData.opening_balance || {},
        //   closing_balance: responseData.closing_balance || {},
        //   additional_investment_corpus: responseData.additional_investment_corpus || {},
        //   addtional_inv_array: responseData.addtional_inv_array || {},
        //   assets_investment: responseData.assets_investment || {},
        //   ulip_investment: responseData.ulip_investment || {},
        //   cashflowinvestments: responseData.cashflowinvestments || {},
        //   total_investment: responseData.total_investment || {}
        // });
      } else {
        console.log('Unexpected API response structure or status:', data);
      }
  } catch (error) {
    console.error('Error in recommendationAPI:', error);
  } finally {
    setIsLoading(false); // End loader
  }
};

  //   const getMemberList = async () => {
  //     try {
  //       let url = '';
  // // let url = CHECK_SESSION;
  //       let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

  //       let session_data = await apiCall(url, data, true, false);
  //       if (false) {
  //         // if (session_data.error_code == "102") {
  //         loginRedirectGuest();
  //       } else {
  //         netSurplusShortfallAPI();
  //         cashInflowAPI();
  //         cashOutflowAPI(session_data);
  //         recommendationAPI();

  //       }
  //     } catch (e) {
  //       // console.log("err", e);
  //     }
  //   };

  useEffect(() => {
    if (user_id) {
      netSurplusShortfallAPI();
      cashInflowAPI();
      cashOutflowAPI();
      recommendationAPI();
    }
  }, [])


  return (
    <DatagatherReportLayout>
      <FintooLoader isLoading={isLoading} />
      <div className="reports ">
        <div className="">
          <div className="background-div">
            <div className="bg active" id="report-bg-cash"></div>
          </div>
          <div className="white-box">
            <div className="d-flex justify-content-center tab-box">
              <div className="d-flex top-tab-menu noselect">
                <div
                  className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                  onClick={() => setTab("tab1")}
                >
                  <div className="tab-menu-title">NET SURPLUS / SHORTFALL</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                  onClick={() => setTab("tab2")}
                >
                  <div className="tab-menu-title">CASHINFLOW</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab3" ? "active" : ""}`}
                  onClick={() => setTab("tab3")}
                >
                  <div className="tab-menu-title">CASHOUTFLOW</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab4" ? "active" : ""}`}
                  onClick={() => setTab("tab4")}
                >
                  <div className="tab-menu-title">FINTOO RECOMMENDS</div>
                </div>
              </div>
            </div>

            <div>
              <div className={tab == "tab1" ? "d-block" : "d-none"}>
                <NetSurplusShortfall data={surplusShortfallData} />
                <div className="row py-2">
                  <div className=" text-center">
                    <div>
                      <div className="btn-container fixedBtn">
                        <div className="d-flex justify-content-center">
                          <Link
                            to={
                              process.env.PUBLIC_URL + "/report/risk-management"
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
              <div className={tab == "tab2" ? "d-block" : "d-none"}>
                <Inflow data={cashinflowData} />
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
                <Outflow data={cashoutflowData} />
                <div className="row py-2">
                  <div className=" text-center">
                    <div>
                      <div className="btn-container fixedBtn">
                        <div className="d-flex justify-content-center">
                          <div
                            className="previous-btn form-arrow d-flex align-items-center"
                            onClick={() => setTab("tab2")}
                          >
                            <FaArrowLeft />
                            <span className="hover-text">&nbsp;Previous</span>
                          </div>
                          {/* <button className="default-btn gradient-btn save-btn">
                                  Save & Add More
                                </button> */}
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
              <div className={tab == "tab4" ? "d-block" : "d-none"}>
                <CashflowRecommendation
                  data={recommendationData}
                  income_data={cashinflowData}
                  expense_data={cashoutflowData}
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
                              setTab("tab3")
                            }
                            }
                          >
                            <FaArrowLeft />
                            <span className="hover-text">&nbsp;Previous</span>
                          </div>
                          <Link
                            to={
                              process.env.PUBLIC_URL +
                              "/report/retirement-corpus"
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
export default CashinFlow;
