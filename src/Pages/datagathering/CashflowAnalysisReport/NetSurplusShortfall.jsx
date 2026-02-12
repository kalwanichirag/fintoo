import React, { useState } from "react";
import NoDataFound from "./NoDataFound";
import {
  getSubtracion,
  makePositive,
  rsFilter
} from "../../../common_utilities";
import { imagePath } from "../../../constants";

function NetSurplusShortfall({ data }) {
  const {
    income = [],
    expense = [],
    cashflowinvestments = {},
    gross_investment = {},
    cashflowyear = {},
    section_text = "",
    surplusShortfallColspan = 0,
  } = data || {};

  const [toggle, setToggle] = useState(false);

  const years = Object.keys(cashflowyear);

  if (!income.length || !expense.length || !years.length) {
    return <NoDataFound />;
  }

  return (
    <div className="CashflowNetSurplus">
      <h4 className="rTitle">
        <img src={`${imagePath}/static/media/Images/reports/cashflow/net-surplus.svg`} />
        Net Surplus / Shortfall
      </h4>
      <div className="rContent">
        <p>Once you deduct all your expenses from your income, you will be left with an amount that is nothing but your savings. Further, when you subtract the sum that you have committed towards existing investments, such as SIPs or PPF, from your savings, you will be left with a sum which is your net surplus. However, if you are spending more than your total income, you will be left with a net shortfall. The table below calculates your net surplus/shortfall for every year until your retirement. It also takes into account the year-on-year growth in your net surplus and investments.</p>
      </div>

      <div className="table-responsive rTable cashFlowTables">
        <table className="bgStyleTable">
          <tbody>
            <tr className="text-center color">
              <td colSpan={2}>AGE PROFILING</td>
              <td colSpan={2}>CASH INFLOW / OUTFLOW</td>
              <td>GROSS INVESTABLE SURPLUS / SHORTFALL</td>
              <td colSpan={toggle ? surplusShortfallColspan : 1}>
                EXISTING INVESTMENT COMMITMENT
              </td>
              <td>NET INVESTABLE SURPLUS</td>
            </tr>

            <tr className="outline">
              <td>Year</td>
              <td>Age</td>
              <td>Cash Inflow (₹)(A)</td>
              <td>Cash Outflow (₹)(B)</td>
              <td style={{ backgroundColor: "#e2e2e2" }}>
              Gross Investable Surplus /Shortfall (₹)(C) =(A)-(B)
              </td>
              <td style={{ backgroundColor: "#e2e2e2" }}>
                Gross Investment (₹)(D)
                {Object.keys(cashflowinvestments).length > 0 && (
                  <span
                    className="expandColumns expandColumnsNet"
                    onClick={() => setToggle(!toggle)}
                    style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    {toggle ? "Close Details <" : "View Details >"}
                  </span>
                )}
              </td>

              {toggle &&
                Object.values(cashflowinvestments).map((inv, idx) => (
                  <td key={idx} className="bg-lightgreen">
                    {inv.cat_name} (₹)
                  </td>
                ))}

              <td>Net Investable Surplus (₹)(C)-(D)</td>
            </tr>

            {years.map((year, index) => {
              const inflow = income[index] || 0;
              const outflow = expense[index] || 0;
              const grossInv = gross_investment[year] || 0;
              const net = getSubtracion(getSubtracion(inflow, outflow), grossInv);

              return (
                <tr className="tabledata" key={year}>
                  <td>{index === 0 ? `${year}*` : year}</td>
                  <td>{cashflowyear[year]}</td>
                  <td>{rsFilter(inflow)}</td>
                  <td>{rsFilter(outflow)}</td>
                  <td style={{ backgroundColor: "#e2e2e2", color: inflow - outflow < 0 ? "red" : "inherit" }}>
                    {rsFilter(makePositive(inflow - outflow))}
                  </td>
                  <td style={{ backgroundColor: "#e2e2e2" }}>{rsFilter(grossInv)}</td>

                  {toggle &&
                    Object.values(cashflowinvestments).map((inv, idx) => (
                      <td key={idx}>{rsFilter(inv.amount[year])}</td>
                    ))}

                  <td style={{ color: net < 0 ? "red" : "inherit" }}>
                    {net < 0 ? `(${rsFilter(makePositive(net))})` : rsFilter(net)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="container" style={{ padding: "5%" }}>
        <div className="notes_sec_div mt-4" style={{ border: "none" }}>
          <div className="notes_head_div">
            <i />
            <span>Notes</span>
          </div>
          <div className="notes_text_div">
            <div className="rContent">
              <p>
                All the calculations in the above table are made as per the calendar year.
                Eg. If you start your financial planning in the month of September, the gross
                outflow analysis for the first year will be calculated from September to December.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetSurplusShortfall;
