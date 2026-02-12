import React from "react";
import { makePositive, rsFilter } from "../../../common_utilities";
import { imagePath } from "../../../constants";

function RetirementInfo(props) {
  const screenheader_post_ret_life = props?.data?.screenheader_post_ret_life ? props?.data?.screenheader_post_ret_life : '';
  const postretlife = props?.data?.postretlife ? props.data.postretlife : [];
  const retirementAge = props?.data?.postretlife?.[0]?.retirement_age ? props?.data?.postretlife?.[0]?.retirement_age : "NA";
  const life_expectancy  = props?.data?.postretlife?.[0]?.life_expectancy ? props?.data?.postretlife?.[0]?.life_expectancy : "NA";

  const screenheader_lifetime_exp = props?.data?.screenheader_lifetime_exp ? props?.data?.screenheader_lifetime_exp : '';
  const lifetime_expense = props?.data?.lifetime_expense ? props.data.lifetime_expense : [];

  const screenheader_limited_exp = props?.data?.screenheader_limited_exp ? props?.data?.screenheader_limited_exp : '';
  const limited_expense = props?.data?.limited_expense ? props.data.limited_expense : [];

  const screenheader_onetime_exp = props?.data?.screenheader_onetime_exp ? props?.data?.screenheader_onetime_exp : '';
  const onetime_expense = props?.data?.onetime_expense ? props.data.onetime_expense : [];

  const screenheader_annual_income = props?.data?.screenheader_annual_income ? props?.data?.screenheader_annual_income : '';
  const income = props?.data?.income ? props.data.income : [];
  return (
    <>
      {postretlife != '' || lifetime_expense !='' || limited_expense !='' || onetime_expense != '' || income!='' ? (
      <div>
        <div>
          <div style={{marginTop: "2rem", marginBottom: "1.5rem"}}>
              Creating sources of income after retirement is essential
              because expenses will still occur. Retirement planning is 
              crucial in securing your financial future. Assess your financial 
              readiness to retire and identify assets and investments for regular
              pay-outs during your retirement.
          </div>
          {/* ngIf: postretlife!='' */}
          {postretlife !='' ? (
          <h4 className="rTitle d-flex align-items-center">
            <img
              alt="Post retirement life "
              className="title-icon"
              src={imagePath + "/static/media/DG/reports/icons/retirement-planning-info-summary-post-retirement-life.svg"}
            />{" "}
            <span>Assumptions</span>
          </h4>
          ):null}
          {postretlife !='' ? (
          <div className="rContent ">
            <p dangerouslySetInnerHTML={{ __html: screenheader_post_ret_life ? screenheader_post_ret_life : "", }}></p>
          </div>
          ):null}
          {postretlife !='' ? (
          <div className="table-responsive rTable">
            <table className="bgStyleTable">
              <tbody>
                <tr>
                  <th>Particulars</th>
                  <th>Self</th>
                </tr>
                <tr>
                  <td>Planned Retirement age</td>
                  <td className="">{retirementAge}</td>
                </tr>
                <tr>
                  <td>Life Expectancy age</td>
                  <td className="">{life_expectancy}</td>
                </tr>
              </tbody>
            </table>
          </div>
          ):null}
          {/* end ngIf: postretlife!='' */}

          {/* ngIf: lifetime_expense!='' */}
          {lifetime_expense !='' ? (
          <h4 className="rTitle d-flex align-items-center mt-5">
            <img className="title-icon" 
            src={imagePath + "/static/media/DG/reports/retirement-planning/expenses-post-retirement.svg"} />
            <span>Expenses Post-Retirement : Lifetime Expenses Post-Retirement</span>
          </h4>
          ):null}
          {lifetime_expense !='' ? (
          <div className="rContent">
            <p
              dangerouslySetInnerHTML={{
                __html: screenheader_lifetime_exp
                  ? screenheader_lifetime_exp
                  : "",
              }}
            ></p>
          </div>
          ):null}
          {lifetime_expense !='' ? (
          <div className="table-responsive rTabl">
            <table className="bgStyleTable">
              <tbody>
                <tr>
                  <th>Expenses type</th>
                  <th>Annual Amount (₹)</th>
                </tr>
                {lifetime_expense.map((item, index) => (
                  <tr key={index}>
                    <td>{item["category_name"]}</td>
                    <td>{rsFilter(parseInt(item["amount"]))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ):null}
          {/* end ngIf: lifetime_expense!='' */}

          {/* ngIf: limited_expense!='' */}
          {limited_expense !='' ? (
            <h4 className="rTitle d-flex align-items-center mt-5">
              <img
                className="title-icon"
                src={imagePath + "/static/media/DG/reports/retirement-planning/limited-term-expenses-post-retirement.svg"}
              />
              <span>Limited Term expenses post-retirement</span>
            </h4>
            ):null}
            {limited_expense !='' ? (
            <div className="rContent">
              <p
                dangerouslySetInnerHTML={{
                  __html: screenheader_limited_exp
                    ? screenheader_limited_exp
                    : "",
                }}
              ></p>
            </div>
            ):null}
            {limited_expense !='' ? (
            <div className="table-responsive rTabl">
              <table className="bgStyleTable">
                <tbody>
                  <tr>
                    <th>Expenses type</th>
                    <th>Annual Amount (₹)</th>
                    <th>Required till age</th>
                  </tr>
                  {limited_expense.map((item, index) => (
                    <tr key={index}>
                      <td>{item["category_name"]}</td>
                      <td>{rsFilter(parseInt(item["amount"]))}</td>
                      <td>{item["till_age"] ?  item["till_age"] : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            ):null}
          {/* end ngIf: limited_expense!='' */}

          {/* ngIf: onetime_expense!='' */}
          {onetime_expense !='' ? (
            <h4 className="rTitle d-flex align-items-center mt-5">
              <img
                className="title-icon"
                src={imagePath + "/static/media/DG/reports/retirement-planning/limited-term-expenses-post-retirement.svg"}
              />
              <span>One-Time expenses post-retirement</span>
            </h4>
            ):null}
            {onetime_expense !='' ? (
            <div className="rContent">
              <p
                dangerouslySetInnerHTML={{
                  __html: screenheader_onetime_exp
                    ? screenheader_onetime_exp
                    : "",
                }}
              ></p>
            </div>
            ):null}
            {onetime_expense !='' ? (
            <div className="table-responsive rTabl">
              <table className="bgStyleTable">
                <tbody>
                  <tr>
                    <th>Expenses type</th>
                    <th>Annual Amount (₹)</th>
                    <th>Required till age</th>
                  </tr>
                  {onetime_expense.map((item, index) => (
                    <tr key={index}>
                      <td>{item["category_name"]}</td>
                      <td>{rsFilter(parseInt(item["amount"]))}</td>
                      <td>{item["till_age"] ?  item["till_age"] : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            ):null}
          {/* end ngIf: onetime_expense!='' */}

          {/* ngIf: income!='' */}
          {income !='' ? (
            <h4 className="rTitle d-flex align-items-center mt-5">
              <img
                className="title-icon"
                src={imagePath + "/static/media/DG/reports/retirement-planning/annual-income-planned-post-retirement.svg"}
              />
              <span>Annual Income Planned For Post-Retirement</span>
            </h4>
            ):null}
            {income !='' ? (
            <div className="rContent">
              <p
                dangerouslySetInnerHTML={{
                  __html: screenheader_annual_income
                    ? screenheader_annual_income
                    : "",
                }}
              ></p>
            </div>
            ):null}
            {income !='' ? (
            <div className="table-responsive rTabl">
              <table className="bgStyleTable">
                <tbody>
                  <tr>
                    <th>Income Type</th>
                    <th>Annual Amount (₹)</th>
                    <th>Expected Increase P.A</th>
                    <th>Required till age</th>
                  </tr>
                  {income.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.category_name === 'Salary & Bonus'
                          ? item.income_type === '1'
                            ? 'Salary'
                            : 'Bonus'
                          : item.category_name}
                      </td>
                      <td>{rsFilter(parseInt(item["amount"]))}</td>
                      <td>{item["income_annual_increase"]}%</td>
                      <td>{item["till_age"] ?  item["till_age"] : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            ):null}
          {/* ngIf: income!='' */}
        </div>
      </div>
      ):
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
export default RetirementInfo;
