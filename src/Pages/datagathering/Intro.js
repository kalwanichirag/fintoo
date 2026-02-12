import React, { useState, useEffect, useRef } from "react";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { BsPencilFill } from "react-icons/bs";
import { BiSave } from "react-icons/bi";
import { Link } from "react-router-dom";
import DatagatherReportLayout from "../../components/Layout/Datagather/Reports";
import * as toastr from "toastr";
import "toastr/build/toastr.css";
import {
  imagePath,
} from "../../constants";
import {
  getParentUserId, getItemLocal,
  loginRedirectGuest,
  fetchEncryptData,
  fetchData, toTitleCase, setBackgroundDivImage, apiCall,
  getUserId
} from "../../common_utilities";
import {
  fetchUserAssumptions,
  fetchUserInflations,
  fetchUserExpenses,
  updateSetting
} from "../../FrappeIntegration-Services/services/financial-planning-api/rp_intro";
import FintooLoader from "../../components/FintooLoader";
import { ScrollToTop } from "./ScrollToTop"
import { updateUserSettingData } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
const AboutYou = () => {



  const [tab, setTab] = useState("tab1");
  const [tab123, setTab123] = useState("tab5");
  const [name, setName] = useState('');
  const [assumptionData, setAssumptionData] = useState([]);
  const [inflationData, setInflationData] = useState([]);
  const session = useRef(null);
  const [sessionData, setSessionData] = useState("");
  const [rorData, setRorData] = useState([]);
  const [inflation, setInflation] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceDesc1, setServiceDesc1] = useState("");
  const [assumptionSetting, setAssumptionSetting] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');


  useEffect(() => {
    document.body.classList.add("dg-layout");
    document.body.classList.add("rp-layout");
  
    const interval = setInterval(() => {
      const reportIntro = document.getElementById("report-bg-intro");
      if (reportIntro) {
        reportIntro.style.background = `url(${imagePath}/static/media/DG/reports/ill-introduction.svg) no-repeat right top`;
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
  


  useEffect(() => {
    getAllTabData();
  }, []);

  const getAboutPlanData = async (sessionData) => {
    try {
      let payload = {
        method: "post",
        data: {
          user_id: sessionData["data"]["id"],
          fp_log_id: sessionData["data"]["fp_log_id"],
          fp_user_id: sessionData["data"]["fp_user_id"],
          plan_id: sessionData.data["plan_id"]
        },
        url: '',
      };

      let decodedRes = await fetchEncryptData(payload);

      let resData = decodedRes['data'];
      if (decodedRes.error_code == "100") {
        for (let i = 0; i < resData.length; i++) {
          if (resData[i]['description'] != undefined) {
            // if (response.data[i]['description'].toLowerCase() == "Quotes".toLowerCase()) {
            //     quote = response.data[i]['field1'];
            //     quotewriter = response.data[i]['field2'];

            if (resData[i]['description'].toLowerCase() == sessionData.data['fp_plan_service'].toLowerCase()) {
              setServiceDesc1(resData[i]['field1']);
              setIsDataLoaded(true);
            }
          }
        }

      }

    }
    catch (e) {
      console.log("Error", e)
    }

  }

  const handleAssumptionEditClick = (id) => {
    let updatedAssumptionData = {}
    updatedAssumptionData["editAssumptionId"] = id;

    for (let i = 0; i < rorData.length; i++) {
      if (rorData[i].id === id) {
        updatedAssumptionData["changedROR"] = rorData[i].ROR;
        updatedAssumptionData["previousCAGR"] = rorData[i].CAGR;
        break;
      }
    }

    setAssumptionData(prevAssumptionData => ({
      ...prevAssumptionData,
      ...updatedAssumptionData
    }));

    setRorData(prev => prev.map(v => {
      v.tempCAGR = undefined;
      return v;
    }));
  };


  const handleInflationEditClick = (id) => {
    setInflationData((prevData) => {
      const updatedData = { ...prevData };

      updatedData.editInfId = id;

      const inflationToUpdate = inflation.find((item) => item.id === id);
      if (inflationToUpdate) {
        updatedData.changedInflation = inflationToUpdate.IR; // Store edited Inflation name
      }

      return updatedData;
    });
  };

  const saveupdatefpinflations = async () => {

    try {
      let payload = {
        user_id: getParentUserId(),
        update_type: "Inflation",
        update_field: {
          "pre_retirement_inflation": parseFloat(inflation["0"]["Percentage"]),
          "post_retirement_inflation": parseFloat(inflation["0"]["Percentage"])
        }
      }
      let res = await updateUserSettingData(payload);

      if (res["status_code"] == 200) {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.success(inflationData.changedInflation + " updated successfully !!");
        setInflationData(prev => ({
          ...prev,
          "editInfId": null
        }));

        getfpuserInflations();
        reportDownload();
      } else {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error(res['message']);
      }

    }
    catch (e) {
      console.log("Error", e);
    }
  }

  const getAllTabData = async () => {
    try {


      setIsLoading(false)
      setSessionData(sessionData)

      let name = user_data ? user_data["user_name"] : "";

      setName(name);
      // getAboutPlanData(sessionData);


      getfpuserAssumptions();
      getfpuserInflations();
    } catch (e) {
      console.log("err", e);
    }
  }

  // const getAppendixData = async (sessionData) => {
  //   try {
  //     let payload = {
  //       method: "post",
  //       data: {
  //         user_id: sessionData["data"]["id"],
  //         fp_log_id: sessionData["data"]["fp_log_id"],
  //         fp_user_id: sessionData["data"]["fp_user_id"]
  //       },
  //       url: ADVISORY_GET_APPENDIXDATA_API_URL,
  //     };

  //     let decodedRes = await fetchEncryptData(payload);
  //     if (decodedRes.error_code == "100") {
  //       let resData = decodedRes['data'];
  //       setAssumptionSetting(decodedRes['data'])
  //     }
  //   }
  //   catch (e) {
  //     console.log("Error", e)
  //   }
  // }

  const getfpuserAssumptions = async () => {
    // getAppendixData(sessionData);

    try {
      let response = await fetchUserAssumptions(getParentUserId());
      if (response.status_code == 200) {

        let resData = response['data']
        let tempRor = Object.entries(resData).map(([ROR, CAGR], index) => ({
          ROR: ROR.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
          CAGR,
          id: index + 1,
          ROR_id: ROR
        }));

        setRorData(tempRor);
      }
      else {
        setRorData([]);
      }


    }
    catch (e) {
      console.log("Error", e)
    }
  };

  const getfpuserInflations = async () => {

    await getUserExpenses();

    try {

      let resInflations = await fetchUserInflations(getParentUserId());
      // let resInflations = await fetchEncryptData(payload);

      //set pre-retirement inflation
      if (resInflations.status_code == 200) {

        setInflationData(prev => ({
          ...prev,
          ...{ "pre_retire_inflation": resInflations['data']?.['pre_retirement_inflation'] }
        }))

        //collect post-retirement and other user entered inflations
        var allInflations = {};

        var resData = resInflations['data'];

        let tempInflation = Object.entries(resData)
          .filter(([IR, _]) => IR === "post_retirement_inflation")
          .map(([IR, Percentage], index) => ({
            IR: IR.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
            Percentage,
            id: index + 1,
          }));

        setInflation(tempInflation);
      }
      else {
        setInflation([]);
      }

    } catch (e) {
      console.log("err", e);
    }
  }

  const getUserExpenses = async () => {
    let expenses = {};

    try {

      let res = await fetchUserExpenses(getUserId());
      res = res['message']
      if (res.status_code == 200) {
        var resExp = res['data'];

        resExp.forEach((expense, index) => {
          if (expense.user_expense_growth_rate != 0) {
            let inflation_name = expense.name + " " + expense.user_expense_name;
            let percent = expense.user_expense_growth_rate;
            expenses[inflation_name] = percent;
          }
        });

        let tmpExpenses = Object.entries(expenses).map(([IR, Percentage], index) => ({
          IR: toTitleCase(IR),
          Percentage,
          id: index + 1,
        }));

        setExpenses(tmpExpenses);

      }

    } catch (e) {
      console.log("Error: ", e);
    };

  };

  const reportDownload = async () => {
    if (sessionData) {
      const { id, fp_user_id, fp_log_id, plan_id } = sessionData.data;
      try {
        const downloadReport = async (summaryreport) => {
          const apiUrl = `${ADVISORY_DOWNLOAD_REPORT}?filename=all&action=downloadreport&merge=all&user_id=${id}&fp_user_id=${fp_user_id}&fp_log_id=${fp_log_id}&plan_id=${plan_id}&summaryreport=${summaryreport}`;

          const response = await apiCall(apiUrl, "", false, false);

          if (response.error_code === "100") {
            if (summaryreport == 0) {
              toastr.options.positionClass = "toast-bottom-left";
              toastr.success("Your report is ready to download.");
            }
          }
        };

        const api_data = {
          fp_log_id: fp_log_id,
          user_id: id,
          doc_type: "148"
        };

        const config1 = {
          method: "POST",
          url: '',
          // url: ADVISORY_GET_SET_REPORT_STATUS,
          data: api_data,
        };

        const response1 = await fetchEncryptData(config1);

        if (response1.error_code === "100") {
          await downloadReport(1);
        }

        const api_report_data = {
          fp_log_id: fp_log_id,
          user_id: id,
          doc_type: "77"
        };

        const config2 = {
          method: "POST",
          url: '',
          // url: ADVISORY_GET_SET_REPORT_STATUS,
          data: api_report_data,
        };

        const response2 = await fetchEncryptData(config2);

        if (response2.error_code === "100") {
          await downloadReport(0);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  const saveupdatefpassumptions = async (v) => {
    try {

      if (isNaN(v.tempCAGR) || v.tempCAGR === null || v.tempCAGR === "") {
        toastr.options.positionClass = "toast-bottom-left";
        toastr.error("Please enter valid data for " + assumptionData.changedROR);
      }
      else {

        let payload = {
          user_id: getUserId(),
          update_type: "Assumption",
          update_field: { [String(v.ROR_id)]: parseFloat(v.tempCAGR) }
        }
        let configUpdateAssumptions = await updateUserSettingData(payload);
        // let configUpdateAssumptions = await fetchData(payload);

        if (configUpdateAssumptions["status_code"] === 200) {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.success(assumptionData.changedROR + " updated successfully !!");
          setAssumptionData(prev => ({ ...prev, "editAssumptionId": null }));
          getfpuserAssumptions()
          scrollToAssumptions();

        } else {
          toastr.options.positionClass = "toast-bottom-left";
          toastr.error(configUpdateAssumptions["message"]);

          setRorData(prev => {
            return prev.map((item) => {
              if (assumptionData.editAssumptionId == item.id) {
                return { ...item, CAGR: assumptionData.previousCAGR };
              } else {
                return item;
              }
            })
          })
        }

      }
    }
    catch (e) {
      console.log("Error", e)
    }
  }
  return (
    <DatagatherReportLayout>
      <FintooLoader isLoading={isLoading} />

      <div className="reports ">
        <div className="">
          <div className="background-div">
            <div class="bg active" id="report-bg-intro"></div>
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
                  <div className="tab-menu-title">ASSUMPTION</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab3" ? "active" : ""}`}
                  onClick={() => setTab("tab3")}
                >
                  <div className="tab-menu-title">GLOSSARY</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab4" ? "active" : ""}`}
                  onClick={() => setTab("tab4")}
                >
                  <div className="tab-menu-title">DISCLAIMER</div>
                </div>
              </div>
            </div>
            <div>
              <div className={tab == "tab1" ? "d-block" : "d-none"}>

                <>
                  <div className="about-plan-container">
                    <div className="col-md-12 col-lg-11">
                      <div className="row">
                        <div className="col-md-12 report-intro">
                          <div className="intro-quote default-background-grey">
                            <div className="row align-items-center">
                              <div className="">
                                <h2 className="founders-note text-center">Founder's Note</h2>
                              </div>
                            </div>
                          </div>
                          <p id="FonderName" style={{ fontWeight: '600' }}>Dear User, </p>
                          <h3
                            className="founder-username"
                            style={{
                              fontFamily: "Caveat Medium",
                            }}
                          >
                            Congratulations!
                          </h3>
                          <div className="servicedescdiv">
                            <p>You have taken the first and the most important step towards creating a secured financial future for yourself and your family. Before we get started, I would like to thank you for placing your trust in Fintoo.</p>

                            <p>I promise you expert guidance and tailored advice in the form of a customized, detailed financial plan that has been specially created to address your needs.</p>

                            <p>If you’re wondering how financial planning helps, remember that it offers direction to your goals and ensures that you’ll also be able to provide yourself with a comfortable life post-retirement when you invest in this exercise.</p>

                            <p>I would also like to take a moment to remind you that the best financial plan is one that’s reviewed regularly. This ensures that it is effective despite your changing needs, goals and responsibilities. To this effect, we will schedule regular reviews to keep you on track and tally assumptions with actual outcomes.</p>

                            <p>Should you require any clarifications and/or modifications in the plan, we are happy to assist you.</p>

                            <p>We look forward to being your partner on this fruitful journey.</p>

                            <p>If at any point of time you need my attention, you can reach me at <b>founder@fintoo.in.</b></p>

                            <p>I truly believe that our connection with our customers is beyond just a few transactions.</p>

                            {/* <p
                                dangerouslySetInnerHTML={{
                                  __html: serviceDesc1 ? serviceDesc1 : "",
                                }}
                              ></p> */}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        justifyContent: "flex-end"
                      }}>
                        <div className="text-center">
                          <div >
                            Best regards,
                          </div>
                          <br />
                          <div>
                            <b className="founder-name">Manish Hingar</b>
                          </div>
                          <br />
                          <div>
                            <b>Founder, Fintoo</b>
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="no-data-found d-none text-center">
                      <div className="container">
                        <div className="row justify-content-center align-items-center">
                          <div className="col-md-10">
                            <img
                              src={imagePath + "/static/svg/data-not-found.svg"}
                              alt="Data not found"
                            />
                            {/* <h1>OOPS!</h1>
                          <h2>Data Not Found</h2> */}
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
                              href="datagathering/about-you"
                              target="_blank"
                              className="link"
                            >
                              Complete Profile
                            </a>
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
                </>


              </div>
              <div className={tab == "tab2" ? "d-block" : "d-none"}>
                <div className="appendix">
                  <div className="tabs innerTabs subTabWrapper">
                    <ul
                      className="nav-buttons nav-secoandary d-inline-flex"
                      id="intro-appendix"
                    >
                      <li
                        className={`tab-menu-item ${tab123 == "tab5" ? "active default-background-grey" : ""
                          }`}
                      >
                        <a href onClick={() => setTab123("tab5")}>
                          Rate of Return Assumption
                        </a>
                      </li>
                      <li
                        className={`tab-menu-item ${tab123 == "tab6" ? "active default-background-grey" : ""
                          }`}
                      >
                        <a href onClick={() => setTab123("tab6")}>
                          Inflation Assumptions
                        </a>
                      </li>
                    </ul>
                    <div>
                      <div className={tab123 == "tab5" ? "d-block" : "d-none"}>
                        <h4 className="rTitle">
                          <img
                            // src={imagePath + "/static/svg/ror-assumption.svg"}
                            src={imagePath + "/static/media/DG/reports/introduction/ror-assumption.svg"}
                          />
                          Rate of Return Assumption..
                        </h4>
                        {/* ngRepeat: sectiondata in assumptiondata.settingdata[16] */}
                        <div className="rContent" style={{}}>
                          <p

                          >
                            <p>Two elements form the basis of an effective financial plan;</p><ol><li>Input data</li><li>Assumptions</li></ol><p>After understanding your current financial position and performing an in-depth analysis of the information collected during the Data Gathering Process, our financial experts have identified a perfect starting point for you along with making logical assumptions about your investments returns, expenses and inflation etc.</p><p>It is extremely important for you to know about these assumptions as they are the variable factors that will shape your financial plan and will also have an impact on its efficacy.</p><p>
                              <b>Note: Making The Changes In The Assumption Will Change The Calculation Based On It</b></p>
                          </p>
                        </div>
                        {/* end ngRepeat: sectiondata in assumptiondata.settingdata[16] */}
                        <div className="row assumptionheight">
                          <div className="col-md-6">
                            <div className="table-responsive rTable">
                              <div id="AssumptionTableForm">
                                <table className="bgStyleTable">
                                  <tbody>
                                    <tr>
                                      <th style={{ width: "45%" }}>
                                        Rate Of Return (ROR)</th>
                                      <th style={{ width: "55%" }}>
                                        Compound Annual Growth Rate (CAGR %)
                                      </th>
                                    </tr>
                                    {rorData.map((v, index) => (
                                      <>
                                        <tr key={index} style={{}}>
                                          <td className="">{v.ROR}</td>
                                          <td className="position-relative">
                                            <span className="editrow d-flex">
                                              {assumptionData.editAssumptionId === v.id ? (
                                                <>
                                                  <span className="d-block">
                                                    <input
                                                      type="text"
                                                      name={v.ROR.replace(/ /g, "_")}
                                                      maxLength={2}
                                                      minLength={1}
                                                      id={v.ROR.replace(/ /g, "_")}
                                                      className=""
                                                      value={v.tempCAGR ?? v.CAGR}
                                                      onChange={(e) => {
                                                        setRorData(prev => {
                                                          return prev.map((x, j) => {
                                                            if (index == j) {
                                                              return { ...x, tempCAGR: e.target.value.replace(/[^0-9.]/, '') };
                                                            } else {
                                                              return x;
                                                            }
                                                          })
                                                        });
                                                      }}
                                                      onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                          saveupdatefpassumptions();
                                                          e.preventDefault();
                                                        }
                                                      }}
                                                      style={{ width: "40px", padding: "0 10px" }}
                                                    //   
                                                    />
                                                  </span>
                                                </>
                                              ) : (
                                                <>
                                                  <span style={{ width: "5%" }}>{Number(v.CAGR)}</span>
                                                </>
                                              )}

                                              <span className="editing-icon pointer" style={{ marginLeft: "5%" }}>
                                                {assumptionData.editAssumptionId === v.id ? (
                                                  <BiSave onClick={() => saveupdatefpassumptions(v)} />
                                                ) : (

                                                  <BsPencilFill onClick={() => handleAssumptionEditClick(v.id)} />
                                                )}
                                              </span>
                                            </span>
                                          </td>
                                        </tr>
                                      </>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                        </div>

                        <div className="row pt-4 mb-4">
                          <div className=" text-center">
                            <div>
                              <div className="btn-container">
                                <div className="d-flex justify-content-center">
                                  <div
                                    className="previous-btn form-arrow d-flex align-items-center"
                                    onClick={() => {
                                      ScrollToTop();
                                      setTab("tab1");
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
                                      setTab123("tab6");
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

                        <div className="row py-2 mt-5">
                          {/* <div className=" text-center">
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
                                    <span className="hover-text">
                                      &nbsp;Previous9999
                                    </span>
                                  </div>
                                  {/* <button className="default-btn gradient-btn save-btn">
                                  Save & Add More
                                </button> */}
                          {/* <div
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
                                  </div> */}
                          {/* </div> */}
                          {/* </div> */}
                          {/* </div> */}

                          {/* </div>  */}

                          <div className="container">
                            <div
                              className="notes_sec_div"
                              style={{ border: "none !important" }}
                            >
                              <div className="notes_head_div">
                                <i
                                  style={{
                                    backgroundSize: "100%",
                                    width: "50px",
                                    height: "70px",
                                    display: "block",
                                    position: "absolute",
                                    top: "-25px",
                                    left: "-15px",
                                  }}
                                ></i>
                                <span>Glossary</span>
                              </div>
                              {/* <div className="notes_text_div mt-5"> */}
                              <></>
                              {/* {assumptionSetting != undefined && assumptionSetting.settingdata != undefined
                              ?
                              //  assumptionSetting.sessiondata.indexOf(16) > -1
                              //   ?
                              assumptionSetting.settingdata[15].map((v, index) => (
                                <>
                                  <div className="notes_text_div mt-5"
                                    dangerouslySetInnerHTML={{
                                      __html: v.field1 ? v.field1 : "",
                                    }}
                                  ></div>
                                </>
                              ))
                              // : ""
                              :
                              ""
                            } */}
                              <div className="riskAppetiteBox mt-5">

                                <div className="notes_text_div">
                                  <h3>Here’s What Each Part Of Your Rate Of Return Stands For:</h3>
                                  <ol><li><b>Debt post-retirement</b>:
                                    This is the rate of return that is assumed for debt investments that you make after retirement. Our experts use it to make post-retirement cash flow recommendations and for calculations about retirement planning.</li>
                                    <br />
                                    <li><b>Debt pre-retirement</b>:
                                      This is the rate of return that is assumed for debt investments that you make before retirement. Our experts use it to determine cash flow and for asset mapping.</li>
                                    <br />
                                    <li><b>Equity post-retirement</b>:
                                      This is the rate of return that is assumed for equity investments that you make after retirement. Our experts use it to make post-retirement cash flow recommendations and for calculations about your retirement planning.</li><br />
                                    <li><b>Equity pre-retirement</b>: This is the rate of return that is assumed for equity investments that you make before retirement. Our experts use it to determine cash flow and for asset mapping.</li><br />
                                    <li><b>Gold</b>: This is the rate of return that is assumed for all your gold investments, be it physical gold, gold ETFs or gold mutual funds. Our experts use it to make cash flow recommendations and for asset mapping.</li><br />
                                    <li class="addbreak"><b>Human Life Value (HLV) Rate</b>: This is called the Human life Value Rate which is used to calculate the life insurance corpus required for you. Basically, the assumption is if something unfortunate happens to you and your family claims the insurance money from the insurance company then they would be investing the entire insurance Sum Assured at this rate.</li>
                                    <br /><li><b>Liquid fund</b>: It is assumed that this rate of return is offered by short-term liquid fund investments that you make for building an emergency fund. Our experts use it to make cash flow recommendations and for asset mapping.</li><br />
                                    <li><b>Real estate</b>: This is the rate of return that is assumed for all your real estate investments. Our experts use it to make cash flow recommendations and for asset mapping.</li></ol>
                                </div>

                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                      <div className={tab123 == "tab6" ? "d-block" : "d-none"}>
                        <h4 className="rTitle">
                          <img
                            src={imagePath + "/static/media/DG/reports/introduction/ror-assumption.svg"}
                          />
                          Inflation Assumptions
                        </h4>

                        <div className="rContent" style={{}}>
                          <p className="" />
                          <p>
                            <p>There are two elements that form the basis of an effective financial plan: input data and assumptions. They have also arrived at certain reasonable assumptions regarding investments returns, expenses, inflation, income growth rates, etc. based on the information you have shared. </p><p>It’s important for you to know what these assumptions are, as they’re the variable factors that give shape to your financial plan and ultimately have a bearing on its efficacy.</p>
                          </p>

                          <p />
                        </div>

                        <div className="row">
                          <div className="col-md-6">
                            <div className="table-responsive rTable">
                              <table className="bgStyleTable">
                                <tbody>
                                  <tr>
                                    <th className="w-50 default-background-grey" style={{ width: "60%" }}>Inflation Rate</th>
                                    <th className="default-background-grey" style={{ width: "70%" }}>Percentage (%)</th>
                                  </tr>

                                  {/* Show Expenses inflations */}
                                  {expenses.map((v) => (
                                    <>
                                      {/* ngRepeat: (key,value) in return_assumption | orderByValue */}
                                      <tr style={{}}>
                                        <td className="">{v.IR}</td>
                                        <td className="position-relative">
                                          <span className="editrow d-flex justify-content-between">
                                            <span>{v.Percentage}</span>
                                          </span>
                                        </td>
                                      </tr>
                                    </>
                                  ))}

                                  {/* ngRepeat: (key,value) in inflation_data | orderByValue */}
                                  {inflation.map((v, index) => (
                                    <>
                                      <tr style={{}}>
                                        <td className="">{v.IR}</td>
                                        <td className="position-relative">
                                          <span className="editrow d-flex">
                                            {inflationData.editInfId === v.id ? (
                                              <>
                                                <span className="d-block">
                                                  <input
                                                    type="text"
                                                    maxLength={2}
                                                    minLength={1}
                                                    name={v.IR.replace(/ /g, "_")}
                                                    id={v.IR.replace(/ /g, "_")}
                                                    value={v.Percentage}
                                                    className=""
                                                    onChange={(e) => {
                                                      setInflation(prev => {
                                                        return prev?.map((x, j) => {
                                                          if (index == j) {
                                                            return { ...x, Percentage: e.target.value.replace(/[^0-9.]/, '') };
                                                          } else {
                                                            return x;
                                                          }
                                                        })
                                                      });
                                                    }}
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        saveupdatefpinflations();
                                                        e.preventDefault();
                                                      }
                                                    }}
                                                    style={{ width: "40px", padding: "0 10px" }}
                                                  />
                                                </span>
                                              </>
                                            ) : (
                                              <>
                                                <span style={{ width: "5%" }}>{Number(v.Percentage)}</span>
                                              </>
                                            )}
                                            <span className="editing-icon pointer" style={{ marginLeft: "5%" }}>
                                              {inflationData.editInfId === v.id ? (
                                                <BiSave onClick={saveupdatefpinflations} />
                                              ) : (
                                                <BsPencilFill onClick={() => handleInflationEditClick(v.id)} />
                                              )}
                                            </span>
                                          </span>
                                        </td>
                                      </tr>
                                    </>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="row pt-4 mb-4">
                            <div className=" text-center">
                              <div>
                                <div className="btn-container">
                                  <div className="d-flex justify-content-center">
                                    <div
                                      className="previous-btn form-arrow d-flex align-items-center"
                                      onClick={() => {
                                        ScrollToTop();
                                        setTab123("tab5");
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



                        {/* <div
                          style={{ paddingBottom: "5%", clear: "both" }}
                        ></div> */}
                        <div className="container mt-5">
                          <div
                            className="notes_sec_div"
                            style={{ border: "none !important" }}
                          >
                            <div className="notes_head_div">
                              <i
                                style={{
                                  backgroundSize: "100%",
                                  width: "50px",
                                  height: "70px",
                                  display: "block",
                                  position: "absolute",
                                  top: "-25px",
                                  left: "-15px",
                                }}
                              ></i>
                              <span>Glossary</span>
                            </div>
                            {/* <div className="notes_text_div mt-5"> */}
                            <></>

                            <div className="notes_text_div mt-5">
                              <ol><li><b>Post-retirement inflation</b>: All the expenses that you will incur after retirement are inflated at this rate. Our experts use it to make post-retirement cash flow recommendations and to determine the quantum of corpus you need for your retirement.</li>
                                <br /></ol>
                            </div>


                            {/* </div> */}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={tab == "tab3" ? "d-block" : "d-none"}>
                <div className="pageHolder">
                  <h4 className="rTitle">
                    <img
                      src={imagePath + "/static/media/DG/reports/introduction/glossary.svg"}
                      className="title-icon"
                    />{" "}
                    Glossary
                  </h4>
                  <div>
                    <div className="glossarydata" style={{}}>
                      <p className="labelHead">Assumptions: -</p>
                      <p>
                        Assumptions are logical financial forecasts about
                        income, expenses, inflation, deflation, growth and
                        reduction that are made on the bases of past records and
                        logical expectations.
                      </p>
                      <br />
                      <p className="labelHead">Inflation: -</p>
                      <p>
                        A general rise in prices / the rate at which prices rise
                        each year.
                      </p>
                      <br />
                      <p className="labelHead">Variable Factors: -</p>
                      <p>
                        The factors whose output changes with the changing input
                        are called variable factors. In financial planning,
                        EXAMPLES are called as variable factors.
                      </p>
                      <br />
                      <p className="labelHead">Rate Of Return (ROR): -</p>
                      <p>
                        The annual income from an investment expressed as a
                        proportion (usually a percentage) of the original
                        investment.
                      </p>
                      <br />
                      <p className="labelHead">
                        Compound Annual Growth Rate Percentage (CAGR %): -
                      </p>
                      <p>
                        It is the rate of return (RoR) that would be required
                        for an investment to grow from its beginning balance to
                        its ending balance, assuming the profits were reinvested
                        at the end of each period of the investment’s life span.
                      </p>
                      <br />
                      <p className="labelHead">Debt Investments: -</p>
                      <p>
                        Buying a debt instrument can be considered as lending
                        money to the entity issuing the instrument. A debt fund
                        invests in fixed-interest generating securities such as
                        corporate bonds, government securities, treasury bills,
                        commercial paper, and other money market instruments.
                      </p>
                      <br />
                      <p className="labelHead">Asset Mapping: -</p>
                      <p>
                        Asset Mapping is a process used to identify and link
                        individual, group, and community assets that can be used
                        to achieve one or multiple financial goals.
                      </p>
                      <br />
                      <p className="labelHead">Equity Investments: -</p>
                      <p>
                        An equity investment is money that is invested in a
                        company by purchasing shares of that company in the
                        stock market. These shares are typically traded on a
                        stock exchange.
                      </p>
                      <br />
                      <p className="labelHead">Risk Appetite: -</p>
                      <p>
                        Risk appetite is the level of risk that an individual is
                        prepared to take in order to achieve the financial
                        goals.
                      </p>
                      <br />
                      <p className="labelHead">IPOs: -</p>
                      <p>
                        An Initial Public Offering or stock launch is a public
                        offering in which shares of a company are sold to
                        institutional investors and usually also retail
                        investors.
                      </p>
                      <br />
                      <p className="labelHead">Equity Mutual Funds: -</p>
                      <p>
                        An equity fund is a mutual fund that invests principally
                        in stocks. It can be actively or passively (index fund)
                        managed. Equity funds are also known as stock funds.
                      </p>
                      <br />
                      <p className="labelHead">Threshold: -</p>
                      <p>
                        A threshold is an amount, level, or limit on a scale.
                        When the threshold is reached, something else happens or
                        changes.
                      </p>
                      <br />
                      <p className="labelHead">Blue-Chip Stocks: -</p>
                      <p>
                        A blue chip is a stock in a stock corporation with a
                        national reputation for quality, reliability, and the
                        ability to operate profitably in good and bad times. The
                        blue chip stocks mostly refer to the stocks of the
                        Fortune 500 companies like Apple, Amazon, Coca Cola etc.
                      </p>
                      <br />
                      <p className="labelHead">Tax Advantage: -</p>
                      <p>
                        Tax advantage refers to the economic bonus which applies
                        to certain accounts or investments that are, by statute,
                        tax-reduced, tax-deferred, or tax-free. Examples of
                        tax-advantaged accounts and investments include
                        retirement plans, education savings accounts, medical
                        savings accounts, and government bonds.
                      </p>
                      <br />
                      <p className="labelHead">
                        Equity Linked Savings Schemes (ELSS): -
                      </p>
                      <p>
                        An Equity Linked Saving Scheme (ELSS) is an open-ended
                        equity mutual fund that invests primarily in equities
                        and equity-related products. They are a special category
                        among mutual funds that qualify for tax deductions under
                        Section 80C of the Income Tax Act, 1961.
                      </p>
                      <br />
                      <p className="labelHead">
                        Unit Linked Insurance Plans (ULIPs): -
                      </p>
                      <p>
                        A unit linked insurance plan (ULIP) is a multi-faceted
                        product that offers both insurance coverage and
                        investment exposure in equities or bonds. This product
                        requires policyholders to make regular premium payments.
                        Part of the premiums goes toward insurance coverage,
                        while the remaining portion is pooled with assets from
                        other policyholders and invested in either equities,
                        bonds, or a combination of both.
                      </p>
                      <br />
                      <p className="labelHead">Tax-Saving Fixed Deposits: -</p>
                      <p>
                        Tax Saver Fixed Deposits are a type of fixed deposits in
                        which the depositor can claim a tax deduction under
                        Section 80C of the Indian Income Tax, 1961. ... The
                        maturity period of the tax saver fixed deposit is 5
                        years. Deduction under section 80C is available to the
                        Hindu Undivided Family (HUF) and individuals.
                      </p>
                      <br />
                      <p className="labelHead">Government Savings Schemes: -</p>
                      <p>
                        Saving schemes are instruments that help individuals
                        achieve their financial goals over a particular period.
                        These schemes are launched by the Government of India,
                        public/private sector banks, and financial institutions.
                        The government or banks decide the interest rate for
                        these schemes and are periodically updated.
                      </p>
                      <br />
                      <p className="labelHead">Government Bonds: -</p>
                      <p>
                        A government bond is a debt instrument issued by the
                        Central and State Governments of India. The Government
                        Bond interest rates, also called a coupon, can either be
                        fixed or floating disbursed on a semi-annual basis. In
                        most cases, GOI issues bonds at a fixed coupon rate in
                        the market. Treasury Bills, Cash Management Bills
                        (CMBs), Dated Government Securities, State Development
                        Loans, Treasury Inflation-Protected Securities (TIPS),
                        Zero-Coupon Bonds, Capital Indexed Bonds and Floating
                        Rate Bonds are some of the examples of Government Bonds.
                      </p>
                      <br />
                      <p className="labelHead">Fixed Income Schemes: -</p>
                      <p>
                        Fixed income broadly refers to those types of investment
                        security that pay investors fixed interest or dividend
                        payments until its maturity date. At maturity, investors
                        are repaid the principal amount they had invested.
                        Government and corporate bonds are the most common types
                        of fixed-income products.
                      </p>
                      <br />
                      <p className="labelHead">
                        Mandatory Variable Expenses: -
                      </p>
                      <p>
                        Essential expenses whose amount keeps changing every
                        month. EXAMPLES Clothes, Groceries, Food, Medical,
                        Electricity Bills.
                      </p>
                      <br />
                      <p className="labelHead">Mandatory Fixed Expenses: -</p>
                      <p>
                        Essential expenses whose amount remains constant every
                        month. EXAMPLES Insurance Premium, Rent.
                      </p>
                      <br />
                      <p className="labelHead">Wishful Variable Expenses: -</p>
                      <p>
                        Non-essential expenses whose amount keeps changing every
                        month. EXAMPLES Restaurant Bills, Holiday Expenses,
                        Mobile Bill.
                      </p>
                      <br />
                      <p className="labelHead">Wishful Fixed Expenses: -</p>
                      <p>
                        Non-essential expenses whose amount remains constant
                        every month. EXAMPLES Internet Charges, Television
                        Connection.
                      </p>
                      <br />
                      <p className="labelHead">
                        Systematic Investment Plans (SIPs): -
                      </p>
                      <p>
                        A systematic investment plan is an investment vehicle
                        offered by many mutual funds to investors, allowing them
                        to invest small amounts periodically instead of lump
                        sums. The frequency of investment is usually weekly,
                        monthly or quarterly.
                      </p>
                      <br />
                      <p className="labelHead">Saving Ratio: -</p>
                      <p>
                        The savings rate is a measurement of the amount of
                        money, expressed as a percentage or ratio, that a person
                        deducts from their disposable personal income to set
                        aside as a nest egg or for retirement. The savings rate
                        is also related to the marginal propensity of an
                        individual to save.
                      </p>
                      <br />
                      <p className="labelHead">Expense Ratio: -</p>
                      <p>
                        The expense ratio (ER) is a measure of mutual fund
                        operating costs relative to assets. Investors pay
                        attention to the expense ratio to determine if a fund is
                        an appropriate investment for them after fees are
                        considered.
                      </p>
                      <br />
                      <p className="labelHead">Shortfall: -</p>
                      <p>
                        The amount by which something is less than you need or
                        expect.
                      </p>
                      <br />
                      <p className="labelHead">Surplus: -</p>
                      <p>The amount that is extra or more than you need.</p>
                      <br />
                      <p className="labelHead">Corpus: -</p>
                      <p>
                        Corpus is described as the total money invested in a
                        particular scheme by all investors.
                      </p>
                      <br />
                      <p className="labelHead">Asset Allocation: -</p>
                      <p>
                        Represents the various asset classes that the investment
                        is made in. Eg. Stocks, Bonds, Cash, Equity, Debt,
                        Securities, etc.
                      </p>
                      <p>
                        The Other category includes the asset classes that are
                        recognized but not included in the above-mentioned asset
                        classes. Eg. Real Estate is classified as Other.
                      </p>
                      <p>
                        The Not Classified category is for those securities that
                        are not recognized or tracked. The tables highlight the
                        net asset allocation percentages of the portfolio along
                        with the component long positions (assets) and short or
                        marginal positions (liabilities).
                      </p>
                      <br />
                      <p className="labelHead">
                        World Regions – Geographical Exposure: -
                      </p>
                      <p>
                        This helps you understand your portfolio’s geographical
                        exposure, on the basis of region and market maturity.
                        The exposure is determined using the non-cash equity
                        assets only. The Not Classified category highlights the
                        percentage of the equity portion in the portfolio whose
                        region or origin cannot be determined.
                      </p>
                      <br />
                      <p className="labelHead">
                        Stock Sector – Sector Exposure: -
                      </p>
                      <p>
                        The stock sector denotes the percentage of the equity
                        assets in the portfolio that are invested in each of the
                        three super sectors i.e. information, service, and
                        manufacturing economies along with the 12 major industry
                        subclassifications, in comparison with the benchmark.
                        The Sector Graph with the table signifies the sector
                        orientation of the portfolio. The Not Classified
                        category showcases those securities that are not
                        recognized or tracked. Rel B mark i.e. the percentage of
                        every sector that composes the benchmark index is also
                        listed.
                      </p>
                      <br />
                      <p className="labelHead">
                        Top 10 Underlying Holdings – Underlying Holdings
                      </p>
                      <p>
                        Underlying holdings represent the holdings with the most
                        potential. It denotes the total percentage of such
                        assets in the entire portfolio. It also mentions the
                        security type, sector, and the country of origin of the
                        asset.
                      </p>
                      <br />
                      <p className="labelHead">
                        Total Return – Final Return: -
                      </p>
                      <p>
                        The final return represents performance without adding
                        or removing the sales charges or effects of taxation. It
                        is only adjusted to showcase the current fund expenses
                        along with assuming that the dividends and capital gains
                        are reinvested.
                      </p>
                      <p>
                        The portfolio returns and benchmark returns are
                        calculated on the basis of asset-weighting the monthly
                        returns of the underlying holdings. It, therefore,
                        reflects the pretax results that the investor may have
                        received by rebalancing the portfolio every month. These
                        returns help in calculating the returns-based
                        statistics. The returns for individual holdings are
                        trailing the total returns.
                      </p>
                      <br />
                      <p className="labelHead">Risk And Return Profile: -</p>
                      <p>
                        R-squared is the percentage of the fund’s movement in
                        correlation with the movement in the benchmark index. It
                        basically shows the degree of correlation between the
                        fund and the benchmark.
                      </p>
                      <p>
                        The fund’s sensitivity to the market’s movement is
                        measured in Beta value. Any portfolio having a beta
                        value of 1 is considered to be more volatile than the
                        market and a portfolio with a value of less than 1 is
                        believed to be less volatile than the market.
                      </p>
                      <p>
                        The difference between a fund’s actual return and its
                        expected performance is measured using the Alpha value,
                        while its level of risk is measured using the Beta
                        value.
                      </p>
                      <p>
                        The reward per unit of risk is measured in the Sharpe
                        Ratio. It is risk-adjusted and calculated using standard
                        deviation and excess return. The Sharpe Ratio indicates
                        the historical risk-adjusted performance of the fund.
                        The higher the Sharpe Ratio, the better the performance.
                      </p>
                      <p>
                        The Sharpe Ratio is calculated by dividing a fund’s
                        excess returns by the standard deviation of a fund’s
                        excess returns.
                      </p>
                      <p>
                        The most appropriate application of Sharpe Ratio is
                        while analysing a fund that is an investor’s sole
                        holding.
                      </p>
                      <p>
                        The Sharpe Ratio helps to compare the two funds and
                        understand the exact amount of risk that a fund had to
                        bear to earn the excess return in comparison to the
                        returns without any risk.
                      </p>
                      <p>
                        The standard deviation helps you understand the
                        difference between the deviated and average values for a
                        particular fund type. If the deviation value, whether
                        positive or negative, is higher or lower than the
                        average value, the performance of the fund has been far
                        below or above the average performance. But if the
                        deviation value is closer to the average value, the fund
                        has performed closer to the average.
                      </p>
                      <p>
                        The annual performance of the fund over three years is
                        measured in Mean value.
                      </p>
                      <br />
                      <p className="labelHead">Growth Graph: -</p>
                      <p>
                        The growth graph compares the growth of the fund with an
                        index and the average of all funds in a similar
                        category. The amount of total returns are adjusted to
                        showcase the actual current fund expenses, considering
                        the reinvestment of dividends and capital gains. If
                        adjusted, the sales charges would reduce the quoted
                        performance. Index is an unmanaged portfolio of
                        specified securities and the index. None of the initial
                        or ongoing expenses are included in the category
                        average. It is expected that a fund’s portfolio may
                        differ from the securities in the index. Also, the
                        assigned index may differ from the one in the fund’s
                        prospectus.
                      </p>
                      <br />
                      <p className="labelHead">Risk Scatter Graph: -</p>
                      <p>
                        This graph gives you an overview of the spread of the
                        risk and reward of each holding in comparison with the
                        most recent three-year period. The way is measuring risk
                        is a 3-year standard deviation of return and the return
                        is measured as a 3 year mean return. This graph also
                        helps you understand the risk and return of the
                        portfolio.
                      </p>
                      <br />
                      <p className="labelHead">Correlation Matrix: -</p>
                      <p>
                        The correlation matrix helps you understand the
                        correlation between different holdings. A correlation
                        value of 1 indicates the two holdings move in the same
                        direction, a correlation of -1 indicates the two
                        holdings move in opposite directions and a correlation
                        of 0 means that no correlation could be found. A
                        correlation of -1 showcases maximum diversification.
                      </p>
                      <br />
                    </div>
                    <div className="no-data-found text-center" style={{}}>
                      <div className="container d-none">
                        <div className="row justify-content-center align-items-center">
                          <div className="col-md-10">
                            <img
                              src={imagePath + "/static/svg/data-not-found.svg"}
                              alt="Data not found"
                            />
                            {/* <h1>OOPS!</h1>
                  <h2>Data Not Found</h2> */}
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
                              href="datagathering/about-you"
                              target="_blank"
                              className="link"
                            >
                              Complete Profile
                            </a>
                          </div>
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
                                setTab("tab2")
                              }
                              }
                            >
                              <FaArrowLeft />
                              <span className="hover-text">&nbsp;Previous</span>
                            </div>
                            {/* <button className="default-btn gradient-btn save-btn">
                                  Save & Add More
                                </button> */}
                            <div
                              className="next-btn form-arrow d-flex align-items-center "
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
              <div className={tab == "tab4" ? "d-block" : "d-none"}>
                <div>
                  <h4 className="rTitle" style={{}}>
                    <img
                      src={imagePath + "/static/media/DG/reports/introduction/disclaimer.svg"}
                    />
                    Disclaimer
                  </h4>
                  <div className="" style={{}}>
                    <p>
                      The Client hereby agrees and understands that this report
                      and services are provided on the basis of the information
                      provided by the Client to us strictly on an “as is”,
                      “where is” and “as available” basis with no
                      representations or warranties of any kind, express or
                      implied from us with regard to accuracy or effect of the
                      contents herein.
                    </p>

                    <p>
                      The Client agrees that they would take prudent decisions
                      based on the report herein, whilst exercising caution and
                      with the complete understanding that Fintoo Wealth Private Limited or any of its associates are not liable for any
                      damages of any kind arising from the use of the contents
                      of this report, including, but not limited to direct,
                      indirect, incidental, punitive and consequential damages.
                    </p>

                    <p>
                      The Client acknowledges that investment advice are subject
                      to market status and risks and that past performances are
                      not reliable basis for future returns.
                    </p>

                    <p>
                      Actions taken by the Client on the basis of this report
                      with third parties are fully based on the Client’s
                      personal judgement and Fintoo Wealth Private Limited or any
                      of its associates are not party to or in any way be
                      responsible for any transaction between user and such
                      party provider. The Client expressly agrees and
                      acknowledges to hold Fintoo Wealth Private Limited or any of
                      its associates harmless in respect of any cost, claims,
                      damage, loss or expenses accrued, suffered, incurred by
                      Fintoo Wealth Private Limited or any of its associates
                      arising out of or in connection with any such
                      communication, interaction, dealings and transactions
                      between the user and third-party providers. The Client’s
                      foregoing assurance is based on the understanding that
                      Fintoo Wealth Private Limited or any of its associates do
                      not have any control over such dealings and transactions
                      and plays no determinative role in the performance in
                      respect of the same&nbsp;&nbsp;and Fintoo Wealth Private Limited or any of its associates shall not be liable for
                      the outcomes of such communication, interaction, dealings
                      and transactions between the users and the third-party
                      providers.All calculation are done on the basis of pre tax
                      value which is subjected to change according to the local
                      taxation.
                    </p>
                  </div>
                  <div className="no-data-found text-center">
                    <div className="container d-none">
                      <div className="row justify-content-center align-items-center">
                        <div className="col-md-10">
                          <img
                            src={imagePath + "/static/svg/data-not-found.svg"}
                            alt="Data not found"
                          />
                          {/* <h1>OOPS!</h1>
              <h2>Data Not Found</h2> */}
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
                            href="datagathering/about-you"
                            target="_blank"
                            className="link"
                          >
                            Complete Profile
                          </a>
                        </div>
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
                          {/* <button className="default-btn gradient-btn save-btn">
                                  Save & Add More
                                </button> */}
                          <Link
                            to={
                              process.env.PUBLIC_URL +
                              "/report/profile"
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

export default AboutYou;
