import React, { useEffect, useState } from "react";
import NoDataFound from "./NoDataFound";
import { rsFilter, toTitleCase } from "../../../common_utilities";
import { imagePath } from "../../../constants";

function Outflow(props) {
  const [activeToggle, setActiveToggle] = useState("");
  const [colSpan, setColSpan] = useState(props.data.colSpan);
  const cashoutflowData = props.data ? props.data : {};
  const expenses = props?.data.Expenses ? props.data.Expenses : {};
  const cashflowYear = props?.data.cashflowyear ? props.data.cashflowyear : {};
  const totalGrossExpense = props?.data.total_gross_expense ? props.data.total_gross_expense : [];
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
      var final_array_length = Object.keys(expenses).length;
      var outflowcol =
        final_array_length +
        expenses[toggle]["data"].length +
        1;
      setColSpan(outflowcol);
    } else {
      var final_array_length = Object.keys(expenses).length;
      setColSpan(1 + final_array_length);
    }
  };

  return (
    <>
      <div className="cashflowOut">
        {Object.keys(expenses).length > 0 ? (
          <>
            <h4 className="rTitle">
              <img src={imagePath + "/static/media/DG/reports/cashflow/cash-out-flow.svg"} />
              Cash-Outflow
            </h4>
            <div className="rContent">
              <p
                dangerouslySetInnerHTML={{
                  __html: cashoutflowData["section_text"]
                    ? cashoutflowData["section_text"]
                    : "",
                }}
              ></p>
            </div>
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
                      CASH OUTFLOW
                    </td>
                  </tr>
                  <tr className="outline">
                    <td>Year</td>
                    <td>Age</td>
                    {"mandatory_variable" in expenses &&
                    Object.keys(expenses["mandatory_variable"]).length > 0 ? (
                      <>
                        <td>
                          Mandatory Variable Expenses (₹)
                          <span
                            className="expandColumns"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => handleToggle("mandatory_variable")}
                          >
                            {activeToggle === "mandatory_variable"
                              ? "Close Details <"
                              : "View Details >"}
                          </span>
                        </td>
                        {activeToggle === "mandatory_variable" &&
                          Object.keys(expenses["mandatory_variable"].data).map(
                            (val,i) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="mandatory_variable"
                                key={i}
                              >
                                {toTitleCase(expenses["mandatory_variable"].data[val][
                                  "name"
                                ] +
                                  "-" +
                                  expenses["mandatory_variable"].data[val][
                                    "category_name"
                                  ])}
                              </td>
                            )
                          )}
                      </>
                    ) : null}
                    {"mandatory_fixed" in expenses &&
                    Object.keys(expenses["mandatory_fixed"]).length > 0 ? (
                      <>
                        <td>
                          Mandatory Fixed Expenses (₹)
                          <span
                            className="expandColumns"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => handleToggle("mandatory_fixed")}
                          >
                            {activeToggle === "mandatory_fixed"
                              ? "Close Details <"
                              : "View Details >"}
                          </span>
                        </td>
                        {activeToggle === "mandatory_fixed" &&
                          Object.keys(expenses["mandatory_fixed"].data).map(
                            (val,i) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="mandatory_fixed"
                                key={i}
                              >
                                {toTitleCase(expenses["mandatory_fixed"].data[val]["name"] +
                                  "-" +
                                  expenses["mandatory_fixed"].data[val][
                                    "category_name"
                                  ])}
                              </td>
                            )
                          )}
                      </>
                    ) : null}
                    {"wishful_variable" in expenses &&
                    Object.keys(expenses["wishful_variable"]).length > 0 ? (
                      <>
                        <td>
                          Wishfull Variable Expenses (₹)
                          <span
                            className="expandColumns"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => handleToggle("wishful_variable")}
                          >
                            {activeToggle === "wishful_variable"
                              ? "Close Details <"
                              : "View Details >"}
                          </span>
                        </td>
                        {activeToggle === "wishful_variable" &&
                          Object.keys(expenses["wishful_variable"].data).map(
                            (val,i) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="wishful_variable"
                                key={i}
                              >
                                {toTitleCase(expenses["wishful_variable"].data[val][
                                  "name"
                                ] +
                                  "-" +
                                  expenses["wishful_variable"].data[val][
                                    "category_name"
                                  ])}
                              </td>
                            )
                          )}
                      </>
                    ) : null}
                    {"wishful_fixed" in expenses &&
                    Object.keys(expenses["wishful_fixed"]).length > 0 ? (
                      <>
                        <td>
                          Wishfull Fixed Expenses (₹)
                          <span
                            className="expandColumns"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => handleToggle("wishful_fixed")}
                          >
                            {activeToggle === "wishful_fixed"
                              ? "Close Details <"
                              : "View Details >"}
                          </span>
                        </td>
                        {activeToggle === "wishful_fixed" &&
                          Object.keys(expenses["wishful_fixed"].data).map(
                            (val,i) => (
                              <td
                                style={{ backgroundColor: "#e2e2e2" }}
                                className="wishful_fixed"
                                key={i}
                              >
                                {toTitleCase(expenses["wishful_fixed"].data[val]["name"] +
                                  "-" +
                                  expenses["wishful_fixed"].data[val][
                                    "category_name"
                                  ])}
                              </td>
                            )
                          )}
                      </>
                    ) : null}
                    <td>Gross Expenses (₹)</td>
                  </tr>
                  {Object.keys(cashflowYear).map((data, index) => (
                    <>
                      <tr className="tabledata" key={index}>
                        <td>{index === 0 ? `${data}*` : data}</td>
                        <td>{cashflowYear[data]}</td>
                        {"mandatory_variable" in expenses &&
                        Object.keys(expenses["mandatory_variable"]).length >
                          0 ? (
                          <>
                            <td>
                              {rsFilter(
                                expenses["mandatory_variable"].total[data]
                              )}
                            </td>
                            {activeToggle === "mandatory_variable" &&
                              expenses["mandatory_variable"]["data"].map(
                                (mv,i) => (
                                  <td
                                    style={{ backgroundColor: "#e2e2e2" }}
                                    className="mandatory_variable"
                                    key={i}
                                  >
                                    {rsFilter(mv["expense_growth"][data])}
                                  </td>
                                )
                              )}
                          </>
                        ) : null}
                        {"mandatory_fixed" in expenses &&
                        Object.keys(expenses["mandatory_fixed"]).length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                expenses["mandatory_fixed"].total[data]
                              )}
                            </td>
                            {activeToggle === "mandatory_fixed" &&
                              expenses["mandatory_fixed"]["data"].map((mf,i) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="mandatory_fixed"
                                  key={i}
                                >
                                  {rsFilter(mf["expense_growth"][data])}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {"wishful_variable" in expenses &&
                        Object.keys(expenses["wishful_variable"]).length > 0 ? (
                          <>
                            <td>
                              {rsFilter(
                                expenses["wishful_variable"].total[data]
                              )}
                            </td>
                            {activeToggle === "wishful_variable" &&
                              expenses["wishful_variable"]["data"].map((wv,i) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="wishful_variable"
                                  key={i}
                                >
                                  {rsFilter(wv["expense_growth"][data])}
                                </td>
                              ))}
                          </>
                        ) : null}
                        {"wishful_fixed" in expenses &&
                        Object.keys(expenses["wishful_fixed"]).length > 0 ? (
                          <>
                            <td>
                              {rsFilter(expenses["wishful_fixed"].total[data])}
                            </td>
                            {activeToggle === "wishful_fixed" &&
                              expenses["wishful_fixed"]["data"].map((wf,i) => (
                                <td
                                  style={{ backgroundColor: "#e2e2e2" }}
                                  className="wishful_fixed"
                                  key={i}
                                >
                                  {rsFilter(wf["expense_growth"][data])}
                                </td>
                              ))}
                          </>
                        ) : null}
                        <td>{rsFilter(totalGrossExpense[index])}</td>
                      </tr>
                    </>
                  ))}
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
                    className="rContent ng-binding"
                    ng-bind-html="cf_section_data['field1']"
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
          </>
        ) : (
          <NoDataFound />
        )}
      </div>
    </>
  );
}

export default Outflow;
