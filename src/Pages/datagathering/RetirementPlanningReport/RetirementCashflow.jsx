import React, { useState } from "react";
import { makePositive, rsFilter } from "../../../common_utilities";
import { imagePath } from "../../../constants";

const RetirementCashflow = (props) => {
  const [lifetimeIncViewDetails, setLifetimeIncViewDetails] = useState(false);
  const [limitedIncViewDetails, setLimitedIncViewDetails] = useState(false);
  const [lifetimeExpViewDetails, setLifetimeExpViewDetails] = useState(false);
  const [limitedExpViewDetails, setLimitedExpViewDetails] = useState(false);

  const isRetirementData = props?.data?.isRetirementData
    ? props.data.isRetirementData
    : 0;
  const screenHeader = props?.data?.screenHeader ? props.data.screenHeader : "";
  const title = props?.data?.title ? props.data.title : "";
  const formula = props?.data?.formula ? props.data.formula : "";

  const lifetimeIncome = props?.data?.lifetime_income
    ? props.data.lifetime_income
    : [];

  const lifetimeIncomeObj = props?.data?.lifetime_income_obj
    ? props.data.lifetime_income_obj
    : [];

  const limitedIncome = props?.data?.limited_income
    ? props.data.limited_income
    : [];

  const limitedIncomeObj = props?.data?.limited_income_obj
    ? props.data.limited_income_obj
    : [];

  const lifetimeExpense = props?.data?.lifetime_expense
    ? props.data.lifetime_expense
    : [];

  const lifetimeExpenseObj = props?.data?.lifetime_expense_obj
    ? props.data.lifetime_expense_obj
    : [];

  const limitedExpense = props?.data?.limited_expense
    ? props.data.limited_expense
    : [];

  const limitedExpenseObj = props?.data?.limited_expense_obj
    ? props.data.limited_expense_obj
    : [];

  const openingBalance = props?.data?.opening_balance
    ? props.data.opening_balance
    : [];
  const closingBalance = props?.data?.closing_balance
    ? props.data.closing_balance
    : [];
  const retirementYear = props?.data?.retirement_year
    ? props.data.retirement_year
    : [];
  const incomeFromCorpus = props?.data?.income_from_corpus
    ? props.data.income_from_corpus
    : [];
  const remainingCorpus = props?.data?.remaining_corpus
    ? props.data.remaining_corpus
    : [];
  const appreciatedValue = props?.data?.appreciated_value
    ? props.data.appreciated_value
    : [];

  const getObjectKey = (obj) => {
    return Object.keys(obj)[0];
  };


  return (
    <>
      <div className="retirementCashflow">
        {isRetirementData !== 0 ? (
          <>
            <h4 className="rTitle">
              <img
                src={imagePath + "/static/media/DG/reports/icons/t_retirement_planning_cashflow.svg"}
              />
              {title}
            </h4>
            <div className="rContent">
              <p
                dangerouslySetInnerHTML={{
                  __html: screenHeader ? screenHeader : "Controlling your financial affairs requires a budget, that is a cash flow statement. Budgeting and tracking your expenses gives you a strong sense of where your money goes and can help you reach your financial goal like retirement in this case. Below table explains how your cash flow will look like from year to year basis if you are able to achieve your required corpus.",
                }}
              ></p>
            </div>
            <div className="table-responsive rTable">
              <table className="bgStyleTable">
                <tbody>
                  <tr>
                    <th>Year</th>
                    <th>Age</th>
                    <th>
                      Opening <br /> Balance (₹)(A)
                    </th>
                    {lifetimeIncome.length > 0 ? (
                      <th>
                        Income till Life <br /> Exp ( B )(₹)
                        {lifetimeIncomeObj.data.income.length > 0 && lifetimeIncViewDetails === false && (
                          <span className="expandColumns recomm_expandcolor" onClick={() => setLifetimeIncViewDetails(true)}>
                            View Details
                          </span>
                        )}
                        {lifetimeIncViewDetails === true && (
                          <span className="expandColumns recomm_expandcolor" onClick={() => setLifetimeIncViewDetails(false)}>
                            Close Details
                          </span>
                        )}
                      </th>
                    ) : null}

                    {lifetimeIncViewDetails === true && lifetimeIncome.length > 0 ? (
                      <>
                        {Object.entries(lifetimeIncomeObj.data.income).map(([key, value]) => (
                          <th>{value.income_name} (₹)</th>
                        ))}
                      </>
                    ) : null}

                    {limitedIncome.length > 0 ? (
                      <th>
                        Income One time/<br />Limited ( C ) (₹)
                        {limitedIncomeObj.data.income.length > 0 && limitedIncViewDetails === false && (
                          <span className="expandColumns recomm_expandcolor" onClick={() => setLimitedIncViewDetails(true)}>
                            View Details
                          </span>
                        )}
                        {limitedIncViewDetails === true && (
                          <span className="expandColumns recomm_expandcolor" onClick={() => setLimitedIncViewDetails(false)}>
                            Close Details
                          </span>
                        )}
                      </th>
                    ) : null}

                    {limitedIncViewDetails === true && limitedIncomeObj.data.income.length > 0 ? (
                      <>
                        {Object.entries(limitedIncomeObj.data.income).map(([key, obj]) => (
                          <th>{obj.income_name} (₹)</th>
                        ))}
                      </>
                    ) : null}

                    <th>
                      Expenses till<br />Life Exp <br />( D) (₹)
                      {lifetimeExpenseObj?.data?.expense?.length > 0 && lifetimeExpViewDetails === false && (
                        <span className="expandColumns recomm_expandcolor" onClick={() => setLifetimeExpViewDetails(true)}>
                          View Details
                        </span>
                      )}
                      {lifetimeExpViewDetails === true && (
                        <span className="expandColumns recomm_expandcolor" onClick={() => setLifetimeExpViewDetails(false)}>
                          Close Details
                        </span>
                      )}
                    </th>

                    {lifetimeExpViewDetails === true && lifetimeExpense.length > 0 ? (
                      <>
                        {Object.entries(lifetimeExpenseObj?.data?.expense).map(([key, obj]) => (
                          <th>{obj.expense_name} (₹)</th>
                        ))}
                      </>
                    ) : null}

                    {limitedExpense.length > 0 ? (
                      <th>
                        Expenses One time/<br />Limited ( E ) (₹)
                        {limitedExpenseObj?.data?.expense?.length > 0 && limitedExpViewDetails === false && (
                          <span className="expandColumns recomm_expandcolor" onClick={() => setLimitedExpViewDetails(true)}>
                            View Details
                          </span>
                        )}
                        {limitedExpViewDetails === true && (
                          <span className="expandColumns recomm_expandcolor" onClick={() => setLimitedExpViewDetails(false)}>
                            Close Details
                          </span>
                        )}
                      </th>
                    ) : null}

                    {limitedExpViewDetails === true && limitedExpense.length > 0 ? (
                      <>
                        {Object.entries(limitedExpenseObj?.data?.expense).map(([key, obj]) => (
                          <th>{obj.expense_name} (₹)</th>
                        ))}
                      </>
                    ) : null}

                    <th>
                      Cash withdraw from Corpous
                      <br />
                      (₹)(F) = {formula}
                    </th>
                    <th>
                      Remaining Corpus
                      <br /> (G) (₹)= (A)-(F)
                    </th>
                    <th>
                      Appreciated value <br /> (H) (₹)
                    </th>
                    <th>
                      Closing balance <br />
                      (₹)= (G)+(H)
                    </th>
                  </tr>

                  {Object.entries(openingBalance).map(([key, value]) => (
                    <tr key={key}>
                      <td>{retirementYear[key]}</td>

                      {Object.entries(value).map(([k, obj]) => (
                        <>
                          <td>{k}</td>
                          <td>{rsFilter(obj)}</td>
                        </>
                      ))}
                      {lifetimeIncome.length > 0
                        ? Object.entries(value).map(([k, obj]) => (
                          <>
                            <td>
                              {lifetimeIncome[key] == undefined ? (
                                0
                              ) : (
                                <>{rsFilter(lifetimeIncome[key][k])}</>
                              )}
                            </td>
                          </>
                        ))
                        : null}

                      {/* Show if View details in Income till Life expectancy clicked */}
                      {lifetimeIncViewDetails === true && lifetimeIncome.length > 0
                        ?
                        Object.entries(lifetimeIncomeObj?.data?.income).map(([k, obj]) => (
                          <>
                            <td>
                              {lifetimeIncomeObj.data.income[k].income_growth[key] == undefined ? (
                                0
                              ) : (
                                rsFilter(lifetimeIncomeObj.data.income[k].income_growth[key][getObjectKey(lifetimeIncomeObj.data.income[k].income_growth[key])])
                              )}

                            </td>
                          </>
                        ))

                        : null}

                      {//console.log("lifetimeLimitedIncome: ", limitedIncome.length)
                      }

                      {limitedIncome.length > 0
                        ? Object.entries(value).map(([k, obj]) => (
                          <>
                            <td>
                              {limitedIncome[key] == undefined ? (
                                0
                              ) : (
                                <>{rsFilter(limitedIncome[key][k])}</>
                              )}
                            </td>
                          </>
                        ))
                        : null}

                      {/* Show if View details for Income One Time/ Limited */}
                      {limitedIncViewDetails === true && limitedIncome.length > 0
                        ?
                        Object.entries(limitedIncomeObj.data.income).map(([k, obj]) => (
                          <>
                            <td>
                              {limitedIncomeObj.data.income[k].income_growth[key] == undefined ? (
                                0
                              ) : (
                                rsFilter(limitedIncomeObj.data.income[k].income_growth[key][getObjectKey(limitedIncomeObj.data.income[k].income_growth[key])])
                              )}

                            </td>
                          </>
                        ))

                        : null}

                      {/* kk */}
                      {Object.entries(value).map(([k, obj]) => (
                        <>
                          <td>
                            {lifetimeExpense[key] == undefined ? (
                              0
                            ) : (
                              <>{rsFilter(lifetimeExpense[key][k])}</>
                            )}
                          </td>
                        </>
                      ))}

                      {/* Show if View details for Expense till Life Exp  */}
                      {lifetimeExpViewDetails === true && lifetimeExpenseObj.data.expense.length > 0
                        ?
                        Object.entries(lifetimeExpenseObj.data.expense).map(([k, obj]) => (
                          <>
                            <td>
                              {lifetimeExpenseObj.data.expense[k].expense_growth[key] == undefined ? (
                                0
                              ) : (
                                rsFilter(lifetimeExpenseObj.data.expense[k].expense_growth[key][getObjectKey(lifetimeExpenseObj.data.expense[k].expense_growth[key])])
                              )}
                            </td>
                          </>
                        ))
                        : null}

                      {limitedExpense.length > 0
                        ? Object.entries(value).map(([k, obj]) => (
                          <>
                            <td>
                              {limitedExpense[key] == undefined ? (
                                0
                              ) : (
                                <>{rsFilter(limitedExpense[key][k])}</>
                              )}
                            </td>
                          </>
                        ))
                        : null}

                      {/* Show View details for Expenses One time/ Limited */}
                      {limitedExpViewDetails === true && limitedExpense.length > 0
                        ?
                        Object.entries(limitedExpenseObj.data.expense).map(([k, obj]) => (
                          <>
                            <td>
                              {limitedExpenseObj.data.expense[k].expense_growth[key] == undefined ? (
                                0
                              ) : (
                                rsFilter(limitedExpenseObj.data.expense[k].expense_growth[key][getObjectKey(limitedExpenseObj.data.expense[k].expense_growth[key])])
                              )}
                            </td>
                          </>
                        ))
                        : null}

                      {Object.entries(value).map(([k, obj]) => (
                        incomeFromCorpus[key] == undefined ? (
                          <td>0</td>
                        ) : incomeFromCorpus[key][k] < 0 ? (
                          <td style={{ color: "red" }}>
                            ({rsFilter(makePositive(incomeFromCorpus[key][k]))})
                          </td>
                        ) : (
                          <td>{rsFilter(incomeFromCorpus[key][k])}</td>
                        )
                      ))}

                      {Object.entries(value).map(([k, obj]) => (
                        remainingCorpus[key] == undefined ? (
                          <td>0</td>
                        ) : remainingCorpus[key][k] < 0 ? (
                          <td style={{ color: "red" }}>
                            ({rsFilter(makePositive(remainingCorpus[key][k]))})
                          </td>
                        ) : (
                          <td>{rsFilter(remainingCorpus[key][k])}</td>
                        )
                      ))}

                      {Object.entries(value).map(([k, obj]) => (
                        appreciatedValue[key] == undefined ? (
                          <td>0</td>
                        ) : appreciatedValue[key][k] < 0 ? (
                          <td style={{ color: "red" }}>
                            ({rsFilter(makePositive(appreciatedValue[key][k]))})
                          </td>
                        ) : (
                          <td>{rsFilter(appreciatedValue[key][k])}</td>
                        )
                      ))}

                      {Object.entries(value).map(([k, obj]) => (
                        closingBalance[key] == undefined ? (
                          <td>0</td>
                        ) : closingBalance[key][k] < 0 ? (
                          <td style={{ color: "red" }}>
                            ({rsFilter(makePositive(closingBalance[key][k]))})
                          </td>
                        ) : (
                          <td>{rsFilter(closingBalance[key][k])}</td>
                        )
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
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
        )}
        <div style={{ height: 50 }}></div>
      </div>
    </>
  );
}

export default RetirementCashflow;
