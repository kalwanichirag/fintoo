import { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Styles from "./ManageTriggers.module.css";
import { Link, useNavigate } from "react-router-dom";
import Managetriggers from "../../../components/Layout/Managetriggers";
import Profile from "../../../components/MangeTriggers/Profile";
import Bell from "../../../Assets/Images/CommonDashboard/Bell.png";
import TriggerAccordion from "../../../components/MangeTriggers/TriggerAccordion";
import ToolTip from "../../../components/HTML/ToolTip";
import { apiCall,getUserId } from "../../../common_utilities";
import { BASE_API_URL } from "../../../constants";
import FintooButton from "../../../components/HTML/FintooButton";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
const Triggers = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [subChange, SetSubchange] = useState("Subscribed");
  const [disableAcc, SetDisableAcc] = useState(false);
  const report_freq = ['Monthly', 'Quarterly', 'Semi Annually', 'Annually'];
  const buzzing_mf_freq = ['Monthly', 'Quarterly'];
  const stock_mf_percentage_change = ['3%','5%','10%','15%','20%'];
  const percentage_change = ['5%','10%','15%','20%'];
  const movement = ['Appreciation','Depreciation','Both'];
  const Mode = ['Email','WhatsApp','Both'];
  const goal_freq = ['1 Month', '2 Months', '3 Months', '6 Months'];
  useEffect(() => {
    fetchvalues()
  }, []);
  async function fetchvalues() {
    const triggerDefaulyValues = [
      {'report_frequency': 'Monthly'},
      {'portfolio_percentage': '5%', 'portfolio_movement': 'Both', 'portfolio_Mode': 'Both'},
      {'mutual_fund_percentage': '3%', 'mutual_fund_movement': 'Both', 'mutual_fund_Mode': 'Both'},
      {'stock_percent': '3%', 'stock_movement': 'Both', 'stock_Mode': 'Both'},
      {'buzz_mutual_fund_frequency': 'Monthly', 'buzz_mutual_fund_Mode': 'Both'},
      {'goal_frequency': '3 Months'},
      {'Subscription':true},
      {'Report':true},
      {'Portfolio':true},
      {'MutualFunds':true},
      {'Stocks':true},
      {'BuzzMF':true},
      {'Goals':true},
    ]
    let url = BASE_API_URL + "managetrigger/";
    let payload = {
      "user_id":getUserId(),
      "tag":"all",
      "data":triggerDefaulyValues
    }
    let default_data = await apiCall(url, payload, false, false);
    let dfdata = default_data['data']['data'];

    setSelectReportFreq(dfdata['report_preference']['report_frequency']);

    setSelectPortfolioMode(dfdata['portfolio_preference']['portfolio_Mode']);
    setSelectPortfolioMovement(dfdata['portfolio_preference']['portfolio_movement']);
    setSelectPortfolioPercentage(dfdata['portfolio_preference']['portfolio_percentage']);

    setSelectMFPercentage(dfdata['mutual_fund_preference']['mutual_fund_percentage']);
    setSelectMFMovement(dfdata['mutual_fund_preference']['mutual_fund_movement']);
    setSelectMFMode(dfdata['mutual_fund_preference']['mutual_fund_Mode']);

    setSelectStockPercentage(dfdata['stock_preference']['stock_percent']);
    setSelectStockMovement(dfdata['stock_preference']['stock_movement']);
    setSelectStockMode(dfdata['stock_preference']['stock_Mode']);

    setSelectBuzzMFFreq(dfdata['buzzing_mutual_fund_preference']['buzz_mutual_fund_frequency']);
    setSelectBuzzMFMode(dfdata['buzzing_mutual_fund_preference']['buzz_mutual_fund_Mode']);

    setSelectGoalFreq(dfdata['goal_preference']['goal_frequency']);

    if (dfdata['Subscription'] == 1) setisSub(true); else setisSub(false);
    if (dfdata['Report'] == 1) setisreportsub(true); else setisreportsub(false); 
    if (dfdata['Portfolio'] == 1) setisportfoliosub(true); else setisportfoliosub(false);
    if (dfdata['MutualFunds'] == 1) setismfsub(true); else setismfsub(false);
    if (dfdata['Stocks'] == 1) setisstocksub(true); else setisstocksub(false);
    if (dfdata['BuzzMF'] == 1) setisbuzzsub(true); else setisbuzzsub(false);
    if (dfdata['Goals'] == 1) setisgoalsub(true); else setisgoalsub(false)
    
    return dfdata;
  }

  // Report Default Preference
  const [selectReportFreq, setSelectReportFreq] = useState();
 
  // Portfolio Default Preference
  const [selectPortfolioPercentage, setSelectPortfolioPercentage] = useState();
  const [selectPortfolioMovement, setSelectPortfolioMovement] = useState();
  const [selectPortfolioMode, setSelectPortfolioMode] = useState();

  // Mututal Fund Default Preference
  const [selectMFPercentage, setSelectMFPercentage] = useState();
  const [selectMFMovement, setSelectMFMovement] = useState();
  const [selectMFMode, setSelectMFMode] = useState();

  // Stock Default Preference
  const [selectStockPercentage, setSelectStockPercentage] = useState();
  const [selectStockMovement, setSelectStockMovement] = useState();
  const [selectStockMode, setSelectStockMode] = useState();

  // Buzzing Mutual Fund Default Preference
  const [selectBuzzMFFreq, setSelectBuzzMFFreq] = useState();
  const [selectBuzzMFMode, setSelectBuzzMFMode] = useState();

  // Goal Default Preference
  const [selectGoalFreq, setSelectGoalFreq] = useState();

  //is Subscribed Preference
  const [isSubscribed,setisSub] = useState();
  const isSubscribedChange = (newValue) => {
    setisSub(newValue);
  };

  const [isreportSub,setisreportsub] = useState();
  const isreportSubChange = (newValue) => {
    setisreportsub(newValue);
  };

  const [isportofolioSub,setisportfoliosub] = useState();
  const isportofolioSubChange = (newValue) => {
    setisportfoliosub(newValue);
  };

  const [isMFSub,setismfsub] = useState();
  const isMFSubChange = (newValue) => {
    setismfsub(newValue);
  };

  const [isStockSub,setisstocksub] = useState();
  const isStockSubChange = (newValue) => {
    setisstocksub(newValue);
  };
  
  const [isBuzzSub,setisbuzzsub] = useState();
  const isBuzzSubChange = (newValue) => {
    setisbuzzsub(newValue);
  };
  
  const [isGoalSub,setisgoalsub] = useState();
  const isGoalSubChange = (newValue) => {
    setisgoalsub(newValue);
  };

  const report_pref = {
    "report_frequency": selectReportFreq,
  }
  
  const portfolio_pref = {
    "portfolio_percentage":selectPortfolioPercentage,
    "portfolio_movement":selectPortfolioMovement,
    "portfolio_Mode":selectPortfolioMode,
  }

  const mutual_fund_pref = {
    "mutual_fund_percentage":selectMFPercentage,
    "mutual_fund_movement":selectMFMovement,
    "mutual_fund_Mode":selectMFMode,
  }

  const buzz_mutual_fund_pref = {
    "buzz_mutual_fund_frequency":selectBuzzMFFreq,
    "buzz_mutual_fund_Mode":selectBuzzMFMode,
  }
  
  const stock_pref = {
    "stock_percent":selectStockPercentage,
    "stock_movement":selectStockMovement,
    "stock_Mode":selectStockMode,
  }

  const goal_pref = {
    "goal_frequency":selectGoalFreq,
  }

  const saveReportPref = ()=> {
    let url = BASE_API_URL + "managetrigger/";
    let payload = {
      "user_id":getUserId(),
      "tag":"report",
      "data":report_pref
    }
    let report_data = apiCall(url, payload, false, false);
    toast.info("Saved", {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
    })
  }

  const savePortfolioPref = ()=> {
    let url = BASE_API_URL + "managetrigger/";
    let payload = {
      "user_id":getUserId(),
      "tag":"portfolio",
      "data":portfolio_pref
    }
    let portfolio_data = apiCall(url, payload, false, false);
    toast.info("Saved", {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
    })
  }

  const saveMFPref = ()=> {
    let url = BASE_API_URL + "managetrigger/";
    let payload = {
      "user_id":getUserId(),
      "tag":"mutual_fund",
      "data":mutual_fund_pref
    }
    let mutual_fund_data = apiCall(url, payload, false, false);
    toast.info("Saved", {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
    })
  }

  const saveBuzzMFPref = ()=> {
    let url = BASE_API_URL + "managetrigger/";
    let payload = {
      "user_id":getUserId(),
      "tag":"buzz_mutual_fund",
      "data":buzz_mutual_fund_pref
    }
    let buzz_mutual_fund_data = apiCall(url, payload, false, false);
    toast.info("Saved", {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
    })
  }
  
  const saveStockPref = ()=> {
    let url = BASE_API_URL + "managetrigger/";
    let stock_payload = {
      "user_id":getUserId(),
      "tag":"stocks",
      "data":stock_pref
    }
    let stock_data = apiCall(url, stock_payload, false, false);
    toast.info("Saved", {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
    })
  }

  const saveGoalPref = ()=> {
    let url = BASE_API_URL + "managetrigger/";
    let payload = {
      "user_id":getUserId(),
      "tag":"goals",
      "data":goal_pref
    }
    let goal_data = apiCall(url, payload, false, false);
    toast.info("Saved", {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
    })
  }



  useEffect(() => {
    document.body.classList.add("page-ManageTrigger");
  }, []);
  return (
    <Managetriggers>
      
      <div className={Styles.TriggersData}>
        <div className={Styles.TriggerHead}>
          <div>
            <div className={Styles.TextLabel}>Manage Triggers</div>
            <div className={Styles.SmallTxt}>
              Manage Triggers Of Your Fintoo Account
            </div>
          </div>
          <div className={`${Styles.ButtonsOption}`}>
            <button>
              <span>
                <img  src={process.env.REACT_APP_STATIC_URL + "media/DMF/Bell.svg"} width={16} />
              </span>
              {subChange}
            </button>
            <div className={Styles['hover-menu-u']}>
              <div className={Styles['hover-menu-bx']}>
                <div onClick={()=>{SetSubchange("Subscribed");SetDisableAcc(false);
                toast.info("You have successfully Subscribed for all Triggers", {
                  position: toast.POSITION.BOTTOM_LEFT,
                  autoClose: 2000,
                });}} className={`${Styles['hover-menu-li']} d-flex align-items-center`}><img src={process.env.REACT_APP_STATIC_URL + "media/all.png"} /><span>All</span></div>
                <div onClick={()=>{setShowModal(true);}} className={`${Styles['hover-menu-li']} d-flex align-items-center`}><img src={process.env.REACT_APP_STATIC_URL + "media/unsubscribe.svg"}  /><span>Unsubscribe</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className={`pt-3 ${disableAcc ? Styles.AccordionChange : null}`}>
          <TriggerAccordion title={"Financial Planning Report"} is_sub={isreportSub} onChange={isreportSubChange}>
            <div className={Styles["box-container"]}>
              <div className="row">
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Frequency</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            The time interval for which you would like to get the report. 
                            For eg: Monthly, Quarterly, Annually.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {report_freq.map((reportfreq)=> (<div>
                        <button onClick={()=> {
                          setSelectReportFreq(reportfreq);
                        }} className={selectReportFreq == reportfreq ? Styles.active : ''}>{reportfreq}</button>
                      </div>)
                    )}

                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end pt-3">
                <FintooButton title={"Save"} onClick={saveReportPref}/>
              </div>
            </div>
          </TriggerAccordion>

          <TriggerAccordion title={"Portfolio Value"} is_sub={isportofolioSub} onChange={isportofolioSubChange}>
            <div className={Styles["box-container"]}>
              <div className="row">
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Trigger</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            The % change in the movement of the portfolio. 
                            For example, there can  be 5%, 10% or 15% changes in the movement respectively.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {percentage_change.map((portfoliopercentval)=> (<div>
                        <button onClick={()=> {
                        setSelectPortfolioPercentage(portfoliopercentval);
                        }} className={selectPortfolioPercentage == portfoliopercentval ? Styles.active : ''}>{portfoliopercentval}</button>
                      </div>)
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Movement</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            Movement means appreciation or depreciation in the movement of the price. 
                            You can opt for Appreciation, Depreciation or both.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {movement.map((portfoliomovementval)=> (<div>
                        <button onClick={()=> {
                        setSelectPortfolioMovement(portfoliomovementval);
                        }} className={selectPortfolioMovement == portfoliomovementval ? Styles.active : ''}>{portfoliomovementval}</button>
                      </div>)
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Mode</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            Through which medium one would like to receive the trigger. 
                            One can opt for Email, whatsapp or both.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {Mode.map((portfolioModeval)=> (<div>
                        <button onClick={()=> {
                        setSelectPortfolioMode(portfolioModeval);
                        }} className={selectPortfolioMode == portfolioModeval ? Styles.active : ''}>{portfolioModeval}</button>
                      </div>)
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end pt-3">
                <FintooButton title={"Save"} onClick={savePortfolioPref}/>
              </div>
            </div>
          </TriggerAccordion>

          <TriggerAccordion title={"Mutual Fund"} is_sub={isMFSub} onChange={isMFSubChange}>
            <div className={Styles["box-container"]}>
              <div className="row">
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Trigger</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            The % change in the movement of the NAV. 
                            For example, there can  be 5%, 10% or 15% changes in the movement respectively.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {stock_mf_percentage_change.map((MFpercentval)=> (<div>
                        <button onClick={()=> {
                        setSelectMFPercentage(MFpercentval);
                        }} className={selectMFPercentage == MFpercentval ? Styles.active : ''}>{MFpercentval}</button>
                      </div>)
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Movement</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            Movement means appreciation or depreciation in the movement of the NAV. 
                            You can opt for Appreciation, Depreciation or both.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {movement.map((MFmovementval)=> (<div>
                        <button onClick={()=> {
                        setSelectMFMovement(MFmovementval);
                        }} className={selectMFMovement == MFmovementval ? Styles.active : ''}>{MFmovementval}</button>
                      </div>)
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Mode</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            Through which medium one would like to receive the trigger. One can opt for Email, whatsapp or both.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {Mode.map((MFModeval)=> (<div>
                        <button onClick={()=> {
                        setSelectMFMode(MFModeval);
                        }} className={selectMFMode == MFModeval ? Styles.active : ''}>{MFModeval}</button>
                      </div>)
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end pt-3">
                <FintooButton title={"Save"} onClick={saveMFPref}/>
              </div>
            </div>
          </TriggerAccordion>

          <TriggerAccordion title={"Stock Price"} is_sub={isStockSub} onChange={isStockSubChange}>
            <div className={Styles["box-container"]}>
              <div className="row">
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Trigger</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            The % change in the movement of the Stock price. 
                            For example, there can  be 3%, 5%, 10% or 15% changes in the movement respectively.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {stock_mf_percentage_change.map((stockpercentval)=> (<div>
                        <button onClick={()=> {
                        setSelectStockPercentage(stockpercentval);
                        }} className={selectStockPercentage == stockpercentval ? Styles.active : ''}>{stockpercentval}</button>
                      </div>)
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Movement</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            Movement means appreciation or depreciation in the movement of the price. 
                            You can opt for Appreciation, Depreciation or both.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {movement.map((stockmovementval)=> (<div>
                        <button onClick={()=> {
                        setSelectStockMovement(stockmovementval);
                        }} className={selectStockMovement == stockmovementval ? Styles.active : ''}>{stockmovementval}</button>
                      </div>)
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Mode</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            Through which medium one would like to receive the trigger. 
                            One can opt for Email, whatsapp or both.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {Mode.map((stockModeval)=> (<div>
                        <button onClick={()=> {
                        setSelectStockMode(stockModeval);
                        }} className={selectStockMode == stockModeval ? Styles.active : ''}>{stockModeval}</button>
                      </div>)
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end pt-3">
                <FintooButton title={"Save"} onClick={saveStockPref}/>
              </div>
            </div>
          </TriggerAccordion>

          <TriggerAccordion title={"Most Buzzing MF"} is_sub={isBuzzSub} onChange={isBuzzSubChange}>
            <div className={Styles["box-container"]}>
              <div className="row">
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Frequency</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            Duis aute irure dolor in reprehenderit in voluptate
                            velit esse cillum dolore eu fugiat nulla pariatur.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {buzzing_mf_freq.map((buzzmffreq)=> (<div>
                        <button onClick={()=> {
                          setSelectBuzzMFFreq(buzzmffreq);
                        }} className={selectBuzzMFFreq == buzzmffreq ? Styles.active : ''}>{buzzmffreq}</button>
                      </div>)
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Mode</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            Duis aute irure dolor in reprehenderit in voluptate
                            velit esse cillum dolore eu fugiat nulla pariatur.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {Mode.map((BuzzMFModeval)=> (<div>
                        <button onClick={()=> {
                        setSelectBuzzMFMode(BuzzMFModeval);
                        }} className={selectBuzzMFMode == BuzzMFModeval ? Styles.active : ''}>{BuzzMFModeval}</button>
                      </div>)
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-4 py-3">
                  <div>
                    <p>&nbsp;</p>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end pt-3">
                <FintooButton title={"Save"} onClick={saveBuzzMFPref}/>
              </div>
            </div>
          </TriggerAccordion>

          <TriggerAccordion title={"Goals"} is_sub={isGoalSub} onChange={isGoalSubChange}>
          <div className={Styles["box-container"]}>
              <div className="row">
                <div className="col-12 col-md-4 py-3">
                  <div className={Styles["box-inner-head"]}>
                    <div className={Styles["box-inner-con"]}>
                      <p className={Styles["accd-name"]}>Reminder</p>
                      <ToolTip>
                        <div style={{ width: "20rem" }}>
                          <p>
                            <strong>Note:</strong>
                          </p>
                          <p>
                            Trigger will be sent according to the option selected prior to the goal completion date. 
                            For eg: 1 month or 2 months prior to the goal completion date an update regarding the goal will be triggered.
                          </p>
                        </div>
                      </ToolTip>
                    </div>
                  </div>
                  <div className={Styles.buttonList}>
                    {goal_freq.map((goalfreqval)=> (<div>
                        <button onClick={()=> {
                        setSelectGoalFreq(goalfreqval);
                        }} className={selectGoalFreq == goalfreqval ? Styles.active : ''}>{goalfreqval}</button>
                      </div>)
                    )}
                  </div>
                </div>
                
              </div>
              <div className="d-flex justify-content-end pt-3">
                <FintooButton title={"Save"} onClick={saveGoalPref}/>
              </div>
            </div>
          </TriggerAccordion>
        </div>
      </div>
      <Modal centered show={showModal} className="trigger-popup" onHide={()=>{setShowModal(false);}}>
        <Modal.Body>
          <div className="modal-body-box">
            <p className="pt-3 pb-0 text-center h4 bb-1">
              Unsubscribe From Receiving Triggers
            </p>
            <hr className="pop-hr"/>
            <p className="pt-2 pb-0 text-center h5">
              Do You Really Want To Unsubscribe From Receiving Triggers?
            </p>
            <div className="pb-3 pt-5 ">
              <div className="d-flex justify-content-center">
                  <FintooButton title={"Yes"} onClick={()=>{setShowModal(false);setSuccessModal(false);SetSubchange("Unsubscribed");SetDisableAcc(true);}} className="mx-2"/>
                  <FintooButton className="mx-2" title={"No"} />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal centered show={successModal} className="trigger-popup" onHide={()=>{setSuccessModal(false);}}>
        <Modal.Body>
          <div className="modal-body-box">
            <div className="text-center pt-3 pb-3">
              <img style={{width: '40px'}} src={process.env.REACT_APP_STATIC_URL + "media/tick.svg"} />
            </div>
            <p className="pt-2 pb-0 text-center h5">
              Successfully Unsubscribed From Receiving Triggers
            </p>
            <div className="pb-3 pt-5 ">
              <div className="d-flex justify-content-center">
                <FintooButton title={"Ok"} onClick={()=>{setShowModal(false);setSuccessModal(false);SetSubchange("Unsubscribed");SetDisableAcc(true)}} className="mx-2"/>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Managetriggers>
  );
};

export default Triggers;
