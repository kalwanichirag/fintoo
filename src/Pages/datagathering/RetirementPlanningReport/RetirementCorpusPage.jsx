import React, { useState, useEffect } from "react";
import { getParentUserId, makePositive, rsFilter } from "../../../common_utilities";
import RetirementCorpus from "../../../Assets/Datagathering/Graph/RetirementCorpus";
import { imagePath } from "../../../constants";
import { GetRetirementCorpus } from "../../../FrappeIntegration-Services/services/financial-planning-api/reports/retirement-planning";
import { GetFinalGoalRecommendation } from "../../../FrappeIntegration-Services/services/financial-planning-api/reports/goal-analysis";

function RetirementCorpusPage(props) {
  // State for API data
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goalData, setGoalData] = useState({})
  const [error, setError] = useState(null);

  // Fallback to props data if API data is not available
  const data = apiData || props?.data || {};

  // const graphdata = data?.graphdata ? data?.graphdata : [];
  // const colorArr = data?.colorArr ? data?.colorArr : [];

  const total_corpus_required = data?.total_corpus_required ? data?.total_corpus_required : 0;
  const total_income_corpus = data?.total_income_corpus ? data?.total_income_corpus : 0;

  // const shortsurptext = data?.ShortSurpText ? data?.ShortSurpText : [];
  // const ShortSurpValue = data?.ShortSurpValue ? data?.ShortSurpValue : [];

  // const linkedGoalAssets = data?.linkedgoalassets ? data?.linkedgoalassets : [];
  const linkedbyfintoo = data?.linkedbyfintoo ? data?.linkedbyfintoo : [];
  const additionalInv = data?.additionalInv ? data?.additionalInv : [];
  const screenheader = props?.screen_header ? props?.screen_header : {};

  useEffect(() => {
    if (data) {
      getFinalGoalRecommendation()
    }
  }, [data])
  const getFinalGoalRecommendation = async () => {
    try {

      let response = await GetFinalGoalRecommendation();
      if (response.status_code == "200") {

        var link_by_fintoo = [];
        for (var i in response.data.goal_achieved) {
          if (response.data.goal_achieved[i]["goal_cat_uuid"] == "retirement") {
            var linked_assets_by_you = [];
            var linked_assets_by_fintoo = [];
            var gross_total_fintoo = 0;
            var gross_total_newinvest = 0;
            var gross_total_you = 0;
            var goal_amount = 0;
            var income_corpus = 0;

            if (
              response.data.goal_achieved[i].hasOwnProperty("linked_goal_assets")
            ) {
              response.data.goal_achieved[i]["linked_goal_assets"].forEach(
                function (assetss) {
                  var new_obj = {};
                  goal_amount = response.data.goal_achieved[i]["future_value"];
                  income_corpus = response.data.goal_achieved[i]["income_corpus"];
                  if (assetss["investment_type"] == 0) {
                    new_obj.asset_name =
                      assetss["name"] +
                      " | " +
                      assetss["category"] +
                      " | " +
                      assetss["member"];
                    new_obj.asset_future_value = assetss["asset_future_value"];
                    gross_total_you += assetss["asset_future_value"];
                    linked_assets_by_you.push(new_obj);
                  } else if (assetss["investment_type"] == 1) {
                    new_obj.asset_name =
                      assetss["name"] +
                      " | " +
                      assetss["category"] +
                      " | " +
                      assetss["member"];
                    new_obj.asset_future_value = assetss["asset_future_value"];
                    gross_total_you += assetss["asset_future_value"];
                    linked_assets_by_you.push(new_obj);
                  } else if (assetss["investment_type"] == "2") {
                    new_obj.asset_name =
                      assetss["asset_data"]["name"] +
                      " | " +
                      assetss["asset_data"]["category"] +
                      " | " +
                      assetss["asset_data"]["member"];
                    new_obj.asset_future_value = assetss["oa_goal_fv"];

                    gross_total_fintoo += assetss["oa_goal_fv"];
                    linked_assets_by_fintoo.push(new_obj);
                  } else if (assetss["investment_type"] == 3) {
                    new_obj.asset_name = assetss["name"];
                    new_obj.asset_future_value = assetss["fv"];
                    gross_total_newinvest += assetss["fv"];
                  } else if (assetss["investment_type"] == 4) {
                    new_obj.asset_name =
                      assetss["name"] +
                      " | " +
                      assetss["category"] +
                      " | " +
                      assetss["member"];
                    new_obj.asset_future_value = assetss["asset_future_value"];
                    gross_total_fintoo += assetss["asset_future_value"];
                    linked_assets_by_fintoo.push(new_obj);
                    // if (!$scope.assetcatlist.includes(""+assetss['asset_category_id'])){
                  } else if (assetss["investment_type"] == 5) {
                    new_obj.asset_name =
                      assetss["name"] +
                      " | " +
                      assetss["category"] +
                      " | " +
                      assetss["member"];
                    new_obj.asset_future_value = assetss["asset_future_value"];
                    gross_total_fintoo += assetss["asset_future_value"];
                    linked_assets_by_fintoo.push(new_obj);
                  }
                }
              );
            }

            var diff_afterlinkange = 0;
            diff_afterlinkange =
              gross_total_you +
              gross_total_fintoo -
              (goal_amount - income_corpus);
            var goal_new_obj = {
              total_asset_value_by_fintoo: gross_total_fintoo,
              total_new_investment_by_fintoo: gross_total_newinvest,
              linked_assets_by_fintoo: linked_assets_by_fintoo,
              diff_afterlinkange: diff_afterlinkange,
            };
            link_by_fintoo.push(goal_new_obj);
          }

          if (response.data.goal_achieved[i]["goal_cat_uuid"] == "retirement") {
            let data = response.data.goal_achieved[i]
            let tempRetirementGoalData = { ...data };
            var linkedgoalassets = [];
            var newInvestments = [];
            for (var j in response.data.goal_achieved[i]['linked_goal_assets']) {
              if (response.data.goal_achieved[i]['linked_goal_assets'][j]['investment_type'] == 0 || response.data.goal_achieved[i]['linked_goal_assets'][j]['investment_type'] == 1) {
                linkedgoalassets.push(response.data.goal_achieved[i]['linked_goal_assets'][j])
              }
              else if (response.data.goal_achieved[i]['linked_goal_assets'][j]['investment_type'] == 3) {
                newInvestments.push(response.data.goal_achieved[i]['linked_goal_assets'][j]);
              }
              // else if (response.data.goal_achieved[i]['linked_goal_assets'][j]['investment_type'] == 4 ) {
              //   linkedbyfintoo.push(response.data.goal_achieved[i]['linked_goal_assets'][j]);
              // }
              // else if (response.data.goal_achieved[i]['linked_goal_assets'][j]['investment_type'] == 5 ) {
              //   linkedbyfintoo.push(response.data.goal_achieved[i]['linked_goal_assets'][j]);
              // }
            }

            // NEW ADDITIONAL INVESTMENT DATA SEGREGATION FUNCTION //
            const transformedData = newInvestments.reduce((acc, curr) => {
              const existingIndex = acc.findIndex((item) => item.name === curr.name);
              if (existingIndex !== -1) {
                // Merge data with existing entry
                acc[existingIndex] = {
                  ...acc[existingIndex],
                  ...curr,
                };
              } else {
                // Add new entry if not already present
                acc.push(curr);
              }
              return acc;
            }, []);

            // NEW ADDITIONAL INVESTMENT DATA SEGREGATION FUNCTION //

            var TotalLinkedGoalAssets = 0;
            for (var k in linkedgoalassets) {
              TotalLinkedGoalAssets = TotalLinkedGoalAssets + linkedgoalassets[k]['asset_future_value'];
            }

            var TotalnewInvestments = 0;
            for (var k in transformedData) {
              TotalnewInvestments = TotalnewInvestments + transformedData[k]['fv'];
            }

            var Totallinkedbyfintoo = 0;
            for (var k in link_by_fintoo) {
              Totallinkedbyfintoo = Totallinkedbyfintoo + link_by_fintoo[k]['asset_future_value'];
            }

            var ShortSurpValue = TotalLinkedGoalAssets - (total_corpus_required - total_income_corpus);
            if (ShortSurpValue >= 0) {
              var ShortSurpText = 'Surplus';
            }
            else {
              var ShortSurpText = 'Shortfall'
            }
            var graphdata = [];
            var colorArr = [];

            if (total_corpus_required != undefined && total_corpus_required != 0) {
              graphdata.push({ "name": ["Goal Amount"], "data": ['', Math.floor(total_corpus_required)] })
              colorArr.push('#9ac449');
            }

            if (TotalnewInvestments != undefined && TotalnewInvestments != 0) {
              graphdata.push({ "name": ["Assets Recommended by Fintoo"], "data": [Math.abs(TotalnewInvestments), ''] });
              colorArr.push('#042b62');
            }

            if (Totallinkedbyfintoo != undefined && Totallinkedbyfintoo != 0) {
              graphdata.push({ "name": ["Assets Linked by Fintoo"], "data": [Math.floor(Totallinkedbyfintoo), ''] });
              colorArr.push('#e1b624');
            }

            if (TotalLinkedGoalAssets != undefined && TotalLinkedGoalAssets != 0) {
              graphdata.push({ "name": ["Assets Linked by You"], "data": [Math.floor(TotalLinkedGoalAssets), ''] });
              colorArr.push('#f88221');
            }

            if (total_income_corpus != undefined && total_income_corpus != 0) {
              graphdata.push({ "name": ["Corpus Created For Post Retirement Income"], "data": [Math.floor(total_income_corpus), ''] });
              colorArr.push('#1c94ad');
            }

            setGoalData({ "graphdata": graphdata, "colorArr": colorArr, "ShortSurpValue": ShortSurpValue, "ShortSurpText": ShortSurpText, "linkedGoalAssets": linkedgoalassets, "linkedbyfintoo": link_by_fintoo, "additionalInv": transformedData })
          }
        }
      }
    }
    catch (err) {

    }
  }
  // API call function
  const fetchRetirementCorpus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await GetRetirementCorpus(getParentUserId());

      if (response.status_code === "200") {
        setApiData(response.data);

        // Check for server messages/warnings
        if (response._server_messages) {
          try {
            const serverMessages = JSON.parse(response._server_messages);
            if (serverMessages.length > 0) {
              console.warn("Server messages:", serverMessages);
              // You can handle server messages here if needed
            }
          } catch (e) {
            console.warn("Could not parse server messages:", response._server_messages);
          }
        }
      } else {
        setError(response.message || "Failed to fetch retirement corpus data");
      }
    } catch (err) {
      console.error("Error fetching retirement corpus:", err);
      setError("Failed to fetch retirement corpus data");
    } finally {
      setLoading(false);
    }
  };

  // Effect to call API on component mount
  useEffect(() => {
    fetchRetirementCorpus();
  }, []);
  // Show loading state
  if (loading) {
    return (
      <div className="pageHolder retirementCorpus">
        <div className="text-center" style={{ padding: "2rem" }}>
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3">Loading retirement corpus data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="pageHolder retirementCorpus">
        <div className="text-center" style={{ padding: "2rem" }}>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <hr />
            <button
              className="btn btn-primary"
              onClick={fetchRetirementCorpus}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {total_corpus_required > 0 ? (
        <div className="pageHolder retirementCorpus ">
          <div>
            <h4 className="rTitle d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <img alt="retirement corpus" className="title-icon"
                  src={imagePath + "/static/media/DG/reports/retirement-planning/retirement-corpus.svg"}
                />{" "}
                Retirement corpus
              </div>
              {/* <button
                className="btn btn-sm btn-outline-primary"
                onClick={fetchRetirementCorpus}
                title="Refresh data"
              >
                <i className="fas fa-sync-alt"></i> Refresh
              </button> */}
            </h4>
            <div className="rContent ">
              <p
                dangerouslySetInnerHTML={{
                  __html: screenheader?.screenheader_corpus ?
                    screenheader?.screenheader_corpus : ''
                }}>
              </p>
            </div>
            <div className="table-responsive rTable">
              <table className="bgStyleTable">
                <tbody>
                  <tr>
                    <th>Particulars</th>
                    <th>Amount (₹)</th>
                  </tr>
                  <tr>
                    <td>Corpus required for post retirement expenses</td>
                    <td className="">{rsFilter(parseInt(total_corpus_required))}</td>
                  </tr>
                  <tr className="bold top-line total-value">
                    <td>Total Corpus Required (A)</td>
                    <td>{rsFilter(parseInt(total_corpus_required))}</td>
                  </tr>
                  {total_income_corpus != '' ? (
                    <tr className="bold top-line total-value">
                      <td>Corpus Created for post retirement Income (B)</td>
                      <td>{rsFilter(parseInt(total_income_corpus))}</td>
                    </tr>
                  ) : null}
                  {goalData.linkedGoalAssets && goalData.linkedGoalAssets.length > 0 ? (
                    <tr className="bold top-line total-value">
                      <td>Linkages Asset</td>
                      <td></td>
                    </tr>
                  ) : null}
                  {goalData.linkedGoalAssets && goalData.linkedGoalAssets.length > 0 && goalData.linkedGoalAssets.map((item, index) => (
                    <tr key={index}>
                      <td>{item["name"]}</td>
                      <td>{rsFilter(parseInt(item["asset_future_value"]))}</td>
                    </tr>
                  ))}
                  <tr className="bold top-line total-value">
                    <td style={{ fontWeight: "bold" }} className="">Total corpus created (C)</td>
                    {goalData.linkedGoalAssets && goalData.linkedGoalAssets.length > 0 ? (
                      <td>{rsFilter(parseInt((goalData.linkedGoalAssets || []).reduce((total, item) => total + (item['asset_future_value'] || 0), 0)))}</td>
                    ) : <td>{rsFilter(parseInt(0))}</td>}
                  </tr>
                  <tr className="bold top-line total-value">
                    <td style={{ fontWeight: "bold" }} >{goalData.shortsurptext} ( Corpus Required - Corpus Created ) (D = ((A-B)-C))</td>
                    {goalData.ShortSurpValue >= 0 ? (
                      <td style={{ fontWeight: "bold", color: "black" }} >{rsFilter(parseInt(goalData.ShortSurpValue))}</td>
                    ) : <td style={{ fontWeight: "bold", color: "red" }} >({rsFilter(parseInt(Math.abs(goalData.ShortSurpValue)))})</td>}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rContent" style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
              <p>On determining the retirement corpus you require, Fintoo
                totals your existing assets as well as investments such as
                EPF and PPF that have been previously earmarked for retirement.
                This indicates whether the value of your assets and investments
                is equal to your retirement corpus, or if there’s a surplus or shortfall.
              </p>
            </div>

            {/* <h4 className="rTitle d-flex align-items-center mt-5">
          <img className="title-icon"
           src={imagePath + "/static/media/DG/reports/retirement-planning/retirement-corpus.svg"}
           />{" "}
          <span>{" "}Fintoo Recommends</span>
        </h4>
        <div className="rContent ">
          <p>You are now aware of the goal amount, as well as whether you have a surplus or deficit for the goal once you link certain assets to it. Note that this calculation takes into account the future cost. This means that it determines the amount required for the goal on taking into account the impact of inflation.</p>
        </div> */}
            <div className="invertment-goal-mapping">
              <div className="container " style={{ marginTop: 80 }}>
                {goalData.linkedbyfintoo && goalData.linkedbyfintoo.length > 0 && goalData.linkedbyfintoo[0] && goalData.linkedbyfintoo[0].linked_assets_by_fintoo != '' ? (
                  <div className="recommen_sec_div">
                    {goalData.linkedbyfintoo[0] && goalData.linkedbyfintoo[0].linked_assets_by_fintoo != '' ? (
                      <div className="rec_head_div" style={{ left: "40%" }}>
                        <i></i>
                        <span>Fintoo Recommends</span>
                      </div>
                    ) : null}
                    {goalData.linkedbyfintoo[0] && goalData.linkedbyfintoo[0].linked_assets_by_fintoo != '' ? (
                      <div className="inner_text_div">
                        <p className="mb-3" style={{ fontSize: "1rem", fontWeight: "600", }}>
                          As you can see in the table below, there are
                          certain goals that you aren't able to achieve
                          fully. To help you remedy this, we have linked
                          your currently unlinked assets to these goals.
                          Take a look at the table below for more
                          information.
                        </p>
                      </div>
                    ) : null}
                    {goalData.linkedbyfintoo[0] && goalData.linkedbyfintoo[0].linked_assets_by_fintoo != '' && (goalData.linkedbyfintoo[0].total_asset_value_by_fintoo > 0 || goalData.linkedbyfintoo[0].total_new_investment_by_fintoo > 0) ? (
                      <div className="table_div ">
                        <table className="bgStyleTable splitForPrint">
                          <thead>
                            <tr>
                              <th style={{ borderRight: "none" }}>Assets Linked by Fintoo</th>
                              <th>Future Value of Assets (₹)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {goalData.linkedbyfintoo[0].linked_assets_by_fintoo && goalData.linkedbyfintoo[0].linked_assets_by_fintoo.map((item, index) => (
                              <tr className="top-line">
                                <td style={{ fontWeight: 700 }}>{item['asset_name']}</td>
                                <td style={{ fontWeight: 700 }}>{rsFilter(parseInt(item['asset_future_value']))}</td>
                              </tr>
                            ))}
                            <tr className="top-line bold">
                              <td className="">Gross Total (₹)</td>
                              <td>{rsFilter(parseInt(goalData.linkedbyfintoo[0]?.total_asset_value_by_fintoo || 0))}</td>
                            </tr>
                            <tr className="bold top-line ">
                              {(goalData.linkedbyfintoo[0]?.diff_afterlinkange || 0) >= 0 ? (
                                <td style={{ fontWeight: "bold", color: "black" }}>Surplus</td>
                              ) : <td style={{ fontWeight: "bold", color: "red" }}>(Shortfall)</td>}
                              {(goalData.linkedbyfintoo[0]?.diff_afterlinkange || 0) >= 0 ? (
                                <td style={{ fontWeight: "bold", color: "black" }} >{rsFilter(parseInt(goalData.linkedbyfintoo[0]?.diff_afterlinkange || 0))}</td>
                              ) : <td style={{ fontWeight: "bold", color: "red" }} >({rsFilter(parseInt(Math.abs(goalData.linkedbyfintoo[0]?.diff_afterlinkange || 0)))})</td>}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : null}

                    <br />
                    <br />

                    {goalData.additionalInv && goalData.additionalInv.length > 0 && goalData.additionalInv.reduce((total, item) => total + item['fv'], 0) > 0 ? (
                      <div className="mt-4">
                        <h4 className="rTitle text-center">
                          <img src={imagePath + "/static/media/DG/reports/goal-analysis/additional-investment.svg"}
                            alt=""></img>
                          Addition Investment for the Goal
                        </h4>
                        <div className="inner_text_div">
                          <p className="mb-3" style={{ fontSize: "1rem", fontWeight: "600", }}>
                            As your current investments are not sufficient
                            to achieve your goal, we recommend that you make
                            fresh investments to accumulate the necessary
                            finance. Based on your risk profile and the
                            tenure of the goal, here are the options our
                            experts consider best for you.
                          </p>
                        </div>
                        <div className="table_div ">
                          <table className="bgStyleTable">
                            <thead>
                              <tr>
                                <th colSpan={6} className="text-center">
                                  Monthly Investment OR Lumpsum Investment
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="outline">
                                <td className="bold">Asset Type </td>
                                <td className="bold">Allocation</td>
                                <td className="bold">Return Percentage</td>
                                <td className="bold">Monthly Investment (₹)</td>
                                <td className="bold">Lumpsum Investment (₹)</td>
                                <td className="bold">Future Value (₹)</td>
                              </tr>
                              {goalData.additionalInv && goalData.additionalInv.map((item, index) => (
                                <tr key={index}>
                                  <td className="bold">{item["name"]}</td>
                                  <td className="bold">{item["allocation_per"]}%</td>
                                  <td className="bold">{item["return_rate"]}%</td>
                                  <td className="bold">{rsFilter(parseInt(item["pmt"]))}</td>
                                  <td className="bold">{rsFilter(parseInt(item["pv"]))}</td>
                                  <td className="bold">{rsFilter(parseInt(item["fv"]))}</td>
                                </tr>
                              ))}
                              <tr className="bold top-line total-value">
                                <td colSpan={3}>Total</td>
                                <td>{rsFilter(parseInt((goalData.additionalInv || []).reduce((total, item) => total + item['pmt'], 0)))}</td>
                                <td>{rsFilter(parseInt((goalData.additionalInv || []).reduce((total, item) => total + item['pv'], 0)))}</td>
                                <td>{rsFilter(parseInt((goalData.additionalInv || []).reduce((total, item) => total + item['fv'], 0)))}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <p style={{ height: "2rem", }}></p>

              {goalData.graphdata != '' ? (
                <div className="graphSection rGraph row justify-content-center">
                  <h3 className="text-center">Retirement Goal Recommendation</h3>
                  <div id="retirementCorpusGraph" className="col-md-10" data-highcharts-chart={0} style={{ overflow: "hidden", backgroundColor: "#fff", }}>
                    <RetirementCorpus graphdata={goalData.graphdata} colorArr={goalData.colorArr} />
                  </div>
                </div>
              ) : null}
              <div className="container" style={{ marginTop: "4rem", }}>
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
                    <p
                      style={{ fontStyle: "italic", color: "#787878" }}
                    >
                      The Rate Of Return (ROR) for the Equity Asset
                      Class Eg. Shares, Equity Mutual Funds, PMS, ESOPs
                      etc. linked to achieve your goals is assumed to be
                      12.0% per annum, as per the market standards or as
                      manually edited by you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) :
        <>
          <div className="no-data-found text-center">
            <div className="container">
              <div className="row justify-content-center align-items-center">
                <div className="col-md-10">
                  <img
                    src={imagePath + "/static/media/DG/data-not-found.svg"}
                    alt="Data not found"
                  />
                  <p>
                    Since you missed to fill in the required information which
                    is needed here, we are not able to show you this section.
                    Kindly click on below button to provide all the necessary
                    inputs. Providing all the information as asked will ensure
                    more accurate financial planning report. Once you fill in
                    the data, same will be reflected here.
                  </p>
                  <a
                    href="/datagathering/income-expenses"
                    target="_blank"
                    className="link"
                  >
                    Complete Retirement expense
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
}
export default RetirementCorpusPage;
