import React, { useEffect, useState } from "react";
import {
  apiCall,
  fetchData,
  indianRupeeFormat,
  rsFilter,
  getParentUserId
} from "../../../../common_utilities";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import FintooLoader from "../../../FintooLoader";
import { ADVISORY_GET_CURRENT_INVESTMENT_RECOMMENDATION, userManagementEndpoints } from "../../../../constants";
import Cookies from "js-cookie";
import ReactStarRating from "react-star-ratings-component";
import PortfolioData from "./Portfolio";
import PerformanceData from "./Performace";
import HoldingsData from "./HoldingData";
import DebtDepositData from "./DebtDepositData";
import RealEstateData from "./RealEstateData";
import { ScrollToTop } from "../../../../Pages/datagathering/ScrollToTop"

function Portfolioanalysis(props) {
  
  const [isLoading, setIsLoading] = useState(true);
  const [secondTab, setSecondTab] = useState("tab13");
  const session = props.session;
  const [PARData, setPARData] = useState([]);

  useEffect(() => {
    getcurrentinvestmentrecommendation();
  }, []);

  const getcurrentinvestmentrecommendation = () => {
    if (localStorage.getItem('ParReportData')){
      setIsLoading(false)
      const ParData = localStorage.getItem('ParReportData')
      setPARData(JSON.parse(ParData));
    }
    else {
      try {
        const userId = getParentUserId();
        // Using the new API URL with user_id parameter
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        // Log the endpoint to verify it's correct
        // Construct full URL with query parameters
        const url =`${userManagementEndpoints.GET_CURRENT_INVESTMENT_RECOMMENDATION}?user_id=${userId}`;
        
        // Get token from Cookies
        const token = Cookies.get('token');
        
        // Use fetch directly instead of axios with cache control headers
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${token}`,
            // 'Cache-Control': 'no-cache, no-store, must-revalidate',
            // 'Pragma': 'no-cache',
            // 'Expires': '0'
          }
        })
          .then(response => {
            
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json().catch(err => {
              console.error('Error parsing JSON:', err);
              throw new Error('Failed to parse response as JSON');
            });
          })
          .then(data => {
            if (data && data.status_code === "200") {
              setIsLoading(false);
              
              // Ensure the data has the expected structure for the components
              let responseData = data.data || {};
              
              // If json_response is not present or doesn't have the expected structure,
              // initialize it with a default structure to prevent errors
              // if (!responseData.json_response || typeof responseData.json_response !== 'object') {
              //   responseData.json_response = {
              //     Portfolio: {
              //       GrowthSeries: { Return: [] },
              //       Benchmark: {
              //         GrowthSeries: { Return: [] },
              //         HistoricalPerformanceSeries: { HistoryDetail: [] },
              //         Performance: { Returns: { Return: [] } }
              //       },
              //       HistoricalPerformanceSeries: { HistoryDetail: [] },
              //       Performance: [{ Returns: { Return: [] }, RiskStats: {} }],
              //       Holdings: { Holding: {} },
              //       BestWorstPeriods: { Return: [] }
              //     }
              //   };
              // } else if (!responseData.json_response.Portfolio) {
              //   responseData.json_response.Portfolio = {
              //     GrowthSeries: { Return: [] },
              //     Benchmark: {
              //       GrowthSeries: { Return: [] },
              //       HistoricalPerformanceSeries: { HistoryDetail: [] },
              //       Performance: { Returns: { Return: [] } }
              //     },
              //     HistoricalPerformanceSeries: { HistoryDetail: [] },
              //     Performance: [{ Returns: { Return: [] }, RiskStats: {} }],
              //     Holdings: { Holding: {} },
              //     BestWorstPeriods: { Return: [] }
              //   };
              // }
              setPARData(responseData);
              localStorage.setItem('ParReportData', JSON.stringify(responseData));
            } else {
              console.log('API response did not have expected structure:', data);
              setIsLoading(false);
            }
          })
          .catch(error => {
            console.error('Error fetching data:', error);
            setIsLoading(false);
          });

        // Return early since we're using promises
        return;
      }
      catch (e) {
        console.error('Error in getcurrentinvestmentrecommendation:', e);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <div
        className="tabs innerTabs subTabWrapper "
      >
        <ul
          className="nav nav-buttons nav-secoandary d-md-inline-flex justify-center align-items-md-center m-auto"
          id="intro-appendix"
        >
          <li
            className={`tab-menu-item ${secondTab == "tab13" ? "active" : ""
              }`}
          >
            <a href onClick={() => setSecondTab("tab13")}>
              Portfolio
            </a>
          </li>
          <li
            className={`tab-menu-item ${secondTab == "tab14" ? "active" : ""
              }`}
          >
            <a href onClick={() => setSecondTab("tab14")}>
              Performance
            </a>
          </li>
          <li
            className={`tab-menu-item ${secondTab == "tab15" ? "active" : ""
              }`}
          >
            <a href onClick={() => setSecondTab("tab15")}>
              Holdings
            </a>
          </li>
          {Boolean(PARData?.ssy_recomm && !PARData?.ssy_recomm.ssy_isinvested) && <li
            className={`tab-menu-item ${secondTab == "tab16" ? "active" : ""
              }`}
          >
            <a href onClick={() => setSecondTab("tab16")}>
              Debt Deposit
            </a>
          </li>}
          <li
            className={`tab-menu-item ${secondTab == "tab17" ? "active" : ""
              }`}
          >
            <a href onClick={() => setSecondTab("tab17")}>
              Real Estate
            </a>
          </li>
        </ul>
        <div>

          <div
            className={secondTab == "tab13" ? "d-block" : "d-none"}
          >
            <PortfolioData
              ReactStarRating={ReactStarRating}
              PARData={PARData}
            />
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
                        <span className="hover-text">
                          &nbsp;Previous
                        </span>
                      </div>
                      <div
                        className="next-btn form-arrow d-flex align-items-center"
                        onClick={() => {
                          ScrollToTop();
                          setSecondTab("tab14")
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
          </div>

          <div
            className={secondTab == "tab14" ? "d-block" : "d-none"}
          >
            <PerformanceData
              PARData={PARData}
            />
            <div className="row py-2">
              <div className=" text-center">
                <div>
                  <div className="btn-container">
                    <div className="d-flex justify-content-center">
                      <div
                        className="previous-btn form-arrow d-flex align-items-center"
                        onClick={() => {
                          ScrollToTop();
                          setSecondTab("tab13")
                        }
                        }
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
                          setSecondTab("tab15")
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
          </div>
          <div
            className={secondTab == "tab15" ? "d-block" : "d-none"}
          >
            <div className="" style={{}}>
              <HoldingsData
                PARData={PARData}
              />
              <div className="row py-2">
                <div className=" text-center">
                  <div>
                    <div className="btn-container">
                      <div className="d-flex justify-content-center">
                        <div
                          className="previous-btn form-arrow d-flex align-items-center"
                          onClick={() => {
                            ScrollToTop();
                            setSecondTab("tab14")
                          }
                          }
                        >
                          <FaArrowLeft />
                          <span className="hover-text">
                            &nbsp;Previous
                          </span>
                        </div>
                        <div
                          className="next-btn form-arrow d-flex align-items-center"
                          onClick={() =>
                            {
                              ScrollToTop();
                              setSecondTab("tab16")
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
            </div>
          </div>

          <div
            className={secondTab == "tab16" ? "d-block" : "d-none"}
          >
            <div className="" style={{}}>
              <DebtDepositData
                PARData={PARData}
              />
              <div className="row py-2">
                <div className=" text-center">
                  <div>
                    <div className="btn-container">
                      <div className="d-flex justify-content-center">
                        <div
                          className="previous-btn form-arrow d-flex align-items-center"
                          onClick={() => 
                            {
                              ScrollToTop();
                              setSecondTab("tab15")
                            }
                          }
                        >
                          <FaArrowLeft />
                          <span className="hover-text">
                            &nbsp;Previous
                          </span>
                        </div>
                        <div
                          className="next-btn form-arrow d-flex align-items-center"
                          onClick={() =>
                            {
                              ScrollToTop();
                              setSecondTab("tab17")
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
            </div>
          </div>
          <div
            className={secondTab == "tab17" ? "d-block" : "d-none"}
          >
            <div className="" style={{}}>
              <RealEstateData
                PARData={PARData}
              />
              <div className="row py-2">
                <div className=" text-center">
                  <div>
                    <div className="btn-container">
                      <div className="d-flex justify-content-center">
                        <div
                          className="previous-btn form-arrow d-flex align-items-center"
                          onClick={() => 
                            {
                              ScrollToTop();
                              setSecondTab("tab16");
                            }
                          }
                        >
                          <FaArrowLeft />
                          <span className="hover-text">
                            &nbsp;Previous
                          </span>
                        </div>
                        <div
                          className="next-btn form-arrow d-flex align-items-center"
                          onClick={() => setTab("tab6")}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Portfolioanalysis;