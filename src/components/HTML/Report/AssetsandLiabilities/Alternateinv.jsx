import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ADVISORY_ALTERNATE_INVESTMENT_API, imagePath } from "../../../../constants";
import { apiCall, fetchEncryptData, numberFormat } from "../../../../common_utilities";

function Alternateinv(props) {
  const [alternateinvdata, setAlternateinvdata] = useState([]);
  const [alternatescreendata, setAlternatescreendata] = useState("");

  const session = props.session;
  useEffect(() => {
    getalternateInvestmentApi();
  }, []);

  const getalternateInvestmentApi = async () => {
    try {
      var payload = {
        method: "post",
        url: ADVISORY_ALTERNATE_INVESTMENT_API,
        data: { fp_log_id: session["fp_log_id"], user_id: session["id"] },
      };
      var  getalternatedata = await fetchEncryptData(payload);
      if (getalternatedata["error_code"] == "100") {
        setAlternateinvdata(getalternatedata["data"]["assetdata"]);
        setAlternatescreendata(getalternatedata["rp_screendata"]);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <div className="pageHolder currentDebtPolicies ">
        {alternateinvdata && alternateinvdata.length > 0 ? (
          <>
            <h4 className="rTitle" style={{}}>
              <img
                className="title-icon"
                src={imagePath + "/static/media/DG/reports/current-investments/alternate-investment.svg"}
              />
              Your Alternate Investment Summary
            </h4>
            <div className="rContent" style={{}}>
              <p
                dangerouslySetInnerHTML={{
                  __html: alternatescreendata ? alternatescreendata : "",
                }}
              ></p>
            </div>
            <div className="table-responsive rTable" style={{}}>
              {alternateinvdata &&
                alternateinvdata.map((val) => (
                  <div className="recomm-box " style={{}}>
                    <span className="green cardBox ">
                      {val.member_id[0].nameofUser}
                    </span>
                    <div className="table-responsive rTable ">
                      <table className="bgStyleTable">
                        <tbody>
                          <tr>
                            <th>Name of Assets</th>
                            <th>Category</th>
                            <th>Sub - Category</th>
                            <th>Invested Value (₹)</th>
                            <th>Current Value (₹)</th>
                            <th>Absolute Return (%)</th>
                          </tr>
                          {val.member_id &&
                            val.member_id.map((data) => (
                              <tr className="tabledata">
                                <td className="">{data.asset_name}</td>
                                <td className="">{data.category_name}</td>
                                <td className="">{data.subcatname}</td>
                                <td className="">
                                  {numberFormat(data.invested_amount, 0)}
                                </td>
                                <td className="">
                                  {numberFormat(data.current_amount, 0)}
                                </td>
                                <td className="">{data.absolute_return}</td>
                              </tr>
                            ))}

                          <tr className="bold top-line total-value">
                            <td colSpan={3}>Total</td>
                            <td className="">
                              {val.total_invested_amount &&
                                numberFormat(val.total_invested_amount, 0)}
                            </td>
                            <td className="">
                              {val.total_current_amount &&
                                numberFormat(val.total_current_amount, 0)}
                            </td>
                            <td className="">{val.total_absolute_val}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className="no-data-found text-center" style={{}}>
            <div className="container">
              <div className="row justify-content-center align-items-center">
                <div className="col-md-10">
                  <img
                    alt="Data not found"
                    src={imagePath + "/static/media/DG/data-not-found.svg"}
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
                    Complete asset
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
                    onClick={() => props.settab("tab9")}
                  >
                    <FaArrowLeft />
                    <span className="hover-text">&nbsp;Previous</span>
                  </div>

                  <div
                    className="next-btn form-arrow d-flex align-items-center"
                    onClick={() => props.settab("tab11")}
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
  );
}

export default Alternateinv;
