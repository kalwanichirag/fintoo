import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ADVISORY_DEBT_INVESTMENT_API, imagePath } from "../../../../constants";
import { apiCall, fetchEncryptData, indianRupeeFormat, numberFormat, rsFilter, getParentUserId } from "../../../../common_utilities";
import moment from "moment";
import Cookies from "js-cookie";

function Debtinv(props) {
  const [tabCBI, setTabCBI] = useState("tab15");
  const [totalinvestmentamt, setTotalinvestmentamt] = useState(0);
  const [totalcurrentamt, setTotalcurrentamt] = useState(0);
  const [totalmaturityamt, setTotalmaturityamt] = useState(0);
  const [debtdata, setDebtdata] = useState([]);
  const [screenheader, setScreenheader] = useState("");
  const session = props.session;

  const userid = getParentUserId();
  const token = Cookies.get('token');

  const getdebtInvestmentApi = async () => {
    try {
      var payload = {
        url: `${ADVISORY_DEBT_INVESTMENT_API}?user_id=${userid}`,
        method: "GET",
        headers: {
          Authorization: `token ${token}`
        }
      };

      let getdebtdata = await fetchEncryptData(payload);
      if (getdebtdata["status_code"] == 200) {
        setScreenheader(getdebtdata.screen_header1);
        setDebtdata(getdebtdata.data);

        let totalinvsamt = 0;
        let totalcurrentamt = 0;
        let totalmaturityamt = 0;

        getdebtdata.data.forEach((val) => {
          const investment_amt = parseInt(val["invested_amount"]) || 0;
          const current_price = parseInt(val["current_price"]) || 0;
          const maturity_amount =
            val["maturity_amount"] !== "-" ? parseInt(val["maturity_amount"]) : 0;

          totalinvsamt += investment_amt;
          totalcurrentamt += current_price;
          totalmaturityamt += maturity_amount;
        });

        setTotalinvestmentamt(totalinvsamt);
        setTotalcurrentamt(totalcurrentamt);
        setTotalmaturityamt(totalmaturityamt);

      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getdebtInvestmentApi();
  }, []);

  return (
    <div>
      <div className={tabCBI == "tab15" ? "d-block" : "d-none"}>
        <div className="cashflowRecom ">
          {debtdata && debtdata.length > 0 ? (
            <>
              <h4 className="rTitle">
                <img
                  className="title-icon"
                  src={imagePath + "/static/media/DG/reports/current-investments/current-debt-policies.svg"}
                />
                Your Current Debt Investment
              </h4>
              <div className="rContent "><p dangerouslySetInnerHTML={{ __html: screenheader ? screenheader : '' }}></p></div>
              <div class="table-responsive rTable">
                <table class="bgStyleTable">
                  <tbody>
                    <tr>
                      <th>Name of Assets</th>
                      <th>Sub - Category</th>
                      <th>Name of the holder</th>
                      <th>Invested amount (₹)</th>
                      <th>Current value (₹)</th>
                      <th>Maturity date </th>
                      <th>Maturity amount (₹)</th>
                    </tr>
                    {//console.log("debt data: ", debtdata)
                    }
                    {debtdata &&
                      debtdata.map((value) => (
                        <tr>
                          <td>{value.asset_name}</td>
                          <td>{value.invested_product}</td>
                          <td>{value.holderName}</td>
                          <td>{numberFormat(value.invested_amount, 0)}</td>
                          <td>{numberFormat(value.current_price, 0)}</td>
                          <td>
                            {value.maturity_date == "None"
                              ? "-" : value.maturity_date == "N/A" ? " "
                                : moment(value.maturity_date).format("DD/MM/YYYY")}
                          </td>
                          <td>{value.maturity_amount && value.maturity_amount != "" ? numberFormat(value.maturity_amount, 0) : "0"}</td>
                        </tr>
                      ))}

                    <tr class="bold top-line total-value">
                      <td colspan={3}>Total</td>
                      <td>{totalinvestmentamt && numberFormat(totalinvestmentamt, 0)}</td>
                      <td>{totalcurrentamt && numberFormat(totalcurrentamt, 0)}</td>
                      <td></td>
                      <td>{totalmaturityamt && numberFormat(totalmaturityamt, 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div
              className="no-data-found text-center"
              ng-show="isEquityFundFlowEmpty"
            >
              <div className="container">
                <div className="row justify-content-center align-items-center">
                  <div className="col-md-10">
                    <img
                      alt="Data not found"
                      src={imagePath + "/static/media/Images/assets/img/data-not-found.svg"}
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
                      href="/web/datagathering/assets-liabilities"
                      target="_blank"
                      className="link"
                    >
                      Complete Asset
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="row py-2">
            <div className=" text-center">
              <div>
                <div className="btn-container">
                  <div className="d-flex justify-content-center">
                    <div
                      className="previous-btn form-arrow d-flex align-items-center"
                      onClick={() => props.settab("tab8")}
                    >
                      <FaArrowLeft />
                      <span className="hover-text">&nbsp;Previous</span>
                    </div>
                    <div
                      className="next-btn form-arrow d-flex align-items-center"
                      onClick={() => props.settab("tab10")}
                    >
                      <span className="hover-text" style={{ maxWidth: 100 }}>
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

    </div>
  );
}

export default Debtinv;
