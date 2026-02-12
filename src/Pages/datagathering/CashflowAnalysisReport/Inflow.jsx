import React, { useEffect, useState } from "react";
import NoDataFound from "./NoDataFound";
import { rsFilter, toTitleCase } from "../../../common_utilities";
import { imagePath } from "../../../constants";

function Inflow(props) {
  const [activeToggle, setActiveToggle] = useState("");
  const [colSpan, setColSpan] = useState(props.data.colSpan);
  const cashinflowData = props.data ? props.data : {};
  const cashflowYear = props.data.cashflowyear ? props.data.cashflowyear : [];
  const finalArray = props.data.inflowFinalArray ? props.data.inflowFinalArray: [];
  const totalGrossIncome = props.data.total_gross_income ? props.data.total_gross_income : [];
  const incomeByCategory = props.data.income_by_category ? props.data.income_by_category : {};
  const totalIncomeCategory = props.data.total_category_income ? props.data.total_category_income : {};

  useEffect(() => {
    setColSpan(props?.data.colSpan);
  }, [props?.data.colSpan]);

  const handleToggle = (toggle) => {
    if (activeToggle === toggle) {
      setActiveToggle("");
    } else {
      setActiveToggle(toggle);
    }
    if (toggle != "") {
      var final_array_length = finalArray.length;
      var inflowcol =
        final_array_length +
        incomeByCategory[toggle].length +
        1;
      setColSpan(inflowcol);
    } else {
      var final_array_length = finalArray.length;
      setColSpan(1 + final_array_length);
    }
  };
  console.log("incomeByCategory",incomeByCategory)
  return (
    <>
      <div className="cashflowIn">
        {totalGrossIncome.length > 0 ? (
          <>
            <h4 className="rTitle">
              <img src={imagePath + "/static/media/DG/reports/cashflow/cash-in-flow.svg"} />
              Cash-Inflow
            </h4>
            <div className="rContent">
              <p
                dangerouslySetInnerHTML={{
                  __html: cashinflowData["section_text"]
                    ? cashinflowData["section_text"]
                    : "",
                }}
              ></p>
              <div className="table-responsive rTable cashFlowTables">
                <table className="bgStyleTable">
                  <thead></thead>
                  <tbody className="CashInflow">
                    <tr className="main_header color">
                      <td
                        colSpan={2}
                        style={{
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Plan Year / Age
                      </td>
                      <td
                        colSpan={colSpan}
                        style={{
                          color: "#fff !important",
                          textAlign: "center",
                        }}
                      >
                        CASH INFLOW
                      </td>
                    </tr>
                    <tr className="outline">
                      <td>Year</td>
                      <td>Age</td>
                      {incomeByCategory["salary_and_bonus"] && 
                        incomeByCategory["salary_and_bonus"].length > 0 ? (
                        <>
                          <td>
                            Salary & bonus (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("salary_and_bonus")}
                            >
                              {activeToggle === "salary_and_bonus"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "salary_and_bonus" &&
                            incomeByCategory[
                              "salary_and_bonus"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="salary_and_bonus"
                                key={val["details"]["income_name"]}
                              >
                                {val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"]}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["interest_income"] && 
                       incomeByCategory["interest_income"].length > 0 ? (
                        <>
                          <td>
                            Interest Income (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("interest_income")}
                            >
                              {activeToggle === "interest_income"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "interest_income" &&
                            incomeByCategory[
                              "interest_income"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="interest_income"
                                key={val["details"]["income_name"]}
                              >
                                {val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"]}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["business"] && 
                       incomeByCategory["business"].length > 0 ? (
                        <>
                          <td>
                            Business (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("business")}
                            >
                              {activeToggle === "business"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "business" &&
                            incomeByCategory[
                              "business"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="business"
                                key={val["details"]["income_name"]}
                              >
                                {/* {val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"]} */}
                                  {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["rental"] && 
                       incomeByCategory["rental"].length > 0 ? (
                        <>
                          <td>
                            Rental (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("rental")}
                            >
                              {activeToggle === "rental"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "rental" &&
                            incomeByCategory["rental"].map(
                              (val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="rental"
                                  key={val["details"]["income_name"]}
                                >
                                  {toTitleCase(val["details"]["name"] +
                                    "-" +
                                    val["details"]["income_name"])}
                                </td>
                              )
                            )}
                        </>
                      ) : null}
                      {incomeByCategory["gifts"] && 
                       incomeByCategory["gifts"].length > 0 ? (
                        <>
                          <td>
                            Gifts (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("gifts")}
                            >
                              {activeToggle === "gifts"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "gifts" &&
                            incomeByCategory["gifts"].map(
                              (val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="gifts"
                                  key={val["details"]["income_name"]}
                                >
                                  {toTitleCase(val["details"]["name"] +
                                    "-" +
                                    val["details"]["income_name"])}
                                </td>
                              )
                            )}
                        </>
                      ) : null}
                      {incomeByCategory["pension"] && 
                       incomeByCategory["pension"].length > 0 ? (
                        <>
                          <td>
                            Pension (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("pension")}
                            >
                              {activeToggle === "pension"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "pension" &&
                            incomeByCategory["pension"].map(
                              (val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="pension"
                                  key={val["details"]["income_name"]}
                                >
                                  {toTitleCase(val["details"]["name"] +
                                    "-" +
                                    val["details"]["income_name"])}
                                </td>
                              )
                            )}
                        </>
                      ) : null}
                      {incomeByCategory["miscellaneous"] && 
                       incomeByCategory["miscellaneous"].length > 0 ? (
                        <>
                          <td>
                            Miscellaneous (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("miscellaneous")}
                            >
                              {activeToggle === "miscellaneous"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "miscellaneous" &&
                            incomeByCategory["miscellaneous"].map(
                              (val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="miscellaneous"
                                  key={val["details"]["income_name"]}
                                >
                                  {toTitleCase(val["details"]["name"] +
                                    "-" +
                                    val["details"]["income_name"])}
                                </td>
                              )
                            )}
                        </>
                      ) : null}
                      {incomeByCategory["ulip"] && 
                       incomeByCategory["ulip"].length > 0 ? (
                        <>
                          <td>
                            ulip (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("ulip")}
                            >
                              {activeToggle === "ulip"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "ulip" &&
                            incomeByCategory["ulip"].map(
                              (val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="ulip"
                                  key={val["details"]["income_name"]}
                                >
                                  {toTitleCase(val["details"]["name"] +
                                    "-" +
                                    val["details"]["income_name"])}
                                </td>
                              )
                            )}
                        </>
                      ) : null}
                      {incomeByCategory["endowment"] && 
                       incomeByCategory["endowment"].length > 0 ? (
                        <>
                          <td>
                            Endowment (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("endowment")}
                            >
                              {activeToggle === "endowment"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "endowment" &&
                            incomeByCategory[
                              "endowment"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="endowment"
                                key={val["details"]["income_name"]}
                              >
                                {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["guaranteed_income_plan"] && 
                       incomeByCategory["guaranteed_income_plan"].length > 0 ? (
                        <>
                          <td>
                            Assured Income Plan (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() =>
                                handleToggle("guaranteed_income_plan")
                              }
                            >
                              {activeToggle === "guaranteed_income_plan"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "guaranteed_income_plan" &&
                            incomeByCategory[
                              "guaranteed_income_plan"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="guaranteed_income_plan"
                                key={val["details"]["income_name"]}
                              >
                                {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["pension_plan"] && 
                       incomeByCategory["pension_plan"].length > 0 ? (
                        <>
                          <td>
                            Pension Plan (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("pension_plan")}
                            >
                              {activeToggle === "pension_plan"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "pension_plan" &&
                            incomeByCategory[
                              "pension_plan"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="pension_plan"
                                key={val["details"]["income_name"]}
                              >
                                {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["sovereign_gold_bonds"] && 
                       incomeByCategory["sovereign_gold_bonds"].length > 0 ? (
                        <>
                          <td>
                            Soverign Gold Bonds (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() =>
                                handleToggle("sovereign_gold_bonds")
                              }
                            >
                              {activeToggle === "sovereign_gold_bonds"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "sovereign_gold_bonds" &&
                            incomeByCategory[
                              "sovereign_gold_bonds"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="sovereign_gold_bonds"
                                key={val["details"]["income_name"]}
                              >
                                {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["debentures"] && 
                       incomeByCategory["debentures"].length > 0 ? (
                        <>
                          <td>
                            Debentures (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("debentures")}
                            >
                              {activeToggle === "debentures"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "debentures" &&
                            incomeByCategory[
                              "debentures"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="debentures"
                                key={val["details"]["income_name"]}
                              >
                                {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["fixed_deposit"] && 
                       incomeByCategory["fixed_deposit"].length > 0 ? (
                        <>
                          <td>
                            Fixed Deposit (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("fixed_deposit")}
                            >
                              {activeToggle === "fixed_deposit"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "fixed_deposit" &&
                            incomeByCategory[
                              "fixed_deposit"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="fixed_deposit"
                                key={val["details"]["income_name"]}
                              >
                                {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["government_schemes"] && 
                       incomeByCategory["government_schemes"].length > 0 ? (
                        <>
                          <td>
                            Govt Scheme (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("government_schemes")}
                            >
                              {activeToggle === "government_schemes"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "government_schemes" &&
                            incomeByCategory[
                              "government_schemes"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="government_schemes"
                                key={val["details"]["income_name"]}
                              >
                                {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["bonds"] && 
                       incomeByCategory["bonds"].length > 0 ? (
                        <>
                          <td>
                            Govt Bonds (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("bonds")}
                            >
                              {activeToggle === "bonds"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "bonds" &&
                            incomeByCategory[
                              "bonds"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="bonds"
                                key={val["details"]["income_name"]}
                              >
                                {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      {incomeByCategory["debt_others"] && 
                       incomeByCategory["debt_others"].length > 0 ? (
                        <>
                          <td>
                            Debt Others (₹)
                            <span
                              className="expandColumns"
                              style={{ whiteSpace: "nowrap" }}
                              onClick={() => handleToggle("debt_others")}
                            >
                              {activeToggle === "debt_others"
                                ? "Close Details <"
                                : "View Details >"}
                            </span>
                          </td>
                          {activeToggle === "debt_others" &&
                            incomeByCategory[
                              "debt_others"
                            ].map((val) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="debt_others"
                                key={val["details"]["income_name"]}
                              >
                                {toTitleCase(val["details"]["name"] +
                                  "-" +
                                  val["details"]["income_name"])}
                              </td>
                            ))}
                        </>
                      ) : null}
                      <td>Gross Income (₹)</td>
                    </tr>
                    {cashflowYear.map((data, index) => [
                      <tr className="tabledata" key={index}>
                        <td>{index === 0 ? `${data.year}*` : data.year}</td>
                        <td>{data.age}</td>
                        {incomeByCategory["salary_and_bonus"] && 
                         incomeByCategory["salary_and_bonus"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "salary_and_bonus"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "salary_and_bonus" &&
                              incomeByCategory[
                                "salary_and_bonus"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="salary_and_bonus"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["interest_income"] && 
                         incomeByCategory["interest_income"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "interest_income"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "interest_income" &&
                              incomeByCategory[
                                "interest_income"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="interest_income"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["business"] && 
                         incomeByCategory["business"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "business"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "business" &&
                              incomeByCategory[
                                "business"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="business"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["rental"] && 
                         incomeByCategory["rental"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "rental"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "rental" &&
                              incomeByCategory[
                                "rental"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="rental"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["gifts"] && 
                         incomeByCategory["gifts"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "gifts"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "gifts" &&
                              incomeByCategory["gifts"].map(
                                (val) => (
                                  <td
                                    style={{ backgroundColor: "#e2e2e2" }}
                                    className="gifts"
                                    key={val["details"]["name"]}
                                  >
                                    {rsFilter(
                                      val["details"]["annual_growth_inc"][
                                        data.year
                                      ]
                                    )}
                                  </td>
                                )
                              )}
                          </>
                        ) : null}
                        {incomeByCategory["pension"] && 
                         incomeByCategory["pension"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "pension"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "pension" &&
                              incomeByCategory[
                                "pension"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="pension"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["miscellaneous"] && 
                         incomeByCategory["miscellaneous"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "miscellaneous"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "miscellaneous" &&
                              incomeByCategory[
                                "miscellaneous"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="miscellaneous"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["ulip"] && 
                         incomeByCategory["ulip"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory["ulip"][
                                  index
                                ]
                              )}
                            </td>
                            {activeToggle === "ulip" &&
                              incomeByCategory["ulip"].map(
                                (val) => (
                                  <td
                                    style={{ backgroundColor: "#e2e2e2" }}
                                    className="ulip"
                                    key={val["details"]["name"]}
                                  >
                                    {rsFilter(
                                      val["details"]["annual_growth_inc"][
                                        data.year
                                      ]
                                    )}
                                  </td>
                                )
                              )}
                          </>
                        ) : null}
                        {incomeByCategory["endowment"]
                          .length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "endowment"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "endowment" &&
                              incomeByCategory[
                                "endowment"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="endowment"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["guaranteed_income_plan"] && 
                         incomeByCategory["guaranteed_income_plan"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "guaranteed_income_plan"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "guaranteed_income_plan" &&
                              incomeByCategory[
                                "guaranteed_income_plan"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="guaranteed_income_plan"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["pension_plan"] && 
                         incomeByCategory["pension_plan"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "pension_plan"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "pension_plan" &&
                              incomeByCategory[
                                "pension_plan"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="pension_plan"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["sovereign_gold_bonds"] && 
                         incomeByCategory["sovereign_gold_bonds"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "sovereign_gold_bonds"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "sovereign_gold_bonds" &&
                              incomeByCategory[
                                "sovereign_gold_bonds"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="sovereign_gold_bonds"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["debentures"] && 
                         incomeByCategory["debentures"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "debentures"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "debentures" &&
                              incomeByCategory[
                                "debentures"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="debentures"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["fixed_deposit"] && 
                         incomeByCategory["fixed_deposit"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "fixed_deposit"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "fixed_deposit" &&
                              incomeByCategory[
                                "fixed_deposit"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="fixed_deposit"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["government_schemes"] && 
                         incomeByCategory["government_schemes"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "government_schemes"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "government_schemes" &&
                              incomeByCategory[
                                "government_schemes"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="government_schemes"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["bonds"] && 
                         incomeByCategory["bonds"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "bonds"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "bonds" &&
                              incomeByCategory[
                                "bonds"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="bonds"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {incomeByCategory["debt_others"] && 
                         incomeByCategory["debt_others"].length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                totalIncomeCategory[
                                  "debt_others"
                                ][index]
                              )}
                            </td>
                            {activeToggle === "debt_others" &&
                              incomeByCategory[
                                "debt_others"
                              ].map((val) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="debt_others"
                                  key={val["details"]["name"]}
                                >
                                  {rsFilter(
                                    val["details"]["annual_growth_inc"][
                                      data.year
                                    ]
                                  )}
                                </td>
                              ))}
                          </>
                        ) : null}
                        <td>
                          {rsFilter(
                            totalGrossIncome[index]
                          )}
                        </td>
                      </tr>,
                    ])}
                  </tbody>
                </table>
              </div>
              <div className="container" style={{ padding: "5%" }}>
                <div className="notes_sec_div mt-4" style={{ border: "none" }}>
                  <div className="notes_head_div">
                    <i />
                    <span>Notes</span>
                  </div>
                  <div className="notes_text_div" style={{ marginTop: "0%" }}>
                    <div
                      className="rContent "
                    >
                      <p>
                        All the calculations in the above table are made as per
                        the calendar year. Eg. If you start your financial
                        planning in the month of September, the gross outflow
                        analysis for the first year will be calculated from
                        September to December.
                      </p>
                    </div>
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

export default Inflow;
