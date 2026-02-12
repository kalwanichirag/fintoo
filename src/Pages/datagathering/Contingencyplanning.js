import { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Cookies from "js-cookie";
import LifeInsurance from "../../Assets/Datagathering/Graph/LifeInsurance";
import Medicalinsurance from "../../Assets/Datagathering/Graph/Medicalinsurance";
import DatagatherReportLayout from "../../components/Layout/Datagather/Reports";
import FintooLoader from "../../components/FintooLoader";
// import {
//   CHECK_SESSION,
//   ADVISORY_GET_INSURANCE_DATA,
//   ADVISORY_GET_LIFE_INSURANCE,
//   ADVISORY_GET_MEMBER_COUNT,
//   imagePath,
//   userManagementEndpoints,
// } from "../../constants";
import { getmedicalInsuranceApi, getRecContingencyRisk } from "../../FrappeIntegration-Services/services/user-management-api/userApiService";
import {
  getParentUserId,
  getItemLocal,
  fetchEncryptData,
  loginRedirectGuest,
  numberFormat,
  setBackgroundDivImage,
  apiCall,
  fetchData,
  getParentFpLogId,
} from "../../common_utilities";
import { Link } from "react-router-dom";
import { ScrollToTop } from "./ScrollToTop";
import { imagePath } from "../../constants";
import { GetCurrentInsuranceData } from "../../FrappeIntegration-Services/services/financial-planning-api/reports/contingency-planning";
import { get_life_insurance } from "../../FrappeIntegration-Services/services/financial-planning-api/rp_contingency";
import { getMedicalInsurance } from "../../FrappeIntegration-Services/services/financial-planning-api/insurance";

const user_data = JSON.parse(localStorage.getItem("user_data") || '{}');
let user_id1 = user_data.user_id;
let user_name1 = user_data.user_name;
let data_belongs_to = process.env.REACT_APP_DATA_BELONGS_TO;

const Contingencyplanning = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState("tab1");
  const [isOpen, setIsOpen] = useState(false);
  const [memberCount, setMemberCount] = useState([]);
  const sessionData = useRef();
  const [contingencyRiskData, setContingencyRiskData] = useState({
    expense: 0,
    spouseEarning: false,
    total_liquid_asset: 0,
    emergencyCorpusRecommendationText: "",
    six_month_expense: 0,
    required_corpus: 0,
    scorecard_expense: 0,
    total_liquid_asset_scorecard: 0,
    contingency_statement: "",
    contingency_rec: "",
    total_corpus: 0,
    contingency_goal_id: "0"
  });
  const [insuranceData, setInsuranceData] = useState({
    insuranceDataa: {},
    healthInsuranceData: {},
    totalsumassured: 0,
    totalpremiumamt: 0,
    totalhealthsumassured: 0,
    totalhealthpremiumamt: 0,
    rpdata_screendata: {},
  });
  const [mediaclInsuranceData, setMediaclInsuranceData] = useState({
    shortfallorsurplusamt: 0,
    existingmedicalcover: 0,
    idealmedicalcover: 0,
    topupamount: 0,
    type: "",
    medicalgraphdata: {},
    sectionText: {},
  });
  const [lifeInsuranceData, setLifeInsuranceData] = useState({
    lifeInsuranceDataa: {},
    totalOutstanding: 0,
    totalGoalPresentValue: 0,
    policyDetailsTotal: 0,
    idealCover: 0,
    existingCover: 0,
    totalExp: 0,
    lifeInsurancegraphdata: {},
  });
  const [medicalQuestionData, setMedicalQuestionData] = useState({
    questionData: {},
    ans1: 0,
    ans2: 0,
    ans3: 0,
  });

  const [selfName, setSelfName] = useState("");
  const [familyData, setFamilyData] = useState("");
  const [familyMultiData, setFamilyMultiData] = useState("");
  const [individualData, setIndividualData] = useState("");
  const [mediclaimData, setMediclaimData] = useState("");
  const [dependentData, setDependentMember] = useState([]);

  const [cityData, setCityData] = useState("");

  const [totalMediclaimAmount, setTotalMediclaimAmount] = useState("");
  const [totalTopupAmount, setTotalTopupAmount] = useState("");

  const [surplusShortfallAmount, setSurplusShortfallAmount] = useState("")
  const [mediclaimGraphData, setMediclaimGraphData] = useState("")
  const token = Cookies.get('token');

  useEffect(() => {
    document.body.classList.add("dg-layout");
    document.body.classList.add("rp-layout");
  
    const interval = setInterval(() => {
      const reportBgRisk = document.getElementById("report-bg-risk");
      if (reportBgRisk) {
        reportBgRisk.style.background = `url(${imagePath}/static/media/DG/reports/ill-risk-management.svg) no-repeat right top`;
        clearInterval(interval); 
        setBackgroundDivImage();
      }
    }, 50);
  
    getMemberList();
  
    return () => {
      clearInterval(interval);
      document.body.classList.remove("dg-layout");
      document.body.classList.remove("rp-layout");
    };
  }, []);
  

  const getContingencyRisk = async () => {
    try {
      const userId = getParentUserId();
      setIsLoading(true);
  
      const data = await getRecContingencyRisk(userId);
  
      if (data?.message?.status_code === "200") {
        const responseData = data.message.data;
  
        setContingencyRiskData(prev => ({
          ...prev,
          expense: responseData.contingency_recommendation?.expense || 0,
          spouseEarning: responseData.contingency_recommendation?.earning_spouse || false,
          total_liquid_asset: responseData.contingency_recommendation?.total_liquid_asset || 0,
          emergencyCorpusRecommendationText: responseData.emergency_corpus_recommendation?.emergency_corpus_recommendation_text || "",
          six_month_expense: responseData.contingency_recommendation?.six_month_expense || 0,
          required_corpus: responseData.contingency_recommendation?.required_corpus || 0,
          scorecard_expense: responseData.contingency_recommendation?.scorecard_expense || 0,
          total_liquid_asset_scorecard: responseData.contingency_recommendation?.total_liquid_asset_scorecard || 0,
          contingency_statement: responseData.contingency_recommendation?.contingency_statement || "",
          contingency_rec: responseData.contingency_recommendation?.contingency_rec || "",
          total_corpus: responseData.emergency_corpus_recommendation?.total_corpus || 0,
          contingency_goal_id: responseData.contingency_goal_id || "0"
        }));
      }
    } catch (error) {
      console.error("Error in getContingencyRisk:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const getCurrentInsurance = async () => {
    try {
      let decodedRes = await GetCurrentInsuranceData();

      if (decodedRes.status_code == 200) {
        // full list
        var insurancedata = decodedRes["data"]["insurance_details"] || [];

        // split into health vs others
        var healthinsurancedata = insurancedata.filter(
          (insurance) =>
            insurance.insurance_category_name === "Mediclaim" ||
            insurance.insurance_category_name === "General"
        );

        var otherInsuranceData = insurancedata.filter(
          (insurance) =>
            insurance.insurance_category_name !== "Mediclaim" &&
            insurance.insurance_category_name !== "General"
        );

        // totals for all insurance
        var totalSumAssured = decodedRes["data"]["total_life_sum_assured"] || 0;
        var totalPremiumAmount = decodedRes["data"]["total_life_premium"] || 0;

        // if backend didn’t provide, calculate manually
        if (!decodedRes["data"]["total_life_sum_assured"] || !decodedRes["data"]["total_life_premium"]) {
          totalSumAssured = 0;
          totalPremiumAmount = 0;
          insurancedata.forEach((insurance) => {
            totalSumAssured += parseFloat(insurance["user_insurance_sum_assured"] || 0);
            totalPremiumAmount += parseFloat(insurance["user_insurance_premium_amount"] || 0);
          });
        }

        // totals for health insurance only
        var totalHealthSumAssured = 0;
        var totalHealthPremiumAmount = 0;
        var totalTopUp = 0;

        if (healthinsurancedata.length > 0) {
          healthinsurancedata.forEach((insurance) => {
            totalHealthSumAssured += parseFloat(insurance["user_insurance_sum_assured"] || 0);
            totalHealthPremiumAmount += parseFloat(insurance["user_insurance_premium_amount"] || 0);
            totalTopUp += parseFloat(insurance["user_insurance_topup"] || 0);
          });
        }

        // save in state
        setInsuranceData((v) => {
          return {
            ...v,
            insuranceDataa: otherInsuranceData,
            healthInsuranceData: healthinsurancedata,
            totalsumassured: totalSumAssured,
            totalpremiumamt: totalPremiumAmount,
            totalhealthsumassured: totalHealthSumAssured,
            totalhealthpremiumamt: totalHealthPremiumAmount,
            totalTopUp: totalTopUp,
            rpdata_screendata: decodedRes["rpdata_screendata"] || {},
          };
        });
      }
      setIsLoading(false);
    } catch (e) {
      console.error("Error in getCurrentInsurance:", e);
      setIsLoading(false);
    }
  };

  const getmedicalInsurance = async () => {
    try {
      const userId = getParentUserId();

      if (!userId) {
        console.error('User ID not found');
        setIsLoading(false);
        return;
      }

      const decodedRes = await getmedicalInsuranceApi(userId);

      if (decodedRes["status_code"] === "200") {
        setIsLoading(false);
        const responseData = decodedRes["data"];

        let type;
        if (responseData["shortfall_or_surplus_amount"] < 0) {
          type = "shortfall";
        } else {
          type = "surplus";
        }

        var medicalGraphData = [];
        var graphData = [
          {
            name: "Ideal Health Cover",
            total: responseData["required_cover"],
          },
          {
            name: "Existing Personal Cover",
            total: responseData["existing_fullcover"],
          },
          {
            name: type,
            total: responseData["shortfall_or_surplus_amount"],
          },
        ];

        graphData.map((val) => {
          if (val["total"]) {
            medicalGraphData.push({ name: val["name"], y: val["total"] });
          }
        });
        setMediclaimGraphData(graphData);
        mediaclInsuranceData.medicalgraphdata = medicalGraphData;
        setMediaclInsuranceData((v) => {
          return {
            ...v,
            shortfallorsurplusamt: responseData["shortfall_or_surplus_amount"],
            existingmedicalcover: responseData["existing_fullcover"],
            idealmedicalcover: responseData["required_cover"],
            type: responseData["type"],
            topupamount: responseData["topup_amount"],
            sectionText: responseData["section_text"] || {},
          };
        });
      } else {
        console.error('getMedicalInsurance - API response error:', decodedRes);
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Error in getMedicalInsurance:', e);
      setIsLoading(false);
    }
  };

  const getLifeInsurance = async () => {
    try {
      
      let decodedRes = await get_life_insurance(getParentUserId());
      if (decodedRes["status_code"] == "200") {
        setIsLoading(false);
        var policyDetails =
          decodedRes["data"][0]["life_insurance"]["policy_details"];
        var policyDetailsTotal = 0;
        policyDetails.forEach((policy) => {
          policyDetailsTotal =
            policyDetailsTotal + policy["insurance_sum_assured"];
        });

        var futureGoals =
          decodedRes["data"][0]["life_insurance"]["future_goals"];
        var futureGoalsTotal = 0;
        futureGoals.forEach((futurevalue) => {
          futureGoalsTotal =
            futureGoalsTotal + futurevalue["goal_present_value"];
        });

        if (isNaN(lifeInsuranceData.totalExp)) {
          lifeInsuranceData.totalExp = 0;
        }

        var lifeInsuranceGraphData = [];
        var graphData = [];
        if (decodedRes) {
          graphData = [
            {
              name: "Ideal Cover",
              total: decodedRes["data"][0]["our_recommendation"]["ideal_cover"],
            },
            {
              name: "Existing Cover",
              total:
                decodedRes["data"][0]["our_recommendation"]["existing_cover"],
            },
            {
              name: "Additional Insurance Required",
              total:
                decodedRes["data"][0]["our_recommendation"][
                "our_recommendation"
                ],
            },
          ];
        } else {
          graphData = [
            {
              name: "Ideal Cover",
              total: decodedRes["data"][0]["our_recommendation"]["ideal_cover"],
            },
            {
              name: "Existing Cover",
              total:
                decodedRes["data"][0]["our_recommendation"]["existing_cover"],
            },
            {
              name: "Additional Insurance Required",
              total:
                decodedRes["data"][0]["our_recommendation"][
                "our_recommendation"
                ],
            },
          ];
        }
        graphData.map((val) => {
          if (val["total"]) {
            lifeInsuranceGraphData.push({ name: val["name"], y: val["total"] });
          }
        });

        setLifeInsuranceData((v) => {
          return {
            ...v,
            idealCover:
              decodedRes["data"][0]["our_recommendation"]["ideal_cover"],
            existingCover:
              decodedRes["data"][0]["our_recommendation"]["existing_cover"],
            totalOutstanding:
              decodedRes["data"]["0"]["life_insurance"]["outstanding_debt"],
            totalGoalPresentValue: futureGoalsTotal,
            policyDetailsTotal: policyDetailsTotal,
            lifeInsuranceDataa: decodedRes["data"],
            totalExp:
              decodedRes["data"][0]["life_insurance"][
              "regular_expense_till_limited"
              ] +
              decodedRes["data"][0]["life_insurance"]["pv_house_rent"] +
              decodedRes["data"][0]["life_insurance"]["regular_house_expense"],

            lifeInsurancegraphdata: lifeInsuranceGraphData,
          };
        });
      }
    } catch (e) {
      console.error('Error in getLifeInsurance:', e);
    }
  };

  // const getMemberCount = async () => {
  //   try {
  //     let apiData = {
  //       fp_log_id: sessionData.current["data"]["fp_log_id"],
  //     };
  //     let config = {
  //       method: "POST",
  //       url: ADVISORY_GET_MEMBER_COUNT,
  //       data: apiData,
  //     };
  //     let decodedRes = await fetchEncryptData(config);
  //     if (decodedRes["error_code"] == "100") {
  //       setMemberCount(decodedRes["member_count"]);
  //     }
  //   } catch (e) {
  //     console.error('Error in getMemberCount:', e);
  //   }
  // };

  const getMemberList = async () => {
    try {
      let data = { user_id: getParentUserId(), sky: getItemLocal("sky") };

      // let config = {
      //   method: "POST",
      //   url: CHECK_SESSION,
      //   data: data,
      // };
      // sessionData.current = await fetchEncryptData(config);

      if (false) {
        loginRedirectGuest();
      } else {
        setSelfName(user_name1)

        getCurrentInsurance();
        getContingencyRisk();
        getmedicalInsurance();
        getLifeInsurance();
        // getMemberCount();
        getmediclaimans();
        getInsuranceList();
        getCityTierList();
        familyMemberData();
      }
    } catch (e) {
      console.error('Error in getMemberList:', e);
    }
  };

  const familyMemberData = async () => {
    // const user_id = getParentUserId();
    // const fp_log_id = getParentFpLogId();
    // var family_data = await apiCall(
    //   ADVISORY_GET_FAMILY_DATA_API_URL +
    //   "?parent_user_id=" +
    //   user_id +
    //   "&fp_log_id=" +
    //   fp_log_id +
    //   "&web=1",
    //   "",
    //   false,
    //   true
    // );
    // let res = JSON.stringify(family_data);
    // let response = JSON.parse(res);
    // if (response.error_code == "100") {
    //   const dependent_mem = response.data
    //     .filter((member) =>
    //       member.isdependent == "1" || member.relationname == "Spouse"
    //     )
    //   setDependentMember(dependent_mem)
    // }
    // else {
    //   setDependentMember([])
    // }
  };

  const getmediclaimans = async () => {
    try {
      let apiData = {
        fp_log_id: sessionData.current["data"]["fp_log_id"],
        user_id: sessionData.current["data"]["id"],
      };
      let config = {
        method: "POST",
        url: ADVISORY_GET_MEDICLAIM,
        data: apiData,
      };
      let decodedRes = await fetchEncryptData(config);
      if (decodedRes["error_code"] == "100") {
        setMedicalQuestionData({
          ...medicalQuestionData,
          questionData: decodedRes["data"]["0"],
          ans1: decodedRes["data"]["0"]["q1_ans"],
          ans2: decodedRes["data"]["0"]["q2_ans"],
          ans3: decodedRes["data"]["0"]["q3_ans"],
        });
      }
    } catch (e) {
      console.error('Error in getmediclaimans:', e);
    }
  };

  const getInsuranceList = async () => {
    try {
      let url =
        BASE_API_URL +
        "restapi/getuserinsurance/?user_id=" +
        sessionData?.current["data"]["id"] +
        "&fp_log_id=" +
        sessionData?.current["data"]["fp_log_id"] +
        "&web=1";
      let insurance_data = await apiCall(url, "", false, false);

      if (insurance_data["error_code"] === "100") {
        const filteredInsuranceFamilyData = insurance_data.data.filter(
          (entry) =>
            entry.insurance_category_name === "Mediclaim" &&
            entry.insurance_member !== "Family Multi Individual" &&
            entry.insurance_member !== sessionData.current?.data?.user_details?.first_name
        );
        setFamilyData(filteredInsuranceFamilyData);

        const filteredInsuranceFamilyMultiDara = insurance_data.data.filter(
          (entry) =>
            entry.insurance_category_name === "Mediclaim" &&
            entry.insurance_member === "Family Multi Individual"
        );
        setFamilyMultiData(filteredInsuranceFamilyMultiDara);

        const filteredInsuranceIndividualData = insurance_data.data.filter(
          (entry) =>
            entry.insurance_category_name === "Mediclaim" &&
            entry.insurance_member === sessionData.current?.data?.user_details?.first_name
        );
        setIndividualData(filteredInsuranceIndividualData);

        const filteredInsuranceMediclaimData = insurance_data.data.filter(
          (entry) =>
            entry.insurance_category_name === "Mediclaim"
        );
        setMediclaimData(filteredInsuranceMediclaimData);
      }
    } catch (e) {
      console.error('Error in getInsuranceList:', e);
    }
  };

  const getCityTierList = async () => {
    try {
      let apiData = {
        fp_log_id: sessionData.current["data"]["fp_log_id"],
        user_id: sessionData.current["data"]["id"],
      };
      let config = {
        method: "POST",
        url: GET_CITY_TIER_LIST,
        data: apiData,
      };
      let decodedRes = await fetchData(config);
      if (decodedRes["error_code"] == "100") {
        setCityData(decodedRes.data.city_tier);
      }
    } catch (e) {
      console.error('Error in getCityTierList:', e);
    }
  };

  useEffect(()=>{
    const member = getItemLocal("member");
    setMemberCount(member.length > 1 ? 1 : 0)
  },[])
  return (
    <DatagatherReportLayout>
      <FintooLoader isLoading={isLoading} />
      <div className="reports ">
        <div className="">
          <div className="background-div">
            <div class="bg active" id="report-bg-risk"></div>
          </div>
          <div className="white-box">
            <div className="d-flex justify-content-md-center tab-box">
              <div className="d-flex top-tab-menu noselect">
                <div
                  className={`tab-menu-item ${tab == "tab1" ? "active" : ""}`}
                  onClick={() => setTab("tab1")}
                >
                  <div className="tab-menu-title">CONTINGENCY PLANNING</div>
                </div>
                <div
                  className={`tab-menu-item ${tab == "tab2" ? "active" : ""}`}
                  onClick={() => setTab("tab2")}
                >
                  <div className="tab-menu-title">CURRENT INSURANCE</div>
                </div>
                {memberCount == 1 && (
                  <div
                    className={`tab-menu-item ${tab == "tab3" ? "active" : ""}`}
                    onClick={() => setTab("tab3")}
                  >
                    <div className="tab-menu-title">LIFE INSURANCE</div>
                  </div>
                )}
                <div
                  className={`tab-menu-item ${tab == "tab4" ? "active" : ""}`}
                  onClick={() => setTab("tab4")}
                >
                  <div className="tab-menu-title">MEDICAL INSURANCE</div>
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
                <div className="contingencyPlanningHolder">
                  <div>
                    <div
                      className="contingencyPlanningHead text-center"
                      style={{ paddingTop: "20px !important" }}
                    >
                      <h4 className="rTitle" style={{ textAlign: "left" }}>
                        <img
                          alt=""
                          src={
                            imagePath +
                            "/static/media/DG/reports/risk-management/continegency-planning.svg"
                          }
                        />
                        Emergency Corpus
                      </h4>

                      <div className="textDiv white">
                        <p>
                          {" "}
                          Unexpected events like health issues, job loss,
                          disability, and unforeseen expenses can disrupt one's
                          income, but household expenses continue. Therefore, it
                          is crucial to prepare an emergency fund for such
                          situations.
                        </p>
                      </div>

                      <div className="table-responsive rTable">
                        <table
                          id="borderRightaactive"
                          className="bgStyleTable"
                          border={1}
                        >
                          <thead>
                            <tr>
                              <th colSpan={4} className="text-center">
                                Emergency Corpus
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="outline">
                              <td>Type</td>
                              <td colSpan={2}>Amount (₹)</td>
                              <td rowSpan={4} className="text-center boxed">
                                <div>Emergency corpus(₹) (B-A)</div>
                                <div
                                  className="colorGreen1 "
                                  style={{
                                    color: "#042b62",
                                    backgroundColor: "`transparent` !important",
                                  }}
                                >
                                  <span>
                                    {contingencyRiskData.total_liquid_asset -
                                      contingencyRiskData.expense ===
                                      0 && (
                                        <h2 style={{ fontWeight: 900 }}>
                                          <span>Surplus </span>
                                          {numberFormat(
                                            contingencyRiskData.total_liquid_asset -
                                            contingencyRiskData.expense,
                                            0
                                          )}
                                        </h2>
                                      )}
                                    {contingencyRiskData.total_liquid_asset -
                                      contingencyRiskData.expense >
                                      0 && (
                                        <h2 style={{ fontWeight: 900 }}>
                                          <span>Surplus </span>
                                          {numberFormat(
                                            contingencyRiskData.total_liquid_asset -
                                            contingencyRiskData.expense,
                                            0
                                          )}
                                        </h2>
                                      )}
                                    {contingencyRiskData.total_liquid_asset -
                                      contingencyRiskData.expense <
                                      0 && (
                                        <h2
                                          style={{
                                            color: "red",
                                            fontWeight: 900,
                                          }}
                                        >
                                          <span>Shortfall </span>(
                                          {numberFormat(
                                            Math.abs(
                                              contingencyRiskData.total_liquid_asset -
                                              contingencyRiskData.expense
                                            ),
                                            0
                                          )}
                                          )
                                        </h2>
                                      )}
                                  </span>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                Emergency Corpus Required for{" "}
                                {!contingencyRiskData.spouseEarning ? "6" : "4"}{" "}
                                months (A)
                              </td>
                              <td>
                                {numberFormat(
                                  contingencyRiskData.expense,
                                  0
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="bold top-line total-value">
                                Assets Available ( B )
                              </td>
                              <td
                                colSpan={2}
                                className="bold top-line total-value "
                              >
                                {numberFormat(
                                  contingencyRiskData.total_liquid_asset,
                                  0
                                )}
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr></tr>
                          </tfoot>
                        </table>
                      </div>
                      <br />
                      <br />
                      <div className="recommen_sec_div mt-5">
                        <div className="rec_head_div">
                          <i />
                          <span>Fintoo Recommends</span>
                        </div>
                        <div className="rec_text_div">
                          <p
                            dangerouslySetInnerHTML={{
                              __html:
                                contingencyRiskData.emergencyCorpusRecommendationText
                                  ? contingencyRiskData.emergencyCorpusRecommendationText
                                  : "",
                            }}
                          ></p>
                          <p />
                        </div>
                      </div>
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
                              href={
                                process.env.PUBLIC_URL +
                                "/datagathering/insurance"
                              }
                              target="_blank"
                              className="link"
                            >
                              Complete Insurance
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row py-2">
                  <div className=" text-center">
                    <div>
                      <div className="btn-container fixedBtn ">
                        <div className="d-flex justify-content-center">
                          <Link
                            to={
                              process.env.PUBLIC_URL + "/report/goal-analysis"
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
              <div className={tab == "tab2" ? "d-block" : "d-none"}>
                <div className="pageHolder currentInsurancePolicies">
                  <div style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
                    <p>
                      <p>
                        Insurance is important because it provides financial
                        protection against unforeseeable events that could
                        potentially cause significant losses or hardships. Below
                        are the details of your current insurance policies.
                      </p>
                    </p>
                  </div>

                  {insuranceData.insuranceDataa?.length > 0 && (
                    <>
                      <h4 className="rTitle" style={{}}>
                        <img
                          src={
                            imagePath +
                            "/static/media/DG/reports/current-investments/current-insurance-policies.svg"
                          }
                          className="title-icon"
                        />
                        Current Life Insurance
                      </h4>
                      <div className="rContent " style={{}}>
                        <p
                        // dangerouslySetInnerHTML={
                        //   // __html: insuranceData.rpdata_screendata
                        //   //   ? insuranceData.rpdata_screendata.field0
                        //   //   :
                        // }
                        >
                          If we can imagine a situation where our goals are affected by acts beyond our control, we realise the importance of insurance in our lives. Insurance enables us to live without worrying about the impact of uncertain events that could hamper our life along with the lives of our loved ones.
                        </p>
                      </div>
                      <div className="table-responsive rTable" style={{}}>
                        <table className="bgStyleTable">
                          <tbody>
                            <tr>
                              <th>Policy name</th>
                              <th>Type</th>
                              <th>Name of Holder</th>
                              <th>Start Year</th>
                              <th>End Year</th>
                              <th>Sum Assured (₹)</th>
                              <th>Premium Payable (₹)</th>
                              <th>Premium Frequency</th>
                            </tr>
                            {insuranceData?.insuranceDataa.map((insurance) => (
                              <tr>
                                <td>{insurance?.insurance_name || insurance?.user_insurance_name || "N/A"}</td>
                                <td>{insurance?.user_insurance_type || insurance?.insurance_category_name || "N/A"}</td>
                                <td>{insurance?.holder_name|| "N/A"}</td>
                                <td>
                                  {(() => {
                                    const purchaseDate = insurance?.user_insurance_start_date || insurance?.user_insurance_start_date;
                                    if (!purchaseDate) return "-";

                                    if (purchaseDate.includes("-")) {
                                      return purchaseDate.split("-")[0];
                                    } else if (purchaseDate.includes("/")) {
                                      return purchaseDate.split("/")[2];
                                    }
                                    return purchaseDate;
                                  })()}
                                </td>
                                <td>
                                  {(() => {
                                    const endDate = insurance?.user_insurance_end_date || insurance?.user_insurance_end_date;
                                    if (!endDate) return "-";

                                    if (endDate.includes("-")) {
                                      return endDate.split("-")[0];
                                    } else if (endDate.includes("/")) {
                                      return endDate.split("/")[2];
                                    }
                                    return endDate;
                                  })()}
                                </td>
                                <td>
                                  {numberFormat(
                                    insurance?.user_insurance_sum_assured || insurance?.user_insurance_sum_assured || 0,
                                    0
                                  )}
                                </td>
                                <td>
                                  {numberFormat(
                                    insurance?.user_insurance_premium_amount || 0,
                                    0
                                  )}
                                </td>
                                <td>{insurance?.user_insurance_premium_freq || "N/A"}</td>
                              </tr>
                            ))}
                            <tr className="bold top-line total-value">
                              <td colSpan={5}>Total</td>
                              <td>
                                {numberFormat(insuranceData.totalsumassured, 0)}
                              </td>
                              <td>
                                {numberFormat(insuranceData.totalpremiumamt, 0)}
                              </td>
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {insuranceData?.healthInsuranceData?.length > 0 && (
                    <>
                      <h4 className="rTitle  mt-5">
                        <img
                          className="title-icon"
                          src={
                            imagePath +
                            "/static/media/DG/reports/current-investments/current-insurance-policies.svg"
                          }
                        />
                        Current Health Insurance
                      </h4>
                      <div className="rContent ">
                        <p
                        // dangerouslySetInnerHTML={{
                        //   __html: insuranceData.rpdata_screendata
                        //     ? insuranceData.rpdata_screendata.field0
                        //   }}
                        >
                          If we can imagine a situation where our goals are affected by acts beyond our control, we realise the importance of insurance in our lives. Insurance enables us to live without worrying about the impact of uncertain events that could hamper our life along with the lives of our loved ones.
                        </p>
                      </div>
                      <div className="table-responsive rTable">
                        <table className="bgStyleTable">
                          <tbody>
                            <tr>
                              <th>Policy name</th>
                              <th>Type</th>
                              <th>Name of Holder</th>
                              <th>Start Year</th>
                              <th>End Year</th>
                              <th>Sum Assured (₹)</th>
                              <th>Top Up (₹)</th>
                              <th>Premium Payable (₹)</th>
                              <th>Premium Frequency</th>
                            </tr>
                            {insuranceData.healthInsuranceData.map(
                              (healthinsurance) => (
                                <tr>
                                  <td>{healthinsurance?.insurance_name || healthinsurance?.user_insurance_name || "N/A"}</td>
                                  <td>{healthinsurance?.user_insurance_type || healthinsurance?.insurance_category_name || "N/A"}</td>
                                  <td>
                                    {healthinsurance?.holder_name || "N/A"}
                                  </td>
                                  <td>
                                    {healthinsurance?.insurance_purchase_date ?
                                      healthinsurance?.insurance_purchase_date.split("-")[0] :
                                      healthinsurance?.user_insurance_start_date ?
                                        healthinsurance?.user_insurance_start_date.split("/")[2] :
                                        "N/A"}
                                  </td>
                                  <td>
                                    {healthinsurance?.insurance_policy_enddate ?
                                      healthinsurance?.insurance_policy_enddate.split("-")[0] :
                                      healthinsurance?.user_insurance_end_date ?
                                        healthinsurance?.user_insurance_end_date.split("/")[2] :
                                        "N/A"}
                                  </td>
                                  <td>
                                    {numberFormat(
                                      healthinsurance?.insurance_sum_assured || healthinsurance?.user_insurance_sum_assured || 0,
                                      0
                                    )}
                                  </td>
                                  <td>
                                    {numberFormat(
                                      healthinsurance?.user_insurance_topup || healthinsurance?.user_insurance_topup || 0,
                                      0
                                    )}
                                  </td>
                                  <td>
                                    {numberFormat(
                                      healthinsurance?.user_insurance_premium_amount || healthinsurance?.user_insurance_premium_amount || 0,
                                      0
                                    )}
                                  </td>
                                  <td>{healthinsurance?.user_insurance_premium_freq || healthinsurance?.user_insurance_premium_freq || "N/A"}</td>
                                </tr>
                              )
                            )}
                            <tr className="bold top-line total-value">
                              <td colSpan={5}>Total</td>
                              <td>
                                {numberFormat(
                                  insuranceData.totalhealthsumassured,
                                  0
                                )}
                              </td>
                              <td>
                                {numberFormat(
                                  insuranceData.totalTopUp,
                                  0
                                )}
                              </td>
                              <td>
                                {numberFormat(
                                  insuranceData.totalhealthpremiumamt,
                                  0
                                )}
                              </td>
                              <td />
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  {(insuranceData.insuranceDataa?.length == 0 &&
                    insuranceData.healthInsuranceData?.length == 0) ||
                    (insuranceData.insuranceDataa?.length == undefined &&
                      insuranceData.healthInsuranceData?.length ==
                      undefined && (
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
                                />
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
                                    "/datagathering/insurance"
                                  }
                                  target="_blank"
                                  className="link"
                                >
                                  Complete Insurance
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>

                <div className="row py-2">
                  <div className=" text-center">
                    <div>
                      <div className="btn-container fixedBtn">
                        <div className="d-flex justify-content-center">
                          <div
                            className="previous-btn form-arrow d-flex align-items-center"
                            onClick={() => setTab("tab1")}
                          >
                            <FaArrowLeft />
                            <span className="hover-text">&nbsp;Previous</span>
                          </div>

                          <div
                            className="next-btn form-arrow d-flex align-items-center"
                            onClick={() => {
                              if (memberCount === 0) {
                                ScrollToTop();
                                setTab("tab4");
                              } else {
                                ScrollToTop();
                                setTab("tab3");
                              }
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
              <div className={tab == "tab3" ? "d-block" : "d-none"}>
                <div>
                  {lifeInsuranceData.idealCover > 0 && (
                    <div>
                      <div className="lifeInsuranceHolderBox">
                        <h4 className="rTitle">
                          <img
                            className="title-icon"
                            src={
                              imagePath +
                              "/static/media/DG/reports/risk-management/life-insurance.svg"
                            }
                          />
                          Life insurance
                        </h4>
                        <div className="rContent ">
                          <p
                            dangerouslySetInnerHTML={{
                              __html:
                                lifeInsuranceData?.lifeInsuranceDataa[0]
                                  ?.screen_header_expense,
                            }}
                          ></p>
                        </div>
                        <div className="table-responsive rTable">
                          <table className="bgStyleTable">
                            <thead>
                              <tr className="color">
                                <td>Particular</td>
                                <td className="text-center">
                                  Annual amount (₹)
                                  <br />
                                  <span
                                    style={{ fontSize: 12, paddingLeft: 10 }}
                                  >
                                    (till 31<sup>st</sup> Dec,{" "}
                                    {new Date().getFullYear()})
                                  </span>
                                </td>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bold">
                                <td>Critical Expenses</td>
                                <td />
                              </tr>
                              <tr>
                                <td>
                                  Regular expenses till lifetime (Of Self)
                                </td>
                                <td>
                                  {numberFormat(
                                    lifeInsuranceData.lifeInsuranceDataa[0][
                                    "life_insurance"
                                    ]["pv_house_rent"] +
                                    lifeInsuranceData.lifeInsuranceDataa[0][
                                    "life_insurance"
                                    ]["regular_house_expense"],
                                    0
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Regular expenses till Limited term It include
                                  family members and dependent member
                                </td>
                                <td>
                                  {numberFormat(
                                    lifeInsuranceData.lifeInsuranceDataa[0][
                                    "life_insurance"
                                    ]["regular_expense_till_limited"],
                                    0
                                  )}
                                </td>
                              </tr>
                              <tr className="bold top-line total-value">
                                <td>Total Critical Expenses (A)</td>
                                <td>
                                  {numberFormat(
                                    lifeInsuranceData.lifeInsuranceDataa[0][
                                    "life_insurance"
                                    ]["regular_expense_till_limited"] +
                                    lifeInsuranceData.lifeInsuranceDataa[0][
                                    "life_insurance"
                                    ]["pv_house_rent"] +
                                    lifeInsuranceData.lifeInsuranceDataa[0][
                                    "life_insurance"
                                    ]["regular_house_expense"],
                                    0
                                  )}
                                </td>
                              </tr>

                              {lifeInsuranceData.lifeInsuranceDataa[0][
                                "life_insurance"
                              ]["outstanding_details"]?.length > 0 && (
                                  <tr className="bold top-line total-value">
                                    <td>Outstanding Debt</td>
                                  </tr>
                                )}

                              {lifeInsuranceData.lifeInsuranceDataa[0][
                                "life_insurance"
                              ]["outstanding_details"]?.length > 0 &&
                                lifeInsuranceData.lifeInsuranceDataa[0][
                                  "life_insurance"
                                ]["outstanding_details"].map((outstanding) => (
                                  <tr>
                                    <td>{outstanding.user_liability_name}</td>
                                    <td>
                                      {numberFormat(
                                        outstanding.user_liability_outstanding_amount,
                                        0
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              {lifeInsuranceData.lifeInsuranceDataa[0][
                                "life_insurance"
                              ]["outstanding_details"]?.length > 0 && (
                                  <tr className="bold top-line total-value">
                                    <td>Total Liabilites (B)</td>
                                    <td>
                                      {numberFormat(
                                        lifeInsuranceData.lifeInsuranceDataa[0][
                                        "life_insurance"
                                        ]["outstanding_debt"],
                                        0
                                      )}
                                    </td>
                                  </tr>
                                )}
                              {lifeInsuranceData.lifeInsuranceDataa[0][
                                "life_insurance"
                              ]["future_goals"]?.length > 0 && (
                                  <tr className="bold top-line total-value">
                                    <td>Goal Present Value</td>
                                    <td />
                                  </tr>
                                )}
                              {lifeInsuranceData.lifeInsuranceDataa[0][
                                "life_insurance"
                              ]["future_goals"]?.length > 0 &&
                                lifeInsuranceData.lifeInsuranceDataa[0][
                                  "life_insurance"
                                ]["future_goals"].map((goals) => (
                                  <tr>
                                    <td>{goals.user_goal_name}</td>
                                    <td>
                                      {numberFormat(
                                        goals.goal_present_value,
                                        0
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              {lifeInsuranceData.lifeInsuranceDataa[0][
                                "life_insurance"
                              ]["future_goals"]?.length > 0 && (
                                  <tr className="bold top-line total-value">
                                    <td>Total Goal Present Value (C)</td>
                                    <td>
                                      {numberFormat(
                                        lifeInsuranceData.lifeInsuranceDataa[0][
                                        "life_insurance"
                                        ]["total_goal_pv"],
                                        0
                                      )}
                                    </td>
                                  </tr>
                                )}
                              <tr className="bold top-line total-value">
                                <td>
                                  Total Ideal Insurance(D) (
                                  {lifeInsuranceData.totalExp ? "A" : ""}
                                  {lifeInsuranceData.totalExp &&
                                    lifeInsuranceData.totalOutstanding !== 0
                                    ? " + "
                                    : ""}
                                  {lifeInsuranceData.totalOutstanding !== 0
                                    ? "B"
                                    : ""}
                                  {(lifeInsuranceData.totalExp ||
                                    lifeInsuranceData.totalOutstanding) &&
                                    lifeInsuranceData.totalGoalPresentValue !== 0
                                    ? "+"
                                    : ""}
                                  {lifeInsuranceData.totalGoalPresentValue !== 0
                                    ? "C"
                                    : ""}
                                  )
                                </td>
                                <td>
                                  {numberFormat(
                                    lifeInsuranceData.totalExp +
                                    lifeInsuranceData.totalOutstanding +
                                    lifeInsuranceData.totalGoalPresentValue,
                                    0
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="lifeInsuranceHolderBox mt-5">
                        <h4 className="rTitle">
                          <img
                            className="title-icon"
                            alt=""
                            src={
                              imagePath +
                              "/static/media/DG/reports/risk-management/policy-details.svg"
                            }
                          />
                          Policy details
                        </h4>
                        {lifeInsuranceData.lifeInsuranceDataa[0][
                          "life_insurance"
                        ]["policy_details"]?.length > 0 && (
                            <div className="rContent">
                              <p
                                dangerouslySetInnerHTML={{
                                  __html:
                                    lifeInsuranceData?.lifeInsuranceDataa[0]
                                      ?.screen_header_policy,
                                }}
                              ></p>
                            </div>
                          )}
                        <div className="table-responsive rTable">
                          <table className="bgStyleTable">
                            <thead>
                              {lifeInsuranceData.lifeInsuranceDataa[0][
                                "life_insurance"
                              ]["policy_details"]?.length > 0 && (
                                  <tr className="color">
                                    <td>Policy name</td>
                                    <td>Sum assured (₹)</td>
                                  </tr>
                                )}
                            </thead>
                            <tbody>
                              {lifeInsuranceData.lifeInsuranceDataa[0][
                                "life_insurance"
                              ]["policy_details"]?.length > 0 &&
                                lifeInsuranceData.lifeInsuranceDataa[0][
                                  "life_insurance"
                                ]["policy_details"].map((policy) => (
                                  <tr>
                                    <td>{policy.user_insurance_name}</td>
                                    <td>
                                      {numberFormat(
                                        policy.user_insurance_sum_assured,
                                        0
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              {lifeInsuranceData.lifeInsuranceDataa[0][
                                "life_insurance"
                              ]["policy_details"]?.length > 0 && (
                                  <tr className="bold top-line total-value">
                                    <td>Total Existing Insurance(E)</td>
                                    <td>
                                      {numberFormat(
                                        lifeInsuranceData.existingCover,
                                        0
                                      )}
                                    </td>
                                  </tr>
                                )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="lifeInsuranceHolderBox">
                        <div className="rContent ">
                          <p
                            dangerouslySetInnerHTML={{
                              __html:
                                lifeInsuranceData?.lifeInsuranceDataa[0]
                                  ?.screen_header_recommendation,
                            }}
                          ></p>
                        </div>
                        <div className="table-responsive rTable">
                          <table className="bgStyleTable recommendationTable1">
                            <tbody>
                              <tr>
                                <td>Ideal Insurance cover (D)</td>
                                <td>
                                  {numberFormat(
                                    lifeInsuranceData.totalExp +
                                    lifeInsuranceData.totalOutstanding +
                                    lifeInsuranceData.totalGoalPresentValue,
                                    0
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>Existing Insurance cover (E)</td>
                                <td>
                                  {numberFormat(
                                    lifeInsuranceData.existingCover,
                                    0
                                  )}
                                </td>
                              </tr>
                              <tr className="color bold top-line total-value">
                                <td>Additional Insurance Required (E-D)</td>
                                {lifeInsuranceData.existingCover -
                                  (lifeInsuranceData.totalExp +
                                    lifeInsuranceData.totalOutstanding +
                                    lifeInsuranceData.totalGoalPresentValue) ===
                                  0 && (
                                    <td>
                                      {numberFormat(
                                        lifeInsuranceData.existingCover -
                                        (lifeInsuranceData.totalExp +
                                          lifeInsuranceData.totalOutstanding +
                                          lifeInsuranceData.totalGoalPresentValue),
                                        0
                                      )}
                                    </td>
                                  )}
                                {lifeInsuranceData.existingCover -
                                  (lifeInsuranceData.totalExp +
                                    lifeInsuranceData.totalOutstanding +
                                    lifeInsuranceData.totalGoalPresentValue) >
                                  0 && (
                                    <td>
                                      {numberFormat(
                                        lifeInsuranceData.existingCover -
                                        (lifeInsuranceData.totalExp +
                                          lifeInsuranceData.totalOutstanding +
                                          lifeInsuranceData.totalGoalPresentValue),
                                        0
                                      )}
                                    </td>
                                  )}
                                {lifeInsuranceData.existingCover -
                                  (lifeInsuranceData.totalExp +
                                    lifeInsuranceData.totalOutstanding +
                                    lifeInsuranceData.totalGoalPresentValue) <
                                  0 && (
                                    <td style={{ color: "red" }}>
                                      (
                                      {numberFormat(
                                        Math.abs(
                                          lifeInsuranceData.existingCover -
                                          (lifeInsuranceData.totalExp +
                                            lifeInsuranceData.totalOutstanding +
                                            lifeInsuranceData.totalGoalPresentValue)
                                        ),
                                        0
                                      )}
                                      )
                                    </td>
                                  )}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="rGraph mt-5 ps-md-4">
                        <div className="mt-4">
                          <LifeInsurance
                            lifeInsurancegraphdata={
                              lifeInsuranceData.lifeInsurancegraphdata
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {lifeInsuranceData.idealCover === 0 && (
                    <div className="no-data-found text-center">
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
                              href={
                                process.env.PUBLIC_URL +
                                "/datagathering/insurance"
                              }
                              target="_blank"
                              className="link"
                            >
                              Complete Insurance
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
                            <div
                              className="previous-btn form-arrow d-flex align-items-center"
                              onClick={() => {
                                ScrollToTop();
                                setTab("tab2");
                              }}
                            >
                              <FaArrowLeft />
                              <span className="hover-text">&nbsp;Previous</span>
                            </div>
                            <div
                              className="next-btn form-arrow d-flex align-items-center"
                              onClick={() => {
                                ScrollToTop();
                                setTab("tab4");
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
              <div className={tab == "tab4" ? "d-block" : "d-none"}>
                <div className="lifeInsuranceHolderBox">
                  <h4 className="rTitle">
                    <img
                      className="title-icon"
                      src={
                        imagePath +
                        "/static/media/DG/reports/risk-management/medical-insurance-coverage.svg"
                      }
                    />
                    Medical insurance coverage
                  </h4>
                  <div>
                    <div className="rContent ">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: mediaclInsuranceData?.sectionText["field0"],
                        }}
                      ></p>
                    </div>
                    <div className="table-responsive rTable">
                      <table className="bgStyleTable">
                        <tbody>
                          <tr>
                            <th>Coverage</th>
                            <th>Sum Insured (₹)</th>
                          </tr>
                          <tr>
                            <td>Ideal Health Coverage For Family (A)</td>
                            <td>
                              {numberFormat(
                                mediaclInsuranceData.idealmedicalcover,
                                0
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Existing Personal Cover (B)</td>
                            <td>
                              {numberFormat(
                                mediaclInsuranceData.existingmedicalcover,
                                0
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>Existing Top UP Family (C)</td>
                            <td>
                              {numberFormat(
                                mediaclInsuranceData.topupamount,
                                0
                              )}
                            </td>
                          </tr>
                          <tr className="bold top-line total-value">
                            <td style={{ textTransform: "capitalize" }}>
                              {mediaclInsuranceData.type} (B+C) - A
                            </td>
                            {mediaclInsuranceData.shortfallorsurplusamt ===
                              0 && (
                                <td>
                                  {numberFormat(
                                    mediaclInsuranceData.shortfallorsurplusamt,
                                    0
                                  )}
                                </td>
                              )}
                            {mediaclInsuranceData.shortfallorsurplusamt > 0 && (
                              <td>
                                {numberFormat(
                                  mediaclInsuranceData.shortfallorsurplusamt,
                                  0
                                )}
                              </td>
                            )}
                            {mediaclInsuranceData.shortfallorsurplusamt < 0 && (
                              <td style={{ color: "red" }}>
                                (
                                {numberFormat(
                                  Math.abs(
                                    mediaclInsuranceData.shortfallorsurplusamt
                                  ),
                                  0
                                )}
                                )
                              </td>
                            )}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="rGraph mt-5 ps-md-4">
                      <div className="mt-4">
                        <Medicalinsurance
                          medicalgraphdata={
                            mediclaimGraphData
                          }
                        />
                      </div>
                    </div>
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
                              process.env.PUBLIC_URL +
                              "/datagathering/insurance"
                            }
                            target="_blank"
                            className="link"
                          >
                            Complete Insurance
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
                              if (memberCount === 0) {
                                ScrollToTop();
                                setTab("tab2");
                              } else {
                                ScrollToTop();
                                setTab("tab3");
                              }
                            }}
                          >
                            <FaArrowLeft />
                            <span className="hover-text">&nbsp;Previous</span>
                          </div>
                          <div
                            className="next-btn form-arrow d-flex align-items-center"
                            onClick={() => {
                              ScrollToTop();
                              setTab("tab5");
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
              <div
                className={tab == "tab5" ? "d-block" : "d-none"}
                onClick={() => setTab("tab4")}
              >
                <div className="analysis-section text-center">
                  <div className="container">
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-10">
                        <img src={imagePath + "/static/media/DMF/coming-soon.svg"} alt="comming-soon" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row py-2">
                  <div className=" text-center">
                    <div>
                      <div className="btn-container fixedBtn">
                        <div className="d-flex justify-content-center">
                          <div className="previous-btn form-arrow d-flex align-items-center">
                            <FaArrowLeft />
                            <span className="hover-text">&nbsp;Previous</span>
                          </div>
                          <Link
                            to={
                              process.env.PUBLIC_URL +
                              "/report/cash-flow-management"
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
export default Contingencyplanning;
