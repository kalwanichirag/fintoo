import React, { useState } from "react";
import NoDataFound from "./NoDataFound";
import { rsFilter, makePositive } from "../../../common_utilities";
import { imagePath } from "../../../constants";

function CashflowRecommendation(props) {
  const [activeToggle, setActiveToggle] = useState("");
  const recommendationData = props.data ? props.data : {};
  const totalGrossIncome = props?.income_data?.total_gross_income
    ? props?.income_data?.total_gross_income
    : [];
  const expenses = props?.expense_data?.Expenses
    ? props?.expense_data?.Expenses
    : {};
  const totalInvestment = props?.data?.total_investment
    ? props?.data?.total_investment
    : {};
  const totalNewInvestment = props?.data?.total_newinvestment
    ? props?.data?.total_newinvestment
    : {};
  const cashflowInvestments = props?.data?.cashflowinvestments
    ? props?.data?.cashflowinvestments
    : {};
  const openingBalance = props?.data?.opening_balance
    ? props?.data?.opening_balance
    : {};
  const closingBalance = props?.data?.closing_balance
    ? props?.data?.closing_balance
    : {};
  const totalSurplus = props?.data?.total_surplus
    ? props?.data?.total_surplus
    : {};
  const additionalInvestmentCorpus = props?.data?.additional_investment_corpus
    ? props?.data?.additional_investment_corpus
    : {};
  const additionalInvestmentArray = props?.data?.addtional_inv_array
    ? props?.data?.addtional_inv_array
    : {};
  const overachievedAssetsNameSet = props?.data?.overachievedassetname_set
    ? props?.data?.overachievedassetname_set
    : {};
  const overachievedAssetsAmtSet = props?.data?.overachievedassetamt_set
    ? props?.data?.overachievedassetamt_set
    : {};
  const userAssetYearlyName = props?.data?.user_asset_yearly_name
    ? props?.data?.user_asset_yearly_name
    : {};
  const userAssetYearlyAmount = props?.data?.user_asset_yearly_amount
    ? props?.data?.user_asset_yearly_amount
    : {};
  const userAssetYearlyCategoryName = props?.data?.user_asset_yearly_cat_name
    ? props?.data?.user_asset_yearly_cat_name
    : {};
  const userAssetYearlyMemberName = props?.data?.user_asset_yearly_member_name
    ? props?.data?.user_asset_yearly_member_name
    : {};
  const cashflowGoalsArray = props?.data?.cashflow_goals_array
    ? props?.data?.cashflow_goals_array
    : {};
  const cashflowGoalsArrayAmt = props?.data?.cashflow_goals_array_amt
    ? props?.data?.cashflow_goals_array_amt
    : {};
  const cashflowYear = props?.expense_data?.cashflowyear
    ? props?.expense_data?.cashflowyear
    : {};

  const handleToggle = (toggle) => {
    if (activeToggle === toggle) {
      setActiveToggle("");
    } else {
      setActiveToggle(toggle);
    }
  };

  return (
    <>
      <div className="CashflowNetSurplus">
        {totalGrossIncome.length > 0 &&
          Object.keys(expenses).length > 0 &&
          Object.keys(recommendationData).length > 0 &&
          Object.keys(totalInvestment).length > 0 ? (
          <>
            <h4 className="rTitle">
              <img src={imagePath + "/static/media/DG/reports/recommendation.svg"} />
              Recommendation
            </h4>
            <div className="rContent">
              <p
                dangerouslySetInnerHTML={{
                  __html: recommendationData?.section_text?.field0 || "",
                }}
              ></p>
            </div>

            <div className="table-responsive rTable cashFlowTables">
              <table className="bgStyleTable">
                <tbody>
                  <tr className="text-center color recommendation-table">
                    <td>Year</td>
                    <td>Opening Balance (₹) (A)</td>
                    <td>
                      Net Investable Surplus (Gr. Inflow-Gr. Outflow) for the
                      year(₹) (B)
                    </td>
                    <td id="exsitingColumn">
                      Committed Investment yearly (₹) (C)
                      {Object.keys(cashflowInvestments).length > 0 ? (
                        <span
                          className="expandColumnsNet recommendation"
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => handleToggle("committed_investment")}
                        >
                          {activeToggle === "committed_investment"
                            ? "Close Details <"
                            : "View Details >"}
                        </span>
                      ) : null}
                    </td>
                    {Object.keys(cashflowInvestments).length > 0
                      ? activeToggle === "committed_investment" &&
                      Object.keys(cashflowInvestments).map((val, i) => (
                        <td className="cashFlowTablesTH" key={i}>
                          {cashflowInvestments[val]["cat_name"]}
                        </td>
                      ))
                      : null}
                    <td id="exsitingColumn">
                      Recommended Investment SIP(Yearly) (₹) (D)
                      <span
                        className="expandColumnsNet recommendation"
                        style={{ whiteSpace: "nowrap" }}
                        onClick={() => handleToggle("recommended_investment")}
                      >
                        {activeToggle === "recommended_investment"
                          ? "Close Details <"
                          : "View Details >"}
                      </span>
                    </td>
                    {activeToggle === "recommended_investment" && (
                      <>
                        <td className="cashFlowTablesTH">Large Cap (₹)</td>
                        <td className="cashFlowTablesTH">Mid Cap (₹)</td>
                        <td className="cashFlowTablesTH">Small Cap (₹)</td>
                        <td className="cashFlowTablesTH">Long Term (₹)</td>
                        <td className="cashFlowTablesTH">Mid Term (₹)</td>
                        <td className="cashFlowTablesTH">Short Term (₹)</td>
                        <td className="cashFlowTablesTH">Hybrid (₹)</td>
                      </>
                    )}
                    <td
                      style={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      Reinvestment of matured assets after <br /> utilising for
                      goals (₹) (E)
                    </td>
                    <td>Inflow - Assets utilised for the goal (₹) (F)</td>
                    <td>Outflow - Required goal amount for the year (₹) (G)</td>
                    <td>Closing Balance (₹) (I) = (A+B-C-D)-(E+F-G)</td>
                  </tr>
                  {Object.keys(cashflowYear).map((data, index) => (
                    <>
                      <tr key={index} className="tabledata">
                        <td>{data}</td>
                        <td>{rsFilter(openingBalance[data])}</td>
                        {totalSurplus[data] == 0 ? (
                          <td>{rsFilter(totalSurplus[data])}</td>
                        ) : totalSurplus[data] > 0 ? (
                          <td>{rsFilter(totalSurplus[data])}</td>
                        ) : (
                          <td style={{ color: "red" }}>
                            ({rsFilter(makePositive(totalSurplus[data]))})
                          </td>
                        )}
                        <td>{rsFilter(totalInvestment[data])}</td>
                        {Object.keys(cashflowInvestments).length > 0
                          ? activeToggle === "committed_investment" &&
                          Object.keys(cashflowInvestments).map((val, i) => (
                            <td
                              style={{ backgroundColor: "#e2e2e2" }}
                              key={i}
                            >
                              {rsFilter(
                                cashflowInvestments[val]["amount"][data]
                              )}
                            </td>
                          ))
                          : null}
                        <td>{rsFilter(additionalInvestmentCorpus[data])}</td>
                        {activeToggle === "recommended_investment" && (
                          <>
                            <td>
                              {rsFilter(additionalInvestmentArray[data]["99"])}
                            </td>
                            <td>
                              {rsFilter(additionalInvestmentArray[data]["98"])}
                            </td>
                            <td>
                              {rsFilter(additionalInvestmentArray[data]["97"])}
                            </td>
                            <td>
                              {rsFilter(additionalInvestmentArray[data]["102"])}
                            </td>
                            <td>
                              {rsFilter(additionalInvestmentArray[data]["101"])}
                            </td>
                            <td>
                              {rsFilter(additionalInvestmentArray[data]["100"])}
                            </td>
                            <td>
                              {rsFilter(additionalInvestmentArray[data]["103"])}
                            </td>
                          </>
                        )}
                        {overachievedAssetsNameSet[data] == 0 ? (
                          <>
                            <td style={{ textAlign: "center" }}>-</td>
                          </>
                        ) : (
                          <>
                            <td>
                              <table className="recommendation-inner-tables-border">
                                <tbody>
                                  {Array.isArray(overachievedAssetsNameSet[data]) &&
                                    overachievedAssetsNameSet[data].map((el, i) => (
                                      <tr key={i}>
                                        <td className="child">{el}</td>
                                        <td className="child">
                                          {rsFilter(overachievedAssetsAmtSet[data]?.[i])}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>

                              </table>
                            </td>
                          </>
                        )}
                        {userAssetYearlyName[data] == 0 &&
                          totalNewInvestment[data] == 0 ? (
                          <td style={{ textAlign: "center" }}>-</td>
                        ) : userAssetYearlyName[data] != 0 ||
                          totalNewInvestment[data] != 0 ? (
                          <>
                            <td>
                              <table className="recommendation-inner-tables-border">
                                <tbody>
                                  {Array.isArray(userAssetYearlyName[data]) &&
                                    userAssetYearlyName[data].map((el, i) =>
                                      userAssetYearlyAmount?.[data]?.[i] > 0 ? (
                                        <tr key={i}>
                                          <td className="child">{el}</td>
                                          <td className="child">
                                            {userAssetYearlyCategoryName?.[data]?.[i] || "-"}
                                          </td>
                                          <td className="child">
                                            {userAssetYearlyMemberName?.[data]?.[i] || "-"}
                                          </td>
                                          <td className="child">
                                            {rsFilter(userAssetYearlyAmount[data][i])}
                                          </td>
                                        </tr>
                                      ) : null
                                    )}

                                  {totalNewInvestment?.[data] !== 0 && (
                                    <tr>
                                      <td className="child">Additional Investment Corpus</td>
                                      <td className="child">{rsFilter(totalNewInvestment[data])}</td>
                                    </tr>
                                  )}
                                </tbody>

                              </table>
                            </td>
                          </>
                        ) : null}
                        {cashflowGoalsArray[data] == 0 ? (
                          <>
                            <td style={{ textAlign: "center" }}>-</td>
                          </>
                        ) : (
                          <>
                            <td>
                              <table className="recommendation-inner-tables-border">
                                <tbody>
                                  {Array.isArray(cashflowGoalsArray[data]) &&
                                    cashflowGoalsArray[data].map((el, i) => (
                                      <tr key={i}>
                                        <td className="child">{el}</td>
                                        <td className="child">
                                          {rsFilter(cashflowGoalsArrayAmt?.[data]?.[i])}
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>

                            </td>
                          </>
                        )}
                        {closingBalance[data] == 0 ? (
                          <td>{rsFilter(closingBalance[data])}</td>
                        ) : closingBalance[data] > 0 ? (
                          <td>{rsFilter(closingBalance[data])}</td>
                        ) : (
                          <td style={{ color: "red" }}>
                            ({rsFilter(makePositive(closingBalance[data]))})
                          </td>
                        )}
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="container" style={{ padding: "5%" }}>
              <div className="notes_sec_div mt-md-4" style={{ border: "none" }}>
                <div className="notes_head_div">
                  <i />
                  <span>Notes</span>
                </div>
                <div
                  className="notes_text_div mt-md-0 mt-3"
                  style={{ marginTop: "0%" }}
                >
                  <div className="rContent ">
                    <p
                      className="hidebglist"
                      dangerouslySetInnerHTML={{
                        __html: recommendationData?.section_text?.field1 || "",
                      }}
                    ></p>

                    <p
                      dangerouslySetInnerHTML={{
                        __html: recommendationData?.section_text?.field2 || "",
                      }}
                    ></p>

                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <NoDataFound />
          </>
        )}
      </div>
    </>
  );
}

export default CashflowRecommendation;
