import { useState } from "react";
import { useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DatagatherReportLayout from "../../components/Layout/Datagather/Reports";
import { Link } from "react-router-dom";
import { imagePath } from "../../constants";
import {
  getItemLocal,
  getParentUserId,
  loginRedirectGuest,
} from "../../common_utilities";
import FintooLoader from "../../components/FintooLoader";
import Networth from "../../components/HTML/Report/AssetsandLiabilities/Networth";
import Fintoorecommends from "../../components/HTML/Report/AssetsandLiabilities/Fintoorecommends";
import Portfolioanalysis from "../../components/HTML/Report/AssetsandLiabilities/Portfolioanalysis";
import { ScrollToTop } from "./ScrollToTop"
const AssetsLib = () => {
  const [tab, setTab] = useState("tab3");
  const [assettab, setAssetTab] = useState("tab7");
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState({});
  const userid = getParentUserId();

  useEffect(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    if (!userid) {
      loginRedirectGuest();
    }
  }, []);

  useEffect(() => {
    document.body.classList.add("dg-layout");
    document.body.classList.add("rp-layout");
  
    const interval = setInterval(() => {
      const reportAssets = document.getElementById("report-bg-assets");
      if (reportAssets) {
        reportAssets.style.background = `url(${imagePath}/static/assets/img/reports/ill-assest-liabilities.svg) no-repeat right top`;
        clearInterval(interval);
      }
    }, 50);
  
    return () => {
      clearInterval(interval);
      document.body.classList.remove("dg-layout");
      document.body.classList.remove("rp-layout");
    };
  }, []);
  

  useEffect(() => {
     checksession();
  }, []);

  const checksession = async () => {
  try {
    setIsLoading(true);

    const userId = getParentUserId();
    const sessionData = {
      user_id: userId,
      sky: getItemLocal("sky"),
      name: getItemLocal("name") || "User",
      email: getItemLocal("email") || "",
    };

    setSession(sessionData);
    setIsLoading(false);
  } catch (e) {
    console.log(e);
    setIsLoading(false);
  }
};

  const handleSetTab = (data) => {
    setAssetTab(data);
  };

  const handleMainSetTab = (data) => {
    setTab(data);
  };

  return (
    <>
      <FintooLoader isLoading={isLoading} />
      <DatagatherReportLayout>
        <div className="reports ">
          <div className="">
            <div className="background-div">
              <div class="bg active" id="report-bg-assets"></div>
            </div>
            <div className="white-box">
              <div className="d-flex justify-content-md-center tab-box">
                <div className="d-flex top-tab-menu noselect">
                
                  <div
                    className={`tab-menu-item ${tab == "tab3" ? "active" : ""}`}
                    onClick={() => setTab("tab3")}
                  >
                    <div className="tab-menu-title">NET WORTH</div>
                  </div>
                  <div
                    className={`tab-menu-item ${tab == "tab4" ? "active" : ""}`}
                    onClick={() => setTab("tab4")}
                  >
                    <div className="tab-menu-title">FINTOO RECOMMENDS</div>
                  </div>
                  <div
                    className={`tab-menu-item ${tab == "tab5" ? "active" : ""}`}
                    onClick={() => setTab("tab5")}
                  >
                    <div className="tab-menu-title">PORTFOLIO ANALYSIS</div>
                  </div>
                  <div
                    className={`tab-menu-item ${tab == "tab6" ? "active" : ""}`}
                    onClick={() => setTab("tab6")}
                  >
                    <div className="tab-menu-title">WHAT IF ANALYSIS</div>
                  </div>
                </div>
              </div>

              {Object.keys(session).length > 0 ? (
                <div className="asset-recomm ">
                  <div className={tab == "tab3" ? "d-block" : "d-none"}>
                    <Networth session={session} settab1={handleMainSetTab} />
                  </div>
                  <div className={tab == "tab4" ? "d-block" : "d-none"}>
                    <Fintoorecommends
                      session={session}
                      settab1={handleMainSetTab}
                    />
                  </div>
                  {tab == "tab5" && <div>
                    <Portfolioanalysis session={session} settab1={handleMainSetTab} />
                  </div>}
                  <div className={tab == "tab6" ? "d-block" : "d-none"}>
                    <div className="analysis-section text-center ">
                      <div className="container">
                        <div className="row justify-content-center align-items-center">
                          <div className="col-md-10">
                          <img src={imagePath + "/static/media/DMF/coming-soon.svg"} alt="comming-soon" />
                            {/* <p class="mt-2">Coming Soon</p> */}
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
                                onClick={() => 
                                  {
                                    ScrollToTop();
                                    setTab("tab5")
                                  }
                                }
                              >
                                <FaArrowLeft />
                                <span className="hover-text">
                                  &nbsp;Previous
                                </span>
                              </div>
                              <Link
                                to={
                                  process.env.PUBLIC_URL +
                                  "/report/goal-analysis"
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
              ) : (
                <div className="asset-recomm text-center py-5">
                  <div className="container">
                    <div className="row justify-content-center">
                      <div className="col-md-8">
                        <h3>Session Data Not Available</h3>
                        <p className="mt-3">Unable to load your data at this time. This could be due to a temporary issue or your session may have expired.</p>
                        <button className="btn btn-primary mt-4" onClick={checksession}>
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DatagatherReportLayout>
    </>
  );
};
export default AssetsLib;
