import { useEffect, useState } from "react";

import Bag from "../../../Assets/Images/CommonDashboard/suitcase.png";

import { Link, useNavigate } from "react-router-dom";
import CommonDashboardLayout from "../../../components/Layout/Commomdashboard";

import TopPicks from "../../../components/TopPicks";
import Style from "./style.module.css";
import "./style.css";
import InvestmentCategories from "../../../components/InvestmentCategories";
import AmcSlider from "../../../components/AmcSlider";
import PortfolioValue from "../../../components/PortfolioValue";
import {DATA_BELONGS_TO} from "../../../constants";
import {
  apiCall,
  getItemLocal,
  getUserId,
  loginRedirectGuest,
} from "../../../common_utilities";
import ProfilePercentage from "../../../components/ProfilePercentage";
import NiftySensex from "../../../components/CommonDashboard/NiftySensex";
import MakeYourTaxPlan from "../../../components/MakeYourTaxPlan";
import BlogBoxSection from "./BlogBoxSection";
import MaxGainerLooser from "../../../components/MaxGainerLooser";
import { useDispatch, useSelector } from "react-redux";
import { fetchEncryptData } from "../../../common_utilities";
import FintooLoader from "../../../components/FintooLoader";

const Investment = (props) => {

  const rdxSelectedTab = useSelector((state)=> state.investDashboardTabActiveTab);
  const dispatch = useDispatch();
  const [returnsType, setReturnsType] = useState("xirr");
  const [selectedTab, setSelectedTab] = useState(1);
  const [dashboardData, setDashboardData] = useState({});
  const [amcData, setAmcData] = useState({});
  const [topPicks, setTopPicks] = useState({});
  const [invData, setInvData] = useState({});
  const [pan, setPan] = useState("");
  const [mainData, setMainData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gainerData, setGainerData] = useState([]);
  const [loserData, setLoserData] = useState([]);
  const [hasPf, setHasPf] = useState(false);
  const navigate = useNavigate();

  const getDashboardData = async () => {
    // setIsLoading(true);
    // let url = DMF_GET_DASHBOARD_DATA;
    // let data = {};
    // if (getItemLocal("family")) {
    //   var new_array_ids = [];
    //   var new_array_pans = [];
    //   var new_data = getItemLocal("member");
    //   new_data.forEach((element) => {
    //     if (element.id !== null) {
    //       new_array_ids.push(element.id.toString());
    //     }
    //     if (element.pan !== null) {
    //       new_array_pans.push(element.pan);
    //     }
    //   })
    //   data = {"user_id": new_array_ids, "pan": new_array_pans};
    // } else {
    //   data = {"user_id":getUserId()};
    // }
    // var res = await apiCall(url, data);
    // setIsLoading(false);
    // if (res.error_code == "100") {
    //   setAmcData(res.data.top_amc_data);
    //   setTopPicks(res.data.top_fund_data);
    //   setInvData(res.data.investment);
    // }
  };
  
  const fetchFundsData = async () => {
    try {
      var payload_userdetails = {
        url: '',
        method: "post",
        data: { user_id: "" + getUserId() },
      };

      var res_userdetails = await fetchEncryptData(payload_userdetails);
      if (Boolean(res_userdetails.data.pan) == false) {
        throw "PAN not found";
      }
      
      var payload_pf_summary = {
        url: '',
        data: {
          pan: res_userdetails.data.pan,
          data_belongs_to: DATA_BELONGS_TO,
        },
        method: "post",
      };
      var res_pf_summary = await fetchEncryptData(payload_pf_summary);
      if (res_pf_summary.error_code == "100") {
        setMainData(res_pf_summary.data);
        // GraphData(res.data);
        gainerLoserData(res_pf_summary.data.fund_details);
        setHasPf(true);
      }
    } catch (e) {
      console.error(e);
    }
  };


  const gainerLoserData = (val) => {
    var myarray = val;
    var numDescending = myarray.sort((a, b) => b.day_change_perc - a.day_change_perc);
    var filteredNumDescending = numDescending.filter(item => item.day_change_perc > 0);
    var data = { ...val, numDescending: filteredNumDescending };
    var numAscending = myarray.sort((a, b) => a.day_change_perc - b.day_change_perc);
    var filteredNumAscending = numAscending.filter(item => item.day_change_perc < 0);
    var data2 = { ...val, numAscending: filteredNumAscending };
    let myObjectGainer = data.numDescending;
    if (Object.keys(myObjectGainer).length < 6) {
      delete myObjectGainer.numDescending;
    }
    const gainerValues = Object.values(myObjectGainer).slice(0, 6);
    let myObjectLoser = data2.numAscending;
    if (Object.keys(myObjectLoser).length < 6) {
      delete myObjectLoser.numAscending;
    }
    const loserValues = Object.values(myObjectLoser).slice(0, 6);
    setGainerData(gainerValues);
    setLoserData(loserValues);
  };

  useEffect(() => {
    if (getUserId()) {
      getDashboardData();
      fetchFundsData();
    } else {
      loginRedirectGuest();
    }
  }, []);

  // useEffect(()=>{
  //   fetchFundsData();
  // }, [!isLoading])

  useEffect(()=> {
    if(selectedTab == 1) {
      dispatch({
        type: "INVEST_DASHBOARD_CHANGE_TAB",
        payload: 'mf',
      });
    } 
    // else {
    //   dispatch({
    //     type: "INVEST_DASHBOARD_CHANGE_TAB",
    //     payload: 'stocks',
    //   });
    // }
  }, [selectedTab]);

  return (
    <>
      <FintooLoader isLoading={isLoading} />
        {!isLoading  && ( 
          <CommonDashboardLayout>
          <div className="px-0 px-md-4">
            {/* <p style={{ height: "2rem" }}></p> */}
            <div className="row ">
              <div className="col-12">
                <div className={`row `}>
                  <div className="col-12 col-md-5">
                    <div className="pe-md-2">
                      <ProfilePercentage />
                        <div className="py-4">
                          <PortfolioValue data={mainData} invData={invData}/>
                        </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-7">
                    <div className="ps-2">
                      {/* <NiftySensex /> */}
                      <MaxGainerLooser gainerData={gainerData} loserData={loserData}/>
                    </div>
                  </div>
                </div>
              </div>
    
              <div className="col-12 col-md-8">
                <div className={Style.insideTabBoxd}>
                  <div className="d-flex pt-3">
                    <div
                      onClick={() => setSelectedTab(1)}
                      className={`pointer ${Style.tabBx} ${
                        selectedTab == 1 ? Style.active : ""
                      }`}
                    >
                      <div
                        className={`mb-0 ${Style.tabText} d-flex align-items-center`}
                      >
                        <div className="pe-1">
                        <img src={process.env.REACT_APP_STATIC_URL + "media/DMF/mficon83.png"} width={25} />
                        </div>
                        <div>Mutual Funds</div>
                      </div>
                    </div>
                    <div
                      onClick={() => setSelectedTab(2)}
                      className={`pointer ${Style.tabBx} ${
                        selectedTab == 2 ? Style.active : ""
                      }`}
                    >
                      {/* <div
                        className={`mb-0 ${Style.tabText} d-flex align-items-center`}
                      >
                        <div className="pe-1">
                          <img src={require("./Images/stocks63.png")} width={25} />
                        </div>
                        <div>Stocks</div>
                      </div> */}
                    </div>
                  </div>
                </div>
                {Boolean(topPicks.length) && (
                  <div className={Style.MFData}>
                  <div className="d-flex justify-content-between">
                    <div className={Style.Datatext}>
                      <p>Top Picks</p>
                    </div>
                    <div>
                      <button onClick={() => {
                          navigate(
                            process.env.PUBLIC_URL + "/direct-mutual-fund/funds/recommended"
                          );
                        }}
                      className={Style.button}>Explore All</button>
                    </div>
                  </div>
                  <TopPicks data={topPicks}/>
                </div>
                )}
                {!hasPf ? (
                  <>
                      <div className={Style.MFData}>
                        <div
                          className="d-flex justify-content-between"
                          style={{
                            borderBottom: "1px solid #eeee",
                          }}
                        >
                        <div className={Style.Datatext}>
                          <p>Category</p>
                        </div>
                        <div>
                          <button onClick={() => {
                              navigate(
                                process.env.PUBLIC_URL + "/direct-mutual-fund/funds/all"
                              );
                            }}
                          className={Style.button}>Explore All</button>
                        </div>
                      </div>
                        <InvestmentCategories />
                      </div>
      
                  <div className={Style.MFData}>
                    <div
                      className="d-flex justify-content-between"
                      style={{
                        borderBottom: "1px solid #eeee",
                      }}
                    >
                      <div className={Style.Datatext}>
                        <p>AMC</p>
                      </div>
                      <div>
                        <button
                          className={Style.button}
                          onClick={() => {
                            navigate(
                              process.env.PUBLIC_URL + "/direct-mutual-fund/funds/all"
                            );
                          }}
                        >
                          Explore All
                        </button>
                      </div>
                    </div>
                    <AmcSlider data={amcData} />
                  </div>
                  </>
                ) : 
                <>
                </>
                }
                <div className="py-3 px-3 px-md-0">
                  <MakeYourTaxPlan />
                </div>
              </div>
              <div className="col-12 col-md-4" style={!hasPf ? ({paddingTop: "50em"}) : ({paddingTop: "4rem"})}>
                <div className="py-3">
                  <BlogBoxSection />
                </div>
              </div>
            </div>
          </div>
        </CommonDashboardLayout>
        )}
    </>
  );
};

export default Investment;
